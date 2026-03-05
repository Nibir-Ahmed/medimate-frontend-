import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Home, LogIn, Bot, MessageCircle, BookOpen, LogOut, User, ShieldCheck } from 'lucide-react'

function Navbar() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const checkUser = () => {
      const storedUser = localStorage.getItem('user')
      if (storedUser) setUser(JSON.parse(storedUser))
      else setUser(null)
    }

    checkUser()
    window.addEventListener('storage', checkUser)
    return () => window.removeEventListener('storage', checkUser)
  }, [location])

  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  return (
    <div className="navbar rounded-lg  bg-white/10 backdrop-blur-md border-b border-white/20 shadow-lg px-6 sticky top-0 z-50">

      {/* Mobile Hamburger */}
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content bg-white/20 backdrop-blur-md border border-white/20 rounded-2xl z-10 mt-3 w-52 p-2 shadow-xl">
            <li><Link to="/ai-chat" className="text-white hover:bg-white/20 rounded-xl"><Bot size={18} />AI Chat</Link></li>
            <li><Link to="/blog" className="text-white hover:bg-white/20 rounded-xl"><BookOpen size={18} />Blog</Link></li>
            <li><Link to="/doctor-chat" className="text-white hover:bg-white/20 rounded-xl"><MessageCircle size={18} />Doctor Chat</Link></li>
            {user ? (
              <li><button onClick={handleLogout} className="text-white hover:bg-white/20 rounded-xl"><LogOut size={18} /> Logout</button></li>
            ) : (
              <li><Link to="/login" className="text-white hover:bg-white/20 rounded-xl"><LogIn size={18} />Login</Link></li>
            )}
          </ul>
        </div>

        {/* Logo */}
        <Link to="/" className="btn btn-ghost text-xl font-bold flex items-center gap-1">
          <span className="text-white">Medi</span>
          <span className="bg-gradient-to-r from-violet-400 to-purple-600 text-white px-2 py-1 rounded-lg shadow-md shadow-violet-900/50">Mate</span>
        </Link>
      </div>

      {/* Desktop Links */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-1">
          <li>
            <Link to="/ai-chat" className={`text-white rounded-xl transition-all ${isActive('/ai-chat') ? 'bg-white/20 font-bold' : 'hover:bg-white/10'}`}>
              <Bot size={18} />  AI Chat
            </Link>
          </li>
          <li>
            <Link to="/blog" className={`text-white rounded-xl transition-all ${isActive('/blog') ? 'bg-white/20 font-bold' : 'hover:bg-white/10'}`}>
              <BookOpen size={18} />  Blog
            </Link>
          </li>
          <li>
            <Link to="/doctor-chat" className={`text-white rounded-xl transition-all ${isActive('/doctor-chat') ? 'bg-white/20 font-bold' : 'hover:bg-white/10'}`}>
              <MessageCircle size={18} />  Doctor Chat
            </Link>
          </li>
          {user?.role === 'admin' && (
            <li>
              <Link to="/admin" className={`text-white rounded-xl transition-all ${isActive('/admin') ? 'bg-white/20 font-bold' : 'hover:bg-white/10'}`}>
                <ShieldCheck size={16} className="inline mr-1" /> Admin
              </Link>
            </li>
          )}
        </ul>
      </div>

      {/* Right Side */}
      <div className="navbar-end gap-3">
        {user ? (
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/20">
              <div className="w-6 h-6 bg-gradient-to-br from-violet-400 to-purple-600 rounded-full flex items-center justify-center text-xs text-white font-bold">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-white text-sm font-medium">{user.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="btn btn-sm bg-white/10 hover:bg-red-500/30 text-white border border-white/20 py-4.5 rounded-xl transition-all"
            >
              <LogOut size={18} />   Logout
            </button>
          </div>
        ) : (
          <Link to="/login" className="btn btn-sm bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white border-0 rounded-xl shadow-md shadow-violet-900/50">
            <LogIn size={18} />  Login
          </Link>
        )}
      </div>

    </div>
  )
}

export default Navbar