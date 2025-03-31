import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { string, object } from "yup";
import { useApi } from "@/hooks/useApi";
import toast from "react-hot-toast";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const loginSchema = object({
    email: string().email("Invalid email format").required("Email is required"),
    password: string().required("Password is required").min(6, "Password must be at least 6 characters")
        .matches(/^[a-zA-Z0-9!@#$%^&*()_+]+$/, "Password can only contain letters, numbers, and special characters")
}).required();

const registerSchema = object({
    name: string().required("Name is required").min(3, "Name must be at least 3 characters"),
    email: string().email("Invalid email format").required("Email is required"),
    password: string().required("Password is required").min(6, "Password must be at least 6 characters")
        .matches(/^[a-zA-Z0-9!@#$%^&*()_+]+$/, "Password can only contain letters, numbers, and special characters")
}).required();

function Auth() {
    const [loading, setLoading] = useState(false);
    const [isRegister, setIsRegister] = useState(false);
    const api = useApi();

    const form = useForm({
        resolver: yupResolver(isRegister ? registerSchema : loginSchema),
        defaultValues: {
            name: "",
            email: "",
            password: ""
        }
    });


    const onSubmit = async (data) => {
        setLoading(true);
        try {
            if (isRegister) {
                // await api.post("/user/register", data);
                // toast.success("Registration successful!");
                toast.success("Shut up bro, page is not done yet!");
            } else {
                // const response = await api.post("/user/login", data);
                // if (!response.ok) {
                //     toast.error("Login unsuccessful!");
                // }
                toast.success("Shut up bro, page is not done yet!");
            }
        } catch (error) {
            toast.error("Something went wrong. Try again later.");
            console.error(error);
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
