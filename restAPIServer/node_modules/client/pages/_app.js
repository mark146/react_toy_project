import './index.scss'

// 리액트가 서버사이드 랜더링을 하기 위해 필요한 함수
const App = ({ Component, pageProps }) => <Component {...pageProps} />

App.getInitialProps = async ({ context, Component }) => {
    const pageProps = await Component.getInitialProps?.(context)
    return { pageProps }
}

export default App