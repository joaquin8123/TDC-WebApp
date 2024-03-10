import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";
import Navbar from "../shared/Navbar";

const NewGroup = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("USER");
  const [permissions, setPermissions] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    selectedPermissionIds: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const authenticated = localStorage.getItem("authenticated") === "true";

      if (!authenticated) {
        navigate("/");
      }
      try {
        const response = await fetch(
          `http://localhost:3002/group/permissions`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        const { data } = await response.json();
        setPermissions(data.permissions);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    const token = localStorage.getItem("token");
    const { role } = jwtDecode(token);
    setRole(role);
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const createGroup = async ({ group }) => {
    const { name } = group;
    if (name.length < 4) {
      toast.error(
        "El nombre y la descripcion deben tener al menos 4 caracteres"
      );
      return;
    }

    const parseGroup = {
      name,
      permissionsIds: formData.selectedPermissionIds,
      active: true,
    };

    const paramsCreate = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify(parseGroup),
    };
    let data;
    try {
      const response = await fetch(
        "http://localhost:3002/group/",
        paramsCreate
      );

      if (response.ok) {
        data = await response.json();
        if (data.code === 201) {
          toast.success("Grupo creado exitosamente");
          setTimeout(() => {
            navigate("/groups");
          }, 2000);
        }
      } else {
        toast.error("El Grupo ya existe");
      }
    } catch (error) {
      toast.error("Ocurrio un error al intentar crear el Grupo");
    }
  };

  const backProducts = async () => {
    navigate("/groups");
  };

  const handlePermissionChange = (permissionId) => {
    const isSelected = formData.selectedPermissionIds.includes(permissionId);
    const selectedPermissionIds = isSelected
      ? formData.selectedPermissionIds.filter((id) => id !== permissionId)
      : [...formData.selectedPermissionIds, permissionId];

    setFormData({
      ...formData,
      selectedPermissionIds,
    });
  };

  return (
    <div className="d-flex">
      {/* Barra lateral */}
      <Navbar role={role} />

      {/* Contenido principal */}
      <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
          <h1 className="h2">Agregar Grupo</h1>
        </div>

        {/* New product */}
        <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-6">
                <div className="card mb-4 mx-4">
                  <div className="card-body p-4">
                    <div className="input-group mb-3">
                      <span className="input-group-text">Nombre</span>
                      <input
                        className="form-control"
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Permisos:</label>
                      {permissions.map((permission) => (
                        <div className="form-check" key={permission.id}>
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`permission_${permission.id}`}
                            value={permission.id}
                            checked={formData.selectedPermissionIds.includes(
                              permission.id
                            )}
                            onChange={() =>
                              handlePermissionChange(permission.id)
                            }
                          />
                          <label
                            className="form-check-label"
                            htmlFor={`permission_${permission.id}`}
                          >
                            {permission.name}
                          </label>
                        </div>
                      ))}
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
                      onClick={async () =>
                        await createGroup({ group: formData })
                      }
                    >
                      Crear Grupo
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

export default NewGroup;
