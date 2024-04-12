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
                <Button variant="outline" className="border-dashed">
                    <PlusCircledIcon className="mr-2 h-4 w-4" />
                    Add filter
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40">
                {Object.keys(selectedFilters).map((key) => {
                    return (
                        <DropdownMenuCheckboxItem
                            key={key}
                            className="capitalize"
                            checked={selectedFilters[key].show}
                            onCheckedChange={(checked) => onSelectedFiltersChange(key, checked)}
                        >
                            {selectedFilters[key].label}
                        </DropdownMenuCheckboxItem>
                    )
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
