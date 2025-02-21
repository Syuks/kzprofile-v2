import { ReloadIcon } from "@radix-ui/react-icons"

import { Button } from "@/components/ui/button"

interface DataTableReloadButtonProps {
    isFetching: boolean
    refetch: () => void
}

function DataTableReloadButton({ isFetching, refetch }: DataTableReloadButtonProps) {
    return (
        <Button
            variant="outline"
            size="icon"
            className="sm:w-auto sm:px-4 sm:py-2"
            onClick={() => refetch()}
            disabled={isFetching}
        >
            {isFetching ? (
                <ReloadIcon className="h-4 w-4 animate-spin sm:mr-2" />
            ) : (
                <ReloadIcon className="h-4 w-4 sm:mr-2" />
            )}
            <span className="hidden sm:inline">Reload</span>
        </Button>
    )
}

export default DataTableReloadButton
