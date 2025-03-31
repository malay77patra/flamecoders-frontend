import Branding from "./Branding";
import ThemeToggle from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import {
    AlignJustify,
    Github,
    BookOpen,
    MessageSquareText
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function Navbar() {
    const navigate = useNavigate();
    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/10 backdrop-blur-sm">
            <div className="px-4 py-3 max-w-7xl m-auto flex items-center gap-1">
                <Branding />
                <div className="flex-1"></div>
                <Button className="hidden sm:block" onClick={() => navigate("/auth")}>Get Started</Button>
                <ThemeToggle />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="sm:hidden">
                            <AlignJustify />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-72" align="end">
                        <DropdownMenuGroup>
                            <Link to="/about">
                                <DropdownMenuItem className="cursor-pointer">
                                    <BookOpen />
                                    <span>About Us</span>
                                </DropdownMenuItem>
                            </Link>
                            <Link to="https://discord.com">
                                <DropdownMenuItem className="cursor-pointer">
                                    <MessageSquareText />
                                    <span>Discord Server</span>
                                </DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem className="cursor-pointer">
                                <Github />
                                <span>Github</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Button onClick={() => navigate("/auth")} className="w-full">Get Started</Button>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </nav>
    );
}

export default Navbar;