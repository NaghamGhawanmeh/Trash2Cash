import React, { useState,useEffect } from 'react'
import axios from 'axios'
import { useSelector,useDispatch } from 'react-redux'
import {setRequests,updateRequests,deleteRequest} from "../../redux/reducers/request"
import { DataGrid } from '@mui/x-data-grid';
//getAllRequest
//cancel
//update
const GetAllRequest = () => {
    const Dispatch = useDispatch()
    const categoryNameInKg = ["paper","plastic","wood","clothes","Iron","Copper","Glasses","paper","food"];
    const categoryNameInHight =["furniture"]
    const [request,setRequest]=useState([])
 
    const [updatedValue,setUpdated] =useState({}) 
    const state = useSelector((state)=>state)
    const token =  state.authReducer.token
    const [isUpdateWidth,setIsUpdateWidth] = useState(false)
    const [isUpdateHeight,setIsUpdateHeight] = useState(false)
    const [isUpdateDes,setIsUpdateDes] = useState(false)
    const [isUpdateLength,setIsUpdateLength] = useState(false)
    const [isUpdateWeight,setIsUpdateWeight] = useState(false) 
    const [isUpdate,setIsUpdate]= useState(false)
    
const updateRequest=(id,category_id)=>{

    console.log(id);
    
    axios.put(`https://trash2cash-liav.onrender.com/user/updateRequestById/${id}`,{
        "length":updatedValue.length ||null,
        "width":updatedValue.width || null,
        "height":updatedValue.height || null,
        "description":updatedValue.description|| null,
        "category_id":category_id

    },{headers: {
        Authorization: `Bearer ${token}`
        }})
        .then((result)=>{
            console.log(result);
            

        })
        .catch((error)=>{
            console.log(error);
            

        })




    }
    const deleteRequests = (id)=>{
        console.log(id);
        
        axios.delete(`https://trash2cash-liav.onrender.com/user/cancelRequestById/${id}`)
        .then((response)=>{
            console.log(response);
           /*  const newRequests = request.filter((ele,i)=>{
                return ele.id !== id

            })
            setRequests(newRequests) */
        })
        .catch((error)=>{
            console.log(error);
            

        })

    }
    useEffect(()=>{
        axios.get("https://trash2cash-liav.onrender.com/user/getRequestByuserId", {headers:{
        Authorization: `Bearer ${token}`
        }})
        .then((result)=>{
            console.log(result.data);
            Dispatch(setRequests(result.data.result))
        })
        .catch((error)=>{
            console.log(error);
        })
    },[])




return (
    <div>
        
        
        {
    state.userRequest.requests.map((ele,i)=>{
        console.log(ele);
        return <div>
            <p>request:</p>
                {ele.category_id == 23 ?
                <div>
                    <div>
                        <p>height:{!isUpdateHeight?ele.height:<><input onChange={(e)=>{
                    setUpdated({...updatedValue,height:e.target.value})}}>
                        </input><button onClick={()=>{
                            console.log(ele.category_id);
                    updateRequest(ele.id,ele.category_id)
                    Dispatch(updateRequests({value:updatedValue.height,key:"height",index:i}))
                    setIsUpdateHeight(false)
                    setIsUpdate(true)
                    

                }}>save</button></>}
                </p><button onClick={()=>{
                        /* setIsUpdate(true) */
                        setIsUpdateHeight(true)
                    }} >Update</button></div>
                <div><p>length:{!isUpdateLength?ele.length:<><input onChange={(e)=>{
                    setUpdated({...updatedValue,length:e.target.value})

                }}></input><button onClick={()=>{
                    console.log(ele.category_id);
                    
                    updateRequest(ele.id,ele.category_id)
                    Dispatch(updateRequests({value:updatedValue.length,key:"length",index:i}))
                    setIsUpdateLength(false)
                    setIsUpdate(true)

                }}>save</button></>} </p><button onClick = {()=>{
                        /* setIsUpdate(true) */
                        setIsUpdateLength(true)
                        
                    }} >Update</button> </div>
                <div><p>width:{!isUpdateWidth?ele.width:<><input onChange={(e)=>{
                    setUpdated({...updatedValue,width:e.target.value})

                }}></input><button onClick={()=>{
                    updateRequest(ele.id,ele.category_id)
                    Dispatch(updateRequests({value:updatedValue.width,key:"width",index:i}))
                    setIsUpdateWidth(false)
                    setIsUpdate(true)

                }}>save</button></>}</p> <button onClick={()=>{
                        /* setIsUpdate(true) */
                        setIsUpdateWidth(true)
                    }} >Update</button></div>
                    </div>:<div><p>weight:{!isUpdateWeight?ele.weight:<><input onChange={(e)=>{
                        setUpdated({...updatedValue,weight:e.target.value})

                    }}></input><button onClick={()=>{
                        console.log(ele.id);
                        console.log(ele.category_id);
                        updateRequest(ele.id,ele.category_id)
                        Dispatch(updateRequests({value:updatedValue.weight,key:"weight",index:i}))
                        setIsUpdateWeight(false)
                        setIsUpdate(true)
    
                    }}>save</button></>}</p> <button onClick={()=>{
                        /* setIsUpdate(true) */
                        setIsUpdateWeight(true)
                    }} >Update</button></div>}
                <div>
                <p>Description: {!isUpdateDes?ele.description:<><input onChange={(e)=>{
                    setUpdated({...updatedValue, description:e.target.value})
                }}></input><button onClick={()=>{
                    updateRequest(ele.id)
                    Dispatch(updateRequests({value:updatedValue.description,key:"description",index:i}))
                    setIsUpdateDes(false)
                    setIsUpdate(true)

                }}>save</button></>}</p><button onClick={()=>{
                        /* setIsUpdate(true) */
                        setIsUpdateDes(true)
                    }} >Update</button>
                <p>predicted_price: {ele.predicted_price}</p>
                </div>
                <div>
                    <button onClick={()=>{
                        deleteRequests(ele.id)
                        Dispatch(deleteRequest(i))
                    }}>Delete</button>
                </div>

           

             
        </div>
        
       })
       
        
        
        }
        </div>
)
}

export default GetAllRequest