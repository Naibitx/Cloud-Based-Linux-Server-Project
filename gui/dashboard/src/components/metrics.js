import React, {useState, useEffect} from 'react';

const Metrics = ()=> {
    const [metrics, setMetrics]= useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getMetrics = async() => {
            try{
                const response = await fetch('http://localhost:5001/metrics')
                if(!response.ok){
                    throw new Error ('Error: failed to get metrics');
                }
                const data = await response.json();
                setMetrics(data);
            } catch (err){
                setError(err.message);
            }
        };

        getMetrics();
    }, []);

    if (error){
        return <div>Error: {error}</div>;
    }

    if (!metrics){
        return <div>Loading metrics...</div>;
    }

    return(
        <div>
            <h1>Metrics</h1>
            
            <ul>
                <li>CPU Usage: {metrics["CPU Usage(%)"]}%</li>
                <li>Memory Usage: {metrics["Memory Usage(%)"]}%</li>
                <li>Disk Read: {metrics["IO(Disk) Read(MB)"]} MB</li>
                <li>Disk Write: {metrics["IO(Disk) Write(MB)"]} MB</li>
                <li>Disk Usage: {metrics["Disk Usage(%)"]}%</li>
                <li>CPU User Time: {metrics["OS User Time(s)"]} s</li>
                <li>CPU System Time: {metrics["OS System Time(s)"]} s</li>
                <li>CPU Idle Time: {metrics["OS Idle Time(s)"]} s</li>
            </ul>

        </div>

    );

};

export default Metrics;