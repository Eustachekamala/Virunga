import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores';
import { showError, showSuccess } from '../components/ui/Toast';
import { Mail, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const login = useAuthStore(state => state.login);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate network delay for "premium" feel
        await new Promise(resolve => setTimeout(resolve, 1500));

        const success = login(email);

        if (success) {
            showSuccess('Welcome back to Virunga ToolHub');
            navigate('/');
        } else {
            showError('Access Denied: You are not authorized to access this system.');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex bg-cream">
            {/* Left Side - Visual & Brand (Hidden on mobile) */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-cocoa">
                <div
                    className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1624365167558-41f255cc3b8e?q=80&w=2671&auto=format&fit=crop')] bg-cover bg-center opacity-60 mix-blend-overlay"
                ></div>

                <div className="absolute inset-0 bg-gradient-to-t from-cocoa via-transparent to-cocoa/40"></div>

                <div className="relative z-10 p-16 flex flex-col justify-between h-full text-white">
                    <div>
                        <div className="w-16 h-16 bg-gold/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 mb-8">
                            <img src="/Virunga-Origins-Logo.svg" alt="Logo" className="w-16 h-16" onError={(e) => {
                                // Fallback if image fails
                                (e.target as HTMLImageElement).style.display = 'none';
                                (e.target as HTMLImageElement).parentElement!.innerText = 'VP';
                            }} />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h1 className="text-5xl font-serif font-bold leading-tight">
                            Crafting Excellence <br />
                            <span className="text-gold">At Origin.</span>
                        </h1>
                        <p className="text-lg text-white/70 max-w-md leading-relaxed">
                            Manage inventory, track production, and ensure quality with the Virunga ToolHub.
                            Secure access for authorized personnel only.
                        </p>

                        <div className="flex gap-4 pt-4">
                            <div className="flex items-center gap-2 text-sm font-medium text-gold/90 bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm border border-white/5">
                                <CheckCircle2 className="w-4 h-4" /> Secure
                            </div>
                            <div className="flex items-center gap-2 text-sm font-medium text-gold/90 bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm border border-white/5">
                                <CheckCircle2 className="w-4 h-4" /> Fast
                            </div>
                            <div className="flex items-center gap-2 text-sm font-medium text-gold/90 bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm border border-white/5">
                                <CheckCircle2 className="w-4 h-4" /> Reliable
                            </div>
                        </div>
                    </div>

                    <div className="text-sm text-white/30">
                        &copy; 2025 Virunga Chocolate Factory. All rights reserved.
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white lg:rounded-l-[3rem] shadow-2xl z-20">
                <div className="w-full max-w-md space-y-10">
                    <div className="text-center lg:text-left">
                        <div className="inline-flex lg:hidden w-16 h-16 bg-cocoa rounded-2xl items-center justify-center mb-6 shadow-lg shadow-cocoa/20">
                            <img src="/Virunga-Origins-Logo.svg" alt="Logo" className="w-12 h-12" />
                        </div>
                        <h2 className="text-4xl font-serif font-bold text-cocoa">Welcome Back</h2>
                        <p className="text-cocoa/60 mt-3 text-lg">Please enter your credentials to access the dashboard.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-cocoa/80 ml-1">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-cocoa/40 group-focus-within:text-gold transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-12 pr-4 py-4 bg-cream/50 border border-cocoa/10 rounded-xl text-cocoa placeholder-cocoa/30 focus:ring-2 focus:ring-gold/50 focus:border-gold/50 focus:bg-white transition-all outline-none"
                                    placeholder="name@virunga.org"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-cocoa hover:bg-cocoa-light text-white font-bold text-lg rounded-xl shadow-lg shadow-cocoa/20 transition-all transform hover:-translate-y-1 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin text-gold" />
                            ) : (
                                <>
                                    Sign In <ArrowRight className="w-5 h-5 text-gold group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="pt-6 text-center border-t border-dashed border-cocoa/10">
                        <p className="text-sm text-cocoa/50">
                            Having trouble accessing the system? <br />
                            <a href="mailto:eustachekamala.dev@gmail.com" className="text-gold font-semibold hover:underline decoration-gold underline-offset-4">Contact IT Support</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
