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
                console.log('Frontend received data:', data); 
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
        CPU: (
            <div className="graph">
                {cpuHistoryData && <CPUChart cpuHistory={cpuHistoryData} />}
            </div>
        ),
    };

    return (
        <div className="dashboard-cont">
            {/* Buttons to select a metric */}
            <div className="button-group">
                {Object.keys(Graphs).map((metric) => (
                    <button
                    key="CPU"
                    onClick={() => {
                        setSelectedMetric("CPU");
                        console.log('Selected Metric:', "CPU");
                    }}
                    className={selectedMetric === "CPU" ? 'active' : ''}
                >
                    CPU
                </button>
                ))}
            </div>

            {/* Display the corresponding graph */}
            <div className="graph-cont"style={{ height: '300px' }}>
                {selectedMetric ? Graphs[selectedMetric] : <p>Select a metric to view data</p>}
            </div>
        </div>
    );
};

export default Dashboard;
