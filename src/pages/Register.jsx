import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FiMail, FiEye, FiEyeOff } from "react-icons/fi";
import { LuKeyRound } from "react-icons/lu";
import { useApi } from "@/hooks/useApi";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import RadialLoader from "@/components/ui/RadialLoader";
import { Link } from "react-router-dom";

const registerSchema = yup
    .object({
        name: yup
            .string()
            .trim()
            .required("Name is required")
            .min(3, "Name must be at least 3 characters")
            .max(50, "Name must be less than 50 characters")
            .matches(
                /^[A-Za-z\s'-]+$/,
                "Name can only contain letters, spaces, apostrophes, and hyphens"
            ),
        email: yup
            .string()
            .trim()
            .lowercase()
            .email("Invalid email format")
            .required("Email is required"),
        password: yup
            .string()
            .trim()
            .required("Password is required")
            .min(6, "Password must be at least 6 characters")
            .max(64, "Password must be less than 64 characters")
            .matches(
                /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+]).{6,}$/,
                "Password must contain at least one uppercase letter, one number, and one special character"
            ),
        confirmPassword: yup
            .string()
            .oneOf([yup.ref("password")], "Passwords must match")
            .required("Confirm password is required"),
    })
    .required();

export default function Register() {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const api = useApi();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(registerSchema),
    });

    const registerUser = async (formData) => {
        setIsLoading(true);
        try {
            const { data, error } = await api.post("/api/user/register", formData);

            if (error) {
                toast.error(error.message);
            } else {
                toast.success("A verification link has been sent to your email, please check your inbox.")
                navigate("/login")
            }
        } catch (err) {
            console.log("Unexpected error:", err);
            toast.err("Something went wrong!");
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit = (formData) => {
        registerUser(formData);
    };

    return (
        <div className="pt-20 flex items-center justify-center">
            <form
                className="card bg-base-200 w-96 shadow-md"
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="card-body">
                    <h2 className="text-2xl font-bold text-center">
                        Register
                    </h2>

                    <div className="flex flex-col gap-4 my-4">
                        <div>
                            <input
                                type="text"
                                placeholder="Your Name"
                                className={`input input-bordered w-full ${errors.name ? "input-error" : ""
                                    }`}
                                {...register("name")}
                            />
                            {errors.name && (
                                <p className="text-error text-sm mt-1">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="input input-bordered flex items-center gap-2 w-full">
                                <FiMail />
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    className="grow"
                                    {...register("email")}
                                />
                            </label>
                            {errors.email && (
                                <p className="text-error text-sm mt-1">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="input input-bordered flex items-center gap-2 w-full">
                                <LuKeyRound />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    className="grow"
                                    {...register("password")}
                                />
                                <span
                                    className="cursor-pointer"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                >
                                    {showPassword ? <FiEyeOff /> : <FiEye />}
                                </span>
                            </label>
                            {errors.password && (
                                <p className="text-error text-sm mt-1">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="input input-bordered flex items-center gap-2 w-full">
                                <LuKeyRound />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Confirm Password"
                                    className="grow"
                                    {...register("confirmPassword")}
                                />
                                <span
                                    className="cursor-pointer"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                >
                                    {showPassword ? <FiEyeOff /> : <FiEye />}
                                </span>
                            </label>
                            {errors.confirmPassword && (
                                <p className="text-error text-sm mt-1">
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="card-actions">
                        <button className="btn btn-primary w-full" type="submit">
                            {isLoading ? <RadialLoader /> : "Register"}
                        </button>
                        <Link
                            className="m-auto hover:link font-medium"
                            to="/login"
                        >Already have an account? Login</Link>
                    </div>
                </div>
            </form>
        </div>
    );
}
