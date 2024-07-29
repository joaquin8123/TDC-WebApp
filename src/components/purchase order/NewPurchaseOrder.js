import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";
import Navbar from "../shared/Navbar";

const NewPurchaseOrder = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("USER");
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [numeration, setNumeration] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    nameProvider: "",
    status: "PENDING",
    date: new Date().toISOString().split("T")[0],
    amount: 0,
    products: [{ id: "", name: "", quantity: 1 }],
  });

  useEffect(() => {
    const fetchData = async () => {
      const authenticated = localStorage.getItem("authenticated") === "true";

      if (!authenticated) {
        navigate("/");
      }
      try {
        const responseNumeration = await fetch(
          `http://localhost:3002/purchase-order/num`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        const { data: dataNumeration } = await responseNumeration.json();
        setNumeration(dataNumeration.lastNumeration);

        const response = await fetch(`http://localhost:3002/supplier`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        });
        const { data } = await response.json();
        setSuppliers(data.suppliers);

        const responseProducts = await fetch(`http://localhost:3002/product`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        });
        const { data: dataProducts } = await responseProducts.json();
        setProducts(dataProducts.products);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    const token = localStorage.getItem("token");
    const { role } = jwtDecode(token);
    setRole(role);
    fetchData();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleProductChange = (index, e) => {
    const { name, value } = e.target;
    const updatedProducts = formData.products.map((product, i) =>
      i === index ? { ...product, [name]: value } : product
    );

    const newTotalAmount = updatedProducts.reduce((total, product) => {
      const productData = products.find((p) => p.name === value);
      return total + (productData ? productData.price * product.quantity : 0);
    }, 0);

    setFormData({
      ...formData,
      products: updatedProducts,
      amount: newTotalAmount.toFixed(2),
    });
  };

  const handleAddProduct = () => {
    setFormData((prevFormData) => {
      const updatedProducts = [
        ...prevFormData.products,
        { id: "", name: "", quantity: 1 },
      ];
      const newTotalAmount = updatedProducts.reduce((total, product) => {
        const prodData = products.find((p) => p.id === parseInt(product.id));
        return total + (prodData ? prodData.price * product.quantity : 0);
      }, 0);

      return {
        ...prevFormData,
        products: updatedProducts,
        amount: newTotalAmount.toFixed(2),
      };
    });
  };

  const handleRemoveProduct = (index) => {
    setFormData((prevFormData) => {
      const updatedProducts = prevFormData.products.filter(
        (_, i) => i !== index
      );
      const newTotalAmount = updatedProducts.reduce((total, product) => {
        const prodData = products.find((p) => p.id === parseInt(product.id));
        return total + (prodData ? prodData.price * product.quantity : 0);
      }, 0);

      return {
        ...prevFormData,
        products: updatedProducts,
        amount: newTotalAmount.toFixed(2),
      };
    });
  };

  const formatOrderName = (id) => {
    return `OC-${id.toString().padStart(5, "0")}`;
  };

  const createPurchaseOrder = async () => {
    const newPurchaseOrderId = parseInt(numeration) + 1;
    const newOrderName = formatOrderName(newPurchaseOrderId);

    const newOrder = {
      ...formData,
      name: newOrderName,
    };

    const paramsCreate = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify(newOrder),
    };

    try {
      const response = await fetch(
        "http://localhost:3002/purchase-order/add",
        paramsCreate
      );

      if (response.ok) {
        toast.success("Orden de compra creada exitosamente");
        setTimeout(() => {
          navigate("/purchase-order");
        }, 2000);
      } else {
        toast.error("Error al crear la orden de compra");
      }
    } catch (error) {
      toast.error("Ocurrió un error al intentar crear la orden de compra");
    }
  };

  return (
    <div className="d-flex">
      {/* Barra lateral */}
      <Navbar role={role} />

      {/* Contenido principal */}
      <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
          <h1 className="h2">Nueva Orden de Compra</h1>
        </div>

        {/* New purchase order */}
        <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-8">
                <div className="card mb-4 mx-4">
                  <div className="card-body p-4">
                    <div className="input-group mb-3">
                      <span className="input-group-text">Proveedor</span>
                      <select
                        className="form-select"
                        name="nameProvider"
                        value={formData.nameProvider}
                        onChange={handleChange}
                      >
                        <option value="">Seleccionar proveedor</option>
                        {suppliers.map((supplier) => (
                          <option key={supplier.id} value={supplier.name}>
                            {supplier.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="input-group mb-3">
                      <span className="input-group-text">Fecha</span>
                      <input
                        className="form-control"
                        type="date"
                        name="date"
                        readOnly
                        value={formData.date}
                      />
                    </div>
                    <div className="input-group mb-4">
                      <span className="input-group-text">Importe</span>
                      <input
                        className="form-control"
                        type="text"
                        name="amount"
                        readOnly
                        value={formData.amount}
                      />
                    </div>

                    {/* Tabla de Productos */}
                    <h3>Productos</h3>
                    <table className="table table-striped table-bordered">
                      <thead className="thead-dark">
                        <tr>
                          <th>Producto</th>
                          <th>Cantidad</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.products.map((product, index) => (
                          <tr key={index}>
                            <td>
                              <select
                                className="form-select"
                                name="id"
                                value={product.id}
                                onChange={(e) => handleProductChange(index, e)}
                              >
                                <option value="">Seleccionar producto</option>
                                {products.map((p) => (
                                  <option key={p.id} value={p.id}>
                                    {p.name}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td>
                              <input
                                className="form-control"
                                type="number"
                                name="quantity"
                                value={product.quantity}
                                onChange={(e) => handleProductChange(index, e)}
                              />
                            </td>
                            <td>
                              <button
                                className="btn btn-danger"
                                onClick={() => handleRemoveProduct(index)}
                              >
                                Eliminar
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <button
                      className="btn btn-secondary"
                      onClick={handleAddProduct}
                    >
                      Agregar Producto
                    </button>

                    <button
                      className="btn btn-primary px-4"
                      type="button"
                      style={{ marginRight: "5px" }}
                      onClick={() => navigate("/purchase-order")}
                    >
                      Volver
                    </button>
                    <button
                      className="btn btn-success"
                      type="button"
                      onClick={createPurchaseOrder}
                    >
                      Crear Orden de Compra
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NewPurchaseOrder;
