import React from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

const PrivacyDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
      <Button className="text-amp-gray bg-transparent hover:text-amp-cyan text-xs hover:bg-black hover:underline border-none">
          Privacy Policy
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black/60 border-amp-cyan/20 max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-amp-cyan font-pixel">Privacy Policy</DialogTitle>
        </DialogHeader>
        <div className="text-amp-gray text-sm space-y-6">
          <div className="text-center">
            <p className="font-bold">Effective Date: April 2025</p>
          </div>
          
          <p>
            Rovyk Technologies Pvt. Ltd. ("Rovyk", "we", "our", or "us") respects your privacy and is committed to protecting your personal data. This Privacy Policy outlines how we collect, use, store, and disclose your information when you use our website (<a href="https://rovyk.com" className="text-amp-cyan hover:underline">https://rovyk.com</a>) and related services ("Services").
          </p>
          
          <p>
            Please read this policy carefully. By accessing or using our Services, you agree to the practices described herein.
          </p>

          <div className="space-y-4">
            <h3 className="text-amp-cyan font-bold">1. Information We Collect</h3>
            <p>We may collect and process the following categories of information:</p>
            
            <h4 className="text-amp-cyan font-semibold">a) Personal Information</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Full name</li>
              <li>Email address</li>
              <li>Company or organization name</li>
              <li>Contact details</li>
              <li>Payment and billing information (if applicable)</li>
            </ul>

            <h4 className="text-amp-cyan font-semibold">b) Technical and Usage Data</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Device identifiers</li>
              <li>Operating system</li>
              <li>Usage logs (pages visited, features used, time spent)</li>
            </ul>

            <h4 className="text-amp-cyan font-semibold">c) Content Data</h4>
            <p>Any documents, prompts, or text inputs you upload or generate using Rovyk's tools</p>

            <h3 className="text-amp-cyan font-bold">2. How We Use Your Information</h3>
            <p>We process your information for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>To provide, operate, and maintain the Services</li>
              <li>To personalize user experience and improve performance</li>
              <li>To communicate with you regarding updates, support, or marketing (where permitted)</li>
              <li>To process transactions and manage user accounts</li>
              <li>To detect, investigate, and prevent security incidents or fraudulent activity</li>
              <li>To comply with legal obligations</li>
            </ul>

            <h3 className="text-amp-cyan font-bold">3. Legal Basis for Processing (EU/EEA Users)</h3>
            <p>For users located in the European Union or European Economic Area, we rely on the following legal bases under the GDPR:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Performance of a contract</li>
              <li>Legitimate interests</li>
              <li>Compliance with legal obligations</li>
              <li>Consent (where required)</li>
            </ul>

            <h3 className="text-amp-cyan font-bold">4. Sharing of Data</h3>
            <p>We do not sell your personal information. We may share your data with:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Trusted third-party service providers (e.g., hosting, analytics, payment processors)</li>
              <li>Legal or regulatory authorities, where required by law</li>
              <li>Acquiring entities, in the event of a merger, acquisition, or sale of assets (with notice to users)</li>
            </ul>
            <p>All third-party vendors are bound by confidentiality and data protection agreements.</p>

            <h3 className="text-amp-cyan font-bold">5. Data Security</h3>
            <p>We implement appropriate technical and organizational measures to protect your data, including:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>SSL encryption</li>
              <li>Access control protocols</li>
              <li>Secure data storage and backups</li>
            </ul>
            <p>While we strive to protect your data, no system is completely secure. Users are responsible for maintaining the security of their own login credentials.</p>

            <h3 className="text-amp-cyan font-bold">6. Data Retention</h3>
            <p>We retain personal data only as long as necessary for the purposes outlined above or as required by law. You may request deletion of your data by contacting us directly.</p>

            <h3 className="text-amp-cyan font-bold">7. International Transfers</h3>
            <p>If you access our Services from outside India, please note your data may be transferred to and processed in India or other jurisdictions. We ensure such transfers are made with appropriate safeguards, in compliance with applicable data protection laws.</p>

            <h3 className="text-amp-cyan font-bold">8. Your Rights</h3>
            <p>Depending on your jurisdiction, you may have the right to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Access or request a copy of your personal data</li>
              <li>Correct or update inaccurate information</li>
              <li>Request deletion of your data</li>
              <li>Object to or restrict processing</li>
              <li>Withdraw consent (where applicable)</li>
            </ul>
            <p>To exercise these rights, please contact us at <a href="mailto:support@ampvc.co" className="text-amp-cyan hover:underline">support@ampvc.co</a>.</p>

            <h3 className="text-amp-cyan font-bold">9. Cookies & Tracking Technologies</h3>
            <p>We use cookies and similar technologies to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Maintain sessions and preferences</li>
              <li>Analyze usage and improve services</li>
              <li>Measure marketing performance</li>
            </ul>
            <p>You may control cookie settings through your browser. For more details, please refer to our Cookie Policy.</p>

            <h3 className="text-amp-cyan font-bold">10. Children's Privacy</h3>
            <p>Our Services are not directed to children under 13. We do not knowingly collect personal information from minors. If you believe a child has provided us with personal data, please contact us to have it removed.</p>

            <h3 className="text-amp-cyan font-bold">11. Changes to This Privacy Policy</h3>
            <p>We reserve the right to update this Privacy Policy at any time. Any significant changes will be communicated via email or website notification. Continued use of the Services after such updates constitutes acceptance of the revised policy.</p>

            <h3 className="text-amp-cyan font-bold">12. Contact Us</h3>
            <p>For any questions regarding this Privacy Policy or our data practices, please contact:</p>
            <ul className="list-none space-y-1">
              <li>📧 Email: <a href="mailto:support@ampvc.co" className="text-amp-cyan hover:underline">support@ampvc.co</a></li>
              <li>🌐 Website: <a href="https://rovyk.com" className="text-amp-cyan hover:underline">https://rovyk.com</a></li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrivacyDialog; 