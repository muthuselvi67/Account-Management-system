import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MessageSquare, 
  FileText, 
  ShoppingCart, 
  Package, 
  FileCheck, 
  CreditCard, 
  Percent, 
  Scissors,
  ArrowRight
} from 'lucide-react';

const clientModules = [
  {
    title: 'Communication',
    description: 'Manage incoming communications and client enquiries.',
    icon: MessageSquare,
    path: '/client-communications',
    iconColor: 'text-purple-600',
    iconBg: 'bg-purple-50',
    borderColor: 'border-purple-100',
    buttonBg: 'bg-purple-50 hover:bg-purple-100',
    buttonText: 'text-purple-700',
    shadowColor: 'hover:shadow-purple-500/10'
  },
  {
    title: 'Quotations',
    description: 'Create and track quotations sent to clients.',
    icon: FileText,
    path: '/client-quotations',
    iconColor: 'text-orange-500',
    iconBg: 'bg-orange-50',
    borderColor: 'border-orange-100',
    buttonBg: 'bg-orange-50 hover:bg-orange-100',
    buttonText: 'text-orange-700',
    shadowColor: 'hover:shadow-orange-500/10'
  },
  {
    title: 'Purchase Orders',
    description: 'Track purchase orders received from your clients.',
    icon: ShoppingCart,
    path: '/client-pos',
    iconColor: 'text-pink-500',
    iconBg: 'bg-pink-50',
    borderColor: 'border-pink-100',
    buttonBg: 'bg-pink-50 hover:bg-pink-100',
    buttonText: 'text-pink-700',
    shadowColor: 'hover:shadow-pink-500/10'
  },
  {
    title: 'Services / Products',
    description: 'Log and monitor products or services supplied.',
    icon: Package,
    path: '/client-deliveries',
    iconColor: 'text-teal-600',
    iconBg: 'bg-teal-50',
    borderColor: 'border-teal-100',
    buttonBg: 'bg-teal-50 hover:bg-teal-100',
    buttonText: 'text-teal-700',
    shadowColor: 'hover:shadow-teal-500/10'
  },
  {
    title: 'Sales Invoices (GST)',
    description: 'Manage sales invoices issued to clients.',
    icon: FileCheck,
    path: '/client-invoices',
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-50',
    borderColor: 'border-blue-100',
    buttonBg: 'bg-blue-50 hover:bg-blue-100',
    buttonText: 'text-blue-700',
    shadowColor: 'hover:shadow-blue-500/10'
  },
  {
    title: 'Payments Received',
    description: 'Track all payments received from clients.',
    icon: CreditCard,
    path: '/client-payments',
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-50',
    borderColor: 'border-emerald-100',
    buttonBg: 'bg-emerald-50 hover:bg-emerald-100',
    buttonText: 'text-emerald-700',
    shadowColor: 'hover:shadow-emerald-500/10'
  },
  {
    title: 'GST',
    description: 'Manage Output GST collected from clients.',
    icon: Percent,
    path: '/output-gst',
    iconColor: 'text-violet-600',
    iconBg: 'bg-violet-50',
    borderColor: 'border-violet-100',
    buttonBg: 'bg-violet-50 hover:bg-violet-100',
    buttonText: 'text-violet-700',
    shadowColor: 'hover:shadow-violet-500/10'
  },
  {
    title: 'TDS',
    description: 'Track TDS deducted by clients.',
    icon: Scissors,
    path: '/client-tds',
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-50',
    borderColor: 'border-amber-100',
    buttonBg: 'bg-amber-50 hover:bg-amber-100',
    buttonText: 'text-amber-700',
    shadowColor: 'hover:shadow-amber-500/10'
  }
];

export default function ClientsHub() {
  return (
    <div className="flex-1 space-y-6 p-2 sm:p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
        {clientModules.map((module, idx) => (
          <div 
            key={idx}
            className={`bg-white dark:bg-dark-900 rounded-[16px] border ${module.borderColor} dark:border-dark-800 p-6 flex flex-col transition-all duration-300 hover:shadow-xl ${module.shadowColor} hover:-translate-y-1 group animate-scale-in`}
            style={{ animationFillMode: 'both', animationDelay: `${idx * 75}ms` }}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 ${module.iconBg} dark:bg-opacity-20`}>
              <module.icon className={`${module.iconColor} dark:text-opacity-90`} size={28} strokeWidth={1.5} />
            </div>
            
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">
              {module.title}
            </h3>
            
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex-1">
              {module.description}
            </p>
            
            <Link 
              to={module.path}
              className={`inline-flex items-center justify-center w-full gap-2 py-2.5 px-4 ${module.buttonBg} dark:bg-opacity-10 ${module.buttonText} font-medium text-sm rounded-xl transition-colors duration-200`}
            >
              Open Module
              <ArrowRight size={16} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
