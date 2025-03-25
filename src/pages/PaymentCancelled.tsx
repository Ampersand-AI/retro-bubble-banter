import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { XCircle } from 'lucide-react';

const PaymentCancelled = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-amp-blue flex items-center justify-center">
      <div className="text-center">
        <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h1 className="text-2xl font-pixel text-amp-cyan mb-2">Payment Cancelled</h1>
        <p className="text-amp-gray mb-6">Your payment was cancelled. No charges were made.</p>
        <Button
          onClick={() => navigate('/')}
          className="bg-yellow-400 text-amp-blue hover:bg-yellow-500"
        >
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default PaymentCancelled; 