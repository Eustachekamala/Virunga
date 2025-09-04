import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Login from './pages/Login';
import { useContext } from 'react';
import { AuthContext } from 'react-oauth2-code-pkce';

function App() {
    const { token, loginInProgress } = useContext(AuthContext);

    // While redirect/login is happening
    if (loginInProgress) {
        return <p>Redirecting to login...</p>;
    }

    // If no token → show Login page
    if (!token) {
        return <Login />;
    }

    // If token exists → user is authenticated
    return (
        <>
            <Layout>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/products" element={<Products />} />
                </Routes>
            </Layout>

            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                }}
            />
        </>
    );
}

export default App;
