const globalAPI = {
    baseURL: "https://kztimerglobal.com/api/v2.0",
}

/**
 * Converts array params in foo=bar&foo=qux format
 *
 */
const generateUrlSearchParams = (params: Record<string, any>): URLSearchParams => {
    const urlSearchParams = new URLSearchParams()

    for (const key in params) {
        const values = params[key]

        if (Array.isArray(values)) {
            values.forEach((value) => {
                urlSearchParams.append(key, value)
            })
        } else {
            urlSearchParams.append(key, values)
        }
    }

    return urlSearchParams
}

/**
 * Starts a GET HTTP Request to /api/{version}/auth/status
 *
 */
export const GlobalAPI_GetAuthStatus = () => {
    const url = "auth/status"

    return fetch(`${globalAPI.baseURL}/${url}`)
}

export interface GetBansParams {
    ban_types?: string //Ban types to query
    ban_types_list?: string[] //Unsupported at the moment-
    is_expired?: boolean //Whether to query for isExpired or not
    ip?: string //IP address to query
    steamid64?: string //SteamID64 to query
    steam_id?: string //SteamID2 to query
    notes_contains?: string //Notes to query
    stats_contains?: string //Stats to query
    server_id?: number //Server ID to query
    created_since?: string //Created since date to query
    updated_since?: string //Updated since date to query
    offset?: number //Offset of the dataset to query
    limit?: number //Amount of items returned for the query
}

/**
 * Starts a GET HTTP Request to /api/{version}/bans
 *
 */
export const GlobalAPI_GetBans = (params: GetBansParams) => {
    const url = "bans"

    const queryString = generateUrlSearchParams(params).toString()

    return fetch(`${globalAPI.baseURL}/${url}?${queryString}`)
}

export interface CreateBanParams {
    steamId?: string // SteamID2 of the user
    banType?: string // Type of the ban
    stats?: string // Stats of the ban
    notes?: string // Notes of the ban
    ipAddress?: string // IP address of the user
}

/**
 * Starts a POST HTTP Request to /api/{version}/bans
 *
 */
export const GlobalAPI_CreateBan = (params: CreateBanParams) => {
    const url = "bans"

    return fetch(`${globalAPI.baseURL}/${url}`, { method: "POST", body: JSON.stringify(params) })
}

export interface GetJumpstatsParams {
    id?: number //Id to query
    server_id?: number //Server id to query
    steamid64?: string //SteamID64 to query
    steam_id?: string //SteamID2 to query
    jumptype?: string //Jump type to query
    steamid64_list?: string[] //Unsupported at the moment-
    jumptype_list?: string[] //Unsupported at the moment-
    greater_than_distance?: number //Greater than distance to query
    less_than_distance?: number //Less than distance to query
    is_msl?: boolean //Whether to query for isMsl or not
    is_crouch_bind?: boolean //Whether to query for isCrouchBind or not
    is_forward_bind?: boolean //Whether to query for isForwardBind or not
    is_crouch_boost?: boolean //Whether to query for isCrouchBoost or not
    updated_by_id?: number //Updated by id to query
    created_since?: string //Created since date to query
    updated_since?: string //Updated since date to query
    offset?: number //Offset of the dataset to query
    limit?: number //Amount of items returned for the query
}

/**
 * Starts a GET HTTP Request to /api/{version}/jumpstats
 *
 */
export const GlobalAPI_GetJumpstats = (params: GetJumpstatsParams) => {
    const url = "jumpstats"

    const queryString = generateUrlSearchParams(params).toString()

    return fetch(`${globalAPI.baseURL}/${url}?${queryString}`)
}

export interface CreateJumpstatParams {
    steam_id?: string // SteamID2 of the user
    jumptype?: string // Type of the jump
    distance?: unknown // Distance of the jump
    json_jump_info?: unknown // Data of the jump
    tickrate?: unknown // Tickrate of the server
    msl_count?: unknown // Msl count of the jump
    is_crouch_bind?: boolean // Whether crouch bind was used
    is_forward_bind?: boolean // Whether forward bind was used
    is_crouch_boost?: boolean // Whether crouch boost was used
    strafe_count?: unknown // Strafe count of the jump
}

/**
 * Starts a POST HTTP Request to /api/{version}/jumpstats
 *
 */
export const GlobalAPI_CreateJumpstat = (params: CreateJumpstatParams) => {
    const url = "jumpstats"

    return fetch(`${globalAPI.baseURL}/${url}`, { method: "POST", body: JSON.stringify(params) })
}

export interface GetJumpstatTopParams {
    jump_type?: string //Jump type to query
    id?: number //Id to query
    server_id?: number //Server Id to query
    steamid64?: string //SteamID64 to query
    steam_id?: string //SteamID2 to query
    steamid64_list?: string[] //Unsupported at the moment-
    jumptype_list?: string[] //Unsupported at the moment-
    greater_than_distance?: number //Greater than distance to query
    less_than_distance?: number //Less than distance to query
    is_msl?: boolean //Whether to query for isMsl or not
    is_crouch_bind?: boolean //Whether to query for isCrouchBind or not
    is_forward_bind?: boolean //Whether to query for isForwardBind or not
    is_crouch_boost?: boolean //Whether to query for isCrouchBoost or not
    updated_by_id?: number //Updated by id to query
    created_since?: string //Created since date to query
    updated_since?: string //Updated since date to query
    offset?: number //Offset of the dataset to query
    limit?: number //Amount of items returned for the query
}

/**
 * Starts a GET HTTP Request to /api/{version}/jumpstats/{jump_type}/top
 *
 */
export const GlobalAPI_GetJumpstatTop = (params: GetJumpstatTopParams, jumpType: string) => {
    const url = `jumpstats/${jumpType}/top`

    const queryString = generateUrlSearchParams(params).toString()

    return fetch(`${globalAPI.baseURL}/${url}?${queryString}`)
}

/**
 * Starts a GET HTTP Request to /api/{version}/jumpstats/{jump_type}/top30
 *
 */
export const GlobalAPI_GetJumpstatTop30 = (jumpType: string) => {
    const url = `jumpstats/${jumpType}/top30`

    return fetch(`${globalAPI.baseURL}/${url}`)
}

export interface GetMapsParams {
    id?: number //Map id to query
    name?: string //Map name to query
    larger_than_filesize?: number //Larger than filesize to query
    smaller_than_filesize?: number //Smaller than filesize to query
    is_validated?: boolean //Whether to query for isValidated or not
    difficulty?: number //Map difficulty to query
    created_since?: string //Created since date to query
    updated_since?: string //Updated since date to query
    offset?: number //Offset of the dataset to query
    limit?: number //Amount of items returned for the query
}

/**
 * Starts a GET HTTP Request to /api/{version}/maps
 *
 */
export const GlobalAPI_GetMaps = (params: GetMapsParams) => {
    const url = "maps"

    const queryString = generateUrlSearchParams(params).toString()

    return fetch(`${globalAPI.baseURL}/${url}?${queryString}`)
}

/**
 * Starts a GET HTTP Request to /api/{version}/maps/{id}
 *
 */
export const GlobalAPI_GetMapById = (id: number) => {
    const url = `maps/${id}`

    return fetch(`${globalAPI.baseURL}/${url}`)
}

/**
 * Starts a GET HTTP Request to /api/{version}/maps/name/{map_name}
 *
 */
export const GlobalAPI_GetMapByName = (mapName: string) => {
    const url = `maps/name/${mapName}`

    return fetch(`${globalAPI.baseURL}/${url}`)
}

/**
 * Starts a GET HTTP Request to /api/{version}/modes
 *
 */
export const GlobalAPI_GetModes = () => {
    const url = "modes"

    return fetch(`${globalAPI.baseURL}/${url}`)
}

/**
 * Starts a GET HTTP Request to /api/{version}/modes/id/{id}
 *
 */
export const GlobalAPI_GetModeById = (id: number) => {
    const url = `modes/id/${id}`

    return fetch(`${globalAPI.baseURL}/${url}`)
}

/**
 * Starts a GET HTTP Request to /api/{version}/modes/name/{mode_name}
 *
 */
export const GlobalAPI_GetModeByName = (modeName: string) => {
    const url = `modes/name/${modeName}`

    return fetch(`${globalAPI.baseURL}/${url}`)
}

export interface GetPlayersParams {
    name?: string //Player name to query
    steam_id?: string //SteamID2 to query
    is_banned?: boolean //Whether to query for isBanned or not
    total_records?: number //Total records to query
    ip?: string //IP address to query
    steamid64_list?: string[] //List of SteamID64 to query
    offset?: number //Offset of the dataset to query
    limit?: number //Amount of items returned for the query
}

/**
 * Starts a GET HTTP Request to /api/{version}/players
 *
 */
export const GlobalAPI_GetPlayers = (params: GetPlayersParams) => {
    const url = "players"

    const queryString = generateUrlSearchParams(params).toString()

    return fetch(`${globalAPI.baseURL}/${url}?${queryString}`)
}

/**
 * Starts a GET HTTP Request to /api/{version}/players/steamid/{steamid}
 *
 */
export const GlobalAPI_GetPlayerBySteamId = (steamid: string) => {
    const url = `players/steamid/${steamid}`

    return fetch(`${globalAPI.baseURL}/${url}`)
}

/**
 * Starts a GET HTTP Request to /api/{version}/players/steamid/{steamid}/ip/{ip}
 *
 */
export const GlobalAPI_GetPlayerBySteamIdAndIp = (steamid: string, ip: string) => {
    const url = `players/steamid/${steamid}/ip/${ip}`

    return fetch(`${globalAPI.baseURL}/${url}`)
}

export interface CreateRecordParams {
    steam_id?: string //SteamID2 of the user
    map_id?: number //Map id of the record
    mode?: number //Mode of the record
    stage?: number //Stage of the record
    tickrate?: number //Tickrate of the server
    teleports?: number //Teleport count of the record
    time?: number //Elapsed time of the record
}

/**
 * Starts a POST HTTP Request to /api/{version}/records
 *
 */
export const GlobalAPI_CreateRecord = (params: CreateRecordParams) => {
    const url = "records"

    return fetch(`${globalAPI.baseURL}/${url}`, { method: "POST", body: JSON.stringify(params) })
}

/**
 * Starts a GET HTTP Request to /api/{version}/records/place/{id}
 *
 * @note 						Returns plaintext!
 */
export const GlobalAPI_GetRecordPlaceById = (id: number) => {
    const url = `records/place/${id}`

    return fetch(`${globalAPI.baseURL}/${url}`)
}

export interface GetRecordsTopParams {
    steam_id?: string //SteamID2 to query
    server_id?: string //Server ID to query
    steamid64?: string //SteamID64 to query
    map_id?: number //Map id to query
    map_name?: string //Map name to query
    tickrate?: number //Tickrate to query
    stage?: number //Stage to query
    modes_list_string?: string //Mode(s) to query
    has_teleports?: boolean //Whether to query for has_teleports or not
    player_name?: string //Player name to query
    offset?: number //Offset of the dataset to query
    limit?: number //Amount of items returned for the query
}

/**
 * Starts a GET HTTP Request to /api/{version}/records/top
 *
 */
export const GlobalAPI_GetRecordsTop = (params: GetRecordsTopParams) => {
    const url = "records/top"

    const queryString = generateUrlSearchParams(params).toString()

    return fetch(`${globalAPI.baseURL}/${url}?${queryString}`)
}

export interface GetRecordsTopRecentParams {
    steam_id?: string //SteamID2 to query
    steamid64?: string //SteamID64 to query
    map_id?: number //Map id to query
    map_name?: string //Map name to query
    has_teleports?: boolean //Whether to query for has_teleports or not
    tickrate?: number //Tickrate to query
    stage?: number //Stage to query
    modes_list_string?: string //Mode(s) to query
    place_top_at_least?: number //Place top at least to query
    place_top_overall_at_least?: number //Place top overall at least to query
    created_since?: string //Created since date to query
    offset?: number //Offset of the dataset to query
    limit?: number //Amount of items returned for the query
}

/**
 * Starts a GET HTTP Request to /api/{version}/records/top/recent
 *
 */
export const GlobalAPI_GetRecordsTopRecent = (params: GetRecordsTopRecentParams) => {
    const url = "records/top/recent"

    const queryString = generateUrlSearchParams(params).toString()

    return fetch(`${globalAPI.baseURL}/${url}?${queryString}`)
}

export interface GetRecordsTopWorldRecordsParams {
    ids?: number[] //Array of ids to query
    map_ids?: number[] //Array of map ids to query
    stages?: number[] //Array of stages to query
    mode_ids?: number[] //Array of mode ids to query
    tickrates?: number[] //Array of tickrates to query
    has_teleports?: boolean //Whether to query for has_teleports or not
    offset?: number //Offset of the dataset to query
    limit?: number //Amount of items returned for the query
}

/**
 * Starts a GET HTTP Request to /api/{version}/records/top/world_records
 *
 */
export const GlobalAPI_GetRecordsTopWorldRecords = (params: GetRecordsTopWorldRecordsParams) => {
    const url = "records/top/world_records"

    const queryString = generateUrlSearchParams(params).toString()

    return fetch(`${globalAPI.baseURL}/${url}?${queryString}`)
}

export interface GetServersParams {
    id?: number[] //Id to query
    port?: number //Port to query
    ip?: string //IP address to query
    name?: string //Server name to query
    owner_steamid64?: string //Owner's steamid64 to query
    approval_status?: number //Approval status to query
    offset?: number //Offset of the dataset to query
    limit?: number //Amount of items returned for the query
}

/**
 * Starts a GET HTTP Request to /api/{version}/servers
 *
 */
export const GlobalAPI_GetServers = (params: GetServersParams) => {
    const url = "servers"

    const queryString = generateUrlSearchParams(params).toString()

    return fetch(`${globalAPI.baseURL}/${url}?${queryString}`)
}

/**
 * Starts a GET HTTP Request to /api/{version}/servers/{id}
 *
 */
export const GlobalAPI_GetServerById = (id: number) => {
    const url = `servers/${id}`

    return fetch(`${globalAPI.baseURL}/${url}`)
}

/**
 * Starts a GET HTTP Request to /api/{version}/servers/name/{server_name}
 *
 */
export const GlobalAPI_GetServersByName = (serverName: string) => {
    const url = `servers/name/${serverName}`

    return fetch(`${globalAPI.baseURL}/${url}`)
}

export interface GetPlayerRanksParams {
    points_greater_than?: number //Points greater than to query
    average_greater_than?: number //Average greater than to query
    rating_greater_than?: number //Rating greater than to query
    finishes_greater_than?: number //Finishes greater than to query
    steamid64s?: string[] //Comma-separated stirng of steamid64s to query
    record_filter_ids?: number[] //Array of record filter ids to query
    map_ids?: number[] //Array of map ids to query
    stages?: number[] //Array of stages to query
    mode_ids?: number[] //Array of mode ids to query
    tickrates?: number[] //Array of tickrates to query
    has_teleports?: boolean //Whether to query for has_teleports or not
    offset?: number //Offset of the dataset to query
    limit?: number //Amount of items returned for the query
}

/**
 * Starts a GET HTTP Request to /api/{version}/player_ranks
 *
 */
export const GlobalAPI_GetPlayerRanks = (params: GetPlayerRanksParams) => {
    const url = "player_ranks"

    const queryString = generateUrlSearchParams(params).toString()

    return fetch(`${globalAPI.baseURL}/${url}?${queryString}`)
}

export interface GetRecordFiltersParams {
    ids?: number[] //Array of ids to query
    map_ids?: number[] //Array of map ids to query
    stages?: number[] //Array of stages to query
    mode_ids?: number[] //Array of mode ids to query
    tickrates?: number[] //Array of tickrates to query
    has_teleports?: boolean //Whether to query for has_teleports or not
    offset?: number //Offset of the dataset to query
    limit?: number //Amount of items returned for the query
}

/**
 * Starts a GET HTTP Request to /api/{version}/record_filters
 *
 */
export const GlobalAPI_GetRecordFilters = (params: GetRecordFiltersParams) => {
    const url = "record_filters"

    const queryString = generateUrlSearchParams(params).toString()

    return fetch(`${globalAPI.baseURL}/${url}?${queryString}`)
}

export interface GetRecordFilterDistributionsParams {
    ids?: number[] //Array of ids to query
    map_ids?: number[] //Array of map ids to query
    stages?: number[] //Array of stages to query
    mode_ids?: number[] //Array of mode ids to query
    tickrates?: number[] //Array of tickrates to query
    has_teleports?: boolean //Whether to query for has_teleports or not
    offset?: number //Offset of the dataset to query
    limit?: number //Amount of items returned for the query
}

/**
 * Starts a GET HTTP Request to /api/{version}/record_filters/distributions
 *
 */
export const GlobalAPI_GetRecordFilterDistributions = (
    params: GetRecordFilterDistributionsParams,
) => {
    const url = "record_filters/distributions"

    const queryString = generateUrlSearchParams(params).toString()

    return fetch(`${globalAPI.baseURL}/${url}?${queryString}`)
}

export interface GetReplayListParams {
    offset?: number //Offset of the dataset to query
    limit?: number //Amount of items returned for the query
}

/**
 * Starts a GET HTTP Request to /api/{version}/records/replay/list
 *
 */
export const GlobalAPI_GetReplayList = (params: GetReplayListParams) => {
    const url = "records/replay/list"

    const queryString = generateUrlSearchParams(params).toString()

    return fetch(`${globalAPI.baseURL}/${url}?${queryString}`)
}

/**
 * Starts a GET HTTP Request to /api/{version}/records/{record_id}/replay
 *
 */
export const GlobalAPI_GetReplayByRecordId = (recordId: number) => {
    const url = `records/${recordId}/replay`

    return fetch(`${globalAPI.baseURL}/${url}`)
}

/**
 * Starts a GET HTTP Request to /api/{version}/records/replay/{replay_id}
 *
 */
export const GlobalAPI_GetReplayByReplayId = (replayId: number) => {
    const url = `records/replay/${replayId}`

    return fetch(`${globalAPI.baseURL}/${url}`)
}

export interface CreateReplayForRecordIdParams {
    replayFile?: string //Path to the replay file
}

/**
 * Starts a POST HTTP Request to /api/{version}/records/{record_id}/replay
 *
 */
export const GlobalAPI_CreateReplayForRecordId = (
    params: CreateReplayForRecordIdParams,
    recordId: number,
) => {
    const url = `records/${recordId}/replay`

    const queryString = generateUrlSearchParams(params).toString()

    return fetch(`${globalAPI.baseURL}/${url}?${queryString}`, {
        method: "POST",
        body: JSON.stringify(params),
    })
}
