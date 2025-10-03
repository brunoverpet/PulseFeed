import Article from '#models/article'
import { CreateArticleType } from '#validators/article'

export class ArticleService {
  async index() {
    return await Article.all()
  }

  async show(id: number) {
    return await Article.findOrFail(id)
  }

  async store(payload: CreateArticleType) {
    return await Article.create(payload)
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
