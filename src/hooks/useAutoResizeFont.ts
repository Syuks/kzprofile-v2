import { useEffect, useRef, useState } from "react"

const useAutoResizeFont = (
    maxFontSize: number,
    minFontSize: number = 10,
    redrawDependency?: any,
) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const textRef = useRef<HTMLDivElement>(null)
    const [fontSize, setFontSize] = useState(maxFontSize)

    useEffect(() => {
        const resizeText = () => {
            const container = containerRef.current
            const text = textRef.current
            if (!container || !text) return

            text.style.fontSize = `${maxFontSize}px`
            let newFontSize = maxFontSize

            while (text.scrollWidth > container.clientWidth && newFontSize > minFontSize) {
                newFontSize -= 1
                text.style.fontSize = `${newFontSize}px`
            }

            setFontSize((oldFontSize) => {
                if (oldFontSize === newFontSize) {
                    return oldFontSize
                }
                return newFontSize
            })
        }

        const observer = new ResizeObserver(resizeText)

        if (containerRef.current && textRef.current) {
            observer.observe(containerRef.current)
            resizeText()
        }

        return () => observer.disconnect()
    }, [maxFontSize, minFontSize, redrawDependency])

    return { containerRef, textRef, fontSize }
}

export default useAutoResizeFont
