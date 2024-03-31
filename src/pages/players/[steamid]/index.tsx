import { useParams } from "react-router-dom"

function PlayerProfile() {
    const { steamid } = useParams() as { steamid: string }

    return <div>{steamid}</div>
}

export default PlayerProfile
