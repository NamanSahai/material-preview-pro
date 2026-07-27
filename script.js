import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import { TransformControls } from "three/addons/controls/TransformControls.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";

/* =====================================================
   TOAST NOTIFICATION SYSTEM
===================================================== */
function showToast(message, isError = false) {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast ${isError ? 'error' : ''}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

/* =====================================================
   LOADING SPRAY OVERLAY HANDLER
===================================================== */
const loadingOverlay = document.getElementById("loadingOverlay");
const loadingText = document.getElementById("loadingText");

function setLoading(isLoading, text = "Loading 3D Asset...") {
    if (!loadingOverlay) return;
    if (isLoading) {
        if (loadingText) loadingText.textContent = text;
        loadingOverlay.style.display = "flex";
    } else {
        loadingOverlay.style.display = "none";
    }
}

/* =====================================================
   SIDEBAR & COLLAPSIBLE CARDS UI
===================================================== */
const toggleSidebarBtn = document.getElementById("toggleSidebarBtn");
const sidebar = document.getElementById("sidebar");

toggleSidebarBtn?.addEventListener("click", () => {
    sidebar?.classList.toggle("collapsed");
    setTimeout(onWindowResize, 300);
});

document.querySelectorAll(".card.collapsible .card-header").forEach(header => {
    header.addEventListener("click", (e) => {
        if (e.target.tagName === "BUTTON") return;
        header.closest(".card").classList.toggle("closed");
    });
});

/* =====================================================
   TAB NAVIGATION SYSTEM
===================================================== */
const tabBtns = document.querySelectorAll(".tab-btn");
const tabPanes = document.querySelectorAll(".tab-pane");

tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        tabBtns.forEach(b => b.classList.remove("active"));
        tabPanes.forEach(p => p.classList.remove("active"));
        btn.classList.add("active");
        document.getElementById(btn.dataset.tab)?.classList.add("active");
    });
});

/* =====================================================
   DOM REFERENCES
===================================================== */
let loadedBaseMap = null;
let loadedNormalMap = null;
let loadedRoughnessMap = null;
let loadedMetallicMap = null;
let loadedEmissiveMap = null;

const toggleBaseMap = document.getElementById("toggleBaseMap");
const toggleNormalMap = document.getElementById("toggleNormalMap");
const toggleRoughnessMap = document.getElementById("toggleRoughnessMap");
const toggleMetallicMap = document.getElementById("toggleMetallicMap");
const toggleEmissiveMap = document.getElementById("toggleEmissiveMap");

const lightAngleSlider = document.getElementById("lightAngle");
const lightAngleVal = document.getElementById("lightAngleVal");
const mainLightSlider = document.getElementById("mainLightIntensity");
const mainLightVal = document.getElementById("mainLightVal");
const ambientLightSlider = document.getElementById("ambientLightIntensity");
const ambientLightVal = document.getElementById("ambientLightVal");
const lightTempSlider = document.getElementById("lightTemp");
const tempVal = document.getElementById("tempVal");
const exposureSlider = document.getElementById("exposure");
const exposureVal = document.getElementById("exposureVal");
const resetLightingBtn = document.getElementById("resetLightingBtn");

const metalnessVal = document.getElementById("metalnessVal");
const roughnessVal = document.getElementById("roughnessVal");
const normalVal = document.getElementById("normalVal");

const clearTexturesBtn = document.getElementById("clearTexturesBtn");
const clearModelBtn = document.getElementById("clearModelBtn");
const viewer = document.getElementById("viewer");
const viewportContainer = document.getElementById("viewportContainer");

const uvRepeatSlider = document.getElementById("uvRepeat");
const uvRepeatVal = document.getElementById("uvRepeatVal");
const uvRotateSlider = document.getElementById("uvRotate");
const uvRotateVal = document.getElementById("uvRotateVal");

const geometrySelect = document.getElementById("geometry");
const texturePresetSelect = document.getElementById("texturePreset");

const textureUpload = document.getElementById("textureUpload");
const normalUpload = document.getElementById("normalUpload");
const roughnessMapUpload = document.getElementById("roughnessMapUpload");
const metallicMapUpload = document.getElementById("metallicMapUpload");
const emissiveMapUpload = document.getElementById("emissiveMapUpload");

const metalnessSlider = document.getElementById("metalness");
const roughnessSlider = document.getElementById("roughness");
const normalStrengthSlider = document.getElementById("normalStrength");

const baseColorPicker = document.getElementById("baseColorPicker");
const baseColorHex = document.getElementById("baseColorHex");
const clearcoatSlider = document.getElementById("clearcoat");
const clearcoatVal = document.getElementById("clearcoatVal");
const clearcoatRoughnessSlider = document.getElementById("clearcoatRoughness");
const clearcoatRoughVal = document.getElementById("clearcoatRoughVal");
const transmissionSlider = document.getElementById("transmission");
const transVal = document.getElementById("transVal");
const iorSlider = document.getElementById("ior");
const iorVal = document.getElementById("iorVal");
const emissivePicker = document.getElementById("emissivePicker");
const emissiveColorHex = document.getElementById("emissiveColorHex");
const emissiveIntensitySlider = document.getElementById("emissiveIntensity");
const emissiveIntensityVal = document.getElementById("emissiveIntensityVal");

const hdriPresetSelect = document.getElementById("hdriPreset");
const showHdriBgCheckbox = document.getElementById("showHdriBg");
const hdriBlurSlider = document.getElementById("hdriBlur");
const hdriBlurVal = document.getElementById("hdriBlurVal");
const hdriRotationSlider = document.getElementById("hdriRotation");
const hdriRotationVal = document.getElementById("hdriRotationVal");

const enableBloomCheckbox = document.getElementById("enableBloom");
const bloomStrengthSlider = document.getElementById("bloomStrength");
const bloomStrengthVal = document.getElementById("bloomStrengthVal");
const bloomThresholdSlider = document.getElementById("bloomThreshold");
const bloomThresholdVal = document.getElementById("bloomThresholdVal");
const bloomRadiusSlider = document.getElementById("bloomRadius");
const bloomRadiusVal = document.getElementById("bloomRadiusVal");

const wireframeCheckbox = document.getElementById("wireframe");
const wireframeOnlyCheckbox = document.getElementById("wireframeOnly");
const wireframeOnlyLabel = document.getElementById("wireframeOnlyLabel");
const autoRotateCheckbox = document.getElementById("autorotate");

const resetCameraBtn = document.getElementById("resetCamera");
const exportBtn = document.getElementById("exportPNG");
const fpsLabel = document.getElementById("fps");
const modelUpload = document.getElementById("modelUpload");

const recentModelsCard = document.getElementById("recentModelsCard");
const recentModelsList = document.getElementById("recentModelsList");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

const polyCountVal = document.getElementById("polyCountVal");
const vertCountVal = document.getElementById("vertCountVal");

const posXSlider = document.getElementById("posX");
const posYSlider = document.getElementById("posY");
const posZSlider = document.getElementById("posZ");
const modelScaleSlider = document.getElementById("modelScale");
const showGizmoCheckbox = document.getElementById("showGizmo");
const posXVal = document.getElementById("posXVal");
const posYVal = document.getElementById("posYVal");
const posZVal = document.getElementById("posZVal");
const scaleVal = document.getElementById("scaleVal");
const resetTransformBtn = document.getElementById("resetTransformBtn");

let baseModelScale = 1.0;

/* =====================================================
   SESSION RECENT FILES HISTORY
===================================================== */
let recentModelsHistory = [];
const MAX_RECENT_FILES = 3;

function addToRecentModels(file) {
    const existingIndex = recentModelsHistory.findIndex(item => item.name === file.name);
    if (existingIndex !== -1) {
        const [existingItem] = recentModelsHistory.splice(existingIndex, 1);
        recentModelsHistory.unshift(existingItem);
    } else {
        recentModelsHistory.unshift({
            name: file.name,
            file: file,
            url: URL.createObjectURL(file)
        });
    }
    if (recentModelsHistory.length > MAX_RECENT_FILES) {
        const removed = recentModelsHistory.pop();
        URL.revokeObjectURL(removed.url);
    }
    renderRecentModelsUI();
}

function setActiveRecentModel(index) {
    if (index <= 0 || index >= recentModelsHistory.length) return;
    const [selectedItem] = recentModelsHistory.splice(index, 1);
    recentModelsHistory.unshift(selectedItem);
    renderRecentModelsUI();
    loadModelFromURL(selectedItem.url, selectedItem.name);
}

function renderRecentModelsUI() {
    if (!recentModelsList || !recentModelsCard) return;
    if (recentModelsHistory.length === 0) {
        recentModelsCard.style.display = "none";
        return;
    }
    recentModelsCard.style.display = "block";
    recentModelsList.innerHTML = "";

    recentModelsHistory.forEach((item, index) => {
        const btn = document.createElement("button");
        btn.type = "button";
        const isActive = index === 0;
        btn.className = isActive ? "btn-secondary active-model-btn" : "btn-secondary";
        btn.style.cssText = `display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; font-size: 12px; text-align: left; ${isActive ? 'background: #2a3441; border: 1px solid var(--accent);' : ''}`;
        
        btn.innerHTML = `
            <span>📦 ${item.name.length > 20 ? item.name.substring(0, 18) + "..." : item.name}</span> 
            <span style="font-size: 10px; ${isActive ? 'color: var(--accent); font-weight: bold;' : 'opacity: 0.6;'}">${isActive ? 'Active' : 'Load'}</span>
        `;
        btn.addEventListener("click", () => { if (!isActive) setActiveRecentModel(index); });
        recentModelsList.appendChild(btn);
    });
}

clearHistoryBtn?.addEventListener("click", () => {
    recentModelsHistory.forEach(item => { if (item.url) URL.revokeObjectURL(item.url); });
    recentModelsHistory = [];
    renderRecentModelsUI();
});

/* =====================================================
   SCENE & RENDERER INITIALIZATION
===================================================== */
const scene = new THREE.Scene();
const defaultBgColor = new THREE.Color(0x1a1a1a);
scene.background = defaultBgColor;

const camera = new THREE.PerspectiveCamera(45, viewer.clientWidth / viewer.clientHeight, 0.1, 1000);
camera.position.set(0, 1.5, 4);

const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(viewer.clientWidth, viewer.clientHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
viewer.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.autoRotate = true;
controls.autoRotateSpeed = 2;

/* =====================================================
   HDRI ENVIRONMENT LIGHTING (WITH LOADING STATE)
===================================================== */
const rgbeLoader = new RGBELoader();
const pmremGenerator = new THREE.PMREMGenerator(renderer);
pmremGenerator.compileEquirectangularShader();
let currentHdriTexture = null;

const hdriURLs = {
    venice: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/venice_sunset_1k.hdr",
    royal: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_08_1k.hdr",
    overpass: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/abandoned_workshop_1k.hdr"
};

function loadHDRI(presetKey) {
    if (presetKey === "none") {
        if (currentHdriTexture) currentHdriTexture.dispose();
        scene.environment = null;
        scene.background = defaultBgColor;
        return;
    }
    const url = hdriURLs[presetKey];
    if (!url) return;

    setLoading(true, "Loading Environment HDRI...");

    rgbeLoader.load(url, 
        (hdrTexture) => {
            const envMap = pmremGenerator.fromEquirectangular(hdrTexture).texture;
            if (currentHdriTexture) currentHdriTexture.dispose();
            currentHdriTexture = envMap;
            scene.environment = envMap;

            if (showHdriBgCheckbox?.checked) {
                scene.background = envMap;
                scene.backgroundBlurriness = parseFloat(hdriBlurSlider?.value || 0.1);
            } else {
                scene.background = defaultBgColor;
            }
            hdrTexture.dispose();
            setLoading(false);
            showToast("HDRI Environment Loaded Successfully!");
        },
        undefined,
        (error) => {
            setLoading(false);
            console.error("HDRI Error:", error);
            showToast("Failed to load environment HDRI map", true);
        }
    );
}

loadHDRI("venice");

hdriPresetSelect?.addEventListener("change", () => loadHDRI(hdriPresetSelect.value));
showHdriBgCheckbox?.addEventListener("change", () => {
    if (showHdriBgCheckbox.checked && currentHdriTexture && hdriPresetSelect.value !== "none") {
        scene.background = currentHdriTexture;
        scene.backgroundBlurriness = parseFloat(hdriBlurSlider?.value || 0.1);
    } else {
        scene.background = defaultBgColor;
    }
});
hdriBlurSlider?.addEventListener("input", () => {
    const val = parseFloat(hdriBlurSlider.value);
    scene.backgroundBlurriness = val;
    if (hdriBlurVal) hdriBlurVal.textContent = val.toFixed(2);
});
hdriRotationSlider?.addEventListener("input", () => {
    const deg = parseFloat(hdriRotationSlider.value);
    const rad = (deg * Math.PI) / 180;
    scene.environmentRotation.y = rad;
    scene.backgroundRotation.y = rad;
    if (hdriRotationVal) hdriRotationVal.textContent = `${deg}°`;
});

/* =====================================================
   POST-PROCESSING (BLOOM)
===================================================== */
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const bloomPass = new UnrealBloomPass(new THREE.Vector2(viewer.clientWidth, viewer.clientHeight), 0.5, 0.4, 0.85);
composer.addPass(bloomPass);
composer.addPass(new OutputPass());

enableBloomCheckbox?.addEventListener("change", () => { bloomPass.enabled = enableBloomCheckbox.checked; });
bloomStrengthSlider?.addEventListener("input", () => {
    const val = parseFloat(bloomStrengthSlider.value);
    bloomPass.strength = val;
    if (bloomStrengthVal) bloomStrengthVal.textContent = val.toFixed(2);
});
bloomThresholdSlider?.addEventListener("input", () => {
    const val = parseFloat(bloomThresholdSlider.value);
    bloomPass.threshold = val;
    if (bloomThresholdVal) bloomThresholdVal.textContent = val.toFixed(2);
});
bloomRadiusSlider?.addEventListener("input", () => {
    const val = parseFloat(bloomRadiusSlider.value);
    bloomPass.radius = val;
    if (bloomRadiusVal) bloomRadiusVal.textContent = val.toFixed(2);
});

/* =====================================================
   TRANSFORM CONTROLS (3D GIZMO)
===================================================== */
const transformControls = new TransformControls(camera, renderer.domElement);
transformControls.setMode("translate");
scene.add(transformControls.getHelper());

transformControls.addEventListener("dragging-changed", (e) => { controls.enabled = !e.value; });
transformControls.addEventListener("change", () => {
    const activeObject = importedModel || previewMesh;
    if (activeObject && transformControls.dragging) {
        if (posXSlider) posXSlider.value = activeObject.position.x;
        if (posYSlider) posYSlider.value = activeObject.position.y;
        if (posZSlider) posZSlider.value = activeObject.position.z;
        if (posXVal) posXVal.textContent = activeObject.position.x.toFixed(1);
        if (posYVal) posYVal.textContent = activeObject.position.y.toFixed(1);
        if (posZVal) posZVal.textContent = activeObject.position.z.toFixed(1);
        updateWireframeOverlay();
    }
});

function attachGizmo(targetMesh) {
    if (targetMesh && showGizmoCheckbox?.checked) transformControls.attach(targetMesh);
    else transformControls.detach();
}
showGizmoCheckbox?.addEventListener("change", () => attachGizmo(importedModel || previewMesh));

/* =====================================================
   LIGHTING RIG & SETUP
===================================================== */
const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 8, 5);
scene.add(directionalLight);
const fillLight = new THREE.DirectionalLight(0xffffff, 1);
fillLight.position.set(-5, 3, -4);
scene.add(fillLight);

const grid = new THREE.GridHelper(10, 20, 0x666666, 0x333333);
grid.position.y = -1;
scene.add(grid);

/* =====================================================
   MATERIAL & GEOMETRY DEFINITIONS
===================================================== */
const material = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: parseFloat(metalnessSlider.value),
    roughness: parseFloat(roughnessSlider.value),
    side: THREE.DoubleSide,
    clearcoat: 0.0,
    clearcoatRoughness: 0.0,
    transmission: 0.0,
    ior: 1.5,
    thickness: 0.5,
    emissive: new THREE.Color(0x000000),
    emissiveIntensity: 0.0
});

const geometries = {
    sphere: new THREE.SphereGeometry(1, 64, 64),
    cube: new THREE.BoxGeometry(2, 2, 2, 32, 32, 32),
    plane: new THREE.PlaneGeometry(2.5, 2.5, 64, 64),
    cylinder: new THREE.CylinderGeometry(1, 1, 2, 64),
    torusKnot: new THREE.TorusKnotGeometry(0.8, 0.25, 128, 32)
};

let previewMesh = new THREE.Mesh(geometries.sphere, material);
let importedModel = null;
const wireframeOverlayGroup = new THREE.Group();
scene.add(wireframeOverlayGroup);
scene.add(previewMesh);
attachGizmo(previewMesh);

/* =====================================================
   ADVANCED SHADER EVENT LISTENERS
===================================================== */
baseColorPicker?.addEventListener("input", (e) => {
    material.color.set(e.target.value);
    if (baseColorHex) baseColorHex.textContent = e.target.value.toUpperCase();
});
clearcoatSlider?.addEventListener("input", () => {
    material.clearcoat = parseFloat(clearcoatSlider.value);
    if (clearcoatVal) clearcoatVal.textContent = material.clearcoat.toFixed(2);
});
clearcoatRoughnessSlider?.addEventListener("input", () => {
    material.clearcoatRoughness = parseFloat(clearcoatRoughnessSlider.value);
    if (clearcoatRoughVal) clearcoatRoughVal.textContent = material.clearcoatRoughness.toFixed(2);
});
transmissionSlider?.addEventListener("input", () => {
    material.transmission = parseFloat(transmissionSlider.value);
    if (transVal) transVal.textContent = material.transmission.toFixed(2);
});
iorSlider?.addEventListener("input", () => {
    material.ior = parseFloat(iorSlider.value);
    if (iorVal) iorVal.textContent = material.ior.toFixed(2);
});
emissivePicker?.addEventListener("input", (e) => {
    material.emissive.set(e.target.value);
    if (emissiveColorHex) emissiveColorHex.textContent = e.target.value.toUpperCase();
});
emissiveIntensitySlider?.addEventListener("input", () => {
    material.emissiveIntensity = parseFloat(emissiveIntensitySlider.value);
    if (emissiveIntensityVal) emissiveIntensityVal.textContent = material.emissiveIntensity.toFixed(1);
});

/* =====================================================
   MODEL TRANSFORM & SLIDER SYNCHRONIZATION
===================================================== */
function updateModelTransform() {
    const activeObject = importedModel || previewMesh;
    if (!activeObject) return;

    const x = parseFloat(posXSlider?.value || 0);
    const y = parseFloat(posYSlider?.value || 0);
    const z = parseFloat(posZSlider?.value || 0);
    const userScale = parseFloat(modelScaleSlider?.value || 1.0);

    activeObject.position.set(x, y, z);
    const finalScale = baseModelScale * userScale;
    activeObject.scale.set(finalScale, finalScale, finalScale);

    if (posXVal) posXVal.textContent = x.toFixed(1);
    if (posYVal) posYVal.textContent = y.toFixed(1);
    if (posZVal) posZVal.textContent = z.toFixed(1);
    if (scaleVal) scaleVal.textContent = `${userScale.toFixed(1)}x`;

    updateWireframeOverlay();
}

function resetTransformUI() {
    if (posXSlider) posXSlider.value = "0";
    if (posYSlider) posYSlider.value = "0";
    if (posZSlider) posZSlider.value = "0";
    if (modelScaleSlider) modelScaleSlider.value = "1.0";
    updateModelTransform();
}

posXSlider?.addEventListener("input", updateModelTransform);
posYSlider?.addEventListener("input", updateModelTransform);
posZSlider?.addEventListener("input", updateModelTransform);
modelScaleSlider?.addEventListener("input", updateModelTransform);
resetTransformBtn?.addEventListener("click", resetTransformUI);

/* =====================================================
   TEXTURE LOADERS & PROCEDURAL GENERATORS
===================================================== */
const textureLoader = new THREE.TextureLoader();
const gltfLoader = new GLTFLoader();
const fbxLoader = new FBXLoader();

function loadTexture(file, callback) {
    if (!file) return;
    setLoading(true, `Loading Texture (${file.name})...`);
    const url = URL.createObjectURL(file);
    
    textureLoader.load(url, 
        texture => {
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
            callback(texture);
            updateTextureTransforms();
            URL.revokeObjectURL(url);
            setLoading(false);
            showToast("Texture Map Loaded!");
        },
        undefined,
        (err) => {
            setLoading(false);
            console.error("Texture Load Error:", err);
            showToast("Failed to load texture image", true);
        }
    );
}

function generateProceduralTexture(type) {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");

    if (type === "gold") {
        ctx.fillStyle = "#d4af37";
        ctx.fillRect(0, 0, 512, 512);
        ctx.strokeStyle = "#f3e5ab";
        ctx.lineWidth = 1;
        for (let i = 0; i < 300; i++) {
            const y = Math.random() * 512;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(512, y + (Math.random() * 4 - 2));
            ctx.globalAlpha = 0.15;
            ctx.stroke();
        }
    } else if (type === "silver") {
        ctx.fillStyle = "#e0e0e0";
        ctx.fillRect(0, 0, 512, 512);
        ctx.strokeStyle = "#a0a0a0";
        ctx.lineWidth = 2;
        for (let x = 0; x <= 512; x += 32) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 512); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(0, x); ctx.lineTo(512, x); ctx.stroke();
        }
    } else if (type === "brick") {
        ctx.fillStyle = "#a5382b";
        ctx.fillRect(0, 0, 512, 512);
        ctx.fillStyle = "#d0c0b0";
        for (let y = 0; y < 512; y += 32) {
            ctx.fillRect(0, y, 512, 3);
            const offset = ((y / 32) % 2 === 0) ? 0 : 32;
            for (let x = offset; x < 512; x += 64) ctx.fillRect(x, y, 3, 32);
        }
    } else if (type === "marble") {
        ctx.fillStyle = "#f5f5f7";
        ctx.fillRect(0, 0, 512, 512);
        ctx.strokeStyle = "#9fa3a9";
        ctx.lineWidth = 3;
        ctx.globalAlpha = 0.4;
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            let x = Math.random() * 512, y = 0;
            ctx.moveTo(x, y);
            while (y < 512) {
                x += Math.sin(y * 0.02) * 12 + (Math.random() * 6 - 3);
                y += 10;
                ctx.lineTo(x, y);
            }
            ctx.stroke();
        }
    } else if (type === "tiles") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, 512, 512);
        ctx.fillStyle = "#8a9ba8";
        for (let i = 0; i <= 512; i += 64) {
            ctx.fillRect(i - 1, 0, 4, 512);
            ctx.fillRect(0, i - 1, 512, 4);
        }
    } else if (type === "wood") {
        ctx.fillStyle = "#8b5a2b";
        ctx.fillRect(0, 0, 512, 512);
        ctx.strokeStyle = "#5c3a17";
        ctx.lineWidth = 5;
        ctx.globalAlpha = 0.6;
        for (let r = 10; r < 700; r += 18) {
            ctx.beginPath(); ctx.arc(256, 256, r, 0, Math.PI * 2); ctx.stroke();
        }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
}

function generateProceduralNormalTexture(type) {
    const canvas = document.createElement("canvas");
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#8080ff";
    ctx.fillRect(0, 0, 512, 512);

    if (type === "brick" || type === "tiles") {
        ctx.fillStyle = "#8040d0";
        for (let y = 0; y < 512; y += 32) {
            ctx.fillRect(0, y, 512, 3);
            for (let x = 0; x < 512; x += 64) ctx.fillRect(x, y, 3, 32);
        }
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
}

/* =====================================================
   UV TRANSFORMS & HELPERS
===================================================== */
function updateTextureTransforms() {
    const repeat = parseFloat(uvRepeatSlider?.value || 1.0);
    const rad = (parseFloat(uvRotateSlider?.value || 0) * Math.PI) / 180;
    const maps = [loadedBaseMap, loadedNormalMap, loadedRoughnessMap, loadedMetallicMap, loadedEmissiveMap];

    maps.forEach(map => {
        if (map) {
            map.repeat.set(repeat, repeat);
            map.center.set(0.5, 0.5);
            map.rotation = rad;
            map.needsUpdate = true;
        }
    });

    if (uvRepeatVal) uvRepeatVal.textContent = `${repeat.toFixed(1)}x`;
    if (uvRotateVal) uvRotateVal.textContent = `${parseFloat(uvRotateSlider?.value || 0)}°`;
}

function updateWireframeOverlay() {
    while (wireframeOverlayGroup.children.length > 0) {
        const child = wireframeOverlayGroup.children[0];
        child.geometry?.dispose();
        child.material?.dispose();
        wireframeOverlayGroup.remove(child);
    }

    const showWireframe = wireframeCheckbox?.checked || false;
    const isWireframeOnly = wireframeOnlyCheckbox?.checked || false;
    if (wireframeOnlyCheckbox) wireframeOnlyCheckbox.disabled = !showWireframe;
    if (wireframeOnlyLabel) wireframeOnlyLabel.style.opacity = showWireframe ? "1" : "0.5";

    if (!showWireframe) {
        material.wireframe = false;
        return;
    }

    if (isWireframeOnly) {
        material.wireframe = true;
    } else {
        material.wireframe = false;
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00a8ff });
        const activeObject = importedModel || previewMesh;
        
        activeObject?.traverse((child) => {
            if (child.isMesh && child.geometry) {
                const line = new THREE.LineSegments(new THREE.WireframeGeometry(child.geometry), lineMaterial);
                line.position.copy(child.position);
                line.rotation.copy(child.rotation);
                line.scale.copy(child.scale);
                if (importedModel) {
                    line.position.add(importedModel.position);
                    line.scale.multiply(importedModel.scale);
                }
                wireframeOverlayGroup.add(line);
            }
        });
    }
}

function updateMeshStats() {
    let totalTriangles = 0, totalVertices = 0;
    const activeObject = importedModel || previewMesh;

    activeObject?.traverse((child) => {
        if (child.isMesh && child.geometry) {
            const geo = child.geometry;
            if (geo.attributes.position) totalVertices += geo.attributes.position.count;
            if (geo.index) totalTriangles += geo.index.count / 3;
            else if (geo.attributes.position) totalTriangles += geo.attributes.position.count / 3;
        }
    });

    if (polyCountVal) polyCountVal.textContent = Math.floor(totalTriangles).toLocaleString();
    if (vertCountVal) vertCountVal.textContent = totalVertices.toLocaleString();
}

function changeGeometry(type) {
    if (importedModel) { scene.remove(importedModel); importedModel = null; }
    if (previewMesh) { scene.remove(previewMesh); previewMesh = null; }

    baseModelScale = 1.0;
    previewMesh = new THREE.Mesh(geometries[type], material);
    scene.add(previewMesh);
    attachGizmo(previewMesh);
    resetTransformUI();
    updateMeshStats();
}

/* =====================================================
   TEXTURE UPLOADS & PRESETS
===================================================== */
texturePresetSelect?.addEventListener("change", () => {
    const selected = texturePresetSelect.value;
    if (selected === "none") {
        loadedBaseMap = null; loadedNormalMap = null;
        material.map = null; material.normalMap = null;
    } else {
        loadedBaseMap = generateProceduralTexture(selected);
        loadedNormalMap = generateProceduralNormalTexture(selected);
        if (toggleBaseMap.checked) material.map = loadedBaseMap;
        if (toggleNormalMap.checked) {
            material.normalMap = loadedNormalMap;
            material.normalScale.set(parseFloat(normalStrengthSlider.value), parseFloat(normalStrengthSlider.value));
        }
        if (selected === "gold" || selected === "silver") {
            material.metalness = 0.9; material.roughness = 0.2;
            metalnessSlider.value = "0.9"; roughnessSlider.value = "0.2";
        } else if (selected === "tiles" || selected === "marble") {
            material.metalness = 0.0; material.roughness = 0.15;
            metalnessSlider.value = "0.0"; roughnessSlider.value = "0.15";
        }
    }
    updateTextureTransforms();
    material.needsUpdate = true;
});

textureUpload.addEventListener("change", (e) => loadTexture(e.target.files[0], t => { loadedBaseMap = t; if (toggleBaseMap.checked) material.map = t; texturePresetSelect.value = "none"; material.needsUpdate = true; }));
normalUpload.addEventListener("change", (e) => loadTexture(e.target.files[0], t => { loadedNormalMap = t; if (toggleNormalMap.checked) material.normalMap = t; material.needsUpdate = true; }));
roughnessMapUpload.addEventListener("change", (e) => loadTexture(e.target.files[0], t => { loadedRoughnessMap = t; if (toggleRoughnessMap.checked) material.roughnessMap = t; material.needsUpdate = true; }));
metallicMapUpload.addEventListener("change", (e) => loadTexture(e.target.files[0], t => { loadedMetallicMap = t; if (toggleMetallicMap.checked) material.metalnessMap = t; material.needsUpdate = true; }));
emissiveMapUpload?.addEventListener("change", (e) => loadTexture(e.target.files[0], t => { loadedEmissiveMap = t; if (toggleEmissiveMap.checked) material.emissiveMap = t; material.needsUpdate = true; }));

toggleBaseMap?.addEventListener("change", () => { material.map = toggleBaseMap.checked ? loadedBaseMap : null; material.needsUpdate = true; });
toggleNormalMap?.addEventListener("change", () => { material.normalMap = toggleNormalMap.checked ? loadedNormalMap : null; material.needsUpdate = true; });
toggleRoughnessMap?.addEventListener("change", () => { material.roughnessMap = toggleRoughnessMap.checked ? loadedRoughnessMap : null; material.needsUpdate = true; });
toggleMetallicMap?.addEventListener("change", () => { material.metalnessMap = toggleMetallicMap.checked ? loadedMetallicMap : null; material.needsUpdate = true; });
toggleEmissiveMap?.addEventListener("change", () => { material.emissiveMap = toggleEmissiveMap.checked ? loadedEmissiveMap : null; material.needsUpdate = true; });

uvRepeatSlider?.addEventListener("input", updateTextureTransforms);
uvRotateSlider?.addEventListener("input", updateTextureTransforms);

clearTexturesBtn.addEventListener("click", () => {
    loadedBaseMap = loadedNormalMap = loadedRoughnessMap = loadedMetallicMap = loadedEmissiveMap = null;
    material.map = material.normalMap = material.roughnessMap = material.metalnessMap = material.emissiveMap = null;
    textureUpload.value = normalUpload.value = roughnessMapUpload.value = metallicMapUpload.value = "";
    if (emissiveMapUpload) emissiveMapUpload.value = "";
    if (texturePresetSelect) texturePresetSelect.value = "none";
    toggleBaseMap.checked = toggleNormalMap.checked = toggleRoughnessMap.checked = toggleMetallicMap.checked = toggleEmissiveMap.checked = true;
    uvRepeatSlider.value = "1.0"; uvRotateSlider.value = "0";
    material.needsUpdate = true;
    showToast("All texture maps cleared");
});

/* =====================================================
   MODEL LOADER (GLB, GLTF, FBX) WITH AUTO-FRAMING
===================================================== */
function loadModelFromURL(url, fileName) {
    const fileExt = fileName.split('.').pop().toLowerCase();
    setLoading(true, `Parsing ${fileExt.toUpperCase()} Model...`);

    const onLoaded = (modelObject) => {
        if (previewMesh) { scene.remove(previewMesh); previewMesh = null; }
        if (importedModel) { scene.remove(importedModel); importedModel = null; }

        importedModel = modelObject;
        importedModel.traverse((child) => {
            if (child.isMesh) {
                child.material = material;
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        // Advanced Bounding Box Auto-Centering & Camera Framing
        const box = new THREE.Box3().setFromObject(importedModel);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        importedModel.position.sub(center);
        
        const maxDim = Math.max(size.x, size.y, size.z);
        baseModelScale = maxDim > 0 ? 2 / maxDim : 1.0;
        importedModel.scale.set(baseModelScale, baseModelScale, baseModelScale);

        scene.add(importedModel);
        attachGizmo(importedModel);
        resetTransformUI();
        updateMeshStats();
        
        setLoading(false);
        showToast(`Successfully loaded ${fileName}`);
    };

    const onError = (err) => {
        setLoading(false);
        console.error("Model Load Error:", err);
        showToast(`Failed to parse ${fileName}`, true);
    };

    if (fileExt === "fbx") {
        fbxLoader.load(url, onLoaded, undefined, onError);
    } else {
        gltfLoader.load(url, gltf => onLoaded(gltf.scene), undefined, onError);
    }
}

modelUpload.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    addToRecentModels(file);
    loadModelFromURL(recentModelsHistory[0].url, recentModelsHistory[0].name);
});

clearModelBtn.addEventListener("click", () => {
    if (importedModel) { scene.remove(importedModel); importedModel = null; }
    modelUpload.value = "";
    changeGeometry(geometrySelect.value);
    showToast("Custom model removed");
});

/* =====================================================
   DRAG & DROP SYSTEM
===================================================== */
if (viewportContainer) {
    ["dragenter", "dragover"].forEach(name => {
        viewportContainer.addEventListener(name, e => { e.preventDefault(); e.stopPropagation(); viewportContainer.classList.add("drag-over"); }, false);
    });
    ["dragleave", "drop"].forEach(name => {
        viewportContainer.addEventListener(name, e => { e.preventDefault(); e.stopPropagation(); viewportContainer.classList.remove("drag-over"); }, false);
    });
    viewportContainer.addEventListener("drop", (e) => {
        const file = e.dataTransfer.files[0];
        if (!file) return;
        const name = file.name.toLowerCase();

        if (name.endsWith(".glb") || name.endsWith(".gltf") || name.endsWith(".fbx")) {
            addToRecentModels(file);
            loadModelFromURL(recentModelsHistory[0].url, recentModelsHistory[0].name);
        } else if (file.type.startsWith("image/") || name.match(/\.(png|jpg|jpeg|webp)$/)) {
            loadTexture(file, t => {
                loadedBaseMap = t;
                if (toggleBaseMap.checked) material.map = t;
                texturePresetSelect.value = "none";
                material.needsUpdate = true;
            });
        }
    });
}

/* =====================================================
   MATERIAL & LIGHTING SLIDERS
===================================================== */
metalnessSlider.addEventListener("input", () => { material.metalness = parseFloat(metalnessSlider.value); if (metalnessVal) metalnessVal.textContent = material.metalness.toFixed(2); });
roughnessSlider.addEventListener("input", () => { material.roughness = parseFloat(roughnessSlider.value); if (roughnessVal) roughnessVal.textContent = material.roughness.toFixed(2); });
normalStrengthSlider.addEventListener("input", () => {
    const val = parseFloat(normalStrengthSlider.value);
    material.normalScale.set(val, val);
    if (normalVal) normalVal.textContent = val.toFixed(1);
});

geometrySelect.addEventListener("change", () => changeGeometry(geometrySelect.value));
wireframeCheckbox?.addEventListener("change", () => {
    if (!wireframeCheckbox.checked && wireframeOnlyCheckbox) wireframeOnlyCheckbox.checked = false;
    updateWireframeOverlay();
});
wireframeOnlyCheckbox?.addEventListener("change", updateWireframeOverlay);
autoRotateCheckbox.addEventListener("change", () => { controls.autoRotate = autoRotateCheckbox.checked; });

lightAngleSlider?.addEventListener("input", () => {
    const rad = (parseFloat(lightAngleSlider.value) * Math.PI) / 180;
    directionalLight.position.x = Math.cos(rad) * 9;
    directionalLight.position.z = Math.sin(rad) * 9;
    if (lightAngleVal) lightAngleVal.textContent = `${lightAngleSlider.value}°`;
});
mainLightSlider?.addEventListener("input", () => { directionalLight.intensity = parseFloat(mainLightSlider.value); if (mainLightVal) mainLightVal.textContent = directionalLight.intensity.toFixed(1); });
ambientLightSlider?.addEventListener("input", () => { ambientLight.intensity = parseFloat(ambientLightSlider.value); if (ambientLightVal) ambientLightVal.textContent = ambientLight.intensity.toFixed(1); });
exposureSlider?.addEventListener("input", () => { renderer.toneMappingExposure = parseFloat(exposureSlider.value); if (exposureVal) exposureVal.textContent = renderer.toneMappingExposure.toFixed(1); });

resetCameraBtn.addEventListener("click", () => { camera.position.set(0, 1.5, 4); controls.target.set(0, 0, 0); controls.update(); });
exportBtn.addEventListener("click", () => {
    composer.render();
    const link = document.createElement("a");
    link.download = "material-preview.png";
    link.href = renderer.domElement.toDataURL("image/png");
    link.click();
    showToast("Viewport snapshot exported!");
});

/* =====================================================
   ANIMATION LOOP & RESIZE
===================================================== */
function onWindowResize() {
    camera.aspect = viewer.clientWidth / viewer.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(viewer.clientWidth, viewer.clientHeight);
    composer.setSize(viewer.clientWidth, viewer.clientHeight);
}
window.addEventListener("resize", onWindowResize);

let frameCount = 0, lastTime = performance.now();
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    composer.render();

    frameCount++;
    const now = performance.now();
    if (now - lastTime >= 1000) {
        if (fpsLabel) fpsLabel.textContent = `FPS ${frameCount}`;
        frameCount = 0;
        lastTime = now;
    }
}
animate();

window.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === 'r') { camera.position.set(0, 1.5, 4); controls.target.set(0, 0, 0); controls.update(); }
    if (e.key.toLowerCase() === ' ') { e.preventDefault(); controls.autoRotate = !controls.autoRotate; autoRotateCheckbox.checked = controls.autoRotate; }
});

updateMeshStats();