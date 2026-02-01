/**
 * Data Flow Visualization - MOBILE OPTIMIZED
 * Creates and animates data tokens moving between CPU components
 */

export class DataFlow {
    constructor(scene) {
        this.scene = scene;
        this.activeTokens = [];
        this.scaleFactor = 0.4; // Match CPU model scale
    }

    createDataToken(start, end, color = 0x00ff00, duration = 1.0) {
        return new Promise((resolve) => {
            // Smaller sphere for mobile visibility
            const geometry = new THREE.SphereGeometry(0.06 * this.scaleFactor, 12, 12);
            const material = new THREE.MeshStandardMaterial({
                color: color,
                emissive: color,
                emissiveIntensity: 1.0,
                metalness: 0.3,
                roughness: 0.3
            });
            
            const token = new THREE.Mesh(geometry, material);
            token.position.copy(start);
            this.scene.add(token);
            this.activeTokens.push(token);
            
            // Animate using GSAP
            gsap.to(token.position, {
                x: end.x,
                y: end.y,
                z: end.z,
                duration: duration,
                ease: "power2.inOut",
                onComplete: () => {
                    this.scene.remove(token);
                    const index = this.activeTokens.indexOf(token);
                    if (index > -1) {
                        this.activeTokens.splice(index, 1);
                    }
                    geometry.dispose();
                    material.dispose();
                    resolve();
                }
            });
            
            // Pulsing effect
            gsap.to(token.scale, {
                x: 1.5,
                y: 1.5,
                z: 1.5,
                duration: 0.4,
                yoyo: true,
                repeat: Math.floor((duration / 0.4) * 2)
            });
        });
    }

    createGlowingWire(start, end, color = 0xffff00, duration = 0.5) {
        return new Promise((resolve) => {
            const points = [start.clone(), end.clone()];
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const material = new THREE.LineBasicMaterial({
                color: color,
                linewidth: 3,
                transparent: true,
                opacity: 0
            });
            
            const wire = new THREE.Line(geometry, material);
            this.scene.add(wire);
            
            gsap.to(material, {
                opacity: 0.9,
                duration: 0.2,
                onComplete: () => {
                    setTimeout(() => {
                        gsap.to(material, {
                            opacity: 0,
                            duration: 0.3,
                            onComplete: () => {
                                this.scene.remove(wire);
                                geometry.dispose();
                                material.dispose();
                                resolve();
                            }
                        });
                    }, duration * 1000);
                }
            });
        });
    }

    clearAllTokens() {
        this.activeTokens.forEach(token => {
            this.scene.remove(token);
        });
        this.activeTokens = [];
    }
}