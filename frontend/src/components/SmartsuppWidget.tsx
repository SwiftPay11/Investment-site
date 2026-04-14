import { useEffect } from "react";

export default function SmartsuppWidget({ keyId = "b6ec3e0e2bebcce07b263ca461ed392d9ed41854" }) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Prevent loading multiple times
    if (window.smartsupp) return;

    window._smartsupp = window._smartsupp || {};
    window._smartsupp.key = keyId;

    (function (d) {
      var s, c;
      s = d.createElement("script");
      s.type = "text/javascript";
      s.charset = "utf-8";
      s.async = true;
      s.src = "https://www.smartsuppchat.com/loader.js?";
      c = d.getElementsByTagName("script")[0];
      c.parentNode.insertBefore(s, c);
    })(document);
  }, [keyId]);

  return null;
}
