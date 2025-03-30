export class GameUI {
    constructor() {
        this.container = document.createElement('div');
        this.container.style.position = 'fixed';
        this.container.style.width = '100%';
        this.container.style.height = '100%';
        this.container.style.pointerEvents = 'none';
        document.body.appendChild(this.container);

        this.createControlsPanel();
        this.createSpeedIndicator();
    }

    createControlsPanel() {
        const controls = document.createElement('div');
        controls.style.position = 'absolute';
        controls.style.bottom = '20px';
        controls.style.left = '20px';
        controls.style.padding = '15px';
        controls.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        controls.style.color = 'white';
        controls.style.fontFamily = 'monospace';
        controls.style.borderRadius = '5px';
        controls.innerHTML = `
            <h3 style="margin: 0 0 10px 0">Controls</h3>
            <div>W/S - Pitch Up/Down</div>
            <div>A/D - Roll Left/Right</div>
            <div>Q/E - Speed Down/Up</div>
            <div>C - Toggle Camera</div>
        `;
        this.container.appendChild(controls);
    }

    createSpeedIndicator() {
        const speedIndicator = document.createElement('div');
        speedIndicator.style.position = 'absolute';
        speedIndicator.style.top = '20px';
        speedIndicator.style.right = '20px';
        speedIndicator.style.padding = '10px';
        speedIndicator.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        speedIndicator.style.color = 'white';
        speedIndicator.style.fontFamily = 'monospace';
        speedIndicator.style.borderRadius = '5px';
        this.container.appendChild(speedIndicator);
        this.speedIndicator = speedIndicator;
    }

    updateSpeed(speed, minSpeed, maxSpeed) {
        const percentage = (speed - minSpeed) / (maxSpeed - minSpeed);
        let color = '#ffffff';
        
        if (percentage < 0.3) color = '#ff6b6b';
        else if (percentage > 0.7) color = '#51cf66';
        
        this.speedIndicator.innerHTML = `
            <div style="margin-bottom: 5px">Speed</div>
            <div style="color: ${color}">${Math.round(speed)} units</div>
        `;
    }
} 