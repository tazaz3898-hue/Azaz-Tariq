import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Briefcase, GraduationCap, Bot, MessageSquare, ArrowRight, CheckCircle, Globe, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';

export default function Home() {
  const { loginWithGoogle, user } = useAuth();

  const features = [
    {
      title: 'مساعد ذكي متطور',
      desc: 'تدعيم ملفك الشخصي وعروضك باستخدام الذكاء الاصطناعي لتزيد فرص قبولك.',
      icon: Bot,
      color: 'blue',
      link: '/assistant'
    },
    {
      title: 'سوق الفرص الحقيقية',
      desc: 'تصفح مئات المشاريع المحلية والعالمية التي تناسب مهاراتك داخل اليمن وخارجه.',
      icon: Briefcase,
      color: 'emerald',
      link: '/jobs'
    },
    {
      title: 'تطوير المهارات',
      desc: 'دورات تدريبية مكثفة وخارطة طريق لكل تخصص مطلوب في سوق العمل الحر.',
      icon: GraduationCap,
      color: 'amber',
      link: '/learn'
    },
    {
      title: 'مجتمع المستقلين',
      desc: 'تبادل الخبرات مع شباب يمنيين مبدعين وكون فرق عمل قوية.',
      icon: MessageSquare,
      color: 'sky',
      link: '/community'
    }
  ];

  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* Hero Section */}
      <section className="relative pt-20 px-4 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.1)_0%,transparent_50%)]" />
        
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-sm font-bold border border-emerald-100"
          >
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            منصة العمل الحر الأولى للشباب اليمني
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold leading-tight"
          >
            أطلق مهاراتك... <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">واصنع مستقبلك</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-2xl leading-relaxed"
          >
            ادخل عالم العمل الحر بكل قوة. منصة ذكية توفر لك التدريب، الدعم، وفرص العمل الحقيقية لتكون مستقلاً مالياً ومبدعاً عالمياً.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            {!user ? (
              <button
                onClick={() => loginWithGoogle()}
                className="group bg-primary text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-primary/20 transition-all flex items-center justify-center gap-2"
              >
                ابدأ رحلتك مجاناً
                <ArrowRight className="w-5 h-5 group-hover:-translate-x-1 transition-transform rotate-180" />
              </button>
            ) : (
              <Link
                to="/jobs"
                className="group bg-primary text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-primary/20 transition-all flex items-center justify-center gap-2"
              >
                تصفح المشاريع
                <ArrowRight className="w-5 h-5 group-hover:-translate-x-1 transition-transform rotate-180" />
              </Link>
            )}
            <Link
              to="/learn"
              className="bg-white text-gray-700 px-8 py-4 rounded-2xl font-bold text-lg border border-gray-200 hover:border-primary transition-all flex items-center justify-center gap-2"
            >
              تعلم المهارات
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link
                to={feature.link}
                className="block h-full bg-white p-8 rounded-3xl border border-gray-100 hover:border-primary hover:shadow-2xl hover:shadow-gray-200/50 transition-all group"
              >
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110",
                  feature.color === 'blue' && 'bg-blue-50 text-blue-600',
                  feature.color === 'emerald' && 'bg-emerald-50 text-emerald-600',
                  feature.color === 'amber' && 'bg-amber-50 text-amber-600',
                  feature.color === 'sky' && 'bg-sky-50 text-sky-600'
                )}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trust Marks */}
      <section className="bg-gray-900 py-24 px-4 overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
                لماذا يثق الشباب اليمني بـ <span className="text-primary italic">شغلني؟</span>
              </h2>
              <div className="space-y-6">
                {[
                  { title: 'حلول دفع ذكية', desc: 'استلام أتعابك عبر المحافظ الإلكترونية المحلية بسهولة وأمان.', icon: Shield },
                  { title: 'دعم بالذكاء الاصطناعي', desc: 'مساعد شخصي متاح 24/7 لمساعدتك في الحصول على عمل.', icon: Bot },
                  { title: 'وصول للعالمية', desc: 'ربطك بمشاريع من خارج حدود اليمن لتحقيق دخل بالعملة الصعبة.', icon: Globe }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-primary">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-1">{item.title}</h4>
                      <p className="text-gray-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-emerald-500 to-sky-500 rounded-3xl overflow-hidden shadow-2xl relative">
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="bg-white/90 backdrop-blur p-8 rounded-2xl shadow-xl transform rotate-2 max-w-xs">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                          <CheckCircle className="w-6 h-6" />
                        </div>
                        <span className="font-bold">تم قبول العرض!</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">"مبارك لك أسامة، لقد تم اختيار عرضك للمشروع البرمجي الجديد."</p>
                      <div className="text-sm font-bold text-emerald-600 flex justify-between">
                        <span>قيمة المشروع:</span>
                        <span>$1,200</span>
                      </div>
                   </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/20 blur-3xl rounded-full" />
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-secondary/20 blur-3xl rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 w-full grid grid-cols-2 md:grid-cols-4 gap-8">
        {[
          { label: 'مستقل يمني', value: '+١٠,٠٠٠' },
          { label: 'مشروع منجز', value: '+٥,٠٠٠' },
          { label: 'دخل محقق', value: '+$٢٥٠ ألف' },
          { label: 'دورة تدريبية', value: '+١٥٠' },
        ].map((stat, i) => (
          <div key={i} className="text-center">
            <div className="text-4xl font-bold mb-2 text-gray-900 font-mono">{stat.value}</div>
            <div className="text-gray-500 font-medium">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* CTA Section */}
      <section className="max-w-5xl mx-auto px-4 w-full">
        <div className="bg-primary rounded-[3rem] p-12 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
          <h2 className="text-4xl font-bold mb-6">ابدأ مهارتك... واصنع مستقبلك</h2>
          <p className="text-white/80 text-xl mb-10 max-w-2xl mx-auto">
            انضم الآن إلى آلاف الشباب اليمني الذين غيروا حياتهم عبر العمل الحر.
          </p>
          <button
            onClick={() => loginWithGoogle()}
            className="bg-white text-primary px-10 py-5 rounded-2xl font-bold text-xl hover:shadow-2xl transition-all"
          >
            سجل الآن مجاناً
          </button>
        </div>
      </section>
    </div>
  );
}
