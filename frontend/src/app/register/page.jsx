"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ReactFlagsSelect from "react-flags-select";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiEye,
  FiEyeOff,
  FiGlobe,
  FiLock,
  FiMail,
  FiShield,
  FiTrendingUp,
  FiUserPlus,
} from "react-icons/fi";
import styles from "../auth-pages.module.css";

export default function RegisterPage() {
  const router = useRouter();
  const [selectedCountry, setSelectedCountry] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("en");
  const [showPassword, setShowPassword] = useState(false);

  // --- Translation dictionary ---
  const translations = {
    en: {
      createAccount: "Create Your Account",
      selectCountry: "Select your country",
      enterEmail: "Enter your email",
      createPassword: "Create a password",
      signUp: "Sign Up",
      already: "Already have an account?",
      login: "Log In",
    },
    fr: {
      createAccount: "Créez votre compte",
      selectCountry: "Sélectionnez votre pays",
      enterEmail: "Entrez votre e-mail",
      createPassword: "Créez un mot de passe",
      signUp: "S'inscrire",
      already: "Vous avez déjà un compte ?",
      login: "Se connecter",
    },
    de: {
      createAccount: "Erstelle dein Konto",
      selectCountry: "Wähle dein Land",
      enterEmail: "Gib deine E-Mail ein",
      createPassword: "Erstelle ein Passwort",
      signUp: "Registrieren",
      already: "Hast du schon ein Konto?",
      login: "Anmelden",
    },
    nl: {
      createAccount: "Maak je account aan",
      selectCountry: "Selecteer je land",
      enterEmail: "Voer je e-mailadres in",
      createPassword: "Maak een wachtwoord aan",
      signUp: "Registreren",
      already: "Heb je al een account?",
      login: "Inloggen",
    },
    es: {
      createAccount: "Crea tu cuenta",
      selectCountry: "Selecciona tu país",
      enterEmail: "Ingresa tu correo electrónico",
      createPassword: "Crea una contraseña",
      signUp: "Registrarse",
      already: "¿Ya tienes una cuenta?",
      login: "Iniciar sesión",
    },
    zh: {
      createAccount: "创建您的账户",
      selectCountry: "选择您的国家",
      enterEmail: "输入您的电子邮件",
      createPassword: "创建密码",
      signUp: "注册",
      already: "已经有账户？",
      login: "登录",
    },
    ar: {
      createAccount: "أنشئ حسابك",
      selectCountry: "اختر بلدك",
      enterEmail: "أدخل بريدك الإلكتروني",
      createPassword: "أنشئ كلمة المرور",
      signUp: "إنشاء حساب",
      already: "هل لديك حساب بالفعل؟",
      login: "تسجيل الدخول",
    },
  };

  const t = translations[language];

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!selectedCountry || !email || !password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("https://investment-site-x6tr.onrender.com/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country: selectedCountry,
          email,
          password,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

localStorage.setItem("user", JSON.stringify(data));
router.push("/credentials");

    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authShell} dir={language === "ar" ? "rtl" : "ltr"}>
      <div className={styles.authAmbient} aria-hidden="true" />

      <header className={styles.authHeader}>
        <button type="button" className={styles.authBrand} onClick={() => router.push("/")}>
          <span><FiTrendingUp aria-hidden="true" /></span>
          <strong>Nex<span>Trade</span></strong>
        </button>

        <div className={styles.headerActions}>
          <select
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            className={styles.languageSelect}
            aria-label="Language"
          >
            <option value="en">🇬🇧 English</option>
            <option value="fr">🇫🇷 Français</option>
            <option value="de">🇩🇪 Deutsch</option>
            <option value="nl">🇳🇱 Nederlands</option>
            <option value="es">🇪🇸 Español</option>
            <option value="zh">🇨🇳 中文</option>
            <option value="ar">🇸🇦 العربية</option>
          </select>

          <button
            type="button"
            className={styles.headerCta}
            onClick={() => router.push("/login")}
          >
            {t.login}
            <FiArrowRight aria-hidden="true" />
          </button>
        </div>
      </header>

      <main className={styles.authMain}>
        <section className={`${styles.authShowcase} ${styles.registerShowcase}`}>
          <button type="button" className={styles.backLink} onClick={() => router.push("/")}>
            <FiArrowLeft aria-hidden="true" />
            Back to home
          </button>

          <div className={styles.showcaseCopy}>
            <span className={styles.authEyebrow}>Start your NexTrade journey</span>
            <h1>Build your trading profile with confidence.</h1>
            <p>Create your account now, then complete your profile to access the full NexTrade workspace.</p>

            <ol className={styles.registrationSteps}>
              <li className={styles.currentStep}>
                <span>01</span>
                <div><strong>Create your account</strong><small>Choose your country and secure your login.</small></div>
                <FiCheck aria-hidden="true" />
              </li>
              <li>
                <span>02</span>
                <div><strong>Complete your profile</strong><small>Add the details required for your account.</small></div>
              </li>
              <li>
                <span>03</span>
                <div><strong>Access your workspace</strong><small>Manage your wallet and trading accounts.</small></div>
              </li>
            </ol>
          </div>

          <div className={styles.registrationTrust}>
            <FiShield aria-hidden="true" />
            <div><strong>Your information stays protected</strong><span>We use a security-focused account experience.</span></div>
          </div>
        </section>

        <section className={styles.formSection}>
          <div className={styles.formCard}>
            <div className={styles.formHeading}>
              <span className={styles.formBadge}><FiUserPlus aria-hidden="true" /> Step 1 of 2</span>
              <h2>{t.createAccount}</h2>
              <p>Set up your secure login details to begin.</p>
            </div>

            <form onSubmit={handleRegister} className={styles.authForm}>
              <label className={styles.fieldGroup}>
                <span>{t.selectCountry}</span>
                <div className={styles.countryField}>
                  <FiGlobe aria-hidden="true" />
                  <ReactFlagsSelect
                    searchable
                    selected={selectedCountry}
                    onSelect={(code) => setSelectedCountry(code)}
                    className={styles.countrySelector}
                    placeholder={t.selectCountry}
                  />
                </div>
              </label>

              <label className={styles.fieldGroup}>
                <span>Email address</span>
                <div className={styles.inputWrap}>
                  <FiMail aria-hidden="true" />
                  <input
                    type="email"
                    autoComplete="email"
                    placeholder={t.enterEmail}
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
                    autoComplete="new-password"
                    placeholder={t.createPassword}
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
                <small className={styles.fieldHint}>Use a strong password you don’t use elsewhere.</small>
              </label>

              <button type="submit" disabled={loading} className={styles.submitButton}>
                {loading ? (
                  <><span className={styles.buttonSpinner} /> Creating account…</>
                ) : (
                  <>{t.signUp} <FiArrowRight aria-hidden="true" /></>
                )}
              </button>

              <p className={styles.termsText}>
                By continuing, you confirm that the information provided is accurate.
              </p>

              <p className={styles.formSwitch}>
                {t.already}{" "}
                <button type="button" onClick={() => router.push("/login")}>{t.login}</button>
              </p>
            </form>

            <div className={styles.formSecurity}>
              <FiShield aria-hidden="true" />
              <span>Your account details are transmitted securely.</span>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.authFooter}>
        <span>© {new Date().getFullYear()} NexTrade Markets</span>
        <span>Secure account registration</span>
      </footer>
    </div>
  );
}
