import React from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import { ToastContainer } from "react-toastify";
import Register from "./components/Register";
import NotFound from "./components/NotFound";
import Orders from "./components/Orders";
import "simplebar/dist/simplebar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Products from "./components/Products";
import Analytics from "./components/Analytics";

function App() {
  return (
    <div className="App">
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route index element={<Login />} />
          <Route path="/register" exact element={<Register />} />
          <Route path="/orders" exact element={<Orders />} />
          <Route path="/products" exact element={<Products />} />
          <Route path="/analytics" exact element={<Analytics />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
