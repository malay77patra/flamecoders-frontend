import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { string, object } from "yup";
import { useApi } from "@/hooks/useApi";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const loginSchema = object({
    email: string()
        .trim()
        .lowercase()
        .email("Invalid email format")
        .required("Email is required"),
    password: string()
        .trim()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters")
        .max(64, "Password must be less than 64 characters")
        .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+]).{6,}$/,
            "Password must contain at least one uppercase letter, one number, and one special character"),
}).strict().required();

const registerSchema = object({
    name: string()
        .trim()
        .required("Name is required")
        .min(3, "Name must be at least 3 characters")
        .max(50, "Name must be less than 50 characters")
        .matches(/^[A-Za-z\s'-]+$/, "Name can only contain letters, spaces, apostrophes, and hyphens"),
    email: string()
        .trim()
        .lowercase()
        .email("Invalid email format")
        .required("Email is required"),
    password: string()
        .trim()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters")
        .max(64, "Password must be less than 64 characters")
        .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+]).{6,}$/,
            "Password must contain at least one uppercase letter, one number, and one special character"),
}).strict().required();

function Auth() {
    const [loading, setLoading] = useState(false);
    const [isRegister, setIsRegister] = useState(false);
    const api = useApi();
    const { setUser, setAuthToken } = useAuth();
    const navigate = useNavigate();

    const form = useForm({
        resolver: yupResolver(isRegister ? registerSchema : loginSchema),
        defaultValues: {
            name: "",
            email: "",
            password: ""
        }
    });


    const onSubmit = async (formData) => {
        setLoading(true);
        try {
            if (isRegister) {
                const { data, error } = await api.post("/api/user/register", formData, {
                    skipAuthRefresh: true
                });
                if (error) {
                    toast.error(error.message);
                } else {
                    toast.success("A verification link is sent to your email, please check inbox.");
                }

            } else {
                const { data, error } = await api.post("/api/user/login", formData, {
                    skipAuthRefresh: false,
                    withCredentials: true
                });

                if (error) {
                    toast.error(error.message);
                } else {
                    setUser(data.user);
                    setAuthToken(data.accessToken);
                    toast.success("Logged in.");
                    navigate("/");
                }
            }
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong. Try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-20">
            <div className="flex flex-col gap-4 bg-card p-8 rounded-xl max-w-md mx-auto shadow-lg">
                <h1 className="text-2xl font-bold mb-6 text-center">
                    {isRegister ? "Register" : "Login"}
                </h1>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {isRegister && (
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Your name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="your@gmail.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="******" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Loading..." : isRegister ? "Register" : "Login"}
                        </Button>
                    </form>
                </Form>

                <div className="text-center">
                    <button
                        onClick={() => setIsRegister((prev) => !prev)}
                        className="text-primary hover:underline cursor-pointer"
                    >
                        {isRegister ? "Already have an account? Login" : "Don't have an account? Register"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Auth;
