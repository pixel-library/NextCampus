import React, { useState, useEffect, useMemo } from 'react';
import {
  Megaphone,
  Pin,
  Clock,
  Calendar,
  ImageIcon,
  Plus,
  Trash2,
  X,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  Filter,
  Sparkles,
  Info,
  ChevronRight,
  Eye,
  UploadCloud,
  FileText,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import {
  getAnnouncements,
  saveAnnouncement,
  deleteAnnouncement,
  togglePinAnnouncement,
  generateAnnouncementId,
  ANNOUNCEMENT_UPDATE_EVENT,
} from '../../utils/announcementsStorage';
import { Modal } from '../common/Modal';
import Button from '../common/Button';
import Badge from '../common/Badge';

const CATEGORIES = [
  { id: 'all', label: 'All Notices' },
  { id: 'academic', label: 'Academic & Exams' },
  { id: 'facility', label: 'IT & Facilities' },
  { id: 'event', label: 'Campus Events' },
  { id: 'urgent', label: 'Urgent Alerts' },
];

export default function AnnouncementsPanel({ forcedAdmin = false }) {
  const { user } = useAuth();
  const isAdmin =
    forcedAdmin ||
    user?.role === 'admin' ||
    user?.role === 'care_admin' ||
    user?.role === 'staff';

  const [announcements, setAnnouncements] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeAnnouncement, setActiveAnnouncement] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form State for Admin
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('academic');
  const [type, setType] = useState('permanent'); // 'permanent' | 'timed'
  const [pinned, setPinned] = useState(false);
  const [timePreset, setTimePreset] = useState('24h');
  const [customExpiry, setCustomExpiry] = useState('');
  const [imageMode, setImageMode] = useState('url'); // 'url' | 'file'
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [createdBy, setCreatedBy] = useState(
    user?.name ? `${user.name} (${user.department || 'Admin'})` : 'Campus Administration'
  );
  const [formError, setFormError] = useState('');
  const [publishSuccess, setPublishSuccess] = useState(false);

  // Load announcements
  const loadData = () => {
    setAnnouncements(getAnnouncements());
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener(ANNOUNCEMENT_UPDATE_EVENT, handleUpdate);
    return () => {
      window.removeEventListener(ANNOUNCEMENT_UPDATE_EVENT, handleUpdate);
    };
  }, []);

  // Filtered list
  const filteredAnnouncements = useMemo(() => {
    if (selectedCategory === 'all') return announcements;
    return announcements.filter((a) => a.category === selectedCategory);
  }, [announcements, selectedCategory]);

  const pinnedItems = useMemo(
    () => filteredAnnouncements.filter((a) => a.pinned),
    [filteredAnnouncements]
  );
  const regularItems = useMemo(
    () => filteredAnnouncements.filter((a) => !a.pinned),
    [filteredAnnouncements]
  );

  // Primary highlight announcement (first pinned, or first available)
  const spotlightItem = pinnedItems[0] || filteredAnnouncements[0] || null;
  const remainingItems = useMemo(() => {
    if (!spotlightItem) return [];
    return filteredAnnouncements.filter((a) => a.id !== spotlightItem.id);
  }, [filteredAnnouncements, spotlightItem]);

  // Handle local image file upload
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFormError('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setFormError('Image size exceeds 4MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const base64 = uploadEvent.target?.result;
      setImagePreview(base64);
      setImageUrl(base64);
      setFormError('');
    };
    reader.readAsDataURL(file);
  };

  // Submit announcement
  const handlePublish = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError('Please enter a clear announcement title.');
      return;
    }
    if (!body.trim()) {
      setFormError('Please write the announcement description.');
      return;
    }

    let calculatedExpiresAt = null;
    if (type === 'timed') {
      const now = Date.now();
      if (timePreset === '1h') calculatedExpiresAt = new Date(now + 1 * 60 * 60 * 1000).toISOString();
      else if (timePreset === '6h') calculatedExpiresAt = new Date(now + 6 * 60 * 60 * 1000).toISOString();
      else if (timePreset === '24h') calculatedExpiresAt = new Date(now + 24 * 60 * 60 * 1000).toISOString();
      else if (timePreset === '3d') calculatedExpiresAt = new Date(now + 3 * 24 * 60 * 60 * 1000).toISOString();
      else if (timePreset === '7d') calculatedExpiresAt = new Date(now + 7 * 24 * 60 * 60 * 1000).toISOString();
      else if (timePreset === 'custom') {
        if (!customExpiry) {
          setFormError('Please pick a custom expiry date & time.');
          return;
        }
        const expDate = new Date(customExpiry);
        if (expDate <= new Date()) {
          setFormError('Expiry date must be in the future.');
          return;
        }
        calculatedExpiresAt = expDate.toISOString();
      }
    }

    const finalImage = imageMode === 'url' ? imageUrl.trim() || null : imagePreview || null;

    const newAnnouncement = {
      id: generateAnnouncementId(),
      title: title.trim(),
      body: body.trim(),
      category,
      type,
      pinned,
      expiresAt: calculatedExpiresAt,
      imageUrl: finalImage,
      createdBy: createdBy.trim() || 'Campus Administration',
      createdAt: new Date().toISOString(),
    };

    saveAnnouncement(newAnnouncement);
    setPublishSuccess(true);
    setTimeout(() => {
      setPublishSuccess(false);
      setIsCreateModalOpen(false);
      resetForm();
    }, 800);
  };

  const resetForm = () => {
    setTitle('');
    setBody('');
    setCategory('academic');
    setType('permanent');
    setPinned(false);
    setTimePreset('24h');
    setCustomExpiry('');
    setImageUrl('');
    setImagePreview('');
    setFormError('');
  };

  const handleDelete = (id, e) => {
    e?.stopPropagation();
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      deleteAnnouncement(id);
      if (activeAnnouncement?.id === id) {
        setActiveAnnouncement(null);
      }
    }
  };

  const handleTogglePin = (id, e) => {
    e?.stopPropagation();
    togglePinAnnouncement(id);
  };

  const formatExpiryTime = (isoString) => {
    if (!isoString) return 'Permanent';
    const date = new Date(isoString);
    const diffHours = Math.round((date.getTime() - Date.now()) / (1000 * 60 * 60));
    if (diffHours <= 0) return 'Expired';
    if (diffHours < 24) return `Expires in ${diffHours}h`;
    const diffDays = Math.round(diffHours / 24);
    return `Expires in ${diffDays}d (${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})`;
  };

  const formatRelativeTime = (isoString) => {
    if (!isoString) return '';
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 60) return `${Math.max(1, diffMins)}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const getCategoryBadge = (cat) => {
    switch (cat) {
      case 'academic':
        return <Badge variant="brand" size="xs">Academic</Badge>;
      case 'facility':
        return <Badge variant="info" size="xs">IT & Facility</Badge>;
      case 'event':
        return <Badge variant="purple" size="xs">Campus Event</Badge>;
      case 'urgent':
        return <Badge variant="danger" size="xs">Urgent</Badge>;
      default:
        return <Badge variant="neutral" size="xs">General Notice</Badge>;
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-[#E4EAE5] shadow-xs p-4 sm:p-6 flex flex-col gap-5">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5 pb-4 border-b border-[#E4EAE5]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#EAF5EF] text-[#168567] border border-[#CBE2D4] flex items-center justify-center shrink-0 shadow-xs">
            <Megaphone size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-[#202A27] tracking-tight">
                Campus Announcements &amp; Circulars
              </h2>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#EAF5EF] text-[#168567] border border-[#CBE2D4]">
                Live Feed
              </span>
            </div>
            <p className="text-xs text-[#65736B] mt-0.5">
              Official university notices, academic updates, and facility advisories
            </p>
          </div>
        </div>

        {/* Admin Action Button & Category Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {isAdmin && (
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => setIsCreateModalOpen(true)}
              className="shadow-sm"
            >
              Post Announcement
            </Button>
          )}

          {/* Quick Category Tabs */}
          <div className="flex items-center bg-[#F6F8F6] p-1 rounded-xl border border-[#E4EAE5] overflow-x-auto text-xs">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-white text-[#168567] font-semibold shadow-xs border border-[#CBE2D4]'
                    : 'text-[#65736B] hover:text-[#202A27]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ANNOUNCEMENTS CONTENT */}
      {filteredAnnouncements.length === 0 ? (
        <div className="py-12 flex flex-col items-center justify-center text-center px-4 rounded-xl bg-[#F6F8F6] border border-dashed border-[#D0DAD2]">
          <div className="w-12 h-12 rounded-full bg-[#EAF5EF] text-[#168567] flex items-center justify-center mb-3">
            <Sparkles size={22} />
          </div>
          <p className="text-sm font-bold text-[#202A27]">No circulars in this category</p>
          <p className="text-xs text-[#65736B] mt-1 max-w-sm">
            All active announcements have been read or no circulars were filed under this filter.
          </p>
          {isAdmin && (
            <Button
              variant="outline"
              size="sm"
              icon={Plus}
              className="mt-3"
              onClick={() => setIsCreateModalOpen(true)}
            >
              Post Announcement Now
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* LEFT: FEATURED SPOTLIGHT CARD (7 COLS ON LARGE SCREEN) */}
          {spotlightItem && (
            <div
              onClick={() => setActiveAnnouncement(spotlightItem)}
              className="lg:col-span-7 rounded-2xl bg-gradient-to-br from-[#FAFCFA] to-white border border-[#E4EAE5] hover:border-[#168567]/40 hover:shadow-md transition-all cursor-pointer p-4 sm:p-5 flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Top Meta Bar */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {spotlightItem.pinned && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#EAF5EF] text-[#168567] border border-[#CBE2D4]">
                        <Pin size={12} className="fill-[#168567]" />
                        PINNED
                      </span>
                    )}
                    {getCategoryBadge(spotlightItem.category)}
                    {spotlightItem.type === 'timed' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock size={11} />
                        {formatExpiryTime(spotlightItem.expiresAt)}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-50 text-slate-600 border border-slate-200">
                        Permanent Notice
                      </span>
                    )}
                  </div>

                  <span className="text-xs font-mono text-[#87968D]">
                    {formatRelativeTime(spotlightItem.createdAt)}
                  </span>
                </div>

                {/* Optional Image Banner */}
                {spotlightItem.imageUrl && (
                  <div className="w-full h-44 sm:h-52 rounded-xl overflow-hidden mb-4 border border-[#E4EAE5] bg-slate-100 relative">
                    <img
                      src={spotlightItem.imageUrl}
                      alt={spotlightItem.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3 text-white text-xs font-medium">
                      <span>Click to expand full resolution</span>
                    </div>
                  </div>
                )}

                {/* Title and Excerpt */}
                <h3 className="text-base sm:text-xl font-bold text-[#202A27] tracking-tight group-hover:text-[#168567] transition-colors line-clamp-2">
                  {spotlightItem.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#65736B] mt-2 line-clamp-3 leading-relaxed">
                  {spotlightItem.body}
                </p>
              </div>

              {/* Bottom Footer Info & Admin Actions */}
              <div className="mt-4 pt-3.5 border-t border-[#E4EAE5] flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 text-[#87968D]">
                  <span className="font-medium text-[#202A27]">
                    {spotlightItem.createdBy}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {isAdmin && (
                    <div
                      className="flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={(e) => handleTogglePin(spotlightItem.id, e)}
                        title={spotlightItem.pinned ? 'Unpin Notice' : 'Pin to Top'}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          spotlightItem.pinned
                            ? 'bg-[#EAF5EF] text-[#168567] border-[#CBE2D4]'
                            : 'text-[#65736B] hover:bg-[#F0F4F1] border-transparent'
                        }`}
                      >
                        <Pin size={14} className={spotlightItem.pinned ? 'fill-[#168567]' : ''} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDelete(spotlightItem.id, e)}
                        title="Delete Notice"
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}

                  <span className="inline-flex items-center gap-1 font-semibold text-[#168567] group-hover:translate-x-0.5 transition-transform">
                    Read Circular <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* RIGHT: LIST OF OTHER CIRCULARS (5 COLS ON LARGE SCREEN) */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs font-semibold text-[#87968D] uppercase tracking-wider px-1">
              <span>Recent Circulars ({remainingItems.length + (spotlightItem ? 1 : 0)})</span>
              <span className="text-[11px] text-[#168567] font-medium lowercase">
                click any notice to view
              </span>
            </div>

            <div className="flex flex-col gap-2.5 max-h-[460px] overflow-y-auto pr-1">
              {remainingItems.length === 0 ? (
                <div className="p-4 rounded-xl bg-[#F6F8F6] border border-[#E4EAE5] text-center text-xs text-[#65736B]">
                  No other circulars in this filter.
                </div>
              ) : (
                remainingItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setActiveAnnouncement(item)}
                    className="p-3.5 rounded-xl bg-white border border-[#E4EAE5] hover:border-[#168567]/50 hover:bg-[#FAFCFA] hover:shadow-xs transition-all cursor-pointer group flex gap-3 relative"
                  >
                    {/* Thumbnail if present */}
                    {item.imageUrl ? (
                      <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-[#E4EAE5] bg-slate-100">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-[#F0F4F1] text-[#168567] flex items-center justify-center shrink-0 border border-[#E4EAE5]">
                        {item.pinned ? <Pin size={16} className="fill-[#168567]" /> : <FileText size={16} />}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap mb-1">
                        {item.pinned && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#EAF5EF] text-[#168567] border border-[#CBE2D4]">
                            PINNED
                          </span>
                        )}
                        {getCategoryBadge(item.category)}
                        {item.type === 'timed' && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                            {formatExpiryTime(item.expiresAt)}
                          </span>
                        )}
                        <span className="text-[10px] text-[#87968D] font-mono ml-auto">
                          {formatRelativeTime(item.createdAt)}
                        </span>
                      </div>

                      <h4 className="text-xs sm:text-sm font-bold text-[#202A27] line-clamp-1 group-hover:text-[#168567] transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-[#65736B] line-clamp-2 mt-0.5 leading-snug">
                        {item.body}
                      </p>

                      <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-[#F0F4F1] text-[10px] text-[#87968D]">
                        <span className="truncate">{item.createdBy}</span>
                        {isAdmin && (
                          <div
                            className="flex items-center gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              onClick={(e) => handleTogglePin(item.id, e)}
                              title={item.pinned ? 'Unpin' : 'Pin'}
                              className="p-1 hover:text-[#168567] transition-colors"
                            >
                              <Pin size={12} className={item.pinned ? 'fill-[#168567] text-[#168567]' : ''} />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleDelete(item.id, e)}
                              title="Delete"
                              className="p-1 text-rose-500 hover:text-rose-700 transition-colors"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          STUDENT & ADMIN FULL READER MODAL
          ========================================================================= */}
      {activeAnnouncement && (
        <Modal
          isOpen={!!activeAnnouncement}
          onClose={() => setActiveAnnouncement(null)}
          title={activeAnnouncement.title}
          subtitle={`Issued by ${activeAnnouncement.createdBy} • ${new Date(
            activeAnnouncement.createdAt
          ).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}`}
          maxWidth="max-w-2xl"
          footer={
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <Button
                    variant="danger"
                    size="sm"
                    icon={Trash2}
                    onClick={() => handleDelete(activeAnnouncement.id)}
                  >
                    Delete Notice
                  </Button>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveAnnouncement(null)}
              >
                Close
              </Button>
            </div>
          }
        >
          <div className="flex flex-col gap-4">
            {/* Meta Tags */}
            <div className="flex flex-wrap items-center gap-2">
              {activeAnnouncement.pinned && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#EAF5EF] text-[#168567] border border-[#CBE2D4]">
                  <Pin size={12} className="fill-[#168567]" />
                  PINNED CIRCULAR
                </span>
              )}
              {getCategoryBadge(activeAnnouncement.category)}
              {activeAnnouncement.type === 'timed' ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                  <Clock size={12} />
                  {formatExpiryTime(activeAnnouncement.expiresAt)}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-50 text-slate-700 border border-slate-200">
                  <Calendar size={12} />
                  Permanent University Circular
                </span>
              )}
            </div>

            {/* High-res Image if attached */}
            {activeAnnouncement.imageUrl && (
              <div className="w-full max-h-80 rounded-xl overflow-hidden border border-[#E4EAE5] bg-slate-900 shadow-inner">
                <img
                  src={activeAnnouncement.imageUrl}
                  alt={activeAnnouncement.title}
                  className="w-full h-full object-contain max-h-80 mx-auto"
                />
              </div>
            )}

            {/* Announcement Body */}
            <div className="p-4 rounded-xl bg-[#F6F8F6] border border-[#E4EAE5] text-sm text-[#202A27] leading-relaxed whitespace-pre-line font-sans">
              {activeAnnouncement.body}
            </div>

            <div className="text-xs text-[#87968D] flex items-center justify-between">
              <span>Reference ID: <code className="font-mono text-[#202A27]">{activeAnnouncement.id}</code></span>
              <span>Student Notice Board Verified</span>
            </div>
          </div>
        </Modal>
      )}

      {/* =========================================================================
          ADMIN ONLY: POST ANNOUNCEMENT MODAL
          ========================================================================= */}
      {isAdmin && isCreateModalOpen && (
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
            resetForm();
          }}
          title="Publish Campus Announcement"
          subtitle="Broadcast official circulars, time-bound notices, or attach posters for university students."
          maxWidth="max-w-2xl"
          footer={
            <div className="flex items-center justify-between w-full">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>

              <Button
                variant="primary"
                size="sm"
                icon={CheckCircle2}
                onClick={handlePublish}
                disabled={publishSuccess}
              >
                {publishSuccess ? 'Publishing...' : 'Publish Announcement'}
              </Button>
            </div>
          }
        >
          <form onSubmit={handlePublish} className="flex flex-col gap-4 text-xs sm:text-sm">
            {formError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {publishSuccess && (
              <div className="p-3 rounded-xl bg-[#EAF5EF] border border-[#CBE2D4] text-[#168567] text-xs flex items-center gap-2">
                <CheckCircle2 size={15} className="shrink-0" />
                <span>Announcement published successfully! Students can now view it.</span>
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-[#202A27] mb-1">
                Announcement Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. End-Term Exam Schedule, Library Maintenance, Fest Registration..."
                className="w-full px-3 py-2 rounded-xl border border-[#D0DAD2] focus:border-[#168567] focus:ring-2 focus:ring-[#168567]/20 outline-none text-[#202A27]"
                required
              />
            </div>

            {/* Category & Posted By */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#202A27] mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D0DAD2] focus:border-[#168567] focus:ring-2 focus:ring-[#168567]/20 outline-none text-[#202A27] bg-white"
                >
                  <option value="academic">Academic &amp; Examinations</option>
                  <option value="facility">IT &amp; Campus Facility</option>
                  <option value="event">Campus Event &amp; Cultural</option>
                  <option value="urgent">Urgent Security / Emergency</option>
                  <option value="general">General Notice</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#202A27] mb-1">
                  Issuing Office / Authority
                </label>
                <input
                  type="text"
                  value={createdBy}
                  onChange={(e) => setCreatedBy(e.target.value)}
                  placeholder="e.g. Dean of Academic Affairs"
                  className="w-full px-3 py-2 rounded-xl border border-[#D0DAD2] focus:border-[#168567] focus:ring-2 focus:ring-[#168567]/20 outline-none text-[#202A27]"
                />
              </div>
            </div>

            {/* Duration Type: Permanent vs Fixed Time Limit */}
            <div className="p-3.5 rounded-xl bg-[#F6F8F6] border border-[#E4EAE5] flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#202A27]">
                  Announcement Duration &amp; Expiry
                </span>
                <label className="flex items-center gap-1.5 cursor-pointer text-xs font-medium text-[#168567]">
                  <input
                    type="checkbox"
                    checked={pinned}
                    onChange={(e) => setPinned(e.target.checked)}
                    className="rounded text-[#168567] focus:ring-[#168567]"
                  />
                  <span>Pin to Top Spotlight</span>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setType('permanent')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    type === 'permanent'
                      ? 'bg-white border-[#168567] text-[#168567] font-bold shadow-xs'
                      : 'bg-white/60 border-[#D0DAD2] text-[#65736B] hover:text-[#202A27]'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    <span>Permanent</span>
                  </div>
                  <div className="text-[11px] font-normal text-[#87968D] mt-0.5">
                    Stays until manually removed
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setType('timed')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    type === 'timed'
                      ? 'bg-white border-[#168567] text-[#168567] font-bold shadow-xs'
                      : 'bg-white/60 border-[#D0DAD2] text-[#65736B] hover:text-[#202A27]'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} />
                    <span>Fixed Time Limit</span>
                  </div>
                  <div className="text-[11px] font-normal text-[#87968D] mt-0.5">
                    Auto-expires after set time
                  </div>
                </button>
              </div>

              {/* If Fixed Time Limit is selected */}
              {type === 'timed' && (
                <div className="pt-2 border-t border-[#E4EAE5] flex flex-col gap-2">
                  <div className="text-[11px] font-semibold text-[#65736B]">
                    Select Expiration Duration:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { id: '1h', label: '1 Hour' },
                      { id: '6h', label: '6 Hours' },
                      { id: '24h', label: '24 Hours (1 Day)' },
                      { id: '3d', label: '3 Days' },
                      { id: '7d', label: '7 Days' },
                      { id: 'custom', label: 'Custom Date/Time' },
                    ].map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setTimePreset(preset.id)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                          timePreset === preset.id
                            ? 'bg-[#168567] text-white border-[#168567]'
                            : 'bg-white text-[#65736B] border-[#D0DAD2] hover:text-[#202A27]'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>

                  {timePreset === 'custom' && (
                    <div className="mt-1">
                      <label className="block text-[11px] font-medium text-[#65736B] mb-1">
                        Pick Expiry Date &amp; Time
                      </label>
                      <input
                        type="datetime-local"
                        value={customExpiry}
                        onChange={(e) => setCustomExpiry(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-[#D0DAD2] text-xs bg-white text-[#202A27]"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Image Attachment (Optional) */}
            <div className="p-3.5 rounded-xl bg-[#F6F8F6] border border-[#E4EAE5] flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#202A27] flex items-center gap-1.5">
                  <ImageIcon size={14} className="text-[#168567]" />
                  Attach Poster or Banner Image (Optional)
                </span>
                <div className="flex items-center gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setImageMode('url')}
                    className={`font-semibold ${
                      imageMode === 'url' ? 'text-[#168567]' : 'text-[#87968D]'
                    }`}
                  >
                    Image URL
                  </button>
                  <span className="text-[#D0DAD2]">|</span>
                  <button
                    type="button"
                    onClick={() => setImageMode('file')}
                    className={`font-semibold ${
                      imageMode === 'file' ? 'text-[#168567]' : 'text-[#87968D]'
                    }`}
                  >
                    Upload File
                  </button>
                </div>
              </div>

              {imageMode === 'url' ? (
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    setImagePreview(e.target.value);
                  }}
                  placeholder="Paste direct image link (https://...)"
                  className="w-full px-3 py-2 rounded-xl border border-[#D0DAD2] bg-white text-xs text-[#202A27]"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-dashed border-[#168567]/50 bg-white hover:bg-[#EAF5EF]/30 text-xs text-[#168567] font-semibold transition-colors">
                    <UploadCloud size={16} />
                    <span>Choose image file from computer (max 4MB)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              {/* Preview Thumbnail */}
              {imagePreview && (
                <div className="relative w-full h-32 rounded-lg overflow-hidden border border-[#D0DAD2] mt-1 bg-slate-100">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={() => setFormError('Unable to load preview from this URL.')}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview('');
                      setImageUrl('');
                    }}
                    className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white hover:bg-black"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* Notice Body */}
            <div>
              <label className="block text-xs font-bold text-[#202A27] mb-1">
                Notice Content &amp; Details <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={4}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Type the detailed circular message here..."
                className="w-full px-3 py-2 rounded-xl border border-[#D0DAD2] focus:border-[#168567] focus:ring-2 focus:ring-[#168567]/20 outline-none text-[#202A27] leading-relaxed resize-none"
                required
              />
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
