import { useNavigate } from "react-router-dom";
import CustomIcon from "./CustomIcon";
import Logo from "@/assets/logo.svg?react";
import { useAuth } from "@/hooks/useAuth";
import { useApi } from "@/hooks/useApi";
import toast from "react-hot-toast";
import { useState } from "react";
import RLoader from "./RLoader";

export default function Navbar() {
    const [loggingOut, setLoggingOut] = useState(false);
    const navigate = useNavigate();
    const { isAuthenticated, setUser, authToken, setAuthToken } = useAuth();
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
        <div className="navbar bg-base-100 shadow-sm">
            <div className="flex-1 flex items-center">
                <CustomIcon svg={<Logo />} size="2rem" />
                <a className="p-2 text-xl text-primary" href="/">
                    Flamecoders
                </a>
            </div>
            <div className="flex-none">
                {isAuthenticated ? (
                    <button className="btn btn-error" onClick={handleLogout}>
                        {loggingOut ? <RLoader size="2rem" /> : "Logout"}
                    </button>
                ) : (
                    <button className="btn btn-primary" onClick={() => navigate("/auth")}>
                        Get Started
                    </button>
                )}
            </div>
        </div>
    );
}
