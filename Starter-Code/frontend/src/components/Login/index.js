import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import React, { useState } from "react";
import "./style.css";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBIcon,
} from "mdb-react-ui-kit";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setLogin, setUserId, setLogout } from "../../redux/reducers/auth";
const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/user/login", {
        email,
        password,
      });
      setStatus(true);
      setMessage(response.data.message);
      dispatch(
        setLogin({ token: response.data.token, roleId: response.data.roleId })
      );
      dispatch(setUserId(response.data.userId));
      if (response.data.roleId == 1 || response.data.roleId == 3) {
        navigate("/sideNav");
      }
    } catch (error) {
      setStatus(false);
      setMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/user/register", {
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        email,
        password,
      });
      setStatus(true);
      setMessage(response.data.message);
    } catch (error) {
      setStatus(false);
      setMessage(error.response?.data?.message || "Something went wrong");
    }
  };
  // https://res.cloudinary.com/dozr5pfwt/image/upload/v1739645499/s5dultjaspdjbnyiwfu8.png
  return (
    <MDBContainer
      fluid
      className="p-4"
      style={{
        backgroundImage:
          "url(https://res.cloudinary.com/dozr5pfwt/image/upload/v1739918651/givckbkkgyrhc6xvho29.png)",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        maxHeight: "92vh",
      }}
    >
      <MDBRow className="h-100">
        <MDBCol
          md="7"
          className="text-center text-md-start d-flex flex-column justify-content-center"
        >
          <h1 className="my-5 display-3 fw-bold ls-tight px-3">
            <br />
            <span className="text-primary">
              {/* {isLogin ? "Login to your account" : "Create an account"} */}
            </span>
          </h1>
        </MDBCol>

        <MDBCol
          md="4"
          className="offset-md-1 d-flex align-items-center justify-content-center auth-box"
        >
          <MDBCard
            className="my-5 blurred-container"
            style={{
              width: "100%",
              maxWidth: "none",
              display: "flex",
              height: "75vh",
              border: "none",
              boxShadow: "none",
              background: "transparent",
            }}
          >
            <h1
              style={{ alignSelf: "center", color: "#3A9E1E" }}
            >
              <br />
              <span>
                {isLogin ? "Login to your account" : "Create an account"}
              </span>
            </h1>
            <MDBCardBody className="p-5">
              <form onSubmit={isLogin ? handleLogin : handleRegister}>
                {!isLogin && (
                  <MDBRow>
                    <MDBCol col="6">
                      <MDBInput
                        wrapperClass="mb-4"
                        label="First name"
                        type="text"
                        style={{ backgroundColor: "#f7ffee" }}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </MDBCol>
                    <MDBCol col="6">
                      <MDBInput
                        wrapperClass="mb-4"
                        label="Last name"
                        type="text"
                        style={{ backgroundColor: "#f7ffee" }}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </MDBCol>
                  </MDBRow>
                )}
                {!isLogin && (
                  <MDBInput
                    wrapperClass="mb-4"
                    label="Phone Number"
                    type="text"
                    style={{ backgroundColor: "#f7ffee" }}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                )}
                <MDBInput
                  wrapperClass="mb-4"
                  label="Email"
                  type="email"
                  style={{ backgroundColor: "#f7ffee" }}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <MDBInput
                  wrapperClass="mb-4"
                  label="Password"
                  type="password"
                  style={{ backgroundColor: "#f7ffee" }}
                  className="dd"
                  onChange={(e) => setPassword(e.target.value)}
                />

                <MDBBtn
                  className="w-100 mb-4"
                  size="sm"
                  type="submit"
                  // color="success"
                  style={{ fontSize: "20px",backgroundColor:"#3A9E1E",border:"#3A9E1E" }}
                >
                  {isLogin ? "Sign in" : "Sign up"}
                </MDBBtn>
              </form>
              {message && (
                <div className={status ? "text-success" : "text-danger"}>
                  {message}
                </div>
              )}
              <div className="text-center">
                {/* <p> {isLogin ? "or sign in with" : "or sign up with"}</p> */}
                <GoogleLogin
                  text= "continue_with"
                  onSuccess={(response) => {
                    const body = jwtDecode(response.credential);
                    axios
                      .post("http://localhost:5000/auth/google", body)
                      .then((result) => {
                        console.log("tttt", result);
                        dispatch(
                          setLogin({
                            token: result.data.token,
                            roleId: result.data.roleId,
                          })
                        );
                        dispatch(setUserId(result.data.userId));
                        navigate("/");
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                    console.log(jwtDecode(response.credential));
                  }}
                  onError={() => {
                    console.log("failed");
                  }}
                />
              </div>
              <p className="text-center mt-3" style={{ alignSelf: "center" }}>
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}{" "}
                <span
                  // className="text-success"
                  style={{
                    cursor: "pointer",
                    fontWeight: "bold",
                    color:"#3A9E1E",
                    textDecoration: "underline",
                  }}
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setMessage("");
                  }}
                >
                  {isLogin ? "Register" : "Login"}
                </span>
              </p>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default Auth;
