import "../app/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Disable Right Click
    document.addEventListener("contextmenu", (event) => event.preventDefault());

    // Disable DevTools Shortcuts
    document.addEventListener("keydown", (event) => {
      if (
        event.ctrlKey &&
        (event.key === "u" || event.key === "U" || event.key === "s" || event.key === "S")
      ) {
        event.preventDefault();
      }
      if (
        event.ctrlKey &&
        event.shiftKey &&
        (event.key === "I" || event.key === "i" || event.key === "J" || event.key === "j")
      ) {
        event.preventDefault();
      }
      if (event.key === "F12") {
        event.preventDefault();
      }
    });

    // Detect DevTools Opening - DISABLED FOR DEVELOPMENT
    /*
    setInterval(() => {
      let before = new Date().getTime();
      debugger;
      let after = new Date().getTime();
      if (after - before > 100) {
        document.body.innerHTML = "<h1>DevTools is not allowed!</h1>";
        setTimeout(() => {
          window.location.href = "about:blank";
        }, 1000);
      }
    }, 1000);

    // Detect DevTools via Resize
    window.addEventListener("resize", function () {
      if (window.outerWidth - window.innerWidth > 160) {
        document.body.innerHTML = "<h1>DevTools is not allowed!</h1>";
        setTimeout(() => {
          window.close();
        }, 1000);
      }
    });
    */

    return () => {
      // Cleanup event listeners
      document.removeEventListener("contextmenu", (event) => event.preventDefault());
      document.removeEventListener("keydown", (event) => event.preventDefault());
      window.removeEventListener("resize", () => { });
    };
  }, []);

  return <Component {...pageProps} />;
}
