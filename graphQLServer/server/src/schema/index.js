import { gql } from 'apollo-server-express'
import messageSchema from './message.js'
import userSchema from './user.js'

// 기본으로 주는 정보
// 인터페이스 같은 느낌
const linkSchema = gql`
  type Query {
    _: Boolean
  }
  type Mutation {
    _: Boolean
  }
`

export default [linkSchema, messageSchema, userSchema]