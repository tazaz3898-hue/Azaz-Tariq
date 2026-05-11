import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, setDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Briefcase, MapPin, DollarSign, Clock, Search, Filter, Plus, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

interface Job {
  id: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  clientId: string;
  status: string;
  createdAt: any;
  applicationsCount: number;
}

const CATEGORIES = [
  'الكل',
  'برمجة',
  'تصميم',
  'تسويق',
  'كتابة محتوى',
  'ترجمة',
  'فيديو ومونتاج',
  'إدخال بيانات'
];

export default function Jobs() {
  const { profile, user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('الكل');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Job Form
  const [newJob, setNewJob] = useState({
    title: '',
    description: '',
    category: 'برمجة',
    budget: 50
  });

  useEffect(() => {
    const q = query(collection(db, 'jobs'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const jobList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Job));
      setJobs(jobList);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleAddJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      await addDoc(collection(db, 'jobs'), {
        ...newJob,
        clientId: user.uid,
        status: 'open',
        applicationsCount: 0,
        createdAt: serverTimestamp()
      });
      setShowAddModal(false);
      setNewJob({ title: '', description: '', category: 'برمجة', budget: 50 });
      toast.success('تم نشر المشروع بنجاح! سيتم إخطارك عند استلام عروض.');
    } catch (error) {
      console.error(error);
      toast.error('حدث خطأ أثناء نشر المشروع');
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase()) || 
                         job.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'الكل' || job.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold mb-2">سوق فرص العمل</h1>
          <p className="text-gray-500">اكتشف أحدث المشاريع التي تناسب مهاراتك وابدأ العمل الآن.</p>
        </div>
        {profile?.role === 'client' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-bold hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            نشر مشروع جديد
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="ابحث عن مشاريع (مثلاً: تصميم شعار، برمجة تطبيق...)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-gray-100 rounded-2xl py-4 pr-12 pl-4 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all shadow-sm"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all border",
                activeCategory === cat 
                  ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                  : "bg-white text-gray-600 border-gray-100 hover:border-primary"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 animate-pulse h-64" />
          ))}
        </div>
      ) : filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <motion.div
              layout
              key={job.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-8 rounded-[2.5rem] border border-gray-100 hover:border-primary hover:shadow-2xl hover:shadow-gray-200/50 transition-all flex flex-col group h-full"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full border border-emerald-100">
                  {job.category}
                </span>
                <span className="text-gray-400 text-xs flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {job.createdAt ? formatDistanceToNow(job.createdAt.toDate(), { addSuffix: true, locale: ar }) : ''}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-1">{job.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">{job.description}</p>
              
              <div className="flex items-center justify-between pt-6 border-t border-gray-50 mt-auto">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">الميزانية المتوقعة</span>
                  <div className="flex items-center text-lg font-bold text-gray-900">
                    <DollarSign className="w-4 h-4 text-emerald-500" />
                    <span>{job.budget}</span>
                  </div>
                </div>
                <Link
                  to={`/jobs/${job.id}`}
                  className="bg-gray-50 text-gray-900 px-6 py-2.5 rounded-xl font-bold hover:bg-primary hover:text-white transition-all text-sm"
                >
                  عرض التفاصيل
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-gray-200">
          <Briefcase className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-400">لا توجد مشاريع حالياً</h2>
          <p className="text-gray-400 mt-2">كن أول من ينشر مشروعاً في هذا القسم!</p>
        </div>
      )}

      {/* Add Job Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-xl rounded-[2.5rem] p-8 relative shadow-2xl z-10"
            >
              <button 
                onClick={() => setShowAddModal(false)}
                className="absolute left-6 top-6 p-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
              <h2 className="text-2xl font-bold mb-8">نشر مشروع جديد</h2>
              
              <form onSubmit={handleAddJob} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">عنوان المشروع</label>
                  <input
                    required
                    type="text"
                    value={newJob.title}
                    onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                    placeholder="مثلاً: تصميم تطبيق جوال لمتجر"
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">التصنيف</label>
                  <select
                    value={newJob.category}
                    onChange={(e) => setNewJob({...newJob, category: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  >
                    {CATEGORIES.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">الميزانية ($)</label>
                  <input
                    required
                    type="number"
                    min="5"
                    value={newJob.budget}
                    onChange={(e) => setNewJob({...newJob, budget: parseInt(e.target.value)})}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">وصف المشروع</label>
                  <textarea
                    required
                    rows={4}
                    value={newJob.description}
                    onChange={(e) => setNewJob({...newJob, description: e.target.value})}
                    placeholder="اشرح تفاصيل المشروع وما الذي تتوقعه من المستقل..."
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-primary/20 transition-all"
                >
                  نشر المشروع الآن
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
