import type { Metadata } from 'next';
import { AdminDashboard } from '@/features/admin/AdminDashboard';
import '@/styles/pages/admin.css';

export const metadata: Metadata = {
  title: 'Applications — Admin',
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminDashboard />;
}
