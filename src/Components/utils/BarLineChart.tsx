// BarLineChart.js
import React, { MouseEvent, useRef } from 'react';
import type { InteractionItem } from 'chart.js';
import {
    Chart as ChartJS,
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Tooltip,
} from 'chart.js';
import { Chart, getDatasetAtEvent, getElementAtEvent, getElementsAtEvent } from 'react-chartjs-2';

ChartJS.register(LinearScale, CategoryScale, BarElement, PointElement, LineElement, Legend, Tooltip);

const options = {
    scales: {
        y: {
            beginAtZero: true,
        },
    },
};

interface BarLineChartProps {
    data: {
        labels: string[];
        datasets: {
            type: 'line' | 'bar';
            label: string;
            borderColor?: string;
            borderWidth?: number;
            fill?: boolean;
            backgroundColor?: string;
            data: number[];
        }[];
    };
}

const BarLineChart: React.FC<BarLineChartProps> = ({ data }) => {
    const chartRef = useRef<ChartJS>(null);

    const printDatasetAtEvent = (dataset: InteractionItem[]) => {
        if (!dataset.length) return;

        const datasetIndex = dataset[0].datasetIndex;

        console.log(data.datasets[datasetIndex].label);
    };

    const printElementAtEvent = (element: InteractionItem[]) => {
        if (!element.length) return;

        const { datasetIndex, index } = element[0];

        console.log(data.labels[index], data.datasets[datasetIndex].data[index]);
    };

    const printElementsAtEvent = (elements: InteractionItem[]) => {
        if (!elements.length) return;

        console.log(elements.length);
    };

    const onClick = (event: MouseEvent<HTMLCanvasElement>) => {
        const { current: chart } = chartRef;

        if (!chart) {
            return;
        }

        printDatasetAtEvent(getDatasetAtEvent(chart, event));
        printElementAtEvent(getElementAtEvent(chart, event));
        printElementsAtEvent(getElementsAtEvent(chart, event));
    };

    return <Chart ref={chartRef} type='bar' onClick={onClick} options={options} data={data} />;
};

export default BarLineChart;
