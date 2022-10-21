import { useNavigate } from "react-router-dom";
import {GoogleOAuthProvider,GoogleLogin} from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import { useState } from "react";
import Swal from 'sweetalert2';





function Header(props) {

let navigate=useNavigate();

let getTokenDetails=()=>{
//read the data from localStorage
let token =localStorage.getItem("auth-token");
if(token===null){
    return false;
}else{
    return jwt_decode(token);
}
};

let [userLogin,setUserLogin]=useState(getTokenDetails());

let onSuccess=(credentialResponse)=>{
    let token=credentialResponse.credential;
    //save the data
    localStorage.setItem("auth-token",token);
    Swal.fire({
        icon:"success",
        title:" Login Successfuly",
        text:"",
        
    }).then(()=>{
    window.location.reload();
});
};
let onError=()=>{
    Swal.fire({
        icon:"error",
        title:" Oops...",
        text:"Login Failed Try Again",
        
    });
};
console.log(userLogin);
let logout=()=>{

    Swal.fire({
        title: 'Are you sure to logout?',
        text: "",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, logout me!'
      }).then((result) => {
        if (result.isConfirmed) {
          
            //remove thr data fron localstorage
            //ny using     removeItem
            localStorage.removeItem("auth-token");
            window.location.reload();
        }
      })
};
    return (
         <>
        <GoogleOAuthProvider clientId="324793946402-np2gpmu0ue409h2hoo9s8d73gj8vaekn.apps.googleusercontent.com">
        {/* <!-- Modal --> */}
            <div className="modal fade" id="google-sign-in" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Google Sign-In</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <GoogleLogin
                            onSuccess={onSuccess}
                            onError={onError}
                        />;
                    </div>
                </div>
            </div>
            </div>



         <div className={"row justify-content-center" + props.color} >
            <div className="col-10 d-flex justify-content-between py-2">
                 <p className="m-0 brand hand" onClick={()=>navigate("/")}>e!</p>

                 {userLogin ? (<div>
                    <span className="fs-5 text-white fw-bold me-3">Welcome , {userLogin.given_name}</span>
                    <button className="btn btn-outline-light" onClick={logout}>
                         <i className="fa fa-exit" aria-hidden="true"></i>Logout
                    </button></div>) : (
                <div>
                    <button className="btn text-white"data-bs-toggle="modal" data-bs-target="#google-sign-in">Login</button>
                    <button className="btn btn-outline-light">
                         <i className="fa fa-search" aria-hidden="true"></i>Create a Account
                    </button>
                </div>
               ) }
            </div>
        </div>
        </GoogleOAuthProvider>
        </>
    );
}

export default Header;