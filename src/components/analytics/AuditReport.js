import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { saveAs } from "file-saver";

const AuditReport = () => {
  const [auditData, setAuditData] = useState([]);
  const [actionCounts, setActionCounts] = useState({ actions: [], counts: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3002/order/auditReport`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        const { data } = await response.json();
        setAuditData(data.auditReport);
        setActionCountsData(data.auditReport);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const setActionCountsData = (data) => {
    const actionCountMap = data.reduce((acc, { action }) => {
      acc[action] = (acc[action] || 0) + 1;
      return acc;
    }, {});

    const actions = Object.keys(actionCountMap);
    const counts = Object.values(actionCountMap);

    setActionCounts({ actions, counts });
  };

  const downloadReport = () => {
    const reportData = `Action,User ID,Client ID,Date,Details\n${auditData
      .map(
        ({ action, user_id, client_id, date, details }) =>
          `${action},${user_id},${client_id},${date},${details}`
      )
      .join("\n")}`;
    const blob = new Blob([reportData], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "audit_report.csv");
  };

  const chartOptions = {
    labels: actionCounts.actions,
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
      {actionCounts.actions.length > 0 && (
        <Chart
          options={chartOptions}
          series={actionCounts.counts}
          type="pie"
          width="380"
        />
      )}
    </div>
  );
};

export default AuditReport;
