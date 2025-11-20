import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function FloatingField({ label, type = 'text', value, onChange, onFocus, onBlur, onKeyDown }) {
  const isFilled = value !== undefined && value !== null && String(value).length > 0
  return (
    <div className="relative">
      <input
        type={type}
        className={`peer w-full rounded-xl border border-slate-200 px-3 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-teal${type === 'month' ? ` tj-month ${!isFilled ? 'tj-month-empty' : ''}` : ''}`}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
      />
      <label
        className={
          `${isFilled
            ? 'absolute -top-3 left-3 z-10 text-xs text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200'
            : 'absolute top-3 left-3 z-10 text-slate-500'}
           pointer-events-none transition-all
           peer-focus:-top-3 peer-focus:text-xs peer-focus:text-teal peer-focus:bg-white peer-focus:px-2 peer-focus:py-0.5 peer-focus:rounded-md peer-focus:border peer-focus:border-teal/40`
        }
      >
        {label}
      </label>
    </div>
  )
}

export default function PlanTrip() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  // Screen 1 fields
  const [tripName, setTripName] = useState('')
  const [tripDestination, setTripDestination] = useState('')
  const [destPredictions, setDestPredictions] = useState([])
  const [destPlaceId, setDestPlaceId] = useState('')
  const [showDestSuggestions, setShowDestSuggestions] = useState(false)
  const [destError, setDestError] = useState('')
  const [placesReady, setPlacesReady] = useState(false)
  const [sessionToken, setSessionToken] = useState(null)
  const [image, setImage] = useState('')
  const [durationDays, setDurationDays] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiPlan, setAiPlan] = useState(null)
  const [aiOpen, setAiOpen] = useState(false)

  // Local mock dataset for destinations (used for autocomplete now)
  const mockDestinations = [
    'Agra', 'Ahmedabad', 'Aizawl', 'Ajmer', 'Alleppey', 'Almora', 'Ambala', 'Amritsar', 'Anand', 'Andaman', 'Aurangabad',
    'Badami', 'Bagdogra', 'Bangalore', 'Balurghat', 'Bandhavgarh', 'Bareilly', 'Bastar', 'Bathinda', 'Beed', 'Belgaum',
    'Bellary', 'Bengaluru', 'Berhampore', 'Betul', 'Bhadrachalam', 'Bhandardara', 'Bharatpur', 'Bharuch', 'Bhatinda',
    'Bhavnagar', 'Bhilai', 'Bhilwara', 'Bhimtal', 'Bhopal', 'Bhubaneswar', 'Bhuj', 'Bidar', 'Bilaspur', 'Bodhgaya',
    'Bokaro', 'Bomdila', 'Bundi', 'Calangute', 'Calicut', 'Chail', 'Chamba', 'Chamoli', 'Chandigarh', 'Chandrapur',
    'Chennai', 'Cherrapunji', 'Chikmagalur', 'Chiplun', 'Chitradurga', 'Coimbatore', 'Coonoor', 'Coorg', 'Cuttack',
    'Dalhousie', 'Daman', 'Darbhanga', 'Darjeeling', 'Dausa', 'Dehradun', 'Delhi', 'Dhanaulti', 'Dhanbad', 'Dharamkot',
    'Dharamshala', 'Dharwad', 'Dholavira', 'Digha', 'Dimapur', 'Dindigul', 'Dispur', 'Diu', 'Doda', 'Dooars', 'Durgapur',
    'Dwarka', 'Ernakulam', 'Erode', 'Fatehpur Sikri', 'Gangotri', 'Gangtok', 'Ganjam', 'Gaya', 'Gokarna', 'Golconda',
    'Gorakhpur', 'Gulbarga', 'Guna', 'Guntur', 'Gurgaon', 'Guwahati', 'Gwalior', 'Hampi', 'Hanumangarh', 'Hassan',
    'Haridwar', 'Hazaribagh', 'Himachal Pradesh', 'Hosur', 'Hubli', 'Hyderabad', 'Imphal', 'Indore', 'Itanagar',
    'Jabalpur', 'Jaipur', 'Jaisalmer', 'Jalandhar', 'Jammu', 'Jamshedpur', 'Jodhpur', 'Junagadh', 'Kailash Mansarovar',
    'Kakinada', 'Kalimpong', 'Kanchipuram', 'Kanha National Park', 'Kanpur', 'Kanyakumari', 'Kargil', 'Karjat', 'Karur',
    'Kasol', 'Kasauli', 'Kathmandu', 'Kaziranga', 'Kedarnath', 'Keoladeo National Park', 'Khajuraho', 'Khandala',
    'Khimsar', 'Kodaikanal', 'Kohima', 'Kollam', 'Konark', 'Kongthong', 'Kota', 'Kottayam', 'Kovalam', 'Kozhikode',
    'Kullu', 'Kumaon', 'Kurukshetra', 'Kurseong', 'Lakshadweep', 'Lansdowne', 'Leh', 'Lepchajagat', 'Lonavala',
    'Lucknow', 'Ludhiana', 'Madgaon', 'Madurai', 'Mahabalipuram', 'Mahabaleshwar', 'Malappuram', 'Malpe', 'Malshej Ghat',
    'Manali', 'Mangalore', 'Manipal', 'Matheran', 'Mathura', 'Meghalaya', 'Mirzapur', 'Mokokchung', 'Moradabad',
    'Mount Abu', 'Mumbai', 'Munnar', 'Murudeshwar', 'Mussoorie', 'Mysore', 'Nagaland', 'Nagapattinam', 'Nagpur',
    'Nainital', 'Nalbari', 'Namchi', 'Nanded', 'Nashik', 'Navi Mumbai', 'Nellore', 'Noida', 'Ooty', 'Orchha', 'Palakkad',
    'Panchgani', 'Panipat', 'Panjim', 'Parwanoo', 'Patiala', 'Patna', 'Pelling', 'Phalodi', 'Phuket', 'Pondicherry',
    'Porbandar', 'Port Blair', 'Prayagraj', 'Pune', 'Puri', 'Pushkar', 'Raichur', 'Raigad', 'Raipur', 'Rajahmundry',
    'Rajgir', 'Rajkot', 'Rameswaram', 'Ranchi', 'Ranikhet', 'Ranthambore', 'Ras Al Khaimah', 'Ratnagiri', 'Rewa',
    'Rishikesh', 'Ropar', 'Rourkela', 'Sabarimala', 'Sagar Island', 'Salem', 'Sambalpur', 'Sanchi', 'Sangli', 'Saputara',
    'Sasaram', 'Satara', 'Shillong', 'Shimla', 'Shirdi', 'Silchar', 'Siliguri', 'Silvassa', 'Sindhudurg', 'Sirsi',
    'Sivasagar', 'Solan', 'Solapur', 'Somnath', 'Sonamarg', 'Srinagar', 'Surat', 'Tajpur', 'Tambaram', 'Tezpur',
    'Thanjavur', 'Thiruvananthapuram', 'Thrissur', 'Tinsukia', 'Tiruchirapalli', 'Tirunelveli', 'Tirupati', 'Tiruvannamalai',
    'Tura', 'Tuticorin', 'Udaipur', 'Udhampur', 'Udupi', 'Ujjain', 'Una', 'Vadodara', 'Valsad', 'Varanasi', 'Varkala',
    'Vellore', 'Veraval', 'Vidisha', 'Vijayawada', 'Visakhapatnam', 'Vrindavan', 'Wayanad', 'Warangal', 'Wardha',
    'Yelagiri', 'Yercaud', 'Ziro Valley',  'Auli', 'Bir Billing', 'Spiti Valley', 'Chopta', 'Tawang', 'Zanskar Valley', 'Sandakphu', 'Kufri', 'Araku Valley',
    'Valley of Flowers', 'Gulmarg', 'Bhandardara', 'Devikulam', 'Dandeli', 'Chilika Lake', 'Bhutan Border Trek',
    'Sundarbans', 'Gir National Park', 'Corbett National Park', 'Pench National Park', 'Tadoba', 'Sattal', 'Bhimtal',
    'Tehri', 'Har Ki Dun', 'Triund', 'Kheerganga', 'Roopkund', 'Hampta Pass', 'Chandrashila', 'Kuari Pass', 'Nubra Valley',
    'Markha Valley', 'Spangmik', 'Pangong', 'Tso Moriri', 'Khimsar Dunes', 'Barmer', 'Jawai Leopard Reserve',
    'Bharatpur Bird Sanctuary', 'Kutch', 'Mandvi Beach', 'Murud Beach', 'Alibaug', 'Ganpatipule', 'Varkala Beach',
    'Bekal', 'Marari', 'Kumarakom', 'Poovar', 'Wayanad', 'Agumbe', 'Kabini', 'BR Hills', 'Sakleshpur', 'Sringeri',
    'Chikmagalur', 'Coorg', 'Nagarhole', 'Hampi', 'Badami', 'Bidar Fort', 'Bijapur', 'Pattadakal', 'Belur', 'Halebidu',
    'Gokarna', 'Karwar', 'Murdeshwar', 'Rameswaram', 'Dhanushkodi', 'Kanchipuram', 'Chettinad', 'Thanjavur',
    'Madurai', 'Ramanathapuram', 'Yercaud', 'Kolli Hills', 'Valparai', 'Pollachi', 'Idukki', 'Munnar', 'Vagamon',
    'Thenmala', 'Trivandrum', 'Kovalam', 'Alleppey', 'Varkala', 'Thrissur', 'Palakkad', 'Kozhikode', 'Wayanad',
    'Kannur', 'Kasargod', 'Lakshadweep', 'Port Blair', 'Havelock Island', 'Neil Island', 'Baratang', 'Chidiya Tapu',
    'Long Island', 'Rangat', 'Diglipur', 'Mayabunder', 'Nicobar', 'Great Nicobar Island', 'Goa'
  ]

  const slugify = (s) => String(s).trim().toLowerCase().replace(/\s+/g, '-')

  // Remove redundant places (exact string duplicates, keep insertion order)
  const mockDestinationsUnique = useMemo(
    () => Array.from(new Set(mockDestinations.map((s) => String(s).trim()).filter(Boolean))),
    []
  )

  const ensurePlacesLoaded = async () => {
    if (window.google && window.google.maps && window.google.maps.places) { setPlacesReady(true); return }
    const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    if (!key) { setPlacesReady(false); return }
    await new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-google="places"]')
      if (existing) { existing.addEventListener('load', resolve); existing.addEventListener('error', reject); return }
      const s = document.createElement('script')
      s.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places&language=en&region=IN`
      s.async = true
      s.defer = true
      s.dataset.google = 'places'
      s.onload = resolve
      s.onerror = reject
      document.head.appendChild(s)
    }).catch(() => {})
    setPlacesReady(!!(window.google && window.google.maps && window.google.maps.places))
  }

  const aiMeta = {
    'Goa': { budget: 60000, days: 4, label: 'Top Pick' },
    'Gokarna': { budget: 40000, days: 4, label: 'Budget-Friendly' },
    'Golden Temple': { budget: 36000, days: 3, label: 'Trending Destination' },
    'Jaipur': { budget: 42000, days: 3, label: 'Top Pick' },
    'Manali': { budget: 56000, days: 5, label: 'Trending Destination' },
    'Kerala': { budget: 70000, days: 6, label: 'Top Pick' },
    'Ladakh': { budget: 110000, days: 7, label: 'Trending Destination' },
    'Andaman': { budget: 100000, days: 6, label: 'Top Pick' },
    'Phuket': { budget: 120000, days: 5, label: 'Trending Destination' },
    'Dubai': { budget: 140000, days: 5, label: 'Trending Destination' },
    'Singapore': { budget: 130000, days: 4, label: 'Top Pick' },
    'Bali': { budget: 136000, days: 6, label: 'Top Pick' },
    'Kedarnath': { budget: 50000, days: 4, label: 'Budget-Friendly' },
    'Kashmir': { budget: 80000, days: 6, label: 'Top Pick' },
    'Darjeeling': { budget: 48000, days: 4, label: 'Budget-Friendly' },
    'Ooty': { budget: 44000, days: 3, label: 'Budget-Friendly' },
    'Coorg': { budget: 46000, days: 3, label: 'Budget-Friendly' },
    'Munnar': { budget: 52000, days: 4, label: 'Trending Destination' },
    'Rishikesh': { budget: 40000, days: 3, label: 'Budget-Friendly' },
    'Hampi': { budget: 42000, days: 3, label: 'Budget-Friendly' },
    'Varanasi': { budget: 40000, days: 3, label: 'Trending Destination' },
    'Agra': { budget: 36000, days: 2, label: 'Budget-Friendly' },
    'Delhi': { budget: 44000, days: 3, label: 'Trending Destination' },
    'Mumbai': { budget: 50000, days: 3, label: 'Trending Destination' },
  }
  const aiLabels = ['Top Pick', 'Trending Destination', 'Budget-Friendly']
  const queryDestinations = async (q) => {
    const term = String(q || '').trim().toLowerCase()
    if (!term) { setDestPredictions([]); setShowDestSuggestions(false); setDestError(''); return }
    const base = mockDestinationsUnique.filter((d) => d.toLowerCase().includes(term))
    const top5 = base.slice(0, 5)
    const mapped = top5.map((d, i) => {
      const meta = aiMeta[d] || {}
      const label = meta.label || aiLabels[i % aiLabels.length]
      const budget = meta.budget || (d.length > 6 ? 56000 : 44000)
      const days = meta.days || (d.length > 6 ? 5 : 3)
      return { name: d, label, budget, days, place_id: 'mock:' + slugify(d) }
    })
    if (mapped.length) {
      setDestPredictions(mapped)
      setDestError('')
    } else {
      const pool = mockDestinationsUnique.slice().sort(() => Math.random() - 0.5)
      const random3 = pool.slice(0, 3).map((d, i) => ({ name: d, label: aiLabels[i % aiLabels.length], budget: (d.length > 6 ? 56000 : 44000), days: (d.length > 6 ? 5 : 3), place_id: 'mock:' + slugify(d) }))
      setDestPredictions(random3)
      setDestError('No exact matches — here are smart recommendations')
    }
    setShowDestSuggestions(true)
  }

  const onDestInputChange = (e) => {
    const val = e.target.value
    setTripDestination(val)
    setDestPlaceId('')
    queryDestinations(val)
  }

  const onSelectPrediction = (p) => {
    setTripDestination(p.description || '')
    setDestPlaceId(p.place_id || '')
    setDestPredictions([])
    setShowDestSuggestions(false)
    setDestError('')
    // End the session when a prediction is selected
    setSessionToken(null)
  }
  const [budget, setBudget] = useState('')
  const [date, setDate] = useState('')
  const [members, setMembers] = useState('')

  const perPerson = useMemo(() => {
    const b = parseInt(budget || '0', 10)
    const m = parseInt(members || '2', 10) // default to 2 if empty
    return m > 0 ? Math.round(b / m) : 0
  }, [budget, members])

  const minMonthly = useMemo(() => {
    const total = parseInt(budget || '0', 10)
    const m = parseInt(members || '2', 10)
    if (!date) return 0
    const dest = new Date(date)
    const destYear = dest.getFullYear()
    const destMonth = dest.getMonth() + 1 // 1-12
    const now = new Date()
    const curYear = now.getFullYear()
    const curMonth = now.getMonth() + 1 // 1-12
    const monthsRemaining = (destMonth + 12 * destYear) - (curMonth + 12 * curYear)
    if (monthsRemaining <= 0) return total // if target is current/past month, need full amount
    const denom = Math.max(1, m) * monthsRemaining
    return Math.ceil(total / denom)
  }, [budget, date, members])

  // Screen 2 state
  const [joined, setJoined] = useState(0)
  const totalMembers = parseInt(members || '2', 10)
  const joinPercent = Math.min(100, Math.round((joined / Math.max(1, totalMembers)) * 100))

  const inviteUrl = 'https://tripjar.app/invite/broken-link'
  const [copiedInvite, setCopiedInvite] = useState(false)
  const shareWhatsAppInvite = () => {
    setJoined((j) => Math.min(totalMembers, j + 1))
    const url = 'https://wa.me/?text=' + encodeURIComponent(inviteUrl)
    window.open(url, '_blank')
  }
  const shareInstagramInvite = () => {
    setJoined((j) => Math.min(totalMembers, j + 1))
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(inviteUrl).finally(() => {
        window.open('https://www.instagram.com/', '_blank')
      })
    } else {
      window.open('https://www.instagram.com/', '_blank')
    }
  }

  const copyInviteLink = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(inviteUrl).then(() => {
        setCopiedInvite(true)
        setTimeout(() => setCopiedInvite(false), 1500)
      })
    }
  }

  const createGroup = () => {
    if (!tripName?.trim() || !destPlaceId || !date) return
    const stored = JSON.parse(localStorage.getItem('tripjar.groups') || '[]')
    const id = 'grp_' + Math.random().toString(36).slice(2, 9)
    const newGroup = {
      id,
      name: tripName.trim(),
      destination: tripDestination.trim(),
      placeId: destPlaceId,
      current: 0,
      target: parseInt(budget || '0', 10) || 0,
      membersCount: parseInt(members || '2', 10) || 2,
      image,
      minMonthly: parseInt(minMonthly || '0', 10) || 0,
      date,
    }
    localStorage.setItem('tripjar.groups', JSON.stringify([newGroup, ...stored]))
    // Notify app-wide listeners that data changed
    window.dispatchEvent(new Event('tripjar:dataUpdated'))
    navigate('/groups')
  }

  return (
    <div className="min-h-screen pb-24">
      <header className="flex items-center gap-3 px-5 pt-6 slide-up">
        <button aria-label="Back" onClick={() => navigate(-1)} className="card p-2 bounce-soft">←</button>
        <h1 className="text-lg font-semibold">Plan a trip together! 🚀</h1>
      </header>

      {step === 1 && (
        <section className="px-5 mt-5">
          <div className="card p-5 slide-up relative overflow-hidden">
            <div className="grid gap-4 pt-3">
              <FloatingField label="Group Name" value={tripName} onChange={(e) => setTripName(e.target.value)} />
              <div className="relative">
                <FloatingField
                  label="Trip Destination"
                  value={tripDestination}
                  onChange={onDestInputChange}
                  onFocus={() => setShowDestSuggestions(destPredictions.length > 0)}
                />
                {showDestSuggestions && (
                  <div className="absolute left-0 right-0 mt-1 rounded-xl border border-slate-200 bg-white shadow-soft max-h-64 overflow-auto z-20">
                    {destError && <div className="px-3 pt-2 text-xs text-slate-500">{destError}</div>}
                    <div className="grid gap-2 p-2">
                      {destPredictions.map((p, idx) => (
                        <button
                          key={p.place_id}
                          onClick={() => {
                            setTripDestination(p.name || '')
                            setDestPlaceId(p.place_id || '')
                            setBudget(String(p.budget || ''))
                            setDurationDays(String(p.days || ''))
                            setDestPredictions([])
                            setShowDestSuggestions(false)
                            setDestError('')
                            setSessionToken(null)
                          }}
                          className="text-left"
                        >
                          <div className="ai-shimmer rounded-lg border border-slate-200 p-3 bg-white">
                            <div className="flex items-center justify-between">
                              <div className="font-semibold">{p.name}</div>
                              <div className="text-xs px-2 py-0.5 rounded-full bg-teal/10 text-teal">{p.label}</div>
                            </div>
                            <div className="mt-1 text-xs text-slate-600">Suggested budget ₹{Number(p.budget || 0).toLocaleString('en-IN')} • {p.days} days</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <FloatingField label="Total budget (₹)" value={budget} onChange={(e) => setBudget(e.target.value.replace(/[^0-9]/g, ''))} />
              {(function(){
                const total = parseInt(budget || '0', 10)
                const d = date
                if (!d || total <= 0) return null
                const dest = new Date(d)
                const destYear = dest.getFullYear()
                const destMonth = dest.getMonth() + 1
                const now = new Date()
                const curYear = now.getFullYear()
                const curMonth = now.getMonth() + 1
                const months = (destMonth + 12 * destYear) - (curMonth + 12 * curYear)
                if (months <= 0) return null
                const recommendedMonthly = Math.ceil(total / months)
                const recommendedWeekly = Math.ceil(recommendedMonthly / 4)
                const recommendedDaily = Math.ceil(recommendedMonthly / 30)
                let tone = 'green'
                let warning = 'Great choice! Your current plan is financially stable.'
                if (months < 2 && total >= 100000) { tone = 'red'; warning = 'This trip requires aggressive saving — consider increasing your timeline' }
                else if (months <= 3) { tone = 'yellow'; warning = 'Timeline is tight. Stay disciplined to meet the goal.' }
                const boxClass = tone === 'green' ? 'border-green-200 bg-green-50' : tone === 'yellow' ? 'border-yellow-200 bg-yellow-50' : 'border-red-200 bg-red-50'
                const warnClass = tone === 'green' ? 'text-green-700' : tone === 'yellow' ? 'text-yellow-700' : 'text-red-700'
                return (
                  <div className={`rounded-xl border p-3 mt-1 ${boxClass}`}>
                    <div className="text-xs text-slate-600">Based on your travel goal, here's a smart saving plan:</div>
                    <div className="mt-1 text-sm">Save ₹{recommendedMonthly.toLocaleString('en-IN')} per month</div>
                    <div className="text-sm">To stay on track, save ₹{recommendedWeekly.toLocaleString('en-IN')} per week</div>
                    <div className="text-sm">Or ₹{recommendedDaily.toLocaleString('en-IN')} per day</div>
                    <div className={`mt-1 text-xs ${warnClass}`}>{warning}</div>
                  </div>
                )
              })()}
              <div className="grid gap-2">
                <div className="text-sm text-slate-700">Trip Picture</div>
                {image && (
                  <img src={image} alt="Group Trip" className="w-full h-40 object-cover rounded-xl border border-slate-200" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    const reader = new FileReader()
                    reader.onload = () => setImage(String(reader.result || ''))
                    reader.readAsDataURL(file)
                  }}
                  className="rounded-xl border border-slate-200 px-3 py-2 bg-white w-full"
                />
              </div>
              <FloatingField label="Month" type="month" value={date ? date.slice(0,7) : ''} onChange={(e) => setDate(e.target.value + '-01')} />
              <FloatingField label="Trip Duration (days)" value={durationDays} onChange={(e) => setDurationDays(e.target.value.replace(/[^0-9]/g, ''))} />
              <FloatingField label="Expected members" value={members} onChange={(e) => setMembers(e.target.value.replace(/[^0-9]/g, ''))} />
              <FloatingField label="Minimum monthly save (₹)" value={String(minMonthly)} onChange={() => {}} />

              <p className="text-sm text-slate-700">Each needs to save <span className="font-semibold">₹{perPerson.toLocaleString('en-IN')}</span></p>

              <div className="flex items-center gap-3">
                <button onClick={handleGenerate} className="bounce-soft bg-gradient-to-r from-teal to-orange text-white rounded-full px-4 py-2 shadow-soft font-semibold">Generate Trip Plan (AI)</button>
                {aiLoading && <div className="text-xs text-slate-600">Analyzing your inputs…</div>}
              </div>
              {aiOpen && (
                <div className="ai-glow p-[1px] rounded-xl bg-gradient-to-r from-teal to-orange">
                  <div className="rounded-xl bg-white p-4">
                    <button onClick={() => setAiOpen(!aiOpen)} className="text-sm font-semibold">{aiOpen ? 'Collapse' : 'Expand'}</button>
                    {aiLoading && (
                      <div className="mt-2 grid gap-2">
                        <div className="ai-bar" />
                        <div className="text-xs text-slate-600">AI Analyzing…</div>
                        <div className="ai-shimmer h-4 rounded bg-slate-100" />
                        <div className="ai-shimmer h-4 rounded bg-slate-100" />
                        <div className="ai-shimmer h-4 rounded bg-slate-100" />
                      </div>
                    )}
                    {!aiLoading && aiPlan && (
                      <div className="mt-2 grid gap-2">
                        <div className="text-sm">{aiIntroTyped}<span className="typing-cursor">|</span></div>
                        <div className="text-sm">Suggested budget: ₹{aiPlan.budgetLow.toLocaleString('en-IN')} – ₹{aiPlan.budgetHigh.toLocaleString('en-IN')}</div>
                        <div className="text-sm">Best time to visit: {aiPlan.bestTimeText}</div>
                        <div className="text-sm">Recommended duration: {aiPlan.duration} days</div>
                        <div className="mt-2">
                          {aiPlan.itinerary.map((line, idx) => (
                            <div key={idx} className="text-sm">{line}</div>
                          ))}
                        </div>
                        <div className="mt-2 text-sm">Savings plan: Monthly ₹{aiPlan.savings.monthly.toLocaleString('en-IN')} • Weekly ₹{aiPlan.savings.weekly.toLocaleString('en-IN')} • Daily ₹{aiPlan.savings.daily.toLocaleString('en-IN')}</div>
                        <div className="mt-1 text-sm text-teal">{aiPlan.tip}</div>
                        <div className="mt-3 flex items-center gap-3">
                          <button
                            onClick={() => {
                              setBudget(String(aiPlan.budgetHigh))
                              setDurationDays(String(aiPlan.duration))
                              setDate(aiPlan.recommendedDate)
                            }}
                            className="bounce-soft bg-teal-sky text-white rounded-full px-4 py-2 shadow-soft font-semibold"
                          >
                            Apply to Form
                          </button>
                          <button onClick={handleGenerate} className="text-teal font-semibold">Regenerate</button>
                        </div>
                        <div className="mt-3">
                          <button onClick={() => setAiInsightsOpen(v => !v)} className="text-sm font-semibold">AI Insights</button>
                          {aiInsightsOpen && (
                            <div className="mt-2 grid gap-1">
                              <div className="text-xs text-slate-600">You're just one step away from planning the perfect trip!</div>
                              {String(tripDestination).toLowerCase().includes('goa') && (
                                <div className="text-xs text-teal">Great choice — Goa trips cost 20–40% less off-season!</div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <button
                onClick={() => setStep(2)}
                disabled={!tripName?.trim() || !destPlaceId || !date}
                className={`mt-2 bounce-soft bg-gradient-to-r from-orange to-teal text-white rounded-full px-4 py-3 shadow-soft font-semibold ${(!tripName?.trim() || !destPlaceId || !date) ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                Next: Invite Friends
              </button>
              {(!tripName?.trim() || !destPlaceId || !date) && (
                <p className="text-xs text-red-600 mt-2 break-words">Group Name, a valid Trip Destination (from suggestions), and Month are required.</p>
              )}
            </div>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="px-5 mt-5">
          <div className="card p-5 slide-up relative overflow-hidden">
            <div className="mt-1 flex items-center justify-between">
              <div className="text-sm text-slate-600">Invite friends</div>
              <div className="flex items-center gap-2">
                <button onClick={shareWhatsAppInvite} aria-label="Share on WhatsApp" title="Share on WhatsApp" className="bounce-soft rounded-full h-10 w-10 flex items-center justify-center shadow-soft" style={{ backgroundColor: '#25D366' }}>
                  <img alt="WhatsApp" src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/whatsapp.svg" className="w-5 h-5 filter invert" />
                </button>
                <button onClick={shareInstagramInvite} aria-label="Share on Instagram" title="Share on Instagram" className="bounce-soft rounded-full h-10 w-10 flex items-center justify-center shadow-soft bg-gradient-to-br from-pink-500 via-orange-400 to-purple-500">
                  <img alt="Instagram" src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/instagram.svg" className="w-5 h-5 filter invert" />
                </button>
              </div>
            </div>

            <button onClick={copyInviteLink} className="mt-3 w-full text-left">
              <div className="rounded-xl border-2 border-dashed border-slate-300 p-4 bg-white overflow-hidden">
                <div className="text-sm text-slate-600">Invite link</div>
                <div className="text-sm font-mono break-all">{inviteUrl}</div>
                <div className="mt-1 text-xs text-slate-500">Tap to copy invite link</div>
              </div>
            </button>
            {copiedInvite && <div className="mt-2 text-xs text-teal">Copied!</div>}

            <div className="mt-4">
              <div className="text-sm text-slate-700 mb-1">{joined} / {totalMembers} joined</div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div style={{ width: joinPercent + '%' }} className="h-2 rounded-full bg-gradient-to-r from-teal to-orange transition-[width] duration-700" />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-4">
              <button
                onClick={createGroup}
                disabled={!tripName?.trim() || !destPlaceId || !date}
                className={`bounce-soft bg-gradient-to-r from-teal to-orange text-white rounded-full px-4 py-2 shadow-soft font-semibold ${(!tripName?.trim() || !destPlaceId || !date) ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                Create Group
              </button>
              <button
                onClick={createGroup}
                disabled={!tripName?.trim() || !destPlaceId || !date}
                className={`text-teal font-semibold ${(!tripName?.trim() || !destPlaceId || !date) ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                Create and invite later
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
  const bestTimeMap = {
    Goa: '11',
    Manali: '06',
    Ladakh: '07',
    Jaipur: '12',
    Ooty: '10',
    Coorg: '09',
    Munnar: '09',
    Darjeeling: '04',
    Rishikesh: '03',
    Kerala: '12',
    Andaman: '01',
    Kashmir: '08',
  }
  const funPool = ['Beach shack', 'Scenic viewpoint', 'Local cafe', 'Sunrise point', 'Street food lane', 'Museum', 'Boat ride', 'Night market']
  const emojis = ['✨','🌟','🏝️','🏞️','🏔️','🚌','🗺️','🍽️','☕','📸']

  const generatePlan = () => {
    const name = String(tripDestination || '').trim()
    const baseBudget = parseInt(budget || '50000', 10)
    const low = Math.round(baseBudget * 0.8)
    const high = Math.round(baseBudget * 1.2)
    const rand = 1 + ((Math.random() * 0.2) - 0.1)
    const lowAdj = Math.round(low * rand)
    const highAdj = Math.round(high * rand)
    const dur = Math.max(3, Math.min(5, (Math.random() < 0.5 ? 4 : 5)))
    const e1 = emojis[Math.floor(Math.random() * emojis.length)]
    const e2 = emojis[Math.floor(Math.random() * emojis.length)]
    const picks = funPool.sort(() => Math.random() - 0.5).slice(0, 2)
    const now = new Date()
    const year = now.getFullYear()
    const bestMonth = bestTimeMap[name] || '12'
    const recommendedDate = `${year}-${bestMonth}-01`
    const itinerary = new Array(dur).fill(0).map((_, i) => {
      const d = i + 1
      const act = picks[i % picks.length]
      return `Day ${d}: Explore ${name || 'the destination'} • ${act}`
    })
    const months = 6
    const monthly = Math.ceil(highAdj / months)
    const weekly = Math.ceil(monthly / 4)
    const daily = Math.ceil(monthly / 30)
    const intro = `Here’s a personalized plan ${e1}`
    const tip = `Pro Tip: Stay consistent — your group’s savings grow fast ${e2}`
    return {
      intro,
      budgetLow: lowAdj,
      budgetHigh: highAdj,
      bestTimeText: bestMonth === '12' ? 'Oct–Mar' : 'Great in this month',
      duration: dur,
      itinerary,
      savings: { monthly, weekly, daily },
      tip,
      recommendedDate,
    }
  }

  const handleGenerate = () => {
    setAiLoading(true)
    setAiOpen(true)
    setTimeout(() => {
      const plan = generatePlan()
      setAiPlan(plan)
      setAiLoading(false)
    }, 1200)
  }
