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
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x87CEEB); // Sky blue background
        document.body.appendChild(this.renderer.domElement);

        // Add skybox
        const skybox = new Skybox();
        this.scene.add(skybox.mesh);

        // Add city
        this.city = new City(200, 200); // Larger city with more buildings
        this.scene.add(this.city.mesh);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(100, 100, 50);
        this.scene.add(directionalLight);

        // Add fog for distance fade
        this.scene.fog = new THREE.Fog(0xe0ffff, 100, 600);

        // Initialize components
        this.plane = new Plane();
        this.scene.add(this.plane.mesh);

        // Position plane above city
        this.plane.mesh.position.set(0, 100, -150); // Start high up and outside city

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