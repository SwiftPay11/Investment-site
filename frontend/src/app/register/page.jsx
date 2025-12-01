"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ReactFlagsSelect from "react-flags-select";

export default function RegisterPage() {
  const router = useRouter();
  const [selectedCountry, setSelectedCountry] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("en");

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
    <div className="min-h-screen bg-gradient-to-b from-[#020817] via-[#060b1e] to-[#0a0f29] text-white flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center px-10 py-5 bg-transparent">
        <h1 className="text-3xl font-bold text-blue-400">NexTrade</h1>
        <div className="flex items-center gap-4">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-transparent border border-gray-500 rounded-md p-2 text-sm"
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
            className="border border-blue-400 text-blue-300 px-4 py-2 rounded-lg hover:bg-blue-600/20 transition"
            onClick={() => router.push("/login")}
          >
            {t.login}
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="flex flex-1 justify-center items-center px-4">
        <div className="bg-[#0b122a] rounded-2xl shadow-xl p-10 w-full max-w-md border border-blue-900/40">
          <h2 className="text-2xl font-semibold text-center mb-8 text-blue-300">
            {t.createAccount}
          </h2>

          <form onSubmit={handleRegister} className="space-y-6">
            {/* Country Selector */}
            <div>
              <ReactFlagsSelect
                searchable
                selected={selectedCountry}
                onSelect={(code) => setSelectedCountry(code)}
                className="w-full text-black"
                placeholder={t.selectCountry}
              />
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                placeholder={t.enterEmail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-[#0f1738] border border-blue-800 rounded-md focus:border-blue-500 outline-none"
              />
            </div>

            {/* Password */}
            <div>
              <input
                type="password"
                placeholder={t.createPassword}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-[#0f1738] border border-blue-800 rounded-md focus:border-blue-500 outline-none"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-md font-semibold transition disabled:opacity-50"
            >
              {loading ? "..." : t.signUp}
            </button>

            {/* Login Link */}
            <p className="text-center text-sm text-gray-400 mt-4">
              {t.already}{" "}
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="text-blue-400 hover:underline font-semibold"
              >
                {t.login}
              </button>
            </p>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-500 py-4 border-t border-blue-900/40">
        © {new Date().getFullYear()} NexTrade Markets. All rights reserved.
      </footer>
    </div>
  );
}
