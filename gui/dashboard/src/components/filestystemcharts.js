import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const FilesystemChart = ({ filesystemHistory }) => {
    console.log(filesystemHistory)
    const chartData = {
        labels: Array.from(Array(filesystemHistory.length).keys()),
        datasets: [
            {
                label: 'Disk Usage (%)',
                data: filesystemHistory.map(item => item.usage),
                fill: false,
                borderColor: 'red',
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
                    text: 'Disk Usage (%)',
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
                text: 'Disk Usage Over Time',
            },
        },
    };

    return (
        <div className="chart-container">
            <Line data={chartData} options={chartOptions} />
        </div>
    );  
};

export default FilesystemChart;
