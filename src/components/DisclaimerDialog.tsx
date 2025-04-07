import React from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

const DisclaimerDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="text-amp-gray bg-transparent hover:text-amp-cyan text-xs hover:bg-black hover:underline border-none">
          Disclaimer
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black/60 border-amp-cyan/20 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-amp-cyan font-pixel">Disclaimer</DialogTitle>
        </DialogHeader>
        <div className="text-amp-gray text-sm space-y-4">
          <p>
            The information provided on Rovyk.com ("the Website") is for general informational purposes only. While we strive to keep the content accurate and up-to-date, we make no representations or warranties of any kind, express or implied, regarding the accuracy, completeness, or reliability of the information on the Website.
          </p>
          <p>
            By using the Website, you acknowledge that any reliance on the information provided is at your own risk. In no event shall Rovyk or its affiliates be liable for any loss or damage, including but not limited to indirect or consequential loss or damage, arising from the use of or inability to use the Website or any information provided therein.
          </p>
          <p>
            The Website may contain links to third-party websites for your convenience. We do not endorse and are not responsible for the content of these external sites.
          </p>
          <p>
            All trademarks, service marks, and logos appearing on the Website are the property of their respective owners. Any use of such trademarks without permission is prohibited.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DisclaimerDialog; 