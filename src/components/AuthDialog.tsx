import React, { useState } from 'react';
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log('Attempting sign in for email:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        throw error;
      }

      if (!data.user) {
        console.error('No user data returned after sign in');
        throw new Error('No user data returned');
      }

      console.log('Sign in successful, fetching user profile');
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match!",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('Attempting sign up for email:', email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error('Sign up error:', error);
        throw error;
      }

      if (!data.user) {
        console.error('No user data returned after sign up');
        throw new Error('No user data returned');
      }

      console.log('Sign up successful, waiting for profile creation');
      // Wait for the trigger to create the profile
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('Fetching user profile');
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-amp-blue border-2 border-amp-cyan text-amp-cyan p-6 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-pixel mb-2 text-center">Welcome to Zack AI</DialogTitle>
          <DialogDescription className="text-center text-amp-gray">
            Sign in or create an account to continue
          </DialogDescription>
        </DialogHeader>

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
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-amp-cyan">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-amp-blue border-amp-cyan text-amp-cyan"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-amp-cyan">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-amp-blue border-amp-cyan text-amp-cyan"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-amp-cyan text-amp-blue hover:bg-amp-cyan/90"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-email" className="text-amp-cyan">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-amp-blue border-amp-cyan text-amp-cyan"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password" className="text-amp-cyan">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-amp-blue border-amp-cyan text-amp-cyan"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-amp-cyan">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-amp-blue border-amp-cyan text-amp-cyan"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-amp-cyan text-amp-blue hover:bg-amp-cyan/90"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Sign Up"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog; 