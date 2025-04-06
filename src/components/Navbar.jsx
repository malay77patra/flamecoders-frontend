// import { FaBarsStaggered } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import CustomIcon from "./CustomIcon";
import Logo from '@/assets/logo.svg?react';
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    return (
        <div className="navbar bg-base-100 shadow-sm">
            <div className="flex-1 flex items-center">
                <CustomIcon svg={<Logo />} size="2rem" />
                <a className="p-2 text-xl text-primary" href="/">Flamecoders</a>
            </div>
            <div className="flex-none">
                {isAuthenticated ? (
                    <>user</>
                ) : (
                    <button className="btn btn-primary" onClick={() => navigate("/auth")}>Get Started</button>
                )}
            </div>
        </div>
    )
}
