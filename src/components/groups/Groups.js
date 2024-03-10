import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPlus } from "@fortawesome/free-solid-svg-icons";
import Navbar from "../shared/Navbar";

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [role, setRole] = useState("USER");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const authenticated = localStorage.getItem("authenticated") === "true";

      if (!authenticated) {
        navigate("/");
      }

      try {
        const response = await fetch(`http://localhost:3002/group`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        });
        const { data } = await response.json();
        setGroups(data.groups);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    const token = localStorage.getItem("token");
    const { role } = jwtDecode(token);
    setRole(role);
    fetchData();
  }, [navigate]);

  const createGroup = async () => {
    navigate("/add-group");
  };

  const editGroup = async ({ groupId }) => {
    navigate(`/edit-group/${groupId}`);
  };

  return (
    <div className="d-flex">
      {/* Barra lateral */}
      <Navbar role={role} />

      {/* Contenido principal */}
      <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
          <h1 className="h2">Grupos</h1>
          <div className="d-flex mt-2 ml-2">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => createGroup()}
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Agregar Grupo
            </button>
          </div>
        </div>

        {/* Tabla de pedidos */}
        <table className="table table-striped table-bordered">
          <thead className="thead-dark">
            <tr>
              <th></th>
              <th>Nombre</th>
              <th>Permisos</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((item) => (
              <tr key={item.id}>
                <td>
                  <Link to={`/group/${item.id}`}>
                    <FontAwesomeIcon icon={faSearch} />
                  </Link>
                </td>
                <td>{item.name}</td>
                <td>{item.permissions.join(", ")}</td>
                <td>
                  <button
                    style={{ marginRight: "5px" }}
                    className="btn btn-success btn-sm"
                    onClick={() =>
                      editGroup({
                        groupId: item.id,
                      })
                    }
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default Groups;
