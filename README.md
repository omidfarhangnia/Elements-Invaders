# Elements Invaders 🚀

**Elements Invaders** is a modern, fast-paced, 3D space shooter game built from the ground up with a professional tech stack including React, Three.js, and a dedicated physics engine. This project was developed as a comprehensive exercise in building a complete game loop, managing complex state, and optimizing performance in a web-based 3D environment.

**[View Live Demo](https://elements-invaders.vercel.app/)**

---

## ✨ Key Features

- **Physics-Based Gameplay**: Utilizes the **Rapier** physics engine for realistic and satisfying collision detection and object interactions.
- **Advanced State Management**: All game logic, from player health to enemy waves, is centrally managed using **Redux Toolkit**, ensuring a predictable and scalable state architecture.
- **Clean, Hook-Based Architecture**: Complex logic for player controls, enemy AI, power-ups, and collisions is encapsulated into reusable **Custom Hooks**, keeping UI components clean and declarative.
- **Dynamic UI & HUD**: Features a complete Heads-Up Display (HUD) for health, weapon heat, ammo, and more, rendered as an HTML overlay for maximum performance and clarity.
- **Multiple Weapon Systems**: Includes a primary rapid-fire weapon with an overheat/cooldown mechanic and a limited-use, high-damage secondary weapon (Blaster).
- **Power-Up & Leveling System**: Enemies drop random power-ups (health, ammo, weapon upgrades) based on a kill-count threshold, and the game features a multi-level progression system.
- **Immersive 3D Environment**: The scene is brought to life with dynamic particle effects for stars, planetary rings, and spaceship engine trails.

---

## 🎮 Gameplay Preview

<div style="display:flex; justify-content:center; align-items: center; flex-wrap:wrap;">
  <img src="https://raw.githubusercontent.com/omidfarhangnia/Elements-Invaders/main/app/assets/preview/home_page.JPG" alt="Home Page" width="49%" style="max-width:400px;">
  <img src="https://raw.githubusercontent.com/omidfarhangnia/Elements-Invaders/main/app/assets/preview/level_page.JPG" alt="Level Select Page" width="49%" style="max-width:400px;">
  <img src="https://raw.githubusercontent.com/omidfarhangnia/Elements-Invaders/main/app/assets/preview/boss_fight.JPG" alt="Boss Fight" width="49%" style="max-width:400px;">
</div>

---

## 🛠️ Tech Stack

- **Framework:** [React](https://react.dev/)
- **Routing:** [React Router](https://reactrouter.com/)
- **3D Rendering:** [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction)
- **Physics Engine:** [React Three Rapier](https://github.com/pmndrs/react-three-rapier)
- **Helpers & Components:** [React Three Drei](https://github.com/pmndrs/react-three-drei)
- **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Deployment:** [Vercel](https://vercel.com/)

---

##  performance-considerations-section Performance Considerations

This project utilizes high-fidelity 3D models to deliver a rich visual experience. The total asset payload is approximately 12-13MB, a deliberate trade-off to achieve the desired visual quality, which is common for immersive WebGL experiences.

To ensure a smooth user experience, a **two-stage loading system** has been implemented:
1.  An **initial static loader** provides instant feedback while the main application bundle loads.
2.  A secondary loader, built with React's `<Suspense>`, then manages the loading of all 3D models and assets, ensuring a seamless entry into the game.
---

## 🚀 Getting Started Locally

To run this project on your local machine, follow these steps:

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/omidfarhangnia/Elements-Invaders.git](https://github.com/omidfarhangnia/Elements-Invaders.git)
    cd Elements-Invaders
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The project will now be available at `http://localhost:5173` (or your configured port).

---

## 📄 License & Acknowledgments

The source code for this project is released under the **MIT License**. You are free to use, modify, and distribute this code.

The 3D models used as the primary visual assets for the spaceships and enemies were generated using the AI-powered tool **Tripo3D**. A huge thank you to their team for creating such a powerful and accessible platform for 3D creation.

**Attribution:**

- **3D Model Generation Tool:** Tripo3D
- **Website:** [https://www.tripo3d.ai/](https://www.tripo3d.ai/)

---

## 🙏 Special Thanks

A special thank you to **Google's Gemini** for providing extensive guidance, architectural reviews, and in-depth debugging assistance throughout the development of this project. Its insights were instrumental in solving complex challenges and achieving this level of quality and architectural cleanliness.
