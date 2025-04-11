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

export default function TTEditor() {

  const editor = useEditor({
    autofocus: true,
    extensions: [
      Document,
      Paragraph,
      Text,
      Bold,
      Italic,
      Code,
      Heading.configure({
        levels: [1, 2, 3],
      }),
      Placeholder.configure({
        placeholder: 'Start writing...'
      }),
      History,
    ]
  })

  useEffect(() => {
    return () => {
      editor?.destroy()
    }
  }, [editor])

  return (
    <>
      <ToolBar editor={editor} />
      <EditorContent editor={editor} />
    </>
  )
}
