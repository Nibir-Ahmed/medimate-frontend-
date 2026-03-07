import { BookOpen, User } from 'lucide-react'

function PostCard({ post }) {
  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 hover:bg-white/15 transition-all">
      
      {/* Title */}
      <div className="flex items-start gap-3 mb-3">
        <BookOpen size={20} className="text-violet-400 mt-1 shrink-0" />
        <h3 className="text-white font-bold text-lg">{post.title}</h3>
      </div>

      {/* Content */}
      <p className="text-white/60 text-sm leading-relaxed mb-4 line-clamp-3">
        {post.content}
      </p>

      {/* Author */}
      <div className="flex items-center gap-2 pt-3 border-t border-white/10">
        <div className="w-7 h-7 bg-gradient-to-br from-violet-400 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
          {post.authorName?.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-white/80 text-sm font-medium">{post.authorName}</p>
          <p className="text-white/40 text-xs">
            {new Date(post.createdAt).toLocaleDateString('bn-BD')}
          </p>
        </div>
      </div>

    </div>
  )
}

export default PostCard