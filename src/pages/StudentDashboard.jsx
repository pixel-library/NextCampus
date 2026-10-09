import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  DoorOpen,
  LifeBuoy,
  Bot,
  Send,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Thermometer,
  Users,
  Compass,
  Code,
  Zap,
  Activity,
  Award,
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Input from '../components/common/Input';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  const studentName = user ? user.name : 'Aarav';
  const studentDept = user ? `${user.department || 'Computer Science & Engineering'} '27` : "Computer Science & Engineering '27 (Honors Track)";

  const handleAiSubmit = async (e) => {
    e?.preventDefault();
    if (!aiPrompt.trim()) return;

    setAiLoading(true);
    try {
      const res = await api.post('/ai/query', { prompt: aiPrompt });
      if (res.success && res.data) {
        setAiResponse(res.data);
      }
    } catch (err) {
      console.error('AI query error:', err);
      setAiResponse({
        reply: `SmartRooms currently report 84% occupancy in the Academic Block. Central Library quiet pods remain available until 6:00 PM.`,
        suggestedAction: '/smartroom'
      });
    } finally {
      setAiLoading(false);
    }
  };

  const handleChipClick = (text) => {
    setAiPrompt(text);
    setAiLoading(true);
    setTimeout(() => {
      if (text.includes('Prof. Roy')) {
        setAiResponse({ reply: "Prof. Ananya Roy is currently in Room B-204 leading CS-301. Office hours start at 2:00 PM in Faculty Block 3.", suggestedAction: "/directory" });
      } else if (text.includes('study pod')) {
        setAiResponse({ reply: "Library Pod 4B is reserved for you from 4:00 PM – 6:00 PM today. Entry PIN: 4920.", suggestedAction: "/smartroom" });
      } else {
        setAiResponse({ reply: "The nearest available color printer is located on the 2nd Floor Library Commons (Node PRT-04). Queue: 0 jobs.", suggestedAction: "/campus-map" });
      }
      setAiLoading(false);
    }, 400);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', maxWidth: '1280px', margin: '0 auto' }}>
      {/* 1. PERSONALIZED WELCOME & METRICS HEADER */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
              <Badge status="active">Fall Semester 2026 • Week 7</Badge>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                NextCampus Institute of Technology • Active Node #04
              </span>
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
              Good morning, {studentName}! ☀️
            </h1>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{studentDept}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--brand-accent)' }} />
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--brand-misty)' }}>
              Central Campus • All Facility Systems Normal
            </span>
          </div>
        </div>

        {/* 4 Quick Metrics Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          {/* Card 1 */}
          <Card interactive style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Daily Schedule</span>
              <Calendar size={18} style={{ color: 'var(--brand-primary)' }} />
            </div>
            <div style={{ marginTop: '12px' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF' }}>3 Classes</div>
              <div style={{ fontSize: '12px', color: 'var(--brand-accent)', marginTop: '4px', fontWeight: 600 }}>
                Next: CS-301 in 25 mins
              </div>
            </div>
          </Card>

          {/* Card 2 */}
          <Card interactive style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Active Care Ticket</span>
              <LifeBuoy size={18} style={{ color: 'var(--brand-accent)' }} />
            </div>
            <div style={{ marginTop: '12px' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF' }}>1 In Progress</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', display: 'flex', justifyContent: 'space-between' }}>
                <span>Ticket #CMP-1042</span>
                <span style={{ color: 'var(--brand-misty)', fontWeight: 600 }}>ETA 25m</span>
              </div>
            </div>
          </Card>

          {/* Card 3 */}
          <Card interactive style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Reserved SmartRooms</span>
              <DoorOpen size={18} style={{ color: 'var(--brand-misty)' }} />
            </div>
            <div style={{ marginTop: '12px' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF' }}>2 Bookings</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Library Pod 4B Confirmed
              </div>
            </div>
          </Card>

          {/* Card 4 */}
          <Card interactive style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Campus IoT Mesh</span>
              <Activity size={18} style={{ color: 'var(--brand-primary)' }} />
            </div>
            <div style={{ marginTop: '12px' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF' }}>100% Online</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                98 telemetry nodes active
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* 2. TACTILE QUICK ACTIONS TOOLBAR */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <button
          onClick={() => navigate('/campus-map')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '14px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-interactive)',
            borderRadius: 'var(--radius-md)',
            color: '#FFFFFF',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Compass size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '14px' }}>Campus Map</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>3D Indoor & Outdoor routes</div>
          </div>
        </button>

        <button
          onClick={() => navigate('/smartroom')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '14px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-interactive)',
            borderRadius: 'var(--radius-md)',
            color: '#FFFFFF',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(235, 99, 139, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EB638B' }}>
            <DoorOpen size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '14px' }}>Find a SmartRoom</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>1-click study pod reservations</div>
          </div>
        </button>

        <button
          onClick={() => navigate('/directory')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '14px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-interactive)',
            borderRadius: 'var(--radius-md)',
            color: '#FFFFFF',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(255, 217, 218, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFD9DA' }}>
            <Users size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '14px' }}>Campus Directory</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Faculty hours & staff desk</div>
          </div>
        </button>

        <button
          onClick={() => navigate('/complaints')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '14px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-interactive)',
            borderRadius: 'var(--radius-md)',
            color: '#FFFFFF',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(147, 0, 10, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFB4AB' }}>
            <LifeBuoy size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '14px' }}>Report Issue</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Fast Care ticket dispatch</div>
          </div>
        </button>
      </section>

      {/* 3. MAIN DASHBOARD CONTENT GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', alignItems: 'start' }}>
        {/* LEFT MAIN COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', gridColumn: 'span 2' }}>
          {/* A. TODAY'S ACADEMIC SCHEDULE */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={20} style={{ color: 'var(--brand-primary)' }} />
                <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Academic Schedule</h2>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Monday, Oct 12 • 3 Sessions</span>
            </div>

            {/* Next Up Hero Class Card */}
            <Card style={{ borderLeft: '4px solid var(--brand-primary)', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Badge status="active">IN 25 MINS • 10:00 AM – 11:30 AM</Badge>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Lecture Hall #B</span>
                  </div>
                  <h3 style={{ fontSize: '1.2rem', color: '#FFFFFF', margin: 0 }}>
                    CS-301: Distributed Systems & Cloud Infrastructure
                  </h3>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <span>Instructor: <strong style={{ color: '#FFFFFF' }}>Prof. Ananya Roy</strong></span>
                    <span>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={14} style={{ color: 'var(--brand-accent)' }} />
                      Turing Hall, Room B-204
                    </span>
                  </div>
                </div>

                <div style={{ backgroundColor: 'var(--bg-canvas)', padding: '10px 14px', borderRadius: '8px', fontSize: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--brand-misty)' }}>
                    <Thermometer size={14} />
                    <span>21.8°C Comfort</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    <Users size={14} />
                    <span>48/60 seats</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', pt: '12px', borderTop: '1px solid var(--border-subtle)', flexWrap: 'wrap', gap: '12px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Smart Projector Ready • Airflow Optimal
                </span>
                <Button variant="primary" size="sm" icon={Navigation} onClick={() => navigate('/campus-map')}>
                  Navigate to Room (3 min walk)
                </Button>
              </div>
            </Card>

            {/* Later Sessions Timeline */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ backgroundColor: 'var(--bg-surface)', padding: '12px 16px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--brand-misty)', backgroundColor: 'var(--bg-surface-elevated)', padding: '4px 8px', borderRadius: '6px' }}>
                    1:00 PM – 2:30 PM
                  </span>
                  <div>
                    <div style={{ fontWeight: 600, color: '#FFFFFF', fontSize: '13px' }}>MATH-240: Linear Algebra & Neural Nets</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Ramanujan Science Block, Room S-108 • Prof. K. Venkatesh</div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" icon={Compass} onClick={() => navigate('/campus-map')} />
              </div>

              <div style={{ backgroundColor: 'var(--bg-surface)', padding: '12px 16px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--brand-accent)', backgroundColor: 'var(--bg-surface-elevated)', padding: '4px 8px', borderRadius: '6px' }}>
                    3:15 PM – 5:00 PM
                  </span>
                  <div>
                    <div style={{ fontWeight: 600, color: '#FFFFFF', fontSize: '13px' }}>CS-305: Embedded IoT Systems Lab</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Innovation Hub, Hardware Lab 4 • Bench #14 Reserved</div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" icon={Compass} onClick={() => navigate('/campus-map')} />
              </div>
            </div>
          </section>

          {/* B. DIGITAL TWIN & LIVE WAYFINDING PREVIEW */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={20} style={{ color: 'var(--brand-primary)' }} />
                <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Digital Twin & Live Wayfinding</h2>
              </div>
              <Link to="/campus-map" style={{ fontSize: '12px', color: 'var(--brand-accent)', fontWeight: 600 }}>
                View Full Interactive Map →
              </Link>
            </div>

            <Card style={{ padding: '0', overflow: 'hidden' }}>
              <div style={{ position: 'relative', height: '240px', width: '100%', backgroundColor: '#161213' }}>
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBf9GggO2878hSOBwyC9jOGK_ul92QgPwCrbIO1fCXbZ2hMDBi1yob2ACl2vEyc4wH3L_1QJqZnxheFSBbWxU5K4huTjzXRdbeSfwPDDXt_LH6c_h3FAZzxPexlEOL7OOZ5Dzi9SFHsbPu_scz4L0iG5vXMYZhTDHIRHbwGZle98jLnVmhN_PgyjvPz_ThYGwNvX0_wBgtQG3A_llHoIUOYsW9vJ2v0D3ICSdYKxrWnZnz-dDz2ua60Q"
                  alt="Campus spatial twin"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--bg-surface) 0%, transparent 80%)' }} />
                
                <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                  <Badge status="active">250m covered pathway • Skybridge active</Badge>
                </div>
              </div>

              <div style={{ padding: '16px', display: 'flex', gap: '10px' }}>
                <Input placeholder="Quick find building, lab, cafe or auditorium..." icon={Search} />
                <Button variant="secondary" onClick={() => navigate('/campus-map')}>
                  Map
                </Button>
              </div>
            </Card>
          </section>

          {/* C. CAMPUS BULLETINS & ANNOUNCEMENTS */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Campus Bulletins & Notices</h2>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Live Feed</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Card>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--brand-misty)', marginBottom: '4px' }}>
                  <span>INFRASTRUCTURE</span>
                  <span>4:00 PM Today</span>
                </div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#FFFFFF' }}>
                  Central Library 3rd Floor East Wing Network Upgrade
                </h4>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>
                  Wi-Fi AP nodes 12–16 will undergo firmware re-indexing. Quiet study pods in West Wing remain fully connected.
                </p>
              </Card>

              <Card>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--brand-accent)', marginBottom: '4px' }}>
                  <span>ACADEMIC • HACKATHON</span>
                  <span>Due Oct 18</span>
                </div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#FFFFFF' }}>
                  MU Hackathon 2026 Project Milestone Submissions Open
                </h4>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>
                  Teams registered in AI, Autonomous Robotics, and Smart Grid verticals can submit interim architecture docs via SkillCampus portal.
                </p>
              </Card>
            </div>
          </section>
        </div>

        {/* RIGHT SIDEBAR COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* A. NEXTCAMPUS AI COPILOT CARD */}
          <Card style={{ background: 'linear-gradient(180deg, var(--bg-surface) 0%, rgba(25, 21, 22, 0.95) 100%)', border: '1px solid var(--border-interactive)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>
                  <Bot size={18} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '14px', color: '#FFFFFF' }}>NextCampus AI</h3>
                  <span style={{ fontSize: '11px', color: 'var(--brand-accent)' }}>Active Campus Copilot</span>
                </div>
              </div>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', backgroundColor: 'var(--bg-canvas)', padding: '2px 6px', borderRadius: '4px' }}>
                GPT-Campus
              </span>
            </div>

            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px', backgroundColor: 'var(--bg-canvas)', padding: '10px', borderRadius: '8px' }}>
              Hi {studentName}! Need a quiet space or walking directions to Turing Hall? Tap a prompt or ask me below:
            </p>

            {/* Quick Prompt Chips */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
              <button
                onClick={() => handleChipClick("Where is Prof. Roy's office right now?")}
                style={{ textAlign: 'left', padding: '8px 10px', backgroundColor: 'var(--bg-surface-elevated)', border: 'none', borderRadius: '6px', color: 'var(--text-secondary)', fontSize: '12px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}
              >
                <span>“Where is Prof. Roy's office right now?”</span>
                <ArrowRight size={14} style={{ color: 'var(--brand-accent)' }} />
              </button>
              <button
                onClick={() => handleChipClick("Book quiet study pod for 4:00 PM")}
                style={{ textAlign: 'left', padding: '8px 10px', backgroundColor: 'var(--bg-surface-elevated)', border: 'none', borderRadius: '6px', color: 'var(--text-secondary)', fontSize: '12px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}
              >
                <span>“Book quiet study pod for 4:00 PM”</span>
                <ArrowRight size={14} style={{ color: 'var(--brand-accent)' }} />
              </button>
              <button
                onClick={() => handleChipClick("Where is the nearest open color printer?")}
                style={{ textAlign: 'left', padding: '8px 10px', backgroundColor: 'var(--bg-surface-elevated)', border: 'none', borderRadius: '6px', color: 'var(--text-secondary)', fontSize: '12px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}
              >
                <span>“Where is nearest open color printer?”</span>
                <ArrowRight size={14} style={{ color: 'var(--brand-accent)' }} />
              </button>
            </div>

            {/* AI Response Output */}
            {aiResponse && (
              <div style={{ backgroundColor: 'rgba(172, 39, 79, 0.15)', border: '1px solid var(--border-interactive)', padding: '10px', borderRadius: '8px', fontSize: '12px', color: '#FFFFFF', marginBottom: '12px' }}>
                <div>{aiResponse.reply}</div>
                {aiResponse.suggestedAction && (
                  <button
                    onClick={() => navigate(aiResponse.suggestedAction)}
                    style={{ marginTop: '8px', background: 'none', border: 'none', color: 'var(--brand-accent)', fontWeight: 600, fontSize: '11px', cursor: 'pointer', padding: 0 }}
                  >
                    Open Feature →
                  </button>
                )}
              </div>
            )}

            {/* Live Prompt Input */}
            <form onSubmit={handleAiSubmit} style={{ display: 'flex', gap: '6px' }}>
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Ask anything about timetable or labs..."
                style={{ flex: 1, padding: '8px 12px', backgroundColor: 'var(--bg-canvas)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: '#FFF', fontSize: '12px', outline: 'none' }}
              />
              <Button type="submit" variant="primary" size="sm" disabled={aiLoading}>
                <Send size={14} />
              </Button>
            </form>
          </Card>

          {/* B. UPCOMING DEADLINES WIDGET */}
          <Card>
            <h3 style={{ fontSize: '14px', margin: '0 0 12px 0', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={16} style={{ color: 'var(--brand-accent)' }} />
              Upcoming Deadlines
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
              <div style={{ backgroundColor: 'var(--bg-canvas)', padding: '10px', borderRadius: '8px' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--brand-accent)' }}>TODAY • 11:59 PM</span>
                <div style={{ fontWeight: 600, color: '#FFFFFF', marginTop: '2px' }}>Distributed Systems Lab 3</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>CS-301 Git Tag: v0.3.1</div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-canvas)', padding: '10px', borderRadius: '8px' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--brand-misty)' }}>TOMORROW • 2:00 PM</span>
                <div style={{ fontWeight: 600, color: '#FFFFFF', marginTop: '2px' }}>Robotics Club Project Review</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Room C-102 Milestone</div>
              </div>
            </div>
          </Card>

          {/* C. MY ACTIVE REQUESTS & RESERVATIONS WIDGET */}
          <Card>
            <h3 style={{ fontSize: '14px', margin: '0 0 12px 0', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} style={{ color: 'var(--brand-accent)' }} />
              My Active Requests
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
              <div style={{ backgroundColor: 'var(--bg-canvas)', padding: '10px', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--brand-accent)', fontSize: '11px', fontWeight: 600 }}>
                  <span>#CMP-1042</span>
                  <span>In Progress</span>
                </div>
                <div style={{ fontWeight: 600, color: '#FFFFFF', marginTop: '4px' }}>CS Lab B Projector Glitch</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>ETA: 25 mins</div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-canvas)', padding: '10px', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--brand-misty)', fontSize: '11px', fontWeight: 600 }}>
                  <span>#RS-882</span>
                  <span>Confirmed</span>
                </div>
                <div style={{ fontWeight: 600, color: '#FFFFFF', marginTop: '4px' }}>Group Study Room C-102</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Today: 4:00 PM – 6:00 PM • PIN: 4920</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
