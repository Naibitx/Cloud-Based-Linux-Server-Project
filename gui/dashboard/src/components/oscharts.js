import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const OSChart = ({ osUserHistory, osSystemHistory, osIdleHistory }) => {
    const chartData = {
        labels: Array.from(Array(osUserHistory.length).keys()),
        datasets: [
            {
                label: 'OS User Time (s)',
                data: osUserHistory,
                fill: false,
                borderColor: 'blue',
                tension: 0.1,
            },
            {
                label: 'OS System Time (s)',
                data: osSystemHistory,
                fill: false,
                borderColor: 'orange',
                tension: 0.1,
            },
            {
                label: 'OS Idle Time (s)',
                data: osIdleHistory,
                fill: false,
                borderColor: 'gray',
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
                title: {
                    display: true,
                    text: 'Time (s)',
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
                text: 'OS CPU Time (User/System/Idle) Over Time',
            },
        },
    };
    return (
        <div className="chart-container">
            <Line data={chartData} options={chartOptions} />
        </div>
    );
};

export default OSChart;
