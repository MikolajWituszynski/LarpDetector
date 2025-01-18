import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

const TermsAndConditions = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold mb-2">Terms and Conditions</h1>
          <p className="text-gray-600">Last updated: January 18, 2025</p>
        </div>

        {/* Content */}
        <div className="space-y-8 bg-white p-8 rounded-lg shadow">
          {/* Introduction */}
          <section>
            <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
            <p className="text-gray-700">
              By accessing and using WarOnLarps ("the Tool"), you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access the Tool.
            </p>
          </section>

          {/* Purpose & Scope */}
          <section>
            <h2 className="text-xl font-semibold mb-4">2. Purpose and Scope</h2>
            <p className="text-gray-700 mb-4">
              The Tool is designed to provide analytical insights into GitHub repositories and social media profiles. It is intended for research and informational purposes only.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Key Points:</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Research and analysis purposes only</li>
                <li>Not intended for financial or investment decisions</li>
                <li>No guarantee of accuracy or completeness</li>
                <li>Past performance does not indicate future results</li>
              </ul>
            </div>
          </section>

          {/* Disclaimers */}
          <section>
            <h2 className="text-xl font-semibold mb-4">3. Disclaimers</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">3.1 Not Financial Advice</h3>
                <p className="text-gray-700">
                  The Tool does not provide financial, investment, legal, or tax advice. Any insights, analyses, or information provided through the Tool should not be construed as professional advice. Users should consult qualified professionals before making any investment decisions.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">3.2 No Guarantee</h3>
                <p className="text-gray-700">
                  While we strive for accuracy, we make no representations or warranties about the completeness, reliability, or accuracy of the Tool's analyses. Any reliance you place on such information is strictly at your own risk.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">3.3 Investment Risks</h3>
                <p className="text-gray-700">
                  Cryptocurrency and digital asset investments are highly speculative and volatile. You may lose some or all of your investment. Never invest more than you can afford to lose.
                </p>
              </div>
            </div>
          </section>

          {/* User Responsibilities */}
          <section>
            <h2 className="text-xl font-semibold mb-4">4. User Responsibilities</h2>
            <p className="text-gray-700 mb-4">
              Users of the Tool agree to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Conduct their own due diligence and research</li>
              <li>Not rely solely on the Tool's analyses for decision-making</li>
              <li>Understand and accept all risks associated with digital asset investments</li>
              <li>Use the Tool in compliance with all applicable laws and regulations</li>
            </ul>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-xl font-semibold mb-4">5. Limitation of Liability</h2>
            <p className="text-gray-700">
              To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Tool.
            </p>
          </section>

          {/* Data Usage */}
          <section>
            <h2 className="text-xl font-semibold mb-4">6. Data Usage and Privacy</h2>
            <p className="text-gray-700">
              The Tool analyzes publicly available data from GitHub repositories and social media profiles. We do not store or collect personal information beyond what is necessary for the Tool's functionality.
            </p>
          </section>

          {/* Modifications */}
          <section>
            <h2 className="text-xl font-semibold mb-4">7. Modifications</h2>
            <p className="text-gray-700">
              We reserve the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting. Your continued use of the Tool after any modifications indicates your acceptance of the updated terms.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-xl font-semibold mb-4">8. Contact</h2>
            <p className="text-gray-700">
              For any questions regarding these Terms and Conditions, please contact us through our official channels.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;