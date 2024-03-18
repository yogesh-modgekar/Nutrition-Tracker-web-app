import { UserContext } from "../contexts/UserContext"
import { useContext, useEffect, useState } from "react"
import Food from "./Food";
import Header from "./Header";

export default function Track() {
       const loggedData = useContext(UserContext);

       const [foodItems, setFoodItems] = useState([])

       const [food,setFood] = useState(null)


       function searchFood(event) {
              if (event.target.value.length !== 0) {
                     fetch(`http://localhost:7000/foods/${event.target.value}`, {
                            method: 'GET',
                            headers: {
                                   "Authorization": `Bearer ${loggedData.loggedUser.Token}`
                            }
                     })
                            .then((response) => response.json())
                            .then((data) => {
                                   if (data.message === undefined) {
                                          setFoodItems(data)
                                   }
                                   else {
                                          setFoodItems([]);
                                   }
                            })
                            .catch((err) => {
                                   console.log(err)
                            })
              }
              else {
                     setFoodItems([]);
              }
       }

       return (
              <>
                     <section className="container track-container">

                            <Header />

                            <div className="search">
                                   <input className="search-inp" type="text" onChange={searchFood} placeholder="search food item" />

                                   {
                                          foodItems.length !== 0 ?
                                                 (
                                                        <div className="search-results">
                                                               {
                                                                      foodItems.map((item) => {
                                                                             return (
                                                                                    <p className="item" onClick={()=>{
                                                                                           setFood(item);
                                                                                    }}
                                                                                            key={item._id}>{item.name}</p>
                                                                             )
                                                                      })
                                                               }
                                                        </div>
                                                 ) : null
                                   }

                            </div>
                            {
                                   food!==null?(
                                          <Food food = {food}/>  
                                   ):null
                            }
                     

                     </section>
              </>

       )
}