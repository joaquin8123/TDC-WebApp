import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { saveAs } from "file-saver";

const AmountMonthly = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3002/order/monthlyAmount`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        const { data } = await response.json();
        setChartData(data.monthlyData);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };
    fetchData();
  }, []);

  const downloadReport = () => {
    let reportData = `Product,Order Count\n`;
    for (const data of chartData) {
      reportData += `${data.month} ${data.amount}\n`;
    }
    const blob = new Blob([reportData], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "salesAmount_report.csv");
  };

  return (
    <div>
      <h2>Total Facturado por Mes</h2>
      <button onClick={downloadReport}>Descargar Reporte</button>
      <LineChart
        width={600}
        height={300}
        data={chartData}
        margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
      >
        <XAxis dataKey="month" />
        <YAxis />
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="amount" stroke="#8884d8" />
      </LineChart>
    </div>
  );
};

export default AmountMonthly;
