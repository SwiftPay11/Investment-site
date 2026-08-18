"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  FiActivity,
  FiArrowDownLeft,
  FiArrowRight,
  FiArrowUpRight,
  FiChevronDown,
  FiBell,
  FiCheckCircle,
  FiCreditCard,
  FiRefreshCw,
  FiGrid,
  FiHelpCircle,
  FiMenu,
  FiPlus,
  FiRepeat,
  FiSettings,
  FiShield,
  FiSmartphone,
  FiTrendingUp,
  FiUser,
  FiX,
} from "react-icons/fi";
import { useRouter } from "next/navigation";
import styles from "./dashboard.module.css";

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
  const router = useRouter();
  const [tradingAccounts, setTradingAccounts] = useState([]);
  const [unread, setUnread] = useState(0);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [lang, setLang] = useState(
    typeof window !== "undefined"
      ? localStorage.getItem("cryptofx_lang") || "en"
      : "en"
  );
  const langMenuRef = useRef(null);

  const user = useMemo(() => {
    if (typeof window === "undefined") return null;

    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  const t = useMemo(() => TRANSLATIONS[lang] || TRANSLATIONS.en, [lang]);

  useEffect(() => {
    localStorage.setItem("cryptofx_lang", lang);
  }, [lang]);

  useEffect(() => {
    if (!user?.id) return;

    let active = true;

    const loadUnread = async () => {
      try {
        const res = await fetch(
          `https://investment-site-x6tr.onrender.com/notifications/unread-count/${user.id}`
        );
        const count = await res.json();
        if (active) setUnread(count);
      } catch (error) {
        console.error("Unread notifications fetch error:", error);
      }
    };

    loadUnread();
    const interval = setInterval(loadUnread, 5000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [user?.id]);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (
        langMenuRef.current &&
        !langMenuRef.current.contains(event.target)
      ) {
        setLangDropdownOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setLangDropdownOpen(false);
        setSidebarOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    const ws = new WebSocket("wss://https://investment-site-x6tr.onrender.com");

    ws.onmessage = (event) => {
      try {
        const incoming = JSON.parse(event.data);
        if (incoming.userId === user.id) {
          setUnread((current) => current + 1);
        }
      } catch (error) {
        console.error("Notification socket message error:", error);
      }
    };

    return () => ws.close();
  }, [user?.id]);

  useEffect(() => {
    const handler = () => setUnread((current) => Math.max(0, current - 1));
    window.addEventListener("notif-read", handler);
    return () => window.removeEventListener("notif-read", handler);
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    fetch(
      `https://investment-site-x6tr.onrender.com/trading-accounts/user/${user.id}`
    )
      .then((res) => res.json())
      .then((accounts) =>
        setTradingAccounts(Array.isArray(accounts) ? accounts : [])
      )
      .catch((err) => console.error("Trading accounts fetch error:", err));
  }, [user?.id]);


  useEffect(() => {
    const email = user?.email;
    if (!email) {
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`https://investment-site-x6tr.onrender.com/dashboard/${encodeURIComponent(email)}`)
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
  }, [user?.email]);

  const formatMoney = (v) => {
    const n = Number(v ?? 0);
    if (Number.isNaN(n)) return "0.00";
    return n.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const navigate = (path) => {
    setSidebarOpen(false);
    router.push(path);
  };

  if (loading) {
    return (
      <div className={styles.stateScreen}>
        <div className={styles.loadingMark} aria-hidden="true">
          <FiTrendingUp />
        </div>
        <FiRefreshCw className={styles.spinner} aria-hidden="true" />
        <p>Preparing your dashboard…</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={styles.stateScreen}>
        <div className={styles.emptyStateIcon}>
          <FiActivity aria-hidden="true" />
        </div>
        <h1>Dashboard unavailable</h1>
        <p>We couldn’t load your account information right now.</p>
        <button type="button" onClick={() => window.location.reload()}>
          <FiRefreshCw aria-hidden="true" />
          Try again
        </button>
      </div>
    );
  }

  const walletId = data.walletId ?? data.id ?? "W000000USD";
  const name =
    data.name ?? data.fullName ?? (data.email ? data.email.split("@")[0] : "Trader");
  const firstName = String(name).trim().split(" ")[0] || "Trader";
  const totalTradingBalance = tradingAccounts.reduce(
    (sum, account) => sum + Number(account.accountBalance ?? 0),
    0
  );
  const totalFreeMargin = tradingAccounts.reduce(
    (sum, account) => sum + Number(account.freeMargin ?? 0),
    0
  );
  const activeAccounts = tradingAccounts.filter(
    (account) => account.activated
  ).length;

  const primaryNavigation = [
    { label: "Overview", icon: FiGrid, current: true },
    { label: t.deposit, icon: FiArrowDownLeft, path: "/deposit" },
    { label: "Transactions", icon: FiCreditCard, path: "/transactions" },
    { label: t.withdraw, icon: FiArrowUpRight, path: "/withdraw" },
  ];

  const accountNavigation = [
    { label: t.transfer, icon: FiRepeat, path: "/transfer" },
    { label: "External transfer", icon: FiArrowUpRight, path: "/transfer-other" },
    { label: "Settings", icon: FiSettings, path: "/settings" },
  ];

  return (
    <div
      className={styles.dashboardShell}
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <div className={styles.ambientGlow} aria-hidden="true" />

      <header className={styles.topbar}>
        <div className={styles.topbarInner}>
          <div className={styles.brandArea}>
            <button
              type="button"
              className={styles.menuButton}
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
            >
              <FiMenu aria-hidden="true" />
            </button>

            <div className={styles.brand} aria-label="NexTrade">
              <span className={styles.brandIcon}>
                <FiTrendingUp aria-hidden="true" />
              </span>
              <span>Nex<span>Trade</span></span>
            </div>
          </div>

          <div className={styles.headerActions}>
            <div className={styles.languageMenu} ref={langMenuRef}>
              <button
                type="button"
                className={styles.languageButton}
                onClick={() => setLangDropdownOpen((current) => !current)}
                title={t.languageLabel}
                aria-haspopup="menu"
                aria-expanded={langDropdownOpen}
              >
                <span aria-hidden="true">
                  {LANG_OPTIONS.find((option) => option.code === lang)?.flag}
                </span>
                <span className={styles.languageName}>
                  {LANG_OPTIONS.find((option) => option.code === lang)?.label}
                </span>
                <FiChevronDown
                  className={langDropdownOpen ? styles.chevronOpen : ""}
                  aria-hidden="true"
                />
              </button>

              {langDropdownOpen && (
                <div className={styles.languageDropdown} role="menu">
                  <div className={styles.dropdownLabel}>{t.languageLabel}</div>
                  {LANG_OPTIONS.map((option) => (
                    <button
                      type="button"
                      key={option.code}
                      role="menuitemradio"
                      aria-checked={option.code === lang}
                      className={option.code === lang ? styles.languageActive : ""}
                      onClick={() => {
                        setLang(option.code);
                        setLangDropdownOpen(false);
                      }}
                    >
                      <span aria-hidden="true">{option.flag}</span>
                      <span>{option.label}</span>
                      {option.code === lang && <FiCheckCircle aria-hidden="true" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              className={styles.notificationButton}
              onClick={() => navigate("/notifications")}
              title={t.notifications}
              aria-label={`${t.notifications}${unread > 0 ? `, ${unread} unread` : ""}`}
            >
              <FiBell aria-hidden="true" />
              {unread > 0 && (
                <span className={styles.notificationBadge}>
                  {unread > 99 ? "99+" : unread}
                </span>
              )}
            </button>

            <div className={styles.profileSummary}>
              <div className={styles.avatar}>
                {name?.[0]?.toUpperCase() ?? "U"}
              </div>
              <div className={styles.profileText}>
                <strong>{name}</strong>
                <span>{data.email}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className={styles.appLayout}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarContent}>
            <nav className={styles.navigation} aria-label="Main navigation">
              <p className={styles.navLabel}>Workspace</p>
              {primaryNavigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    type="button"
                    key={item.label}
                    className={item.current ? styles.navItemActive : styles.navItem}
                    onClick={() => item.path && navigate(item.path)}
                    aria-current={item.current ? "page" : undefined}
                  >
                    <Icon aria-hidden="true" />
                    <span>{item.label}</span>
                    {!item.current && <FiChevronDown className={styles.navArrow} aria-hidden="true" />}
                  </button>
                );
              })}

              <p className={styles.navLabel}>Account</p>
              {accountNavigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    type="button"
                    key={item.label}
                    className={styles.navItem}
                    onClick={() => navigate(item.path)}
                  >
                    <Icon aria-hidden="true" />
                    <span>{item.label}</span>
                    <FiChevronDown className={styles.navArrow} aria-hidden="true" />
                  </button>
                );
              })}
            </nav>

            <div className={styles.sidebarDownload}>
              <div className={styles.downloadIcon}>
                <FiSmartphone aria-hidden="true" />
              </div>
              <p>Trade wherever you are</p>
              <span>{t.downloadApp}</span>
              <div className={styles.storeButtons}>
                <button type="button">App Store</button>
                <button type="button">Google Play</button>
              </div>
            </div>

            <div className={styles.securityNote}>
              <FiShield aria-hidden="true" />
              <div>
                <strong>Secure session</strong>
                <span>Your account is protected</span>
              </div>
            </div>
          </div>
        </aside>

        <main className={styles.mainContent}>
          <div className={styles.pageHeading}>
            <div>
              <span className={styles.eyebrow}>Dashboard overview</span>
              <h1>Welcome back, {firstName}</h1>
              <p>Here’s a clear view of your wallet and trading activity.</p>
            </div>
            <button
              type="button"
              className={styles.primaryButton}
              onClick={() => navigate("/deposit")}
            >
              <FiPlus aria-hidden="true" />
              {t.fund}
            </button>
          </div>

          <section className={styles.fundingBanner}>
            <div className={styles.bannerIcon}>
              <FiTrendingUp aria-hidden="true" />
            </div>
            <div className={styles.bannerCopy}>
              <span>Get started</span>
              <h2>{t.fundBannerTitle}</h2>
              <p>{t.fundBannerSub}</p>
            </div>
            <button type="button" onClick={() => navigate("/deposit")}>
              {t.fundYourWallet}
            </button>
          </section>

          <section className={styles.metricsGrid} aria-label="Account summary">
            <article className={styles.metricCard}>
              <div className={`${styles.metricIcon} ${styles.metricIconBlue}`}>
              <FiCreditCard aria-hidden="true" />
              </div>
              <div>
                <span>{t.walletBalanceLabel}</span>
                <strong>${formatMoney(data.balance)}</strong>
                <small>Available balance</small>
              </div>
            </article>

            <article className={styles.metricCard}>
              <div className={`${styles.metricIcon} ${styles.metricIconPurple}`}>
                <FiActivity aria-hidden="true" />
              </div>
              <div>
                <span>Trading balance</span>
                <strong>${formatMoney(totalTradingBalance)}</strong>
                <small>Across all accounts</small>
              </div>
            </article>

            <article className={styles.metricCard}>
              <div className={`${styles.metricIcon} ${styles.metricIconGreen}`}>
                <FiCheckCircle aria-hidden="true" />
              </div>
              <div>
                <span>Active accounts</span>
                <strong>{activeAccounts}</strong>
                <small>{tradingAccounts.length} total accounts</small>
              </div>
            </article>

            <article className={styles.metricCard}>
              <div className={`${styles.metricIcon} ${styles.metricIconAmber}`}>
                <FiTrendingUp aria-hidden="true" />
              </div>
              <div>
                <span>{t.freeMargin}</span>
                <strong>${formatMoney(totalFreeMargin)}</strong>
                <small>Available to trade</small>
              </div>
            </article>
          </section>

          <div className={styles.contentGrid}>
            <section className={`${styles.panel} ${styles.walletPanel}`}>
              <div className={styles.panelHeader}>
                <div>
                  <span className={styles.panelEyebrow}>Primary account</span>
                  <h2>{t.yourWallet}</h2>
                </div>
                <button
                  type="button"
                  className={styles.textButton}
                  onClick={() => navigate("/transactions")}
                >
                  {t.transactionHistory}
                </button>
              </div>

              <div className={styles.walletBody}>
                <div className={styles.walletVisual}>
                  <div className={styles.walletVisualTop}>
                    <span>NexTrade</span>
                    <FiActivity aria-hidden="true" />
                  </div>
                  <div className={styles.walletAsset}>
                    <Image
                      src="/crypto-cardfx.png"
                      alt="NexTrade wallet"
                      fill
                      sizes="140px"
                      priority
                    />
                  </div>
                  <div className={styles.walletVisualBottom}>
                    <span>USD Wallet</span>
                    <strong>•••• {String(walletId).slice(-4)}</strong>
                  </div>
                </div>

                <div className={styles.walletDetails}>
                  <div className={styles.walletId}>
                    <span>{t.walletIdLabel} ID</span>
                    <strong>{walletId}</strong>
                  </div>
                  <div className={styles.balanceBlock}>
                    <span>{t.walletBalanceLabel}</span>
                    <strong><small>$</small>{formatMoney(data.balance)}</strong>
                    <p>USD · Main wallet</p>
                  </div>
                </div>
              </div>

              <div className={styles.walletActions}>
                <button type="button" onClick={() => navigate("/deposit")}>
                  <span><FiArrowDownLeft aria-hidden="true" /></span>
                  <div><strong>{t.fund}</strong><small>Add funds</small></div>
                </button>
                <button type="button" onClick={() => navigate("/withdraw")}>
                  <span><FiArrowUpRight aria-hidden="true" /></span>
                  <div><strong>{t.withdraw}</strong><small>Cash out</small></div>
                </button>
                <button type="button" onClick={() => navigate("/transfer")}>
                  <span><FiRepeat aria-hidden="true" /></span>
                  <div><strong>{t.transfer}</strong><small>Move money</small></div>
                </button>
              </div>
            </section>

            <section className={`${styles.panel} ${styles.quickPanel}`}>
              <div className={styles.panelHeader}>
                <div>
                  <span className={styles.panelEyebrow}>Shortcuts</span>
                  <h2>Quick access</h2>
                </div>
              </div>

              <div className={styles.quickList}>
                <button type="button" onClick={() => navigate("/create-account")}>
                  <span className={styles.quickIcon}><FiPlus aria-hidden="true" /></span>
                  <div><strong>Create trading account</strong><small>Open a new MT5 account</small></div>
                  <FiArrowRight aria-hidden="true" />
                </button>
                <button type="button" onClick={() => navigate("/transfer-other")}>
                  <span className={styles.quickIcon}><FiArrowUpRight aria-hidden="true" /></span>
                  <div><strong>External transfer</strong><small>Send to another account</small></div>
                  <FiArrowRight aria-hidden="true" />
                </button>
                <button type="button" onClick={() => navigate("/settings")}>
                  <span className={styles.quickIcon}><FiUser aria-hidden="true" /></span>
                  <div><strong>Manage profile</strong><small>Review account settings</small></div>
                  <FiArrowRight aria-hidden="true" />
                </button>
              </div>

              <div className={styles.accountStatus}>
                <FiShield aria-hidden="true" />
                <div>
                  <span>Account status</span>
                  <strong>Profile active</strong>
                </div>
                <span className={styles.statusDot}>Verified</span>
              </div>
            </section>
          </div>

          <section className={`${styles.panel} ${styles.accountsPanel}`}>
            <div className={styles.panelHeader}>
              <div>
                <span className={styles.panelEyebrow}>MT5 portfolio</span>
                <h2>{t.tradingAccounts}</h2>
                <p>Manage balances, margin, and access for every trading account.</p>
              </div>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={() => navigate("/create-account")}
              >
                <FiPlus aria-hidden="true" />
                {t.createAccount.replace("+ ", "")}
              </button>
            </div>

            {tradingAccounts.length === 0 ? (
              <div className={styles.emptyAccounts}>
                <div><FiActivity aria-hidden="true" /></div>
                <h3>No trading accounts yet</h3>
                <p>Create your first account to start trading on MT5.</p>
                <button type="button" onClick={() => navigate("/create-account")}>
                  <FiPlus aria-hidden="true" />
                  Create account
                </button>
              </div>
            ) : (
              <div className={styles.accountsList}>
                {tradingAccounts.map((account) => (
                  <article className={styles.accountRow} key={account.id}>
                    <div className={styles.accountIdentity}>
                      <div className={styles.accountLogo}>
                        <FiTrendingUp aria-hidden="true" />
                      </div>
                      <div>
                        <span>{t.mt5Hedging}</span>
                        <strong>#{account.hedgingNumber}</strong>
                      </div>
                    </div>

                    <div className={styles.accountMetric}>
                      <span>{t.accountBalance}</span>
                      <strong>${formatMoney(account.accountBalance)}</strong>
                    </div>

                    <div className={styles.accountMetric}>
                      <span>{t.freeMargin}</span>
                      <strong>${formatMoney(account.freeMargin)}</strong>
                    </div>

                    <div className={styles.accountMetric}>
                      <span>{t.leverage}</span>
                      <strong>{account.leverage || "—"}</strong>
                    </div>

                    <div className={styles.accountState}>
                      <span className={account.activated ? styles.activeBadge : styles.pendingBadge}>
                        <i aria-hidden="true" />
                        {account.activated ? "Activated" : t.notActivated}
                      </span>
                    </div>

                    <div className={styles.accountActions}>
                      <button type="button" onClick={() => navigate("/deposit-fund")}>
                        {t.fund}
                      </button>
                      <button
                        type="button"
                        className={styles.tradeButton}
                        disabled={!account.activated}
                      >
                        Trade
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>

      {sidebarOpen && (
        <div className={styles.mobileOverlay} role="dialog" aria-modal="true" aria-label="Navigation">
          <button
            type="button"
            className={styles.mobileBackdrop}
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation"
          />
          <aside className={styles.mobileSidebar}>
            <div className={styles.mobileSidebarHeader}>
              <div className={styles.brand}>
                <span className={styles.brandIcon}><FiTrendingUp aria-hidden="true" /></span>
                <span>Nex<span>Trade</span></span>
              </div>
              <button type="button" onClick={() => setSidebarOpen(false)} aria-label="Close navigation">
                <FiX aria-hidden="true" />
              </button>
            </div>

            <div className={styles.mobileProfile}>
              <div className={styles.avatar}>{name?.[0]?.toUpperCase() ?? "U"}</div>
              <div><strong>{name}</strong><span>{data.email}</span></div>
            </div>

            <nav className={styles.navigation} aria-label="Mobile navigation">
              <p className={styles.navLabel}>Workspace</p>
              {[...primaryNavigation, ...accountNavigation].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    type="button"
                    key={item.label}
                    className={item.current ? styles.navItemActive : styles.navItem}
                    onClick={() => item.path ? navigate(item.path) : setSidebarOpen(false)}
                    aria-current={item.current ? "page" : undefined}
                  >
                    <Icon aria-hidden="true" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      <button type="button" className={styles.helpButton} aria-label="Get help" title="Get help">
        <FiHelpCircle aria-hidden="true" />
      </button>
    </div>
  );
}
