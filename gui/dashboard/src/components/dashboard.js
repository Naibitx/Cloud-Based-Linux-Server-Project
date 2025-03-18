import React, { useState, useEffect } from 'react';
import CPUChart from './cpucharts';

const Dashboard = () => {
    const [selectedMetric, setSelectedMetric] = useState(null);
    const [cpuHistoryData, setCpuHistoryData] = useState([]);

    useEffect(() => {
        const fetchInitialMetrics = async () => {
            try {
                const response = await fetch('http://localhost:5001/metrics');
                if (!response.ok) {
                    console.error('Error: Failed to get metrics', response.status);
                    return;
                }
                const data = await response.json();
                setCpuHistoryData(data.cpu_history);
            } catch (error) {
                console.error('Error fetching metrics:', error);
            }
        };

        fetchInitialMetrics();
        const intervalId = setInterval(fetchInitialMetrics, 5000);
        return () => clearInterval(intervalId);
    }, []);

    const Graphs = {
        CPU:() => <CPUChart cpuHistory={cpuHistoryData} />,

    };
return (
    <div className="dashboard-cont">
        <div className="button-group">
            {Object.keys(Graphs).map((metric) => (
                <button
                    key={metric}
                    onClick={() => {
                        setSelectedMetric(metric);
                        console.log('Selected Metric:', metric);
                    }}
                    className={selectedMetric === metric ? 'active' : ''}
                >
                    {metric}
                </button>
            ))}
        </div>

        <div className="graph-cont" style={{ height: '300px' }}>
            {selectedMetric ? React.createElement(Graphs[selectedMetric]) : <p>Select a metric to view data</p>}
        </div>
    </div>
);
};

export default Dashboard;
