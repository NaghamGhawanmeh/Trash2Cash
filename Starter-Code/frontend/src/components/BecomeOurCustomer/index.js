import React from "react";
import "./style.css";
import { MDBBtn } from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";
import { useSelector,  } from "react-redux";

const BecomeOurCustomer = () => {
  const navigate = useNavigate();
  const token = useSelector((reducers) => reducers.authReducer.token);
  return (
    <>
      <div className="become-our-container">
        <div style={{ marginTop: "150px" }}>
          <img
            src="https://res.cloudinary.com/dozr5pfwt/image/upload/v1739970267/g7iqsmlexvbdyuxvmzdg.png"
            style={{ height: "700px", width: "700px" }}
          />
        </div>
        <div style={{ marginTop: "200px" }}>
          <img src="https://res.cloudinary.com/dozr5pfwt/image/upload/v1739975943/nvgotowtys49ins2x33i.png"style={{height:"100px",width:"100px"}}  className="rotating"/>
          <h1
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: "70px",
              fontWeight: "bold",
            }}
          >
            Become our customer & get special service
          </h1>
          <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "23px" ,marginTop:"50px",textAlign:"left"}}>
          Join us in making a positive impact on the environment with our hassle-free doorstep waste collection service. We ensure responsible and eco-friendly recycling, maintaining complete transparency in our processes. Our commitment to sustainability drives us to create a cleaner, greener future for generations to come. By choosing us, you contribute to reducing waste, conserving resources, and promoting a healthier planet.
          </p>

          <MDBBtn className="leftBtn" onClick={()=>{
            if(!token){
              navigate("/login") 
            }
          }}>Request A Pickup </MDBBtn>
          <MDBBtn className="rightBtn" outline color="dark">
            Download Our App
          </MDBBtn>
        </div>
      </div>
    </>
  );
};

export default BecomeOurCustomer;
