import { FSDriver } from 'flydrive/drivers/fs'
import { Disk } from 'flydrive'

const fsDriver = new FSDriver({
  location: new URL('../public/uploads', import.meta.url),
  visibility: 'public',
  urlBuilder: {
    generateURL: async (key) => {
      return `http://localhost:3333/uploads/${key}`
    },
  },
})

export const disk = new Disk(fsDriver)
