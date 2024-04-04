export interface Button {
  title: string
  id: string
}

export interface ReplyButton {
  type: 'reply'
  reply: Button
}
