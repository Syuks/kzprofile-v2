import useGlobalMaps from "@/hooks/TanStackQueries/useGlobalMaps"

function PlayerProfile() {
    const maps = useGlobalMaps()

    if (maps.isLoading) {
        return <div>Loading...</div>
    }

    if (maps.isError) {
        return <div>Error!</div>
    }

    return <div>{JSON.stringify(maps.data)}</div>
}

export default PlayerProfile
