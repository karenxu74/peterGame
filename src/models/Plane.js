import * as THREE from 'three';

export class Plane {
    constructor() {
        // Create a group to hold all plane parts
        this.mesh = new THREE.Group();

        // Materials
        const planeMaterial = new THREE.MeshPhongMaterial({
            color: 0x303030,
            flatShading: true
        });

        // Fuselage
        const fuselageGeometry = new THREE.CylinderGeometry(0.5, 0.5, 4, 8);
        const fuselage = new THREE.Mesh(fuselageGeometry, planeMaterial);
        fuselage.rotation.z = Math.PI / 2;
        this.mesh.add(fuselage);

        // Wings
        const wingGeometry = new THREE.BoxGeometry(8, 0.2, 1.5);
        const wings = new THREE.Mesh(wingGeometry, planeMaterial);
        wings.position.y = 0;
        this.mesh.add(wings);

        // Tail
        const tailGeometry = new THREE.BoxGeometry(3, 0.2, 1);
        const tail = new THREE.Mesh(tailGeometry, planeMaterial);
        tail.position.z = -1.5;
        this.mesh.add(tail);

        // Vertical Stabilizer
        const vStabGeometry = new THREE.BoxGeometry(0.2, 1, 1);
        const vStab = new THREE.Mesh(vStabGeometry, planeMaterial);
        vStab.position.z = -1.5;
        vStab.position.y = 0.5;
        this.mesh.add(vStab);

        // Propeller
        this.propeller = new THREE.Group();
        const bladeGeometry = new THREE.BoxGeometry(0.1, 1.5, 0.2);
        const blade1 = new THREE.Mesh(bladeGeometry, planeMaterial);
        const blade2 = new THREE.Mesh(bladeGeometry, planeMaterial);
        blade2.rotation.z = Math.PI / 2;
        this.propeller.add(blade1);
        this.propeller.add(blade2);
        this.propeller.position.z = 2;
        this.mesh.add(this.propeller);

        // Set initial position and rotation
        this.mesh.position.set(0, 100, 0); // Start high up
        this.mesh.rotation.x = -Math.PI / 12; // Slight nose-down attitude

        // Movement properties
        this.velocity = new THREE.Vector3();
        this.quaternion = new THREE.Quaternion();
        this.euler = new THREE.Euler(0, 0, 0, 'YXZ');
    }

    update(controls, deltaTime) {
        // Update rotation using quaternions
        this.euler.x = controls.pitch;
        this.euler.y = controls.yaw;
        this.euler.z = controls.roll;
        
        this.quaternion.setFromEuler(this.euler);
        this.mesh.quaternion.copy(this.quaternion);

        // Update position based on orientation and speed
        const forward = new THREE.Vector3(0, 0, 1);
        forward.applyQuaternion(this.quaternion);
        forward.multiplyScalar(controls.speed * deltaTime);
        
        this.mesh.position.add(forward);

        // Rotate propeller
        this.rotatePropeller();
    }

    rotatePropeller() {
        this.propeller.rotation.z += 0.3;
    }
} 