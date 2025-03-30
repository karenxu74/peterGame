import * as THREE from 'three';

export class CameraController {
    constructor(camera, target) {
        this.camera = camera;
        this.target = target;
        this.mode = 'follow'; // 'follow' or 'orbit'
        
        // Follow camera parameters
        this.followDistance = 15;
        this.followHeight = 5;
        this.followLerp = 0.1;
        
        // Orbit controls parameters
        this.orbitRadius = 20;
        this.orbitSpeed = 0.001;
        this.orbitAngle = 0;
        
        // Camera quaternion for smooth rotation
        this.currentRotation = new THREE.Quaternion();
        this.targetRotation = new THREE.Quaternion();
    }

    toggleMode() {
        this.mode = this.mode === 'follow' ? 'orbit' : 'follow';
        if (this.mode === 'orbit') {
            this.orbitAngle = Math.atan2(
                this.camera.position.x - this.target.position.x,
                this.camera.position.z - this.target.position.z
            );
        }
    }

    update(deltaTime) {
        if (this.mode === 'follow') {
            this.updateFollowCamera(deltaTime);
        } else {
            this.updateOrbitCamera(deltaTime);
        }
    }

    updateFollowCamera(deltaTime) {
        // Calculate ideal camera position behind plane
        const idealOffset = new THREE.Vector3(0, this.followHeight, -this.followDistance);
        idealOffset.applyQuaternion(this.target.quaternion);
        idealOffset.add(this.target.position);

        // Smoothly interpolate camera position
        this.camera.position.lerp(idealOffset, this.followLerp);

        // Calculate target rotation
        const targetPosition = new THREE.Vector3();
        targetPosition.copy(this.target.position);
        targetPosition.y += 2; // Look slightly above the plane

        // Update camera rotation
        const lookAtMatrix = new THREE.Matrix4();
        lookAtMatrix.lookAt(this.camera.position, targetPosition, new THREE.Vector3(0, 1, 0));
        this.targetRotation.setFromRotationMatrix(lookAtMatrix);
        this.currentRotation.slerp(this.targetRotation, this.followLerp);
        this.camera.quaternion.copy(this.currentRotation);
    }

    updateOrbitCamera(deltaTime) {
        this.orbitAngle += this.orbitSpeed * deltaTime;
        
        const x = Math.sin(this.orbitAngle) * this.orbitRadius;
        const z = Math.cos(this.orbitAngle) * this.orbitRadius;
        
        this.camera.position.set(
            this.target.position.x + x,
            this.target.position.y + this.followHeight,
            this.target.position.z + z
        );
        
        this.camera.lookAt(this.target.position);
    }
} 