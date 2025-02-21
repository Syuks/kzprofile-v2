//https://github.com/gosquared/flags

interface PlayerFlagProps {
    nationality: string
    className?: string
    style?: React.CSSProperties
}

function PlayerFlag({ nationality, className, style }: PlayerFlagProps) {
    return (
        nationality && (
            <img
                title={nationality}
                alt={nationality}
                src={`/flags/${nationality.toUpperCase()}.png`}
                onError={(e) => (e.currentTarget.src = `/flags/_unknown.png`)}
                className={className}
                style={style}
            />
        )
    )
}

export default PlayerFlag
