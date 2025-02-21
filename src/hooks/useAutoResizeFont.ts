import { useEffect, useRef, useState } from "react"

const useAutoResizeFont = (maxFontSize: number, minFontSize: number = 10) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const [fontSize, setFontSize] = useState(maxFontSize)

    useEffect(() => {
        const resizeText = () => {
            const container = containerRef.current
            if (!container) return

            let newFontSize = maxFontSize
            const parentWidth = container.parentElement?.clientWidth ?? 0

            while (container.scrollWidth > parentWidth && newFontSize > minFontSize) {
                newFontSize -= 1 // Decrease font size step-by-step
                container.style.fontSize = `${newFontSize}px`
            }

            setFontSize(newFontSize)
        }

        setTimeout(resizeText, 0)

        const observer = new ResizeObserver(resizeText)
        if (containerRef.current?.parentElement) {
            observer.observe(containerRef.current.parentElement)
        }

        return () => observer.disconnect()
    }, [maxFontSize, minFontSize])

    return { containerRef, fontSize }
}

export default useAutoResizeFont
