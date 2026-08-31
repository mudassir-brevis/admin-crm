'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Navbar } from '../../components/Navbar';
import { MetricCard } from '../../components/MetricCard';
import { FunnelChart } from '../../components/FunnelChart';
import { adminApi } from '../../lib/api';
import { useAuth } from '../../lib/authContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [funnel, setFunnel] = useState<any[]>([]);
  const [teamStats, setTeamStats] = useState<any>({ telecallers: [], executives: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [dashRes, funnelRes, teamRes] = await Promise.all([
        adminApi.get('/dashboard/admin'),
        adminApi.get('/reports/funnel'),
        adminApi.get('/reports/team'),
      ]);

      if (dashRes.data.success) setData(dashRes.data.data);
      if (funnelRes.data.success) setFunnel(funnelRes.data.data);
      if (teamRes.data.success) setTeamStats(teamRes.data.data);
    } catch (err) {
      //
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Executive CRM Dashboard" subtitle="Real-time revenue, conversion funnel, and team performance" />

        <div className="page-body">
          {/* KPI Metrics */}
          <div className="kpi-grid">
            <MetricCard
              title="Total Leads"
              value={data?.totalLeads || 0}
              icon="👥"
              color="var(--primary)"
              trend="+12% this week"
            />
            <MetricCard
              title="Pipeline Value"
              value={`₹${Number(data?.totalPipelineValue || 0).toLocaleString('en-IN')}`}
              icon="💼"
              color="var(--accent)"
              subtitle="Active pipeline value"
            />
            <MetricCard
              title="Closed Deals Won"
              value={data?.wonLeads || 0}
              icon="🏆"
              color="var(--success)"
              trend="₹38.5L revenue"
            />
            <MetricCard
              title="Conversion Rate"
              value={`${data?.conversionRate || 0}%`}
              icon="🎯"
              color="var(--warning)"
              subtitle="Lead-to-Win ratio"
            />
          </div>

          {/* Grid with Funnel Chart and Leaderboard */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginBottom: '24px' }}>
            <FunnelChart stages={funnel} />

            {/* Team Performance Table */}
            <div className="card">
              <h3 style={{ marginBottom: '16px' }}>🏆 Executive Sales Leaderboard</h3>
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Executive</th>
                      <th>Deals Assigned</th>
                      <th>Won</th>
                      <th>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamStats.executives?.length === 0 ? (
                      <tr>
                        <td colSpan={4} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                          No sales executive activity recorded yet.
                        </td>
                      </tr>
                    ) : (
                      teamStats.executives?.map((exec: any) => (
                        <tr key={exec.userId}>
                          <td style={{ fontWeight: 600 }}>{exec.name}</td>
                          <td>{exec.assigned}</td>
                          <td><span className="badge badge-won">{exec.won} Won</span></td>
                          <td style={{ fontWeight: 700, color: 'var(--success)' }}>
                            ₹{Number(exec.revenue || 0).toLocaleString('en-IN')}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Telecaller Activity Matrix */}
          <div className="card">
            <h3 style={{ marginBottom: '16px' }}>🎧 Telecaller Calling & Qualification Matrix</h3>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Telecaller</th>
                    <th>Assigned Leads</th>
                    <th>Calls Made</th>
                    <th>Connected</th>
                    <th>Qualified</th>
                    <th>Conversion</th>
                  </tr>
                </thead>
                <tbody>
                  {teamStats.telecallers?.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                        No telecaller activity recorded yet.
                      </td>
                    </tr>
                  ) : (
                    teamStats.telecallers?.map((tc: any) => (
                      <tr key={tc.userId}>
                        <td style={{ fontWeight: 600 }}>{tc.name}</td>
                        <td>{tc.assigned}</td>
                        <td>{tc.calls}</td>
                        <td>{tc.connected}</td>
                        <td><span className="badge badge-qualified">{tc.qualified}</span></td>
                        <td style={{ fontWeight: 700 }}>{tc.conversionRate}%</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
