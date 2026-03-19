import { type } from 'arktype'

const mimeTypeSchema = type(
  '"audio/aac" | "audio/amr" | "audio/mpeg" | "audio/mp4" | "audio/ogg" | "text/plain" | "application/pdf" | "application/vnd.ms-excel" | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" | "application/msword" | "application/vnd.openxmlformats-officedocument.wordprocessingml.document" | "application/vnd.ms-powerpoint" | "application/vnd.openxmlformats-officedocument.presentationml.presentation" | "image/jpeg" | "image/png" | "image/webp" | "video/3gpp" | "video/mp4"'
)

type mimeType = typeof mimeTypeSchema.infer

const mediaTypeSchema = type('"image" | "video" | "audio" | "document"')

type mediaType = typeof mediaTypeSchema.infer

export { type mimeType, mimeTypeSchema, type mediaType, mediaTypeSchema }
