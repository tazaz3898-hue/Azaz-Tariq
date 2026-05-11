import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, addDoc, serverTimestamp, query, where, onSnapshot, updateDoc, increment } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Briefcase, DollarSign, Clock, User, ChevronRight, Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { cn } from '../lib/utils';

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

interface Application {
  id: string;
  freelancerId: string;
  coverLetter: string;
  bidAmount: number;
  status: string;
  createdAt: any;
}

export default function JobDetails() {
  const { id } = useParams();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [client, setClient] = useState<any>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  
  const [form, setForm] = useState({
    coverLetter: '',
    bidAmount: 0
  });

  useEffect(() => {
    if (!id) return;

    const fetchJob = async () => {
      const jobRef = doc(db, 'jobs', id);
      const jobSnap = await getDoc(jobRef);
      if (jobSnap.exists()) {
        const jobData = { id: jobSnap.id, ...jobSnap.data() } as Job;
        setJob(jobData);
        
        // Fetch client details
        const clientRef = doc(db, 'profiles', jobData.clientId);
        const clientSnap = await getDoc(clientRef);
        if (clientSnap.exists()) {
          setClient(clientSnap.data());
        }

        // Check if current user already applied
        if (user) {
          const q = query(
            collection(db, `jobs/${id}/applications`), 
            where('freelancerId', '==', user.uid)
          );
          onSnapshot(q, (snapshot) => {
            if (!snapshot.empty) setHasApplied(true);
          });
        }
      } else {
        navigate('/jobs');
      }
      setLoading(false);
    };

    fetchJob();
    
    // Listen for applications (for client view)
    const q = query(collection(db, `jobs/${id}/applications`));
    const unsubscribe = onSnapshot(q, (snapshot) => {
       const apps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Application));
       setApplications(apps);
    });

    return unsubscribe;
  }, [id, user]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id || !job) return;
    setIsApplying(true);

    try {
      await addDoc(collection(db, `jobs/${id}/applications`), {
        freelancerId: user.uid,
        coverLetter: form.coverLetter,
        bidAmount: form.bidAmount || job.budget,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      // Increment application count on job
      await updateDoc(doc(db, 'jobs', id), {
        applicationsCount: increment(1)
      });
      setHasApplied(true);
    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء التقديم');
    } finally {
      setIsApplying(false);
    }
  };

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-20 flex justify-center">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!job) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <button 
        onClick={() => navigate('/jobs')}
        className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-8 group"
      >
        <ChevronRight className="w-5 h-5 group-hover:translate-x-1" />
        العودة لسوق العمل
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/20">
            <div className="flex justify-between items-start mb-6">
              <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 text-sm font-bold rounded-full border border-emerald-100">
                {job.category}
              </span>
              <span className="text-gray-400 text-sm flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {job.createdAt ? formatDistanceToNow(job.createdAt.toDate(), { addSuffix: true, locale: ar }) : ''}
              </span>
            </div>
            
            <h1 className="text-3xl font-bold mb-6">{job.title}</h1>
            <div className="prose prose-emerald max-w-none text-gray-600 leading-relaxed">
              {job.description.split('\n').map((para, i) => (
                <p key={i} className="mb-4">{para}</p>
              ))}
            </div>
          </div>

          {/* Application Form */}
          {profile?.role === 'freelancer' && user?.uid !== job.clientId && (
            <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/20">
              <h2 className="text-2xl font-bold mb-6">قدم عرضك لهذه الفرصة</h2>
              
              {hasApplied ? (
                <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl flex flex-col items-center text-center">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-4" />
                  <h3 className="text-xl font-bold text-emerald-800 mb-2">تم إرسال عرضك بنجاح!</h3>
                  <p className="text-emerald-600">سيقوم صاحب المشروع بمراجعة عرضك والتواصل معك في حال القبول.</p>
                </div>
              ) : (
                <form onSubmit={handleApply} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">رسالة العرض (Cover Letter)</label>
                    <textarea
                      required
                      placeholder="اشرح لماذا أنت الشخص المناسب لهذا العمل..."
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 min-h-[200px] outline-none focus:ring-2 focus:ring-primary/20"
                      value={form.coverLetter}
                      onChange={(e) => setForm({...form, coverLetter: e.target.value})}
                    />
                    <p className="text-xs text-gray-400 mt-2">
                      تلميح: استخدم "المساعد الذكي" لتحسين كتابة عرضك!
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">قيمة العرض ($)</label>
                      <input
                        required
                        type="number"
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none"
                        value={form.bidAmount || job.budget}
                        onChange={(e) => setForm({...form, bidAmount: parseInt(e.target.value)})}
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isApplying}
                    className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-primary/20 transition-all flex items-center justify-center gap-2"
                  >
                    {isApplying ? (
                      <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-5 h-5 rotate-180" />
                        تقديم العرض
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Client View Applications Area */}
          {user?.uid === job.clientId && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">العروض المقدمة ({applications.length})</h2>
              {applications.length > 0 ? (
                <div className="space-y-4">
                  {applications.map(app => (
                    <ApplicationCard key={app.id} application={app} jobStatus={job.status} />
                  ))}
                </div>
              ) : (
                <div className="bg-white p-12 rounded-[2rem] border border-dashed border-gray-200 text-center text-gray-400">
                  لا توجد عروض مقدمة بعد.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-lg">
            <div className="mb-6">
              <span className="text-xs text-gray-400 uppercase font-bold tracking-wider block mb-1">الميزانية</span>
              <div className="flex items-center text-3xl font-bold text-gray-900 font-mono">
                <DollarSign className="w-6 h-6 text-emerald-500" />
                <span>{job.budget}</span>
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 text-gray-600">
                <Briefcase className="w-5 h-5 text-gray-400" />
                <span className="text-sm">عدد العروض: {job.applicationsCount || 0}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <div className={cn(
                  "w-2.5 h-2.5 rounded-full",
                  job.status === 'open' ? "bg-emerald-500 animate-pulse" : "bg-gray-300"
                )} />
                <span className="text-sm">الحالة: {job.status === 'open' ? 'مفتوح للتقديم' : 'مغلق'}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-lg">
             <h3 className="text-sm font-bold text-gray-400 uppercase mb-4 tracking-wider">حول صاحب المشروع</h3>
             {client ? (
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 border border-gray-100">
                    {client.avatar ? <img src={client.avatar} className="w-full h-full object-cover" /> : <User className="w-full h-full p-2 text-gray-400" />}
                  </div>
                  <div>
                    <div className="font-bold">{client.name}</div>
                    <div className="text-xs text-gray-400">عميل في شغلني</div>
                  </div>
               </div>
             ) : (
               <div className="h-12 bg-gray-50 rounded-xl animate-pulse" />
             )}
          </div>

          <div className="bg-emerald-50 p-6 rounded-[2rem] border border-emerald-100">
            <p className="text-emerald-700 text-sm leading-relaxed font-medium">
              تأكد من كتابة عرض مهاري يوضح خبرتك وكيف ستساعد في إنجاز هذا المشروع لزيادة فرص فوزك بالعمل.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ApplicationCard({ application, jobStatus }: { application: Application, jobStatus: string }) {
  const [freelancer, setFreelancer] = useState<any>(null);
  
  useEffect(() => {
    const fetchFreelancer = async () => {
      const snap = await getDoc(doc(db, 'profiles', application.freelancerId));
      if (snap.exists()) setFreelancer(snap.data());
    };
    fetchFreelancer();
  }, [application.freelancerId]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
             {freelancer?.avatar && <img src={freelancer.avatar} className="w-full h-full object-cover" />}
          </div>
          <div>
            <div className="font-bold">{freelancer?.name || 'مستقل'}</div>
            <div className="text-xs text-emerald-600 font-bold">{application.bidAmount}$</div>
          </div>
        </div>
        <span className="text-[10px] text-gray-400">
          {application.createdAt ? formatDistanceToNow(application.createdAt.toDate(), { locale: ar }) : ''}
        </span>
      </div>
      <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{application.coverLetter}</p>
    </motion.div>
  );
}
