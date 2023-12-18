import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const populateTable = (orders) => {
  const mapColors = {
    PROCESSING: "blue",
    CONFIRMED: "green",
    PENDING: "yellow",
    CANCELLED: "red",
  };
  
  const updateOrder = async (params) => {
    const { orderId, status } = params;
    const paramsUpdate = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify({ orderId, status }),
    };

    try {
      const response = await fetch(
        "http://localhost:3002/order/",
        paramsUpdate
      );

      if (!response.ok) {
        toast.error("Ocurrio un error al intentar actualizar la orden.");
      }

      await response.json();
      toast.success("Actualizacion exitosa");
      window.location.reload();
    } catch (error) {
      toast.error("Ocurrio un error al intentar actualizar la orden.");
    }
  };

  return (
    <table className="table table-striped table-bordered">
      <thead className="thead-dark">
        <tr>
          <th></th>
          <th>Cliente</th>
          <th>Fecha</th>
          <th>Estado</th>
          <th>Importe</th>
          <th>Tiempo estimado(min)</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((item) => (
          <tr key={item.orderId}>
            <td>
              <Link to={`/order/${item.orderId}`}>
                <FontAwesomeIcon icon={faSearch} />
              </Link>
            </td>
            <td>{item.clientName}</td>
            <td>{item.date}</td>
            <td
              style={{
                color: mapColors[item.status],
              }}
            >
              <strong>{item.status}</strong>
            </td>
            <td>{item.amount}</td>
            <td>{item.deliveryTime}</td>
            <td>
              {item.status === "PENDING" && (
                <button
                  style={{ marginRight: "5px" }}
                  className="btn btn-success btn-sm"
                  onClick={() =>
                    updateOrder({ orderId: item.orderId, status: "PROCESSING" })
                  }
                >
                  Confirmar
                </button>
              )}

              {item.status === "PROCESSING" && (
                <button
                  className="btn btn-success btn-sm"
                  style={{ marginRight: "5px" }}
                  onClick={() =>
                    updateOrder({ orderId: item.orderId, status: "CONFIRMED" })
                  }
                >
                  Finalizar
                </button>
              )}

              {item.status !== "CANCELLED" && item.status !== "CONFIRMED" && (
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() =>
                    updateOrder({ orderId: item.orderId, status: "CANCELLED" })
                  }
                >
                  Cancelar
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default populateTable;
