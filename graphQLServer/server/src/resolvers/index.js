import messageResolver from './message.js'
import userResolver from './user.js'

// REST에서 Route로 처리하던걸 리졸버라는 개념으로 GQL 요청 데이터를 나눠서 처리함
export default [messageResolver, userResolver]