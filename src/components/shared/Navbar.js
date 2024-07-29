import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, Link } from "react-router-dom";

const Navbar = (props) => {
  const { role } = props;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const authenticated = localStorage.getItem("authenticated") === "true";

      if (!authenticated) {
        navigate("/");
      }
    };
    fetchData();
  }, []);

  const logOut = async () => {
    const paramsLogOut = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify({ clientId: localStorage.getItem("clientId") }),
    };

    await fetch("http://localhost:3002/auth/logout", paramsLogOut);

    localStorage.removeItem("authenticated");
    localStorage.removeItem("token");
    localStorage.removeItem("clientId");
    navigate("/");
  };

  return (
    <nav
      id="sidebar"
      className="col-md-3 col-lg-2 d-md-block bg-light sidebar vh-100"
    >
      <div className="position-sticky d-flex flex-column">
        <ul className="nav flex-column mb-auto">
          <li className="nav-item">
            <a className="nav-link" href="#">
              <Link to={`/orders`}>Ordenes</Link>
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              <Link to={`/products`}>Productos</Link>
            </a>
          </li>
          {role === "ADMIN" && (
            <li className="nav-item">
              <a className="nav-link" href="#">
                <Link to={`/analytics`}>Estadisticas</Link>
              </a>
            </li>
          )}
          {role === "ADMIN" && (
            <li className="nav-item">
              <a className="nav-link" href="#">
                <Link to={`/users`}>Usuarios</Link>
              </a>
            </li>
          )}
          {role === "ADMIN" && (
            <li className="nav-item">
              <a className="nav-link" href="#">
                <Link to={`/groups`}>Grupos</Link>
              </a>
            </li>
          )}
          {role === "ADMIN" && (
            <li className="nav-item">
              <a className="nav-link" href="#">
                <Link to={`/purchase-order`}>Proveedores</Link>
              </a>
            </li>
          )}
        </ul>
        <div className="mt-auto">
          <ul className="nav flex-column">
            <li className="nav-item">
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={logOut}
              >
                Log Out
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
