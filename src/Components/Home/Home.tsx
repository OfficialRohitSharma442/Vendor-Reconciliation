
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
                type: 'line' as const,
                label: 'Dataset 2',
                backgroundColor: 'rgb(255, 0, 0)',
                data: labels.map(() => Math.floor(Math.random() * 2000 - 1000)),
                borderColor: 'white',
                borderWidth: 2,
            },
            {
                type: 'line' as const,
                label: 'Dataset 3',
                backgroundColor: 'rgb(53, 162, 235)',
                data: labels.map(() => Math.floor(Math.random() * 2000 - 1000)),
            },
        ],
    };

    return (


        <div style={{ display: "flex" }}>

            {/*<div style={{ width: "50%", height: "50%" }}>
                <BarLineChart data={chartData} />
                <BarLineChart data={chartData} />

            </div>
            <div style={{ width: "50%", height: "50%" }}>
                <BarLineChart data={chartData} />
                <BarLineChart data={chartData} />

            </div>
    */}

            <h2>HOME page</h2>
        </div>
    )
};

export default Home;
