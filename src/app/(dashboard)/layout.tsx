import React from 'react';
import { createClient } from '@/shared/lib/supabase/server';
import { Sidebar } from '@/shared/components/layout/sidebar';
import { Header } from '@/shared/components/layout/header';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect unauthenticated user
  if (!user) {
    redirect('/login');
  }

  // Logout server action
  async function handleLogout() {
    'use server';
    const serverSupabase = await createClient();
    await serverSupabase.auth.signOut();
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen bg-slate-50/70 text-slate-900 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          userEmail={user.email}
          adminName={user.user_metadata?.name || '김운영'}
          logoutAction={handleLogout}
        />
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}

