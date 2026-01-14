"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Link from "next/link"

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
import { useLogin } from "@/hooks/use-auth"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

const formSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    }),
})

export default function SignInClient() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const login = useLogin();

    function onSubmit(values: z.infer<typeof formSchema>) {
        login.mutate({ email: values.email, password: values.password });
    }

    return (
        <div className="w-full max-w-[400px]">
            <AuthHeader
                imageSrc="/little_cactus.png"
                imageAlt="Cute potted cactus character"
                title="Yay, You're Back!"
            />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    {login.isError && (
                        <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>
                                {login.error instanceof Error && (login.error.message.includes("400") || login.error.message.includes("401"))
                                    ? "Bad credentials provided. Please check your email or password."
                                    : (login.error instanceof Error ? login.error.message : "An error occurred during login")
                                }
                            </AlertDescription>
                        </Alert>
                    )}
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        placeholder="Email address"
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

                    <Button
                        type="submit"
                        className="w-full h-12 rounded-full bg-[#f4eadd] text-[#8D7B68] hover:bg-[#eaddcf] border border-[#8D7B68] text-base font-semibold"
                        disabled={login.isPending}
                    >
                        {login.isPending ? "Logging in..." : "Login"}
                    </Button>
                </form>
            </Form>

            <div className="mt-6 text-center">
                <Link href="/sign-up" className="text-[#BCAAA4] hover:underline text-sm">
                    Oops! I've never been here before
                </Link>
            </div>
        </div>
    )
}
