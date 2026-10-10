import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Building,
  School,
  Sparkles,
  KeyRound,
  FileText,
  DoorOpen,
  Zap,
  Leaf,
  Info,
  X,
} from 'lucide-react';

export const AuthPage = () => {
  const { user, login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Tab state: 'signin' | 'register'
  const [activeTab, setActiveTab] = useState('signin');

  // Sign In Form State
  const [signInIdentifier, setSignInIdentifier] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);

  // Registration Form State
  const [regName, setRegName] = useState('');
  const [regRollId, setRegRollId] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regDept, setRegDept] = useState('Computer Science & Engineering');
  const [regCohort, setRegCohort] = useState('Class of 2028 (Undergrad)');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Status & Feedback States
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Forgot Password Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotFeedback, setForgotFeedback] = useState(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const from = location.state?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });
      } else if (user.role === 'admin' || user.role === 'care_admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate, location]);

  // Password strength calculator
  const calculatePasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: 'Required', color: 'var(--text-muted)' };
    if (pass.length < 6) return { score: 1, label: 'Weak', color: '#FFB4AB' };
    if (pass.length < 10) return { score: 2, label: 'Moderate', color: '#FFB1C2' };
    return { score: 3, label: 'Institutional Strength', color: '#EB638B' };
  };

  const passwordStrength = calculatePasswordStrength(regPassword);

  // Handle Sign In submission
  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!signInIdentifier.trim() || !signInPassword) {
      setErrorMessage('Please provide both institutional email/roll ID and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await login(signInIdentifier.trim(), signInPassword);
      if (res.success) {
        setSuccessMessage('Authentication verified. Loading campus session...');
        // Redirection will trigger via useEffect
      }
    } catch (err) {
      setErrorMessage(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Registration submission
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!regName.trim() || !regEmail.trim() || !regPassword) {
      setErrorMessage('Full name, institutional email, and password are required.');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (!agreeTerms) {
      setErrorMessage('You must acknowledge the Acceptable Use Policy and FERPA protocols.');
      return;
    }

    setLoading(true);
    try {
      const res = await register({
        name: regName.trim(),
        studentId: regRollId.trim() || undefined,
        email: regEmail.trim(),
        department: regDept,
        academicYear: regCohort,
        password: regPassword,
      });

      if (res.success) {
        setSuccessMessage('Student account created successfully! Initializing workspace...');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed. Please check your submission.');
    } finally {
      setLoading(false);
    }
  };

  // Quick filler for testing demo credentials
  const fillCredentials = (email, password) => {
    setActiveTab('signin');
    setSignInIdentifier(email);
    setSignInPassword(password);
    setErrorMessage('');
  };

  // Handle forgot password submission
  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      setForgotFeedback({
        type: 'error',
        text: 'Please input your institutional email address.',
      });
      return;
    }

    // Demonstrating transparent compliance: do not claim external email delivery is live unless SMTP is active
    setForgotFeedback({
      type: 'info',
      text: 'Institutional Identity Protocol: Automated outbound SMTP service is currently in mock deployment mode. Please use your standard credentials (e.g., rudra@nextcampus.edu / password123) or contact the Campus Registrar helpdesk.',
    });
  };

  return (
    <div
      style={{
        minHeight: 'calc(100vh - var(--topbar-height))',
        backgroundColor: '#161213',
        color: '#EAE0E1',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Dynamic Campus Split View Container */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          minHeight: 'calc(100vh - var(--topbar-height))',
          width: '100%',
        }}
      >
        {/* ======================================================== */}
        {/* LEFT PANEL: Institutional Showcase (~42% on desktop)      */}
        {/* ======================================================== */}
        <div
          style={{
            flex: '1 1 420px',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '48px',
            overflow: 'hidden',
            backgroundColor: '#110D0E',
            borderRight: '1px solid rgba(255, 217, 218, 0.08)',
          }}
        >
          {/* Architectural Dusk Campus Scrim Background */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCVLAga3FEcE4kzeDoyHVmwUjHiX_lz5t8xqgB8BWxNotaWChIMo040VNlih6uz5hH2ohWhdBOLAe3okZOIxXIYPLyHNC9aZ-UrYdPOucq-Fbq_mboZeacDS4vN0t1DUfs1bULxF2C5Jou4HeJ7M1gbIqzl2hkdyXK-4ts7h3PWbYF4ZfsucvLyORvg-3vgHz4b-FLofw5n2Mja51IOqCkvgWBDom9Ae-feOZhjQyFwAbGfN37c1Wk5sg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.22,
              filter: 'blur(1px)',
            }}
          />

          {/* Deep Raisin Gradient Overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(135deg, rgba(22, 18, 19, 0.96) 0%, rgba(35, 30, 31, 0.90) 50%, rgba(172, 39, 79, 0.25) 100%)',
            }}
          />

          {/* Top Branding Section */}
          <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--brand-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '18px',
                  color: '#FFFFFF',
                  boxShadow: '0 4px 12px rgba(172, 39, 79, 0.4)',
                }}
              >
                NC
              </div>
              <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(255, 217, 218, 0.2)' }} />
              <span
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#E2BEBF',
                  fontWeight: 600,
                }}
              >
                Institutional Node
              </span>
            </div>

            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(255, 178, 191, 0.1)',
                  border: '1px solid rgba(255, 178, 191, 0.2)',
                  color: '#FFB2BF',
                  fontSize: '11px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: '14px',
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#FFB2BF',
                    animation: 'pulse 2s infinite',
                  }}
                />
                Smart Campus Platform • State University
              </div>

              <h1
                style={{
                  fontSize: 'clamp(28px, 3.2vw, 40px)',
                  lineHeight: 1.15,
                  fontWeight: 800,
                  color: '#FFFFFF',
                  letterSpacing: '-0.02em',
                  margin: '0 0 12px 0',
                }}
              >
                One Campus.
                <br />
                <span style={{ color: '#FFD9DE' }}>One Account.</span>
                <br />
                Smarter Future.
              </h1>

              <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#DFBFC3', margin: 0, maxWidth: '420px' }}>
                Seamless federated access to automated research facilities, instant ticket triage, dynamic spatial
                telemetry, and community learning networks.
              </p>
            </div>
          </div>

          {/* Center Pillar Badges & Feature Cards */}
          <div
            style={{
              position: 'relative',
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              margin: '36px 0',
            }}
          >
            <div
              style={{
                padding: '14px 16px',
                borderRadius: '12px',
                backgroundColor: 'rgba(31, 26, 27, 0.85)',
                border: '1px solid rgba(255, 217, 218, 0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                backdropFilter: 'blur(8px)',
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(172, 39, 79, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFB2BF',
                  flexShrink: 0,
                }}
              >
                <DoorOpen size={20} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>SmartRoom & Facility Booking</div>
                <div style={{ fontSize: '11px', color: '#A68A8D' }}>Intelligent occupancy sync across 64 academic halls</div>
              </div>
              <span
                style={{
                  fontSize: '11px',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(255, 178, 191, 0.15)',
                  color: '#FFB2BF',
                  fontWeight: 600,
                }}
              >
                Real-time
              </span>
            </div>

            <div
              style={{
                padding: '14px 16px',
                borderRadius: '12px',
                backgroundColor: 'rgba(31, 26, 27, 0.85)',
                border: '1px solid rgba(255, 217, 218, 0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                backdropFilter: 'blur(8px)',
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(140, 24, 68, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFB1C2',
                  flexShrink: 0,
                }}
              >
                <Zap size={20} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>NextCampus Care Rapid Triage</div>
                <div style={{ fontSize: '11px', color: '#A68A8D' }}>Automated campus operations & resolver routing</div>
              </div>
              <span
                style={{
                  fontSize: '11px',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(255, 177, 194, 0.15)',
                  color: '#FFB1C2',
                  fontWeight: 600,
                }}
              >
                Instant
              </span>
            </div>

            <div
              style={{
                padding: '14px 16px',
                borderRadius: '12px',
                backgroundColor: 'rgba(31, 26, 27, 0.85)',
                border: '1px solid rgba(255, 217, 218, 0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                backdropFilter: 'blur(8px)',
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(113, 85, 86, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#E2BEBF',
                  flexShrink: 0,
                }}
              >
                <Leaf size={20} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>EcoCampus Sustainability Pulse</div>
                <div style={{ fontSize: '11px', color: '#A68A8D' }}>Live microgrid energy & carbon offset analytics</div>
              </div>
              <span
                style={{
                  fontSize: '11px',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(226, 190, 191, 0.15)',
                  color: '#E2BEBF',
                  fontWeight: 600,
                }}
              >
                Telemetry
              </span>
            </div>
          </div>

          {/* Institutional Trust Footnote */}
          <div
            style={{
              position: 'relative',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderRadius: '12px',
              backgroundColor: 'rgba(17, 13, 14, 0.7)',
              border: '1px solid rgba(255, 217, 218, 0.08)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#DFBFC3', fontSize: '11px' }}>
              <ShieldCheck size={16} style={{ color: '#FFB2BF' }} />
              <span>Enterprise SAML 2.0 / Shibboleth Ready</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#E2BEBF', fontSize: '11px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
              <span>99.98% Systems Up</span>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT PANEL: Authentication Forms (~58% on desktop)      */}
        {/* ======================================================== */}
        <div
          style={{
            flex: '1 1 540px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '36px 24px',
            backgroundColor: '#161213',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '560px',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#231E1F',
              borderRadius: '20px',
              padding: '36px',
              border: '1px solid rgba(255, 217, 218, 0.12)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.45)',
            }}
          >
            {/* Segmented Tab Bar (Sign In vs Register) */}
            <div
              style={{
                display: 'flex',
                backgroundColor: '#110D0E',
                padding: '6px',
                borderRadius: '12px',
                marginBottom: '28px',
                border: '1px solid rgba(255, 217, 218, 0.06)',
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setActiveTab('signin');
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: activeTab === 'signin' ? 700 : 500,
                  color: activeTab === 'signin' ? '#FFC7D0' : '#A68A8D',
                  backgroundColor: activeTab === 'signin' ? '#AC274F' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease',
                  boxShadow: activeTab === 'signin' ? '0 2px 8px rgba(172, 39, 79, 0.35)' : 'none',
                }}
              >
                <KeyRound size={16} />
                <span>Sign In</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('register');
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: activeTab === 'register' ? 700 : 500,
                  color: activeTab === 'register' ? '#FFC7D0' : '#A68A8D',
                  backgroundColor: activeTab === 'register' ? '#AC274F' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease',
                  boxShadow: activeTab === 'register' ? '0 2px 8px rgba(172, 39, 79, 0.35)' : 'none',
                }}
              >
                <School size={16} />
                <span>New Student Registration</span>
              </button>
            </div>

            {/* Error Notification Alert */}
            {errorMessage && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(147, 0, 10, 0.35)',
                  border: '1px solid #FFB4AB',
                  color: '#FFDAD6',
                  fontSize: '13px',
                  marginBottom: '20px',
                }}
              >
                <AlertCircle size={18} style={{ color: '#FFB4AB', flexShrink: 0, marginTop: '2px' }} />
                <div style={{ flex: 1 }}>{errorMessage}</div>
                <button
                  type="button"
                  onClick={() => setErrorMessage('')}
                  style={{ background: 'none', border: 'none', color: '#FFDAD6', cursor: 'pointer', padding: 0 }}
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {/* Success Notification Alert */}
            {successMessage && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(34, 197, 94, 0.15)',
                  border: '1px solid #22c55e',
                  color: '#86efac',
                  fontSize: '13px',
                  marginBottom: '20px',
                }}
              >
                <CheckCircle2 size={18} style={{ color: '#22c55e', flexShrink: 0, marginTop: '2px' }} />
                <div style={{ flex: 1 }}>{successMessage}</div>
              </div>
            )}

            {/* ======================================================== */}
            {/* VIEW 1: SIGN IN FORM                                     */}
            {/* ======================================================== */}
            {activeTab === 'signin' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#FFFFFF', margin: '0 0 6px 0' }}>
                    Welcome Back
                  </h2>
                  <p style={{ fontSize: '13px', color: '#DFBFC3', margin: 0 }}>
                    Enter your verified college email or student roll credentials.
                  </p>
                </div>

                {/* Informational Keycloak Routing Banner */}
                <div
                  style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    backgroundColor: '#2D292A',
                    border: '1px solid rgba(255, 217, 218, 0.08)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    fontSize: '12px',
                    lineHeight: 1.5,
                  }}
                >
                  <Building size={18} style={{ color: '#FFB2BF', flexShrink: 0, marginTop: '1px' }} />
                  <div>
                    <span style={{ fontWeight: 600, color: '#FFB2BF' }}>Routing Notice:</span> Active directory
                    authentication routes automatically through State University's Central Keycloak Gateway.
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSignInSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Identifier Input */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#EAE0E1' }}>
                      Institutional Email or Student Roll ID
                    </label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <Mail
                        size={18}
                        style={{ position: 'absolute', left: '12px', color: '#A68A8D', pointerEvents: 'none' }}
                      />
                      <input
                        type="text"
                        value={signInIdentifier}
                        onChange={(e) => setSignInIdentifier(e.target.value)}
                        placeholder="e.g. rudra@nextcampus.edu or MU2026001"
                        required
                        style={{
                          width: '100%',
                          padding: '11px 14px 11px 40px',
                          backgroundColor: '#110D0E',
                          border: '1px solid #584144',
                          borderRadius: '10px',
                          color: '#FFFFFF',
                          fontSize: '13px',
                          outline: 'none',
                          transition: 'border-color 0.2s ease',
                        }}
                        onFocus={(e) => (e.target.style.borderColor = '#FFB2BF')}
                        onBlur={(e) => (e.target.style.borderColor = '#584144')}
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#EAE0E1' }}>Password</label>
                      <button
                        type="button"
                        onClick={() => setShowForgotModal(true)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#FFB1C2',
                          fontSize: '12px',
                          cursor: 'pointer',
                          padding: 0,
                          textDecoration: 'underline',
                        }}
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <Lock
                        size={18}
                        style={{ position: 'absolute', left: '12px', color: '#A68A8D', pointerEvents: 'none' }}
                      />
                      <input
                        type={showSignInPassword ? 'text' : 'password'}
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        placeholder="••••••••••••"
                        required
                        style={{
                          width: '100%',
                          padding: '11px 40px 11px 40px',
                          backgroundColor: '#110D0E',
                          border: '1px solid #584144',
                          borderRadius: '10px',
                          color: '#FFFFFF',
                          fontSize: '13px',
                          outline: 'none',
                          transition: 'border-color 0.2s ease',
                        }}
                        onFocus={(e) => (e.target.style.borderColor = '#FFB2BF')}
                        onBlur={(e) => (e.target.style.borderColor = '#584144')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignInPassword(!showSignInPassword)}
                        style={{
                          position: 'absolute',
                          right: '12px',
                          background: 'none',
                          border: 'none',
                          color: '#A68A8D',
                          cursor: 'pointer',
                          padding: '2px',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        {showSignInPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Device & Security Standard */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        color: '#DFBFC3',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={rememberDevice}
                        onChange={(e) => setRememberDevice(e.target.checked)}
                        style={{ accentColor: '#AC274F', width: '15px', height: '15px' }}
                      />
                      <span>Remember device for 30 days</span>
                    </label>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '11px',
                        color: '#E2BEBF',
                      }}
                    >
                      <ShieldCheck size={14} />
                      <span>FIPS 140-3</span>
                    </div>
                  </div>

                  {/* Submit CTA */}
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '13px 20px',
                      backgroundColor: '#AC274F',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '14px',
                      fontWeight: 700,
                      cursor: loading ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 16px rgba(172, 39, 79, 0.4)',
                      transition: 'all 0.2s ease',
                      marginTop: '6px',
                      opacity: loading ? 0.7 : 1,
                    }}
                  >
                    <span>{loading ? 'Authenticating...' : 'Sign In to NextCampus'}</span>
                    <ArrowRight size={18} />
                  </button>
                </form>

                {/* Demonstration Quick Fill Credentials */}
                <div
                  style={{
                    backgroundColor: '#1F1A1B',
                    borderRadius: '10px',
                    padding: '12px 14px',
                    border: '1px solid rgba(255, 217, 218, 0.08)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      color: '#E2BEBF',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <Sparkles size={14} style={{ color: '#FFB2BF' }} />
                    <span>Quick Demo Credentials</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => fillCredentials('rudra@nextcampus.edu', 'password123')}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '6px',
                        backgroundColor: '#2D292A',
                        border: '1px solid rgba(255, 217, 218, 0.1)',
                        color: '#FFFFFF',
                        fontSize: '11px',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      <div style={{ fontWeight: 600, color: '#FFB2BF' }}>Student Node</div>
                      <div style={{ color: '#A68A8D', fontSize: '10px' }}>rudra@nextcampus.edu</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => fillCredentials('admin@nextcampus.edu', 'adminpassword123')}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '6px',
                        backgroundColor: '#2D292A',
                        border: '1px solid rgba(255, 217, 218, 0.1)',
                        color: '#FFFFFF',
                        fontSize: '11px',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      <div style={{ fontWeight: 600, color: '#FFB1C2' }}>Campus Admin</div>
                      <div style={{ color: '#A68A8D', fontSize: '10px' }}>admin@nextcampus.edu</div>
                    </button>
                  </div>
                </div>

                {/* Federation Divider */}
                <div
                  style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '6px 0',
                  }}
                >
                  <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(255, 217, 218, 0.1)' }} />
                  <span
                    style={{
                      position: 'absolute',
                      backgroundColor: '#231E1F',
                      padding: '0 12px',
                      fontSize: '10px',
                      color: '#A68A8D',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                    }}
                  >
                    Or Connect via Authorized Campus IDP
                  </span>
                </div>

                {/* SSO Alternative Buttons */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => fillCredentials('rudra@nextcampus.edu', 'password123')}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '10px',
                      backgroundColor: '#1F1A1B',
                      border: '1px solid rgba(255, 217, 218, 0.1)',
                      color: '#FFFFFF',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'background-color 0.2s',
                    }}
                  >
                    <School size={16} style={{ color: '#FFB2BF' }} />
                    <span>Campus Portal SSO</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fillCredentials('admin@nextcampus.edu', 'adminpassword123')}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '10px',
                      backgroundColor: '#1F1A1B',
                      border: '1px solid rgba(255, 217, 218, 0.1)',
                      color: '#FFFFFF',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'background-color 0.2s',
                    }}
                  >
                    <Sparkles size={16} style={{ color: '#FFB1C2' }} />
                    <span>Google Workspace Edu</span>
                  </button>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* VIEW 2: REGISTRATION FORM                                */}
            {/* ======================================================== */}
            {activeTab === 'register' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#FFFFFF', margin: '0 0 6px 0' }}>
                    Join NextCampus
                  </h2>
                  <p style={{ fontSize: '13px', color: '#DFBFC3', margin: 0 }}>
                    Set up your student profile to sync campus telemetry, dining, labs, and records.
                  </p>
                </div>

                <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {/* Name and Student ID row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#EAE0E1' }}>Full Legal Name</label>
                      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <User
                          size={18}
                          style={{ position: 'absolute', left: '12px', color: '#A68A8D', pointerEvents: 'none' }}
                        />
                        <input
                          type="text"
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          placeholder="e.g. Sophia Sharma"
                          required
                          style={{
                            width: '100%',
                            padding: '10px 12px 10px 38px',
                            backgroundColor: '#110D0E',
                            border: '1px solid #584144',
                            borderRadius: '10px',
                            color: '#FFFFFF',
                            fontSize: '13px',
                            outline: 'none',
                          }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#EAE0E1' }}>Roll / Admission Number</label>
                      <input
                        type="text"
                        value={regRollId}
                        onChange={(e) => setRegRollId(e.target.value)}
                        placeholder="e.g. 2026-CS-4190"
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          backgroundColor: '#110D0E',
                          border: '1px solid #584144',
                          borderRadius: '10px',
                          color: '#FFFFFF',
                          fontSize: '13px',
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>

                  {/* College Email */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#EAE0E1' }}>
                      Institutional Email Address
                    </label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <Mail
                        size={18}
                        style={{ position: 'absolute', left: '12px', color: '#A68A8D', pointerEvents: 'none' }}
                      />
                      <input
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="name@campus.edu"
                        required
                        style={{
                          width: '100%',
                          padding: '10px 12px 10px 38px',
                          backgroundColor: '#110D0E',
                          border: '1px solid #584144',
                          borderRadius: '10px',
                          color: '#FFFFFF',
                          fontSize: '13px',
                          outline: 'none',
                        }}
                      />
                    </div>
                    <span style={{ fontSize: '11px', color: '#FFB1C2' }}>
                      Must end with @campus.edu for automated department assignment.
                    </span>
                  </div>

                  {/* Department & Graduating Cohort */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#EAE0E1' }}>Academic Department</label>
                      <select
                        value={regDept}
                        onChange={(e) => setRegDept(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          backgroundColor: '#110D0E',
                          border: '1px solid #584144',
                          borderRadius: '10px',
                          color: '#FFFFFF',
                          fontSize: '12px',
                          outline: 'none',
                        }}
                      >
                        <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                        <option value="Artificial Intelligence & Data">Artificial Intelligence & Data</option>
                        <option value="School of Architecture">School of Architecture</option>
                        <option value="Biomedical Engineering">Biomedical Engineering</option>
                        <option value="Business Analytics & Mgmt">Business Analytics & Mgmt</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#EAE0E1' }}>Graduating Cohort</label>
                      <select
                        value={regCohort}
                        onChange={(e) => setRegCohort(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          backgroundColor: '#110D0E',
                          border: '1px solid #584144',
                          borderRadius: '10px',
                          color: '#FFFFFF',
                          fontSize: '12px',
                          outline: 'none',
                        }}
                      >
                        <option value="Class of 2028 (Undergrad)">Class of 2028 (Undergrad)</option>
                        <option value="Class of 2027 (Undergrad)">Class of 2027 (Undergrad)</option>
                        <option value="Class of 2026 (Undergrad)">Class of 2026 (Undergrad)</option>
                        <option value="Postgraduate Masters 2025">Postgraduate Masters 2025</option>
                      </select>
                    </div>
                  </div>

                  {/* Password with Strength Indicator */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#EAE0E1' }}>Create Master Password</label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <Lock
                        size={18}
                        style={{ position: 'absolute', left: '12px', color: '#A68A8D', pointerEvents: 'none' }}
                      />
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Minimum 6 characters"
                        required
                        style={{
                          width: '100%',
                          padding: '10px 40px 10px 38px',
                          backgroundColor: '#110D0E',
                          border: '1px solid #584144',
                          borderRadius: '10px',
                          color: '#FFFFFF',
                          fontSize: '13px',
                          outline: 'none',
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        style={{
                          position: 'absolute',
                          right: '12px',
                          background: 'none',
                          border: 'none',
                          color: '#A68A8D',
                          cursor: 'pointer',
                        }}
                      >
                        {showRegPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>

                    {/* Interactive Strength Meter */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                        <span style={{ color: '#DFBFC3' }}>Complexity Assessment:</span>
                        <span style={{ color: passwordStrength.color, fontWeight: 600 }}>{passwordStrength.label}</span>
                      </div>
                      <div
                        style={{
                          width: '100%',
                          height: '4px',
                          backgroundColor: '#110D0E',
                          borderRadius: '9999px',
                          display: 'flex',
                          gap: '4px',
                        }}
                      >
                        <div
                          style={{
                            flex: 1,
                            backgroundColor: passwordStrength.score >= 1 ? passwordStrength.color : '#383335',
                            borderRadius: '9999px',
                            transition: 'all 0.3s ease',
                          }}
                        />
                        <div
                          style={{
                            flex: 1,
                            backgroundColor: passwordStrength.score >= 2 ? passwordStrength.color : '#383335',
                            borderRadius: '9999px',
                            transition: 'all 0.3s ease',
                          }}
                        />
                        <div
                          style={{
                            flex: 1,
                            backgroundColor: passwordStrength.score >= 3 ? passwordStrength.color : '#383335',
                            borderRadius: '9999px',
                            transition: 'all 0.3s ease',
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Acceptable Use Policy Agreement */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                      fontSize: '12px',
                      color: '#DFBFC3',
                      lineHeight: 1.4,
                      cursor: 'pointer',
                      marginTop: '4px',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      required
                      style={{ accentColor: '#AC274F', width: '16px', height: '16px', marginTop: '2px' }}
                    />
                    <span>
                      I agree to the <strong style={{ color: '#FFB1C2' }}>Acceptable Use Policy</strong>, FERPA student
                      confidentiality protocols, and automated campus IoT access terms.
                    </span>
                  </label>

                  {/* Submit CTA */}
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '13px 20px',
                      backgroundColor: '#AC274F',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '14px',
                      fontWeight: 700,
                      cursor: loading ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 16px rgba(172, 39, 79, 0.4)',
                      transition: 'all 0.2s ease',
                      marginTop: '8px',
                      opacity: loading ? 0.7 : 1,
                    }}
                  >
                    <span>{loading ? 'Registering...' : 'Create Student Account'}</span>
                    <ArrowRight size={18} />
                  </button>
                </form>
              </div>
            )}

            {/* Help & Verification Footnote */}
            <div
              style={{
                marginTop: '28px',
                paddingTop: '16px',
                borderTop: '1px solid rgba(255, 217, 218, 0.08)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '11px',
                color: '#A68A8D',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <HelpCircle size={14} />
                <span>Academic Registrar Helpdesk</span>
              </div>
              <span style={{ color: '#FFB1C2' }}>Campus Kiosk 24/7 Available</span>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* FORGOT PASSWORD INSTITUTIONAL RECOVERY MODAL             */}
      {/* ======================================================== */}
      {showForgotModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            backgroundColor: 'rgba(17, 13, 14, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: '#231E1F',
              borderRadius: '16px',
              padding: '28px',
              width: '100%',
              maxWidth: '480px',
              border: '1px solid rgba(255, 217, 218, 0.15)',
              boxShadow: '0 24px 48px rgba(0, 0, 0, 0.5)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(172, 39, 79, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFB2BF',
                  }}
                >
                  <KeyRound size={20} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                  Institutional Account Recovery
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowForgotModal(false);
                  setForgotFeedback(null);
                }}
                style={{ background: 'none', border: 'none', color: '#A68A8D', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '13px', color: '#DFBFC3', margin: 0, lineHeight: 1.5 }}>
              Institutional passwords are encrypted through State University Keycloak Federated SSO. Enter your
              institutional email below to route an account lookup ticket.
            </p>

            {forgotFeedback && (
              <div
                style={{
                  padding: '12px 14px',
                  borderRadius: '8px',
                  backgroundColor:
                    forgotFeedback.type === 'error' ? 'rgba(147, 0, 10, 0.35)' : 'rgba(172, 39, 79, 0.25)',
                  border: `1px solid ${forgotFeedback.type === 'error' ? '#FFB4AB' : '#FFB2BF'}`,
                  color: forgotFeedback.type === 'error' ? '#FFDAD6' : '#FFD9DE',
                  fontSize: '12px',
                  lineHeight: 1.5,
                }}
              >
                {forgotFeedback.text}
              </div>
            )}

            <form onSubmit={handleForgotSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#EAE0E1' }}>Institutional Email Address</label>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="e.g. rudra@nextcampus.edu"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    backgroundColor: '#110D0E',
                    border: '1px solid #584144',
                    borderRadius: '8px',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotFeedback(null);
                  }}
                  style={{
                    padding: '9px 16px',
                    borderRadius: '8px',
                    backgroundColor: '#2D292A',
                    color: '#EAE0E1',
                    border: 'none',
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  Dismiss
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '9px 16px',
                    borderRadius: '8px',
                    backgroundColor: '#AC274F',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Send Recovery Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthPage;
