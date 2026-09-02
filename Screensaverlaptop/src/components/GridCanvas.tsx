import { useEffect, useRef } from 'react';

const CHARACTERS = [
  '[', ']', 'A', 'B', 'C', 'D', 'E', 'F', 'G', '0', '1', '+', '\\', ':', '.', ' ', '/', '<', '>', '*', '-'
];

interface Cell {
  char: string;
  charColor: string;
  bgColor: string;
  intensity: number; // 0 to 1
  targetIntensity: number;
}

interface PhraseSlot {
  r: number;
  c: number;
  targetChar: string;
  currentChar: string;
  isResolved: boolean;
  scrambleTicks: number;
}

type PhraseStage = 'idle' | 'resolving' | 'hold' | 'scrambling';

export function GridCanvas({ paused }: { paused: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    const CELL_SIZE = 16;
    let grid: Cell[][] = [];
    let animationFrameId: number;
    let time = 0;

    // Phrase state
    let phraseStage: PhraseStage = 'idle';
    let phraseSlots: PhraseSlot[] = [];
    let stageTimer = 0; // Frame counter or timestamp

    const initGrid = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

      cols = Math.ceil(width / CELL_SIZE);
      rows = Math.ceil(height / CELL_SIZE);

      grid = Array.from({ length: rows }, () => 
        Array.from({ length: cols }, () => ({
          char: CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)],
          charColor: '#ffffff',
          bgColor: '#080808',
          intensity: 0,
          targetIntensity: 0
        }))
      );

      // Reset phrase slots on resize
      phraseStage = 'idle';
      phraseSlots = [];
      stageTimer = 120; // Spawn phrase shortly after load
    };

    window.addEventListener('resize', initGrid);
    initGrid();

    // Color palette based on Supabase
    const colorDarkGreen = '#062d1c';
    const colorMidGreen = '#24B47E';
    const colorBrightGreen = '#3ECF8E';
    const colorBlack = '#080808';

    const getColors = (intensity: number) => {
      if (intensity > 0.88) return { bg: colorBrightGreen, text: '#000000' };
      if (intensity > 0.60) return { bg: colorMidGreen, text: '#ffffff' };
      if (intensity > 0.32) return { bg: colorDarkGreen, text: colorBrightGreen };
      if (intensity > 0.12) return { bg: colorBlack, text: colorMidGreen };
      return { bg: colorBlack, text: '#1f1f1f' }; // Near silent
    };

    // Spawn a phrase at a clean, random position
    const spawnPhrase = () => {
      if (cols < 20 || rows < 8) return;

      const formats = [
        "Kshiteej's Laptop // Be right back",
        "KSHITEEJ'S LAPTOP // BE RIGHT BACK",
        "[KSHITEEJ'S LAPTOP] // [BE RIGHT BACK]"
      ];

      // Decide whether to use single line or two-line format
      const useTwoLines = cols < 42 || Math.random() < 0.4;
      const newSlots: PhraseSlot[] = [];

      if (useTwoLines) {
        const line1 = Math.random() < 0.5 ? "Kshiteej's Laptop" : "KSHITEEJ'S LAPTOP";
        const line2 = Math.random() < 0.5 ? "Be right back" : "BE RIGHT BACK";

        const maxLen = Math.max(line1.length, line2.length);
        const maxStartCol = Math.max(2, cols - maxLen - 3);
        const startCol = Math.floor(2 + Math.random() * maxStartCol);
        const startRow = Math.floor(3 + Math.random() * (rows - 6));

        // Add Line 1
        for (let i = 0; i < line1.length; i++) {
          newSlots.push({
            r: startRow,
            c: startCol + i,
            targetChar: line1[i],
            currentChar: CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)],
            isResolved: false,
            scrambleTicks: Math.floor(25 + i * 2.5 + Math.random() * 20)
          });
        }

        // Add Line 2
        for (let i = 0; i < line2.length; i++) {
          newSlots.push({
            r: startRow + 1,
            c: startCol + i,
            targetChar: line2[i],
            currentChar: CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)],
            isResolved: false,
            scrambleTicks: Math.floor(40 + i * 2.5 + Math.random() * 20)
          });
        }
      } else {
        const text = formats[Math.floor(Math.random() * formats.length)];
        const maxStartCol = Math.max(2, cols - text.length - 3);
        const startCol = Math.floor(2 + Math.random() * maxStartCol);
        const startRow = Math.floor(3 + Math.random() * (rows - 6));

        for (let i = 0; i < text.length; i++) {
          newSlots.push({
            r: startRow,
            c: startCol + i,
            targetChar: text[i],
            currentChar: CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)],
            isResolved: false,
            scrambleTicks: Math.floor(20 + i * 2.2 + Math.random() * 25)
          });
        }
      }

      phraseSlots = newSlots;
      phraseStage = 'resolving';
    };

    const updateGrid = () => {
      if (paused) return;
      time += 0.003;

      // --- 1. Ambient wave grid animation ---
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const cell = grid[r][c];

          // Slow, subtle character flipping
          if (Math.random() < 0.0005) {
            cell.char = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
          }

          // Smooth intersecting sine waves
          const waveX = Math.sin(c * 0.05 + time);
          const waveY = Math.cos(r * 0.05 + time * 0.8);
          const wave2 = Math.sin((c + r) * 0.02 - time * 1.2);
          
          let rawIntensity = (waveX * waveY + wave2) / 2 + 0.5;

          if (Math.random() < 0.001) {
            rawIntensity = 1.0;
          }

          cell.targetIntensity = rawIntensity;
          cell.intensity += (cell.targetIntensity - cell.intensity) * 0.02;

          const colors = getColors(cell.intensity);
          cell.bgColor = colors.bg;
          cell.charColor = colors.text;
        }
      }

      // --- 2. Phrase State Machine (Integrated text mutation) ---
      if (phraseStage === 'idle') {
        stageTimer--;
        if (stageTimer <= 0) {
          spawnPhrase();
        }
      } else if (phraseStage === 'resolving') {
        let allResolved = true;

        for (const slot of phraseSlots) {
          if (slot.r >= rows || slot.c >= cols) continue;

          slot.scrambleTicks--;
          if (slot.scrambleTicks <= 0) {
            slot.isResolved = true;
            slot.currentChar = slot.targetChar;
          } else {
            allResolved = false;
            // Rapidly scramble before locking in
            if (Math.random() < 0.6) {
              slot.currentChar = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
            }
          }

          // Apply to actual grid cell with glowing Supabase green highlight
          const cell = grid[slot.r][slot.c];
          cell.char = slot.currentChar;

          // Make the text pop in the green palette
          if (slot.targetChar === ' ') {
            cell.bgColor = colorDarkGreen;
            cell.charColor = colorBrightGreen;
          } else if (slot.isResolved) {
            cell.bgColor = colorBrightGreen;
            cell.charColor = '#000000';
          } else {
            cell.bgColor = colorMidGreen;
            cell.charColor = '#ffffff';
          }
        }

        if (allResolved) {
          phraseStage = 'hold';
          stageTimer = 380; // Hold for ~6.5 seconds at 60fps
        }
      } else if (phraseStage === 'hold') {
        stageTimer--;

        // Keep phrase steady and visible with slight green pulse
        for (const slot of phraseSlots) {
          if (slot.r >= rows || slot.c >= cols) continue;
          const cell = grid[slot.r][slot.c];
          cell.char = slot.targetChar;

          if (slot.targetChar === ' ') {
            cell.bgColor = colorDarkGreen;
            cell.charColor = colorBrightGreen;
          } else {
            cell.bgColor = colorBrightGreen;
            cell.charColor = '#000000';
          }
        }

        if (stageTimer <= 0) {
          phraseStage = 'scrambling';
          stageTimer = 75; // Scramble out for ~1.2 seconds
        }
      } else if (phraseStage === 'scrambling') {
        stageTimer--;

        for (const slot of phraseSlots) {
          if (slot.r >= rows || slot.c >= cols) continue;
          const cell = grid[slot.r][slot.c];
          // Scramble away into random characters
          cell.char = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
          cell.bgColor = colorMidGreen;
          cell.charColor = colorDarkGreen;
        }

        if (stageTimer <= 0) {
          phraseStage = 'idle';
          phraseSlots = [];
          // Wait 4 to 8 seconds before next random appearance
          stageTimer = Math.floor(240 + Math.random() * 240);
        }
      }
    };

    const drawGrid = () => {
      ctx.fillStyle = '#080808';
      ctx.fillRect(0, 0, width, height);

      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const cell = grid[r][c];
          const x = c * CELL_SIZE;
          const y = r * CELL_SIZE;

          // Draw background block if not black
          if (cell.bgColor !== '#080808') {
            ctx.fillStyle = cell.bgColor;
            ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
          }

          // Draw Character
          ctx.fillStyle = cell.charColor;
          ctx.fillText(cell.char, x + CELL_SIZE / 2, y + CELL_SIZE / 2);
        }
      }
    };

    const loop = () => {
      updateGrid();
      drawGrid();
      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener('resize', initGrid);
      cancelAnimationFrame(animationFrameId);
    };
  }, [paused]);

  return (
    <canvas 
      ref={canvasRef} 
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'block'
      }}
    />
  );
}
