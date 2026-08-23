"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  FiActivity,
  FiArrowRight,
  FiBarChart2,
  FiCheck,
  FiClock,
  FiGlobe,
  FiLayers,
  FiLock,
  FiShield,
  FiTrendingUp,
  FiUsers,
  FiZap,
} from "react-icons/fi";
import styles from "./landing.module.css";

const markets = [
  { symbol: "BTC / USD", price: "$67,842.20", change: "+2.48%" },
  { symbol: "ETH / USD", price: "$3,482.16", change: "+1.62%" },
  { symbol: "EUR / USD", price: "1.0842", change: "+0.34%" },
  { symbol: "XAU / USD", price: "$2,341.80", change: "+0.91%" },
];

const features = [
  {
    icon: FiZap,
    title: "Fast execution",
    copy: "Move from insight to action with an experience designed for speed and clarity.",
  },
  {
    icon: FiShield,
    title: "Security first",
    copy: "Your account and activity are protected by a security-focused platform architecture.",
  },
  {
    icon: FiBarChart2,
    title: "Clear market access",
    copy: "Manage your wallet and trading accounts from one focused, intuitive workspace.",
  },
];

export default function Home() {
  const router = useRouter();

  return (
    <div className={styles.landingShell}>
      <div className={styles.ambientOne} aria-hidden="true" />
      <div className={styles.ambientTwo} aria-hidden="true" />

      <header className={styles.siteHeader}>
        <nav className={styles.navbar} aria-label="Main navigation">
          <a href="#top" className={styles.brand} aria-label="NexTrade home">
            <span className={styles.brandMark}>
              <FiTrendingUp aria-hidden="true" />
            </span>
            <span>Nex<span>Trade</span></span>
          </a>

          <div className={styles.navLinks}>
            <a href="#markets">Markets</a>
            <a href="#platform">Platform</a>
            <a href="#security">Security</a>
            <a href="#about">Why NexTrade</a>
          </div>

          <div className={styles.navActions}>
            <button type="button" className={styles.loginLink} onClick={() => router.push("/login")}>
              Log in
            </button>
            <button type="button" className={styles.navCta} onClick={() => router.push("/register")}>
              Get started
              <FiArrowRight aria-hidden="true" />
            </button>
          </div>
        </nav>
      </header>

      <main id="top">
        <section className={styles.heroSection}>
          <div className={styles.heroContent}>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={styles.heroEyebrow}
            >
              <span><FiActivity aria-hidden="true" /></span>
              A clearer way to trade global markets
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.08 }}
            >
              Trade with clarity.<br />
              Grow with <span>confidence.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.16 }}
            >
              A focused trading experience for digital assets and global markets—built to help you manage funds, monitor accounts, and move decisively.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.24 }}
              className={styles.heroActions}
            >
              <button type="button" className={styles.primaryCta} onClick={() => router.push("/register")}>
                Create free account
                <FiArrowRight aria-hidden="true" />
              </button>
              <button type="button" className={styles.secondaryCta} onClick={() => router.push("/login")}>
                Explore your dashboard
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.34 }}
              className={styles.heroTrust}
            >
              <span><FiCheck aria-hidden="true" /> Simple account setup</span>
              <span><FiCheck aria-hidden="true" /> Secure access</span>
              <span><FiCheck aria-hidden="true" /> 24/7 market visibility</span>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75, delay: 0.12 }}
            className={styles.heroVisual}
          >
            <div className={styles.visualGlow} aria-hidden="true" />
            <div className={styles.platformCard}>
              <div className={styles.platformHeader}>
                <div>
                  <span>Portfolio overview</span>
                  <strong>Welcome back, Alex</strong>
                </div>
                <span className={styles.liveBadge}><i /> Live</span>
              </div>

              <div className={styles.balanceCard}>
                <div>
                  <span>Total balance</span>
                  <strong><small>$</small>24,860.40</strong>
                  <p><FiTrendingUp aria-hidden="true" /> 8.4% this month</p>
                </div>
                <div className={styles.miniChart} aria-label="Portfolio growth chart">
                  {[32, 42, 37, 55, 49, 68, 61, 78, 72, 91, 84, 100].map((height, index) => (
                    <i key={index} style={{ height: `${height}%` }} />
                  ))}
                </div>
              </div>

              <div className={styles.visualStats}>
                <div><span>Trading balance</span><strong>$18,420.00</strong></div>
                <div><span>Free margin</span><strong>$6,440.40</strong></div>
                <div><span>Active accounts</span><strong>3</strong></div>
              </div>

              <div className={styles.accountPreview}>
                <div className={styles.accountIcon}><FiLayers aria-hidden="true" /></div>
                <div><span>MT5 Hedging</span><strong>#NT-249031</strong></div>
                <div><span>Leverage</span><strong>1:500</strong></div>
                <span className={styles.activePill}><i /> Active</span>
              </div>
            </div>

            <div className={styles.securityFloat}>
              <span><FiLock aria-hidden="true" /></span>
              <div><strong>Protected access</strong><small>Security-first infrastructure</small></div>
            </div>
          </motion.div>
        </section>

        <section className={styles.marketStrip} id="markets" aria-label="Market snapshot">
          <div className={styles.marketStripInner}>
            <div className={styles.marketLabel}>
              <FiActivity aria-hidden="true" />
              Market snapshot
            </div>
            {markets.map((market) => (
              <div key={market.symbol} className={styles.marketItem}>
                <span>{market.symbol}</span>
                <strong>{market.price}</strong>
                <small>{market.change}</small>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.featuresSection} id="platform">
          <div className={styles.sectionHeading}>
            <span>Built for better decisions</span>
            <h2>Everything you need.<br />Nothing you don’t.</h2>
            <p>A modern workspace that keeps your wallet, accounts, and trading activity organized in one place.</p>
          </div>

          <div className={styles.featureGrid}>
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <article key={feature.title}>
                  <div className={styles.featureNumber}>0{index + 1}</div>
                  <span className={styles.featureIcon}><Icon aria-hidden="true" /></span>
                  <h3>{feature.title}</h3>
                  <p>{feature.copy}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className={styles.securitySection} id="security">
          <div className={styles.securityVisual}>
            <div className={styles.securityCore}>
              <span><FiShield aria-hidden="true" /></span>
              <strong>Security at the core</strong>
              <small>Designed to protect your access and account activity</small>
            </div>
            <div className={styles.securityOrbitOne} aria-hidden="true" />
            <div className={styles.securityOrbitTwo} aria-hidden="true" />
          </div>

          <div className={styles.securityCopy}>
            <span className={styles.sectionEyebrow}>Confidence by design</span>
            <h2>Your account deserves serious protection.</h2>
            <p>NexTrade combines clear account controls with a platform experience designed around responsible access and visibility.</p>
            <ul>
              <li><FiCheck aria-hidden="true" /><div><strong>Protected sessions</strong><span>Secure access across your account experience.</span></div></li>
              <li><FiCheck aria-hidden="true" /><div><strong>Transparent activity</strong><span>Review balances, accounts, and transaction information clearly.</span></div></li>
              <li><FiCheck aria-hidden="true" /><div><strong>Responsive support</strong><span>Help is available when you need guidance.</span></div></li>
            </ul>
          </div>
        </section>

        <section className={styles.proofSection} id="about">
          <div><FiGlobe aria-hidden="true" /><strong>Global access</strong><span>Stay connected to your trading workspace from anywhere.</span></div>
          <div><FiClock aria-hidden="true" /><strong>Always available</strong><span>Monitor your portfolio and accounts around the clock.</span></div>
          <div><FiUsers aria-hidden="true" /><strong>Trader focused</strong><span>An experience designed to keep complex activity understandable.</span></div>
        </section>

        <section className={styles.ctaSection}>
          <div>
            <span>Ready when you are</span>
            <h2>Start building your trading future.</h2>
            <p>Create your NexTrade profile and access your complete trading workspace.</p>
          </div>
          <button type="button" onClick={() => router.push("/register")}>
            Open your account
            <FiArrowRight aria-hidden="true" />
          </button>
        </section>
      </main>

      <footer className={styles.siteFooter}>
        <div>
          <a href="#top" className={styles.brand}>
            <span className={styles.brandMark}><FiTrendingUp aria-hidden="true" /></span>
            <span>Nex<span>Trade</span></span>
          </a>
          <p>A clear, secure workspace for modern traders.</p>
        </div>
        <div className={styles.footerLinks}>
          <a href="#markets">Markets</a>
          <a href="#platform">Platform</a>
          <a href="#security">Security</a>
          <button type="button" onClick={() => router.push("/login")}>Log in</button>
        </div>
        <small>© {new Date().getFullYear()} NexTrade Markets. All rights reserved.</small>
      </footer>
    </div>
  );
}
