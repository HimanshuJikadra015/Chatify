import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import styled from "styled-components";
import loader from "../assets/loader.gif"
import {ToastContainer,toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import axios from "axios";
import { setAvatarRoute } from "../utils/APIRoutes";
import {Buffer} from "buffer";

function SetAvatar(){
    const api='https://api.multiavatar.com/456789145';
    const navigate = useNavigate();
    const[avatars,setAvatars] = useState([]);
    const[isLoading,setIsLoading] = useState(true);
    const[selectedAvatar,setSelectedAvatar] = useState(undefined);
    const toastOptions={
        position: "bottom-right",
        autoClose: 4000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    }
    useEffect(()=>{
        if(!localStorage.getItem('chatify-user')){
            navigate("/login");
        }
    },[navigate]);
    
    const setProfilePicture = async()=>{
        if(selectedAvatar===undefined){
            toast.error("You must select an avatar first!",toastOptions);
        }else{
            const user = await JSON.parse(localStorage.getItem("chatify-user"));
            const {data} = await axios.post(`${setAvatarRoute}/${user._id}`,{
                image:avatars[selectedAvatar],
            });
            if(data.isSet){
                user.isAvatarImageSet = true;
                user.avatarImage = data.image;
                localStorage.setItem("chatify-user",JSON.stringify(user));
                navigate("/");
            }else{
                toast.error("Avatar setting failed. Please retry!",toastOptions);
            }
        }
    };
    // useEffect(async()=>{
    //     const data=[];
    //     for(let i=0; i<4; i++){
    //         const image = await axios.get(`${api}/${Math.round(Math.random()*1000)}`);
    //         const buffer = new Buffer(image.data);
    //         data.push(buffer.toString("base64"));
    //     }
    //     setAvatars(data);
    //     setIsLoading(false);
    // },[])
    const fetchData = async()=>{
        const data=[];
        for (let i=0; i<4; i++) {
            const image = await axios.get(`${api}/${Math.round(Math.random() * 1000)}`);
            const buffer = new Buffer(image.data);
            data.push(buffer.toString("base64"));
        }
        setAvatars(data);
        setIsLoading(false);
    };
    useEffect(()=>{
        fetchData();
    },[]);
    return(
        <>
        {
            isLoading? <Container><img src={loader} alt="loader" className="loader"/></Container> 
            :(  
                <Container>
                    <div className="title-container">
                        <h1>
                            Personalize your profile picture with an avatar!
                        </h1>
                    </div>
                    <div className="avatars">{
                        avatars.map((avatar,index)=>{
                            return(
                                <div key={index} className={`avatar ${selectedAvatar===index? "selected":""}`}>
                                    <img src={`data:image/svg+xml;base64,${avatar}`} alt="avatar" onClick={()=>setSelectedAvatar(index)}/>
                                </div>
                            )
                        })
                    }</div>
                    <button className="submit-button" onClick={setProfilePicture}>Set as profile picture</button>
                </Container>
            )
        }
        <ToastContainer/>
        </>
    ); 
}

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 3rem;
    background-color: #131324;
    height: 100vh;
    width: 100vw;
    .loader{
        max-inline-size: 100%;
    }
    .title-container{
        h1{
            color: white;
        }
    }
    .avatars{
        display: flex;
        gap: 2rem;
        .avatar{
            border: 0.4rem solid transparent;
            padding: 0.4rem;
            border-radius: 5rem;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: 0.5s ease-in-out;
            img{
                height: 6rem;
            }
        }
        .selected{
            border: 0.4rem solid #4e0eff;
        }
    }
    .submit-button{
        background-color: #997af0;
        color: white;
        padding: 1rem 2rem;
        border: none;
        font-weight: bold;
        cursor: pointer;
        border-radius: 0.4rem;
        font-size: 1rem;
        text-transform: uppercase;
        transition: 0.5s ease-in-out;
        &:hover{
            background-color: #4e0eff;
        }
    }
`;

export default SetAvatar;