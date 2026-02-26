# QrLink - Free QR Code Generator

<p align="center">
  <a href="https://qrlink-weld.vercel.app">
    <img src="https://img.shields.io/badge/Visit-Live%20Demo-brightgreen?style=for-the-badge" alt="Live Demo">
  </a>
  <a href="https://github.com/henglyrepo/QRLINK">
    <img src="https://img.shields.io/github/stars/henglyrepo/QRLINK?style=for-the-badge" alt="Stars">
  </a>
  <a href="https://github.com/henglyrepo/QRLINK/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" alt="License">
  </a>
</p>

QrLink is a free, open-source QR code generator built with Next.js 16 and React 19. Create beautiful, customizable QR codes instantly with support for logos, custom colors, and multiple export formats.

## Features

- **Instant QR Generation** - Create QR codes in seconds with just a URL or text input
- **Custom Colors** - Customize foreground and background colors
- **Logo Support** - Add your logo or brand image to the QR code center
- **Size Options** - Adjust QR code size from 150px to 400px
- **Error Correction** - Select from L, M, Q, H error correction levels
- **Download Options** - Export as PNG or SVG format
- **Copy to Clipboard** - Copy QR code image directly
- **Share Buttons** - Share QR codes to Twitter, Facebook, and LinkedIn
- **Local History** - Automatically save and access recently generated QR codes
- **SEO Optimized** - Full metadata, Open Graph, and structured data support
- **AdSense Ready** - Integrated AdSense support for monetization

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS v4
- **QR Generation**: qrcode.react
- **Icons**: Lucide React
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/henglyrepo/QRLINK.git

# Navigate to project directory
cd QrLink

# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Linting

```bash
# Run ESLint
npm run lint

# Auto-fix ESLint issues
npm run lint --fix
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variable (optional):
   - `NEXT_PUBLIC_GOOGLE_ADSENSE_ID` = your AdSense publisher ID
4. Deploy!

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_GOOGLE_ADSENSE_ID` | AdSense publisher ID | No |
| `NEXT_PUBLIC_SITE_URL` | Your site URL for SEO | No |

## AdSense Setup

To monetize with Google AdSense:

1. Create an AdSense account at [adsense.google.com](https://adsense.google.com)
2. Add your site to AdSense
3. Copy your publisher ID to `.env.local`:
   ```
   NEXT_PUBLIC_GOOGLE_ADSENSE_ID=ca-pub-xxxxxxxxxxxxxxxx
   ```
4. Deploy and wait for Google to verify your site

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Experimental Disclaimer

**QrLink is provided as-is for educational and personal use.**

- This is an experimental project and may contain bugs or unexpected behavior
- Generated QR codes should be tested before use in production environments
- We make no warranties about the reliability, accuracy, or completeness of generated QR codes
- Users are responsible for ensuring their QR codes meet their specific scanning requirements
- The developers assume no liability for any damages arising from the use of this tool
- Features may change without notice

## Support

If you encounter any issues or have suggestions:

- Open an issue on [GitHub](https://github.com/henglyrepo/QRLINK/issues)
- Star the repository if you find it useful!

---

<p align="center">Made with ❤️ by <a href="https://github.com/henglyrepo">Hengly</a></p>
