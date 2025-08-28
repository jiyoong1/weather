import { jsx, jsxs } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, UNSAFE_withComponentProps, Outlet, UNSAFE_withErrorBoundaryProps, isRouteErrorResponse, Meta, Links, ScrollRestoration, Scripts } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { useEffect, useState, useRef } from "react";
import { format } from "date-fns";
const streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");
    let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, streamTimeout + 1e3);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
function Icons() {
  return /* @__PURE__ */ jsxs("div", { hidden: true, children: [
    /* @__PURE__ */ jsx("svg", { id: "icon-delete", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { d: "M18.984 3.984v2.016h-13.969v-2.016h3.469l1.031-0.984h4.969l1.031 0.984h3.469zM6 18.984v-12h12v12q0 0.797-0.609 1.406t-1.406 0.609h-7.969q-0.797 0-1.406-0.609t-0.609-1.406z" }) }),
    /* @__PURE__ */ jsx("svg", { id: "icon-search", viewBox: "0 0 30 30", children: /* @__PURE__ */ jsx("path", { d: "M19.427 20.427c-1.39 0.99-3.090 1.573-4.927 1.573-4.694 0-8.5-3.806-8.5-8.5s3.806-8.5 8.5-8.5c4.694 0 8.5 3.806 8.5 8.5 0 1.837-0.583 3.537-1.573 4.927l5.585 5.585c0.55 0.55 0.546 1.431-0 1.976l-0.023 0.023c-0.544 0.544-1.431 0.546-1.976 0l-5.585-5.585zM14.5 20c3.59 0 6.5-2.91 6.5-6.5s-2.91-6.5-6.5-6.5c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5v0z" }) })
  ] });
}
const links = () => [{
  rel: "preconnect",
  href: "https://fonts.googleapis.com"
}, {
  rel: "preconnect",
  href: "https://fonts.gstatic.com",
  crossOrigin: "anonymous"
}, {
  rel: "stylesheet",
  href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
}];
function Layout({
  children
}) {
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      children: [/* @__PURE__ */ jsx(Icons, {}), children, /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
}
const root = UNSAFE_withComponentProps(function App() {
  return /* @__PURE__ */ jsx(Outlet, {});
});
const ErrorBoundary = UNSAFE_withErrorBoundaryProps(function ErrorBoundary2({
  error
}) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  }
  return /* @__PURE__ */ jsxs("main", {
    className: "pt-16 p-4 container mx-auto",
    children: [/* @__PURE__ */ jsx("h1", {
      children: message
    }), /* @__PURE__ */ jsx("p", {
      children: details
    }), stack]
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  Layout,
  default: root,
  links
}, Symbol.toStringTag, { value: "Module" }));
function History({
  setHistory,
  history,
  getTodayWeather,
  theme
}) {
  const deleteHisFunc = (index) => {
    const updatedHistory = history.filter((_, i) => i !== index);
    setHistory(updatedHistory);
    localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
  };
  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("searchHistory") || "[]");
    setHistory(storedHistory);
  }, []);
  return history && history.length > 0 && /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-y-[18px] w-full mt-[26px]", children: history.map((item, index) => /* @__PURE__ */ jsxs(
    "div",
    {
      className: `${theme === "light" ? `bg-[#FFFFFF66]` : `bg-[#2B2343]`}  p-[21px] max-[700px]:py-[13px] max-[700px]:px-[10px] w-full rounded-[16px] items-center gap-2 flex justify-between text-[#000000] hover:shadow-md transition-shadow duration-200`,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-[2px]", children: [
          /* @__PURE__ */ jsx(
            "p",
            {
              className: `${theme === "light" ? `text-[#000000]` : `text-white`} cursor-context-menu max-[700px]:text-[14px]`,
              children: `${item.city}, ${item.country}`
            }
          ),
          /* @__PURE__ */ jsx("p", { className: `${theme === "light" ? `text-[#000000]` : `text-[#FFFFFF80]`} min-[700px]:hidden text-[10px] cursor-context-menu`, children: format(new Date(item.time), "dd-MM-yyyy hh:mm a") })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-[10px]", children: [
          /* @__PURE__ */ jsx("p", { className: `${theme === "light" ? `text-[#000000]` : `text-[#FFFFFF80]`} max-[700px]:hidden text-[14px] cursor-context-menu`, children: format(new Date(item.time), "dd-MM-yyyy hh:mm a") }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => {
                getTodayWeather(item.city);
              },
              className: "text-red-500 hover:text-red-700 transition-colors duration-200 cursor-pointer",
              children: /* @__PURE__ */ jsx(
                "div",
                {
                  className: `${theme === "light" ? `bg-[#FFFFFF] ` : `border-[2px] border-solid border-[#FFFFFF66]`} w-[34px] h-[34px] rounded-full shadow-md flex items-center justify-center`,
                  children: /* @__PURE__ */ jsx("svg", { className: "w-[20px] h-[20px] ml-[-2px]", fill: `${theme === "light" ? `#7F7F7F` : `#9491A0`}`, children: /* @__PURE__ */ jsx("use", { href: "#icon-search" }) })
                }
              )
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => {
                deleteHisFunc(index);
              },
              className: "text-red-500 hover:text-red-700 transition-colors duration-200 cursor-pointer",
              children: /* @__PURE__ */ jsx(
                "div",
                {
                  className: `${theme === "light" ? `bg-[#FFFFFF] ` : `border-[2px] border-solid border-[#FFFFFF66]`} w-[34px] h-[34px] rounded-full shadow-md flex items-center justify-center`,
                  children: /* @__PURE__ */ jsx("svg", { className: "w-[20px] h-[20px]", fill: `${theme === "light" ? `#7F7F7F` : `#9491A0`}`, children: /* @__PURE__ */ jsx("use", { href: "#icon-delete" }) })
                }
              )
            }
          )
        ] })
      ]
    },
    index
  )) });
}
const weather = UNSAFE_withComponentProps(function Weather() {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
  const [theme, setTheme] = useState("light");
  const historyLimit = Number("11");
  const cacheExpired = Number("10000");
  const cityRef = useRef(null);
  const [history, setHistory] = useState([]);
  const [todayWeather, setTodayWeather] = useState(null);
  const apiKey = "5e077fae1fa5781b31ed3a4745b841a0";
  const [noCityFound, setNoCityFound] = useState(false);
  const [weatherImg, setWeatherImg] = useState(null);
  const [cache, setCache] = useState({});
  const getCachedWeatherIfValid = (city) => {
    const cached = cache[city];
    if (!cached) return null;
    const cachedTime = new Date(cached.currentTime).getTime();
    const now = Date.now();
    if (now - cachedTime < cacheExpired) {
      return cached;
    }
    return null;
  };
  const getTodayWeather = (searchName = "") => {
    if (cityRef.current) {
      const isInit = cityRef.current.value === "" && searchName === "";
      const inputCity = cityRef.current.value || searchName || "johor";
      if (getCachedWeatherIfValid(inputCity)) {
        setTodayWeather(getCachedWeatherIfValid(inputCity));
        return;
      }
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(inputCity)}&units=metric&appid=${apiKey}`;
      const xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.onload = function() {
        var _a2;
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          data.currentTime = (/* @__PURE__ */ new Date()).toISOString();
          setTodayWeather(data);
          setCache((prevCache) => ({
            ...prevCache,
            [data.name]: data
          }));
          if (!isInit) {
            const prevHistory = JSON.parse(localStorage.getItem("searchHistory") || "[]");
            const filteredHistory = prevHistory.filter((item) => {
              var _a3;
              return item.city !== (data == null ? void 0 : data.name) || item.country !== ((_a3 = data == null ? void 0 : data.sys) == null ? void 0 : _a3.country);
            });
            const newEntry = {
              city: data == null ? void 0 : data.name,
              country: (_a2 = data == null ? void 0 : data.sys) == null ? void 0 : _a2.country,
              time: (/* @__PURE__ */ new Date()).toISOString()
            };
            let updatedHistory = [newEntry, ...filteredHistory];
            if (updatedHistory.length > historyLimit) {
              updatedHistory = updatedHistory.slice(0, historyLimit);
            }
            localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
            setHistory(updatedHistory);
          }
          cityRef.current.value = "";
          setNoCityFound(false);
        } else {
          setNoCityFound(true);
        }
      };
      xhr.onerror = function() {
        console.error("Request failed");
      };
      xhr.send();
    }
  };
  const getWeatherImg = (weather2 = "") => {
    switch (weather2) {
      case "Clear":
        return "/images/Clear.png";
      case "Clouds":
        return "/images/Clouds.png";
      default:
        return "/images/Clouds.png";
    }
  };
  useEffect(() => {
    var _a2, _b2;
    if (!todayWeather) getTodayWeather();
    else {
      setWeatherImg(getWeatherImg((_b2 = (_a2 = todayWeather == null ? void 0 : todayWeather.weather) == null ? void 0 : _a2[0]) == null ? void 0 : _b2.main));
    }
  }, [todayWeather]);
  return /* @__PURE__ */ jsx("div", {
    className: `${theme === "light" ? "bg-[url('/images/bglight.png')]" : "bg-[url('/images/bgdark.png')]"} pt-[26px] flex min-h-screen relative`,
    children: /* @__PURE__ */ jsxs("div", {
      className: "max-w-[700px] w-full mx-auto max-[700px]:px-[18px] mb-[20px] relative",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "grid grid-cols-[1fr_auto] gap-[20px] max-[700px]:gap-[10px]",
        children: [/* @__PURE__ */ jsxs("div", {
          className: `${theme === "light" ? `bg-[#B9A5E8] ` : `bg-[#382B6A]`} relative rounded-[20px] px-[22px] py-[3px] h-[60px] flex flex-col gap-[2px] max-[700px]:rounded-[8px] max-[700px]:h-[40px] max-[700px]:px-[11px]`,
          children: [/* @__PURE__ */ jsx("p", {
            className: `${theme === "light" ? `text-[#00000066]` : `text-[#FFFFFF66]`}  text-[10px]`,
            children: "Country"
          }), /* @__PURE__ */ jsx("input", {
            ref: cityRef,
            type: "text",
            className: `${theme === "light" ? `text-[#000000]` : `text-white`} max-[700px]:text-[12px] focus:outline-none focus:ring-0 focus:border-none`
          }), noCityFound && /* @__PURE__ */ jsx("div", {
            className: "rounded-sm border border-solid border-[red] bg-red-100 p-2 absolute top-[70px] left-[20px] ",
            children: /* @__PURE__ */ jsx("p", {
              className: "text-red-500 text-xs",
              children: "No city found, please try another city."
            })
          })]
        }), /* @__PURE__ */ jsx("div", {
          onClick: () => getTodayWeather(),
          className: `${theme === "light" ? `bg-[#6C40B5]` : `bg-[#28124C]`} rounded-[20px] w-[60px]  h-[60px] max-[700px]:h-[40px] max-[700px]:w-[40px] max-[700px]:rounded-[8px] flex items-center justify-center cursor-pointer`,
          children: /* @__PURE__ */ jsx("img", {
            src: "/images/search.png",
            alt: "Search",
            className: "w-[34px] h-[34px] max-[700px]:w-[22px] max-[700px]:h-[22px]"
          })
        })]
      }), /* @__PURE__ */ jsx("div", {
        className: "pt-[112px] max-[700px]:pt-[139px]",
        children: /* @__PURE__ */ jsxs("div", {
          className: `${theme === "light" ? `border border-solid border-[#FFFFFF80] bg-[#FFFFFF33]` : `bg-[#4B3690]`} rounded-[40px] relative  px-[40px] pt-[46px] pb-[26px] max-[700px]:p-[20px] max-[700px]:rounded-[20px]`,
          children: [todayWeather && /* @__PURE__ */ jsxs("div", {
            className: "cursor-context-menu grid max-[700px]:grid-cols-2 items-end",
            children: [/* @__PURE__ */ jsxs("div", {
              className: "",
              children: [/* @__PURE__ */ jsx("p", {
                className: `${theme === "light" ? `text-[#000000]` : `text-white`} text-[16px]`,
                children: "Today’s Weather"
              }), /* @__PURE__ */ jsxs("p", {
                className: `${theme === "light" ? `text-[#6C40B5]` : `text-white`} pt-[18px]  text-[80px] leading-[70px] font-bold`,
                children: [`${Math.ceil((_a = todayWeather == null ? void 0 : todayWeather.main) == null ? void 0 : _a.temp)}`, "°"]
              }), /* @__PURE__ */ jsxs("p", {
                className: `${theme === "light" ? `text-[#000000]` : `text-white`} pt-[10px] text-[16px] `,
                children: [`H: ${Math.ceil((_b = todayWeather == null ? void 0 : todayWeather.main) == null ? void 0 : _b.temp_max)}`, "°", ` L: ${Math.ceil((_c = todayWeather == null ? void 0 : todayWeather.main) == null ? void 0 : _c.temp_min)}`, "°"]
              }), /* @__PURE__ */ jsxs("div", {
                className: `${theme === "light" ? `text-[#666666]` : `text-white`} flex justify-between items-center text-[16px]`,
                children: [/* @__PURE__ */ jsx("p", {
                  className: "font-bold",
                  children: `${todayWeather == null ? void 0 : todayWeather.name}, ${(_d = todayWeather == null ? void 0 : todayWeather.sys) == null ? void 0 : _d.country}`
                }), /* @__PURE__ */ jsx("p", {
                  className: "max-[700px]:hidden",
                  children: format(new Date(todayWeather == null ? void 0 : todayWeather.currentTime), "dd-MM-yyyy hh:mm a")
                }), /* @__PURE__ */ jsxs("p", {
                  className: "max-[700px]:hidden",
                  children: [`Humidity: ${(_e = todayWeather == null ? void 0 : todayWeather.main) == null ? void 0 : _e.humidity}`, "%"]
                }), /* @__PURE__ */ jsx("p", {
                  className: "max-[700px]:hidden",
                  children: (_g = (_f = todayWeather == null ? void 0 : todayWeather.weather) == null ? void 0 : _f[0]) == null ? void 0 : _g.main
                })]
              }), weatherImg && /* @__PURE__ */ jsx("div", {
                className: "absolute top-[-95px] right-[10px] flex items-center justify-center",
                children: /* @__PURE__ */ jsx("img", {
                  src: weatherImg,
                  alt: "Weather Icon",
                  className: "w-[300px] h-[300px] max-[700px]:w-[13rem] max-[700px]:h-[13rem]"
                })
              })]
            }), /* @__PURE__ */ jsxs("div", {
              className: "min-[700px]:hidden flex flex-col justify-end items-end gap-y-[13px] text-[#666666] text-[14px]",
              children: [/* @__PURE__ */ jsx("p", {
                children: (_i = (_h = todayWeather == null ? void 0 : todayWeather.weather) == null ? void 0 : _h[0]) == null ? void 0 : _i.main
              }), /* @__PURE__ */ jsxs("p", {
                children: [`Humidity: ${(_j = todayWeather == null ? void 0 : todayWeather.main) == null ? void 0 : _j.humidity}`, "%"]
              }), /* @__PURE__ */ jsx("p", {
                children: format(new Date(todayWeather == null ? void 0 : todayWeather.currentTime), "dd-MM-yyyy hh:mm a")
              })]
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: `${theme === "light" ? `bg-[#FFFFFF33]` : `bg-[#3B2D6C]`} rounded-[24px] px-[20px] py-[23px] mt-[26px] max-[700px]:px-[17px] max-[700px]:py-[22px]`,
            children: [/* @__PURE__ */ jsx("p", {
              className: `${theme === "light" ? `text-[#000000]` : `text-white`} text-[16px] cursor-context-menu`,
              children: "Search History"
            }), /* @__PURE__ */ jsx(History, {
              history,
              setHistory,
              getTodayWeather,
              theme
            })]
          })]
        })
      }), /* @__PURE__ */ jsx("div", {
        className: "absolute right-[10px] bottom-[100px] ",
        children: /* @__PURE__ */ jsx("div", {
          className: "border border-solid border-white rounded-full w-[40px] h-[40px] bg-[#e8e8e8ce] flex flex-wrap justify-center items-center",
          children: /* @__PURE__ */ jsx("div", {
            title: "Toggle Theme",
            className: `${theme == "light" ? `bg-[#4D3BB6]` : `bg-[#A389E0]`} rounded-full w-[30px] h-[30px]  flex items-center justify-center cursor-pointer`,
            onClick: () => setTheme(theme === "light" ? "dark" : "light")
          })
        })
      })]
    })
  });
});
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: weather
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-iUu85MFR.js", "imports": ["/assets/chunk-C37GKA54-BMHwpGcR.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": true, "module": "/assets/root-C2RclIOt.js", "imports": ["/assets/chunk-C37GKA54-BMHwpGcR.js"], "css": ["/assets/root-D7aBs_Oy.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/weather": { "id": "routes/weather", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/weather-D1snMV18.js", "imports": ["/assets/chunk-C37GKA54-BMHwpGcR.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-8948df1f.js", "version": "8948df1f", "sri": void 0 };
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "unstable_middleware": false, "unstable_optimizeDeps": false, "unstable_splitRouteModules": false, "unstable_subResourceIntegrity": false, "unstable_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const routeDiscovery = { "mode": "lazy", "manifestPath": "/__manifest" };
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/weather": {
    id: "routes/weather",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route1
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routeDiscovery,
  routes,
  ssr
};
