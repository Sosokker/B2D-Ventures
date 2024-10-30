import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  labels: string[];
  data: number[];
  header:string
}

const PieChart = (props: PieChartProps) => {
  const chartData = {
    labels: props.labels,
    datasets: [
      {
        label: props.header,
        data: props.data,
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ width: "50%", margin: "auto" }}>
      <Pie data={chartData} />
    </div>
  );
};

export default PieChart;
