import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useApi } from "@/hooks/useApi";
import { toast } from '@/lib/toast'
import { useState } from "react";
import RadialLoader from "@/components/ui/RadialLoader";
import { MdLogout } from "react-icons/md";
import Avatar from "boring-avatars";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownFooter,
} from "@/components/ui/Dropdown"

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
                        <DropdownMenu>
                            <DropdownMenuTrigger className="outline-none">
                                <Avatar name={user.email} className="h-10 w-10 border rounded-full cursor-pointer" tabIndex={0} colors={["#000000", "#9500ff", "#ff005b", "#7e36ba", "#00b5c2"]} />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>
                                    <h2>{user.name}</h2>
                                    <p className="text-xs text-base-content/60">{user.email}</p>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => { navigate("/") }}
                                >Home</DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => { navigate("/settings") }}
                                >Settings</DropdownMenuItem>
                                <DropdownFooter>
                                    <button className="btn btn-error w-full" onClick={handleLogout}>
                                        {loggingOut ? <RadialLoader /> : (
                                            <>
                                                <MdLogout /> Logout
                                            </>
                                        )}
                                    </button>
                                </DropdownFooter>
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
