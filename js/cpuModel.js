/**
 * CPU 3D Model Builder - BLACK TEXT FOR VISIBILITY
 * All labels now in black for better contrast
 */

export class CPUModel {
    constructor(scene) {
        this.scene = scene;
        this.components = {};
        this.buses = {};
        this.scaleFactor = 0.4;
    }

    build() {
        const baseY = 0;
        
        this.buildProgramCounter(baseY);
        this.buildInstructionRegister(baseY);
        this.buildControlUnit(baseY);
        this.buildRegisterFile(baseY);
        this.buildALU(baseY);
        this.buildMemory(baseY);
        this.buildBuses();
    }

    /**
     * Create a texture with BLACK text label for better visibility
     */
    createLabeledTexture(label, color, width = 512, height = 256) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        canvas.width = width;
        canvas.height = height;
        
        // Background color
        context.fillStyle = this.colorToHex(color);
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        // Text in BLACK for visibility
        context.font = 'Bold 56px Arial';
        context.fillStyle = '#000000';  // BLACK TEXT
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(label, canvas.width / 2, canvas.height / 2);
        
        // Border in black
        context.strokeStyle = '#000000';
        context.lineWidth = 8;
        context.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);
        
        const texture = new THREE.CanvasTexture(canvas);
        return texture;
    }

    /**
     * Create multi-line labeled texture with BLACK text
     */
    createMultiLineLabeledTexture(lines, color, width = 512, height = 512) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        canvas.width = width;
        canvas.height = height;
        
        // Background
        context.fillStyle = this.colorToHex(color);
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        // Text in BLACK
        context.fillStyle = '#000000';  // BLACK TEXT
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        
        const lineHeight = height / (lines.length + 1);
        lines.forEach((line, index) => {
            const fontSize = line.size || 48;
            context.font = `Bold ${fontSize}px Arial`;
            context.fillText(line.text, canvas.width / 2, lineHeight * (index + 1));
        });
        
        // Border in black
        context.strokeStyle = '#000000';
        context.lineWidth = 8;
        context.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);
        
        return new THREE.CanvasTexture(canvas);
    }

    colorToHex(color) {
        return '#' + color.toString(16).padStart(6, '0');
    }

    buildProgramCounter(baseY) {
        const geometry = new THREE.BoxGeometry(
            0.35 * this.scaleFactor,  // Slightly larger
            0.25 * this.scaleFactor, 
            0.2 * this.scaleFactor
        );
        
        // Create texture with BLACK text on cyan background
        const texture = this.createLabeledTexture('PC', 0x00ffff, 512, 256);
        
        const materials = Array(6).fill(null).map(() => 
            new THREE.MeshStandardMaterial({ 
                map: texture, 
                emissive: 0x003333, 
                metalness: 0.5, 
                roughness: 0.5 
            })
        );
        
        const pc = new THREE.Mesh(geometry, materials);
        pc.position.set(-1.2 * this.scaleFactor, baseY + 1.3 * this.scaleFactor, 0);
        pc.userData.name = 'PC';
        pc.userData.fullName = 'Program Counter';
        pc.userData.baseColor = 0x00ffff;
        
        this.scene.add(pc);
        this.components.PC = pc;
    }

    buildInstructionRegister(baseY) {
        const geometry = new THREE.BoxGeometry(
            0.4 * this.scaleFactor, 
            0.25 * this.scaleFactor, 
            0.2 * this.scaleFactor
        );
        
        const texture = this.createLabeledTexture('IR', 0x4444ff, 512, 256);
        
        const materials = Array(6).fill(null).map(() => 
            new THREE.MeshStandardMaterial({ 
                map: texture, 
                emissive: 0x000033, 
                metalness: 0.5, 
                roughness: 0.5 
            })
        );
        
        const ir = new THREE.Mesh(geometry, materials);
        ir.position.set(-1.2 * this.scaleFactor, baseY + 0.7 * this.scaleFactor, 0);
        ir.userData.name = 'IR';
        ir.userData.fullName = 'Instruction Register';
        ir.userData.baseColor = 0x4444ff;
        
        this.scene.add(ir);
        this.components.IR = ir;
    }

    buildControlUnit(baseY) {
        const geometry = new THREE.BoxGeometry(
            0.5 * this.scaleFactor, 
            0.35 * this.scaleFactor, 
            0.25 * this.scaleFactor
        );
        
        const texture = this.createLabeledTexture('CU', 0xff9900, 512, 256);
        
        const materials = Array(6).fill(null).map(() => 
            new THREE.MeshStandardMaterial({ 
                map: texture, 
                emissive: 0x331100, 
                metalness: 0.5, 
                roughness: 0.5 
            })
        );
        
        const cu = new THREE.Mesh(geometry, materials);
        cu.position.set(0, baseY + 0.7 * this.scaleFactor, 0);
        cu.userData.name = 'CU';
        cu.userData.fullName = 'Control Unit';
        cu.userData.baseColor = 0xff9900;
        
        this.scene.add(cu);
        this.components.CU = cu;
    }

    buildRegisterFile(baseY) {
        const registerGroup = new THREE.Group();
        registerGroup.position.set(1.2 * this.scaleFactor, baseY + 0.3 * this.scaleFactor, 0);
        
        const registers = ['R0', 'R1', 'R2', 'R3'];
        registers.forEach((regName, index) => {
            const geometry = new THREE.BoxGeometry(
                0.28 * this.scaleFactor,  // Slightly larger
                0.18 * this.scaleFactor, 
                0.15 * this.scaleFactor
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
            register.position.y = index * 0.24 * this.scaleFactor;
            register.userData.name = regName;
            register.userData.fullName = `Register ${regName}`;
            register.userData.baseColor = 0x00ff00;
            
            registerGroup.add(register);
            this.components[regName] = register;
        });
        
        this.scene.add(registerGroup);
        this.components.RegisterFile = registerGroup;
    }

    buildALU(baseY) {
        const geometry = new THREE.CylinderGeometry(
            0.22 * this.scaleFactor, 
            0.22 * this.scaleFactor, 
            0.35 * this.scaleFactor, 
            6
        );
        
        const material = new THREE.MeshStandardMaterial({ 
            color: 0xff0000,
            emissive: 0x330000,
            metalness: 0.5,
            roughness: 0.5
        });
        
        const alu = new THREE.Mesh(geometry, material);
        alu.position.set(0, baseY + 0.1 * this.scaleFactor, 0);
        alu.userData.name = 'ALU';
        alu.userData.fullName = 'Arithmetic Logic Unit';
        alu.userData.baseColor = 0xff0000;
        
        this.scene.add(alu);
        this.components.ALU = alu;
        
        // Add text sprite for ALU with BLACK text
        const sprite = this.createTextSprite('ALU', 0xff0000);
        sprite.position.copy(alu.position);
        sprite.scale.set(0.14, 0.14, 1);
        this.scene.add(sprite);
    }

    buildMemory(baseY) {
        const geometry = new THREE.BoxGeometry(
            0.6 * this.scaleFactor, 
            0.8 * this.scaleFactor, 
            0.2 * this.scaleFactor
        );
        
        const texture = this.createMultiLineLabeledTexture([
            { text: 'MEMORY', size: 56 }
        ], 0x9900ff);
        
        const materials = Array(6).fill(null).map(() => 
            new THREE.MeshStandardMaterial({ 
                map: texture, 
                emissive: 0x220033, 
                metalness: 0.5, 
                roughness: 0.5 
            })
        );
        
        const memory = new THREE.Mesh(geometry, materials);
        memory.position.set(-1.2 * this.scaleFactor, baseY - 0.4 * this.scaleFactor, 0);
        memory.userData.name = 'Memory';
        memory.userData.fullName = 'Main Memory';
        memory.userData.baseColor = 0x9900ff;
        
        this.scene.add(memory);
        this.components.Memory = memory;
    }

    /**
     * Create text sprite with BLACK text
     */
    createTextSprite(text, backgroundColor) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        canvas.width = 256;
        canvas.height = 128;
        
        // Background
        context.fillStyle = this.colorToHex(backgroundColor);
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        // Text in BLACK
        context.font = 'Bold 64px Arial';
        context.fillStyle = '#000000';  // BLACK TEXT
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(text, canvas.width / 2, canvas.height / 2);
        
        // Border in black
        context.strokeStyle = '#000000';
        context.lineWidth = 6;
        context.strokeRect(3, 3, canvas.width - 6, canvas.height - 6);
        
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({ 
            map: texture,
            transparent: true
        });
        
        return new THREE.Sprite(material);
    }

    buildBuses() {
        this.buses.dataBus = this.createBus(
            new THREE.Vector3(-1.2 * this.scaleFactor, -0.7 * this.scaleFactor, -0.3 * this.scaleFactor),
            new THREE.Vector3(1.2 * this.scaleFactor, -0.7 * this.scaleFactor, -0.3 * this.scaleFactor),
            0x00ff00
        );
        
        this.buses.addressBus = this.createBus(
            new THREE.Vector3(-1.2 * this.scaleFactor, -0.7 * this.scaleFactor, 0),
            new THREE.Vector3(1.2 * this.scaleFactor, -0.7 * this.scaleFactor, 0),
            0x0000ff
        );
        
        this.buses.controlBus = this.createBus(
            new THREE.Vector3(-1.2 * this.scaleFactor, -0.7 * this.scaleFactor, 0.3 * this.scaleFactor),
            new THREE.Vector3(1.2 * this.scaleFactor, -0.7 * this.scaleFactor, 0.3 * this.scaleFactor),
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
                if (!mat.userData.originalEmissive) {
                    mat.userData.originalEmissive = mat.emissive.getHex();
                }
                mat.emissive.setHex(color);
                mat.emissiveIntensity = 1.5;
            });
        } else {
            if (!component.material.userData.originalEmissive) {
                component.material.userData.originalEmissive = 
                    component.material.emissive.getHex();
            }
            component.material.emissive.setHex(color);
            component.material.emissiveIntensity = 1.5;
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
                component.material.emissive.setHex(
                    component.material.userData.originalEmissive
                );
                component.material.emissiveIntensity = 0.3;
            }
        }
    }

    resetAll() {
        Object.keys(this.components).forEach(name => {
            if (name !== 'RegisterFile') {
                this.resetComponent(name);
            }
        });
    }
}