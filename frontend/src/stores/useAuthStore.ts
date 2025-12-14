import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { env } from 'process';

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'USER';

interface User {
    email: string;
    name: string;
    role: UserRole;
    avatar?: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string) => boolean; // Returns true if success
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            login: (email: string) => {
                const normalizedEmail = email.toLowerCase().trim();

                const superAdminEmail = env.VITE_SUPER_ADMIN_EMAIL?.toLowerCase().trim();
                const adminEmail = env.VITE_ADMIN_EMAIL?.toLowerCase().trim();

                if (normalizedEmail === superAdminEmail) {
                    set({
                        isAuthenticated: true,
                        user: {
                            email: normalizedEmail,
                            name: 'Eustache Katembo',
                            role: 'SUPER_ADMIN',
                            avatar: 'https://ui-avatars.com/api/?name=Eustache+Kamala&background=FFD700&color=000'
                        }
                    });
                    return true;
                } else if (normalizedEmail === adminEmail) {
                    set({
                        isAuthenticated: true,
                        user: {
                            email: normalizedEmail,
                            name: 'Feston Bificema',
                            role: 'ADMIN',
                            avatar: 'https://ui-avatars.com/api/?name=Feston+Bificema&background=0D9488&color=fff'
                        }
                    });
                    return true;
                }
                return false;
            },
            logout: () => set({ user: null, isAuthenticated: false }),
        }),
        {
            name: 'virunga-auth',
        }
    )
);
