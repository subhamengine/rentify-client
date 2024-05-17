import React from 'react'
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();
    
    const logout = ()=>{
        localStorage.removeItem("user");
        navigate("/")
    }
  return (
    <div className=' w-[100%] h-[8%] border  flex justify-end items-center'>
        <button onClick={logout} className='border w-[5rem] h-[3rem] mr-[2rem]'>Logout</button>
    </div>
  )
}

export default Header