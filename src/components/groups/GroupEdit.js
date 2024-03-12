import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Navbar from "../shared/Navbar";

const GroupEdit = () => {
  const { groupId } = useParams();
  const [role, setRole] = useState("USER");
  const [permissions, setPermissions] = useState([]);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    selectedPermissionIds: [1, 2],
  });

  useEffect(() => {
    const fetchData = async () => {
      const authenticated = localStorage.getItem("authenticated") === "true";

      if (!authenticated) {
        navigate("/");
      }
      try {
        const response = await fetch(`http://localhost:3002/group/${groupId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        });
        const { data } = await response.json();
        setFormData({
          name: data.group[0].name,
          selectedPermissionIds: [],
        });
        const permissionDb = await fetch(
          `http://localhost:3002/group/permissions`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        const { data: permissionData } = await permissionDb.json();
        setPermissions(permissionData.permissions);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    const token = localStorage.getItem("token");
    const { role } = jwtDecode(token);
    setRole(role);
    fetchData();
  }, []);

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

  const backOrders = async () => {
    navigate("/groups");
  };
  const updateGroup = async ({ group }) => {
    return;
    await fetch(`http://localhost:3002/group/permissions`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify({
        groupId,
        permissionsIds: group.selectedPermissionIds,
      }),
    });
  };

  return (
    <div className="d-flex">
      {/* Barra lateral */}
      <Navbar role={role} />

      {/* Contenido principal */}
      <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
          <h1 className="h2">Grupo</h1>
        </div>

        {/* Form Order */}
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
                        value={formData.name}
                        readOnly
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
                      onClick={backOrders}
                    >
                      Volver
                    </button>
                    <button
                      className="btn btn-block btn-success"
                      type="button"
                      onClick={async () =>
                        await updateGroup({ group: formData })
                      }
                    >
                      Guardar
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

export default GroupEdit;
