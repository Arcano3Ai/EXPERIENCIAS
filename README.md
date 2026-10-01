# 🌌 Nexos Estelares · Experiencias Místicas

Suite de experiencias sensoriales, acústicas y espirituales interactivas de alta fidelidad.

---

## 🎋 Experiencia 19: Palo de Lluvia Somático (Giroscopio Interactivo)

Instrumento chamánico interactivo que convierte el hardware del dispositivo móvil en un palo de lluvia de sanación acústica viva. Al inclinar físicamente el celular, el usuario controla el flujo de semillas de cuarzo a través del bambú.

### 🛠️ Características Técnicas
* **Sensores Nativos:** `DeviceOrientation API` para captura de ángulos ($\beta$, $\gamma$, $\alpha$) a 60 FPS.
* **Síntesis Granular Client-Side (Zero-Bandwidth):** `Web Audio API` con `BiquadFilterNode` y generador de ruido rosa modelado para la resonancia acústica del bambú.
* **Motor Físico Visual en Canvas 2D:** 140 semillas de cuarzo y acacia con gravedad dinámica y 42 espinas internas en espiral con detección de colisión.
* **Gatekeeper Seguro:** Compatible con políticas de permisos en iOS 13+ y Android.
* **Soporte de Escritorio:** Control táctil y emulador de giroscopio mediante cursor de mouse.

### 🚀 Ejecución Local
```bash
cd experiencia-19
npm install
npm run dev
```
Acceso en navegador: `http://localhost:3019/`
