import { TooltipProvider } from '@radix-ui/react-tooltip';
import { ThemeProvider } from './components/theme-provider';
import { GoogleOAuthProvider } from '@react-oauth/google';
import React from 'react';

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <TooltipProvider>{children}</TooltipProvider>
      </GoogleOAuthProvider>
    </ThemeProvider>
  );
};

export default Providers;
