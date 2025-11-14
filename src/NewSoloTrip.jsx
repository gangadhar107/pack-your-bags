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

  const mockDestinations = [
    'Agra','Ahmedabad','Aizawl','Ajmer','Alleppey','Almora','Ambala','Amritsar','Anand','Andaman','Aurangabad','Badami','Bagdogra','Bangalore','Balurghat','Bandhavgarh','Bareilly','Bastar','Bathinda','Beed','Belgaum','Bellary','Bengaluru','Berhampore','Betul','Bhadrachalam','Bhandardara','Bharatpur','Bharuch','Bhatinda','Bhavnagar','Bhilai','Bhilwara','Bhimtal','Bhopal','Bhubaneswar','Bhuj','Bidar','Bilaspur','Bodhgaya','Bokaro','Bomdila','Bundi','Calangute','Calicut','Chail','Chamba','Chamoli','Chandigarh','Chandrapur','Chennai','Cherrapunji','Chikmagalur','Chiplun','Chitradurga','Coimbatore','Coonoor','Coorg','Cuttack','Dalhousie','Daman','Darbhanga','Darjeeling','Dausa','Dehradun','Delhi','Dhanaulti','Dhanbad','Dharamkot','Dharamshala','Dharwad','Dholavira','Digha','Dimapur','Dindigul','Dispur','Diu','Doda','Dooars','Durgapur','Dwarka','Ernakulam','Erode','Fatehpur Sikri','Gangotri','Gangtok','Ganjam','Gaya','Gokarna','Golconda','Gorakhpur','Gulbarga','Guna','Guntur','Gurgaon','Guwahati','Gwalior','Hampi','Hanumangarh','Hassan','Haridwar','Hazaribagh','Himachal Pradesh','Hosur','Hubli','Hyderabad','Imphal','Indore','Itanagar','Jabalpur','Jaipur','Jaisalmer','Jalandhar','Jammu','Jamshedpur','Jodhpur','Junagadh','Kailash Mansarovar','Kakinada','Kalimpong','Kanchipuram','Kanha National Park','Kanpur','Kanyakumari','Kargil','Karjat','Karur','Kasol','Kasauli','Kathmandu','Kaziranga','Kedarnath','Keoladeo National Park','Khajuraho','Khandala','Khimsar','Kodaikanal','Kohima','Kollam','Konark','Kongthong','Kota','Kottayam','Kovalam','Kozhikode','Kullu','Kumaon','Kurukshetra','Kurseong','Lakshadweep','Lansdowne','Leh','Lepchajagat','Lonavala','Lucknow','Ludhiana','Madgaon','Madurai','Mahabalipuram','Mahabaleshwar','Malappuram','Malpe','Malshej Ghat','Manali','Mangalore','Manipal','Matheran','Mathura','Meghalaya','Mirzapur','Mokokchung','Moradabad','Mount Abu','Mumbai','Munnar','Murudeshwar','Mussoorie','Mysore','Nagaland','Nagapattinam','Nagpur','Nainital','Nalbari','Namchi','Nanded','Nashik','Navi Mumbai','Nellore','Noida','Ooty','Orchha','Palakkad','Panchgani','Panipat','Panjim','Parwanoo','Patiala','Patna','Pelling','Phalodi','Phuket','Pondicherry','Porbandar','Port Blair','Prayagraj','Pune','Puri','Pushkar','Raichur','Raigad','Raipur','Rajahmundry','Rajgir','Rajkot','Rameswaram','Ranchi','Ranikhet','Ranthambore','Ras Al Khaimah','Ratnagiri','Rewa','Rishikesh','Ropar','Rourkela','Sabarimala','Sagar Island','Salem','Sambalpur','Sanchi','Sangli','Saputara','Sasaram','Satara','Shillong','Shimla','Shirdi','Silchar','Siliguri','Silvassa','Sindhudurg','Sirsi','Sivasagar','Solan','Solapur','Somnath','Sonamarg','Srinagar','Surat','Tajpur','Tambaram','Tezpur','Thanjavur','Thiruvananthapuram','Thrissur','Tinsukia','Tiruchirapalli','Tirunelveli','Tirupati','Tiruvannamalai','Tura','Tuticorin','Udaipur','Udhampur','Udupi','Ujjain','Una','Vadodara','Valsad','Varanasi','Varkala','Vellore','Veraval','Vidisha','Vijayawada','Visakhapatnam','Vrindavan','Wayanad','Warangal','Wardha','Yelagiri','Yercaud','Ziro Valley','Auli','Bir Billing','Spiti Valley','Chopta','Tawang','Zanskar Valley','Sandakphu','Kufri','Araku Valley','Valley of Flowers','Gulmarg','Bhandardara','Devikulam','Dandeli','Chilika Lake','Bhutan Border Trek','Sundarbans','Gir National Park','Corbett National Park','Pench National Park','Tadoba','Sattal','Bhimtal','Tehri','Har Ki Dun','Triund','Kheerganga','Roopkund','Hampta Pass','Chandrashila','Kuari Pass','Nubra Valley','Markha Valley','Spangmik','Pangong','Tso Moriri','Khimsar Dunes','Barmer','Jawai Leopard Reserve','Bharatpur Bird Sanctuary','Kutch','Mandvi Beach','Murud Beach','Alibaug','Ganpatipule','Varkala Beach','Bekal','Marari','Kumarakom','Poovar','Wayanad','Agumbe','Kabini','BR Hills','Sakleshpur','Sringeri','Chikmagalur','Coorg','Nagarhole','Hampi','Badami','Bidar Fort','Bijapur','Pattadakal','Belur','Halebidu','Gokarna','Karwar','Murdeshwar','Rameswaram','Dhanushkodi','Kanchipuram','Chettinad','Thanjavur','Madurai','Ramanathapuram','Yercaud','Kolli Hills','Valparai','Pollachi','Idukki','Munnar','Vagamon','Thenmala','Trivandrum','Kovalam','Alleppey','Varkala','Thrissur','Palakkad','Kozhikode','Wayanad','Kannur','Kasargod','Lakshadweep','Port Blair','Havelock Island','Neil Island','Baratang','Chidiya Tapu','Long Island','Rangat','Diglipur','Mayabunder','Nicobar','Great Nicobar Island','Goa'
  ]

  const slugify = (s) => String(s).trim().toLowerCase().replace(/\s+/g, '-')
  const mockDestinationsUnique = useMemo(
    () => Array.from(new Set(mockDestinations.map((s) => String(s).trim()).filter(Boolean))),
    []
  )

  const queryDestinations = (q) => {
    const term = String(q || '').trim().toLowerCase()
    if (!term) { setDestPredictions([]); setShowDestSuggestions(false); setDestError(''); return }
    const matches = mockDestinationsUnique
      .filter((d) => d.toLowerCase().includes(term))
      .slice(0, 8)
      .map((d) => ({ description: d, place_id: 'mock:' + slugify(d) }))
    if (matches.length) {
      setDestPredictions(matches)
      setDestError('')
    } else {
      setDestPredictions([])
      setDestError('No matching destination found.')
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

  const canCreate = !!tripName.trim() && !!destPlaceId && !!date && (parseInt(budget || '0', 10) > 0)

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
              <div className="absolute left-0 right-0 mt-1 rounded-xl border border-slate-200 bg-white shadow-soft max-h-52 overflow-auto z-20">
                {destPredictions.length > 0 ? (
                  destPredictions.map((p) => (
                    <button key={p.place_id} onClick={() => { setTripDestination(p.description || ''); setDestPlaceId(p.place_id || ''); setDestPredictions([]); setShowDestSuggestions(false); setDestError('') }} className="w-full text-left px-3 py-2 hover:bg-slate-50">
                      <div className="text-sm">{p.description}</div>
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-slate-500">{destError || 'No matching destination found.'}</div>
                )}
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
          <FloatingField label="Month" type="month" value={date ? date.slice(0,7) : ''} onChange={(e) => setDate(e.target.value + '-01')} />
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
