"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { Link, Copy, Check, ArrowRight, QrCode } from "lucide-react";

function QRGenerator() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  const data = searchParams.get("data");
  const decodedData = data ? (() => {
    try {
      return atob(data);
    } catch {
      return "";
    }
  })() : "";
  
  const generated = !!decodedData;

  const generateQR = () => {
    if (!input.trim()) return;
    const encoded = btoa(input);
    router.push(`/?data=${encoded}`);
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

  const createNew = () => {
    setInput("");
    router.push("/");
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
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

        <div className="glass-card rounded-3xl p-6 sm:p-8">
          {!generated ? (
            <div className="space-y-6">
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
                    value={input}
                    size={200}
                    level="H"
                    includeMargin={false}
                    bgColor="transparent"
                    fgColor="#ffffff"
                    imageSettings={{
                      src: "",
                      height: 0,
                      width: 0,
                      excavate: false,
                    }}
                  />
                </div>
              </div>

              <div className="text-center">
                <p className="text-white/50 text-xs mb-2">Your QR code contains:</p>
                <p className="text-white/80 text-sm truncate max-w-full px-4">
                  {input}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={copyLink}
                  className="flex-1 glass hover:bg-white/10 py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-green-400" />
                      <span className="text-sm">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span className="text-sm">Copy Link</span>
                    </>
                  )}
                </button>
                <button
                  onClick={createNew}
                  className="flex-1 glow-button py-3 rounded-xl flex items-center justify-center gap-2"
                >
                  <QrCode className="w-4 h-4" />
                  <span className="text-sm">New QR</span>
                </button>
              </div>
            </div>
          )}
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
    <Suspense fallback={
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
    }>
      <QRGenerator />
    </Suspense>
  );
}
