"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { registerSchema, type RegisterFormValues } from '@/features/auth/schemas';
import { fetchClient } from '@/lib/fetchClient';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';

export default function RegisterPage() {
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const mutation = useMutation<void, any, RegisterFormValues>({
    mutationFn: (data: RegisterFormValues) => fetchClient('/auth/register', { data, method: 'POST' }),
    onSuccess: () => {
      toast.success('Registro completado correctamente');
      router.push('/login');
    },
    onError: (err: any) => {
      const message = err?.message || err?.error || 'No se pudo completar el registro.';
      setApiError(typeof message === 'string' ? message : JSON.stringify(message));
      toast.error(typeof message === 'string' ? message : 'No se pudo completar el registro.');
    },
  });

  const isLoading = (mutation as any).isLoading ?? mutation.status === 'pending';

  const onSubmit = (data: RegisterFormValues) => {
    setApiError(null);
    if (!isLoading) mutation.mutate(data);
  };

  return (
    <>
      <Navbar />
      <main className="flex-grow flex items-center justify-center pt-32 pb-20 px-margin-mobile md:px-0 relative">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary-fixed/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary-container/10 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="w-full max-w-[480px] z-10">
          <div className="glass-panel p-8 md:p-12 rounded-xl shadow-2xl flex flex-col gap-8">
            <div className="text-center space-y-2">
              <h1 className="font-display text-headline-lg text-primary-fixed tracking-tight">Registrate</h1>
              <p className="text-on-surface-variant font-body-md">Crea tu cuenta y vive la música en directo.</p>
            </div>
            
            <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-2">
                <label className="font-label-md text-on-surface-variant ml-1">Nombre completo</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">person</span>
                  <input 
                    {...register('name')}
                    className="w-full bg-[#1A1A1C] border border-white/10 rounded-lg py-4 pl-12 pr-4 text-primary font-body-md focus:outline-none focus:border-primary-fixed focus:ring-1 focus:ring-primary-fixed transition-all" 
                    placeholder="Tu nombre y apellidos" 
                    type="text" 
                  />
                </div>
                {errors.name && <p className="text-error text-xs">{errors.name.message}</p>}
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="font-label-md text-on-surface-variant ml-1">Email</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">mail</span>
                  <input 
                    {...register('email')}
                    className="w-full bg-[#1A1A1C] border border-white/10 rounded-lg py-4 pl-12 pr-4 text-primary font-body-md focus:outline-none focus:border-primary-fixed focus:ring-1 focus:ring-primary-fixed transition-all" 
                    placeholder="nombre@ejemplo.com" 
                    type="email" 
                  />
                </div>
                {errors.email && <p className="text-error text-xs">{errors.email.message}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-label-md text-on-surface-variant ml-1">Contraseña</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">lock</span>
                  <input 
                    {...register('password')}
                    className="w-full bg-[#1A1A1C] border border-white/10 rounded-lg py-4 pl-12 pr-4 text-primary font-body-md focus:outline-none focus:border-primary-fixed focus:ring-1 focus:ring-primary-fixed transition-all" 
                    placeholder="••••••••" 
                    type="password" 
                  />
                </div>
                {errors.password && <p className="text-error text-xs">{errors.password.message}</p>}
              </div>
              
              {apiError && <p className="text-error text-sm">{apiError}</p>}

              <button
                className="mt-4 w-full bg-primary-fixed text-on-primary-fixed font-display font-bold py-4 rounded-lg active:scale-95 transition-all primary-glow"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
              </button>
            </form>
            
            <div className="text-center">
              <p className="font-body-md text-on-surface-variant">
                ¿Ya tienes una cuenta? <Link className="text-primary-fixed hover:underline transition-all" href="/login">Inicia sesión</Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
