import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const [pageType, setPageType] = useState("signup");
  const navigate = useNavigate();

  const [selectedOption, setSelectedOption] = useState("seller");

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const SignupHandleSubmit = async (event) => {
    event.preventDefault();

    const body = {
      firstname: event.target[0].value,
      lastname: event.target[1].value,
      email: event.target[2].value,
      password: event.target[3].value,
      mob: event.target[4].value,
      type: selectedOption,
    };
    console.log(body);

    try {
      const savedUserResponse = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );
      const savedUser = await savedUserResponse.json();
      if (savedUser.status === 201) {
        alert("Account created.");
        setPageType("login");
      } else {
        alert(savedUser.error);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const loginHandleSubmit = async (event) => {
    event.preventDefault();

    const body = {
      email: event.target[0].value,
      password: event.target[1].value,
    };
    console.log(body);

    try {
      const savedUserResponse = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );
      const savedUser = await savedUserResponse.json();
      if (savedUser.status === 200) {
        localStorage.setItem("user", JSON.stringify(savedUser));

        setTimeout(() => {
          navigate("/properties");
        }, 2000);
        
      } else {
        alert(savedUser.error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-[100vw] h-[100vh] flex items-center justify-center">
      <div className="w-[40vw] h-[70vh] border flex flex-col items-center justify-around">
        {pageType === "signup" && (
          <>
          <p className="font-bold text-[20px]">Signup</p>
            <form
              onSubmit={SignupHandleSubmit}
              className="w-[100%]  flex flex-col items-center gap-[1rem]"
            >
              <input
                type="text"
                name="firstname"
                required
                className="w-[80%] p-[0.5rem] border"
                placeholder="First name"
              />
              <input
                type="text"
                name="last name"
                required
                className="w-[80%] p-[0.5rem] border"
                placeholder="Last name"
              />
              <input
                type="email"
                name="email"
                required
                className="w-[80%] p-[0.5rem] border"
                placeholder="Email address"
              />
              <input
                type="text"
                name="password"
                required
                className="w-[80%] p-[0.5rem] border"
                placeholder="Password"
              />
              <input
                type="text"
                name="phone number"
                required
                className="w-[80%] p-[0.5rem] border"
                placeholder="Phone number"
              />
              <div className="w-[80%] flex gap-[10px]">
                <label>
                  <input
                    type="radio"
                    value="seller"
                    checked={selectedOption === "seller"}
                    onChange={handleOptionChange}
                  />
                  Seller
                </label>
                <label>
                  <input
                    type="radio"
                    value="buyer"
                    checked={selectedOption === "buyer"}
                    onChange={handleOptionChange}
                  />
                  Buyer
                </label>
              </div>

              <button className="border w-[10rem] p-[0.5rem]">Signup</button>
            </form>
            <button className="mt-[2rem]" onClick={() => setPageType("login")}>
              Already a user ? login
            </button>
          </>
        )}
        {pageType === "login" && (
          <>
          <p className="font-bold text-[20px]">Login</p>
            <form
              onSubmit={loginHandleSubmit}
              className="w-[100%]  flex flex-col items-center gap-[1rem]"
            >
              <input
                type="text"
                name="email"
                required
                className="w-[80%] p-[0.5rem] border"
                placeholder="Email"
              />

              <input
                type="text"
                name="password"
                required
                className="w-[80%] p-[0.5rem] border"
                placeholder="Password"
              />

              <button className="border w-[10rem] p-[0.5rem]">Login</button>
            </form>
            <button className="mt-2rem" onClick={() => setPageType("signup")}>
              New user ? Signup
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
