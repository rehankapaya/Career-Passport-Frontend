import { createContext, useState } from "react";

export const UserContext = createContext()


export default function UserProvider({children}) {
    const [user,setUser]= useState(JSON.parse(localStorage.getItem("user")) || null);
    console.log(user)

    const userlogin = (user)=> {
        setUser(user);
        localStorage.setItem("user",JSON.stringify(user))
        localStorage.setItem("token",user.token)
      
    }
    
    const userlogout =() =>{
        setUser(null);
        localStorage.removeItem("user")
    }
     
  return (
    <div>
        <UserContext.Provider value={{user ,userlogin ,userlogout}}>
            {children}
        </UserContext.Provider>
    </div>
  )
}