'use client';

import React, { useState } from 'react';
import { X, MessageSquare, Check } from 'lucide-react';

interface SlackModalProps {
  isOpen: boolean;
  initialWebhookUrl?: string;
  onClose: () => void;
  onSave: (webhookUrl: string) => void;
}

export function SlackModal({
  isOpen,
  initialWebhookUrl = '',
  onClose,
  onSave,
}: SlackModalProps) {
  const [url, setUrl] = useState(initialWebhookUrl);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(url);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">슬랙(Slack) 연동 설정</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="slack-webhook-input" className="block text-xs font-bold text-slate-700">
              수신 웹훅 URL (Incoming Webhook URL)
            </label>
            <input
              id="slack-webhook-input"
              type="url"
              placeholder="https://hooks.slack.com/services/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-mono"
            />
            <p className="text-[11px] text-slate-500">
              Slack 앱 관리자 콘솔에서 생성한 Incoming Webhook URL을 입력해 주세요.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm"
            >
              <Check className="w-3.5 h-3.5" />
              <span>연동 저장</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

