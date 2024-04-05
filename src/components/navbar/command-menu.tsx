import { useState, useEffect, useCallback, useRef } from "react"

import { useNavigate } from "react-router-dom"

import useGlobalMaps from "@/hooks/TanStackQueries/useGlobalMaps"

import { cn } from "@/lib/utils"
import { getTierData } from "@/lib/gokz"

import { Button } from "@/components/ui/button"
import {
    CommandEmpty,
    CommandLoading,
    CommandInput,
    CommandItem,
    CommandList,
    CommandGroup,
    CommandDialog,
} from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

/* TODO: Add virtualization */
function CommandMenu() {
    const navigate = useNavigate()

    const globalMapsQuery = useGlobalMaps()

    const [open, setOpen] = useState(false)

    const [searchInput, setSearchInput] = useState("")
    const searchInputRefClone = useRef<HTMLInputElement>(null)

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

                // Anything that is typed from the first keypress that opens the command dialog
                // until the input in the command dialog is focused, will be set in state by this input.
                setSearchInput("")
                searchInputRefClone.current?.focus()

                setOpen((open) => !open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    const runCommand = useCallback((command: () => unknown) => {
        setOpen(false)
        command()
    }, [])

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
            >
                <span className="inline-flex">Search...</span>
                <kbd className="pointer-events-none h-5 rounded border bg-muted px-1.5 font-mono text-xs">
                    Any
                </kbd>
            </Button>
            <CommandDialog
                open={open}
                onOpenChange={setOpen}
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <CommandInput
                    placeholder="Search a map..."
                    value={searchInput}
                    onValueChange={setSearchInput}
                    autoFocus
                />
                <CommandList>
                    {globalMapsQuery.isLoading && (
                        <CommandLoading className="py-6 text-center text-sm">
                            Loading maps...
                        </CommandLoading>
                    )}
                    {globalMapsQuery.isError && <CommandEmpty>Error fetching maps.</CommandEmpty>}
                    <CommandEmpty>No maps found.</CommandEmpty>
                    <CommandGroup>
                        {globalMapsQuery.data?.map((globalMap) => {
                            const tierData = getTierData(globalMap.difficulty)

                            return (
                                <CommandItem
                                    key={globalMap.id}
                                    value={globalMap.name}
                                    onSelect={() => {
                                        runCommand(() => navigate(`/maps/${globalMap.name}`))
                                    }}
                                    className="flex cursor-pointer justify-between"
                                >
                                    <span>{globalMap.name}</span>
                                    <Badge className={tierData.color} variant="outline">
                                        {tierData.label}
                                    </Badge>
                                </CommandItem>
                            )
                        })}
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
            <Input
                ref={searchInputRefClone}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="fixed -left-96 -top-96"
            />
        </>
    )
}

export default CommandMenu
