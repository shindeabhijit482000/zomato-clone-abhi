import axios from "axios";
import { useEffect,useRef,useState } from "react";
import Headers from "../Header";

function Wallpaper() {
   
    let selectInput=useRef();  // it well give element refrance
    let [locationList,setLocationList] = useState([]);
    let [disabled,setDisabled]=useState(true);

    let getLocationList=async()=>{
        try{
       let response= await axios.get("http://localhost:5003/api/get-location");
       let data=response.data
       if(data.status===true){
        setLocationList([...data.result]);
       }else{
        setLocationList([]);
       }
       
        }catch(error){
            console.log(error);
            alert("server side error");
        }   
    };

    let getLocationId = async (event)=>{
        let value = event.target.value;
        if(value !==""){
        try{
        let url= `http://localhost:5003/api/get-restaurant-by-location-id/${value}`;
        let {data} = await axios.get(url);
        if(data.status ==true){
            if(data.result.length === 0){
               setDisabled (true);
            }else{
                setDisabled (false);
            }
        }
        }catch(error){
            console.log(error);
            alert("server side error");
        }
        }
    };
    useEffect(()=>{
        getLocationList();
    }, [] );
    return (
    < >
        
        <section className="row main-section align-content-start">
            <div className="col-12">
                <Headers color="" />
            </div>
            <section className="col-12 d-flex flex-column align-items-center justify-content-center">
                <p className="brand-name fw-bold my-lg-2 mb-0">e!</p>
                <p className="h1 text-white my-3 text-center">
                    Find the best restaurants, cafés, and bars
                </p>
                <div className="search w-50 d-flex mt-3">
                    
                   
                   <select 
                   
                   className="form-select mb-3 mb-lg-0 w-50 me-lg-3 py-2 px-3"
                   onChange={getLocationId}
                   >

                    <option value="">Please select a location</option>
                    {
                        locationList.map((location,index)=>{
                            return <option value={location.location_id} key={index}>
                                {location.name},{location.city}
                            </option>;
                        })
                    }
                   </select>
                   
                   
                   
                    <div className="w-75 input-group">
                        <span className="input-group-text bg-white">
                            <i className="fa fa-search text-primary"></i>
                        </span>
                        <input 
                            type="text" 
                            className="form-control py-2 px-3" 
                            placeholder="Search for restaurants"
                            disabled={disabled} 
                        
                        />
                    </div>
                </div>
            </section>
        </section>
    </>
    );
}

export default Wallpaper