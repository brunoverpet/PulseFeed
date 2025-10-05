'use client'

import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor'
import { useEffect, useState } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
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
    <div className="flex gap-4 max-w-6xl mx-auto">
      <div className="w-1/2 border p-4">
        <h1 className="text-xl font-bold mb-2">Édition</h1>
        <SimpleEditor
          onSave={({ json, html }) => {
            setArticle({ json, html })
            console.log(json)
          }}
        />
      </div>

      <div className="w-1/2 border p-4 bg-gray-50">
        <h1 className="text-xl font-bold mb-2">Prévisualisation</h1>
        {article ? (
          <EditorContent editor={previewEditor} />
        ) : (
          <p>Aucun contenu pour le moment...</p>
        )}
      </div>
    </div>
  )
}
