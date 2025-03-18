import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const CPUChart = ({ cpuHistory }) => {
    const chartData = {
        labels: Array.from(Array(cpuHistory.length).keys()),
        datasets: [
            {
                label: 'CPU Usage (%)',
                data: cpuHistory, 
                fill: false,
                borderColor: 'steelblue',
                tension: 0.1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                min: 0,
                max: 100,
                title: {
                    display: true,
                    text: 'CPU Usage (%)',
                },
            },
            x: {
                title: {
                    display: false,
                    text: 'Time',
                },
                ticks: {
                    display: true, 
                },
            },
        },
        plugins: {
            legend: {
                display: true,
                position: 'top',
            },
            title: {
                display: true,
                text: 'CPU Usage Over Time',
            },
        },
    };

    return (
        <div className="chart-container">
            <Line data={chartData} options={chartOptions} />
        </div>
    );  
};

export default CPUChart;
