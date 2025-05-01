import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Placeholder from '@tiptap/extension-placeholder'
import History from '@tiptap/extension-history'
import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import Code from '@tiptap/extension-code'
import Heading from '@tiptap/extension-heading'
import { EditorContent, useEditor } from '@tiptap/react'
import React, { useEffect } from 'react'
import ToolBar from './components/ToolBar'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { all, createLowlight } from 'lowlight'

export default function TTEditor({
  metadata = {
    "type": "doc",
    "content": [
      {
        "type": "paragraph"
      }
    ]
  },
  setMetadata,
  setChanged,
  autoFocus = false,
  readOnly = false,
  placeholder = "Start writing..."
}) {

  const lowlight = createLowlight(all)
  const editor = useEditor({
    autofocus: autoFocus,
    content: metadata,
    editable: !readOnly,
    extensions: [
      Document,
      Paragraph,
      Text,
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Bold,
      Italic,
      Code.configure({
        HTMLAttributes: {
          class: 'inline-code',
        },
      }),
      Heading.configure({
        levels: [1, 2, 3],
      }),
      Placeholder.configure({
        placeholder: placeholder
      }),
      History,
    ],
    onUpdate({ editor }) {
      setMetadata(editor.getJSON())
      setChanged(true)
    }
  })

  useEffect(() => {
    return () => {
      editor?.destroy()
    }
  }, [editor, autoFocus, readOnly, placeholder])

  return (
    <>
      {!readOnly && <ToolBar editor={editor} />}
      <EditorContent editor={editor} />
    </>
  )
}
