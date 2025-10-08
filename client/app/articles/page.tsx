import { tuyau } from '@/app/utils/tuyau'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import getWordCountFromHtml from '@/components/CountWordFromHtml'
import formatPublishedAt from '@/components/FormatDate'

export default async function Articles() {
  const articles = await tuyau.articles.$get()

  console.log(articles)
  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Articles</h1>

      {articles.data && articles.data.articles.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.data.articles.map((article) => {
            const wordCount = getWordCountFromHtml(article.content)
            const readingTime = Math.max(1, Math.round(wordCount / 200))

            return (
              <div
                key={article.id}
                className="group relative flex flex-col justify-between rounded-lg border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-foreground line-clamp-2">
                      {article.title.length > 60 ? `${article.title.slice(0, 60)}…` : article.title}
                    </h2>

                    {article.publishedAt && (
                      <Badge variant="secondary" className="text-xs whitespace-nowrap">
                        {formatPublishedAt(article.publishedAt)}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center mb-2 flex-wrap">
                    <span className="text-xs text-muted-foreground">
                      {readingTime} min de lecture
                    </span>
                  </div>

                  {article.metaDescription && (
                    <p className="text-foreground leading-snug">
                      {article.metaDescription.length > 160
                        ? `${article.metaDescription.slice(0, 160)}…`
                        : article.metaDescription}
                    </p>
                  )}
                </div>

                <Link href={`/articles/${article.slug}`} className="mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full transition-all group-hover:scale-105 cursor-pointer"
                  >
                    Lire l’article →
                  </Button>
                </Link>

                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            )
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mt-20 text-center text-muted-foreground">
          <h2 className="text-xl font-semibold mb-2">Aucun article pour le moment</h2>
          <p className="max-w-md">
            Les publications apparaîtront ici dès qu’un article sera ajouté. En attendant,
            préparez-vous à découvrir les prochaines actualités du FC Blabla !
          </p>
        </div>
      )}
    </div>
  )
}
