import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const DEFAULT_HISTORY_GROUPS = [
  {
    groupTitle: 'Today',
    items: [
      { id: 'h-1', title: 'Directions to Turing Hall B-204', category: 'Spatial Query • Live', active: true },
      { id: 'h-2', title: 'Quiet Study Pod 4 (Library)', category: '10:14 AM • Confirmed', active: false }
    ]
  },
  {
    groupTitle: 'Yesterday',
    items: [
      { id: 'h-3', title: 'Reporting CS Lab Projector Glitch', category: 'Care Dispatch #NC-8921', active: false },
      { id: 'h-4', title: "Prof. Roy's Office Hours & Mail", category: 'Faculty Directory Node', active: false }
    ]
  },
  {
    groupTitle: 'Previous 7 Days',
    items: [
      { id: 'h-5', title: 'Campus EV Shuttle Timetable & Stops', category: 'Transport Sync', active: false },
      { id: 'h-6', title: 'Library 24/7 Smart Access Rules', category: 'Security Policy', active: false }
    ]
  }
];

const INITIAL_MESSAGES = [
  {
    id: 'msg-1-user',
    sender: 'user',
    text: 'How do I reach the computer laboratory in Alan Turing Hall from the Central Library, and is Room B-204 open right now?',
    time: '10:42 AM • Student Self-Service'
  },
  {
    id: 'msg-1-ai',
    sender: 'ai',
    text: 'To reach the Distributed Systems & Multimedia Computer Laboratory (Room B-204) in Alan Turing Hall (Block A-01) from the Central Library:\n\nThe fastest and most comfortable route is via the 2nd Floor Covered Skybridge. It provides step-free ADA accessibility, sheltered transit against weather, and directly connects into Turing Hall Level 2. Total walking time is approx. 4 minutes (320 meters).',
    time: '10:42 AM • NextCampus LLM v4.2',
    isLiveModel: false,
    engineName: 'Simulated Copilot Engine (Demo Service)',
    thought: [
      '⚡ Graph retrieved: Central Library East Gate ➔ 2nd Floor Covered Skybridge ➔ Turing Hall A-01 ➔ Lab Corridor Level 2.',
      '⚡ Telemetry queried: SmartRoom sensor B-204 confirms 18/60 occupants (30% density). Ambient temp: 21.8°C.',
      '⚡ Timetable check: Next scheduled lecture is CS-301 at 11:30 AM. Room open window: 48 minutes remaining.'
    ],
    cards: [
      {
        type: 'route',
        title: 'Campus Transit Route',
        tag: 'Step-Free / ADA',
        from: 'Central Library — East Portal Gate',
        via: 'Level 2 Climate-Controlled Skybridge (190m)',
        to: 'Alan Turing Hall — Wing B, Room B-204',
        metric: '320m • ~4 mins walk',
        actionLabel: 'Open in Campus Map',
        actionRoute: '/campus-map'
      },
      {
        type: 'room_telemetry',
        title: 'Room B-204 Telemetry',
        tag: 'Open Now • 45m left',
        occupancy: '18 / 60',
        capacityPct: '30% Capacity',
        temp: '21.8°C',
        co2: '420 ppm CO₂',
        nextClass: 'CS-301',
        nextClassTime: '11:30 AM',
        actionRoute: '/smartroom'
      }
    ]
  },
  {
    id: 'msg-2-user',
    sender: 'user',
    text: 'Where can I report a maintenance problem if the projector HDMI in B-204 is glitching?',
    time: '10:44 AM • Student Self-Service'
  },
  {
    id: 'msg-2-ai',
    sender: 'ai',
    text: 'You can submit an instant dispatch ticket through NextCampus Care. In active learning spaces like Turing Hall B-204, classroom AV incidents are automatically tagged under Tier 1 Rapid Response SLA (Resolution within 45 minutes) before upcoming class sessions.',
    time: '10:44 AM • NextCampus LLM v4.2',
    isLiveModel: false,
    engineName: 'Simulated Copilot Engine (Demo Service)',
    cards: [
      {
        type: 'care_ticket',
        title: 'NextCampus Care • One-Click Incident Dispatch',
        sub: 'Pre-populated using current spatial context',
        tag: 'Tier 1 SLA (<45m)',
        building: 'Alan Turing Hall',
        room: 'B-204 (Lab)',
        category: 'Classroom AV / HDMI',
        priority: 'Medium Urgent',
        actionRoute: '/complaints'
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
  const [engineMode, setEngineMode] = useState('Simulated Copilot Engine (Demo Mode)');
  const [searchHistoryQuery, setSearchHistoryQuery] = useState('');
  const [activeSessionId, setActiveSessionId] = useState('h-1');

  const chatEndRef = useRef(null);

  // Auto-scroll chat stream
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleStartNewChat = () => {
    setMessages([
      {
        id: `msg-welcome-${Date.now()}`,
        sender: 'ai',
        text: 'Hello! I am NextCampus AI Assistant. I can help you with campus navigation, SmartRoom availability, facility maintenance requests, and class schedules. What would you like to explore today?',
        time: 'Just now • NextCampus AI',
        isLiveModel: false,
        engineName: 'Campus AI Copilot'
      }
    ]);
    setActiveSessionId(`h-new-${Date.now()}`);
  };

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputValue;
    if (!text || !text.trim()) return;

    setErrorMessage('');
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      time: 'Just now • Student Self-Service'
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsLoading(true);

    try {
      const res = await api.post('/ai/query', { prompt: text.trim() });
      if (res && res.success && res.data) {
        const aiData = res.data;
        const aiMsg = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: aiData.reply || 'Request processed successfully.',
          time: 'Just now • NextCampus AI',
          isLiveModel: aiData.isLiveModel || false,
          engineName: aiData.engineName || 'Simulated Copilot Engine (Demo Service)',
          suggestedAction: aiData.suggestedAction,
          thought: aiData.thought || [],
          cards: Array.isArray(aiData.richCards)
            ? aiData.richCards
            : aiData.richCards
            ? [aiData.richCards]
            : undefined
        };
        setEngineMode(aiData.engineName || 'NextCampus AI Engine');
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        throw new Error(res?.message || 'Failed to process AI response');
      }
    } catch (err) {
      // Local fallback in case of backend or network error
      console.warn('[NextCampus AI] Network error, rendering demo fallback response:', err.message);
      const fallbackAiMsg = {
        id: `ai-fallback-${Date.now()}`,
        sender: 'ai',
        text: `Here is information on "${text.trim()}":\nNextCampus provides instant spatial guidance, SmartRoom reservation telemetries, and care ticket dispatch across all campus nodes.`,
        time: 'Just now • NextCampus AI (Fallback)',
        isLiveModel: false,
        engineName: 'Simulated Copilot Engine (Demo Service)',
        cards: [
          {
            type: 'spatial',
            building: 'Alan Turing Hall (Block A-01)',
            room: 'B-204',
            occupancy: '18 / 60 Desks Available',
            temp: '21.8°C',
            co2: '410 ppm'
          }
        ]
      };
      setMessages((prev) => [...prev, fallbackAiMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChipClick = (chipText) => {
    setInputValue(chipText);
    handleSendMessage(chipText);
  };

  return (
    <div className="flex flex-col w-full h-[calc(100vh-5rem)] text-on-surface">
      {/* Top Assistant Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-white shadow-sm mb-3 border border-slate-200">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#FFE4E6] text-[#9E153E]">
            <span className="material-symbols-outlined text-[20px]">psychology</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-title-md text-title-md font-bold text-slate-900 tracking-tight">NextCampus AI Assistant</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-caption font-semibold border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Campus Copilot
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleStartNewChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-label-sm font-label-sm font-semibold transition-all border border-slate-200"
            title="Start new dialogue"
          >
            <span className="material-symbols-outlined text-[16px] text-[#9E153E]">add</span>
            <span>New Chat</span>
          </button>
        </div>
      </div>

      {/* Main Integrated Workspace */}
      <div className="flex flex-1 min-h-0 gap-3 overflow-hidden">
        {/* LEFT CONVERSATION RAIL (280px) */}
        <aside className="hidden lg:flex flex-col w-72 rounded-xl bg-white shadow-sm p-3 overflow-hidden border border-slate-200">
          {/* New Session CTA Button */}
          <button
            onClick={handleStartNewChat}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-[#9E153E] text-white font-label-md text-label-md font-semibold hover:bg-[#831843] shadow-sm transition-all active:scale-[0.99] mb-3"
          >
            <span className="material-symbols-outlined text-[18px]">add_comment</span>
            <span>Start New Dialogue</span>
          </button>

          {/* Search Dialogues Input */}
          <div className="relative w-full mb-space-sm">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[16px] pointer-events-none">search</span>
            <input
              type="text"
              value={searchHistoryQuery}
              onChange={(e) => setSearchHistoryQuery(e.target.value)}
              placeholder="Search saved campus queries..."
              className="w-full h-8 pl-8 pr-2.5 rounded-lg bg-surface-container text-on-surface placeholder:text-on-surface-variant/70 text-body-sm font-body-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all border border-outline-variant/20"
            />
          </div>

          {/* Grouped Conversation History */}
          <div className="flex-1 overflow-y-auto space-y-space-md pr-1">
            {DEFAULT_HISTORY_GROUPS.map((grp, gIdx) => (
              <div key={gIdx}>
                <div className="px-2 pb-1 text-caption font-caption text-on-surface-variant uppercase tracking-wider font-semibold">
                  {grp.groupTitle}
                </div>
                <div className="space-y-1">
                  {grp.items.map((item) => {
                    const isSelected = activeSessionId === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveSessionId(item.id)}
                        className={`w-full text-left flex items-start gap-2.5 p-2 rounded-lg transition-all ${
                          isSelected
                            ? 'bg-surface-container-high text-on-surface shadow-sm border border-primary/30'
                            : 'hover:bg-surface-container text-on-surface-variant hover:text-on-surface'
                        }`}
                      >
                        <span className={`material-symbols-outlined text-[18px] shrink-0 mt-0.5 ${isSelected ? 'text-primary' : 'text-on-surface-variant'}`}>
                          {item.id === 'h-1' ? 'near_me' : item.id === 'h-3' ? 'build_circle' : 'chat'}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className={`text-label-md font-label-md truncate ${isSelected ? 'font-semibold text-on-surface' : 'font-normal'}`}>
                            {item.title}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>}
                            <span className={`text-caption font-caption ${isSelected ? 'text-primary font-medium' : 'text-on-surface-variant/70'}`}>
                              {item.category}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

        </aside>

        {/* MAIN CHAT STREAM & INPUT CONTAINER */}
        <main className="flex-1 flex flex-col min-w-0 rounded-xl bg-white shadow-sm overflow-hidden border border-slate-200">
          {/* Conversational Message Scroll Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="flex items-center justify-center my-1">
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-caption font-caption border border-slate-200">
                NextCampus AI • Real-time Campus Guidance &amp; Support
              </span>
            </div>

            {messages.map((msg) => (
              <div key={msg.id}>
                {msg.sender === 'user' ? (
                  <div className="flex justify-end items-start gap-space-sm max-w-3xl ml-auto">
                    <div className="flex flex-col items-end">
                      <div className="px-space-md py-3 rounded-2xl rounded-tr-sm bg-primary-container text-on-primary-container shadow-md">
                        <p className="text-body-md font-body-md leading-relaxed text-on-primary">{msg.text}</p>
                      </div>
                      <span className="text-caption font-caption text-on-surface-variant mt-1 mr-1">{msg.time}</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-primary shrink-0 shadow-sm border border-outline-variant/30">
                      <span className="material-symbols-outlined text-[18px]">account_circle</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-space-sm max-w-4xl">
                    <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container shrink-0 shadow-md">
                      <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                    </div>

                    <div className="flex flex-col flex-1 min-w-0 space-y-space-sm">
                      {/* Thought process accordion */}
                      {msg.thought && msg.thought.length > 0 && (
                        <details className="group rounded-xl bg-surface-container shadow-sm overflow-hidden border border-outline-variant/20">
                          <summary className="flex items-center justify-between px-space-md py-2 cursor-pointer text-caption font-caption text-primary select-none hover:bg-surface-variant/40 transition-colors">
                            <div className="flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-[16px] animate-spin text-tertiary">data_object</span>
                              <span className="font-semibold uppercase tracking-wider">Spatial Reasoning &amp; Telemetry Inspection</span>
                            </div>
                            <span className="material-symbols-outlined text-[16px] transition-transform duration-200 group-open:rotate-180">
                              expand_more
                            </span>
                          </summary>
                          <div className="px-space-md pb-2.5 pt-1 text-caption font-caption text-on-surface-variant font-mono space-y-1 bg-surface-container-lowest/50">
                            {msg.thought.map((th, tIdx) => (
                              <p key={tIdx}>{th}</p>
                            ))}
                          </div>
                        </details>
                      )}

                      {/* Main AI Bubble */}
                      <div className="p-space-md rounded-2xl rounded-tl-sm bg-surface-container shadow-sm text-on-surface space-y-space-sm border border-outline-variant/20">
                        <p className="text-body-md font-body-md leading-relaxed text-on-surface whitespace-pre-line">{msg.text}</p>

                        {/* Embedded Cards Grid */}
                        {msg.cards && msg.cards.length > 0 && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm pt-space-xs">
                            {msg.cards.map((card, cIdx) => (
                              <div key={cIdx} className="rounded-xl bg-surface-container-high p-space-sm shadow-sm flex flex-col justify-between border border-outline-variant/30">
                                {card.type === 'route' && (
                                  <div>
                                    <div className="flex items-center justify-between pb-2">
                                      <div className="flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-primary text-[18px]">route</span>
                                        <span className="text-label-md font-label-md font-bold text-on-surface">{card.title}</span>
                                      </div>
                                      <span className="px-2 py-0.5 rounded-full bg-primary-container text-on-primary-container text-caption font-semibold">
                                        {card.tag}
                                      </span>
                                    </div>
                                    <div className="space-y-2 py-2 text-caption font-caption">
                                      <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-secondary-fixed"></span>
                                        <span className="text-on-surface-variant font-medium">{card.from}</span>
                                      </div>
                                      <div className="ml-1 pl-3 flex items-center gap-2 text-on-surface-variant/80">
                                        <span className="material-symbols-outlined text-[14px]">arrow_downward</span>
                                        <span>{card.via}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-primary"></span>
                                        <span className="text-on-surface font-semibold">{card.to}</span>
                                      </div>
                                    </div>
                                    <div className="pt-2 flex items-center justify-between">
                                      <span className="text-caption font-caption text-on-surface-variant font-mono">{card.metric}</span>
                                      <button
                                        onClick={() => navigate('/campus-map')}
                                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary-container hover:bg-secondary-container text-on-primary text-label-sm font-label-sm font-semibold transition-all"
                                      >
                                        <span>Open in Campus Map</span>
                                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                                      </button>
                                    </div>
                                  </div>
                                )}

                                {card.type === 'room_telemetry' && (
                                  <div>
                                    <div className="flex items-center justify-between pb-2">
                                      <div className="flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-tertiary text-[18px]">sensors</span>
                                        <span className="text-label-md font-label-md font-bold text-on-surface">{card.title}</span>
                                      </div>
                                      <span className="px-2 py-0.5 rounded-full bg-secondary-container/60 text-secondary-fixed text-caption font-semibold">
                                        {card.tag}
                                      </span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 py-2 text-center">
                                      <div className="bg-surface-container rounded-lg p-2">
                                        <p className="text-caption font-caption text-on-surface-variant">Occupancy</p>
                                        <p className="text-title-md font-title-md font-bold text-on-surface">{card.occupancy}</p>
                                        <span className="text-caption font-caption text-primary font-semibold">{card.capacityPct}</span>
                                      </div>
                                      <div className="bg-surface-container rounded-lg p-2">
                                        <p className="text-caption font-caption text-on-surface-variant">Air &amp; Temp</p>
                                        <p className="text-title-md font-title-md font-bold text-on-surface">{card.temp}</p>
                                        <span className="text-caption font-caption text-on-surface-variant">{card.co2}</span>
                                      </div>
                                      <div className="bg-surface-container rounded-lg p-2">
                                        <p className="text-caption font-caption text-on-surface-variant">Next Class</p>
                                        <p className="text-title-md font-title-md font-bold text-primary truncate">{card.nextClass}</p>
                                        <span className="text-caption font-caption text-on-surface-variant">{card.nextClassTime}</span>
                                      </div>
                                    </div>
                                    <div className="pt-2 flex items-center justify-between gap-2">
                                      <button
                                        onClick={() => navigate('/smartroom')}
                                        className="w-full py-1.5 rounded-lg bg-primary-container hover:bg-secondary-container text-on-primary text-label-sm font-label-sm font-semibold transition-all text-center"
                                      >
                                        Inspect SmartRoom
                                      </button>
                                    </div>
                                  </div>
                                )}

                                {card.type === 'care_ticket' && (
                                  <div className="col-span-full">
                                    <div className="flex items-center justify-between pb-2">
                                      <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary text-[20px]">health_and_safety</span>
                                        <div>
                                          <h4 className="text-label-md font-label-md font-bold text-on-surface">{card.title}</h4>
                                          <p className="text-caption font-caption text-on-surface-variant">{card.sub}</p>
                                        </div>
                                      </div>
                                      <span className="px-2.5 py-0.5 rounded-full bg-primary-container text-on-primary text-caption font-bold">
                                        {card.tag}
                                      </span>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-surface-container p-2.5 rounded-lg text-caption font-caption border border-outline-variant/20">
                                      <div>
                                        <span className="text-on-surface-variant">Building</span>
                                        <p className="text-on-surface font-semibold truncate">{card.building}</p>
                                      </div>
                                      <div>
                                        <span className="text-on-surface-variant">Room</span>
                                        <p className="text-on-surface font-semibold">{card.room}</p>
                                      </div>
                                      <div>
                                        <span className="text-on-surface-variant">Category</span>
                                        <p className="text-on-surface font-semibold">{card.category}</p>
                                      </div>
                                      <div>
                                        <span className="text-on-surface-variant">Priority</span>
                                        <p className="text-primary font-semibold">{card.priority}</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center justify-end gap-2 pt-2">
                                      <button
                                        onClick={() => navigate('/complaints')}
                                        className="px-4 py-1.5 rounded-lg bg-primary-container hover:bg-secondary-container text-on-primary text-label-sm font-label-sm font-semibold transition-all"
                                      >
                                        Dispatch Care Ticket
                                      </button>
                                    </div>
                                  </div>
                                )}

                                {card.type === 'spatial' && (
                                  <div className="col-span-full">
                                    <div className="flex items-center justify-between pb-2">
                                      <span className="font-bold text-on-surface text-label-md">{card.building}</span>
                                      <span className="px-2 py-0.5 rounded bg-primary-container text-on-primary text-caption font-bold">{card.room}</span>
                                    </div>
                                    <p className="text-caption text-on-surface-variant">Occupancy: {card.occupancy} • Temp: {card.temp}</p>
                                    {card.distance && <p className="text-caption text-primary font-mono mt-1">{card.distance}</p>}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between px-1 text-caption font-caption text-on-surface-variant">
                        <span>{msg.time}</span>
                        <span className="font-mono text-primary-fixed">{msg.engineName || engineMode}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-surface-container max-w-sm border border-outline-variant/30">
                <span className="material-symbols-outlined text-primary text-[20px] animate-spin">auto_awesome</span>
                <span className="text-body-sm font-body-sm text-on-surface animate-pulse">NextCampus AI is reasoning &amp; fetching spatial telemetry...</span>
              </div>
            )}

            {errorMessage && (
              <div className="p-3 rounded-xl bg-error-container text-on-error-container text-caption font-caption flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">error</span>
                <span>{errorMessage}</span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* SUGGESTED PROMPT CHIPS DOCK */}
          <div className="px-space-md py-2 bg-surface-container-low border-t border-outline-variant/20">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-caption font-caption text-on-surface-variant uppercase tracking-wider shrink-0 font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-primary">tips_and_updates</span> Quick:
              </span>
              {[
                'Directions to Turing B-204',
                'Find quiet study pods in Library',
                'Report classroom AV projector issue',
                'Prof. Ananya Roy office hours',
                'My timetable & next class',
                'Campus EV Shuttle schedule',
                'Dining Hall & Cafeteria hours',
                'Hostel maintenance request'
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChipClick(chip)}
                  className="prompt-chip shrink-0 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-label-sm font-label-sm transition-all border border-slate-200 whitespace-nowrap font-medium"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* INTERACTIVE MESSAGE INPUT DOCK */}
          <div className="p-space-md bg-surface-container-low border-t border-outline-variant/20 shadow-md">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="relative rounded-2xl bg-surface-container shadow-inner p-2 flex flex-col gap-2 border border-outline-variant/30"
            >
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Ask NextCampus AI about rooms, wayfinding, faculty, timetable, or care tickets..."
                rows="2"
                className="w-full bg-transparent text-on-surface placeholder:text-on-surface-variant/70 text-body-md font-body-md resize-none px-2 py-1 focus:outline-none"
              ></textarea>
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1">
                  <button type="button" className="p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors" title="Attach blueprint or photo">
                    <span className="material-symbols-outlined text-[20px]">attach_file</span>
                  </button>
                  <button type="button" className="p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors" title="Spatial voice prompt">
                    <span className="material-symbols-outlined text-[20px]">mic</span>
                  </button>
                  <button type="button" className="p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors" title="Add location pin">
                    <span className="material-symbols-outlined text-[20px]">add_location_alt</span>
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-caption font-caption text-on-surface-variant hidden sm:inline">Press Enter to send</span>
                  <button
                    type="submit"
                    disabled={isLoading || !inputValue.trim()}
                    className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#9E153E] hover:bg-[#831843] text-white shadow-sm transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
                  </button>
                </div>
              </div>
            </form>
            <p className="text-caption font-caption text-slate-400 text-center mt-2">
              NextCampus AI assists with campus locations, schedules, directories, and facilities.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AiAssistant;
