import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { saveAs } from "file-saver";


const SalesByMonthChart = () => {
  const [month, setMonth] = useState([]);
  const [values, setValues] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3002/order/salesByMonth`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        const { data } = await response.json();
        setData(data.salesByMonth);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };
    fetchData();
  }, []);

  const setData = (monthlyData) => {
    let months = [];
    let values = [];
    for (const data of monthlyData) {
      months.push(data.month);
      values.push(data.sales_count);
    }
    setMonth(months);
    setValues(values);
  };

  const downloadReport = () => {
    const reportData = `Product,Order Count\n${month.join(
      ","
    )}\n${values.join(",")}`;
    const blob = new Blob([reportData], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "salesMonth_report.csv");
  };

  const chartData = {
    labels: month,
    series: values,
  };

  const chartOptions = {
    labels: chartData.labels,
    colors: [
      "#FF6384",
      "#36A2EB",
      "#FFCE56",
      "#8B4513",
      "#008080",
      "#9932CC",
      "#FF5733",
      "#4CAF50",
      "#FFD700",
      "#800080",
      "#00FFFF",
      "#FF6347",
    ],
    legend: {
      position: "bottom",
    },
  };

  return (
    <div>
      <button onClick={downloadReport}>Descargar Reporte</button>
      <Chart
        options={chartOptions}
        series={chartData.series}
        type="pie"
        width="380"
      />
    </div>
  );
};

export default SalesByMonthChart;
