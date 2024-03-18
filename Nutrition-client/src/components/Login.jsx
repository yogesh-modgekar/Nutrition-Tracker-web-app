
import { useState,useContext, useEffect } from "react"
import { UserContext } from "../contexts/UserContext";
import { Link,useNavigate } from "react-router-dom"

export default function Login()
{
    const loggedData =useContext(UserContext);

    const navigate = useNavigate();

    const [userCred,setUserCred] = useState({
        email : "",
        password : ""
    })

    const [messsage,setMessage]= useState({
        type:"invisible",
        text : "dommy txt"
    })



    function handleInput(event){
        setUserCred((prevState)=>{
            return{...prevState,[event.target.name]:event.target.value};
        })
    }

    function handleSubmit(event){
        event.preventDefault();
        console.log(userCred);

        fetch("http://localhost:7000/login",{
            method:'POST',
            body: JSON.stringify(userCred),
            headers:{
                "content-type":"application/json"
            }
        })
            .then((response)=>{
                console.log(response)
                if (response.status===404)
                {
                   setMessage({type:"error",text:"Incorrect Username"})
                }
                else if (response.status===403)
                {
                   setMessage({type:"error",text:"Invalid password"})
                }
                setTimeout(()=>{
                    setMessage({type:"invisible",text:"dummy"})
                 },3000)

                    return response.json(); 

            })

            .then((data)=>{
                if(data.Token!==undefined)
                {
                 localStorage.setItem("nutrify-user",JSON.stringify(data));

                 loggedData.setLoggedUser(data);

                 navigate('/track');
                }
            })
            .catch((err)=>{
                console.log(err)
            })
    }

    return(
        <section className="container">

            <form className="form" onSubmit={handleSubmit}>

                <h1>Login to Fitness</h1>
            
                <input type="email" required className="inp" placeholder="Enter Email" name="email" onChange={handleInput} value={userCred.email}/>

                <input type="password" className="inp" placeholder="Enter Password" name="password" onChange={handleInput} value={userCred.password}/>
                
                <button className="btn">Login</button>
                <p>Don't have an account ? <Link to="/register">Register Now</Link></p>
                <p className={ messsage.type}>{ messsage.text}</p>

            

            </form> 

        </section>
    )

}