import z from "zod"

// RUN TYPES

export type RunType = "pro" | "nub" | "tp"
export const runTypeSchema = z.enum(["pro", "nub", "tp"])

// GAME MODES

export type GameModeLabel = "kz_timer" | "kz_simple" | "kz_vanilla"
export const gameModeLabelSchema = z.enum(["kz_timer", "kz_simple", "kz_vanilla"])
export type GameModeID = 200 | 201 | 202
export type GameMode = GameModeLabel | GameModeID

export const getGameModeID = (gameMode: GameMode): GameModeID => {
    const gameModeID: Record<GameMode, GameModeID> = {
        kz_timer: 200,
        kz_simple: 201,
        kz_vanilla: 202,
        200: 200,
        201: 201,
        202: 202,
    }

    return gameModeID[gameMode]
}

export const getGameModeName = (gameMode: GameMode): GameModeLabel => {
    const gameModeName: Record<GameMode, GameModeLabel> = {
        200: "kz_timer",
        201: "kz_simple",
        202: "kz_vanilla",
        kz_timer: "kz_timer",
        kz_simple: "kz_simple",
        kz_vanilla: "kz_vanilla",
    }

    return gameModeName[gameMode]
}

// TIERS

export type TierID = 1 | 2 | 3 | 4 | 5 | 6 | 7
export type TierLabel = "Very Easy" | "Easy" | "Medium" | "Hard" | "Very Hard" | "Extreme" | "Death"

export const tiers: TierID[] = [1, 2, 3, 4, 5, 6, 7]
export const tierLabels: TierLabel[] = [
    "Very Easy",
    "Easy",
    "Medium",
    "Hard",
    "Very Hard",
    "Extreme",
    "Death",
]

const tierData: { label: TierLabel; color: string; backgroundColor: string }[] = [
    { label: "Very Easy", color: "text-csgo-green", backgroundColor: "bg-csgo-green" },
    { label: "Easy", color: "text-csgo-lime", backgroundColor: "bg-csgo-lime" },
    { label: "Medium", color: "text-csgo-yellow", backgroundColor: "bg-csgo-yellow" },
    { label: "Hard", color: "text-csgo-gold", backgroundColor: "bg-csgo-gold" },
    { label: "Very Hard", color: "text-csgo-red", backgroundColor: "bg-csgo-red" },
    { label: "Extreme", color: "text-csgo-darkred", backgroundColor: "bg-csgo-darkred" },
    { label: "Death", color: "text-csgo-orchid", backgroundColor: "bg-csgo-orchid" },
]

export const getTierData = (tier: TierID) => {
    return tierData[tier - 1]
}

// JUMPSTATS

const jumptypeNameByID = {
    1: "longjump",
    2: "bhop",
    3: "multibhop",
    4: "weirdjump",
    5: "dropbhop",
    6: "countjump",
    7: "ladderjump",
}

const maxDistance = {
    1: 294,
    2: 350,
    3: 365,
    4: 210,
    5: 308,
    6: 350,
    7: 315,
}

const bindUnits = {
    1: [0, 265, 270, 275, 285, 288, 291],
    2: [0, 320, 325, 330, 342, 344, 348],
    3: [0, 340, 345, 350, 358, 360, 363],
    4: [0, 280, 285, 290, 300, 302, 306],
    5: [0, 315, 320, 325, 340, 342, 348],
    6: [0, 285, 290, 295, 305, 307, 313],
    7: [0, 155, 165, 175, 193, 200, 208],
}

const unbindUnits = {
    1: [0, 265, 270, 275, 282, 284, 287],
    2: [0, 320, 325, 330, 340, 342, 344],
    3: [0, 340, 345, 350, 355, 357, 358],
    4: [0, 280, 285, 290, 298, 300, 302],
    5: [0, 315, 320, 325, 340, 342, 348],
    6: [0, 285, 290, 295, 305, 307, 313],
    7: [0, 155, 165, 175, 193, 200, 208],
}

const jumpstatClass = ["meh", "perfect", "impressive", "godlike", "ownage", "wrecker", "rgb-effect"]

type JumpstatID = 1 | 2 | 3 | 4 | 5 | 6 | 7

export const getJumpstatMaxDistance = (jumptype: JumpstatID) => {
    return maxDistance[jumptype]
}

export const getJumpstatClass = (jumptype: JumpstatID, bind: boolean, units: number) => {
    const jump_thresholds = bind ? bindUnits[jumptype] : unbindUnits[jumptype]

    for (let i = jumpstatClass.length - 1; i >= 0; i--) {
        if (units >= jump_thresholds[i]) {
            return jumpstatClass[i]
        }
    }
}

export const getJumpstatLabel = (jumptype: JumpstatID, bind: boolean, units: number) => {
    const jump_thresholds = bind ? bindUnits[jumptype] : unbindUnits[jumptype]

    for (let i = jumpstatClass.length - 1; i >= 0; i--) {
        if (units >= jump_thresholds[i]) {
            if (jumpstatClass[i] === "rgb-effect") {
                return `${jump_thresholds[i]} CLUB`
            }
            return jumpstatClass[i]
        }
    }
}

export const getJumptypeNameByID = (jumptype: JumpstatID) => {
    return jumptypeNameByID[jumptype]
}

export const jumptypeDropdownItems = [
    { label: "Longjump", value: "longjump" },
    { label: "Bhop", value: "bhop" },
    { label: "Multibhop", value: "multibhop" },
    { label: "Ladderjump", value: "ladderjump" },
    { label: "Weirdjump", value: "weirdjump" },
    { label: "Dropbhop", value: "dropbhop" },
    { label: "Countjump", value: "countjump" },
]

// RANKS

const rankThresholds: Record<GameModeID, number[]> = {
    200: [
        0, 1, 500, 1000, 2000, 5000, 10000, 20000, 30000, 40000, 60000, 70000, 80000, 100000,
        120000, 150000, 200000, 230000, 250000, 400000, 600000, 800000, 1000000,
    ],
    201: [
        0, 1, 500, 1000, 2000, 5000, 10000, 20000, 30000, 40000, 60000, 70000, 80000, 100000,
        120000, 150000, 200000, 230000, 250000, 300000, 400000, 500000, 800000,
    ],
    202: [
        0, 1, 500, 1000, 2000, 5000, 10000, 20000, 30000, 40000, 60000, 70000, 80000, 100000,
        120000, 140000, 160000, 180000, 200000, 250000, 300000, 400000, 600000,
    ],
}

const rankData = [
    {
        label: "New",
        color: "text-csgo-grey",
        backgroundColor: "bg-csgo-grey",
        border: "border-csgo-grey",
    },
    {
        label: "Beginner-",
        color: "text-csgo-default",
        backgroundColor: "bg-csgo-default",
        border: "border-csgo-default",
    },
    {
        label: "Beginner",
        color: "text-csgo-default",
        backgroundColor: "bg-csgo-default",
        border: "border-csgo-default",
    },
    {
        label: "Beginner+",
        color: "text-csgo-default",
        backgroundColor: "bg-csgo-default",
        border: "border-csgo-default",
    },
    {
        label: "Amateur-",
        color: "text-csgo-blue",
        backgroundColor: "bg-csgo-blue",
        border: "border-csgo-blue",
    },
    {
        label: "Amateur",
        color: "text-csgo-blue",
        backgroundColor: "bg-csgo-blue",
        border: "border-csgo-blue",
    },
    {
        label: "Amateur+",
        color: "text-csgo-blue",
        backgroundColor: "bg-csgo-blue",
        border: "border-csgo-blue",
    },
    {
        label: "Casual-",
        color: "text-csgo-lightgreen",
        backgroundColor: "bg-csgo-lightgreen",
        border: "border-csgo-lightgreen",
    },
    {
        label: "Casual",
        color: "text-csgo-lightgreen",
        backgroundColor: "bg-csgo-lightgreen",
        border: "border-csgo-lightgreen",
    },
    {
        label: "Casual+",
        color: "text-csgo-lightgreen",
        backgroundColor: "bg-csgo-lightgreen",
        border: "border-csgo-lightgreen",
    },
    {
        label: "Regular-",
        color: "text-csgo-green",
        backgroundColor: "bg-csgo-green",
        border: "border-csgo-green",
    },
    {
        label: "Regular",
        color: "text-csgo-green",
        backgroundColor: "bg-csgo-green",
        border: "border-csgo-green",
    },
    {
        label: "Regular+",
        color: "text-csgo-green",
        backgroundColor: "bg-csgo-green",
        border: "border-csgo-green",
    },
    {
        label: "Skilled-",
        color: "text-csgo-purple",
        backgroundColor: "bg-csgo-purple",
        border: "border-csgo-purple",
    },
    {
        label: "Skilled",
        color: "text-csgo-purple",
        backgroundColor: "bg-csgo-purple",
        border: "border-csgo-purple",
    },
    {
        label: "Skilled+",
        color: "text-csgo-purple",
        backgroundColor: "bg-csgo-purple",
        border: "border-csgo-purple",
    },
    {
        label: "Expert-",
        color: "text-csgo-orchid",
        backgroundColor: "bg-csgo-orchid",
        border: "border-csgo-orchid",
    },
    {
        label: "Expert",
        color: "text-csgo-orchid",
        backgroundColor: "bg-csgo-orchid",
        border: "border-csgo-orchid",
    },
    {
        label: "Expert+",
        color: "text-csgo-orchid",
        backgroundColor: "bg-csgo-orchid",
        border: "border-csgo-orchid",
    },
    {
        label: "Semipro",
        color: "text-csgo-lightred",
        backgroundColor: "bg-csgo-lightred",
        border: "border-csgo-lightred",
    },
    {
        label: "Pro",
        color: "text-csgo-lightred",
        backgroundColor: "bg-csgo-lightred",
        border: "border-csgo-lightred",
    },
    {
        label: "Master",
        color: "text-csgo-red",
        backgroundColor: "bg-csgo-red",
        border: "border-csgo-red",
    },
    {
        label: "Legend",
        color: "text-csgo-gold",
        backgroundColor: "bg-csgo-gold",
        border: "border-csgo-gold",
    },
]

const rankCount = rankData.length

export type KZRank = {
    label: string
    prevThreshold: number
    nextThreshold: number
    points: number
    percent: number
    color: string
    backgroundColor: string
    border: string
}

export const getKZRank = (gameMode: GameModeID, points: number): KZRank => {
    const thresholds = rankThresholds[gameMode]

    for (let i = rankCount - 1; i >= 0; i--) {
        if (points >= thresholds[i]) {
            const prevThreshold = thresholds[i]
            const nextThreshold = thresholds[i + 1] ?? prevThreshold
            const percent =
                nextThreshold !== prevThreshold
                    ? (points - prevThreshold) / (nextThreshold - prevThreshold)
                    : 1

            return {
                label: rankData[i].label,
                prevThreshold,
                nextThreshold,
                points,
                percent,
                color: rankData[i].color,
                backgroundColor: rankData[i].backgroundColor,
                border: rankData[i].border,
            }
        }
    }

    // Return a default rank if points are below the minimum threshold
    return {
        label: rankData[0].label,
        prevThreshold: 0,
        nextThreshold: thresholds[0],
        points,
        percent: 0,
        color: rankData[0].color,
        backgroundColor: rankData[0].backgroundColor,
        border: rankData[0].border,
    }
}

// ROLES

const roles = [
    {
        id: 1,
        label: "GLOBAL TEAM",
        color: "var(--discord-green)",
    },
    {
        id: 2,
        label: "APPROVAL TEAM",
        color: "var(--discord-yellow)",
    },
    {
        id: 3,
        label: "MAPPER",
        color: "var(--discord-blue)",
    },
    {
        id: 4,
        label: "SERVER OWNER",
        color: "var(--discord-coral)",
    },
    {
        id: 99,
        label: "KZ PROFILE",
        color: "var(--discord-purple)",
    },
]

export const getRoleByID = (roleID: number) => {
    for (let i = 0; i < roles.length; i++) {
        if (roles[i].id === roleID) {
            return roles[i]
        }
    }
    return null
}

export const getDownloadMapLink = (mapName: string) => {
    return `https://maps.cawkz.net/bsps/${mapName}.bsp`
}

export function getMapImageURL(
    mapName: string,
    imageFormat: "jpg" | "webp",
    imageSize: "full" | "medium" | "small",
) {
    const imagePath = {
        jpg: {
            full: "images",
            medium: "mediums",
            small: "thumbnails",
        },
        webp: {
            full: "webp",
            medium: "webp/medium",
            small: "webp/thumb",
        },
    }

    return `https://raw.githubusercontent.com/KZGlobalTeam/map-images/public/${imagePath[imageFormat][imageSize]}/${mapName}.${imageFormat}`
}
