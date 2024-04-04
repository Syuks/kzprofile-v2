import { useState, useEffect, useCallback, useRef } from "react"

import { useNavigate } from "react-router-dom"

import useGlobalMaps from "@/hooks/TanStackQueries/useGlobalMaps"

import { cn } from "@/lib/utils"
import { DialogProps } from "@radix-ui/react-dialog"
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

function CommandMenu({ ...props }: DialogProps) {
    const navigate = useNavigate()

    const globalMapsQuery = useGlobalMaps()
    /*const [filteredGlobalMaps, setFilteredGlobalMaps] = useState<GlobalMap[]>([])*/

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

    /*const onSearchInputValueChange = (search: string) => {
        setSearchInput(search)

        if (!globalMapsQuery.data) {
            return
        }

        const filteredMaps = globalMapsQuery.data
            .filter((map) => map.name.toLowerCase().includes(search.toLowerCase()))
            .slice(0, 20)

        setFilteredGlobalMaps(filteredMaps)
    }*/

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
                    {globalMapsQuery.isLoading && (
                        <CommandLoading className="py-6 text-center text-sm">
                            Loading maps...
                        </CommandLoading>
                    )}
                    {globalMapsQuery.isError && <CommandEmpty>Error fetching maps.</CommandEmpty>}
                    <CommandEmpty>No maps found.</CommandEmpty>
                    <CommandGroup>
                        {globalMapsQuery.data?.map((globalMap) => (
                            <CommandItem
                                key={globalMap.id}
                                value={globalMap.name}
                                onSelect={() => {
                                    runCommand(() => navigate(`/maps/${globalMap.id}`))
                                }}
                            >
                                {globalMap.name}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    )
}

export default CommandMenu
