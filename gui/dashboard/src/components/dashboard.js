import React, { useState, useEffect } from "react";
import CPUChart from "./cpucharts";
import MemoryChart from "./memorycharts";
import IOChart from "./iocharts";
import FileSystemChart from "./filestystemcharts";
import OSChart from "./oscharts"; 

const Dashboard = () => {
    const [selectedMetric, setSelectedMetric] = useState(null);
    const [metricsHistory, setMetricsHistory] = useState({
        cpu_history: [],
        memory_history: [],
        io_read_history: [],
        io_write_history: [],
        filesystem_history: [],
        os_history: { user: [], system: [], idle: [] }
    });
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const response = await fetch("http://104.196.134.124:5001/metrics");
                if (!response.ok) {
                    console.error("Error: Failed to get metrics", response.status);
                    return;
                }
    
                const data = await response.json();
                
                setMetricsHistory(prev => ({
                    cpu_history: data.cpu_history || prev.cpu_history,
                    memory_history: data.memory_history || prev.memory_history,
                    io_read_history: data.io_read_history || prev.io_read_history,
                    io_write_history: data.io_write_history || prev.io_write_history,
                    filesystem_history: data.filesystem_history || prev.filesystem_history,
                    os_history: {
                        user: data.os_user_history || prev.os_history.user,
                        system: data.os_system_history || prev.os_history.system,
                        idle: data.os_idle_history || prev.os_history.idle
                    }
                }));

                // Handle Alerts
                if (data.alerts) {
                    setAlerts(data.alerts);
                }

            } catch (error) {
                console.error("Error fetching metrics:", error);
            }
        };
    
        fetchMetrics();
        const intervalId = setInterval(fetchMetrics, 5000);
        return () => clearInterval(intervalId);
    }, []);

    const Graphs = {
        CPU: () => <CPUChart cpuHistory={metricsHistory.cpu_history} />,
        Memory: () => <MemoryChart memoryHistory={metricsHistory.memory_history} />,
        IO: () => <IOChart ioReadHistory={metricsHistory.io_read_history} ioWriteHistory={metricsHistory.io_write_history} />,
        Filesystem: () => <FileSystemChart filesystemHistory={metricsHistory.filesystem_history} />,
        OS: () => <OSChart osUserHistory={metricsHistory.os_history.user} osSystemHistory={metricsHistory.os_history.system} osIdleHistory={metricsHistory.os_history.idle} />,
    };
    
    return (
        <div className="dashboard-container">
            {/* Alerts Section */}
            {alerts.length > 0 && (
                <div className="alert-box">
                    {alerts.map((alert, index) => (
                        <div key={index} className="alert">
                            ⚠️ {alert}
                        </div>
                    ))}
                </div>
            )}

            <div className="button-group">
                {Object.keys(Graphs).map(metric => (
                    <button
                        key={metric}
                        onClick={() => setSelectedMetric(metric)}
                        className={`image-button ${selectedMetric === metric ? "active" : ""}`}>
                        {metric}
                    </button>
                ))}
            </div>

            <div className="graph-container">
                {selectedMetric ? React.createElement(Graphs[selectedMetric]) : <p>Select a metric to view data</p>}
            </div>
        </div>
    );
};

export default Dashboard;