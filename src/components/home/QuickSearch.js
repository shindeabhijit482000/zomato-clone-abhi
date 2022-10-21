import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function QuickSarch() {
    let navigate = useNavigate(); //instance of it

    let [mealTypeList,setMealTypeList] = useState([]);

    let getMealtypes=async () => {
        try{
      let response= await axios.get("http://localhost:5003/api/get-meal-types");
      let data= response.data;  
      if (data.status===true){
        setMealTypeList([...data.result]);  //recreate array
      }else{
        setMealTypeList([]);
      }
        }catch(error){
            alert("server side error s");
        }
    };
    
    let getQuickSearchPage = (id) => {
        navigate(`/search-page/${+ id}`);
    };

    useEffect(() => {getMealtypes();}, []);  //[]==> useEffect will run Ones

    return (
    < > 
    
    <section className="row justify-content-center">
    <section className="col-10 mt-3">
        <h3 className="fw-bold text-navy">Quick Searches</h3>
        <p className="text-secondary">Discover restaurants by type of meal</p>
    </section>
    <section className="col-10">
        <section className="row py-2">
            <section className="col-12 px-0 d-flex justify-content-between flex-wrap">
               
                {
                    mealTypeList.map((mealType,index)=>{
                       return (
                       <section 
                            key={index} 
                            className="px-0 d-flex border border-1 quick-search-item"
                            onClick={()=> getQuickSearchPage(mealType.meal_type)}
                            >
                            
                            <img 
                                src={"/images/"+mealType.image} 
                                alt="" 
                                className="image-item" 
                            />

                            <div className="pt-3 px-2">
                                <h4 className="text-navy">{mealType.name}</h4>
                                <p className="small text-muted">
                                    {mealType.content}
                                </p>
                            </div>
                        </section>
                       );
                    })
               
                }

                
            </section>
        </section>
    </section>
</section>
 </>
 );
}

export default QuickSarch