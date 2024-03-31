// GAME MODES

type GameModeLabel = "kz_timer" | "kz_simple" | "kz_vanilla"
type GameModeID = 200 | 201 | 202
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

export const tiers = [1, 2, 3, 4, 5, 6, 7]
export const tierLabels = ["Very Easy", "Easy", "Medium", "Hard", "Very Hard", "Extreme", "Death"]

const tierName = {
    1: "Very Easy",
    2: "Easy",
    3: "Medium",
    4: "Hard",
    5: "Very Hard",
    6: "Extreme",
    7: "Death",
}

const tierClass = {
    1: "Very-Easy",
    2: "Easy",
    3: "Medium",
    4: "Hard",
    5: "Very-Hard",
    6: "Extreme",
    7: "Death",
}

const tierColor = {
    1: "var(--csgo-green)",
    2: "var(--csgo-lime)",
    3: "var(--csgo-yellow)",
    4: "var(--csgo-gold)",
    5: "var(--csgo-red)",
    6: "var(--csgo-darkred)",
    7: "var(--csgo-orchid)",
}

const tierColorBackground = {
    1: "#1b411b4D",
    2: "#2f411d4D",
    3: "#3e3c274D",
    4: "#3c311a4D",
    5: "#411b1b4D",
    6: "#410e0e4D",
    7: "#38173c4D",
}

type TierID = 1 | 2 | 3 | 4 | 5 | 6 | 7

export const getTierName = (tierID: TierID) => {
    return tierName[tierID]
}

export const getTierClass = (tierID: TierID) => {
    return tierClass[tierID]
}

export const getTierColor = (tierID: TierID) => {
    return tierColor[tierID]
}

export const getTierColorBackground = (tierID: TierID) => {
    return tierColorBackground[tierID]
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

const rankCount = 23

const rankThreshold = {
    200: [
        0, 1, 500, 1000,

        2000, 5000, 10000,

        20000, 30000, 40000,

        60000, 70000, 80000,

        100000, 120000, 150000,

        200000, 230000, 250000,

        400000, 600000, 800000, 1000000,
    ],
    201: [
        0, 1, 500, 1000,

        2000, 5000, 10000,

        20000, 30000, 40000,

        60000, 70000, 80000,

        100000, 120000, 150000,

        200000, 230000, 250000,

        300000, 400000, 500000, 800000,
    ],
    202: [
        0, 1, 500, 1000,

        2000, 5000, 10000,

        20000, 30000, 40000,

        60000, 70000, 80000,

        100000, 120000, 140000,

        160000, 180000, 200000,

        250000, 300000, 400000, 600000,
    ],
}

const rankName = [
    "New",
    "Beginner-",
    "Beginner",
    "Beginner+",
    "Amateur-",
    "Amateur",
    "Amateur+",
    "Casual-",
    "Casual",
    "Casual+",
    "Regular-",
    "Regular",
    "Regular+",
    "Skilled-",
    "Skilled",
    "Skilled+",
    "Expert-",
    "Expert",
    "Expert+",
    "Semipro",
    "Pro",
    "Master",
    "Legend",
]

const rankColor = [
    "var(--csgo-grey)",
    "var(--csgo-default)",
    "var(--csgo-default)",
    "var(--csgo-default)",
    "var(--csgo-blue)",
    "var(--csgo-blue)",
    "var(--csgo-blue)",
    "var(--csgo-lightgreen)",
    "var(--csgo-lightgreen)",
    "var(--csgo-lightgreen)",
    "var(--csgo-green)",
    "var(--csgo-green)",
    "var(--csgo-green)",
    "var(--csgo-purple)",
    "var(--csgo-purple)",
    "var(--csgo-purple)",
    "var(--csgo-orchid)",
    "var(--csgo-orchid)",
    "var(--csgo-orchid)",
    "var(--csgo-lightred)",
    "var(--csgo-lightred)",
    "var(--csgo-red)",
    "var(--csgo-gold)",
]

export const getRank = (gameMode: GameModeID, points: number) => {
    const gameMode_thresholds = rankThreshold[getGameModeID(gameMode)]

    for (let i = rankCount - 1; i >= 0; i--) {
        if (points >= gameMode_thresholds[i]) {
            const prev_threshold = gameMode_thresholds[i]
            const next_threshold = gameMode_thresholds[i + 1] ?? prev_threshold
            const percent =
                next_threshold !== prev_threshold
                    ? (points - prev_threshold) / (next_threshold - prev_threshold)
                    : 1
            return {
                label: rankName[i],
                prevThreshold: prev_threshold,
                nextThreshold: next_threshold,
                points: points,
                percent: percent,
                color: rankColor[i],
            }
        }
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
