import * as THREE from 'three';

export class City {
    constructor(size = 100, buildingCount = 100) {
        this.mesh = new THREE.Group();
        
        // Create ground
        const groundGeometry = new THREE.PlaneGeometry(size * 2, size * 2);
        const groundMaterial = new THREE.MeshPhongMaterial({
            color: 0x1a472a,  // Dark green for ground
            side: THREE.DoubleSide
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        this.mesh.add(ground);

        // Create buildings
        this.createBuildings(size, buildingCount);

        // Add simple road grid
        this.createRoads(size);
    }

    createBuildings(size, count) {
        const buildingMaterials = [
            new THREE.MeshPhongMaterial({ color: 0x808080 }), // Gray
            new THREE.MeshPhongMaterial({ color: 0xa0a0a0 }), // Light gray
            new THREE.MeshPhongMaterial({ color: 0x606060 })  // Dark gray
        ];

        for (let i = 0; i < count; i++) {
            // Random building dimensions
            const width = 2 + Math.random() * 4;
            const depth = 2 + Math.random() * 4;
            const height = 5 + Math.random() * 30;

            const geometry = new THREE.BoxGeometry(width, height, depth);
            const material = buildingMaterials[Math.floor(Math.random() * buildingMaterials.length)];
            const building = new THREE.Mesh(geometry, material);

            // Position buildings in a grid-like pattern with some randomness
            const gridSize = Math.sqrt(count) * 1.5;
            const cellSize = size / gridSize;
            
            const row = Math.floor(i / gridSize);
            const col = i % gridSize;
            
            const x = (col * cellSize) - (size / 2) + (Math.random() * cellSize - cellSize/2);
            const z = (row * cellSize) - (size / 2) + (Math.random() * cellSize - cellSize/2);

            building.position.set(x, height/2, z);
            this.mesh.add(building);
        }
    }

    createRoads(size) {
        const roadMaterial = new THREE.MeshPhongMaterial({
            color: 0x333333,  // Dark gray for roads
            side: THREE.DoubleSide
        });

        // Create a grid of roads
        const roadWidth = 3;
        const gridSize = 20; // Number of road segments
        const segmentSize = size / gridSize;

        for (let i = 0; i <= gridSize; i++) {
            // Horizontal roads
            const horizontalGeometry = new THREE.PlaneGeometry(size * 2, roadWidth);
            const horizontalRoad = new THREE.Mesh(horizontalGeometry, roadMaterial);
            horizontalRoad.rotation.x = -Math.PI / 2;
            horizontalRoad.position.set(0, 0.1, -size + i * segmentSize * 2);
            this.mesh.add(horizontalRoad);

            // Vertical roads
            const verticalGeometry = new THREE.PlaneGeometry(roadWidth, size * 2);
            const verticalRoad = new THREE.Mesh(verticalGeometry, roadMaterial);
            verticalRoad.rotation.x = -Math.PI / 2;
            verticalRoad.position.set(-size + i * segmentSize * 2, 0.1, 0);
            this.mesh.add(verticalRoad);
        }
    }
} 