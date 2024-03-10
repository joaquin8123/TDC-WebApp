import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";
import Navbar from "../shared/Navbar";

const NewUser = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [rols, setRoles] = useState([]);
  const [role, setRole] = useState("USER");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    active: true,
    rolId: "",
    groupId: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const authenticated = localStorage.getItem("authenticated") === "true";

      if (!authenticated) {
        navigate("/");
      }

      try {
        const responseGruops = await fetch(`http://localhost:3002/group`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        });
        const responseRols = await fetch(`http://localhost:3002/group/rol`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        });
        const { data: dataGroups } = await responseGruops.json();
        const { data: dataRols } = await responseRols.json();
        setGroups(dataGroups.groups);
        setRoles(dataRols.rols);
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

  const createUser = async ({ user }) => {
    const { username, password, rolId, groupId } = user;
    if (username.length < 4 || password.length < 4) {
      toast.error(
        "El username y la password deben tener al menos 4 caracteres"
      );
      return;
    }
    if (!rolId || !groupId) {
      toast.error("Todos los campos son requeridos");
      return;
    }

    const parseProduct = {
      username,
      password,
      rolId: parseInt(rolId),
      groupId: parseInt(groupId),
      type: "user",
    };

    const paramsCreate = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify(parseProduct),
    };

    let data;
    try {
      const response = await fetch(
        "http://localhost:3002/auth/register",
        paramsCreate
      );

      if (response.ok) {
        data = await response.json();
        if (data.code === 201) {
          toast.success("User creado exitosamente");
          setTimeout(() => {
            navigate("/users");
          }, 2000);
        }
      } else {
        toast.error("El usuario ya existe");
      }
    } catch (error) {
      toast.error("Ocurrio un error al intentar crear el usuario");
    }
  };

  const backProducts = async () => {
    navigate("/users");
  };

  return (
    <div className="d-flex">
      {/* Barra lateral */}
      <Navbar role={role} />

      {/* Contenido principal */}
      <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
          <h1 className="h2">Agregar Usuario</h1>
        </div>

        {/* New product */}
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
                        required
                        value={formData.username}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="input-group mb-4">
                      <span className="input-group-text">Password</span>
                      <input
                        className="form-control"
                        type="password"
                        name="password"
                        value={formData.password}
                        required
                        onChange={handleChange}
                      />
                    </div>
                    <div className="input-group mb-4">
                      <label className="input-group-text" htmlFor="rolId">
                        Rol
                      </label>
                      <select
                        className="form-select"
                        id="rolId"
                        name="rolId"
                        value={formData.rolId}
                        onChange={handleChange}
                        required
                      >
                        <option value="" disabled>
                          Selecciona un rol
                        </option>
                        {rols.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="input-group mb-4">
                      <label className="input-group-text" htmlFor="groupId">
                        Grupo
                      </label>
                      <select
                        className="form-select"
                        id="groupId"
                        name="groupId"
                        value={formData.groupId}
                        onChange={handleChange}
                        required
                      >
                        <option value="" disabled>
                          Selecciona un grupo
                        </option>
                        {groups.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      className="btn btn-primary px-4"
                      type="button"
                      style={{ marginRight: "5px" }}
                      onClick={backProducts}
                    >
                      Volver
                    </button>
                    <button
                      className="btn btn-block btn-success"
                      type="button"
                      onClick={async () => await createUser({ user: formData })}
                    >
                      Crear Usuario
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

export default NewUser;
