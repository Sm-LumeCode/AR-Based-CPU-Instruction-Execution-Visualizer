# 🎯 AR CPU Micro-Operation Visualizer

An interactive Augmented Reality (AR) based visualizer for CPU instruction execution. See the fetch-decode-execute cycles and micro-operations in 3D using your camera.

## 🚀 Features

- **AR Visualization**: Experience CPU internal operations in your physical space using AR markers.
- **Instruction Cycle Mode**: Visualize the high-level flow (Fetch → Decode → Execute).
- **Micro-Operation Mode**: Dive deep into T-state level details and signal flows.
- **Dynamic Input**: Enter your own assembly-like instructions and see them encoded into binary.
- **Real-time Binary View**: Watch instructions being parsed and broken down into Opcode, Registers, and Immediate values.
- **System Bus Guide**: Learn about Address, Data, and Control buses through color-coded signals.

## 🛠️ Technology Stack

- **Three.js**: For 3D rendering.
- **AR.js**: For augmented reality capabilities.
- **GSAP**: For smooth micro-animations.
- **Vanilla CSS**: For a premium, responsive UI.

## 📦 Deployment

This project is optimized for deployment on **Vercel**.

### Prerequisites

- [Vercel CLI](https://vercel.com/cli) (optional but recommended)
- A Vercel Account

### Manual Deployment (CLI)

1. Open your terminal in the project root.
2. Run the following command:
   ```bash
   npx vercel
   ```
3. Follow the prompts to deploy.

### Continuous Integration (GitHub/GitLab/Bitbucket)

1. Push this repository to your preferred Git provider.
2. Import the project into Vercel.
3. Vercel will automatically detect the static configuration and deploy.

## 📖 Binary Format

The system uses a custom 16-bit instruction format:
`[Opcode: 4 bits] [Reg1: 2 bits] [Reg2: 2 bits] [Immediate: 8 bits]`

Refer to `BINARY_FORMAT.md` for more details.

---
Built with intrest for Computer Architecture education.
