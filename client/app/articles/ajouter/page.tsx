'use client'

import { InputGroupTooltip } from '@/components/shadcn/InputGroupToolTip'
import { InputGroupTextareaTooltip } from '@/components/shadcn/InputGroupTextareaToolTip'
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor'
import * as React from 'react'
import { useState } from 'react'
import { toast } from 'sonner'
import ArticleForm from '@/components/forms/ArticleForm'
import { Button } from '@/components/ui/button'
import type { Editor } from '@tiptap/react'

export default function AddArticle() {
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [metaDescription, setMetaDescription] = useState('')
  const editorRef = React.useRef<Editor | null>(null)

  async function handlePublish() {
    if (!editorRef.current) return toast('Éditeur non initialisé')

    const html = editorRef.current.getHTML()
    const json = editorRef.current.getJSON()

    if (!title || !slug || !metaDescription || !html) {
      return toast('Tous les champs sont requis')
    }

    try {
      await ArticleForm({
        //@ts-ignore
        title,
        //@ts-ignore
        slug,
        //@ts-ignore
        metaDescription,
        //@ts-ignore
        content: html, // envoie le HTML
        //@ts-ignore
        images: [],
      })
      toast('Article créé ✅')
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mx-10">
        <h1 className="text-3xl font-bold m-8">Ajouter un article</h1>
        <Button variant="default" aria-label="Submit" onClick={handlePublish}>
          Sauvegarder
        </Button>
      </div>
      <div className="m-8 xl:my-32 xl:mx-30 flex items-center justify-center flex-col gap-4">
        <InputGroupTooltip
          type="text"
          placeholder="Titre de l'article"
          infoToolTip="Choisissez un titre clair et accrocheur pour votre article."
          value={title}
          onChange={(e) => setTitle(e)}
        />
        <InputGroupTooltip
          type="text"
          placeholder="mon-premier-article"
          infoToolTip="Texte utilisé dans l’URL de l’article, il doit être clair et lisible."
          value={slug}
          onChange={(e) => setSlug(e)}
        />
        <InputGroupTextareaTooltip
          placeholder="Un résumé accrocheur de l’article (150–160 caractères)"
          infoToolTip="La description qui apparaît dans les résultats de recherche. Elle doit donner envie de cliquer et résumer le contenu de l’article."
          value={metaDescription}
          onChange={(e) => setMetaDescription(e)}
        />
      </div>

      <div className="flex gap-4 max-w-6xl mx-auto">
        <div className="flex-1 rounded-t-md border-t border-x border-input shadow-xs focus-within:ring-2 focus-within:ring-ring dark:bg-input/30">
          <h1 className="text-xl font-bold m-6">Édition</h1>
          <SimpleEditor editorRef={editorRef} />
        </div>
      </div>
    </div>
  )
}
