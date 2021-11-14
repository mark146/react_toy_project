import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import MsgItem from "./MsgItem";
import MsgInput from "./MsgInput";
import fetcher from '../fetcher'
import useInfiniteScroll from '../hooks/useInfiniteScroll'


const MsgList = ({ smsgs, users }) => {

    // windows - case issue 대응 / userId 예외처리
    // userId 쿼리 문자열 값에 따라 작성자 다르게 저장
    const { query } = useRouter()
    const userId = query.userId || query.userid || ''

    // 이벤트 감지 목적으로 생성
    const [msgs, setMsgs] = useState(smsgs)
    const [editingId, setEditingId] = useState(null)
    const [hasNext, setHasNext] = useState(true)
    const fetchMoreEl = useRef(null)
    const intersecting = useInfiniteScroll(fetchMoreEl)

    const onCreate = async text => {
        const newMsg = await fetcher('post', '/messages', { text, userId })
        if (!newMsg) throw Error('something wrong')
        setMsgs(msgs => [newMsg, ...msgs]) // 값이 변경될 때 마다 ui에 반영
    }

    const onUpdate = async (text, id) => {
        const newMsg = await fetcher('put', `/messages/${id}`, { text, userId })
        if (!newMsg) throw Error('something wrong')

        setMsgs(msgs => {
            const targetIndex = msgs.findIndex(msg => msg.id === id)
            if (targetIndex < 0) return msgs // 아무것도 없을 경우 -1 반환함
            const newMsgs = [...msgs]
            newMsgs.splice(targetIndex, 1, newMsg)
            return newMsgs
        })
        doneEdit()
    }

    const onDelete = async id => {
        const receivedId = await fetcher('delete', `/messages/${id}`, { params: { userId } })
        setMsgs(msgs => {
            // 타입이 다를 경우 UI가 변경이 안되서 +"" 추가
            const targetIndex = msgs.findIndex(msg => msg.id === receivedId + '')
            if (targetIndex < 0) return msgs
            const newMsgs = [...msgs]
            newMsgs.splice(targetIndex, 1)
            return newMsgs
        })
    }

    // 입력이 완료 되었을때 알려주는 변수
    const doneEdit = () => setEditingId(null)

    // 최초 들어올 경우 실행?
    const getMessages = async () => {
        const newMsgs = await fetcher('get', '/messages', { params: { cursor: msgs[msgs.length - 1]?.id || '' } })

        // 1일 때 계속 호출되는 부분 방지하기 위해 설정
        if (newMsgs.length === 0) {
            setHasNext(false)
            return
        }

        // 데이터 ui 출력, 스크롤할 때 마다 뒤에다 붙여짐
        setMsgs(msgs => [...msgs, ...newMsgs])
    }

    useEffect(() => {
        if (intersecting && hasNext) getMessages()
    }, [intersecting])



    // 맨밑에 "<div ref={fetchMoreEl} /> " 이값이 나타다면 다음 데이터 불러옴
    return (
        <>
            {userId && <MsgInput mutate={onCreate} />}
            <ul className="messages">
                {msgs.map(x => (
                    <MsgItem
                        key={x.id}
                        {...x}
                        onUpdate={onUpdate}
                        onDelete={() => onDelete(x.id)}
                        startEdit={() => setEditingId(x.id)}
                        isEditing={editingId === x.id}
                        myId={userId}
                        user={users[x.userId]}
                    />
                ))}
            </ul>
            <div ref={fetchMoreEl} />
        </>
    )
}

export default MsgList