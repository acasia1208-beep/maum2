import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Info,
  PhoneCall,
  CheckCircle2,
  Copy,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { SITUATION_LIST, SituationPrompt } from '../data/promptData';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  situation?: string;
  breakdown?: {
    reflection?: string;
    normalization?: string;
    exploration?: string;
  };
  isCrisis?: boolean;
  timestamp: string;
}

interface ChatTabProps {
  onOpenCrisisModal: () => void;
  initialQuery?: string;
}

export const ChatTab: React.FC<ChatTabProps> = ({ onOpenCrisisModal, initialQuery }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content:
        '선생님, 오늘 하루도 긴 여정을 지나오셨군요.\n\n이곳은 누군가의 고민을 덜어주느라 정작 자신의 마음은 돌보지 못했던 진로상담사 선생님을 위한 안식처입니다. 무엇을 해결하려 하지 않으셔도 괜찮아요. 지친 마음, 마음에 걸리는 내담자, 혹은 아무 말 없이 그냥 머무르고 싶은 생각까지... 편안하게 나누어 주세요.',
      situation: '마음 쉼터 안내',
      timestamp: '오후 6:30',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (initialQuery) {
      sendMessage(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const getTimeString = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? '오후' : '오전';
    const displayHours = hours % 12 || 12;
    return `${ampm} ${displayHours}:${minutes}`;
  };

  const handleSpeak = (text: string, msgId: string) => {
    if (!synthRef.current) return;

    if (isSpeaking && speakingMessageId === msgId) {
      synthRef.current.cancel();
      setIsSpeaking(false);
      setSpeakingMessageId(null);
      return;
    }

    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.88; // gently paced
    utterance.pitch = 0.95; // calm & warm

    utterance.onend = () => {
      setIsSpeaking(false);
      setSpeakingMessageId(null);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setSpeakingMessageId(null);
    };

    setIsSpeaking(true);
    setSpeakingMessageId(msgId);
    synthRef.current.speak(utterance);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const sendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: getTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          conversationHistory: messages.slice(-6).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('응답을 가져오지 못했습니다.');
      }

      const data = await response.json();

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        situation: data.situation,
        breakdown: data.breakdown,
        isCrisis: data.isCrisis,
        timestamp: getTimeString(),
      };

      setMessages((prev) => [...prev, assistantMsg]);

      if (data.isCrisis) {
        onOpenCrisisModal();
      }
    } catch (error) {
      console.error(error);
      const fallbackMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content:
          '남의 마음을 하루 종일 담아내는 일이잖아요. 지치는 게 당연해요. 오히려 지치지 않는다면 그게 더 이상한 거예요.\n\n그 무게, 오늘 하루 혼자 다 안고 계셨군요. 잠깐 내려놓아도 괜찮아요. 여기서만큼은요.',
        situation: '상황 1 · 감정 소진 / 번아웃 (기본 응답)',
        timestamp: getTimeString(),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    if (synthRef.current) synthRef.current.cancel();
    setIsSpeaking(false);
    setSpeakingMessageId(null);
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        content:
          '선생님, 편안한 호흡으로 다시 시작해요. 오늘 마음속에 남아있는 이야기나 털어놓고 싶은 감정이 있다면 무엇이든 천천히 말씀해 주세요.',
        situation: '대화 초기화',
        timestamp: getTimeString(),
      },
    ]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[580px] max-w-5xl mx-auto bg-stone-50/70 rounded-2xl border border-stone-200/90 shadow-sm overflow-hidden">
      {/* Top action / status bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-stone-200 bg-white/90 backdrop-blur-xs">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
          <div>
            <h2 className="text-sm font-bold text-stone-800">마음 쉼터 AI 실시간 대화 데모</h2>
            <div className="flex items-center gap-2 text-xs text-stone-500">
              <span>동료적 지지</span>
              <span aria-hidden="true">·</span>
              <span>조언 배제 &amp; 3단계 공감 구조</span>
              <span aria-hidden="true">·</span>
              <span>3~5문장 원칙 준수</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* 3-stage breakdown toggle */}
          <button
            onClick={() => setShowAnalysis(!showAnalysis)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
              showAnalysis
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200'
            }`}
            title="3단계 응답 구조(감정 반영 / 정상화 / 조심스러운 탐색) 표시 토글"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">3단계 구조</span> 분석 {showAnalysis ? 'ON' : 'OFF'}
          </button>

          {/* Reset button */}
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            title="대화 지우기 및 초기화"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">새 대화</span>
          </button>
        </div>
      </div>

      {/* Quick Situation Chip bar (From PDF page 7-8) */}
      <div className="px-4 py-2.5 bg-stone-100/70 border-b border-stone-200 overflow-x-auto scrollbar-thin">
        <div className="flex items-center gap-2 min-w-max">
          <span className="text-xs font-semibold text-stone-600 flex items-center gap-1 pl-1 pr-2">
            ⚡ 빠른 응답 칩:
          </span>
          {SITUATION_LIST.map((sit) => (
            <button
              key={sit.id}
              onClick={() => sendMessage(sit.chipText)}
              disabled={isLoading}
              className="group flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-emerald-50 text-stone-700 hover:text-emerald-900 border border-stone-200 hover:border-emerald-300 rounded-lg text-xs font-medium transition-all shadow-xs disabled:opacity-50"
            >
              <span>{sit.chipIcon}</span>
              <span>{sit.chipText}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-3xl ${
                isUser ? 'ml-auto' : 'mr-auto'
              }`}
            >
              {/* Sender label & Timestamp */}
              <div className="flex items-center gap-2 mb-1 px-1 text-xs text-stone-600">
                <span className="font-semibold text-stone-700">
                  {isUser ? '상담사 선생님' : '🌿 마음 쉼터'}
                </span>
                {msg.situation && !isUser && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="text-emerald-700 font-medium">{msg.situation}</span>
                  </>
                )}
                <span aria-hidden="true">·</span>
                <span>{msg.timestamp}</span>
              </div>

              {/* Bubble */}
              <div
                className={`relative group rounded-2xl p-4 sm:p-5 text-sm sm:text-base leading-relaxed tracking-normal transition-all shadow-xs ${
                  isUser
                    ? 'bg-emerald-800 text-white rounded-tr-xs'
                    : msg.isCrisis
                    ? 'bg-amber-50 border border-amber-300 text-stone-900 rounded-tl-xs'
                    : 'bg-white border border-stone-200/90 text-stone-800 rounded-tl-xs'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {/* Assistant action controls */}
                {!isUser && (
                  <div className="flex items-center justify-between gap-3 mt-3 pt-3 border-t border-stone-100 text-xs text-stone-500">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSpeak(msg.content, msg.id)}
                        className="flex items-center gap-1 hover:text-stone-800 transition-colors p-1 rounded-sm hover:bg-stone-100"
                        title={speakingMessageId === msg.id && isSpeaking ? '음성 멈추기' : '차분한 음성으로 듣기'}
                      >
                        {speakingMessageId === msg.id && isSpeaking ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 text-emerald-700 animate-pulse" />
                            <span className="text-emerald-700 font-medium">듣는 중...</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>음성으로 듣기</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleCopy(msg.content, msg.id)}
                        className="flex items-center gap-1 hover:text-stone-800 transition-colors p-1 rounded-sm hover:bg-stone-100"
                        title="메시지 복사"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-600">복사 완료</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>복사</span>
                          </>
                        )}
                      </button>
                    </div>

                    <span className="text-stone-500 text-[11px]">3~5문장 원칙 준수</span>
                  </div>
                )}
              </div>

              {/* 3-Stage breakdown inspector view */}
              {!isUser && showAnalysis && msg.breakdown && (
                <div className="mt-2.5 p-3.5 bg-stone-100/90 border border-stone-200 rounded-xl text-xs space-y-1.5 w-full">
                  <div className="flex items-center justify-between text-stone-600 font-semibold mb-1">
                    <span className="flex items-center gap-1 text-emerald-800">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      PDF 응답 3단계 구조 분석
                    </span>
                    <span className="text-stone-500 text-[11px]">심리 지지 매뉴얼 적용</span>
                  </div>

                  {msg.breakdown.reflection && (
                    <div className="flex items-start gap-2">
                      <span className="px-1.5 py-0.5 rounded-sm bg-emerald-100 text-emerald-800 font-medium text-[11px] shrink-0">
                        1단계: 감정 반영
                      </span>
                      <span className="text-stone-700">{msg.breakdown.reflection}</span>
                    </div>
                  )}

                  {msg.breakdown.normalization && (
                    <div className="flex items-start gap-2">
                      <span className="px-1.5 py-0.5 rounded-sm bg-blue-100 text-blue-800 font-medium text-[11px] shrink-0">
                        2단계: 정상화
                      </span>
                      <span className="text-stone-700">{msg.breakdown.normalization}</span>
                    </div>
                  )}

                  {msg.breakdown.exploration && (
                    <div className="flex items-start gap-2">
                      <span className="px-1.5 py-0.5 rounded-sm bg-purple-100 text-purple-800 font-medium text-[11px] shrink-0">
                        3단계: 조심스러운 탐색
                      </span>
                      <span className="text-stone-700">{msg.breakdown.exploration}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex flex-col items-start mr-auto max-w-lg">
            <div className="text-xs text-stone-600 mb-1 px-1 font-semibold">
              🌿 마음 쉼터가 조용히 마음에 귀 기울이고 있습니다...
            </div>
            <div className="bg-white border border-stone-200 rounded-2xl rounded-tl-xs p-4 flex items-center gap-2 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]" />
              <span className="text-xs text-stone-500 ml-2">온기를 담은 답변을 고르는 중...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-4 bg-white border-t border-stone-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(inputValue);
          }}
          className="flex items-end gap-2"
        >
          <div className="flex-1 relative rounded-xl border border-stone-300 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-100 transition-all bg-stone-50/50">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(inputValue);
                }
              }}
              placeholder="오늘 하루 어떤 마음을 품고 계셨나요? 자유롭게 털어놓아 보세요..."
              rows={2}
              className="w-full resize-none bg-transparent px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-hidden"
              disabled={isLoading}
            />
            <div className="flex items-center justify-between px-3 pb-2 text-[11px] text-stone-600">
              <span>Shift + Enter 로 줄바꿈</span>
              <button
                type="button"
                onClick={onOpenCrisisModal}
                className="text-stone-600 hover:text-amber-800 transition-colors flex items-center gap-1 font-medium"
              >
                <PhoneCall className="w-3 h-3 text-amber-700" />
                위기상담전화: 1393
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="p-3 bg-emerald-800 hover:bg-emerald-900 disabled:bg-stone-300 text-white rounded-xl transition-all shadow-xs shrink-0 disabled:cursor-not-allowed"
            aria-label="메시지 전송"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
