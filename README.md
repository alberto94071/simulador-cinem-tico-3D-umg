# 🏍️ Newton Physics Simulator

**Interactive 3D Physics Simulator** demonstrating Newton's Three Laws of Motion through an engaging motorcycle jump simulation.

## 🎯 Features

### Physics Implementation
- ✅ **Kinematics**: Projectile motion calculations for the motorcycle jump
- ✅ **First Law (Inertia)**: Motorcycle maintains velocity when hitting obstacles
- ✅ **Second Law (F = ma)**: Force calculations based on mass and acceleration
- ✅ **Third Law (Action-Reaction)**: Impact force visualization on landing

### Interactive Controls
- 🎛️ **Velocity Dial**: Adjust initial velocity (0-100 m/s) with interactive gauge
- 📐 **Angle Dial**: Adjust ramp angle (0-80°) with real-time ramp rotation
- ⚖️ **Mass Indicator**: Set motorcycle mass (50-300 kg)
- 🚀 **Launch Button**: Trigger the jump simulation

### 3D Visualization
- 🏍️ **Realistic Motorcycle Model**: Yellow sport bike with detailed geometry
- 🛣️ **Dynamic Ramp**: Rotates based on angle adjustment
- 🎪 **Landing Platform**: Safe zone with visual indicator
- ⚠️ **Danger Zone**: Cliff visualization for failed jumps
- 📊 **Trajectory Path**: Visual representation of motorcycle flight path
- 🎨 **Vector Visualization**: Real-time velocity, gravity, and force vectors

### Dashboard
- 📱 **Professional Automotive-style Design**: Inspired by real race car dashboards
- 🎚️ **Analog Gauges**: Red needles with golden scales
- 📈 **Dynamic Indicators**: Real-time energy and mass visualization
- 💾 **Odometer Display**: Predicted landing distance

## 🛠️ Tech Stack

```
Frontend:
- Next.js 15 (React 19)
- TypeScript
- Three.js + React-Three-Fiber
- @react-three/rapier (Physics engine)
- Tailwind CSS

Tools:
- Node.js 18+
- npm/yarn
```

## 📦 Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd newton-simulator
```

### 2. Install dependencies
```bash
npm install
# or
yarn install
```

### 3. Start the development server
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎮 How to Use

### 1. **Adjust Parameters**
- **Left Gauge (Velocity)**: Drag the red needle to set initial speed (0-100 m/s)
- **Right Gauge (Angle)**: Drag the red needle to adjust ramp angle (0-80°)
- **Center Bar (Mass)**: Watch the mass indicator change from 50-300 kg
- Watch the ramp rotate in real-time as you adjust the angle

### 2. **Predict the Jump**
- Check the "PREDICTED RANGE" display to see where the motorcycle will land
- Energy metrics show the kinetic energy at current settings

### 3. **Launch the Simulation**
- Click the **LAUNCH** button to start the jump
- Watch the motorcycle follow the calculated trajectory
- The trajectory path shows the physics in action

### 4. **Observe Physics**
- ✅ **Inertia**: Motorcycle maintains its horizontal velocity
- ✅ **Gravity**: Parabolic trajectory due to gravitational acceleration
- ✅ **Forces**: Visual vectors show velocity and gravity directions

## 📐 Physics Equations

### Kinematics (Projectile Motion)
```
x = v₀ * cos(θ) * t
y = v₀ * sin(θ) * t - ½ * g * t²

Range = (v₀² * sin(2θ)) / g
Max Height = (v₀² * sin²(θ)) / (2g)
Time of Flight = (2 * v₀ * sin(θ)) / g
```

### Newton's Laws
```
1. Inertia: Motorcycle maintains velocity when hitting obstacles
   Rider velocity = [v₀ * cos(θ), v₀ * sin(θ)]

2. Force: F = m * a
   Higher mass requires greater force for same acceleration

3. Action-Reaction: Impact force on landing
   F_impact = (m * v) / t (impulse-momentum)
```

## 📁 Project Structure

```
newton-simulator/
├── app/
│   ├── components/
│   │   ├── Scene3D.tsx          # 3D scene with motorcycle, ramp, platform
│   │   └── Dashboard.tsx        # Interactive gauges and controls
│   ├── page.tsx                 # Main layout (65% scene / 35% dashboard)
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
├── lib/
│   └── physics.ts               # Physics calculations and formulas
├── public/
│   └── favicon.ico
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
└── postcss.config.js
```

## 🎨 Design System

### Colors
- **Background**: `#0d0d0d` (Deep black)
- **Surface**: `#1a1a1a` (Dark gray)
- **Primary**: `#d4af37` (Gold)
- **Accent**: `#ff3333` (Red for gauges)
- **Success**: `#00ff00` (Green for landing zone)
- **Danger**: `#ff3333` (Red for cliff)

### Fonts
- **Display**: Arial, sans-serif
- **Monospace**: Courier New (for data displays)

## 🚀 Performance Optimization

- Canvas-based 3D rendering (Three.js)
- Memoized components to prevent unnecessary re-renders
- Dynamic imports for Scene3D component
- Optimized shadow maps and LOD
- GPU-accelerated physics calculations

## 📚 Educational Value

This simulator teaches:
- **Physics**: Projectile motion, forces, energy conservation
- **Mathematics**: Trigonometry, kinematics equations
- **3D Graphics**: Three.js, WebGL, camera control
- **React**: State management, dynamic rendering
- **TypeScript**: Type safety in complex applications

## 🐛 Troubleshooting

### 3D scene not rendering
- Check browser WebGL support
- Clear browser cache and reload
- Try a different browser

### Physics calculations seem off
- Verify angle is between 0-80°
- Check that velocity is positive
- Ensure mass is within 50-300 kg range

### Performance issues
- Reduce shadow map resolution in Scene3D.tsx
- Disable auto-rotation in OrbitControls
- Close other browser tabs

## 📝 License

MIT License - Feel free to use this project for educational purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 👨‍💻 Author

**CHRONOS-DEV** • Software Development & AI Integration
- Based in Guatemala City 🇬🇹
- Specializing in Web3D and Physics Simulations
- Full-stack development with Next.js & Three.js

---

**Made with ❤️ using React, Three.js, and Physics** 🚀
