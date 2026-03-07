import { useState, useEffect } from 'react'
import { getAllPosts, createPost } from '../services/api'
import { PenLine, Send } from 'lucide-react'
import PostCard from '../components/PostCard'

function Blog() {
  const [posts, setPosts] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [posting, setPosting] = useState(false)

  const user = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    setLoading(true)
    const data = await getAllPosts()
    setPosts(data)
    setLoading(false)
  }

  const handleCreatePost = async () => {
    if (!title || !content) return
    setPosting(true)
    await createPost(title, content, user?.name || 'Anonymous')
    setTitle('')
    setContent('')
    setPosting(false)
    fetchPosts()
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            <span className='flex items-center justify-center'>
              <PenLine className='mr-1.5' size={28} /> Health Blog
            </span>
          </h1>
          <p className="text-white/60">ডাক্তারদের স্বাস্থ্য পরামর্শ পড়ুন</p>
        </div>

        {/* Post Form — Doctor only */}
        {user?.role === 'doctor' && (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">
              <span className='flex items-center'>
                <PenLine className='mr-1.5' size={18} /> নতুন Post লিখুন
              </span>
            </h2>
            <input
              type="text"
              placeholder="Post এর Title"
              className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-violet-400 transition-all mb-3"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              placeholder="আপনার স্বাস্থ্য পরামর্শ লিখুন..."
              className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-violet-400 transition-all h-32 resize-none mb-3"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <button
              onClick={handleCreatePost}
              disabled={posting}
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold px-6 py-3 rounded-2xl transition-all shadow-lg shadow-violet-900/50"
            >
              {posting ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <span className='flex items-center'>
                  <Send className='mr-1.5' size={18} /> Post করুন
                </span>
              )}
            </button>
          </div>
        )}

        {/* Posts */}
        {loading ? (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg text-violet-400"></span>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4"><Send /></div>
            <p className="text-white/50">কোনো post নেই এখনো</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

export default Blog