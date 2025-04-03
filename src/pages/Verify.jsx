import { useSearchParams } from "react-router-dom";
import Loader from "@/components/Loader";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "@/hooks/useApi";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
          }, {
            skipAuthRefresh: true
          });

          if (error) {
            setMessage(error.message);
          } else {
            setMessage("Verification successful 🎉.");
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
    <>
      {loading ? (
        <div className="pt-[30vh] flex items-center justify-center">
          <Loader className="h-12 w-12" />
        </div>
      ) : (
        <div className="flex items-center justify-center pt-16">
          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle>Verification Status</CardTitle>
              <CardDescription>{message}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => navigate("/auth")}>Login</Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
}

export default Verify;
