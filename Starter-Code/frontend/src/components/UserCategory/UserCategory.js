import axios from "axios";
import React, { useEffect, useState, Link } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCurrentCategory } from "../../redux/reducers/userCategory";
//put current category info into store
import CurrentCategory from "./CurrentCategory";
import "./user.css";
const UserCategory = () => {
  const state = useSelector((state) => state);
  const Navigate = useNavigate();
  const dispatch = useDispatch();
  const [allCategories, setAllCategories] = useState([]);
  const currentCategory = useSelector((selector) => selector);
  console.log(currentCategory);
  useEffect(() => {
    axios
      .get("https://trash2cash-liav.onrender.com/category/getAllCategories")
      .then((result) => {
        console.log(result.data.Categories);
        setAllCategories(result.data.Categories);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    <div className="categoryPage" >
      <div className="categorySection ">
        {allCategories.map((ele, i) => {
          console.log(ele);
          return (
            <div
              key={i}
              className="catElement card col-m-10" style={{height:"520px"}}
            >
              <img className="categoryImg card-img-top" src={ele.image} style={{height:"300px"}} />
              <p className="title-1 card-title">{ele.category_name}</p>
              <p className="description-1 card-text">{ele.description}</p>
              <button
                className="btn btn-default btn-success"
                style={{backgroundColor:"#3A9E1E",border:"#3A9E1E"}}
                onClick={() => {
                  console.log(ele);
                  dispatch(setCurrentCategory(ele));
                  Navigate(`/currentCategory`);
                  console.log(state);
                }}
              >
                 More Details
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default UserCategory;