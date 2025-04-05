// import { FaBarsStaggered } from "react-icons/fa6";
import CustomIcon from "./CustomIcon";
import Logo from '@/assets/logo.svg?react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
    const navigate = useNavigate();
    
    return (
        <div className="navbar bg-base-100 shadow-sm">
            {/* <div className="flex-none">
                <button className="btn btn-square btn-ghost">
                    <FaBarsStaggered />
                </button>
            </div> */}
            <div className="flex-1 flex items-center">
                <CustomIcon svg={<Logo />} size="2rem" />
                <a className="p-2 text-xl text-primary" href="/">Flamecoders</a>
            </div>
            <div className="flex-none">
                <button className="btn btn-primary" onclick={() => {
            alert("working");
            navigate("/auth");
                }}>Get Started</button>
            </div>
        </div>
    )
}
