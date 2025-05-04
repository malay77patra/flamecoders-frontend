import { FaUndo } from "react-icons/fa";
import { FaRedo } from "react-icons/fa";
import { FaBold } from "react-icons/fa";
import { FaItalic } from "react-icons/fa";
import { FaCode } from "react-icons/fa";
import { BsTypeH1 } from "react-icons/bs";
import { BsTypeH2 } from "react-icons/bs";
import { BsTypeH3 } from "react-icons/bs";
import ImageSelector from "./ImageSelector"
import { LuTextQuote } from "react-icons/lu"
import { FaListUl } from "react-icons/fa"
import { FaListOl } from "react-icons/fa"

export default function ToolBar({ editor }) {

    return (
        <div className="flex items-center gap-1 mb-4 flex-wrap">
            <button className="btn btn-sm btn-square" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
                <FaUndo />
            </button>
            <button className="btn btn-sm btn-square" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
                <FaRedo />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`btn btn-sm btn-square ${editor.isActive('bold') ? 'bg-accent' : ''}`}
            >
                <FaBold />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`btn btn-sm btn-square ${editor.isActive('italic') ? 'bg-accent' : ''}`}
            >
                <FaItalic />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleCode().run()}
                className={`btn btn-sm btn-square ${editor.isActive('code') ? 'bg-accent' : ''}`}
            >
                <FaCode />
            </button>
            <div className="join">
                <button
                    onClick={() => editor.commands.toggleHeading({ level: 1 })}
                    className={`btn btn-sm btn-square join-item ${editor.isActive('heading', { level: 1 }) ? 'bg-accent' : ''}`}
                >
                    <BsTypeH1 />
                </button>
                <button
                    onClick={() => editor.commands.toggleHeading({ level: 2 })}
                    className={`btn btn-sm btn-square join-item ${editor.isActive('heading', { level: 2 }) ? 'bg-accent' : ''}`}
                >
                    <BsTypeH2 />
                </button>
                <button
                    onClick={() => editor.commands.toggleHeading({ level: 3 })}
                    className={`btn btn-sm btn-square join-item ${editor.isActive('heading', { level: 3 }) ? 'bg-accent' : ''}`}
                >
                    <BsTypeH3 />
                </button>
            </div>
            <ImageSelector editor={editor} />
            <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`btn btn-sm btn-square join-item ${editor.isActive('blockquote') ? 'bg-accent' : ''}`}
            >
                <LuTextQuote />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`btn btn-sm btn-square join-item ${editor.isActive('bulletList') ? 'bg-accent' : ''}`}
            >
                <FaListUl />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`btn btn-sm btn-square join-item ${editor.isActive('orderedList') ? 'bg-accent' : ''}`}
            >
                <FaListOl />
            </button>
        </div>
    )
}