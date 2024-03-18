
import { useState } from "react"
import { Link } from "react-router-dom"

export default function Register()
{
const[userDetails,setUserDetails] = useState({
     name : "",
     email : "",
     password : "",
     age : ""
})

const[message,setMessage]=useState({
    type:"",
    Text:""
})

function handleInput(event)
{
    setUserDetails((prevState)=>{
        return({...prevState,[event.target.name]:event.target.value});
    })
}

function handleSubmit(event)
{
     event.preventDefault();
     console.log(userDetails)

     fetch("http://localhost:7000/register",{
        method:"POST",
        body:JSON.stringify(userDetails),
        headers:{
            "content-type":"application/json"
        }
     })
     .then((response)=>response.json())
     .then((data)=>{
        setMessage({type:"success",Text:data.message})

        setUserDetails({
            name : "",
            email : "",
            password : "",
            age : ""
        })

        setTimeout(()=>{
            setMessage({type:"invisible",Text:"dommy data"})
        },3000)
    })
     .catch((err)=>{
        console.log(err)
     })
}
    return(
        <section className="container">

            <form className="form" onSubmit={handleSubmit}>

                <h1>Start Your Fitness</h1>
                <input type="text" required className="inp" onChange={handleInput} placeholder="Enter Name" name="name" value={userDetails.name} />

                <input type="email" required className="inp" onChange={handleInput} placeholder="Enter Email" name="email" value={userDetails.email} />

                <input type="password" required className="inp" maxLength={8} onChange={handleInput} placeholder="Enter Password" name="password" value={userDetails.password} />

                <input type="number" required className="inp" max={100} min={12} onChange={handleInput} placeholder="Enter Age" name="age" value={userDetails.age} />

                <button className="btn">Join</button>
                <p>Already Registered ? <Link to="/login">Login</Link></p>
                <p className={message.type}>{message.Text}</p>

            </form> 

        </section>
    )

}