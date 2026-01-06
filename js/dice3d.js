// ==================== 3D DICE RENDERER ====================
// Three.js-based interactive d20 display for player view

// Three.js CDN will be loaded dynamically
let THREE = null;

// Dice 3D state
const dice3DState = {
    scene: null,
    camera: null,
    renderer: null,
    dice: null,
    isDragging: false,
    previousMousePosition: { x: 0, y: 0 },
    currentDie: null,
    autoRotate: true,
    rotationSpeed: 0.005,
    targetRotation: { x: 0, y: 0 },
    initialized: false
};

// Load Three.js from CDN
async function loadThreeJS() {
    if (THREE) return true;

    return new Promise((resolve) => {
        // Check if already loaded
        if (window.THREE) {
            THREE = window.THREE;
            resolve(true);
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
        script.onload = () => {
            THREE = window.THREE;
            resolve(true);
        };
        script.onerror = () => {
            console.warn('Failed to load Three.js, using fallback CSS dice');
            resolve(false);
        };
        document.head.appendChild(script);
    });
}

// Initialize the 3D dice viewer
async function init3DDice(containerId = 'pvDice3D') {
    const container = document.getElementById(containerId);
    if (!container) return false;

    // Load Three.js if not loaded
    const loaded = await loadThreeJS();
    if (!loaded) {
        renderFallbackDice(container);
        return false;
    }

    // Clear container
    container.innerHTML = '';

    // Setup scene
    dice3DState.scene = new THREE.Scene();
    dice3DState.scene.background = new THREE.Color(0x0a0a15);

    // Setup camera
    const aspect = container.clientWidth / container.clientHeight;
    dice3DState.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
    dice3DState.camera.position.z = 4;

    // Setup renderer
    dice3DState.renderer = new THREE.WebGLRenderer({ antialias: true });
    dice3DState.renderer.setSize(container.clientWidth, container.clientHeight);
    dice3DState.renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(dice3DState.renderer.domElement);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    dice3DState.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    dice3DState.scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffd700, 0.3);
    pointLight.position.set(-5, -5, 5);
    dice3DState.scene.add(pointLight);

    // Create icosahedron (d20 shape)
    createD20();

    // Add event listeners for rotation
    setupDiceControls(container);

    // Start animation loop
    animate3DDice();

    dice3DState.initialized = true;
    return true;
}

// Create the d20 geometry with face numbers
function createD20(dieData = null) {
    // Remove existing dice
    if (dice3DState.dice) {
        dice3DState.scene.remove(dice3DState.dice);
    }

    // Create icosahedron geometry
    const geometry = new THREE.IcosahedronGeometry(1.2, 0);

    // Determine color based on die category
    let color = 0x4a4a6a; // Default gray
    if (dieData) {
        switch (dieData.category) {
            case 'physical':
                color = 0xCD7F32; // Bronze
                break;
            case 'verbal':
                color = 0xB8C0C8; // Silver
                break;
            case 'preventative':
                color = 0x536878; // Gunmetal
                break;
        }
    }

    // Create material
    const material = new THREE.MeshPhongMaterial({
        color: color,
        flatShading: true,
        shininess: 50
    });

    dice3DState.dice = new THREE.Mesh(geometry, material);
    dice3DState.dice.rotation.x = Math.random() * Math.PI;
    dice3DState.dice.rotation.y = Math.random() * Math.PI;

    dice3DState.scene.add(dice3DState.dice);

    // Add face number labels using sprites
    if (dieData && dieData.faces) {
        addFaceLabels(geometry, dieData.faces);
    }

    dice3DState.currentDie = dieData;
}

// Add number labels to d20 faces
function addFaceLabels(geometry, faces) {
    // Get face centers
    const position = geometry.attributes.position;
    const faceCenters = [];

    for (let i = 0; i < position.count; i += 3) {
        const v1 = new THREE.Vector3(
            position.getX(i), position.getY(i), position.getZ(i)
        );
        const v2 = new THREE.Vector3(
            position.getX(i + 1), position.getY(i + 1), position.getZ(i + 1)
        );
        const v3 = new THREE.Vector3(
            position.getX(i + 2), position.getY(i + 2), position.getZ(i + 2)
        );

        const center = new THREE.Vector3()
            .add(v1).add(v2).add(v3)
            .divideScalar(3);

        faceCenters.push(center);
    }

    // Only label first 20 faces (icosahedron has 20)
    const numFaces = Math.min(faceCenters.length, 20);

    for (let i = 0; i < numFaces; i++) {
        const center = faceCenters[i];
        const faceValue = faces[i] || (i + 1);

        // Create text sprite
        const sprite = createTextSprite(faceValue.toString());
        sprite.position.copy(center).multiplyScalar(1.05); // Slightly outside the face

        dice3DState.dice.add(sprite);
    }
}

// Create a text sprite for face labels
function createTextSprite(text) {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.beginPath();
    ctx.arc(32, 32, 28, 0, Math.PI * 2);
    ctx.fill();

    // Text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 32, 32);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true
    });

    const sprite = new THREE.Sprite(material);
    sprite.scale.set(0.4, 0.4, 1);

    return sprite;
}

// Setup mouse/touch controls for dice rotation
function setupDiceControls(container) {
    const canvas = dice3DState.renderer.domElement;

    // Mouse events
    canvas.addEventListener('mousedown', onPointerDown);
    canvas.addEventListener('mousemove', onPointerMove);
    canvas.addEventListener('mouseup', onPointerUp);
    canvas.addEventListener('mouseleave', onPointerUp);

    // Touch events
    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd);
}

function onPointerDown(e) {
    dice3DState.isDragging = true;
    dice3DState.autoRotate = false;
    dice3DState.previousMousePosition = {
        x: e.clientX,
        y: e.clientY
    };
}

function onPointerMove(e) {
    if (!dice3DState.isDragging || !dice3DState.dice) return;

    const deltaX = e.clientX - dice3DState.previousMousePosition.x;
    const deltaY = e.clientY - dice3DState.previousMousePosition.y;

    dice3DState.dice.rotation.y += deltaX * 0.01;
    dice3DState.dice.rotation.x += deltaY * 0.01;

    dice3DState.previousMousePosition = {
        x: e.clientX,
        y: e.clientY
    };
}

function onPointerUp() {
    dice3DState.isDragging = false;
    // Resume auto-rotate after 3 seconds of no interaction
    setTimeout(() => {
        if (!dice3DState.isDragging) {
            dice3DState.autoRotate = true;
        }
    }, 3000);
}

function onTouchStart(e) {
    e.preventDefault();
    if (e.touches.length === 1) {
        dice3DState.isDragging = true;
        dice3DState.autoRotate = false;
        dice3DState.previousMousePosition = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        };
    }
}

function onTouchMove(e) {
    e.preventDefault();
    if (!dice3DState.isDragging || e.touches.length !== 1 || !dice3DState.dice) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - dice3DState.previousMousePosition.x;
    const deltaY = touch.clientY - dice3DState.previousMousePosition.y;

    dice3DState.dice.rotation.y += deltaX * 0.01;
    dice3DState.dice.rotation.x += deltaY * 0.01;

    dice3DState.previousMousePosition = {
        x: touch.clientX,
        y: touch.clientY
    };
}

function onTouchEnd() {
    dice3DState.isDragging = false;
    setTimeout(() => {
        if (!dice3DState.isDragging) {
            dice3DState.autoRotate = true;
        }
    }, 3000);
}

// Animation loop
function animate3DDice() {
    requestAnimationFrame(animate3DDice);

    if (dice3DState.dice && dice3DState.autoRotate) {
        dice3DState.dice.rotation.y += dice3DState.rotationSpeed;
        dice3DState.dice.rotation.x += dice3DState.rotationSpeed * 0.5;
    }

    if (dice3DState.renderer && dice3DState.scene && dice3DState.camera) {
        dice3DState.renderer.render(dice3DState.scene, dice3DState.camera);
    }
}

// Update the 3D dice display with new die data
function render3DDie(die) {
    if (!dice3DState.initialized) {
        init3DDice().then(() => {
            if (die) createD20(die);
        });
        return;
    }

    if (die) {
        createD20(die);
    }
}

// Fallback for when Three.js can't load
function renderFallbackDice(container) {
    container.innerHTML = `
        <div class="fallback-dice">
            <div class="fallback-dice-inner">
                <span class="fallback-icon">🎲</span>
                <p>Drag to rotate</p>
                <p class="fallback-note">(3D view unavailable)</p>
            </div>
        </div>
    `;

    // Add CSS rotation on drag for fallback
    const fallbackDice = container.querySelector('.fallback-dice');
    if (fallbackDice) {
        let isDragging = false;
        let rotation = { x: 0, y: 0 };
        let lastPos = { x: 0, y: 0 };

        fallbackDice.addEventListener('mousedown', (e) => {
            isDragging = true;
            lastPos = { x: e.clientX, y: e.clientY };
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const dx = e.clientX - lastPos.x;
            const dy = e.clientY - lastPos.y;
            rotation.y += dx;
            rotation.x += dy;
            fallbackDice.style.transform = `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`;
            lastPos = { x: e.clientX, y: e.clientY };
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }
}

// Roll animation
function animateDiceRoll(result, callback) {
    if (!dice3DState.dice) {
        if (callback) callback();
        return;
    }

    dice3DState.autoRotate = false;

    // Spin rapidly
    const startTime = Date.now();
    const duration = 1000;

    function spinAnimation() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out the spin
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const spinSpeed = 0.3 * (1 - easeOut);

        dice3DState.dice.rotation.x += spinSpeed;
        dice3DState.dice.rotation.y += spinSpeed * 1.5;
        dice3DState.dice.rotation.z += spinSpeed * 0.5;

        if (progress < 1) {
            requestAnimationFrame(spinAnimation);
        } else {
            // Done spinning
            setTimeout(() => {
                dice3DState.autoRotate = true;
                if (callback) callback();
            }, 500);
        }
    }

    spinAnimation();
}

// Cleanup
function dispose3DDice() {
    if (dice3DState.renderer) {
        dice3DState.renderer.dispose();
    }
    dice3DState.scene = null;
    dice3DState.camera = null;
    dice3DState.renderer = null;
    dice3DState.dice = null;
    dice3DState.initialized = false;
}

// Handle window resize
window.addEventListener('resize', () => {
    const container = document.getElementById('pvDice3D');
    if (!container || !dice3DState.renderer || !dice3DState.camera) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    dice3DState.camera.aspect = width / height;
    dice3DState.camera.updateProjectionMatrix();
    dice3DState.renderer.setSize(width, height);
});
