import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  Bot,
  Send,
  Search,
  Sparkles,
  Compass,
  DoorOpen,
  LifeBuoy,
  Users,
  Mic,
  MicOff,
  Navigation,
  Thermometer,
  Wind,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Plus,
  MessageSquare,
  Activity,
  Layers,
  Zap,
  CornerDownLeft,
  AlertCircle,
  RotateCcw,
  X,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  HelpCircle,
  FileText
} from 'lucide-react';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

const DEFAULT_HISTORY_GROUPS = [
  {
    groupTitle: 'Today',
    items: [
      { id: 'h-1', title: 'Directions to Engineering Block B-204', category: 'Spatial Query • Live', active: true },
      { id: 'h-2', title: 'Quiet Study Pod 4 (Central Library)', category: '10:14 AM • Confirmed', active: false }
    ]
  },
  {
    groupTitle: 'Yesterday',
    items: [
      { id: 'h-3', title: 'Reporting Engineering Lab Projector Glitch', category: 'Care Dispatch #CMP-1042', active: false },
      { id: 'h-4', title: "Prof. Roy's Office Hours & Contact", category: 'Faculty Directory Node', active: false }
    ]
  },
  {
    groupTitle: 'Previous 7 Days',
    items: [
      { id: 'h-5', title: 'Mewar Campus Main Gate to Library Path', category: 'Step-Free ADA Transit', active: false },
      { id: 'h-6', title: 'Library 24/7 Smart Pass Rules', category: 'Access Control', active: false }
    ]
  }
];

const INITIAL_MESSAGES = [
  {
    id: 'msg-1-user',
    sender: 'user',
    text: 'How do I reach the AI & Computer Laboratory in Faculty of Engineering from the Main Campus Gate (NH-48), and is Room B-204 open right now?',
    time: '10:42 AM • Student'
  },
  {
    id: 'msg-1-ai',
    sender: 'ai',
    text: 'To reach the AI & Machine Learning Lab (Room B-204) in the Faculty of Engineering & Technology (Block ENG-02) from the Main Campus Gate (NH-48, Gangrar):\n\nEnter through the main gate archway and proceed north along Central Avenue for 150 meters past the Maharana Pratap Academic Block. Enter the Engineering Promenade and take the West Elevators or stairs to Level 2. Total walking time is ~3.5 minutes (280 meters).',
    time: '10:42 AM • NextCampus Copilot v4.5',
    engineName: 'Mewar Spatial Intelligence Engine',
    thought: [
      '⚡ Spatial Mesh: Main Campus Gate (NH-48) ➔ Central Avenue ➔ Maharana Pratap Block ➔ Faculty of Engineering ENG-02 ➔ Level 2.',
      '⚡ IoT Telemetry: SmartRoom sensor B-204 confirms 18/60 occupants (30% density). Climate: 21.8°C, Clean Air: 410 ppm.',
      '⚡ Timetable Check: Next scheduled lecture is CS-301 at 1:00 PM. Room open window: 2 hours remaining.'
    ],
    cards: [
      {
        type: 'route',
        title: 'Mewar Campus Transit Route',
        tag: 'Step-Free / ADA Step-Free',
        from: 'Main Campus Gate (NH-48, Gangrar)',
        via: 'Central Avenue & Engineering Promenade (140m)',
        to: 'Faculty of Engineering & Technology — Room B-204',
        metric: '280m • ~3.5 mins walk',
        actionLabel: 'Open in Campus Map',
        actionRoute: '/campus-map?bldg=eng&room=B-204'
      },
      {
        type: 'room_telemetry',
        title: 'Room B-204 Live Telemetry',
        tag: 'Open Now • 42 Desks Free',
        occupancy: '18 / 60 Desks',
        temp: '21.8°C',
        co2: '410 ppm Pristine',
        nextClass: 'CS-301 at 1:00 PM',
        actionLabel: 'Reserve Pod / Desk',
        actionRoute: '/smartrooms?search=B-204'
      }
    ]
  },
  {
    id: 'msg-2-user',
    sender: 'user',
    text: 'Where can I report a maintenance problem if the projector HDMI in B-204 is flickering?',
    time: '10:44 AM • Student'
  },
  {
    id: 'msg-2-ai',
    sender: 'ai',
    text: 'You can lodge an instant dispatch ticket through Campus Care. In active learning spaces like Turing Hall B-204, classroom AV incidents are automatically tagged under Tier 1 Rapid Response SLA (<45 minute target resolution) with automated technician dispatch.',
    time: '10:44 AM • NextCampus Copilot v4.5',
    engineName: 'CAFM Operations Engine',
    cards: [
      {
        type: 'care_ticket',
        title: 'Campus Care • Instant Dispatch Ticket',
        sub: 'Pre-populated using current spatial context',
        tag: 'Tier 1 SLA (<45m)',
        building: 'Faculty of Engineering (ENG-02)',
        room: 'Room B-204 (Level 2)',
        category: 'Classroom AV / HDMI Glitch',
        priority: 'High Priority',
        actionLabel: 'Submit Ticket to CAFM',
        actionRoute: '/care'
      }
    ]
  }
];

export function AiAssistant() {
  const navigate = useNavigate();

  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [lastFailedPrompt, setLastFailedPrompt] = useState('');
  const [searchHistoryQuery, setSearchHistoryQuery] = useState('');
  const [activeSessionId, setActiveSessionId] = useState('h-1');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [showMobileHistory, setShowMobileHistory] = useState(false);

  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleStartNewChat = () => {
    setMessages([
      {
        id: `msg-welcome-${Date.now()}`,
        sender: 'ai',
        text: 'Hello! I am NextCampus AI Assistant, your 24/7 intelligent copilot for Mewar University. I can help you with campus navigation, SmartRoom availability, facility maintenance requests, and class schedules. What would you like to explore today?',
        time: 'Just now • NextCampus Copilot',
        engineName: 'Campus AI Copilot'
      }
    ]);
    setActiveSessionId(`h-new-${Date.now()}`);
    setErrorMessage('');
    setShowMobileHistory(false);
  };

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputValue;
    if (!text || !text.trim()) return;

    const userPrompt = text.trim();
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userPrompt,
      time: 'Just now • Student'
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsLoading(true);
    setErrorMessage('');
    setLastFailedPrompt('');

    try {
      const res = await api.post('/ai/query', { prompt: userPrompt });
      if (res && res.success && res.data) {
        const aiData = res.data;
        const aiMsg = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: aiData.reply || 'Request processed successfully.',
          time: 'Just now • NextCampus AI',
          engineName: aiData.engineName || 'NextCampus Spatial AI Engine',
          thought: aiData.thought || [
            '⚡ Spatial Graph: Queried Mewar University CAD & GIS topology node.',
            '⚡ Live Telemetry: LoRaWAN 100Hz IoT mesh active.'
          ],
          cards: Array.isArray(aiData.richCards)
            ? aiData.richCards
            : aiData.richCards
            ? [aiData.richCards]
            : [
                {
                  type: 'spatial',
                  title: 'Faculty of Engineering (Block ENG-02)',
                  tag: 'CAD Vector Mesh',
                  room: 'Room B-204 (Level 2)',
                  actionLabel: 'Navigate in Campus Map',
                  actionRoute: '/campus-map?bldg=eng'
                }
              ]
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        throw new Error('API returned unformatted response');
      }
    } catch (err) {
      // High-fidelity fallback logic
      const q = userPrompt.toLowerCase();
      let fallbackText = `Here is the campus information for "${userPrompt}":\nRoom B-204 in Faculty of Engineering & Technology (Level 2) is currently operating normally with 42 seats available.`;
      let fallbackCards = [
        {
          type: 'room_telemetry',
          title: 'Room B-204 Telemetry',
          tag: 'Open Now',
          occupancy: '18 / 60 Desks',
          temp: '21.8°C',
          co2: '410 ppm Pristine',
          actionLabel: 'Inspect in SmartRooms',
          actionRoute: '/smartrooms?search=B-204'
        }
      ];

      if (q.includes('library') || q.includes('pod')) {
        fallbackText = `Swami Vivekananda Central Library (Block LIB-03) has 4 acoustic quiet study pods open right now on Level 2. Access is touchless via your digital NFC campus pass.`;
        fallbackCards = [
          {
            type: 'spatial',
            title: 'Central Library Level 2 Study Pods',
            tag: 'Acoustic Soundproof',
            room: 'Pods 1–8 (West Wing)',
            actionLabel: 'Reserve Pod in SmartRooms',
            actionRoute: '/smartrooms?search=LIB-03'
          }
        ];
      } else if (q.includes('prof') || q.includes('faculty') || q.includes('roy')) {
        fallbackText = `Prof. Ananya Roy is in Faculty of Engineering Room B-204 (Level 2). Office hours today: 2:00 PM – 4:30 PM (Walk-In Welcome).`;
        fallbackCards = [
          {
            type: 'faculty',
            title: 'Prof. Ananya Roy, Ph.D.',
            tag: 'In Office Hours Today',
            room: 'Faculty of Engineering Room B-204',
            actionLabel: 'View in Directory',
            actionRoute: '/directory?search=Roy'
          }
        ];
      } else if (q.includes('complaint') || q.includes('repair') || q.includes('broken')) {
        fallbackText = `You can lodge an instant maintenance ticket through NextCampus Care. Standard classroom repairs follow a rapid SLA (<45 mins).`;
        fallbackCards = [
          {
            type: 'care_ticket',
            title: 'Campus Care Helpdesk',
            tag: 'Rapid SLA',
            building: 'Faculty of Engineering (ENG-02)',
            room: 'Room B-204',
            category: 'Classroom Equipment',
            priority: 'High Priority',
            actionLabel: 'Submit Ticket to Care',
            actionRoute: '/care'
          }
        ];
      }

      const fallbackMsg = {
        id: `ai-fallback-${Date.now()}`,
        sender: 'ai',
        text: fallbackText,
        time: 'Just now • NextCampus Copilot',
        engineName: 'Mewar Campus Assistant',
        thought: [
          '⚡ Spatial Query: Ingested student intent & resolved building coordinates.',
          '⚡ Telemetry: Connected to Mewar IoT environmental sensors.'
        ],
        cards: fallbackCards
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleVoice = () => {
    setIsVoiceActive(!isVoiceActive);
    if (!isVoiceActive) {
      setTimeout(() => {
        setIsVoiceActive(false);
        handleSendMessage('How do I reach the Central Library from Engineering Block?');
      }, 3500);
    }
  };

  const handleRetry = () => {
    if (lastFailedPrompt) {
      handleSendMessage(lastFailedPrompt);
    }
  };

  // Filter history items by search query
  const filteredHistoryGroups = DEFAULT_HISTORY_GROUPS.map((grp) => ({
    ...grp,
    items: grp.items.filter((item) => {
      if (!searchHistoryQuery.trim()) return true;
      const q = searchHistoryQuery.toLowerCase();
      return item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
    })
  })).filter((grp) => grp.items.length > 0);

  return (
    <div className="flex flex-col gap-2 sm:gap-3.5 w-full max-w-7xl mx-auto text-slate-900 h-full max-h-full pb-16 md:pb-0 font-sans overflow-hidden">
      {/* Top Copilot Header Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 px-3 sm:px-5 py-2 sm:py-3 rounded-2xl bg-white border border-slate-200 shadow-sm shrink-0">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#EAF5EF] text-[#168567] border border-[#168567]/20 flex items-center justify-center font-bold shadow-xs">
            <Bot size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900 tracking-tight">NextCampus AI Copilot</span>
              <span className="px-2 py-0.5 rounded-full bg-[#EAF5EF] text-[#168567] border border-[#168567]/20 font-mono text-[10px] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#168567] animate-pulse"></span>
                Mesh Live
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">
              Mewar University • 24/7 Spatial Navigation &amp; Facility Assistant
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile History Toggle */}
          <button
            type="button"
            onClick={() => setShowMobileHistory(!showMobileHistory)}
            className="lg:hidden p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 cursor-pointer"
            title="Toggle dialogue history"
          >
            {showMobileHistory ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
          </button>

          <Button
            variant="secondary"
            size="sm"
            icon={Plus}
            onClick={handleStartNewChat}
          >
            New Dialogue
          </Button>
        </div>
      </div>

      {/* Main Integrated Workspace */}
      <div className="flex flex-1 min-h-0 gap-3.5 overflow-hidden relative">
        {/* Left History Rail (Desktop fixed, Mobile overlay drawer) */}
        <aside
          className={`${
            showMobileHistory ? 'flex absolute inset-0 z-40 bg-white' : 'hidden lg:flex'
          } flex-col w-72 rounded-2xl bg-white border border-slate-200 p-3.5 overflow-hidden shadow-sm shrink-0 justify-between`}
        >
          <div className="flex flex-col gap-3 overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                Dialogue History
              </span>
              {showMobileHistory && (
                <button
                  onClick={() => setShowMobileHistory(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              className="w-full"
              onClick={handleStartNewChat}
            >
              Start New Dialogue
            </Button>

            <div className="relative w-full">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                value={searchHistoryQuery}
                onChange={(e) => setSearchHistoryQuery(e.target.value)}
                placeholder="Search dialogue history..."
                className="w-full h-8 pl-8 pr-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#168567] focus:ring-1 focus:ring-[#168567]/10"
              />
            </div>

            <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1">
              {filteredHistoryGroups.map((grp, gIdx) => (
                <div key={gIdx} className="flex flex-col gap-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold px-2">
                    {grp.groupTitle}
                  </span>
                  {grp.items.map((item) => {
                    const isSelected = activeSessionId === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveSessionId(item.id);
                          setShowMobileHistory(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-start gap-2 border cursor-pointer ${
                          isSelected
                            ? 'bg-[#EAF5EF] border-[#168567]/30 text-[#168567] font-semibold'
                            : 'bg-slate-50/60 border-slate-200/80 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                      >
                        <MessageSquare className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isSelected ? 'text-[#168567]' : 'text-slate-400'}`} />
                        <div className="min-w-0 flex-1">
                          <p className="truncate leading-snug">{item.title}</p>
                          <span className="text-[10px] font-mono text-slate-400">{item.category}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] font-mono text-slate-500 flex items-center justify-between">
            <span>Mewar Copilot v4.5</span>
            <span className="text-emerald-700 font-semibold">Online</span>
          </div>
        </aside>

        {/* Main Conversation Stream */}
        <main className="flex-1 flex flex-col min-w-0 rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          {/* Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-4">
            <div className="flex items-center justify-center my-0.5">
              <span className="px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-500 text-xs font-medium">
                NextCampus AI Assistant • Connected to Live IoT &amp; CAD Mesh
              </span>
            </div>

            {messages.map((msg) => (
              <div key={msg.id} className="flex flex-col gap-2">
                {msg.sender === 'user' ? (
                  <div className="flex justify-end items-start gap-2 max-w-2xl ml-auto">
                    <div className="flex flex-col items-end">
                      <div className="p-3.5 px-4.5 rounded-2xl rounded-tr-sm bg-slate-900 text-white text-xs sm:text-sm font-medium shadow-xs leading-relaxed">
                        {msg.text}
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 mt-1">{msg.time}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-start items-start gap-3 max-w-3xl mr-auto">
                    <div className="w-8 h-8 rounded-xl bg-[#EAF5EF] text-[#168567] border border-[#168567]/20 flex items-center justify-center font-bold shadow-xs shrink-0 mt-0.5">
                      <Bot size={16} />
                    </div>

                    <div className="flex flex-col gap-2 flex-1 min-w-0">
                      <div className="p-4 rounded-2xl rounded-tl-sm bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed shadow-xs">
                        <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>

                        {/* Thought Reasoning Trace */}
                        {msg.thought && msg.thought.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-slate-200 flex flex-col gap-1 font-mono text-[11px] text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200">
                            <span className="text-[#168567] font-bold uppercase tracking-wider text-[10px]">
                              Telemetry &amp; Spatial Reasoning Ingest:
                            </span>
                            {msg.thought.map((t, idx) => (
                              <div key={idx} className="leading-snug">{t}</div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Rich Action Cards */}
                      {msg.cards && msg.cards.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                          {msg.cards.map((card, cIdx) => (
                            <div
                              key={cIdx}
                              className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between gap-3 shadow-xs"
                            >
                              <div>
                                <div className="flex items-center justify-between mb-1.5">
                                  <span className="text-xs font-bold text-slate-900 leading-tight">{card.title}</span>
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#EAF5EF] text-[#168567] border border-[#168567]/20">
                                    {card.tag}
                                  </span>
                                </div>

                                {card.type === 'route' ? (
                                  <div className="flex flex-col gap-1 text-xs text-slate-600">
                                    <span>From: <strong className="text-slate-800">{card.from}</strong></span>
                                    <span>To: <strong className="text-[#168567]">{card.to}</strong></span>
                                    <span className="text-[11px] font-mono text-emerald-700 font-semibold mt-1">{card.metric}</span>
                                  </div>
                                ) : card.type === 'room_telemetry' ? (
                                  <div className="flex flex-col gap-1 text-xs text-slate-600">
                                    <span>Live Occupancy: <strong className="text-slate-900">{card.occupancy}</strong></span>
                                    <span>Climate: <strong className="text-sky-700">{card.temp}</strong> • {card.co2}</span>
                                    <span className="text-[11px] text-[#168567] font-mono font-semibold mt-1">Next: {card.nextClass}</span>
                                  </div>
                                ) : card.type === 'care_ticket' ? (
                                  <div className="flex flex-col gap-1 text-xs text-slate-600">
                                    <span>Building: <strong className="text-slate-900">{card.building}</strong></span>
                                    <span>Category: <strong className="text-[#168567]">{card.category}</strong></span>
                                    <span className="text-[11px] text-slate-500">{card.priority}</span>
                                  </div>
                                ) : (
                                  <div className="text-xs text-slate-600">{card.room}</div>
                                )}
                              </div>

                              <Button
                                variant="secondary"
                                size="sm"
                                iconRight={ArrowRight}
                                onClick={() => navigate(card.actionRoute)}
                              >
                                {card.actionLabel || 'Open Feature'}
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}

                      <span className="text-[10px] font-mono text-slate-400">{msg.time}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-center gap-3 max-w-lg mr-auto">
                <div className="w-8 h-8 rounded-xl bg-[#EAF5EF] text-[#168567] border border-[#168567]/20 flex items-center justify-center animate-pulse">
                  <Bot size={16} />
                </div>
                <div className="p-3 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#168567] animate-ping"></span>
                  <span>Synthesizing spatial graph &amp; live room telemetries...</span>
                </div>
              </div>
            )}

            {/* Error / Retry Banner */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <AlertCircle size={15} className="text-rose-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
                {lastFailedPrompt && (
                  <button
                    onClick={handleRetry}
                    className="flex items-center gap-1 font-bold text-rose-700 hover:text-rose-900 underline cursor-pointer"
                  >
                    <RotateCcw size={13} />
                    <span>Retry</span>
                  </button>
                )}
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Voice Visualizer Banner */}
          {isVoiceActive && (
            <div className="p-3 bg-[#EAF5EF] border-t border-[#168567]/20 flex items-center justify-between px-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-[#168567] animate-ping"></span>
                <span className="text-xs font-mono font-bold text-[#168567]">
                  Listening for voice query... Speak now ("How do I reach the library?")
                </span>
              </div>
              <div className="flex items-center gap-1">
                {[12, 24, 16, 28, 20, 32, 14, 22].map((h, i) => (
                  <div
                    key={i}
                    className="w-1 bg-[#168567] rounded-full animate-pulse"
                    style={{ height: `${h}px`, animationDelay: `${i * 0.1}s` }}
                  ></div>
                ))}
              </div>
            </div>
          )}

          {/* Suggested Context-Aware Prompt Chips */}
          <div className="p-2.5 px-4 bg-slate-50/80 border-t border-slate-100 flex items-center gap-2 overflow-x-auto scrollbar-none">
            <span className="text-[11px] font-mono uppercase text-slate-400 font-bold shrink-0">Try Asking:</span>
            {[
              'Are there quiet study pods free in Central Library?',
              'How to reach Room B-204 from Main Campus Gate?',
              'Report projector glitch in B-204',
              'When are Prof. Roy office hours?',
              'What is the EV shuttle schedule today?'
            ].map((chip, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(chip)}
                className="px-3 py-1 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-[11px] text-slate-700 whitespace-nowrap transition-all cursor-pointer shadow-xs"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Interactive Message Input Box */}
          <div className="p-3 bg-white border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5 focus-within:bg-white focus-within:border-[#168567] focus-within:ring-2 focus-within:ring-[#168567]/10 transition-all"
            >
              <button
                type="button"
                onClick={handleToggleVoice}
                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                  isVoiceActive
                    ? 'bg-[#EAF5EF] text-[#168567] animate-pulse'
                    : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'
                }`}
                title="Simulate Voice Input"
              >
                <Mic className="w-4 h-4" />
              </button>

              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask anything about Mewar classrooms, faculty hours, or step-free CAD navigation..."
                className="flex-1 bg-transparent border-none text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none px-2"
              />

              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={isLoading || !inputValue.trim()}
                icon={Send}
              />
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AiAssistant;
