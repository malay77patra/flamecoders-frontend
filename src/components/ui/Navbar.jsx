import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { useApi } from "@/hooks/useApi"
import toast from "react-hot-toast"
import { useState } from "react"
import { MdLogout } from "react-icons/md"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuItem,
    DropdownMenuGroup,
} from "@/components/ui/Dropdown"
import { SidebarTrigger } from "@/components/ui/Sidebar"
import { FaFire } from "react-icons/fa6"

export default function Navbar() {
    const [loggingOut, setLoggingOut] = useState(false);
    const navigate = useNavigate();
    const { isAuthenticated, user, setUser, authToken, setAuthToken } = useAuth();
    const api = useApi()

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
        <div className="bg-base-100">
            <div className="navbar m-auto gap-2 md:p-4 border-b border-base-content/20">
                <SidebarTrigger />
                <div className="flex-1 flex items-center gap-1">
                    <Link className="flex items-center justify-center gap-1 text-accent" to="/">
                        <FaFire size="20" />
                    </Link>
                </div>
                <div className="flex-none">
                    {isAuthenticated ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger className="outline-none">
                                <div className="avatar ring-2 ring-accent rounded-full cursor-pointer">
                                    <div className="size-10 rounded-full">
                                        <img src={user.avatar} />
                                    </div>
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-52">
                                <DropdownMenuLabel>
                                    <h2>{user.name}</h2>
                                    <p className="text-xs text-base-content/60">{user.email}</p>
                                </DropdownMenuLabel>
                                <div className="my-2"></div>
                                <DropdownMenuGroup>
                                    <DropdownMenuItem onClick={() => navigate("/settings")}>
                                        <span>Account Settings</span>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                                    {loggingOut ? <span className="loading loading-spinner"></span> : (
                                        <>
                                            <MdLogout /> Logout
                                        </>
                                    )}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
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
