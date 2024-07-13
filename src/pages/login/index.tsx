import { useMemo } from "react"

import { Link } from "react-router-dom"

import { getMapImageURL } from "@/lib/gokz"
import useKZProfileMaps from "@/hooks/TanStackQueries/useKZProfileMaps"

import LoginForm from "./form"

import { Toaster } from "@/components/ui/sonner"

function Login() {
    const kzProfileMapsQuery = useKZProfileMaps()

    const mapImageURL = useMemo(() => {
        if (!kzProfileMapsQuery.data) {
            return ""
        }

        const randomIndex = Math.floor(Math.random() * kzProfileMapsQuery.data.length)

        return getMapImageURL(kzProfileMapsQuery.data[randomIndex].name, "jpg", "full")
    }, [kzProfileMapsQuery.data])

    return (
        <>
            <div className="relative flex h-screen items-center">
                <div
                    className="relative hidden h-full flex-1 flex-col bg-muted bg-center p-10 text-white dark:border-r lg:flex"
                    style={{ backgroundImage: `url(${mapImageURL})` }}
                >
                    <Link to="/" className="flex items-center space-x-2 text-lg font-medium">
                        <img src="/favicon-32x32.png" className="mr-1 h-5 w-5" />
                        <span className="hidden font-bold sm:inline-block">KZ Profile</span>
                    </Link>
                </div>
                <div className="flex-1 p-8">
                    <LoginForm />
                </div>
            </div>
            <Toaster />
        </>
    )
}

export default Login
