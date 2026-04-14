import { useEffect } from "react";

export default function SmartsuppWidget({
  keyId = "b6ec3e0e2bebcce07b263ca461ed392d9ed41854",
}: {
  keyId?: string;
}) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // prevent double load
    if ((window as any).smartsupp) return;

    // EXACT equivalent of official script
    (window as any)._smartsupp = (window as any)._smartsupp || {};
    (window as any)._smartsupp.key = keyId;

    (window as any).smartsupp = function (...args: any[]) {
      ((window as any).smartsupp._ = (window as any).smartsupp._ || []).push(args);
    };
    (window as any).smartsupp._ = [];

    const s = document.getElementsByTagName("script")[0];
    const c = document.createElement("script");

    c.type = "text/javascript";
    c.charset = "utf-8";
    c.async = true;
    c.src = "https://www.smartsuppchat.com/loader.js?";

    if (s?.parentNode) {
      s.parentNode.insertBefore(c, s);
    } else {
      document.head.appendChild(c);
    }
  }, [keyId]);

  return null;
}