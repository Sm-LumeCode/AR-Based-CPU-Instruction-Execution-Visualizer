/**
 * CPU 3D Model - MOBILE OPTIMIZED
 * Smaller, compact blocks for better mobile viewing
 */

export class CPUModel {
    constructor(scene) {
        this.scene = scene;
        this.components = {};
        this.buses = {};
        
        // Mobile detection
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        // BIGGER scale for better visibility - 40% increase
        this.scaleFactor = isMobile ? 0.35 : 0.45;
        this.xOffset = 0; // CENTER the model (was -0.6 / -0.75)
    }

    build() {
        const baseY = 0;
        
        this.buildProgramCounter(baseY);
        this.buildInstructionRegister(baseY);
        this.buildMemoryAddressRegister(baseY);
        this.buildMemoryDataRegister(baseY);
        this.buildControlUnit(baseY);
        this.buildRegisterFile(baseY);
        this.buildALU(baseY);
        this.buildMemory(baseY);
        this.buildBuses();
    }

    createLabeledTexture(label, color, width = 512, height = 256) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        canvas.width = width;
        canvas.height = height;
        
        context.fillStyle = this.colorToHex(color);
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        // Larger font for better mobile readability
        const fontSize = width > 256 ? 64 : 52;
        context.font = `Bold ${fontSize}px Arial`;
        context.fillStyle = '#000000';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(label, canvas.width / 2, canvas.height / 2);
        
        context.strokeStyle = '#000000';
        context.lineWidth = 10;
        context.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);
        
        return new THREE.CanvasTexture(canvas);
    }

    colorToHex(color) {
        return '#' + color.toString(16).padStart(6, '0');
    }

    buildProgramCounter(baseY) {
        const geometry = new THREE.BoxGeometry(
            0.35 * this.scaleFactor, 
            0.24 * this.scaleFactor, 
            0.18 * this.scaleFactor
        );
        const texture = this.createLabeledTexture('PC', 0x00ffff);
        const materials = Array(6).fill(null).map(() => 
            new THREE.MeshStandardMaterial({ 
                map: texture, 
                emissive: 0x003333, 
                metalness: 0.5, 
                roughness: 0.5 
            })
        );
        
        const pc = new THREE.Mesh(geometry, materials);
        pc.position.set(
            (this.xOffset - 1.0) * this.scaleFactor, 
            baseY + 1.4 * this.scaleFactor, 
            0
        );
        pc.userData.name = 'PC';
        
        this.scene.add(pc);
        this.components.PC = pc;
    }

    buildInstructionRegister(baseY) {
        const geometry = new THREE.BoxGeometry(
            0.38 * this.scaleFactor, 
            0.24 * this.scaleFactor, 
            0.18 * this.scaleFactor
        );
        const texture = this.createLabeledTexture('IR', 0x4444ff);
        const materials = Array(6).fill(null).map(() => 
            new THREE.MeshStandardMaterial({ 
                map: texture, 
                emissive: 0x000033, 
                metalness: 0.5, 
                roughness: 0.5 
            })
        );
        
        const ir = new THREE.Mesh(geometry, materials);
        ir.position.set(
            (this.xOffset - 1.0) * this.scaleFactor, 
            baseY + 1.0 * this.scaleFactor, 
            0
        );
        ir.userData.name = 'IR';
        
        this.scene.add(ir);
        this.components.IR = ir;
    }

    buildMemoryAddressRegister(baseY) {
        const geometry = new THREE.BoxGeometry(
            0.35 * this.scaleFactor, 
            0.20 * this.scaleFactor, 
            0.16 * this.scaleFactor
        );
        const texture = this.createLabeledTexture('MAR', 0xff6600, 512, 256);
        const materials = Array(6).fill(null).map(() => 
            new THREE.MeshStandardMaterial({ 
                map: texture, 
                emissive: 0x331100, 
                metalness: 0.5, 
                roughness: 0.5 
            })
        );
        
        const mar = new THREE.Mesh(geometry, materials);
        mar.position.set(
            (this.xOffset - 1.0) * this.scaleFactor, 
            baseY + 0.5 * this.scaleFactor, 
            0
        );
        mar.userData.name = 'MAR';
        
        this.scene.add(mar);
        this.components.MAR = mar;
    }

    buildMemoryDataRegister(baseY) {
        const geometry = new THREE.BoxGeometry(
            0.35 * this.scaleFactor, 
            0.20 * this.scaleFactor, 
            0.16 * this.scaleFactor
        );
        const texture = this.createLabeledTexture('MDR', 0xff3366, 512, 256);
        const materials = Array(6).fill(null).map(() => 
            new THREE.MeshStandardMaterial({ 
                map: texture, 
                emissive: 0x330011, 
                metalness: 0.5, 
                roughness: 0.5 
            })
        );
        
        const mdr = new THREE.Mesh(geometry, materials);
        mdr.position.set(
            (this.xOffset - 1.0) * this.scaleFactor, 
            baseY + 0.1 * this.scaleFactor, 
            0
        );
        mdr.userData.name = 'MDR';
        
        this.scene.add(mdr);
        this.components.MDR = mdr;
    }

    buildControlUnit(baseY) {
        const geometry = new THREE.BoxGeometry(
            0.48 * this.scaleFactor, 
            0.32 * this.scaleFactor, 
            0.22 * this.scaleFactor
        );
        const texture = this.createLabeledTexture('CU', 0xff9900);
        const materials = Array(6).fill(null).map(() => 
            new THREE.MeshStandardMaterial({ 
                map: texture, 
                emissive: 0x331100, 
                metalness: 0.5, 
                roughness: 0.5 
            })
        );
        
        const cu = new THREE.Mesh(geometry, materials);
        cu.position.set(
            this.xOffset * this.scaleFactor, 
            baseY + 1.0 * this.scaleFactor, 
            0
        );
        cu.userData.name = 'CU';
        
        this.scene.add(cu);
        this.components.CU = cu;
    }

    buildRegisterFile(baseY) {
        const registerGroup = new THREE.Group();
        registerGroup.position.set(
            (this.xOffset + 1.0) * this.scaleFactor, 
            baseY + 0.5 * this.scaleFactor, 
            0
        );
        
        const registers = ['R0', 'R1', 'R2', 'R3'];
        registers.forEach((regName, index) => {
            const geometry = new THREE.BoxGeometry(
                0.26 * this.scaleFactor, 
                0.17 * this.scaleFactor, 
                0.14 * this.scaleFactor
            );
            const texture = this.createLabeledTexture(regName, 0x00ff00, 256, 256);
            const materials = Array(6).fill(null).map(() => 
                new THREE.MeshStandardMaterial({ 
                    map: texture, 
                    emissive: 0x003300, 
                    metalness: 0.5, 
                    roughness: 0.5 
                })
            );
            
            const register = new THREE.Mesh(geometry, materials);
            register.position.y = index * 0.22 * this.scaleFactor;
            register.userData.name = regName;
            
            registerGroup.add(register);
            this.components[regName] = register;
        });
        
        this.scene.add(registerGroup);
        this.components.RegisterFile = registerGroup;
    }

    buildALU(baseY) {
        const geometry = new THREE.CylinderGeometry(
            0.20 * this.scaleFactor, 
            0.20 * this.scaleFactor, 
            0.32 * this.scaleFactor, 
            6
        );
        const material = new THREE.MeshStandardMaterial({ 
            color: 0xff0000, 
            emissive: 0x330000, 
            metalness: 0.5, 
            roughness: 0.5 
        });
        
        const alu = new THREE.Mesh(geometry, material);
        alu.position.set(
            this.xOffset * this.scaleFactor, 
            baseY + 0.2 * this.scaleFactor, 
            0
        );
        alu.userData.name = 'ALU';
        
        this.scene.add(alu);
        this.components.ALU = alu;
        
        const sprite = this.createTextSprite('ALU', 0xff0000);
        sprite.position.copy(alu.position);
        sprite.scale.set(0.10, 0.10, 1);
        this.scene.add(sprite);
    }

    buildMemory(baseY) {
        const geometry = new THREE.BoxGeometry(
            0.55 * this.scaleFactor, 
            0.85 * this.scaleFactor, 
            0.18 * this.scaleFactor
        );
        const texture = this.createLabeledTexture('MEMORY', 0x9900ff, 512, 512);
        const materials = Array(6).fill(null).map(() => 
            new THREE.MeshStandardMaterial({ 
                map: texture, 
                emissive: 0x220033, 
                metalness: 0.5, 
                roughness: 0.5 
            })
        );
        
        const memory = new THREE.Mesh(geometry, materials);
        memory.position.set(
            (this.xOffset - 1.0) * this.scaleFactor, 
            baseY - 0.5 * this.scaleFactor, 
            0
        );
        memory.userData.name = 'Memory';
        
        this.scene.add(memory);
        this.components.Memory = memory;
    }

    createTextSprite(text, backgroundColor) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        canvas.width = 256;
        canvas.height = 128;
        
        context.fillStyle = this.colorToHex(backgroundColor);
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        context.font = 'Bold 60px Arial';
        context.fillStyle = '#000000';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(text, canvas.width / 2, canvas.height / 2);
        
        context.strokeStyle = '#000000';
        context.lineWidth = 8;
        context.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);
        
        const texture = new THREE.CanvasTexture(canvas);
        return new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true }));
    }

    buildBuses() {
        const leftX = (this.xOffset - 1.15) * this.scaleFactor;
        const rightX = (this.xOffset + 1.15) * this.scaleFactor;
        const busY = -0.95 * this.scaleFactor;
        
        this.buses.dataBus = this.createBus(
            new THREE.Vector3(leftX, busY, -0.25 * this.scaleFactor),
            new THREE.Vector3(rightX, busY, -0.25 * this.scaleFactor),
            0x00ff00
        );
        
        this.buses.addressBus = this.createBus(
            new THREE.Vector3(leftX, busY, 0),
            new THREE.Vector3(rightX, busY, 0),
            0x0000ff
        );
        
        this.buses.controlBus = this.createBus(
            new THREE.Vector3(leftX, busY, 0.25 * this.scaleFactor),
            new THREE.Vector3(rightX, busY, 0.25 * this.scaleFactor),
            0xffff00
        );
    }

    createBus(start, end, color) {
        const points = [start, end];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ 
            color: color, 
            linewidth: 2, 
            transparent: true, 
            opacity: 0.5 
        });
        const bus = new THREE.Line(geometry, material);
        this.scene.add(bus);
        return bus;
    }

    highlightComponent(componentName, color = 0x00ffff) {
        const component = this.components[componentName];
        if (!component) return;
        
        if (Array.isArray(component.material)) {
            component.material.forEach(mat => {
                if (!mat.userData.originalEmissive) 
                    mat.userData.originalEmissive = mat.emissive.getHex();
                mat.emissive.setHex(color);
                mat.emissiveIntensity = 1.8; // Brighter for mobile
            });
        } else {
            if (!component.material.userData.originalEmissive) 
                component.material.userData.originalEmissive = component.material.emissive.getHex();
            component.material.emissive.setHex(color);
            component.material.emissiveIntensity = 1.8;
        }
    }

    resetComponent(componentName) {
        const component = this.components[componentName];
        if (!component) return;
        
        if (Array.isArray(component.material)) {
            component.material.forEach(mat => {
                if (mat.userData.originalEmissive !== undefined) {
                    mat.emissive.setHex(mat.userData.originalEmissive);
                    mat.emissiveIntensity = 0.3;
                }
            });
        } else {
            if (component.material.userData.originalEmissive !== undefined) {
                component.material.emissive.setHex(component.material.userData.originalEmissive);
                component.material.emissiveIntensity = 0.3;
            }
        }
    }

    resetAll() {
        Object.keys(this.components).forEach(name => {
            if (name !== 'RegisterFile') this.resetComponent(name);
        });
    }
}
