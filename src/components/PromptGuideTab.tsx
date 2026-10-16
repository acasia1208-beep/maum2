import React, { useState } from 'react';
import {
  Copy,
  CheckCircle2,
  BookOpen,
  ShieldAlert,
  ArrowRight,
  MessageSquare,
  Sparkles,
  HeartHandshake,
  Check,
  Ban,
  Clock,
  HelpCircle,
} from 'lucide-react';
import { META_SYSTEM_PROMPT, SITUATION_LIST, SituationPrompt } from '../data/promptData';

interface PromptGuideTabProps {
  onSelectSituationForChat: (text: string) => void;
  onOpenCrisisModal: () => void;
}

export const PromptGuideTab: React.FC<PromptGuideTabProps> = ({
  onSelectSituationForChat,
  onOpenCrisisModal,
}) => {
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedCardId, setCopiedCardId] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'burnout' | 'relationship' | 'existential'>('all');

  const handleCopyMetaPrompt = () => {
    navigator.clipboard.writeText(META_SYSTEM_PROMPT);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCardId(id);
    setTimeout(() => setCopiedCardId(null), 2000);
  };

  const filteredSituations = SITUATION_LIST.filter((item) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'burnout') return item.id === 'burnout' || item.id === 'evening_unwind' || item.id === 'silence';
    if (selectedFilter === 'relationship') return item.id === 'compassion_fatigue' || item.id === 'isolation' || item.id === 'emotional_suppression';
    if (selectedFilter === 'existential') return item.id === 'self_efficacy' || item.id === 'existential_crisis';
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-12">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-emerald-950 text-stone-100 rounded-3xl p-6 sm:p-10 shadow-lg border border-stone-700/50">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
              <span>PDF 원문 완벽 수록</span>
              <span aria-hidden="true">·</span>
              <span>진로상담가 전용 심리 지지 프롬프트 세트</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight">
              마음 쉼터 메타프롬프트 &amp; 설계 원칙
            </h1>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              감정 소진 · 공감 피로 · 자기 회의 · 직업적 고립감을 따뜻하게 안아주는 AI 챗봇 시스템 프롬프트 전문과 8가지 표준 장면 가이드라인입니다.
            </p>
          </div>

          <button
            onClick={handleCopyMetaPrompt}
            className="flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-sm transition-all shadow-md active:scale-98 shrink-0"
          >
            {copiedPrompt ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>복사되었습니다!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>시스템 프롬프트 전문 복사</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Meta-prompt viewer */}
      <section className="bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
              <BookOpen className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-stone-900">🔧 시스템 프롬프트 — 메타프롬프트</h2>
              <p className="text-xs text-stone-500">
                AI 챗봇 시스템 프롬프트(System Instruction) 입력창에 전문을 그대로 붙여넣어 활용합니다.
              </p>
            </div>
          </div>

          <button
            onClick={handleCopyMetaPrompt}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium rounded-lg transition-colors"
          >
            {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedPrompt ? '복사 완료' : '텍스트 복사'}
          </button>
        </div>

        <div className="relative">
          <pre className="p-5 bg-stone-900 text-stone-200 rounded-xl text-xs sm:text-sm font-mono overflow-x-auto leading-relaxed border border-stone-800 scrollbar-thin">
            {META_SYSTEM_PROMPT}
          </pre>
        </div>
      </section>

      {/* 5 Core Principles & 3-Step Structure */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Core Principles */}
        <div className="bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-base border-b border-stone-100 pb-3">
            <HeartHandshake className="w-5 h-5 text-emerald-700" />
            <h3>마음 쉼터의 5대 핵심 원칙</h3>
          </div>
          <ol className="space-y-3 text-sm text-stone-700">
            <li className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-stone-50 transition-colors">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs shrink-0 mt-0.5">
                1
              </span>
              <div>
                <strong className="text-stone-900">해결하려 하지 않습니다:</strong>
                <p className="text-stone-600 text-xs mt-0.5">조언보다 공감이 먼저입니다. 즉각적인 해결책 처방을 금합니다.</p>
              </div>
            </li>
            <li className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-stone-50 transition-colors">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs shrink-0 mt-0.5">
                2
              </span>
              <div>
                <strong className="text-stone-900">상담사를 "내담자"로 대하지 않습니다:</strong>
                <p className="text-stone-600 text-xs mt-0.5">동료처럼, 믿을 수 있고 동등한 존재처럼 부드럽게 말합니다.</p>
              </div>
            </li>
            <li className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-stone-50 transition-colors">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs shrink-0 mt-0.5">
                3
              </span>
              <div>
                <strong className="text-stone-900">전문성을 인정합니다:</strong>
                <p className="text-stone-600 text-xs mt-0.5">상담사는 이론과 기법을 이미 알고 있습니다. 가르치려 들지 않습니다.</p>
              </div>
            </li>
            <li className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-stone-50 transition-colors">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs shrink-0 mt-0.5">
                4
              </span>
              <div>
                <strong className="text-stone-900">판단하지 않습니다:</strong>
                <p className="text-stone-600 text-xs mt-0.5">어떤 감정도 "그래서는 안 되는 감정"이 없습니다. 분노와 회의도 허용합니다.</p>
              </div>
            </li>
            <li className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-stone-50 transition-colors">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs shrink-0 mt-0.5">
                5
              </span>
              <div>
                <strong className="text-stone-900">강요하지 않습니다:</strong>
                <p className="text-stone-600 text-xs mt-0.5">말하고 싶지 않으면 말하지 않아도 됩니다. 침묵도 대화의 일부입니다.</p>
              </div>
            </li>
          </ol>
        </div>

        {/* 3-Step Structure & Voice Rules */}
        <div className="bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-stone-900 font-bold text-base border-b border-stone-100 pb-3">
            <Sparkles className="w-5 h-5 text-emerald-700" />
            <h3>응답 3단계 구조 &amp; 설계 원칙</h3>
          </div>

          <div className="space-y-3">
            {/* Steps flow */}
            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/80 space-y-2.5">
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
                모든 응답의 표준 시퀀스
              </span>
              <div className="flex items-center gap-1 sm:gap-2 text-xs font-medium">
                <div className="flex-1 bg-emerald-100 text-emerald-900 py-2 px-2 text-center rounded-lg border border-emerald-200">
                  1) 감정 반영
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <div className="flex-1 bg-blue-100 text-blue-900 py-2 px-2 text-center rounded-lg border border-blue-200">
                  2) 정상화
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <div className="flex-1 bg-purple-100 text-purple-900 py-2 px-1 text-center rounded-lg border border-purple-200">
                  3) (선택) 탐색
                </div>
              </div>
              <p className="text-[11px] text-stone-500 leading-normal">
                탐색 질문은 꼭 필요할 때만, 한 번에 하나만 합니다. 감정을 먼저 충분히 받아낸 후에 조심스럽게 질문합니다.
              </p>
            </div>

            {/* Constraints */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/60">
                <div className="flex items-center gap-1.5 font-bold text-stone-800 mb-1">
                  <Clock className="w-3.5 h-3.5 text-stone-600" />
                  응답 길이 원칙
                </div>
                <p className="text-stone-600 text-[11px] leading-relaxed">
                  한 번에 3~5문장 이하로 짧게. 긴 응답은 설교처럼 들립니다.
                </p>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/60">
                <div className="flex items-center gap-1.5 font-bold text-stone-800 mb-1">
                  <HelpCircle className="w-3.5 h-3.5 text-stone-600" />
                  질문 최소화
                </div>
                <p className="text-stone-600 text-[11px] leading-relaxed">
                  질문은 한 번에 하나만. 사용자가 답하지 않아도 강요하지 않습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 8 Situations Guide */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
          <div>
            <h2 className="text-xl font-bold text-stone-900">
              💬 상황별 프롬프트 세트 — 8가지 표준 장면
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              상담 현장에서 마주하는 핵심 탈진 상황과 심리 지지 모범 응답 예시입니다.
            </p>
          </div>

          {/* Interactive filter tabs */}
          <div className="flex items-center gap-1 p-1 bg-stone-200/80 rounded-xl text-xs font-medium self-start sm:self-auto">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                selectedFilter === 'all'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              전체 8장면
            </button>
            <button
              onClick={() => setSelectedFilter('burnout')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                selectedFilter === 'burnout'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              소진·퇴근·침묵
            </button>
            <button
              onClick={() => setSelectedFilter('relationship')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                selectedFilter === 'relationship'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              내담자·고립·억제
            </button>
            <button
              onClick={() => setSelectedFilter('existential')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                selectedFilter === 'existential'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              효능감·회의감
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSituations.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-stone-200/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition-all group"
            >
              <div className="space-y-3.5">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-stone-600 font-semibold mb-1">
                      <span>상황 {item.situationNumber}</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.subtitle}</span>
                    </div>
                    <h3 className="text-base font-bold text-stone-900 group-hover:text-emerald-900 transition-colors">
                      {item.chipIcon} {item.title}
                    </h3>
                  </div>

                  <button
                    onClick={() => handleCopyText(item.sampleDefault, item.id)}
                    className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
                    title="모범 응답 복사"
                  >
                    {copiedCardId === item.id ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* When to use */}
                <div className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-200/50">
                  <span className="font-semibold text-stone-700">사용 시점: </span>
                  {item.whenToUse}
                </div>

                {/* Response Direction */}
                <div className="text-xs text-stone-700 leading-relaxed">
                  <span className="font-bold text-emerald-900 block mb-0.5">응답 방향:</span>
                  {item.responseDirection}
                </div>

                {/* Sample Default Response */}
                <div className="bg-stone-100/70 p-3.5 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-800 leading-relaxed font-sans whitespace-pre-wrap">
                  <div className="text-[11px] font-semibold text-stone-600 uppercase tracking-wider mb-1">
                    기본 응답 예시
                  </div>
                  {item.sampleDefault}
                </div>

                {/* Follow up response */}
                {item.sampleFollowUp && (
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/60 text-xs text-stone-700 leading-relaxed whitespace-pre-wrap">
                    <span className="font-semibold text-stone-600 block mb-1">
                      {item.sampleFollowUp.condition}:
                    </span>
                    {item.sampleFollowUp.text}
                  </div>
                )}
              </div>

              {/* Action button */}
              <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[11px] text-stone-600">
                  첫 화면 버튼: <span className="font-medium text-stone-700">"{item.chipText}"</span>
                </span>
                <button
                  onClick={() => onSelectSituationForChat(item.chipText)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-lg transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>대화창에서 시험</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Ethics & Crisis Notice Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
            <ShieldAlert className="w-4 h-4 text-amber-700" />
            <span>위기 상황 대응 매뉴얼 및 안내</span>
          </div>
          <p className="text-xs text-amber-950 leading-relaxed max-w-2xl">
            자해·자살에 관한 표현이 감지될 경우 대화를 중단하지 않고 부드럽게 위기 상담 전화를 안내합니다.
            <br />
            <strong>자살예방상담전화: 1393 (24시간)</strong> · <strong>정신건강 위기상담전화: 1577-0199 (24시간)</strong>
          </p>
        </div>

        <button
          onClick={onOpenCrisisModal}
          className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-semibold transition-colors shrink-0 shadow-xs"
        >
          위기 지원 안내 보기
        </button>
      </div>
    </div>
  );
};
