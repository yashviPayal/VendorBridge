import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { UserPlus, Mail, Lock, User as UserIcon, AlertCircle, CheckCircle } from 'lucide-react';
import { useStore, UserRole } from '../../store/useStore';
import { Input, Select } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

const registerSchema = zod.object({
  name: zod.string().min(3, 'Full name must be at least 3 characters'),
  email: zod.string().email('Please enter a valid email address'),
  password: zod.string().min(6, 'Password must be at least 6 characters'),
  role: zod.enum(['Admin', 'Procurement Officer', 'Vendor', 'Manager'] as const),
});

type RegisterForm = zod.infer<typeof registerSchema>;

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const registerUser = useStore((state) => state.registerUser);

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'Vendor',
    },
  });

  const onSubmit = async (data: RegisterForm) => {
    setErrorMsg('');
    setSuccessMsg('');
    const success = await registerUser(data.name, data.email, data.role);
    if (success) {
      setSuccessMsg('Account registered successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      setErrorMsg('This email address is already registered. Please sign in.');
    }
  };

  const roleOptions = [
    { value: 'Vendor', label: 'Vendor' },
    { value: 'Procurement Officer', label: 'Procurement Officer' },
    { value: 'Manager', label: 'Manager' },
    { value: 'Admin', label: 'Admin' },
  ];

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in">
      <div className="flex flex-col gap-1.5">
        <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
          Create your account
        </h2>
        <p className="text-slate-400 text-xs font-semibold">
          Start managing procurement in minutes
        </p>
      </div>

      {/* Tabs Switcher Indicator */}
      <div className="flex bg-slate-100 p-1 rounded-xl">
        <Link
          to="/login"
          className="flex-1 py-2 text-xs font-bold text-slate-400 text-center hover:text-slate-600 rounded-lg select-none"
        >
          Sign In
        </Link>
        <button className="flex-1 py-2 text-xs font-bold rounded-lg bg-white text-slate-800 shadow-sm border border-slate-100/50 select-none">
          Sign Up
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-100 text-danger rounded-xl flex gap-3 text-xs font-medium">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl flex gap-3 text-xs font-medium">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Form Submission */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="Full Name"
          type="text"
          placeholder="John Doe"
          leftIcon={<UserIcon className="w-4.5 h-4.5" />}
          error={errors.name?.message}
          disabled={isSubmitting || !!successMsg}
          {...register('name')}
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="you@company.com"
          leftIcon={<Mail className="w-4.5 h-4.5" />}
          error={errors.email?.message}
          disabled={isSubmitting || !!successMsg}
          {...register('email')}
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          leftIcon={<Lock className="w-4.5 h-4.5" />}
          error={errors.password?.message}
          disabled={isSubmitting || !!successMsg}
          {...register('password')}
        />

        <Select
          label="Select Your Role"
          options={roleOptions}
          error={errors.role?.message}
          disabled={isSubmitting || !!successMsg}
          {...register('role')}
        />

        <Button
          type="submit"
          isLoading={isSubmitting || !!successMsg}
          className="w-full bg-gradient-to-r from-primary to-secondary text-white hover:opacity-95 py-2.5 font-bold shadow-md shadow-primary/20 mt-2"
          rightIcon={<UserPlus className="w-4 h-4" />}
        >
          Create Account
        </Button>
      </form>

      <div className="text-center text-xs text-slate-400 font-semibold select-none">
        Already have an account?{' '}
        <Link to="/login" className="text-primary hover:underline font-bold">
          Sign in instead
        </Link>
      </div>
    </div>
  );
};
