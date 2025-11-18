"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FiChevronDown,
  FiBell,
  FiRefreshCw,
  FiMenu,
  FiX,
  FiDownload,
} from "react-icons/fi";
import { useRouter } from "next/navigation";

/**
 * Crypto FX Dashboard page
 * - put your card image at /public/cryptofx-card.png
 * - backend endpoint: GET http://localhost:5000/dashboard/:email
 *
 * Notes:
 * - This file contains a built-in translations object to switch languages without extra packages.
 * - If you use a real i18n library later (react-i18next), we can lift those texts out.
 */

const TRANSLATIONS = {
  en: {
    fundBannerTitle: "Fund now to start trading",
    fundBannerSub: "To activate your profile and trading account, make your first deposit.",
    fundYourWallet: "Fund your wallet →",
    yourWallet: "Your wallet",
    transactionHistory: "Transaction history →",
    walletBalanceLabel: "Wallet balance",
    withdraw: "Withdraw",
    transfer: "Transfer",
    fund: "Fund",
    tradingAccounts: "Your trading accounts",
    realAccount: "Real account",
    demoAccounts: "Demo accounts",
    notActivated: "Not Activated",
    mt5Hedging: "MT5 Hedging",
    accountBalance: "Account balance",
    freeMargin: "Free Margin",
    leverage: "Leverage",
    createAccount: "+ Create Account",
    walletIdLabel: "Wallet",
    downloadApp: "Scan to download Crypto FX App",
    deposit: "Deposit",
    tools: "Tools",
    analytics: "Analytics & Education",
    languageLabel: "Language",
    notifications: "Notifications",
    profile: "Profile",
  },
  fr: {
    fundBannerTitle: "Alimentez maintenant pour commencer à trader",
    fundBannerSub: "Pour activer votre profil et compte de trading, effectuez votre premier dépôt.",
    fundYourWallet: "Alimenter votre portefeuille →",
    yourWallet: "Votre portefeuille",
    transactionHistory: "Historique des transactions →",
    walletBalanceLabel: "Solde du portefeuille",
    withdraw: "Retrait",
    transfer: "Transférer",
    fund: "Alimenter",
    tradingAccounts: "Vos comptes de trading",
    realAccount: "Compte réel",
    demoAccounts: "Comptes démo",
    notActivated: "Non activé",
    mt5Hedging: "MT5 Hedging",
    accountBalance: "Solde du compte",
    freeMargin: "Marge disponible",
    leverage: "Effet de levier",
    createAccount: "+ Créer un compte",
    walletIdLabel: "Portefeuille",
    downloadApp: "Scannez pour télécharger l'application Crypto FX",
    deposit: "Dépôt",
    tools: "Outils",
    analytics: "Analytique & Éducation",
    languageLabel: "Langue",
    notifications: "Notifications",
    profile: "Profil",
  },
  es: {
    fundBannerTitle: "Financia ahora para empezar a operar",
    fundBannerSub: "Para activar su perfil y cuenta, realice su primer depósito.",
    fundYourWallet: "Financiar su billetera →",
    yourWallet: "Su billetera",
    transactionHistory: "Historial de transacciones →",
    walletBalanceLabel: "Saldo de la cartera",
    withdraw: "Retirar",
    transfer: "Transferir",
    fund: "Depositar",
    tradingAccounts: "Sus cuentas de trading",
    realAccount: "Cuenta real",
    demoAccounts: "Cuentas demo",
    notActivated: "No activada",
    mt5Hedging: "MT5 Hedging",
    accountBalance: "Saldo de la cuenta",
    freeMargin: "Margen libre",
    leverage: "Apalancamiento",
    createAccount: "+ Crear cuenta",
    walletIdLabel: "Cartera",
    downloadApp: "Escanee para descargar Crypto FX App",
    deposit: "Depósito",
    tools: "Herramientas",
    analytics: "Analítica y Educación",
    languageLabel: "Idioma",
    notifications: "Notificaciones",
    profile: "Perfil",
  },
  de: {
    fundBannerTitle: "Jetzt einzahlen, um mit dem Handel zu beginnen",
    fundBannerSub: "Um Ihr Profil und Handelskonto zu aktivieren, tätigen Sie Ihre erste Einzahlung.",
    fundYourWallet: "Konto aufladen →",
    yourWallet: "Ihr Wallet",
    transactionHistory: "Transaktionsverlauf →",
    walletBalanceLabel: "Wallet-Guthaben",
    withdraw: "Abheben",
    transfer: "Überweisen",
    fund: "Einzahlen",
    tradingAccounts: "Ihre Handelskonto",
    realAccount: "Echtkonto",
    demoAccounts: "Demokonten",
    notActivated: "Nicht aktiviert",
    mt5Hedging: "MT5 Hedging",
    accountBalance: "Kontostand",
    freeMargin: "Freier Margin",
    leverage: "Hebel",
    createAccount: "+ Konto erstellen",
    walletIdLabel: "Wallet",
    downloadApp: "Scan zum Herunterladen der Crypto FX App",
    deposit: "Einzahlung",
    tools: "Tools",
    analytics: "Analysen & Bildung",
    languageLabel: "Sprache",
    notifications: "Benachrichtigungen",
    profile: "Profil",
  },
  pt: {
    fundBannerTitle: "Financie agora para começar a negociar",
    fundBannerSub: "Para ativar seu perfil e conta, faça seu primeiro depósito.",
    fundYourWallet: "Financiar carteira →",
    yourWallet: "Sua carteira",
    transactionHistory: "Histórico de transações →",
    walletBalanceLabel: "Saldo da carteira",
    withdraw: "Retirar",
    transfer: "Transferir",
    fund: "Depositar",
    tradingAccounts: "Suas contas de negociação",
    realAccount: "Conta real",
    demoAccounts: "Contas demo",
    notActivated: "Não ativado",
    mt5Hedging: "MT5 Hedging",
    accountBalance: "Saldo da conta",
    freeMargin: "Margem Livre",
    leverage: "Alavancagem",
    createAccount: "+ Criar Conta",
    walletIdLabel: "Carteira",
    downloadApp: "Digitalize para baixar o aplicativo Crypto FX",
    deposit: "Depósito",
    tools: "Ferramentas",
    analytics: "Análise & Educação",
    languageLabel: "Idioma",
    notifications: "Notificações",
    profile: "Perfil",
  },
  ru: {
    fundBannerTitle: "Пополните счет, чтобы начать торговать",
    fundBannerSub: "Чтобы активировать профиль и торговый счет, внесите первый депозит.",
    fundYourWallet: "Пополнить кошелек →",
    yourWallet: "Ваш кошелек",
    transactionHistory: "История транзакций →",
    walletBalanceLabel: "Баланс кошелька",
    withdraw: "Вывод",
    transfer: "Перевод",
    fund: "Пополнить",
    tradingAccounts: "Ваши торговые счета",
    realAccount: "Реальный счет",
    demoAccounts: "Демо-счета",
    notActivated: "Не активирован",
    mt5Hedging: "MT5 Hedging",
    accountBalance: "Баланс счета",
    freeMargin: "Свободная маржа",
    leverage: "Кредитное плечо",
    createAccount: "+ Создать счет",
    walletIdLabel: "Кошелек",
    downloadApp: "Отсканируйте для скачивания Crypto FX App",
    deposit: "Депозит",
    tools: "Инструменты",
    analytics: "Аналитика и обучение",
    languageLabel: "Язык",
    notifications: "Уведомления",
    profile: "Профиль",
  },
  zh: {
    fundBannerTitle: "立即充值以开始交易",
    fundBannerSub: "要激活您的个人资料和交易帐户，请进行首次存款。",
    fundYourWallet: "为您的钱包充值 →",
    yourWallet: "您的钱包",
    transactionHistory: "交易历史 →",
    walletBalanceLabel: "钱包余额",
    withdraw: "提款",
    transfer: "转账",
    fund: "充值",
    tradingAccounts: "您的交易账户",
    realAccount: "真实账户",
    demoAccounts: "模拟账户",
    notActivated: "未激活",
    mt5Hedging: "MT5 Hedging",
    accountBalance: "账户余额",
    freeMargin: "可用保证金",
    leverage: "杠杆",
    createAccount: "+ 创建账户",
    walletIdLabel: "钱包",
    downloadApp: "扫描以下载 Crypto FX 应用",
    deposit: "充值",
    tools: "工具",
    analytics: "分析与教育",
    languageLabel: "语言",
    notifications: "通知",
    profile: "个人资料",
  },
  ar: {
    fundBannerTitle: "مموّل الآن لبدء التداول",
    fundBannerSub: "لتفعيل ملفك وحساب التداول، قم بإجراء الإيداع الأول.",
    fundYourWallet: "مموّل محفظتك →",
    yourWallet: "محفظتك",
    transactionHistory: "سجل المعاملات →",
    walletBalanceLabel: "رصيد المحفظة",
    withdraw: "سحب",
    transfer: "تحويل",
    fund: "إيداع",
    tradingAccounts: "حسابات التداول الخاصة بك",
    realAccount: "حساب حقيقي",
    demoAccounts: "حسابات تجريبية",
    notActivated: "غير مفعل",
    mt5Hedging: "MT5 Hedging",
    accountBalance: "رصيد الحساب",
    freeMargin: "الهامش الحر",
    leverage: "الرافعة المالية",
    createAccount: "+ إنشاء حساب",
    walletIdLabel: "المحفظة",
    downloadApp: "امسح لتنزيل تطبيق Crypto FX",
    deposit: "إيداع",
    tools: "أدوات",
    analytics: "التحليلات والتعليم",
    languageLabel: "اللغة",
    notifications: "الإشعارات",
    profile: "الملف الشخصي",
  },
  hi: {
    fundBannerTitle: "ट्रेडिंग शुरू करने के लिए अभी फंड करें",
    fundBannerSub: "अपने प्रोफ़ाइल और ट्रेडिंग खाते को सक्रिय करने के लिए, पहली जमा राशि करें।",
    fundYourWallet: "अपने वॉलेट को फंड करें →",
    yourWallet: "आपका वॉलेट",
    transactionHistory: "लेन-देन इतिहास →",
    walletBalanceLabel: "वॉलेट शेष",
    withdraw: "निकासी",
    transfer: "हस्तांतरण",
    fund: "फंड करें",
    tradingAccounts: "आपके ट्रेडिंग खाते",
    realAccount: "रीयल अकाउंट",
    demoAccounts: "डेमो खाते",
    notActivated: "सक्रिय नहीं",
    mt5Hedging: "MT5 Hedging",
    accountBalance: "खाते का शेष",
    freeMargin: "मुक्त मार्जिन",
    leverage: "लीवरेज",
    createAccount: "+ खाता बनाएं",
    walletIdLabel: "वॉलेट",
    downloadApp: "Crypto FX ऐप डाउनलोड करने के लिए स्कैन करें",
    deposit: "जमा",
    tools: "उपकरण",
    analytics: "विश्लेषण और शिक्षा",
    languageLabel: "भाषा",
    notifications: "सूचनाएँ",
    profile: "प्रोफ़ाइल",
  },
  // add more languages here as needed...
};

const LANG_OPTIONS = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "pt", label: "Português", flag: "🇵🇹" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
  { code: "hi", label: "हिन्दी", flag: "🇮🇳" },
];

export default function Dashboard() {
  const [tradingAccounts, setTradingAccounts] = useState([]);
   const [unread, setUnread] = useState(0);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();   
const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user")) : null;

  const loadUnread = async () => {
  if (!user?.id) return;

  const res = await fetch(`http://192.168.1.87:5000/notifications/unread-count/${user.id}`);
  const count = await res.json();
  setUnread(count);
};




  // ui state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [lang, setLang] = useState(
    typeof window !== "undefined"
      ? localStorage.getItem("cryptofx_lang") || "en"
      : "en"
  );
  const t = useMemo(() => TRANSLATIONS[lang] || TRANSLATIONS.en, [lang]);

  useEffect(() => {
    localStorage.setItem("cryptofx_lang", lang);
  }, [lang]);

  useEffect(() => {
  if (!user?.id) return;
  loadUnread();
  const interval = setInterval(() => loadUnread(), 5000);
  return () => clearInterval(interval);
}, [user]);

  useEffect(() => {
  const handleClickOutside = (e) => {
    if (!e.target.closest(".lang-dropdown")) {
      setLangDropdownOpen(false);
    }
  };
  document.addEventListener("click", handleClickOutside);
  return () => document.removeEventListener("click", handleClickOutside);
}, []);

useEffect(() => {
  if (!user?.id) return;

  const ws = new WebSocket("ws://192.168.1.87:5000");

  ws.onmessage = (event) => {
    const incoming = JSON.parse(event.data);
    if (incoming.userId === user.id) {
      // new notification arrived → increment
      setUnread((u) => u + 1);
    }
  };

  return () => ws.close();
}, [user]);

useEffect(() => {
  const handler = () => setUnread((u) => Math.max(0, u - 1));
  window.addEventListener("notif-read", handler);
  return () => window.removeEventListener("notif-read", handler);
}, []);

// Load trading accounts ONLY after user loads
useEffect(() => {
  if (!user?.id) return;

  fetch(`http://192.168.1.87:5000/trading-accounts/user/${user.id}`)
    .then((res) => res.json())
    .then((accounts) => setTradingAccounts(accounts))
    .catch((err) =>
      console.error("Trading accounts fetch error:", err)
    );
}, [user]);


  useEffect(() => {
    // get logged-in user email from localStorage (same approach you used earlier)
    const stored = localStorage.getItem("user");
    if (!stored) {
      setLoading(false);
      return;
    }
    let userObj = {};
    try {
      userObj = JSON.parse(stored);
    } catch {
      userObj = {};
    }
    const email = userObj?.email;
    if (!email) {
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`http://192.168.1.87:5000/dashboard/${encodeURIComponent(email)}`)
      .then(async (res) => {
        if (!res.ok) {
          const txt = await res.text().catch(() => null);
          throw new Error(txt || "Failed to fetch dashboard");
        }
        return res.json();
      })
      .then((json) => {
        // support: either json.data or the json directly
        const payload = json?.data ?? json;
        // ensure numeric values are numbers
        if (payload) {
          payload.balance = Number(payload.balance ?? 0);
          payload.accountBalance = Number(payload.accountBalance ?? 0);
          // ensure transactions array exists
          payload.transactions = Array.isArray(payload.transactions)
            ? payload.transactions
            : [];
        }
        setData(payload);
      })
      .catch((err) => {
        console.error("Dashboard fetch err", err);
      })
      .finally(() => setLoading(false));
  }, []);

  
  // defensive format helpers
  const formatMoney = (v) => {
    const n = Number(v ?? 0);
    if (Number.isNaN(n)) return "0.00";
    return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#020817] via-[#060b1e] to-[#0a0f29] text-white">
        <div className="text-gray-300">Loading dashboard...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#020817] via-[#060b1e] to-[#0a0f29] text-white">
        <div className="text-gray-300">No dashboard data found.</div>
      </div>
    );
  }

  const walletId = data.walletId ?? data.id ?? "W000000USD";
  const name =
    data.name ?? data.fullName ?? (data.email ? data.email.split("@")[0] : "Trader");

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020817] via-[#060b1e] to-[#0a0f29] text-white">
      {/* page container */}
      <div className="max-w-[1200px] mx-auto">
        {/* header */}
        <header className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-2 rounded bg-white/5"
              onClick={() => setSidebarOpen(true)}
              aria-label="open sidebar"
            >
              <FiMenu />
            </button>
            <div className="text-2xl font-bold text-red-500 tracking-wide">NexTrade</div>
          </div>

          <div className="flex items-center gap-4">
            {/* language selector */}
           <div className="relative lang-dropdown">
  <button
    className="flex items-center gap-2 px-3 py-2 bg-white/6 rounded"
    onClick={() => setLangDropdownOpen((prev) => !prev)}
    title={t.languageLabel}
  >
    <span className="text-sm">{LANG_OPTIONS.find((l) => l.code === lang)?.flag}</span>
    <span className="text-sm">{LANG_OPTIONS.find((l) => l.code === lang)?.label}</span>
    <FiChevronDown
      className={`transition-transform ${langDropdownOpen ? "rotate-180" : ""}`}
    />
  </button>

  {langDropdownOpen && (
    <div
      className="absolute right-0 mt-2 w-44 bg-[#061025] border border-white/6 rounded shadow-lg z-20"
    >
      {LANG_OPTIONS.map((opt) => (
        <div
          key={opt.code}
          onClick={() => {
            setLang(opt.code);
            setLangDropdownOpen(false);
          }}
          className="px-3 py-2 hover:bg-white/5 cursor-pointer flex items-center gap-2"
        >
          <span>{opt.flag}</span>
          <span className="text-sm">{opt.label}</span>
        </div>
      ))}
    </div>
  )}
</div>

           <button
  className="p-2 rounded bg-white/5 cursor-pointer hover:bg-white/10 transition"
  title={t.notifications}
>
  <div
    className="relative cursor-pointer"
    onClick={() => router.push("/notifications")}
  >
    {/* 🔔 Replace emoji with FiBell */}
    <FiBell className="text-3xl" />

    {/* Unread badge */}
    {unread > 0 && (
      <span className="absolute -top-1 -right-1 bg-red-600 text-xs px-1.5 py-0.5 rounded-full">
        {unread}
      </span>
    )}
  </div>
</button>


            <div className="flex items-center gap-2 px-3 py-1 rounded bg-white/6">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-semibold">
                {name?.[0]?.toUpperCase() ?? "U"}
              </div>
              <div className="text-sm  cursor-pointer hover:bg-white/10 transition">
                <div className="font-medium">{name}</div>
                <div className="text-xs text-white/70">{data.email}</div>
              </div>
            </div>
          </div>
        </header>

      <div className="flex flex-col md:flex-row gap-6 px-4 pb-12 overflow-x-hidden">
          {/* left sidebar (desktop) */}
          <aside className="hidden md:block w-72 bg-white/3 rounded-lg p-4 border border-white/6 min-h-[70vh]">
            <div className="mb-4">
              <div className="text-left mb-2 text-white font-semibold">Wallet & Accounts</div>
              <button className="w-full text-left px-3 py-2 rounded bg-white/6 hover:bg-white/8 mb-2 flex items-center gap-3">
                <span 
                onClick={() => router.push("/deposit")} className="w-8 h-8 rounded bg-white/8 flex items-center justify-center">F</span>
                <span onClick={() => router.push("/deposit")}> {t.deposit}</span>
              </button>

              <div className="mt-2 text-sm text-white/80  cursor-pointer hover:bg-white/10 transition">
                Deposit</div>
              <div className="mt-4">
                <div className="text-sm text-white/80 mb-2  cursor-pointer hover:bg-white/10 transition">Tools</div>
                <div className="text-xs text-white/70  cursor-pointer hover:bg-white/10 transition">Analytics & Education</div>
              </div>
            </div>

            <div className="mt-6">
              <div className="text-sm text-white/70 mb-2">Download the app</div>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-3 py-2 rounded bg-white/6">
                  <FiDownload /> <span className="text-xs">App Store</span>
                </button>
                <button className="flex items-center gap-2 px-3 py-2 rounded bg-white/6">
                  <FiDownload /> <span className="text-xs">Google Play</span>
                </button>
              </div>

              <div className="mt-4 bg-white/6 p-3 rounded">
                <div className="text-xs text-black/70">{t.downloadApp}</div>
                <div className="mt-3 bg-white w-full h-32" />
              </div>
            </div>
          </aside>

          {/* main content column */}
          <main className="flex-1">
            {/* fund banner */}
            <div className="bg-white/6 rounded-xl p-6 flex items-center justify-between border border-white/6 shadow-sm mb-6">
              <div>
                <h2 className="text-lg font-semibold">{t.fundBannerTitle}</h2>
                <p className="text-sm text-white/80 mt-1">{t.fundBannerSub}</p>
              </div>
              <div>
                <button 
                onClick={() => router.push("/deposit")}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-2 rounded-lg text-black font-semibold  cursor-pointer hover:bg-white/10 transition">
                  {t.fund}
                </button>
              </div>
            </div>

            {/* wallet card */}
            <section className="bg-white/5 rounded-xl p-6 border border-white/6 mb-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h3 className="text-xl font-semibold">{t.yourWallet}</h3>
                <a onClick={() => router.push("/transactions")} className="text-sm text-white/80  cursor-pointer hover:bg-white/10 transition">{t.transactionHistory}</a>
              </div>

              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="flex flex-wrap gap-6 items-center">
                  <div className="w-36 h-24 rounded overflow-hidden bg-black/20 border border-white/6">
                    <img
                      src="/crypto-cardfx.png"
                      alt="Crypto FX Card"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>

                  <div>
                    <div className="text-sm text-white/70">{walletId}</div>
                    <div className="text-sm text-white/80 mt-2  cursor-pointer hover:bg-white/10 transition">{t.walletBalanceLabel}</div>
                    <div className="text-2xl font-bold mt-1">${formatMoney(data.balance)}</div>
                  </div>
                </div>

                <div className="ml-auto flex flex-wrap gap-3">
                  <button onClick={() => router.push("/withdraw")} className="px-4 py-2 bg-white/6 text-white/80 rounded-md  cursor-pointer hover:bg-white/10 transition">
                    {t.withdraw}
                  </button>
                  <button onClick={() => router.push("/transfer")} className="px-4 py-2 bg-white/6 text-white/80 rounded-md  cursor-pointer hover:bg-white/10 transition">
                    {t.transfer}
                  </button>
                  <button onClick={() => router.push("/deposit")} className="px-4 py-2 bg-blue-500 rounded-md font-semibold text-black  cursor-pointer hover:bg-white/10 transition">
                    {t.fund}
                  </button>
                </div>
              </div>
            </section>
                {/* trading accounts */}
{/* trading accounts */}
<section className="bg-white/5 rounded-xl p-6 border border-white/6">
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-lg font-semibold">{t.tradingAccounts}</h3>

    <button
      onClick={() => router.push("/create-account")}
      className="text-sm text-blue-400 hover:underline"
    >
      {t.createAccount}
    </button>
  </div>

  {/* If no trading accounts */}
  {tradingAccounts.length === 0 && (
    <div className="text-white/60 text-sm p-4 bg-white/5 rounded">
      No trading accounts yet. Click “Create Account” to start.
    </div>
  )}

  {/* Render list of all trading accounts */}
  {tradingAccounts.map((acc) => {
    const badgeText = acc.activated ? "Activated" : t.notActivated;
    const badgeColor = acc.activated
      ? "bg-green-500 text-black"
      : "bg-yellow-400 text-black";

    return (
      <div
        key={acc.id}
        className="bg-white/6 rounded p-4 mb-4 border border-white/10"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          
          {/* Left section */}
          <div>
            <div className="text-sm font-medium">
              #{acc.hedgingNumber}
            </div>

            <div className={`inline-block mt-2 px-2 py-1 text-xs rounded ${badgeColor}`}>
              {badgeText}
            </div>

            <div className="mt-2 text-xs text-white/70">{t.mt5Hedging}</div>
          </div>

          {/* Right section */}
          <div className="flex flex-wrap gap-6 items-center">

            {/* Balance */}
            <div className="text-xs text-white/70">
              <div className="text-xs">{t.accountBalance}</div>
              <div className="font-semibold">
                ${formatMoney(acc.accountBalance)}
              </div>
            </div>

            {/* Free Margin */}
            <div className="text-xs text-white/70">
              <div className="text-xs">{t.freeMargin}</div>
              <div className="font-semibold">
                ${formatMoney(acc.freeMargin)}
              </div>
            </div>

            {/* Leverage */}
            <div className="text-xs text-white/70">
              <div className="text-xs">{t.leverage}</div>
              <div className="font-semibold">
                {acc.leverage}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              {/* FUND BUTTON */}
              <button
                onClick={() => router.push("/deposit")}
                className="px-3 py-2 bg-white/6 text-white/80 rounded hover:bg-white/10"
              >
                {t.fund}
              </button>

              {/* TRADE BUTTON */}
              <button
                disabled={!acc.activated}
                className={`px-3 py-2 rounded 
                  ${acc.activated
                    ? "bg-blue-500 text-black"
                    : "bg-blue-500/40 text-black/40 cursor-not-allowed"}`}
              >
                Trade
              </button>
            </div>

          </div>
        </div>
      </div>
    );
  })}
</section>
          </main>
        </div>
      </div>

      {/* mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-[#061025] p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xl font-bold text-red-500">NexTrade</div>
              <button className="p-1" onClick={() => setSidebarOpen(false)}>
                <FiX />
              </button>
            </div>
            
            <nav className="space-y-2">
              <div className="px-2 py-2 rounded bg-white/6">Wallet & Accounts</div>
              <div className="px-2 py-2 rounded">Deposit</div>
              <div className="px-2 py-2 rounded">Tools</div>
              <div className="px-2 py-2 rounded">Analytics & Education</div>
            </nav>
          </div>
        </div>
      )}

      {/* floating chat/help button */}
      <button className="fixed right-6 bottom-6 w-14 h-14 rounded-full bg-blue-500 text-black font-bold shadow-lg flex items-center justify-center  cursor-pointer hover:bg-white/10 transition">
        💬
      </button>
    </div>
  );
}
