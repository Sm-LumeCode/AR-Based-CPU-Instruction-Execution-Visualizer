/**
 * AR Scene Setup - FULLY RESPONSIVE CAMERA
 * Adapts camera position and FOV based on screen size,
 * orientation, and control-panel layout.
 */

export class ARScene {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.arToolkitSource = null;
        this.arToolkitContext = null;
        this.container = null;
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    /**
     * Determine which layout category the viewport falls into.
     * Returns an object with camera settings.
     */
    getResponsiveSettings() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        const isLandscape = w > h;
        const isPortraitMobile = w <= 768 && !isLandscape;
        const isLandscapeMobile = w <= 968 && isLandscape;

        // Default (large desktop)
        let settings = {
            fov: 60,
            camX: 0,
            camY: 0.3,
            camZ: 3.0,
            lookAtY: 0,
        };

        if (isPortraitMobile) {
            // Mobile - PUSHED UP MAX for gap
            settings = {
                fov: 52,       // Even narrower
                camX: 0.0,     // Centered
                camY: 1.35,    // Extreme high angle
                camZ: 3.5,     // Far back
                lookAtY: 1.05, // Look at new center (baseY 1.25)
            };
        } else if (isLandscapeMobile) {
            // Landscape mobile — panel takes right 50 %
            settings = {
                fov: 62,
                camX: -0.3,    // shift model left into the visible half
                camY: 0.3,
                camZ: 2.8,
                lookAtY: 0.0,
            };
        } else if (w <= 1024) {
            // Small laptop / large tablet
            settings = {
                fov: 62,
                camX: -2.0,    // Shifted left to follow model
                camY: 0.2,
                camZ: 4.5,     // Zoomed out more for larger blocks
                lookAtY: -1.0, // Look at new baseY
            };
        } else if (w <= 1366) {
            // Medium laptop
            settings = {
                fov: 62,
                camX: -2.0,
                camY: 0.2,
                camZ: 4.5,
                lookAtY: -1.0,
            };
        } else if (w <= 1920) {
            // Large desktop
            settings = {
                fov: 60,
                camX: -2.0,
                camY: 0.2,
                camZ: 4.5,
                lookAtY: -1.0,
            };
        } else {
            // Extra-large / 4K
            settings = {
                fov: 55,
                camX: 0,
                camY: 0.3,
                camZ: 3.2,
                lookAtY: 0,
            };
        }

        return settings;
    }

    async init() {
        this.container = document.getElementById('ar-container');

        this.scene = new THREE.Scene();
        this.scene.background = null;

        const settings = this.getResponsiveSettings();

        this.camera = new THREE.PerspectiveCamera(
            settings.fov,
            window.innerWidth / window.innerHeight,
            0.1,
            100
        );

        this.camera.position.set(settings.camX, settings.camY, settings.camZ);
        this.camera.lookAt(settings.camX, settings.lookAtY, 0);

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);

        await this.setupAR();
        this.setupLighting();

        window.addEventListener('resize', () => this.onWindowResize());

        return this;
    }

    async setupAR() {
        return new Promise((resolve, reject) => {
            this.arToolkitSource = new THREEx.ArToolkitSource({
                sourceType: 'webcam',
                sourceWidth: this.isMobile ? 640 : window.innerWidth,
                sourceHeight: this.isMobile ? 480 : window.innerHeight,
                displayWidth: window.innerWidth,
                displayHeight: window.innerHeight
            });

            this.arToolkitSource.init(() => {
                console.log('✓ AR Camera initialized');
                this.onResize();
                resolve();
            }, (error) => {
                console.error('✗ AR Camera error:', error);
                reject(error);
            });

            this.arToolkitContext = new THREEx.ArToolkitContext({
                cameraParametersUrl: 'https://cdn.jsdelivr.net/gh/AR-js-org/AR.js@3.4.5/data/data/camera_para.dat',
                detectionMode: 'mono'
            });

            this.arToolkitContext.init(() => {
                this.camera.projectionMatrix.copy(
                    this.arToolkitContext.getProjectionMatrix()
                );
            });
        });
    }

    setupLighting() {
        // Brighter ambient light for better mobile visibility
        const ambientLight = new THREE.AmbientLight(0xffffff, this.isMobile ? 0.8 : 0.7);
        this.scene.add(ambientLight);

        // Stronger directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, this.isMobile ? 0.7 : 0.6);
        directionalLight.position.set(3, 5, 3);
        this.scene.add(directionalLight);

        // Enhanced point light for highlights
        const pointLight = new THREE.PointLight(0x00ffff, this.isMobile ? 0.5 : 0.4, 20);
        pointLight.position.set(this.isMobile ? -0.2 : -0.3, 2, 2);
        this.scene.add(pointLight);

        // Additional fill light for mobile
        if (this.isMobile) {
            const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
            fillLight.position.set(-3, 3, -3);
            this.scene.add(fillLight);
        }
    }

    onWindowResize() {
        // Recalculate responsive settings on every resize
        const settings = this.getResponsiveSettings();

        this.camera.fov = settings.fov;
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.camera.position.set(settings.camX, settings.camY, settings.camZ);
        this.camera.lookAt(settings.camX, settings.lookAtY, 0);

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.onResize();
    }

    onResize() {
        if (this.arToolkitSource && this.arToolkitSource.ready !== false) {
            this.arToolkitSource.onResizeElement();
            this.arToolkitSource.copyElementSizeTo(this.renderer.domElement);
            if (this.arToolkitContext.arController !== null) {
                this.arToolkitSource.copyElementSizeTo(
                    this.arToolkitContext.arController.canvas
                );
            }
        }
    }

    startRenderLoop() {
        const animate = () => {
            requestAnimationFrame(animate);

            if (this.arToolkitSource && this.arToolkitSource.ready !== false) {
                this.arToolkitContext.update(this.arToolkitSource.domElement);
            }

            this.renderer.render(this.scene, this.camera);
        };

        animate();
    }
}
