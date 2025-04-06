import { ApiContext } from "@/contexts/ApiContext";
import { useContext } from "react";

const useApi = () => useContext(ApiContext);

export { useApi };