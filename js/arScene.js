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

        // --- NEW: OrbitControls state ---
        this.controls = null;
        this.arModeActive = false; // Flag to disable orbit when AR tracking is active

        // --- NEW: Privacy/Shutter Detection ---
        this.privacyCanvas = null;
        this.privacyContext = null;
        this.isShuttered = false;
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
            camX: -2.0,
            camY: 1.2,
            camZ: 5.0,
            lookAtX: -2.0,
            lookAtY: -1.0,
        };

        if (isPortraitMobile) {
            // Mobile - SUBTLE 3D Perspective
            settings = {
                fov: 52,
                camX: 0.4,     // Side offset for 3D look
                camY: 2.2,     // Elevation for top view
                camZ: 4.2,
                lookAtX: 0.0,  // Keep model centered
                lookAtY: 0.8,
            };
        } else if (isLandscapeMobile) {
            // Landscape mobile
            settings = {
                fov: 62,
                camX: -0.3,
                camY: 0.8,
                camZ: 2.8,
                lookAtX: -0.3,
                lookAtY: 0.0,
            };
        } else if (w <= 1024) {
            // Small laptop / large tablet
            settings = {
                fov: 62,
                camX: -2.0,
                camY: 1.0,
                camZ: 4.8,
                lookAtX: -2.0,
                lookAtY: -1.0,
            };
        } else if (w <= 1366) {
            // Medium laptop
            settings = {
                fov: 62,
                camX: -2.0,
                camY: 1.0,
                camZ: 4.8,
                lookAtX: -2.0,
                lookAtY: -1.1,
            };
        } else if (w <= 1920) {
            // Large desktop
            settings = {
                fov: 60,
                camX: -2.0,
                camY: 1.0,
                camZ: 4.8,
                lookAtX: -2.0,
                lookAtY: -1.1,
            };
        } else {
            // Extra-large / 4K
            settings = {
                fov: 55,
                camX: 0,
                camY: 1.0,
                camZ: 4.0,
                lookAtX: 0,
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
        this.camera.lookAt(settings.lookAtX, settings.lookAtY, 0);

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

        // --- NEW: Initialize OrbitControls ---
        this.setupOrbitControls(settings);

        return this;
    }

    /**
     * Setup OrbitControls with appropriate limits and damping
     */
    setupOrbitControls(settings) {
        // We use THREE.OrbitControls loaded via script tag in index.html
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);

        // Smooth movement
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;

        // --- MOBILE/PHONE ENHANCEMENTS ---
        this.controls.enableRotate = true;
        this.controls.enableZoom = true;
        this.controls.enablePan = true;

        // Touch Configuration: 1 finger rotate, 2 finger zoom/pan
        this.controls.touches = {
            ONE: THREE.TOUCH.ROTATE,
            TWO: THREE.TOUCH.DOLLY_PAN
        };

        // Desktop Configuration: Left rotate, Middle zoom, Right pan
        this.controls.mouseButtons = {
            LEFT: THREE.MOUSE.ROTATE,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: THREE.MOUSE.PAN
        };

        // Centering on CPU model using responsive lookAt points
        this.controls.target.set(settings.lookAtX, settings.lookAtY, 0);

        // Limits to keep the model in view
        this.controls.minDistance = 3;
        this.controls.maxDistance = 30;
        this.controls.maxPolarAngle = Math.PI; // Full rotation allowed

        // Conditional enablement based on initial mode
        this.controls.enabled = !this.arModeActive;

        console.log('✓ Camera Orbit Controls initialized (Mobile Touch enabled)');
    }

    /**
     * Helper to toggle AR mode and disable/enable orbit controls
     */
    setARMode(active) {
        this.arModeActive = active;
        if (this.controls) {
            this.controls.enabled = !active;
            // When switching back from AR, reset camera to responsive defaults
            if (!active) {
                const settings = this.getResponsiveSettings();
                this.camera.position.set(settings.camX, settings.camY, settings.camZ);
                this.controls.target.set(settings.lookAtX, settings.lookAtY, 0);
                this.controls.update();
            }
        }
    }

    /**
     * Checks if the camera feed is black (Privacy Shutter active)
     */
    checkCameraPrivacy() {
        if (!this.arToolkitSource || !this.arToolkitSource.ready) return;

        const video = this.arToolkitSource.domElement;
        if (!video || video.readyState < 2) return;

        if (!this.privacyCanvas) {
            this.privacyCanvas = document.createElement('canvas');
            this.privacyCanvas.width = 10;
            this.privacyCanvas.height = 10;
            this.privacyContext = this.privacyCanvas.getContext('2d', { willReadFrequently: true });
            this.lastFrameData = null;
            this.staticFrameCount = 0;
        }

        try {
            this.privacyContext.drawImage(video, 0, 0, 10, 10);
            const imageData = this.privacyContext.getImageData(0, 0, 10, 10);
            const data = imageData.data;

            // 1. Brightness Check (for physical shutters)
            let brightness = 0;
            for (let i = 0; i < data.length; i += 4) {
                brightness += (data[i] + data[i + 1] + data[i + 2]) / 3;
            }
            const avgBrightness = brightness / (data.length / 4);

            // 2. Motion Check (for software privacy placeholders)
            let isStatic = false;
            if (this.lastFrameData) {
                let diff = 0;
                for (let i = 0; i < data.length; i++) {
                    diff += Math.abs(data[i] - this.lastFrameData[i]);
                }
                // If the 10x10 grid is virtually identical (noise threshold < 50)
                if (diff < 50) {
                    this.staticFrameCount++;
                } else {
                    this.staticFrameCount = 0;
                }
            }
            this.lastFrameData = new Uint8ClampedArray(data);

            // Shutter is active if it's pitch black OR if the image is 100% static (common for driver placeholders)
            // Software shutters often show a static camera-slash icon
            const currentlyShuttered = (avgBrightness < 20) || (this.staticFrameCount > 5);

            if (this.isShuttered !== currentlyShuttered) {
                this.isShuttered = currentlyShuttered;
                this.toggleModelVisibility(!this.isShuttered);

                const banner = document.getElementById('stage-title');
                const explanation = document.getElementById('stage-explanation');

                if (this.isShuttered) {
                    if (banner) {
                        banner.textContent = "PRIVACY MODE: SHUTTER DETECTED";
                        banner.style.color = "#ff4444";
                    }
                    if (explanation) explanation.textContent = "Camera feed is blocked or static. Open shutter to resume.";
                } else {
                    if (banner) {
                        banner.textContent = "READY";
                        banner.style.color = "#00ff00";
                    }
                    if (explanation) explanation.textContent = "Enter an instruction or select an example to begin";
                }
            }
        } catch (e) { }
    }

    /**
     * Show/Hide all 3D content in the scene
     */
    toggleModelVisibility(visible) {
        this.scene.children.forEach(child => {
            // Hide meshes (CPU blocks), groups (registers), and lines (buses)
            // But KEEP lights so the scene isn't completely pitch black if we reveal it
            if (child.type === 'Mesh' || child.type === 'Group' || child.type === 'Line') {
                child.visible = visible;
            }
        });
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

        // Only force camera position if orbit is disabled (AR Mode)
        // Otherwise, just update the target to keep the model centered
        if (this.controls && !this.controls.enabled) {
            this.camera.position.set(settings.camX, settings.camY, settings.camZ);
            this.camera.lookAt(settings.lookAtX, settings.lookAtY, 0);
        } else if (this.controls) {
            this.controls.target.set(settings.lookAtX, settings.lookAtY, 0);
        }

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
        let frameCount = 0;
        const animate = () => {
            requestAnimationFrame(animate);

            // Update AR tracking if active
            if (this.arToolkitSource && this.arToolkitSource.ready !== false) {
                this.arToolkitContext.update(this.arToolkitSource.domElement);
            }

            // --- NEW: Privacy check every 30 frames (~500ms) ---
            if (frameCount % 30 === 0) {
                this.checkCameraPrivacy();
            }
            frameCount++;

            // --- NEW: Update OrbitControls damping/state ---
            // Automatically disabled if arModeActive is true or shuttered
            if (this.controls && this.controls.enabled && !this.isShuttered) {
                this.controls.update();
            }

            this.renderer.render(this.scene, this.camera);
        };

        animate();
    }
}
