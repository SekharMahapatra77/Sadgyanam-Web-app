'use client';

import React from 'react';
import { Menu, GraduationCap } from 'lucide-react';

interface PortalMobileHeaderProps {
  portalTitle: string;
  userRole?: string;
  userName?: string;
  onOpenSidebar: () => void;
}

export const PortalMobileHeader: React.FC<PortalMobileHeaderProps> = ({
  portalTitle,
  userRole,
  userName,
  onOpenSidebar,
}) => {
  return (
    <header className="lg:hidden sticky top-0 z-30 bg-brand-blue-900 text-white px-4 py-3 border-b border-slate-800 flex items-center justify-between shadow-md min-w-0 max-w-full">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-white transition shrink-0 focus:outline-none focus:ring-2 focus:ring-brand-gold-400"
          aria-label="Open portal navigation"
        >
          <Menu className="w-5 h-5 text-brand-gold-400" />
        </button>

        <div className="flex items-center gap-2 min-w-0">
          <GraduationCap className="w-5 h-5 text-brand-gold-400 shrink-0" />
          <div className="min-w-0">
            <h1 className="text-sm font-black tracking-wide text-white truncate">
              {portalTitle}
            </h1>
            {userName && (
              <p className="text-[10px] text-slate-300 font-medium truncate">
                {userName} {userRole ? `• ${userRole}` : ''}
              </p>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
