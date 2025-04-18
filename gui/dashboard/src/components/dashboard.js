import React, { useState, useEffect } from "react";
import CPUChart from "./cpucharts";
import MemoryChart from "./memorycharts";
import IOChart from "./iocharts";
import FileSystemChart from "./filestystemcharts";
import OSChart from "./oscharts"; 

const Dashboard = () => {

    //state hooks for selected metric, alerts, and metrics history
    const [selectedMetric, setSelectedMetric] = useState(null);
    const [alerts, setAlerts] = useState([]);
    const [metricsHistory, setMetricsHistory] = useState({
        cpu_history: [],
        memory_history: [],
        io_read_history: [],
        io_write_history: [],
        filesystem_history: [],
        os_history: { user: [], system: [], idle: [] }
    });

    // useEffect hook to fetch metrics data from the backend every 5 seconds
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
            } catch (error) {
                console.error("Error fetching metrics:", error);
            }
        };
    
        fetchMetrics();
        const intervalId = setInterval(fetchMetrics, 5000);//fetch metrics every 5 seconds
        return () => clearInterval(intervalId);
    }, []);
    // useEffect hook to fetch alerts data from the backend every 5 seconds
    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const response = await fetch("http://104.196.134.124:5001/alerts");
                if (!response.ok) {
                    console.error("Error fetching alerts:", response.status, response.statusText);
                    return;
                }
                const data = await response.json();
                console.log("Fetched Alerts:", data);
    
                // Ensure alerts is an array before setting state
                setAlerts(Array.isArray(data.alerts) ? data.alerts : []);
            } catch (error) {
                console.error("Error fetching alerts:", error);
            }
        };
    
        fetchAlerts();
        const intervalId = setInterval(fetchAlerts, 5000); // Auto-refresh every 5 seconds
    
        return () => clearInterval(intervalId);
    }, []);
    // Mapping for different charts based on metrics
    const Graphs = {
        CPU: () => <CPUChart cpuHistory={metricsHistory.cpu_history} />,
        Memory: () => <MemoryChart memoryHistory={metricsHistory.memory_history} />,
        IO: () => <IOChart ioReadHistory={metricsHistory.io_read_history} ioWriteHistory={metricsHistory.io_write_history} />,
        Filesystem: () => <FileSystemChart filesystemHistory={metricsHistory.filesystem_history} />,
        OS: () => <OSChart osUserHistory={metricsHistory.os_history.user} osSystemHistory={metricsHistory.os_history.system} osIdleHistory={metricsHistory.os_history.idle} />,
    };
    //images for buttons, with different states for default, hover, and active
    const buttonImages = {
        CPU: {
            default: "/cpu.png", 
            hover: "/cpulight.png",  
            active: "/cpulight.png"  
        },
        Memory: {
            default: "/memory.png",  
            hover: "/memorylight.png",  
            active: "/memorylight.png"  
        },
        IO: {
            default: "/io.png",  
            hover: "/iolight.png", 
            active: "/iolight.png"  
        },
        Filesystem: {
            default: "/filesystem.png", 
            hover: "/filesystemlight.png",  
            active: "/filesystemlight.png"  
        },
        OS: {
            default: "/os.png",  
            hover: "/oslight.png",  
            active: "/oslight.png" 
        }
    };

    return (
        <div className="dashboard-container">
                {/* Alerts Section */}
                {alerts.length > 0 && (
                    <div className="alert-box">
                        {alerts.map((alert, index) => (
                            <div key={index} className={`alert ${alert.includes("CPU") ? "alert-cpu" : 
                                                        alert.includes("Memory") ? "alert-memory" : 
                                                        "alert-disk"}`}>
                                ⚠️ {alert}
                            </div>
                        ))}
                    </div>
                )}
            
            <div className="button-group">
                {Object.keys(Graphs).map(metric => (
                    <button
                        key={metric}
                        onClick={() => {
                            setSelectedMetric(metric);
                            console.log("Selected Metric:", metric);
                        }}
                        className={`image-button ${selectedMetric === metric ? "active" : ""}`}>
                        <div className="image-container">
                            <img 
                                src={selectedMetric === metric ? buttonImages[metric].active : buttonImages[metric].default}
                                alt={`${metric} Button`} 
                                className="button-image"
                            />
                            <span className="button-text">{metric}</span>
                            </div>
                    </button>
                ))}
            </div>

            <div className="graph-container" style={{ height: "300px", backgroundColor: "#FFFFFF" }}>
                {selectedMetric ? React.createElement(Graphs[selectedMetric]) : <p>Select a metric to view data</p>}
            </div>
        </div>
    );
};


export default Dashboard;