'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Navbar } from '../../components/Navbar';
import { adminApi } from '../../lib/api';
import { Role, Permission } from '@crm/types';

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [rolesRes, permsRes] = await Promise.all([
        adminApi.get('/roles'),
        adminApi.get('/roles/permissions'),
      ]);
      if (rolesRes.data.success) setRoles(rolesRes.data.data);
      if (permsRes.data.success) setPermissions(permsRes.data.data);
    } catch (e) {
      //
    } finally {
      setIsLoading(false);
    }
  };

  const isPermitted = (role: Role, permId: number) => {
    return role.permissions?.some((p) => p.id === permId);
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Role-Based Access Control (RBAC)" subtitle="Fine-grained permission matrix across organizational roles" />

        <div className="page-body">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Permission Code</th>
                  <th>Description</th>
                  {roles.map((r) => (
                    <th key={r.id} style={{ textAlign: 'center' }}>
                      {r.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {permissions.map((perm) => (
                  <tr key={perm.id}>
                    <td>
                      <span style={{ fontWeight: 700, color: 'var(--primary-light)', fontSize: '13px' }}>
                        {perm.name}
                      </span>
                    </td>
                    <td style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{perm.description}</td>
                    {roles.map((role) => {
                      const hasPerm = isPermitted(role, perm.id);
                      return (
                        <td key={role.id} style={{ textAlign: 'center' }}>
                          <span style={{ fontSize: '16px' }}>{hasPerm ? '✅' : '❌'}</span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
