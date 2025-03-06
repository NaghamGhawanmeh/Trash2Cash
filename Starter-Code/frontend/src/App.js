import "./App.css";
import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import AdminDash from "./components/AdminDash";
import UserCategory from "./components/UserCategory/UserCategory";
import Navbar from "./components/NavBar/index";
import GetOrder from "./components/GetAllOrder/GetOrder";
import UserHomePage from "./components/userHomePage";
import CollectorsDash from "./components/CollectorsDash";
import CurrentCategory from "./components/UserCategory/CurrentCategory";
import GetAllRequest from "./components/UserCategory/GetAllRequest";
import Cart from "./components/Cart/index";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDash />} />
        <Route path="/categoriesPage" element={<UserCategory />} />
        <Route path="/collector" element={<CollectorsDash />} />
        <Route path="/currentCategory" element={<CurrentCategory />} />
        <Route path="/AllRequest" element={<GetAllRequest />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/" element={<UserHomePage />} />
        <Route path="/getOrder" element={<GetOrder />} />
      </Routes>
    </>
  );
};

export default App;