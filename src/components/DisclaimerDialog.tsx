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
            This website features content, including text, images, and other media, created by humans (us!) with the assistance of advanced artificial intelligence (AI) technologies.
          </p>
          <p>
            While we work hard to ensure the information is accurate, relevant, and high-quality, it’s important to note that AI tools, while sophisticated, are not flawless and may occasionally generate content that is incorrect, incomplete, or imperfect—just like humans.
          </p>
          <p>
            We encourage critical thinking and recommend independently verifying any information when needed. Though we strive to update and improve content as necessary, there may be instances where outdated or inaccurate information remains. If you come across any errors, we’d love to hear from you!
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DisclaimerDialog; 