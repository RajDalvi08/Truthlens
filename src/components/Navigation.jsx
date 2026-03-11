import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "./NavIconTemplate/Nav";
import { FiChevronLeft, FiMessageSquare } from "react-icons/fi";
import { TbFileUpload, TbArrowsExchange } from "react-icons/tb";
import { VscGraphLine } from "react-icons/vsc";
import {
  AiOutlineUsergroupAdd,
  AiOutlineDollarCircle,
  AiOutlineUserSwitch,
} from "react-icons/ai";
import { MdOutlineNotificationsActive } from "react-icons/md";
import {
  RiDashboard2Fill,
  RiAccountCircleLine,
  RiMoneyDollarCircleLine,
  RiAccountCircle2Line,
} from "react-icons/ri";
import { BiMessageAltAdd } from "react-icons/bi";
import { SlUserFollow } from "react-icons/sl";
import { TfiMoreAlt } from "react-icons/tfi";
import { ThemeContext } from "../ThemeContext";

const Navigation = () => {
  const [nav, setNav] = useState(false);
  const { DarkTheme, setDarkTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const changeTheme = () => setDarkTheme(!DarkTheme);

  return (
    <div
      className={`relative flex flex-col ${
        nav ? "w-[80px]" : "w-[260px]"
      } min-h-screen p-3 text-white transition-all duration-300
      bg-gradient-to-br from-[#4d4d4a] to-[#000000]
      ${DarkTheme ? "bg-black" : ""}`}
    >
      {/* MENU BUTTON */}
      <div
        onClick={() => setNav(!nav)}
        className="absolute right-3 top-3 h-9 w-9 flex items-center justify-center cursor-pointer z-10"
      >
        <FiChevronLeft
          className={`text-lg transition-transform duration-300 ${
            nav ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* HEADER */}
      <header
        className={`flex flex-col items-center gap-2 py-6 mb-3 rounded-xl 
        bg-[#5d564a] backdrop-blur-xl ${
          DarkTheme ? "bg-[#6b655c]" : ""
        }`}
      >
        <img
          src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=687&auto=format&fit=crop"
          alt="profile"
          className={`rounded-full object-cover ${
            nav ? "w-10 h-10" : "w-12 h-12"
          }`}
        />
        {!nav && <span className="text-sm">creative_ambition</span>}
      </header>

      {/* NAV ITEMS */}
      <Nav title="Dashboard" Icon={RiDashboard2Fill} collapsed={nav} />
      <Nav title="Analytics" Icon={VscGraphLine} collapsed={nav} />
      <Nav title="Upload" Icon={TbFileUpload} collapsed={nav} />
      <Nav title="Followers" Icon={SlUserFollow} collapsed={nav} />

      {/* DIVIDER */}
      <div className="h-[1px] w-4/5 bg-white/40 mx-auto my-2" />

      <Nav title="Messages" Icon={FiMessageSquare} collapsed={nav} onClick={() => navigate("/message")} />
      <Nav title="Add Message" Icon={BiMessageAltAdd} collapsed={nav} />
      <Nav title="Notifications" Icon={MdOutlineNotificationsActive} collapsed={nav} />
      <Nav title="Switch User" Icon={AiOutlineUserSwitch} collapsed={nav} />
      <Nav title="User Group" Icon={AiOutlineUsergroupAdd} collapsed={nav} />
      <Nav title="Revenue" Icon={AiOutlineDollarCircle} collapsed={nav} onClick={() => navigate("/revenue")} />
      <Nav title="Earnings" Icon={RiMoneyDollarCircleLine} collapsed={nav} />
      <Nav title="Change Account" Icon={RiAccountCircle2Line} collapsed={nav} onClick={() => navigate("/changeaccount")} />

      <div className="h-[1px] w-4/5 bg-white/40 mx-auto my-2" />

      <Nav
        title={DarkTheme ? "Switch to Light Theme" : "Switch to Dark Theme"}
        Icon={TbArrowsExchange}
        collapsed={nav}
        onClick={changeTheme}
      />
      <Nav title="Profile" Icon={RiAccountCircleLine} collapsed={nav} onClick={() => navigate("/profile")} />
      <Nav title="More Details" Icon={TfiMoreAlt} collapsed={nav} />

      {/* BACKGROUND WAVES */}
      <svg
        className="absolute inset-0 -z-10 opacity-30"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          fill="#ffffff"
          fillOpacity="0.25"
          d="M0,160L48,154.7C96,149,192,139,288,160C384,181,480,235,576,245.3C672,256,768,224,864,197.3C960,171,1056,149,1152,144C1248,139,1344,149,1392,154.7L1440,160L1440,320L0,320Z"
        />
        <path
          fill="#ffffff"
          fillOpacity="0.5"
          d="M0,96L60,112C120,128,240,160,360,181.3C480,203,600,213,720,186.7C840,160,960,96,1080,85.3C1200,75,1320,117,1380,138.7L1440,160L1440,0L0,0Z"
        />
      </svg>
    </div>
  );
};

export default Navigation;