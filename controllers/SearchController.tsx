import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/state/store";

export default function SearchController() {
    // The query will be given by the user and displayed in the search bar (input field)
    const query = useSelector((state: RootState) => state.search.query)
    const dispatch = useDispatch();     // connect between redux and the component
   
    return ( 
        <div> 
            <h1>Search</h1>
            <p>Query: {query}</p>     
        </div>
        
    );
}