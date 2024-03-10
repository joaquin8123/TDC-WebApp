import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPlus } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import Navbar from "../shared/Navbar";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState("USER");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const authenticated = localStorage.getItem("authenticated") === "true";

      if (!authenticated) {
        navigate("/");
      }

      try {
        const response = await fetch(`http://localhost:3002/user/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        });
        const { data } = await response.json();
        setUsers(data.users);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    const token = localStorage.getItem("token");
    const { role } = jwtDecode(token);
    setRole(role);
    fetchData();
  }, [navigate]);

  const updateUser = async (params) => {
    const { userId, active } = params;
    const paramsUpdate = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify({ userId, active }),
    };

    try {
      const response = await fetch("http://localhost:3002/user/", paramsUpdate);

      if (!response.ok) {
        toast.error("Ocurrio un error al intentar actualizar el usuario");
      }

      await response.json();
      window.location.reload();
    } catch (error) {
      toast.error("Ocurrio un error al intentar actualizar el usuario");
    }
  };

  const createUser = async () => {
    navigate("/add-user");
  };

  return (
    <div className="d-flex">
      {/* Barra lateral */}
      <Navbar role={role} />

      {/* Contenido principal */}
      <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
          <h1 className="h2">Usuarios</h1>
          <div className="d-flex mt-2 ml-2">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => createUser()}
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Agregar Usuario
            </button>
          </div>
        </div>
        {/* Tabla de pedidos */}
        <table className="table table-striped table-bordered">
          <thead className="thead-dark">
            <tr>
              <th></th>
              <th>Username</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Grupos de Permisos</th>
            </tr>
          </thead>
          <tbody>
            {users.map((item) => (
              <tr key={item.id}>
                <td>
                  <Link to={`/user/${item.id}`}>
                    <FontAwesomeIcon icon={faSearch} />
                  </Link>
                </td>
                <td>{item.username}</td>
                <td>{item.rol_name}</td>
                <td>
                  <strong>{item.active}</strong>
                </td>
                <td>{item.group_name}</td>
                <td>
                  {item.active === 0 && (
                    <button
                      style={{ marginRight: "5px" }}
                      className="btn btn-success btn-sm"
                      onClick={() =>
                        updateUser({
                          userId: item.id,
                          active: true,
                        })
                      }
                    >
                      Activar
                    </button>
                  )}

                  {item.active === 1 && (
                    <button
                      className="btn btn-success btn-sm"
                      style={{ marginRight: "5px" }}
                      onClick={() =>
                        updateUser({
                          userId: item.id,
                          active: false,
                        })
                      }
                    >
                      Desactivar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default Users;
