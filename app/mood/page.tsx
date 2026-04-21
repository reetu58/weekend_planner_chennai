'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Act {
  phase: 'begin' | 'middle' | 'end';
  time: string;
  location: string;
  body: string;
}

interface Mood {
  id: string;
  emoji: string;
  tag: string;
  title: string;
  subtitle: string;
  tease: string;
  duration: string;
  photo: string;
  accentColor: string;
  accentBg: string;
  acts: Act[];
  planLink: string;
}

const MOODS: Mood[] = [
  {
    id: 'coastal',
    emoji: '🌊',
    tag: 'Coastal',
    title: 'Coastal Calm',
    subtitle: 'Marina to Besant Nagar',
    tease: 'Two beaches, one morning — the city before it wakes up.',
    duration: '5 hrs',
    photo: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=85',
    accentColor: 'text-sky-400',
    accentBg: 'bg-sky-500/15',
    planLink: '/plan?vibes=chill,nature&categories=beaches,food',
    acts: [
      {
        phase: 'begin',
        time: '7:00 AM',
        location: 'Marina Beach, Lighthouse End',
        body: 'Park near the lighthouse. The shore is nearly empty — just fishermen pulling in their night catch and the odd early walker. Take off your shoes. Walk north along the waterline. Get a cutting chai from the vendor near the statue row. This is Chennai before it turns loud.',
      },
      {
        phase: 'middle',
        time: '9:30 AM',
        location: 'Murugan Idli Shop → Besant Nagar',
        body: 'Drive down to Mylapore for a proper breakfast — crispy vadas, sambar, the works. Then take the scenic coastal road to Besant Nagar. Elliot\'s Beach is calmer, cleaner, shadier than Marina. Sit. Read. Do nothing in particular. That\'s the point.',
      },
      {
        phase: 'end',
        time: '12:00 PM',
        location: 'Besant Nagar Beach Road',
        body: 'Finish with a walk past the small Ashtalakshmi Temple perched over the water. Grab a corn or a cut fruit from the beach vendors. Leave before noon — the sun gets mean after that, and so does the traffic home.',
      },
    ],
  },
  {
    id: 'flavor',
    emoji: '🍜',
    tag: 'Culinary',
    title: 'Flavor Chaser',
    subtitle: 'Mylapore Food Crawl',
    tease: 'Follow the smell of filter kaapi down the oldest lanes in the city.',
    duration: '4 hrs',
    photo: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1400&q=85',
    accentColor: 'text-amber-400',
    accentBg: 'bg-amber-500/15',
    planLink: '/plan?vibes=foodie,social&categories=food',
    acts: [
      {
        phase: 'begin',
        time: '8:00 AM',
        location: 'Murugan Idli Shop, Mylapore',
        body: 'Start here, nowhere else. Order the mini-idli set — soft, steamed, and arriving with four different chutneys. The filter coffee comes in a steel tumbler. The morning crowd is regulars only. Tourists haven\'t found this rhythm yet.',
      },
      {
        phase: 'middle',
        time: '10:00 AM',
        location: 'Ratna Café → Agraharam lanes',
        body: 'Walk the agraharam — the old Brahmin residential street that wraps around the Kapaleeshwarar tank. Stop at Ratna Café for their legendary sambar rice if you have room. Peek into the silk saree shops on Kutchery Road. Browse the flower vendors. This is old Madras preserved in amber.',
      },
      {
        phase: 'end',
        time: '1:00 PM',
        location: 'Mylai Karpagambal Mess or Saravana Bhavan',
        body: 'End with a full meals lunch — banana leaf, rice, the lot. The mess on Luz Church Road gives you the real deal without ceremony. Finish with one more filter coffee. Walk slowly back to your car. Today was earned.',
      },
    ],
  },
  {
    id: 'heritage',
    emoji: '🏛️',
    tag: 'Heritage',
    title: 'History Buff',
    subtitle: 'Kapaleeshwarar & Fort Walk',
    tease: 'Dravidian gopurams, British ramparts — two empires in one morning.',
    duration: '3 hrs',
    photo: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1400&q=85',
    accentColor: 'text-orange-400',
    accentBg: 'bg-orange-500/15',
    planLink: '/plan?vibes=cultural&categories=culture',
    acts: [
      {
        phase: 'begin',
        time: '7:30 AM',
        location: 'Kapaleeshwarar Temple, Mylapore',
        body: 'Arrive before the tourist buses. The main gopuram faces east — it glows at this hour. Non-Hindus can walk the outer corridor and the tank. The peacocks are usually out by 8 AM. The architecture is Dravidian 16th century, rebuilt from a Portuguese demolition. There\'s a story in every pillar.',
      },
      {
        phase: 'middle',
        time: '10:00 AM',
        location: 'Fort St. George, Rajaji Salai',
        body: 'India\'s first English fort, built in 1644. The museum inside is genuinely good — letters from Clive, Dupleix portraits, and the actual flag they raised when the British first arrived. Walk the ramparts. Look at the Secretariat buildings that grew around it. Chennai as administrative city starts here.',
      },
      {
        phase: 'end',
        time: '12:30 PM',
        location: 'San Thome Basilica or Madras High Court exterior',
        body: 'Drive south to San Thome — a Portuguese basilica built over what they claim is the tomb of St. Thomas the Apostle. Whether or not you believe it, the building is beautiful and cool inside. Or end at the High Court building: neo-Gothic and Indo-Saracenic mixed, and entirely wild to look at. Then go home. You\'ve walked through 2,000 years.',
      },
    ],
  },
  {
    id: 'slow',
    emoji: '☕',
    tag: 'Slow',
    title: 'Slow Morning',
    subtitle: 'Nungambakkam & Chamiers',
    tease: 'Nowhere to be. Good coffee. A city neighbourhood that got something right.',
    duration: '3 hrs',
    photo: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1400&q=85',
    accentColor: 'text-rose-400',
    accentBg: 'bg-rose-500/15',
    planLink: '/plan?vibes=romantic,chill&categories=food,nightlife',
    acts: [
      {
        phase: 'begin',
        time: '9:00 AM',
        location: 'Amethyst, Chamiers Road',
        body: 'Sit outside in the garden if the heat lets you. Order slowly. The kitchen is unhurried and you should be too. The building is a restored colonial bungalow — ceiling fans, wooden floors, old photographs. Order the French toast or the eggs. Read something you\'ve been putting off.',
      },
      {
        phase: 'middle',
        time: '11:00 AM',
        location: 'Khader Nawaz Khan Road',
        body: 'Walk up KNK Road — Chennai\'s best design street. Boutiques, concept stores, a couple of good independent bookshops. You don\'t have to buy anything. Browse. Then cut through to Nungambakkam High Road and find a table at Filter Coffee for a second round.',
      },
      {
        phase: 'end',
        time: '1:30 PM',
        location: 'Focaccia or Pasha',
        body: 'Lunch at Focaccia — wood-fired pizzas and proper pasta in a quiet space. Or Pasha next door if you want something lighter. Either way: no rush. Split a dessert. Walk out slowly. That\'s the whole point of today.',
      },
    ],
  },
  {
    id: 'nature',
    emoji: '🌅',
    tag: 'Outdoor',
    title: 'Nature Seeker',
    subtitle: 'Muttukadu Backwaters',
    tease: 'An hour south of the city — and a world away from it.',
    duration: 'Morning',
    photo: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1400&q=85',
    accentColor: 'text-emerald-400',
    accentBg: 'bg-emerald-500/15',
    planLink: '/plan?vibes=nature,chill&categories=nature',
    acts: [
      {
        phase: 'begin',
        time: '6:00 AM',
        location: 'Muttukadu Boat House, ECR',
        body: 'Leave the city by 5:45 to catch ECR before it fills up. The backwater at sunrise is still — grey-green water, egrets standing one-legged in the shallows, a lone fisherman. Rent a paddleboat or kayak. There\'s no rush schedule today. Just water and air and quiet.',
      },
      {
        phase: 'middle',
        time: '8:30 AM',
        location: 'Muttukadu → Kovalam Beach',
        body: 'Paddle as far as you want. Come back. Dry off. There\'s a dhaba near the ECR entrance that does idlis and dosas — no Instagram aesthetics, just hot food. Drive a few minutes south to Kovalam — smaller beach, no vendors, calm water for a morning swim.',
      },
      {
        phase: 'end',
        time: '10:30 AM',
        location: 'Covelong Point, ECR',
        body: 'Finish at Covelong. The Surfing Federation of India has a school here — watch the beginners, or join a lesson if you\'re feeling brave. Even if not: sit on the sand. The drive back on ECR before noon is the reward — windows down, sea on your left, city still 40 minutes away.',
      },
    ],
  },
  {
    id: 'thrill',
    emoji: '🎮',
    tag: 'Action',
    title: 'Thrill Seeker',
    subtitle: 'ECR Adventure Run',
    tease: 'Rides, ATVs, and a sunset at Covelong. Go fast. Come home dirty.',
    duration: '5 hrs',
    photo: 'https://images.unsplash.com/photo-1533107862482-0e6974b06ec4?auto=format&fit=crop&w=1400&q=85',
    accentColor: 'text-violet-400',
    accentBg: 'bg-violet-500/15',
    planLink: '/plan?vibes=adventure,social&categories=entertainment',
    acts: [
      {
        phase: 'begin',
        time: '9:00 AM',
        location: 'MGM Dizzee World, ECR',
        body: 'Go straight for the roller coaster and the wave pool — they get crowded by 11 AM. Budget two hours max. Pack a dry change of clothes. The entry includes most rides; skip the upsells. Eat something before you go in — the food inside is overpriced and underwhelming.',
      },
      {
        phase: 'middle',
        time: '12:00 PM',
        location: 'Muttukadu Boat House — ATV & Windsurfing',
        body: 'Drive down ECR to the Muttukadu boat house. ATV quad bikes are available on the sandbar — 30 minutes, no experience needed. Windsurfing lessons if you have longer. Lunch at the beach shacks near Neelankarai — fried fish, cold drink, plastic chairs. This is the right kind of lunch.',
      },
      {
        phase: 'end',
        time: '4:00 PM',
        location: 'Covelong Point',
        body: 'Golden hour at Covelong. Watch the surfers if the swell is up. The Surfing Federation school rents boards. Get a coconut from the vendor on the road. Take your time. Leave before 5:30 PM or you\'ll hand the next two hours to OMR traffic. You\'ve earned the drive home.',
      },
    ],
  },
];

const ACT_CONFIG = {
  begin:  { label: 'Begin',  dot: 'bg-emerald-400', ring: 'ring-emerald-400/30', text: 'text-emerald-400', border: 'border-emerald-400/20', bg: 'bg-emerald-400/5'  },
  middle: { label: 'Middle', dot: 'bg-yellow-400',  ring: 'ring-yellow-400/30',  text: 'text-yellow-400',  border: 'border-yellow-400/20',  bg: 'bg-yellow-400/5'   },
  end:    { label: 'End',    dot: 'bg-red-400',     ring: 'ring-red-400/30',     text: 'text-red-400',     border: 'border-red-400/20',     bg: 'bg-red-400/5'      },
};

export default function MoodPage() {
  const [selected, setSelected] = useState<Mood | null>(null);
  const [visible, setVisible] = useState(false);
  const [storyReady, setStoryReady] = useState(false);

  // Open story
  function openMood(mood: Mood) {
    setSelected(mood);
    setVisible(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setStoryReady(true)));
    document.body.style.overflow = 'hidden';
  }

  // Close story
  function closeMood() {
    setStoryReady(false);
    setTimeout(() => {
      setSelected(null);
      setVisible(false);
      document.body.style.overflow = '';
    }, 400);
  }

  // Keyboard escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeMood(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="min-h-screen bg-[#0C111D] text-white overflow-x-hidden">

      {/* ===== GRID PAGE ===== */}
      <div className="max-w-7xl mx-auto px-6 pt-28 pb-24">

        {/* Headline */}
        <div className="mb-16">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#F43F5E]/70 mb-4">Chennai · Weekend Discovery</p>
          <h1 className="font-playfair text-6xl md:text-8xl lg:text-[7rem] font-black leading-[0.95] tracking-tight text-white mb-6">
            Pick Your<br /><em className="not-italic text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">Mood.</em>
          </h1>
          <p className="text-slate-400 text-lg max-w-lg leading-relaxed">
            Six ways to spend a Chennai weekend. Each one mapped, timed, and ready to go.
          </p>
        </div>

        {/* 3×2 grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {MOODS.map((mood, i) => (
            <button
              key={mood.id}
              onClick={() => openMood(mood)}
              className="group relative rounded-3xl overflow-hidden aspect-[3/4] text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {/* Background photo */}
              <img
                src={mood.photo}
                alt={mood.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://placehold.co/600x800/1E293B/F43F5E?text=${encodeURIComponent(mood.title)}`;
                }}
              />

              {/* Gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C111D] via-[#0C111D]/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#0C111D]/30 to-transparent" />

              {/* Hover glow border */}
              <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-white/20 transition-colors duration-300" />

              {/* Top row */}
              <div className="absolute top-5 left-5 right-5 flex items-center justify-between">
                <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10 bg-black/30 ${mood.accentColor}`}>
                  {mood.tag}
                </span>
                <span className="text-xs font-medium text-white/60 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                  {mood.duration}
                </span>
              </div>

              {/* Bottom content */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-3xl">{mood.emoji}</span>
                  <span className={`opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 text-xs font-bold uppercase tracking-widest ${mood.accentColor} flex items-center gap-1`}>
                    Read
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7"/></svg>
                  </span>
                </div>
                <h2 className="font-playfair text-2xl font-black text-white leading-tight mb-1">{mood.title}</h2>
                <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-2">{mood.subtitle}</p>
                <p className="text-sm text-slate-400 leading-relaxed line-clamp-2">{mood.tease}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ===== STORY OVERLAY ===== */}
      {visible && selected && (
        <div
          className={`fixed inset-0 z-50 transition-opacity duration-300 ${storyReady ? 'opacity-100' : 'opacity-0'}`}
          style={{ background: '#0C111D' }}
        >
          <div
            className={`h-full flex flex-col lg:flex-row transition-transform duration-500 ease-out ${storyReady ? 'translate-x-0' : 'translate-x-full'}`}
          >

            {/* ── LEFT: Hero photo panel ── */}
            <div className="relative lg:w-[42%] h-[40vh] lg:h-full flex-shrink-0 overflow-hidden">
              <img
                src={selected.photo}
                alt={selected.title}
                className="w-full h-full object-cover"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C111D] via-[#0C111D]/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#0C111D]" />

              {/* Photo content */}
              <div className="absolute bottom-8 left-8 right-8 lg:bottom-16 lg:left-10">
                <span className={`inline-flex text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full mb-4 border ${selected.accentBg} ${selected.accentColor} border-white/10`}>
                  {selected.emoji} {selected.tag}
                </span>
                <h2 className="font-playfair text-4xl lg:text-5xl font-black text-white leading-tight mb-2">
                  {selected.title}
                </h2>
                <p className="text-sm font-semibold uppercase tracking-widest text-white/40">{selected.subtitle}</p>
              </div>
            </div>

            {/* ── RIGHT: Story content ── */}
            <div className="flex-1 overflow-y-auto lg:overflow-y-scroll">
              <div className="max-w-xl mx-auto px-8 lg:px-12 py-10 lg:py-16">

                {/* Back button */}
                <button
                  onClick={closeMood}
                  className="flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors mb-12 group"
                >
                  <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                  Back to moods
                </button>

                {/* Tease / intro */}
                <p className="font-playfair text-xl italic text-slate-300 leading-relaxed mb-12 border-l-2 border-white/10 pl-5">
                  &ldquo;{selected.tease}&rdquo;
                </p>

                {/* 3 Acts */}
                <div className="relative">
                  {/* Vertical connector line */}
                  <div className="absolute left-[11px] top-3 bottom-12 w-px bg-gradient-to-b from-emerald-400/40 via-yellow-400/40 to-red-400/40" />

                  <div className="space-y-10">
                    {selected.acts.map((act, i) => {
                      const cfg = ACT_CONFIG[act.phase];
                      return (
                        <div key={act.phase} className="relative pl-10">
                          {/* Phase dot */}
                          <div className={`absolute left-0 top-1 w-[22px] h-[22px] rounded-full ${cfg.dot} ring-4 ${cfg.ring} flex items-center justify-center`}>
                            <span className="text-[9px] font-black text-black">{i + 1}</span>
                          </div>

                          {/* Act label */}
                          <div className="flex items-center gap-3 mb-3">
                            <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${cfg.text}`}>
                              {cfg.label}
                            </span>
                            <span className="text-[10px] text-slate-600 uppercase tracking-wider font-medium">{act.time}</span>
                          </div>

                          {/* Location */}
                          <h3 className="font-playfair text-xl font-bold text-white mb-3 leading-snug">
                            {act.location}
                          </h3>

                          {/* Body */}
                          <div className={`rounded-2xl border ${cfg.border} ${cfg.bg} p-5`}>
                            <p className="text-sm text-slate-300 leading-relaxed">{act.body}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Duration + CTA */}
                <div className="mt-14 pt-8 border-t border-white/8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Total time</p>
                      <p className="text-lg font-black text-white">{selected.duration}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Best for</p>
                      <p className="text-lg font-black text-white">{selected.tag}</p>
                    </div>
                  </div>

                  <Link
                    href={selected.planLink}
                    className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-base transition-all hover:scale-[1.02] hover:shadow-lg ${selected.accentBg} border border-white/10 ${selected.accentColor} hover:border-white/20`}
                  >
                    Plan this weekend
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
                  </Link>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
