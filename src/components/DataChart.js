import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { format } from "date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

const aggregateDataByMonth = (data) => {
  const groupedData = {};

  const startDate = new Date("2020-01-01"); // Example: Start from 2020

  data.forEach((d) => {
    if (d.out_of_service_date) {
      const date = new Date(d.out_of_service_date);
      if (!isNaN(date) && date >= startDate) {
        const month = format(date, "yyyy-MM");
        if (!groupedData[month]) {
          groupedData[month] = 0;
        }
        groupedData[month] += 1;
      } else {
        console.warn(
          `Invalid date or date before startDate: ${d.out_of_service_date}`
        );
      }
    }
  });

  return groupedData;
};

const DataChart = ({ data }) => {
  const aggregatedData = aggregateDataByMonth(data);

  const labels = Object.keys(aggregatedData);
  const counts = Object.values(aggregatedData);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Out of Service Per Month",
        data: counts,
        backgroundColor: "rgba(75,192,192,0.6)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Out of Service Per Month",
      },
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: "quarter", // Change to 'quarter' or 'year' to group data accordingly
          tooltipFormat: "MMM yyyy",
        },
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Count",
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default DataChart;
