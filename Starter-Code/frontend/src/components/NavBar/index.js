import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setLogout } from "../../redux/reducers/auth";
import { FaUser, FaShoppingCart } from "react-icons/fa";
import Logo from "../../assets/logo.png";
const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const roleId = useSelector((reducer) => reducer.authReducer.roleId);
  const isLoggedIn = useSelector((reducer) => reducer.authReducer.isLoggedIn);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <>
    {(roleId !== 1 && roleId!==3) &&(<div className="upper-nav text-white d-flex justify-content-center align-items-center">
        <span>Recycling isn't just good for the planet—it can also put money in your pocket!</span>
      </div>)}
      
      {(roleId !== 1 && roleId!==3) && (
        <nav className="navbar navbar-expand-lg bg-white shadow-sm" style={{ height: "100px" }}>
          <div className="container d-flex align-items-center" style={{marginLeft:"0px"}}>
            <Link
              to="/"
              style={{
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <img
                src={Logo}
                alt="Logo"
                style={{
                  height: "100px",
                  marginRight: "10px"
                }}
              />
              <h1
                className="m-0"
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "bold",
                  color: "#0E1D40",
                  lineHeight: "1"
                }}
              >
                Trash2Cash
              </h1>
            </Link>
            {/* ! */}
            <div className="collapse navbar-collapse justify-content-center" id="navbarNav"
            style={{marginLeft:"400px"}}>
              <ul className="navbar-nav text-center nav-menu">
                <li className="nav-item px-3">
                  <Link className="nav-link nav-hover" to="/">
                    Home
                  </Link>
                </li>
                <li className="nav-item px-3">
                  <a className="nav-link nav-hover"href="#process">
                   Process
                  </a>
                </li>
                {isLoggedIn && (
                  <li className="nav-item px-3">
                    <Link className="nav-link nav-hover" to="/categoriesPage">
                      Categories
                    </Link>
                  </li>
                )}
                <li className="nav-item px-3" style={{width:"205px"}}>
                  <a className="nav-link nav-hover" href="#footer">
                    Contact Us
                  </a>
                </li>
                {isLoggedIn ? (
                  <div style={{marginLeft:"430px",display:"flex"}} >
                    <li className="nav-item px-3" >
                      <Link className="nav-link nav-hover" to="/cart">
                        <FaShoppingCart className="icon-blue" />
                      </Link>
                    </li>
                    <li className="nav-item px-3 dropdown" ref={dropdownRef}
                    //  style={{marginLeft:"650px"}}
                     >
                      <div
                        className="nav-link nav-hover"
                        onClick={() => setShowDropdown(!showDropdown)}
                        style={{ cursor: "pointer" }}
                      >
                        <FaUser className="icon-blue" />
                      </div>
                      {showDropdown && (
                        <div className="dropdown-menu show" style={{ display: "block" }}>
                          <Link
                            className="dropdown-item"
                            to="/getOrder"
                            onClick={() => setShowDropdown(false)}
                          >
                            My Orders
                          </Link>
                          <div
                            className="dropdown-item"
                            onClick={(e) => {
                              e.preventDefault();
                              dispatch(setLogout());
                              setShowDropdown(false);
                              navigate("/");
                            }}
                            style={{ cursor: "pointer" }}
                          >
                            Logout
                          </div>
                        </div>
                      )}
                    </li>
                  </div>
                ) : (
                  <li className="nav-item px-3" style={{marginLeft:"650px"}} >
                    <Link className="nav-link nav-hover" to="/login">
                      Login
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </nav>
      )}
      <style>{`
        .nav-hover {
          color: #0E1D40;
          transition: color 0.3s ease, transform 0.3s ease;
        }
        .nav-hover:hover {
          color: #3A9E1E;
          transform: scale(1.1);
        }
        .upper-nav {
          background-color: #0E1D40;
          height: 60px;
          font-size: 25px;
          font-weight: 300;
        }
        .icon-blue {
          color: #0E1D40;
          margin-right: 5px;
        }
        .nav-menu {
          font-size:30px;
          font-weight: bold;
        }
        .dropdown-menu {
          border: none;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          min-width: 200px;
          margin-top: 8px;
        }
        .dropdown-item {
          font-size: 18px;
          padding: 10px 20px;
          color: #0E1D40;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .dropdown-item:hover {
          background-color: #F8F9FA;
          color: #3A9E1E;
        }
        .dropdown-menu.show {
          display: block;
          position: absolute;
          right: 0;
          left: auto;
        }
      `}</style>
    </>
  );
};
export default Navbar;