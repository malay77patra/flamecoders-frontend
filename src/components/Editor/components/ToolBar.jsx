import { FaUndo } from "react-icons/fa"
import { FaRedo } from "react-icons/fa"
import { FaBold } from "react-icons/fa"
import { FaItalic } from "react-icons/fa"
import { FaCode } from "react-icons/fa"
import { BsTypeH1 } from "react-icons/bs"
import { BsTypeH2 } from "react-icons/bs"
import { BsTypeH3 } from "react-icons/bs"
import ImageSelector from "./ImageSelector"
import { LuTextQuote } from "react-icons/lu"
import { FaListUl } from "react-icons/fa"
import { FaListOl } from "react-icons/fa"
import { TbGridDots } from "react-icons/tb"
import { BiDotsHorizontal } from "react-icons/bi"
import { useEffect, useRef, useState } from "react"


export default function ToolBar({ editor }) {
    const modalRef = useRef()
    const [modalOpened, setModalOpened] = useState(false)

    useEffect(() => {
        const modal = modalRef.current
        if (!modal) return

        if (modalOpened) {
            if (!modal.open) modal.showModal()
        } else {
            if (modal.open) modal.close()
        }
    }, [modalOpened])

    useEffect(() => {
        const modal = modalRef.current
        if (!modal) return

        const handleClose = () => setModalOpened(false)
        modal.addEventListener('close', handleClose)

        return () => {
            modal.removeEventListener('close', handleClose)
        }
    }, [])

    return (
        <>
            <dialog ref={modalRef} className="modal" onClick={() => setModalOpened(false)}>
                <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                    <h3 className="font-bold text-lg">Supported Formats</h3>
                    <ul className="my-2 flex flex-col gap-2">
                        <li>
                            <span className="bg-base-200 text-sm font-mono px-2 py-1 rounded border border-base-content/10">**bold**</span> for bold text
                        </li>
                        <li>
                            <span className="bg-base-200 text-sm font-mono px-2 py-1 rounded border border-base-content/10">*italic*</span> for italic text
                        </li>
                        <li>
                            <span className="bg-base-200 text-sm font-mono px-2 py-1 rounded border border-base-content/10">`inline code`</span> for inline code
                        </li>
                        <li>
                            <span className="bg-base-200 text-sm font-mono px-2 py-1 rounded border border-base-content/10"># Heading 1</span> for heading level 1
                        </li>
                        <li>
                            <span className="bg-base-200 text-sm font-mono px-2 py-1 rounded border border-base-content/10">## Heading 2</span> for heading level 2
                        </li>
                        <li>
                            <span className="bg-base-200 text-sm font-mono px-2 py-1 rounded border border-base-content/10">### Heading 3</span> for heading level 3
                        </li>
                        <li>
                            <span className="bg-base-200 text-sm font-mono px-2 py-1 rounded border border-base-content/10">&gt; blockquote</span> for blockquotes
                        </li>
                        <li>
                            <span className="bg-base-200 text-sm font-mono px-2 py-1 rounded border border-base-content/10">- Bullet item</span> for unordered lists
                        </li>
                        <li>
                            <span className="bg-base-200 text-sm font-mono px-2 py-1 rounded border border-base-content/10">1. Ordered item</span> for ordered lists
                        </li>
                    </ul>

                    <div className="modal-action">
                        <button className="btn" onClick={() => setModalOpened(false)}>Close</button>
                    </div>
                </div>
            </dialog>
            <div className="flex items-center gap-1 mb-4 flex-wrap">
                <button className="btn btn-square" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
                    <FaUndo />
                </button>
                <button className="btn btn-square" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
                    <FaRedo />
                </button>
                <ImageSelector editor={editor} />
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`btn btn-square ${editor.isActive('bold') ? 'bg-accent' : ''}`}
                >
                    <FaBold />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`btn btn-square ${editor.isActive('italic') ? 'bg-accent' : ''}`}
                >
                    <FaItalic />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    className={`btn btn-square ${editor.isActive('code') ? 'bg-accent' : ''}`}
                >
                    <FaCode />
                </button>
                <button className="btn" onClick={() => setModalOpened(true)}>
                    <BiDotsHorizontal />
                </button>

                {/* <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`btn btn-square ${editor.isActive('bold') ? 'bg-accent' : ''}`}
                >
                <FaBold />
                </button>
                <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`btn btn-square ${editor.isActive('italic') ? 'bg-accent' : ''}`}
                >
                <FaItalic />
                </button>
                <button
                onClick={() => editor.chain().focus().toggleCode().run()}
                className={`btn btn-square ${editor.isActive('code') ? 'bg-accent' : ''}`}
                >
                <FaCode />
                </button>
                <div className="join">
                <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`btn btn-square join-item ${editor.isActive('heading', { level: 1 }) ? 'bg-accent' : ''}`}
                >
                <BsTypeH1 />
                </button>
                <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`btn btn-square join-item ${editor.isActive('heading', { level: 2 }) ? 'bg-accent' : ''}`}
                >
                <BsTypeH2 />
                </button>
                <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={`btn btn-square join-item ${editor.isActive('heading', { level: 3 }) ? 'bg-accent' : ''}`}
                >
                <BsTypeH3 />
                </button>
                </div>
                <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`btn btn-square join-item ${editor.isActive('blockquote') ? 'bg-accent' : ''}`}
                >
                <LuTextQuote />
                </button>
                <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`btn btn-square join-item ${editor.isActive('bulletList') ? 'bg-accent' : ''}`}
                >
                <FaListUl />
                </button>
                <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`btn btn-square join-item ${editor.isActive('orderedList') ? 'bg-accent' : ''}`}
                >
                <FaListOl />
                </button> */}
            </div>
        </>
    )
}