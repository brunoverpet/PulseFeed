'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import { TextAlign } from '@tiptap/extension-text-align'
import { TaskItem, TaskList } from '@tiptap/extension-list'
import { Highlight } from '@tiptap/extension-highlight'
import { Image } from '@tiptap/extension-image'
import { Typography } from '@tiptap/extension-typography'
import { Superscript } from '@tiptap/extension-superscript'
import { Subscript } from '@tiptap/extension-subscript'
import { Selection } from '@tiptap/extensions'
import { tuyau } from '@/app/utils/tuyau'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import ShareButton from '@/components/ShareButton'
import getWordCountFromHtml from '@/components/CountWordFromHtml'
import formatPublishedAt from '@/components/FormatDate'
import { MoveLeft } from 'lucide-react'

type ArticleResponse = {
  article: {
    title: string
    slug: string
    content: string
    metaDescription?: string
    publishedAt?: string | null
    status?: 'draft' | 'published' | 'archived'
  }
}

export default function Article({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [article, setArticle] = useState<ArticleResponse['article'] | null>(null)

  useEffect(() => {
    let mounted = true
    async function fetchArticle() {
      setLoading(true)
      try {
        const res = await tuyau.article({ slug }).$get()
        const data = res.data?.article as ArticleResponse['article']
        if (mounted) {
          setArticle(data)
        }
      } catch (err: unknown) {
        console.error(err)
        if (err instanceof Error) toast.error(err.message)
        else toast.error('Une erreur est survenue')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    void fetchArticle()
    return () => {
      mounted = false
    }
  }, [slug])

  const extensions = useMemo(
    () => [
      StarterKit.configure({ horizontalRule: false }),
      HorizontalRule,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Typography,
      Superscript,
      Subscript,
      Selection,
    ],
    []
  )

  const previewEditor = useEditor({
    editable: false,
    extensions,
    content: article?.content ?? '',
    immediatelyRender: false,
  })

  useEffect(() => {
    if (previewEditor && article) previewEditor.commands.setContent(article.content)
  }, [previewEditor, article])

  const wordCount = useMemo(() => getWordCountFromHtml(article?.content), [article])
  const readingTime = Math.max(1, Math.round(wordCount / 200)) // minutes, 200 wpm

  return (
    <div className="max-w-5xl mx-auto mt-16 mb-10 px-4">
      {/* Header */}
      <header className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            aria-label="Retour"
            className="p-2 mt-1"
          >
            <MoveLeft className="h-5 w-5" />
          </Button>

          <div>
            <h1 className="text-3xl font-bold leading-tight">
              {article?.title ?? 'Chargement...'}
            </h1>

            {article?.publishedAt && (
              <p className="text-sm text-muted-foreground mt-1">
                Publié le {formatPublishedAt(article.publishedAt)}
              </p>
            )}

            <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
              <span>{wordCount} mots</span>
              <span>•</span>
              <span>{readingTime} min de lecture</span>
            </div>
          </div>
        </div>

        {/* Bouton Partager */}
        <ShareButton />
      </header>

      {/* Résumé */}
      {article?.metaDescription && (
        <p className="mb-8 text-lg text-muted-foreground leading-relaxed">
          {article.metaDescription}
        </p>
      )}

      {/* Contenu */}
      <article className="prose prose-neutral max-w-none">
        {loading ? (
          <div className="text-muted-foreground">Chargement…</div>
        ) : article ? (
          <EditorContent editor={previewEditor} />
        ) : (
          <div className="text-muted-foreground">Aucun contenu à afficher.</div>
        )}
      </article>
    </div>
  )
}
