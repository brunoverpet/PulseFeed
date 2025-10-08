'use client'

import { InputGroupTooltip } from '@/components/shadcn/InputGroupToolTip'
import { InputGroupTextareaTooltip } from '@/components/shadcn/InputGroupTextareaToolTip'
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor'
import * as React from 'react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import type { Editor } from '@tiptap/react'
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

export default function AddArticle() {
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [metaDescription, setMetaDescription] = useState('')
  const editorRef = React.useRef<Editor | null>(null)
  const router = useRouter()

  async function handlePublish(status: 'draft' | 'published' = 'draft') {
    if (!editorRef.current) return toast('Éditeur non initialisé')

    const html = editorRef.current.getHTML()

    if (!title || !slug || !metaDescription || !html) {
      return toast('Tous les champs sont requis')
    }

    try {
      const article = await ArticleForm({
        //@ts-ignore
        title,
        //@ts-ignore
        slug,
        //@ts-ignore
        metaDescription,
        //@ts-ignore
        content: html, // envoie le HTML
        //@ts-ignore
        status,
      })
      toast.success('Article créé ✅', {
        closeButton: true,
        duration: 5000,
        position: 'top-right',
        style: {
          background: '#e6f7f1',
          color: '#2a8764',
        },
        description: (
          <div>
            <div>
              <div>
                <strong>Status :</strong>{' '}
                {status === 'draft' ? 'Brouillon' : status === 'published' ? 'Publié' : 'Archivé'}
              </div>
              {article.article.publishedAt && (
                <div>
                  <strong>Date de publication :</strong>{' '}
                  {new Date(article.article.publishedAt).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </div>
              )}
            </div>
          </div>
        ),
      })

      return router.push(`/articles/${article.article.slug}`)
    } catch (e: unknown) {
      if (e instanceof Error) {
        toast.error(e.message)
      } else {
        toast.error('Une erreur est survenue')
      }
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header sticky */}
      <div className="sticky top-0 z-50 bg-background border-b border-border py-4 px-8 flex justify-between items-center shadow-sm">
        <h1 className="text-2xl font-semibold">Ajouter un article</h1>
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
                <AlertDialogTitle>Annuler la création ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Les modifications non enregistrées seront perdues. Cette action est irréversible.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Revenir</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => router.push('/articles')}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Confirmer l’annulation
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Brouillon */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" aria-label="Save draft">
                Enregistrer comme brouillon
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Enregistrer comme brouillon ?</AlertDialogTitle>
                <AlertDialogDescription>
                  L’article ne sera pas publié et restera privé. Vous pourrez le modifier et le
                  publier plus tard.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handlePublish('draft')}
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
                  L’article sera rendu public et visible immédiatement. Vous pourrez toujours le
                  modifier ou le retirer plus tard.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handlePublish('published')}
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
        {/* Colonne gauche : infos de l’article */}
        <div className="flex-1 flex flex-col gap-6">
          <section className="bg-card p-6 rounded-md border border-border shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Informations de l'article</h2>
            <div className="flex flex-col gap-4">
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
                infoToolTip="La description qui apparaît dans les résultats de recherche."
                value={metaDescription}
                onChange={(e) => setMetaDescription(e)}
              />
            </div>
          </section>
        </div>

        {/* Colonne droite : éditeur */}
        <div className="flex-2">
          <section className="bg-card p-6 rounded-md border border-border shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Édition du contenu</h2>
            <SimpleEditor editorRef={editorRef} />
          </section>
        </div>
      </div>
    </div>
  )
}
