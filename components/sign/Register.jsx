'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';
import { FcGoogle } from 'react-icons/fc';

export default function Signup() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')
        if (!acceptTerms) {
            setError('You must accept the terms and conditions');
            setIsLoading(false);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        try {
            console.log('Sending Data:', {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                acceptTerms: acceptTerms
            });
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    acceptTerms: acceptTerms
                })
            });
            const data = await res.json();
            console.log('Response:', data);

            if (!res.ok) {
                throw new Error(data.error || data.message || 'Registration failed');
            }
            toast.success('Account created successfully', { duration: 3000 });
            console.log('Response data:', data);
            router.push('/login');
        } catch (error) {
            console.error('Registration error:', error);
            setError(error.message);
            toast.error(error.message || 'Failed to create account. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }

    const handleOAuthSignIn = (provider) => async () => {
        setIsLoading(true);
        try {
            await signIn(provider, { callbackUrl: '/wishlist' });
        } catch (error) {
            toast.error('Failed to sign in with OAuth');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ThemeProvider defaultTheme="light">
            <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/30 flex items-center justify-center p-4 relative overflow-hidden">
                <div className="absolute top-6 right-6 z-20">
                    <ThemeToggle />
                </div>
                <div className="w-full max-w-md space-y-8 relative z-10">
                    {/* Enhanced Logo/Brand */}
                    <Card className="border-0 shadow-2xl bg-card/90 backdrop-blur-xl animate-scale-in relative overflow-hidden">
                        {/* Card glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-50"></div>
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>

                        <CardHeader className="space-y-2 pb-8 relative">
                            <CardTitle className="text-3xl text-center font-bold tracking-tight">Create you Sofaluxx Account</CardTitle>
                            <CardDescription className="text-center text-base leading-relaxed">
                                Enter your details to join our premium experience
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8 relative">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-3">
                                    <label htmlFor="name" className="text-sm font-semibold text-foreground/90 tracking-wide">Full Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground group-focus-within:text-primary transition-all duration-300" />
                                        <Input
                                            id="name"
                                            name="username"
                                            type="text"
                                            placeholder="John Doe"
                                            value={formData.username}
                                            onChange={handleInputChange}
                                            className="pl-12 h-14 border-0 bg-muted/40 focus:bg-background/80 transition-all duration-300 focus:ring-2 focus:ring-primary/30 rounded-xl text-base shadow-sm hover:shadow-md focus:shadow-lg"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label htmlFor="email" className="text-sm font-semibold text-foreground/90 tracking-wide">Email Address</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground group-focus-within:text-primary transition-all duration-300" />
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="john.doe@example.com"
                                            value={formData.email}
                                            onChange={handleInputChange}
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
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Create a strong password"
                                            value={formData.password}
                                            onChange={handleInputChange}
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
                                            {showPassword ? <EyeOff className="h-3 w-3 text-muted-foreground" /> : <Eye className="h-3 w-3 text-muted-foreground" />}
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label htmlFor="confirmPassword" className="text-sm font-semibold text-foreground/90 tracking-wide">Confirm Password</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground group-focus-within:text-primary transition-all duration-300" />
                                        <Input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            placeholder="Confirm your password"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            className="pl-12 pr-14 h-14 border-0 bg-muted/40 focus:bg-background/80 transition-all duration-300 focus:ring-2 focus:ring-primary/30 rounded-xl text-base shadow-sm hover:shadow-md focus:shadow-lg"
                                            required
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 w-10 hover:bg-primary/10 rounded-lg transition-all duration-200"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                            {showConfirmPassword ? <EyeOff className="h-3 w-3 text-muted-foreground" /> : <Eye className="h-3 w-3 text-muted-foreground" />}
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                    <div className="flex items-center space-x-3">
                                        <Checkbox
                                            id="terms"
                                            checked={acceptTerms}
                                            onCheckedChange={(checked) => setAcceptTerms(checked === true)}
                                            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary h-5 w-5 rounded-md shadow-sm"
                                        />
                                        <label htmlFor="terms" className="text-sm text-foreground/80 select-none font-medium">
                                            I agree to the{' '}
                                            <Link href="/terms" className="text-primary hover:text-primary/80 transition-colors hover:underline">
                                                Terms of Service
                                            </Link>{' '}
                                            and{' '}
                                            <Link href="/privacy" className="text-primary hover:text-primary/80 transition-colors hover:underline">
                                                Privacy Policy
                                            </Link>
                                        </label>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-14 bg-gray-900 text-white font-semibold text-base transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl rounded-xl"
                                    disabled={isLoading}>
                                    {isLoading ? (
                                        <div className="flex items-center space-x-3">
                                            <div className="w-5 h-5 border-2 border-primary-foreground/30  border-t-primary-foreground rounded-full animate-spin"></div>
                                            <span>Creating account...</span>
                                        </div>
                                    ) : (
                                        'Create Account'
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
                                        onClick={handleOAuthSignIn('google')}>
                                        <FcGoogle />
                                        <span className="text-sm font-medium">Google</span>
                                    </Button>
                                </div>
                            </div>

                            <div className="text-center pt-2">
                                <p className="text-center text-sm text-muted-foreground mt-6">
                                    Already have an account?{' '}
                                    <Link href="/login" className="text-primary hover:text-primary/80 font-semibold transition-colors hover:underline">
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