import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { useQueryClient, useMutation, useQuery } from 'react-query'
import MsgItem from './MsgItem'
import MsgInput from './MsgInput'
import { QueryKeys, fetcher } from '../queryClient'
import { GET_MESSAGES, CREATE_MESSAGE, UPDATE_MESSAGE, DELETE_MESSAGE } from '../graphql/message'
// import useInfiniteScroll from '../hooks/useInfiniteScroll'


const MsgList = ({ smsgs, users }) => {

    // windows - case issue 대응 / userId 예외처리
    // userId 쿼리 문자열 값에 따라 작성자 다르게 저장
    const client = useQueryClient()
    const { query } = useRouter()
    const userId = query.userId || query.userid || ''

    // 이벤트 감지 목적으로 생성
    const [msgs, setMsgs] = useState(smsgs)
    const [editingId, setEditingId] = useState(null)

    /*
    const [hasNext, setHasNext] = useState(true)
    const fetchMoreEl = useRef(null)
    const intersecting = useInfiniteScroll(fetchMoreEl)
    */

    const { mutate: onCreate } = useMutation(({ text }) => fetcher(CREATE_MESSAGE, { text, userId }), {
        onSuccess: ({ createMessage }) => {
            client.setQueryData(QueryKeys.MESSAGES, old => {
                return {
                    // 값이 변경될 때 마다 ui에 반영
                    messages: [createMessage, ...old.messages],
                }
            })
        },
    })

    const { mutate: onUpdate } = useMutation(({ text, id }) => fetcher(UPDATE_MESSAGE, { text, id, userId }), {
        onSuccess: ({ updateMessage }) => {
            client.setQueryData(QueryKeys.MESSAGES, old => {
                const targetIndex = old.messages.findIndex(msg => msg.id === updateMessage.id)
                if (targetIndex < 0) return old // 아무것도 없을 경우 -1 반환함
                const newMsgs = [...old.messages]
                newMsgs.splice(targetIndex, 1, updateMessage)
                return { messages: newMsgs }
            })
            doneEdit()
        },
    })

    const { mutate: onDelete } = useMutation(id => fetcher(DELETE_MESSAGE, { id, userId }), {
        onSuccess: ({ deleteMessage: deletedId }) => {
            client.setQueryData(QueryKeys.MESSAGES, old => {
                const targetIndex = old.messages.findIndex(msg => msg.id === deletedId)
                if (targetIndex < 0) return old
                const newMsgs = [...old.messages]
                newMsgs.splice(targetIndex, 1)
                return { messages: newMsgs }
            })
        },
    })


    // 입력이 완료 되었을때 알려주는 변수
    const doneEdit = () => setEditingId(null)

    // 리액트에 그래프 큐엘 사용시 쿼리 키가 있어야 한다.
    const { data, error, isError } = useQuery(QueryKeys.MESSAGES, () => fetcher(GET_MESSAGES))

    // 최초 들어올 경우 실행?
    const getMessages = async () => {
        const newMsgs = await queryClient('get', '/messages', { params: { cursor: msgs[msgs.length - 1]?.id || '' } })

        // 1일 때 계속 호출되는 부분 방지하기 위해 설정
        if (newMsgs.length === 0) {
            setHasNext(false)
            return
        }

        // 데이터 ui 출력, 스크롤할 때 마다 뒤에다 붙여짐
        setMsgs(msgs => [...msgs, ...newMsgs])
    }

    useEffect(() => {
        if (!data?.messages) return
        console.log('msgs changed')
        setMsgs(data.messages)
    }, [data?.messages])

    if (isError) {
        console.error(error)
        return null
    }



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
                        user={users.find(x => userId === x.id)}
                    />
                ))}
            </ul>
        </>
    )
}

export default MsgList