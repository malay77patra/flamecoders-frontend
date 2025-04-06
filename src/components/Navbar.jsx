// import { FaBarsStaggered } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import CustomIcon from "./CustomIcon";
import Logo from '@/assets/logo.svg?react'

export default function Navbar() {
    return (
        <div className="navbar bg-base-100 shadow-sm">
            <div className="flex-1 flex items-center">
                <CustomIcon svg={<Logo />} size="2rem" />
                <a className="p-2 text-xl text-primary" href="/">Flamecoders</a>
            </div>
            <div className="flex-none">
                <button className="btn btn-primary">Get Started</button>
            </div>
        </div>
    )
}
