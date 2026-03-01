
## 📋 Project Overview

This project is a web application that simulates the physics of a simple seesaw mechanism using pure Javascript, HTML and CSS. Users can:
- Click on the drop area to drop randomly weighted objects onto the seesaw
- View left and right weights in real time
- Track the seesaw's tilt angle
- Monitor the history of all operations
- Pause and restart the simulation

## 🎨 Design Decisions and Thought Process

### 1. **Modular Architecture**
The code is organized into five main files by responsibility to make the code maintainable, testable, and easy to extend:
- **`dom.js`**: DOM element access and management
- **`physics.js`**: Weight, torque, and tilt angle calculations
- **`drop.js`**: Object falling animation and physical positioning
- **`utils.js`**: Helper functions (weight generation, size determination)
- **`app.js`**: Main application logic and control flow

### 2. **Physical Calculations**
The system uses torque calculations to determine system balance and tilt angle:
```
Torque = Weight × Distance (from Pivot)
Angle = (Right Torque - Left Torque) / 10
```
Also angle calculation is clamped between `-30°` and `30°` (`Math.max(-30, Math.min(30, ...))`).

### 3. **Animation System**
Objects fall in two stages:
- **From Drop Area**: Pixel-based animation (`drop.js`)
- **To Seesaw**: Positioning adjusted based on tilt angle
To ensure angle-independent falling and prevent object misalignment during angle changes.

### 4. **State Management**
The simulation state is automatically saved using `localStorage` (`STORAGE_KEY: "seesawState"`).
So that users can recover their simulation state even if they refresh the page.


## 🤖 AI Assistance - Which Parts Were Used?

### 1. **Drop Animation Bug Fixes** ⭐
**Problems**: 
- Objects were falling to incorrect positions when the seesaw was tilted
- Falling objects seemed to "disappear" when reaching the seesaw due to rotation
- Object coordinates were not being updated during angle calculations

**AI Solutions**:
- Added trigonometric angle correction in `dropObjectFromArea()` function
- Calculated drop distance using `angleRad` and `angleAdjustment`
  1. Pixel-based animation in the drop area
  2. Tilt-angle-aware positioning when transitioning to the seesaw

### 2. **README Writing and Documentation**
- README structure planning


## 📁 File Structure

```
seesawSimulation/
├── index.html           # Main HTML structure
├── style.css            # Styling and design
├── README.md            # This file
└── js/
    ├── app.js          # Main application logic
    ├── dom.js          # DOM management
    ├── physics.js      # Physics calculations
    ├── drop.js         # Drop animation
    └── utils.js        # Helper functions
```

---

## 🎮 Usage

1. Open `index.html` in a web browser
2. Click on the drop area to drop objects onto the seesaw
3. Monitor the left and right weights and the tilt angle
4. Use "Pause" to pause the simulation, "Restart" to reset it

---

