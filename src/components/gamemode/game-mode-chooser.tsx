import type { GameModeLabel, RunType } from "@/lib/gokz"

import {
    useLocalSettings,
    useGameMode,
    useRunType,
} from "@/components/localsettings/localsettings-provider"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

function ModeChooser() {
    const [localSettings] = useLocalSettings()
    const [gameMode, setGameMode] = useGameMode()
    const [runType, setRunType] = useRunType()

    return (
        <div className="flex h-16 items-center justify-center">
            <RadioGroup value={gameMode} onValueChange={setGameMode} className="flex">
                <CustomRadioGroupItem value="kz_timer" label="KZ Timer" id="r_kz_timer" />
                <CustomRadioGroupItem value="kz_simple" label="KZ Simple" id="r_kz_simple" />
                <CustomRadioGroupItem value="kz_vanilla" label="KZ Vanilla" id="r_kz_vanilla" />
            </RadioGroup>

            <div className="mx-2 h-5 w-[2px] bg-foreground sm:mx-4"></div>

            <RadioGroup value={runType} onValueChange={setRunType} className="flex">
                <CustomRadioGroupItem value="pro" label="Pro" id="r_pro" />
                {localSettings.modeChooserType === "pro-tp" && (
                    <CustomRadioGroupItem value="tp" label="Tp" id="r_tp" />
                )}
                {localSettings.modeChooserType === "pro-nub" && (
                    <CustomRadioGroupItem value="nub" label="Nub" id="r_nub" />
                )}
            </RadioGroup>
        </div>
    )
}

interface CustomRadioGroupItemProps {
    value: GameModeLabel | RunType
    label: string
    id: string
}

function CustomRadioGroupItem({ value, label, id }: CustomRadioGroupItemProps) {
    return (
        <div className="mx-1 flex sm:mx-3">
            <RadioGroupItem value={value} id={id} className="peer sr-only" />
            <Label
                htmlFor={id}
                className="cursor-pointer text-base text-foreground/60 transition-colors hover:text-foreground/80 peer-aria-checked:text-foreground"
            >
                {label}
            </Label>
        </div>
    )
}

export default ModeChooser
