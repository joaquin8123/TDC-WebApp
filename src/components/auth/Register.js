import React, { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import "simplebar/dist/simplebar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    repassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const register = async () => {
    const { username, password, repassword } = formData;
    if (username.length < 6 || password.length < 6) {
      toast.error(
        "El nombre de usuario y la contraseña deben tener al menos 6 caracteres."
      );
      return;
    }
    if (password !== repassword) {
      toast.error("Las contraseñas no coinciden.");
      return;
    }
    try {
      const response = await fetch("http://localhost:3002/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.code === 201) {
          toast.success("Usuario creado exitosamente");
          localStorage.setItem("authenticated", true);
          setTimeout(() => {
            navigate("/");
          }, 2000);
        }
      } else {
        toast.error("Ocurrio un error al intentar crear el usuario");
      }
    } catch (error) {
      toast.error("Ocurrio un error al intentar crear el usuario");
    }
  };

  const login = async () => {
    navigate("/");
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card mb-4 mx-4">
              <div className="card-body p-4">
                <h1>Register</h1>
                <p className="text-medium-emphasis">Create your account</p>
                <div className="input-group mb-3">
                  <span className="input-group-text">
                    <FaUser />
                  </span>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Username"
                    name="username"
                    required
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>
                <div className="input-group mb-3">
                  <span className="input-group-text">
                    <FaLock />
                  </span>
                  <input
                    className="form-control"
                    type="password"
                    placeholder="Password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                <div className="input-group mb-4">
                  <span className="input-group-text">
                    <FaLock />
                  </span>
                  <input
                    className="form-control"
                    type="password"
                    placeholder="Repeat password"
                    name="repassword"
                    required
                    onChange={handleChange}
                  />
                </div>
                <button
                  className="btn btn-primary px-4"
                  type="button"
                  style={{ marginRight: "5px" }}
                  onClick={login}
                >
                  Volver
                </button>
                <button
                  className="btn btn-block btn-success"
                  type="button"
                  onClick={async () => await register()}
                >
                  Create Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
