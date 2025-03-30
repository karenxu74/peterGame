import * as THREE from 'three';

export class City {
    constructor(size = 200) {
        this.mesh = new THREE.Group();
        
        // Create terrain with hills
        this.createTerrain(size);
        
        // Create buildings in different districts
        this.createDowntown(size);
        this.createResidentialAreas(size);
        
        // Add road grid (SF style)
        this.createRoads(size);
    }

    createTerrain(size) {
        // Create a height map for SF-like hills
        const segments = 128;
        const geometry = new THREE.PlaneGeometry(size * 2, size * 2, segments, segments);
        const vertices = geometry.attributes.position.array;

        // Create hills
        for (let i = 0; i < vertices.length; i += 3) {
            const x = vertices[i];
            const z = vertices[i + 2];
            
            // Create multiple hills
            let height = 0;
            height += Math.exp(-(x * x + z * z) / 2000); // Nob Hill
            height += Math.exp(-((x - 50) * (x - 50) + (z + 50) * (z + 50)) / 3000); // Russian Hill
            height += Math.exp(-((x + 50) * (x + 50) + (z - 50) * (z - 50)) / 4000); // Pacific Heights
            
            vertices[i + 1] = height * 15; // Amplify height
        }

        geometry.computeVertexNormals();
        
        const material = new THREE.MeshPhongMaterial({
            color: 0x3d5e3a, // Rich green for parks and vegetation
            shininess: 0,
            flatShading: true
        });

        const terrain = new THREE.Mesh(geometry, material);
        terrain.rotation.x = -Math.PI / 2;
        terrain.receiveShadow = true;
        this.mesh.add(terrain);
    }

    createDowntown(size) {
        const downtownCenter = new THREE.Vector2(-size/4, -size/4);
        const downtownRadius = size/6;
        
        // Skyscraper properties
        const buildingCount = 30;
        const materials = [
            new THREE.MeshPhongMaterial({ color: 0x505355 }), // Modern glass
            new THREE.MeshPhongMaterial({ color: 0x706f6f }), // Steel
            new THREE.MeshPhongMaterial({ color: 0x605f5f })  // Concrete
        ];

        for (let i = 0; i < buildingCount; i++) {
            const angle = (i / buildingCount) * Math.PI * 2;
            const radius = Math.random() * downtownRadius;
            const x = downtownCenter.x + Math.cos(angle) * radius;
            const z = downtownCenter.y + Math.sin(angle) * radius;

            // Taller buildings near center
            const distanceFromCenter = Math.sqrt(x * x + z * z);
            const maxHeight = 100 * (1 - distanceFromCenter / (size/2));
            const height = 40 + Math.random() * maxHeight;

            const width = 5 + Math.random() * 10;
            const depth = 5 + Math.random() * 10;

            const geometry = new THREE.BoxGeometry(width, height, depth);
            const material = materials[Math.floor(Math.random() * materials.length)];
            const building = new THREE.Mesh(geometry, material);

            building.position.set(x, height/2, z);
            building.castShadow = true;
            building.receiveShadow = true;
            this.mesh.add(building);
        }
    }

    createResidentialAreas(size) {
        const blockSize = 20;
        const buildingGap = 2;
        const blocks = Math.floor(size / blockSize);
        
        const materials = [
            new THREE.MeshPhongMaterial({ color: 0xd4c3bc }), // SF Beige
            new THREE.MeshPhongMaterial({ color: 0xe8dcd5 }), // Light Pink
            new THREE.MeshPhongMaterial({ color: 0xc4b5ae })  // Warm Gray
        ];

        for (let bx = -blocks/2; bx < blocks/2; bx++) {
            for (let bz = -blocks/2; bz < blocks/2; bz++) {
                // Skip downtown area
                const distFromDowntown = Math.sqrt(
                    Math.pow(bx * blockSize + size/4, 2) + 
                    Math.pow(bz * blockSize + size/4, 2)
                );
                if (distFromDowntown < size/6) continue;

                // Create Victorian-style houses
                const houseCount = 4;
                for (let i = 0; i < houseCount; i++) {
                    const x = bx * blockSize + (Math.random() * (blockSize - buildingGap));
                    const z = bz * blockSize + (Math.random() * (blockSize - buildingGap));
                    
                    const width = 4 + Math.random() * 2;
                    const height = 8 + Math.random() * 4;
                    const depth = 4 + Math.random() * 2;

                    const geometry = new THREE.BoxGeometry(width, height, depth);
                    const material = materials[Math.floor(Math.random() * materials.length)];
                    const house = new THREE.Mesh(geometry, material);

                    house.position.set(x, height/2, z);
                    house.castShadow = true;
                    house.receiveShadow = true;
                    this.mesh.add(house);
                }
            }
        }
    }

    createRoads(size) {
        const roadMaterial = new THREE.MeshPhongMaterial({
            color: 0x2c2c2c,  // Dark asphalt
            shininess: 30
        });

        // Create SF-style grid with some angled streets
        const mainGridSize = 20;
        const roadWidth = 4;
        const segmentSize = size / mainGridSize;

        for (let i = -mainGridSize/2; i <= mainGridSize/2; i++) {
            // Main grid streets
            const horizontalGeometry = new THREE.PlaneGeometry(size * 2, roadWidth);
            const horizontalRoad = new THREE.Mesh(horizontalGeometry, roadMaterial);
            horizontalRoad.rotation.x = -Math.PI / 2;
            horizontalRoad.position.set(0, 0.1, i * segmentSize);
            this.mesh.add(horizontalRoad);

            const verticalGeometry = new THREE.PlaneGeometry(roadWidth, size * 2);
            const verticalRoad = new THREE.Mesh(verticalGeometry, roadMaterial);
            verticalRoad.rotation.x = -Math.PI / 2;
            verticalRoad.position.set(i * segmentSize, 0.1, 0);
            this.mesh.add(verticalRoad);
        }

        // Add Market Street (diagonal)
        const marketStreetGeometry = new THREE.PlaneGeometry(size * 1.5, roadWidth * 2);
        const marketStreet = new THREE.Mesh(marketStreetGeometry, roadMaterial);
        marketStreet.rotation.x = -Math.PI / 2;
        marketStreet.rotation.y = Math.PI / 4;
        marketStreet.position.set(-size/4, 0.2, -size/4);
        this.mesh.add(marketStreet);
    }
} 