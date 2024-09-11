import { SignupInputType } from "@wisejoker/bloggingwebsite-common";
import axios from "axios";
import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config";

export const Auth = ({ type }: { type: "signup" | "signin" }) => {
    const navigate = useNavigate()
  const [postInput, setPostInput] = useState<SignupInputType>({
    name: "",
    email: "",
    password: "",
  });

  async function sendRequest(){
    try{
        const response = await axios.post(`${BACKEND_URL}/api/v1/user/${type==="signup"?"signup":"signin"}`,postInput)
        const jwt = response.data;
        localStorage.setItem("token",jwt);
        navigate("/blogs");
    }catch(e){
        alert("Error while signing up");
        console.log(e);
        //alert the user here that the request failed
    }
  }

  return (
    <div className="h-screen flex justify-center flex-col">
      <div className="flex justify-center">
        <div>
          <div className="px-5 text-center">
            <div className="text-4xl font-bold">Create an account</div>
            <div className="text-slate-500">
              {type === "signin"?"Don't have an account?":"Already have an account?"}
              <Link to={type==="signin"?"/Signup":"/Signin"} className="font-semibold underline pl-2">
                {type==="signin"?"Sign up":"Sign in"}
              </Link>
            </div>
          </div>
          <div className="pt-7">
            {type=="signup"?<LabelledInput
              label="Name"
              placeholder="John Michel"
              onChange={(e) => {
                setPostInput((c) => ({
                  ...c,
                  name: e.target.value,
                }));
              }}
            />:null}
            <LabelledInput
              label="Email"
              placeholder="johnmichel@gmail.com"
              onChange={(e) => {
                setPostInput((c) => ({
                  ...c,
                  email: e.target.value,
                }));
              }}
            />
            <LabelledInput
              label="Password"
              type="password"
              placeholder="MypAss@4232---123123123"
              onChange={(e) => {
                setPostInput((c) => ({
                  ...c,
                  password: e.target.value,
                }));
              }}
            />

            <button onClick={sendRequest} type="button" className="mt-5 w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">{type==="signin"?"Sign In":"Sign Up"}</button>
          </div>
        </div>
      </div>
    </div>
  );
};
interface LabelledInputType {
  label: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}
function LabelledInput({
  label,
  placeholder,
  type,
  onChange,
}: LabelledInputType) {
  return (
    <div>
      <label className="block mb-2 text-sm font-semibold text-black pt-2">
        {label}
      </label>
      <input
        onChange={onChange}
        type={type || "text"}
        id="first_name"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        placeholder={placeholder}
        required
      />
    </div>
  );
}
