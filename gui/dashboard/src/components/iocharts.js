import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const IOChart = ({ ioReadHistory, ioWriteHistory }) => {
    const chartData = {
        labels: Array.from(Array(ioReadHistory.length).keys()),
        datasets: [
            {
                label: 'IO Disk Read (MB)',
                data: ioReadHistory,
                fill: false,
                borderColor: 'green',
                tension: 0.1,
            },
            {
                label: 'IO Disk Write (MB)',
                data: ioWriteHistory,
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
                title: {
                    display: true,
                    text: 'MB',
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
                text: 'IO Disk Usage (Read/Write) Over Time',
            },
        },
    };

    return (
        <div className="chart-container">
            <Line data={chartData} options={chartOptions} />
        </div>
    );
};

export default IOChart;
