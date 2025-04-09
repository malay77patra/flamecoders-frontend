import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "@/hooks/useApi";
import RLoader from "@/components/RLoader";

function Verify() {
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const api = useApi();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    useEffect(() => {
        const verifyToken = async () => {
            setLoading(true);
            try {
                if (!token) {
                    setMessage("Invalid verification link.");
                } else {
                    const { data, error } = await api.post("/api/magic/verify", {
                        token: token,
                    });

                    if (error) {
                        setMessage(error.message);
                    } else {
                        setMessage("Your email is verified 🎉. You can close the window.");
                    }
                }
            } catch (err) {
                console.log(err);
                toast.error("Something went wrong. Try again later.");
            } finally {
                setLoading(false);
            }
        };

        verifyToken();
    }, [token, api]);

    return (
        <div className="flex pt-20 justify-center">
            {loading ? (
                <RLoader size="3rem" />
            ) : (
                <div className="card bg-base-300 w-96 card-lg shadow-md">
                    <div className="card-body">
                        <h2 className="card-title">Email Verification</h2>
                        <p>{message}</p>
                        <div className="justify-end card-actions">
                            <button className="btn btn-primary" onClick={() => navigate("/auth")} >Login</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Verify;
