import React, { useState, useEffect } from "react";

const Metrics = () => {
    const [metrics, setMetrics] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getMetrics = async () => {
            try {
                const response = await fetch("http://localhost:5001/metrics");
                if (!response.ok) {
                    throw new Error("Error: Failed to get metrics");
                }
                const data = await response.json();
                setMetrics(data);
            } catch (err) {
                setError(err.message);
            }
        };

        getMetrics();
        const interval = setInterval(getMetrics, 5000);

        return () => clearInterval(interval);
    }, []);

    if (error) return <div style={{ color: "red" }}>Error: {error}</div>;
    if (!metrics) return <div>Loading metrics...</div>;

    const {
        "CPU Usage(%)": cpuUsage = "N/A",
        "Memory Usage(%)": memoryUsage = "N/A",
        "IO(Disk) Read(MB)": diskRead = "N/A",
        "IO(Disk) Write(MB)": diskWrite = "N/A",
        "Disk Usage(%)": diskUsage = "N/A",
        "OS User Time(s)": userTime = "N/A",
        "OS System Time(s)": systemTime = "N/A",
        "OS Idle Time(s)": idleTime = "N/A"
    } = metrics;

    return (
        <div className="metrics-container">
            <ul>
                <p>CPU Usage: {cpuUsage}%</p>
                <p>Memory Usage: {memoryUsage}%</p>
                <p>IO(Disk) Read: {diskRead} MB</p>
                <p>IO(Disk) Write: {diskWrite} MB</p>
                <p>Disk Usage: {diskUsage}%</p>
                <p>OS User Time: {userTime} s</p>
                <p>OS System Time: {systemTime} s</p>
                <p>OS Idle Time: {idleTime} s</p>
            </ul>
        </div>
    );
};

export default Metrics;
