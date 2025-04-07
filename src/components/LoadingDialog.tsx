import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingDialogProps {
  isOpen: boolean;
  message?: string;
}

const LoadingDialog = ({ isOpen, message = "Generating prompt..." }: LoadingDialogProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-black/80 p-6 rounded-lg border border-amp-cyan/20 flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 text-amp-cyan animate-spin" />
        <p className="text-amp-cyan font-pixel">{message}</p>
      </div>
    </div>
  );
};

export default LoadingDialog; 