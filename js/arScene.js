/**
 * AR Scene Setup - MOBILE OPTIMIZED
 * Handles Three.js scene, camera, lighting, and AR initialization
 */

export class ARScene {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.arToolkitSource = null;
        this.arToolkitContext = null;
        this.container = null;
    }

    async init() {
        this.container = document.getElementById('ar-container');
        
        // Initialize Three.js Scene
        this.scene = new THREE.Scene();
        this.scene.background = null;
        
        // Setup Camera - Optimized for mobile viewing
        this.camera = new THREE.PerspectiveCamera(
            60, // Slightly narrower FOV for better object visibility
            window.innerWidth / window.innerHeight,
            0.1,
            100
        );
        
        // Position camera further back to see entire model
        this.camera.position.set(0, 0.5, 2.5); // Moved back from 5 to 2.5
        this.camera.lookAt(0, 0, 0);
        
        // Setup Renderer
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true 
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit for performance
        this.container.appendChild(this.renderer.domElement);
        
        // Setup AR
        await this.setupAR();
        
        // Add Lighting
        this.setupLighting();
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
        
        return this;
    }

    async setupAR() {
        return new Promise((resolve, reject) => {
            // Detect mobile
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            
            // AR Toolkit Source (Camera)
            this.arToolkitSource = new THREEx.ArToolkitSource({
                sourceType: 'webcam',
                sourceWidth: isMobile ? 640 : window.innerWidth,
                sourceHeight: isMobile ? 480 : window.innerHeight,
                displayWidth: window.innerWidth,
                displayHeight: window.innerHeight
            });

            this.arToolkitSource.init(() => {
                console.log('AR Camera initialized');
                this.onResize();
                resolve();
            }, (error) => {
                console.error('AR Camera error:', error);
                reject(error);
            });

            // AR Toolkit Context
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
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        this.scene.add(ambientLight);
        
        // Directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
        directionalLight.position.set(3, 5, 3);
        this.scene.add(directionalLight);
        
        // Point light for highlights
        const pointLight = new THREE.PointLight(0x00ffff, 0.4, 20);
        pointLight.position.set(0, 2, 2);
        this.scene.add(pointLight);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
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