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

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAuthSuccess: (userProfile: {
    email: string;
    isSubscribed: boolean;
    subscriptionTier?: 'free' | 'pro' | 'enterprise';
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
      // Here you would implement actual sign-in logic
      // For now, we'll just simulate a successful sign-in
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a user profile
      const userProfile = {
        email,
        isSubscribed: false,
        subscriptionTier: 'free' as const
      };
      
      onAuthSuccess(userProfile);
      onOpenChange(false);
      
      toast({
        title: "Success",
        description: "You have successfully signed in!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign in. Please try again.",
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
      // Here you would implement actual sign-up logic
      // For now, we'll just simulate a successful sign-up
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a user profile
      const userProfile = {
        email,
        isSubscribed: false,
        subscriptionTier: 'free' as const
      };
      
      onAuthSuccess(userProfile);
      onOpenChange(false);
      
      toast({
        title: "Success",
        description: "Account created successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create account. Please try again.",
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