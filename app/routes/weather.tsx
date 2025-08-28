import History from "public/component/history";
import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";

export default function Weather() {
  interface WeatherData {
    weather: { main: string }[];
    main: {
      temp: number;
      temp_max: number;
      temp_min: number;
      humidity: number;
    };
    sys: {
      country: string;
    };
    name: string;
    currentTime: string;
  }
  const [theme, setTheme] = useState("light");
  const historyLimit = Number(import.meta.env.VITE_SEARCH_HISTORY_LIMIT || 10);
  const cacheExpired = Number(import.meta.env.VITE_CACHE_EXPIRED_TIME || 60 * 60 * 1000); // Default to 1 hour if not set
  const cityRef = useRef<HTMLInputElement>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [todayWeather, setTodayWeather] = useState<WeatherData | null>(null);
  const apiKey = import.meta.env.VITE_API_KEY;
  const [noCityFound, setNoCityFound] = useState(false);
  const [weatherImg, setWeatherImg] = useState<string | null>(null);
  const [cache, setCache] = useState<Record<string, WeatherData>>({});
  const getCachedWeatherIfValid = (city: string) => {
    const cached = cache[city];
    if (!cached) return null; // no cache
    const cachedTime = new Date(cached.currentTime).getTime();
    const now = Date.now();
    if (now - cachedTime < cacheExpired) {
      return cached; // valid cache
    }
    return null; // expired cache
  };
  const getTodayWeather = (searchName = "") => {
    if (cityRef.current) {
      const isInit = cityRef.current.value === "" && searchName === ""; // check is init if init then no need to save history
      const inputCity = cityRef.current.value || searchName || "johor"; // set johor as init value if input is empty
      // use cache return recent search result to avoid unnecessary API calls
      if (getCachedWeatherIfValid(inputCity)) {
        setTodayWeather(getCachedWeatherIfValid(inputCity) as WeatherData);
        return; // return if cache is valid
      }
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(inputCity)}&units=metric&appid=${apiKey}`;
      const xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.onload = function () {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          data.currentTime = new Date().toISOString();
          setTodayWeather(data);
          // Save to cache
          setCache((prevCache) => ({
            ...prevCache,
            [data.name]: data,
          }));
          if (!isInit) {
            // Load previous history
            const prevHistory = JSON.parse(localStorage.getItem("searchHistory") || "[]");
            // Remove any entry with the same city and country
            const filteredHistory = prevHistory.filter((item: any) => item.city !== data?.name || item.country !== data?.sys?.country);
            // Add new entry at the top
            const newEntry = { city: data?.name, country: data?.sys?.country, time: new Date().toISOString() };
            let updatedHistory = [newEntry, ...filteredHistory];
            // check if the history exceeds the limit at local env file
            if (updatedHistory.length > historyLimit) {
              updatedHistory = updatedHistory.slice(0, historyLimit);
            }
            localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
            setHistory(updatedHistory);
          }
          cityRef.current.value = ""; // Clear input text after search
          setNoCityFound(false);
        } else {
          setNoCityFound(true);
        }
      };
      xhr.onerror = function () {
        console.error("Request failed");
      };
      xhr.send();
    }
  };
  const getWeatherImg = (weather = "") => {
    // add more weather conditions and their corresponding images as needed
    switch (weather) {
      case "Clear":
        return "/images/Clear.png";
      case "Clouds":
        return "/images/Clouds.png";
      default:
        return "/images/Clouds.png"; // since assets files share to me have limited weather images, use Clouds as default
    }
  };
  useEffect(() => {
    if (!todayWeather) getTodayWeather();
    else {
      setWeatherImg(getWeatherImg(todayWeather?.weather?.[0]?.main));
    }
  }, [todayWeather]);
  return (
    <div
      className={`${theme === "light" ? "bg-[url('/images/bglight.png')]" : "bg-[url('/images/bgdark.png')]"} pt-[26px] flex min-h-screen relative font-noto-sans`}
    >
      <div className="max-w-[700px] w-full mx-auto max-[700px]:px-[18px] mb-[20px] ">
        <div className="grid grid-cols-[1fr_auto] gap-[20px] max-[700px]:gap-[10px] ">
          <div
            className={`${theme === "light" ? `bg-[#B9A5E8] ` : `bg-[#382B6A]`} relative rounded-[20px] px-[22px] py-[3px] h-[60px] flex flex-col gap-[2px] max-[700px]:rounded-[8px] max-[700px]:h-[40px] max-[700px]:px-[11px]`}
          >
            <p className={`${theme === "light" ? `text-[#00000066]` : `text-[#FFFFFF66]`}  text-[10px]`}>Country</p>
            <input
              ref={cityRef}
              type="text"
              className={`${theme === "light" ? `text-[#000000]` : `text-white`} max-[700px]:text-[12px] focus:outline-none focus:ring-0 focus:border-none`}
            />
            {noCityFound && (
              <div className="rounded-sm border border-solid border-[red] bg-red-100 p-2 absolute top-[70px] left-[20px] ">
                <p className="text-red-500 text-xs">Not found</p>
              </div>
            )}
          </div>
          <div
            onClick={() => getTodayWeather()}
            className={`${theme === "light" ? `bg-[#6C40B5]` : `bg-[#28124C]`} rounded-[20px] w-[60px]  h-[60px] max-[700px]:h-[40px] max-[700px]:w-[40px] max-[700px]:rounded-[8px] flex items-center justify-center cursor-pointer`}
          >
            <img src="/images/search.png" alt="Search" className="w-[34px] h-[34px] max-[700px]:w-[22px] max-[700px]:h-[22px]" />
          </div>
        </div>
        <div className="pt-[112px] max-[700px]:pt-[139px] relative">
          <div
            className={`${theme === "light" ? `border border-solid border-[#FFFFFF80] bg-[#FFFFFF33]` : `bg-[#4B3690]`} rounded-[40px] relative  px-[40px] pt-[46px] pb-[26px] max-[700px]:p-[20px] max-[700px]:rounded-[20px]`}
          >
            {todayWeather && (
              <div className="cursor-context-menu grid max-[700px]:grid-cols-2 items-end">
                <div className="">
                  <p className={`${theme === "light" ? `text-[#000000]` : `text-white`} text-[16px]`}>Today’s Weather</p>
                  <p className={`${theme === "light" ? `text-[#6C40B5]` : `text-white`} pt-[18px]  text-[80px] leading-[70px] font-bold`}>
                    {`${Math.ceil(todayWeather?.main?.temp)}`}&#176;
                  </p>
                  <p className={`${theme === "light" ? `text-[#000000]` : `text-white`} pt-[10px] text-[16px] `}>
                    {`H: ${Math.ceil(todayWeather?.main?.temp_max)}`}&#176;
                    {` L: ${Math.ceil(todayWeather?.main?.temp_min)}`}&#176;
                  </p>
                  <div className={`${theme === "light" ? `text-[#666666]` : `text-white`} flex justify-between items-center text-[16px]`}>
                    <p className="font-bold">{`${todayWeather?.name}, ${todayWeather?.sys?.country}`}</p>
                    <p className="max-[700px]:hidden">{format(new Date(todayWeather?.currentTime), "dd-MM-yyyy hh:mm a")}</p>
                    <p className="max-[700px]:hidden">{`Humidity: ${todayWeather?.main?.humidity}`}&#37;</p>
                    <p className="max-[700px]:hidden">{todayWeather?.weather?.[0]?.main}</p>
                  </div>
                  {weatherImg && (
                    <div className="absolute top-[-95px] right-[10px] flex items-center justify-center">
                      <img src={weatherImg} alt="Weather Icon" className="w-[300px] h-[300px] max-[700px]:w-[13rem] max-[700px]:h-[13rem]" />
                    </div>
                  )}
                </div>
                <div className={`${theme === "light" ? `text-[#666666]` : `text-white`} min-[700px]:hidden flex flex-col justify-end items-end gap-y-[13px] text-[14px]`}>
                  <p>{todayWeather?.weather?.[0]?.main}</p>
                  <p>{`Humidity: ${todayWeather?.main?.humidity}`}&#37;</p>
                  <p>{format(new Date(todayWeather?.currentTime), "dd-MM-yyyy hh:mm a")}</p>
                </div>
              </div>
            )}
            <div
              className={`${theme === "light" ? `bg-[#FFFFFF33]` : `bg-[#3B2D6C]`} rounded-[24px] px-[20px] py-[23px] mt-[26px] max-[700px]:px-[17px] max-[700px]:py-[22px]`}
            >
              <p className={`${theme === "light" ? `text-[#000000]` : `text-white`} text-[16px] cursor-context-menu`}>Search History</p>
              <History history={history} setHistory={setHistory} getTodayWeather={getTodayWeather} theme={theme} />
            </div>
          </div>
          <div className="absolute right-[10px] bottom-[100px] ">
          <div className="border border-solid border-white rounded-full w-[40px] h-[40px] bg-[#e8e8e8ce] flex flex-wrap justify-center items-center">
            <div
              title="Toggle Theme"
              className={`${theme == "light" ? `bg-[#4D3BB6]` : `bg-[#A389E0]`} rounded-full w-[30px] h-[30px]  flex items-center justify-center cursor-pointer`}
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            ></div>
          </div>
        </div>
        </div>
        
      </div>
    </div>
  );
}
