"use client";

import { useState, Suspense, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import {
  Link,
  Copy,
  Check,
  ArrowRight,
  QrCode,
  Download,
  Share2,
  Trash2,
  Settings,
  Image as ImageIcon,
  X,
  Twitter,
  Facebook,
  Linkedin,
} from "lucide-react";
import AdUnit from "@/components/Ads/AdUnit";

interface QRHistory {
  id: string;
  data: string;
  timestamp: number;
  logo?: string;
  fgColor?: string;
  bgColor?: string;
}

const DEFAULT_FG = "#ffffff";
const DEFAULT_BG = "transparent";

const getInitialHistory = (): QRHistory[] => {
  if (typeof window === "undefined") return [];
  const saved = localStorage.getItem("qrlink-history");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  }
  return [];
};

function QRGenerator() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const qrRef = useRef<SVGSVGElement>(null);

  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);
  const [copiedQr, setCopiedQr] = useState(false);
  const [history, setHistory] = useState<QRHistory[]>(getInitialHistory);
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const [fgColor, setFgColor] = useState(DEFAULT_FG);
  const [bgColor, setBgColor] = useState(DEFAULT_BG);
  const [qrSize, setQrSize] = useState(200);
  const [logoUrl, setLogoUrl] = useState("");
  const [logoSize] = useState(40);
  const [errorLevel, setErrorLevel] = useState<"L" | "M" | "Q" | "H">("H");

  const data = searchParams.get("data");
  const decodedData = data
    ? (() => {
        try {
          return atob(data);
        } catch {
          return "";
        }
      })()
    : "";

  const generated = !!decodedData;

  useEffect(() => {
    if (typeof window !== "undefined" && history.length > 0) {
      localStorage.setItem("qrlink-history", JSON.stringify(history));
    }
  }, [history]);

  const generateQR = useCallback(() => {
    if (!input.trim()) return;
    const encoded = btoa(input);
    router.push(`/?data=${encoded}`);

    const newHistory: QRHistory = {
      id: Date.now().toString(),
      data: input,
      timestamp: Date.now(),
      logo: logoUrl || undefined,
      fgColor: fgColor !== DEFAULT_FG ? fgColor : undefined,
      bgColor: bgColor !== DEFAULT_BG ? bgColor : undefined,
    };
    setHistory((prev) => [newHistory, ...prev.slice(0, 19)]);
  }, [input, router, logoUrl, fgColor, bgColor]);

  const generateFromHistory = (item: QRHistory) => {
    setInput(item.data);
    if (item.logo) setLogoUrl(item.logo);
    if (item.fgColor) setFgColor(item.fgColor);
    if (item.bgColor) setBgColor(item.bgColor);
    const encoded = btoa(item.data);
    router.push(`/?data=${encoded}`);
  };

  const deleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("qrlink-history");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      generateQR();
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyQRImage = async () => {
    if (!qrRef.current) return;
    try {
      const svgData = new XMLSerializer().serializeToString(qrRef.current);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);

      img.onload = async () => {
        canvas.width = qrSize;
        canvas.height = qrSize;
        if (bgColor !== "transparent") {
          ctx!.fillStyle = bgColor;
          ctx!.fillRect(0, 0, qrSize, qrSize);
        }
        ctx!.drawImage(img, 0, 0, qrSize, qrSize);
        URL.revokeObjectURL(url);

        canvas.toBlob(async (blob) => {
          if (blob) {
            await navigator.clipboard.write([
              new ClipboardItem({ "image/png": blob }),
            ]);
            setCopiedQr(true);
            setTimeout(() => setCopiedQr(false), 2000);
          }
        });
      };
      img.src = url;
    } catch (err) {
      console.error("Failed to copy QR:", err);
    }
  };

  const downloadQR = (format: "png" | "svg") => {
    if (!qrRef.current) return;

    if (format === "svg") {
      const svgData = new XMLSerializer().serializeToString(qrRef.current);
      const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `qrcode-${Date.now()}.svg`;
      link.click();
      URL.revokeObjectURL(url);
    } else {
      const svgData = new XMLSerializer().serializeToString(qrRef.current);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        canvas.width = qrSize;
        canvas.height = qrSize;
        if (bgColor !== "transparent") {
          ctx!.fillStyle = bgColor;
          ctx!.fillRect(0, 0, qrSize, qrSize);
        }
        ctx!.drawImage(img, 0, 0, qrSize, qrSize);
        URL.revokeObjectURL(url);

        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = `qrcode-${Date.now()}.png`;
        link.click();
      };
      img.src = url;
    }
  };

  const shareToSocial = (platform: string) => {
    const url = window.location.href;
    const text = `Check out this QR code I created with QrLink!`;
    let shareUrl = "";

    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
  };

  const createNew = () => {
    setInput("");
    setShowSettings(false);
    setShowShare(false);
    router.push("/");
  };

  const qrValue = decodedData || input;

  return (
    <main className="min-h-screen flex flex-col items-center p-4 sm:p-8">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl glass-card mb-4 animate-float">
            <QrCode className="w-8 h-8 text-indigo-400" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-2">
            <span className="gradient-text">QrLink</span>
          </h1>
          <p className="text-white/50 text-sm sm:text-base">
            Generate beautiful QR codes instantly
          </p>
        </div>

        {!generated && (
          <div className="mb-4">
            <AdUnit adSlot="1234567890" adFormat="horizontal" className="mx-auto" />
          </div>
        )}

        <div className="glass-card rounded-3xl p-6 sm:p-8">
          {!generated ? (
            <div className="space-y-6">
              {history.length > 0 && (
                <div>
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="text-white/60 text-sm hover:text-white flex items-center gap-2 transition-colors"
                  >
                    <QrCode className="w-4 h-4" />
                    Recent QR Codes ({history.length})
                  </button>
                  {showHistory && (
                    <div className="mt-3 grid grid-cols-4 gap-2">
                      {history.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => generateFromHistory(item)}
                          className="relative group cursor-pointer"
                        >
                          <div className="glass p-2 rounded-lg">
                            <QRCodeSVG
                              value={item.data}
                              size={60}
                              level="L"
                              bgColor="transparent"
                              fgColor="#ffffff"
                            />
                          </div>
                          <button
                            onClick={(e) => deleteHistoryItem(item.id, e)}
                            className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Link className="w-5 h-5 text-white/30" />
                </div>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Enter URL or text..."
                  className="w-full input-glass rounded-xl py-4 pl-12 pr-4 text-white text-base"
                  autoFocus
                />
              </div>

              <button
                onClick={() => setShowSettings(!showSettings)}
                className="text-white/60 text-sm hover:text-white flex items-center gap-2 transition-colors"
              >
                <Settings className="w-4 h-4" />
                {showSettings ? "Hide" : "Show"} Customization Options
              </button>

              {showSettings && (
                <div className="glass rounded-xl p-4 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="text-white/60 text-xs block mb-2">Foreground Color</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={fgColor}
                          onChange={(e) => setFgColor(e.target.value)}
                          className="w-10 h-10 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={fgColor}
                          onChange={(e) => setFgColor(e.target.value)}
                          className="input-glass rounded px-2 py-1 text-white text-sm flex-1"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="text-white/60 text-xs block mb-2">Background Color</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={bgColor === "transparent" ? "#000000" : bgColor}
                          onChange={(e) => setBgColor(e.target.value)}
                          className="w-10 h-10 rounded cursor-pointer"
                        />
                        <button
                          onClick={() => setBgColor("transparent")}
                          className="glass px-2 py-1 text-white/60 text-xs rounded"
                        >
                          Transparent
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-white/60 text-xs block mb-2">Size: {qrSize}px</label>
                    <input
                      type="range"
                      min="150"
                      max="400"
                      value={qrSize}
                      onChange={(e) => setQrSize(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-white/60 text-xs block mb-2">Error Correction</label>
                    <div className="flex gap-2">
                      {(["L", "M", "Q", "H"] as const).map((level) => (
                        <button
                          key={level}
                          onClick={() => setErrorLevel(level)}
                          className={`glass px-3 py-1 text-sm rounded ${
                            errorLevel === level ? "bg-indigo-500/50" : ""
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-white/60 text-xs block mb-2">Logo URL (optional)</label>
                    <input
                      type="text"
                      value={logoUrl}
                      onChange={(e) => setLogoUrl(e.target.value)}
                      placeholder="https://example.com/logo.png"
                      className="input-glass rounded-xl py-2 px-3 text-white text-sm w-full"
                    />
                  </div>
                </div>
              )}

              <button
                onClick={generateQR}
                disabled={!input.trim()}
                className="w-full glow-button text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Generate QR Code
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="glass p-6 rounded-2xl animate-pulse-glow">
                  <QRCodeSVG
                    ref={qrRef}
                    value={qrValue}
                    size={qrSize}
                    level={errorLevel}
                    includeMargin={false}
                    bgColor={bgColor}
                    fgColor={fgColor}
                    imageSettings={
                      logoUrl
                        ? {
                            src: logoUrl,
                            height: logoSize,
                            width: logoSize,
                            excavate: true,
                          }
                        : undefined
                    }
                  />
                </div>
              </div>

              <div className="text-center">
                <p className="text-white/50 text-xs mb-2">Your QR code contains:</p>
                <p className="text-white/80 text-sm truncate max-w-full px-4">{qrValue}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={copyLink}
                  className="flex-1 glass hover:bg-white/10 py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-green-400" />
                      <span className="text-sm">Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span className="text-sm">Copy Link</span>
                    </>
                  )}
                </button>
                <button
                  onClick={copyQRImage}
                  className="flex-1 glass hover:bg-white/10 py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  {copiedQr ? (
                    <>
                      <Check className="w-4 h-4 text-green-400" />
                      <span className="text-sm">QR Copied!</span>
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-4 h-4" />
                      <span className="text-sm">Copy QR</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => downloadQR("png")}
                  className="flex-1 glass hover:bg-white/10 py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span className="text-sm">PNG</span>
                </button>
                <button
                  onClick={() => downloadQR("svg")}
                  className="flex-1 glass hover:bg-white/10 py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span className="text-sm">SVG</span>
                </button>
                <button
                  onClick={() => setShowShare(!showShare)}
                  className="flex-1 glass hover:bg-white/10 py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="text-sm">Share</span>
                </button>
              </div>

              {showShare && (
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => shareToSocial("twitter")}
                    className="glass p-3 rounded-xl hover:bg-white/10 transition-all"
                  >
                    <Twitter className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => shareToSocial("facebook")}
                    className="glass p-3 rounded-xl hover:bg-white/10 transition-all"
                  >
                    <Facebook className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => shareToSocial("linkedin")}
                    className="glass p-3 rounded-xl hover:bg-white/10 transition-all"
                  >
                    <Linkedin className="w-5 h-5" />
                  </button>
                </div>
              )}

              <button
                onClick={createNew}
                className="w-full glow-button py-3 rounded-xl flex items-center justify-center gap-2"
              >
                <QrCode className="w-4 h-4" />
                <span className="text-sm">Create New QR Code</span>
              </button>

              <div className="mb-2">
                <AdUnit adSlot="9876543210" adFormat="rectangle" className="mx-auto" />
              </div>
            </div>
          )}
        </div>

        {history.length > 0 && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-white/60 text-sm">Recent QR Codes</h3>
              <button
                onClick={clearHistory}
                className="text-red-400/70 hover:text-red-400 text-xs flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                Clear All
              </button>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {history.slice(0, 10).map((item) => (
                <div
                  key={item.id}
                  onClick={() => generateFromHistory(item)}
                  className="relative group cursor-pointer"
                >
                  <div className="glass p-2 rounded-lg hover:bg-white/10 transition-colors">
                    <QRCodeSVG
                      value={item.data}
                      size={50}
                      level="L"
                      bgColor="transparent"
                      fgColor="#ffffff"
                    />
                  </div>
                  <button
                    onClick={(e) => deleteHistoryItem(item.id, e)}
                    className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-2 h-2" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4">
          <AdUnit adSlot="1122334455" adFormat="horizontal" className="mx-auto" />
        </div>

        <p className="text-center text-white/30 text-xs mt-6">
          Serverless • No storage • Instant sharing
        </p>
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8">
          <div className="w-full max-w-lg">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl glass-card mb-4 animate-float">
                <QrCode className="w-8 h-8 text-indigo-400" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold mb-2">
                <span className="gradient-text">QrLink</span>
              </h1>
            </div>
          </div>
        </main>
      }
    >
      <QRGenerator />
    </Suspense>
  );
}
