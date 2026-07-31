import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import UserProfile from '@/components/UserProfile';

const Header: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const isConfigPage = location.pathname === '/config';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container max-w-2xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg overflow-hidden">
              <img
                src="/icons/icon-128x128.png"
                alt="Cash Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">{t('app.name')}</h1>
              <p className="text-xs text-muted-foreground">{t('app.tagline')}</p>
            </div>
          </Link>
          {isConfigPage ? (
            <Link
              to="/"
              aria-label={t('nav.back')}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('nav.back')}
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <UserProfile />
              <Link
                to="/config"
                aria-label={t('nav.settings')}
                className="rounded-xl border border-border bg-card p-2.5 text-muted-foreground transition hover:text-foreground"
              >
                <Settings className="h-5 w-5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
