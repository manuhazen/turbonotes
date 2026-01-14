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
import { useRegister, useLogin } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
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

export default function SignUpClient() {
    const router = useRouter()
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
                                        placeholder="Email address"
                                        className="bg-[#F9F4E8] border-[#D7CCC8] h-12"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="text-red-500" />
                            </FormItem>
                        )}
                    />
                    {register.isError && (
                        <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>
                                {(register.error as any)?.response?.data?.email
                                    ? "This email address is already in use. Maybe you want to login instead?"
                                    : (register.error instanceof Error ? register.error.message : "Registration failed")}
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
                    >
                        Sign Up
                    </Button>
                </form>
            </Form>

            <div className="mt-6 text-center">
                <Link href="/sign-in" className="text-[#BCAAA4] hover:underline text-sm">
                    We're already friends!
                </Link>
            </div>
        </div>
    )
}
