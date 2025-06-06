import { useSearchParams } from "react-router-dom"
import Overview from "@/pages/Dashboard/pages/Overview"
import Posts from "@/pages/Dashboard/pages/Posts"

export default function Dashboard() {
    const [searchParams] = useSearchParams()
    const tab = searchParams.get('tab')

    if (tab === "posts") return <Posts />
    else return <Overview />
}
