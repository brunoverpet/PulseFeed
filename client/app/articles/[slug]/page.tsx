'use client'

import React, { useEffect, useState } from 'react'
import { StarterKit } from '@tiptap/starter-kit'
import { TextAlign } from '@tiptap/extension-text-align'
import { TaskItem, TaskList } from '@tiptap/extension-list'
import { Highlight } from '@tiptap/extension-highlight'
import { Image } from '@tiptap/extension-image'
import { Typography } from '@tiptap/extension-typography'
import { Superscript } from '@tiptap/extension-superscript'
import { Subscript } from '@tiptap/extension-subscript'
import { Selection } from '@tiptap/extensions'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import { EditorContent, useEditor } from '@tiptap/react'
import { tuyau } from '@/app/utils/tuyau'
import { toast } from 'sonner'

export default function Article({ params }: { params: Promise<{ slug: string }> }) {
  const [article, setArticle] = useState<{ data: any; json: any; html: string } | null>(null)
  const { slug } = React.use(params)
  const [art, setArt] = useState<any>(null)

  useEffect(() => {
    async function fetchArticle() {
      try {
        const article = await tuyau.articles({ slug }).$get()
        setArticle({ data: article.data.article, html: article.data.article.content, json: null })
      } catch (error) {
        toast.error(error.message as string)
      }
    }

    fetchArticle()
  }, [slug])

  console.log(article)

  const extensions = [
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
  ]

  const previewEditor = useEditor({
    editable: false,
    immediatelyRender: false,
    extensions,
    content: article?.html || '',
  })

  useEffect(() => {
    if (previewEditor && article) {
      previewEditor.commands.setContent(article.html)
    }
  }, [article, previewEditor])

  return (
    <div className="max-w-4xl mx-auto my-10 p-6 rounded-md border border-input shadow-sm bg-background">
      {/* Titre */}
      <header className="mb-6">
        <span className="text-sm text-muted-foreground uppercase tracking-wide">
          Titre de l'article
        </span>
        <h1 className="text-4xl md:text-5xl font-bold mt-1">{article?.data.title}</h1>
      </header>

      {/* Résumé */}
      {article?.data.metaDescription && (
        <section className="mb-6">
          <span className="text-sm text-muted-foreground uppercase tracking-wide">Résumé</span>
          <p className="mt-1 text-base leading-relaxed">{article?.data.metaDescription}</p>
        </section>
      )}

      {/* Contenu */}
      {article ? (
        <section className="mb-6">
          <span className="text-sm text-muted-foreground uppercase tracking-wide">Contenu</span>
          <div className="mt-2 prose prose-sm sm:prose lg:prose-lg">
            <EditorContent editor={previewEditor} className="prose prose-neutral max-w-none" />
          </div>
        </section>
      ) : (
        <p className="text-muted-foreground">Aucun contenu pour le moment...</p>
      )}
    </div>
  )
}
