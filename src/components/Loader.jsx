import { LoaderCircle } from "lucide-react";

function Loader({ className = "", ...props }) {
    const updatedClassName = className.includes("animate-spin")
        ? className
        : `${className} animate-spin`.trim();

    return <LoaderCircle className={updatedClassName} {...props} />;
}

export default Loader;
