import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Building,
  School,
  Sparkles,
  KeyRound,
  X,
  GraduationCap,
  Info,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const AuthModal = ({ isOpen, onClose, initialTab = 'signin', onSuccessRedirect }) => {
  const { user, login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Tab state: 'signin' | 'register'
  const [activeTab, setActiveTab] = useState(initialTab);

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
  const [showForgotModal, setShowForgotModal] = useState(false);

  // Reset tab when reopened with different initialTab
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setErrorMessage('');
      setSuccessMessage('');
      setShowForgotModal(false);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, initialTab]);

  // Handle keyboard Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        if (showForgotModal) {
          setShowForgotModal(false);
        } else {
          onClose?.();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, showForgotModal, onClose]);

  if (!isOpen) return null;

  // Password strength calculator
  const calculatePasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: 'Required', color: '#94A3B8' };
    if (pass.length < 6) return { score: 1, label: 'Weak', color: '#EF4444' };
    if (pass.length < 10) return { score: 2, label: 'Moderate', color: '#F59E0B' };
    return { score: 3, label: 'Institutional Strength', color: '#10B981' };
  };

  const passwordStrength = calculatePasswordStrength(regPassword);

  const fillCredentials = (email, password) => {
    setActiveTab('signin');
    setSignInIdentifier(email);
    setSignInPassword(password);
    setErrorMessage('');
  };

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
        setSuccessMessage('Authentication verified! Loading campus workspace...');
        setTimeout(() => {
          onClose?.();
          if (onSuccessRedirect !== false) {
            const role = res.data?.user?.role;
            if (role === 'admin' || role === 'care_admin') {
              navigate('/admin');
            } else {
              navigate('/dashboard');
            }
          }
        }, 600);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!regName.trim() || !regEmail.trim() || !regPassword) {
      setErrorMessage('Full name, confirmed enrollment number, institutional email, and password are required.');
      return;
    }

    if (!regRollId.trim()) {
      setErrorMessage('Official enrollment number is required (e.g. MUR2502162).');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (!agreeTerms) {
      setErrorMessage('Please acknowledge institutional acceptable use terms to continue.');
      return;
    }

    setLoading(true);
    try {
      const res = await register({
        name: regName.trim(),
        enrollmentNumber: regRollId.trim().toUpperCase(),
        studentId: regRollId.trim().toUpperCase(),
        email: regEmail.trim(),
        department: regDept,
        academicYear: regCohort,
        password: regPassword,
      });

      if (res.success) {
        setSuccessMessage('Account registered successfully! Initializing workspace...');
        setTimeout(() => {
          onClose?.();
          if (onSuccessRedirect !== false) {
            navigate('/dashboard');
          }
        }, 600);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed. Please check your submission.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
    >
      {/* Dark frosted backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#0A1A15]/75 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
      />

      {/* Modal Dialog Card */}
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col my-auto animate-in fade-in zoom-in-95 duration-200 max-h-[92vh]"
      >
        {/* Institutional Header with Mewar University Branding */}
        <div className="bg-gradient-to-r from-[#0E241E] via-[#142D28] to-[#168567] text-white p-5 sm:p-6 relative">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="absolute top-4 right-4 p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-emerald-300 font-extrabold text-sm shadow-inner">
              <GraduationCap size={20} />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                Mewar University • NextCampus
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight leading-tight">
                {activeTab === 'signin' ? 'Campus Portal Sign In' : 'Student Account Registration'}
              </h2>
            </div>
          </div>

          <p className="text-xs text-emerald-100/80 leading-relaxed max-w-md">
            {activeTab === 'signin'
              ? 'Access real-time GIS navigation, indoor room telemetry, smart bookings, and campus services.'
              : 'Register your verified student credentials for authenticated campus access.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center border-b border-slate-200 bg-slate-50 px-5 pt-3">
          <button
            type="button"
            onClick={() => {
              setActiveTab('signin');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`flex items-center gap-2 pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'signin'
                ? 'border-[#168567] text-[#168567]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <KeyRound size={15} />
            <span>Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`flex items-center gap-2 pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'register'
                ? 'border-[#168567] text-[#168567]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <School size={15} />
            <span>New Student Registration</span>
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-5 sm:p-6 overflow-y-auto max-h-[calc(92vh-180px)] space-y-4">
          {/* Error Banner */}
          {errorMessage && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs">
              <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{errorMessage}</div>
              <button
                type="button"
                onClick={() => setErrorMessage('')}
                className="text-red-500 hover:text-red-700"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* Success Banner */}
          {successMessage && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
              <div className="flex-1">{successMessage}</div>
            </div>
          )}

          {/* ======================= TAB: SIGN IN ======================= */}
          {activeTab === 'signin' && (
            <form onSubmit={handleSignInSubmit} className="space-y-4">
              {/* Identifier */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Institutional Email or Student Roll ID
                </label>
                <div className="relative flex items-center">
                  <Mail size={16} className="absolute left-3.5 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={signInIdentifier}
                    onChange={(e) => setSignInIdentifier(e.target.value)}
                    placeholder="e.g. rakesh@nextcampus.edu or MUR2502101"
                    required
                    autoFocus
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-xs sm:text-sm focus:outline-none focus:border-[#168567] focus:bg-white focus:ring-1 focus:ring-[#168567] transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-[11px] font-semibold text-[#168567] hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative flex items-center">
                  <Lock size={16} className="absolute left-3.5 text-slate-400 pointer-events-none" />
                  <input
                    type={showSignInPassword ? 'text' : 'password'}
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-xs sm:text-sm focus:outline-none focus:border-[#168567] focus:bg-white focus:ring-1 focus:ring-[#168567] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignInPassword(!showSignInPassword)}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 p-1"
                  >
                    {showSignInPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Remember & Security Badge */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
                  <input
                    type="checkbox"
                    checked={rememberDevice}
                    onChange={(e) => setRememberDevice(e.target.checked)}
                    className="w-4 h-4 rounded text-[#168567] focus:ring-[#168567] border-slate-300 accent-[#168567]"
                  />
                  <span>Remember this device</span>
                </label>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                  <ShieldCheck size={14} className="text-[#168567]" />
                  <span>Verified TLS 1.3</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-[#168567] hover:bg-[#0f6b52] text-white rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 transition-all cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Authenticating...</span>
                  </span>
                ) : (
                  <>
                    <span>Sign In to NextCampus</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              {/* Quick Demo Credentials */}
              <div className="pt-2">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 text-[10.5px] font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                    <Sparkles size={13} className="text-[#168567]" />
                    <span>Quick Demo Credentials</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => fillCredentials('rakesh@nextcampus.edu', 'password123')}
                      className="p-2 text-left bg-white hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-300 rounded-lg transition-all cursor-pointer shadow-xs"
                    >
                      <div className="text-[11px] font-bold text-[#168567]">Student Account (Rakesh)</div>
                      <div className="text-[10px] text-slate-500 truncate">rakesh@nextcampus.edu</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => fillCredentials('admin@nextcampus.edu', 'adminpassword123')}
                      className="p-2 text-left bg-white hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-300 rounded-lg transition-all cursor-pointer shadow-xs"
                    >
                      <div className="text-[11px] font-bold text-[#0F6B52]">Campus Admin</div>
                      <div className="text-[10px] text-slate-500 truncate">admin@nextcampus.edu</div>
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}

          {/* ======================= TAB: REGISTER ======================= */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Full Name</label>
                <div className="relative flex items-center">
                  <User size={16} className="absolute left-3.5 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Rudra Pratap Singh"
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-xs sm:text-sm focus:outline-none focus:border-[#168567] focus:bg-white"
                  />
                </div>
              </div>

              {/* Enrollment Number & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Enrollment / Roll ID</label>
                  <input
                    type="text"
                    value={regRollId}
                    onChange={(e) => setRegRollId(e.target.value)}
                    placeholder="e.g. MUR2502162"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-xs sm:text-sm focus:outline-none focus:border-[#168567] focus:bg-white uppercase"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">University Email</label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="user@nextcampus.edu"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-xs sm:text-sm focus:outline-none focus:border-[#168567] focus:bg-white"
                  />
                </div>
              </div>

              {/* Department & Cohort */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Academic Department</label>
                  <select
                    value={regDept}
                    onChange={(e) => setRegDept(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-[#168567] focus:bg-white"
                  >
                    <option value="Computer Science & Engineering">Computer Science & Eng</option>
                    <option value="Artificial Intelligence & Data">AI & Data Science</option>
                    <option value="Electronics & Communication">Electronics & Comm</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                    <option value="Faculty of Pharmacy">Pharmacy</option>
                    <option value="Management Studies">Management Studies</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Academic Cohort</label>
                  <select
                    value={regCohort}
                    onChange={(e) => setRegCohort(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-[#168567] focus:bg-white"
                  >
                    <option value="Class of 2028 (Undergrad)">Class of 2028 (Undergrad)</option>
                    <option value="Class of 2027 (Undergrad)">Class of 2027 (Undergrad)</option>
                    <option value="Class of 2026 (Graduating)">Class of 2026 (Graduating)</option>
                    <option value="Postgraduate Cohort 2026">Postgraduate Cohort</option>
                  </select>
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Password</label>
                <div className="relative flex items-center">
                  <Lock size={16} className="absolute left-3.5 text-slate-400 pointer-events-none" />
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    required
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 text-xs sm:text-sm focus:outline-none focus:border-[#168567] focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 p-1"
                  >
                    {showRegPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {regPassword && (
                  <div className="flex items-center gap-2 pt-1">
                    <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden flex">
                      <div
                        className="h-full transition-all duration-300"
                        style={{
                          width: `${(passwordStrength.score / 3) * 100}%`,
                          backgroundColor: passwordStrength.color,
                        }}
                      />
                    </div>
                    <span className="text-[10px] font-bold" style={{ color: passwordStrength.color }}>
                      {passwordStrength.label}
                    </span>
                  </div>
                )}
              </div>

              {/* Terms checkbox */}
              <label className="flex items-start gap-2 text-[11px] text-slate-600 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-[#168567] focus:ring-[#168567] border-slate-300 accent-[#168567]"
                />
                <span>
                  I confirm enrollment at Mewar University and agree to the Campus Acceptable Use Policy.
                </span>
              </label>

              {/* Submit Register Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-[#168567] hover:bg-[#0f6b52] text-white rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 transition-all cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Registering Account...</span>
                  </span>
                ) : (
                  <>
                    <span>Create Student Account</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Forgot Password Dialog */}
          {showForgotModal && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold text-amber-900">
                <div className="flex items-center gap-1.5">
                  <Info size={15} className="text-amber-600" />
                  <span>Mewar University Password Recovery</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="text-amber-700 hover:text-amber-900"
                >
                  <X size={14} />
                </button>
              </div>
              <p className="text-amber-800 leading-relaxed text-[11.5px]">
                Active directory authentication is integrated with Mewar University&apos;s Registrar Central Gateway. For demo access, use student credentials (
                <code className="bg-amber-100 px-1 rounded font-bold">rakesh@nextcampus.edu / password123</code>) or contact Campus IT at <span className="font-bold">1800-3070-7398</span>.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer Note */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <Building size={12} className="text-emerald-700" />
            <span>Mewar University Campus Gateway</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
