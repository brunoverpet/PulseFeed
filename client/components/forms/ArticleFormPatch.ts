// ArticleFormPatch.ts
import { tuyau } from '@/app/utils/tuyau'
import { toast } from 'sonner'

type ArticleFormProps = {
  id: string
  title?: string
  slug?: string
  metaDescription?: string
  content?: string
  status?: string
  initialArticle?: {
    title: string
    slug: string
    metaDescription?: string
    content: string
  }
}

export default async function ArticleFormPatch({
  id,
  title,
  slug,
  metaDescription,
  content,
  status,
  initialArticle,
}: ArticleFormProps) {
  const updates: Record<string, any> = {}

  if (!initialArticle) {
    toast.error('Données initiales manquantes pour comparaison.')
    throw new Error("Pas d'initialArticle fourni.")
  }

  console.log('Initial article:', initialArticle)

  if (title !== initialArticle.title) updates.title = title
  if (slug !== initialArticle.slug) updates.slug = slug
  if (metaDescription !== (initialArticle.metaDescription ?? ''))
    updates.metaDescription = metaDescription
  if (content !== initialArticle.content) updates.content = content

  // Le status on l’envoie toujours
  updates.status = status

  const response = await tuyau.articles({ id }).$patch(updates)

  if (response.error || response.status >= 400) {
    if (Array.isArray(response.error?.value)) {
      response.error.value.forEach((err: { field: string; message: string }) => {
        toast.error(`${err.field}: ${err.message}`)
      })
      throw new Error(response.error.value.map((e) => `${e.field}: ${e.message}`).join('\n'))
    } else if (typeof response.error?.value === 'string') {
      toast.error(response.error.value)
      throw new Error(response.error.value)
    } else {
      const msg = JSON.stringify(response.error?.value || 'Erreur inconnue')
      toast.error(msg)
      throw new Error(msg)
    }
  }

  return response.data
}
