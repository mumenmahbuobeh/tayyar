# Tayyar (تيّار) — Next-Gen Multi-Connection Download Manager

<p align="center">
  <img src="renderer/assets/icon.png" alt="Tayyar Logo" width="96" height="96" onerror="this.style.display='none'"/>
</p>

<p align="center">
  <strong>High-Speed, Resilient, Open-Source Universal Download Manager for Desktop & Mobile</strong><br>
  <em>Designed and Developed by <strong>Mu'men Mahbuobeh</strong></em>
</p>

<p align="center">
  <a href="https://github.com/mumenmahbuobeh/tayyar/releases"><img src="https://img.shields.io/github/v/release/mumenmahbuobeh/tayyar?color=06b6d4&style=flat-square" alt="Latest Release"/></a>
  <a href="https://github.com/mumenmahbuobeh/tayyar/actions"><img src="https://img.shields.io/github/actions/workflow/status/mumenmahbuobeh/tayyar/build.yml?branch=main&style=flat-square" alt="Build Status"/></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square" alt="License"/></a>
  <img src="https://img.shields.io/badge/platforms-Windows%20%7C%20Linux%20%7C%20macOS%20%7C%20Android-38bdf8?style=flat-square" alt="Supported Platforms"/>
  <img src="https://img.shields.io/badge/language-English%20%7C%20Arabic%20(RTL)-10b981?style=flat-square" alt="Languages"/>
</p>

---

## 📥 Downloads & Binary Releases

Download the official ready-to-run packages directly from [GitHub Releases v1.0.15](https://github.com/mumenmahbuobeh/tayyar/releases/tag/v1.0.15):

| Platform | Format | Direct Download / Package | Release Status |
| :--- | :--- | :--- | :--- |
| **Windows** | `.exe` (Installer) | [📥 Download Tayyar-Setup-1.0.15.exe](https://github.com/mumenmahbuobeh/tayyar/releases/download/v1.0.15/Tayyar-Setup-1.0.15.exe) | ✅ Available |
| **Windows** | `.exe` (Portable) | [📥 Download Tayyar-1.0.15.exe](https://github.com/mumenmahbuobeh/tayyar/releases/download/v1.0.15/Tayyar-1.0.15.exe) | ✅ Available |
| **Android** | `.apk` (Mobile) | [📱 Download Tayyar-Android-v1.0.15.apk](https://github.com/mumenmahbuobeh/tayyar/releases/download/v1.0.15/Tayyar-Android-v1.0.15.apk) | ✅ Available |
| **iOS** | `.ipa` (iPhone/iPad) | [🍏 Download Tayyar-iOS-v1.0.15.ipa](https://github.com/mumenmahbuobeh/tayyar/releases/download/v1.0.15/Tayyar-iOS-v1.0.15.ipa) | ✅ Available |
| **macOS** | `.dmg` (Universal) | [🍎 Download Tayyar-1.0.15.dmg](https://github.com/mumenmahbuobeh/tayyar/releases/download/v1.0.15/Tayyar-1.0.15.dmg) | ✅ Available |
| **Linux** | `.AppImage` | [🐧 Download Tayyar-1.0.15.AppImage](https://github.com/mumenmahbuobeh/tayyar/releases/download/v1.0.15/Tayyar-1.0.15.AppImage) | ✅ Available |
| **Linux** | `.deb` (Debian/Ubuntu) | [📦 Download tayyar_1.0.15_amd64.deb](https://github.com/mumenmahbuobeh/tayyar/releases/download/v1.0.15/tayyar_1.0.15_amd64.deb) | ✅ Available |

---

## ⚡ Highlights & Key Features

### 1. Dynamic Multi-Threaded Chunking (Turbo Engine)
* **Up to 64 Concurrent Connections:** Downloads files in dynamically calculated chunks using HTTP Range requests.
* **Smart End-Game Acceleration:** Automatically sub-divides remaining slow segments across faster idle threads to prevent hanging downloads.
* **Resumable Transfers:** Full session persistence across network dropouts, app restarts, or crashes.

### 2. Universal Support for 200+ File Formats
Tayyar natively identifies, captures, and categorizes over 200 file formats into dedicated directories:
* **Archives & Compressed:** `7Z`, `ZIP`, `RAR`, `TAR`, `GZ`, `BZ2`, `XZ`, `ZST`, `ISO`, `DMG`, `CAB`, `ARJ`, `CPIO`, `00*`, `R0*–R9*`
* **Video & Streams:** `MP4`, `MKV`, `AVI`, `WEBM`, `MOV`, `FLV`, `TS`, `M2TS`, `VOB`, `WMV`, `3GP`, `MPEG`, `MXF`
* **Audio & Lossless:** `MP3`, `FLAC`, `WAV`, `AAC`, `OGG`, `M4A`, `OPUS`, `AIFF`, `APE`, `TTA`, `WV`
* **Documents & E-Books:** `PDF`, `DOCX`, `XLSX`, `PPTX`, `EPUB`, `MOBI`, `AZW3`, `DJVU`, `FB2`, `RTF`, `CSV`, `JSONL`
* **AI & Machine Learning Models:** `GGUF`, `GGML`, `SAFETENSORS`, `CKPT`, `ONNX`, `PT`, `PTH`, `BIN`, `TFLITE`, `PARQUET`, `ARROW`
* **Applications & Installers:** `EXE`, `MSI`, `APK`, `APKM`, `APKS`, `AAB`, `DEB`, `RPM`, `APPIMAGE`, `SNAP`, `FLATPAK`, `PKG`, `DMG`
* **3D, CAD & Graphics:** `BLEND`, `OBJ`, `FBX`, `GLTF`, `GLB`, `STL`, `STEP`, `STP`, `DWG`, `DXF`, `USDZ`, `C4D`, `MAX`, `MA`

### 3. Worldwide Server Resilience (Russian, Chinese, Iranian & Restricted CDNs)
* **Regional CA Resilience:** Transparent handling of servers using sovereign or self-signed TLS certificates (e.g. Russian MinTsifry/GOST, Iranian national infrastructure, Chinese academic/corporate CDNs).
* **Anti-Hotlinking Spoofing:** Dynamic `User-Agent` and `Referer` spoofing for services that restrict downloads to active browser sessions (e.g., Yandex Disk, Baidu Wangpan, 1fichier, Rapidgator, Aparat).
* **Cross-Encoding Resilient Filename Parser:** Seamlessly handles filenames in UTF-8, RFC 5987, Windows-1256 (Arabic), Windows-1251 (Cyrillic), and GBK/GB2312 (Chinese).

### 4. Browser Integration & Extensions
Ready-to-use extension integration for all major web browsers:
* **Supported Browsers:** Google Chrome, Microsoft Edge, Mozilla Firefox, Apple Safari, Brave, Opera, Vivaldi, Arc.
* **Features:**
  * One-click download interception.
  * Floating media sniffer button (IDM-style) on HTML5 video & audio elements.
  * Context menu integration (`Download with Tayyar`).

### 5. Modern Bilingual Bento Grid UI
* **Bilingual Experience:** Native toggle between English (`LTR`) and Arabic (`RTL`) with layout realignment.
* **Collapsible Sidebar:** Toggle between full-width drawer and compact 68px icon dock.
* **Customizable Dashboard:** Real-time speed charts, NAT status, activity heatmap, transfer metrics, and speed limiter presets (Unlimited 🐇, Eco 🐢, Slow 🐌).
* **Built-in Tracker & Plugin Management:** Real-time BitTorrent / acceleration tracker probing with health latency status.

---

## 🛠️ Technology Stack

* **Core Desktop Runtime:** [Electron 33](https://www.electronjs.org/) + Node.js 20
* **Mobile Runtime (Android & iOS):** [Capacitor 7](https://capacitorjs.com/)
* **Engine:** Pure Node.js high-performance asynchronous multi-threaded streams (`http`, `https`, `net`, `crypto`, `fs`)
* **Styling & UI:** Pure Vanilla CSS3 with GPU-accelerated Glassmorphism (zero heavy framework overhead)
* **Packaging:** `electron-builder` + Gradle / Android Studio toolchain

---

## 🚀 Development & Build Instructions

### Prerequisites
* [Node.js](https://nodejs.org/) v20+
* [npm](https://www.npmjs.com/) v10+
* (For Android APK builds) Java JDK 17 & Android Studio / Android SDK

### 1. Clone & Install
```bash
git clone https://github.com/mumenmahbuobeh/tayyar.git
cd tayyar
npm install
```

### 2. Run in Development Mode
```bash
npm start
```

### 3. Run Self-Test Suite
```bash
npm test
```

### 4. Build Desktop Packages
```bash
# Windows (.exe installer & portable binary)
npm run dist:win

# Linux (.AppImage & .deb packages)
npm run dist:linux

# macOS (.dmg disk image)
npm run dist:mac
```

### 5. Build Android APK
```bash
# Sync web renderer with Android project
npm run build:android

# Build debug APK with Gradle
cd android
./gradlew assembleDebug

# Output APK path:
# android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 📱 Mobile Architecture (Android)

Tayyar's responsive UI adapts smoothly to mobile screens via Capacitor. To open and inspect the native Android project in Android Studio:
```bash
npm run open:android
```

---

## 👨‍💻 Author & Attribution

* **Author & Lead Developer:** **Mu'men Mahbuobeh**
* **GitHub Profile:** [@mumenmahbuobeh](https://github.com/mumenmahbuobeh)
* **Repository:** [https://github.com/mumenmahbuobeh/tayyar](https://github.com/mumenmahbuobeh/tayyar)

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use, modify, distribute, and contribute.  
See the [LICENSE](LICENSE) file for complete details.
