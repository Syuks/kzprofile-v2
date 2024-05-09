import { type TierID } from "@/lib/gokz"

import AncientBeastHolo from "@/assets/stickers/Ancient-Beast-Holo.png"
import AncientBeast from "@/assets/stickers/Ancient-Beast.png"
import Aztec from "@/assets/stickers/Aztec.png"
import Boost from "@/assets/stickers/Boost.png"
import BorisHolo from "@/assets/stickers/Boris-Holo.png"
import Boris from "@/assets/stickers/Boris.png"
import Cluck from "@/assets/stickers/Cluck.png"
import CombineHelmetHolo from "@/assets/stickers/Combine-Helmet-Holo.png"
import CombineHelmet from "@/assets/stickers/Combine-Helmet.png"
import Crown from "@/assets/stickers/Crown.png"
import CS20Classic from "@/assets/stickers/CS20-Classic.png"
import Emperor from "@/assets/stickers/Emperor.png"
import FancyKoi from "@/assets/stickers/Fancy-Koi.png"
import GoldWeb from "@/assets/stickers/Gold-Web.png"
import GuineaPig from "@/assets/stickers/Guinea-Pig.png"
import JackHolo from "@/assets/stickers/Jack-Holo.png"
import Jack from "@/assets/stickers/Jack.png"
import JoanHolo from "@/assets/stickers/Joan-Holo.png"
import Joan from "@/assets/stickers/Joan.png"
import Longevity from "@/assets/stickers/Longevity.png"
import MaxHolo from "@/assets/stickers/Max-Holo.png"
import Max from "@/assets/stickers/Max.png"
import MoveIt from "@/assets/stickers/Move-It.png"
import NukeBeast from "@/assets/stickers/Nuke-Beast.png"
import PerryHolo from "@/assets/stickers/Perry-Holo.png"
import Perry from "@/assets/stickers/Perry.png"
import ProsDontFix from "@/assets/stickers/Pros-Dont-Fix.png"
import RemakeExpert from "@/assets/stickers/Remake-Expert.png"
import Robo from "@/assets/stickers/Robo.png"
import SASChicken from "@/assets/stickers/SAS-Chicken.png"
import StanHolo from "@/assets/stickers/Stan-Holo.png"
import Stan from "@/assets/stickers/Stan.png"
import StayFrosty from "@/assets/stickers/Stay-Frosty.png"
import SurfsUp from "@/assets/stickers/Surfs-Up.png"
import TooOldForThis from "@/assets/stickers/Too-Old-For-This.png"
import Toxic from "@/assets/stickers/Toxic.png"
import TyranidsHiveTyrant from "@/assets/stickers/Tyranids-Hive-Tyrant.png"
import ViggoHolo from "@/assets/stickers/Viggo-Holo.png"
import Viggo from "@/assets/stickers/Viggo.png"
import zPrince from "@/assets/stickers/zPrince.png"

export interface AchievementData {
    id: string
    title: string
    description: string
    sticker: string
    holoSticker?: string
    tiers?: TierID[]
    maps?: string[]
}

export const achievements: AchievementData[] = [
    {
        id: "tier-very-easy",
        title: "Robo",
        description: "Finish all very easy maps",
        sticker: Robo,
        tiers: [1],
    },
    {
        id: "tier-easy",
        title: "SAS Chicken",
        description: "Finish all easy maps",
        sticker: SASChicken,
        tiers: [2],
    },
    {
        id: "tier-medium",
        title: "Cluck",
        description: "Finish all medium maps",
        sticker: Cluck,
        tiers: [3],
    },
    {
        id: "tier-hard",
        title: "Toxic",
        description: "Finish all hard maps",
        sticker: Toxic,
        tiers: [4],
    },
    {
        id: "tier-very-hard",
        title: "Nuke Beast",
        description: "Finish all very hard maps",
        sticker: NukeBeast,
        tiers: [5],
    },
    {
        id: "tier-extreme",
        title: "Aztec",
        description: "Finish all extreme maps",
        sticker: Aztec,
        tiers: [6],
    },
    {
        id: "tier-death",
        title: "Emperor",
        description: "Finish all death maps",
        sticker: Emperor,
        tiers: [7],
    },
    {
        id: "100%",
        title: "Tyranids Hive Tyrant",
        description: "100% Completionist",
        sticker: TyranidsHiveTyrant,
        tiers: [1, 2, 3, 4, 5, 6, 7],
    },
    {
        id: "map-bkz",
        title: "Move It",
        description: 'Finish 34 maps with prefix "bkz"',
        sticker: MoveIt,
        maps: [
            "bkz_apricity_v3",
            "bkz_blackrockshooter_vzp",
            "bkz_bonus_z1",
            "bkz_cakewalk",
            "bkz_canadaszn",
            "bkz_cauz_final",
            "bkz_cauz_short",
            "bkz_caves_go",
            "bkz_cg_coldbhop",
            "bkz_chillhop_go",
            "bkz_dontstop",
            "bkz_dydhop",
            "bkz_evanstep",
            "bkz_fapzor",
            "bkz_fear4",
            "bkz_goldbhop_csgo",
            "bkz_goldbhop_v2go",
            "bkz_greed",
            "bkz_hellokitty_v2",
            "bkz_impulse",
            "bkz_iota_v3",
            "bkz_itz_h25l",
            "bkz_kartrider",
            "bkz_levite_v2",
            "bkz_lewlysex",
            "bkz_measure",
            "bkz_measure2_b03",
            "bkz_nocturns_blue_gfix",
            "bkz_pogo",
            "bkz_sahara",
            "bkz_underground_crypt_v3",
            "bkz_uninspired_trash",
            "bkz_volcanohop",
            "bkz_zephyr_v2",
        ],
    },
    {
        id: "map-xc",
        title: "CS20 Classic",
        description: 'Finish 16 maps with prefix "xc"',
        sticker: CS20Classic,
        maps: [
            "xc_alt_nephilim",
            "xc_cliffjump_fix",
            "xc_dreamland2",
            "xc_dtt_nasty_go",
            "xc_fox_shrine_japan_fr",
            "xc_karo4",
            "xc_lucid_global",
            "xc_minecraft2_global",
            "xc_minecraft3_global",
            "xc_minecraft4",
            "xc_nephilim",
            "xc_powerblock_rc1",
            "xc_secret_valley_global_fix",
            "xc_skycastle",
            "xc_supermario_go_gfix",
            "xc_umbrella_global",
        ],
    },
    {
        id: "map-bhop",
        title: "Boost",
        description: 'Finish 25 maps with prefix "bhop"',
        sticker: Boost,
        maps: [
            "kz_bhop_algetic",
            "kz_bhop_badges2",
            "kz_bhop_badges3",
            "kz_bhop_benchmark",
            "kz_bhop_composure_f",
            "kz_bhop_dusk_go",
            "kz_bhop_essence",
            "kz_bhop_exodus",
            "kz_bhop_horseshit_9",
            "kz_bhop_koki_niwa",
            "kz_bhop_lego",
            "kz_bhop_lj",
            "kz_bhop_lucid",
            "kz_bhop_mentalism",
            "kz_bhop_monsterjam",
            "kz_bhop_mosaic_od2",
            "kz_bhop_northface",
            "kz_bhop_nothing_go",
            "kz_bhop_proxy_null",
            "kz_bhop_rotebal3",
            "kz_bhop_sakura",
            "kz_bhop_skyworld_go",
            "kz_bhop_slide",
            "kz_bhop_watertemple",
            "kz_bhop_zenith",
        ],
    },
    {
        id: "map-kzra",
        title: "Gold Web",
        description: 'Finish 56 maps with prefix "kzra" or "kzro" made by Spider1',
        sticker: GoldWeb,
        maps: [
            "kz_kzra_bars",
            "kz_kzra_cliffy",
            "kz_kzra_coast",
            "kz_kzra_fustcaves",
            "kz_kzra_greycliff",
            "kz_kzra_hohum",
            "kz_kzra_morath",
            "kz_kzra_oddland",
            "kz_kzra_rockloy",
            "kz_kzra_rocky",
            "kz_kzra_shortclimb_v2",
            "kz_kzra_skaxis",
            "kz_kzra_slidely",
            "kz_kzra_slidepuf",
            "kz_kzra_stonebhop",
            "kz_kzra_stoneishbhop",
            "kz_kzra_suhu",
            "kz_kzra_undercastle",
            "kz_kzra_voovblock",
            "kz_kzra_whitesquare",
            "kz_kzro_2boxes1room",
            "kz_kzro_basalt",
            "kz_kzro_beknowater",
            "kz_kzro_brickstgrass_v2",
            "kz_kzro_bronea",
            "kz_kzro_cavehole",
            "kz_kzro_cavernste_v2",
            "kz_kzro_chairs",
            "kz_kzro_cryscosrun",
            "kz_kzro_darkhole",
            "kz_kzro_excitedbhop",
            "kz_kzro_fastcliff",
            "kz_kzro_gohome",
            "kz_kzro_greybrickbhop",
            "kz_kzro_hardhoodoo",
            "kz_kzro_hardvalley",
            "kz_kzro_hexonay",
            "kz_kzro_jaashs",
            "kz_kzro_justgrab",
            "kz_kzro_mountainbhop",
            "kz_kzro_mountainhaya",
            "kz_kzro_mountainroad",
            "kz_kzro_mountainsein",
            "kz_kzro_mountainsnow",
            "kz_kzro_sekiseibhop",
            "kz_kzro_shima_v2",
            "kz_kzro_skyrocks",
            "kz_kzro_slidesmear",
            "kz_kzro_smallcanyon",
            "kz_kzro_speedcavescape",
            "kz_kzro_sunmountainset",
            "kz_kzro_syotiles",
            "kz_kzro_tamlair",
            "kz_kzro_wallblocks",
            "kz_kzro_whiterock",
            "kz_kzro_yaruna",
        ],
    },
    {
        id: "map-gfy",
        title: "Stay Frosty",
        description: 'Finish 7 maps with prefix "gfy" made by winter Nebs and 1 impostor',
        sticker: StayFrosty,
        maps: [
            "kz_gfy_blueberry",
            "kz_gfy_devcastle",
            "kz_gfy_final",
            "kz_gfy_fortroca",
            "kz_gfy_limit",
            "kz_gfy_strawberry_",
            "kz_gfy_tech",
        ],
    },
    {
        id: "map-zhop",
        title: "zPrince",
        description: 'Finish 6 maps with prefix "zhop" or "zxp" made by zPrince',
        sticker: zPrince,
        maps: [
            "kz_zhop_freestyle",
            "kz_zhop_function3",
            "kz_zhop_son_fix",
            "kz_zxp_final4",
            "kz_zxp_interstellar_v2",
            "kz_zxp_undia",
        ],
    },
    {
        id: "map-kiwi",
        title: "Ancient Beast",
        description: 'Finish 16 maps with preffix "kiwi" made by Kiwi',
        sticker: AncientBeast,
        holoSticker: AncientBeastHolo,
        maps: [
            "kz_kiwideath",
            "kz_kiwiexophoric",
            "kz_kiwiexultation",
            "kz_kiwifactory",
            "kz_kiwimind",
            "kz_kiwimirific",
            "kz_kiwionerous",
            "kz_kiwipsychosis",
            "kz_kiwiqualia",
            "kz_kiwislide",
            "kz_kiwitech",
            "kz_kiwiterror",
            "kz_kiwitown",
            "kz_kiwi_cod",
            "kz_kiwi_hym",
            "kz_kiwi_lars",
        ],
    },
    {
        id: "map-slide",
        title: "Surf's Up",
        description: 'Finish 32 maps with "slide" in the name',
        sticker: SurfsUp,
        maps: [
            "kz_slidebober",
            "kz_slidemap_fix",
            "kz_slide_0x7_n1m0",
            "kz_slide_arid",
            "kz_slide_bozo",
            "kz_slide_cave",
            "kz_slide_concrete",
            "kz_slide_deee",
            "kz_slide_dydanhomon",
            "kz_slide_era",
            "kz_slide_isnt_kz",
            "kz_slide_kissa",
            "kz_slide_koira",
            "kz_slide_leto",
            "kz_slide_or_dont",
            "kz_slide_pallokala",
            "kz_slide_pisauva",
            "kz_slide_piss",
            "kz_slide_purple_x",
            "kz_slide_red",
            "kz_slide_rovod",
            "kz_slide_svn_extreme",
            "kz_slide_svn_temple",
            "kz_slide_vaahtera",
            "kz_slide_wasteland",
            "kz_bhop_slide",
            "kz_cf_slide",
            "kz_how2slide_fix",
            "kz_kiwislide",
            "kz_kzra_slidely",
            "kz_kzra_slidepuf",
            "kz_kzro_slidesmear",
        ],
    },
    {
        id: "map-go",
        title: "Too Old For This",
        description: 'Finish 25 maps with suffix "go"',
        sticker: TooOldForThis,
        maps: [
            "bkz_caves_go",
            "bkz_chillhop_go",
            "bkz_goldbhop_v2go",
            "kz_asteroid_field_go",
            "kz_beginnerblock_go",
            "kz_bhop_dusk_go",
            "kz_bhop_nothing_go",
            "kz_bhop_skyworld_go",
            "kz_cartooncastle_go",
            "kz_cellblock_go2",
            "kz_cliffhanger_go_global",
            "kz_crate_delight_go",
            "kz_forestrace_go",
            "kz_frozen_go",
            "kz_galaxy_go2",
            "kz_gigablock_go",
            "kz_j2s_cupblock_go_fix2",
            "kz_j2s_tetris_go",
            "kz_man_everest_go_fix",
            "kz_pianoclimb_go",
            "kz_psytime_go",
            "kz_summercliff2_go",
            "kz_toonadventure_go",
            "kz_tradeblock_go",
            "xc_dtt_nasty_go",
            "xc_supermario_go_gfix",
        ],
    },
    {
        id: "map-v2",
        title: "Remake Expert",
        description: "Finish 70 maps with the version number as a suffix",
        sticker: RemakeExpert,
        maps: [
            "bkz_goldbhop_v2go",
            "bkz_hellokitty_v2",
            "bkz_levite_v2",
            "bkz_zephyr_v2",
            "kz_adventure_v2",
            "kz_bananaysoda_v2",
            "kz_beanguy_v2",
            "kz_bluerace_v2",
            "kz_brickblock_v2",
            "kz_carp_v2",
            "kz_caulis_v2",
            "kz_colors_v2",
            "kz_duality_v2",
            "kz_dzy_beyond_v2",
            "kz_dzy_reach_v2",
            "kz_epiphany_v2",
            "kz_eros_v2",
            "kz_erratum_v2",
            "kz_farm_v2",
            "kz_fastcombowombo_v2",
            "kz_fatigue_v2",
            "kz_foggywarehouse_v2",
            "kz_func_detail_v2",
            "kz_gkd_v2",
            "kz_goquicklol_v2",
            "kz_haki_v2",
            "kz_kzra_shortclimb_v2",
            "kz_kzro_brickstgrass_v2",
            "kz_kzro_cavernste_v2",
            "kz_kzro_shima_v2",
            "kz_leto_v2",
            "kz_list_gnida_v2",
            "kz_littlerock_v2",
            "kz_megabhop_v2",
            "kz_nightmare_v2",
            "kz_orangejuice_v2",
            "kz_orbolution_v2",
            "kz_pineforest_v2",
            "kz_pixelrun_v2",
            "kz_quick7_v2",
            "kz_reach_v2",
            "kz_remedy_v2",
            "kz_retribution_v2_final",
            "kz_rockjungle_v2",
            "kz_signs_v2",
            "kz_simplicity_v2",
            "kz_snowman_v2",
            "kz_solidarity_v2",
            "kz_sp1_bloodyljs_v2",
            "kz_spaceladders_v2",
            "kz_sukblock_v2_fixed",
            "kz_synthesis_v2",
            "kz_techtonic_v2_ldr",
            "kz_whatever_v2",
            "kz_woodstock_v2",
            "kz_xtremeblock_v2",
            "kz_zxp_interstellar_v2",
            "skz_odious_v2",
            "bkz_apricity_v3",
            "bkz_iota_v3",
            "bkz_underground_crypt_v3",
            "kz_akrh_warehouse_v3",
            "kz_ancient_v3",
            "kz_castlehops_v3",
            "kz_lego_two_redux_v3",
            "kz_swamped_v3",
            "kz_talltreeforest_v3",
            "kz_cascade_v4",
            "kz_mike_v4",
            "kz_mushrruption_v8",
        ],
    },
    {
        id: "map-fix",
        title: "Pros Don't Fix",
        description: 'Finish 52 maps with suffix "fix"',
        sticker: ProsDontFix,
        maps: [
            "kz_21loop_final_fix",
            "kz_aether_fix",
            "kz_after_agitation_easy_fix",
            "kz_alice_fix",
            "kz_alouette_fix",
            "kz_autumn_valley_fix",
            "kz_babycat_fix",
            "kz_beyond_fix",
            "kz_birrita_fix",
            "kz_bir_dont_fix",
            "kz_blindcity_easy_fix",
            "kz_bridge17_fix",
            "kz_cabin_fix",
            "kz_cheetos_fix",
            "kz_choka_fix",
            "kz_christmas_fix",
            "kz_coastline_fix",
            "kz_coronado_fix",
            "kz_crash_fix",
            "kz_cyb_adrenaline_fix",
            "kz_dabitu_fix2",
            "kz_dvn_cube_fixed",
            "kz_exemplum_fix",
            "kz_forgotten_fix",
            "kz_hoist_fix",
            "kz_how2slide_fix",
            "kz_insomnia_fix",
            "kz_j2s_cupblock_go_fix2",
            "kz_janpu_final_fix",
            "kz_kzinga_fixed",
            "kz_ladderhell_fix",
            "kz_man_everest_go_fix",
            "kz_moon_fix",
            "kz_paintball_tv_fix",
            "kz_pharos_fix",
            "kz_portal_fix",
            "kz_quadrant_fix",
            "kz_shaft_fix",
            "kz_slidemap_fix",
            "kz_slowrun_global_fix",
            "kz_strafehop_fix",
            "kz_sukblock_v2_fixed",
            "kz_tomb_fix",
            "kz_toughluck_fix",
            "kz_trazodon_fix",
            "kz_variety_fix",
            "kz_violet_fix",
            "kz_zhop_son_fix",
            "kz_zoomer_fix",
            "vnl_farewell_fix",
            "xc_cliffjump_fix",
            "xc_secret_valley_global_fix",
        ],
    },
    {
        id: "map-od",
        title: "Longevity",
        description: 'Finish 10 maps with suffix "od" made by Overdose',
        sticker: Longevity,
        maps: [
            "kz_abstruse_od2",
            "kz_altum_od",
            "kz_amber_od",
            "kz_atlantis_od",
            "kz_bhop_mosaic_od2",
            "kz_drops_od",
            "kz_heaven_od",
            "kz_hikari_od",
            "kz_nix_od",
            "kz_twilight_od",
        ],
    },
    {
        id: "map-final",
        title: "Guinea Pig",
        description: 'Finish 23 maps with suffix "final"',
        sticker: GuineaPig,
        maps: [
            "bkz_cauz_final",
            "kz_21loop_final_fix",
            "kz_2seasons_spring_final",
            "kz_2seasons_winter_final",
            "kz_angina_final",
            "kz_blindcity_hard_final",
            "kz_buildings_final",
            "kz_cdr_slash_final",
            "kz_crypt_final",
            "kz_gfy_final",
            "kz_gitgud_final",
            "kz_imaginary_final",
            "kz_janpu_final_fix",
            "kz_life_final",
            "kz_nb_final",
            "kz_retribution_v2_final",
            "kz_sendhelp_final",
            "kz_stuff_final",
            "kz_symbiosis_final",
            "kz_toonrun_final",
            "kz_woodstonegrass_final",
            "kz_ziggurath_final",
            "kz_zxp_final4",
        ],
    },
    {
        id: "map-moto",
        title: "Fancy Koi",
        description: "Find and finish 9 maps with anime sounds on the timer, made by Gemayue",
        sticker: FancyKoi,
        maps: [
            "kz_2seasons_spring_final",
            "kz_2seasons_winter_final",
            "kz_21loop_final_fix",
            "kz_otakuroom",
            "kz_whatever_v2",
            "kz_after_agitation_easy_fix",
            "kz_gy_agitation",
            "kz_blindcity_easy_fix",
            "kz_blindcity_hard_final",
        ],
    },
    {
        id: "crown",
        title: "Crown",
        description: "kz_erratum_v2 PRO Runner",
        sticker: Crown,
        maps: ["kz_kiwiterror", "kz_kiwipsychosis", "kz_kiwislide", "kz_tense", "kz_kiwideath"],
    },
    {
        id: "stan",
        title: "Stan",
        description: "Complete 5 specific difficult maps",
        sticker: Stan,
        holoSticker: StanHolo,
        maps: [
            "kz_ladderhorror",
            "kz_wafflehouse_hard",
            "kz_lionharder",
            "kz_drunkards",
            "kz_thrombosis",
        ],
    },
    {
        id: "viggo",
        title: "Viggo",
        description: "Complete 5 specific difficult maps",
        sticker: Viggo,
        holoSticker: ViggoHolo,
        maps: ["kz_ambition", "kz_slide_arid", "kz_unmake", "kz_neoncity_z", "kz_zaloopazxc"],
    },
    {
        id: "jack",
        title: "Jack",
        description: "Complete 5 specific difficult maps",
        sticker: Jack,
        holoSticker: JackHolo,
        maps: ["kz_w1_holiday", "kz_kiwiexultation", "kz_afterlife", "kz_kareful", "kz_pendulum"],
    },
    {
        id: "joan",
        title: "Joan",
        description: "Complete 5 specific difficult maps",
        sticker: Joan,
        holoSticker: JoanHolo,
        maps: [
            "kz_kiwiexophoric",
            "kz_sandbox",
            "kz_erratum_v2",
            "kz_slowrun_global_fix",
            "kz_gemischte_gefuehlslagen",
        ],
    },
    {
        id: "max",
        title: "Max",
        description: "Complete 5 specific difficult maps",
        sticker: Max,
        holoSticker: MaxHolo,
        maps: [
            "kz_slowerrun",
            "kz_cf_foliage",
            "kz_psychosomatic",
            "kzpro_psilocybin",
            "kz_slidemap_fix",
        ],
    },
    {
        id: "boris",
        title: "Boris",
        description: "Complete 5 specific difficult maps",
        sticker: Boris,
        holoSticker: BorisHolo,
        maps: [
            "kz_kiwi_hym",
            "kz_sp1_strafechampion",
            "kz_portalclimb",
            "kz_angina_final",
            "kz_hemochromatosis",
        ],
    },
    {
        id: "perry",
        title: "Perry",
        description: "Complete 5 specific difficult maps",
        sticker: Perry,
        holoSticker: PerryHolo,
        maps: [
            "kz_kzro_hardhoodoo",
            "kz_spacemario_xt",
            "kz_kzro_skyrocks",
            "kz_purgatory",
            "kz_bhop_slide",
        ],
    },
    {
        id: "chelm",
        title: "Combine Helmet",
        description: "Complete 5 specific difficult maps",
        sticker: CombineHelmet,
        holoSticker: CombineHelmetHolo,
        maps: [
            "kz_wafflehouse_x",
            "kz_moon_fix",
            "kz_kiwi_cod",
            "kz_procrastination_f",
            "kz_bhop_koki_niwa",
        ],
    },
]
