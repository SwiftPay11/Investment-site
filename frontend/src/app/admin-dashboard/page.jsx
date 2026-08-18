"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiActivity,
  FiArrowRight,
  FiDollarSign,
  FiGift,
  FiGrid,
  FiLock,
  FiPlus,
  FiRefreshCw,
  FiRotateCcw,
  FiShield,
  FiTrash2,
  FiUnlock,
  FiUserCheck,
  FiUsers,
} from "react-icons/fi";
import styles from "./admin-dashboard.module.css";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [amounts, setAmounts] = useState({}); // per-user reverse amount
  const [loading, setLoading] = useState(null); // store current loading key (e.g. `${id}-fund`)
  const [usersLoading, setUsersLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const isAdmin = sessionStorage.getItem("isAdmin");
    if (!isAdmin) router.push("/admin-login");
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ============================================
  // Fetch users (handles several response shapes)
  // ============================================
  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const res = await fetch("https://investment-site-x6tr.onrender.com/users/all");
      const data = await res.json();

      const usersArray = Array.isArray(data)
        ? data
        : Array.isArray(data.users)
        ? data.users
        : [];

      setUsers(usersArray);
    } catch (err) {
      console.error("Failed to load users:", err);
      setUsers([]);
    } finally {
      setUsersLoading(false);
    }
  };

  // ============================================
  // Reverse Payment (existing)
  // ============================================
  const handleReverse = async (userId) => {
    const amount = amounts[userId];
    if (!amount || Number(amount) <= 0) return alert("Enter a valid amount");

    setLoading(`${userId}-reverse`);
    try {
      const res = await fetch("https://investment-site-x6tr.onrender.com/users/admin/reverse-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminEmail: "admin@nexttrade.com",
          adminPassword: "admin123",
          userId,
          amount: Number(amount),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert("✅ Payment reversed successfully and refund email sent!");
        fetchUsers();
      } else {
        alert("❌ Failed: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Reverse error:", err);
      alert("❌ An error occurred while reversing payment.");
    } finally {
      setLoading(null);
    }
  };

  // ============================================
  // FUND user
  // (POST /auth/admin/fund) body: { email, amount }
  // ============================================
  const fundUser = async (email) => {
    const amt = prompt("Enter amount to FUND user:");
    if (!amt || Number(amt) <= 0) return;

    setLoading(`${email}-fund`);
    try {
      const res = await fetch("https://investment-site-x6tr.onrender.com/auth/admin/fund", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, amount: Number(amt) }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ User funded successfully!");
        fetchUsers();
      } else {
        alert("❌ Funding failed: " + (data?.message || JSON.stringify(data)));
      }
    } catch (err) {
      console.error("Fund error:", err);
      alert("❌ Error funding user.");
    } finally {
      setLoading(null);
    }
  };

  // ============================================
  // RESET BALANCE
  // (POST /auth/admin/reset-balance) body: { email }
  // ============================================
  const resetBalance = async (email) => {
    if (!confirm("Are you sure you want to RESET this user's balance?")) return;

    setLoading(`${email}-reset`);
    try {
      const res = await fetch("https://investment-site-x6tr.onrender.com/auth/admin/reset-balance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Balance reset successfully!");
        fetchUsers();
      } else {
        alert("❌ Reset failed: " + (data?.message || JSON.stringify(data)));
      }
    } catch (err) {
      console.error("Reset error:", err);
      alert("❌ Error resetting balance.");
    } finally {
      setLoading(null);
    }
  };

  // ============================================
  // RESTRICT / UNRESTRICT USER
  // (POST /auth/admin/restrict) body: { email, restricted }
  // ============================================
  const restrictUser = async (email, restricted) => {
    setLoading(`${email}-restrict`);
    try {
      const res = await fetch("https://investment-site-x6tr.onrender.com/auth/admin/restrict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, restricted }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(`✅ User ${restricted ? "restricted" : "unrestricted"} successfully!`);
        fetchUsers();
      } else {
        alert("❌ Restriction failed: " + (data?.message || JSON.stringify(data)));
      }
    } catch (err) {
      console.error("Restrict error:", err);
      alert("❌ Error updating restriction.");
    } finally {
      setLoading(null);
    }
  };

  // ============================================
  // DELETE USER
  // (DELETE /auth/admin/delete/:email)
  // ============================================
  const deleteUser = async (email) => {
    if (!confirm("Are you sure you want to DELETE this user?")) return;

    setLoading(`${email}-delete`);
    try {
      const res = await fetch(`https://investment-site-x6tr.onrender.com/auth/admin/delete/${encodeURIComponent(email)}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ User deleted successfully!");
        fetchUsers();
      } else {
        alert("❌ Delete failed: " + (data?.message || JSON.stringify(data)));
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("❌ Error deleting user.");
    } finally {
      setLoading(null);
    }
  };

  // ============================================
  // RENDER UI
  // ============================================
  const totalBalance = users.reduce(
    (sum, user) => sum + Number(user.balance ?? 0),
    0
  );
  const restrictedUsers = users.filter((user) => Boolean(user.restricted)).length;
  const activeUsers = Math.max(0, users.length - restrictedUsers);

  const formatMoney = (value) =>
    Number(value ?? 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

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

      <div className={styles.adminLayout}>
        <aside className={styles.adminSidebar}>
          <nav aria-label="Admin navigation">
            <p>Management</p>
            <button type="button" className={styles.navActive}>
              <FiGrid aria-hidden="true" />
              <span>Overview</span>
            </button>
            <button type="button" onClick={() => router.push("/admin-dashboard/giftcards")}>
              <FiGift aria-hidden="true" />
              <span>Gift cards</span>
              <FiArrowRight aria-hidden="true" />
            </button>
          </nav>

          <div className={styles.sidebarStatus}>
            <FiShield aria-hidden="true" />
            <div>
              <strong>Admin session</strong>
              <span>Secure access enabled</span>
            </div>
          </div>
        </aside>

        <main className={styles.adminMain}>
          <div className={styles.pageHeading}>
            <div>
              <span className={styles.eyebrow}>Control center</span>
              <h1>Admin dashboard</h1>
              <p>Monitor users, balances, access, and payment adjustments.</p>
            </div>

            <div className={styles.headingActions}>
              <button
                type="button"
                className={styles.giftcardButton}
                onClick={() => router.push("/admin-dashboard/giftcards")}
              >
                <FiGift aria-hidden="true" />
                Gift cards
              </button>
              <button
                type="button"
                className={styles.refreshButton}
                onClick={fetchUsers}
                disabled={usersLoading}
              >
                <FiRefreshCw className={usersLoading ? styles.spinning : ""} aria-hidden="true" />
                Refresh
              </button>
            </div>
          </div>

          <section className={styles.adminMetrics} aria-label="User summary">
            <article>
              <span className={`${styles.metricIcon} ${styles.metricBlue}`}>
                <FiUsers aria-hidden="true" />
              </span>
              <div>
                <small>Total users</small>
                <strong>{users.length}</strong>
                <p>Registered profiles</p>
              </div>
            </article>

            <article>
              <span className={`${styles.metricIcon} ${styles.metricGreen}`}>
                <FiDollarSign aria-hidden="true" />
              </span>
              <div>
                <small>Combined balance</small>
                <strong>${formatMoney(totalBalance)}</strong>
                <p>Across all wallets</p>
              </div>
            </article>

            <article>
              <span className={`${styles.metricIcon} ${styles.metricPurple}`}>
                <FiUserCheck aria-hidden="true" />
              </span>
              <div>
                <small>Active users</small>
                <strong>{activeUsers}</strong>
                <p>Accounts with access</p>
              </div>
            </article>

            <article>
              <span className={`${styles.metricIcon} ${styles.metricAmber}`}>
                <FiLock aria-hidden="true" />
              </span>
              <div>
                <small>Restricted</small>
                <strong>{restrictedUsers}</strong>
                <p>Limited accounts</p>
              </div>
            </article>
          </section>

          <section className={styles.usersPanel}>
            <div className={styles.panelHeader}>
              <div>
                <span className={styles.panelEyebrow}>User management</span>
                <h2>Customer accounts</h2>
                <p>Review account details and perform administrative actions.</p>
              </div>
              <span className={styles.recordCount}>{users.length} records</span>
            </div>

            <div className={styles.tableWrap}>
              <table className={styles.usersTable}>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Account</th>
                    <th>Balance</th>
                    <th>Status</th>
                    <th>Account actions</th>
                    <th>Reverse payment</th>
                  </tr>
                </thead>

                <tbody>
                  {usersLoading && users.length === 0 ? (
                    <tr className={styles.tableMessage}>
                      <td colSpan="6">
                        <FiRefreshCw className={styles.spinning} aria-hidden="true" />
                        Loading customer accounts…
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr className={styles.tableMessage}>
                      <td colSpan="6">
                        <FiUsers aria-hidden="true" />
                        No users found
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => {
                      const id = user.id;
                      const fullname = user.fullname || user.name || "—";
                      const email = user.email || "";
                      const account = user.accountNumber || email || "—";
                      const balance = Number(user.balance ?? 0);
                      const restricted = Boolean(user.restricted);

                      return (
                        <tr key={id ?? email}>
                          <td data-label="User">
                            <div className={styles.userCell}>
                              <span>{fullname?.[0]?.toUpperCase() || "U"}</span>
                              <div>
                                <strong>{fullname}</strong>
                                <small>{email}</small>
                              </div>
                            </div>
                          </td>

                          <td data-label="Account">
                            <span className={styles.accountNumber}>{account}</span>
                          </td>

                          <td data-label="Balance">
                            <strong className={styles.balance}>${formatMoney(balance)}</strong>
                          </td>

                          <td data-label="Status">
                            <span className={restricted ? styles.restrictedBadge : styles.activeBadge}>
                              <i aria-hidden="true" />
                              {restricted ? "Restricted" : "Active"}
                            </span>
                          </td>

                          <td data-label="Account actions" className={styles.actionsCell}>
                            <div className={styles.accountActions}>
                              <button
                                type="button"
                                className={styles.fundAction}
                                onClick={() => fundUser(email)}
                                disabled={loading === `${email}-fund`}
                                title="Fund user"
                              >
                                {loading === `${email}-fund` ? <FiRefreshCw className={styles.spinning} /> : <FiPlus />}
                                <span>Fund</span>
                              </button>

                              <button
                                type="button"
                                className={styles.resetAction}
                                onClick={() => resetBalance(email)}
                                disabled={loading === `${email}-reset`}
                                title="Reset balance"
                              >
                                {loading === `${email}-reset` ? <FiRefreshCw className={styles.spinning} /> : <FiRotateCcw />}
                                <span>Reset</span>
                              </button>

                              <button
                                type="button"
                                className={styles.restrictAction}
                                onClick={() => restrictUser(email, !restricted)}
                                disabled={loading === `${email}-restrict`}
                                title={restricted ? "Unrestrict user" : "Restrict user"}
                              >
                                {loading === `${email}-restrict` ? (
                                  <FiRefreshCw className={styles.spinning} />
                                ) : restricted ? (
                                  <FiUnlock />
                                ) : (
                                  <FiLock />
                                )}
                                <span>{restricted ? "Unrestrict" : "Restrict"}</span>
                              </button>

                              <button
                                type="button"
                                className={styles.deleteAction}
                                onClick={() => deleteUser(email)}
                                disabled={loading === `${email}-delete`}
                                title="Delete user"
                              >
                                {loading === `${email}-delete` ? <FiRefreshCw className={styles.spinning} /> : <FiTrash2 />}
                                <span>Delete</span>
                              </button>
                            </div>
                          </td>

                          <td data-label="Reverse payment" className={styles.reverseCell}>
                            <div className={styles.reverseForm}>
                              <label>
                                <span className={styles.currencyPrefix}>$</span>
                                <input
                                  type="number"
                                  min="0"
                                  inputMode="decimal"
                                  aria-label={`Reverse payment amount for ${fullname}`}
                                  placeholder="Amount"
                                  value={amounts[id] ?? ""}
                                  onChange={(event) =>
                                    setAmounts({ ...amounts, [id]: event.target.value })
                                  }
                                />
                              </label>
                              <button
                                type="button"
                                onClick={() => handleReverse(id)}
                                disabled={loading === `${id}-reverse`}
                              >
                                {loading === `${id}-reverse` ? (
                                  <FiRefreshCw className={styles.spinning} />
                                ) : (
                                  <FiActivity />
                                )}
                                {loading === `${id}-reverse` ? "Reversing" : "Reverse"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
