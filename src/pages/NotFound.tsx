import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const NotFound = () => {
  const { t } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-dvh flex items-center justify-center bg-background px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-foreground">404</h1>
        <p className="text-xl text-muted-foreground mb-4">{t('notFound.title')}</p>
        <Link to="/" className="text-primary hover:underline">
          {t('notFound.action')}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
