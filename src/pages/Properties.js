import React, { useEffect, useState } from "react";
import Header from "../component/Header.js";
import house from "../assets/house.jpg"
const Properties = () => {

  const [allProperties, setAllProperties] = useState([]);
  const [yourProperties, setYourProperties] = useState([]);
  const [pageType, setPageType] = useState("allproperties");
  const [activeInterest, setActiveInterest] = useState(false);
  const [InterestedProp, setInterestedProp] = useState({});
  const [SearchString, setSearchString] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));



  const getAllProperties = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    try {
      const savedUserResponse = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/get`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },

        }
      );
      const savedUser = await savedUserResponse.json();

      if (savedUser.status === 200) {
        setAllProperties(savedUser.properties)
        console.log(typeof savedUser.properties);
      } else {
        console.log(savedUser.error);
      }
    } catch (error) {
      console.log(error);
    }
  }
  const getYourProperties = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    try {
      const savedUserResponse = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/get/${user.user.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },

        }
      );
      const savedUser = await savedUserResponse.json();

      if (savedUser) {
        setYourProperties(savedUser)
        console.log( savedUser);
      } else {
        console.log(savedUser.error);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    

    getAllProperties();
    getYourProperties();

  }, [pageType])



  const createPropSubmit = async(event)=>{
    event.preventDefault();
    console.log(event);
    // propertyName, place, area, numberOfBedrooms, details, seller_id, seller_name,picturePath
    const body = {
           
      "propertyName":event.target[0].value,
      "place":event.target[1].value, 
      "area":event.target[2].value, 
      "numberOfBedrooms":event.target[3].value, 
      "details":event.target[4].value, 
      "seller_id":user.user.id,
      "seller_name":user.user.firstname,
      "picturePath":"test.png",
      "likes":"0",
      "likedBy":[],
     
  }
  if(body.details.length > 200){
    alert('Max word limit for details is 200 words.')
    return
  }
  console.log(body);
  

  try {
      const savedUserResponse = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(body),
        }
      );
      const savedUser = await savedUserResponse.json();
      if (savedUser.status === 201) {
          alert("Created!")

          await getYourProperties()
         
          setPageType("yourproperties");
      } else {
        alert(savedUser.error);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const deleteProperty = async(id)=>{
    try {
      const savedUserResponse = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          
        }
      );
      const savedUser = await savedUserResponse.json();
      if (savedUser.status === 200) {
          alert("Deleted!")

          await getYourProperties()
         
          setPageType("yourproperties");
      } else {
        alert(savedUser.error);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const interestedButton = (p)=>{
    setActiveInterest(true);
    setInterestedProp(p);
  }
  const handleSearch = (s)=>{
    setSearchString(s);
    console.log(s);
    
  }

  const likeProp = async (id, likes, likedby, userid, type) => {
    console.log(likedby);
    
  
    let likesUpdate = Number(likes);

    if(type =="like"){
      likesUpdate += 1;
      likedby.push(userid.toString());
    }
    if(type=="dislike"){
      likesUpdate -=1;
      likedby = likedby.filter((l)=> l != userid.toString());
      console.log(likedby);
    }
  
    const body = {
      likes: likesUpdate.toString(),
      likedBy: likedby,
    };
  
    console.log(body);
    try {
      const savedUserResponse = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/like/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(body), // Convert body to JSON
        }
      );
      const savedUser = await savedUserResponse.json();
      if (savedUser.status === 200) {
        alert(type);
        await getYourProperties();
        await getAllProperties();
   

        setPageType("allproperties");
      } else {
        alert(savedUser.error);
      }
    } catch (error) {
      console.log(error);
    }
  };
  



  let filteredAllProperties=[];

  if(pageType === "allproperties" && allProperties.length > 0){
    filteredAllProperties = allProperties.filter((p)=> p.propertyname.toLowerCase().includes(SearchString.toLocaleLowerCase()))
  }
  if(pageType === "yourproperties" && yourProperties.length > 0){
    filteredAllProperties =  yourProperties.filter((p)=> p.propertyname.toLowerCase().includes(SearchString.toLocaleLowerCase()))
  }





  return (
    <div className="w-[100vw] h-[100vh] flex flex-col items-center justify-between">

      <Header />
      <div className="w-[90%] h-[85%]  flex flex-col items-center overflow-y-scroll">
        <div className="w-[50%] h-[10%]  flex items-center justify-center gap-[0.5rem]">
          <button onClick={() => setPageType("allproperties")} className={`border w-[10rem] p-[0.5rem] ${pageType === "allproperties" && "bg-[#2dc918] text-white"}`}>All Properties</button>
          {user.user.type === "seller" && <button onClick={() => setPageType("yourproperties")} className={`border w-[10rem] p-[0.5rem]  ${pageType === "yourproperties" && "bg-[#2dc918] text-white"}` }>Your Properties</button>}
          {user.user.type === "seller" && <button onClick={() => setPageType("createproperties")} className={`border w-[15rem] p-[0.5rem] ${pageType === "createproperties" && "bg-[#2dc918] text-white"}`}>Create Properties</button>}
        </div>
        <div className="w-[100%] h-[90%]  flex flex-col items-center gap-[5%]">
          <input onChange={(e)=>handleSearch(e.target.value)} className="text-center border px-[0.2rem] py-[0.4rem] w-[20rem] h-[5%]" type="text" placeholder="Search" />
          <div className=" w-[100%] h-[90%]  grid grid-cols-3 responsive gap-x-2 gap-y-5  overflow-scroll p-2">
            {
              pageType === "allproperties" && filteredAllProperties.length > 0 && filteredAllProperties.map((p) => (
                <div key={p.id} class="h-[55vh] w-[25rem] hover:transform hover:scale-[1.01] transition-transform duration-300 ease-in-out shadow-md rounded-2xl flex flex-col justify-start items-center p-4 gap-[0.4rem]">
                  <div className="w-[100%] h-[60%]"> <img className="w-[100%] h-[100%]" src={house} alt="" srcset="" /></div>
                  <div className="w-[100%] h-[37%]  flex flex-col justify-between">
                    <p>{p.propertyname}</p>
                    <p>{p.place}</p>
                    <p>{p.area}</p>
                    <p>numberOfBedrooms {" " + p.numberofbedrooms}</p>
                    {Number(p.seller_id) === user.user.id ? <button onClick={()=>deleteProperty(p.id)} className="border p-[0.3rem]">Delete</button> : <button onClick={()=>interestedButton(p)} className="border p-[0.3rem]">Interested</button>}
                  {
                    p.likedby.includes(user.user.id.toString()) ? 
                    <button onClick={()=>likeProp(p.id, p.likes,p.likedby, user.user.id,"dislike")} className="bg-[#2dc918] text-white self-start p-[0.3rem] rounded-[10px]">{p.likes + " "} Likes</button>

                    :

                    <button onClick={()=>likeProp(p.id, p.likes,p.likedby, user.user.id,"like")} className="self-start">{p.likes + " "} Likes</button>

                  }
                  </div>

                </div>



              ))
            }
            
            {
              pageType === "yourproperties" && filteredAllProperties.length > 0 && filteredAllProperties.map((p) => (
                <div key={p.id} class="h-[50vh] w-[25rem] hover:transform hover:scale-[1.01] transition-transform duration-300 ease-in-out shadow-md rounded-2xl flex flex-col justify-start items-center p-4 gap-[0.4rem]">
                  <div className="w-[100%] h-[60%]"> <img className="w-[100%] h-[100%]" src={house} alt="" srcset="" /></div>
                  <div className="w-[100%] h-[37%]  flex flex-col justify-between">
                    <p>{p.propertyname}</p>
                    <p>{p.place}</p>
                    <p>{p.area}</p>
                    <p>numberOfBedrooms {" " + p.numberofbedrooms}</p>
                    {Number (p.seller_id) === user.user.id ? <button onClick={()=>deleteProperty(p.id)} className="border p-[0.3rem]">Delete</button> : <button className="border p-[0.3rem]">Interested</button>}

                  </div>

                </div>
              ))
            }
            {
              pageType === "createproperties" &&
              <form onSubmit={createPropSubmit} className=' fixed left-[37%] p-[1rem] min-h-[50vh] w-[25rem] border flex flex-col items-center gap-[1rem]'>
                <input type="text"  required className='w-[80%] p-[0.5rem] border' placeholder='Property Name' />

                <input type="text"  required className='w-[80%] p-[0.5rem] border' placeholder='Place' />
                <input type="text"  required className='w-[80%] p-[0.5rem] border' placeholder='Area' />
                <input type="number"  required className='w-[80%] p-[0.5rem] border' placeholder='Number Of Bedrooms' />
                
                <textarea type="text"  required className='w-[80%] p-[0.5rem] border' placeholder='Details' />



                <button className="border w-[10rem] p-[0.5rem]">Create</button>
              </form>
            }

            {
              activeInterest && <div className="absolute w-[100vw] h-[100vh] backdrop-blur-sm top-0 left-0 flex items-center justify-center">
                <div className="relative w-[40vw] min-h-[30vh] max-h-[60vh]  bg-white rounded-[10px] px-[0.5rem]">
                  <p className="font-bold text-[25px] text-center">Details</p>
                  <p className="w-[100%] h-[80%]  break-words">{InterestedProp.details} </p>
                  <p>Seller name - {InterestedProp.seller_name}</p>
                  <button onClick={()=>setActiveInterest(false)} className="absolute right-3 top-0 text-[20px]">X</button>
                </div>
                
              </div>
            }

            


          </div>
        </div>
      </div>
    </div>
  );
};

export default Properties;

// (propertyName, place, area, numberOfBedrooms, details, seller_id, seller_name,picturePath)
