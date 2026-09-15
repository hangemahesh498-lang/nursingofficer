import React, { useState } from 'react';
import { CompliancePoliciesModal, PolicyTab } from './CompliancePoliciesModal';
import { CONTACT_CONFIG } from '../lib/contactConfig';
import { Lock } from 'lucide-react';

interface ComplianceFooterProps {
  onNavigateToContact?: () => void;
  onNavigateToAbout?: () => void;
}

export const ComplianceFooter: React.FC<ComplianceFooterProps> = ({
  onNavigateToContact,
  onNavigateToAbout
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<PolicyTab>('terms');

  const openPolicy = (tab: PolicyTab) => {
    setSelectedTab(tab);
    setModalOpen(true);
  };

  return (
    <>
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-[11px] py-5 pb-24 lg:pb-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          {/* Single Clean Row with English Policy Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-slate-300 font-medium text-[11px]">
            <button
              onClick={() => {
                if (onNavigateToAbout) onNavigateToAbout();
                else openPolicy('about');
              }}
              className="hover:text-teal-400 transition cursor-pointer"
            >
              About Us
            </button>
            <span className="text-slate-700">•</span>
            <button
              onClick={() => {
                if (onNavigateToContact) onNavigateToContact();
                else openPolicy('contact');
              }}
              className="hover:text-teal-400 transition cursor-pointer"
            >
              Contact Us
            </button>
            <span className="text-slate-700">•</span>
            <button
              onClick={() => openPolicy('terms')}
              className="hover:text-teal-400 transition cursor-pointer"
            >
              Terms & Conditions
            </button>
            <span className="text-slate-700">•</span>
            <button
              onClick={() => openPolicy('privacy')}
              className="hover:text-teal-400 transition cursor-pointer"
            >
              Privacy Policy
            </button>
            <span className="text-slate-700">•</span>
            <button
              onClick={() => openPolicy('refund')}
              className="hover:text-teal-400 transition cursor-pointer"
            >
              Refund Policy
            </button>
            <span className="text-slate-700">•</span>
            <button
              onClick={() => openPolicy('shipping')}
              className="hover:text-teal-400 transition cursor-pointer"
            >
              Shipping & Delivery
            </button>
            <span className="text-slate-700">•</span>
            <button
              onClick={() => openPolicy('pricing')}
              className="hover:text-teal-400 transition cursor-pointer"
            >
              Pricing
            </button>
          </div>

          {/* Bottom Single Line Copyright & Trust */}
          <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-400 text-[10px] text-center sm:text-left">
            <div>
              © {new Date().getFullYear()} <strong>{CONTACT_CONFIG.operatingBrand}</strong>. {CONTACT_CONFIG.legalOwnershipDisclaimer}
            </div>
            <div className="flex items-center justify-center gap-3">
              <span className="flex items-center gap-1 text-slate-400">
                <Lock className="w-3 h-3 text-emerald-400 shrink-0" /> SSL Secured
              </span>
              <span className="text-slate-700">•</span>
              <span className="text-slate-400">Powered by Razorpay</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Compliance Policies Modal */}
      <CompliancePoliciesModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialTab={selectedTab}
      />
    </>
  );
};
