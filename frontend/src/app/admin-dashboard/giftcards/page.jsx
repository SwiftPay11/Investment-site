"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiCheck,
  FiClock,
  FiDollarSign,
  FiGift,
  FiImage,
  FiInbox,
  FiRefreshCw,
  FiShield,
  FiX,
} from "react-icons/fi";
import styles from "../admin-dashboard.module.css";

export default function AdminGiftcardsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [giftcards, setGiftcards] = useState([]);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState("");

  const API = "https://investment-site-x6tr.onrender.com"; // CHANGE TO RENDER URL ON DEPLOY

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/wallet/giftcards/pending`);
      const data = await res.json();

      if (!res.ok) throw new Error(data?.message || "Failed to load data");

      setGiftcards(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const takeAction = async (id, action) => {
    setActionLoading(`${id}-${action}`);
    try {
      const res = await fetch(`https://investment-site-x6tr.onrender.com/wallet/giftcards/${action}/${id}`, {
        method: "POST",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `Failed to ${action}`);

      alert(`Giftcard ${action} successful`);
      loadData();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading("");
    }
  };

  const pendingValue = giftcards.reduce(
    (sum, transaction) => sum + Number(transaction.amount ?? 0),
    0
  );

  return (
    <div className={styles.adminShell}>
      <div className={styles.ambientGlow} aria-hidden="true" />

      <header className={styles.adminTopbar}>
        <div className={styles.topbarInner}>
          <div className={styles.adminBrand}>
            <span className={styles.brandMark}>
              <FiShield aria-hidden="true" />
            </span>
            <div>
              <strong>Nex<span>Trade</span></strong>
              <small>Administration</small>
            </div>
          </div>

          <div className={styles.adminIdentity}>
            <span>Administrator</span>
            <div>A</div>
          </div>
        </div>
      </header>

      <main className={styles.giftcardMain}>
        <div className={styles.giftcardHeading}>
          <div>
            <button
              type="button"
              className={styles.backButton}
              onClick={() => router.push("/admin-dashboard")}
            >
              <FiArrowLeft aria-hidden="true" />
              Back to dashboard
            </button>
            <span className={styles.eyebrow}>Deposit review</span>
            <h1>Pending gift-card deposits</h1>
            <p>Review submitted evidence and approve or reject each request.</p>
          </div>

          <button
            type="button"
            className={styles.refreshButton}
            onClick={loadData}
            disabled={loading}
          >
            <FiRefreshCw className={loading ? styles.spinning : ""} aria-hidden="true" />
            Refresh
          </button>
        </div>

        <section className={styles.giftcardMetrics} aria-label="Gift-card summary">
          <article>
            <span className={`${styles.metricIcon} ${styles.metricPurple}`}>
              <FiGift aria-hidden="true" />
            </span>
            <div>
              <small>Pending requests</small>
              <strong>{giftcards.length}</strong>
              <p>Awaiting review</p>
            </div>
          </article>
          <article>
            <span className={`${styles.metricIcon} ${styles.metricGreen}`}>
              <FiDollarSign aria-hidden="true" />
            </span>
            <div>
              <small>Pending value</small>
              <strong>
                ${pendingValue.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </strong>
              <p>Total submitted amount</p>
            </div>
          </article>
        </section>

        {error && (
          <div className={styles.errorBanner} role="alert">
            <FiX aria-hidden="true" />
            <div>
              <strong>Unable to load requests</strong>
              <span>{error}</span>
            </div>
            <button type="button" onClick={loadData}>Try again</button>
          </div>
        )}

        <section className={styles.giftcardPanel}>
          <div className={styles.panelHeader}>
            <div>
              <span className={styles.panelEyebrow}>Review queue</span>
              <h2>Deposit submissions</h2>
              <p>Verify the customer details, card information, and uploaded image.</p>
            </div>
            <span className={styles.recordCount}>{giftcards.length} pending</span>
          </div>

          {loading ? (
            <div className={styles.giftcardLoading}>
              <FiRefreshCw className={styles.spinning} aria-hidden="true" />
              <strong>Loading submissions</strong>
              <span>Retrieving the latest gift-card deposits…</span>
            </div>
          ) : giftcards.length === 0 ? (
            <div className={styles.giftcardEmpty}>
              <span><FiInbox aria-hidden="true" /></span>
              <h3>No pending submissions</h3>
              <p>New gift-card deposits will appear here for review.</p>
            </div>
          ) : (
            <div className={styles.giftcardGrid}>
              {giftcards.map((transaction) => {
                const metadata = transaction.metadata ?? {};
                const approveLoading = actionLoading === `${transaction.id}-approve`;
                const rejectLoading = actionLoading === `${transaction.id}-reject`;

                return (
                  <article key={transaction.id} className={styles.giftcardCard}>
                    <div className={styles.giftcardCardTop}>
                      <div className={styles.giftcardIcon}>
                        <FiGift aria-hidden="true" />
                      </div>
                      <div>
                        <span>Deposit request</span>
                        <strong>{metadata.cardType || "Gift card"}</strong>
                      </div>
                      <span className={styles.pendingBadge}>
                        <FiClock aria-hidden="true" />
                        Pending
                      </span>
                    </div>

                    <div className={styles.giftcardAmount}>
                      <span>Submitted amount</span>
                      <strong>
                        ${Number(transaction.amount ?? 0).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </strong>
                    </div>

                    <dl className={styles.giftcardDetails}>
                      <div>
                        <dt>Customer</dt>
                        <dd>{transaction.user?.email || "Unknown user"}</dd>
                      </div>
                      <div>
                        <dt>Card type</dt>
                        <dd>{metadata.cardType || "Not provided"}</dd>
                      </div>
                      {metadata.note && (
                        <div className={styles.noteRow}>
                          <dt>Customer note</dt>
                          <dd>{metadata.note}</dd>
                        </div>
                      )}
                    </dl>

                    <div className={styles.evidenceBlock}>
                      <div>
                        <FiImage aria-hidden="true" />
                        <span>Submitted evidence</span>
                      </div>
                      {metadata.image ? (
                        <img src={metadata.image} alt="Submitted gift-card evidence" />
                      ) : (
                        <div className={styles.noEvidence}>
                          <FiImage aria-hidden="true" />
                          No image provided
                        </div>
                      )}
                    </div>

                    <div className={styles.reviewActions}>
                      <button
                        type="button"
                        className={styles.approveButton}
                        onClick={() => takeAction(transaction.id, "approve")}
                        disabled={Boolean(actionLoading)}
                      >
                        {approveLoading ? <FiRefreshCw className={styles.spinning} /> : <FiCheck />}
                        {approveLoading ? "Approving" : "Approve"}
                      </button>

                      <button
                        type="button"
                        className={styles.rejectButton}
                        onClick={() => takeAction(transaction.id, "reject")}
                        disabled={Boolean(actionLoading)}
                      >
                        {rejectLoading ? <FiRefreshCw className={styles.spinning} /> : <FiX />}
                        {rejectLoading ? "Rejecting" : "Reject"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
