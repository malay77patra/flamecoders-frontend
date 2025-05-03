import { Link, useNavigate } from "react-router-dom"
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
    DropdownMenuItem,
    DropdownMenuGroup,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuPortal,
    DropdownMenuSubContent
} from "@/components/ui/Dropdown"
import { SidebarTrigger } from "@/components/ui/Sidebar"
import { useTheme } from "@/hooks/useTheme"

export default function Navbar() {
    const [loggingOut, setLoggingOut] = useState(false);
    const navigate = useNavigate();
    const { isAuthenticated, user, setUser, authToken, setAuthToken } = useAuth();
    const api = useApi()
    const { setTheme } = useTheme()

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
                    <Link className="flex items-center justify-center gap-1" to="/">
                        <img alt="Logo" src="/logo.svg" className="size-12" />
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
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem onClick={() => navigate("/settings")}>Account Settings</DropdownMenuItem>
                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger>
                                            <span>Themes</span>
                                        </DropdownMenuSubTrigger>
                                        <DropdownMenuPortal>
                                            <DropdownMenuSubContent>
                                                <DropdownMenuItem onClick={() => setTheme("light")}>
                                                    <span>Light</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => setTheme("dark")}>
                                                    <span>Dark</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => setTheme("dracula")}>
                                                    <span>Dracula</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuSubContent>
                                        </DropdownMenuPortal>
                                    </DropdownMenuSub>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                                    {loggingOut ? <RadialLoader /> : (
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
