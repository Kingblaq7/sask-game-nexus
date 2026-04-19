import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gamepad2, Mail, Lock, User, Wallet, IdCard, Crown, Wrench, Compass, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/hooks/useWallet";
import { lovable } from "@/integrations/lovable";
import { WelcomeDialog } from "@/components/WelcomeDialog";

type Role = "creator" | "builder" | "general";

const ROLES: { id: Role; title: string; desc: string; Icon: typeof Crown }[] = [
  { id: "creator", title: "Creator", desc: "Start and manage gaming projects", Icon: Crown },
  { id: "builder", title: "Builder", desc: "Join projects and contribute skills", Icon: Wrench },
  { id: "general", title: "General", desc: "Explore and participate in the platform", Icon: Compass },
];

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<Role>("general");
  const [loading, setLoading] = useState(false);
  const [welcome, setWelcome] = useState<{ name: string; email: string } | null>(null);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const wallet = useWallet();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        if (!fullName.trim() || !username.trim()) {
          throw new Error("Full name and username are required");
        }
        await signUp({ email, password, username, fullName, role });
        // After signUp, AuthContext picks up the session via onAuthStateChange.
        setWelcome({ name: fullName.trim(), email: email.trim() });
      } else {
        await signIn(email, password);
        toast({ title: "Welcome back!" });
        navigate("/dashboard");
      }
    } catch (err: any) {
      const msg = err?.message || "Something went wrong";
      const friendly = /already registered|already exists|duplicate/i.test(msg)
        ? "An account with this email already exists"
        : msg;
      toast({ title: "Error", description: friendly, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 w-full max-w-md relative"
      >
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Gamepad2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-xl">Sask Gaming Pad</span>
        </div>

        <h2 className="font-display text-xl font-semibold text-center mb-6">
          {isSignUp ? "Create your account" : "Welcome Back"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence initial={false}>
            {isSignUp && (
              <motion.div
                key="signup-fields"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 overflow-hidden"
              >
                <div className="relative">
                  <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required={isSignUp}
                    maxLength={80}
                    className="w-full bg-muted/30 rounded-lg pl-10 pr-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                  />
                </div>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required={isSignUp}
                    minLength={3}
                    maxLength={30}
                    className="w-full bg-muted/30 rounded-lg pl-10 pr-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-muted/30 rounded-lg pl-10 pr-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full bg-muted/30 rounded-lg pl-10 pr-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>

          {isSignUp && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground font-medium pt-1">I'm joining as a…</p>
              <div className="grid gap-2">
                {ROLES.map(({ id, title, desc, Icon }) => {
                  const active = role === id;
                  return (
                    <button
                      type="button"
                      key={id}
                      onClick={() => setRole(id)}
                      className={`flex items-start gap-3 text-left p-3 rounded-lg border transition-colors ${
                        active
                          ? "border-primary/60 bg-primary/10"
                          : "border-border bg-muted/20 hover:bg-muted/40"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 ${active ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{title}</p>
                        <p className="text-xs text-muted-foreground">{desc}</p>
                      </div>
                      {active && <Check className="w-4 h-4 text-primary flex-shrink-0 mt-1" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold hover:opacity-90 transition-opacity glow-primary disabled:opacity-50"
          >
            {loading ? "Loading..." : isSignUp ? "Create account" : "Sign In"}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
          <div className="relative flex justify-center"><span className="bg-card px-3 text-xs text-muted-foreground">or</span></div>
        </div>

        <button
          onClick={async () => {
            const result = await lovable.auth.signInWithOAuth("google", {
              redirect_uri: `${window.location.origin}/dashboard`,
            });
            if (result.error) {
              toast({ title: "Google sign-in failed", description: result.error.message, variant: "destructive" });
            }
          }}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-border hover:bg-muted/30 transition-colors text-sm font-medium mb-3"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09A6.97 6.97 0 0 1 5.46 12c0-.73.13-1.43.36-2.09V7.07H2.18A11 11 0 0 0 1 12c0 1.78.43 3.46 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/>
          </svg>
          Continue with Google
        </button>

        <button
          onClick={wallet.connect}
          disabled={wallet.connecting}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-border hover:bg-muted/30 transition-colors text-sm font-medium disabled:opacity-50"
        >
          <Wallet className="w-4 h-4" />
          {wallet.connecting ? "Connecting..." : wallet.address ? `Connected: ${wallet.shortAddress}` : "Connect Wallet"}
        </button>
        {!wallet.hasProvider && (
          <p className="text-xs text-muted-foreground text-center mt-2">Install MetaMask to connect a wallet</p>
        )}

        <p className="text-sm text-muted-foreground text-center mt-6">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button onClick={() => setIsSignUp(!isSignUp)} className="text-primary hover:underline">
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </motion.div>

      <WelcomeDialog
        open={!!welcome}
        name={welcome?.name || ""}
        email={welcome?.email || ""}
        onClose={() => {
          setWelcome(null);
          navigate("/dashboard");
        }}
      />
    </div>
  );
}
