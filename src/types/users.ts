export interface Users {
  id: string
  username: string
  image: {
    webp: string
    png: string
  }
  type: 'user'
  comments: string[]
}
