import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
const GetAllOrder = () => {
  const state = useSelector((state)=>state)
  const token = state.authReducer.token
    useEffect(()=>{
        axios.get("http://localhost:5000/user/getOrderById",{
          headers:{
            Authorization: `Bearer ${token}`
          }
        })
        .then((result)=>{
          console.log(result);
          

        })
        .catch((error)=>{
          console.log(error);
          

        })

    },[])



  return (
    <div>GetAllOrder</div>
  )
}

export default GetAllOrder