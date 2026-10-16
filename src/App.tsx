import React, { useState } from 'react';
import {
  MessageSquare,
  BookOpen,
  Scale,
  Coffee,
  Heart,
  ShieldAlert,
  Sparkles,
  Phone,
} from 'lucide-react';
import { ChatTab } from './components/ChatTab';
import { PromptGuideTab } from './components/PromptGuideTab';
import { ComparisonTab } from './components/ComparisonTab';
import { CalmSpaceTab } from './components/CalmSpaceTab';
import { CrisisModal } from './components/CrisisModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'guide' | 'compare' | 'calm'>('chat');
  const [isCrisisModalOpen, setIsCrisisModalOpen] = useState(false);
  const [initialChatQuery, setInitialChatQuery] = useState<string | undefined>(undefined);

  const handleSelectSituationForChat = (text: string) => {
    setInitialChatQuery(text);
    setActiveTab('chat');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-800 font-sans flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Navigation & Brand Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold text-lg shadow-xs">
              🌿
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-serif font-bold text-stone-900 tracking-tight">
                  마음 쉼터
                </span>
                <span className="text-xs text-stone-500 font-normal hidden sm:inline">
                  진로상담가를 위한 심리 지지 AI
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-stone-600">
                <span>소진</span>
                <span aria-hidden="true">·</span>
                <span>공감 피로</span>
                <span aria-hidden="true">·</span>
                <span>자기 회의</span>
                <span aria-hidden="true">·</span>
                <span>직업적 고립감 치유</span>
              </div>
            </div>
          </div>

          {/* Crisis Hotline Quick Button */}
          <button
            onClick={() => setIsCrisisModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 rounded-xl text-xs font-semibold transition-colors"
            title="위기 상담 핫라인 (1393, 1577-0199)"
          >
            <Phone className="w-3.5 h-3.5 text-amber-700" />
            <span className="hidden sm:inline">24시간 위기지원</span>
            <span className="font-mono text-amber-800">1393</span>
          </button>
        </div>

        {/* Tab Navigation Bar */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none border-t border-stone-100 py-1.5">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'chat'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>💬 마음 위로 대화 (체험)</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'guide'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>📚 프롬프트 세트 &amp; 가이드북</span>
          </button>

          <button
            onClick={() => setActiveTab('compare')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'compare'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>⚖️ 금지 vs 권장 표현 비교</span>
          </button>

          <button
            onClick={() => setActiveTab('calm')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'calm'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Coffee className="w-3.5 h-3.5" />
            <span>☕ 상담사 쉼터 (호흡·이완)</span>
          </button>
        </div>
      </header>

      {/* Main Content View */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'chat' && (
          <ChatTab
            onOpenCrisisModal={() => setIsCrisisModalOpen(true)}
            initialQuery={initialChatQuery}
          />
        )}
        {activeTab === 'guide' && (
          <PromptGuideTab
            onSelectSituationForChat={handleSelectSituationForChat}
            onOpenCrisisModal={() => setIsCrisisModalOpen(true)}
          />
        )}
        {activeTab === 'compare' && <ComparisonTab />}
        {activeTab === 'calm' && <CalmSpaceTab />}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white/70 py-6 text-center text-xs text-stone-500">
        <div className="max-w-4xl mx-auto px-4 space-y-2">
          <p className="font-serif italic text-stone-700">
            "이 챗봇은 전문적인 심리 치료를 대체하지 않습니다. 상담사 본인도 필요할 때 전문가의 도움을 받을 자격이 있습니다. 🌿"
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 text-stone-600 text-[11px]">
            <span>진로상담가를 위한 마음 위로 챗봇 프롬프트 세트</span>
            <span aria-hidden="true">·</span>
            <span>24시간 자살예방상담전화: 1393</span>
            <span aria-hidden="true">·</span>
            <span>정신건강위기상담전화: 1577-0199</span>
          </div>
        </div>
      </footer>

      {/* Crisis Modal */}
      <CrisisModal
        isOpen={isCrisisModalOpen}
        onClose={() => setIsCrisisModalOpen(false)}
      />
    </div>
  );
}
