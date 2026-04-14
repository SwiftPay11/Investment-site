"use client";

import { useEffect } from "react";

export default function SmartsuppWidget({
  keyId = "b6ec3e0e2bebcce07b263ca461ed392d9ed41854",
}: {
  keyId?: string;
}) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // prevent double load
    if ((window as any).smartsuppLoaded) return;
    (window as any).smartsuppLoaded = true;

    (window as any)._smartsupp = (window as any)._smartsupp || {};
    (window as any)._smartsupp.key = keyId;

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.charset = "utf-8";
    script.async = true;
    script.src = "https://www.smartsuppchat.com/loader.js?";

    document.body.appendChild(script);
  }, [keyId]);

  return null;
}