@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap');

/* =========================================
   PALETTE INSPIRÉE DU LOGO SHOOTPRO
   Noir profond + Blanc pur + Cuivre/Bronze
   Bleu-Marine + Argent
   ========================================= */
:root {
  --black: #000000;
  --black-rich: #080809;
  --black-card: #0e0e12;
  --black-border: #1a1a22;
  --white: #FFFFFF;
  --white-muted: #C0C0C8;
  --copper: #C1784F;
  --copper-dark: #8B4513;
  --bronze: #CD7F32;
  --gold: #D4AF37;
  --gold-light: #F8E5BA;
  --silver: #B8BCC8;
  --navy: #1B2A4A;
  --navy-light: #243557;

  /* Gradients */
  --grad-copper: linear-gradient(135deg, #C1784F 0%, #D4AF37 50%, #C1784F 100%);
  --grad-dark: linear-gradient(180deg, #080809 0%, #0e0e12 100%);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Inter', sans-serif;
  background-color: var(--black-rich);
  color: var(--white);
  -webkit-font-smoothing: antialiased;
}

h1,
h2,
h3,
h4 {
  font-family: 'Playfair Display', serif;
  color: var(--white);
  letter-spacing: 0.02em;
}

/* Glassmorphism card */
.glass-panel {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(193, 120, 79, 0.15);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

/* Copper-Gold gradient button (Primary) */
.btn-gold {
  background: var(--grad-copper);
  color: var(--black);
  border: none;
  font-weight: 700;
  border-radius: 8px;
  padding: 12px 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.btn-gold:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(193, 120, 79, 0.5);
  filter: brightness(1.1);
}

/* Secondary outline button */
.btn-outline {
  background: transparent;
  color: var(--copper);
  border: 1px solid var(--copper);
  font-weight: 600;
  border-radius: 8px;
  padding: 12px 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  letter-spacing: 0.08em;
}

.btn-outline:hover {
  background: rgba(193, 120, 79, 0.12);
  transform: translateY(-2px);
}

/* Custom inputs */
input,
select,
textarea {
  font-family: 'Inter', sans-serif;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(193, 120, 79, 0.25);
  color: var(--white);
  border-radius: 8px;
  padding: 12px;
  transition: border-color 0.3s;
  font-size: 14px;
}

input::placeholder,
textarea::placeholder {
  color: #555;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: var(--copper);
  box-shadow: 0 0 0 3px rgba(193, 120, 79, 0.15);
}

option {
  background: var(--black-card);
}

/* Divider */
.divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(193, 120, 79, 0.3), transparent);
  margin: 32px 0;
}

/* Badge */
.badge-copper {
  background: rgba(193, 120, 79, 0.15);
  color: var(--copper);
  border: 1px solid rgba(193, 120, 79, 0.3);
  border-radius: 20px;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.badge-navy {
  background: rgba(27, 42, 74, 0.4);
  color: var(--silver);
  border: 1px solid rgba(184, 188, 200, 0.2);
  border-radius: 20px;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 600;
}

/* Section container */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px;
}

/* Copper accent line */
.accent-line {
  width: 60px;
  height: 3px;
  background: var(--grad-copper);
  border-radius: 2px;
  margin: 12px 0 24px 0;
}

/* Scroll bar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: var(--black-rich);
}

::-webkit-scrollbar-thumb {
  background: var(--navy);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--copper);
}

/* Fade in animation */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeInUp 0.6s ease both;
}