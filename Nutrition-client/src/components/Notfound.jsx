import { Link } from "react-router-dom"

export default function Notfound()
{
   return(
    <section className="container">
    <div className="not-found">
          <h1>404 ! Not Found</h1>
          <p><Link to='/register'>go for Registration</Link></p>
    </div>
    </section>
   )

}