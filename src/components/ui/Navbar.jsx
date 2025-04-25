import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useApi } from "@/hooks/useApi";
import { toast } from '@/lib/toast'
import { useState } from "react";
import RadialLoader from "@/components/ui/RadialLoader";
import { MdLogout } from "react-icons/md";
import { IoSettings } from "react-icons/io5";
import Avatar from "boring-avatars";
import { Link } from "react-router-dom";

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
        <div className="bg-base-100 shadow-sm">
            <div className="navbar max-w-7xl m-auto">
                <div className="flex-1 flex items-end gap-1">
                    <img alt="Logo" src="/logo.svg" className="h-8 w-8" />
                    <a className="text-lg font-semibold text-accent hidden sm:block" href="/">
                        Flamecoders
                    </a>
                </div>
                <div className="flex-none">
                    {isAuthenticated ? (
                        <div className="flex items-center gap-2">
                            <div className="dropdown dropdown-end">
                                <Avatar name={user.email} className="h-10 w-10 border rounded-full cursor-pointer" tabIndex={0} colors={["#000000", "#9500ff", "#ff005b", "#7e36ba", "#00b5c2"]} />
                                <div tabIndex={0} className="dropdown-content menu bg-base-100 border rounded-box z-1 w-52 shadow-md mt-1">
                                    <div className="p-1 pb-2">
                                        <h2 className="font-bold text-sm">{user.name}</h2>
                                        <h3 className="text-xs opacity-60">{user.email}</h3>
                                    </div>
                                    <ul className="flex flex-col gap-1 mt-2 font-semibold text-base-content/70">
                                        <li>
                                            <Link to="/settings">
                                                <IoSettings /> Settings
                                            </Link>
                                        </li>
                                        <li>
                                            <button className="btn btn-error" onClick={handleLogout}>
                                                {loggingOut ? <RadialLoader /> : (
                                                    <>
                                                        <MdLogout /> Logout
                                                    </>
                                                )}
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <button className="btn btn-primary" onClick={() => navigate("/login")}>
                            Get Started
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
