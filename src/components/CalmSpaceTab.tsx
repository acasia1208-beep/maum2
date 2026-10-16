import React, { useState, useEffect } from 'react';
import {
  Wind,
  Sparkles,
  Heart,
  Feather,
  RefreshCw,
  Copy,
  Check,
  Send,
  Coffee,
  CheckCircle2,
} from 'lucide-react';
import { COMFORT_CARDS } from '../data/promptData';

export const CalmSpaceTab: React.FC = () => {
  // Breathing state: 4s inhale, 7s hold, 8s exhale
  const [breathingPhase, setBreathingPhase] = useState<'idle' | 'inhale' | 'hold' | 'exhale'>('idle');
  const [countdown, setCountdown] = useState(4);
  const [cycleCount, setCycleCount] = useState(0);

  // Quote cards state
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [copiedQuote, setCopiedQuote] = useState(false);

  // Letting go journal state
  const [burdenText, setBurdenText] = useState('');
  const [isReleasing, setIsReleasing] = useState(false);
  const [released, setReleased] = useState(false);

  // Breathing loop timer
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (breathingPhase === 'inhale') {
      if (countdown > 1) {
        timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
      } else {
        setBreathingPhase('hold');
        setCountdown(7);
      }
    } else if (breathingPhase === 'hold') {
      if (countdown > 1) {
        timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
      } else {
        setBreathingPhase('exhale');
        setCountdown(8);
      }
    } else if (breathingPhase === 'exhale') {
      if (countdown > 1) {
        timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
      } else {
        setCycleCount((c) => c + 1);
        setBreathingPhase('inhale');
        setCountdown(4);
      }
    }

    return () => clearTimeout(timer);
  }, [breathingPhase, countdown]);

  const startBreathing = () => {
    setBreathingPhase('inhale');
    setCountdown(4);
    setCycleCount(0);
  };

  const stopBreathing = () => {
    setBreathingPhase('idle');
    setCountdown(4);
  };

  const nextQuote = () => {
    setCurrentQuoteIndex((prev) => (prev + 1) % COMFORT_CARDS.length);
  };

  const handleCopyQuote = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedQuote(true);
    setTimeout(() => setCopiedQuote(false), 2000);
  };

  const handleReleaseBurden = (e: React.FormEvent) => {
    e.preventDefault();
    if (!burdenText.trim()) return;

    setIsReleasing(true);
    setTimeout(() => {
      setIsReleasing(false);
      setReleased(true);
      setBurdenText('');
    }, 1800);
  };

  const activeQuote = COMFORT_CARDS[currentQuoteIndex];

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-12">
      {/* Intro Header */}
      <div className="space-y-2 border-b border-stone-200 pb-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
          <Coffee className="w-4 h-4 text-emerald-700" />
          <span>상담사 온기 쉼터</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
          마음 돌봄 &amp; 이완 공간
        </h1>
        <p className="text-sm text-stone-600 leading-relaxed max-w-2xl">
          하루 종일 타인의 마음에 닿아있던 시선을 이제 자신의 숨결로 조용히 돌려놓는 시간입니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 4-7-8 Breathing Circle */}
        <section className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-xs flex flex-col items-center justify-between min-h-[420px]">
          <div className="text-center space-y-1 w-full">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider">
              <Wind className="w-4 h-4 text-emerald-600" />
              <span>4-7-8 차분한 이완 호흡법</span>
            </div>
            <h2 className="text-lg font-bold text-stone-900">긴장과 공감 피로 가라앉히기</h2>
            <p className="text-xs text-stone-500">
              코로 4초 들이마시고, 7초 숨을 멈추고, 입으로 8초 천천히 내쉽니다.
            </p>
          </div>

          {/* Interactive animated breathing circle */}
          <div className="relative my-8 flex items-center justify-center">
            {/* Outer pulsating wave */}
            <div
              className={`absolute w-56 h-56 rounded-full transition-all duration-1000 ease-in-out ${
                breathingPhase === 'inhale'
                  ? 'scale-110 bg-emerald-100/60'
                  : breathingPhase === 'hold'
                  ? 'scale-105 bg-amber-100/60'
                  : breathingPhase === 'exhale'
                  ? 'scale-90 bg-stone-100/60'
                  : 'scale-95 bg-stone-100/40'
              }`}
            />

            {/* Inner core circle */}
            <div
              className={`relative z-10 w-44 h-44 rounded-full flex flex-col items-center justify-center text-center p-4 border transition-all duration-700 shadow-md ${
                breathingPhase === 'inhale'
                  ? 'bg-emerald-600 border-emerald-500 text-white scale-105'
                  : breathingPhase === 'hold'
                  ? 'bg-amber-600 border-amber-500 text-white scale-100'
                  : breathingPhase === 'exhale'
                  ? 'bg-stone-700 border-stone-600 text-white scale-90'
                  : 'bg-stone-100 border-stone-300 text-stone-700 scale-95'
              }`}
            >
              {breathingPhase === 'idle' ? (
                <div className="space-y-1">
                  <Wind className="w-8 h-8 mx-auto text-stone-400" />
                  <span className="text-xs font-semibold block">준비되셨나요?</span>
                  <span className="text-[11px] text-stone-500 block">시작 버튼을 눌러주세요</span>
                </div>
              ) : (
                <div className="space-y-1">
                  <span className="text-xs font-semibold tracking-wider uppercase opacity-90 block">
                    {breathingPhase === 'inhale' && '들이마시기'}
                    {breathingPhase === 'hold' && '숨 멈추기'}
                    {breathingPhase === 'exhale' && '천천히 내쉬기'}
                  </span>
                  <span className="text-4xl font-bold font-mono tracking-tight block">
                    {countdown}
                  </span>
                  <span className="text-[10px] opacity-80 block">{cycleCount + 1}번째 호흡</span>
                </div>
              )}
            </div>
          </div>

          {/* Action button */}
          <div className="w-full flex items-center justify-center">
            {breathingPhase === 'idle' ? (
              <button
                onClick={startBreathing}
                className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl transition-all shadow-xs active:scale-98"
              >
                호흡 시작하기
              </button>
            ) : (
              <button
                onClick={stopBreathing}
                className="px-5 py-2.5 bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-semibold rounded-xl transition-all"
              >
                호흡 멈추기
              </button>
            )}
          </div>
        </section>

        {/* Comfort Card Drawer */}
        <section className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-xs flex flex-col justify-between min-h-[420px]">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider">
                <Heart className="w-4 h-4 text-emerald-600" />
                <span>오늘 나에게 건네는 문장 카드</span>
              </div>
              <span className="text-[11px] text-stone-600 font-semibold">
                {currentQuoteIndex + 1} / {COMFORT_CARDS.length}
              </span>
            </div>
            <h2 className="text-lg font-bold text-stone-900">상담사를 안아주는 위로의 말</h2>
          </div>

          {/* Card body */}
          <div className="my-6 p-6 sm:p-8 bg-gradient-to-br from-stone-50 to-stone-100/80 rounded-2xl border border-stone-200 shadow-inner flex flex-col justify-center min-h-[190px] relative">
            <p className="text-base sm:text-lg font-serif text-stone-800 leading-relaxed italic whitespace-pre-wrap">
              "{activeQuote.quote}"
            </p>
            <div className="mt-4 pt-3 border-t border-stone-200/70 flex items-center justify-between text-xs text-stone-500">
              <span className="font-medium text-stone-700">{activeQuote.author}</span>
              <span className="px-2 py-0.5 rounded-md bg-stone-200/80 text-stone-700 text-[11px]">
                {activeQuote.tag}
              </span>
            </div>
          </div>

          {/* Card footer controls */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => handleCopyQuote(activeQuote.quote)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium rounded-xl transition-colors"
            >
              {copiedQuote ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedQuote ? '복사되었습니다' : '문장 복사'}</span>
            </button>

            <button
              onClick={nextQuote}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-xl transition-all shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>다음 문장 뽑기</span>
            </button>
          </div>
        </section>
      </div>

      {/* Letting go of emotional burden exercise */}
      <section className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-xs space-y-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider">
            <Feather className="w-4 h-4 text-emerald-700" />
            <span>경계 긋기 &amp; 내려놓기 의식</span>
          </div>
          <h2 className="text-lg font-bold text-stone-900">오늘 하루 내담자에게 받았던 무거운 마음 흘려보내기</h2>
          <p className="text-xs text-stone-500">
            상담이 끝나도 마음속에 남아있는 내담자의 한숨, 답답함, 죄책감을 적어보세요. 여기에 적고 '흘려보내기'를 누르면 마음 밖으로 가볍게 떠나보냅니다.
          </p>
        </div>

        {released ? (
          <div className="p-8 bg-emerald-50/70 border border-emerald-200 rounded-2xl text-center space-y-3 animate-in fade-in duration-500">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900">무거운 마음을 바람에 흘려보냈습니다</h3>
            <p className="text-xs sm:text-sm text-stone-700 max-w-lg mx-auto leading-relaxed">
              그 마음, 오늘 하루 혼자 다 안고 계셨군요. 그 경계를 긋는 것은 냉정한 것이 아닙니다. 선생님이 더 오래, 건강하게 타인을 안아주기 위한 소중한 보호입니다.
            </p>
            <button
              onClick={() => setReleased(false)}
              className="mt-3 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-medium transition-colors"
            >
              다른 마음 더 내려놓기
            </button>
          </div>
        ) : (
          <form onSubmit={handleReleaseBurden} className="space-y-3">
            <div className="relative">
              <textarea
                value={burdenText}
                onChange={(e) => setBurdenText(e.target.value)}
                placeholder="예: '3회기 때 내담자가 보였던 체념 섞인 눈빛이 자꾸 마음에 밟혀요...', '내가 오늘 그 사람에게 충분한 도움이 되었을까 하는 불안감...'"
                rows={3}
                disabled={isReleasing}
                className="w-full resize-none p-4 text-sm text-stone-900 placeholder:text-stone-400 bg-stone-50/60 border border-stone-200 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-emerald-200 focus:border-emerald-600 transition-all"
              />
              {isReleasing && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-2xs rounded-2xl flex items-center justify-center text-xs font-semibold text-emerald-900 animate-pulse">
                  바람을 따라 마음의 짐을 날려보내는 중...
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[11px] text-stone-600">
                입력하신 내용은 어디에도 저장되지 않고 즉시 소멸합니다.
              </span>
              <button
                type="submit"
                disabled={!burdenText.trim() || isReleasing}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 disabled:bg-stone-300 text-white rounded-xl text-xs font-semibold transition-all shadow-xs disabled:cursor-not-allowed"
              >
                <Feather className="w-3.5 h-3.5" />
                <span>마음 흘려보내기</span>
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
};
