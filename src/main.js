import * as THREE from 'three';
import { Plane } from './models/Plane.js';
import { FlightControls } from './controls/FlightControls.js';
import { CameraController } from './controls/CameraController.js';
import { GameUI } from './ui/GameUI.js';
import { City } from './environment/City.js';
import { Skybox } from './environment/Skybox.js';

class Game {
    constructor() {
        // Scene setup
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            logarithmicDepthBuffer: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.body.appendChild(this.renderer.domElement);

        // Add skybox
        this.skybox = new Skybox();
        this.scene.add(this.skybox.mesh);

        // Add city
        this.city = new City(200); // Larger city
        this.scene.add(this.city.mesh);

        // Lighting
        this.setupLighting();

        // Add fog for distance fade
        this.scene.fog = new THREE.Fog(0xc6e6ff, 100, 800);

        // Initialize components
        this.plane = new Plane();
        this.scene.add(this.plane.mesh);

        // Position plane above city
        this.plane.mesh.position.set(0, 150, -200); // Higher up and further out
        this.plane.mesh.rotation.x = -Math.PI / 12; // Slight nose-down attitude

        this.controls = new FlightControls();
        this.cameraController = new CameraController(this.camera, this.plane.mesh);
        this.ui = new GameUI();

        // Time tracking for physics
        this.clock = new THREE.Clock();
        this.deltaTime = 0;

        // Camera toggle handler
        document.addEventListener('keydown', (event) => {
            if (event.key.toLowerCase() === 'c') {
                this.cameraController.toggleMode();
            }
        });

        // Handle window resize
        window.addEventListener('resize', this.onWindowResize.bind(this));

        // Start animation loop
        this.animate();
    }

    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);

        // Main directional light (sun)
        const sunLight = new THREE.DirectionalLight(0xffffff, 1);
        sunLight.position.set(100, 100, 50);
        sunLight.castShadow = true;
        
        // Improve shadow quality
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        sunLight.shadow.camera.near = 0.5;
        sunLight.shadow.camera.far = 500;
        sunLight.shadow.camera.left = -200;
        sunLight.shadow.camera.right = 200;
        sunLight.shadow.camera.top = 200;
        sunLight.shadow.camera.bottom = -200;
        
        this.scene.add(sunLight);

        // Secondary fill light
        const fillLight = new THREE.DirectionalLight(0x8088ff, 0.3); // Slight blue tint
        fillLight.position.set(-100, 50, -50);
        this.scene.add(fillLight);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        // Update delta time
        this.deltaTime = this.clock.getDelta();

        // Update controls and plane
        const controlState = this.controls.update(this.deltaTime);
        this.plane.update(controlState, this.deltaTime);
        
        // Update camera
        this.cameraController.update(this.deltaTime);
        
        // Update clouds
        this.skybox.update(this.deltaTime);
        
        // Update UI
        this.ui.updateSpeed(
            controlState.speed,
            this.controls.minSpeed,
            this.controls.maxSpeed
        );

        // Render scene
        this.renderer.render(this.scene, this.camera);
    }
}

// Start the game
new Game();