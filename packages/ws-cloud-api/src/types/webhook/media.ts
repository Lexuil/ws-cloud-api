import type { MessageBase } from './messages'

type MediaMessage = ImageMessage | VideoMessage | AudioMessage | DocumentMessage | StickerMessage

// ----------------------
// Image
interface ImageMessage extends MessageBase {
  type: 'image'
  image: ImageMedia
}

interface ImageMedia {
  id: string
  caption: string
  mime_type: string
  sha256: string
}

// ----------------------
// Video
interface VideoMessage extends MessageBase {
  type: 'video'
  video: VideoMedia
}

interface VideoMedia {
  id: string
  caption: string
  filename: string
  sha256: string
  mime_type: string
}

// ----------------------
// Audio
interface AudioMessage extends MessageBase {
  type: 'audio'
  audio: AudioMedia
}

interface AudioMedia {
  id: string
  mime_type: string
  sha256: string
  voice: boolean
}

// ----------------------
// Document
interface DocumentMessage extends MessageBase {
  type: 'document'
  document: DocumentMedia
}

interface DocumentMedia {
  id: string
  caption: string
  filename: string
  sha256: string
  mime_type: string
}

// ----------------------
// Sticker
interface StickerMessage extends MessageBase {
  type: 'sticker'
  sticker: StickerMedia
}

interface StickerMedia {
  id: string
  mime_type: string
  sha256: string
  animated: boolean
}

export {
  type AudioMedia,
  type AudioMessage,
  type DocumentMedia,
  type DocumentMessage,
  type ImageMedia,
  type ImageMessage,
  type MediaMessage,
  type StickerMedia,
  type StickerMessage,
  type VideoMedia,
  type VideoMessage
}
