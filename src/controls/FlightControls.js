import * as THREE from 'three';

export class FlightControls {
    constructor() {
        // Control parameters
        this.pitchSensitivity = 0.8;
        this.turnSensitivity = 1.5;
        this.rollSensitivity = 2.0;
        
        // State
        this.pitch = 0;
        this.roll = 0;
        this.yaw = 0;
        this.speed = 30; // Initial speed
        this.minSpeed = 10;
        this.maxSpeed = 50;
        
        // Input state
        this.keys = {
            w: false,
            s: false,
            a: false,
            d: false,
            q: false,
            e: false,
            c: false
        };
        
        // Bind event listeners
        document.addEventListener('keydown', this.onKeyDown.bind(this));
        document.addEventListener('keyup', this.onKeyUp.bind(this));
    }

    onKeyDown(event) {
        if (this.keys.hasOwnProperty(event.key.toLowerCase())) {
            this.keys[event.key.toLowerCase()] = true;
        }
    }

    onKeyUp(event) {
        if (this.keys.hasOwnProperty(event.key.toLowerCase())) {
            this.keys[event.key.toLowerCase()] = false;
        }
    }

    update(deltaTime) {
        // Normalize inputs to -1 to 1 range
        const pitchInput = (this.keys.w ? -1 : 0) + (this.keys.s ? 1 : 0);
        const rollInput = (this.keys.a ? -1 : 0) + (this.keys.d ? 1 : 0);
        const speedInput = (this.keys.e ? 1 : 0) + (this.keys.q ? -1 : 0);

        // Update speed
        this.speed = THREE.MathUtils.clamp(
            this.speed + speedInput * 20 * deltaTime,
            this.minSpeed,
            this.maxSpeed
        );

        // Update rotation values with sensitivity and time scaling
        this.pitch += pitchInput * this.pitchSensitivity * deltaTime;
        this.roll += rollInput * this.rollSensitivity * deltaTime;
        
        // Yaw is coupled to roll (negative for natural turning)
        this.yaw += -this.roll * this.turnSensitivity * deltaTime;

        // Clamp pitch to ±60 degrees
        this.pitch = THREE.MathUtils.clamp(this.pitch, -Math.PI/3, Math.PI/3);
        
        // Clamp roll to ±45 degrees
        this.roll = THREE.MathUtils.clamp(this.roll, -Math.PI/4, Math.PI/4);

        // Auto-centering when no inputs
        if (!this.keys.w && !this.keys.s) {
            this.pitch *= 0.95; // Gradually return to level
        }
        if (!this.keys.a && !this.keys.d) {
            this.roll *= 0.95; // Gradually level out
            this.yaw *= 0.95; // Gradually straighten
        }

        return {
            pitch: this.pitch,
            roll: this.roll,
            yaw: this.yaw,
            speed: this.speed
        };
    }
} 