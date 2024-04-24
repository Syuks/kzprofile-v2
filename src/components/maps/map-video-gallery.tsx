import { /*useState, */ useMemo } from "react"

import ErrorImage from "@/assets/images/error-image.png"
//import VideoOverlay from "@/assets/VideoOverlay.png"
import PlaylistThumbnail from "@/assets/images/thumbnails/playlist.png"
import TwitchThumbnail from "@/assets/images/thumbnails/twitch.png"
import BilibiliThumbnail from "@/assets/images/thumbnails/bilibili.png"

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

interface MapVideoGalleryProps {
    videos: string[]
}

function MapVideoGallery({ videos }: MapVideoGalleryProps) {
    //const [currentPage, setCurrentPage] = useState(0)

    const videosData: { url: string; thumbnail: string }[] = useMemo(() => {
        //setCurrentPage(0)

        return videos.map((videoCode) => {
            const [siteId, videoId] = videoCode.split("/")

            // YouTube Playlist
            if (siteId === "yt" && videoId.includes("videoseries")) {
                return {
                    url: `https://www.youtube.com/embed/${videoId}`,
                    thumbnail: PlaylistThumbnail,
                }
            }

            // YouTube Video
            if (siteId === "yt") {
                return {
                    url: `https://www.youtube.com/embed/${videoId}`,
                    thumbnail: `https://img.youtube.com/vi/${videoId}/0.jpg`,
                }
            }

            // Twitch Clip
            if (siteId === "tc") {
                return {
                    url: `https://clips.twitch.tv/embed?clip=${videoId}&parent=${window.location.hostname}&autoplay=false`,
                    thumbnail: TwitchThumbnail,
                }
            }

            // Twitch Video
            if (siteId === "tv") {
                return {
                    url: `https://player.twitch.tv/?video=${videoId}&parent=${window.location.hostname}&autoplay=false`,
                    thumbnail: TwitchThumbnail,
                }
            }

            // Bilibili Video
            if (siteId === "bi") {
                return {
                    url: `https://player.bilibili.com/player.html?bvid=${videoId}`,
                    thumbnail: BilibiliThumbnail,
                }
            }

            return {
                url: "error",
                thumbnail: ErrorImage,
            }
        })
    }, [videos])

    /*const CrouselIndicators = () => {
        if (!extendedMapData) {
            return videos.map((video, index) => {
                return (
                    <div className="relative" key={index}>
                        <Skeleton width="100px" height="56.25px" className="carousel-indicator" />
                    </div>
                )
            })
        }

        return videos.map((video, index) => {
            return (
                <div className="relative" key={video.url}>
                    <button
                        className="carousel-indicator"
                        style={{
                            backgroundImage: `url(${video.thumbnail}), url(${ErrorImage})`,
                            opacity: currentPage === index ? 1 : 0.2,
                            border: currentPage === index ? "1px solid white" : "none",
                        }}
                        onClick={() => {
                            setCurrentPage(index)
                        }}
                    ></button>
                    {video.url !== extendedMapData.name && (
                        <img className="video-thumbnail-overlay" src={VideoOverlay}></img>
                    )}
                </div>
            )
        })
    }*/

    return (
        <Carousel>
            <CarouselContent>
                {videosData.map((videoData, index) => (
                    <CarouselItem key={index}>
                        <iframe
                            src={videoData.url}
                            height="100%"
                            width="100%"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen={true}
                            className="aspect-video"
                            style={{ border: "none" }}
                            title="VideoPanel"
                        />
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    )
}

export default MapVideoGallery
