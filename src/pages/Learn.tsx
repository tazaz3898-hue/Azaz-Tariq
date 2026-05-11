import React, { useState, useEffect } from 'react';
import { Play, Code, Palette, Video, Megaphone, Mic2, FileText, CheckCircle, GraduationCap, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

const ROADMAPS = [
  {
    id: 'web',
    title: 'برمجة المواقع (Web Dev)',
    desc: 'تعلم بناء المواقع وتطبيقات الويب من الصفر حتى الاحتراف.',
    icon: Code,
    color: 'blue',
    steps: ['HTML & CSS', 'JavaScript', 'React', 'Firebase', 'بناء أول مشروع'],
    resources: [
      { name: 'دورة HTML/CSS كاملة - Elzero', url: 'https://www.youtube.com/playlist?list=PLDoPjvoNmBAw_t29adK97qVyBa96S9a5B' },
      { name: 'JavaScript من الصفر - Unique Coderz', url: 'https://www.youtube.com/playlist?list=PLknwEmKsW8Os2T-X_nCH1iW-N-K_rN77u' },
      { name: 'React JS بالعربي - Code Zone', url: 'https://www.youtube.com/playlist?list=PL6n9fhu94yhXl2oN3IInY3u4hM5jS8q6r' }
    ]
  },
  {
    id: 'design',
    title: 'التصميم الجرافيكي',
    desc: 'احترف أدوات التصميم وصناعة الهويات البصرية المتميزة.',
    icon: Palette,
    color: 'pink',
    steps: ['أساسيات التصميم', 'Photoshop', 'Illustrator', 'نظرية الألوان', 'بناء المعرض'],
    resources: [
      { name: 'أساسيات التصميم - Nour Design', url: 'https://www.youtube.com/playlist?list=PLB9dId7O93nN9rLhG6fC9dI7T08R4eK9H' },
      { name: 'Photoshop للمبتدئين - Amr Attia', url: 'https://www.youtube.com/playlist?list=PL6U2D-n4X7X_B7wK3S_uRst7I6_0-vA-_' }
    ]
  },
  {
    id: 'video',
    title: 'المونتاج وصناعة الفيديو',
    desc: 'تعلم فن سرد القصص عبر تحرير الفيديو والمؤثرات البصرية.',
    icon: Video,
    color: 'purple',
    steps: ['أساسيات المونتاج', 'Premiere Pro', 'After Effects', 'مؤثرات صوتية', 'إخراج مشروع'],
    resources: [
      { name: 'تعلم مونتاج Premiere Pro - Mostafa Makram', url: 'https://www.youtube.com/playlist?list=PLZ5zW62_uA_2p_X_6uP-00m6Wv7D-tA-4' },
      { name: 'After Effects للمبتدئين - Sonar Community', url: 'https://www.youtube.com/playlist?list=PL6U2D-n4X7X-m5_W5OaQlyuB_Llhf_Msk' }
    ]
  },
  {
    id: 'marketing',
    title: 'التسويق الرقمي',
    desc: 'كيفية إدارة الحملات الإعلانية والتسويق عبر منصات التواصل.',
    icon: Megaphone,
    color: 'orange',
    steps: ['أساسيات التسويق', 'SEO', 'إعلانات فيسبوك', 'تحليل البيانات', 'استراتيجية محتوى'],
    resources: [
      { name: 'دبلومة التسويق الإلكتروني - Free Courses Arabia', url: 'https://www.youtube.com/playlist?list=PL6rZ-q_Z-_Y9yT0Lh8_1R88fK8I8S_-A2' },
      { name: 'أساسيات SEO - Seobility', url: 'https://www.youtube.com/learn-seo' }
    ]
  }
];

const ADDITIONAL_CATEGORIES = [
  {
    id: 'voice',
    title: 'التعليق الصوتي',
    icon: Mic2,
    color: 'blue',
    resources: [
      { name: 'أساسيات التعليق الصوتي - Khalid Al-Najjar', url: 'https://www.youtube.com/playlist?list=PLknwEmKsW8Oul_p6S-v-B-X6Y_pA8K0fV' },
      { name: 'كيف تبدأ في مجال الدبلجة - Islam Adel', url: 'https://www.youtube.com/playlist?list=PLB9dId7O93nM8hS5-nC8uO_17U0yv5L-F' }
    ]
  },
  {
    id: 'content',
    title: 'كتابة المحتوى',
    icon: FileText,
    color: 'pink',
    resources: [
      { name: 'كتابة المحتوى للمبتدئين - Shaker', url: 'https://www.youtube.com/playlist?list=PLvG2uK-WvC-X-L-X6Y_pA8K0fV' },
      { name: 'Copywriting 101 - Hesham Afifi', url: 'https://www.youtube.com/playlist?list=PL6n9fhu94yhXl2oN3IInY3u4hM5jS8q6r' }
    ]
  },
  {
    id: 'english',
    title: 'اللغة الإنجليزية',
    icon: GraduationCap,
    color: 'purple',
    resources: [
      { name: 'ZAmericanEnglish - ابراهيم عادل', url: 'https://www.youtube.com/c/ZAmericanEnglish' },
      { name: 'دروس أونلاين - أحمد أبو زيد', url: 'https://www.youtube.com/playlist?list=PL5Xv0lD_z-68pA8K0fV' }
    ]
  },
  {
    id: 'mobile',
    title: 'تطوير التطبيقات',
    icon: Code,
    color: 'orange',
    resources: [
      { name: 'Flutter بالعربي - Wael Abo Hamza', url: 'https://www.youtube.com/playlist?list=PLvG2uK-WvC-X7_pA8K0fV' },
      { name: 'React Native بالعربي - Unique Coderz', url: 'https://www.youtube.com/playlist?list=PLknwEmKsW8Ot-pA8K0fV' }
    ]
  },
];

export default function Learn() {
  const [completedSteps, setCompletedSteps] = useState<Record<string, string[]>>({});
  const [selectedRoadmap, setSelectedRoadmap] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('completedSteps');
    if (saved) setCompletedSteps(JSON.parse(saved));
  }, []);

  const toggleStep = (roadmapId: string, step: string) => {
    setCompletedSteps(prev => {
      const current = prev[roadmapId] || [];
      const updated = current.includes(step) 
        ? current.filter(s => s !== step)
        : [...current, step];
      
      const newState = { ...prev, [roadmapId]: updated };
      localStorage.setItem('completedSteps', JSON.stringify(newState));
      
      if (!current.includes(step) && updated.length === ROADMAPS.find(r => r.id === roadmapId)?.steps.length) {
         toast.success(`مبروك! لقد أكملت خارطة طريق ${ROADMAPS.find(r => r.id === roadmapId)?.title}`, {
           icon: <Trophy className="w-5 h-5 text-amber-500" />
         });
      }
      
      return newState;
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <motion.h1 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-4xl md:text-5xl font-bold mb-4"
        >
          تعلم مهارات المستقبل
        </motion.h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          نقدم لك خارطة طريق واضحة لكل تخصص، اتبع الخطوات وراقب تقدمك نحو الاحتراف.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        {ROADMAPS.map((roadmap, i) => {
          const finished = completedSteps[roadmap.id] || [];
          const progress = (finished.length / roadmap.steps.length) * 100;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-[3rem] border border-gray-100 p-8 shadow-xl shadow-gray-200/20 hover:shadow-2xl transition-all flex flex-col"
            >
              <div className="flex items-start gap-6 mb-8 text-right">
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0",
                  roadmap.color === 'blue' && 'bg-blue-50 text-blue-600',
                  roadmap.color === 'pink' && 'bg-pink-50 text-pink-600',
                  roadmap.color === 'purple' && 'bg-purple-50 text-purple-600',
                  roadmap.color === 'orange' && 'bg-orange-50 text-orange-600'
                )}>
                  <roadmap.icon className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">{roadmap.title}</h3>
                  <p className="text-gray-500">{roadmap.desc}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-bold text-gray-700">التقدم: {Math.round(progress)}%</span>
                  <span className="text-gray-400">{finished.length} من {roadmap.steps.length} خطوات</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      roadmap.color === 'blue' && 'bg-blue-500',
                      roadmap.color === 'pink' && 'bg-pink-500',
                      roadmap.color === 'purple' && 'bg-purple-500',
                      roadmap.color === 'orange' && 'bg-orange-500'
                    )}
                  />
                </div>
              </div>

              <div className="space-y-4 flex-grow">
                <h4 className="font-bold text-gray-900 flex items-center gap-2">
                  <div className="w-1.5 h-6 bg-primary rounded-full" />
                  خطوات التعلم:
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  {roadmap.steps.map((step, idx) => {
                    const isDone = finished.includes(step);
                    return (
                      <button
                        key={idx}
                        onClick={() => toggleStep(roadmap.id, step)}
                        className={cn(
                          "flex items-center justify-between gap-3 p-4 rounded-2xl border transition-all group text-right w-full",
                          isDone 
                            ? "bg-emerald-50 border-emerald-200" 
                            : "bg-gray-50 border-transparent hover:border-primary/50"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-all",
                            isDone ? "bg-emerald-500 border-emerald-500 text-white" : "border-gray-300 group-hover:border-primary"
                          )}>
                            {isDone && <CheckCircle className="w-4 h-4" />}
                          </div>
                          <span className={cn(
                            "text-sm font-bold transition-all",
                            isDone ? "text-emerald-700 line-through opacity-70" : "text-gray-700"
                          )}>{step}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button 
                onClick={() => setSelectedRoadmap(roadmap)}
                className="w-full mt-8 flex items-center justify-center gap-2 bg-gray-900 text-white py-4 rounded-2xl font-bold hover:shadow-xl transition-all"
              >
                <Play className="w-4 h-4" />
                عرض المصادر التعليمية
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Resources Modal */}
      <AnimatePresence>
        {selectedRoadmap && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRoadmap(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-xl rounded-[2.5rem] p-8 relative shadow-2xl z-10"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center",
                  selectedRoadmap.color === 'blue' && 'bg-blue-50 text-blue-600',
                  selectedRoadmap.color === 'pink' && 'bg-pink-50 text-pink-600',
                  selectedRoadmap.color === 'purple' && 'bg-purple-50 text-purple-600',
                  selectedRoadmap.color === 'orange' && 'bg-orange-50 text-orange-600'
                )}>
                  <selectedRoadmap.icon className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">مصادر {selectedRoadmap.title}</h2>
                  <p className="text-gray-500 text-sm">أفضل الموارد التعليمية التي اخترناها لك بعناية</p>
                </div>
              </div>

              <div className="space-y-3">
                {selectedRoadmap.resources?.map((res, idx) => (
                  <a
                    key={idx}
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-primary hover:bg-white transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-white w-8 h-8 rounded-lg flex items-center justify-center shadow-sm text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                        <Play className="w-4 h-4 fill-current" />
                      </div>
                      <span className="font-bold text-gray-700">{res.name}</span>
                    </div>
                    <div className="text-gray-400 group-hover:text-primary transition-colors">
                       <Play className="w-4 h-4 rotate-180" />
                    </div>
                  </a>
                ))}
              </div>

              <button
                onClick={() => setSelectedRoadmap(null)}
                className="w-full mt-8 bg-gray-100 text-gray-500 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
                إغلاق
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* Categories Grid */}
      <div className="bg-gray-900 rounded-[4rem] p-12 md:p-20 text-white">
        <h2 className="text-3xl font-bold mb-12 text-center">أقسام تعليمية إضافية</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {ADDITIONAL_CATEGORIES.map((cat, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.05 }}
              onClick={() => setSelectedRoadmap(cat)}
              className="flex flex-col items-center gap-4 group"
            >
              <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <cat.icon className="w-10 h-10 text-primary" />
              </div>
              <span className="font-bold text-lg">{cat.title}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
