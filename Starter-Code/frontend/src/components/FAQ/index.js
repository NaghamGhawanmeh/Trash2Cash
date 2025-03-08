import React from "react";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import { MDBContainer, MDBRow, MDBCol, MDBListGroup, MDBListGroupItem, MDBIcon } from "mdb-react-ui-kit";

const recycleItems = [
  "Steel",
  "Plastic",
  "Lights & Bulbs",
  "Books & Papers",
  "Bottles",
  "Food & Grocery",
  "Common Waste",
  "Newspaper",
  "Glass and Bottles",
  "E-Waste",
];

const RecycleSection = () => {
  return (
    <div className="bg-success text-white py-5">
      <MDBContainer>
        <MDBRow className="align-items-center">
          <MDBCol md="6" className="text-center text-md-start">
            <h6 className="text-uppercase">Recycle Materials</h6>
            <h2 className="fw-bold">We collect, & recycle all materials</h2>
          </MDBCol>
          <MDBCol md="6">
            <MDBListGroup className="text-white">
              {recycleItems.map((item, index) => (
                <MDBListGroupItem key={index} className="bg-transparent border-0 d-flex align-items-center">
                  <MDBIcon fas icon="check-circle" className="me-2" /> {item}
                </MDBListGroupItem>
              ))}
            </MDBListGroup>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
};

export default RecycleSection;
