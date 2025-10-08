'use client'

import { InputGroupTooltip } from '@/components/shadcn/InputGroupToolTip'
import { InputGroupTextareaTooltip } from '@/components/shadcn/InputGroupTextareaToolTip'
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor'
import * as React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Editor } from '@tiptap/react'
import { useRouter } from 'next/navigation'
import ArticleForm from '@/components/forms/ArticleForm'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { tuyau } from '@/app/utils/tuyau'
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

export default function EditArticle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params)
  const [title, setTitle] = useState('')
  const [slugInput, setSlugInput] = useState('')
  const [metaDescription, setMetaDescription] = useState('')
  const [article, setArticle] = useState<ArticleResponse['article'] | null>(null)
  const [loading, setLoading] = useState(true)
  const editorRef = React.useRef<Editor | null>(null)
  const router = useRouter()

  useEffect(() => {
    let mounted = true
    async function fetchArticle() {
      setLoading(true)
      try {
        const res = await tuyau.article({ slug }).$get()
        const data = res.data?.article as ArticleResponse['article']
        if (mounted && data) {
          setArticle(data)
          setTitle(data.title)
          setSlugInput(data.slug)
          setMetaDescription(data.metaDescription ?? '')
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

  async function handleUpdatePublish(status: 'draft' | 'published' = 'draft') {
    if (!editorRef.current) return toast('Éditeur non initialisé')

    const html = editorRef.current.getHTML()

    if (!title || !slugInput || !metaDescription || !html) {
      return toast('Tous les champs sont requis')
    }

    try {
      const updatedArticle = await ArticleForm({
        //@ts-ignore
        title,
        //@ts-ignore
        slug: slugInput,
        //@ts-ignore
        metaDescription,
        //@ts-ignore
        content: html,
        //@ts-ignore
        status,
      })
      toast.success('Article mis à jour ✅', {
        closeButton: true,
        duration: 5000,
        position: 'top-right',
        style: { background: '#e6f7f1', color: '#2a8764' },
      })

      router.push(`/articles/${updatedArticle.article.slug}`)
    } catch (e: unknown) {
      if (e instanceof Error) toast.error(e.message)
      else toast.error('Une erreur est survenue')
    }
  }

  if (loading) return <div className="p-8 text-muted-foreground">Chargement de l’article…</div>

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header sticky */}
      <div className="sticky top-0 z-50 bg-background border-b border-border py-4 px-8 flex justify-between items-center shadow-sm">
        <h1 className="text-2xl font-semibold">Modifier un article</h1>
        <div className="flex gap-3">
          {/* Annuler */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" aria-label="Cancel">
                Annuler
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Annuler les modifications ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Les modifications non enregistrées seront perdues.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Revenir</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => router.push('/admin/articles')}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Confirmer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Brouillon */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" aria-label="Save draft">
                Enregistrer brouillon
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Enregistrer comme brouillon ?</AlertDialogTitle>
                <AlertDialogDescription>
                  L’article restera privé et pourra être publié plus tard.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleUpdatePublish('draft')}
                  className="bg-amber-500 hover:bg-amber-600 text-white"
                >
                  Enregistrer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Publication */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="default" aria-label="Publish article">
                Publier
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Publier cet article ?</AlertDialogTitle>
                <AlertDialogDescription>
                  L’article sera visible immédiatement.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleUpdatePublish('published')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Publier maintenant
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 p-8 max-w-7xl mx-auto">
        {/* Infos article */}
        <div className="flex-1 flex flex-col gap-6">
          <section className="bg-card p-6 rounded-md border border-border shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Informations de l'article</h2>
            <div className="flex flex-col gap-4">
              <InputGroupTooltip
                type="text"
                placeholder="Titre de l'article"
                infoToolTip="Titre clair et accrocheur."
                value={title}
                onChange={(e) => setTitle(e)}
              />
              <InputGroupTooltip
                type="text"
                placeholder="mon-premier-article"
                infoToolTip="Texte utilisé dans l’URL."
                value={slugInput}
                onChange={(e) => setSlugInput(e)}
              />
              <InputGroupTextareaTooltip
                placeholder="Résumé (150–160 caractères)"
                infoToolTip="Description pour les résultats de recherche."
                value={metaDescription}
                onChange={(e) => setMetaDescription(e)}
              />
            </div>
          </section>
        </div>

        {/* Éditeur */}
        <div className="flex-2">
          <section className="bg-card p-6 rounded-md border border-border shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Édition du contenu</h2>
            <SimpleEditor editorRef={editorRef} initialContent={article?.content ?? ''} />
          </section>
        </div>
      </div>
    </div>
  )
}
