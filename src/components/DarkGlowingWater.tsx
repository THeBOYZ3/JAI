import { useEffect, useRef, useState } from "react";

export function DarkGlowingWater() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const mouseRef = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 });

  // Timing Logic: Fades in via CSS, stays for 10 seconds, fades out, stays hidden for 3 seconds, then repeats.
  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    const cycleVisibility = () => {
      if (!isMounted) return;
      // Fade in to 100% visibility (takes 1.5s configured in CSS transitions)
      setIsVisible(true);

      // Remain visible for 10 seconds
      timeoutId = setTimeout(() => {
        if (!isMounted) return;
        // Fade out to 0% visibility
        setIsVisible(false);

        // Remain hidden / pitch black for 3 seconds before starting again
        timeoutId = setTimeout(() => {
          cycleVisibility();
        }, 3000);
      }, 10000);
    };

    cycleVisibility();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, []);

  // WebGL Pipeline Setup and Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl") || (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
    if (!gl) {
      console.warn("WebGL is not supported in this browser environment.");
      return;
    }

    // Vertex Shader: full scren quad
    const vsSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    // Fragment Shader: Custom Fractional Brownian Motion and Caustic Silky Wave Simulation
    const fsSource = `
      precision highp float;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec2 u_mouse;

      // Hash function
      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      // Simple 2D Value Noise
      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
                   mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
      }

      // 4-Octave fBm (Fractional Brownian Motion)
      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        vec2 shift = vec2(100.0);
        float c = cos(0.5);
        float s = sin(0.5);
        mat2 r = mat2(c, -s, s, c);
        for (int i = 0; i < 4; i++) {
          v += a * noise(p);
          p = r * p * 2.0 + shift;
          a *= 0.5;
        }
        return v;
      }

      // Fluid water caustic generator
      float caustics(vec2 p, float time, vec2 mouseWarp) {
        vec2 q = vec2(0.0);
        q.x = fbm(p + 0.1 * time);
        q.y = fbm(p + vec2(1.0));

        vec2 r = vec2(0.0);
        r.x = fbm(p + 1.2 * q + vec2(1.7, 9.2) + 0.14 * time + mouseWarp * 0.4);
        r.y = fbm(p + 1.2 * q + vec2(8.3, 2.8) + 0.09 * time + mouseWarp * 0.4);

        // Fluid peaks calculation (high-contrast absolute noise ridge)
        float f = fbm(p + 1.5 * r);
        float peak = 1.0 - abs(f);

        // High-contrast exponentiation makes the wave crest sharp and silky
        return pow(peak, 6.0) * 2.2;
      }

      void main() {
        // Normalized and aspect-ratio corrected fragment positions
        vec2 p = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);

        // Correct mouse coordinate spacing to match fragment screen space
        vec2 m = (u_mouse * 2.0 - 1.0) * (u_resolution.xy / min(u_resolution.x, u_resolution.y));
        m.y = -m.y; // Match screen space coordinates to WebGL inverse geometry Y

        // Interactive mouse repellent warp
        vec2 mouseWarp = vec2(0.0);
        float dist = length(p - m);
        if (dist < 0.9) {
          float strength = 1.0 - smoothstep(0.0, 0.9, dist);
          // Push away water wavefronts
          mouseWarp = normalize(p - m) * strength * 0.75;
        }

        // Combine scrolling frequencies for richer motion depths
        float c1 = caustics(p * 2.2 + mouseWarp * 1.4, u_time * 0.6, mouseWarp);
        float c2 = caustics(p * 3.8 - mouseWarp * 0.8, u_time * 1.0 + 12.0, -mouseWarp);

        float waves = c1 * 0.6 + c2 * 0.4;

        // Smooth contrast clipping to keep valleys absolutely black
        waves = smoothstep(0.04, 0.8, waves);

        // Elegant, silver/white glowing sheen colors
        vec3 finalColor = vec3(waves * 0.92, waves * 0.94, waves * 0.98);

        // Overexposure peaks sheen brightness
        finalColor += vec3(0.45) * pow(waves, 7.0);

        // Slight ambient bluish dark tint for valleys without fully breaking the black backdrop
        finalColor += vec3(0.005, 0.008, 0.012) * (1.0 - waves);

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    // Shader compiler helper function
    const compileShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compiler failed:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = compileShader(gl.VERTEX_SHADER, vsSource);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vertexShader || !fragmentShader) return;

    // Link WebGL program
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Shader linking failed:", gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Bind full screen canvas vertex quad buffer
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [
      -1.0, -1.0,
       1.0, -1.0,
      -1.0,  1.0,
      -1.0,  1.0,
       1.0, -1.0,
       1.0,  1.0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const positionAttribute = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionAttribute);
    gl.vertexAttribPointer(positionAttribute, 2, gl.FLOAT, false, 0, 0);

    // Cache WebGL Shader uniform locations
    const uResolution = gl.getUniformLocation(program, "u_resolution");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uMouse = gl.getUniformLocation(program, "u_mouse");

    const startTime = Date.now();

    // Responsive Canvas Resize logic
    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2); // Capped at double-resolution to ensure performance
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Mouse & Touch Interaction tracking
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX / window.innerWidth;
      mouseRef.current.targetY = e.clientY / window.innerHeight;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        mouseRef.current.targetX = e.touches[0].clientX / window.innerWidth;
        mouseRef.current.targetY = e.touches[0].clientY / window.innerHeight;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    let animationId: number;

    const renderLoop = () => {
      const timeInSecs = (Date.now() - startTime) * 0.001;

      // Soft interpolation on mouse vector to create smooth drifting trails
      const m = mouseRef.current;
      m.x += (m.targetX - m.x) * 0.08;
      m.y += (m.targetY - m.y) * 0.08;

      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform1f(uTime, timeInSecs);
      gl.uniform2f(uMouse, m.x, m.y);

      // Direct full screen rasterization
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      cancelAnimationFrame(animationId);
      gl.deleteBuffer(positionBuffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, []);

  return (
    <canvas
      id="waterCanvas"
      ref={canvasRef}
      className={`fixed top-0 left-0 w-full h-full pointer-events-none transition-opacity duration-[1500ms] ease-in-out ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      style={{ zIndex: 1 }}
    />
  );
}
