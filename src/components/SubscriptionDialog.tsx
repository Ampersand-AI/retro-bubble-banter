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
import { Crown, Check } from 'lucide-react';

interface SubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubscribe: (tier: 'plus' | 'ultra') => void;
}

const SubscriptionDialog = ({ open, onOpenChange, onSubscribe }: SubscriptionDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-amp-blue border-2 border-amp-cyan text-amp-cyan p-6 max-w-2xl">
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
          <div className="bg-amp-dark-blue p-6 rounded-lg border border-amp-cyan hover:border-yellow-400 transition-colors">
            <h3 className="text-lg font-mono mb-4 text-center">Rovyk Plus</h3>
            <div className="text-2xl font-pixel text-yellow-400 text-center mb-4">$8.99</div>
            <div className="text-sm text-amp-gray text-center mb-6">200,000 tokens</div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-sm">200,000 tokens per month</span>
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
              onClick={() => onSubscribe('plus')}
              className="w-full bg-yellow-400 text-amp-blue hover:bg-yellow-500"
            >
              Select Plus Plan
            </Button>
          </div>

          {/* Ultra Plan */}
          <div className="bg-amp-dark-blue p-6 rounded-lg border-2 border-yellow-400 hover:border-yellow-300 transition-colors relative">
            <div className="absolute -top-3 right-4 bg-yellow-400 text-amp-blue px-2 py-1 rounded text-xs font-pixel">
              BEST VALUE
            </div>
            <h3 className="text-lg font-mono mb-4 text-center">Rovyk Ultra</h3>
            <div className="text-2xl font-pixel text-yellow-400 text-center mb-4">$14.99</div>
            <div className="text-sm text-amp-gray text-center mb-6">500,000 tokens</div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-sm">500,000 tokens per month</span>
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
              onClick={() => onSubscribe('ultra')}
              className="w-full bg-yellow-400 text-amp-blue hover:bg-yellow-500"
            >
              Select Ultra Plan
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionDialog; 