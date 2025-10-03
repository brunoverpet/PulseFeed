import Article from '#models/article'

export class ArticleService {
  async index() {
    try {
      return await Article.all()
    } catch (e) {
      throw new Error('Aucun article publié.')
    }
  }

  async show(id: number) {
    try {
      return await Article.findOrFail(id)
    } catch (e) {
      throw new Error("L'article n'existe pas.")
    }
  }

  async store(payload: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const newArticle = await Article.create(payload)
      return { success: true, newArticle }
    } catch (err) {
      throw new Error('Impossible de créer l’article : ' + err.message)
    }
  }

  async update(id: number, payload: Partial<Article>) {
    try {
      const article = await Article.findOrFail(id)
      article.merge(payload)
      await article.save()
      return { success: true, article }
    } catch (e) {
      throw new Error("Une erreur s'est produite lors de la mise à jour : " + e.message)
    }
  }

  async destroy(id: number) {
    try {
      const article = await Article.findOrFail(id)
      await article.delete()
      return { success: true, id }
    } catch (e) {
      throw new Error("Impossible de supprimer l'article : " + e.message)
    }
  }

}
