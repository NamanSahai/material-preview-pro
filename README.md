Markdown
# Material Preview Pro

Material Preview Pro is a high-performance, browser-based 3D asset and material inspection suite built with Three.js. It provides a lightweight digital content creation (DCC) viewport experience—comparable to Marmoset Toolbag or Substance Viewer—enabling technical artists, developers, and designers to inspect custom 3D models, configure advanced physically based rendering (PBR) shaders, and evaluate studio-grade environment lighting directly within the browser[cite: 1, 2].

---

## Key Features

* **Multi-Format 3D Asset Support**: Native parsing and rendering for `.glb`, `.gltf`, and `.fbx` files, alongside a built-in library of primitive geometric shapes (Sphere, Cube, Plane, Cylinder, Torus Knot)[cite: 1, 2].
* **Advanced PBR Physical Shaders**: Real-time configuration of modern surface properties including Base Tint Color, Metalness, Roughness, Normal Map Relief, Clearcoat layers, Transmission & Index of Refraction (IOR) for glass, and Emissive Glow mapping[cite: 1, 2].
* **Texture Map Management**: Upload custom texture maps (Base Color, Normal, Roughness, Metallic, Emissive) with live visibility toggles, UV scale repetition, and rotation controls, or apply built-in procedural textures (Gold, Silver, Brick, Marble, Tiles, Wood)[cite: 1, 2].
* **HDRI Environment Lighting & Post-Processing**: Selectable high-dynamic-range image (HDRI) presets for Image-Based Lighting (IBL), featuring adjustable background blur, angular rotation, and real-time Unreal Bloom cinematic glow effects[cite: 1, 2].
* **Interactive 3D Transform Gizmo**: Translate models dynamically using an in-viewport 3D RGB space translation gizmo synchronized bi-directionally with precision sidebar numeric sliders[cite: 1, 2].
* **Production-Grade User Experience**: Automated loading state overlays, responsive mobile/tablet drawer styling, collapsible accordion control cards, a collapsible sidebar navigation panel, and live vertex/triangle mesh statistics[cite: 1, 2].

---

## Tech Stack

* **Core Graphics**: Three.js (r179)
* **Loaders & Controls**: GLTFLoader, FBXLoader, RGBELoader, OrbitControls, TransformControls[cite: 1, 2]
* **Post-Processing**: EffectComposer, UnrealBloomPass[cite: 1, 2]
* **Architecture**: Vanilla JavaScript ES Modules utilizing native browser Import Maps[cite: 1]

---

## Getting Started

Because this project utilizes modern JavaScript ES Modules and browser import maps[cite: 1], it requires a local development server to avoid CORS restrictions when fetching modules and local assets.

### Prerequisites

* A modern web browser with WebGL 2.0 support.
* A local development server (such as the VS Code *Live Server* extension).

### Local Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Namansahai/material-preview-pro.git
2. Open the project directory in Visual Studio Code.

3. Serve the directory using a local web server (e.g., right-click Index.html and select Open with Live Server)[cite: 1, 2].

4. Access the application in your browser at http://127.0.0.1:5500[cite: 1].

### Keyboard Shortcuts
* **R**: Reset camera position and target view framing.
* **Spacebar**: Toggle automatic camera rotation.

### Deployment
Hosting configuration is static-native and deploys seamlessly to platforms like Vercel or Netlify without requiring a build step.

### License
Distributed under the MIT License. See LICENSE for more information.