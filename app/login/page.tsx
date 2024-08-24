import Image from "next/image";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePollVertical, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

export default function Login() {
  return(
    <div className="bg-[url(/bg-black-image.png)] flex items-center h-screen w-screen flex-col ">
    
    <div className="bg-primary text-black items-center text-center whitespace-nowrap w-screen">
LOGIN - LOGIN - LOGIN - LOGIN - LOGIN - LOGIN - LOGIN - LOGIN - LOGIN - LOGIN - LOGIN - LOGIN - LOGIN - LOGIN - LOGIN - LO</div>
<div className="flex flex-col justify-center items-center h-screen">   
    <h1 className=" text-2xl md:text-3xl text-white mt-10">Which is your role here?</h1>
    
    <div className="flex flex-col justify-center items-center m-10">
        
        <button className="bg-primary text-black p-2 m-2 rounded-lg flex items-center">
        <FontAwesomeIcon icon={faSquarePollVertical} className="mr-2 h-8" />
       <a href="/api/auth/login">Survey Participant</a> 
        </button>
        <button className="bg-primary text-black p-2 m-2 rounded-lg flex items-center">
        <FontAwesomeIcon icon={faMagnifyingGlass} className="mr-2 h-8"/>        
        Researcher
        </button>
    </div>


    </div>
    
    
    </div>


  );
}
