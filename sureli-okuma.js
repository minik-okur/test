"use strict";

// ══════════════════════════════════════════════════════════════════════════════
//  SÜRELİ OKUMA MODÜLÜ  (sureli-okuma.js)
//  Bağımlılık: app.js'teki ekranGoster(), tumEkranlariGizle(), menuSkorGuncelle()
// ══════════════════════════════════════════════════════════════════════════════

// ─── Metinler ─────────────────────────────────────────────────────────────────
const SO_METINLER = [
  {
    id: 1,
    baslik: "Ay’a Yolculuk",
    kelimeSayisi: 50,
    yildiz: 1,
    metin: "Mustafa gece gökyüzüne baktı. Yıldızlar parlıyordu. Ay çok büyük görünüyordu. “Aya gitsem nasıl olurdu?” diye düşündü. Uzay gemisine bindi. Roket ateşlendi. Yukarı fırladı. Ay’a indi. Her adımda zıplayarak yürüdü. Çünkü ay’da yerçekimi azdı. Dünya’ya baktı. Mavi ve yuvarlaktı. Çok güzeldi. Eve döndü. Rüyasında tekrar gitti.”
  },
  {
    id: 2,
    baslik: "Yağmur Yağıyor",
    kelimeSayisi: 60,
    yildiz: 2,
    metin: "Bugün hava bulutlu. Pencereden baktım. Yağmur yağıyor. Damlalar cama vuruyordu. Annem şemsiyemi verdi. Okula gittim. Arkadaşlarım da ıslak geldi. Öğretmenimiz bize yağmur hakkında anlattı. Yağmur çiçeklere iyi gelir. Ağaçlar yağmurda büyür. Tarlalar sulanır. Yağmur bizim için çok önemlidir. Eve dönerken gökkuşağı gördüm. Çok güzeldi."
  },
  {
    id: 3,
    baslik: "Piknikte",
    kelimeSayisi: 70,
    yildiz: 3,
    metin: "Pazar günü ailemle pikniğe gittik. Ormandaki parka gittik. Annem börek yaptı. Babam meyve suyu getirdi. Ben de topumu aldım. Önce yedik içtik. Sonra topla oynadık. Kardeşim çiçek topladı. Ben kelebek kovalarım. Babam ağaca tırmandı. Annem bize baktı. Akşama kadar oynadık. Eve dönerken çok yorulmuştuk. Ama çok mutluyduk. Bu güzel bir gündü."
  },
  {
    id: 4,
    baslik: "Okul Günüm",
    kelimeSayisi: 80,
    yildiz: 4,
    metin: "Her sabah erkenden kalkarım. Yüzümü yıkarım. Kahvaltı yaparım. Sonra çantamı alırım. Okula yürüyerek giderim. Sınıfa girince arkadaşlarımla selamlaşırım. Öğretmenimiz gelir. Derse başlarız. Önce okuma yaparız. Sonra matematik çalışırız. Teneffüste bahçeye ineriz. Orada koşarız, güleriz. Öğlen yemek yeriz. Öğleden sonra resim yaparız. Müzik dersinde şarkı söyleriz. Zil çalınca evimize gideriz. Annemi görünce çok sevinirim. Okulumu seviyorum."
  },
  {
    id: 5,
    baslik: "Denizde Tatil",
    kelimeSayisi: 90,
    yildiz: 5,
    metin: "Bu yaz denize gittik. Otel çok güzeldi. Sabah kahvaltıdan sonra sahile indik. Kum çok sarıydı. Deniz mavisiydi. Ben hemen suya girdim. Annem güneş kremi sürdü. Babam şemsiye kurdu. Kardeşim kumdan kale yaptı. Ben dalgalarla oynadım. Öğleden sonra tekneye bindik. Balıkları gördük. Akşam restorana gittik. Balık yedik. Gece otele döndük. Balkondan yıldızlara baktım. Deniz sesi geliyordu. Çok güzel bir gündü. Bu tatili hiç unutmayacağım."
  },
  {
    id: 6,
    baslik: "Dört Mevsim",
    kelimeSayisi: 100,
    yildiz: 6,
    metin: "Bir yılda dört mevsim vardır. İlkbahar, yaz, sonbahar ve kış. İlkbaharda çiçekler açar. Ağaçlar yeşillenir. Kuşlar şarkı söyler. Havalar ısınmaya başlar. Yazın güneş çok sıcak olur. Çocuklar tatile çıkar. Denize girilir. Dondurma yenir. Sonbaharda yapraklar sararır. Kızarır. Ağaçlardan dökülür. Havalar serinler. Yağmurlar başlar. Kışın kar yağar. Her yer beyaza bürünür. Çocuklar kardan adam yapar. Kızak kayar. Evlerde sobalar yanar. Her mevsimin güzel bir yüzü var. Ben en çok ilkbaharı severim. Çünkü her şey yeniden canlanır."
  }
];

// ─── State ────────────────────────────────────────────────────────────────────
let so_secilenMetin = null;
let so_sure = 60;
let so_kalanSure = 60;
let so_timer = null;
let so_basladi = false;
let so_bitti = false;
let so_geriSayimTimer = null;

// ─── Ses Üretici (AudioContext) ───────────────────────────────────────────────
function so_tinkSesi() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    // Yüksekten alçağa "ding" — piyano tuşu gibi
    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); osc2.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'triangle'; osc2.type = 'sine';
    osc.frequency.setValueAtTime(1046, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(523, ctx.currentTime + 0.3);
    osc2.frequency.setValueAtTime(2093, ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(1046, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.55, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.5);
    osc2.start(ctx.currentTime); osc2.stop(ctx.currentTime + 0.3);
    setTimeout(() => ctx.close(), 800);
  } catch(e) {}
}

function so_bitisSesi() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    // Neşeli yükselen melodi — çocuk oyun tebrik sesi
    [[523,0,0.5],[659,0.13,0.45],[784,0.26,0.45],[1047,0.39,0.6],[784,0.6,0.35],[1047,0.78,0.35],[1047,0.96,0.8]].forEach(([freq,delay,dur]) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
      gain.gain.setValueAtTime(0, ctx.currentTime + delay);
      gain.gain.linearRampToValueAtTime(0.45, ctx.currentTime + delay + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + dur);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + dur);
    });
    setTimeout(() => ctx.close(), 2200);
  } catch(e) {}
}

// ─── DOM Yardımcıları ─────────────────────────────────────────────────────────
function so_el(id) { return document.getElementById(id); }

function so_ekranGoster(ekranId) {
  ['soSecimEkrani','soGeriSayimEkrani','soOkumaEkrani','soSonucEkrani'].forEach(id => {
    const el = so_el(id);
    if (el) el.style.display = 'none';
  });
  const hedef = so_el(ekranId);
  if (hedef) hedef.style.display = 'flex';
}

// ─── 1. Metin Seçim Ekranı ────────────────────────────────────────────────────
function so_secimEkraniOlustur() {
  const alan = so_el('soMetinKartlari');
  if (!alan) return;
  alan.innerHTML = '';
  SO_METINLER.forEach(metin => {
    const kart = document.createElement('div');
    kart.className = 'so-metin-kart';
    kart.innerHTML = `
      <div class="so-kart-baslik">${metin.baslik}</div>
      <div class="so-kart-kelime">${metin.kelimeSayisi} kelime</div>
      <div class="so-kart-yildizlar">${'★'.repeat(metin.yildiz)}<span style="opacity:0.25">${'★'.repeat(6 - metin.yildiz)}</span></div>
    `;
    kart.addEventListener('click', () => so_metinSec(metin));
    alan.appendChild(kart);
  });
}

function so_metinSec(metin) {
  so_secilenMetin = metin;
  so_okumaEkraniAc();
}

// ─── 2. Geri Sayım Ekranı ─────────────────────────────────────────────────────
function so_geriSayimBaslat() {
  so_ekranGoster('soGeriSayimEkrani');
  const el = so_el('soGeriSayimRakam');
  let sayac = 3;

  function goster(deger) {
    if (!el) return;
    el.textContent = deger;
    el.classList.remove('so-geri-animate');
    void el.offsetWidth;
    el.classList.add('so-geri-animate');
  }

  goster(sayac);

  so_geriSayimTimer = setInterval(() => {
    sayac--;
    if (sayac > 0) {
      goster(sayac);
      so_tinkSesi();
    } else {
      clearInterval(so_geriSayimTimer);
      so_geriSayimTimer = null;
      so_tinkSesi();
      setTimeout(() => {
        so_ekranGoster('soOkumaEkrani');
        so_baslatTimer();
      }, 300);
    }
  }, 1000);
}

// ─── 3. Okuma Ekranı ──────────────────────────────────────────────────────────
function so_okumaEkraniAc() {
  so_ekranGoster('soOkumaEkrani');
  so_basladi = false;
  so_bitti = false;
  so_kalanSure = 60;

  // Timer bar ve sayaç sıfırla
  const bar = so_el('soTimerBar');
  const sayac = so_el('soTimerSayac');
  if (bar) { bar.style.transition = 'none'; bar.style.width = '100%'; }
  if (sayac) sayac.textContent = '1:00';

  // Metni kelime kelime oluştur
  const metinAlan = so_el('soMetinAlan');
  if (metinAlan && so_secilenMetin) {
    const kelimeler = so_secilenMetin.metin.split(/\s+/);
    const fontBoyutu = so_fontHesapla(kelimeler.length);
    metinAlan.style.fontSize = fontBoyutu;
    metinAlan.innerHTML = '';

    kelimeler.forEach((kelime, i) => {
      const wrap = document.createElement('span');
      wrap.className = 'so-kelime-wrap';

      const kelimeEl = document.createElement('span');
      kelimeEl.className = 'so-kelime';
      kelimeEl.textContent = kelime;

      const numEl = document.createElement('span');
      numEl.className = 'so-kelime-num';
    numEl.style.fontSize = '0.72rem';
    numEl.style.color = 'rgba(0,0,0,0.45)';
      numEl.textContent = i + 1;

      wrap.appendChild(kelimeEl);
      wrap.appendChild(numEl);
      metinAlan.appendChild(wrap);

      if (i < kelimeler.length - 1) {
        metinAlan.appendChild(document.createTextNode(' '));
      }
    });
  }

  // Başla butonu
  const btnBasla = so_el('soBtnBasla');
  if (btnBasla) {
    btnBasla.style.display = 'block';
    btnBasla.onclick = () => {
      btnBasla.style.display = 'none';
      so_geriSayimBaslat();
    };
  }
}

function so_fontHesapla(kelimeSayisi) {
  // 50 kelime → 1.35rem, 100 kelime → 0.92rem
  const min = 0.92, max = 1.35;
  const oran = (kelimeSayisi - 50) / 50;
  const boyut = max - (oran * (max - min));
  return boyut.toFixed(2) + 'rem';
}

function so_baslatTimer() {
  so_basladi = true;

  const bar = so_el('soTimerBar');
  if (bar) {
    bar.style.transition = 'none';
    bar.style.width = '100%';
    bar.style.display = 'block';
    // Bir frame bekle, sonra transition başlat
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        bar.style.transition = 'width 60s linear';
        bar.style.width = '0%';
      });
    });
  }

  so_timer = setInterval(() => {
    so_kalanSure--;
    const sayac = so_el('soTimerSayac');
    if (sayac) {
      const dk = Math.floor(so_kalanSure / 60);
      const sn = so_kalanSure % 60;
      sayac.textContent = dk + ':' + String(sn).padStart(2, '0');
    }
    if (so_kalanSure <= 0) {
      so_timerBit();
    }
  }, 1000);
}

function so_timerBit() {
  clearInterval(so_timer);
  so_timer = null;
  so_bitti = true;
  so_bitisSesi();
  setTimeout(() => so_sonucEkraniAc(), 600);
}

// ─── 4. Sonuç Ekranı ─────────────────────────────────────────────────────────
function so_sonucEkraniAc() {
  so_ekranGoster('soSonucEkrani');
  const kelimeSayisi = so_secilenMetin ? so_secilenMetin.kelimeSayisi : 50;

  // Sayı seçici oluştur
  const secici = so_el('soKelimeSecici');
  if (secici) {
    secici.innerHTML = '';
    // Önce "Seç" placeholder
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'Kaçıncı kelimeye kadar okudun?';
    placeholder.disabled = true;
    placeholder.selected = true;
    secici.appendChild(placeholder);

    for (let i = 1; i <= kelimeSayisi; i++) {
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = i + '. kelime';
      secici.appendChild(opt);
    }

    secici.onchange = () => {
      const sonucMetin = so_el('soSonucMetin');
      if (sonucMetin && secici.value) {
        sonucMetin.textContent = '60 saniyede ' + secici.value + '. kelimeye kadar okudun!';
        sonucMetin.style.opacity = '1';
      }
    };
  }

  // Sonuç metnini başta gizle
  const sonucMetin = so_el('soSonucMetin');
  if (sonucMetin) { sonucMetin.textContent = ''; sonucMetin.style.opacity = '0'; }
}

// ─── Temizlik ─────────────────────────────────────────────────────────────────
function so_temizle() {
  if (so_timer) { clearInterval(so_timer); so_timer = null; }
  if (so_geriSayimTimer) { clearInterval(so_geriSayimTimer); so_geriSayimTimer = null; }
  so_basladi = false;
  so_bitti = false;
  so_kalanSure = 60;
}

// ─── Dışa açılan fonksiyon ────────────────────────────────────────────────────
window.surelioOkumaBas = function() {
  so_temizle();
  so_secimEkraniOlustur();
  so_ekranGoster('soSecimEkrani');
};

window.surelioOkumaDurdur = function() {
  so_temizle();
};

// ─── Event Listener'lar (DOM hazır olunca) ────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {

  // Geri butonları
  const btnSecimGeri = so_el('soBtnSecimGeri');
  if (btnSecimGeri) {
    btnSecimGeri.addEventListener('click', () => {
      so_temizle();
      // Okuma köşesi alt menüsüne dön
      if (window.ekranGoster && window.okumaKoseScreen) {
        window.ekranGoster(window.okumaKoseScreen);
      } else {
        const el = document.getElementById('okumaKoseScreen');
        if (el && window.ekranGoster) window.ekranGoster(el);
      }
    });
  }

  const btnOkumaGeri = so_el('soBtnOkumaGeri');
  if (btnOkumaGeri) {
    btnOkumaGeri.addEventListener('click', () => {
      so_temizle();
      so_secimEkraniOlustur();
      so_ekranGoster('soSecimEkrani');
    });
  }

  // Sonuç ekranı butonları
  const btnTekrar = so_el('soBtnTekrar');
  if (btnTekrar) {
    btnTekrar.addEventListener('click', () => {
      so_temizle();
      so_metinSec(so_secilenMetin);
    });
  }

  const btnSecimedon = so_el('soBtnSecimedön');
  if (btnSecimedon) {
    btnSecimedon.addEventListener('click', () => {
      so_temizle();
      so_secimEkraniOlustur();
      so_ekranGoster('soSecimEkrani');
    });
  }
});
