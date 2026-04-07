import { motion } from "framer-motion";
import { Gamepad2, ArrowRight, Zap, Shield, Users, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { SocialLinks } from "@/components/SocialLinks";
import { Footer } from "@/components/Footer";

const features = [
  { icon: Users, title: "Collaborate", desc: "Build together with founders, devs & gamers in real-time workspaces." },
  { icon: Shield, title: "DAO Governance", desc: "Token-based voting for transparent project decisions." },
  { icon: Zap, title: "Smart Contracts", desc: "Deploy casino games, betting pools & NFT assets on Base." },
  { icon: BarChart3, title: "Analytics", desc: "Track players, revenue, and transactions with clear dashboards." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Gamepad2 className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold">W3 Gaming Hub</span>
          </div>
          <Link
            to="/auth"
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Launch App
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="container py-24 lg:py-32 flex flex-col items-center text-center relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card text-xs text-primary font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" /> Built on Base Network
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="font-display text-4xl md:text-6xl lg:text-7xl font-bold max-w-4xl leading-tight"
        >
          Build the Future of{" "}
          <span className="gradient-text">Web3 Gaming</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-6 text-lg text-muted-foreground max-w-2xl"
        >
          An all-in-one collaboration hub for founders, developers, and gamers to build, launch, and manage crypto casino & Web3 gaming projects.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-8 flex flex-wrap gap-4 justify-center"
        >
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold hover:opacity-90 transition-opacity glow-primary"
          >
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="https://discord.gg/6yvQjghuCz"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass-card-hover font-semibold"
          >
            Join Community
          </a>
        </motion.div>
      </section>

      {/* Features */}
      <section className="container py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i + 0.4, duration: 0.4 }}
              className="glass-card-hover p-6 group"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Community */}
      <section className="container py-20">
        <div className="glass-card p-10 text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
            Join Our <span className="gradient-text">Community</span>
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Connect with builders, gamers, and visionaries shaping the future of Web3 gaming.
          </p>
          <div className="flex justify-center">
            <SocialLinks variant="buttons" />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
