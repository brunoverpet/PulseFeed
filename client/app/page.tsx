'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import getWordCountFromHtml from '@/components/CountWordFromHtml'
import formatPublishedAt from '@/components/FormatDate'
import { tuyau } from '@/app/utils/tuyau'
import { toast } from 'sonner'

type ArticleType = 'match' | 'communique' | 'autre'

type Article = {
  id: string
  type?: ArticleType
  title: string
  slug: string
  content?: string
  metaDescription?: string
  publishedAt?: string
}

function stripHtml(html?: string) {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, ' ')
}
function typeLabel(t?: ArticleType) {
  switch (t) {
    case 'match':
      return { text: 'MATCH', color: 'rose-600' }
    case 'communique':
      return { text: 'COMMUNIQUÉ', color: 'slate-800' }
    default:
      return { text: 'ARTICLE', color: 'slate-600' }
  }
}

/* ---------- page ---------- */
export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([])

  useEffect(() => {
    async function fetchArticles() {
      try {
        const res = await tuyau.articles.$get()
        const fetched: Article[] = (res?.data?.articles ?? []).map((a: any) => ({
          id: a.id,
          title: a.title,
          slug: a.slug,
          content: a.content,
          metaDescription: a.metaDescription,
          publishedAt: a.publishedAt,
          type: a.meta?.type ?? a.type ?? 'autre',
        }))

        // trier du plus récent au plus ancien
        const sorted = [...fetched].sort((a, b) => {
          const da = a.publishedAt ? new Date(a.publishedAt).getTime() : 0
          const db = b.publishedAt ? new Date(b.publishedAt).getTime() : 0
          return db - da
        })

        // garder seulement les 3 derniers
        setArticles(sorted.slice(0, 3))
      } catch (error) {
        toast.error('Erreur lors du chargement des articles.')
      }
    }

    void fetchArticles()
  }, [])

  // featured prefers a match first
  const featured = articles.find((a) => a.type === 'match') ?? articles[0] ?? null
  const recent = articles.filter((a) => a.id !== featured?.id).slice(0, 6)
  const totalArticles = articles.length

  const nextMatch = {
    date: '2025-10-18',
    opponent: 'Union FC',
    venue: 'Stade Municipal',
    kickoff: '18:00',
  }

  const standings = [
    { team: 'TonClub', pts: 28 },
    { team: 'Rivière', pts: 25 },
    { team: 'Union FC', pts: 22 },
  ]
  const topScorers = [
    { name: 'Martin', goals: 7 },
    { name: 'Lopez', goals: 5 },
    { name: 'Diaz', goals: 4 },
  ]

  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* HERO: minimal + punch */}
        <header className="mb-6 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-600 text-white font-bold">
              TC
            </div>
            <div>
              <div className="text-xs uppercase text-rose-600 font-semibold">
                Actualités officielles
              </div>
              <h1 className="mt-1 text-2xl font-extrabold text-slate-900">
                TonClub — actus & résumés
              </h1>
            </div>
          </div>

          <p className="text-sm text-slate-600 max-w-2xl">
            Officiel, concis et orienté supporter. Lis la une, check le match à venir, puis scrolle
            les comptes-rendus.
          </p>

          <div className="flex items-center gap-3">
            <Link
              href="/articles"
              className="rounded-md bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-700"
            >
              Voir tous les articles
            </Link>
            <div className="text-sm text-slate-500">Contenu officiel — équipe du club</div>
            <div className="ml-auto text-xs text-slate-500">· {totalArticles} articles</div>
          </div>
        </header>

        {/* MATCH ANNOUNCEMENT: big visual, unique style (no plain card) */}
        <section className="mb-6">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-rose-50 to-white p-6 shadow-md ring-1 ring-rose-100">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-rose-600/5 px-3 py-1 text-xs font-semibold text-rose-600">
                    PROCHAIN MATCH
                  </span>
                  <span className="text-xs text-slate-500">
                    {new Date(nextMatch.date).toLocaleDateString('fr-FR')}
                  </span>
                </div>

                <div className="mt-3 flex items-baseline gap-4">
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    TON CLUB <span className="text-rose-600">vs</span> {nextMatch.opponent}
                  </h2>
                  <div className="text-sm text-slate-600">Coup d'envoi {nextMatch.kickoff}</div>
                </div>

                <p className="mt-2 text-sm text-slate-700 max-w-xl">
                  Match crucial — rassemblement supporters au parvis, chants autorisés. On publie le
                  résumé officiel dès la fin.
                </p>

                <div className="mt-4 flex flex-col gap-2">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="h-2 w-2 shrink-0 rounded-full bg-rose-600" />
                    <div className="text-slate-700">Ouverture des portes : 16:30</div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="h-2 w-2 shrink-0 rounded-full bg-slate-800" />
                    <div className="text-slate-700">Zone supporters : Tribune Nord</div>
                  </div>
                </div>
              </div>

              {/* CTA vertical group (distinct visual language) */}
              <div className="mt-4 flex flex-col items-end gap-3 sm:mt-0">
                {featured && featured.type === 'match' ? (
                  <Link
                    href={`/articles/${featured.slug}`}
                    className="rounded-md bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-rose-700"
                  >
                    Lire la préparation →
                  </Link>
                ) : (
                  <Link
                    href="/articles"
                    className="rounded-md bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-rose-700"
                  >
                    Voir actus match
                  </Link>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => alert('Mock : infos match (pas de billetterie)')}
                >
                  Infos pratiques
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED: left-accent + optional cover (break the regular block look) */}
        {featured && (
          <section className="mb-6">
            <article className="relative overflow-hidden rounded-2xl bg-white p-6 shadow">
              <div className="absolute left-0 top-0 h-full w-1 bg-rose-600/80" aria-hidden />
              <div className="ml-4">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-rose-600/10 px-3 py-1 text-xs font-semibold text-rose-700">
                    {typeLabel(featured.type).text}
                  </span>
                  <div className="text-xs text-slate-500">
                    {formatPublishedAt(featured.publishedAt)}
                  </div>
                </div>

                <h3 className="mt-3 text-xl font-extrabold text-slate-900">{featured.title}</h3>

                <p className="mt-3 text-sm text-slate-700">
                  {featured.metaDescription ?? stripHtml(featured.content).slice(0, 220)}
                </p>

                <div className="mt-4 flex items-center gap-3">
                  <div className="text-xs text-slate-600">
                    {Math.max(
                      1,
                      Math.round(
                        getWordCountFromHtml(featured.content ?? featured.metaDescription) / 200
                      )
                    )}{' '}
                    min
                  </div>
                  <Link
                    href={`/articles/${featured.slug}`}
                    className="ml-auto text-sm font-semibold text-rose-600 hover:underline"
                  >
                    Lire la UNE →
                  </Link>
                </div>
              </div>
            </article>
          </section>
        )}

        {/* RECENT: timeline style (vertical line + items styled by type) */}
        <section className="mb-6">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Publications récentes</h4>

          <div className="relative pl-6">
            {/* vertical line */}
            <div className="absolute left-2 top-2 bottom-2 w-px bg-slate-200" aria-hidden />

            <div className="space-y-6">
              {recent.map((article) => {
                const readingTime = Math.max(
                  1,
                  Math.round(getWordCountFromHtml(article.content ?? article.metaDescription) / 200)
                )
                const t = typeLabel(article.type)
                return (
                  <div key={article.id} className="relative flex gap-4">
                    {/* dot */}
                    <div
                      className={`z-10 mt-1 h-3 w-3 shrink-0 rounded-full bg-${t.color} `}
                      style={{ backgroundColor: t.color === 'rose-600' ? undefined : undefined }}
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs font-semibold ${article.type === 'match' ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-700'}`}
                            >
                              {typeLabel(article.type).text}
                            </span>
                            <h5 className="ml-2 text-base font-semibold text-slate-900">
                              {article.title}
                            </h5>
                          </div>

                          <div className="mt-1 text-xs text-slate-500">
                            {formatPublishedAt(article.publishedAt)} • {readingTime} min
                          </div>
                        </div>

                        <Link
                          href={`/articles/${article.slug}`}
                          className="text-sm font-medium text-rose-600 hover:underline"
                        >
                          Lire →
                        </Link>
                      </div>

                      {article.metaDescription && (
                        <p className="mt-3 text-sm text-slate-700">{article.metaDescription}</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* EXTRA INFO: split visual treatment (compact lists, not blocks) */}
        <section className="mb-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h5 className="text-sm font-semibold text-slate-800">Classement — aperçu</h5>
              <div className="text-xs text-slate-500">Top 3</div>
            </div>

            <ol className="mt-3 divide-y divide-slate-100 text-sm">
              {standings.map((s, i) => (
                <li key={s.team} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-6 flex-shrink-0 rounded-full bg-rose-600/10 flex items-center justify-center text-xs font-semibold text-rose-700">
                      {i + 1}
                    </div>
                    <div>{s.team}</div>
                  </div>
                  <div className="font-medium text-slate-800">{s.pts} pts</div>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-lg bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h5 className="text-sm font-semibold text-slate-800">Meilleurs buteurs</h5>
              <div className="text-xs text-slate-500">Saison</div>
            </div>

            <ul className="mt-3 space-y-2 text-sm">
              {topScorers.map((p, i) => (
                <li key={p.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-6 text-xs font-semibold text-slate-600">{i + 1}</div>
                    <div>{p.name}</div>
                  </div>
                  <div className="font-medium">{p.goals}</div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* FOOTER: newsletter minimal */}
        <footer className="mt-12 border-t border-slate-200 pt-6">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="text-center sm:text-left">
                <p className="text-sm font-semibold text-slate-800">Reste connecté au club</p>
                <p className="text-xs text-slate-500">
                  Infos match & annonces officielles — newsletter.
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  alert('Merci — mock. Branche ton endpoint pour rendre réel.')
                }}
                className="flex w-full max-w-md items-center gap-2"
              >
                <Input placeholder="Ton email" aria-label="email" />
                <Button type="submit" size="sm">
                  S'inscrire
                </Button>
              </form>
            </div>

            <div className="text-center text-sm text-slate-500">
              <p>
                © {new Date().getFullYear()} TonClub — Contenu officiel. Besoin d’aide ? Contacte
                l’équipe.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </main>
  )
}
