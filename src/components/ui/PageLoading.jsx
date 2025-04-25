import RadialLoader from "@/components/ui/RadialLoader"

export default function PageLoading() {

    return (
        <div className="absolute -translate-x-2/4 -translate-y-2/4 left-2/4 top-2/4">
            <RadialLoader size="2rem" />
        </div>
    )
}