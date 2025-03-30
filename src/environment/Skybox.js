import * as THREE from 'three';

export class Skybox {
    constructor() {
        // Create a large sphere for the sky
        const geometry = new THREE.SphereGeometry(1000, 32, 32);
        
        // Create gradient texture for sky
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 128;
        const context = canvas.getContext('2d');
        
        // Create gradient
        const gradient = context.createLinearGradient(0, 0, 0, 128);
        gradient.addColorStop(0, '#1e90ff');   // Dodger blue at top
        gradient.addColorStop(0.5, '#87ceeb');  // Sky blue at middle
        gradient.addColorStop(1, '#e0ffff');    // Light cyan at horizon
        
        context.fillStyle = gradient;
        context.fillRect(0, 0, 1, 128);
        
        const texture = new THREE.CanvasTexture(
            canvas,
            THREE.UVMapping,
            THREE.ClampToEdgeWrapping,
            THREE.ClampToEdgeWrapping,
            THREE.LinearFilter,
            THREE.LinearFilter
        );
        
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.BackSide
        });
        
        this.mesh = new THREE.Mesh(geometry, material);
    }
} 