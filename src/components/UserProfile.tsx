import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/auth';
import { LogIn, LogOut, User } from 'lucide-react';
import ThreeDotsLoader from '@/components/ThreeDotsLoader';
import { auth } from '@/lib/firebase';

const UserProfile: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout, signInWithGoogle } = useAuth();
  const [signingIn, setSigningIn] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const handleGoogleSignIn = async () => {
    if (signingIn) return;

    setSigningIn(true);
    let settled = false;

    const finish = () => {
      if (settled) return;
      settled = true;
      window.removeEventListener('focus', onWindowFocus);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.clearTimeout(fallbackTimeout);
      setSigningIn(false);
    };

    const maybeFinishAfterCancel = () => {
      window.setTimeout(() => {
        if (!auth.currentUser) {
          finish();
        }
      }, 400);
    };

    const onWindowFocus = () => {
      maybeFinishAfterCancel();
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        maybeFinishAfterCancel();
      }
    };

    window.addEventListener('focus', onWindowFocus);
    document.addEventListener('visibilitychange', onVisibilityChange);
    const fallbackTimeout = window.setTimeout(finish, 120000);

    try {
      await signInWithGoogle();
      if (auth.currentUser) {
        finish();
        return;
      }
      maybeFinishAfterCancel();
    } catch (error) {
      console.error('Failed to sign in:', error);
      finish();
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!user) {
    return (
      <Button
        variant="outline"
        onClick={handleGoogleSignIn}
        disabled={signingIn}
        className="h-10 rounded-xl border-border bg-card px-3 text-muted-foreground hover:bg-accent hover:text-foreground"
      >
        {signingIn ? (
          <>
            <ThreeDotsLoader size="sm" />
            {t('auth.signingIn')}
          </>
        ) : (
          <>
            <LogIn className="h-5 w-5" />
            {t('auth.signIn')}
          </>
        )}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.photoURL || ''} alt={user.displayName || ''} />
            <AvatarFallback>
              {user.displayName ? getInitials(user.displayName) : <User className="h-4 w-4" />}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.displayName && <p className="font-medium">{user.displayName}</p>}
            {user.email && (
              <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
            )}
          </div>
        </div>
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>{t('auth.logOut')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfile;
