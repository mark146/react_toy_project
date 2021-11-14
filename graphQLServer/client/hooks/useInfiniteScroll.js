import { useRef, useState, useEffect, useCallback } from 'react'

const useInfiniteScroll = targetEl => {
    const observerRef = useRef(null)
    const [intersecting, setIntersecting] = useState(false)

    // MsgList 에 있는 useInfiniteScroll 값이 계속 호출될거기 때문에 안전장치 설정
    const getObserver = useCallback(() => {

        // 최초값이 null 일때만 실행
        if(!observerRef.current) {
            // 하나라도 있으면 true 로 지정
            observerRef.current = new IntersectionObserver(entries =>
                setIntersecting(entries.some(entry => entry.isIntersecting)),
            )
        }
        return observerRef.current
    }, [observerRef.current])

    useEffect(() => {
        if (targetEl.current) getObserver().observe(targetEl.current)

        return () => {
            getObserver().disconnect()
        }
    }, [targetEl.current])

    return intersecting
}

export default useInfiniteScroll