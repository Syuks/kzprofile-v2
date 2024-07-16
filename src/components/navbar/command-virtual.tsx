import { useState, useEffect, useCallback, useMemo } from "react"

import { ButtonIcon, ImageIcon, PersonIcon } from "@radix-ui/react-icons"

import { useNavigate } from "react-router-dom"

import useKZProfileMaps, { KZProfileMap } from "@/hooks/TanStackQueries/useKZProfileMaps"

import { cn } from "@/lib/utils"
import { getTierData } from "@/lib/gokz"

import { useVirtualizer } from "@tanstack/react-virtual"
import { Button } from "@/components/ui/button"
import {
    CommandEmpty,
    CommandLoading,
    CommandInput,
    CommandItem,
    CommandList,
    CommandGroup,
    CommandDialog,
    CommandSeparator,
} from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"
import { getSteam64 } from "@/lib/steamid"

/* TODO: Add virtualization */
function CommandVirtual() {
    const navigate = useNavigate()

    const kzProfileMapsQuery = useKZProfileMaps()

    const [open, setOpen] = useState(false)

    const [searchInput, setSearchInput] = useState("")

    // Because the Virtualizer is inside a popup we need to use a callback ref instead of a normal ref
    const [parentRef, setParentRef] = useState<HTMLDivElement | null>(null)
    const setFakeParentRef = useCallback((ref: HTMLDivElement) => setParentRef(ref), [])

    const filteredMaps = useMemo<KZProfileMap[]>(() => {
        if (!kzProfileMapsQuery.data) {
            return []
        }

        const cleanSearchInput = searchInput.trim().toLowerCase()

        if (cleanSearchInput === "") {
            return kzProfileMapsQuery.data
        }

        const globalFilterFields: (keyof KZProfileMap)[] = ["name", "workshop_id"]

        const filteredMaps = kzProfileMapsQuery.data.filter((map) => {
            let globalMatch = false

            for (let field of globalFilterFields) {
                if (map[field].toString().toLowerCase().indexOf(cleanSearchInput) !== -1) {
                    globalMatch = true
                    break
                }
            }

            return globalMatch
        })

        return filteredMaps
    }, [kzProfileMapsQuery.data, searchInput])

    const rowVirtualizer = useVirtualizer({
        count: filteredMaps.length,
        getScrollElement: () => parentRef,
        estimateSize: () => 44,
        overscan: 5,
    })

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

                setSearchInput("")
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
                    setSearchInput("")
                    setOpen(true)
                }}
            >
                <span className="inline-flex">Search...</span>
                <kbd className="pointer-events-none h-5 rounded border bg-muted px-1.5 font-mono text-xs">
                    Any
                </kbd>
            </Button>

            <CommandDialog open={open} onOpenChange={setOpen} shouldFilter={false}>
                <CommandInput
                    placeholder="Search a map..."
                    value={searchInput}
                    onValueChange={setSearchInput}
                />
                <CommandList ref={setFakeParentRef}>
                    {kzProfileMapsQuery.status === "pending" && (
                        <CommandLoading className="py-6 text-center text-sm">
                            Loading maps...
                        </CommandLoading>
                    )}

                    {kzProfileMapsQuery.status === "error" && (
                        <CommandEmpty>Error fetching maps.</CommandEmpty>
                    )}

                    {kzProfileMapsQuery.status === "success" && (
                        <CommandGroup heading="Maps">
                            <div
                                className="relative w-full"
                                style={{
                                    height: `${rowVirtualizer.getTotalSize()}px`,
                                }}
                            >
                                {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                                    const globalMap = filteredMaps[virtualRow.index]
                                    const tierData = getTierData(globalMap.difficulty)

                                    return (
                                        <CommandItem
                                            key={globalMap.id}
                                            value={globalMap.name}
                                            onSelect={() => {
                                                runCommand(() =>
                                                    navigate(`/maps/${globalMap.name}`),
                                                )
                                            }}
                                            className="absolute left-0 top-0 flex w-full justify-between"
                                            style={{
                                                height: `${virtualRow.size}px`,
                                                transform: `translateY(${virtualRow.start}px)`,
                                            }}
                                        >
                                            <span className="flex">
                                                <ImageIcon className="mr-2 h-4 w-4" />
                                                {globalMap.name}
                                            </span>
                                            <Badge
                                                className={cn(tierData.color, tierData.border)}
                                                variant="outline"
                                            >
                                                {tierData.label}
                                            </Badge>
                                        </CommandItem>
                                    )
                                })}
                            </div>

                            {!filteredMaps.length && (
                                <CommandItem disabled>No maps found.</CommandItem>
                            )}
                        </CommandGroup>
                    )}

                    <CommandSeparator />
                    <CommandGroup heading="More actions" forceMount>
                        <CommandItem
                            onSelect={() =>
                                runCommand(() => {
                                    const steamid = getSteam64(searchInput)
                                    if (steamid) {
                                        navigate(`/players/${steamid}`)
                                        return
                                    }

                                    navigate(`/players?search=${searchInput}`)
                                })
                            }
                        >
                            <PersonIcon className="mr-2 h-4 w-4" />
                            Search player
                        </CommandItem>
                        <CommandItem
                            onSelect={() =>
                                runCommand(() => navigate(`/servers?search=${searchInput}`))
                            }
                        >
                            <ButtonIcon className="mr-2 h-4 w-4" />
                            Search server
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    )
}

export default CommandVirtual
