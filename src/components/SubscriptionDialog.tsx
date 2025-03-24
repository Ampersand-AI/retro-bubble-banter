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
import { Crown } from 'lucide-react';

interface SubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubscribe: () => void;
}

const SubscriptionDialog = ({ open, onOpenChange, onSubscribe }: SubscriptionDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-amp-blue border-2 border-amp-cyan text-amp-cyan p-6 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-pixel mb-2 text-center flex items-center justify-center gap-2">
            <Crown className="w-6 h-6 text-yellow-400" />
            Upgrade to Premium
          </DialogTitle>
          <DialogDescription className="text-center text-amp-gray">
            You've reached your token limit. Upgrade to continue using premium AI models!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-6">
          <div className="bg-amp-dark-blue p-4 rounded-lg border border-amp-cyan">
            <h3 className="text-lg font-mono mb-2">Premium Benefits</h3>
            <ul className="space-y-2 text-sm">
              <li>• 50,000 tokens per month</li>
              <li>• Access to all premium AI models</li>
              <li>• Priority support</li>
              <li>• Advanced features</li>
            </ul>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button
            onClick={onSubscribe}
            className="bg-yellow-400 text-amp-blue hover:bg-yellow-500"
          >
            Upgrade Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionDialog; 