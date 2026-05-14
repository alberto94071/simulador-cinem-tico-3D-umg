# 🚀 SETUP INSTRUCTIONS - Newton Physics Simulator

## ✅ Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Modern browser with WebGL support (Chrome, Firefox, Safari, Edge)
- ~500MB free disk space (for node_modules)

---

## 📥 Step 1: Download the Project

The complete project is in the folder:
```
newton-simulator/
```

All files are ready to use - just follow the installation steps below.

---

## 💾 Step 2: Install Dependencies

Navigate to the project directory and install all required packages:

```bash
cd newton-simulator
npm install
```

This will install:
- ✅ Next.js 15
- ✅ React 19
- ✅ Three.js (3D graphics)
- ✅ React-Three-Fiber (React + Three.js bridge)
- ✅ @react-three/rapier (Physics engine)
- ✅ Tailwind CSS (Styling)
- ✅ TypeScript

**Expected time**: 2-5 minutes depending on internet speed

---

## 🏃 Step 3: Run Development Server

Start the development server:

```bash
npm run dev
```

You should see:
```
✓ Ready in 2.34s
✓ Compiled client and server successfully

➜  Local:        http://localhost:3000
➜  Network:      http://<your-ip>:3000
```

---

## 🌐 Step 4: Open in Browser

1. **Option A**: Click the link in terminal or go to: `http://localhost:3000`
2. **Option B**: Open browser and type: `localhost:3000`

You should see:
- 🏍️ Yellow motorcycle on a ramp (top 65%)
- 🎛️ Dashboard with red gauges (bottom 35%)
- 📊 Interactive controls ready to use

---

## 🎮 Step 5: Try the Simulator

1. **Drag the left gauge** → Increase/decrease initial velocity
2. **Drag the right gauge** → Change ramp angle (watch it rotate!)
3. **Watch the indicators** → Mass and energy update in real-time
4. **Click LAUNCH** → Jump the motorcycle!

---

## 🛠️ Development Commands

### Start dev server (with auto-reload)
```bash
npm run dev
```

### Build for production
```bash
npm run build
npm start
```

### Run linter
```bash
npm run lint
```

---

## 📂 Project Structure Overview

```
newton-simulator/
│
├── app/
│   ├── page.tsx                 ← MAIN PAGE (65/35 layout)
│   ├── layout.tsx               ← Root HTML structure
│   ├── globals.css              ← Global styles
│   │
│   └── components/
│       ├── Scene3D.tsx          ← 3D SCENE (motorcycle, ramp, platform)
│       │                           Features: Three.js, physics, vectors
│       │
│       └── Dashboard.tsx        ← DASHBOARD (gauges, controls)
│                                   Features: Interactive dials, indicators
│
├── lib/
│   └── physics.ts               ← PHYSICS ENGINE
│                                   Features: Kinematics, Newton's Laws
│
├── public/
│   └── favicon.ico
│
├── package.json                 ← Dependencies
├── tsconfig.json                ← TypeScript config
├── tailwind.config.ts           ← Tailwind CSS config
├── next.config.ts               ← Next.js config
├── postcss.config.js            ← PostCSS config
└── README.md                    ← Full documentation
```

---

## 🎯 Key Files Explained

### 1. `app/page.tsx` (Main Entry Point)
- Manages state: velocity, angle, mass, isRunning
- Combines Scene3D (65%) + Dashboard (35%)
- Handles the LAUNCH button logic

### 2. `app/components/Scene3D.tsx` (3D Graphics)
- Renders motorcycle, ramp, platform using Three.js
- Calculates trajectory with physics equations
- Visualizes vectors (velocity, gravity)
- Uses React-Three-Fiber for React integration

### 3. `app/components/Dashboard.tsx` (Controls)
- Interactive gauges (velocity, angle)
- Mass and energy indicators
- Predicted range calculator
- Responsive drag-to-rotate needle controls

### 4. `lib/physics.ts` (Physics Calculations)
- **Newton's First Law**: Trajectory calculations
- **Newton's Second Law**: Force = mass × acceleration
- **Newton's Third Law**: Impact force on landing
- All kinematics formulas implemented

---

## 🔧 Customization Tips

### Change Colors
Edit `tailwind.config.ts` or inline styles in components

### Change Physics Constants
Edit `lib/physics.ts` - modify `GRAVITY` constant or formulas

### Add More Visual Elements
Edit `app/components/Scene3D.tsx` - add new mesh components

### Adjust Dashboard Layout
Edit `app/components/Dashboard.tsx` - modify flex layouts

---

## ⚠️ Troubleshooting

### Issue: "npm: command not found"
**Solution**: Install Node.js from https://nodejs.org

### Issue: Port 3000 already in use
**Solution**: Kill the process or use different port:
```bash
npm run dev -- -p 3001
```

### Issue: "WebGL not supported"
**Solution**: Use a modern browser (Chrome, Firefox, Safari, Edge)

### Issue: Slow performance
**Solution**: 
- Close other browser tabs
- Disable auto-rotation (edit Scene3D.tsx)
- Try a different browser

### Issue: Physics seem wrong
**Solution**:
- Check angle is between 0-80°
- Verify velocity is > 0
- Check mass is between 50-300 kg

---

## 📖 Learning Resources

### Physics
- [Khan Academy - Projectile Motion](https://www.khanacademy.org/science/physics)
- [Newton's Laws Explained](https://en.wikipedia.org/wiki/Newton%27s_laws_of_motion)

### 3D Development
- [Three.js Documentation](https://threejs.org/docs/)
- [React-Three-Fiber Docs](https://docs.pmnd.rs/react-three-fiber/)

### Web Development
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)

---

## 🚀 Next Steps

### To Deploy Online:
1. Push to GitHub
2. Connect to Vercel
3. Deploy with one click

### To Add Features:
- Slow-motion replay
- Multiple ramp heights
- Scoring system
- Physics visualization modes

### To Optimize:
- Add shadows to motorcycle
- Implement terrain
- Add sound effects
- Create tutorial mode

---

## 💬 Questions?

Refer to:
- 📖 README.md (full documentation)
- 💻 Code comments in source files
- 🎯 Physics equations in lib/physics.ts

---

**Happy Simulating! 🏍️⚡**

Made with ❤️ by CHRONOS-DEV
