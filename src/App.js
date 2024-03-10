import React from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/auth/Login";
import { ToastContainer } from "react-toastify";
import Register from "./components/auth/Register";
import NotFound from "./components/NotFound";
import Orders from "./components/orders/Orders";
import "simplebar/dist/simplebar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Products from "./components/products/Products";
import NewProduct from "./components/products/NewProduct";
import OrderDetail from "./components/orders/OrderDetail";
import ProductDetail from "./components/products/ProductDetail";
import Analytics from "./components/analytics/Analytics";
import Users from "./components/users/Users";
import NewUser from "./components/users/NewUser";
import UserDetail from "./components/users/UserDetail";
import Groups from "./components/groups/Groups";
import NewGroup from "./components/groups/NewGroup";
import GroupDetail from "./components/groups/GroupDetail";
import GroupEdit from "./components/groups/GroupEdit";

function App() {
  return (
    <div className="App">
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route index element={<Login />} />
          <Route path="/register" exact element={<Register />} />
          <Route path="/orders" exact element={<Orders />} />
          <Route path="/order/:id" element={<OrderDetail />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/user/:userId" element={<UserDetail />} />
          <Route path="/group/:groupId" element={<GroupDetail />} />
          <Route path="/products" exact element={<Products />} />
          <Route path="/add-product" exact element={<NewProduct />} />
          <Route path="/add-user" exact element={<NewUser />} />
          <Route path="/add-group" exact element={<NewGroup />} />
          <Route path="/edit-group/:groupId" exact element={<GroupEdit />} />
          <Route path="/analytics" exact element={<Analytics />} />
          <Route path="/users" exact element={<Users />} />
          <Route path="/groups" exact element={<Groups />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
