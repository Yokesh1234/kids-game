
# FunOS Gaming System

This application is designed to be a dedicated "Game OS" for children aged 3-7. It creates an immersive, hardware-centric experience using webcam hand tracking and voice recognition.

## 🚀 Native OS Installation (Kiosk Mode)

To turn a Raspberry Pi or Laptop into a dedicated **FunOS** console (Alternative to an ISO image):

1.  **Install Base OS**: Install a lightweight Linux distro (like Raspberry Pi OS Lite or Debian).
2.  **Enable Auto-Login**: Configure the OS to log into a user account automatically.
3.  **Install Chromium**: Ensure the Chromium browser is installed.
4.  **Create a Kiosk Script**:
    Create a script named `start-funos.sh`:
    ```bash
    #!/bin/bash
    xset s off
    xset -dpms
    xset s noblank
    chromium-browser --kiosk --noerrdialogs --disable-infobars --app=YOUR_DEPLOYED_URL_HERE
    ```
5.  **Set as Autostart**: Add this script to your `.xinitrc` or systemd service to launch on boot.
6.  **Permission Bypass**: In Chrome, set `--use-fake-ui-for-media-stream` in the launch flags to automatically grant camera/mic permissions.

## ✋ Hand Gesture Logic

*   **Open Hand**: Move your hand to control the "Magic Cursor".
*   **Fist (Selection)**: Close your hand into a fist to "Click" elements.
*   **Virtual Interface**: The cursor glows white and pulses when a selection is detected.

## 🗣️ Voice Command System

*   The system uses high-quality TTS for a friendly guide voice.
*   Recognition is performed locally in the browser for high privacy and speed.

## 🎨 System Aesthetics

*   **Dark Mode**: Reduced eye strain for young children.
*   **Glassmorphism**: Modern, semi-transparent UI layers.
*   **Hardware HUD**: Simulated CPU/Temp stats for that authentic "Geeky" Raspberry Pi feel.
