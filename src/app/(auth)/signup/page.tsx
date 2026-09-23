import React from 'react';
import { SignupForm } from '@/modules/auth/presentation/components/signup-form';

export const metadata = {
  title: '신규 회원가입 - FRONT 쇼핑몰',
  description: 'FRONT 쇼핑몰 회원으로 가입하고 다양한 혜택을 누리세요.',
};

export default function SignupPage() {
  return (
    <main className="min-h-screen w-full bg-[#f8fafc] flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Decorative gradient background blur */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-50 pointer-events-none" />

      <div className="relative z-10 w-full">
        <SignupForm />
      </div>
    </main>
  );
}

