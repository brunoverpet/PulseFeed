import { tuyau } from '@/app/utils/tuyau'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function Articles() {
  const articles = await tuyau.articles.$get()
  const slug = 'slug-article-2'
  const article = await tuyau.articles({ slug }).$get()

  // console.log(articles)
  console.log(article)
  return (
    <div className="mx-auto p-4">
      <h1 className="text-2xl mb-4">Articles</h1>
      {articles.data.articles.map((article) => (
        <div key={article.id} className="flex flex-col gap-2">
          <h2>{article.title}</h2>
          <p>{article.metaDescription}</p>
          <Link href={`/articles/${article.slug}`}>
            <Button>Voir l'article</Button>
          </Link>
        </div>
      ))}
    </div>
  )
}
