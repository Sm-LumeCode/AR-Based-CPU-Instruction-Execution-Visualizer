/**
 * CPU 3D Model - IMPROVED VERSION
 * Larger, centered cubes with bigger, clearer labels
 */

export class CPUModel {
    constructor(scene) {
        this.scene = scene;
        this.components = {};
        this.buses = {};

        // Mobile detection
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        // SIGNIFICANTLY BIGGER scale for better visibility - 60% increase from original
        this.scaleFactor = isMobile ? 0.55 : 0.7;
        this.xOffset = -0.55; // Move to the left
    }

    build() {
        const baseY = -0.4; // Move everything down

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

    createLabeledTexture(label, color, width = 512, height = 512) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        canvas.width = width;
        canvas.height = height;

        // Background with gradient for better visibility
        const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, this.colorToHex(color));
        gradient.addColorStop(1, this.adjustBrightness(color, -20));
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);

        // MUCH LARGER font for better mobile readability
        const fontSize = Math.floor(width * 0.18); // 18% of canvas width
        context.font = `Bold ${fontSize}px Arial, sans-serif`;
        context.fillStyle = '#090909';  // White text for better contrast
        context.strokeStyle = '#fcfbfb';  // Black outline
        context.lineWidth = fontSize * 0.08;  // Outline width
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        
        // Draw text with outline for maximum visibility
        context.strokeText(label, canvas.width / 2, canvas.height / 2);
        context.fillText(label, canvas.width / 2, canvas.height / 2);

        // Thick border for definition
        context.strokeStyle = '#000000';
        context.lineWidth = 12;
        context.strokeRect(6, 6, canvas.width - 12, canvas.height - 12);

        return new THREE.CanvasTexture(canvas);
    }

    adjustBrightness(color, percent) {
        const r = Math.max(0, Math.min(255, ((color >> 16) & 0xff) + percent));
        const g = Math.max(0, Math.min(255, ((color >> 8) & 0xff) + percent));
        const b = Math.max(0, Math.min(255, (color & 0xff) + percent));
        return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
    }

    colorToHex(color) {
        return '#' + color.toString(16).padStart(6, '0');
    }

    buildProgramCounter(baseY) {
        // PERFECTLY SQUARE cube
        const size = 0.28 * this.scaleFactor;
        const geometry = new THREE.BoxGeometry(size, size, size);
        
        const texture = this.createLabeledTexture('PC', 0x00CCFF);
        const materials = Array(6).fill(null).map(() =>
            new THREE.MeshStandardMaterial({
                map: texture,
                emissive: 0x003344,
                emissiveIntensity: 0.4,
                metalness: 0.6,
                roughness: 0.4
            })
        );

        const pc = new THREE.Mesh(geometry, materials);
        pc.position.set(
            (this.xOffset - 1.0) * this.scaleFactor,
            baseY + 1.5 * this.scaleFactor,
            0
        );
        pc.userData.name = 'PC';

        this.scene.add(pc);
        this.components.PC = pc;
    }

    buildInstructionRegister(baseY) {
        // PERFECTLY SQUARE cube
        const size = 0.30 * this.scaleFactor;
        const geometry = new THREE.BoxGeometry(size, size, size);
        
        const texture = this.createLabeledTexture('IR', 0x4466FF);
        const materials = Array(6).fill(null).map(() =>
            new THREE.MeshStandardMaterial({
                map: texture,
                emissive: 0x001144,
                emissiveIntensity: 0.4,
                metalness: 0.6,
                roughness: 0.4
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
        // PERFECTLY SQUARE cube
        const size = 0.26 * this.scaleFactor;
        const geometry = new THREE.BoxGeometry(size, size, size);
        
        const texture = this.createLabeledTexture('MAR', 0xFF7700);
        const materials = Array(6).fill(null).map(() =>
            new THREE.MeshStandardMaterial({
                map: texture,
                emissive: 0x442200,
                emissiveIntensity: 0.4,
                metalness: 0.6,
                roughness: 0.4
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
        // PERFECTLY SQUARE cube
        const size = 0.26 * this.scaleFactor;
        const geometry = new THREE.BoxGeometry(size, size, size);
        
        const texture = this.createLabeledTexture('MDR', 0xFF4477);
        const materials = Array(6).fill(null).map(() =>
            new THREE.MeshStandardMaterial({
                map: texture,
                emissive: 0x441122,
                emissiveIntensity: 0.4,
                metalness: 0.6,
                roughness: 0.4
            })
        );

        const mdr = new THREE.Mesh(geometry, materials);
        mdr.position.set(
            (this.xOffset - 1.0) * this.scaleFactor,
            baseY + 0.0 * this.scaleFactor,
            0
        );
        mdr.userData.name = 'MDR';

        this.scene.add(mdr);
        this.components.MDR = mdr;
    }

    buildControlUnit(baseY) {
        // PERFECTLY SQUARE cube - slightly larger for importance
        const size = 0.38 * this.scaleFactor;
        const geometry = new THREE.BoxGeometry(size, size, size);
        
        const texture = this.createLabeledTexture('CU', 0xFFAA00);
        const materials = Array(6).fill(null).map(() =>
            new THREE.MeshStandardMaterial({
                map: texture,
                emissive: 0x442200,
                emissiveIntensity: 0.4,
                metalness: 0.6,
                roughness: 0.4
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

        // Storage for value meshes to update later
        this.valueDisplays = {};

        const registers = ['R0', 'R1', 'R2', 'R3'];
        const regSize = 0.22 * this.scaleFactor;
        
        registers.forEach((regName, index) => {
            // PERFECTLY SQUARE cubes for registers
            const geometry = new THREE.BoxGeometry(regSize, regSize, regSize);
            
            const texture = this.createLabeledTexture(regName, 0x00FF00);
            const materials = Array(6).fill(null).map(() =>
                new THREE.MeshStandardMaterial({
                    map: texture,
                    emissive: 0x004400,
                    emissiveIntensity: 0.4,
                    metalness: 0.6,
                    roughness: 0.4
                })
            );

            const register = new THREE.Mesh(geometry, materials);
            register.position.y = index * 0.30 * this.scaleFactor;
            register.userData.name = regName;

            registerGroup.add(register);
            this.components[regName] = register;

            // --- LARGER VALUE DISPLAY BOX ---
            const valSize = 0.18* this.scaleFactor;
            const valGeo = new THREE.BoxGeometry(valSize, valSize, valSize * 0.4);
            
            // Default value '0'
            const valTex = this.createValueTexture('0');
            const valMat = new THREE.MeshBasicMaterial({ map: valTex, color: 0xffffff });
            const valMesh = new THREE.Mesh(valGeo, valMat);

            // Position it to the right of the register (further away to avoid overlap)
            valMesh.position.set(
                0.45 * this.scaleFactor, // x offset from register center (increased from 0.30)
                index * 0.30 * this.scaleFactor, // same Y as register
                0.08 * this.scaleFactor // slightly in front
            );

            registerGroup.add(valMesh);
            this.valueDisplays[regName] = valMesh;
        });

        this.scene.add(registerGroup);
        this.components.RegisterFile = registerGroup;
    }

    createValueTexture(text) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 256;

        // White background with subtle gradient
        const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#FFFFFF');
        gradient.addColorStop(1, '#F0F0F0');
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Thick border
        context.strokeStyle = '#000000';
        context.lineWidth = 12;
        context.strokeRect(6, 6, canvas.width - 12, canvas.height - 12);

        // MUCH LARGER text
        context.font = 'Bold 140px Arial';
        context.fillStyle = '#000000';
        context.strokeStyle = '#CCCCCC';
        context.lineWidth = 4;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        
        context.strokeText(text, canvas.width / 2, canvas.height / 2);
        context.fillText(text, canvas.width / 2, canvas.height / 2);

        return new THREE.CanvasTexture(canvas);
    }

    updateRegisterDisplay(regName, value) {
        const mesh = this.valueDisplays[regName];
        if (mesh) {
            mesh.material.map = this.createValueTexture(value.toString());
            mesh.material.needsUpdate = true;
        }
    }

    buildALU(baseY) {
        // PERFECTLY SQUARE cube with label (like other components)
        const size = 0.35 * this.scaleFactor;
        const geometry = new THREE.BoxGeometry(size, size, size);
        
        const texture = this.createLabeledTexture('ALU', 0xFF0000);
        const materials = Array(6).fill(null).map(() =>
            new THREE.MeshStandardMaterial({
                map: texture,
                emissive: 0x440000,
                emissiveIntensity: 0.4,
                metalness: 0.6,
                roughness: 0.4
            })
        );

        const alu = new THREE.Mesh(geometry, materials);
        alu.position.set(
            this.xOffset * this.scaleFactor,
            baseY + 0.2 * this.scaleFactor,
            0
        );
        alu.userData.name = 'ALU';

        this.scene.add(alu);
        this.components.ALU = alu;
    }

    buildMemory(baseY) {
        // Larger memory block - PERFECTLY SQUARE in width/height
        const size = 0.55 * this.scaleFactor;
        const geometry = new THREE.BoxGeometry(
            size * 0.8,
            size * 1.3,
            size * 0.3
        );
        
        const texture = this.createLabeledTexture('MEM', 0xAA00FF, 512, 768);
        const materials = Array(6).fill(null).map(() =>
            new THREE.MeshStandardMaterial({
                map: texture,
                emissive: 0x330044,
                emissiveIntensity: 0.4,
                metalness: 0.6,
                roughness: 0.4
            })
        );

        const memory = new THREE.Mesh(geometry, materials);
        memory.position.set(
            (this.xOffset - 1.0) * this.scaleFactor,
            baseY - 0.7* this.scaleFactor,
            0
        );
        memory.userData.name = 'Memory';

        this.scene.add(memory);
        this.components.Memory = memory;
    }

    createTextSprite(text, backgroundColor) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        canvas.width = 512;
        canvas.height = 256;

        // Background
        context.fillStyle = this.colorToHex(backgroundColor);
        context.fillRect(0, 0, canvas.width, canvas.height);

        // LARGER text
        context.font = 'Bold 120px Arial';
        context.fillStyle = '#FFFFFF';
        context.strokeStyle = '#000000';
        context.lineWidth = 10;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        
        context.strokeText(text, canvas.width / 2, canvas.height / 2);
        context.fillText(text, canvas.width / 2, canvas.height / 2);

        // Border
        context.strokeStyle = '#000000';
        context.lineWidth = 12;
        context.strokeRect(6, 6, canvas.width - 12, canvas.height - 12);

        const texture = new THREE.CanvasTexture(canvas);
        return new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true }));
    }

    buildBuses() {
        // Move buses to the right by adding offset
        const busRightOffset = 0.5; // Adjust this value to move more/less right
        const leftX = (this.xOffset - 1.25 + busRightOffset) * this.scaleFactor;
        const rightX = (this.xOffset + 1.25 + busRightOffset) * this.scaleFactor;
        const busY = -1.1 * this.scaleFactor;

        this.buses.dataBus = this.createBus(
            new THREE.Vector3(leftX, busY, -0.3 * this.scaleFactor),
            new THREE.Vector3(rightX, busY, -0.3 * this.scaleFactor),
            0x00FF00
        );

        this.buses.addressBus = this.createBus(
            new THREE.Vector3(leftX, busY, 0),
            new THREE.Vector3(rightX, busY, 0),
            0x0000FF
        );

        this.buses.controlBus = this.createBus(
            new THREE.Vector3(leftX, busY, 0.3 * this.scaleFactor),
            new THREE.Vector3(rightX, busY, 0.3 * this.scaleFactor),
            0xFFFF00
        );
    }

    createBus(start, end, color) {
        const points = [start, end];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
            color: color,
            linewidth: 3,
            transparent: true,
            opacity: 0.6
        });
        const bus = new THREE.Line(geometry, material);
        this.scene.add(bus);
        return bus;
    }

    highlightComponent(componentName, color = 0x00FFFF) {
        const component = this.components[componentName];
        if (!component) return;

        if (Array.isArray(component.material)) {
            component.material.forEach(mat => {
                if (!mat.userData.originalEmissive)
                    mat.userData.originalEmissive = mat.emissive.getHex();
                mat.emissive.setHex(color);
                mat.emissiveIntensity = 2.0; // Brighter highlight
            });
        } else {
            if (!component.material.userData.originalEmissive)
                component.material.userData.originalEmissive = component.material.emissive.getHex();
            component.material.emissive.setHex(color);
            component.material.emissiveIntensity = 2.0;
        }
    }

    resetComponent(componentName) {
        const component = this.components[componentName];
        if (!component) return;

        if (Array.isArray(component.material)) {
            component.material.forEach(mat => {
                if (mat.userData.originalEmissive !== undefined) {
                    mat.emissive.setHex(mat.userData.originalEmissive);
                    mat.emissiveIntensity = 0.4;
                }
            });
        } else {
            if (component.material.userData.originalEmissive !== undefined) {
                component.material.emissive.setHex(component.material.userData.originalEmissive);
                component.material.emissiveIntensity = 0.4;
            }
        }
    }

    resetAll() {
        Object.keys(this.components).forEach(name => {
            if (name !== 'RegisterFile') this.resetComponent(name);
        });
    }
}