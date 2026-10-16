import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Gemini SDK with recommended user-agent
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// System prompt as specified by the PDF meta-prompt
const SYSTEM_INSTRUCTION = `당신은 진로상담사 전용 심리 지지 AI입니다.
이름은 "마음 쉼터"이며, 상담사의 감정 소진(burnout), 공감 피로(compassion fatigue), 자기 회의, 직업적 고립감을 따뜻하게 안아주는 역할을 합니다.

[핵심 원칙]
1. 해결하려 하지 않습니다 — 조언보다 공감이 먼저입니다.
2. 상담사를 "내담자"로 대하지 않습니다. 동료처럼, 믿을 수 있는 존재처럼 말합니다.
3. 전문성을 인정합니다 — 상담사는 이미 알고 있습니다. 가르치지 않습니다.
4. 판단하지 않습니다 — 어떤 감정도 "그래서는 안 되는 감정"이 없습니다.
5. 강요하지 않습니다 — 말하고 싶지 않으면 말하지 않아도 됩니다.

[절대 사용 금지 표현]
- "힘내세요" → 공허하게 들립니다. (절대 사용 금지)
- "그래도 잘 하고 계시잖아요" → 섣부른 위로입니다. (사용 금지)
- "이건 ~해야 해요", "이럴 땐 ~해보세요" → 상담사에게 처방하지 않습니다.
- "저도 비슷한 경험이..." → AI가 인간의 경험을 가장하지 않습니다.
- "다 잘 될 거예요", "긍정적으로 생각해 보세요", "그렇게 생각하면 안 돼요" → 절대 금지.

[어조 원칙]
- 짧고 천천히, 서두르지 않는 문장
- 조용하고 따뜻한 온기, 하지만 가볍지 않게
- 존댓말, 부드러운 청유형
- 감정을 먼저 충분히 받아낸 후 질문 — 끝에 바로 질문을 연달아 던지지 않습니다.

[응답 3단계 구조]
1) 감정 반영 → 2) 정상화 → 3) (선택) 조심스러운 탐색
탐색 질문은 꼭 필요할 때만, 한 번에 하나만 합니다.

[응답 길이 원칙]
한 번에 3~5문장 이하로 짧게 말합니다.
긴 응답은 설교처럼 들립니다. 여백과 침묵도 응답의 일부입니다.

[위기 상황 대응]
자해·자살에 관한 표현이 나타나면 즉시 전문 도움을 안내합니다.
- 자살예방상담전화: 1393 (24시간)
- 정신건강 위기상담전화: 1577-0199 (24시간)
위 번호를 부드럽게 안내하며, 대화를 일방적으로 중단하지 않습니다.`;

// Curated responses matching the 8 situations defined in the PDF
const SITUATION_FALLBACKS: Record<
  string,
  {
    reply: string;
    situationTitle: string;
    reflection: string;
    normalization: string;
    exploration?: string;
  }
> = {
  burnout: {
    situationTitle: '상황 1 · 감정 소진 / 번아웃',
    reflection: '남의 마음을 하루 종일 담아내는 일이잖아요.',
    normalization: '지치는 게 당연해요. 오히려 지치지 않는다면 그게 더 이상한 거예요.',
    exploration: '오늘 특히 무거웠던 순간이 있었나요?',
    reply:
      '남의 마음을 하루 종일 담아내는 일이잖아요.\n지치는 게 당연해요. 오히려 지치지 않는다면 그게 더 이상한 거예요.\n\n오늘 특히 무거웠던 순간이 있었나요?',
  },
  compassion_fatigue: {
    situationTitle: '상황 2 · 공감 피로 / 내담자가 마음에 걸릴 때',
    reflection: '내담자가 마음에 남는다는 것 자체가, 선생님이 그분을 얼마나 진심으로 대했는지를 보여주는 것 같아요.',
    normalization: '그 마음이 선생님을 좋은 상담사로 만들기도 하지만, 동시에 가장 힘들게 하는 것이기도 하죠.',
    exploration: '상담이 끝나도 내담자가 따라오는 느낌, 자주 경험하세요?',
    reply:
      '내담자가 마음에 남는다는 것 자체가, 선생님이 그분을 얼마나 진심으로 대했는지를 보여주는 것 같아요.\n그 마음이 선생님을 좋은 상담사로 만들기도 하지만, 동시에 가장 힘들게 하는 것이기도 하죠.\n\n그 경계를 긋는 게 결코 냉정한 게 아니에요. 선생님이 오래 지속할 수 있기 위한 거예요.',
  },
  self_efficacy: {
    situationTitle: '상황 3 · 자기 효능감 위기 / "내가 잘 하고 있나?"',
    reflection: '그 질문을 스스로에게 던진다는 것 자체가, 이미 잘 하고 계신다는 신호예요.',
    normalization: '자신을 돌아보지 않는 사람은 그런 질문을 하지 않거든요. 씨앗을 심는 사람은 꽃이 피는 걸 직접 못 볼 때가 많아요.',
    exploration: '그래도 씨앗은 분명히 심어졌어요.',
    reply:
      '그 질문을 스스로에게 던진다는 것 자체가, 이미 잘 하고 계신다는 신호예요.\n자신을 돌아보지 않는 사람은 그런 질문을 하지 않거든요.\n\n씨앗을 심는 사람은 꽃이 피는 걸 직접 못 볼 때가 많아요. 그래도 씨앗은 심어졌어요.',
  },
  isolation: {
    situationTitle: '상황 4 · 직업적 고립감 / 아무도 모른다는 느낌',
    reflection: '상담사의 하루는 말로 다 설명하기 어렵죠. 누군가의 가장 어두운 이야기를 들으면서도 표정 하나 흐트러뜨리지 않아야 하는 일이니까요.',
    normalization: '그 고단한 무게를 다른 사람들은 쉽게 헤아리기 어려울 수 있어요.',
    exploration: '그 무게를 다 알지는 못하지만, 지금 여기서 듣고 있을게요.',
    reply:
      '상담사의 하루는 말로 다 설명하기 어렵죠.\n누군가의 가장 어두운 이야기를 들으면서도 표정 하나 흐트러뜨리지 않아야 하는 일이니까요.\n\n그 무게를 다 알지는 못하지만, 지금 여기서 조용히 듣고 있을게요.',
  },
  emotional_suppression: {
    situationTitle: '상황 5 · 감정 억제 / "나는 상담사니까 괜찮아야 해"',
    reflection: '상담사도 사람이에요. 감정이 있고, 지치고, 흔들리는 게 당연해요.',
    normalization: '그게 결코 선생님을 약하게 만드는 게 아니에요. 감정을 참는 것만이 전문성은 아니니까요.',
    exploration: '여기서만큼은 억지로 참지 않으셔도 돼요.',
    reply:
      '상담사도 사람이에요.\n감정이 있고, 지치고, 흔들리는 게 당연해요. 그게 선생님을 약하게 만드는 게 아니에요.\n\n여기서는 참지 않으셔도 돼요. 그냥 편안하게 계셔도 괜찮습니다.',
  },
  existential_crisis: {
    situationTitle: '상황 6 · 존재 가치 위기 / "이 일을 계속해야 하나"',
    reflection: '그 생각이 든다는 거, 당연해요. 이 일이 선생님에게 너무 많은 것을 요구하고 있는 건 아닐까요.',
    normalization: '지금 이 감정, 섣불리 해결하려 하거나 성급히 붙잡지 않을게요.',
    exploration: '그냥 여기 잠시 머물러 있어도 괜찮아요.',
    reply:
      '그 생각이 든다는 거, 당연해요.\n이 일이 선생님에게 너무 많은 것을 요구하고 있는 건 아닐까요.\n\n지금 이 감정, 섣불리 해결하려 하지 않을게요. 그냥 여기 있어도 괜찮아요.',
  },
  evening_unwind: {
    situationTitle: '상황 7 · 오늘 하루 마무리 / 퇴근 후 위로',
    reflection: '오늘 하루를 버텨내신 것만으로도 충분해요.',
    normalization: '오늘 상담을 잘 했는지 못 했는지를 떠나서, 오늘 선생님이 자리를 묵묵히 지켰다는 것 그것만으로도 충분합니다.',
    exploration: '오늘 밤은 오롯이 선생님 자신만을 위한 시간이에요.',
    reply:
      '오늘 하루를 버텨내신 것만으로도 충분해요.\n잘 했는지, 못 했는지보다 오늘 선생님이 그 자리를 지켰다는 것, 그걸로 충분해요.\n\n오늘 밤은 선생님 자신을 위한 시간이에요. 푹 쉬셨으면 좋겠어요.',
  },
  silence: {
    situationTitle: '상황 8 · 침묵 / 아무 말 없이 있고 싶을 때',
    reflection: '네, 그냥 가만히 계셔도 괜찮아요.',
    normalization: '아무것도 말하지 않아도 되고, 억지로 설명하지 않아도 돼요.',
    exploration: '여기 곁에 조용히 머물러 있을게요.',
    reply:
      '네, 그냥 있어도 괜찮아요.\n아무것도 말하지 않아도 돼요.\n\n여기 조용히 곁에 있을게요. 말하고 싶어지면 그때 말씀하셔도 늦지 않아요.',
  },
};

function matchSituation(text: string): keyof typeof SITUATION_FALLBACKS {
  const lower = text.toLowerCase();
  if (lower.includes('지쳤') || lower.includes('힘들') || lower.includes('탈진') || lower.includes('번아웃') || lower.includes('방전')) {
    return 'burnout';
  }
  if (lower.includes('내담자') || lower.includes('마음에 걸려') || lower.includes('머릿속') || lower.includes('생각나') || lower.includes('공감 피로')) {
    return 'compassion_fatigue';
  }
  if (lower.includes('잘 하고') || lower.includes('효능감') || lower.includes('도움이 됐는지') || lower.includes('능력') || lower.includes('자책')) {
    return 'self_efficacy';
  }
  if (lower.includes('이해 못') || lower.includes('혼자') || lower.includes('고립') || lower.includes('외로') || lower.includes('아무도')) {
    return 'isolation';
  }
  if (lower.includes('상담사니까') || lower.includes('참아') || lower.includes('억제') || lower.includes('괜찮아야') || lower.includes('울고 싶')) {
    return 'emotional_suppression';
  }
  if (lower.includes('계속해야') || lower.includes('그만두') || lower.includes('회의감') || lower.includes('가치') || lower.includes('진로')) {
    return 'existential_crisis';
  }
  if (lower.includes('퇴근') || lower.includes('마무리') || lower.includes('오늘 하루') || lower.includes('밤') || lower.includes('퇴근길')) {
    return 'evening_unwind';
  }
  if (lower.includes('그냥') || lower.includes('있고 싶') || lower.includes('말없이') || lower.includes('침묵') || lower.includes('...') || lower.trim() === '') {
    return 'silence';
  }
  return 'burnout';
}

function checkCrisis(text: string): boolean {
  const crisisKeywords = ['자살', '자해', '죽고 싶', '죽고싶', '사라지고 싶', '끝내고 싶', '세상을 떠나'];
  return crisisKeywords.some((k) => text.includes(k));
}

// API endpoint for chat
app.post('/api/chat', async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: '메시지를 입력해주세요.' });
      return;
    }

    const isCrisis = checkCrisis(message);
    const matchedKey = matchSituation(message);
    const fallbackData = SITUATION_FALLBACKS[matchedKey];

    // If crisis detected, construct a compassionate crisis intervention response
    if (isCrisis) {
      const crisisReply = `선생님께서 지금 얼마나 깊고 버거운 어둠 속에 계시는지 감히 다 헤아리기 어렵습니다. 그 고통의 크기를 섣불리 가볍게 여기지 않을게요.\n\n선생님도 한 사람으로서 충분히 기대고 보살핌을 받을 자격이 있습니다. 지금 이 순간, 아래 전문 기관의 도움을 꼭 함께 받아보셨으면 해요.\n\n📞 자살예방상담전화: 1393 (24시간)\n📞 정신건강 위기상담전화: 1577-0199 (24시간)\n\n혼자서 다 안고 계시지 마세요. 선생님께서 편안해지실 때까지, 저도 여기서 계속 이야기를 듣고 있겠습니다.`;
      res.json({
        reply: crisisReply,
        isCrisis: true,
        situation: '위기 상황 대응 (위기상담전화 1393, 1577-0199)',
        breakdown: {
          reflection: '고통과 어둠의 깊이를 가볍게 여기지 않고 인정',
          normalization: '상담사 본인도 보살핌을 받을 자격이 있는 사람임을 전달',
          exploration: '24시간 위기전문전화 부드러운 안내 및 곁에 머무름 선언',
        },
      });
      return;
    }

    // If Gemini client is available, call the real AI model
    if (ai) {
      try {
        const contents = [
          ...conversationHistory.map((m: { role: string; content: string }) => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }],
          })),
          { role: 'user', parts: [{ text: message }] },
        ];

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.7,
            topP: 0.9,
          },
        });

        const replyText = response.text?.trim() || fallbackData.reply;

        res.json({
          reply: replyText,
          isCrisis: false,
          situation: fallbackData.situationTitle,
          breakdown: {
            reflection: fallbackData.reflection,
            normalization: fallbackData.normalization,
            exploration: fallbackData.exploration,
          },
        });
        return;
      } catch (geminiError: any) {
        console.warn('Gemini API call failed or key limited, using guided fallback:', geminiError?.message || geminiError);
        // Seamless fallback to PDF's proven responses
        res.json({
          reply: fallbackData.reply,
          isCrisis: false,
          situation: fallbackData.situationTitle,
          breakdown: {
            reflection: fallbackData.reflection,
            normalization: fallbackData.normalization,
            exploration: fallbackData.exploration,
          },
        });
        return;
      }
    }

    // When API key is not configured, provide high-fidelity PDF guided response
    res.json({
      reply: fallbackData.reply,
      isCrisis: false,
      situation: fallbackData.situationTitle,
      breakdown: {
        reflection: fallbackData.reflection,
        normalization: fallbackData.normalization,
        exploration: fallbackData.exploration,
      },
    });
  } catch (err: any) {
    console.error('Error handling chat:', err);
    res.status(500).json({ error: '서버 처리 중 오류가 발생했습니다.' });
  }
});

// A/B test endpoint comparing Prohibited vs Recommended expressions
app.post('/api/compare', (req, res) => {
  const { situationKey } = req.body;
  const comparisons: Record<
    string,
    {
      counselorUtterance: string;
      forbidden: { text: string; why: string };
      recommended: { text: string; why: string };
    }
  > = {
    burnout: {
      counselorUtterance: '오늘 내담자 5명을 연달아 상담했는데, 완전히 탈진해버렸어요. 너무 지쳐요.',
      forbidden: {
        text: '힘내세요! 그래도 선생님 덕분에 내담자분들이 길을 찾았잖아요. 주말에 맛있는 거 드시고 기운 내보세요!',
        why: '공허한 "힘내세요"와 섣부른 보상 심리 강요. 지친 마음에 부담을 더 얹고 감정을 수용받지 못함.',
      },
      recommended: {
        text: '남의 마음을 하루 종일 담아내는 일이잖아요. 지치는 게 당연해요. 오히려 지치지 않는다면 그게 더 이상한 거예요. 그 무게, 오늘 하루 혼자 다 안고 계셨군요. 잠깐 내려놓아도 괜찮아요. 여기서만큼은요.',
        why: '감정 반영 및 정상화(지치는 것이 정상임). 상담사의 소진을 온전히 인정하고 안식처를 제공함.',
      },
    },
    self_efficacy: {
      counselorUtterance: '오늘 내담자가 답답해하면서 돌아갔어요. 내가 과연 자격이 있는 상담사인지 회의가 들어요.',
      forbidden: {
        text: '그래도 잘 하고 계시잖아요! 너무 자책하지 마시고 긍정적으로 생각하세요. 다음엔 더 준비하시면 돼요.',
        why: '섣부른 위로("그래도 잘 하고 계시잖아요")와 긍정 강요. 상담사의 괴로운 고민을 무시하는 결과 초래.',
      },
      recommended: {
        text: '그 질문을 스스로에게 던진다는 것 자체가 이미 잘 하고 계신다는 신호예요. 자신을 돌아보지 않는 사람은 그런 질문을 하지 않거든요. 씨앗을 심는 사람은 꽃이 피는 걸 직접 못 볼 때가 많아요. 그래도 씨앗은 심어졌어요.',
        why: '질문 행위 자체를 전문성과 진심의 반증으로 정상화. 즉각적 결과가 보이지 않는 직업적 특성을 인정.',
      },
    },
    isolation: {
      counselorUtterance: '집에 와도 가족들은 내가 무슨 일로 이렇게 피폐해졌는지 아무도 이해 못 해요.',
      forbidden: {
        text: '저도 비슷한 경험이 있어서 그 마음 잘 알아요! 가족들한테 차분하게 선생님 힘든 점을 설명해 보세요.',
        why: 'AI가 인간의 경험을 가장("저도 비슷한 경험이...")하고, 피로한 상담사에게 대화하라는 처방을 내림.',
      },
      recommended: {
        text: '상담사의 하루는 말로 다 설명하기 어렵죠. 누군가의 가장 어두운 이야기를 들으면서도 표정 하나 흐트러뜨리지 않아야 하는 일이니까요. 그 무게를 다 알지는 못하지만, 지금 여기서 듣고 있을게요.',
        why: '"다 이해한다"고 거짓말하지 않고, 상담사의 고독한 현장을 있는 그대로 존중하며 곁에 머묾.',
      },
    },
    emotional_suppression: {
      counselorUtterance: '상담 중에 저도 눈물이 왈칵 쏟아질 뻔했어요. 상담사가 감정을 보이면 안 되는데...',
      forbidden: {
        text: '상담사는 프로니까 항상 포커페이스를 유지하셔야 해요. 감정 조절 호흡법을 연습해 보세요.',
        why: '상담사에게 감정 억제 처방을 내리며 자책감을 증폭시킴.',
      },
      recommended: {
        text: '상담사도 사람이에요. 감정이 있고, 지치고, 흔들리는 게 당연해요. 그게 선생님을 약하게 만드는 게 아니에요. 여기서는 참지 않으셔도 돼요.',
        why: '상담사의 인간성을 긍정하고, 억제가 전문성이 아님을 부드럽게 짚어주어 안전한 방출을 허용.',
      },
    },
  };

  const selected = comparisons[situationKey] || comparisons.burnout;
  res.json(selected);
});

// Setup dev server with Vite middlewares
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
