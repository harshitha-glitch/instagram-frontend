import React, { useEffect, useRef, useState } from "react";
import { Lock, PlusSquare, Menu } from "lucide-react";
import axios from "axios";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";

const ProfileNavbar = () => {
  const nav = useNavigate();
  const slideRef = useRef(null);
  const tl = useRef(null);
  const [name, setName] = useState("");

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (!token) return;
    axios
      .get("http://16.171.249.231:3000/user/auth", {
        headers: {
          "auth-token": token,
        },
      })
      .then((res) => {
        const userdata = res.data.data;
        setName(userdata.username);
      })
      .catch((err) => {
        console.error("Authentication Failed ❌", err);
      });
  }, []);

  useGSAP(() => {
    tl.current = gsap.timeline({ paused: true }).to(slideRef.current, {
      left: 250,
      duration: 2,
      ease: "power2",
    });
  }, []);

  const logoutSlide = (e) => {
    e.stopPropagation(); // Prevent triggering parent onClick
    tl.current && tl.current.play();
  };

  const logoutSlideBack = () => {
    tl.current && tl.current.reverse();
  };

  const logoutAccount = () => {
    try {
      localStorage.removeItem("token");
      nav("/login");
    } catch (error) {
      alert("error in logging out");
    }
  };

  return (
    <div
      className="flex p-4 gap-37 items-center w-full overflow-x-hidden relative"
      onClick={logoutSlideBack}
    >
      <div className="flex items-center">
        <Lock color="white" size={20} strokeWidth={2} className="font-bold" />
        <p className="text-white font-bold mx-1">{name}</p>
      </div>
      <div className="flex gap-5 items-center absolute right-5">
        <PlusSquare color="white" />
        <Menu color="white" size={24} strokeWidth={2} onClick={logoutSlide} />
      </div>
      <div
        ref={slideRef}
        className="absolute w-[20vw] h-[10vw] rounded-md bg-red-400 font-semibold left-[100vw] flex items-center justify-center text-sm"
        onClick={logoutAccount}
      >
        <p>Logout</p>
      </div>
    </div>
  );
};

export default ProfileNavbar;
