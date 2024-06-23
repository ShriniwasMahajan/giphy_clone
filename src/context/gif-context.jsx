import { GiphyFetch } from "@giphy/js-fetch-api";
import { createContext, useContext, useEffect, useState } from "react";

const GifContext = createContext();

const GifProvider = ({ children }) => {
  const [gifs, setGifs] = useState([]);
  const [filter, setFilter] = useState("gifs");
  const [favorites, setFavorites] = useState([]);

  const addToFavorites = (id) =>
    setFavorites((favs) => {
      let newFavs;
      if (favs.includes(id)) newFavs = favs.filter((idx) => idx != id);
      else newFavs = [...favs, id];
      localStorage.setItem("favoriteGIFs", JSON.stringify(newFavs));
      return newFavs;
    });

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem("favoriteGIFs")) || [];
    setFavorites(favs);
  }, []);

  const gifData = new GiphyFetch(import.meta.env.VITE_GIPHY_KEY);

  return (
    <GifContext.Provider
      value={{
        gifData,
        gifs,
        setGifs,
        filter,
        setFilter,
        favorites,
        addToFavorites,
      }}
    >
      {children}
    </GifContext.Provider>
  );
};

export const GifState = () => useContext(GifContext);

export default GifProvider;
