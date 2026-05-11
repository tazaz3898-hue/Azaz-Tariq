import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, updateDoc, doc, arrayUnion, arrayRemove, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { MessageSquare, Heart, Share2, Send, Plus, User, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

interface Post {
  id: string;
  authorId: string;
  content: string;
  likes: string[];
  createdAt: any;
}

export default function Community() {
  const { user, profile } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState('');
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'community'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
      setPosts(postList);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !input.trim() || posting) return;
    setPosting(true);
    try {
      await addDoc(collection(db, 'community'), {
        authorId: user.uid,
        content: input,
        likes: [],
        createdAt: serverTimestamp()
      });
      setInput('');
      toast.success('تم النشر في المجتمع بنجاح');
    } catch (error) {
      console.error(error);
      toast.error('فشل في النشر');
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-3">مجتمع المستقلين</h1>
        <p className="text-gray-500">شاركونا تجاربكم، قصص نجاحكم، واطلبوا المساعدة.</p>
      </div>

      {/* Share Section */}
      {user && (
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/20 mb-8">
          <form onSubmit={handlePost} className="space-y-4">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                {profile?.avatar ? <img src={profile.avatar} className="w-full h-full object-cover" /> : <User className="w-full h-full p-2 text-gray-300" />}
              </div>
              <textarea
                placeholder="بماذا تفكر يا بطل؟ شاركنا شيئاً اليوم..."
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary/20 min-h-[100px] resize-none text-lg"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={posting || !input.trim()}
                className="bg-primary text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:shadow-lg transition-all"
              >
                {posting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send className="w-5 h-5 rotate-180" /> نشر في المجتمع</>}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Posts List */}
      <div className="space-y-6">
        {loading ? (
          [1,2,3].map(i => <div key={i} className="h-40 bg-white rounded-3xl border border-gray-100 animate-pulse" />)
        ) : posts.length > 0 ? (
          posts.map(post => <PostCard key={post.id} post={post} />)
        ) : (
          <div className="text-center py-20 text-gray-400">
            لا توجد منشورات بعد.. كن أول من يفتتح النقاش!
          </div>
        )}
      </div>
    </div>
  );
}

function PostCard({ post }: { post: Post }) {
  const { user } = useAuth();
  const [author, setAuthor] = useState<any>(null);
  const isLiked = post.likes.includes(user?.uid || '');

  useEffect(() => {
    const fetchAuthor = async () => {
      const snap = await getDoc(doc(db, 'profiles', post.authorId));
      if (snap.exists()) setAuthor(snap.data());
    };
    fetchAuthor();
  }, [post.authorId]);

  const toggleLike = async () => {
    if (!user) return;
    const postRef = doc(db, 'community', post.id);
    await updateDoc(postRef, {
      likes: isLiked ? arrayRemove(user.uid) : arrayUnion(user.uid)
    });
  };

  const deletePost = async () => {
    if (window.confirm('هل أنت متأكد من حذف هذا المنشور؟')) {
      await deleteDoc(doc(db, 'community', post.id));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-md shadow-gray-200/10"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-100 overflow-hidden">
             {author?.avatar ? <img src={author.avatar} className="w-full h-full object-cover" /> : <User className="w-full h-full p-2 text-gray-300" />}
          </div>
          <div>
            <div className="font-bold text-gray-900">{author?.name || 'مستقل مجهول'}</div>
            <div className="text-[10px] text-gray-400">
              {post.createdAt ? formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true, locale: ar }) : ''}
            </div>
          </div>
        </div>
        {user?.uid === post.authorId && (
          <button onClick={deletePost} className="p-2 text-gray-300 hover:text-red-500 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="text-gray-700 leading-relaxed text-lg mb-6 whitespace-pre-wrap">
        {post.content}
      </div>

      <div className="flex items-center gap-6 pt-4 border-t border-gray-50">
        <button
          onClick={toggleLike}
          className={cn(
            "flex items-center gap-2 font-medium transition-colors",
            isLiked ? "text-red-500" : "text-gray-400 hover:text-red-400"
          )}
        >
          <Heart className={cn("w-5 h-5", isLiked && "fill-current")} />
          <span>{post.likes.length}</span>
        </button>
        <button className="flex items-center gap-2 text-gray-400 hover:text-blue-500 transition-colors">
          <MessageSquare className="w-5 h-5" />
          <span>٠</span>
        </button>
        <button className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors mr-auto">
          <Share2 className="w-5 h-5" />
          <span className="hidden sm:inline">مشاركة</span>
        </button>
      </div>
    </motion.div>
  );
}

