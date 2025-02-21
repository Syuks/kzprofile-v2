import { PlusCircledIcon } from "@radix-ui/react-icons"

import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export interface SelectedFilter {
    label: string
    show: boolean
}

interface AddFiltersProps {
    selectedFilters: { [key: string]: SelectedFilter }
    onSelectedFiltersChange: (filter: string, isChecked: boolean) => void
}

export function DatatableAddFiltersDropdown({
    selectedFilters,
    onSelectedFiltersChange,
}: AddFiltersProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="border-dashed sm:w-auto sm:px-4 sm:py-2"
                >
                    <PlusCircledIcon className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Add filter</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40">
                {Object.keys(selectedFilters).map((key) => {
                    return (
                        <DropdownMenuCheckboxItem
                            key={key}
                            checked={selectedFilters[key].show}
                            onCheckedChange={(checked) => onSelectedFiltersChange(key, checked)}
                            onSelect={(event) => event.preventDefault()}
                        >
                            {selectedFilters[key].label}
                        </DropdownMenuCheckboxItem>
                    )
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
