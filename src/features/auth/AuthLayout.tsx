import React from 'react';
import { ShieldCheck, Zap, Cpu, Building2 } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-screen bg-slate-50 flex items-center justify-center p-6 md:p-12 font-sans overflow-y-auto">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl border border-slate-100 shadow-2xl overflow-hidden min-h-[680px]">
        {/* Left Side: Marketing & Value Proposition */}
        <div className="hidden lg:flex lg:col-span-6 bg-slate-50 p-8 md:p-12 flex-col justify-between border-r border-slate-100">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white shadow-md shadow-primary/20">
              <Building2 className="w-6 h-6 stroke-[2]" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-slate-800 text-lg leading-none tracking-tight">
                VendorBridge
              </span>
              <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mt-1">
                Enterprise Procurement Platform
              </span>
            </div>
          </div>

          {/* Heading Pitch */}
          <div className="my-10 flex flex-col gap-4.5">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight leading-tight">
              Transform Your <br />
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Procurement Operations
              </span>
            </h1>
            <p className="text-slate-500 text-sm md:text-base leading-relaxed font-medium max-w-md">
              Comprehensive vendor management, intelligent RFQ processing, and automated procurement workflows — all unified in one powerful platform.
            </p>

            {/* Micro Feature Bullet Lists */}
            <div className="flex flex-col gap-4 mt-6">
              {[
                {
                  icon: <ShieldCheck className="w-5 h-5" />,
                  title: 'Enterprise Security',
                  desc: 'Bank-grade encryption with SOC 2 compliance',
                  color: 'text-blue-600 bg-blue-100/70',
                },
                {
                  icon: <Zap className="w-5 h-5" />,
                  title: 'Lightning Performance',
                  desc: 'Streamlined workflows save 10+ hours weekly',
                  color: 'text-indigo-600 bg-indigo-100/70',
                },
                {
                  icon: <Cpu className="w-5 h-5" />,
                  title: 'Intelligent Automation',
                  desc: 'AI-powered insights and predictive analytics',
                  color: 'text-purple-600 bg-purple-100/70',
                },
              ].map((feat, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow transition duration-200">
                  <div className={`p-2.5 rounded-xl ${feat.color} flex items-center justify-center`}>
                    {feat.icon}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs md:text-sm font-bold text-slate-700 leading-none">
                      {feat.title}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium mt-1">
                      {feat.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Bar */}
          <div className="border-t border-slate-200/60 pt-6 grid grid-cols-3 gap-4">
            {[
              { val: '500+', desc: 'Companies' },
              { val: '50K+', desc: 'Transactions' },
              { val: '99.9%', desc: 'Uptime' },
            ].map((stat, idx) => (
              <div key={idx} className="flex flex-col">
                <span className="text-lg md:text-xl font-extrabold text-slate-800 leading-none tracking-tight">
                  {stat.val}
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                  {stat.desc}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Form Content Card Wrapper */}
        <div className="col-span-12 lg:col-span-6 p-8 md:p-12 flex items-center justify-center bg-white">
          <div className="w-full max-w-sm">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
