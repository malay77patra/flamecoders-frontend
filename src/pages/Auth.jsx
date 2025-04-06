import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FiMail, FiEye, FiEyeOff } from 'react-icons/fi';
import { LuKeyRound } from 'react-icons/lu';
import { useApi } from '@/hooks/useApi';

const registerSchema = yup.object({
    name: yup.string().required('Name is required').min(2).max(50),
    email: yup.string().required('Email is required').email('Invalid email address'),
    password: yup
        .string()
        .required('Password is required')
        .min(8, 'Minimum 8 characters')
        .matches(/[a-z]/, 'At least one lowercase letter')
        .matches(/[A-Z]/, 'At least one uppercase letter')
        .matches(/\d/, 'At least one number')
        .matches(/[^a-zA-Z0-9]/, 'At least one special character'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password')], 'Passwords must match')
        .required('Confirm password is required'),
}).required();

const loginSchema = yup.object({
    email: yup.string().required('Email is required').email('Invalid email address'),
    password: yup.string().required('Password is required'),
}).required();

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    // const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const api = useApi();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(isLogin ? loginSchema : registerSchema),
    });

    const loginUser = async (formData) => {
        const { data, error } = await api.post("/api/user/login", formData, {
            skipAuthRefresh: false,
            withCredentials: true
        });

        console.log(data, error)

    }

    const onSubmit = (formData) => {
        if (isLogin) {
            loginUser(formData);
        }
    };

    return (
        <div className='pt-20 flex items-center justify-center'>
            <form className='card bg-base-200 w-96 shadow-md' onSubmit={handleSubmit(onSubmit)}>
                <div className='card-body'>
                    <h2 className='text-2xl font-bold text-center'>{isLogin ? 'Login' : 'Register'}</h2>

                    <div className='flex flex-col gap-4 my-4'>
                        {!isLogin && (
                            <div>
                                <input
                                    type='text'
                                    placeholder='Your Name'
                                    className={`input input-bordered w-full ${errors.name ? 'input-error' : ''}`}
                                    {...register('name')}
                                />
                                {errors.name && <p className='text-error text-sm mt-1'>{errors.name.message}</p>}
                            </div>
                        )}

                        <div>
                            <label className='input input-bordered flex items-center gap-2 w-full'>
                                <FiMail />
                                <input
                                    type='email'
                                    placeholder='mail@site.com'
                                    className='grow'
                                    {...register('email')}
                                />
                            </label>
                            {errors.email && <p className='text-error text-sm mt-1'>{errors.email.message}</p>}
                        </div>

                        <div>
                            <label className='input input-bordered flex items-center gap-2 w-full'>
                                <LuKeyRound />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder='Password'
                                    className='grow'
                                    {...register('password')}
                                />
                                <span
                                    className='cursor-pointer'
                                    onClick={() => setShowPassword((prev) => !prev)}
                                >
                                    {showPassword ? <FiEyeOff /> : <FiEye />}
                                </span>
                            </label>
                            {errors.password && (
                                <p className='text-error text-sm mt-1'>{errors.password.message}</p>
                            )}
                        </div>

                        {!isLogin && (
                            <div>
                                <label className='input input-bordered flex items-center gap-2 w-full'>
                                    <LuKeyRound />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder='Confirm Password'
                                        className='grow'
                                        {...register('confirmPassword')}
                                    />
                                    <span
                                        className='cursor-pointer'
                                        onClick={() => setShowPassword((prev) => !prev)}
                                    >
                                        {showPassword ? <FiEyeOff /> : <FiEye />}
                                    </span>
                                </label>
                                {errors.confirmPassword && (
                                    <p className='text-error text-sm mt-1'>{errors.confirmPassword.message}</p>
                                )}
                            </div>
                        )}
                    </div>

                    <div className='card-actions'>
                        <button className='btn btn-primary w-full' type='submit'>
                            {isLogin ? 'Login' : 'Register'}
                        </button>
                        <button
                            className='btn btn-ghost w-full hover:link'
                            type='button'
                            onClick={() => setIsLogin(!isLogin)}
                        >
                            {isLogin
                                ? "Don't have an account? Register"
                                : 'Already have an account? Login'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
