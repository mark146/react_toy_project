import fs from 'fs' // 파일 시스템들이 모여있는 곳
import { resolve } from 'path'

// 현재의 경로가 베이스페스가 잡힘
const basePath = resolve()

const filenames = {
    messages: resolve(basePath, 'src/db/messages.json'),
    users: resolve(basePath, 'src/db/users.json'),
}

export const readDB = target => {
    try {
        // 인코딩 안할 경우 내용이 깨져서 보임
        return JSON.parse(fs.readFileSync(filenames[target], 'utf-8'))
    } catch (err) {
        console.error(err)
    }
}

export const writeDB = (target, data) => {
    try {
        return fs.writeFileSync(filenames[target], JSON.stringify(data))
    } catch (err) {
        console.error(err)
    }
}