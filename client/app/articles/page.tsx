import { tuyau } from '@/app/utils/tuyau'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function Articles() {
  const articles = await tuyau.articles.$get()

  return (
    <div className="mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Articles</h1>

      {articles.data && articles.data.articles.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.data.articles.map((article) => (
            <div
              key={article.id}
              className="group relative flex flex-col justify-between rounded-lg border border-border bg-card p-4 shadow-sm transition-all hover:shadow-md"
            >
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-2">{article.title}</h2>
                <p className="text-sm text-muted-foreground leading-snug line-clamp-3">
                  {article.metaDescription}
                </p>
              </div>

              <Link href={`/articles/${article.slug}`} className="mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full transition-all cursor-pointer"
                >
                  Lire l’article →
                </Button>
              </Link>

              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
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
