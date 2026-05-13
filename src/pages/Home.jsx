import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getAllPosts } from '../services/api'
import { Home as HomeIcon, Bot, MessageCircle, BookOpen, AlertCircle, ArrowRight, User, X } from 'lucide-react'

const features = [
  {
    title: "AI Diagnosis",
    description: "ছবি আর symptoms দিলে AI সাথে সাথে suggestion দেবে",
    icon: "🤖",
    image: "/slide1.jpg",
    bg: "from-violet-600 to-purple-700"
  },
  {
    title: "Doctor Chat",
    description: "Real-time এ doctor এর সাথে কথা বলো",
    icon: "💬",
    image: "/slide2.jpg",
    bg: "from-purple-600 to-indigo-700"
  },
  {
    title: "Emergency Help",
    description: "যেকোনো emergency তে দ্রুত সাহায্য পাও",
    icon: "🚨",
    image: "/slide3.jpg",
    bg: "from-indigo-600 to-violet-700"
  },
  {
    title: "Health Blog",
    description: "Doctor দের লেখা স্বাস্থ্য বিষয়ক পোস্ট পড়ো",
    icon: "📝",
    image: "/slide4.jpg",
    bg: "from-violet-700 to-purple-600"
  }
]

function Home() {
  const [posts, setPosts] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    getAllPosts().then(data => setPosts(data))
  }, [])

  return (
    <div className="flex min-h-screen relative">

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static top-0 left-0 h-full lg:h-auto
        w-64 z-50 lg:z-auto
        rounded-xl mt-0 lg:mt-3 shrink-0 p-4 flex flex-col gap-2
        bg-white/10 backdrop-blur-md border-r border-white/20
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>

        {/* Mobile close button */}
        <div className="flex justify-end lg:hidden mb-2">
          <button onClick={() => setSidebarOpen(false)} className="text-white/70 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <Link to="/" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 text-white hover:bg-white/20 px-3 py-2.5 rounded-xl transition-all">
          <HomeIcon size={18} /><span>Home</span>
        </Link>
        <Link to="/ai-chat" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 text-white hover:bg-white/20 px-3 py-2.5 rounded-xl transition-all">
          <Bot size={18} /><span>AI Chat</span>
        </Link>
        <Link to="/doctor-chat" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 text-white hover:bg-white/20 px-3 py-2.5 rounded-xl transition-all">
          <MessageCircle size={18} /><span>Doctor Chat</span>
        </Link>
        <Link to="/blog" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 text-white hover:bg-white/20 px-3 py-2.5 rounded-xl transition-all">
          <BookOpen size={18} /><span>Blog</span>
        </Link>

        <div className="mt-auto">
          <div className="bg-gradient-to-br from-violet-600/30 to-purple-600/30 border border-white/20 rounded-2xl p-4">
            <p className="text-white/70 text-sm mb-3">Emergency? AI সাথে কথা বলুন এখনই!</p>
            <Link to="/ai-chat" onClick={() => setSidebarOpen(false)} className="block text-center bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-semibold py-2 rounded-xl">
              <span className='flex items-center p-1.5 justify-center'>
                <AlertCircle size={18} /> <span className='ml-1'>Quick Help</span>
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-3 min-w-0">

        {/* Mobile sidebar toggle */}
        <button
          className="lg:hidden mb-3 flex items-center gap-2 text-white/70 hover:text-white bg-white/10 px-3 py-2 rounded-xl text-sm"
          onClick={() => setSidebarOpen(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
          </svg>
          Menu
        </button>

        {/* Swiper */}
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 3000 }}
          pagination={{ clickable: true }}
          loop={true}
          className="rounded-3xl mb-8 shadow-2xl"
        >
          {features.map((feature, index) => (
            <SwiperSlide key={index}>
              <div className={`relative bg-gradient-to-br ${feature.bg} text-white rounded-3xl overflow-hidden h-48 sm:h-64 md:h-72`}>
                {feature.image && (
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-40"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
                <div className="relative z-10 flex flex-col justify-center h-full px-6 sm:px-12">
                  <h2 className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-3">{feature.title}</h2>
                  <p className="text-sm sm:text-lg opacity-90 max-w-lg">{feature.description}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Blog Section */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white">Latest Posts</h2>
          <Link to="/blog" className="text-violet-400 hover:text-violet-300 text-sm">
            <span className='flex items-center gap-1'>সব দেখুন <ArrowRight size={16} /></span>
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-white/40">কোনো post নেই এখনো</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.slice(0, 6).map((post) => (
              <div key={post.id} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5 hover:bg-white/15 transition-all shadow-xl">
                <h3 className="text-white font-bold mb-2">{post.title}</h3>
                <p className="text-white/60 text-sm line-clamp-2 mb-4">{post.content}</p>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1">
                    <User size={14} />
                    <span className="text-white/40 text-xs">{post.authorName}</span>
                  </span>
                  <Link to="/blog" className="text-violet-400 hover:text-violet-300 text-xs">Read More →</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home