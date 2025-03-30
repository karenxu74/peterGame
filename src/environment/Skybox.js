import * as THREE from 'three';

export class Skybox {
    constructor() {
        this.mesh = new THREE.Group();

        // Create sky dome
        this.createSkyDome();
        
        // Create clouds
        this.createClouds();
    }

    createSkyDome() {
        const geometry = new THREE.SphereGeometry(1000, 32, 32);
        
        // Create gradient texture for sky
        const canvas = document.createElement('canvas');
        canvas.width = 2;
        canvas.height = 512;
        const context = canvas.getContext('2d');
        
        // Create gradient with more realistic colors
        const gradient = context.createLinearGradient(0, 0, 0, 512);
        gradient.addColorStop(0, '#0077ff');   // Deeper blue at top
        gradient.addColorStop(0.4, '#4cb7ff'); // Light blue
        gradient.addColorStop(0.7, '#9cd9ff'); // Very light blue
        gradient.addColorStop(1, '#ffffff');   // White at horizon
        
        context.fillStyle = gradient;
        context.fillRect(0, 0, 2, 512);
        
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
            side: THREE.BackSide,
            fog: false
        });
        
        const sky = new THREE.Mesh(geometry, material);
        this.mesh.add(sky);
    }

    createClouds() {
        // Create multiple cloud layers
        this.createCloudLayer(800, 0.3, 20);  // High, sparse clouds
        this.createCloudLayer(600, 0.5, 30);  // Mid-level clouds
        this.createCloudLayer(400, 0.7, 40);  // Low, dense clouds
    }

    createCloudLayer(height, opacity, count) {
        const cloudMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: opacity,
            flatShading: true
        });

        for (let i = 0; i < count; i++) {
            const cloudGroup = new THREE.Group();
            
            // Create random cloud shapes using multiple spheres
            const particleCount = 5 + Math.random() * 5;
            for (let j = 0; j < particleCount; j++) {
                const size = 10 + Math.random() * 20;
                const geometry = new THREE.SphereGeometry(size, 8, 8);
                const cloud = new THREE.Mesh(geometry, cloudMaterial);
                
                // Position each sphere randomly within the cloud group
                cloud.position.set(
                    Math.random() * 40 - 20,
                    Math.random() * 10,
                    Math.random() * 40 - 20
                );
                
                // Scale randomly for variety
                const scale = 0.5 + Math.random() * 0.5;
                cloud.scale.set(scale, scale * 0.6, scale);
                
                cloudGroup.add(cloud);
            }

            // Position the entire cloud group randomly in the sky
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 800;
            cloudGroup.position.set(
                Math.cos(angle) * radius,
                height + Math.random() * 100,
                Math.sin(angle) * radius
            );

            // Random rotation for variety
            cloudGroup.rotation.y = Math.random() * Math.PI;
            
            this.mesh.add(cloudGroup);
        }
    }

    update(deltaTime) {
        // Slowly rotate clouds
        this.mesh.children.forEach((child, index) => {
            if (index > 0) { // Skip the sky dome (first child)
                child.rotation.y += deltaTime * 0.01;
            }
        });
    }
} 