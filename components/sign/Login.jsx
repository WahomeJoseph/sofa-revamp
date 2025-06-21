
"use client"

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Toaster } from "sonner";

export default function Index() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            })
            if (res?.ok) {
                toast.success("Welcome back to SofaLux!", {
                    duration: 3000,
                })
                const callbackUrl = new 
                URLSearchParams(window.location.search).get('callbackUrl') || '/shop'
                router.push(callbackUrl)
            } else {
                setError(
                    res?.error === "AccessDenied"
                        ? "Invalid email or password. Please try again."
                        : "Failed to login. Please try again.",
                )
                toast.error(error, "Login failed", { duration: 3000 })
            }
        } catch (error) {
            console.error(error)
            toast.error("An unexpected error occurred", { duration: 3000 })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <ThemeProvider defaultTheme="light">
            <Toaster position="top-center" richColors/>
            <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/30 flex items-center justify-center p-4 relative overflow-hidden">
                <div className="absolute top-6 right-6 z-20">
                    <ThemeToggle />
                </div>
                <div className="w-full max-w-md space-y-8 relative z-10">
                    {/* Enhanced Logo/Brand */}
                    {/* <div className="text-center animate-fade-in">
                        <p className="text-muted-foreground text-lg font-medium">Welcome back to your premium experience</p>
                        <p className="text-muted-foreground/70 text-sm mt-1">Sign in to continue your luxury journey</p>
                    </div> */}

                    <Card className="border-0 shadow-2xl bg-card/90 backdrop-blur-xl animate-scale-in relative overflow-hidden">
                        {/* Card glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-50"></div>
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>

                        <CardHeader className="space-y-3 pb-8 relative">
                            <CardTitle className="text-3xl text-center font-bold tracking-tight">Welcome Back to SofaLuxx</CardTitle>
                            <CardDescription className="text-center text-base font-light leading-relaxed">
                                Enter your credentials to access your premium account
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8 relative">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-3">
                                    <label htmlFor="email" className="text-sm font-semibold text-foreground/90 tracking-wide">Email Address</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground group-focus-within:text-primary transition-all duration-300" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="Enter your email address"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="pl-12 h-14 border-0 bg-muted/40 focus:bg-background/80 transition-all duration-300 focus:ring-2 focus:ring-primary/30 rounded-xl text-base shadow-sm hover:shadow-md focus:shadow-lg"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label htmlFor="password" className="text-sm font-semibold text-foreground/90 tracking-wide">Password</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground group-focus-within:text-primary transition-all duration-300" />
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="pl-12 pr-14 h-14 border-0 bg-muted/40 focus:bg-background/80 transition-all duration-300 focus:ring-2 focus:ring-primary/30 rounded-xl text-base shadow-sm hover:shadow-md focus:shadow-lg"
                                            required
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 w-10 hover:bg-primary/10 rounded-lg transition-all duration-200"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-3 w-3 text-muted-foreground" />
                                            ) : (
                                                <Eye className="h-3 w-3 text-muted-foreground" />
                                            )}
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                    <div className="flex items-center space-x-3">
                                        <Checkbox
                                            id="remember"
                                            checked={rememberMe}
                                            onCheckedChange={(checked) => setRememberMe(checked === true)}
                                            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary h-5 w-5 rounded-md shadow-sm"
                                        />
                                        <label htmlFor="remember" className="text-sm text-foreground/80 select-none font-medium">Remember me for 30 days</label>
                                    </div>
                                    <button type="button" className="text-sm text-primary hover:text-primary/80 font-semibold transition-colors hover:underline">
                                        Forgot password?
                                    </button>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-14 bg-gray-900 text-white font-semibold text-base transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl rounded-xl"
                                    disabled={isLoading}>
                                    {isLoading ? (
                                        <div className="flex items-center space-x-3">
                                            <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                                            <span>Signing you in...</span>
                                        </div>
                                    ) : (
                                        "Sign in to your account"
                                    )}
                                </Button>
                            </form>

                            <div className="space-y-6">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t border-border/60" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-card px-6 text-muted-foreground font-semibold tracking-wider">Or continue with</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <Button
                                        variant="outline"
                                        className="h-12 border-border/60 hover:bg-muted/60 hover:border-border transition-all duration-300 hover:scale-[1.02] rounded-xl shadow-sm hover:shadow-md"
                                        onClick={() => alert("Google login not implemented yet")}>
                                        <FcGoogle />
                                        <span className="text-sm font-medium">Google</span>
                                    </Button>
                                </div>
                            </div>

                            <div className="text-center pt-2">
                                <p className="text-center text-sm text-muted-foreground mt-6">
                                    Don't have an account?{" "}
                                    <Link href="/register" className="text-primary hover:text-primary/80 font-semibold transition-colors hover:underline">
                                        Sign in
                                    </Link>
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </ThemeProvider>
    );
}