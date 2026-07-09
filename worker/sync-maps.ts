const BASE_URL = "https://kztimerglobal.com/api/v2"
const KV_KEY = "maps-v2"

const ENDPOINTS = {
  maps: `${BASE_URL}/maps?is_validated=true&limit=9999`,
  mode200: `${BASE_URL}/record_filters?mode_ids=200&has_teleports=false&limit=9999`,
  mode201: `${BASE_URL}/record_filters?mode_ids=201&has_teleports=false&limit=9999`,
  mode202: `${BASE_URL}/record_filters?mode_ids=202&has_teleports=false&limit=9999`,
}

type TierID = 1 | 2 | 3 | 4 | 5 | 6 | 7
type GameModeID = 200 | 201 | 202

export interface GlobalMap {
  id: number
  name: string
  filesize: number
  validated: true
  difficulty: TierID
  created_on: string
  updated_on: string
  approved_by_steamid64: string
  workshop_url: string
  download_url: string
}

interface RecordFilter {
  id: number
  map_id: number
  stage: number
  mode_id: GameModeID
  tickrate: number
  has_teleports: boolean
  created_on: string
  updated_on: string
  updated_by_id: string
}

interface FilterData {
  modes: Set<GameModeID>
  bonusStages: Set<number>
}

interface KZProfileMap {
  id: number
  name: string
  filesize: number
  difficulty: TierID
  created_on: string
  workshop_id: string
  filters: GameModeID[]
  bonus_count: number
  mapperNames: string[]
  mapperIds: string[]
  videos: string[]
}

export interface SyncMapsSummary {
  total: number
  added: number
  updated: number
  removed: number
}

async function fetchJson<T>(url: string, label: string) {
  console.log(`[FETCH] Starting ${label}...`)

  const res = await fetch(url)

  if (!res.ok) {
    throw new Error(`${label} failed: ${res.status}`)
  }

  const data = (await res.json()) as T[]

  console.log(`[FETCH] ${label} done. (${data.length} records)`)

  return data
}

function buildFilterLookup(filtersArray: RecordFilter[]) {
  const lookup = new Map<number, FilterData>()

  for (const { map_id, mode_id, stage } of filtersArray) {
    if (!lookup.has(map_id)) {
      lookup.set(map_id, { modes: new Set(), bonusStages: new Set() })
    }

    const mapData = lookup.get(map_id)

    if (!mapData) {
      continue
    }

    if (stage === 0) {
      mapData.modes.add(mode_id)
    } else if (stage > 0) {
      mapData.bonusStages.add(stage)
    }
  }

  return lookup
}

function mergeLookups(...lookups: Map<number, FilterData>[]) {
  const merged = new Map<number, FilterData>()

  for (const lookup of lookups) {
    for (const [mapId, data] of lookup.entries()) {
      if (!merged.has(mapId)) {
        merged.set(mapId, { modes: new Set(), bonusStages: new Set() })
      }

      const target = merged.get(mapId)

      if (!target) {
        continue
      }

      data.modes.forEach((mode) => target.modes.add(mode))
      data.bonusStages.forEach((bonusStage) => target.bonusStages.add(bonusStage))
    }
  }

  return merged
}

function getWorkshopId(workshopUrl: string | null): string {
  if (!workshopUrl) {
    return ""
  }

  try {
    return new URL(workshopUrl).searchParams.get("id") ?? ""
  } catch {
    return workshopUrl.split("?id=")[1]?.split("&")[0] ?? ""
  }
}

export async function syncMaps(env: Env): Promise<SyncMapsSummary> {
  console.log("========== KZ PROFILE MAP SYNC START ==========")

  const [globalMaps, filters200, filters201, filters202] = await Promise.all([
    fetchJson<GlobalMap>(ENDPOINTS.maps, "Validated Maps"),
    fetchJson<RecordFilter>(ENDPOINTS.mode200, "Mode 200 Filters"),
    fetchJson<RecordFilter>(ENDPOINTS.mode201, "Mode 201 Filters"),
    fetchJson<RecordFilter>(ENDPOINTS.mode202, "Mode 202 Filters"),
  ])

  const filterLookup = mergeLookups(
    buildFilterLookup(filters200),
    buildFilterLookup(filters201),
    buildFilterLookup(filters202),
  )

  const existingRaw = await env.KZPROFILE.get(KV_KEY)
  const existingMaps = existingRaw ? (JSON.parse(existingRaw) as KZProfileMap[]) : []
  const existingById = new Map(existingMaps.map((map) => [map.id, map]))

  let added = 0
  let updated = 0
  const synced: KZProfileMap[] = []

  for (const globalMap of globalMaps) {
    const { id, name, filesize, difficulty, created_on, workshop_url } = globalMap
    const existing = existingById.get(id)

    if (existing) {
      updated++
    } else {
      added++
    }

    const filterData = filterLookup.get(id) ?? {
      modes: new Set<GameModeID>(),
      bonusStages: new Set<number>(),
    }

    synced.push({
      id,
      name,
      filesize,
      difficulty,
      created_on,
      workshop_id: getWorkshopId(workshop_url),
      filters: Array.from(filterData.modes).sort((a, b) => a - b),
      bonus_count: filterData.bonusStages.size,
      mapperNames: existing?.mapperNames ?? [],
      mapperIds: existing?.mapperIds ?? [],
      videos: existing?.videos ?? [],
    })
  }

  synced.sort((a, b) => a.id - b.id)

  await env.KZPROFILE.put(KV_KEY, JSON.stringify(synced))

  const summary = {
    total: globalMaps.length,
    added,
    updated,
    removed: existingMaps.length - updated,
  }

  console.log("========== SYNC COMPLETE ==========", summary)

  return summary
}
