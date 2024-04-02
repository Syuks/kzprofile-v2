import { useState, useEffect, useCallback, useRef } from "react"

import { useNavigate } from "react-router-dom"

import { cn } from "@/lib/utils"
import { DialogProps } from "@radix-ui/react-dialog"
import { Button } from "@/components/ui/button"
import {
    CommandDialog,
    CommandEmpty,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"

function CommandMenu({ ...props }: DialogProps) {
    const navigate = useNavigate()

    const [open, setOpen] = useState(false)

    const [searchInput, setSearchInput] = useState("")
    const searchInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (/^[a-zA-Z0-9]$/.test(e.key) && !e.ctrlKey && !e.altKey && !e.shiftKey) {
                if (
                    (e.target instanceof HTMLElement && e.target.isContentEditable) ||
                    e.target instanceof HTMLInputElement ||
                    e.target instanceof HTMLTextAreaElement ||
                    e.target instanceof HTMLSelectElement
                ) {
                    return
                }

                e.preventDefault()
                setOpen((open) => !open)

                setSearchInput(e.key)
                // To prevent the autoFocus on dialog open selecting the input value
                // and replacing it with the next key stroke. setTimeout with delay 0
                // is added to the call stack and waits until the dialog really opens.
                setTimeout(() => {
                    searchInputRef.current?.setSelectionRange(
                        searchInputRef.current.value.length,
                        searchInputRef.current.value.length,
                    )
                }, 0)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    const runCommand = useCallback((command: () => unknown) => {
        setOpen(false)
        command()
    }, [])

    const maps = [
        {
            id: 0,
            name: "kz_apricity_v3",
        },
        {
            id: 1,
            name: "kz_zhop_city",
        },
    ]

    return (
        <>
            <Button
                variant="outline"
                className={cn(
                    "relative h-8 w-full justify-between rounded-lg bg-background pr-[0.3rem] text-sm font-normal text-muted-foreground shadow-none md:w-40 lg:w-64",
                )}
                onClick={() => {
                    setOpen(true)
                    setSearchInput("")
                }}
                {...props}
            >
                <span className="inline-flex">Search...</span>
                <kbd className="pointer-events-none h-5 rounded border bg-muted px-1.5 font-mono text-xs">
                    Any
                </kbd>
            </Button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput
                    ref={searchInputRef}
                    placeholder="Search a map..."
                    value={searchInput}
                    onValueChange={setSearchInput}
                />
                <CommandList>
                    <CommandEmpty>No maps found.</CommandEmpty>
                    {maps.map((map) => (
                        <CommandItem
                            key={map.id}
                            value={map.name}
                            onSelect={() => {
                                runCommand(() => navigate(`/maps/${map.id}`))
                            }}
                        >
                            {map.name}
                        </CommandItem>
                    ))}
                </CommandList>
            </CommandDialog>
        </>
    )
}

export default CommandMenu
