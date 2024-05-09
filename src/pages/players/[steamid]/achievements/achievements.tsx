import { useMemo } from "react"

import { ReloadIcon } from "@radix-ui/react-icons"

import { useOutletContext } from "react-router-dom"

import { generateRandomString } from "@/lib/utils"
import { useRunType } from "@/components/localsettings/localsettings-provider"

import { PlayerProfileOutletContext } from ".."

import {
    tierAchievements,
    mapAchievements,
    type TierAchievementData,
    type MapAchievementData,
} from "@/lib/achievements"

import Sticker from "./sticker"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

export type AchievementProgress = 0 | 1 | 2 | 3 | 4 | 5

function Achievements() {
    const { playerProfileKZDataRefetch, playerProfileKZDataFetching } =
        useOutletContext<PlayerProfileOutletContext>()

    return (
        <>
            <div className="mb-4 flex justify-between">
                <h2 className="scroll-m-20 text-3xl font-bold tracking-tight transition-colors first:mt-0">
                    Achievements
                </h2>

                <Button
                    variant="outline"
                    onClick={() => playerProfileKZDataRefetch()}
                    disabled={playerProfileKZDataFetching}
                >
                    {playerProfileKZDataFetching ? (
                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <ReloadIcon className="mr-2 h-4 w-4" />
                    )}
                    Reload
                </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {tierAchievements.map((achievement) => {
                    return <TierAchievementCard key={achievement.id} achievement={achievement} />
                })}
                {mapAchievements.map((achievement) => {
                    return <MapAchievementCard key={achievement.id} achievement={achievement} />
                })}
            </div>
        </>
    )
}

interface AchievementProgressBarProps {
    progress: AchievementProgress
}

function AchievementProgressBar({ progress }: AchievementProgressBarProps) {
    const renderProgressDivs = () => {
        let divs = []

        for (let i = 0; i < 5; i++) {
            divs.push(
                <div
                    key={i}
                    className={`h-full flex-1 ${i < progress ? "bg-primary" : "bg-muted"}`}
                ></div>,
            )
        }
        return divs
    }

    return <div className="flex h-2 w-full space-x-2">{renderProgressDivs()}</div>
}

interface AchievementCardProps {
    achievement: TierAchievementData | MapAchievementData
    progress: AchievementProgress
}

function AchievementCard({ achievement, progress }: AchievementCardProps) {
    return (
        <Card className="flex h-full flex-col justify-between">
            <CardHeader>
                <CardTitle>{achievement.title}</CardTitle>
                <CardDescription>{achievement.description}</CardDescription>
            </CardHeader>
            <CardContent>
                <Sticker image={achievement.sticker} progress={progress} />
            </CardContent>
            <CardFooter>
                <AchievementProgressBar progress={progress} />
            </CardFooter>
        </Card>
    )
}

interface TierAchievementCardProps {
    achievement: TierAchievementData
}

function TierAchievementCard({ achievement }: TierAchievementCardProps) {
    const [runType] = useRunType()

    const { playerProfileKZData } = useOutletContext<PlayerProfileOutletContext>()

    const progress = useMemo<AchievementProgress>(() => {
        const tierFinishes = playerProfileKZData.finishes[runType].filter((run) =>
            achievement.tiers.includes(run.difficulty),
        )
        const tierUnfinishes = playerProfileKZData.unfinishes[runType].filter((run) =>
            achievement.tiers.includes(run.difficulty),
        )

        const totalRuns = tierFinishes.length + tierUnfinishes.length
        const percentage = (tierFinishes.length / totalRuns) * 100

        if (percentage === 0) return 0
        if (percentage < 25) return 1
        if (percentage < 50) return 2
        if (percentage < 75) return 3
        if (percentage < 100) return 4
        return 5
    }, [achievement, runType, playerProfileKZData])

    return (
        <Dialog>
            <DialogTrigger>
                <AchievementCard achievement={achievement} progress={progress} />
            </DialogTrigger>
            <DialogContent showCloseButton={false}>
                <DialogHeader className="w-4/5">
                    <DialogTitle>{achievement.title}</DialogTitle>
                    <DialogDescription>{achievement.description}</DialogDescription>
                </DialogHeader>
                <div className="absolute -right-24 -top-24">
                    <Sticker image={achievement.sticker} progress={progress} />
                </div>
                <div className="max-h-[70vh] overflow-auto py-4 text-center text-lg font-semibold">
                    {progress >= 1 ? (
                        <div>More than 0%</div>
                    ) : (
                        <div className="text-muted-foreground">{generateRandomString(15, 20)}</div>
                    )}
                    {progress >= 2 ? (
                        <div>25% completed</div>
                    ) : (
                        <div className="text-muted-foreground">{generateRandomString(15, 20)}</div>
                    )}
                    {progress >= 3 ? (
                        <div>50% completed</div>
                    ) : (
                        <div className="text-muted-foreground">{generateRandomString(15, 20)}</div>
                    )}
                    {progress >= 4 ? (
                        <div>75% completed</div>
                    ) : (
                        <div className="text-muted-foreground">{generateRandomString(15, 20)}</div>
                    )}
                    {progress >= 5 ? (
                        <div>100% completed</div>
                    ) : (
                        <div className="text-muted-foreground">{generateRandomString(15, 20)}</div>
                    )}
                </div>
                <AchievementProgressBar progress={progress} />
            </DialogContent>
        </Dialog>
    )
}

interface MapAchievementCardProps {
    achievement: MapAchievementData
}

function MapAchievementCard({ achievement }: MapAchievementCardProps) {
    const [runType] = useRunType()

    const { playerProfileKZData } = useOutletContext<PlayerProfileOutletContext>()

    const mapAchievementData = useMemo<{
        progress: AchievementProgress
        mapStringsArray: JSX.Element[]
    }>(() => {
        let acc = 0

        const mapStringsArray = achievement.maps.map((mapName) => {
            const finishFound = playerProfileKZData.finishes[runType].find(
                (finish) => finish.map_name === mapName,
            )

            if (!!finishFound) {
                acc++
                return <div>{mapName}</div>
            }

            return <div className="text-muted-foreground">{generateRandomString(15, 20)}</div>
        })

        const percentage = (acc / achievement.maps.length) * 100

        const getAchievementProgress = (): AchievementProgress => {
            if (percentage === 0) return 0
            if (percentage < 25) return 1
            if (percentage < 50) return 2
            if (percentage < 75) return 3
            if (percentage < 100) return 4
            return 5
        }

        return {
            progress: getAchievementProgress(),
            mapStringsArray,
        }
    }, [achievement, runType, playerProfileKZData])

    return (
        <Dialog>
            <DialogTrigger>
                <AchievementCard achievement={achievement} progress={mapAchievementData.progress} />
            </DialogTrigger>
            <DialogContent showCloseButton={false}>
                <DialogHeader className="w-4/5">
                    <DialogTitle>{achievement.title}</DialogTitle>
                    <DialogDescription>{achievement.description}</DialogDescription>
                </DialogHeader>
                <div className="absolute -right-24 -top-24">
                    <Sticker image={achievement.sticker} progress={mapAchievementData.progress} />
                </div>
                <div className="max-h-[70vh] overflow-auto py-4 text-center text-lg font-semibold">
                    {mapAchievementData.mapStringsArray.map((map) => {
                        return <div>{map}</div>
                    })}
                </div>
                <AchievementProgressBar progress={mapAchievementData.progress} />
            </DialogContent>
        </Dialog>
    )
}

export default Achievements
