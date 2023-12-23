import React, { useState } from 'react';
import BarLineChart from '../utils/BarLineChart';

const Home = () => {

    const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    const chartData = {
        labels,
        datasets: [
            {
                type: 'line' as const,
                label: 'Dataset 1',
                borderColor: 'rgb(255, 99, 132)',
                borderWidth: 2,
                fill: false,
                data: labels.map(() => Math.floor(Math.random() * 2000 - 1000)),
            },
            {
                type: 'bar' as const,
                label: 'Dataset 2',
                backgroundColor: 'rgb(75, 192, 192)',
                data: labels.map(() => Math.floor(Math.random() * 2000 - 1000)),
                borderColor: 'white',
                borderWidth: 2,
            },
            {
                type: 'bar' as const,
                label: 'Dataset 3',
                backgroundColor: 'rgb(53, 162, 235)',
                data: labels.map(() => Math.floor(Math.random() * 2000 - 1000)),
            },
        ],
    };

    return (



        <>
            <BarLineChart data={chartData} />;

        </>
    )
};

export default Home;
