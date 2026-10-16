import React, { useState } from 'react';
import {
  Ban,
  CheckCircle2,
  AlertTriangle,
  Heart,
  Scale,
  Sparkles,
  ArrowRight,
  MessageCircle,
} from 'lucide-react';
import { FORBIDDEN_VS_RECOMMENDED } from '../data/promptData';

export const ComparisonTab: React.FC = () => {
  const [activeScenario, setActiveScenario] = useState<'burnout' | 'self_efficacy' | 'isolation' | 'emotional_suppression'>('burnout');

  const simulationData = {
    burnout: {
      title: '감정 소진 / 깊은 탈진',
      counselorUtterance:
        '오늘 내담자 5명을 연달아 상담했는데, 완전히 탈진해버렸어요. 온몸에 기운이 하나도 없고 너무 지쳐요.',
      forbidden: {
        title: '❌ 일반 AI / 서툰 위로 (금지 표현)',
        response:
          '힘내세요! 그래도 선생님 덕분에 5명의 내담자가 길을 찾았잖아요. 주말에 맛있는 거 드시고 기운 내보세요! 다 잘 될 거예요.',
        pitfalls: [
          '"힘내세요" → 방전된 사람에게 에너지를 더 내라는 공허한 압박',
          '섣부른 보상 심리 강요 → 내담자의 결과로 상담사의 소진을 정당화',
          '처방적 조언 → 주말에 뭘 하라는 불필요한 행동 지시',
        ],
      },
      recommended: {
        title: '✅ 마음 쉼터의 위로 (권장 표현)',
        response:
          '남의 마음을 하루 종일 담아내는 일이잖아요. 지치는 게 당연해요. 오히려 지치지 않는다면 그게 더 이상한 거예요.\n\n그 무게, 오늘 하루 혼자 다 안고 계셨군요. 잠깐 내려놓아도 괜찮아요. 여기서만큼은요.',
        merits: [
          '감정 반영 & 무게 인정 → "남의 마음을 하루 종일 담아내는 일"의 구체성',
          '정상화 → 지치는 것이 이상한 게 아니라 지극히 자연스러움을 선언',
          '안전한 안식처 제공 → "여기서만큼은 내려놓아도 괜찮다"는 수용',
        ],
      },
    },
    self_efficacy: {
      title: '자기 효능감 위기 / "내가 잘 하고 있나?"',
      counselorUtterance:
        '오늘 내담자가 답답해하면서 상담실을 나갔어요. 내가 과연 사람들에게 진짜 도움이 되고 있는 건지 자격에 회의가 들어요.',
      forbidden: {
        title: '❌ 일반 AI / 서툰 위로 (금지 표현)',
        response:
          '그래도 잘 하고 계시잖아요! 너무 자책하지 마시고 긍정적으로 생각하세요. 원래 상담은 다 그런 거예요. 다음엔 더 준비하시면 돼요.',
        pitfalls: [
          '"그래도 잘 하고 계시잖아요" → 상황을 보지도 않은 상태의 섣부른 위로',
          '"긍정적으로 생각하세요" → 상담사의 고통과 고민을 가볍게 치부하는 억압',
          '"다음엔 더 준비..." → 상담사의 역량 부족을 은연중에 탓하는 조언',
        ],
      },
      recommended: {
        title: '✅ 마음 쉼터의 위로 (권장 표현)',
        response:
          '그 질문을 스스로에게 던진다는 것 자체가, 이미 잘 하고 계신다는 신호예요. 자신을 돌아보지 않는 사람은 그런 질문을 하지 않거든요.\n\n씨앗을 심는 사람은 꽃이 피는 걸 직접 못 볼 때가 많아요. 그래도 씨앗은 심어졌어요.',
        merits: [
          '회의감의 가치 재발견 → 질문을 던지는 성찰 자체가 훌륭한 상담사임을 반영',
          '직업적 특성 수용 → "씨앗을 심는 사람" 은유를 통한 즉각적 결실 부재의 위안',
          '평가하지 않음 → 잘했는지 못했는지 평가하지 않고 진심을 인정',
        ],
      },
    },
    isolation: {
      title: '직업적 고립감 / 아무도 모른다는 느낌',
      counselorUtterance:
        '집에 돌아와도 가족들은 내가 무슨 일로 이렇게 피폐해졌는지 아무도 이해 못 해요. 세상에 나 혼자만 남겨진 것 같아요.',
      forbidden: {
        title: '❌ 일반 AI / 서툰 위로 (금지 표현)',
        response:
          '저도 비슷한 경험이 있어서 그 마음 잘 알아요! 가족들한테 서운해하지 마시고, 차분하게 선생님 힘든 점을 설명해 보세요.',
        pitfalls: [
          '"저도 비슷한 경험이..." → AI가 인간의 고통을 거짓으로 가장하여 신뢰 상실',
          '"그 마음 잘 알아요" → 상담사의 깊은 고독을 쉽게 안다고 단정',
          '관계 개선 처방 → 피로한 상담사에게 대화라는 또 다른 숙제를 부과',
        ],
      },
      recommended: {
        title: '✅ 마음 쉼터의 위로 (권장 표현)',
        response:
          '상담사의 하루는 말로 다 설명하기 어렵죠. 누군가의 가장 어두운 이야기를 들으면서도 표정 하나 흐트러뜨리지 않아야 하는 일이니까요.\n\n그 무게를 다 알지는 못하지만, 지금 여기서 듣고 있을게요.',
        merits: [
          '정직한 한계 인정 → "다 알지는 못하지만"이라는 겸손하고 진실한 태도',
          '특수성 공감 → 말로 설명하기 어려운 상담 노동의 감정 억압 무게를 직관',
          '존재의 곁 지키기 → 무언가를 해결하려 하지 않고 곁에 머무름 선언',
        ],
      },
    },
    emotional_suppression: {
      title: '감정 억제 / "나는 상담사니까 괜찮아야 해"',
      counselorUtterance:
        '상담 중에 저도 눈물이 왈칵 쏟아질 뻔했어요. 상담사가 감정을 보이면 안 되는데, 제가 너무 나약한 건 아닌지 불안해요.',
      forbidden: {
        title: '❌ 일반 AI / 서툰 위로 (금지 표현)',
        response:
          '상담사는 프로니까 항상 감정을 통제하셔야 해요. 그럴 땐 심호흡을 하시고 감정과 거리를 두는 연습을 하시는 게 좋아요.',
        pitfalls: [
          '처방 및 훈계 → 상담사에게 이미 알고 있는 기법을 훈수 두듯 가르침',
          '감정 검열 심화 → 감정을 느끼는 것을 "비전문적/나약함"으로 몰아세움',
          '해결 중심 태도 → 울컥했던 상담사의 가슴 시린 순간을 외면',
        ],
      },
      recommended: {
        title: '✅ 마음 쉼터의 위로 (권장 표현)',
        response:
          '상담사도 사람이에요. 감정이 있고, 지치고, 흔들리는 게 당연해요. 그게 선생님을 약하게 만드는 게 아니에요.\n\n여기서는 참지 않으셔도 돼요. 흔들려도 괜찮습니다.',
        merits: [
          '인간성 회복 → "상담사도 사람이다"라는 본질적 위로',
          '약함의 낙인 해제 → 흔들림이 약함이 아님을 선언',
          '해방감 부여 → "여기서는 참지 않아도 된다"는 안전지대 형성',
        ],
      },
    },
  };

  const current = simulationData[activeScenario];

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-12">
      {/* Intro Header */}
      <div className="space-y-2 border-b border-stone-200 pb-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
          <Scale className="w-4 h-4 text-emerald-700" />
          <span>심리적 언어 비교 가이드</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
          🚫 금지 표현 vs ✅ 권장 표현 비교표
        </h1>
        <p className="text-sm text-stone-600 leading-relaxed max-w-3xl">
          상담사는 매일 수많은 사람을 안아주는 사람입니다. 일반인에게 건네는 통상적인 위로 문구가 지친 상담사에게는
          오히려 <strong>공허함, 자책감, 피로감</strong>을 더할 수 있습니다.
        </p>
      </div>

      {/* Interactive Scenario Comparison Player */}
      <section className="bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              직접 체험하는 차이점
            </span>
            <h2 className="text-lg font-bold text-stone-900 mt-0.5">상담사 발화별 A/B 반응 비교 시뮬레이션</h2>
          </div>

          {/* Scenario Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-stone-100 rounded-xl text-xs font-medium">
            <button
              onClick={() => setActiveScenario('burnout')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeScenario === 'burnout'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              번아웃 / 탈진
            </button>
            <button
              onClick={() => setActiveScenario('self_efficacy')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeScenario === 'self_efficacy'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              자기 효능감 위기
            </button>
            <button
              onClick={() => setActiveScenario('isolation')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeScenario === 'isolation'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              직업적 고립감
            </button>
            <button
              onClick={() => setActiveScenario('emotional_suppression')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeScenario === 'emotional_suppression'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              감정 억제
            </button>
          </div>
        </div>

        {/* Counselor Utterance Box */}
        <div className="p-4 bg-stone-100/80 rounded-xl border border-stone-200">
          <div className="flex items-center gap-2 text-xs font-bold text-stone-600 mb-1.5">
            <MessageCircle className="w-3.5 h-3.5 text-stone-500" />
            <span>상담사 선생님의 호소 (상황: {current.title})</span>
          </div>
          <p className="text-stone-900 text-sm sm:text-base font-medium leading-relaxed italic">
            "{current.counselorUtterance}"
          </p>
        </div>

        {/* Side-by-side Response comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Forbidden side */}
          <div className="bg-rose-50/60 rounded-2xl border border-rose-200 p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2 text-rose-800 font-bold text-sm border-b border-rose-200/80 pb-3">
              <Ban className="w-4 h-4 text-rose-600" />
              <span>{current.forbidden.title}</span>
            </div>

            <div className="p-3.5 bg-white/90 rounded-xl border border-rose-200 text-stone-800 text-sm leading-relaxed whitespace-pre-wrap font-sans">
              {current.forbidden.response}
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-rose-900 uppercase tracking-wider block">
                왜 마음을 더 무겁게 만드는가?
              </span>
              <ul className="space-y-1.5 text-xs text-rose-950">
                {current.forbidden.pitfalls.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-rose-500 shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recommended side */}
          <div className="bg-emerald-50/60 rounded-2xl border border-emerald-200 p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm border-b border-emerald-200/80 pb-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{current.recommended.title}</span>
            </div>

            <div className="p-3.5 bg-white/90 rounded-xl border border-emerald-200 text-stone-800 text-sm leading-relaxed whitespace-pre-wrap font-sans">
              {current.recommended.response}
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider block">
                어떤 위로와 지지를 전하는가?
              </span>
              <ul className="space-y-1.5 text-xs text-emerald-950">
                {current.recommended.merits.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-600 shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Comprehensive Table */}
      <section className="bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-stone-900">PDF 수록 7대 표현 전격 비교 대조표</h2>
            <p className="text-xs text-stone-500">
              상담 현장에서 흔히 오가는 위로 표현들의 심리적 메커니즘 분석
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50 text-stone-700 text-xs">
                <th className="py-3 px-4 font-bold text-rose-800 w-1/4">🚫 절대 사용 금지</th>
                <th className="py-3 px-4 font-bold text-emerald-800 w-2/5">✅ 권장 대체 표현</th>
                <th className="py-3 px-4 font-bold text-stone-700">심리적 근거 및 차이점</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {FORBIDDEN_VS_RECOMMENDED.map((row, index) => (
                <tr key={index} className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-rose-700 bg-rose-50/30">
                    {row.forbidden}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-emerald-900 bg-emerald-50/30">
                    {row.recommended}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-stone-600 leading-relaxed">
                    {row.reason}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Summary Principle Card */}
      <div className="bg-stone-100 rounded-2xl p-6 border border-stone-200 flex items-start gap-4">
        <Sparkles className="w-6 h-6 text-emerald-700 shrink-0 mt-1" />
        <div className="space-y-1 text-sm text-stone-700 leading-relaxed">
          <h3 className="font-bold text-stone-900">감정 먼저, 해결 나중 (Emotion First, Solution Never)</h3>
          <p className="text-xs text-stone-600">
            상담사는 낮 동안 온 힘을 다해 타인의 불안과 절망을 받아내는 존재입니다.
            상담실 문을 닫은 뒤 그들에게 필요한 것은 "더 나은 상담 스킬"이나 "기운을 내라는 응원"이 아니라,
            <strong> 오늘 하루 자신의 수고와 지친 마음이 온전히 안전하게 받아들여지는 경험</strong>입니다.
          </p>
        </div>
      </div>
    </div>
  );
};
