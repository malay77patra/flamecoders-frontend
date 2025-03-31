import LogoSVG from "./LogoSVG";
import { Link } from "react-router-dom";

function Branding() {
    return (
        <Link to="/" className="items-center justify-center gap-1 inline-flex">
            <LogoSVG className="h-8 w-8" />
            <div>
                <h1 className="self-center text-primary text-2xl font-semibold hidden sm:block">flamecoders</h1>
            </div>
        </Link>
    );
}

export default Branding;
