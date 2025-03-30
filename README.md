# 3D Plane vs UFOs Game

A browser-based 3D game where you pilot a plane to defend a city from alien UFOs.

## Requirements

### Minimum Requirements
- Modern web browser with WebGL support
- Keyboard for controls
- Recommended: Mouse/trackpad for better control
- Sound-enabled device

### Game Features
- 3D plane that player can control
- Simple city environment with buildings
- UFOs that hover over the city
- Shooting mechanics
- Collision detection
- Basic sound effects and background music
- Game states (start, play, win, lose)

## Tech Stack

- **Three.js** - 3D graphics library
- **JavaScript** - Core programming language
- **HTML5/CSS3** - Basic structure and styling
- **Webpack** - Module bundler
- **Web Audio API** - Sound management

## Project Milestones

### 1. Create Plane Model (MVP) [In Progress]
- Set up project structure and dependencies ✓
- Create basic 3D plane model
- Implement basic camera following the plane
- Set up basic scene with lighting

### 2. Build City Environment
- Create simple building geometries
- Generate random city layout
- Add basic textures
- Implement ground plane and skybox

### 3. Set up Plane Controls
- Implement keyboard controls (WASD/Arrow keys)
- Add roll and pitch mechanics
- Set up camera tracking
- Add basic collision detection with buildings

### 4. UFOs and Combat
- Create UFO models
- Implement UFO hovering behavior
- Add shooting mechanics
- Create explosion effects
- Implement hit detection
- Add score tracking

### 5. Polish and UI
- Add background music
- Implement sound effects (shooting, explosions, engine)
- Create start screen with instructions
- Add victory conditions and screen
- Create game over screen
- Implement restart functionality

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Run the development server:
```bash
npm run dev
``` 