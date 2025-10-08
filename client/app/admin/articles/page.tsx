'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { EllipsisVertical, MoveRight, Pencil, Plus, Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import getWordCountFromHtml from '@/components/CountWordFromHtml'
import { tuyau } from '@/app/utils/tuyau'
import { useEffect, useState } from 'react'

export default function AdminArticles() {
  const [articles, setArticles] = useState<any[]>([])

  useEffect(() => {
    async function fetchArticles() {
      const res = await tuyau.articles.$get()
      setArticles(res.data?.articles ?? [])
    }
    void fetchArticles()
  }, [])

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Articles</h1>
        <Link href="/admin/articles/ajouter">
          <Button className="font-medium">
            <Plus /> Ajouter un article
          </Button>
        </Link>
      </div>

      {articles && articles.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => {
            const wordCount = getWordCountFromHtml(article.content)
            const readingTime = Math.max(1, Math.round(wordCount / 200))

            return (
              <div
                key={article.id}
                className="group relative flex flex-col justify-between rounded-lg border border-border bg-card p-6 shadow-sm"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col">
                      <h2 className="text-lg font-semibold text-foreground line-clamp-2">
                        {article.title.length > 60
                          ? `${article.title.slice(0, 60)}…`
                          : article.title}
                      </h2>
                      <span className="text-xs text-muted-foreground mt-1">
                        {readingTime} min de lecture
                      </span>
                    </div>

                    {/* Menu 3 points */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <EllipsisVertical />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/articles/modifier/${article.slug}`}>
                            <Pencil />
                            Modifier
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            // TODO: fonction de suppression (confirmation + appel API)
                            console.log('Supprimer', article.id)
                          }}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash className="text-destructive focus:text-destructive" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {article.metaDescription && (
                    <p className="text-sm text-muted-foreground leading-snug">
                      {article.metaDescription.length > 160
                        ? `${article.metaDescription.slice(0, 160)}…`
                        : article.metaDescription}
                    </p>
                  )}
                </div>

                <Link href={`/admin/articles/${article.slug}`} className="mt-4">
                  <Button variant="outline" size="sm" className="w-full transition-all">
                    Voir l’article <MoveRight />
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
            Les publications apparaîtront ici dès qu’un article sera ajouté.
          </p>
        </div>
      )}
    </div>
  )
}
