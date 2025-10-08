import Article from '#models/article'
import { CreateArticleType } from '#validators/article'

export class ArticleService {
  async index() {
    return await Article.all()
  }

  async show(slug: string) {
    return await Article.query().where('slug', slug).firstOrFail()
  }

  // TODO : Dépend de la logique du controller
  // async show(id: number) {
  //   return await Article.findOrFail(id)
  // }

  async store(payload: CreateArticleType) {
    const dataToSave = {
      ...payload,
      published_at: payload.status === 'published' ? new Date().toISOString() : null,
    }

    return await Article.create(dataToSave)
  }

  async update(id: number, payload: Partial<Article>) {
    const article = await Article.findOrFail(id)
    article.merge(payload)
    await article.save()
    return article
  }

  async destroy(id: number) {
    const article = await Article.findOrFail(id)
    return await article.delete()
  }
}
