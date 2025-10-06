'use client'

import { useEffect, useState } from 'react'
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

export default function Article() {
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
    <div>
      <div className="m-10 flex-1 rounded-md border border-input shadow-xs bg-background p-4">
        <h1 className="text-xl font-bold mb-2">Prévisualisation</h1>
        {article ? (
          <EditorContent editor={previewEditor} />
        ) : (
          <p className="text-muted-foreground">Aucun contenu pour le moment...</p>
        )}
      </div>
    </div>
  )
}
