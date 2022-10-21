import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../Header";
import axios from "axios";
import jwt_Decode from "jwt-decode";
import Swal from 'sweetalert2';


function RestaurantPage() {
let [tab,setTab]=useState(1);
let {id} = useParams();


let defaultValue={
    aggregate_rating: 0,
    city: "",
    city_id: -1,
    contact_number: 0,
    cuisine: [],
    cuisine_id: [],
    image: "restaurant-background.png",
    locality: "",
    location_id:-1,
    mealtype_id:-1,
    min_price:0,  
    name: " ",
    rating_text: "",
    thumb: [],
    _id: -1,
};

let [restaurant,setRestaurant]=useState({...defaultValue});
let [menuItems,setMenuItems]=useState([]);
let [totalPrices,setTotalPrices]=useState(0);


let getTokenDetails=()=>{
    //read the data from localStorage
    let token =localStorage.getItem("auth-token");
    if(token===null){
        return false;
    }else{
        return jwt_Decode(token);
    }
    };
    
    let [userDetails,setUserDetails]=useState(getTokenDetails());


let getRestaurantDetails= async()=>{

    try{
    let URL="http://localhost:5003/api/get-restaurant-details-by-id/"+id;
    let {data}=await axios.get(URL);
    
    if(data.status === true){
        setRestaurant({...data.result});
    }else{
        setRestaurant({...defaultValue});
    }
    }catch(error){
        alert("server error");

    }
};


let getMenuItems=async()=>{
    try{
        let URL="http://localhost:5003/api/get-menu-item-list-by-restaurant-id/"+ id;
        let {data}=await axios.get(URL);
    
        if(data.status === true){
            setMenuItems([...data.result]);
        }else{
            setMenuItems([]);
        }
        setTotalPrices(0);
    }catch(error){
        alert("server error");
    }
};

let addItemQuantity=(index)=>{
    let _price =Number(menuItems[index].price);
    let _menuItems=[...menuItems];
    _menuItems[index].qty+=1;

    setTotalPrices(totalPrices + _price);           //updating thr total prices state
    setMenuItems(_menuItems);                       //updating the menuitems state
};

let removeItemQuantity=(index)=>{
    let _price =Number(menuItems[index].price);
    let _menuItems=[...menuItems];
    _menuItems[index].qty-=1;

    setTotalPrices(totalPrices - _price);           //updating thr total prices state
    setMenuItems(_menuItems);                       //updating the menuitems state
};

async function loadScript(){
    
        const script=document.createElement("script");
        script.src="https://checkout.razorpay.com/v1/checkout.js";
        script.onload=()=>{
            return true;
        };
        script.onerror=()=>{
            return false;
        };
        window.document.body.appendChild(script);
   
}

let displayRazorpay=async()=>{
    let isLoaded= await loadScript();
    if (isLoaded===false){
    alert("SDK is not loaded");
    return false;
    }

    var serverData={
        amount:totalPrices
    }
    var {data}= await axios.post("http://localhost:5003/api/payment/gen-order",serverData);
   
    var order=data.order


    var options = {
        key: "rzp_test_Tmw1bZoIPc2pRY", // Enter the Key ID generated from the Dashboard
    amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    currency: order.currency,
    name: "Zomato Clone payment",
    description: "buying a product from zpmato",
    image: "https://branditechture.agency/brand-logos/wp-content/uploads/wpdm-cache/Screenshot_20220621-202824-900x0.png",
    order_id: order.id, //order id is generated @server side
    handler: async function (response){
        var sendData={
            razorpay_payment_id:response.razorpay_payment_id,
            razorpay_order_id:response.razorpay_order_id,
            razorpay_signature:response.razorpay_signature,
        };
       var {data}= await axios.post("http://localhost:5003/api/payment/verify",sendData);
        if(data.status===true){
            Swal.fire({
                icon:"success",
                title:" Order Place Successfully",
                text:"",
                
            }).then(()=>{
                window.location.replace("/");
        });
        }else{
            Swal.fire({
                icon:"warning",
                title:" Payment Fail Re-try Again",
                text:"",
                
            });
            
        }
    },
    prefill: {
        name: userDetails.name,
        email: userDetails.email,
        contact: "9999999999"
    },
   
    };
var rzp1 =  window.Razorpay(options);
 rzp1.open();
 
};

useEffect(()=>{
    getRestaurantDetails();
},[]);


    return (
        <>
            <div className="modal fade" id="exampleModalToggle" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                         <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalToggleLabel">{restaurant.name} </h5>
                            <button 
                                type="button" 
                                className="btn-close" 
                                data-bs-dismiss="modal" 
                                aria-label="Close">
                            </button>
                        </div>
                        <div className="modal-body">
                            {menuItems.map((menu_item,index)=>{
                               return(  
                                <div className="row p-2" key={index}>
                                <div className="col-8 " >
                                    <p className="mb-1 h6">{menu_item.name} </p>
                                    <p className="mb-1">@{menu_item.price} </p>
                                    <p className="small text-muted">{menu_item.description} </p>
                                </div>
                                <div className="col-4 d-flex justify-content-end">
                                    <div className="menu-food-item">
                                        <img src={"/images/"+menu_item.image} alt=""/>
                                    {menu_item.qty===0 ?(
                                        <button className="btn btn-primary btn-sm add" 
                                        onClick={()=>addItemQuantity(index)}
                                        >Add</button>
                                    ):(
                                        <div className="order-item-count section">
                                            <span className="hand"
                                            onClick={()=>removeItemQuantity(index)}
                                            >-</span>
                                            <span>{menu_item.qty} </span>
                                            <span className="hand"
                                            onClick={()=>addItemQuantity(index)}
                                            >+</span>
                                        </div>
                                    )}
                                    </div>
                                </div>
                                <hr className="p-0 my-2"/>
                                </div>
                               );
                            })}
                            
                        {totalPrices > 0 ? (
                            <div className=" d-flex justify-content-between">
                            <h3>Sub total {totalPrices} </h3>
                            <button 
                                className="btn btn-danger" 
                                data-bs-target="#exampleModalToggle2" 
                                data-bs-toggle="modal">Pay 
                            </button>
                            </div>
                            ):null
                        }
                        </div>
                    </div>
                </div>
            </div>




            <div className="modal fade" id="exampleModalToggle2" aria-hidden="true" aria-labelledby="exampleModalToggleLabel2" tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalToggleLabel2">{restaurant.name}</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                            <div className="mb-3">
                                    <label htmlFor="" className="form-label">User Name</label>
                                    <input type="text" className="form-control"  placeholder="Enter User Name" value={userDetails.name} readOnly={true} onChange={()=>{}}/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="" className="form-label">Email address</label>
                                    <input type="email" className="form-control"  placeholder="ex.name@example.com" value={userDetails.email} readOnly={true} onChange={()=>{}}/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="" className="form-label">Address</label>
                                    <textarea className="form-control"  rows="3"value="" onChange={()=>{}}></textarea>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between p-3 ">
                                <button className="btn btn-primary" data-bs-target="#exampleModalToggle" data-bs-toggle="modal">Go Back </button>
                                <button className="btn btn-success" onClick={displayRazorpay} >Pay Now</button>
                            </div>
                        </div>
                    </div>
            </div>


            <Header color='bg-danger' />
            
            <section className="row justify-content-center">
                <section className="col-11 restaurant-main-image position-relative">
                    <img src={"/images/"+restaurant.image} alt=""/>
                    <button className="btn btn-gallery position-absolute">Click to See Image Gallery</button>
                </section>
                <section className="col-11">
                    <h2 className="mt-3">{restaurant.name} </h2>
                    <div className="d-flex justify-content-between align-items-start">
                        <ul className="list-unstyled d-flex gap-3 fw-bold">
                            <li className=" pb-2 hand" onClick={()=>setTab(1)} >Overview</li>                                    
                            <li className=" pb-2 hand" onClick={()=>setTab(2)} >Contact</li>
                        </ul>
                        {userDetails ? (
                        <button 
                            data-bs-toggle="modal" 
                            href="#exampleModalToggle" 
                            role="button"
                            className="btn btn-danger"
                            onClick={getMenuItems}
                            >
                            Place Online Order
                        </button>
                       ):<button className="btn btn-danger" disabled={true}>Please Login To Place Order</button>}
                    </div>
             
                    { tab === 1 ? ( 
                        <section>
                            <h4 className="mb-3">About this place</h4>
                            <p className="m-0 fw-bold">Cuisine</p>
                            <p className="nb-3 text-muted small">

                                {(restaurant.cuisine.length > 0) ?
                                    restaurant.cuisine.reduce((pvalue,cvalue)=>{
                                        return pvalue.name +",  " + cvalue.name;
                                    }):null
                                }
                            </p>

                            <p className="m-0 fw-bold">Average Cost</p>
                            <p className="nb-3 text-muted small">₹{restaurant.min_price} for two people(approx.) </p>
                        </section>
                    ) : ( 
                        <section>
                            <h4 className="mb-3">Contact</h4>
                            <p className="m-0 fw-bold">Phone Number</p>
                            <p className="nb-3 text-danger small">{restaurant.contact_number}</p>

                            <p className="m-0 fw-bold">{restaurant.name}</p>
                            <p className="nb-3 text-muted small">{restaurant.locality},{restaurant.city}</p>
                        </section>
                    )}
           
                </section>
            </section>
        </>
    );
}

export default RestaurantPage;