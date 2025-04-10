import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail, Github } from "lucide-react";
import { cn } from "@/lib/utils";

// Validation schemas
const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

const signUpSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(16, "Password must be at most 16 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const resetPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const newPasswordSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(16, "Password must be at most 16 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SignInForm = z.infer<typeof signInSchema>;
type SignUpForm = z.infer<typeof signUpSchema>;
type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;
type NewPasswordForm = z.infer<typeof newPasswordSchema>;

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAuthSuccess: (userProfile: {
    id: string;
    email: string;
    is_subscribed: boolean;
    subscription_tier?: 'free' | 'pro' | 'enterprise';
  }) => void;
}

const AuthDialog = ({ open, onOpenChange, onAuthSuccess }: AuthDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isResetPasswordMode, setIsResetPasswordMode] = useState(false);
  const [isNewPasswordMode, setIsNewPasswordMode] = useState(false);

  // Sign In Form
  const signInForm = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    mode: "onBlur",
  });

  // Sign Up Form
  const signUpForm = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    mode: "onBlur",
  });

  // Reset Password Form
  const resetPasswordForm = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onBlur",
  });

  // New Password Form
  const newPasswordForm = useForm<NewPasswordForm>({
    resolver: zodResolver(newPasswordSchema),
    mode: "onBlur",
  });

  useEffect(() => {
    // Check if we're in the reset password flow
    const params = new URLSearchParams(window.location.search);
    const next = params.get('next');
    if (next === '/reset-password') {
      setIsNewPasswordMode(true);
      onOpenChange(true);
    }
  }, [onOpenChange]);

  const handleResetPassword = async (data: ResetPasswordForm) => {
    setIsLoading(true);
    
    try {
      // Get the current origin and redirect to chat page
      const redirectUrl = `${window.location.origin}/chat?next=/reset-password`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: redirectUrl,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Check your email",
        description: "We've sent you a password reset link. Please check your email and follow the instructions.",
      });
      
      setIsResetPasswordMode(false);
      resetPasswordForm.reset();
    } catch (error: any) {
      console.error('Reset password error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send reset password email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (data: SignInForm) => {
    setIsLoading(true);
    
    try {
      console.log('Attempting sign in for email:', data.email);
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        console.error('Sign in error:', error);
        if (error.message.includes('Invalid login credentials')) {
          toast({
            title: "Error",
            description: "Invalid email or password. Please try again.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
        return;
      }

      if (!authData.user) {
        console.error('No user data returned after sign in');
        throw new Error('No user data returned');
      }

      console.log('Sign in successful, fetching user profile');
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        throw profileError;
      }

      if (!profile) {
        console.error('No profile found for user');
        throw new Error('No profile found');
      }

      console.log('Profile fetched successfully:', profile);
      onAuthSuccess(profile);
      onOpenChange(false);
      
      toast({
        title: "Success",
        description: "You have successfully signed in!",
      });
    } catch (error: any) {
      console.error('Sign in process failed:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to sign in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (data: SignUpForm) => {
    setIsLoading(true);
    
    try {
      // First check if user exists in auth
      const { data: { user: existingUser }, error: checkError } = await supabase.auth.getUser();

      if (existingUser) {
        toast({
          title: "Error",
          description: "User already registered. Please sign in.",
          variant: "destructive",
        });
        // Switch to sign in tab
        const signInTab = document.querySelector('[value="signin"]');
        if (signInTab) {
          (signInTab as HTMLElement).click();
        }
        return;
      }

      console.log('Attempting sign up for email:', data.email);
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        console.error('Sign up error:', error);
        if (error.message.includes('User already registered')) {
          toast({
            title: "Error",
            description: "User already registered. Please sign in.",
            variant: "destructive",
          });
          // Switch to sign in tab
          const signInTab = document.querySelector('[value="signin"]');
          if (signInTab) {
            (signInTab as HTMLElement).click();
          }
        } else {
          throw error;
        }
        return;
      }

      if (!authData.user) {
        console.error('No user data returned after sign up');
        throw new Error('No user data returned');
      }

      // Check if email confirmation is required
      if (authData.session === null) {
        console.log('Email confirmation required');
        toast({
          title: "Check your email",
          description: "We've sent you a confirmation email. Please check your inbox and click the confirmation link to complete your registration.",
        });
        onOpenChange(false);
        return;
      }

      console.log('Sign up successful, waiting for profile creation');
      
      // Add retry logic for profile creation
      let profile = null;
      let retryCount = 0;
      const maxRetries = 5;
      
      while (!profile && retryCount < maxRetries) {
        try {
          console.log(`Attempt ${retryCount + 1} to fetch profile`);
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select()
            .eq('id', authData.user.id)
            .maybeSingle();

          if (profileError) {
            console.error('Profile fetch error:', profileError);
            throw profileError;
          }

          if (profileData) {
            profile = profileData;
            break;
          }

          console.log('Profile not ready yet, retrying...');
          await new Promise(resolve => setTimeout(resolve, 2000));
          retryCount++;
        } catch (err: any) {
          console.error('Error during profile fetch:', err);
          if (err.code === 'PGRST116') {
            console.log('Profile not found yet, retrying...');
            await new Promise(resolve => setTimeout(resolve, 2000));
            retryCount++;
            continue;
          }
          throw err;
        }
      }

      if (!profile) {
        console.error('Failed to fetch profile after multiple attempts');
        toast({
          title: "Account Created",
          description: "Your account has been created. Please check your email for confirmation and then sign in to continue.",
        });
        onOpenChange(false);
        return;
      }

      console.log('Profile fetched successfully:', profile);
      onAuthSuccess(profile);
      onOpenChange(false);
      
      toast({
        title: "Success",
        description: "Account created successfully!",
      });
    } catch (error: any) {
      console.error('Sign up process failed:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewPassword = async (data: NewPasswordForm) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Your password has been updated successfully!",
      });
      
      setIsNewPasswordMode(false);
      newPasswordForm.reset();
      onOpenChange(false);
      
      // Redirect to chat page
      window.location.href = '/chat';
    } catch (error: any) {
      console.error('Update password error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;

      // The OAuth flow will redirect to the callback URL
      // The callback will handle the user creation and profile setup
      // We don't need to handle the user data here as it will be handled in the callback
    } catch (error: any) {
      console.error('Google sign in error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to sign in with Google. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;

      // The OAuth flow will redirect to the callback URL
      // The callback will handle the user creation and profile setup
    } catch (error: any) {
      console.error('GitHub sign in error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to sign in with GitHub. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-amp-blue border-2 border-amp-cyan text-amp-cyan p-6 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-pixel mb-2 text-center">Welcome to Rovyk</DialogTitle>
          <DialogDescription className="text-center text-amp-gray">
            {isNewPasswordMode 
              ? "Set your new password"
              : isResetPasswordMode 
                ? "Enter your email to reset your password"
                : "Sign in or create an account to continue"}
          </DialogDescription>
        </DialogHeader>

        {isNewPasswordMode ? (
          <form onSubmit={newPasswordForm.handleSubmit(handleNewPassword)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password" className="text-amp-cyan">New Password</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your new password"
                  {...newPasswordForm.register("password")}
                  className={cn(
                    "bg-amp-blue border-amp-cyan text-amp-cyan",
                    newPasswordForm.formState.errors.password && "border-red-500"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-amp-cyan hover:text-amp-cyan/80"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {newPasswordForm.formState.errors.password && (
                <p className="text-sm text-red-500">
                  {newPasswordForm.formState.errors.password.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-new-password" className="text-amp-cyan">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirm-new-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your new password"
                  {...newPasswordForm.register("confirmPassword")}
                  className={cn(
                    "bg-amp-blue border-amp-cyan text-amp-cyan",
                    newPasswordForm.formState.errors.confirmPassword && "border-red-500"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-amp-cyan hover:text-amp-cyan/80"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {newPasswordForm.formState.errors.confirmPassword && (
                <p className="text-sm text-red-500">
                  {newPasswordForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>
            <Button 
              type="submit" 
              className="w-full bg-amp-cyan text-amp-blue hover:bg-amp-cyan/90" 
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update Password"}
            </Button>
          </form>
        ) : isResetPasswordMode ? (
          <form onSubmit={resetPasswordForm.handleSubmit(handleResetPassword)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email" className="text-amp-cyan">Email</Label>
              <Input
                id="reset-email"
                type="email"
                placeholder="Enter your email"
                {...resetPasswordForm.register("email")}
                className={cn(
                  "bg-amp-blue border-amp-cyan text-amp-cyan",
                  resetPasswordForm.formState.errors.email && "border-red-500"
                )}
              />
              {resetPasswordForm.formState.errors.email && (
                <p className="text-sm text-red-500">
                  {resetPasswordForm.formState.errors.email.message}
                </p>
              )}
            </div>
            <div className='grid grid-cols-2 justify-center gap-4'>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsResetPasswordMode(false)}
                disabled={isLoading}
                className="text-amp-cyan border-amp-cyan bg-transparent hover:bg-transparent hover:text-amp-cyan/80"
              >
                Back to Sign In
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-amp-cyan text-amp-blue hover:bg-amp-cyan/90"
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>
            </div>
          </form>
        ) : (
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-amp-blue border border-amp-cyan">
              <TabsTrigger value="signin" className="text-amp-cyan data-[state=active]:bg-amp-cyan data-[state=active]:text-amp-blue">
                Sign In
              </TabsTrigger>
              <TabsTrigger value="signup" className="text-amp-cyan data-[state=active]:bg-amp-cyan data-[state=active]:text-amp-blue">
                Sign Up
              </TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={handleGoogleSignIn}
                    className="w-full bg-white text-gray-800 hover:bg-gray-100 flex items-center justify-center gap-2"
                    disabled={isLoading}
                  >
                    <img src="/images/google-icon.png" alt="Google" className="w-5 h-5" />
                    Google
                  </Button>
                  <Button
                    onClick={handleGithubSignIn}
                    className="w-full bg-[#24292e] text-white hover:bg-[#24292e]/90 flex items-center justify-center gap-2"
                    disabled={isLoading}
                  >
                    <Github size={20} />
                    GitHub
                  </Button>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-amp-cyan/50"></span>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-amp-blue px-2 text-amp-cyan/50">Or continue with email</span>
                  </div>
                </div>
                <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email" className="text-amp-cyan">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="Enter your email"
                      {...signInForm.register("email")}
                      className={cn(
                        "bg-amp-blue border-amp-cyan text-amp-cyan",
                        signInForm.formState.errors.email && "border-red-500"
                      )}
                    />
                    {signInForm.formState.errors.email && (
                      <p className="text-sm text-red-500">
                        {signInForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password" className="text-amp-cyan">Password</Label>
                    <div className="relative">
                      <Input
                        id="signin-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        {...signInForm.register("password")}
                        className={cn(
                          "bg-amp-blue border-amp-cyan text-amp-cyan",
                          signInForm.formState.errors.password && "border-red-500"
                        )}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-amp-cyan hover:text-amp-cyan/80"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {signInForm.formState.errors.password && (
                      <p className="text-sm text-red-500">
                        {signInForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <Button
                      type="button"
                      variant="link"
                      className="text-sm text-amp-cyan hover:text-amp-cyan/80 px-0"
                      onClick={() => setIsResetPasswordMode(true)}
                    >
                      Forgot Password?
                    </Button>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-amp-cyan text-amp-blue hover:bg-amp-cyan/90" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </div>
            </TabsContent>
            <TabsContent value="signup">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={handleGoogleSignIn}
                    className="w-full bg-white text-gray-800 hover:bg-gray-100 flex items-center justify-center gap-2"
                    disabled={isLoading}
                  >
                    <img src="/images/google-icon.png" alt="Google" className="w-5 h-5" />
                    Google
                  </Button>
                  <Button
                    onClick={handleGithubSignIn}
                    className="w-full bg-[#24292e] text-white hover:bg-[#24292e]/90 flex items-center justify-center gap-2"
                    disabled={isLoading}
                  >
                    <Github size={20} />
                    GitHub
                  </Button>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-amp-cyan/50"></span>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-amp-blue px-2 text-amp-cyan/50">Or continue with email</span>
                  </div>
                </div>
                <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-amp-cyan">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      {...signUpForm.register("email")}
                      className={cn(
                        "bg-amp-blue border-amp-cyan text-amp-cyan",
                        signUpForm.formState.errors.email && "border-red-500"
                      )}
                    />
                    {signUpForm.formState.errors.email && (
                      <p className="text-sm text-red-500">
                        {signUpForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-amp-cyan">Password</Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        {...signUpForm.register("password")}
                        className={cn(
                          "bg-amp-blue border-amp-cyan text-amp-cyan",
                          signUpForm.formState.errors.password && "border-red-500"
                        )}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-amp-cyan hover:text-amp-cyan/80"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {signUpForm.formState.errors.password && (
                      <p className="text-sm text-red-500">
                        {signUpForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm-password" className="text-amp-cyan">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="signup-confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        {...signUpForm.register("confirmPassword")}
                        className={cn(
                          "bg-amp-blue border-amp-cyan text-amp-cyan",
                          signUpForm.formState.errors.confirmPassword && "border-red-500"
                        )}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-amp-cyan hover:text-amp-cyan/80"
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {signUpForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-red-500">
                        {signUpForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-amp-cyan text-amp-blue hover:bg-amp-cyan/90" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating account..." : "Sign Up"}
                  </Button>
                </form>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog; 