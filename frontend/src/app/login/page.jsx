"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiShield,
  FiTrendingUp,
  FiZap,
} from "react-icons/fi";
import styles from "../auth-pages.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  

  const handleLogin = async (e) => {
  e.preventDefault();

  if (!email || !password) {
    alert("Please enter both email and password");
    return;
  }

  setLoading(true);

  try {
    const res = await fetch("https://investment-site-x6tr.onrender.com/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const responseText = await res.text();
    let data = null;

    if (responseText) {
      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error("The login service returned an invalid response");
      }
    }

    if (!res.ok) throw new Error(data?.message || "Login failed");
    if (!data) throw new Error("The login service returned an empty response");

    const sessionUser = data.user ?? data.data?.user ?? {
      email,
      name: data.name ?? email.split("@")[0],
      ...(data.userId ? { id: data.userId } : {}),
    };
    const sessionToken = data.token ?? data.data?.token;

    if (sessionToken) {
      localStorage.setItem("token", sessionToken);
    } else {
      localStorage.removeItem("token");
    }

    localStorage.setItem("user", JSON.stringify(sessionUser));

    if (sessionUser.id) {
      localStorage.setItem("userId", sessionUser.id);
    } else {
      localStorage.removeItem("userId");
    }

    localStorage.removeItem("pendingEmail");
    router.replace("/dashboard");
  } catch (err) {
    alert(err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className={styles.authShell}>
      <div className={styles.authAmbient} aria-hidden="true" />

      <header className={styles.authHeader}>
        <button type="button" className={styles.authBrand} onClick={() => router.push("/")}>
          <span><FiTrendingUp aria-hidden="true" /></span>
          <strong>Nex<span>Trade</span></strong>
        </button>

        <div className={styles.headerActions}>
          <select className={styles.languageSelect} aria-label="Language">
            <option>English</option>
            <option>Français</option>
            <option>Deutsch</option>
          </select>
          <button
            type="button"
            onClick={() => router.push("/register")}
            className={styles.headerCta}
          >
            Create account
            <FiArrowRight aria-hidden="true" />
          </button>
        </div>
      </header>

      <main className={styles.authMain}>
        <section className={styles.authShowcase}>
          <button type="button" className={styles.backLink} onClick={() => router.push("/")}>
            <FiArrowLeft aria-hidden="true" />
            Back to home
          </button>

          <div className={styles.showcaseCopy}>
            <span className={styles.authEyebrow}>Your trading workspace</span>
            <h1>Welcome back to a clearer way to trade.</h1>
            <p>Access your wallet, trading accounts, and account activity from one secure dashboard.</p>

            <ul className={styles.benefitList}>
              <li><span><FiZap aria-hidden="true" /></span><div><strong>Fast account access</strong><small>Move directly into your complete trading workspace.</small></div></li>
              <li><span><FiShield aria-hidden="true" /></span><div><strong>Protected session</strong><small>Your access is handled through a security-focused experience.</small></div></li>
              <li><span><FiCheck aria-hidden="true" /></span><div><strong>Everything in one place</strong><small>Monitor balances, accounts, and transactions clearly.</small></div></li>
            </ul>
          </div>

          <div className={styles.showcaseCard}>
            <div className={styles.showcaseCardTop}>
              <span>Account overview</span>
              <span className={styles.securePill}><i /> Secure</span>
            </div>
            <div className={styles.showcaseBalance}>
              <span>Available balance</span>
              <strong><small>$</small>24,860.40</strong>
            </div>
            <div className={styles.showcaseStats}>
              <div><span>Trading accounts</span><strong>3 active</strong></div>
              <div><span>Account access</span><strong>Protected</strong></div>
            </div>
          </div>
        </section>

        <section className={styles.formSection}>
          <div className={styles.formCard}>
            <div className={styles.formHeading}>
              <span className={styles.formBadge}><FiLock aria-hidden="true" /> Secure login</span>
              <h2>Log in to your profile</h2>
              <p>Enter your account details to continue to NexTrade.</p>
            </div>

            <form onSubmit={handleLogin} className={styles.authForm}>
              <label className={styles.fieldGroup}>
                <span>Email address</span>
                <div className={styles.inputWrap}>
                  <FiMail aria-hidden="true" />
                  <input
                    type="email"
                    autoComplete="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>
              </label>

              <label className={styles.fieldGroup}>
                <span>Password</span>
                <div className={styles.inputWrap}>
                  <FiLock aria-hidden="true" />
                  <input
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FiEyeOff aria-hidden="true" /> : <FiEye aria-hidden="true" />}
                  </button>
                </div>
              </label>

              <div className={styles.formOptions}>
                <label className={styles.rememberOption}>
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <a href="/reset">Forgot password?</a>
              </div>

              <button type="submit" disabled={loading} className={styles.submitButton}>
                {loading ? (
                  <><span className={styles.buttonSpinner} /> Signing in…</>
                ) : (
                  <>Log in securely <FiArrowRight aria-hidden="true" /></>
                )}
              </button>

              <p className={styles.formSwitch}>
                New to NexTrade?{" "}
                <button type="button" onClick={() => router.push("/register")}>Create an account</button>
              </p>
            </form>

            <div className={styles.formSecurity}>
              <FiShield aria-hidden="true" />
              <span>Your login information is transmitted securely.</span>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.authFooter}>
        <span>© {new Date().getFullYear()} NexTrade Markets</span>
        <span>Secure trading access</span>
      </footer>
    </div>
  );
}
