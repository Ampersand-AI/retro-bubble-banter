import React from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

const TermsDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="text-amp-gray bg-transparent hover:text-amp-cyan text-xs hover:bg-black hover:underline border-none">
          Terms of Use
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black/60 border-amp-cyan/20 max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-amp-cyan font-pixel">Terms of Use</DialogTitle>
        </DialogHeader>
        <div className="text-amp-gray text-sm space-y-6">
          <div className="text-center">
            <p className="font-bold">Effective Date: April 2025</p>
          </div>
          
          <p>
            Welcome to <strong>Rovyk</strong> ("Rovyk", "we", "us", or "our"). These Terms of Use ("Terms") govern your access to and use of our website <a href="https://rovyk.com" className="text-amp-cyan hover:underline">https://rovyk.com</a> and any associated services, software, or content (collectively, the "Services").
          </p>
          
          <p>
            By using our Services, you agree to be bound by these Terms. If you do not agree, please do not use Rovyk.
          </p>

          <div className="space-y-4">
            <h3 className="text-amp-cyan font-bold">1. Eligibility</h3>
            <p>
              You must be at least 18 years old and have the legal capacity to enter into a binding agreement to use Rovyk. If you are accessing Rovyk on behalf of an organization, you represent that you have the authority to bind that organization to these Terms.
            </p>

            <h3 className="text-amp-cyan font-bold">2. Account Registration</h3>
            <p>
              Some features of Rovyk may require account registration. You agree to provide accurate, complete information and keep it updated. You are responsible for maintaining the confidentiality of your account and password.
            </p>

            <h3 className="text-amp-cyan font-bold">3. Acceptable Use</h3>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the Services for any unlawful or harmful purpose.</li>
              <li>Copy, distribute, or exploit any content without permission.</li>
              <li>Interfere with the security or integrity of Rovyk or its users.</li>
              <li>Use automated means to access the Services without our consent.</li>
            </ul>

            <h3 className="text-amp-cyan font-bold">4. Intellectual Property</h3>
            <p>
              All content, software, and materials provided on Rovyk are owned by or licensed to us and are protected by intellectual property laws. You may not use, copy, or distribute our content without prior written permission.
            </p>

            <h3 className="text-amp-cyan font-bold">5. User Content</h3>
            <p>
              You retain ownership of any data or content you input into Rovyk. By using our Services, you grant us a non-exclusive, worldwide license to use your content solely for the purpose of providing and improving the Services.
            </p>

            <h3 className="text-amp-cyan font-bold">6. Subscriptions and Payments</h3>
            <p>
              If Rovyk offers paid plans, fees and billing terms will be disclosed at the time of subscription. By subscribing, you agree to the pricing and billing cycle presented at checkout. You are responsible for canceling your plan if you no longer wish to be billed.
            </p>

            <h3 className="text-amp-cyan font-bold">7. Disclaimers</h3>
            <p>
              Rovyk is provided "as is" and "as available." We do not guarantee the accuracy, reliability, or availability of the Services. Use it at your own risk.
            </p>

            <h3 className="text-amp-cyan font-bold">8. Limitation of Liability</h3>
            <p>
              To the fullest extent permitted by law, Rovyk shall not be liable for any indirect, incidental, special, or consequential damages arising out of your use of the Services.
            </p>

            <h3 className="text-amp-cyan font-bold">9. Termination</h3>
            <p>
              We reserve the right to suspend or terminate your access to Rovyk at any time, for any reason, without notice. You may also discontinue use at any time.
            </p>

            <h3 className="text-amp-cyan font-bold">10. Changes to These Terms</h3>
            <p>
              We may update these Terms occasionally. We'll notify you of major changes, and your continued use of the Services means you accept the updated Terms.
            </p>

            <h3 className="text-amp-cyan font-bold">11. Governing Law</h3>
            <p>
              These Terms are governed by the laws of India. Any disputes shall be resolved in the courts of Pune, India.
            </p>

            <h3 className="text-amp-cyan font-bold">12. Contact Us</h3>
            <p>
              If you have any questions about these Terms, feel free to reach out at: <a href="mailto:support@ampvc.co" className="text-amp-cyan hover:underline">support@ampvc.co</a>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TermsDialog; 