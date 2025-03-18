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
        <div>
            <h1>System Metrics</h1>
            <ul>
                <li>CPU Usage: {cpuUsage}%</li>
                <li>Memory Usage: {memoryUsage}%</li>
                <li>Disk Read: {diskRead} MB</li>
                <li>Disk Write: {diskWrite} MB</li>
                <li>Disk Usage: {diskUsage}%</li>
                <li>CPU User Time: {userTime} s</li>
                <li>CPU System Time: {systemTime} s</li>
                <li>CPU Idle Time: {idleTime} s</li>
            </ul>
        </div>
    );
};

export default Metrics;
