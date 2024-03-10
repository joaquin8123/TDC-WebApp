import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Navbar from "../shared/Navbar";

const UserDetail = () => {
  const { userId } = useParams();
  const [role, setRole] = useState("USER");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    active: null,
    group_name: null,
    rol_name: null,
    id: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      const authenticated = localStorage.getItem("authenticated") === "true";

      if (!authenticated) {
        navigate("/");
      }
      try {
        const response = await fetch(
          `http://localhost:3002/user/id/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        const { data } = await response.json();
        setFormData(data.user[0]);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    const token = localStorage.getItem("token");
    const { role } = jwtDecode(token);
    setRole(role);
    fetchData();
  }, []);

  const backOrders = async () => {
    navigate("/users");
  };

  return (
    <div className="d-flex">
      {/* Barra lateral */}
      <Navbar role={role} />

      {/* Contenido principal */}
      <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
          <h1 className="h2">Usuario</h1>
        </div>

        {/* Form Order */}
        <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-6">
                <div className="card mb-4 mx-4">
                  <div className="card-body p-4">
                    <div className="input-group mb-3">
                      <span className="input-group-text">Username</span>
                      <input
                        className="form-control"
                        type="text"
                        name="username"
                        value={formData.username}
                        readOnly
                      />
                    </div>
                    <div className="input-group mb-4">
                      <span className="input-group-text">Estado</span>
                      <input
                        className="form-control"
                        type="text"
                        name="active"
                        value={formData.active}
                        readOnly
                      />
                    </div>
                    <div className="input-group mb-4">
                      <span className="input-group-text">Rol</span>
                      <input
                        className="form-control"
                        type="text"
                        name="rol_name"
                        value={formData.rol_name}
                        readOnly
                      />
                    </div>
                    <div className="input-group mb-4">
                      <span className="input-group-text">Grupo</span>
                      <input
                        className="form-control"
                        type="text"
                        name="group_name"
                        value={formData.group_name}
                        readOnly
                      />
                    </div>
                    <button
                      className="btn btn-primary px-4"
                      type="button"
                      style={{ marginRight: "5px" }}
                      onClick={backOrders}
                    >
                      Volver
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

export default UserDetail;
