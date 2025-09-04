// index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import App from './App';
import { AuthProvider, TAuthConfig } from 'react-oauth2-code-pkce';

const authConfig: TAuthConfig = {
    clientId: 'virunga-client-auth',
    authorizationEndpoint: 'http://localhost:8790/realms/virunga-auth/protocol/openid-connect/auth',
    tokenEndpoint: 'http://localhost:8790/realms/virunga-auth/protocol/openid-connect/token',
    redirectUri: 'http://localhost:3000',
    scope: 'openid profile email',
    // Optional settings:
    // autoLogin: true, // auto-login on page load (default is true)
    // logoutEndpoint: '...logout-url...',
    // logoutRedirect: 'http://localhost:3000',
};

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <AuthProvider authConfig={authConfig}>
                    <App />
                </AuthProvider>
            </BrowserRouter>
        </QueryClientProvider>
    </React.StrictMode>
);
