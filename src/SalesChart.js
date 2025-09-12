import React from 'react'; 
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function SalesChart({ sales = [] }) {
  const data = {
    labels: sales.map(s => s.month),
    datasets: [
      {
        label: 'Monthly Sales (Maluti)',
        data: sales.map(s => s.total),
        backgroundColor: 'rgba(255,99,132,0.6)',
      },
    ],
  };

  return (
    <div style={{ marginTop: '30px' }}>
      <h3>Sales Overview</h3>
      <Bar data={data} />
    </div>
  );
}

export default SalesChart;
