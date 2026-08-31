'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Navbar } from '../../components/Navbar';
import { FunnelChart } from '../../components/FunnelChart';
import { adminApi } from '../../lib/api';

export default function ReportsPage() {
  const [funnelData, setFunnelData] = useState<any[]>([]);
  const [sourcesData, setSourcesData] = useState<any[]>([]);
  const [teamData, setTeamData] = useState<any>({ telecallers: [], executives: [] });
  const [pipelineData, setPipelineData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const [funnelRes, sourcesRes, teamRes, pipeRes] = await Promise.all([
        adminApi.get('/reports/funnel'),
        adminApi.get('/reports/sources'),
        adminApi.get('/reports/team'),
        adminApi.get('/reports/pipeline'),
      ]);

      if (funnelRes.data.success) setFunnelData(funnelRes.data.data);
      if (sourcesRes.data.success) setSourcesData(sourcesRes.data.data);
      if (teamRes.data.success) setTeamData(teamRes.data.data);
      if (pipeRes.data.success) setPipelineData(pipeRes.data.data);
    } catch (e) {
      //
    } finally {
      setIsLoading(false);
    }
  };

  const exportTableToCsv = (filename: string, rows: any[]) => {
    if (!rows || rows.length === 0) return;
    const keys = Object.keys(rows[0]);
    const csvContent = [
      keys.join(','),
      ...rows.map((row) => keys.map((k) => `"${row[k] || ''}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Reports & Performance Analytics" subtitle="Comprehensive sales intelligence, conversion ratios, and source ROI" />

        <div className="page-body">
          {/* Top Funnel Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginBottom: '24px' }}>
            <FunnelChart stages={funnelData} />

            {/* Pipeline Stage Breakdown */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3>💼 Pipeline Stage Breakdown</h3>
                <button
                  className="btn btn-secondary"
                  style={{ padding: '4px 8px', fontSize: '12px' }}
                  onClick={() => exportTableToCsv('pipeline_report', pipelineData)}
                >
                  Export CSV
                </button>
              </div>

              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Deal Stage</th>
                      <th>Deals</th>
                      <th>Total Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pipelineData.map((pipe) => (
                      <tr key={pipe.stage}>
                        <td style={{ fontWeight: 600 }}>{pipe.stage}</td>
                        <td>{pipe.count}</td>
                        <td style={{ fontWeight: 700, color: 'var(--success)' }}>
                          ₹{Number(pipe.totalValue || 0).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Lead Source Performance */}
          <div className="card" style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3>🎯 Lead Sources Conversion & Revenue ROI</h3>
              <button
                className="btn btn-secondary"
                style={{ padding: '4px 8px', fontSize: '12px' }}
                onClick={() => exportTableToCsv('lead_sources_report', sourcesData)}
              >
                Export CSV
              </button>
            </div>

            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Source Name</th>
                    <th>Total Leads</th>
                    <th>Won Deals</th>
                    <th>Total Revenue</th>
                    <th>Conversion Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {sourcesData.map((src) => (
                    <tr key={src.sourceId}>
                      <td style={{ fontWeight: 600 }}>{src.sourceName}</td>
                      <td>{src.leads}</td>
                      <td><span className="badge badge-won">{src.won}</span></td>
                      <td style={{ fontWeight: 700, color: 'var(--success)' }}>
                        ₹{Number(src.revenue || 0).toLocaleString('en-IN')}
                      </td>
                      <td style={{ fontWeight: 700 }}>{src.conversionPercent}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sales Team Performance Matrix */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* Executives */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3>👔 Sales Executives Revenue</h3>
                <button
                  className="btn btn-secondary"
                  style={{ padding: '4px 8px', fontSize: '12px' }}
                  onClick={() => exportTableToCsv('executives_report', teamData.executives)}
                >
                  Export
                </button>
              </div>

              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Executive</th>
                      <th>Deals</th>
                      <th>Won</th>
                      <th>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamData.executives?.map((exec: any) => (
                      <tr key={exec.userId}>
                        <td style={{ fontWeight: 600 }}>{exec.name}</td>
                        <td>{exec.assigned}</td>
                        <td><span className="badge badge-won">{exec.won}</span></td>
                        <td style={{ fontWeight: 700, color: 'var(--success)' }}>
                          ₹{Number(exec.revenue || 0).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Telecallers */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3>🎧 Telecaller Calling Efficiency</h3>
                <button
                  className="btn btn-secondary"
                  style={{ padding: '4px 8px', fontSize: '12px' }}
                  onClick={() => exportTableToCsv('telecallers_report', teamData.telecallers)}
                >
                  Export
                </button>
              </div>

              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Telecaller</th>
                      <th>Assigned</th>
                      <th>Calls</th>
                      <th>Qualified</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamData.telecallers?.map((tc: any) => (
                      <tr key={tc.userId}>
                        <td style={{ fontWeight: 600 }}>{tc.name}</td>
                        <td>{tc.assigned}</td>
                        <td>{tc.calls}</td>
                        <td><span className="badge badge-qualified">{tc.qualified}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
