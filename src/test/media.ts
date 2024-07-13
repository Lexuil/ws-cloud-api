import 'dotenv/config'
import { getMedia, getMediaUrl, uploadMedia } from 'ws-cloud-api/media'
import fs from 'fs'
import path from 'path'

const blob = new Blob([fs.readFileSync(path.join(__dirname, '/assets/kirby.jpg'))], {
  type: 'image/jpeg'
})

uploadMedia({ media: blob })
  .then((mediaId) => {
    console.log('console media id: ' + mediaId)

    getMediaUrl({ mediaId })
      .then((mediaUrl) => {
        console.log('console media url: ' + mediaUrl)

        getMedia({ mediaUrl })
          .then((blob) => {
            // Save the blob to a file
            blob.arrayBuffer().then((buffer) => {
              fs.writeFileSync(path.join(__dirname, '/assets/kirby2.jpg'), Buffer.from(buffer))
            }).catch(console.error)
          })
          .catch(console.error)
      })
      .catch(console.error)
  })
  .catch(console.error)
