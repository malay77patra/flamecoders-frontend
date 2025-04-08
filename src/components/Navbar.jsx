import { useNavigate } from "react-router-dom";
import CustomIcon from "./CustomIcon";
import Logo from "@/assets/logo.svg?react";
import { useAuth } from "@/hooks/useAuth";
import { useApi } from "@/hooks/useApi";
import toast from "react-hot-toast";
import { useState } from "react";
import RLoader from "./RLoader";
import { MdLogout } from "react-icons/md";
import { FaUserAlt } from "react-icons/fa";
import Avatar from "boring-avatars";

export default function Navbar() {
    const [loggingOut, setLoggingOut] = useState(false);
    const navigate = useNavigate();
    const { isAuthenticated, user, setUser, authToken, setAuthToken } = useAuth();
    const api = useApi();

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            const { data, error } = await api.post("/api/user/logout", {}, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });

            if (error) {
                toast.error(error.message);
            } else {
                setUser({});
                setAuthToken("");
                toast.success("Logged out");
            }
        } catch (err) {
            toast.error("Something went wrong.");
        } finally {
            setLoggingOut(false);
        }
    };

    return (
        <div className="navbar bg-base-100 shadow-sm max-w-7xl m-auto">
            <div className="flex-1 flex items-center">
                <CustomIcon svg={<Logo />} size="2rem" />
                <a className="p-2 text-xl text-primary" href="/">
                    Flamecoders
                </a>
            </div>
            <div className="flex-none">
                {isAuthenticated ? (
                    <div className="dropdown dropdown-end">
                        <Avatar name={user.name} className="h-10 w-10 border rounded-full cursor-pointer" tabIndex={0} colors={["#000000", "#9500ff", "#ff005b", "#7e36ba", "#00b5c2"]} />
                        <ul tabIndex={0} className="dropdown-content menu bg-base-300 rounded-box z-1 w-52 p-2 shadow-lg mt-1 flex flex-col gap-2">
                            <h2 className="text-lg p-2 font-medium text-primary border-b mb-2">flamecoders</h2>
                            <li>
                                <button className="btn">
                                    <FaUserAlt /> Profile
                                </button>
                            </li>
                            <li>
                                <button className="btn btn-error" onClick={handleLogout}>
                                    {loggingOut ? <RLoader size="2rem" /> : (
                                        <>
                                            <MdLogout /> Logout
                                        </>
                                    )}
                                </button>
                            </li>
                        </ul>
                    </div>
                ) : (
                    <button className="btn btn-primary" onClick={() => navigate("/auth")}>
                        Get Started
                    </button>
                )}
            </div>
        </div>
    );
}
