import { useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { useApi } from "@/hooks/useApi"
import toast from "react-hot-toast"
import { useState } from "react"
import RadialLoader from "@/components/ui/RadialLoader"
import { MdLogout } from "react-icons/md"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownFooter,
} from "@/components/ui/Dropdown"
import { SidebarTrigger } from "@/components/ui/Sidebar"

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
            <div className="navbar m-auto gap-2">
                <SidebarTrigger />
                <div className="flex-1 flex items-center gap-1">
                    <a className="flex items-center justify-center gap-1" href="/">
                        <img alt="Logo" src="/logo.svg" className="h-8 w-8" />
                        <h1 className="text-lg font-semibold text-accent hidden sm:block">Flamecoders</h1>
                    </a>
                </div>
                <div className="flex-none">
                    {isAuthenticated ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger className="outline-none">
                                <div className="avatar border rounded-full cursor-pointer">
                                    <div className="size-10 rounded-full">
                                        <img src={user.avatar} />
                                    </div>
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>
                                    <h2>{user.name}</h2>
                                    <p className="text-xs text-base-content/60">{user.email}</p>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
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
