import { Gamepad2, Hexagon, Circle, Triangle } from "lucide-react";

const icons = [
  { Icon: Gamepad2, size: 32, top: "8%", left: "5%", delay: "0s", duration: "45s" },
  { Icon: Hexagon, size: 24, top: "20%", left: "85%", delay: "-12s", duration: "50s" },
  { Icon: Circle, size: 20, top: "55%", left: "15%", delay: "-25s", duration: "42s" },
  { Icon: Gamepad2, size: 28, top: "70%", left: "75%", delay: "-8s", duration: "48s" },
  { Icon: Triangle, size: 22, top: "35%", left: "45%", delay: "-18s", duration: "55s" },
  { Icon: Gamepad2, size: 26, top: "85%", left: "35%", delay: "-30s", duration: "40s" },
];

export function AnimatedBackground() {
  return (
    <>
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
