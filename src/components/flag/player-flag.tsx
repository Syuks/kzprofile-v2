//https://github.com/gosquared/flags

interface PlayerFlagProps {
    nationality: string
    className?: string
}

function PlayerFlag({ nationality, className }: PlayerFlagProps) {
    return (
        nationality && (
            <img
                title={nationality}
                alt={nationality}
                src={`/flags/${nationality.toUpperCase()}.png`}
                onError={(e) => (e.currentTarget.src = `/flags/_unknown.png`)}
                className={className}
            />
        )
    )
}

export default PlayerFlag
