/* =============================================
   有限会社北国ジョンソンボイラ — script.js
   ============================================= */

'use strict';

/* JS が有効なときだけ reveal アニメーションを適用 */
document.body.classList.add('js-loaded');

/* ---- DOM 要素 ---- */
const header    = document.getElementById('header');
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

/* =============================================
   ハンバーガーメニュー
   ============================================= */
hamburger.addEventListener('click', () => {
  const isOpen = mobileNav.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
  hamburger.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
});

/* ナビリンクをタップしたらドロワーを閉じる */
mobileNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'メニューを開く');
  });
});

/* =============================================
   スクロール時のヘッダー影
   ============================================= */
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 8);
}, { passive: true });

/* =============================================
   採用情報アコーディオン
   ============================================= */
const recruitToggle = document.getElementById('recruitToggle');
const recruitDetail = document.getElementById('recruitDetail');

if (recruitToggle && recruitDetail) {
  recruitToggle.addEventListener('click', () => {
    const isOpen = recruitDetail.classList.toggle('open');
    recruitToggle.classList.toggle('open', isOpen);
    recruitToggle.setAttribute('aria-expanded', String(isOpen));
    recruitToggle.textContent = '';
    const label = document.createTextNode(isOpen ? '採用情報を閉じる' : '採用情報の詳細を見る');
    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icon.setAttribute('class', 'recruit-toggle-icon');
    icon.setAttribute('viewBox', '0 0 24 24');
    icon.setAttribute('fill', 'currentColor');
    icon.setAttribute('width', '18');
    icon.setAttribute('height', '18');
    icon.setAttribute('aria-hidden', 'true');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M7 10l5 5 5-5z');
    icon.appendChild(path);
    recruitToggle.appendChild(label);
    recruitToggle.appendChild(icon);
  });
}

/* =============================================
   メール選択モーダル
   ============================================= */
const MAIL_TO = (typeof OVERRIDE_MAIL_TO !== 'undefined') ? OVERRIDE_MAIL_TO : 'info@hokkoku-johnsonboiler.jp';

const mailOverlay  = document.getElementById('mailSelectOverlay');
const mailCancel   = document.getElementById('mailSelectCancel');
const mailGmail    = document.getElementById('mailGmail');
const mailOutlook  = document.getElementById('mailOutlook');
const mailYahoo    = document.getElementById('mailYahoo');
const mailDefault  = document.getElementById('mailDefault');

if (mailOverlay) {
  document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      mailGmail.href   = `https://mail.google.com/mail/?view=cm&to=${MAIL_TO}`;
      mailOutlook.href = `https://outlook.live.com/mail/0/deeplink/compose?to=${MAIL_TO}`;
      mailYahoo.href   = `https://compose.mail.yahoo.com/?to=${MAIL_TO}`;
      mailDefault.href = `mailto:${MAIL_TO}`;
      mailOverlay.classList.add('open');
      mailOverlay.setAttribute('aria-hidden', 'false');
    });
  });

  const closeMailModal = () => {
    mailOverlay.classList.remove('open');
    mailOverlay.setAttribute('aria-hidden', 'true');
  };

  [mailGmail, mailOutlook, mailYahoo].forEach(el => el.addEventListener('click', closeMailModal));
  mailCancel.addEventListener('click', closeMailModal);
  mailOverlay.addEventListener('click', e => { if (e.target === mailOverlay) closeMailModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMailModal(); });
}

/* =============================================
   電話確認モーダル
   ============================================= */
const telOverlay   = document.getElementById('telConfirmOverlay');
const telCancel    = document.getElementById('telConfirmCancel');
const telCallBtn   = document.getElementById('telConfirmCall');
if (telCallBtn && typeof OVERRIDE_TEL !== 'undefined') telCallBtn.href = OVERRIDE_TEL;

if (telOverlay && telCancel) {
  /* すべての tel: リンクをインターセプト（モーダル内の発信ボタンは除く） */
  document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    if (link.id === 'telConfirmCall') return;
    link.addEventListener('click', e => {
      e.preventDefault();
      telOverlay.classList.add('open');
      telOverlay.setAttribute('aria-hidden', 'false');
      telCancel.focus();
    });
  });

  const closeModal = () => {
    telOverlay.classList.remove('open');
    telOverlay.setAttribute('aria-hidden', 'true');
  };

  telCancel.addEventListener('click', closeModal);
  telOverlay.addEventListener('click', e => { if (e.target === telOverlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

/* =============================================
   EmailJS 設定
   ─────────────────────────────────────────────
   【設定手順】
   1. https://www.emailjs.com/ で無料アカウント作成
   2. Email Services → Add New Service → Gmail を選択して接続
      → 表示される Service ID を EJS_SERVICE_ID に貼る
   3. Email Templates → Create New Template
      → 受信メールの見た目を作る（下記テンプレート例参照）
      → Template ID を EJS_TEMPLATE_ID に貼る
   4. Account → API Keys → Public Key を EJS_PUBLIC_KEY に貼る
   ─────────────────────────────────────────────
   【メールテンプレート例 (EmailJS の Template Content に貼る)】
   Subject : 【北国ジョンソンボイラ】{{inquiry_type}} のお問い合わせ
   To email: (会社のメールアドレスを設定)
   Body:
     お名前  : {{name}}
     会社名  : {{company}}
     メール  : {{email}}
     電話    : {{tel}}
     種別    : {{inquiry_type}}

     {{message}}
   ============================================= */
const EJS_PUBLIC_KEY  = 'jimQ3F-AJSBjEbhTG';
const EJS_SERVICE_ID  = 'service_jpxhp7x';
const EJS_TEMPLATE_ID = 'template_wn3eft1';

emailjs.init({ publicKey: EJS_PUBLIC_KEY });

/* =============================================
   お問い合わせフォーム（確認モーダル → EmailJS送信）
   ============================================= */
const contactForm         = document.getElementById('contactForm');
const submitOverlay       = document.getElementById('submitConfirmOverlay');
const submitConfirmSend   = document.getElementById('submitConfirmSend');
const submitConfirmCancel = document.getElementById('submitConfirmCancel');

if (contactForm && submitOverlay) {
  /* 送信ボタン → 確認モーダルを開く */
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    submitOverlay.classList.add('open');
    submitOverlay.setAttribute('aria-hidden', 'false');
    submitConfirmSend.focus();
  });

  /* 確認モーダル「送信する」→ EmailJS で送信 */
  submitConfirmSend.addEventListener('click', async () => {
    submitOverlay.classList.remove('open');
    submitOverlay.setAttribute('aria-hidden', 'true');

    const btn = contactForm.querySelector('[type="submit"]');
    btn.disabled = true;
    btn.textContent = '送信中…';

    try {
      await emailjs.sendForm(EJS_SERVICE_ID, EJS_TEMPLATE_ID, contactForm);
      contactForm.innerHTML = `
        <div class="form-success">
          <div class="form-success-icon">
            <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32" aria-hidden="true">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
            </svg>
          </div>
          <h3>送信が完了しました</h3>
          <p>お問い合わせありがとうございます。<br>内容を確認次第、担当者よりご連絡いたします。</p>
        </div>`;
      contactForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch {
      btn.disabled = false;
      btn.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg> 送信する`;
      alert('送信に失敗しました。お手数ですがお電話またはメールにてご連絡ください。\nTEL: 076-263-7221');
    }
  });

  /* 確認モーダルを閉じる */
  const closeSubmitModal = () => {
    submitOverlay.classList.remove('open');
    submitOverlay.setAttribute('aria-hidden', 'true');
  };
  submitConfirmCancel.addEventListener('click', closeSubmitModal);
  submitOverlay.addEventListener('click', e => { if (e.target === submitOverlay) closeSubmitModal(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && submitOverlay.classList.contains('open')) closeSubmitModal();
  });
}

/* =============================================
   カウントアップアニメーション
   ============================================= */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1600;
  const start = performance.now();
  const tick = now => {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3); /* ease out cubic */
    el.textContent = Math.round(eased * target);
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/* =============================================
   スクロールリビール（IntersectionObserver）
   .js-reveal / .js-reveal-left / .js-reveal-right / .js-reveal-scale
   ============================================= */
const revealItems = document.querySelectorAll(
  '.js-reveal, .js-reveal-left, .js-reveal-right, .js-reveal-scale'
);

if (revealItems.length) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
        /* 子要素のカウンターを起動 */
        entry.target.querySelectorAll('.js-count').forEach(animateCounter);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealItems.forEach(el => revealObserver.observe(el));
}

/* =============================================
   ボタン波紋（リップル）
   ============================================= */
document.querySelectorAll('.btn-primary').forEach(btn => {
  btn.addEventListener('click', e => {
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'btn-ripple';
    ripple.style.left = (e.clientX - rect.left) + 'px';
    ripple.style.top  = (e.clientY - rect.top)  + 'px';
    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
});

/* =============================================
   セーフティバッジ サイクルアニメーション
   ============================================= */
const safetyWrap = document.querySelector('.jf-safety-wrap');
if (safetyWrap) {
  new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const badges = Array.from(safetyWrap.querySelectorAll('.safety-badge'));
        safetyWrap.classList.add('cycling');
        let idx = 0;
        badges[idx].classList.add('active');
        setInterval(() => {
          badges[idx].classList.remove('active');
          idx = (idx + 1) % badges.length;
          badges[idx].classList.add('active');
        }, 2600);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 }).observe(safetyWrap);
}

/* =============================================
   ヒーローパーティクル生成
   ============================================= */
(function createHeroParticles() {
  const heroBg = document.querySelector('.hero-bg');
  if (!heroBg) return;
  for (let i = 0; i < 14; i++) {
    const p = document.createElement('div');
    p.className = 'hero-particle';
    const size = (Math.random() * 4 + 2).toFixed(1);
    p.style.cssText = [
      `left:${(Math.random() * 88 + 4).toFixed(1)}%`,
      `top:${(Math.random() * 80 + 10).toFixed(1)}%`,
      `width:${size}px`,
      `height:${size}px`,
      `--delay:${(Math.random() * 4).toFixed(1)}s`,
      `--dur:${(Math.random() * 3 + 4).toFixed(1)}s`,
    ].join(';');
    heroBg.appendChild(p);
  }
})();

/* =============================================
   代表者メッセージ「続きを読む」（モバイルのみ表示）
   ============================================= */
const storyToggleBtn = document.getElementById('storyToggleBtn');
const storyExpand    = document.querySelector('.jf-story-expand');
if (storyToggleBtn && storyExpand) {
  storyToggleBtn.addEventListener('click', () => {
    const isOpen = storyExpand.classList.toggle('open');
    storyToggleBtn.textContent = isOpen ? '閉じる' : '続きを読む';
    storyToggleBtn.setAttribute('aria-expanded', String(isOpen));
  });
}
