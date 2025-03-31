import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";


function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <Button size="icon" variant="outline" onClick={toggleTheme}>
            <div className="theme-toggle">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className={theme === "dark" ? "active" : ""}>
                    <clipPath id="theme-toggle-clip">
                        <path d="M0-11h25a1 1 0 0017 13v30H0Z" />
                    </clipPath>
                    <g clipPath="url(#theme-toggle-clip)">
                        <circle cx="16" cy="16" r="8.4" className="crkl" fill="currentColor" />
                        <path className="rays"
                            d="M18.3 3.2c0 1.3-1 2.3-2.3 2.3s-2.3-1-2.3-2.3S14.7.9 16 .9s2.3 1 2.3 2.3m-4.6 25.6c0-1.3 1-2.3 2.3-2.3s2.3 1 2.3 2.3-1 2.3-2.3 2.3-2.3-1-2.3-2.3m15.1-10.5c-1.3 0-2.3-1-2.3-2.3s1-2.3 2.3-2.3 2.3 1 2.3 2.3-1 2.3-2.3 2.3M3.2 13.7c1.3 0 2.3 1 2.3 2.3s-1 2.3-2.3 2.3S.9 17.3.9 16s1-2.3 2.3-2.3m5.8-7C9 7.9 7.9 9 6.7 9S4.4 8 4.4 6.7s1-2.3 2.3-2.3S9 5.4 9 6.7m16.3 21c-1.3 0-2.3-1-2.3-2.3s1-2.3 2.3-2.3 2.3 1 2.3 2.3-1 2.3-2.3 2.3m2.4-21c0 1.3-1 2.3-2.3 2.3S23 7.9 23 6.7s1-2.3 2.3-2.3 2.4 1 2.4 2.3M6.7 23C8 23 9 24 9 25.3s-1 2.3-2.3 2.3-2.3-1-2.3-2.3 1-2.3 2.3-2.3" fill="currentColor" />
                    </g>
                </svg>
            </div>
        </Button>
    );
}

export default ThemeToggle;
