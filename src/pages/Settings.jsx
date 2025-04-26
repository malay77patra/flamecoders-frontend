import { useAuth } from "@/hooks/useAuth"
import RadialLoader from "@/components/ui/RadialLoader"
import { useApi } from "@/hooks/useApi"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import {  useState } from "react"
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

    return (
        <div className="max-w-3xl m-auto">
            <h1 className="text-3xl font-bold mb-12">Settings</h1>
            <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-2">
                    <label className="text-lg font-medium">Display Name</label>
                    <input className="input" defaultValue={user.name} {...register("name")} />
                    {errors.name && <p className="text-error text-sm">{errors.name.message}</p>}
                </div>
                <div className="mt-12 flex">
                    <button className="btn btn-accent" type="submit" disabled={saving}>
                        {saving ? <RadialLoader /> : "Save"}
                    </button>
                </div>
            </form>
        </div>
    )
}