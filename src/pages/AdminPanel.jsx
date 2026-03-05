import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, FileText, Trash2, LayoutDashboard, ShieldCheck, TrendingUp } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const BASE_URL = "http://localhost:8080/api/admin"

function AdminPanel() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [stats, setStats] = useState({})
  const [users, setUsers] = useState([])
  const [posts, setPosts] = useState([])
  const navigate = useNavigate()

  const user = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/')
      return
    }
    fetchStats()
    fetchUsers()
    fetchPosts()
  }, [])

  const fetchStats = async () => {
    const res = await fetch(`${BASE_URL}/stats`)
    const data = await res.json()
    setStats(data)
  }

  const fetchUsers = async () => {
    const res = await fetch(`${BASE_URL}/users`)
    const data = await res.json()
    setUsers(data)
  }

  const fetchPosts = async () => {
    const res = await fetch(`${BASE_URL}/posts`)
    const data = await res.json()
    setPosts(data)
  }

  const deleteUser = async (id) => {
    if (!confirm('এই user কে delete করবেন?')) return
    await fetch(`${BASE_URL}/users/${id}`, { method: 'DELETE' })
    fetchUsers()
    fetchStats()
  }

  const deletePost = async (id) => {
    if (!confirm('এই post টি delete করবেন?')) return
    await fetch(`${BASE_URL}/posts/${id}`, { method: 'DELETE' })
    fetchPosts()
    fetchStats()
  }

  const chartData = [
    { name: 'Doctors', value: stats.totalDoctors ?? 0 },
    { name: 'Patients', value: stats.totalPatients ?? 0 },
    { name: 'Posts', value: stats.totalPosts ?? 0 },
  ]

  const pieData = [
    { name: 'Doctors', value: stats.totalDoctors ?? 0 },
    { name: 'Patients', value: stats.totalPatients ?? 0 },
  ]

  const COLORS = ['#7c3aed', '#4f46e5']

  return (
    <div className="flex min-h-screen">

      {/* Sidebar */}
      <div className="w-64 shrink-0 p-4 flex flex-col gap-2 bg-white/10 backdrop-blur-md border-r border-white/20">
        <div className="flex items-center gap-2 px-3 py-3 mb-2">
          <ShieldCheck size={20} className="text-violet-400" />
          <span className="text-white font-bold text-lg">Admin Panel</span>
        </div>
        <button onClick={() => setActiveTab('dashboard')} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-white ${activeTab === 'dashboard' ? 'bg-white/20 font-bold' : 'hover:bg-white/10'}`}>
          <LayoutDashboard size={18} /> Dashboard
        </button>
        <button onClick={() => setActiveTab('users')} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-white ${activeTab === 'users' ? 'bg-white/20 font-bold' : 'hover:bg-white/10'}`}>
          <Users size={18} /> Users
        </button>
        <button onClick={() => setActiveTab('posts')} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-white ${activeTab === 'posts' ? 'bg-white/20 font-bold' : 'hover:bg-white/10'}`}>
          <FileText size={18} /> Posts
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div>
            <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
              <TrendingUp size={28} /> Overview
            </h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total Users', value: stats.totalUsers, icon: <Users size={24}/>, color: 'from-violet-600 to-purple-700' },
                { label: 'Doctors', value: stats.totalDoctors, icon: <ShieldCheck size={24}/>, color: 'from-purple-600 to-indigo-700' },
                { label: 'Patients', value: stats.totalPatients, icon: <Users size={24}/>, color: 'from-indigo-600 to-violet-700' },
                { label: 'Total Posts', value: stats.totalPosts, icon: <FileText size={24}/>, color: 'from-violet-700 to-purple-600' },
              ].map((stat, i) => (
                <div key={i} className={`bg-gradient-to-br ${stat.color} rounded-2xl p-5 text-white shadow-xl`}>
                  <div className="mb-3 opacity-80">{stat.icon}</div>
                  <div className="text-3xl font-bold">{stat.value ?? 0}</div>
                  <div className="text-sm opacity-70 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Bar Chart */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <TrendingUp size={18}/> Statistics
                </h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                    <YAxis stroke="rgba(255,255,255,0.5)" />
                    <Tooltip contentStyle={{ backgroundColor: '#1e1040', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', color: 'white' }} />
                    <Bar dataKey="value" fill="#7c3aed" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Pie Chart */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <Users size={18}/> User Distribution
                </h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1e1040', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', color: 'white' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
              <Users size={28} /> All Users
            </h1>
            <div className="flex flex-col gap-3">
              {users.map((u) => (
                <div key={u.id} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-violet-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {u.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white font-medium">{u.name}</p>
                      <p className="text-white/50 text-sm">{u.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${u.role === 'doctor' ? 'bg-violet-500/30 text-violet-300' : u.role === 'admin' ? 'bg-yellow-500/30 text-yellow-300' : 'bg-white/10 text-white/60'}`}>
                      {u.role}
                    </span>
                    {u.role !== 'admin' && (
                      <button onClick={() => deleteUser(u.id)} className="text-red-400 hover:text-red-300 hover:bg-red-500/20 p-2 rounded-xl transition-all">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Posts Tab */}
        {activeTab === 'posts' && (
          <div>
            <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
              <FileText size={28} /> All Posts
            </h1>
            <div className="flex flex-col gap-3">
              {posts.map((post) => (
                <div key={post.id} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">{post.title}</p>
                    <p className="text-white/50 text-sm">✍️ {post.authorName}</p>
                  </div>
                  <button onClick={() => deletePost(post.id)} className="text-red-400 hover:text-red-300 hover:bg-red-500/20 p-2 rounded-xl transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default AdminPanel