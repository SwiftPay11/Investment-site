import { useEffect } from "react";

export default function SmartsuppWidget({
  keyId = "b6ec3e0e2bebcce07b263ca461ed392d9ed41854",
}: {
  keyId?: string;
}) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Prevent loading multiple times
    if ((window as any).smartsupp) return;

    (window as any)._smartsupp = (window as any)._smartsupp || {};
    (window as any)._smartsupp.key = keyId;

    (function (d: Document) {
      const s = d.createElement("script");
      s.type = "text/javascript";
      s.charset = "utf-8";
      s.async = true;
      s.src = "https://www.smartsuppchat.com/loader.js?";

      const c = d.getElementsByTagName("script")[0] as
        | HTMLScriptElement
        | undefined;

      const parent = c?.parentNode;

      if (parent) {
        parent.insertBefore(s, c);
      } else if (d.head) {
        d.head.appendChild(s);
      } else {
        d.body.appendChild(s);
      }
    })(document);
  }, [keyId]);

  return null;
}