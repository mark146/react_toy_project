import { useRef } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Hydrate } from 'react-query/hydration'
import './index.scss'

// 리액트가 서버사이드 랜더링을 하기 위해 필요한 함수
// 페이지가 전환될 때 마다 호출
const App = ({ Component, pageProps }) => {
    const clientRef = useRef(null)
    const getClient = () => {
        if (!clientRef.current)
            clientRef.current = new QueryClient({
                defaultOptions: {
                    queries: {
                        refetchOnWindowFocus: false,
                    },
                },
            })
        return clientRef.current
    }

    return (
        <QueryClientProvider client={getClient()}>
            <Hydrate state={pageProps.dehydratedState}>
                <Component {...pageProps} />
            </Hydrate>
        </QueryClientProvider>
    )
}

App.getInitialProps = async ({ ctx, Component }) => {
    const pageProps = await Component.getInitialProps?.(ctx)
    return { pageProps }
}

export default App
