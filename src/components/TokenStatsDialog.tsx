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
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { LogOut, User, Crown, LogIn, Edit2, Save, X, HelpCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import SupportDialog from './SupportDialog';

interface TokenStatsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogout: () => void;
  onSignIn: () => void;
  userProfile: {
    id: string;
    email: string;
    full_name: string;
    is_subscribed: boolean;
    subscription_tier: string;
    token_usage: {
      total: number;
      limit: number;
      remaining: number;
    };
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
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(userProfile.full_name || '');
  const [showSupportDialog, setShowSupportDialog] = useState(false);

  const usagePercentage = (tokenUsage.total / tokenUsage.limit) * 100;

  const handleLogout = () => {
    onLogout();
    onOpenChange(false);
    toast.success("Logged out", {
      description: "You have been successfully logged out.",
      position: "bottom-center",
    });
  };

  const handleSignIn = () => {
    onSignIn();
    onOpenChange(false);
  };

  const handleNameUpdate = async () => {
    try {
      // First, check if the profile exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userProfile.id)
        .single();

      if (fetchError) {
        console.error('Error fetching profile:', fetchError);
        throw fetchError;
      }

      // Update the profile with the new name
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          full_name: editedName,
          updated_at: new Date().toISOString()
        })
        .eq('id', userProfile.id);

      if (updateError) {
        console.error('Error updating profile:', updateError);
        throw updateError;
      }

      // Refresh the profile data
      const { data: updatedProfile, error: refreshError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userProfile.id)
        .single();

      if (refreshError) {
        console.error('Error refreshing profile:', refreshError);
        throw refreshError;
      }

      // Update the local state with the new profile data
      if (updatedProfile) {
        setEditedName(updatedProfile.full_name || '');
        setIsEditingName(false);
        toast('Name updated successfully', {
          style: {
            background: '#4CAF50',
            color: '#fff',
          },
          position: "bottom-center",
        });
      }
    } catch (error) {
      console.error('Error updating name:', error);
      toast('Failed to update name', {
        style: {
          background: '#f44336',
          color: '#fff',
        },
        position: "bottom-center",
      });
    }
  };

  return (
    <>
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
              <div className="flex-1">
                {isEditingName ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="bg-amp-blue border border-amp-cyan text-amp-cyan px-2 py-1 rounded flex-1"
                      placeholder="Enter your name"
                    />
                    <button
                      onClick={handleNameUpdate}
                      className="text-green-500 hover:text-green-400"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingName(false);
                        setEditedName(userProfile.full_name || '');
                      }}
                      className="text-red-500 hover:text-red-400"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-mono">{userProfile.full_name || 'Set your name'}</p>
                      <p className="text-sm font-mono text-amp-gray">{userProfile.email || 'Not signed in'}</p>
                    </div>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="text-amp-cyan hover:text-amp-gray"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <div className="flex items-center space-x-2 mt-1">
                  {isAuthenticated ? (
                    userProfile.is_subscribed ? (
                      <>
                        <Crown className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-yellow-400">
                          {userProfile.subscription_tier?.charAt(0).toUpperCase()}{userProfile.subscription_tier?.slice(1)} Plan
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

          <DialogFooter className="flex justify-between mt-6">
            <Button
              onClick={() => setShowSupportDialog(true)}
              className="bg-amp-dark-blue text-amp-cyan hover:bg-amp-gray/20"
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              Support
            </Button>
            {isAuthenticated ? (
              <Button
                onClick={handleLogout}
                className="bg-amp-dark-blue text-amp-cyan hover:bg-amp-gray/20"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            ) : (
              <Button
                onClick={handleSignIn}
                className="bg-amp-dark-blue text-amp-cyan hover:bg-amp-gray/20"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <SupportDialog
        open={showSupportDialog}
        onOpenChange={setShowSupportDialog}
        userEmail={userProfile.email}
        userName={userProfile.full_name}
      />
    </>
  );
};

export default TokenStatsDialog;