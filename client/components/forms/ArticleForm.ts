import { tuyau } from '@/app/utils/tuyau'
import { InferRequestType } from '@tuyau/client'
import { toast } from 'sonner'

type ArticleFormProps = InferRequestType<typeof tuyau.articles.$post>

export default async function ArticleForm({
  title,
  slug,
  metaDescription,
  content,
  images,
}: ArticleFormProps) {
  const response = await tuyau.articles.$post({ title, slug, metaDescription, content, images })

  if (response.error || response.status >= 400) {
    if (Array.isArray(response.error?.value)) {
      // Plusieurs messages de validation
      response.error.value.forEach((err: { field: string; message: string }) => {
        toast.error(`${err.field}: ${err.message}`)
      })
      // Relance l'erreur avec un string concaténé
      throw new Error(response.error.value.map((e) => `${e.field}: ${e.message}`).join('\n'))
    } else if (typeof response.error?.value === 'string') {
      toast.error(response.error.value)
      throw new Error(response.error.value)
    } else {
      // Cas fallback pour objet ou undefined
      const msg = JSON.stringify(response.error?.value || 'Erreur inconnue')
      toast.error(msg)
      throw new Error(msg)
    }
  }

  return response.data
}
