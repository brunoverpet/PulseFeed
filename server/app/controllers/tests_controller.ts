import type { HttpContext } from '@adonisjs/core/http'

export default class TestsController {
  async index({ response }: HttpContext) {
    return response.ok({
      hello: 'Bruno' as const,
    })
  }
}
