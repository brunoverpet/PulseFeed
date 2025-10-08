import { disk } from '#config/drive'
import { randomUUID } from 'node:crypto'
import { slugify } from '@justrelate/slugify'

export class FlyDriveService {
  async getPublicUrl(key: string) {
    const file = await this.checkIfFileExists(key)
    if (!file) return false
    return await disk.getUrl(key)
  }

  async checkIfFileExists(key: string) {
    return await disk.exists(key)
  }

  async uploadFile(key: string, content: string | Buffer) {
    const safeKey = this.normalizeName(key)
    await disk.put(safeKey, content)
    return await this.getPublicUrl(safeKey)
  }

  async deleteFile(key: string) {
    await disk.delete(key)
  }

  normalizeName(name: string) {
    return `${slugify(name)}-${randomUUID()}`
  }
}
