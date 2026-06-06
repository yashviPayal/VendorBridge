import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore, UserRole } from '../../store/useStore';
import {
  Building2,
  ShieldCheck,
  Zap,
  Cpu,
  FileText,
  CheckSquare,
  ArrowRight,
  Sparkles,
  Users,
  TrendingUp,
  FileSpreadsheet,
  HelpCircle,
  Play
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { HeroScrollDemo } from '../../components/ui/HeroScrollDemo';
import { RadialOrbitalTimelineDemo } from '../../components/ui/RadialOrbitalTimelineDemo';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = useStore((state) => state.currentUser);
  const login = useStore((state) => state.login);
  const users = useStore((state) => state.users);

  const handleLaunchDemo = async () => {
    // Automatically log in as Procurement Officer for quick preview
    const officer = users.find((u) => u.role === 'Procurement Officer');
    if (officer) {
      await login(officer.email);
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen w-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased overflow-x-hidden selection:bg-primary selection:text-white">
      {/* Sticky Header Nav */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100/60 no-print">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white shadow-md shadow-primary/15">
              <Building2 className="w-5 h-5 stroke-[2]" />
            </div>
            <span className="font-extrabold text-slate-800 text-lg tracking-tight select-none">
              VendorBridge
            </span>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-500 uppercase tracking-wider select-none">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-primary transition-colors">FAQ</a>
          </nav>

          {/* Auth Actions */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <Button
                onClick={() => navigate('/dashboard')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="bg-primary hover:bg-primary-hover font-bold shadow-md shadow-primary/15"
              >
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-wider px-3 py-2"
                >
                  Sign In
                </Link>
                <Button
                  onClick={() => navigate('/register')}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="bg-primary hover:bg-primary-hover font-bold shadow-md shadow-primary/15"
                >
                  Sign Up Free
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 bg-white overflow-hidden">
        {/* Glow Gradients Background */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-400/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-400/5 blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Pitch */}
          <div className="lg:col-span-6 flex flex-col gap-6 text-center lg:text-left">
            <div className="w-fit mx-auto lg:mx-0 inline-flex items-center gap-1.5 px-3 py-1 bg-primary/5 rounded-full border border-primary/10 text-primary text-xs font-semibold select-none animate-bounce">
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>Next-Gen Enterprise Procurement ERP</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-800 tracking-tight leading-tight">
              Digitize & Streamline <br />
              <span className="bg-gradient-to-r from-primary via-indigo-600 to-secondary bg-clip-text text-transparent">
                Your Vendor Workflows
              </span>
            </h1>

            <p className="text-slate-500 text-sm md:text-base leading-relaxed font-medium max-w-lg mx-auto lg:mx-0">
              Simplify relationships between buyers and suppliers. Issue RFQs, compare bids, route manager sign-offs, and pay invoices within a SOC 2 compliant ERP system.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start mt-4">
              <Button
                onClick={handleLaunchDemo}
                leftIcon={<Play className="w-4 h-4 fill-white/20" />}
                className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-purple-500/20"
              >
                Launch Demo Console
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto border-slate-200 hover:bg-slate-50 py-3 px-6 rounded-xl"
              >
                Get Started Free
              </Button>
            </div>
          </div>

          {/* Hero Image Mockup Visual */}
          <div className="lg:col-span-6 relative flex justify-center">
            <div className="w-full max-w-xl aspect-[4/3] bg-gradient-to-tr from-slate-100 to-slate-50 border border-slate-200/80 rounded-2xl shadow-premium p-4 flex flex-col gap-4 relative overflow-hidden group hover:shadow-2xl transition duration-300">
              {/* Header bar mock */}
              <div className="flex justify-between items-center border-b border-slate-200/50 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <span className="text-[10px] font-mono text-slate-400 font-bold">vendorbridge-console.app</span>
              </div>

              {/* Mock dashboard KPIs */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { title: 'RFQ count', value: '45', color: 'border-blue-100 bg-blue-50/30' },
                  { title: 'Approved Value', value: '$84,000', color: 'border-emerald-100 bg-emerald-50/30' },
                  { title: 'Due Invoices', value: '$12,450', color: 'border-amber-100 bg-amber-50/30' },
                ].map((mock, idx) => (
                  <div key={idx} className={`p-3 border rounded-xl flex flex-col ${mock.color}`}>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">{mock.title}</span>
                    <span className="text-sm font-extrabold text-slate-700 mt-1">{mock.value}</span>
                  </div>
                ))}
              </div>

              {/* Mock Charts */}
              <div className="flex-1 bg-white border border-slate-200/50 rounded-xl p-4 flex flex-col gap-2 relative">
                <div className="h-2 w-1/3 bg-slate-100 rounded" />
                <div className="h-2.5 w-1/2 bg-slate-100/60 rounded" />

                {/* Visual bar graphics */}
                <div className="flex items-end gap-3.5 justify-center flex-1 mt-3">
                  {[45, 65, 35, 75, 55, 95].map((h, idx) => (
                    <div
                      key={idx}
                      className="bg-primary/20 hover:bg-primary border-t border-primary/30 rounded-t w-7 transition-all duration-300"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3D Scroll Dashboard Preview Section */}
      <section className="bg-slate-50 border-t border-slate-100 py-16 overflow-hidden flex justify-center">
        <HeroScrollDemo />
      </section>

      {/* Metrics section */}
      <section className="bg-slate-100 border-y border-slate-200/40 py-12 select-none">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { val: '500+', label: 'Organizations Onboarded' },
            { val: '$45M+', label: 'Procurement Spent Handled' },
            { val: '99.99%', label: 'SLA Uptime & Compliance' },
          ].map((stat, idx) => (
            <div key={idx} className="flex flex-col gap-1">
              <span className="text-3xl font-extrabold text-slate-800 tracking-tight">{stat.val}</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features & Roadmap Section */}
      <section id="features" className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

            {/* Left Side: Features and Description */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <div className="w-fit inline-flex items-center gap-1.5 px-3 py-1 bg-primary/5 rounded-full border border-primary/10 text-primary text-xs font-semibold select-none">
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                  <span>Interactive System Features</span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-800 tracking-tight leading-tight">
                  Powerful Features for <br />
                  <span className="bg-gradient-to-r from-primary via-indigo-600 to-secondary bg-clip-text text-transparent">
                    Seamless Procurement
                  </span>
                </h2>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">
                  VendorBridge integrates all supply chain operational loops into a single workspace, eliminating manual handoffs and speeding up procurement cycles.
                </p>
              </div>

              {/* Vertical Feature List */}
              <div className="flex flex-col gap-4 mt-2">
                {[
                  {
                    icon: <Users className="w-4.5 h-4.5 text-blue-600" />,
                    title: 'Vendor Registry & Trust',
                    desc: 'Onboard partners, verify GST credentials, and store ISO compliance docs.',
                    color: 'bg-blue-50 border-blue-100/50',
                  },
                  {
                    icon: <FileText className="w-4.5 h-4.5 text-indigo-600" />,
                    title: 'Multi-Step RFQ Wizard',
                    desc: 'Create structured request specs, attach drawings, and invite partner pools.',
                    color: 'bg-indigo-50 border-indigo-100/50',
                  },
                  {
                    icon: <CheckSquare className="w-4.5 h-4.5 text-purple-600" />,
                    title: 'Comparison Matrices',
                    desc: 'Analyze bidding rates side-by-side to highlight lowest quotes.',
                    color: 'bg-purple-50 border-purple-100/50',
                  },
                  {
                    icon: <Sparkles className="w-4.5 h-4.5 text-emerald-600" />,
                    title: 'Manager Sign-Off Loops',
                    desc: 'Multi-level approval pathways with audit timestamps and logs.',
                    color: 'bg-emerald-50 border-emerald-100/50',
                  },
                  {
                    icon: <TrendingUp className="w-4.5 h-4.5 text-amber-600" />,
                    title: 'Purchase Orders (PO)',
                    desc: 'Auto-compile contracts and monitor supplier delivery receipts.',
                    color: 'bg-amber-50 border-amber-100/50',
                  },
                  {
                    icon: <FileSpreadsheet className="w-4.5 h-4.5 text-rose-600" />,
                    title: 'Billing & Invoicing',
                    desc: 'Automate GST splits, track unpaid lists, and export PDF statements.',
                    color: 'bg-rose-50 border-rose-100/50',
                  },
                ].map((feat, idx) => (
                  <div key={idx} className="group flex items-start gap-4 p-3.5 rounded-xl border border-slate-100 bg-slate-50/40 hover:bg-white hover:border-slate-200/60 hover:shadow-md transition-all duration-200">
                    <div className={`w-9 h-9 rounded-lg ${feat.color} border flex items-center justify-center shrink-0`}>
                      {feat.icon}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <h4 className="font-bold text-slate-800 text-sm group-hover:text-primary transition-colors">{feat.title}</h4>
                      <p className="text-slate-500 text-xs font-medium leading-relaxed">{feat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side: Procurement Lifecycle Roadmap */}
            <div className="lg:col-span-7 w-full lg:sticky lg:top-24 flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <div className="w-fit inline-flex items-center gap-1.5 px-3 py-1 bg-primary/5 rounded-full border border-primary/10 text-primary text-xs font-semibold select-none">
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                  <span>Operations Workflow</span>
                </div>
                <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight leading-tight">
                  Procurement <br />
                  <span className="bg-gradient-to-r from-primary via-indigo-600 to-secondary bg-clip-text text-transparent">
                    Lifecycle Roadmap
                  </span>
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">
                  Click on the orbital nodes to review operational stages, track connected checkpoints, and observe current workload balances.
                </p>
              </div>

              <div className="w-full no-print">
                <RadialOrbitalTimelineDemo />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 lg:py-28 bg-slate-50 border-t border-slate-200/40">
        <div className="max-w-7xl mx-auto px-6 flex flex-col gap-16">
          <div className="text-center flex flex-col gap-3">
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              Simple, Transparent Pricing
            </h2>
            <p className="text-slate-500 text-sm md:text-base font-semibold max-w-xl mx-auto">
              Select the plan that fits your corporate scale requirements
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto w-full">
            {[
              {
                name: 'Startup',
                price: '$49',
                desc: 'Best for growing startups digitizing initial vendor registries',
                features: ['Up to 5 Buyer Accounts', 'Unlimited Supplier Registrations', 'Standard RFQ Wizard', 'Email Notifications'],
                button: 'Get Started',
                color: 'border-slate-200',
              },
              {
                name: 'Professional',
                price: '$149',
                desc: 'Best for regional businesses automating daily bids & sign-offs',
                features: ['Up to 25 Buyer Accounts', 'Unlimited Suppliers', 'Quotation Comparison Matrices', 'Level 2 Approvals', 'PO & Tax Invoicing', 'Recharts Spend Reports'],
                button: 'Go Professional',
                popular: true,
                color: 'border-primary ring-4 ring-primary/10',
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                desc: 'Best for multi-national conglomerates seeking compliance compliance',
                features: ['Unlimited Buyer Accounts', 'Custom ERP Integrations', 'Multi-Level Approval Paths', 'SOC 2 Audit Trail logs', 'Dedicated Account Executive', 'Custom SLAs'],
                button: 'Contact Sales',
                color: 'border-slate-200',
              },
            ].map((plan, idx) => (
              <div key={idx} className={`bg-white p-8 border rounded-3xl flex flex-col justify-between shadow-premium relative ${plan.color}`}>
                {plan.popular && (
                  <span className="absolute -top-3 right-6 inline-flex px-3 py-1 bg-primary text-white text-[10px] font-bold rounded-full uppercase tracking-wider shadow">
                    Most Popular
                  </span>
                )}

                <div className="flex flex-col gap-5">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px]">{plan.name}</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-4xl font-extrabold text-slate-800">{plan.price}</span>
                    {plan.price !== 'Custom' && <span className="text-slate-400 text-xs">/month</span>}
                  </div>
                  <p className="text-slate-500 text-xs leading-relaxed font-medium mt-1">{plan.desc}</p>

                  <div className="w-full h-px bg-slate-100 my-2" />

                  <div className="flex flex-col gap-3">
                    {plan.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                        <CheckSquare className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleLaunchDemo}
                  variant={plan.popular ? 'primary' : 'outline'}
                  className="w-full mt-8 py-2.5 font-bold"
                >
                  {plan.button}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 lg:py-28 bg-white border-t border-slate-200/40">
        <div className="max-w-4xl mx-auto px-6 flex flex-col gap-12">
          <div className="text-center flex flex-col gap-3">
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-500 text-sm font-semibold">
              Get immediate answers to common implementation queries
            </p>
          </div>

          <div className="flex flex-col gap-6">
            {[
              {
                q: 'How does the role-based dashboard system function?',
                a: 'VendorBridge restricts views and actions based on user roles. Admins manage logs and setups, Procurement Officers create bids and issue contracts, Managers sign cost authorizations, and Vendors view assigned bidding packages and upload tax invoice billings.',
              },
              {
                q: 'Can we configure custom approval routes?',
                a: 'Yes! Our Professional and Enterprise subscriptions let you configure 2-level or custom multi-level approvals where requests route based on department allocations or total quotation values.',
              },
              {
                q: 'Is there support for tax codes?',
                a: 'VendorBridge has built-in tax calculation systems supporting standard CGST and SGST splits (9% each) for invoice billing validation, with downloadable PDF statement models.',
              },
            ].map((faq, idx) => (
              <div key={idx} className="p-6 bg-slate-50 border border-slate-100 rounded-2xl flex gap-4">
                <HelpCircle className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1.5">
                  <h4 className="font-bold text-slate-800 text-sm">{faq.q}</h4>
                  <p className="text-slate-500 text-xs leading-relaxed font-medium">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="bg-gradient-to-tr from-primary to-secondary text-white py-16 lg:py-20 relative select-none">
        <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-3xl" />
        <div className="max-w-4xl mx-auto px-6 text-center flex flex-col gap-6 relative z-10">
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight">
            Ready to Digitize Your Procurement Operations?
          </h2>
          <p className="text-white/85 text-xs lg:text-sm font-medium max-w-lg mx-auto leading-relaxed">
            Join thousands of organizations automating supplier negotiations, auditing bids, and paying bills with zero manual inefficiencies.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center mt-3">
            <Button
              onClick={handleLaunchDemo}
              className="w-full sm:w-auto bg-black hover:bg-slate-50 text-slate-800 font-bold py-3 px-6 rounded-xl shadow-lg shadow-black/5"
              leftIcon={<Play className="w-4 h-4 text-primary fill-primary/10" />}
            >
              Launch Demo Console
            </Button>
            <Button
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto bg-transparent border border-white/30 hover:border-white text-white font-bold py-3 px-6 rounded-xl"
            >
              Sign Up Free
            </Button>
          </div>
        </div>
      </section>

      {/* Brand Footer */}
      <footer className="bg-slate-900 text-slate-400 py-10 border-t border-slate-800 select-none">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold shadow-sm">
              <Building2 className="w-4.5 h-4.5" />
            </div>
            <span className="font-extrabold text-white text-sm tracking-tight">VendorBridge</span>
          </div>
          <span className="text-[11px] font-medium text-slate-500">
            © 2026 VendorBridge Corp. All rights reserved. Procurement ERP software.
          </span>
        </div>
      </footer>
    </div>
  );
};
export default LandingPage;
