import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";
import { LogOut, User, Crown, LogIn } from 'lucide-react';

interface TokenStatsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogout: () => void;
  onSignIn: () => void;
  userProfile: {
    email: string;
    isSubscribed: boolean;
    subscriptionTier?: 'free' | 'pro' | 'enterprise';
  };
  tokenUsage: {
    total: number;
    limit: number;
    remaining: number;
  };
  isAuthenticated: boolean;
}

const TokenStatsDialog = ({ 
  open, 
  onOpenChange, 
  onLogout,
  onSignIn,
  userProfile,
  tokenUsage,
  isAuthenticated
}: TokenStatsDialogProps) => {
  const usagePercentage = (tokenUsage.total / tokenUsage.limit) * 100;

  const handleLogout = () => {
    onLogout();
    onOpenChange(false);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const handleSignIn = () => {
    onSignIn();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-amp-blue border-2 border-amp-cyan text-amp-cyan p-6 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-pixel mb-2 text-center">User Profile & Token Usage</DialogTitle>
          <DialogDescription className="text-center text-amp-gray">
            Manage your account and monitor token usage
          </DialogDescription>
        </DialogHeader>

        {/* User Profile Section */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center space-x-3 p-3 bg-amp-dark-blue rounded-lg border border-amp-cyan">
            <User className="w-5 h-5 text-amp-cyan" />
            <div>
              <p className="text-sm font-mono">{userProfile.email || 'Not signed in'}</p>
              <div className="flex items-center space-x-2">
                {isAuthenticated ? (
                  userProfile.isSubscribed ? (
                    <>
                      <Crown className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm text-yellow-400">
                        {userProfile.subscriptionTier?.charAt(0).toUpperCase()}{userProfile.subscriptionTier?.slice(1)} Plan
                      </span>
                    </>
                  ) : (
                    <span className="text-sm text-amp-gray">Free Plan</span>
                  )
                ) : (
                  <span className="text-sm text-amp-gray">No active plan</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Token Usage Section */}
        {isAuthenticated && (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-amp-cyan">Token Usage</span>
                <span className="text-amp-gray">
                  {tokenUsage.total.toLocaleString()} / {tokenUsage.limit.toLocaleString()}
                </span>
              </div>
              <Progress value={usagePercentage} className="h-2 bg-amp-dark-blue" />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-amp-dark-blue p-3 rounded-lg border border-amp-cyan">
                <p className="text-amp-gray">Total Used</p>
                <p className="text-amp-cyan font-mono">{tokenUsage.total.toLocaleString()}</p>
              </div>
              <div className="bg-amp-dark-blue p-3 rounded-lg border border-amp-cyan">
                <p className="text-amp-gray">Remaining</p>
                <p className="text-amp-cyan font-mono">{tokenUsage.remaining.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="mt-6">
          {isAuthenticated ? (
            <Button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          ) : (
            <Button
              onClick={handleSignIn}
              className="bg-amp-cyan text-amp-blue hover:bg-amp-cyan/90"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TokenStatsDialog;
