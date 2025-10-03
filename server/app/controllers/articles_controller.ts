import { inject } from '@adonisjs/core'
import { ArticleService } from '#services/article_service'
import { HttpContext } from '@adonisjs/core/http'
import { createArticleValidator, updateArticleValidator } from '#validators/article'

@inject()
export default class ArticlesController {
  constructor(private articleService: ArticleService) {}

  async index({ response }: HttpContext) {
    const articles = await this.articleService.index()
    return response.ok({ success: true, articles })
  }

  async show({ params, response }: HttpContext) {
    try {
      const article = await this.articleService.show(params.id)
      return response.ok({ success: true, article })
    } catch (e) {
      return response.notFound({
        success: false,
        message: "L'article n'existe pas.",
      })
    }
  }

  async create({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(createArticleValidator)
      const article = await this.articleService.store(payload)
      return response.created({ success: true, article, message: "L'article a bien été créé." })
    } catch (e) {
      return response.badRequest({
        success: false,
        message: "Une erreur s'est produite lors de la création de l'article.",
      })
    }
  }

  async update({ params, request, response }: HttpContext) {
    try {
      const articleId = params.id
      const payload = await request.validateUsing(updateArticleValidator)
      const article = await this.articleService.update(articleId, payload)
      return response.ok({ success: true, article, message: "L'article a bien été mis à jour." })
    } catch (e) {
      return response.badRequest({
        success: false,
        message: "Une erreur s'est produite lors de la mise à jour de l'article.",
      })
    }
  }

  async destroy({ params, response }: HttpContext) {
    try {
      const articleId = params.id

      await this.articleService.destroy(articleId)
      return response.ok({ success: true, message: "L'article a bien été supprimé." })
    } catch (e) {
      return response.badRequest({
        success: false,
        message: "Une erreur s'est produite lors de la suppression de l'article.",
      })
    }
  }
}
