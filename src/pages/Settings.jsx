import { useAuth } from "@/hooks/useAuth"
import RadialLoader from "@/components/ui/RadialLoader"
import { useApi } from "@/hooks/useApi"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useRef, useState } from "react"
import toast from "react-hot-toast";

const updateSchema = yup
    .object({
        name: yup
            .string()
            .trim()
            .required("Name can not be empty")
            .min(3, "Name must be at least 3 characters")
            .max(50, "Name must be less than 50 characters")
            .matches(
                /^[A-Za-z\s'-]+$/,
                "Name can only contain letters, spaces, apostrophes, and hyphens"
            ),
    })
    .required()

export default function Settings() {
    const { user, setUser, authToken } = useAuth()
    const api = useApi()
    const [saving, setSaving] = useState(false)
    const [uploadingAvatar, setUploadingAvatar] = useState(false)
    const avatarRef = useRef(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(updateSchema),
    });

    const onSubmit = async (formData) => {
        setSaving(true)
        try {
            const { data, error } = await api.patch("/api/user/update", formData, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            })

            if (error) {
                toast.error(error.message);
            } else {
                setUser(prev => ({
                    ...prev,
                    ...data.user
                }))
                toast.success("Saved")
            }
        } catch (err) {
            console.log("Unexpected error:", err);
            toast.err("Something went wrong!");
        } finally {
            setSaving(false)
        }
    }

    const handleAvatarChange = async (event) => {
        setUploadingAvatar(true)
        try {
            alert("file picked")
            const file = event.target.files[0];
            alert("is file found:", !!file)
            if (!file) return;

            const formData = new FormData();
            formData.append('image', file);

            const { error, data } = await api.patch("/api/user/update", formData, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    // Fix for overwriting predefined Content-Type in axios instance
                    // reference: https://github.com/axios/axios/issues/5556#issuecomment-1434668134
                    "Content-Type": undefined
                }
            })
            if (error) {
                toast.error(error.message)
            } else {
                setUser(prev => ({
                    ...prev,
                    ...data
                }))
            }
        } catch (err) {
            toast.error("Something went wrong")
        } finally {
            setUploadingAvatar(false)
        }
    }

    return (
        <div className="max-w-3xl m-auto">
            <h1 className="text-2xl font-bold mb-4">Settings</h1>
            <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-4 items-start">
                    <div className="flex flex-col gap-2">
                        <label className="text-lg font-medium">Avatar</label>
                        <div className="avatar rounded-full cursor-pointer">
                            <div className="size-16 rounded-full border">
                                <img src={user.avatar} />
                            </div>
                        </div>
                        <button type="button" className="btn" onClick={() => avatarRef.current.click()} disabled={uploadingAvatar}>{uploadingAvatar ? <span className="loading loading-spinner"></span> : "Uplaod"}</button>
                        <input type="file" className="hidden" accept="image/jpeg, image/png, image/webp" ref={avatarRef} onInput={handleAvatarChange} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-lg font-medium">Name</label>
                        <input className="input" defaultValue={user.name} {...register("name")} />
                        {errors.name && <p className="text-error text-sm">{errors.name.message}</p>}
                    </div>
                </div>
                <div className="mt-12 flex justify-end fixed bottom-0 left-0 p-2 shadow-up-md w-full sm:static sm:shadow-none">
                    <button className="btn btn-accent" type="submit" disabled={saving}>
                        {saving ? <RadialLoader /> : "Save"}
                    </button>
                </div>
            </form>
        </div>
    )
}