import { useEffect, useRef, useState } from "react"
import { FaImage } from "react-icons/fa6"
import toast from "react-hot-toast"
import { useApi } from "@/hooks/useApi"
import { useAuth } from "@/hooks/useAuth"


function ImageGallery({ images, setImages, uploadingImage, selectedIndex, setSelectedIndex, fetching, setFetching }) {
    const api = useApi()
    const { authToken } = useAuth()

    const fetchAllImages = async () => {
        setFetching(true)
        try {
            const { error, data } = await api.get("/api/image/all", {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            })
            if (error) {
                toast.error(error.message)
            } else {
                setImages(data)
            }
        } catch (err) {
            toast.error("Something went wrong")
        } finally {
            setFetching(false)
        }
    }

    useEffect(() => {
        fetchAllImages()
    }, [])

    return (
        <div className="flex gap-2 flex-wrap">
            {fetching ? (
                <span className="loading loading-spinner"></span>
            ) : (
                <>
                    {uploadingImage && (<div className="size-25 flex items-center justify-center">
                        <span className="loading loading-spinner"></span>
                    </div>)}
                    {images.map((img) => {
                        return (
                            <div className="size-25" key={img.id} onClick={() => setSelectedIndex(img.id)}>
                                <img className={`h-full cursor-pointer w-full object-contain ${(selectedIndex === img.id) ? 'ring-3 ring-accent' : ''}`} src={img.url} />
                            </div>
                        )
                    })}
                </>
            )}
        </div>
    )
}

export default function ImageSelector() {
    const [isOpen, setIsOpen] = useState(false)
    const modalref = useRef(null)
    const fileInputRef = useRef(null)
    const [images, setImages] = useState([])
    const [selectedIndex, setSelectedIndex] = useState(null)
    const [uploadError, setUploadError] = useState("")
    const [uploadingImage, setUploadingImage] = useState(false)
    const [deletingImage, setDeletingImage] = useState(false)
    const [fetching, setFetching] = useState(false)
    const api = useApi()
    const { authToken } = useAuth()
    const actionDisabled = (selectedIndex === null) || fetching || deletingImage

    useEffect(() => {
        const modal = modalref.current
        if (!modal) return

        const handleClose = () => setIsOpen(false)
        modal.addEventListener('close', handleClose)

        return () => {
            modal.removeEventListener('close', handleClose)
        }
    }, [])

    useEffect(() => {
        const modal = modalref.current
        if (!modal) return

        if (isOpen) {
            if (!modal.open) modal.showModal()
        } else {
            if (modal.open) modal.close()
        }
    }, [isOpen])

    const handleUpload = async (event) => {
        const file = event.target.files[0]
        if (!file) return

        const allowedTypes = ["image/jpeg", "image/png", "image/webp"]
        const maxSizeInBytes = 2 * 1024 * 1024

        if (!allowedTypes.includes(file.type)) {
            setUploadError("Only JPEG, PNG, or WEBP images are allowed")
            return
        }

        if (file.size > maxSizeInBytes) {
            setUploadError("Image must be smaller than 2MB")
            return
        }

        setUploadingImage(true)
        try {
            const formData = new FormData();
            formData.append('image', file);

            const { error, data } = await api.post("/api/image/upload", formData, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    // Fix for overwriting predefined Content-Type in axios instance
                    // reference: https://github.com/axios/axios/issues/5556#issuecomment-1434668134
                    "Content-Type": undefined
                }
            })
            if (error) {
                setUploadError(error.message)
            } else {
                setImages(prev => ([data, ...prev]))
                setUploadError("")
            }
        } catch (err) {
            toast.error("Something went wrong")
        } finally {
            setUploadingImage(false)
        }
    }

    const handleDelete = async (id) => {
        setDeletingImage(true)
        try {
            const { error, data } = await api.delete(`/api/image/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            })
            if (error) {
                toast.error(error.message)
            } else {
                setImages(prev => prev.filter(img => img.id !== data.id))
                setSelectedIndex(null)
            }
        } catch (err) {
            console.log(err)
            toast.error("Something went wrong")
        } finally {
            setDeletingImage(false)
        }
    }

    return (
        <>
            <button className="btn btn-sm btn-square" onClick={() => setIsOpen(true)}>
                <FaImage />
            </button>
            <dialog className="modal" ref={modalref}>
                <div className="modal-box flex flex-col gap-3 items-start">
                    <h3 className="font-bold text-lg">Insert Image</h3>
                    <input type="file" ref={fileInputRef} className="hidden" onInput={handleUpload} />
                    <button className="btn" onClick={() => {
                        if (fileInputRef.current) {
                            fileInputRef.current.click()
                        }
                    }} disabled={uploadingImage}>Upload</button>
                    <p className="text-error text-xs">{uploadError}</p>
                    {isOpen && <ImageGallery
                        images={images}
                        setImages={setImages}
                        uploadingImage={uploadingImage}
                        selectedIndex={selectedIndex}
                        setSelectedIndex={setSelectedIndex}
                        fetching={fetching}
                        setFetching={setFetching}
                    />}
                    <div className="modal-action">
                        <button className="btn btn-success" disabled={actionDisabled}>Insert</button>
                        <button className="btn btn-error" disabled={actionDisabled} onClick={() => handleDelete(selectedIndex)}>
                            {deletingImage ? <span className="loading loading-spinner"></span> : "Delete"}
                        </button>
                        <button className="btn" onClick={() => {
                            setSelectedIndex(null)
                            setIsOpen(false)
                        }}>Close</button>
                    </div>
                </div>
            </dialog>
        </>
    )
}
