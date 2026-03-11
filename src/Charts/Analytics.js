import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from 'recharts';
import './Analytics.css'; // optional CSS for cards

const Analytics = (props) => {
  const [stats, setStats] = useState({});
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/statsRoute');
        const data = await res.json();
        setStats(data);
      } catch (err) {
        setStats(null);
      }
    };
    fetchStats();
    fetchTenderChartData();
  }, []);

  const fetchTenderChartData = async () => {
    setChartData([
      { year: "2020-21", tenders: 42476 },
      { year: "2021-22", tenders: 28896 },
      { year: "2022-23", tenders: 81780 },
      { year: "2023-24", tenders: 174784 },
      { year: "2024-25", tenders: 95047 },
      { year: "2025-26", tenders: 49220 }
    ]);
  };

  return (
    <div className="analytics-container">
      <h2 style={{ color: props.mode === 'dark' ? 'thistle' : 'black', fontWeight: "bold" }}>Tender Dashboard</h2>

      <div className="stats-cards">
        <div className="card cyan">Total Tenders<br /><strong>{stats.totalTenders || 0}</strong></div>
        <div className="card green">Open Tenders<br /><strong>{stats.openTenders || 0}</strong></div>
        <div className="card yellow">Registered Companies<br /><strong>{stats.totalCompanies || 0}</strong></div>
        <div className="card red">Applications<br /><strong>{stats.totalApplications || 0}</strong></div>
      </div>

      <div className="chart-box">
        <h3 style={{ color: props.mode === 'dark' ? 'thistle' : 'black', fontWeight: "bold" }}>Number of Tenders Published (Year-wise)</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="tenders" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Analytics;