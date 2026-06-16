import fs from 'node:fs'
import path from 'node:path'
import logger from 'pino'
import { WsApi } from 'ws-cloud-api'

const assetsDir = path.join(import.meta.dirname, 'assets')
const blob = new Blob([fs.readFileSync(path.join(assetsDir, 'kirby.jpg'))], { type: 'image/jpeg' })

const customLogger = logger()

const wsApi = new WsApi({
  logger: {
    debug: customLogger.debug.bind(customLogger),
    error: customLogger.error.bind(customLogger),
    info: customLogger.info.bind(customLogger),
    log: customLogger.info.bind(customLogger),
    warn: customLogger.warn.bind(customLogger)
  }
})

try {
  const upload = await wsApi.uploadMedia({ media: blob })
  if (upload.isErr()) {
    throw upload.error
  }
  const { mediaId } = upload.value
  console.log('mediaId:', mediaId)

  const urlResult = await wsApi.getMediaUrl({ mediaId })
  if (urlResult.isErr()) {
    throw urlResult.error
  }
  const { mediaUrl } = urlResult.value
  console.log('mediaUrl:', mediaUrl)

  const blobResult = await wsApi.getMedia({ mediaUrl })
  if (blobResult.isErr()) {
    throw blobResult.error
  }

  const buffer = Buffer.from(await blobResult.value.arrayBuffer())
  fs.writeFileSync(path.join(assetsDir, 'kirby2.jpg'), buffer)
  console.log('Saved kirby2.jpg')
} catch (error) {
  console.error(error)
  process.exit(1)
}
