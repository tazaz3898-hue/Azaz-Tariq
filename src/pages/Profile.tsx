import React, { useState, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { User, Mail, Shield, Briefcase, Plus, X, Check, Save, UserCircle, Rocket, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

export default function Profile() {
  const { profile, user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: profile?.name || '',
    bio: profile?.bio || '',
    role: profile?.role || 'freelancer',
    skills: profile?.skills || []
  });
  const [newSkill, setNewSkill] = useState('');

  const profileStrength = useMemo(() => {
    if (!profile) return 0;
    let strength = 0;
    if (profile.name) strength += 25;
    if (profile.bio && profile.bio.length > 20) strength += 25;
    if (profile.skills && profile.skills.length > 0) strength += 25;
    if (profile.avatar) strength += 25;
    return strength;
  }, [profile]);

  if (!profile) return null;

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'profiles', user.uid), {
        ...form,
        updatedAt: new Date().toISOString()
      });
      setIsEditing(false);
      toast.success('تم تحديث الملف الشخصي بنجاح');
    } catch (error) {
      console.error(error);
      toast.error('خطأ في حفظ البيانات');
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    if (newSkill && !form.skills.includes(newSkill)) {
      setForm({ ...form, skills: [...form.skills, newSkill] });
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setForm({ ...form, skills: form.skills.filter(s => s !== skill) });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/20 overflow-hidden">
        {/* Header/Cover */}
        <div className="h-40 bg-gradient-to-r from-emerald-500 to-sky-500" />
        
        <div className="px-8 pb-12">
          {/* Profile Header */}
          <div className="relative -mt-16 mb-8 flex flex-col md:flex-row items-end justify-between gap-6">
            <div className="flex flex-col md:flex-row items-end gap-6 text-center md:text-right">
              <div className="w-32 h-32 rounded-[2rem] border-4 border-white bg-gray-100 overflow-hidden shadow-xl">
                 {profile.avatar ? <img src={profile.avatar} className="w-full h-full object-cover" /> : <UserCircle className="w-full h-full p-4 text-gray-300" />}
              </div>
              <div className="pb-2">
                <h1 className="text-3xl font-bold mb-1">{profile.name}</h1>
                <p className="text-gray-500 flex items-center justify-center md:justify-start gap-2">
                  <Mail className="w-4 h-4" />
                  {profile.email}
                </p>
              </div>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-gray-900 text-white px-8 py-3 rounded-2xl font-bold hover:shadow-lg transition-all"
              >
                تعديل الملف
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Sidebar Info */}
            <div className="space-y-8">
              {/* Profile Strength */}
              <div className="bg-gradient-to-br from-emerald-50 to-sky-50 rounded-3xl p-6 border border-emerald-100/50">
                <div className="flex items-center gap-2 mb-4">
                  <Rocket className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-gray-800">قوة ملفك الشخصي</h3>
                </div>
                <div className="h-3 w-full bg-white rounded-full overflow-hidden mb-3 border border-emerald-100">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${profileStrength}%` }}
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                  />
                </div>
                <p className="text-xs text-gray-500 font-medium leading-relaxed">
                  {profileStrength < 100 
                    ? "أكمل بياناتك لتحصل على فرص عمل أكثر بنسبة 50%!" 
                    : "ملفك الشخصي مكتمل ومثالي لجذب العملاء!"}
                </p>
              </div>

              <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">الدور الحالي</h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                    {profile.role === 'freelancer' ? <Briefcase className="w-6 h-6" /> : <Shield className="w-6 h-6" />}
                  </div>
                  <span className="font-bold text-lg">{profile.role === 'freelancer' ? 'مستقل (Freelancer)' : 'صاحب مشاريع (Client)'}</span>
                </div>
              </div>

              <div>
                 <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">المهارات</h3>
                 <div className="flex flex-wrap gap-2">
                    {profile.skills?.length ? profile.skills.map((s, i) => (
                      <span key={i} className="bg-white border border-gray-100 px-4 py-1.5 rounded-full text-sm font-medium text-gray-700 shadow-sm">
                        {s}
                      </span>
                    )) : (
                      <span className="text-gray-400 italic text-sm">لا يوجد مهارات مضافة بعد</span>
                    )}
                 </div>
              </div>
            </div>

            {/* Main Bio */}
            <div className="md:col-span-2 space-y-8">
              {isEditing ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">الاسم الكامل</label>
                    <input
                      type="text"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none"
                      value={form.name}
                      onChange={(e) => setForm({...form, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">من أنا (Bio)</label>
                    <textarea
                      rows={4}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 outline-none resize-none"
                      value={form.bio}
                      onChange={(e) => setForm({...form, bio: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">أنا هنا من أجل:</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setForm({...form, role: 'freelancer'})}
                        className={cn(
                          "p-4 rounded-xl border-2 transition-all font-bold flex flex-col items-center gap-2",
                          form.role === 'freelancer' ? "border-primary bg-primary/5 text-primary" : "border-gray-100 text-gray-400"
                        )}
                      >
                        <Briefcase className="w-6 h-6" />
                        العمل الحر
                      </button>
                      <button
                        onClick={() => setForm({...form, role: 'client'})}
                        className={cn(
                          "p-4 rounded-xl border-2 transition-all font-bold flex flex-col items-center gap-2",
                          form.role === 'client' ? "border-primary bg-primary/5 text-primary" : "border-gray-100 text-gray-400"
                        )}
                      >
                        <Shield className="w-6 h-6" />
                        نشر مشاريع
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">تعديل المهارات</label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        className="flex-grow bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none"
                        value={newSkill}
                        placeholder="أضف مهارة (مثلاً: React, Figma)"
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                      />
                      <button onClick={addSkill} className="bg-gray-100 p-3 rounded-xl hover:bg-primary hover:text-white transition-all text-gray-400">
                        <Plus className="w-6 h-6" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                       {form.skills.map(s => (
                         <span key={s} className="bg-primary/10 text-primary-dark px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2">
                           {s}
                           <button onClick={() => removeSkill(s)} className="p-0.5 hover:bg-primary/20 rounded-full"><X className="w-3 h-3" /></button>
                         </span>
                       ))}
                    </div>
                  </div>

                  <div className="pt-6 flex gap-4">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex-grow bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
                    >
                      {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save className="w-5 h-5" /> حفظ المعلومات</>}
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-8 bg-gray-100 text-gray-500 py-4 rounded-2xl font-bold"
                    >
                      إلغاء
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">نبذة شخصية</h3>
                    <p className="text-gray-700 leading-relaxed text-lg italic bg-gray-50/50 p-6 rounded-3xl border border-dashed border-gray-200">
                      {profile.bio || 'لا يوجد نبذة شخصية حتى الآن. اضغط على تعديل الملف لإضافة معلومات عنك.'}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div className="bg-emerald-50/50 border border-emerald-100 p-6 rounded-2xl">
                        <div className="text-emerald-800 font-bold mb-1">المشاريع المكتملة</div>
                        <div className="text-3xl font-bold text-emerald-600">٠</div>
                     </div>
                     <div className="bg-blue-50/50 border border-blue-100 p-6 rounded-2xl">
                        <div className="text-blue-800 font-bold mb-1">التقييم العام</div>
                        <div className="text-3xl font-bold text-blue-600">٥.٠</div>
                     </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
