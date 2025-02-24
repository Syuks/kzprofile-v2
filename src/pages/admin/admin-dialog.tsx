import { useEffect, useMemo, useState } from "react"

import {
    ArrowDownIcon,
    ArrowUpIcon,
    OpenInNewWindowIcon,
    PlusCircledIcon,
    TrashIcon,
} from "@radix-ui/react-icons"

import { Link } from "react-router-dom"

import { queryClient } from "@/main"
import { GameModeID, TierID } from "@/lib/gokz"
import { type KZProfileMap } from "@/hooks/TanStackQueries/useKZProfileMaps"

import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { getVideoInfo } from "@/components/maps/map-video-gallery"

interface Mapper {
    uniqueId: number
    name: string
    steamId: string
}

interface Video {
    uniqueId: number
    link: string
}

interface AdminDialogProps {
    open: boolean
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
    dialogMap: KZProfileMap | undefined
}

function AdminDialog({ open, onOpenChange, dialogMap }: AdminDialogProps) {
    const [id, setId] = useState<number>(0)
    const [name, setName] = useState<string>("")
    const [filesize, setFilesize] = useState<number>(0)
    const [difficulty, setDifficulty] = useState<TierID>(1)
    const [created_on, setCreated_on] = useState<string>("")
    const [workshop_id, setWorkshop_id] = useState<string>("")
    const [filters, setFilters] = useState<GameModeID[]>([])
    const [bonus_count, setBonus_count] = useState<number>(0)
    const [mappers, setMappers] = useState<Mapper[]>([])
    const [videos, setVideos] = useState<Video[]>([])

    const kzProfileMap: KZProfileMap = useMemo(() => {
        if (!dialogMap) {
            return {
                id: 0,
                name: "",
                filesize: 0,
                difficulty: 1,
                created_on: "",
                workshop_id: "",
                filters: [],
                bonus_count: 0,
                mapperNames: [],
                mapperIds: [],
                videos: [],
            }
        }

        setId(dialogMap.id)
        setName(dialogMap.name)
        setFilesize(dialogMap.filesize)
        setDifficulty(dialogMap.difficulty)
        setCreated_on(dialogMap.created_on)
        setWorkshop_id(dialogMap.workshop_id)
        setFilters(dialogMap.filters)
        setBonus_count(dialogMap.bonus_count)
        setMappers(
            dialogMap.mapperNames.map((name, index) => ({
                uniqueId: index,
                name,
                steamId: dialogMap.mapperIds[index],
            })),
        )
        setVideos(
            dialogMap.videos.map((video, index) => ({
                uniqueId: index,
                link: video,
            })),
        )

        return dialogMap
    }, [dialogMap, open])

    const updateKzProfileMaps = () => {
        if (id === kzProfileMap.id) {
            // Update exising map
            queryClient.setQueryData(["maps", "kzProfileMaps"], (oldData: KZProfileMap[]) => {
                const newData = oldData.map((map) => {
                    if (map.id === id) {
                        return {
                            ...map,
                            name,
                            filesize,
                            difficulty,
                            created_on,
                            workshop_id,
                            filters,
                            bonus_count,
                            mapperNames: mappers.map((mapper) => mapper.name),
                            mapperIds: mappers.map((mapper) => mapper.steamId),
                            videos: videos.map((video) => video.link),
                        }
                    }
                    return map
                })
                return newData
            })
        } else {
            // Add new map
            queryClient.setQueryData(["maps", "kzProfileMaps"], (oldData: KZProfileMap[]) => {
                const newData = [
                    ...oldData,
                    {
                        id,
                        name,
                        filesize,
                        difficulty,
                        created_on,
                        workshop_id,
                        filters,
                        bonus_count,
                        mapperNames: mappers.map((mapper) => mapper.name),
                        mapperIds: mappers.map((mapper) => mapper.steamId),
                        videos: videos.map((video) => video.link),
                    },
                ]
                return newData
            })
        }
    }

    const deleteKzProfileMap = () => {
        queryClient.setQueryData(["maps", "kzProfileMaps"], (oldData: KZProfileMap[]) => {
            const newData = oldData.filter((map) => map.id !== id)
            return newData
        })
    }

    const addMapper = () => {
        setMappers((oldMappers) => [
            ...oldMappers,
            { uniqueId: new Date().getTime(), name: "", steamId: "" },
        ])
    }

    const updateMappers = (rowIndex: number, columnId: string, value: string) => {
        setMappers((oldMappers) =>
            oldMappers.map((row, index) => {
                if (index === rowIndex) {
                    return {
                        ...oldMappers[rowIndex]!,
                        [columnId]: value,
                    }
                }
                return row
            }),
        )
    }

    const mappersColumns = useMemo(() => {
        const columnHelper = createColumnHelper<Mapper>()

        return [
            columnHelper.accessor("name", {
                cell: ({ getValue, row: { index }, column: { id } }) => {
                    const initialValue = getValue()

                    const [value, setValue] = useState(initialValue)

                    const onBlur = () => {
                        updateMappers(index, id, value)
                    }

                    // If the initialValue is changed external, sync it up with our state
                    useEffect(() => {
                        setValue(initialValue)
                    }, [initialValue])

                    return (
                        <Input
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            onBlur={onBlur}
                        />
                    )
                },
                size: 0,
            }),
            columnHelper.accessor("steamId", {
                cell: ({ getValue, row: { index }, column: { id } }) => {
                    const initialValue = getValue()

                    const [value, setValue] = useState(initialValue)

                    const onBlur = () => {
                        updateMappers(index, id, value)
                    }

                    // If the initialValue is changed external, sync it up with our state
                    useEffect(() => {
                        setValue(initialValue)
                    }, [initialValue])

                    return (
                        <Input
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            onBlur={onBlur}
                        />
                    )
                },
                size: 0,
            }),
            columnHelper.display({
                id: "actions",
                cell: (props) => {
                    const moveUp = () => {
                        setMappers((oldMappers) => {
                            const index = oldMappers.findIndex(
                                (mapper) => mapper.uniqueId === props.row.original.uniqueId,
                            )
                            if (index === 0) return oldMappers

                            let newMappers = [...oldMappers]
                            const temp = newMappers[index - 1]
                            newMappers[index - 1] = newMappers[index]
                            newMappers[index] = temp

                            return newMappers
                        })
                    }

                    const moveDown = () => {
                        setMappers((oldMappers) => {
                            const index = oldMappers.findIndex(
                                (mapper) => mapper.uniqueId === props.row.original.uniqueId,
                            )
                            if (index === oldMappers.length - 1) return oldMappers

                            let newMappers = [...oldMappers]
                            const temp = newMappers[index + 1]
                            newMappers[index + 1] = newMappers[index]
                            newMappers[index] = temp

                            return newMappers
                        })
                    }

                    const deleteMapper = () => {
                        setMappers((oldMappers) =>
                            oldMappers.filter(
                                (mapper) => mapper.uniqueId !== props.row.original.uniqueId,
                            ),
                        )
                    }

                    return (
                        <div className="flex space-x-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={moveUp}
                                disabled={props.row.index === 0}
                            >
                                <ArrowUpIcon className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={moveDown}
                                disabled={props.row.index === mappers.length - 1}
                            >
                                <ArrowDownIcon className="h-4 w-4" />
                            </Button>
                            <Button variant="destructive" size="icon" onClick={deleteMapper}>
                                <TrashIcon className="h-4 w-4" />
                            </Button>
                        </div>
                    )
                },
                size: 140,
            }),
        ]
    }, [])

    const mappersTable = useReactTable({
        data: mappers,
        columns: mappersColumns,
        getCoreRowModel: getCoreRowModel(),
        getRowId: (row) => row.uniqueId.toString(), //required because row indexes will change
    })

    const addVideo = () => {
        setVideos((oldVideos) => [...oldVideos, { uniqueId: new Date().getTime(), link: "" }])
    }

    const updateVideos = (rowIndex: number, columnId: string, value: string) => {
        setVideos((oldVideos) =>
            oldVideos.map((row, index) => {
                if (index === rowIndex) {
                    return {
                        ...oldVideos[rowIndex]!,
                        [columnId]: value,
                    }
                }
                return row
            }),
        )
    }

    const videosColumns = useMemo(() => {
        const columnHelper = createColumnHelper<Video>()

        return [
            columnHelper.accessor("link", {
                cell: ({ getValue, row: { index }, column: { id } }) => {
                    const initialValue = getValue()

                    const [value, setValue] = useState(initialValue)

                    const onBlur = () => {
                        updateVideos(index, id, value)
                    }

                    // If the initialValue is changed external, sync it up with our state
                    useEffect(() => {
                        setValue(initialValue)
                    }, [initialValue])

                    return (
                        <Input
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            onBlur={onBlur}
                        />
                    )
                },
                size: 0,
            }),
            columnHelper.display({
                id: "actions",
                cell: (props) => {
                    const moveUp = () => {
                        setVideos((oldVideos) => {
                            const index = oldVideos.findIndex(
                                (video) => video.uniqueId === props.row.original.uniqueId,
                            )
                            if (index === 0) return oldVideos

                            let newVideos = [...oldVideos]
                            const temp = newVideos[index - 1]
                            newVideos[index - 1] = newVideos[index]
                            newVideos[index] = temp

                            return newVideos
                        })
                    }

                    const moveDown = () => {
                        setVideos((oldVideos) => {
                            const index = oldVideos.findIndex(
                                (video) => video.uniqueId === props.row.original.uniqueId,
                            )
                            if (index === oldVideos.length - 1) return oldVideos

                            let newVideos = [...oldVideos]
                            const temp = newVideos[index + 1]
                            newVideos[index + 1] = newVideos[index]
                            newVideos[index] = temp

                            return newVideos
                        })
                    }

                    const deleteVideo = () => {
                        setVideos((oldVideos) =>
                            oldVideos.filter(
                                (video) => video.uniqueId !== props.row.original.uniqueId,
                            ),
                        )
                    }

                    const validVideo = useMemo(() => {
                        return getVideoInfo(props.row.original.link).url !== "error"
                    }, [props.row.original.link])

                    return (
                        <div className="flex space-x-2">
                            {validVideo ? (
                                <Button variant="ghost" size="icon" asChild>
                                    <Link
                                        to={getVideoInfo(props.row.original.link).url}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <OpenInNewWindowIcon className="h-4 w-4" />
                                    </Link>
                                </Button>
                            ) : (
                                <Button variant="ghost" size="icon" disabled>
                                    <OpenInNewWindowIcon className="h-4 w-4" />
                                </Button>
                            )}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={moveUp}
                                disabled={props.row.index === 0}
                            >
                                <ArrowUpIcon className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={moveDown}
                                disabled={props.row.index === videos.length - 1}
                            >
                                <ArrowDownIcon className="h-4 w-4" />
                            </Button>
                            <Button variant="destructive" size="icon" onClick={deleteVideo}>
                                <TrashIcon className="h-4 w-4" />
                            </Button>
                        </div>
                    )
                },
                size: 184,
            }),
        ]
    }, [])

    const videosTable = useReactTable({
        data: videos,
        columns: videosColumns,
        getCoreRowModel: getCoreRowModel(),
        getRowId: (row) => row.uniqueId.toString(), //required because row indexes will change
    })

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-[40rem]">
                <DialogHeader>
                    <DialogTitle>Edit map</DialogTitle>
                    <DialogDescription>
                        Make changes to this map here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <div className="mb-4 flex space-x-2">
                    <div className="flex-1">
                        <Label htmlFor="id">ID</Label>
                        <Input
                            id="id"
                            value={id}
                            onChange={(event) => setId(parseInt(event.target.value))}
                        />
                    </div>
                    <div className="flex-1">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                        />
                    </div>
                </div>

                <div className="mb-4  flex space-x-2">
                    <div className="flex-1">
                        <Label htmlFor="filesize">Filesize</Label>
                        <Input
                            id="filesize"
                            value={filesize}
                            onChange={(event) => setFilesize(parseInt(event.target.value))}
                        />
                    </div>
                    <div className="flex-1">
                        <Label htmlFor="difficulty">Tier</Label>
                        <Select
                            value={difficulty.toString()}
                            onValueChange={(value) => setDifficulty(parseInt(value) as TierID)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a tier" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="1">Very Easy</SelectItem>
                                    <SelectItem value="2">Easy</SelectItem>
                                    <SelectItem value="3">Medium</SelectItem>
                                    <SelectItem value="4">Hard</SelectItem>
                                    <SelectItem value="5">Very Hard</SelectItem>
                                    <SelectItem value="6">Extreme</SelectItem>
                                    <SelectItem value="7">Death</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="mb-4 flex space-x-2">
                    <div className="flex-1">
                        <Label htmlFor="created_on">Date</Label>
                        <Input
                            id="created_on"
                            value={created_on}
                            onChange={(event) => setCreated_on(event.target.value)}
                        />
                    </div>
                    <div className="flex-1">
                        <Label htmlFor="workshop_id">Workshop</Label>
                        <Input
                            id="workshop_id"
                            value={workshop_id}
                            onChange={(event) => setWorkshop_id(event.target.value)}
                        />
                    </div>
                </div>

                <div className="mb-4 flex space-x-2">
                    <div className="flex-1 space-y-2">
                        <Label>Filters</Label>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="kz_timer"
                                checked={filters.includes(200)}
                                onCheckedChange={(checked) =>
                                    setFilters(
                                        checked
                                            ? [...filters, 200]
                                            : filters.filter((filter) => filter !== 200),
                                    )
                                }
                            />
                            <label
                                htmlFor="kz_timer"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                KZ Timer
                            </label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="kz_simple"
                                checked={filters.includes(201)}
                                onCheckedChange={(checked) =>
                                    setFilters(
                                        checked
                                            ? [...filters, 201]
                                            : filters.filter((filter) => filter !== 201),
                                    )
                                }
                            />
                            <label
                                htmlFor="kz_simple"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                KZ Simple
                            </label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="kz_vanilla"
                                checked={filters.includes(202)}
                                onCheckedChange={(checked) =>
                                    setFilters(
                                        checked
                                            ? [...filters, 202]
                                            : filters.filter((filter) => filter !== 202),
                                    )
                                }
                            />
                            <label
                                htmlFor="kz_vanilla"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                KZ Vanilla
                            </label>
                        </div>
                    </div>
                    <div className="flex-1">
                        <Label htmlFor="bonus_count">Bonus count</Label>
                        <Input
                            id="bonus_count"
                            value={bonus_count}
                            onChange={(event) => setBonus_count(parseInt(event.target.value))}
                        />
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between pb-2">
                        <Label>Mappers</Label>
                        <Button size="sm" onClick={addMapper}>
                            <PlusCircledIcon className="mr-2 h-4 w-4" />
                            <span>Add mapper</span>
                        </Button>
                    </div>
                    <Table className="table-fixed border-t">
                        <TableBody>
                            {mappersTable.getRowModel().rows?.length ? (
                                mappersTable.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id} className="flex">
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell
                                                key={cell.id}
                                                className="flex"
                                                style={
                                                    cell.column.columnDef.size === 0
                                                        ? { flex: 1 }
                                                        : {
                                                              width: cell.column.getSize(),
                                                          }
                                                }
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={mappersColumns.length}
                                        className="text-center"
                                    >
                                        No mappers.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div>
                    <div className="flex items-center justify-between pb-2">
                        <Label>Videos</Label>
                        <Button size="sm" onClick={addVideo}>
                            <PlusCircledIcon className="mr-2 h-4 w-4" />
                            <span>Add video</span>
                        </Button>
                    </div>
                    <Table className="table-fixed border-t">
                        <TableBody>
                            {videosTable.getRowModel().rows?.length ? (
                                videosTable.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id} className="flex">
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell
                                                key={cell.id}
                                                className="flex"
                                                style={
                                                    cell.column.columnDef.size === 0
                                                        ? { flex: 1 }
                                                        : {
                                                              width: cell.column.getSize(),
                                                          }
                                                }
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={videosColumns.length}
                                        className="text-center"
                                    >
                                        No videos.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <DialogFooter className="flex sm:justify-between">
                    <DialogClose asChild>
                        <Button type="submit" variant="destructive" onClick={deleteKzProfileMap}>
                            Delete map
                        </Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button type="submit" onClick={updateKzProfileMaps}>
                            Save changes
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AdminDialog
