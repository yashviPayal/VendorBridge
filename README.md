# 🌐 VendorBridge - Next-Gen Enterprise Procurement ERP

VendorBridge is a modern, production-grade **Procurement & Vendor Management ERP** platform designed to digitize and automate supply chain operations. The platform connects purchasing departments and supplier pools under a unified workspace, enabling seamless communication and tracking from initial Request for Quotation (RFQ) through to final payment settlement.

Built with **React 19**, **Vite**, **TypeScript**, **Zustand**, and **Tailwind CSS**, it features a fully persistent mock database synchronized with browser local storage and high-fidelity interactive animations (using **GSAP** and **Framer Motion**).

---

## ✨ Core Features

*   **Multi-Role Workspace**: Custom UI/UX, permission limits, and active dashboard panels tailored for **Admins**, **Procurement Officers**, **Vendors**, and **Managers**.
*   **Vendor Directory**: Manage verified partner listings, store ISO compliance certificates, track GST credentials, and audit ratings.
*   **RFQ Multi-Step Wizard**: Design procurement checklists, add item specifications, set submission deadlines, and invite select supplier pools.
*   **Quotation Comparison Matrix**: Side-by-side analysis of vendor bids. Highlights the lowest quote in emerald green, ranks delivery speeds, rates suppliers, and computes trust scores.
*   **Manager Approval Pathways**: Multi-level cost authorization loops, history logs, remarks input, and approval stage timeline tracking.
*   **Purchase Orders (PO)**: Auto-compiles contracts with unique PO numbers, tracks delivery logs, and supports vendor acknowledgement triggers.
*   **Tax Invoices**: Dynamic CGST/SGST tax split calculators (9% each), high-fidelity browser print/PDF templates, and a simulated email delivery composer.
*   **Auditing & Analytics**: Filterable operational transaction audit trails and spend analytics dashboards powered by Recharts (Spend trends & category distribution).

---

## 🎨 Design & Interactions

*   **GSAP 3D Scroll Bezel**: The landing page features a smooth 3D perspective dashboard preview. As you scroll, the screen bezel tilts, scales, and settles into standard flat view using GSAP ScrollTrigger.
*   **Light Theme Orbital Timeline**: An interactive, custom-drawn SVG orbital roadmap illustrating the 5 operational stages of the procurement lifecycle. Hover and click events expand detailed checklist items and connected workflows.
*   **Premium Color Tokens**: Tailored color system utilizing slate gray foundations, deep indigo-to-purple accents, and specific validation badge colors.
*   **Mobile-First Responsive Layout**: 
    *   *Collapsing Side Drawer*: The dashboard sidebar collapses into a sliding absolute drawer on mobile/tablet viewports, toggled by a topbar hamburger icon.
    *   *Adaptive Topbar*: Path breadcrumbs simplify on mobile devices to prevent layout squishing.
    *   *Responsive DataTables*: Row cells automatically scale, and tables support horizontal scrolling (`overflow-x-auto`) for wide data sets.

---

## 🛠️ Technology Stack

*   **Core**: React 19 (Client), Vite (Bundler), TypeScript (Typing)
*   **Styling & FX**: Tailwind CSS v4, Framer Motion, GSAP (Scroll animations)
*   **State Database**: Zustand (with state sync to `localStorage` key `'vendorbridge_db'`)
*   **Form Engines**: React Hook Form, Zod (Schema validation)
*   **Analytics Graphs**: Recharts
*   **Icons**: Lucide React

---

## 📂 Project Architecture

```
d:/VendorBridge/
├── vercel.json               # Vercel URL rewrite configurations for SPA routes
├── .vercelignore             # Tells Vercel to ignore requirements.txt
├── requirements.txt          # Node dependencies list (Python format)
├── package.json              # Main project scripts and dependencies
├── src/
│   ├── main.tsx              # Application entrypoint
│   ├── App.tsx               # Route declarations and role gates
│   ├── index.css             # Tailwind layers, scrollbars, and print rules
│   ├── store/
│   │   └── useStore.ts       # Central database and state operations
│   ├── routes/
│   │   └── ProtectedRoute.tsx # Route permission checker by user role
│   ├── components/
│   │   ├── layout/           # Sidebar, Topbar, Layout shells
│   │   └── ui/               # Button, Input, Modal, DataTable, Timeline
│   └── features/
│       ├── auth/             # Login, Register, AuthLayout
│       ├── landing/          # LandingPage, pricing modules
│       ├── dashboard/        # Dashboard KPIs & quick actions
│       ├── vendors/          # Vendor profiles & document uploads
│       ├── rfqs/             # RFQs lists & creation wizard
│       ├── quotations/       # Quotation submissions & comparison matrices
│       ├── approvals/        # Manager sign-offs
│       ├── purchase-orders/  # PO contract displays
│       ├── invoices/         # Invoice tax calculators and printers
│       ├── activity-logs/    # Platform transaction audit trails
│       └── reports/          # Recharts spend dashboards
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have **Node.js** (v18.0.0+) and **npm** (v9.0.0+) installed on your machine.

### Installation

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/shreekant-lohagale/VendorBridge.git
    cd VendorBridge
    ```

2.  **Install Node Modules**:
    ```bash
    npm install
    ```

3.  **Launch Dev Server**:
    ```bash
    npm run dev
    ```
    Open the logged URL in your browser (e.g. `http://localhost:5173`).

4.  **Production Compilation**:
    ```bash
    npm run build
    ```

---

## 🧪 Integration Testing Scenario

To test the complete procurement loop end-to-end:

1.  **Sign In**: Go to the login screen, click the **Quick Start Demo** modal, and select **Procurement Officer**.
2.  **Create RFQ**: Go to *RFQs* -> *Create RFQ*. Add a title, items, and assign them to *Global Tech Solutions*. Submit.
3.  **Submit Quote**: Sign out. Login as **Vendor**. Go to *RFQs* -> open the assigned request -> Click *Submit Quotation*. Input your rates/deadline and submit.
4.  **Compare Matrix**: Sign out. Login as **Procurement Officer**. Go to *RFQs* -> open details -> *Compare Quotations Matrix*. Select the quotation and click **Send for Approval**.
5.  **Authorize**: Sign out. Login as **Manager**. Go to *Approvals* -> review the cost checklist, input remarks, and click **Approve** (L1 & L2 approvals).
6.  **Issue PO**: Login as **Procurement Officer**. Go to *RFQs* -> open the approved request -> Click **Generate Purchase Order**.
7.  **Invoice & Settle**: Login as **Vendor**. Go to *Purchase Orders* -> *Acknowledge Order* -> Click *Generate Invoice*. Sign back in as **Procurement Officer** and go to *Invoices* -> *Settle Payment*.
8.  **Audit Logs**: Check *Activity Logs* and *Reports* to verify transaction history and spend chart updates.

---

## ☁️ Vercel Deployment

VendorBridge is optimized for seamless deployment on Vercel:

1.  **SPA Routing Support**: The `vercel.json` file redirects all sub-paths (`/(.*)`) to `index.html` to prevent 404 errors during page refreshes on client-side routing.
2.  **Ignores requirements.txt**: The `.vercelignore` file tells Vercel's build engine to bypass `requirements.txt` to prevent Vercel from mistaking the project for a Python serverless function and throwing compilation errors.

Simply import your repository on your Vercel Dashboard, select **Vite** as the framework preset, and deploy!
