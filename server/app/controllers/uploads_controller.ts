import { inject } from '@adonisjs/core'
import { FlyDriveService } from '#services/fly_drive_service'
import { HttpContext } from '@adonisjs/core/http'
import fs from 'node:fs/promises'

@inject()
export default class UploadsController {
  constructor(private flyDrive: FlyDriveService) {}

  async upload({ request, response }: HttpContext) {
    const file = request.file('file')
    if (!file) return response.badRequest({ message: "L'image est requise." })

    if (!file.tmpPath) {
      return response.badRequest({ message: 'File path missing' })
    }
    const buffer = await fs.readFile(file.tmpPath)
    const url = await this.flyDrive.uploadFile(file.clientName, buffer)
    console.log(url)

    if (!url) {
      return response.badRequest({
        message: 'Message erreur',
      })
    }

    return response.ok({ success: true, url })
  }
}
