<div align="center">

# 🧠 BrainHeal

### *All the bright places*

**India's first premium therapist collective - connecting you with verified clinical experts for meaningful, long-term healing.**

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com)
[![Tailwind](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)](https://brainheal.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

[**🌐 Live Demo**](https://brainheal.vercel.app) · [**📋 Features**](#features) · [**🚀 Quick Start**](#quick-start)

</div>

---

## ✨ Features

| | Feature | Description |
|---|---|---|
| 🎬 | **Cinematic Homepage** | Full-screen video hero with gradient text, smooth animations, and a premium therapist collective showcase |
| 🧠 | **Therapy Booking** | Browse & book therapists with category filters, concern tags, ratings, real-time availability, and pricing - **2-column desktop grid** |
| 💬 | **Anonymous Community** | Safe space with **24h auto-expiry posts**, mood tags, 4 reaction types (❤️🤗💪🙏), threaded replies, and random anonymous identities |
| 📱 | **Bottom Navigation** | Glassmorphism nav bar with **bouncy sliding pill** indicator and spring animations (mobile) |
| 🖥️ | **Desktop Navigation** | Integrated top nav with page switching, active indicators, and seamless transitions |
| 🔥 | **Real-time Sync** | Firebase Firestore powers live data for community posts, reactions, and therapist listings |
| 🎨 | **Premium Design** | Glassmorphism, gradient avatars, micro-animations, responsive layouts, Instrument Serif + Inter typography |
| 🔒 | **Privacy First** | Anonymous posting with randomly generated names (*"Brave Lotus"*, *"Gentle Phoenix"*) and gradient avatars |
| ⏰ | **24h Auto-Expiry** | Community posts automatically vanish with live countdown bars (🟢→🟡→🔴) |
| 📊 | **Community Pulse** | Desktop sidebar showing real-time stats: active posts, reactions sent, total replies |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── BottomNav.tsx        # Glassmorphism mobile nav
│   ├── Navigation.tsx       # Desktop + mobile navigation
│   ├── Hero.tsx             # Video hero section
│   ├── Services.tsx         # Therapy categories (animated cards)
│   ├── Providers.tsx        # Therapist collective showcase
│   ├── Reviews.tsx          # Testimonial bubbles
│   ├── FAQ.tsx              # Accordion FAQ
│   └── ...                  # WhatsIncluded, HowItWorks, Stats, etc.
├── pages/
│   ├── Website.tsx          # Main layout + page routing
│   ├── TherapyPage.tsx      # Therapist browsing + booking
│   └── CommunityPage.tsx    # Anonymous community feed
├── DataContext.tsx           # Global state + Firebase sync
├── defaultData.ts           # Default data schema
├── firebase.ts              # Firebase config
└── index.css                # Tailwind v4 + custom styles
```

---

## 🚀 Quick Start

```bash
# Clone the repo
git clone https://github.com/ideafy1/brainheal.git
cd brainheal

# Install dependencies
bun install

# Start dev server
bun run dev

# Build for production
bun run build
```

### Environment

Create a Firebase project and update `src/firebase.ts` with your config. Enable **Firestore** and set rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 18 + TypeScript |
| **Build** | Vite 6 |
| **Styling** | Tailwind CSS v4 |
| **Database** | Firebase Firestore (real-time) |
| **Icons** | Lucide React |
| **Fonts** | Instrument Serif, Inter (Google Fonts) |
| **Deploy** | Vercel |
| **Runtime** | Bun |

---

## 📱 Responsive Design

| Mobile | Desktop |
|---|---|
| Bottom nav with sliding pill | Top navigation with page tabs |
| Single column layouts | 2-column therapy grid |
| Compact cards | Expanded cards with larger images |
| Full-width feed | Feed + sidebar (Community Pulse) |

---

<div align="center">

**Built with ❤️ for mental health in India**

*© 2026 BrainHeal India. All rights reserved.*

</div>
