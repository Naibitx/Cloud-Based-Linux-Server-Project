import React, { useState } from 'react';

const Dashboard = () => {
    const [selectedMetric, setSelectedMetric] = useState(null);

    const Graphs = {  //Graph Components (All in One File
    CPU: () => <div className="graph"> CPU Chart</div>,
    Memory: () => <div className="graph">Memory Chart</div>,
    IO: () => <div className="graph">I/O </div>,
    Filesystem: () => <div className="graph"> Filesystem Chart</div>,
    OS: () => <div className="graph">OS Performance Chart</div>,
    };

    return (
        <div className="dashboard-cont">

        <div className="button-group">
            {Object.keys(Graphs).map((metric) => (
                <button
                    key={metric}
                    onClick={() => setSelectedMetric(metric)}
                    className={selectedMetric === metric ? 'active' : ''}
                >
                    {metric}
                </button>
            ))}
        </div>

        <div className="graph-cont">
        {selectedMetric ? React.createElement(Graphs[selectedMetric]) : <p>Click metric to view data</p>}
        </div>
    </div>
    );
};
export default Dashboard;
