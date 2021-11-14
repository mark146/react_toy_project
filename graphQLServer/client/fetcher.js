import axios from "axios";


axios.defaults.baseURL = 'http://localhost:8000'


/*
get: axios.get(url[, config]) // config 기타 설정값
delete: axios.delete(url[, config])

// 데이터 업데이트, 새로써야하기 때문에 새로 변경해야할 데이터 필요
post: axios.post(url, data[, config])
put: axios.put(url, data[, config])
*/
// 인자 1~2개 가 올경우 처리하기 위해 .. 사용?
const fetcher = async (method, url, ...rest) => {
    const res = await axios[method](url, ...rest)
    return res.data
}


export default fetcher