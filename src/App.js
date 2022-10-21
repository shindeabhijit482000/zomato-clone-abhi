import HomePage from "./components/home/HomePage";
import SearchPage from "./components/search/SearchPage";
import {Routes,Route} from "react-router-dom";
import RestaurantPage from "./components/restaurant/RestaurentPage";

function App() {
    return ( 
     <>
         <main className="container-fluid">
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/search-page/:meal_id" element={<SearchPage/>}/>
                <Route path="/restaurant/:id" element={ <RestaurantPage/>} />
            </Routes>
        </main> 
     </>
    );

}

export default App;