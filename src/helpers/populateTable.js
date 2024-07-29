import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const KEYS_WRITE_ACCESS = ["WRITE_ORDERS", "ACCESS_ADMIN"];
const KEYS_READ_ACCESS = ["READ_ORDERS", "ACCESS_ADMIN"];
const populateTable = (orders, filterStatus, permissions) => {
  const mapColors = {
    PROCESSING: "blue",
    CONFIRMED: "green",
    PENDING: "yellow",
    CANCELLED: "red",
  };

  const updateOrder = async (params) => {
    const { orderId, status, userId } = params;
    const paramsUpdate = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify({ orderId, status, userId }),
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

  const filteredOrders = filterStatus
    ? orders.filter((order) => order.status === filterStatus.toUpperCase())
    : orders;

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
      {KEYS_READ_ACCESS.some((permission) =>
        permissions.includes(permission)
      ) && (
        <tbody>
          {filteredOrders.map((item) => (
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
                {KEYS_WRITE_ACCESS.some((permission) =>
                  permissions.includes(permission)
                ) &&
                  item.status === "PENDING" && (
                    <button
                      style={{ marginRight: "5px" }}
                      className="btn btn-success btn-sm"
                      onClick={() => {
                        updateOrder({
                          orderId: item.orderId,
                          status: "PROCESSING",
                          userId: localStorage.getItem("clientId"),
                        });
                      }}
                    >
                      Confirmar
                    </button>
                  )}

                {KEYS_WRITE_ACCESS.some((permission) =>
                  permissions.includes(permission)
                ) &&
                  item.status === "PROCESSING" && (
                    <button
                      className="btn btn-success btn-sm"
                      style={{ marginRight: "5px" }}
                      onClick={() =>
                        updateOrder({
                          orderId: item.orderId,
                          status: "CONFIRMED",
                          userId: localStorage.getItem("clientId"),
                        })
                      }
                    >
                      Finalizar
                    </button>
                  )}

                {KEYS_WRITE_ACCESS.some((permission) =>
                  permissions.includes(permission)
                ) &&
                  item.status !== "CANCELLED" &&
                  item.status !== "CONFIRMED" && (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() =>
                        updateOrder({
                          orderId: item.orderId,
                          status: "CANCELLED",
                          userId: localStorage.getItem("clientId"),
                        })
                      }
                    >
                      Cancelar
                    </button>
                  )}
              </td>
            </tr>
          ))}
        </tbody>
      )}
    </table>
  );
};

export default populateTable;
