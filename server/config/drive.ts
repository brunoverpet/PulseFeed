import { FSDriver } from 'flydrive/drivers/fs'
import { Disk } from 'flydrive'

const fsDriver = new FSDriver({
  location: new URL('./uploads', import.meta.url),
  visibility: 'public',
})

export const disk = new Disk(fsDriver)
