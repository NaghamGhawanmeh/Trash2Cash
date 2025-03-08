import React,{useContext,useEffect,useState} from 'react'
import axios from 'axios'
import {useSelector} from "react-redux"
const Request = () => {
  //import  category //import orderId
  const categoryName = "furniture"
  const [request,setRequest] = useState({})
  const categoryNameInKg = ["paper","plastic","wood","clothes"]
  const categoryNameInHight = ["furniture","home_Electronic"]
  const state =useSelector((reducer)=>reducer)
  const token = state.authReducer.token
  //calculate predected value in front end
  const createRequest = (event)=>{
    axios.post("https://trash2cash-liav.onrender.com/user/createRequestByuserId",{
    /*   order_id:request.order_id,
      category_id:request.category_id,
      description:request.description,
      weight:request.weight || 0,
      length:request.length|| 0,
      width:request.width || 0,
      height:0, */
      
    },
    {headers: {
      Authorization: `Bearer ${token}`
      }})
      .then((result)=>{
      console.log(result);
      })
      .catch((error)=>{
        console.log(error);
      })
  }
//if category ===> paper  or plastic or clothes by wight  //
//1-description 2 wight 3length 4height
//if category ===>furniture  by length & width
  return (
    <div>
      <div>
        <p>price of this request:<span>0</span></p>
        <p>your total price :<span>0</span></p>
      </div>
      <form>
        {categoryNameInKg.includes(categoryName)&&
        <label for="weight">weight: <input id='
        weight' placeholder= "weight" onChange={(e)=>{
          setRequest({...request,weight:e.target.value})
        }}/> Kg
          </label>}
          {categoryNameInHight.includes(categoryName)&&
          <div>
          <label for="length">length:<input maxLength ="3" minlength="1" placeholder= "length" id='length' onChange={(e)=>{
          setRequest({...request,length:e.target.value})
        }} />
           M
            </label><br/>
          <label for="width">width: <input id='width' maxLength ="3" minlength="1" placeholder= "width" onChange={(e)=>{
          setRequest({...request,width:e.target.value})
        }}/> M
          </label><br/>
          </div>}
        <br/><label>Description :</label><br/>
        <textarea onChange={(e)=>{
          setRequest({...request,description:e.target.value})
        }}></textarea><br/>
        <button onClick={(event)=>{
              event.preventDefault()
          setRequest({...request,order_id:8})
          setRequest({...request,category_id_id:8})
          createRequest()}
      }>Create Request</button>
      </form>
    </div>
  )
}
export default Request