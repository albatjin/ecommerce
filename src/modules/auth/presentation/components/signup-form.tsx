'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, AtSign, Lock, Eye, EyeOff, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { SignupUseCase } from '../../application/use-cases/signup.usecase';
import { SupabaseAuthRepository } from '../../infrastructure/supabase-auth.repository';
import { createClient } from '@/shared/lib/supabase/client';

interface SignupFormProps {
  signupUseCase?: SignupUseCase;
}

export function SignupForm({ signupUseCase }: SignupFormProps) {
  const router = useRouter();

  const activeUseCase = React.useMemo(() => {
    if (signupUseCase) return signupUseCase;
    const supabase = createClient();
    const repo = new SupabaseAuthRepository(supabase);
    return new SignupUseCase(repo);
  }, [signupUseCase]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!agreed) {
      setErrorMessage('이용약관 및 개인정보 처리방침에 동의해 주세요.');
      return;
    }

    setIsLoading(true);

    try {
      await activeUseCase.execute({
        name,
        email,
        password,
        confirmPassword,
      });

      setIsSuccess(true);
      setTimeout(() => {
        router.push('/login?registered=true');
      }, 1500);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full max-w-md mx-auto bg-white rounded-3xl border border-gray-100 p-8 sm:p-10 shadow-xl text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-gray-900">회원가입이 완료되었습니다!</h2>
        <p className="text-sm text-gray-500">
          FRONT 쇼핑몰에 오신 것을 환영합니다.<br />
          잠시 후 로그인 페이지로 자동 이동합니다.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all"
        >
          <span>로그인 페이지로 즉시 이동</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-3xl shadow-xl shadow-blue-100/40 border border-gray-100 p-8 sm:p-10 transition-all">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 mb-3 font-black text-xl tracking-tight">
            F
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            신규 회원가입
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1.5">
            계정을 생성하고 특별한 회원 혜택과 빠른 주문을 누려보세요.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-red-700 text-xs animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
            <div className="space-y-1">
              <span className="leading-relaxed block">{errorMessage}</span>
              {errorMessage.includes('Rate limit') && (
                <div className="text-[11px] text-gray-600 bg-white/80 p-2.5 rounded-lg border border-red-100 mt-2">
                  <p className="font-bold text-gray-800 mb-1">🛠️ 해결 방법 (Supabase 관리자):</p>
                  <p>
                    Supabase 대시보드 <strong>Authentication → Providers → Email</strong>에서{' '}
                    <strong>&quot;Confirm email&quot;</strong> 옵션을 끄시면(OFF) 이메일 인증 발송 없이 무제한으로 즉시 회원가입이 완료됩니다.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              이름 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="홍길동"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-900"
              />
              <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              이메일 주소 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-900"
              />
              <AtSign className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              비밀번호 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="최소 6자 이상"
                required
                className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-900"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              비밀번호 확인 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="비밀번호 재입력"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-900"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Terms Agreement */}
          <div className="pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-gray-600 select-none">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>
                <strong className="text-gray-900 font-semibold">이용약관</strong> 및{' '}
                <strong className="text-gray-900 font-semibold">개인정보 처리방침</strong>에 동의합니다. (필수)
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>회원가입 완료</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-8 pt-6 border-t border-gray-100 text-center text-xs text-gray-500">
          이미 계정이 있으신가요?{' '}
          <Link href="/login" className="font-bold text-blue-600 hover:underline">
            로그인하기
          </Link>
        </div>
      </div>
    </div>
  );
}

