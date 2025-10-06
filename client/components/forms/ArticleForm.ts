import { tuyau } from '@/app/utils/tuyau'
import { InferRequestType } from '@tuyau/client'

type ArticleFormProps = InferRequestType<typeof tuyau.articles.$post>

export default async function ArticleForm({
  title,
  slug,
  metaDescription,
  content,
  images,
}: ArticleFormProps) {
  return await tuyau.articles.$post({ title, slug, metaDescription, content, images })
}
