/**
 * Data Flow Visualization - MOBILE OPTIMIZED
 * Larger, more visible tokens and effects for mobile devices
 */

export class DataFlow {
    constructor(scene) {
        this.scene = scene;
        this.activeTokens = [];
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        this.scaleFactor = this.isMobile ? 0.35 : 0.45; // Match CPU model scale
    }

    /**
     * Create animated data token (sphere) - Mobile optimized
     */
    createDataToken(start, end, color = 0x00ff00, duration = 1.0, label = '') {
        return new Promise((resolve) => {
            // Larger tokens for mobile visibility
            const tokenSize = this.isMobile ? 0.08 : 0.06;
            
            const geometry = new THREE.SphereGeometry(
                tokenSize * this.scaleFactor, 
                this.isMobile ? 10 : 12, 
                this.isMobile ? 10 : 12
            );
            const material = new THREE.MeshStandardMaterial({
                color: color,
                emissive: color,
                emissiveIntensity: this.isMobile ? 1.3 : 1.0,
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
            
            // Enhanced pulsing effect for mobile
            const pulseScale = this.isMobile ? 1.6 : 1.5;
            gsap.to(token.scale, {
                x: pulseScale,
                y: pulseScale,
                z: pulseScale,
                duration: 0.4,
                yoyo: true,
                repeat: Math.floor((duration / 0.4) * 2)
            });
        });
    }

    /**
     * Create glowing wire effect - Mobile optimized
     */
    createGlowingWire(start, end, color = 0xffff00, duration = 0.5) {
        return new Promise((resolve) => {
            const points = [start.clone(), end.clone()];
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const material = new THREE.LineBasicMaterial({
                color: color,
                linewidth: this.isMobile ? 4 : 3,
                transparent: true,
                opacity: 0
            });
            
            const wire = new THREE.Line(geometry, material);
            this.scene.add(wire);
            
            // Brighter fade in for mobile
            const maxOpacity = this.isMobile ? 1.0 : 0.9;
            gsap.to(material, {
                opacity: maxOpacity,
                duration: 0.2,
                onComplete: () => {
                    setTimeout(() => {
                        // Fade out
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

    /**
     * Clear all active tokens
     */
    clearAllTokens() {
        this.activeTokens.forEach(token => {
            this.scene.remove(token);
        });
        this.activeTokens = [];
    }
}
