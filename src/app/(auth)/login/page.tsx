"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormValues } from '@/features/auth/schemas';
import type { AuthResponse } from '@/types';
import { fetchClient } from '@/lib/fetchClient';
import { useAuthStore } from '@/store/authStore';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';

export default function LoginPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormValues) => {
    (async () => {
      try {
        const result = await fetchClient<AuthResponse>('/auth/login', { data });
        useAuthStore.getState().setAuth(result.user, result.accessToken, result.refreshToken);
        router.back();
      } catch (err) {
        console.error('Login error', err);
      }
    })();
  };

  return (
    <>
      <Navbar />
      {/* Bokeh Background Effect */}
      <div className="fixed top-0 left-0 w-full h-full z-[-1] pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-primary-fixed/5 rounded-full blur-[150px]"></div>
        <div className="absolute inset-0 w-full h-full opacity-10 grayscale contrast-125" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAkheBF5Suwp4QGR9QqSoifDVoQ3jrgZwQBr89aq7hDuA9CkOtGPkqQhThgGU03Nz0G0OfsWGNQKZeVnjpP7yiX5LVelFqAmMGo14annHdHAwgE5aenpgLxGSmGxLFd3SfajCb4NuqVHa-Lyqbs2tzkRlWejONZc3igLNPJ1B-GkE5AEAQEIcTI6z3dOy5E-EDMlY0C1BhJhfzpZ3_0bdku_5-XqWT2iFgRdpLrxoxppT5VVTdVKBLUui27Hf7NbaIq-BxCF6BvxAc")', backgroundSize: 'cover' }}></div>
      </div>

      <div className="flex-grow flex flex-col justify-center items-center px-6 pt-32 pb-20">
        {/* Brand Header */}
        <header className="mb-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="font-display text-5xl font-extrabold text-white tracking-tighter mb-4 lowercase">
            ticket+
          </h1>
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary-fixed pulse-dot"></span>
            <p className="text-[10px] font-bold text-on-surface-variant tracking-[0.3em] uppercase">Siente el pulso</p>
          </div>
        </header>

        {/* Main Card */}
        <main className="w-full max-w-[480px] glass-panel rounded-[1.5rem] p-8 md:p-12 relative overflow-hidden animate-in fade-in zoom-in-95 duration-1000 delay-150">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-fixed/50 to-transparent"></div>
          <div className="mb-10 text-center">
            <h2 className="font-display text-2xl text-primary-fixed uppercase font-extrabold tracking-tight">Ingresá a tu cuenta</h2>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest" htmlFor="email">Email</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">mail</span>
                <input 
                  {...register('email')}
                  className="w-full h-14 pl-12 pr-4 bg-surface-container rounded-lg border border-outline-variant text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary-fixed focus:ring-1 focus:ring-primary-fixed transition-all" 
                  id="email" 
                  placeholder="nombre@ejemplo.com" 
                  type="email" 
                />
              </div>
              {errors.email && <p className="text-error text-xs mt-1">{errors.email.message}</p>}
            </div>
            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest" htmlFor="password">Contraseña</label>
                <Link className="text-[10px] font-bold text-primary-fixed/70 hover:text-primary-fixed transition-colors uppercase tracking-widest" href="#">¿Olvidaste tu contraseña?</Link>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">lock</span>
                <input 
                  {...register('password')}
                  className="w-full h-14 pl-12 pr-12 bg-surface-container rounded-lg border border-outline-variant text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary-fixed focus:ring-1 focus:ring-primary-fixed transition-all" 
                  id="password" 
                  placeholder="••••••••" 
                  type="password" 
                />
                
              </div>
              {errors.password && <p className="text-error text-xs mt-1">{errors.password.message}</p>}
            </div>
            {/* Remember Me */}
            <div className="flex items-center gap-3">
              <input className="w-5 h-5 rounded border-outline-variant bg-surface-container text-primary-fixed focus:ring-primary-fixed focus:ring-offset-surface cursor-pointer" id="remember" type="checkbox" />
              <label className="text-sm text-on-surface-variant font-medium cursor-pointer select-none" htmlFor="remember">Mantener sesión iniciada</label>
            </div>
            {/* Submit Button */}
            <button className="w-full bg-primary-fixed text-on-primary-fixed font-extrabold text-sm py-5 rounded-full uppercase tracking-[0.2em] primary-glow hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 mt-4" type="submit">
              <span>Iniciar Sesión</span>
              <span className="material-symbols-outlined font-bold">arrow_forward</span>
            </button>
          </form>
          {/* Sign Up Link */}
          <div className="mt-10 pt-10 border-t border-white/5 text-center">
            <p className="text-sm text-on-surface-variant font-medium">
              ¿No tienes cuenta? 
              <Link className="text-primary-fixed font-bold hover:underline underline-offset-4 ml-1" href="/register">Regístrate</Link>
            </p>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
