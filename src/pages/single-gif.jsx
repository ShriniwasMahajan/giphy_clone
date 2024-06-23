import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GifState } from "../context/gif-context";
import Gif from "../components/gif";
import FollowOn from "../components/follow-on";
import {
  HiMiniChevronDown,
  HiMiniChevronUp,
  HiMiniHeart,
} from "react-icons/hi2";
import { HiOutlineExternalLink } from "react-icons/hi";
import { FaPaperPlane } from "react-icons/fa6";
import { IoCodeSharp } from "react-icons/io5";

const contentType = ["gifs", "stickers", "texts"];

const GifPage = () => {
  const { type, slug } = useParams();
  const [gif, setGif] = useState({});
  const [relatedGifs, setRelatedGifs] = useState({});
  const [readMore, setReadMore] = useState(false);
  const { gifData, favorites, addToFavorites } = GifState();

  const fetchGif = async () => {
    const gifId = slug.split("-").at(-1);
    const { data: related } = await gifData.related(gifId, { limit: 10 });
    setGif(related[0]);
    setRelatedGifs(related);
  };

  useEffect(() => {
    if (!contentType.includes(type)) throw new Error("Invalid Content Type");
    fetchGif();
  }, []);

  const shareGif = () => {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .catch((err) => console.error("Failed to share GIF:", err));
  };

  const embedGif = () => {
    const url = window.location.href;
    navigator.clipboard
      .writeText(`<p><a href="${url}">via GIPHY</a></p>`)
      .catch((err) => console.error("Failed to share GIF:", err));
  };

  return (
    <div className="grid grid-cols-4 my-10 gap-4">
      <div className="hidden sm:block">
        {gif?.user && (
          <>
            <div className="flex gap-1">
              <img
                src={gif.user.avatar_url}
                alt={gif.user.display_name}
                className="h-14"
              />
              <div className="px-2">
                <div className="font-bold">{gif.user.display_name}</div>
                <div className="faded-text">@{gif.user.username}</div>
              </div>
            </div>
            {gif?.user?.description && (
              <p className="py-4 whitespace-pre-line text-sm text-gray-400">
                {gif.user.description.length > 100 ? (
                  <>
                    {readMore
                      ? gif.user.description
                      : gif.user.description.slice(0, 100) + "..."}
                    <div
                      className="flex items-center faded-text cursor-pointer"
                      onClick={() => setReadMore((more) => !more)}
                    >
                      {readMore ? (
                        <>
                          Read Less <HiMiniChevronUp size={20} />
                        </>
                      ) : (
                        <>
                          Read More <HiMiniChevronDown size={20} />
                        </>
                      )}
                    </div>
                  </>
                ) : (
                  gif.user.description
                )}
              </p>
            )}
          </>
        )}
        <FollowOn />
        <div className="divider"></div>
        {gif?.source && (
          <div>
            <span className="faded-text">Source</span>
            <div className="flex items-center text-sm font-bold gap-1">
              <HiOutlineExternalLink size={25} />
              <a href={gif.source} target="_blank" className="truncate">
                {gif.source}
              </a>
            </div>
          </div>
        )}
      </div>
      <div className="col-span-4 sm:col-span-3">
        <div className="flex gap-6">
          <div className="w-full sm:w-3/4">
            <div className="faded-text truncate mb-2">{gif.title}</div>
            <Gif gif={gif} hover={false} />
            <div className="flex gap-1 sm:hidden">
              <img
                src={gif?.user?.avatar_url}
                alt={gif?.user?.display_name}
                className="h-14"
              />
              <div className="px-2">
                <div className="font-bold">{gif?.user?.display_name}</div>
                <div className="faded-text">@{gif?.user?.username}</div>
              </div>
              <button className="ml-auto">
                <FaPaperPlane size={25} />
              </button>
            </div>
          </div>
          <div className="hidden sm:flex flex-col gap-5 mt-6">
            <button
              className="flex gap-5 items-center font-bold text-lg"
              onClick={() => addToFavorites(gif.id)}
            >
              <HiMiniHeart
                size={30}
                className={`${
                  favorites.includes(gif.id) ? "text-red-500" : ""
                }`}
              />
              Favorite
            </button>
            <button
              className="flex gap-6 items-center font-bold text-lg"
              onClick={shareGif}
            >
              <FaPaperPlane size={25} />
              Share
            </button>
            <button
              className="flex gap-5 items-center font-bold text-lg"
              onClick={embedGif}
            >
              <IoCodeSharp size={30} />
              Embed
            </button>
          </div>
        </div>
        <div>
          <span className="font-extrabold">Related GIFs</span>
          <div className="columns-2 md:columns-3 gap-2">
            {relatedGifs?.length > 1 &&
              relatedGifs.slice(1).map((gif) => <Gif gif={gif} key={gif.id} />)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GifPage;
