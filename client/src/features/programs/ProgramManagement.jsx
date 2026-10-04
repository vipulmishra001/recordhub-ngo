import React, { useState, useEffect, useCallback } from 'react';
import { 
  Calendar, 
  Plus, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  X, 
  BookOpen, 
  ShieldCheck, 
  Layers 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import programService from './programService';
import ProgramTable from './ProgramTable';
import ProgramForm from './ProgramForm';
import ProgramDetails from './ProgramDetails';

const FILTER_TYPES = [
  { value: 'all', label: 'All Types' },
  { value: 'class', label: 'School Class' },
  { value: 'course', label: 'Course' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'training', label: 'Vocational Training' },
  { value: 'awareness', label: 'Awareness Campaign' },
  { value: 'event', label: 'Community Event' },
  { value: 'camp', label: 'Camp' },
  { value: 'other', label: 'Other' }
];

const FILTER_STATUSES = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'draft', label: 'Draft' },
  { value: 'paused', label: 'Paused' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' }
];

export default function ProgramManagement() {
  const { currentUser } = useAuth();
  const userRole = currentUser?.role || 'volunteer';
  const isAdmin = userRole === 'admin';
  const isStudent = userRole === 'student';
  const isVolunteer = userRole === 'volunteer';

  // Program list & pagination
  const [programs, setPrograms] = useState([]);
  const [pagination, setPagination] = useState({
    totalPrograms: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Search and filter state
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [programToEdit, setProgramToEdit] = useState(null);

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [programToView, setProgramToView] = useState(null);

  // Status Change Dialog State
  const [statusDialogProgram, setStatusDialogProgram] = useState(null);
  const [targetStatus, setTargetStatus] = useState('active');
  const [statusSubmitting, setStatusSubmitting] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch programs from API
  const fetchPrograms = useCallback(async () => {
    if (isStudent) return;

    setLoading(true);
    try {
      const res = await programService.getPrograms({
        page,
        limit: 10,
        search: debouncedSearch,
        type: typeFilter,
        status: statusFilter,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });

      if (res.success && res.data) {
        setPrograms(res.data.programs || []);
        if (res.data.pagination) {
          setPagination(res.data.pagination);
        }
      }
    } catch (err) {
      showNotification('error', err.message || 'Failed to load programs');
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, typeFilter, statusFilter, isStudent]);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  // Handlers for modal openings
  const handleOpenCreate = () => {
    setFormMode('create');
    setProgramToEdit(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (prog) => {
    setFormMode('edit');
    setProgramToEdit(prog);
    setIsFormOpen(true);
  };

  const handleOpenView = (prog) => {
    setProgramToView(prog);
    setIsDetailsOpen(true);
  };

  const handleOpenStatusDialog = (prog) => {
    setStatusDialogProgram(prog);
    setTargetStatus(prog.status || 'active');
  };

  const handleConfirmStatusChange = async () => {
    if (!statusDialogProgram) return;
    setStatusSubmitting(true);
    try {
      const programId = statusDialogProgram._id || statusDialogProgram.id;
      const res = await programService.updateStatus(programId, targetStatus);
      if (res.success) {
        showNotification(
          'success',
          `Status for program [${statusDialogProgram.code}] updated to ${targetStatus.toUpperCase()}.`
        );
        fetchPrograms();
      }
    } catch (err) {
      showNotification('error', err.message || 'Failed to update program status');
    } finally {
      setStatusSubmitting(false);
      setStatusDialogProgram(null);
    }
  };

  // ----------------------------------------------------
  // STUDENT ROLE ACCESS GUARD
  // ----------------------------------------------------
  if (isStudent) {
    return (
      <div className="user-management-page program-student-view-page">
        <div className="page-header">
          <div>
            <div className="title-with-badge">
              <h1 className="page-title">Programs & Activities</h1>
              <span className="badge badge-student">Student Portal</span>
            </div>
            <p className="page-subtitle">
              Your enrolled classes and NGO educational activities
            </p>
          </div>
        </div>

        <div className="card empty-state-card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
          <BookOpen size={48} className="text-primary" style={{ margin: '0 auto 1rem auto' }} />
          <h3>Program Enrollment Portal</h3>
          <p style={{ maxWidth: '540px', margin: '0.5rem auto 1.5rem auto', color: 'var(--text-muted)' }}>
            Active program enrollment and class schedules will be linked to your student account soon. For now, please refer to your Student Dashboard or contact your NGO coordinator.
          </p>
          <div className="status-pill status-active" style={{ display: 'inline-flex' }}>
            <span className="status-dot"></span>
            Profile Verified
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // ADMIN / STAFF / VOLUNTEER LIST VIEW
  // ----------------------------------------------------
  return (
    <div className="user-management-page program-management-page">
      {/* Toast Notification */}
      {notification && (
        <div className={`notification-toast alert-${notification.type}`}>
          {notification.type === 'success' ? (
            <CheckCircle2 size={18} className="flex-shrink-0" />
          ) : (
            <AlertCircle size={18} className="flex-shrink-0" />
          )}
          <span>{notification.message}</span>
          <button 
            type="button" 
            onClick={() => setNotification(null)}
            className="toast-close-btn"
            aria-label="Dismiss notification"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="page-header">
        <div>
          <div className="title-with-badge">
            <h1 className="page-title">Programs & Activities</h1>
            <span className={`badge ${isAdmin ? 'badge-admin' : userRole === 'staff' ? 'badge-staff' : 'badge-volunteer'}`}>
              {isAdmin ? 'Administrator' : userRole === 'staff' ? 'Staff' : 'Volunteer View'}
            </span>
          </div>
          <p className="page-subtitle">
            Configure dynamic NGO classes, courses, skill training, workshops, and community camps
          </p>
        </div>

        <div className="header-actions">
          <button
            type="button"
            onClick={fetchPrograms}
            className="btn-action btn-refresh"
            title="Refresh programs list"
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>

          {isAdmin && (
            <button
              type="button"
              onClick={handleOpenCreate}
              className="btn-action btn-add-user"
            >
              <Plus size={16} />
              <span>+ Create Program</span>
            </button>
          )}
        </div>
      </div>

      {/* Volunteer Notice if applicable */}
      {isVolunteer && (
        <div className="alert alert-info volunteer-banner">
          <BookOpen size={16} className="flex-shrink-0" />
          <span>
            Volunteer View: You are currently viewing programs where you are an assigned team member. Program creation and modifications are reserved for NGO Administrators.
          </span>
        </div>
      )}

      {/* Control Bar: Search + Filters */}
      <div className="card filters-control-card">
        <div className="filters-grid">
          {/* Search Box */}
          <div className="search-box-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by program name, code, type, category..."
              className="search-input"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="clear-search-btn"
                title="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Type Filter */}
          <div className="filter-select-group">
            <label htmlFor="program-type-filter">Type:</label>
            <select
              id="program-type-filter"
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setPage(1);
              }}
              className="filter-select"
            >
              {FILTER_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="filter-select-group">
            <label htmlFor="program-status-filter">Status:</label>
            <select
              id="program-status-filter"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="filter-select"
            >
              {FILTER_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Program Table Card */}
      <div className="card user-table-card">
        <div className="table-header-bar">
          <div className="table-header-info">
            <Calendar size={19} className="text-primary" />
            <h3>Configured Programs & Curriculum</h3>
            <span className="count-pill">{pagination.totalPrograms} programs</span>
          </div>
        </div>

        <ProgramTable
          programs={programs}
          loading={loading}
          currentUserRole={userRole}
          onView={handleOpenView}
          onEdit={handleOpenEdit}
          onChangeStatus={handleOpenStatusDialog}
        />

        {/* Pagination Bar */}
        {pagination.totalPages > 1 && (
          <div className="pagination-bar">
            <div className="pagination-info">
              Showing page <strong>{pagination.currentPage}</strong> of{' '}
              <strong>{pagination.totalPages}</strong> ({pagination.totalPrograms} total records)
            </div>

            <div className="pagination-controls">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!pagination.hasPrevPage || loading}
                className="btn-pagination"
                aria-label="Previous Page"
              >
                <ChevronLeft size={16} />
                <span>Prev</span>
              </button>

              <span className="pagination-page-indicator">
                {pagination.currentPage} / {pagination.totalPages}
              </span>

              <button
                type="button"
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={!pagination.hasNextPage || loading}
                className="btn-pagination"
                aria-label="Next Page"
              >
                <span>Next</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create / Edit Program Modal (Admin only) */}
      {isAdmin && (
        <ProgramForm
          isOpen={isFormOpen}
          mode={formMode}
          programToEdit={programToEdit}
          onClose={() => setIsFormOpen(false)}
          onSuccess={(msg) => {
            showNotification('success', msg);
            fetchPrograms();
          }}
        />
      )}

      {/* Program Details Modal */}
      <ProgramDetails
        isOpen={isDetailsOpen}
        program={programToView}
        onClose={() => setIsDetailsOpen(false)}
      />

      {/* Change Status Modal Dialog (Admin only) */}
      {isAdmin && statusDialogProgram && (
        <div className="modal-overlay" onClick={() => setStatusDialogProgram(null)}>
          <div
            className="modal-container status-confirm-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div className="modal-header-title">
                <RefreshCw size={20} className="text-primary" />
                <h3>Update Program Status</h3>
              </div>
              <button
                type="button"
                onClick={() => setStatusDialogProgram(null)}
                className="modal-close-btn"
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body-content">
              <div className="status-student-meta">
                <strong>{statusDialogProgram.name}</strong>
                <span className="code-badge">{statusDialogProgram.code}</span>
              </div>
              <p className="status-modal-desc">
                Adjust the lifecycle state of this program. Historical schedules and records remain fully preserved.
              </p>

              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label htmlFor="target-prog-status">Select New Status:</label>
                <select
                  id="target-prog-status"
                  value={targetStatus}
                  onChange={(e) => setTargetStatus(e.target.value)}
                  className="select-dropdown"
                  disabled={statusSubmitting}
                >
                  <option value="active">Active (Ongoing / In-session)</option>
                  <option value="draft">Draft (Planning stage)</option>
                  <option value="paused">Paused (Temporarily on hold)</option>
                  <option value="completed">Completed (Successfully concluded)</option>
                  <option value="cancelled">Cancelled (Terminated)</option>
                </select>
              </div>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                onClick={() => setStatusDialogProgram(null)}
                className="btn-secondary"
                disabled={statusSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmStatusChange}
                className="btn-primary"
                disabled={statusSubmitting}
              >
                {statusSubmitting ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
