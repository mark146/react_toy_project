import { gql } from 'apollo-server-express'

// 태그 탬플릿, 뒤 문자열을 그큐엘로 인식하게끔 해주는 명령어
// 명령어 안에 내용을 자바스크립트 언어로 변경해주는 역할
// ID 는 고유한 값 의미, ! : 반드시 들어가야한다는 의미
// 그큐엘에 13자리까지 정수형 인식 불가 따라서 플롯 설정
const messageSchema = gql`
  type Message {
    id: ID!
    text: String!
    userId: ID!
    timestamp: Float #13자리 숫자
  }
  extend type Query {
    messages: [Message!]! # getMessages
    message(id: ID!): Message! # getMessage
  }
  extend type Mutation { # 변화 일으키는 쿼리 설정
    createMessage(text: String!, userId: ID!): Message!
    updateMessage(id: ID!, text: String!, userId: ID!): Message!
    deleteMessage(id: ID!, userId: ID!): ID!
  }
`

export default messageSchema