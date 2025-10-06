'use client'

import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor'
import { useEffect, useState } from 'react'
import { useEditor } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { HorizontalRule } from '@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension'
import { TextAlign } from '@tiptap/extension-text-align'
import { TaskItem, TaskList } from '@tiptap/extension-list'
import { Highlight } from '@tiptap/extension-highlight'
import { Typography } from '@tiptap/extension-typography'
import { Superscript } from '@tiptap/extension-superscript'
import { Subscript } from '@tiptap/extension-subscript'
import { Selection } from '@tiptap/extensions'
import { Image } from '@tiptap/extension-image'
import { InputGroupTooltip } from '@/components/shadcn/InputGroupToolTip'
import { InputGroupTextareaTooltip } from '@/components/shadcn/InputGroupTextareaToolTip'

export default function PageEdition() {
  const [article, setArticle] = useState<{ json: any; html: string } | null>(null)

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
    content: article?.json || '',
  })

  useEffect(() => {
    if (previewEditor && article) {
      previewEditor.commands.setContent(article.json)
    }
  }, [article, previewEditor])

  return (
    <>
      <div className="m-8 xl:my-32 xl:mx-40 flex flex-col gap-4">
        <InputGroupTooltip
          type="text"
          placeholder="Titre de l'article"
          infoToolTip="Choisissez un titre clair et accrocheur pour votre article."
        />
        <InputGroupTooltip
          type="text"
          placeholder="mon-premier-article"
          infoToolTip="Texte utilisé dans l’URL de l’article, il doit être clair et lisible."
        />
        <InputGroupTextareaTooltip
          placeholder="Un résumé accrocheur de l’article (150–160 caractères)"
          infoToolTip="La description qui apparaît dans les résultats de recherche. Elle doit donner envie de cliquer et résumer le contenu de l’article."
        />
      </div>
      <div className="flex gap-4 max-w-6xl mx-auto">
        <div className="flex-1 rounded-t-md border-t border-x border-input shadow-xs focus-within:ring-2 focus-within:ring-ring dark:bg-input/30">
          <h1 className="text-xl font-bold m-6">Édition</h1>
          <SimpleEditor
            onSave={({ json, html }) => {
              setArticle({ json, html })
              console.log(json)
            }}
          />
        </div>
        {/*<div className="w-1/2 border p-4 bg-gray-50">*/}
        {/*  <h1 className="text-xl font-bold mb-2">Prévisualisation</h1>*/}
        {/*  {article ? (*/}
        {/*    <EditorContent editor={previewEditor} />*/}
        {/*  ) : (*/}
        {/*    <p>Aucun contenu pour le moment...</p>*/}
        {/*  )}*/}
        {/*</div>*/}
      </div>
    </>
  )
}
