/**
 * AR Scene Setup - MOBILE OPTIMIZED CAMERA
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

    async init() {
        this.container = document.getElementById('ar-container');
        
        this.scene = new THREE.Scene();
        this.scene.background = null;
        
        // Mobile-optimized camera settings for CENTERED model
        const fov = this.isMobile ? 65 : 60;
        this.camera = new THREE.PerspectiveCamera(
            fov,
            window.innerWidth / window.innerHeight,
            0.1,
            100
        );
        
        // Camera positioned for CENTERED bigger model
        if (this.isMobile) {
            // Mobile: centered view, pulled back for bigger model
            this.camera.position.set(0, 0.2, 2.5);
            this.camera.lookAt(0, 0, 0);
        } else {
            // Desktop: centered view
            this.camera.position.set(0, 0.3, 3.0);
            this.camera.lookAt(0, 0, 0);
        }
        
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
