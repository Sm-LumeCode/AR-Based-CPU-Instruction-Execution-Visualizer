# 16-Bit Binary Instruction Format

## Overview
The CPU uses a 16-bit instruction format where each instruction is encoded as a single 16-bit binary word.

## Bit Layout
```
┌────────────┬──────────┬──────────┬──────────────────┐
│   Opcode   │  Reg 1   │  Reg 2   │  Immediate/Addr  │
│  (4 bits)  │ (2 bits) │ (2 bits) │    (8 bits)      │
│ Bits 15-12 │Bits 11-10│ Bits 9-8 │    Bits 7-0      │
└────────────┴──────────┴──────────┴──────────────────┘
```

## Opcode Table (4 bits = 16 possible opcodes)

| Instruction | Opcode | Binary | Hex |
|-------------|--------|--------|-----|
| MOV         | 1      | 0001   | 0x1 |
| ADD         | 2      | 0010   | 0x2 |
| SUB         | 3      | 0011   | 0x3 |
| MUL         | 4      | 0100   | 0x4 |
| DIV         | 5      | 0101   | 0x5 |
| AND         | 6      | 0110   | 0x6 |
| LOAD        | 7      | 0111   | 0x7 |
| STORE       | 8      | 1000   | 0x8 |
| (Reserved)  | 9-15   | 1001-1111 | 0x9-0xF |

## Register Encoding (2 bits = 4 registers)

| Register | Binary | Decimal |
|----------|--------|---------|
| R0       | 00     | 0       |
| R1       | 01     | 1       |
| R2       | 10     | 2       |
| R3       | 11     | 3       |

## Immediate/Address Field (8 bits)
- Range: 0-255 (unsigned)
- Used for:
  - MOV: Immediate value
  - LOAD/STORE: Memory address
  - ALU ops: Unused (set to 0)

## Encoding Examples

### Example 1: MOV R1, #5
```
Assembly:    MOV R1, #5
Opcode:      0001 (MOV = 1)
Reg1:        01   (R1 = 1)
Reg2:        00   (unused)
Immediate:   00000101 (5)
Binary:      0001 0100 0000 0101
Hex:         0x1405
```

### Example 2: ADD R2, R3
```
Assembly:    ADD R2, R3
Opcode:      0010 (ADD = 2)
Reg1:        10   (R2 = 2, destination)
Reg2:        11   (R3 = 3, source)
Immediate:   00000000 (unused)
Binary:      0010 1011 0000 0000
Hex:         0x2B00
```

### Example 3: LOAD R1, [100]
```
Assembly:    LOAD R1, [100]
Opcode:      0111 (LOAD = 7)
Reg1:        01   (R1 = 1, destination)
Reg2:        00   (unused)
Address:     01100100 (100)
Binary:      0111 0101 0110 0100
Hex:         0x7564
```

### Example 4: STORE R2, [200]
```
Assembly:    STORE R2, [200]
Opcode:      1000 (STORE = 8)
Reg1:        10   (R2 = 2, source)
Reg2:        00   (unused)
Address:     11001000 (200)
Binary:      1000 1011 0010 0000
Hex:         0x8B20
```

## Implementation Notes

1. **Single Format**: All instructions use the same 16-bit format
2. **Unused Fields**: Set to 0 when not needed
3. **Immediate Limits**: 8-bit immediate allows values 0-255
4. **Educational Focus**: Format designed to be simple and clear for learning
5. **Visual Display**: Binary shown as 4-bit groups for readability

## Files Modified

- `js/instructionEncoder.js` - Core encoding/decoding logic
- `js/instructionParser.js` - Integrated encoder with parser
- `js/ui.js` - Binary display update functions
- `js/animationController.js` - Pass binary data to UI
- `index.html` - Binary display panel HTML
- `css/styles.css` - Binary display styling
