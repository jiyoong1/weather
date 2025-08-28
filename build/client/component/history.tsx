import { useEffect } from "react";
import { format } from "date-fns";

export default function History({
  setHistory,
  history,
  getTodayWeather,
  theme,
}: {
  setHistory: (history: any[]) => void;
  history: any[];
  getTodayWeather: (searchName: string) => void;
  theme: string;
}) {
  const deleteHisFunc = (index: number) => {
    const updatedHistory = history.filter((_, i) => i !== index);
    setHistory(updatedHistory);
    localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
  };

  useEffect(() => {
    // Init Load history from localStorage
    const storedHistory = JSON.parse(localStorage.getItem("searchHistory") || "[]");
    setHistory(storedHistory);
  }, []);
  return (
    history &&
    history.length > 0 && (
      <div className="flex flex-col gap-y-[18px] w-full mt-[26px]">
        {history.map((item, index) => (
          <div
            key={index}
            className={`${theme === "light" ? `bg-[#FFFFFF66]` : `bg-[#2B2343]`}  p-[21px] max-[700px]:py-[13px] max-[700px]:px-[10px] w-full rounded-[16px] items-center gap-2 flex justify-between text-[#000000] hover:shadow-md transition-shadow duration-200`}
          >
            <div className="flex flex-col gap-[2px]">
              <p
                className={`${theme === "light" ? `text-[#000000]` : `text-white`} cursor-context-menu max-[700px]:text-[14px]`}
              >{`${item.city}, ${item.country}`}</p>
              <p className={`${theme === "light" ? `text-[#000000]` : `text-[#FFFFFF80]`} min-[700px]:hidden text-[10px] cursor-context-menu`}>
                {format(new Date(item.time), "dd-MM-yyyy hh:mm a")}
              </p>
            </div>
            <div className="flex items-center gap-[10px]">
              <p className={`${theme === "light" ? `text-[#000000]` : `text-[#FFFFFF80]`} max-[700px]:hidden text-[14px] cursor-context-menu`}>
                {format(new Date(item.time), "dd-MM-yyyy hh:mm a")}
              </p>
              <button
                onClick={() => {
                  getTodayWeather(item.city);
                }}
                className="text-red-500 hover:text-red-700 transition-colors duration-200 cursor-pointer"
              >
                <div
                  className={`${theme === "light" ? `bg-[#FFFFFF] ` : `border-[2px] border-solid border-[#FFFFFF66]`} w-[34px] h-[34px] rounded-full shadow-md flex items-center justify-center`}
                >
                  <svg className="w-[20px] h-[20px] ml-[-2px]" fill={`${theme === "light" ? `#7F7F7F` : `#9491A0`}`}>
                    <use href="#icon-search" />
                  </svg>
                </div>
              </button>
              <button
                onClick={() => {
                  deleteHisFunc(index);
                }}
                className="text-red-500 hover:text-red-700 transition-colors duration-200 cursor-pointer"
              >
                <div
                  className={`${theme === "light" ? `bg-[#FFFFFF] ` : `border-[2px] border-solid border-[#FFFFFF66]`} w-[34px] h-[34px] rounded-full shadow-md flex items-center justify-center`}
                >
                  <svg className="w-[20px] h-[20px]" fill={`${theme === "light" ? `#7F7F7F` : `#9491A0`}`}>
                    <use href="#icon-delete" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        ))}
      </div>
    )
  );
}
