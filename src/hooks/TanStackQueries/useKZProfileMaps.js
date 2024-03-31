import { useQuery } from "@tanstack/react-query"
import axios from "axios"

const getKZProfileMaps = async () => {
    const { data } = await axios.get("https://kzprofile-maps.nicoquattrochi.workers.dev")
    return data
}

const useKZProfileMaps = (queryOptions = {}) => {
    // Maps should be fetched once for the whole session
    return useQuery(
        ["maps", "kzProfileMaps"],
        getKZProfileMaps,
        {
            ...queryOptions,
            staleTime: Infinity,  // never refetch
            cacheTime: Infinity   // never delete cache
        }
    )
}

export default useKZProfileMaps