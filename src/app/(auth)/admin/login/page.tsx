import React from 'react';
import { LoginForm } from '@/modules/auth/presentation/components/login-form';

export const metadata = {
  title: 'CommerceHub - 쇼핑몰 통합 관리자 로그인',
  description: '스토어 운영 관리를 위해 승인된 관리자 계정으로 로그인해 주세요.',
};

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen w-full bg-[#f8fafc] flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Decorative gradient background blur */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50 pointer-events-none" />

      <div className="relative z-10 w-full">
        <LoginForm />
      </div>
    </main>
  );
}

