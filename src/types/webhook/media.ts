import { type MessageBase } from './messages'

export type MediaMessage = ImageMessage | VideoMessage | AudioMessage | DocumentMessage | StickerMessage

// ----------------------
// Image
export interface ImageMessage extends MessageBase {
  type: 'image'
  image: ImageMedia
}

export interface ImageMedia {
  id: string
  caption: string
  mime_type: string
  sha256: string
}

// ----------------------
// Video
export interface VideoMessage extends MessageBase {
  type: 'video'
  video: VideoMedia
}

export interface VideoMedia {
  id: string
  caption: string
  filename: string
  sha256: string
  mime_type: string
}

// ----------------------
// Audio
export interface AudioMessage extends MessageBase {
  type: 'audio'
  audio: AudioMedia
}

export interface AudioMedia {
  id: string
  mime_type: string
  sha256: string
  voice: boolean
}

// ----------------------
// Document
export interface DocumentMessage extends MessageBase {
  type: 'document'
  document: DocumentMedia
}

export interface DocumentMedia {
  id: string
  caption: string
  filename: string
  sha256: string
  mime_type: string
}

// ----------------------
// Sticker
export interface StickerMessage extends MessageBase {
  type: 'sticker'
  sticker: StickerMedia
}

export interface StickerMedia {
  id: string
  mime_type: string
  sha256: string
  animated: boolean
}
