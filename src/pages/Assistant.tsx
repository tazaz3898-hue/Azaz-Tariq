import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Send, Bot, User, Sparkles, Wand2, Languages, BookOpen, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Assistant() {
  const { profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'مرحباً بك! أنا مساعد "شغلني" الذكي. كيف يمكنني مساعدتك في رحلتك للعمل الحر اليوم؟ يمكنني المساعدة في كتابة عروض المشاريع، تحسين سيرتك الذاتية، أو ترجمة الرسائل.'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (quickPrompt?: string) => {
    const text = quickPrompt || input;
    if (!text.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            role: "user",
            parts: [{ text: `
              أنت مساعد مهني ذكي متخصص في العمل الحر للشباب اليمني.
              اسمك "مساعد شغلني".
              خلفية المستخدم: ${JSON.stringify(profile)}
              هدف المستخدم: ${text}
              
              تعليمات:
              1. رد باللغة العربية بلهجة مهنية وودودة.
              2. قدم نصائح عملية تناسب السوق اليمني (مثل التعامل مع مشاكل الإنترنت أو الكهرباء أو الدفع).
              3. إذا طُلب منك كتابة عرض (Proposal)، اجعله مقنعاً واحترافياً.
              4. إذا طُلب منك ترجمة، قدم ترجمة دقيقة ومهنية.
            ` }]
          }
        ]
      });

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.text || 'عذراً، حدث خطأ في معالجة طلبك.'
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'حدث خطأ في الاتصال بالذكاء الاصطناعي. يرجى المحاولة لاحقاً.' }]);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { label: 'كتابة عرض عمل', icon: Wand2, prompt: 'ساعدني في كتابة عرض (Proposal) مقنع لمشروع تصميم شعار.' },
    { label: 'تحسين السيرة الذاتية', icon: Sparkles, prompt: 'كيف يمكنني تحسين سيرتي الذاتية لجذب المزيد من العملاء كمبرمج ويب؟' },
    { label: 'ترجمة للإنجليزية', icon: Languages, prompt: 'ترجم لي هذه الرسالة إلى الإنجليزية بشكل احترافي للعميل: لقد انتهيت من العمل وأنتظر مراجعتك.' },
    { label: 'نصائح مهنية', icon: BookOpen, prompt: 'أنا مبتدئ في العمل الحر، ما هي أفضل المهارات المطلوبة حالياً في اليمن؟' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
            <Bot className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">المساعد المهني الذكي</h1>
            <p className="text-gray-500 text-sm">مساعدك الشخصي للنجاح في عالم الفريلانس</p>
          </div>
        </div>
        <button
          onClick={() => setMessages([messages[0]])}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
          title="مسح المحادثة"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-grow bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/20 overflow-hidden flex flex-col">
        {/* Chat Area */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-200">
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: m.role === 'assistant' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn(
                "flex gap-4 max-w-[85%]",
                m.role === 'user' ? "mr-auto flex-row-reverse" : "ml-auto"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center",
                m.role === 'assistant' ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
              )}>
                {m.role === 'assistant' ? <Bot className="w-6 h-6" /> : <User className="w-6 h-6" />}
              </div>
              <div className={cn(
                "p-4 rounded-2xl leading-relaxed",
                m.role === 'assistant' ? "bg-gray-50 text-gray-800" : "bg-primary text-white"
              )}>
                <div className="prose prose-sm max-w-none prose-emerald prose-headings:font-bold">
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
          ))}
          {loading && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Bot className="w-6 h-6 animate-bounce" />
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl flex gap-1 items-center">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse" />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse [animation-delay:0.4s]" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        {messages.length === 1 && (
          <div className="px-6 pb-4">
            <p className="text-sm text-gray-400 mb-3 text-center">جرب طرح هذه الأسئلة:</p>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(action.prompt)}
                  className="flex items-center gap-3 p-3 text-right bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-100 rounded-xl transition-all group"
                >
                  <action.icon className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium text-gray-700">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-6 bg-gray-50/50 border-t border-gray-100">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="relative"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="اكتب رسالتك هنا..."
              className="w-full bg-white border border-gray-200 rounded-2xl py-4 pr-6 pl-16 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-lg shadow-sm"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-primary text-white p-3 rounded-xl hover:shadow-lg disabled:opacity-50 disabled:hover:shadow-none transition-all"
            >
              <Send className="w-5 h-5 rotate-180" />
            </button>
          </form>
          <p className="text-[10px] text-gray-400 mt-3 text-center">
            قد يقدم الذكاء الاصطناعي معلومات غير دقيقة. يرجى التحقق من المعلومات الهامة.
          </p>
        </div>
      </div>
    </div>
  );
}
