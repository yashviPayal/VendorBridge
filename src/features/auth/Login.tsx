import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { Mail, Lock, ArrowRight, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { useStore, UserRole } from '../../store/useStore';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';

const loginSchema = zod.object({
  email: zod.string().email('Please enter a valid email address'),
  password: zod.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = zod.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const login = useStore((state) => state.login);
  const users = useStore((state) => state.users);

  const [errorMsg, setErrorMsg] = useState('');
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setErrorMsg('');
    const success = await login(data.email, data.password);
    if (success) {
      navigate('/dashboard');
    } else {
      setErrorMsg('Invalid email address. Please register or use a demo account.');
    }
  };

  const handleQuickDemoLogin = async (role: UserRole) => {
    // Find the default user matching this role
    const defaultUser = users.find((u) => u.role === role);
    if (defaultUser) {
      await login(defaultUser.email);
      setIsDemoModalOpen(false);
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in">
      <div className="flex flex-col gap-1.5">
        <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
          Welcome back
        </h2>
        <p className="text-slate-400 text-xs font-semibold">
          Sign in to access your dashboard
        </p>
      </div>

      {/* Tabs Switcher Indicator */}
      <div className="flex bg-slate-100 p-1 rounded-xl">
        <button className="flex-1 py-2 text-xs font-bold rounded-lg bg-white text-slate-800 shadow-sm border border-slate-100/50 select-none">
          Sign In
        </button>
        <Link
          to="/register"
          className="flex-1 py-2 text-xs font-bold text-slate-400 text-center hover:text-slate-600 rounded-lg select-none"
        >
          Sign Up
        </Link>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-100 text-danger rounded-xl flex gap-3 text-xs font-medium">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Form Submission */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="you@company.com"
          leftIcon={<Mail className="w-4.5 h-4.5" />}
          error={errors.email?.message}
          disabled={isSubmitting}
          {...register('email')}
        />

        <div className="flex flex-col gap-1.5">
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            leftIcon={<Lock className="w-4.5 h-4.5" />}
            error={errors.password?.message}
            disabled={isSubmitting}
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => {
              setForgotSuccess(false);
              setForgotEmail('');
              setIsForgotPasswordOpen(true);
            }}
            className="text-right text-[11px] font-bold text-slate-400 hover:text-primary transition"
          >
            Forgot Password?
          </button>
        </div>

        <Button
          type="submit"
          isLoading={isSubmitting}
          className="w-full bg-gradient-to-r from-primary to-secondary text-white hover:opacity-95 py-2.5 font-bold shadow-md shadow-primary/20"
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Sign In
        </Button>
      </form>

      <div className="relative flex items-center justify-center my-1 select-none">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-100" />
        </div>
        <span className="relative px-3 bg-white text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Or continue with
        </span>
      </div>

      {/* Quick Start Demo Button */}
      <button
        onClick={() => setIsDemoModalOpen(true)}
        className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 active:scale-98 transition cursor-pointer select-none"
      >
        <Sparkles className="w-4 h-4 fill-white/10" />
        Quick Start Demo
      </button>

      <div className="text-center text-xs text-slate-400 font-semibold select-none">
        New to VendorBridge?{' '}
        <Link to="/register" className="text-primary hover:underline font-bold">
          create your account
        </Link>
      </div>

      {/* Quick Start Demo Selection Modal */}
      <Modal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        title="Select a Demo Role"
        size="sm"
      >
        <div className="flex flex-col gap-4">
          <p className="text-slate-500 text-xs font-semibold text-center mb-1">
            Choose a pre-configured account to test the role-based procurement workflow instantly:
          </p>

          <div className="grid grid-cols-1 gap-2.5">
            {[
              {
                role: 'Procurement Officer' as UserRole,
                email: 'officer@vendorbridge.com',
                desc: 'Create RFQs, compare quotes, issue POs & invoices',
                color: 'hover:bg-blue-50/50 hover:border-blue-200 border-slate-100',
                labelColor: 'text-blue-700 bg-blue-50 border-blue-100',
              },
              {
                role: 'Vendor' as UserRole,
                email: 'vendor@vendorbridge.com',
                desc: 'Submit bids/quotations, view orders, send invoices',
                color: 'hover:bg-amber-50/50 hover:border-amber-200 border-slate-100',
                labelColor: 'text-amber-700 bg-amber-50 border-amber-100',
              },
              {
                role: 'Manager' as UserRole,
                email: 'manager@vendorbridge.com',
                desc: 'Approve or reject cost summaries & review bids',
                color: 'hover:bg-emerald-50/50 hover:border-emerald-200 border-slate-100',
                labelColor: 'text-emerald-700 bg-emerald-50 border-emerald-100',
              },
              {
                role: 'Admin' as UserRole,
                email: 'admin@vendorbridge.com',
                desc: 'Manage users, activate vendors, view platform logs',
                color: 'hover:bg-purple-50/50 hover:border-purple-200 border-slate-100',
                labelColor: 'text-purple-700 bg-purple-50 border-purple-100',
              },
            ].map((d) => (
              <button
                key={d.role}
                onClick={() => handleQuickDemoLogin(d.role)}
                className={`w-full p-4 border text-left rounded-xl transition duration-150 flex flex-col gap-1.5 cursor-pointer ${d.color}`}
              >
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${d.labelColor}`}>
                    {d.role}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold truncate max-w-[150px]">
                    {d.email}
                  </span>
                </div>
                <p className="text-[11px] font-medium text-slate-500 leading-normal">
                  {d.desc}
                </p>
              </button>
            ))}
          </div>
        </div>
      </Modal>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
        title="Reset Password"
        size="sm"
      >
        <div className="flex flex-col gap-4">
          {forgotSuccess ? (
            <div className="flex flex-col items-center text-center gap-3 py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Check className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">Check your email</h4>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
                We have sent a secure password reset link and a simulated OTP code to <strong className="text-slate-700">{forgotEmail}</strong>.
              </p>
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => setIsForgotPasswordOpen(false)}
              >
                Done
              </Button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (forgotEmail) {
                  setForgotSuccess(true);
                }
              }}
              className="flex flex-col gap-4"
            >
              <p className="text-xs text-slate-500 leading-relaxed">
                Enter your registered email address and we'll send a password recovery link to access your ERP account.
              </p>
              <Input
                label="Email Address"
                type="email"
                placeholder="you@company.com"
                required
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                leftIcon={<Mail className="w-4.5 h-4.5" />}
              />
              <Button
                type="submit"
                className="w-full py-2.5 font-bold mt-2"
                rightIcon={<RefreshCw className="w-4 h-4" />}
              >
                Send Reset Link
              </Button>
            </form>
          )}
        </div>
      </Modal>
    </div>
  );
};
import { Check } from 'lucide-react';
