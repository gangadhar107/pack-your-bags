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

export default function NewSoloTrip() {
  const navigate = useNavigate()
  const [tripName, setTripName] = useState('')
  const [tripDestination, setTripDestination] = useState('')
  const [destPredictions, setDestPredictions] = useState([])
  const [destPlaceId, setDestPlaceId] = useState('')
  const [showDestSuggestions, setShowDestSuggestions] = useState(false)
  const [destError, setDestError] = useState('')
  const [image, setImage] = useState('')
  const [durationDays, setDurationDays] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiPlan, setAiPlan] = useState(null)
  const [aiOpen, setAiOpen] = useState(false)
  const [aiIntroTyped, setAiIntroTyped] = useState('')
  const [aiInsightsOpen, setAiInsightsOpen] = useState(false)

  const mockDestinations = [
    'Agra','Ahmedabad','Aizawl','Ajmer','Alleppey','Almora','Ambala','Amritsar','Anand','Andaman','Aurangabad','Badami','Bagdogra','Bangalore','Balurghat','Bandhavgarh','Bareilly','Bastar','Bathinda','Beed','Belgaum','Bellary','Bengaluru','Berhampore','Betul','Bhadrachalam','Bhandardara','Bharatpur','Bharuch','Bhatinda','Bhavnagar','Bhilai','Bhilwara','Bhimtal','Bhopal','Bhubaneswar','Bhuj','Bidar','Bilaspur','Bodhgaya','Bokaro','Bomdila','Bundi','Calangute','Calicut','Chail','Chamba','Chamoli','Chandigarh','Chandrapur','Chennai','Cherrapunji','Chikmagalur','Chiplun','Chitradurga','Coimbatore','Coonoor','Coorg','Cuttack','Dalhousie','Daman','Darbhanga','Darjeeling','Dausa','Dehradun','Delhi','Dhanaulti','Dhanbad','Dharamkot','Dharamshala','Dharwad','Dholavira','Digha','Dimapur','Dindigul','Dispur','Diu','Doda','Dooars','Durgapur','Dwarka','Ernakulam','Erode','Fatehpur Sikri','Gangotri','Gangtok','Ganjam','Gaya','Gokarna','Golconda','Gorakhpur','Gulbarga','Guna','Guntur','Gurgaon','Guwahati','Gwalior','Hampi','Hanumangarh','Hassan','Haridwar','Hazaribagh','Himachal Pradesh','Hosur','Hubli','Hyderabad','Imphal','Indore','Itanagar','Jabalpur','Jaipur','Jaisalmer','Jalandhar','Jammu','Jamshedpur','Jodhpur','Junagadh','Kailash Mansarovar','Kakinada','Kalimpong','Kanchipuram','Kanha National Park','Kanpur','Kanyakumari','Kargil','Karjat','Karur','Kasol','Kasauli','Kathmandu','Kaziranga','Kedarnath','Keoladeo National Park','Khajuraho','Khandala','Khimsar','Kodaikanal','Kohima','Kollam','Konark','Kongthong','Kota','Kottayam','Kovalam','Kozhikode','Kullu','Kumaon','Kurukshetra','Kurseong','Lakshadweep','Lansdowne','Leh','Lepchajagat','Lonavala','Lucknow','Ludhiana','Madgaon','Madurai','Mahabalipuram','Mahabaleshwar','Malappuram','Malpe','Malshej Ghat','Manali','Mangalore','Manipal','Matheran','Mathura','Meghalaya','Mirzapur','Mokokchung','Moradabad','Mount Abu','Mumbai','Munnar','Murudeshwar','Mussoorie','Mysore','Nagaland','Nagapattinam','Nagpur','Nainital','Nalbari','Namchi','Nanded','Nashik','Navi Mumbai','Nellore','Noida','Ooty','Orchha','Palakkad','Panchgani','Panipat','Panjim','Parwanoo','Patiala','Patna','Pelling','Phalodi','Phuket','Pondicherry','Porbandar','Port Blair','Prayagraj','Pune','Puri','Pushkar','Raichur','Raigad','Raipur','Rajahmundry','Rajgir','Rajkot','Rameswaram','Ranchi','Ranikhet','Ranthambore','Ras Al Khaimah','Ratnagiri','Rewa','Rishikesh','Ropar','Rourkela','Sabarimala','Sagar Island','Salem','Sambalpur','Sanchi','Sangli','Saputara','Sasaram','Satara','Shillong','Shimla','Shirdi','Silchar','Siliguri','Silvassa','Sindhudurg','Sirsi','Sivasagar','Solan','Solapur','Somnath','Sonamarg','Srinagar','Surat','Tajpur','Tambaram','Tezpur','Thanjavur','Thiruvananthapuram','Thrissur','Tinsukia','Tiruchirapalli','Tirunelveli','Tirupati','Tiruvannamalai','Tura','Tuticorin','Udaipur','Udhampur','Udupi','Ujjain','Una','Vadodara','Valsad','Varanasi','Varkala','Vellore','Veraval','Vidisha','Vijayawada','Visakhapatnam','Vrindavan','Wayanad','Warangal','Wardha','Yelagiri','Yercaud','Ziro Valley','Auli','Bir Billing','Spiti Valley','Chopta','Tawang','Zanskar Valley','Sandakphu','Kufri','Araku Valley','Valley of Flowers','Gulmarg','Bhandardara','Devikulam','Dandeli','Chilika Lake','Bhutan Border Trek','Sundarbans','Gir National Park','Corbett National Park','Pench National Park','Tadoba','Sattal','Bhimtal','Tehri','Har Ki Dun','Triund','Kheerganga','Roopkund','Hampta Pass','Chandrashila','Kuari Pass','Nubra Valley','Markha Valley','Spangmik','Pangong','Tso Moriri','Khimsar Dunes','Barmer','Jawai Leopard Reserve','Bharatpur Bird Sanctuary','Kutch','Mandvi Beach','Murud Beach','Alibaug','Ganpatipule','Varkala Beach','Bekal','Marari','Kumarakom','Poovar','Wayanad','Agumbe','Kabini','BR Hills','Sakleshpur','Sringeri','Chikmagalur','Coorg','Nagarhole','Hampi','Badami','Bidar Fort','Bijapur','Pattadakal','Belur','Halebidu','Gokarna','Karwar','Murdeshwar','Rameswaram','Dhanushkodi','Kanchipuram','Chettinad','Thanjavur','Madurai','Ramanathapuram','Yercaud','Kolli Hills','Valparai','Pollachi','Idukki','Munnar','Vagamon','Thenmala','Trivandrum','Kovalam','Alleppey','Varkala','Thrissur','Palakkad','Kozhikode','Wayanad','Kannur','Kasargod','Lakshadweep','Port Blair','Havelock Island','Neil Island','Baratang','Chidiya Tapu','Long Island','Rangat','Diglipur','Mayabunder','Nicobar','Great Nicobar Island','Goa'
  ]

  const slugify = (s) => String(s).trim().toLowerCase().replace(/\s+/g, '-')
  const mockDestinationsUnique = useMemo(
    () => Array.from(new Set(mockDestinations.map((s) => String(s).trim()).filter(Boolean))),
    []
  )

  const aiMeta = {
    'Goa': { budget: 30000, days: 4, label: 'Top Pick' },
    'Gokarna': { budget: 22000, days: 4, label: 'Budget-Friendly' },
    'Golden Temple': { budget: 18000, days: 3, label: 'Trending Destination' },
    'Jaipur': { budget: 20000, days: 3, label: 'Top Pick' },
    'Manali': { budget: 28000, days: 5, label: 'Trending Destination' },
    'Kerala': { budget: 35000, days: 6, label: 'Top Pick' },
    'Ladakh': { budget: 55000, days: 7, label: 'Trending Destination' },
    'Andaman': { budget: 50000, days: 6, label: 'Top Pick' },
    'Phuket': { budget: 60000, days: 5, label: 'Trending Destination' },
    'Dubai': { budget: 70000, days: 5, label: 'Trending Destination' },
    'Singapore': { budget: 65000, days: 4, label: 'Top Pick' },
    'Bali': { budget: 68000, days: 6, label: 'Top Pick' },
    'Kedarnath': { budget: 25000, days: 4, label: 'Budget-Friendly' },
    'Kashmir': { budget: 40000, days: 6, label: 'Top Pick' },
    'Darjeeling': { budget: 24000, days: 4, label: 'Budget-Friendly' },
    'Ooty': { budget: 22000, days: 3, label: 'Budget-Friendly' },
    'Coorg': { budget: 23000, days: 3, label: 'Budget-Friendly' },
    'Munnar': { budget: 26000, days: 4, label: 'Trending Destination' },
    'Rishikesh': { budget: 20000, days: 3, label: 'Budget-Friendly' },
    'Hampi': { budget: 21000, days: 3, label: 'Budget-Friendly' },
    'Varanasi': { budget: 20000, days: 3, label: 'Trending Destination' },
    'Agra': { budget: 18000, days: 2, label: 'Budget-Friendly' },
    'Delhi': { budget: 22000, days: 3, label: 'Trending Destination' },
    'Mumbai': { budget: 25000, days: 3, label: 'Trending Destination' },
  }
  const aiLabels = ['Top Pick', 'Trending Destination', 'Budget-Friendly']
  const queryDestinations = (q) => {
    const term = String(q || '').trim().toLowerCase()
    if (!term) { setDestPredictions([]); setShowDestSuggestions(false); setDestError(''); return }
    const base = mockDestinationsUnique.filter((d) => d.toLowerCase().includes(term))
    const top5 = base.slice(0, 5)
    const mapped = top5.map((d, i) => {
      const meta = aiMeta[d] || {}
      const label = meta.label || aiLabels[i % aiLabels.length]
      const budget = meta.budget || (d.length > 6 ? 28000 : 22000)
      const days = meta.days || (d.length > 6 ? 5 : 3)
      return { name: d, label, budget, days, place_id: 'mock:' + slugify(d) }
    })
    if (mapped.length) {
      setDestPredictions(mapped)
      setDestError('')
    } else {
      const pool = mockDestinationsUnique.slice().sort(() => Math.random() - 0.5)
      const random3 = pool.slice(0, 3).map((d, i) => ({ name: d, label: aiLabels[i % aiLabels.length], budget: (d.length > 6 ? 28000 : 22000), days: (d.length > 6 ? 5 : 3), place_id: 'mock:' + slugify(d) }))
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

  const [budget, setBudget] = useState('')
  const [date, setDate] = useState('')

  const minMonthly = useMemo(() => {
    const total = parseInt(budget || '0', 10)
    if (!date) return 0
    const dest = new Date(date)
    const destYear = dest.getFullYear()
    const destMonth = dest.getMonth() + 1
    const now = new Date()
    const curYear = now.getFullYear()
    const curMonth = now.getMonth() + 1
    const monthsRemaining = (destMonth + 12 * destYear) - (curMonth + 12 * curYear)
    if (monthsRemaining <= 0) return total
    return Math.ceil(total / Math.max(1, monthsRemaining))
  }, [budget, date])

  const savingsAdvice = useMemo(() => {
    const total = parseInt(budget || '0', 10)
    if (!date || total <= 0) return null
    const dest = new Date(date)
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
    if (months < 2 && total >= 60000) { tone = 'red'; warning = 'This trip requires aggressive saving — consider increasing your timeline' }
    else if (months <= 3) { tone = 'yellow'; warning = 'Timeline is tight. Stay disciplined to meet the goal.' }
    return { months, recommendedMonthly, recommendedWeekly, recommendedDaily, tone, warning }
  }, [budget, date])

  const canCreate = !!tripName.trim() && !!destPlaceId && !!date && (parseInt(budget || '0', 10) > 0)

  const monthNames = ['01','02','03','04','05','06','07','08','09','10','11','12']
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
  const funPool = ['Sunset cafe', 'Hidden viewpoint', 'Local street food', 'River walk', 'Night market', 'Art district', 'Beach shack', 'Tea estate tour']
  const emojis = ['✨','🌟','🏝️','🏞️','🏔️','🚌','🗺️','🍽️','☕','📸']

  const generatePlan = () => {
    const name = String(tripDestination || '').trim()
    const baseBudget = parseInt(budget || '25000', 10)
    const low = Math.round(baseBudget * 0.8)
    const high = Math.round(baseBudget * 1.2)
    const rand = 1 + ((Math.random() * 0.2) - 0.1)
    const lowAdj = Math.round(low * rand)
    const highAdj = Math.round(high * rand)
    const dur = Math.max(3, Math.min(5, (Math.random() < 0.5 ? 3 : 4) + (Math.random() < 0.3 ? 1 : 0)))
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
      return `Day ${d}: Explore ${name || 'the city'} • ${act}`
    })
    const months = 6
    const monthly = Math.ceil(highAdj / months)
    const weekly = Math.ceil(monthly / 4)
    const daily = Math.ceil(monthly / 30)
    const intro = `Here’s a personalized plan ${e1}`
    const tip = `Pro Tip: Small steps daily add up ${e2}`
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

  React.useEffect(() => {
    const s = aiPlan?.intro || ''
    if (!s) { setAiIntroTyped(''); return }
    let i = 0
    setAiIntroTyped('')
    const timer = setInterval(() => {
      i += 1
      setAiIntroTyped(s.slice(0, i))
      if (i >= s.length) clearInterval(timer)
    }, 28)
    return () => clearInterval(timer)
  }, [aiPlan])

  const handleCreate = () => {
    const title = tripName.trim()
    const total = parseInt(budget || '0', 10) || 0
    if (!title || !destPlaceId || !date || total <= 0) return
    const stored = JSON.parse(localStorage.getItem('tripjar.userGoals') || '[]')
    const id = 'goal_' + Math.random().toString(36).slice(2, 9)
    const newGoal = {
      id,
      title,
      current: 0,
      total,
      date,
      destination: tripDestination.trim(),
      placeId: destPlaceId,
      image,
      autoPay: true,
      frequency: 'Monthly',
      intervalAmount: parseInt(minMonthly || '0', 10) || 0,
    }
    localStorage.setItem('tripjar.userGoals', JSON.stringify([newGoal, ...stored]))
    window.dispatchEvent(new Event('tripjar:dataUpdated'))
    navigate('/add-money')
  }

  return (
    <div className="min-h-screen pb-24">
      <header className="flex items-center gap-3 px-5 pt-6 slide-up">
        <button aria-label="Back" onClick={() => navigate(-1)} className="card p-2 bounce-soft">←</button>
        <h1 className="text-lg font-semibold">New Solo Trip</h1>
      </header>
      <section className="px-5 mt-5">
        <div className="card p-5 slide-up relative overflow-hidden">
          <div className="grid gap-4 pt-3">
            <FloatingField label="Trip Name" value={tripName} onChange={(e) => setTripName(e.target.value)} />
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
          <div className="grid gap-2">
            <div className="text-sm text-slate-700">Trip Picture</div>
            {image && (
              <img src={image} alt="Trip" className="w-full h-40 object-cover rounded-xl border border-slate-200" />
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
          <FloatingField label="Total Budget (₹)" value={budget} onChange={(e) => setBudget(e.target.value.replace(/[^0-9]/g, ''))} />
          {savingsAdvice && (
            <div className={`rounded-xl border p-3 mt-1 ${savingsAdvice.tone === 'green' ? 'border-green-200 bg-green-50' : savingsAdvice.tone === 'yellow' ? 'border-yellow-200 bg-yellow-50' : 'border-red-200 bg-red-50'}`}>
              <div className="text-xs text-slate-600">Based on your travel goal, here's a smart saving plan:</div>
              <div className="mt-1 text-sm">Save ₹{savingsAdvice.recommendedMonthly.toLocaleString('en-IN')} per month</div>
              <div className="text-sm">To stay on track, save ₹{savingsAdvice.recommendedWeekly.toLocaleString('en-IN')} per week</div>
              <div className="text-sm">Or ₹{savingsAdvice.recommendedDaily.toLocaleString('en-IN')} per day</div>
              <div className={`mt-1 text-xs ${savingsAdvice.tone === 'green' ? 'text-green-700' : savingsAdvice.tone === 'yellow' ? 'text-yellow-700' : 'text-red-700'}`}>{savingsAdvice.warning}</div>
            </div>
          )}
          <FloatingField label="Month" type="month" value={date ? date.slice(0,7) : ''} onChange={(e) => setDate(e.target.value + '-01')} />
          <FloatingField label="Trip Duration (days)" value={durationDays} onChange={(e) => setDurationDays(e.target.value.replace(/[^0-9]/g, ''))} />
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
          <FloatingField label="Minimum monthly save (₹)" value={String(minMonthly)} onChange={() => {}} />

          <button
            onClick={handleCreate}
            disabled={!canCreate}
            className={`mt-2 bounce-soft bg-gradient-to-r from-teal to-orange text-white rounded-full px-4 py-3 shadow-soft font-semibold ${!canCreate ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            Create Trip
          </button>
            {!canCreate && (
              <p className="text-xs text-red-600 break-words">Trip Name, a valid Trip Destination (from suggestions), Month and Budget are required.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
