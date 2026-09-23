'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AtSign, Lock, Eye, EyeOff, ArrowRight, AlertCircle, ShoppingBag, ShieldCheck, UserCheck } from 'lucide-react';
import { LoginUseCase } from '../../application/use-cases/login.usecase';
import { SupabaseAuthRepository } from '../../infrastructure/supabase-auth.repository';
import { createClient } from '@/shared/lib/supabase/client';

interface CustomerLoginFormProps {
  loginUseCase?: LoginUseCase;
}

export function CustomerLoginForm({ loginUseCase }: CustomerLoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get('redirectTo') || '/';

  const activeUseCase = React.useMemo(() => {
    if (loginUseCase) return loginUseCase;
    const supabase = createClient();
    const repo = new SupabaseAuthRepository(supabase);
    return new LoginUseCase(repo);
  }, [loginUseCase]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const user = await activeUseCase.execute({
        email,
        password,
        rememberMe,
      });

      // 만약 관리자 계정으로 로그인한 경우 관리자 대시보드로, 일반 고객인 경우 쇼핑몰로 이동
      if (user.isAdmin && redirectTo === '/') {
        router.push('/dashboard');
      } else {
        router.push(redirectTo);
      }
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('로그인 처리 중 오류가 발생했습니다. 다시 시도해 주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoFill = () => {
    setEmail('customer@example.com');
    setPassword('customer1234!');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-3xl shadow-xl shadow-blue-100/40 border border-gray-100 p-8 sm:p-10 transition-all">
        {/* Header / Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center gap-2 mb-3">
            <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              FRONT
            </span>
            <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">
              STORE
            </span>
          </Link>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            쇼핑몰 고객 로그인
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1.5 leading-relaxed">
            주문 내역 조회, 배송 추적, 장바구니 혜택을 이용해 보세요.
          </p>
        </div>

        {/* Demo Fast Login Box */}
        <div className="mb-6 p-3.5 bg-blue-50/70 border border-blue-100 rounded-2xl flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-blue-900 font-medium">
            <UserCheck className="w-4 h-4 text-blue-600 shrink-0" />
            <span>빠른 테스트: 고객 데모 계정</span>
          </div>
          <button
            type="button"
            onClick={handleDemoFill}
            className="px-3 py-1 bg-white hover:bg-blue-600 hover:text-white border border-blue-200 text-blue-600 font-bold rounded-lg transition-colors cursor-pointer text-[11px]"
          >
            자동 입력
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div
            role="alert"
            className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-red-700 text-xs animate-shake"
          >
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="leading-relaxed block">{errorMessage}</span>
              {errorMessage.includes('Rate limit') && (
                <p className="text-[11px] text-red-600">
                  Supabase 이메일 제한에 걸린 경우, 위쪽의 <strong>[고객 데모 계정 자동 입력]</strong>을 이용하시면 바로 테스트하실 수 있습니다.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              이메일 주소
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-900"
              />
              <AtSign className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              비밀번호
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-900"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Options */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-gray-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>로그인 상태 유지</span>
            </label>
            <Link href="/track" className="text-xs text-blue-600 hover:underline font-medium">
              비회원 배송조회
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>쇼핑몰 로그인</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Navigation */}
        <div className="mt-8 pt-6 border-t border-gray-100 space-y-3 text-center text-xs">
          <div className="text-gray-500">
            아직 계정이 없으신가요?{' '}
            <Link href="/signup" className="font-bold text-blue-600 hover:underline">
              회원가입하기
            </Link>
          </div>

          <div className="pt-2 border-t border-gray-50 flex items-center justify-center gap-2 text-gray-400">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>스토어 운영자이신가요?</span>
            <Link href="/admin/login" className="font-semibold text-slate-700 hover:text-blue-600 underline">
              관리자 센터 로그인
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

