import useSteamProfiles from "@/hooks/TanStackQueries/useSteamProfiles"

function PlayerProfile() {
    const steamProfile = useSteamProfiles(["76561198267993933"])

    if (steamProfile.isLoading) {
        return <div>Loading...</div>
    }

    if (steamProfile.isError) {
        return <div>Error!</div>
    }

    return <div>{JSON.stringify(steamProfile.data)}</div>
}

export default PlayerProfile
