import { useAuth } from "@/hooks/useAuth";
import { useApi } from "@/hooks/useApi";
import Branding from "./Branding";
import ThemeToggle from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
    AlignJustify,
    Github,
    BookOpen,
    MessageSquareText,
    Linkedin
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import toast from "react-hot-toast";

function Navbar() {
    const { authToken, isAuthenticated, setUser, setAuthToken } = useAuth();
    const api = useApi();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        const { data, error } = await api.post(`${import.meta.env.VITE_SERVER_URL}/api/user/logout`, {}, {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        });

        if (error) {
            toast.error(error.message);
        } else {
            setUser({});
            setAuthToken("");
            toast.success("Logged out.");
        }
    }

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/10 backdrop-blur-sm">
            <div className="px-4 py-3 max-w-7xl m-auto flex items-center gap-1">
                <Branding />
                <div className="flex-1"></div>
                {(!isAuthenticated && (location.pathname != "/auth")) && (
                    <Button className="hidden sm:block" onClick={() => navigate("/auth")}>Get Started</Button>
                )}
                {isAuthenticated && (
                    <Button className="hidden sm:block" onClick={() => handleLogout()}>Logout</Button>
                )}
                <ThemeToggle />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="sm:hidden">
                            <AlignJustify />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-64 py-2" align="end">
                        <DropdownMenuGroup>
                            <Link to="/about">
                                <DropdownMenuItem className="cursor-pointer">
                                    <BookOpen />
                                    <span>About Flamecoders</span>
                                </DropdownMenuItem>
                            </Link>
                            <Link to="https://discord.gg/2kVMzeASj9">
                                <DropdownMenuItem className="cursor-pointer">
                                    <MessageSquareText />
                                    <span>Discord Server</span>
                                </DropdownMenuItem>
                            </Link>
                            <Link to="https://github.com/malay77patra">
                                <DropdownMenuItem className="cursor-pointer">
                                    <Github />
                                    <span>Github</span>
                                </DropdownMenuItem>
                            </Link>
                            <Link to="https://www.linkedin.com/in/malaypatra/">
                                <DropdownMenuItem className="cursor-pointer">
                                    <Linkedin />
                                    <span>Linkedin</span>
                                </DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem>
                                {(!isAuthenticated && (location.pathname != "/auth")) && (
                                    <Button className="w-full" onClick={() => navigate("/auth")}>Get Started</Button>
                                )}
                                {isAuthenticated && (
                                    <Button className="w-full" onClick={() => handleLogout()}>Logout</Button>
                                )}
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </nav>
    );
}

export default Navbar;