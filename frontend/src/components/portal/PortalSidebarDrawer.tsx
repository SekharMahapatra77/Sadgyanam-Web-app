'use client';

import React, { useEffect } from 'react';
import { X, LogOut, LucideIcon } from 'lucide-react';

export interface NavItem {
  id: string;
  name: string;
  icon: LucideIcon;
}

interface PortalSidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  items: NavItem[];
  activeTab: string;
  onSelectTab: (id: string) => void;
  handleLogout: () => void;
  logoutText?: string;
  headerIcon?: React.ReactNode;
  activeColorClass?: string;
  badgeText?: string;
}

export const PortalSidebarDrawer: React.FC<PortalSidebarDrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  items,
  activeTab,
  onSelectTab,
  handleLogout,
  logoutText = 'Logout',
  headerIcon,
  activeColorClass = 'bg-brand-gold-500 text-slate-950 font-extrabold shadow-md scale-[1.01]',
  badgeText,
}) => {
  // Close drawer on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent body scrolling when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const navContent = (
    <div className="flex flex-col h-full bg-brand-blue-900 text-white border-r border-slate-800">
      {/* Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="space-y-1 min-w-0">
          {badgeText && (
            <span className="inline-block px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-brand-gold-500/20 text-brand-gold-400 border border-brand-gold-500/30 rounded-md">
              {badgeText}
            </span>
          )}
          <div className="flex items-center gap-2">
            {headerIcon}
            <h2 className="text-lg font-black text-white tracking-wide truncate">{title}</h2>
          </div>
          {subtitle && (
            <p className="text-xs text-brand-gold-400 font-bold uppercase tracking-widest truncate">
              {subtitle}
            </p>
          )}
        </div>
        {/* Mobile Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav List */}
      <nav className="flex-1 p-3 overflow-y-auto space-y-1 text-xs font-semibold text-slate-300 scrollbar-thin">
        {items.map((mod) => {
          const IconComponent = mod.icon;
          const isActive = activeTab === mod.id;
          return (
            <button
              key={mod.id}
              type="button"
              onClick={() => {
                onSelectTab(mod.id);
                onClose();
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-left ${
                isActive
                  ? activeColorClass
                  : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <IconComponent className="w-4 h-4 shrink-0" />
              <span className="truncate">{mod.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout Footer */}
      <div className="p-4 border-t border-slate-800 shrink-0">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-rose-600/20 text-rose-300 hover:bg-rose-600 hover:text-white rounded-xl font-bold text-xs transition border border-rose-500/30"
        >
          <LogOut className="w-4 h-4 shrink-0" /> {logoutText}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col shrink-0 min-h-screen sticky top-0 h-screen">
        {navContent}
      </aside>

      {/* Mobile Off-Canvas Drawer */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Semi-transparent Overlay */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div className="relative w-[85vw] max-w-xs h-full bg-brand-blue-900 shadow-2xl z-10 flex flex-col animate-in slide-in-from-left duration-200">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};
