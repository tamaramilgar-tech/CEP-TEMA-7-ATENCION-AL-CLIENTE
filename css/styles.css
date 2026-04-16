:root{
  --bg:#0f1021;
  --bg-soft:#171a31;
  --card:#1c2140;
  --card-2:#252b52;
  --text:#f6f2e8;
  --muted:#c9c2b4;
  --accent:#ffcf74;
  --accent-2:#8ee7ff;
  --ok:#8cf0b5;
  --danger:#ff9d9d;
  --shadow:0 18px 40px rgba(0,0,0,.28);
  --radius:24px;
}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{
  margin:0;
  font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
  background:radial-gradient(circle at top,#1e2347 0,#101225 45%,#090b17 100%);
  color:var(--text);
}
a{color:inherit}
img{max-width:100%;display:block}
.sky{
  position:fixed; inset:0; pointer-events:none; opacity:.3;
  background-image:radial-gradient(circle at 20% 20%,rgba(255,255,255,.5) 1px,transparent 1px),
  radial-gradient(circle at 70% 35%,rgba(255,255,255,.35) 1px,transparent 1px),
  radial-gradient(circle at 40% 80%,rgba(255,255,255,.25) 1px,transparent 1px);
  background-size:220px 220px, 280px 280px, 320px 320px;
}
.hero, .certificate-wrap{
  width:min(1200px,calc(100% - 32px));
  margin:0 auto;
}
.hero{
  display:grid;
  grid-template-columns:1.15fr .85fr;
  gap:28px;
  align-items:center;
  padding:48px 0 24px;
}
.hero__content, .card{
  background:linear-gradient(180deg,rgba(255,255,255,.06),rgba(255,255,255,.02));
  border:1px solid rgba(255,255,255,.1);
  border-radius:var(--radius);
  box-shadow:var(--shadow);
  backdrop-filter: blur(8px);
}
.hero__content{padding:32px}
.hero h1,.certificate h1{font-size:clamp(2.3rem,4.5vw,4rem);line-height:1.03;margin:.2em 0}
.eyebrow{
  display:inline-flex;align-items:center;gap:8px;
  color:var(--accent);text-transform:uppercase;letter-spacing:.16em;font-weight:700;font-size:.78rem;
}
.hero__lead,.certificate__lead{color:var(--muted);font-size:1.08rem;line-height:1.65}
.hero__badges,.hero__actions,.teacher-grid,.practice__actions,.test__actions,.certificate__actions,.chips{
  display:flex;flex-wrap:wrap;gap:12px;
}
.hero__badges span,.phase__meta span,.chip{
  display:inline-flex;align-items:center;gap:8px;
  padding:10px 14px;border-radius:999px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.08);font-size:.95rem;
}
.hero__hint{margin-top:18px;color:var(--muted)}
.hero__map{padding:18px}
.btn{
  appearance:none;border:0;border-radius:16px;padding:13px 18px;font:inherit;font-weight:700;cursor:pointer;
  text-decoration:none;display:inline-flex;align-items:center;justify-content:center;gap:8px;transition:.2s transform,.2s opacity,.2s background;
}
.btn:hover{transform:translateY(-1px)}
.btn--primary{background:linear-gradient(135deg,var(--accent),#f3a346);color:#321d02}
.btn--ghost{background:rgba(255,255,255,.08);color:var(--text);border:1px solid rgba(255,255,255,.1)}
.btn--secondary{background:linear-gradient(135deg,var(--accent-2),#59b8ff);color:#06253f}
.btn[disabled]{opacity:.5;cursor:not-allowed;transform:none}
#app{width:min(1200px,calc(100% - 32px));margin:0 auto 56px}
.section-title{margin:28px 0 16px}
.card{padding:26px;margin-bottom:22px}
.intro-grid{
  display:grid;grid-template-columns:1fr 1fr;gap:20px;
}
.precheck-grid,.phase__grid,.test-grid{display:grid;gap:20px}
.phase__grid{grid-template-columns:1.02fr .98fr}
.module{
  background:linear-gradient(180deg,rgba(255,255,255,.06),rgba(255,255,255,.03));
  border:1px solid rgba(255,255,255,.09);border-radius:22px;padding:20px;
}
ul,ol{padding-left:20px}
li+li{margin-top:8px}
.phase__header{display:flex;justify-content:space-between;gap:16px;align-items:flex-start;margin-bottom:8px}
.phase__scene{color:var(--accent-2);font-weight:700;letter-spacing:.06em;text-transform:uppercase;font-size:.78rem}
.phase__title{margin:.2em 0;font-size:1.5rem}
.phase__summary{color:var(--muted);line-height:1.7;margin-bottom:18px}
.phase__summary ul{margin:0}
.progress-bar{
  width:100%;height:14px;border-radius:999px;background:rgba(255,255,255,.08);overflow:hidden;margin-top:16px
}
.progress-bar > span{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,var(--accent-2),var(--accent));width:0%}
.quest-map{
  display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px;margin-top:14px
}
.map-node{
  min-height:120px;border-radius:22px;padding:18px;background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.03));
  border:1px solid rgba(255,255,255,.08);position:relative;overflow:hidden
}
.map-node::after{
  content:"";position:absolute;inset:auto -20px -35px auto;width:100px;height:100px;border-radius:50%;background:rgba(255,207,116,.09)
}
.map-node h4{margin:0 0 8px}
.practice__checkbox{
  display:flex;gap:12px;align-items:flex-start;padding:14px;border-radius:18px;background:rgba(255,255,255,.05);margin:14px 0
}
input[type="checkbox"]{width:18px;height:18px;margin-top:2px}
textarea,input[type="text"],input[type="number"]{
  width:100%;background:#0f1328;color:var(--text);border:1px solid rgba(255,255,255,.16);border-radius:14px;padding:12px 14px;font:inherit;
}
small,.muted{color:var(--muted)}
.status{
  margin-top:10px;padding:12px 14px;border-radius:16px;background:rgba(255,255,255,.05);color:var(--muted)
}
.status--ok{background:rgba(140,240,181,.12);color:var(--ok)}
.status--warn{background:rgba(255,207,116,.12);color:var(--accent)}
.status--bad{background:rgba(255,157,157,.12);color:var(--danger)}
.question{
  border:1px solid rgba(255,255,255,.08);border-radius:18px;padding:16px;margin-top:14px;background:rgba(255,255,255,.04)
}
.question h5{margin:0 0 10px;font-size:1rem;line-height:1.45}
.options{display:grid;gap:10px}
.option{
  text-align:left;padding:12px 14px;border-radius:14px;border:1px solid rgba(255,255,255,.08);background:#121831;color:var(--text)
}
.option.is-selected{outline:2px solid rgba(142,231,255,.7)}
.option.is-correct{background:rgba(140,240,181,.16);border-color:rgba(140,240,181,.45)}
.option.is-wrong{background:rgba(255,157,157,.16);border-color:rgba(255,157,157,.4)}
.figure{
  margin:10px 0 14px;border-radius:18px;overflow:hidden;border:1px solid rgba(255,255,255,.08)
}
.resource-list a{
  display:flex;justify-content:space-between;gap:16px;padding:12px 14px;border-radius:14px;background:rgba(255,255,255,.05);text-decoration:none
}
.resource-list a+a{margin-top:10px}
.dialog{border:0;background:transparent;padding:0}
.dialog::backdrop{background:rgba(0,0,0,.55)}
.dialog__panel{
  width:min(520px,calc(100vw - 24px));padding:26px;background:#171d36;color:var(--text);border:1px solid rgba(255,255,255,.1);border-radius:26px;box-shadow:var(--shadow)
}
.dialog__panel h2,.dialog__panel h3{margin-top:0}
.dialog__actions{display:flex;justify-content:flex-end;gap:12px;margin-top:16px}
.dialog__status{min-height:24px}
.certificate-body{min-height:100vh;display:grid;place-items:center;padding:24px}
.certificate{max-width:920px}
.certificate__box{
  border:2px solid rgba(255,255,255,.12);border-radius:24px;padding:22px;margin:24px 0;background:rgba(255,255,255,.04);text-align:center
}
.certificate__name{
  font-size:1.35rem;text-align:center;border:0;border-bottom:2px solid rgba(255,255,255,.22);border-radius:0;background:transparent;padding:12px;margin:6px auto 10px;max-width:640px
}
.certificate__stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:14px}
.stat{
  padding:18px;border-radius:18px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08)
}
.certificate__footer{display:flex;justify-content:space-between;gap:16px;margin-top:22px}
.hidden{display:none !important}
@media (max-width: 920px){
  .hero,.intro-grid,.phase__grid{grid-template-columns:1fr}
}
@media print{
  body{background:white;color:#111}
  .sky,.no-print,.hero{display:none !important}
  .certificate-wrap{width:100%;margin:0}
  .certificate,.card{box-shadow:none;border:1px solid #bbb;background:white;color:#111}
  .certificate__name{color:#111;border-color:#666}
}

select{
  width:100%;background:#0f1328;color:var(--text);border:1px solid rgba(255,255,255,.16);border-radius:14px;padding:12px 14px;font:inherit;
}
.hero__content{background:linear-gradient(180deg,rgba(53,74,144,.22),rgba(255,255,255,.04));}
.hero__map{background:linear-gradient(180deg,rgba(255,255,255,.06),rgba(127,223,255,.05));border:1px solid rgba(255,255,255,.1);border-radius:var(--radius);box-shadow:var(--shadow);}
.intro-grid .chips{align-content:flex-start}
.phase{position:relative;overflow:hidden}
.phase::before{content:"";position:absolute;inset:0;pointer-events:none;opacity:.12;background:radial-gradient(circle at 85% 15%,#fff,transparent 18%)}
.phase__art{display:flex;align-items:center;justify-content:space-between;gap:18px;padding:18px 20px;border-radius:20px;margin:10px 0 18px;border:1px solid rgba(255,255,255,.12)}
.phase__art-icon{font-size:2.8rem;line-height:1}
.phase__art p{margin:0;font-weight:700;letter-spacing:.04em;text-transform:uppercase}
.module--locked{background:linear-gradient(180deg,rgba(255,255,255,.06),rgba(255,255,255,.02));border-style:dashed}
.phase--locked{opacity:.88}
.module--practice-box,.module--test-box{min-height:100%}
.question .figure svg{display:block;width:100%;height:auto}
.options .option{font-size:.95rem;line-height:1.45}
[data-phase="fase1"]{background:linear-gradient(180deg,rgba(32,69,118,.55),rgba(23,31,62,.96));}
[data-phase="fase2"]{background:linear-gradient(180deg,rgba(93,44,118,.5),rgba(27,25,63,.96));}
[data-phase="fase3"]{background:linear-gradient(180deg,rgba(117,71,24,.45),rgba(35,28,59,.96));}
[data-phase="fase4"]{background:linear-gradient(180deg,rgba(21,111,111,.44),rgba(24,32,61,.96));}
[data-phase="fase5"]{background:linear-gradient(180deg,rgba(56,84,136,.46),rgba(27,34,64,.96));}
[data-phase="fase6"]{background:linear-gradient(180deg,rgba(123,57,101,.45),rgba(26,29,62,.96));}
.art-fase1{background:linear-gradient(135deg,rgba(98,188,255,.28),rgba(255,207,116,.2));}
.art-fase2{background:linear-gradient(135deg,rgba(215,126,255,.24),rgba(255,207,116,.18));}
.art-fase3{background:linear-gradient(135deg,rgba(255,172,90,.24),rgba(255,236,173,.18));}
.art-fase4{background:linear-gradient(135deg,rgba(87,231,213,.24),rgba(130,195,255,.18));}
.art-fase5{background:linear-gradient(135deg,rgba(134,172,255,.24),rgba(225,210,255,.14));}
.art-fase6{background:linear-gradient(135deg,rgba(255,132,210,.22),rgba(123,214,255,.18));}
.dialog__panel input[type="password"]{letter-spacing:.08em}

.profile-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin-top:12px}
.profile-grid label{display:grid;gap:8px}
.profile-grid label span{font-weight:700;color:var(--muted)}
.certificate__metaform{margin:18px 0 10px;text-align:left}
