import { useApi } from "@/hooks/useApi";
import { useEffect } from "react";

function Home() {
  const api = useApi();

  useEffect(() => {
    const fetchApi = async () => {
      const resp = await api.get("/..");
      console.log(resp)
    }
    fetchApi();
  }, [api]);

  return (
    <>
      <ul>
        <li>post 1</li>
        <li>post 1</li>
        <li>post 1</li>
        <li>post 1</li>
      </ul>
    </>
  );
}

export default Home;
