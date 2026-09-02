# Build Brief — Cinematic Web Screensaver

Build a **full-screen cinematic animated web screensaver** inspired by the visual quality, motion, typography, and atmosphere of **Supabase Select**: https://select.supabase.com/

Do **not** copy the Supabase site directly. Use it only as visual inspiration. The result should have its own identity and feel like a premium generative-art screensaver.

## Goal

Create an immersive, minimal, continuously running visual experience that can sit on a large monitor/TV as a screensaver.

There should be almost no traditional UI.

The experience should feel:

* futuristic
* cinematic
* experimental
* minimal
* premium
* slightly mysterious
* highly polished
* smooth and hypnotic

Think **digital art installation + modern developer aesthetic + generative 3D graphics**.

---

# Tech Stack

Use:

* React
* Vite
* TypeScript
* Three.js
* React Three Fiber
* @react-three/drei
* GSAP for timeline-based animation
* postprocessing for visual effects
* CSS for typography/UI overlays

Use WebGL for the primary visuals.

Do NOT attempt to create the entire effect with CSS animations.

---

# Visual Direction

## Background

Use an almost-black background.

Avoid pure flat black. Add extremely subtle:

* film grain
* noise
* vignette
* atmospheric gradients
* faint volumetric haze

The background should have depth even when nothing is happening.

---

# Main Visual

Create a large abstract 3D object in the center of the screen.

The object should feel like a combination of:

* smooth organic geometry
* futuristic sculpture
* abstract planet
* liquid metal
* folded fabric
* procedural blob

It should continuously and slowly transform.

The geometry should:

1. rotate slowly
2. deform organically
3. pulse subtly
4. change its silhouette
5. occasionally dissolve into particles
6. reform into another shape

Avoid obvious primitive shapes like a simple sphere or cube.

Use procedural geometry/shaders where possible.

---

# Materials

The object should have a sophisticated material.

Experiment with:

* metallic surfaces
* translucent surfaces
* emissive edges
* subtle reflections
* iridescent gradients
* Fresnel effects
* procedural noise

The material should react to the geometry deformation.

Avoid looking like a generic Three.js demo.

---

# Color System

Base palette:

* near-black
* white
* soft gray
* electric green
* subtle cyan
* occasional acid-lime highlights

Green should be used as an accent rather than covering the entire screen.

The overall visual should remain dark.

---

# Typography

Use extremely large typography.

Typography should feel like part of the artwork rather than a conventional website UI.

Use:

* large uppercase text
* monospace or technical grotesk typeface
* generous letter spacing
* very high contrast
* occasional tiny metadata labels

Example visual hierarchy:

```text
                 GENERATIVE
        SYSTEMS / 001

              [ 3D OBJECT ]

                  09:42
```

Text should sometimes overlap the 3D object.

Use subtle animation:

* fade
* horizontal movement
* vertical movement
* character-by-character reveals
* clipping/masking
* slight blur transitions

Do not over-animate every element.

---

# Screensaver Scenes

Build the experience as a sequence of scenes.

Each scene should last approximately 8–15 seconds.

Create at least **5 distinct scenes**.

Example:

### Scene 01 — FORM

Large abstract object slowly appears from darkness.

Text:

```text
FORM
001
```

The object rotates slowly.

---

### Scene 02 — SIGNAL

The object becomes partially transparent and emits subtle particles.

Text:

```text
SIGNAL
TRANSMISSION
```

Particles should move through the scene.

---

### Scene 03 — VOID

The object disappears.

Only a tiny glowing point remains.

Camera slowly moves toward it.

Text:

```text
NOTHING
IS
STILL
```

---

### Scene 04 — PARTICLE

The object explodes/dissolves into thousands of particles.

Particles should form a loose silhouette before dispersing.

Text:

```text
MATTER
/ 004
```

---

### Scene 05 — REFORMATION

Particles converge and create a completely different abstract form.

Text:

```text
REBUILD
```

Then transition smoothly back into Scene 01.

---

# Animation Philosophy

This is extremely important:

**The animation must be slow and intentional.**

Do not make it look like a flashy WebGL demo.

Use:

* smooth interpolation
* long easing curves
* subtle camera movement
* slow rotations
* organic deformation
* carefully timed transitions

Nothing should abruptly jump.

Use GSAP timelines to orchestrate scene transitions.

---

# Camera

Create a cinematic camera system.

The camera should:

* slowly orbit the object
* occasionally dolly in
* occasionally dolly out
* have extremely subtle floating movement
* respond slightly to mouse movement

Mouse interaction should be subtle.

The experience must still look good when nobody touches the screen.

---

# Particles

Implement a GPU-friendly particle system.

Target:

**5,000–30,000 particles**, depending on device performance.

Particles should:

* have varying sizes
* have subtle opacity variation
* drift organically
* react to the main object
* occasionally form shapes
* dissolve smoothly

Avoid obvious circular “starfield” particles.

---

# Post Processing

Add tasteful post-processing:

* bloom
* vignette
* film grain
* chromatic aberration, extremely subtle
* depth of field where appropriate
* atmospheric fog

Do not overdo the effects.

The final image should feel like a professionally art-directed piece.

---

# Transitions

Transitions between scenes are critical.

Never simply:

```text
fade out → fade in
```

Instead use combinations of:

* particle dissolution
* geometry morphing
* camera movement
* light changes
* typography transitions
* blur
* scale
* opacity
* shader transitions

The user should feel like they're watching one continuous visual system rather than separate pages.

---

# UI

Keep UI almost nonexistent.

Add only a very subtle control layer.

Bottom-left:

```text
SYSTEM / 001
```

Bottom-right:

```text
08:42:17
```

Optional tiny progress indicator.

Controls should appear only when the mouse moves and disappear after a few seconds.

---

# Interaction

Support:

### Mouse

Mouse movement creates subtle camera parallax.

### Click

Click/tap advances to the next scene.

### Keyboard

```text
SPACE → pause/resume
RIGHT → next scene
LEFT → previous scene
F → fullscreen
H → hide/show UI
```

When paused, show a minimal pause indicator.

---

# Screensaver Behavior

The application should automatically enter screensaver mode after a short period of inactivity.

Once active:

* hide cursor
* hide UI
* maximize the canvas
* start the cinematic sequence

Moving the mouse should reveal the UI again.

Make the experience suitable for:

* desktop
* ultrawide monitors
* 4K displays
* large TVs
* mobile/tablet

---

# Performance

Performance is extremely important.

Implement:

* device pixel ratio limits
* adaptive particle count
* efficient BufferGeometry
* shader-based animation where possible
* GPU-friendly particle rendering
* lazy initialization
* proper disposal of Three.js resources
* avoid unnecessary React re-renders
* use refs for animation state
* use requestAnimationFrame/Three.js render loop correctly

Target:

**60 FPS on a modern desktop.**

If the device is weak, automatically reduce:

* particle count
* post-processing
* resolution
* geometry complexity

---

# Code Architecture

Keep the project clean and modular.

Suggested structure:

```text
src/
  components/
    SceneCanvas.tsx
    Screensaver.tsx
    TypographyOverlay.tsx
    Controls.tsx

  scenes/
    FormScene.tsx
    SignalScene.tsx
    VoidScene.tsx
    ParticleScene.tsx
    ReformationScene.tsx

  three/
    AbstractForm.ts
    ParticleSystem.ts
    Materials.ts
    CameraController.ts

  animation/
    SceneManager.ts
    timelines.ts

  shaders/
    organic.vert
    organic.frag
    particles.vert
    particles.frag

  hooks/
    useScreensaver.ts
    useMouseParallax.ts
    useSceneTimeline.ts

  styles/
    globals.css
```

---

# Important Engineering Requirement

Create a reusable **SceneManager**.

It should control:

```text
currentScene
nextScene
previousScene
progress
paused
transitioning
```

Each scene should expose lifecycle methods similar to:

```ts
enter()
update(progress)
exit()
```

This makes it easy to add more scenes later.

---

# Visual Quality Requirement

Do not stop at “functional.”

After implementing the first version:

1. Run the application.
2. Inspect the result visually.
3. Identify anything that looks like a generic Three.js demo.
4. Improve lighting, materials, animation, typography, spacing, composition, and transitions.
5. Test fullscreen.
6. Test different viewport sizes.
7. Test performance.
8. Fix visual glitches.
9. Make the experience feel polished enough to be shown on a large screen.

Spend significant effort on **art direction and motion quality**, not just functionality.

---

# Avoid

Do NOT create:

* a conventional landing page
* cards
* navigation bars
* hero sections
* gradients everywhere
* generic neon cyberpunk aesthetics
* excessive glowing effects
* spinning cubes
* basic particle backgrounds
* random animations
* overly fast motion
* excessive UI
* stock images
* cheesy sci-fi visuals

The result should feel **quiet, sophisticated, and intentional**.

---

# Deliverable

Build the complete working application.

Include:

* all source code
* shaders
* scene manager
* animation system
* responsive layout
* keyboard controls
* mouse interaction
* fullscreen support
* screensaver/inactivity mode
* performance optimization

The app must run with:

```bash
npm install
npm run dev
```

and produce a polished full-screen experience immediately.

Before finishing, make sure there are **no console errors, broken assets, TypeScript errors, or unfinished placeholder sections**.
