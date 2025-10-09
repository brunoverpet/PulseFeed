import Article from '#models/article'
import { CreateArticleType } from '#validators/article'
import { FlyDriveService } from '#services/fly_drive_service'
import { inject } from '@adonisjs/core'

@inject()
export class ArticleService {
  constructor(private flyDriveSerivce: FlyDriveService) {}

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

    const dataToUpdate = {
      ...payload,
      publishedAt:
        payload.status === 'published'
          ? new Date().toISOString()
          : payload.status === 'draft'
            ? null
            : article.publishedAt,
    }

    article.merge(dataToUpdate)
    await article.save()
    return article
  }

  async destroy(id: number) {
    const article = await Article.findOrFail(id)
    const imageUrls = this.extractImageUrls(article.content)
    for (const imageUrl of imageUrls) {
      const url = new URL(imageUrl)
      const key = url.pathname.replace('/uploads/', '')
      await this.flyDriveSerivce.deleteFile(key)
    }
    return await article.delete()
  }

  private extractImageUrls(html: string): string[] {
    const urls: string[] = []
    const regex = /<img[^>]+src="([^">]+)"/g
    let match
    while ((match = regex.exec(html)) !== null) {
      urls.push(match[1])
    }
    return urls
  }
}
