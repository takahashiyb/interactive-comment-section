export interface Comments {
  id: string
  index: number
  content: string
  createdAt: string // not createdAt
  score: number
  type: 'comment' | 'reply'
  user_id: string
  parent_comment: null | string
}
