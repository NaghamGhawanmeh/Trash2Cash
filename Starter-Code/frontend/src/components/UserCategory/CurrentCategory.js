import {
  MDBCard,
  MDBRow,
  MDBCol,
  MDBCardImage,
  MDBCardBody,
  MDBListGroup,
  MDBListGroupItem,
  MDBCardTitle,
} from "mdb-react-ui-kit";
import { MDBCardText, MDBInputGroup } from "mdb-react-ui-kit";
import { useSelector } from "react-redux";
//---------------

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
//-------------------

import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
const CurrentCategory = () => {
  const state = useSelector((state) => state);
  console.log(state.authReducer.token);
  const categoryName = state.userCategory.currentCategory.category_name;
  console.log(categoryName);

  const category_ = state.userCategory.currentCategory;
  const [request, setRequest] = useState({});
  const categoryNameInKg = [
    "Paper",
    "Plastic",
    "Wood",
    "Clothes",
    "Iron",
    "Copper",
    "Glass",
    "Paper",
    "Food",
  ];
  const categoryNameInPoint = ["paper", "food"];
  const categoryNameInHight = ["Furniture"];
  const [message, setMessage] = useState("");
  const token = state.authReducer.token;
  //detailes about each category
  //create request
  console.log(category_);

  const createRequest = (event) => {
    axios
      .post(
        "https://trash2cash-liav.onrender.com/user/createRequestByuserId",
        {
          category_id: state.userCategory.currentCategory.id,
          weight: request.weight || 0,
          height: request.height || 0,
          length: request.length || 0,
          width: request.width || 0,
          description: request.description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className="Page" style={{ backgroundColor: "#F7FFEE",color: "#0E1D40" ,height:"100vh"}}>
      <MDBCard
        style={{ maxWidth: "90%", border: " transparent",color: "#0E1D40"}}
        className="card1"
      >
        <MDBRow style={{display:"flex",rowGap:"5%",justifyContent:"space-around" }}>
          <MDBCol md="2">
            <MDBCardImage
              style={{ padding: "12px", borderTopRightRadius: "14px"}}
              className="img2"
              src={category_.picture_details}
              alt="..."
            />
          </MDBCol>
          <MDBCol md="8">
            <MDBCardBody style={{ marginLeft: "50px" }}>
              <MDBCardTitle>
                <h3>{category_.category_name}</h3>
              </MDBCardTitle>
              <MDBCardText style={{ fontSize: "18px" }} className="p2">
                {category_.detail}
              </MDBCardText>
            </MDBCardBody>
          </MDBCol>
        </MDBRow>
      </MDBCard>
      {/*   <div className='section1'>
        <p className='p1'>{category_.detail}</p>
        <img  className='img1' src={category_.picture_details}/>
        
        </div>
        <h3 className='price1 '>Price:{category_.price_per_kg
        }JOD</h3> */}
      <div
        className="reqSection"
        style={{
          maxWidth: "90%",
          maxHeight: "80%",
          backgroundColor: "#3A9E1E",
          color: "#0E1D40"
        }}
      >
        <div
          className="Page1"
          style={{
            maxWidth: "60%",
            width: "40%",
            maxHeight: "40%",
            backgroundColor: "#ffffff",
            padding: "12px",
            borderTopRightRadius: "14px",
            display:"flex",
            flexDirection:"column",
            rowGap:"10%"
          }}
        >
          {/* <p>order a worker to pick up your trash:</p> */}
          {categoryNameInKg.includes(categoryName) && (
            <MDBInputGroup
              className="mb-3"
              textBefore="Weight:"
              style={{ fontWeight: "800", fontSize: "15px", maxWidth: "50%",fontSize:"30%"}}
            >
              <input
                style={{ border: "2px solid #3A9E1E",borderRadius:"3%" }}
                className="form-control"
                type="number"
                placeholder="Weight"
                onChange={(e) => {
                  setRequest({ ...request, weight: e.target.value });
                }}
              />
            </MDBInputGroup>
          )}
          {categoryNameInHight.includes(categoryName) && (
            <div>
              <MDBInputGroup className="mb-3" textBefore="length" >
                <input
                   style={{ border: "2px solid #3A9E1E",borderRadius:"3%" }}
                  className="form-control"
                  type="number"
                  maxLength="3"
                  minlength="1"
                  placeholder="length"
                  id="length"
                  onChange={(e) => {
                    setRequest({ ...request, length: e.target.value });
                  }}
                />
              </MDBInputGroup>

              <MDBInputGroup className="mb-3" textBefore="width">
                <input
                    style={{ border: "2px solid #3A9E1E",borderRadius:"3%" }}
                  className="form-control"
                  type="number"
                  id="width"
                  maxLength="3"
                  minlength="1"
                  placeholder="width"
                  onChange={(e) => {
                    setRequest({ ...request, width: e.target.value });
                  }}
                />
              </MDBInputGroup>
              <MDBInputGroup className="mb-3" textBefore="height:">
                <input
                     style={{ border: "2px solid #3A9E1E",borderRadius:"3%" }}
                  className="form-control"
                  type="number"
                  id="width"
                  maxLength="3"
                  minlength="1"
                  placeholder="height:"
                  onChange={(e) => {
                    setRequest({ ...request, height: e.target.value });
                  }}
                />
              </MDBInputGroup>
            </div>
          )}
          <MDBInputGroup className="mb-3" textBefore="Description:">
            <textarea
                style={{ border: "2px solid #3A9E1E",borderRadius:"3%" }}
              className="l1"
              onChange={(e) => {
                setRequest({ ...request, description: e.target.value });
              }}
            ></textarea>
          </MDBInputGroup>
          <button
            className="btn  "
            style={{ backgroundColor: "#F3B811" }}
            onClick={(event) => {
              event.preventDefault();
              setRequest({ ...request, order_id: 8 });
              setRequest({ ...request, category_id_id: 8 });
              createRequest();
            }}
          >
            Create Request
          </button>
          <p>{message}</p>
        </div>
        <hr
          style={{ color: "#ffffff", backgroundColor: "#ffffff", width: "1%" }}
        />
        <div className="footer">
          <h2 className="price p2" style={{ fontSize: "1.5rem", color: "#0E1D40",fontWeight:"800"}}>
            Instructions:
          </h2>
          <ul
            class="space-y-2"
            style={{
              backgroundColor: "transparent",
              color: "#ffffff",
              width: "70%",
              fontSize: "1.2rem",
            }}
          >
            <li class="flex items-center">
              <span
                style={{ backgroundColor: "#F3B811", color: "#FFFFFF" }}
                class="text-green-500"
              >
                ✔
              </span>{" "}
              <span class="ml-2">Make sure the waste is dry.</span>
            </li>
            <li class="flex items-center">
              <span
                style={{ backgroundColor: "#F3B811", color: "#FFFFFF" }}
                class="text-green-500"
              >
                ✔
              </span>{" "}
              <span class="ml-2">Put it in its container.</span>
            </li>
            <li class="flex items-center">
              <span
                style={{ backgroundColor: "#F3B811", color: "#FFFFFF" }}
                class="text-green-500"
              >
                ✔
              </span>{" "}
              <span class="ml-2"> Check its measurement carefully.</span>
            </li>
            <li class="flex items-center">
              <span
                style={{ backgroundColor: "#F3B811", color: "#FFFFFF" }}
                class="text-green-500"
              >
                ✔
              </span>{" "}
              <span class="ml-2">Then, create your request. </span>
            </li>
            <li class="flex items-center">
              <span
                style={{ backgroundColor: "#F3B811", color: "#FFFFFF" }}
                class="text-green-500"
              >
                ✔
              </span>{" "}
              <span class="ml-2">
              Note that a price will be displayed, showing your cash amount.{" "}
              </span>
            </li>
            <li class="flex items-center">
              <span
                style={{ backgroundColor: "#F3B811", color: "#FFFFFF" }}
                class="text-green-500"
              >
                ✔
              </span>{" "}
              <span class="ml-2">Check the next process in your cart.</span>
            </li>
          </ul>
          <h2 className="price p2"  style={{fontSize:"1.5rem"}} >
            total Price: <span  style={{backgroundColor:"white" ,color:"#0E1D40" ,width:"30%"}}>{" "}
            {
              request.weight &&
                request.weight *
                  category_.price_per_kg /* request.length*request.height*request.width*category_.price_per_dimensions */
            }
            {request.length &&
              request.width &&
              request.height &&
              request.length *
                request.height *
                request.width *
                category_.price_per_dimensions}</span>
          </h2>
        </div>
      </div>

    </div>
  );
};

export default CurrentCategory;