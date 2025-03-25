import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { handlePaymentSuccess } from '../api/stripe';
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from 'lucide-react';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const processPayment = async () => {
      try {
        const sessionId = searchParams.get('session_id');
        if (!sessionId) {
          throw new Error('No session ID found');
        }

        await handlePaymentSuccess(sessionId);
        
        toast({
          title: "Success!",
          description: "Your subscription has been activated. Enjoy your tokens!",
        });

        // Redirect to home page after 3 seconds
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } catch (error) {
        console.error('Error processing payment:', error);
        toast({
          title: "Error",
          description: "There was an error processing your payment. Please contact support.",
          variant: "destructive",
        });
        // Redirect to home page after showing error
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }
    };

    processPayment();
  }, [searchParams, navigate, toast]);

  return (
    <div className="min-h-screen bg-amp-blue flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-yellow-400 animate-spin mx-auto mb-4" />
        <h1 className="text-2xl font-pixel text-amp-cyan mb-2">Processing your payment...</h1>
        <p className="text-amp-gray">Please wait while we activate your subscription.</p>
      </div>
    </div>
  );
};

export default PaymentSuccess; 