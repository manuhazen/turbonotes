"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Link from "next/link"
import NextImage from "next/image"
import { useMemo } from "react"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { AuthHeader } from "@/components/auth-header"
import { useRegister, useLogin } from "@/hooks/use-auth"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const formSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().regex(passwordRegex, {
        message: "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.",
    }),
    re_password: z.string(),
    first_name: z.string().min(2, { message: "First name must be at least 2 characters" }),
    last_name: z.string().min(2, { message: "Last name must be at least 2 characters" }),
}).refine((data) => data.password === data.re_password, {
    message: "Passwords do not match",
    path: ["re_password"],
});

interface ApiError {
    response?: {
        data?: {
            [key: string]: string[] | undefined
        }
    }
}

export default function SignUpClient() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            re_password: "",
            first_name: "",
            last_name: "",
        },
    })

    const register = useRegister();
    const login = useLogin();

    function onSubmit(values: z.infer<typeof formSchema>) {
        register.mutate({
            email: values.email,
            password: values.password,
            re_password: values.re_password,
            first_name: values.first_name,
            last_name: values.last_name
        }, {
            onSuccess: () => {
                // Auto login after sign up
                login.mutate({
                    email: values.email,
                    password: values.password
                })
            }
        });
    }


    const isLoading = register.isPending || login.isPending || register.isSuccess;

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="w-16 h-16 relative">
                    <NextImage
                        src="/lazy_cow.png"
                        alt="Loading..."
                        width={64}
                        height={64}
                        className="w-full h-full object-contain animate-bounce"
                    />
                </div>
                <h2 className="text-xl font-semibold text-[#8D7B68]">
                    {register.isPending ? "Creating your account..." : "Setting up your space..."}
                </h2>
                <p className="text-[#BCAAA4]">Almost there!</p>
            </div>
        )
    }

    const errorMessages = useMemo(() => {
        if (!register.error) return [];
        const apiError = register.error as unknown as ApiError;
        if (apiError?.response?.data) {
            const messages = Object.values(apiError.response.data)
                .flat()
                .filter((msg): msg is string => typeof msg === "string");
            if (messages.length > 0) return messages;
        }
        return [register.error instanceof Error ? register.error.message : "Registration failed"];
    }, [register.error]);

    return (
        <div className="w-full max-w-[400px]">
            <AuthHeader
                imageSrc="/lazy_cow.png"
                imageAlt="Cute lazy animal character"
                title="Yay, New Friend!"
            />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        type="email"
                                        placeholder="Email address"
                                        className="bg-[#F9F4E8] border-[#D7CCC8] h-12"
                                        autoCapitalize="none"
                                        autoComplete="email"
                                        autoCorrect="off"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="text-red-500" />
                            </FormItem>
                        )}
                    />
                    {register.isError && errorMessages.length > 0 && (
                        <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription className="capitalize">
                                {errorMessages.length === 1 ? (
                                    <span>{errorMessages[0]}</span>
                                ) : (
                                    <ul className="list-disc list-inside space-y-1">
                                        {errorMessages.map((msg, idx) => (
                                            <li key={idx}>{msg}</li>
                                        ))}
                                    </ul>
                                )}
                            </AlertDescription>
                        </Alert>
                    )}
                    <div className="flex gap-4">
                        <FormField
                            control={form.control}
                            name="first_name"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormControl>
                                        <Input
                                            placeholder="First Name"
                                            className="bg-[#F9F4E8] border-[#D7CCC8] h-12"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-500" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="last_name"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormControl>
                                        <Input
                                            placeholder="Last Name"
                                            className="bg-[#F9F4E8] border-[#D7CCC8] h-12"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-500" />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <PasswordInput
                                        placeholder="Password"
                                        className="bg-[#F9F4E8] border-[#D7CCC8] h-12"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="text-red-500" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="re_password"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <PasswordInput
                                        placeholder="Repeat Password"
                                        className="bg-[#F9F4E8] border-[#D7CCC8] h-12"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="text-red-500" />
                            </FormItem>
                        )}
                    />


                    <Button
                        type="submit"
                        className="w-full h-12 rounded-full bg-[#f4eadd] text-[#8D7B68] hover:bg-[#eaddcf] border border-[#8D7B68] text-base font-semibold"
                        disabled={isLoading}
                    >
                        Sign Up
                    </Button>
                </form>
            </Form>

            <div className="mt-6 text-center">
                <Link href="/sign-in" className="text-[#BCAAA4] hover:underline text-sm">
                    We&apos;re already friends!
                </Link>
            </div>
        </div>
    )

}
