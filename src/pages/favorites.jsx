import { useEffect, useState } from "react";
import { GifState } from "../context/gif-context";
import Gif from "../components/gif";

const Favorites = () => {
  const { gifData, favorites } = GifState();
  const [favGifs, setFavGifs] = useState([]);

  const fetchFavGifs = async () => {
    const { data: gifs } = await gifData.gifs(favorites);
    setFavGifs(gifs);
  };

  useEffect(() => {
    fetchFavGifs();
  }, []);

  return (
    <div className="mt-2">
      <span className="text-faded">My Favorites</span>
      <div className="columns-2 md:columns-3 lg:columns-4 xl:columns gap-2 mt-2">
        {favGifs.map((gif) => (
          <Gif gif={gif} key={gif.id} />
        ))}
      </div>
    </div>
  );
};

export default Favorites;
