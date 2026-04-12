import { useEffect, useRef } from "react";
import { Gamepad2, Hexagon, Circle, Triangle } from "lucide-react";

const icons = [
  { Icon: Gamepad2, size: 32, top: "8%", left: "5%", delay: "0s", duration: "45s" },
  { Icon: Hexagon, size: 24, top: "20%", left: "85%", delay: "-12s", duration: "50s" },
  { Icon: Circle, size: 20, top: "55%", left: "15%", delay: "-25s", duration: "42s" },
  { Icon: Gamepad2, size: 28, top: "70%", left: "75%", delay: "-8s", duration: "48s" },
  { Icon: Triangle, size: 22, top: "35%", left: "45%", delay: "-18s", duration: "55s" },
  { Icon: Gamepad2, size: 26, top: "85%", left: "35%", delay: "-30s", duration: "40s" },
];

function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const stars: { x: number; y: number; r: number; a: number; speed: number; phase: number }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    // Generate stars
    for (let i = 0; i < 120; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.4 + 0.3,
        a: Math.random() * 0.5 + 0.15,
        speed: Math.random() * 0.15 + 0.02,
        phase: Math.random() * Math.PI * 2,
      });
    }

    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.008;
      for (const s of stars) {
        const flicker = Math.sin(t * s.speed * 20 + s.phase) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(s.x, s.y + Math.sin(t + s.phase) * 8, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(147,197,253,${s.a * flicker})`;
        ctx.fill();
      }
      animId = requestAnimationFrame(draw);
    };
    draw();

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}

export function AnimatedBackground() {
  return (
    <>
      <StarField />

      {/* Floating orbs */}
      <div className="animated-bg" aria-hidden="true">
        <div className="orb" />
        <div className="orb" />
        <div className="orb" />
      </div>

      {/* Gaming icons */}
      <div className="bg-gaming-icons" aria-hidden="true">
        {icons.map((item, i) => (
          <item.Icon
            key={i}
            size={item.size}
            style={{
              top: item.top,
              left: item.left,
              animationDelay: item.delay,
              animationDuration: item.duration,
            }}
          />
        ))}
      </div>
    </>
  );
}