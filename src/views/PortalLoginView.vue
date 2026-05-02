<script setup>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { Wifi, Zap, Shield, Gauge, CreditCard, Lock, HelpCircle, Globe, Timer, Calendar, CalendarRange, CalendarDays, Star, Ticket, AlertTriangle, User, ArrowRight, X, Smartphone } from 'lucide-vue-next';

const route = useRoute();

const plans = [
        { id: '1h', name: '1 Hour',  amount: 10,   label: 'LITE ACCESS',     sub: 'Instant Activation', icon: 'timer',              featured: false },
    { id: '1d', name: '1 Day',   amount: 50,   label: 'DAILY PASS',      sub: 'Popular Choice',     icon: 'today',              featured: false },
    { id: '3d', name: '3 Days',  amount: 150,  label: 'WEEKEND BUNDLE',  sub: 'Great Value',        icon: 'date_range',         featured: false },
    { id: '7d', name: '7 Days',  amount: 300,  label: 'WEEKLY PRO',      sub: 'Heavy User',         icon: 'calendar_view_week', featured: false },
    { id: '1m', name: '1 Month', amount: 1000, label: 'ULTIMATE',        sub: 'Best Savings',       icon: 'star',               featured: true  },
];

const planIconMap = { timer: Timer, today: Calendar, date_range: CalendarRange, calendar_view_week: CalendarDays, star: Star };

const selectedPlan = ref(null);
const phoneNumber = ref('');
const submittingPayment = ref(false);
const paymentError = ref('');

const ticketUsername = ref('');
const ticketPassword = ref('');

const mac = computed(() => String(route.query.mac || ''));
const ip = computed(() => String(route.query.ip || ''));
const linkOrig = computed(() => String(route.query['link-orig'] || ''));
const linkLogin = computed(() => String(route.query['link-login'] || route.query['link-login-only'] || ''));

const canSubmitLogin = computed(() => !!linkLogin.value);

const openPlanPopup = (plan) => {
    paymentError.value = '';
    phoneNumber.value = '';
    selectedPlan.value = plan;
};

const closePlanPopup = () => {
    selectedPlan.value = null;
    paymentError.value = '';
    phoneNumber.value = '';
    submittingPayment.value = false;
};

const normalizePhoneNumber = (value) => {
    const cleaned = value.replace(/\s+/g, '');

    if (cleaned.startsWith('0')) {
        if (cleaned.length !== 10) {
            throw new Error("Phone numbers starting with '0' must have 10 digits.");
        }
        return `254${cleaned.slice(1)}`;
    }

    if (cleaned.startsWith('254')) {
        if (cleaned.length !== 12) {
            throw new Error("Phone numbers starting with '254' must have 12 digits.");
        }
        return cleaned;
    }

    throw new Error("Please enter a valid phone number starting with 0 or 254.");
};

const submitPortalLogin = () => {
    if (!canSubmitLogin.value) return;

    const params = new URLSearchParams({
        username: ticketUsername.value,
        password: ticketPassword.value,
        dst: 'https://uzanet.co.ke',
        popup: 'true',
    });

    window.location.href = `${linkLogin.value}?${params.toString()}`;
};

const submitPayment = async () => {
    if (!selectedPlan.value) return;

    paymentError.value = '';

    let processedPhoneNumber = '';
    try {
        processedPhoneNumber = normalizePhoneNumber(phoneNumber.value.trim());
    } catch (err) {
        paymentError.value = err.message;
        return;
    }

    if (!canSubmitLogin.value) {
        paymentError.value = 'Missing link-login query parameter. Unable to complete captive login.';
        return;
    }

    submittingPayment.value = true;

    try {
        const endpoint = `http://10.10.10.1:8083/stkpush/initiate?phone_number=${encodeURIComponent(processedPhoneNumber)}&amount=${selectedPlan.value.amount}`;

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phone_number: processedPhoneNumber }),
        });

        if (!response.ok) {
            throw new Error('Failed to initiate STK push.');
        }

        const data = await response.json();

        if (!data?.credentials?.username || !data?.credentials?.password) {
            throw new Error('Payment succeeded but no hotspot credentials were returned.');
        }

        ticketUsername.value = data.credentials.username;
        ticketPassword.value = data.credentials.password;

        closePlanPopup();
        submitPortalLogin();
    } catch (err) {
        paymentError.value = err.message || 'Unable to complete payment. Please try again.';
        submittingPayment.value = false;
    }
};
</script>

<template>
    <div class="portal-root">
        <!-- Sidebar: visible on large screens only -->
        <aside class="portal-sidebar">
            <div class="sidebar-content">
                <div class="sidebar-logo-row">
                    <Wifi :size="32" class="sidebar-wifi-icon" />
                    <span class="sidebar-brand-name">Uzanet Hotspot</span>
                </div>
                <h2 class="sidebar-heading">Fast.<br>Reliable.<br>Instant.</h2>
                <p class="sidebar-tagline">Get online in seconds. Pay easily with M-Pesa and browse at full speed — no fuss, no waiting.</p>
                <ul class="sidebar-features">
                    <li class="sidebar-feature">
                        <div class="sidebar-feature-icon-wrap">
                            <Zap :size="20" />
                        </div>
                        <span>Instant activation</span>
                    </li>
                    <li class="sidebar-feature">
                        <div class="sidebar-feature-icon-wrap">
                            <Shield :size="20" />
                        </div>
                        <span>Secure connection</span>
                    </li>
                    <li class="sidebar-feature">
                        <div class="sidebar-feature-icon-wrap">
                            <Gauge :size="20" />
                        </div>
                        <span>High-speed browsing</span>
                    </li>
                    <li class="sidebar-feature">
                        <div class="sidebar-feature-icon-wrap">
                            <CreditCard :size="20" />
                        </div>
                        <span>Easy M-Pesa payment</span>
                    </li>
                </ul>
                <div class="sidebar-trust">
                    <Lock :size="14" />
                    Secured by Uzanet &amp; M-Pesa
                </div>
            </div>
        </aside>

        <!-- Right pane: topbar + scrollable content + footer -->
        <div class="portal-right-pane">
            <!-- Top Bar -->
            <header class="portal-topbar">
                <div class="portal-topbar-inner">
                    <div class="topbar-brand">
                        <Wifi :size="22" class="topbar-wifi" />
                        <span class="topbar-title">Uzanet Hotspot</span>
                    </div>
                    <div class="topbar-actions">
                        <button class="topbar-icon-btn" type="button" aria-label="Help">
                            <HelpCircle :size="20" />
                        </button>
                        <button class="topbar-icon-btn" type="button" aria-label="Language">
                            <Globe :size="20" />
                        </button>
                    </div>
                </div>
            </header>

            <!-- Scrollable content -->
            <main class="portal-scroll-pane">
                <div class="portal-content-inner">
                    <!-- Hero Banner -->
                    <div class="hero-banner">
                        <div class="hero-text">
                            <h1 class="hero-heading">Welcome Back</h1>
                            <p class="hero-sub">Experience high-velocity browsing.</p>
                        </div>
                    </div>

                    <!-- M-Pesa Plans Section -->
                    <section class="portal-section">
                        <div class="section-header">
                            <CreditCard :size="20" class="section-icon" />
                            <h2 class="section-title">Choose option to pay with M-Pesa</h2>
                        </div>
                        <div class="plan-list">
                            <button
                                v-for="plan in plans"
                                :key="plan.id"
                                type="button"
                                class="plan-row"
                                :class="{ 'plan-row--featured': plan.featured }"
                                @click="openPlanPopup(plan)"
                            >
                                <div class="plan-icon-wrap" :class="{ 'plan-icon-wrap--featured': plan.featured }">
                                    <component :is="planIconMap[plan.icon]" :size="22" />
                                </div>
                                <div class="plan-info">
                                    <p class="plan-label" :class="{ 'plan-label--featured': plan.featured }">{{ plan.label }}</p>
                                    <p class="plan-name">{{ plan.name }}</p>
                                </div>
                                <div class="plan-pricing">
                                    <p class="plan-price">Ksh. {{ plan.amount }}</p>
                                    <p class="plan-sub" :class="{ 'plan-sub--featured': plan.featured }">{{ plan.sub }}</p>
                                </div>
                            </button>
                        </div>
                    </section>

                    <!-- OR Divider -->
                    <div class="or-divider">
                        <div class="or-line"></div>
                        <span class="or-text">OR</span>
                        <div class="or-line"></div>
                    </div>

                    <!-- Ticket Login Section -->
                    <section class="ticket-card">
                        <div class="ticket-card-header">
                            <Ticket :size="22" class="ticket-icon" />
                            <h2 class="section-title">Login with ticket</h2>
                        </div>

                        <p v-if="!canSubmitLogin" class="portal-warning">
                            <AlertTriangle :size="18" class="warn-icon" />
                            Missing required query parameter: link-login.
                        </p>

                        <form @submit.prevent="submitPortalLogin" class="ticket-form">
                            <div class="form-group">
                                <label for="portal-username" class="form-label">USERNAME</label>
                                <div class="input-wrap">
                                    <User :size="18" class="input-icon-ms" />
                                    <input
                                        id="portal-username"
                                        v-model="ticketUsername"
                                        type="text"
                                        name="username"
                                        placeholder="Enter ticket number"
                                        class="form-input"
                                        required
                                    />
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="portal-password" class="form-label">PASSWORD</label>
                                <div class="input-wrap">
                                    <Lock :size="18" class="input-icon-ms" />
                                    <input
                                        id="portal-password"
                                        v-model="ticketPassword"
                                        type="password"
                                        name="password"
                                        placeholder="••••••••"
                                        class="form-input"
                                        required
                                    />
                                </div>
                            </div>

                            <button type="submit" class="login-btn" :disabled="!canSubmitLogin">
                                Log In
                                <ArrowRight :size="18" />
                            </button>
                        </form>
                        <p class="ticket-recover">Lost your ticket? <a href="#" class="recover-link">Recover access</a></p>
                    </section>
                </div>
            </main>

            <!-- Footer -->
            <footer class="portal-footer">
                <div class="footer-inner">
                    <div class="footer-links">
                        <a href="#" class="footer-link">Terms of Service</a>
                        <a href="#" class="footer-link">Privacy Policy</a>
                        <a href="#" class="footer-link">Contact Support</a>
                    </div>
                    <p class="footer-copy">© 2024 Uzanet Hotspot. Powered by Velocity.</p>
                    <div v-if="mac || ip" class="footer-meta">
                        <span v-if="mac"><strong>MAC:</strong> {{ mac }}</span>
                        <span v-if="ip"><strong>IP:</strong> {{ ip }}</span>
                    </div>
                </div>
            </footer>
        </div>

        <!-- Payment Modal -->
        <Transition name="modal">
            <div v-if="selectedPlan" class="modal-overlay" @click.self="closePlanPopup">
                <div class="modal-card">
                    <div class="modal-header">
                        <button type="button" class="modal-close" @click="closePlanPopup" aria-label="Close">
                            <X :size="20" />
                        </button>
                        <div class="modal-hero">
                            <div class="modal-bolt">
                                <Zap :size="28" class="modal-bolt-icon" />
                            </div>
                            <h3 class="modal-title">Ksh.{{ selectedPlan.amount }} for {{ selectedPlan.name }}</h3>
                            <p class="modal-subtitle">Instant high-speed internet access</p>
                        </div>
                    </div>

                    <div class="modal-body">
                        <div class="modal-field">
                            <label class="form-label">M-PESA NUMBER</label>
                            <div class="input-wrap">
                                <Smartphone :size="18" class="input-icon-ms" />
                                <input
                                    v-model="phoneNumber"
                                    type="tel"
                                    placeholder="07XX XXX XXX"
                                    class="form-input"
                                    :disabled="submittingPayment"
                                />
                            </div>
                            <p class="field-hint">Enter your M-Pesa phone number to pay</p>
                        </div>

                        <div class="summary-grid">
                            <div class="summary-cell">
                                <p class="summary-label">Duration</p>
                                <p class="summary-value">{{ selectedPlan.id === '1h' ? '60 Minutes' : selectedPlan.name }}</p>
                            </div>
                            <div class="summary-cell">
                                <p class="summary-label">Speed</p>
                                <p class="summary-value">Unlimited</p>
                            </div>
                        </div>

                        <p v-if="paymentError" class="modal-error">{{ paymentError }}</p>

                        <div class="modal-actions">
                            <button type="button" class="pay-btn" :disabled="submittingPayment" @click="submitPayment">
                                <span v-if="submittingPayment" class="btn-loader" aria-hidden="true"></span>
                                {{ submittingPayment ? 'Submitting...' : 'Submit Payment' }}
                                <ArrowRight v-if="!submittingPayment" :size="18" />
                            </button>
                            <button type="button" class="cancel-btn" @click="closePlanPopup">
                                Cancel and go back
                            </button>
                        </div>
                    </div>

                    <div class="modal-trust">
                        <Lock :size="14" class="trust-icon" />
                        <span class="trust-text">SECURE MPESA GATEWAY</span>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<style scoped>
/* ── Root ─────────────────────────────────────── */
.portal-root {
    min-height: 100vh;
    background: #f8f9ff;
    font-family: 'Inter', sans-serif;
    color: #0b1c30;
    display: flex;
    flex-direction: column;
}

/* ── Sidebar (hidden on mobile) ───────────────── */
.portal-sidebar { display: none; }

/* ── Right pane ───────────────────────────────── */
.portal-right-pane {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
}

/* ── Top Bar ──────────────────────────────────── */
.portal-topbar {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 50;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid #f1f5f9;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}
.portal-topbar-inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 64px;
    padding: 0 24px;
    max-width: 480px;
    margin: 0 auto;
}
.topbar-brand {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: 'Manrope', sans-serif;
    font-size: 1.2rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: #0f172a;
}
.topbar-wifi { color: #2563eb; }
.topbar-actions { display: flex; gap: 12px; }
.topbar-icon-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: #64748b;
    padding: 4px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    transition: color 0.15s;
}
.topbar-icon-btn:hover { color: #2563eb; }

/* ── Main (scroll pane) ───────────────────────── */
.portal-scroll-pane {
    flex: 1;
    display: flex;
    flex-direction: column;
}
.portal-content-inner {
    padding: 88px 24px 48px;
    max-width: 480px;
    margin: 0 auto;
    width: 100%;
    box-sizing: border-box;
    flex: 1;
}

/* ── Hero ─────────────────────────────────────── */
.hero-banner {
    margin-bottom: 32px;
    border-radius: 12px;
    overflow: hidden;
    height: 160px;
    position: relative;
    display: flex;
    align-items: flex-end;
    padding: 24px;
    background: linear-gradient(135deg, #0f2a5e 0%, #0a4a6e 40%, #0d7a8e 70%, #0b6a7a 100%);
}
.hero-banner::after {
    content: '';
    position: absolute;
    inset: 0;
    background:
        radial-gradient(ellipse at 60% 40%, rgba(56, 189, 248, 0.3) 0%, transparent 70%),
        radial-gradient(ellipse at 20% 80%, rgba(37, 99, 235, 0.2) 0%, transparent 60%);
}
.hero-text { position: relative; z-index: 1; color: #fff; }
.hero-heading {
    font-family: 'Manrope', sans-serif;
    font-size: 2rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.2;
    margin: 0;
}
.hero-sub { font-size: 0.875rem; opacity: 0.9; margin: 2px 0 0; }

/* ── Section header ───────────────────────────── */
.portal-section { margin-bottom: 32px; }
.section-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
}
.section-icon { color: #004cca; }
.section-title {
    font-family: 'Manrope', sans-serif;
    font-size: 1.1rem;
    font-weight: 700;
    letter-spacing: -0.01em;
    margin: 0;
}

/* ── Plan List ────────────────────────────────── */
.plan-list { display: flex; flex-direction: column; gap: 10px; }
.plan-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    background: #fff;
    border: 1px solid rgba(194, 198, 217, 0.4);
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    cursor: pointer;
    text-align: left;
    gap: 0;
    transition: box-shadow 0.15s, transform 0.1s;
    width: 100%;
}
.plan-row:hover { box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08); }
.plan-row:active { transform: scale(0.98); }
.plan-row--featured {
    border-color: rgba(0, 76, 202, 0.25);
    background: rgba(0, 98, 255, 0.03);
    box-shadow: 0 2px 12px rgba(0, 76, 202, 0.08), inset 0 0 0 1px rgba(0, 76, 202, 0.08);
}
.plan-icon-wrap {
    width: 48px;
    height: 48px;
    border-radius: 10px;
    background: #e5eeff;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #004cca;
    flex-shrink: 0;
    margin-right: 16px;
}
.plan-icon-wrap--featured { background: #0062ff; color: #fff; }
.plan-info { flex: 1; text-align: left; }
.plan-label {
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: #565e74;
    margin: 0 0 2px;
}
.plan-label--featured { color: #004cca; }
.plan-name {
    font-family: 'Manrope', sans-serif;
    font-size: 1.1rem;
    font-weight: 700;
    color: #0b1c30;
    margin: 0;
}
.plan-pricing { text-align: right; flex-shrink: 0; }
.plan-price {
    font-family: 'Manrope', sans-serif;
    font-size: 1.1rem;
    font-weight: 700;
    color: #004cca;
    margin: 0 0 2px;
}
.plan-sub { font-size: 0.75rem; color: #565e74; margin: 0; }
.plan-sub--featured { color: #004cca; font-weight: 600; }

/* ── OR Divider ───────────────────────────────── */
.or-divider {
    display: flex;
    align-items: center;
    gap: 16px;
    margin: 0 0 32px;
    opacity: 0.35;
}
.or-line { flex: 1; height: 1px; background: #737687; }
.or-text {
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: #0b1c30;
}

/* ── Ticket Card ──────────────────────────────── */
.ticket-card {
    background: #fff;
    border: 1px solid rgba(194, 198, 217, 0.4);
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}
.ticket-card-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 20px;
}
.ticket-icon { color: #565e74; }
.ticket-form { display: flex; flex-direction: column; gap: 16px; }

/* ── Form shared ──────────────────────────────── */
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-label {
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: #424656;
}
.input-wrap { position: relative; }
.input-icon-ms {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: #737687;
    pointer-events: none;
    display: flex;
}
.form-input {
    width: 100%;
    height: 48px;
    padding: 0 16px 0 44px;
    border: 1px solid #c2c6d9;
    border-radius: 8px;
    font-size: 0.95rem;
    font-family: 'Inter', sans-serif;
    color: #0b1c30;
    background: #f8f9ff;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
    box-sizing: border-box;
}
.form-input:focus {
    border-color: #004cca;
    box-shadow: 0 0 0 3px rgba(0, 76, 202, 0.12);
}
.form-input:disabled { opacity: 0.6; cursor: not-allowed; }

/* ── Login Button ─────────────────────────────── */
.login-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    height: 56px;
    background: linear-gradient(180deg, #0062ff 0%, #004cca 100%);
    color: #fff;
    border: none;
    border-radius: 10px;
    font-family: 'Manrope', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 8px 24px rgba(0, 76, 202, 0.2);
    transition: transform 0.1s, box-shadow 0.15s;
    margin-top: 8px;
}
.login-btn:hover { box-shadow: 0 12px 28px rgba(0, 76, 202, 0.3); }
.login-btn:active { transform: scale(0.98); }
.login-btn:disabled { opacity: 0.6; cursor: not-allowed; }

/* ── Warning / Recover ────────────────────────── */
.portal-warning {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #fff3e8;
    border: 1px solid #f1cfaa;
    border-radius: 8px;
    padding: 12px;
    color: #a54811;
    font-size: 0.875rem;
    margin-bottom: 16px;
}
.warn-icon { flex-shrink: 0; }
.ticket-recover {
    margin-top: 16px;
    text-align: center;
    font-size: 0.875rem;
    color: #424656;
}
.recover-link { color: #004cca; font-weight: 600; text-decoration: underline; }

/* ── Footer ───────────────────────────────────── */
.portal-footer { border-top: 1px solid #f1f5f9; }
.footer-inner {
    max-width: 480px;
    margin: 0 auto;
    padding: 32px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    text-align: center;
}
.footer-links { display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; }
.footer-link { font-size: 0.75rem; color: #64748b; text-decoration: none; transition: color 0.15s; }
.footer-link:hover { color: #0f172a; }
.footer-copy { font-size: 0.75rem; color: #94a3b8; margin: 0; }
.footer-meta { font-size: 0.8rem; color: #424656; display: flex; gap: 16px; flex-wrap: wrap; justify-content: center; }

/* ── Modal ────────────────────────────────────── */
.modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 60;
    background: rgba(11, 28, 48, 0.45);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
}
.modal-card {
    background: #fff;
    width: 100%;
    max-width: 400px;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 24px 48px rgba(0, 0, 0, 0.18);
    animation: card-in 0.2s ease;
}
@keyframes card-in {
    from { transform: scale(0.95) translateY(8px); opacity: 0; }
    to   { transform: scale(1) translateY(0);      opacity: 1; }
}
.modal-header {
    position: relative;
    padding: 24px;
    border-bottom: 1px solid #e5eeff;
}
.modal-close {
    position: absolute;
    top: 14px; right: 14px;
    background: none;
    border: none;
    cursor: pointer;
    color: #737687;
    padding: 4px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    transition: color 0.15s;
}
.modal-close:hover { color: #0b1c30; }
.modal-hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 8px;
}
.modal-bolt {
    width: 52px;
    height: 52px;
    background: rgba(0, 98, 255, 0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 4px;
}
.modal-bolt-icon {
    color: #004cca;
}
.modal-title {
    font-family: 'Manrope', sans-serif;
    font-size: 1.2rem;
    font-weight: 700;
    color: #0b1c30;
    margin: 0;
}
.modal-subtitle { font-size: 0.875rem; color: #424656; margin: 0; }
.modal-body { padding: 24px; display: flex; flex-direction: column; gap: 16px; }
.modal-field { display: flex; flex-direction: column; gap: 6px; }
.field-hint { font-size: 0.8rem; color: #424656; margin: 0; padding: 0 4px; }
.summary-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.summary-cell {
    background: #eff4ff;
    border: 1px solid #dce9ff;
    border-radius: 8px;
    padding: 12px;
}
.summary-label {
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: #737687;
    margin: 0 0 2px;
}
.summary-value { font-size: 0.95rem; font-weight: 600; color: #0b1c30; margin: 0; }
.modal-error {
    color: #ba1a1a;
    background: #ffdad6;
    border: 1px solid #ffb4ab;
    border-radius: 8px;
    padding: 10px 14px;
    font-size: 0.875rem;
    margin: 0;
}
.modal-actions { display: flex; flex-direction: column; gap: 10px; }
.pay-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    height: 56px;
    background: linear-gradient(180deg, #0062ff 0%, #004cca 100%);
    color: #fff;
    border: none;
    border-radius: 10px;
    font-family: 'Manrope', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 8px 20px rgba(0, 76, 202, 0.2);
    transition: transform 0.1s, box-shadow 0.15s;
}
.pay-btn:hover { box-shadow: 0 12px 28px rgba(0, 76, 202, 0.3); }
.pay-btn:active { transform: scale(0.98); }
.pay-btn:disabled { opacity: 0.7; cursor: not-allowed; }
.cancel-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: #737687;
    font-size: 0.875rem;
    font-weight: 600;
    padding: 8px;
    border-radius: 6px;
    transition: color 0.15s, background 0.15s;
    letter-spacing: 0.01em;
}
.cancel-btn:hover { color: #0b1c30; background: #f1f5f9; }
.modal-trust {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 16px;
    opacity: 0.5;
}
.trust-icon { display: flex; }
.trust-text {
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
}

/* ── Spinner ──────────────────────────────────── */
.btn-loader {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.4);
    border-top-color: #fff;
    display: inline-block;
    animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Modal Transition ─────────────────────────── */
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }

/* ── Sidebar (desktop) ────────────────────────── */
.sidebar-content {
    padding: 48px 40px;
    color: #fff;
    display: flex;
    flex-direction: column;
    gap: 28px;
    width: 100%;
    position: relative;
    z-index: 1;
}
.sidebar-logo-row { display: flex; align-items: center; gap: 10px; }
.sidebar-wifi-icon { color: #7dd3fc; }
.sidebar-brand-name {
    font-family: 'Manrope', sans-serif;
    font-size: 1.3rem;
    font-weight: 800;
    letter-spacing: -0.02em;
}
.sidebar-heading {
    font-family: 'Manrope', sans-serif;
    font-size: 2.6rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1.15;
    margin: 0;
}
.sidebar-tagline {
    font-size: 0.95rem;
    line-height: 1.65;
    color: rgba(255, 255, 255, 0.72);
    margin: 0;
}
.sidebar-features {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
}
.sidebar-feature {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 0.95rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.88);
}
.sidebar-feature-icon-wrap {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.12);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}
.sidebar-trust {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.4);
    margin-top: auto;
}

/* ── Responsive ───────────────────────────────── */
@media (min-width: 640px) {
    .portal-content-inner,
    .portal-topbar-inner,
    .footer-inner { max-width: 560px; }
}

@media (min-width: 1024px) {
    /* Root becomes a side-by-side row */
    .portal-root {
        flex-direction: row;
        height: 100vh;
        overflow: hidden;
    }

    /* Sidebar fills full viewport height */
    .portal-sidebar {
        display: flex;
        flex: 1;
        min-width: 0;
        background: linear-gradient(160deg, #0f2a5e 0%, #0a4a6e 50%, #0d7a8e 100%);
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
    }
    .portal-sidebar::before {
        content: '';
        position: absolute;
        inset: 0;
        background:
            radial-gradient(ellipse at 70% 25%, rgba(56, 189, 248, 0.25) 0%, transparent 60%),
            radial-gradient(ellipse at 25% 75%, rgba(37, 99, 235, 0.2) 0%, transparent 55%);
        pointer-events: none;
    }

    /* Right pane fills remaining width */
    .portal-right-pane {
        flex: 1;
        min-width: 0;
        overflow: hidden;
    }

    /* Topbar is inline (not fixed) within the right pane */
    .portal-topbar {
        position: relative;
        top: auto; left: auto; right: auto;
    }
    .portal-topbar-inner {
        max-width: none;
        padding: 0 48px;
    }

    /* Scrollable content */
    .portal-scroll-pane {
        flex: 1;
        overflow-y: auto;
        min-height: 0;
    }
    .portal-content-inner {
        padding: 48px 64px;
        max-width: 620px;
        margin: 0 auto;
    }

    /* Hero banner not needed — sidebar covers branding */
    .hero-banner { display: none; }

    /* Footer sits at the bottom of the right pane */
    .portal-footer { flex-shrink: 0; }
    .footer-inner {
        max-width: none;
        padding: 16px 48px;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        text-align: left;
        gap: 24px;
    }
    .footer-links { gap: 24px; justify-content: flex-start; }
}
</style>
