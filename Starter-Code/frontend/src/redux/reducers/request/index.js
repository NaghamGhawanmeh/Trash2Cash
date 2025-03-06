import{createSlice} from "@reduxjs/toolkit";
const requestSlice = createSlice({
    name:"request",
    initialState:{
        requests:[],
        orders:[]
    },
    reducers:{
        setRequests :(state,action)=>{
            console.log(action.payload);
            
            state.requests = action.payload
            console.log("nnnn",state.requests,action.payload);
            
        },
        setOrder:(state,action)=>{
            state.orders = action.payload;
        },
        deleteOrder:(state,action)=>{
            const index = action.payload
            console.log(index);
            
            state.orders.splice(index,1) 

        },
        //{id:2,"key":"width","value":3}
        updateRequests:(state,action)=>{
            console.log(action.payload);
            //index and updated value
            const key = action.payload.key
            const value =action.payload.value
            const index = action.payload.index
        state.requests[index][key] =value
            
        },
        deleteRequest :(state,action)=>{
            //index 
            const index = action.payload
            console.log(index);
            
            state.requests.splice(index,1) 
        }
    }
})
export const {setRequests,updateRequests,deleteRequest,deleteOrder, setOrder}= requestSlice.actions;
export default requestSlice.reducer