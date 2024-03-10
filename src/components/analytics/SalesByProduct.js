import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { saveAs } from "file-saver";

const SalesByProductChart = () => {
  const [productName, setProductName] = useState([]);
  const [values, setValues] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3002/order/salesByProduct`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        const { data } = await response.json();
        setData(data.salesByProduct);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };
    fetchData();
  }, []);

  const setData = (salesProducts) => {
    let productsName = [];
    let values = [];
    for (const data of salesProducts) {
      productsName.push(data.productName);
      values.push(data.orderCount);
    }
    setProductName(productsName);
    setValues(values);
  };

  const downloadReport = () => {
    const reportData = `Product,Order Count\n${productName.join(
      ","
    )}\n${values.join(",")}`;
    const blob = new Blob([reportData], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "salesProduct_report.csv");
  };

  const chartData = {
    labels: productName,
    series: values,
  };

  const chartOptions = {
    labels: chartData.labels,
    colors: ["#FF6384", "#36A2EB", "#FFCE56", "#8B4513"],
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

export default SalesByProductChart;
