import { useEffect, useState } from 'react';
import { fetchUsers, updateUserRole, updateUserStatus } from '../../services/admin';
import { PageHeader } from '../../components/common/PageHeader';
import { DataTable } from '../../components/dashboard/DataTable';
import { Button } from '../../components/ui/Button';

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);

  const loadUsers = async () => {
    const { data } = await fetchUsers({ page: 1, limit: 50 });
    setUsers(data.data.users);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggleRole = async (row) => {
    await updateUserRole(row.id, { role: row.role === 'admin' ? 'user' : 'admin' });
    loadUsers();
  };

  const handleStatus = async (row) => {
    await updateUserStatus(row.id, { isActive: !row.is_active });
    loadUsers();
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    { key: 'created_at', label: 'Joined', render: (row) => new Date(row.created_at).toLocaleDateString() },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => handleToggleRole(row)}>Toggle role</Button>
          <Button size="sm" variant="danger" onClick={() => handleStatus(row)}>{row.is_active ? 'Disable' : 'Enable'}</Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Manage" title="Users" description="Control roles and account status." />
      <DataTable columns={columns} rows={users} />
    </div>
  );
}