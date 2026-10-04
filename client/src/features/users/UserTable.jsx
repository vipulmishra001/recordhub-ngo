import React from 'react';
import { 
  Eye, 
  Edit3, 
  UserCheck, 
  UserX, 
  ShieldCheck, 
  AlertTriangle,
  User
} from 'lucide-react';

export default function UserTable({
  users = [],
  currentAdminId = '',
  loading = false,
  onView,
  onEdit,
  onToggleStatus
}) {
  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin':
        return 'badge-admin';
      case 'staff':
        return 'badge-staff';
      case 'volunteer':
        return 'badge-volunteer';
      case 'student':
        return 'badge-student';
      default:
        return 'badge-outline';
    }
  };

  if (loading) {
    return (
      <div className="table-loading-container">
        <div className="auth-spinner"></div>
        <p>Loading users...</p>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="table-empty-state">
        <AlertTriangle size={36} className="text-muted" />
        <h4>No Users Found</h4>
        <p>There are no user accounts matching your search or filter criteria.</p>
      </div>
    );
  }

  return (
    <div className="table-responsive-wrapper">
      <table className="user-data-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Role</th>
            <th>Contact Phone</th>
            <th>Status</th>
            <th>Last Login</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const userId = user._id || user.id;
            const isSelf = currentAdminId && String(currentAdminId) === String(userId);

            return (
              <tr key={userId} className={!user.isActive ? 'row-inactive' : ''}>
                <td>
                  <div className="user-cell-meta">
                    <div className="user-cell-avatar">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.firstName} />
                      ) : (
                        <User size={16} />
                      )}
                    </div>
                    <div>
                      <div className="user-name-title">
                        {user.firstName} {user.lastName}
                        {isSelf && <span className="you-pill">You</span>}
                      </div>
                      <div className="user-email-subtitle">{user.email}</div>
                    </div>
                  </div>
                </td>

                <td>
                  <span className={`badge ${getRoleBadgeClass(user.role)}`}>
                    {user.role ? user.role.toUpperCase() : 'USER'}
                  </span>
                </td>

                <td>
                  <span className="phone-text">
                    {user.phone ? user.phone : <span className="text-dim">—</span>}
                  </span>
                </td>

                <td>
                  {user.isActive ? (
                    <span className="status-pill status-active">
                      <span className="status-dot"></span>
                      Active
                    </span>
                  ) : (
                    <span className="status-pill status-inactive">
                      <span className="status-dot"></span>
                      Inactive
                    </span>
                  )}
                </td>

                <td>
                  <span className="last-login-text">
                    {user.lastLogin
                      ? new Date(user.lastLogin).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })
                      : 'Never'}
                  </span>
                </td>

                <td className="text-right">
                  <div className="action-buttons-group">
                    <button
                      type="button"
                      onClick={() => onView(user)}
                      className="btn-table-action btn-view"
                      title="View user details"
                    >
                      <Eye size={15} />
                      <span>View</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onEdit(user)}
                      className="btn-table-action btn-edit"
                      title="Edit user details"
                      disabled={user.role === 'admin' && !isSelf}
                    >
                      <Edit3 size={15} />
                      <span>Edit</span>
                    </button>

                    {isSelf ? (
                      <button
                        type="button"
                        className="btn-table-action btn-status-disabled"
                        title="You cannot deactivate your own admin account"
                        disabled
                      >
                        <ShieldCheck size={15} />
                        <span>Self</span>
                      </button>
                    ) : user.isActive ? (
                      <button
                        type="button"
                        onClick={() => onToggleStatus(user)}
                        className="btn-table-action btn-deactivate"
                        title="Deactivate account"
                      >
                        <UserX size={15} />
                        <span>Deactivate</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onToggleStatus(user)}
                        className="btn-table-action btn-activate"
                        title="Activate account"
                      >
                        <UserCheck size={15} />
                        <span>Activate</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
