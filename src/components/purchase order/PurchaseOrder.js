import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Pagination } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { faSearch, faPlus } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../shared/Navbar";
const KEYS_WRITE_ACCESS = ["WRITE_PURCHASE_ORDERS", "ACCESS_ADMIN"];
const KEYS_READ_ACCESS = ["READ_PURCHASE_ORDERS", "ACCESS_ADMIN"];

const itemsPerPage = 10;
const PurchaseOrder = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [role, setRole] = useState("USER");
  const [permissions, setPermissions] = useState([]);
  const [filter, setFilter] = useState(null);
  const navigate = useNavigate();

  const mapColors = {
    PROCESSING: "blue",
    CONFIRMED: "green",
    PENDING: "yellow",
    CANCELLED: "red",
  };

  const updateOrder = async (params) => {
    const { purchaseOrderId, status } = params;
    const paramsUpdate = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify({ purchaseOrderId, status }),
    };

    try {
      const response = await fetch(
        "http://localhost:3002/purchase-order/",
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

  const filteredOrders = filter
    ? orders.filter((order) => order.status === filter.toUpperCase())
    : orders;

  useEffect(() => {
    const fetchData = async () => {
      const authenticated = localStorage.getItem("authenticated") === "true";

      if (!authenticated) {
        navigate("/");
      }

      try {
        const response = await fetch(`http://localhost:3002/purchase-order`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        });
        const { data } = await response.json();
        setOrders(data.purchaseOrders);
        const totalItems = data.purchaseOrders[0].totalItems;
        const calculatedTotalPages = Math.ceil(totalItems / itemsPerPage);
        setTotalPages(calculatedTotalPages);
        const client = await fetch(
          `http://localhost:3002/group/permissions/${localStorage.getItem(
            "clientId"
          )}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        const { data: clientData } = await client.json();
        setPermissions(clientData.permissions);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    const token = localStorage.getItem("token");
    const { role } = jwtDecode(token);
    setRole(role);
    fetchData();
  }, [currentPage, filter, navigate, totalPages]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFilterClick = async (selectedFilter) => {
    if (filter === selectedFilter) {
      setFilter(null);
    } else {
      setFilter(selectedFilter);
    }
    try {
      const response = await fetch(
        `http://localhost:3002/purchase-order/${selectedFilter.toUpperCase()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      const { data } = await response.json();
      const totalItems = data.count;
      const calculatedTotalPages = Math.ceil(totalItems / itemsPerPage);
      setOrders(data.purchaseOrders);
      setTotalPages(calculatedTotalPages);
    } catch (error) {
      console.error("Error al obtener datos:", error);
    }
  };

  const createPurchaseOrder = async () => {
    navigate("add");
  };

  return (
    <div className="d-flex">
      {/* Barra lateral */}
      <Navbar role={role} />

      {/* Contenido principal */}
      <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
          <h1 className="h2">Ordenes de Compra</h1>

          {/* Filtros */}
          <div className="d-flex mt-2 ml-2">
            {["pending", "confirmed", "cancelled", "processing"].map((f) => (
              <button
                key={f}
                type="button"
                className={`btn btn-${
                  filter === f ? "primary" : "secondary"
                } rounded-pill mr-2`}
                onClick={async () => handleFilterClick(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
            <FontAwesomeIcon
              icon={faFilter}
              className="ml-2"
              style={{ height: "38px" }}
            />
          </div>
          <div className="d-flex mt-2 ml-2">
            {KEYS_WRITE_ACCESS.some((permission) =>
              permissions.includes(permission)
            ) && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => createPurchaseOrder()}
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Agregar Orden de Compra
              </button>
            )}
          </div>
        </div>

        {/* Tabla de pedidos */}
        <table className="table table-striped table-bordered">
          <thead className="thead-dark">
            <tr>
              <th></th>
              <th>Proveedor</th>
              <th>name</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Importe</th>
            </tr>
          </thead>
          {KEYS_READ_ACCESS.some((permission) =>
            permissions.includes(permission)
          ) && (
            <tbody>
              {filteredOrders.map((item) => (
                <tr key={item.orderPurchaseId}>
                  <td>
                    <Link to={`/purchase-order/${item.orderPurchaseId}`}>
                      <FontAwesomeIcon icon={faSearch} />
                    </Link>
                  </td>
                  <td>{item.nameProvider}</td>
                  <td>{item.name}</td>
                  <td>{item.date}</td>
                  <td
                    style={{
                      color: mapColors[item.status],
                    }}
                  >
                    <strong>{item.status}</strong>
                  </td>
                  <td>{item.amount}</td>
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
                              purchaseOrderId: item.orderPurchaseId,
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
                              purchaseOrderId: item.orderPurchaseId,
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
                              purchaseOrderId: item.orderPurchaseId,
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

        <Pagination>
          {Array.from({ length: totalPages }, (_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === currentPage}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      </main>
    </div>
  );
};

export default PurchaseOrder;
