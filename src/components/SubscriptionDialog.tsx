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
import { Crown, Check, Loader2 } from 'lucide-react';
import { createCheckoutSession } from '../api/stripe';
import { useToast } from "@/components/ui/use-toast";
import { loadStripe } from '@stripe/stripe-js';

interface SubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubscribe: (tier: 'plus' | 'ultra') => void;
  userId: string;
}

const SubscriptionDialog = ({ open, onOpenChange, onSubscribe, userId }: SubscriptionDialogProps) => {
  const [loading, setLoading] = useState<'plus' | 'ultra' | null>(null);
  const { toast } = useToast();

  const handleSubscribe = async (tier: 'plus' | 'ultra') => {
    try {
      if (!userId) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to continue with your subscription.",
          variant: "destructive",
        });
        return;
      }

      setLoading(tier);
      const { sessionId } = await createCheckoutSession(tier, userId);
      
      // Redirect to Stripe Checkout
      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) {
          throw error;
        }
      }
    } catch (error) {
      console.error('Error initiating checkout:', error);
      toast({
        title: "Error",
        description: "Failed to initiate checkout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-amp-blue border-2 border-amp-cyan text-amp-cyan p-6 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-pixel mb-2 text-center flex items-center justify-center gap-2">
            <Crown className="w-6 h-6 text-yellow-400" />
            Choose Your Plan
          </DialogTitle>
          <DialogDescription className="text-center text-amp-gray">
            Select a plan that best fits your needs
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          {/* Plus Plan */}
          <div className="bg-amp-dark-blue p-6 rounded-lg border border-amp-cyan hover:border-yellow-400 transition-colors flex flex-col">
            <h3 className="text-lg font-mono mb-4 text-center">Rovyk Plus</h3>
            <div className="text-2xl font-pixel text-yellow-400 text-center mb-4">$8.99</div>
            <div className="text-sm text-amp-gray text-center mb-6">200,000 tokens</div>
            <ul className="space-y-3 mb-6 flex-grow">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-sm">200,000 tokens</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-sm">Access to all premium AI models</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-sm">Priority support</span>
              </li>
            </ul>
            <Button
              onClick={() => handleSubscribe('plus')}
              className="w-full bg-yellow-400 text-amp-blue hover:bg-yellow-500"
              disabled={loading === 'plus'}
            >
              {loading === 'plus' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Select Plus Plan'
              )}
            </Button>
          </div>

          {/* Ultra Plan */}
          <div className="bg-amp-dark-blue p-6 rounded-lg border-2 border-yellow-400 hover:border-yellow-300 transition-colors relative flex flex-col">
            <div className="absolute -top-3 right-4 bg-yellow-400 text-amp-blue px-2 py-1 rounded text-xs font-pixel">
              BEST VALUE
            </div>
            <h3 className="text-lg font-mono mb-4 text-center">Rovyk Ultra</h3>
            <div className="text-2xl font-pixel text-yellow-400 text-center mb-4">$14.99</div>
            <div className="text-sm text-amp-gray text-center mb-6">500,000 tokens</div>
            <ul className="space-y-3 mb-6 flex-grow">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-sm">500,000 tokens</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-sm">Access to all premium AI models</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-sm">Priority support</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-sm">Early access to new features</span>
              </li>
            </ul>
            <Button
              onClick={() => handleSubscribe('ultra')}
              className="w-full bg-yellow-400 text-amp-blue hover:bg-yellow-500"
              disabled={loading === 'ultra'}
            >
              {loading === 'ultra' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Select Ultra Plan'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionDialog; 