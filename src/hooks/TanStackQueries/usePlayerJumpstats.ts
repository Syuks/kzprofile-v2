import { useInfiniteQuery, infiniteQueryOptions } from "@tanstack/react-query"
import { queryClient } from "@/main"
import { GlobalAPI_GetJumpstats, GetJumpstatsParams } from "./APIs/GlobalAPI"

import { JumpTypeID, JumpTypeLabel } from "@/lib/gokz"
import { getSteam32 } from "@/lib/steamid"
import z from "zod"

export interface Jumpstat {
    id: number
    distance: number
    is_crouch_bind: 0 | 1
    is_crouch_boost: 0 | 1
    is_forward_bind: 0 | 1
    jump_type: JumpTypeID
    msl_count: number
    player_name: string
    server_id: number
    steam_id: string
    steamid64: string
    strafe_count: number
    tickrate: number
    created_on: string
    updated_on: string
    updated_by_id: number
}

export type CrouchbindMode = "both" | "true" | "false"
export const crouchbindModeSchema = z.enum(["both", "true", "false"])

//const JUMPSTATS_QUERY_LIMIT = 30

const playerJumpstatsInfiniteQueryOptions = (
    steamid: string,
    jumpType: JumpTypeLabel,
    crouchbind: CrouchbindMode,
    pageSize: number,
) => {
    return infiniteQueryOptions({
        queryKey: ["jumpstats", steamid, jumpType, crouchbind, pageSize],
        queryFn: async ({ pageParam }) => {
            let params: GetJumpstatsParams = {
                steam_id: getSteam32(steamid),
                jumptype: jumpType,
                limit: pageSize,
                offset: pageParam,
            }

            if (crouchbind !== "both") {
                params.is_crouch_bind = Boolean(crouchbind)
                params.is_crouch_boost = Boolean(crouchbind)
            }

            const response = await GlobalAPI_GetJumpstats(params)
            const json: Jumpstat[] = await response.json()
            return json
        },
        initialPageParam: 0,
        getNextPageParam: (lastPageData, allPagesData) =>
            lastPageData.length === pageSize ? pageSize * allPagesData.length : undefined,
        gcTime: 0,
    })
}

const usePlayerJumpstats = (
    steamid: string,
    jumpType: JumpTypeLabel,
    crouchbind: CrouchbindMode,
    pageSize: number,
) => {
    return useInfiniteQuery(
        playerJumpstatsInfiniteQueryOptions(steamid, jumpType, crouchbind, pageSize),
    )
}

const fetchPlayerJumpstats = (
    steamid: string,
    jumpType: JumpTypeLabel,
    crouchbind: CrouchbindMode,
    pageSize: number,
) => {
    return queryClient.fetchQuery(
        playerJumpstatsInfiniteQueryOptions(steamid, jumpType, crouchbind, pageSize),
    )
}

export default usePlayerJumpstats
export { fetchPlayerJumpstats }
