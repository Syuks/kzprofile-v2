// Dataview with cards for each achievement
// When you click the card, the achievement expands. The achievement icon will be in the top left corner overflowing the card and inside the card there will be the title, description, a 5 step component for the progress of the achievement and underneath a list of checks for the unlocked achievements.
// For example, if an achievement is complete every map from x mapper, there'll be a list of each map but with ????????????????? as their names. If the player completes the map, the map name will be revealed and the check icon highlighted.

import { ReloadIcon } from "@radix-ui/react-icons"

import { useOutletContext } from "react-router-dom"

import { PlayerProfileOutletContext } from ".."

import { achievements, type AchievementData } from "@/lib/achievements"

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
                {achievements.map((achievement) => {
                    return <AchievementCard key={achievement.id} achievement={achievement} />
                })}
            </div>
        </>
    )
}

interface AchievementCardProps {
    achievement: AchievementData
}

function AchievementCard({ achievement }: AchievementCardProps) {
    /*function generateRandomString(minLength: number, maxLength: number) {
        const characters =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{}|;:,.<>?"
        const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength
        let result = ""
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length))
        }
        return result
    }*/

    return (
        <Dialog>
            <DialogTrigger>
                <Card className="flex h-full flex-col justify-between">
                    <CardHeader>
                        <CardTitle>{achievement.title}</CardTitle>
                        <CardDescription>{achievement.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Sticker image={achievement.sticker} progress={3} />
                    </CardContent>
                    <CardFooter>
                        <div className="flex h-2 w-full space-x-2">
                            <div className="h-full flex-1 bg-muted"></div>
                            <div className="h-full flex-1 bg-muted"></div>
                            <div className="h-full flex-1 bg-muted"></div>
                            <div className="h-full flex-1 bg-muted"></div>
                            <div className="h-full flex-1 bg-muted"></div>
                        </div>
                    </CardFooter>
                </Card>
            </DialogTrigger>
            <DialogContent showCloseButton={false}>
                <DialogHeader className="w-4/5">
                    <DialogTitle>{achievement.title}</DialogTitle>
                    <DialogDescription>{achievement.description}</DialogDescription>
                </DialogHeader>
                <div className="absolute -right-24 -top-24">
                    <Sticker image={achievement.sticker} progress={3} />
                </div>
                <div className="max-h-[70vh] overflow-auto py-4 text-center">
                    {achievement.maps?.map((map) => {
                        return <div className="text-lg font-semibold">{map}</div>
                    })}
                </div>
                <div className="flex h-2 w-full space-x-2">
                    <div className="h-full flex-1 bg-muted"></div>
                    <div className="h-full flex-1 bg-muted"></div>
                    <div className="h-full flex-1 bg-muted"></div>
                    <div className="h-full flex-1 bg-muted"></div>
                    <div className="h-full flex-1 bg-muted"></div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default Achievements
