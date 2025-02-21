import { type AchievementProgress } from "./achievements"

import CrackedMask from "@/assets/overlays/Cracked-mask.png"
import ChippedMask from "@/assets/overlays/Chipped-mask.png"
import Sparks from "@/assets/overlays/Sparks-optimize.gif"

interface AchievementStickerProps {
    image: string
    progress: AchievementProgress
}

function Sticker({ image, progress }: AchievementStickerProps) {
    if (progress === 0) {
        return <EmptySticker image={image} />
    }

    if (progress === 1) {
        return <CrackedSticker image={image} />
    }

    if (progress === 2) {
        return <ChippedSticker image={image} />
    }

    if (progress === 3) {
        return <NormalSticker image={image} />
    }

    if (progress === 4) {
        return <ShinySticker image={image} />
    }

    if (progress === 5) {
        return <HoloSticker image={image} />
    }
}

interface StickerProps {
    image: string
}

function EmptySticker({ image }: StickerProps) {
    return (
        <div
            className="relative"
            style={{ WebkitMaskImage: `url(${image})`, WebkitMaskSize: "cover" }}
        >
            <img src={image} alt="sticker" className="h-auto w-full" />
            <div className="absolute inset-0 bg-gradient-radial from-zinc-200 from-20% to-zinc-400 to-70% dark:from-zinc-900 dark:to-zinc-950"></div>
        </div>
    )
}

function CrackedSticker({ image }: StickerProps) {
    return (
        <div>
            <img
                src={image}
                alt="sticker"
                className="h-auto w-full"
                style={{ WebkitMaskImage: `url(${CrackedMask})`, WebkitMaskSize: "cover" }}
            />
        </div>
    )
}

function ChippedSticker({ image }: StickerProps) {
    return (
        <div>
            <img
                src={image}
                alt="sticker"
                className="h-auto w-full"
                style={{ WebkitMaskImage: `url(${ChippedMask})`, WebkitMaskSize: "cover" }}
            />
        </div>
    )
}

function NormalSticker({ image }: StickerProps) {
    return (
        <div>
            <img src={image} alt="sticker" className="h-auto w-full" />
        </div>
    )
}

function ShinySticker({ image }: StickerProps) {
    return (
        <div
            className="relative"
            style={{ WebkitMaskImage: `url(${image})`, WebkitMaskSize: "cover" }}
        >
            <img src={image} alt="sticker" className="h-auto w-full" />
            <div
                className="absolute inset-0 mix-blend-color-dodge"
                style={{ backgroundImage: `url(${Sparks})` }}
            ></div>
        </div>
    )
}

function HoloSticker({ image }: StickerProps) {
    return (
        <div
            className="relative"
            style={{ WebkitMaskImage: `url(${image})`, WebkitMaskSize: "cover" }}
        >
            <img src={image} alt="sticker" className="h-auto w-full" />
            <div
                className="absolute inset-0 mix-blend-color-dodge"
                style={{ backgroundImage: `url(${Sparks})` }}
            ></div>
            <div className="absolute inset-0 animate-holo bg-gradient-to-tl from-cyan-400 from-30% to-pink-500 to-70% bg-[length:300%_300%] opacity-20 mix-blend-color-dodge"></div>
        </div>
    )
}

export default Sticker
