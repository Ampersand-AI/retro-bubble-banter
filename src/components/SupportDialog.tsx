import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from 'lucide-react';
import { toast } from "sonner";
import { sendSupportEmail } from '@/api/support';

interface SupportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userEmail?: string;
  userName?: string;
}

const SupportDialog = ({ open, onOpenChange, userEmail, userName }: SupportDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  // Update form data when dialog opens or user details change
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      name: userName || '',
      email: userEmail || ''
    }));
  }, [open, userName, userEmail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await sendSupportEmail(formData);

      toast.success("Support Request Sent", {
        description: "We'll get back to you as soon as possible.",
        position: "bottom-center",
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error sending support request:', error);
      toast.error("Error", {
        description: error instanceof Error ? error.message : "Failed to send support request. Please try again.",
        position: "bottom-center",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-amp-blue border-2 border-amp-cyan text-amp-cyan p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-pixel mb-2 text-center">Support Request</DialogTitle>
          <DialogDescription className="text-center text-amp-gray">
            Send us your message and we'll get back to you soon
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-mono">Name</label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="bg-amp-dark-blue border-amp-cyan text-black"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-mono">Email</label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="bg-amp-dark-blue border-amp-cyan text-black"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-mono">Message</label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              className="bg-amp-dark-blue border-amp-cyan min-h-[100px] text-black"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-yellow-400 text-amp-blue hover:bg-yellow-500"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              'Send Support Request'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SupportDialog; 