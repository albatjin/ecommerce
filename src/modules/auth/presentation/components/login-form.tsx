'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AtSign, Lock, Eye, EyeOff, ShieldCheck, ArrowRight, AlertTriangle, AlertCircle } from 'lucide-react';
import { LoginUseCase } from '../../application/use-cases/login.usecase';
import { SupabaseAuthRepository } from '../../infrastructure/supabase-auth.repository';
import { createClient } from '@/shared/lib/supabase/client';

interface LoginFormProps {
  loginUseCase?: LoginUseCase;
}

export function LoginForm({ loginUseCase }: LoginFormProps) {
  const router = useRouter();

  // If useCase not injected (e.g. in real page), instantiate with browser supabase client
  const activeUseCase = React.useMemo(() => {
    if (loginUseCase) return loginUseCase;
    const supabase = createClient();
    const repo = new SupabaseAuthRepository(supabase);
    return new LoginUseCase(repo);
  }, [loginUseCase]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      await activeUseCase.execute({
        email,
        password,
        rememberMe,
      });

      router.push('/dashboard');
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('서버에 연결할 수 없습니다. 다시 시도해 주세요');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-xl shadow-indigo-100/50 border border-gray-100 p-8 sm:p-9 transition-all">
        {/* Header / Logo */}
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-200">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M7 10l5-5 5 5H7zm10 4l-5 5-5-5h10z" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">CommerceHub</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            Enterprise Ops v4.1
          </div>

          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            쇼핑몰 통합 관리자 센터
          </h1>
          <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
            스토어 운영 관리를 위해 승인된 계정으로 로그인해 주세요.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div
            role="alert"
            data-testid="login-error-alert"
            className="mt-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-rose-700 text-xs animate-shake"
          >
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-medium leading-relaxed block">{errorMessage}</span>
              {errorMessage.includes('Rate limit') && (
                <p className="text-[11px] text-rose-600 mt-1">
                  💡 Supabase 무료 이메일 전송 제한이 걸렸을 때는 아래 <strong>빠른 테스트 계정</strong>을 사용하시면 인증 메일 없이 즉시 로그인할 수 있습니다.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Quick Demo Fill Buttons */}
        <div className="mt-4 p-3 bg-gray-50 border border-gray-100 rounded-xl">
          <p className="text-[11px] font-bold text-gray-700 mb-2 flex items-center justify-between">
            <span>🚀 빠른 테스트 계정 입력:</span>
            <span className="text-[10px] text-gray-400 font-normal">원클릭 자동 채우기</span>
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setEmail('admin@commercehub.co.kr');
                setPassword('admin1234!');
              }}
              className="py-1.5 px-2 bg-white hover:bg-indigo-50 border border-gray-200 hover:border-indigo-300 rounded-lg text-xs font-semibold text-gray-700 transition-colors text-center cursor-pointer"
            >
              관리자 (Admin)
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('customer@example.com');
                setPassword('customer1234!');
              }}
              className="py-1.5 px-2 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg text-xs font-semibold text-gray-700 transition-colors text-center cursor-pointer"
            >
              일반 고객 (Customer)
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Email / ID */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label htmlFor="admin-email" className="text-xs font-semibold text-gray-700">
                관리자 아이디 (이메일)
              </label>
              <span className="text-[11px] font-mono text-gray-400">SSO / Local</span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <AtSign className="w-4 h-4" />
              </div>
              <input
                id="admin-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@commercehub.co.kr"
                className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-gray-900 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label htmlFor="admin-password" className="text-xs font-semibold text-gray-700">
                비밀번호
              </label>
              <span className="text-[11px] text-gray-400">보안 등급 표준</span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-2.5 text-sm bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-gray-900 placeholder-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* 2FA Card */}
          <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-blue-950">2차 인증 (OTP) 강제 적용</p>
              <p className="text-[11px] text-blue-800/80 mt-0.5 leading-snug">
                로그인 완료 후 등록된 모바일 기기로 6자리 2차 OTP 인증이 요청됩니다.
              </p>
            </div>
          </div>

          {/* Remember Me & Help */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <span className="text-xs text-gray-600">아이디 기억하기</span>
            </label>
            <button
              type="button"
              onClick={() => alert('관리자 비밀번호 초기화는 IT 보안팀(admin-sec@commercehub.co.kr)으로 문의 바랍니다.')}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
            >
              비밀번호 찾기 / 계정 문의
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-semibold text-sm shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>로그인</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Navigation Links */}
        <div className="mt-5 space-y-2 text-center text-xs text-gray-500">
          <div>
            아직 계정이 없으신가요?{' '}
            <Link href="/signup" className="font-bold text-indigo-600 hover:underline">
              회원가입하기
            </Link>
          </div>
          <div className="pt-2 border-t border-gray-100 flex items-center justify-center gap-3 text-xs">
            <Link href="/login" className="text-gray-600 hover:text-indigo-600 font-medium">
              일반 고객 로그인
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="/" className="text-gray-600 hover:text-indigo-600 font-medium">
              쇼핑몰 홈으로 이동
            </Link>
          </div>
        </div>

        {/* Security Policy Card */}
        <div className="mt-5 p-3.5 bg-rose-50/70 border border-rose-100 rounded-xl flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-rose-900">보안 관리 규정 안내</p>
            <p className="text-[11px] text-rose-700/90 mt-0.5 leading-snug">
              안전한 쇼핑몰 운영을 위해 인가된 관리자만 접근 가능합니다.
              <br />
              <strong className="font-semibold text-rose-800">5회 이상 실패 시 계정이 자동 잠금 처리됩니다.</strong>
            </p>
          </div>
        </div>

        {/* Footer Status Bar */}
        <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400 font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-gray-500 font-sans">Auth API Normal</span>
          </div>
          <span>Seoul-KR (AP-NORTHEAST-2)</span>
        </div>
      </div>

      {/* Bottom Copyright */}
      <p className="text-xs text-gray-400 text-center mt-6">
        © 2025 CommerceHub Inc. All rights reserved.
      </p>
    </div>
  );
}

