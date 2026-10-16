import React from 'react';
import { Phone, Heart, ShieldAlert, X } from 'lucide-react';

interface CrisisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CrisisModal: React.FC<CrisisModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-stone-50 rounded-2xl shadow-2xl border border-stone-200 p-6 md:p-8 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-600 transition-colors p-1.5 rounded-lg hover:bg-stone-200/60"
          aria-label="닫기"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-stone-900">전문 심리 상담 및 위기 지원 안내</h3>
            <p className="text-xs text-stone-500">24시간 언제든 도움을 요청할 수 있습니다</p>
          </div>
        </div>

        <div className="bg-amber-50/80 border border-amber-200/70 rounded-xl p-4 mb-5 text-stone-700 text-sm leading-relaxed">
          <p className="font-semibold text-amber-900 mb-1">🌿 상담사 본인도 전문가의 도움이 필요합니다</p>
          <p className="text-stone-600 text-xs">
            이 챗봇은 전문적인 심리 치료나 위기 개입을 대체할 수 없습니다. 타인의 마음을 안아주느라 깊은 어둠에 닿았을 때, 혼자 버티지 마시고 전문 상담 기관의 손을 잡아주세요.
          </p>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-stone-200 shadow-xs">
            <div>
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">위기 대응</span>
              <span className="text-base font-bold text-stone-900">자살예방상담전화</span>
            </div>
            <a
              href="tel:1393"
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-sm font-semibold transition-colors shadow-xs"
            >
              <Phone className="w-4 h-4" />
              1393 (24시간)
            </a>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-stone-200 shadow-xs">
            <div>
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">정신 건강</span>
              <span className="text-base font-bold text-stone-900">정신건강 위기상담전화</span>
            </div>
            <a
              href="tel:1577-0199"
              className="flex items-center gap-1.5 px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-lg text-sm font-semibold transition-colors shadow-xs"
            >
              <Phone className="w-4 h-4" />
              1577-0199 (24시간)
            </a>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg text-sm font-medium transition-colors"
          >
            확인 및 대화 이어가기
          </button>
        </div>
      </div>
    </div>
  );
};
