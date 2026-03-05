/**
 * ses-yonetici.js
 * Çocuk eğitim uygulaması — merkezi ses yöneticisi
 * Web Audio API ile sentezlenmiş sesler (dosya gerektirmez)
 * 
 * Kullanım:
 *   window.playSes('correct')
 *   window.playSes('wrong')
 *   window.playSes('button_click')
 *   window.playSes('level_complete')
 *   window.playSes('countdown_tick')
 *   window.playSes('time_up')
 */

(function () {
  'use strict';

  // ─── Paylaşılan AudioContext (Android unlock dahil) ──────────────────────
  let sharedAudioCtx = null;

  function getCtx() {
    if (!sharedAudioCtx || sharedAudioCtx.state === 'closed') {
      sharedAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return sharedAudioCtx;
  }

  function unlockAudio() {
    const ctx = getCtx();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
  }

  // Android / iOS ilk dokunuşta unlock
  document.addEventListener('touchstart', unlockAudio, { once: false, passive: true });
  document.addEventListener('click', unlockAudio, { once: false, passive: true });

  // ─── Yardımcı: zarf (ADSR) ───────────────────────────────────────────────
  function applyEnvelope(gainNode, ctx, attack, sustain, decay, volume) {
    const now = ctx.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(volume, now + attack);
    gainNode.gain.setValueAtTime(volume, now + attack + sustain);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + attack + sustain + decay);
  }

  // ─── Ses tanımları ───────────────────────────────────────────────────────

  const SESLER = {

    /**
     * button_click — hafif, kıvrak "pop" tık
     */
    button_click: function () {
      const ctx = getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(900, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.06);

      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.1);
    },

    /**
     * correct — neşeli çocuk "Yaşa!" tonu
     * Hızlı yükselen çift nota + parlak zil
     */
    correct: function () {
      const ctx = getCtx();
      const now = ctx.currentTime;

      // Ana melodi: C5 → E5 → G5 (majör üçlü - neşeli!)
      const notes = [523, 659, 784];
      notes.forEach(function (freq, i) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'triangle';
        osc.frequency.value = freq;
        const t = now + i * 0.11;
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.35, t + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
        osc.start(t);
        osc.stop(t + 0.25);
      });

      // Üstüne parlak "zil" katmanı
      const bell = ctx.createOscillator();
      const bellGain = ctx.createGain();
      bell.connect(bellGain);
      bellGain.connect(ctx.destination);
      bell.type = 'sine';
      bell.frequency.value = 1568; // G6
      bellGain.gain.setValueAtTime(0.2, now + 0.3);
      bellGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
      bell.start(now + 0.3);
      bell.stop(now + 0.75);
    },

    /**
     * wrong — komik "oops" boing, üzücü değil
     * Aşağı kayan glissando
     */
    wrong: function () {
      const ctx = getCtx();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.35);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.linearRampToValueAtTime(0.3, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.start(now);
      osc.stop(now + 0.4);

      // Komik "boing" ikinci ton
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(300, now + 0.05);
      osc2.frequency.exponentialRampToValueAtTime(100, now + 0.45);
      gain2.gain.setValueAtTime(0.2, now + 0.05);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc2.start(now + 0.05);
      osc2.stop(now + 0.5);
    },

    /**
     * level_complete — büyük kutlama melodisi (4-5 sn)
     * C majör fanfare + çocuk coşkusu harmonisi
     */
    level_complete: function () {
      const ctx = getCtx();
      const now = ctx.currentTime;

      // Fanfare notaları: C E G C E G yükselen zafer melodisi
      const melody = [
        { freq: 523, t: 0.0,  dur: 0.18 },
        { freq: 659, t: 0.18, dur: 0.18 },
        { freq: 784, t: 0.36, dur: 0.18 },
        { freq: 1047,t: 0.54, dur: 0.35 },
        { freq: 784, t: 0.90, dur: 0.18 },
        { freq: 1047,t: 1.08, dur: 0.18 },
        { freq: 1175,t: 1.26, dur: 0.55 }, // D7 - gerilim
        { freq: 1319,t: 1.82, dur: 0.9  }, // E7 - çözüm
      ];

      melody.forEach(function (n) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'triangle';
        osc.frequency.value = n.freq;
        const t = now + n.t;
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.4, t + 0.04);
        gain.gain.setValueAtTime(0.4, t + n.dur - 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, t + n.dur + 0.1);
        osc.start(t);
        osc.stop(t + n.dur + 0.15);
      });

      // Arkaplan "twinkling" yıldız efekti
      for (let i = 0; i < 6; i++) {
        const twinkle = ctx.createOscillator();
        const tGain = ctx.createGain();
        twinkle.connect(tGain);
        tGain.connect(ctx.destination);
        twinkle.type = 'sine';
        twinkle.frequency.value = [1047, 1175, 1319, 1568, 1760, 2093][i];
        const tStart = now + 0.5 + i * 0.22;
        tGain.gain.setValueAtTime(0, tStart);
        tGain.gain.linearRampToValueAtTime(0.12, tStart + 0.05);
        tGain.gain.exponentialRampToValueAtTime(0.001, tStart + 0.6);
        twinkle.start(tStart);
        twinkle.stop(tStart + 0.7);
      }

      // Son: büyük akord C majör
      [523, 659, 784, 1047].forEach(function (freq) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.15, now + 2.8);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 4.5);
        osc.start(now + 2.8);
        osc.stop(now + 4.6);
      });
    },

    /**
     * countdown_tick — sert tik-tak geri sayım
     */
    countdown_tick: function () {
      const ctx = getCtx();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'square';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.04);

      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.start(now);
      osc.stop(now + 0.09);
    },

    /**
     * time_up — süre doldu, dramatik alarm
     * Hızlanan kırmızı alarm serisi
     */
    time_up: function () {
      const ctx = getCtx();
      const now = ctx.currentTime;

      // 3 aşamalı inen alarm
      const alarmTones = [
        { freq: 880, t: 0.0 },
        { freq: 784, t: 0.2 },
        { freq: 659, t: 0.4 },
        { freq: 523, t: 0.6 },
      ];

      alarmTones.forEach(function (a) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sawtooth';
        osc.frequency.value = a.freq;
        const t = now + a.t;
        gain.gain.setValueAtTime(0.4, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
        osc.start(t);
        osc.stop(t + 0.2);
      });

      // Son düşük "bzzzt" bitis vurgusu
      const buzz = ctx.createOscillator();
      const buzzGain = ctx.createGain();
      buzz.connect(buzzGain);
      buzzGain.connect(ctx.destination);
      buzz.type = 'sawtooth';
      buzz.frequency.setValueAtTime(200, now + 0.85);
      buzz.frequency.exponentialRampToValueAtTime(80, now + 1.2);
      buzzGain.gain.setValueAtTime(0.35, now + 0.85);
      buzzGain.gain.exponentialRampToValueAtTime(0.001, now + 1.3);
      buzz.start(now + 0.85);
      buzz.stop(now + 1.35);
    }
  };

  // ─── Global API ─────────────────────────────────────────────────────────

  var _sesAcik = true;

  /**
   * window.setSesAcik(bool) — hamburger menüden ses aç/kapat
   */
  window.setSesAcik = function (acik) {
    _sesAcik = !!acik;
  };

  /**
   * window.playSes(isim)
   * @param {string} isim - 'correct' | 'wrong' | 'button_click' | 
   *                        'level_complete' | 'countdown_tick' | 'time_up'
   */
  window.playSes = function (isim) {
    if (!_sesAcik) return;
    if (!SESLER[isim]) {
      console.warn('[ses-yonetici] Bilinmeyen ses:', isim);
      return;
    }
    try {
      unlockAudio();
      SESLER[isim]();
    } catch (e) {
      console.warn('[ses-yonetici] Ses çalınamadı:', isim, e);
    }
  };

  // Geriye dönük uyumluluk: hazine.js sharedAudioCtx'i dışarı açar
  Object.defineProperty(window, 'sharedAudioCtx', {
    get: function () { return getCtx(); },
    configurable: true
  });

  // ─── Buton sesi: tüm buton tıklamalarına otomatik ──────────────────────────
  document.addEventListener('click', function (e) {
    var el = e.target;
    // Buton veya buton içindeki element tıklandıysa
    while (el && el !== document.body) {
      if (el.tagName === 'BUTTON' || el.classList.contains('menu-card-btn') ||
          el.classList.contains('submenu-card') || el.classList.contains('so-metin-kart')) {
        window.playSes('button_click');
        return;
      }
      el = el.parentElement;
    }
  }, { passive: true });

  console.log('[ses-yonetici] Yüklendi ✓  —  window.playSes() hazır');

})();
