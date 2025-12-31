
# FunOS: Bootable Game OS Build Instructions

This guide explains how to pack the **Kids' Hand-Powered Fun Zone** into a standalone, bootable Linux ISO for x86_64 PCs.

## 1. Prerequisites
- A Linux environment (Ubuntu 22.04 recommended).
- **Cubic** (Custom Ubuntu ISO Creator).
- Hardware: 4GB USB Drive.

## 2. Prepare the App
1. Build the production assets:
   ```bash
   npm install
   npm run build
   ```
2. The `dist/` folder now contains the "Game OS" binary equivalent.

## 3. Configure the OS Environment (using Cubic)
Inside the Cubic Chroot environment, run:

### A. Install Dependencies
```bash
apt update
apt install -y cage chromium-browser mesa-utils pulseaudio alsa-utils
```

### B. Setup User
```bash
useradd -m -s /bin/bash kid
usermod -aG video,audio,input,render kid
```

### C. Deploy Configs
1. Copy `dist/` to `/opt/funos/dist/`.
2. Move `os-config/funos.service` to `/etc/systemd/system/`.
3. Move `os-config/start-funos.sh` to `/usr/local/bin/` and `chmod +x` it.
4. Create directory `/etc/systemd/system/getty@tty1.service.d/` and move `os-config/99-kid-autologin.conf` into it as `override.conf`.

### D. Enable Kiosk
```bash
systemctl enable funos.service
systemctl set-default multi-user.target
```

## 4. Build and Flash
- Generate the ISO in Cubic.
- Flash to USB using **BalenaEtcher**.
- Boot your PC, select the USB, and the system will jump directly into the "FUN_OS_INIT" boot sequence.

## 5. Deployment Fixes
- **Node Version**: If building on Netlify/Cloudflare, ensure `engines` in `package.json` specifies Node 20.x to avoid Exit Code 2 errors.
- **Webcam**: Ensure the target PC has a standard UVC webcam; drivers are included in the base Ubuntu kernel.
