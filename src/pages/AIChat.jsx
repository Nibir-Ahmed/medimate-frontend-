import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { analyzeSymptoms } from '../services/groq'
import { ArrowRight, Lock, Stethoscope } from 'lucide-react'
import { Camera, PenLine, Search } from 'lucide-react'
function AIChat() {
  const [symptoms, setSymptoms] = useState('')
  const [image, setImage] = useState(null)
  const [imageBase64, setImageBase64] = useState(null)
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImage(URL.createObjectURL(file))
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result.split(',')[1]
      setImageBase64(base64)
    }
    reader.readAsDataURL(file)
  }

  const handleAnalyze = async () => {
    if (!symptoms && !imageBase64) return
    setLoading(true)
    setResponse('')
    try {
      const result = await analyzeSymptoms(symptoms, imageBase64)
      setResponse(result)
    } catch (err) {
      setResponse('কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।')
    }
    setLoading(false)
  }

  const handleReset = () => {
    setSymptoms('')
    setImage(null)
    setImageBase64(null)
    setResponse('')
  }
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="text-6xl"><Lock></Lock></div>
        <h2 className="text-2xl font-bold text-white">Login করুন</h2>
        <p className="text-white/60">AI Chat use করতে আগে login করতে হবে</p>
        <button
          onClick={() => navigate('/login')}
          className="bg-gradient-to-r from-violet-600 to-purple-600 text-white px-6 py-3 rounded-2xl font-semibold"
        >
          <span className='flex items-center'>Login করুন <ArrowRight className='ml-1.5' size={18}></ArrowRight></span>
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-950 via-purple-900 to-indigo-900 p-6">

      {/* Header */}
      <div className="max-w-3xl mx-auto mb-8 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-4">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          <span className="text-white/80 text-sm">AI Assistant সক্রিয়</span>
        </div>
        <h1 className="text-4xl font-bold text-white mb-2"><span className='flex items-center justify-center'><Stethoscope className='mr-1.5' size={28}/> MediMate AI</span></h1>
        <p className="text-white/60">আপনার symptoms বা ছবি দিন, AI তাৎক্ষণিক পরামর্শ দেবে</p>
      </div>

      {/* How to use */}
      {!response && !loading && (
        <div className="max-w-3xl mx-auto mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { icon: <Camera size={28} />, title: 'ছবি দিন', desc: 'আক্রান্ত স্থানের ছবি upload করুন' },
            { icon: <PenLine size={28} />, title: 'Symptoms লিখুন', desc: 'আপনার সমস্যা বাংলায় লিখুন' },
            { icon: <Search size={28} />, title: 'AI বিশ্লেষণ', desc: 'তাৎক্ষণিক পরামর্শ পান' },
          ].map((step, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center border border-white/20">
              <div className="mb-2 flex justify-center text-white">{step.icon}</div>
              <div className="text-white font-semibold text-sm">{step.title}</div>
              <div className="text-white/50 text-xs mt-1">{step.desc}</div>
            </div>
          ))}
        </div>
      )}

      {/* Main Card */}
      <div className="max-w-3xl mx-auto">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl p-6">

          {/* Image Upload */}
          {!image ? (
            <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-white/30 rounded-2xl cursor-pointer hover:border-violet-400 hover:bg-white/5 transition-all mb-4">
              <div className="text-4xl mb-2"><Camera size={28} /></div>
              <p className="text-white/70 text-sm">ছবি upload করতে click করুন</p>
              <p className="text-white/40 text-xs mt-1">JPG, PNG সাপোর্টেড</p>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          ) : (
            <div className="relative mb-4">
              <img src={image} alt="uploaded" className="rounded-2xl w-full max-h-56 object-contain bg-black/20" />
              <button
                onClick={() => { setImage(null); setImageBase64(null) }}
                className="absolute top-2 right-2 btn btn-circle btn-sm bg-red-500 border-0 text-white"
              >✕</button>
            </div>
          )}

          {/* Symptoms Input */}
          <div className="relative mb-4">
            <textarea
              className="w-full bg-white/10 border border-white/20 rounded-2xl p-4 text-white placeholder-white/40 resize-none h-28 focus:outline-none focus:border-violet-400 transition-all"
              placeholder="আপনার symptoms বলুন... যেমন: মাথাব্যথা, জ্বর, বুকে ব্যথা, দুর্বলতা..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold py-3 rounded-2xl transition-all shadow-lg shadow-violet-900/50 disabled:opacity-50"
              onClick={handleAnalyze}
              disabled={loading || (!symptoms && !imageBase64)}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="loading loading-spinner loading-sm"></span>
                  AI বিশ্লেষণ করছে...
                </span>
              ) : <span className='flex items-center justify-center'><Search className='mr-1.5' size={18}/>AI দিয়ে বিশ্লেষণ করুন</span>}
            </button>
            {(symptoms || image) && (
              <button
                onClick={handleReset}
                className="bg-white/10 hover:bg-white/20 text-white px-4 rounded-2xl transition-all"
              >
                🔄
              </button>
            )}
          </div>
        </div>

        {/* AI Response */}
        {response && (
          <div className="mt-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-xl">🩺</div>
              <div>
                <div className="text-white font-semibold">MediMate AI</div>
                <div className="text-white/50 text-xs">AI এর পরামর্শ</div>
              </div>
            </div>
            <div className="text-white/90 whitespace-pre-line leading-relaxed">
              {response}
            </div>
            <div className="mt-4 flex items-start gap-2 bg-yellow-500/20 border border-yellow-500/30 rounded-2xl p-3">
              <span className="text-yellow-400 text-lg">⚠️</span>
              <p className="text-yellow-200/80 text-sm">এটি শুধু প্রাথমিক পরামর্শ। সঠিক চিকিৎসার জন্য অবশ্যই ডাক্তার দেখান।</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AIChat