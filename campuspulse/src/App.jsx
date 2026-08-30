import { useState, useEffect, useCallback } from "react";

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

/* ── DARK THEME (default) ── */
:root{
  --bg:#07070d;--bg2:#0e0e18;--bg3:#14141f;--card:#1a1a28;--card2:#20202f;
  --border:rgba(255,255,255,0.06);--border2:rgba(255,255,255,0.11);
  --accent:#ff6b35;--accent2:#ffab00;--accent3:#ff3d71;
  --blue:#3d8bff;--green:#00e5a0;--purple:#c084fc;--cyan:#00d4ff;
  --text:#eeeef8;--text2:#9898b8;--text3:#55556e;
  --r:14px;--rs:9px;
  --glow-o:0 0 40px rgba(255,107,53,0.18);
  --nav-bg:rgba(7,7,13,0.92);
  --ticker-bg:linear-gradient(90deg,#1a0a05,#0a0518,#051018);
  --shadow:0 4px 24px rgba(0,0,0,0.4);
}

/* ── LIGHT THEME ── */
html.light-mode{
  --bg:#f4f3f0;--bg2:#eceae5;--bg3:#e4e2dc;--card:#ffffff;--card2:#f7f6f2;
  --border:rgba(0,0,0,0.07);--border2:rgba(0,0,0,0.13);
  --accent:#e8521a;--accent2:#d48000;--accent3:#e0195a;
  --blue:#1a6fd4;--green:#00956a;--purple:#8b3fd4;--cyan:#008fb5;
  --text:#1a1a2e;--text2:#52526a;--text3:#a0a0b8;
  --glow-o:0 0 40px rgba(232,82,26,0.14);
  --nav-bg:rgba(244,243,240,0.94);
  --ticker-bg:linear-gradient(90deg,#fff0ea,#f0eaf8,#eaf3fc);
  --shadow:0 4px 24px rgba(0,0,0,0.10);
}

body{background:var(--bg);color:var(--text);font-family:'DM Sans',sans-serif;font-size:15px;min-height:100vh;overflow-x:hidden;}
html{transition:background 0.25s;}
html, body{transition:background 0.25s,color 0.25s;}
::-webkit-scrollbar{width:3px;} ::-webkit-scrollbar-thumb{background:var(--border2);border-radius:4px;}

/* ── TICKER ── */
.ticker-wrap{background:var(--ticker-bg);border-bottom:1px solid var(--border);overflow:hidden;height:36px;display:flex;align-items:center;position:fixed;top:0;left:0;right:0;z-index:200;}
.ticker-label{background:var(--accent);color:white;font-size:11px;font-weight:700;padding:4px 12px;letter-spacing:1.5px;white-space:nowrap;margin-right:16px;flex-shrink:0;}
.ticker-track{display:flex;gap:0;animation:ticker 30s linear infinite;white-space:nowrap;}
.ticker-track:hover{animation-play-state:paused;}
.ticker-item{font-size:12px;color:var(--text2);padding:0 32px;border-right:1px solid var(--border);}
.ticker-item span{color:var(--accent2);margin-right:6px;}
@keyframes ticker{0%{transform:translateX(0);}100%{transform:translateX(-50%);}}

/* ── NAV ── */
.nav{position:fixed;top:36px;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:0 28px;height:60px;background:var(--nav-bg);backdrop-filter:blur(24px);border-bottom:1px solid var(--border);}
.nav-logo{display:flex;align-items:center;gap:10px;cursor:pointer;position:relative;}
.nav-logo-tooltip{
  display:none;
  position:absolute;
  top:calc(100% + 12px);
  left:50%;
  transform:translateX(-50%);
  background:var(--card);
  border:1px solid var(--border2);
  color:var(--text);
  font-family:'Syne',sans-serif;
  font-weight:700;
  font-size:13px;
  padding:7px 16px;
  border-radius:10px;
  white-space:nowrap;
  pointer-events:none;
  z-index:999;
  letter-spacing:0.3px;
  box-shadow:var(--shadow);
}
.nav-logo-tooltip::before{
  content:'';
  position:absolute;
  bottom:100%;
  left:50%;
  transform:translateX(-50%);
  border:5px solid transparent;
  border-bottom-color:var(--border2);
}
.nav-logo:hover .nav-logo-tooltip{display:block;}

.nav-tabs{display:flex;gap:2px;}
.nav-tab{display:flex;align-items:center;gap:6px;padding:7px 14px;border-radius:8px;cursor:pointer;font-size:13px;font-weight:500;color:var(--text2);transition:all 0.2s;border:none;background:none;}
.nav-tab:hover{color:var(--text);background:var(--card);}
.nav-tab.active{color:var(--accent);background:rgba(255,107,53,0.1);}
html.light-mode .nav-tab.active{background:rgba(232,82,26,0.08);}
.notif-badge{background:var(--accent3);color:white;border-radius:50%;width:16px;height:16px;font-size:9px;font-weight:700;display:flex;align-items:center;justify-content:center;margin-left:-4px;margin-top:-8px;}
.nav-right{display:flex;align-items:center;gap:10px;}
.nav-avatar{width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--accent3));display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;cursor:pointer;border:2px solid var(--border2);}

/* ── THEME TOGGLE ── */
.theme-toggle{
  display:flex;align-items:center;justify-content:center;
  width:36px;height:36px;border-radius:50%;
  border:1px solid var(--border2);
  background:var(--card);
  cursor:pointer;transition:all 0.2s;
  color:var(--text2);flex-shrink:0;
}
.theme-toggle:hover{border-color:var(--accent);color:var(--accent);transform:scale(1.05);}

/* ── LAYOUT ── */
.main-layout{display:grid;grid-template-columns:240px 1fr 290px;gap:20px;max-width:1200px;margin:0 auto;padding:112px 20px 40px;min-height:100vh;}
.auth-page{min-height:100vh;display:grid;grid-template-columns:1fr 1fr;}
.auth-left{background:radial-gradient(ellipse at 30% 40%,rgba(255,107,53,0.12) 0%,transparent 60%),radial-gradient(ellipse at 70% 70%,rgba(61,139,255,0.1) 0%,transparent 60%),var(--bg);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px;position:relative;overflow:hidden;}
html.light-mode .auth-left{background:radial-gradient(ellipse at 30% 40%,rgba(232,82,26,0.09) 0%,transparent 60%),radial-gradient(ellipse at 70% 70%,rgba(26,111,212,0.07) 0%,transparent 60%),var(--bg);}
.auth-glow{position:absolute;border-radius:50%;filter:blur(80px);pointer-events:none;}
.auth-right{background:var(--bg2);display:flex;align-items:center;justify-content:center;padding:60px;}
.auth-form-box{width:100%;max-width:400px;}
.auth-form-box h2{font-family:'Syne',sans-serif;font-size:27px;font-weight:800;margin-bottom:6px;}
.auth-form-box p{color:var(--text2);font-size:14px;margin-bottom:28px;}
.form-group{margin-bottom:15px;}
.form-label{display:block;font-size:12.5px;font-weight:500;color:var(--text2);margin-bottom:7px;letter-spacing:0.3px;}
.form-input{width:100%;padding:11px 14px;border-radius:var(--rs);background:var(--card);border:1px solid var(--border2);color:var(--text);font-family:'DM Sans',sans-serif;font-size:14px;outline:none;transition:all 0.2s;}
.form-input:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(255,107,53,0.12);}
.form-input::placeholder{color:var(--text3);}
.btn-primary{width:100%;padding:12px;border-radius:var(--rs);background:linear-gradient(135deg,var(--accent),var(--accent2));color:white;font-family:'DM Sans',sans-serif;font-weight:600;font-size:14px;border:none;cursor:pointer;transition:all 0.2s;margin-top:6px;}
.btn-primary:hover{transform:translateY(-1px);box-shadow:var(--glow-o);}
.auth-switch{margin-top:20px;text-align:center;font-size:13px;color:var(--text2);}
.auth-switch span{color:var(--accent);cursor:pointer;font-weight:500;}
.auth-error{background:rgba(255,61,113,0.1);border:1px solid rgba(255,61,113,0.3);border-radius:8px;padding:9px 13px;font-size:13px;color:#ff6b8a;margin-bottom:14px;}

/* ── SIDEBAR ── */
.sidebar-nav{display:flex;flex-direction:column;gap:3px;}
.snav-item{display:flex;align-items:center;gap:11px;padding:10px 14px;border-radius:var(--rs);cursor:pointer;font-size:13.5px;font-weight:500;color:var(--text2);transition:all 0.2s;border:none;background:none;width:100%;text-align:left;}
.snav-item:hover{color:var(--text);background:var(--card);}
.snav-item.active{color:var(--accent);background:rgba(255,107,53,0.1);}
html.light-mode .snav-item.active{background:rgba(232,82,26,0.08);}
.sidebar-mini-profile{background:var(--card);border-radius:var(--r);padding:18px;margin-bottom:14px;border:1px solid var(--border);}
.mini-avatar{width:52px;height:52px;border-radius:50%;margin:0 auto 10px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:18px;}
.mini-name{font-family:'Syne',sans-serif;font-weight:700;font-size:14.5px;text-align:center;margin-bottom:3px;}
.mini-handle{color:var(--text2);font-size:12px;text-align:center;margin-bottom:14px;}
.mini-stats{display:grid;grid-template-columns:1fr 1fr;gap:6px;}
.mini-stat{background:var(--bg3);border-radius:8px;padding:8px;text-align:center;}
.mini-stat-val{font-weight:700;font-size:17px;font-family:'Syne',sans-serif;}
.mini-stat-lbl{color:var(--text3);font-size:10px;margin-top:1px;}

/* ── CARDS ── */
.card{background:var(--card);border-radius:var(--r);padding:18px;border:1px solid var(--border);transition:border-color 0.2s,background 0.25s;}
.card:hover{border-color:var(--border2);}
.section-title{font-size:10.5px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--text3);margin-bottom:14px;}

/* ── POST CARD ── */
.post-card{margin-bottom:14px;}
.post-header{display:flex;align-items:center;gap:10px;margin-bottom:12px;}
.post-avatar{width:40px;height:40px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;}
.post-meta{flex:1;}
.post-author{font-weight:600;font-size:14px;}
.post-time{color:var(--text3);font-size:11.5px;margin-top:1px;}
.post-badge{padding:3px 9px;border-radius:20px;font-size:10px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;}
.post-title{font-family:'Syne',sans-serif;font-weight:700;font-size:17px;margin-bottom:7px;line-height:1.35;}
.post-body{color:var(--text2);font-size:14px;line-height:1.7;margin-bottom:12px;}
.post-actions{display:flex;align-items:center;gap:4px;padding-top:10px;border-top:1px solid var(--border);flex-wrap:wrap;}
.pab{display:flex;align-items:center;gap:5px;background:none;border:none;color:var(--text2);font-size:13px;font-family:'DM Sans',sans-serif;cursor:pointer;padding:5px 9px;border-radius:8px;transition:all 0.2s;}
.pab:hover{background:var(--card2);color:var(--text);}
.pab.active-like{color:#ff6b8a;}
.pab.del:hover{color:#ff5555;background:rgba(255,85,85,0.1);}
.reactions-bar{display:flex;gap:4px;margin-top:8px;flex-wrap:wrap;}
.rxn-btn{background:var(--bg3);border:1px solid var(--border);border-radius:20px;padding:4px 10px;cursor:pointer;font-size:13px;transition:all 0.2s;display:flex;align-items:center;gap:4px;}
.rxn-btn:hover{border-color:var(--accent);transform:scale(1.1);}
.rxn-btn.active{background:rgba(255,107,53,0.15);border-color:var(--accent);}
.rxn-count{font-size:11px;color:var(--text2);}
.comments-box{margin-top:12px;padding-top:12px;border-top:1px solid var(--border);}
.comment-row{display:flex;gap:8px;margin-bottom:8px;}
.comment-av{width:26px;height:26px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;}
.comment-bubble{background:var(--bg3);border-radius:8px;padding:7px 11px;flex:1;}
.comment-author{font-weight:600;font-size:12px;margin-bottom:2px;}
.comment-text{color:var(--text2);font-size:13px;}
.comment-input-row{display:flex;gap:7px;margin-top:8px;}
.comment-input{flex:1;background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:7px 11px;color:var(--text);font-family:'DM Sans',sans-serif;font-size:13px;outline:none;}
.comment-input:focus{border-color:var(--accent);}
.btn-cmt{padding:7px 13px;border-radius:8px;background:var(--accent);color:white;border:none;font-size:12px;font-weight:600;cursor:pointer;}

/* ── CREATE BOX ── */
.create-box{margin-bottom:16px;}
.create-textarea{width:100%;background:var(--bg3);border:1px solid var(--border2);border-radius:var(--rs);padding:12px 14px;color:var(--text);font-family:'DM Sans',sans-serif;font-size:14px;resize:none;outline:none;transition:all 0.2s;min-height:75px;line-height:1.6;}
.create-textarea:focus{border-color:var(--accent);}
.create-textarea::placeholder{color:var(--text3);}
.create-footer{display:flex;align-items:center;gap:8px;margin-top:10px;flex-wrap:wrap;}
.c-input{background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:7px 11px;color:var(--text);font-family:'DM Sans',sans-serif;font-size:13px;outline:none;}
.c-input:focus{border-color:var(--accent);}
.btn-share{padding:8px 18px;border-radius:8px;background:linear-gradient(135deg,var(--accent),var(--accent2));color:white;font-family:'DM Sans',sans-serif;font-weight:600;font-size:13px;border:none;cursor:pointer;transition:all 0.2s;margin-left:auto;}
.btn-share:hover{transform:translateY(-1px);box-shadow:0 4px 20px rgba(255,107,53,0.3);}

/* ── LEADERBOARD ── */
.lb-item{display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--border);}
.lb-item:last-child{border-bottom:none;}
.lb-rank{font-family:'Syne',sans-serif;font-weight:800;font-size:18px;width:28px;text-align:center;}
.lb-rank.gold{color:#fbbf24;}.lb-rank.silver{color:#94a3b8;}.lb-rank.bronze{color:#cd7f32;}
.lb-av{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;flex-shrink:0;}
.lb-info{flex:1;}.lb-name{font-weight:600;font-size:13.5px;}.lb-sub{color:var(--text3);font-size:11.5px;}
.lb-score{font-family:'Syne',sans-serif;font-weight:700;font-size:15px;color:var(--accent2);}

/* ── MAP ── */
.campus-map{position:relative;background:var(--bg3);border-radius:var(--rs);overflow:hidden;height:340px;border:1px solid var(--border);}
.map-grid{position:absolute;inset:0;background-image:linear-gradient(var(--border) 1px,transparent 1px),linear-gradient(90deg,var(--border) 1px,transparent 1px);background-size:40px 40px;}
.map-building{position:absolute;background:var(--card2);border:1px solid var(--border2);border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:9px;color:var(--text3);text-align:center;cursor:pointer;transition:all 0.2s;}
.map-building:hover{border-color:var(--accent);color:var(--accent);}
.map-pin{position:absolute;transform:translate(-50%,-100%);cursor:pointer;z-index:10;transition:all 0.2s;}
.map-pin:hover{transform:translate(-50%,-100%) scale(1.2);}
.map-pin-dot{width:12px;height:12px;border-radius:50%;border:2px solid white;position:relative;}
.map-pin-dot::after{content:'';position:absolute;bottom:-6px;left:50%;transform:translateX(-50%);border-left:5px solid transparent;border-right:5px solid transparent;border-top:6px solid white;}
.map-tooltip{position:absolute;background:var(--card);border:1px solid var(--border2);border-radius:8px;padding:8px 12px;font-size:11px;white-space:nowrap;z-index:20;bottom:calc(100% + 8px);left:50%;transform:translateX(-50%);pointer-events:none;}
.map-tooltip::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border-left:5px solid transparent;border-right:5px solid transparent;border-top:5px solid var(--border2);}

/* ── CALENDAR ── */
.cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:3px;}
.cal-header{font-size:10.5px;color:var(--text3);text-align:center;padding:4px 0;font-weight:600;}
.cal-day{aspect-ratio:1;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:13px;cursor:pointer;position:relative;transition:all 0.2s;}
.cal-day:hover{background:var(--card2);}
.cal-day.has-event::after{content:'';position:absolute;bottom:2px;left:50%;transform:translateX(-50%);width:4px;height:4px;border-radius:50%;background:var(--accent);}
.cal-day.selected{background:var(--accent);color:white;}
.cal-day.today{border:1px solid var(--accent);color:var(--accent);}
.cal-day.other-month{color:var(--text3);}
.event-item{padding:10px 0;border-bottom:1px solid var(--border);display:flex;gap:10px;align-items:flex-start;}
.event-item:last-child{border-bottom:none;}
.event-date-badge{background:var(--bg3);border-radius:8px;padding:6px 8px;text-align:center;min-width:44px;flex-shrink:0;}
.event-date-num{font-family:'Syne',sans-serif;font-weight:800;font-size:18px;line-height:1;}
.event-date-mon{font-size:9px;color:var(--text3);text-transform:uppercase;margin-top:1px;}
.event-info{flex:1;}.event-name{font-weight:600;font-size:13.5px;margin-bottom:2px;}.event-meta{color:var(--text3);font-size:11.5px;}
.btn-rsvp{padding:5px 12px;border-radius:20px;font-size:11.5px;font-weight:600;border:1px solid var(--green);background:transparent;color:var(--green);cursor:pointer;transition:all 0.2s;flex-shrink:0;}
.btn-rsvp:hover{background:var(--green);color:#07070d;}
.btn-rsvp.rsvpd{background:rgba(0,229,160,0.15);border-color:var(--green);}
.btn-reminder{padding:5px 10px;border-radius:20px;font-size:10.5px;font-weight:600;border:1px solid var(--blue);background:transparent;color:var(--blue);cursor:pointer;transition:all 0.2s;margin-left:4px;}
.btn-reminder:hover{background:var(--blue);color:white;}
.btn-reminder.set{background:rgba(61,139,255,0.15);}

/* ── ANALYTICS ── */
.analytics-bar-row{display:flex;align-items:center;gap:8px;margin-bottom:8px;}
.analytics-label{font-size:12px;color:var(--text2);width:70px;flex-shrink:0;}
.analytics-bar-bg{flex:1;background:var(--bg3);border-radius:4px;height:8px;overflow:hidden;}
.analytics-bar-fill{height:100%;border-radius:4px;transition:width 0.8s ease;}
.analytics-val{font-size:11.5px;color:var(--text3);width:30px;text-align:right;flex-shrink:0;}

/* ── CONFESSIONS ── */
.confession-card{background:var(--bg3);border-radius:var(--rs);padding:14px;margin-bottom:10px;border:1px solid var(--border);border-left:3px solid var(--purple);}
.confession-text{font-size:14px;line-height:1.7;color:var(--text);font-style:italic;margin-bottom:8px;}
.confession-footer{display:flex;align-items:center;gap:8px;}
.confession-tag{font-size:10.5px;color:var(--purple);background:rgba(192,132,252,0.1);padding:2px 8px;border-radius:20px;}
.spider-wrap{display:flex;justify-content:center;margin:8px 0;}

/* ── PROFILE ── */
.profile-cover{height:160px;border-radius:var(--r) var(--r) 0 0;background:linear-gradient(135deg,#1a0a0f,#0a0518,#051018);position:relative;overflow:hidden;}
html.light-mode .profile-cover{background:linear-gradient(135deg,#f5ddd4,#ede4f5,#d4e8f5);}
.profile-cover::after{content:'';position:absolute;inset:0;background:radial-gradient(circle at 30% 50%,rgba(255,107,53,0.25) 0%,transparent 60%),radial-gradient(circle at 75% 40%,rgba(61,139,255,0.15) 0%,transparent 55%);}
.profile-av{width:80px;height:80px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:28px;border:4px solid var(--bg);}
.profile-name{font-family:'Syne',sans-serif;font-weight:800;font-size:23px;margin-bottom:3px;}
.profile-stats-row{display:flex;gap:20px;margin:10px 0;}
.profile-stat{display:flex;flex-direction:column;}
.ps-val{font-family:'Syne',sans-serif;font-weight:700;font-size:19px;}
.ps-lbl{color:var(--text3);font-size:11.5px;}
.btn-edit{padding:7px 16px;border-radius:8px;border:1px solid var(--border2);background:var(--card2);color:var(--text);font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;cursor:pointer;transition:all 0.2s;}
.btn-edit:hover{border-color:var(--accent);color:var(--accent);}

/* ── MODALS ── */
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.65);z-index:300;display:flex;align-items:center;justify-content:center;}
html.light-mode .modal-overlay{background:rgba(0,0,0,0.35);}
.modal-box{background:var(--card);border-radius:var(--r);padding:26px;width:460px;max-width:90vw;border:1px solid var(--border2);}
.modal-title{font-family:'Syne',sans-serif;font-weight:700;font-size:18px;margin-bottom:18px;}
.modal-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:18px;}
.btn-cancel{padding:8px 18px;border-radius:8px;border:1px solid var(--border2);background:none;color:var(--text2);font-family:'DM Sans',sans-serif;font-size:13px;cursor:pointer;}
.btn-save{padding:8px 18px;border-radius:8px;background:var(--accent);color:white;border:none;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer;}

/* ── SUGGESTIONS / FOLLOW ── */
.sug-card{display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid var(--border);}
.sug-card:last-child{border-bottom:none;}
.sug-av{width:36px;height:36px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;}
.sug-info{flex:1;}.sug-name{font-weight:600;font-size:13px;}.sug-sub{color:var(--text3);font-size:11.5px;}
.btn-follow{padding:5px 13px;border-radius:20px;font-size:12px;font-weight:600;border:1px solid var(--accent);background:transparent;color:var(--accent);cursor:pointer;transition:all 0.2s;}
.btn-follow:hover{background:var(--accent);color:white;}
.btn-follow.following{background:var(--card2);border-color:var(--border2);color:var(--text2);}

/* ── TRENDING ── */
.trend-item{display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid var(--border);cursor:pointer;}
.trend-item:last-child{border-bottom:none;}
.trend-num{color:var(--text3);font-size:11.5px;width:14px;}
.trend-tag{font-weight:600;font-size:13px;transition:color 0.2s;}
.trend-item:hover .trend-tag{color:var(--accent);}
.trend-count{color:var(--text3);font-size:11.5px;margin-left:auto;}

/* ── MISC ── */
.feed-empty{text-align:center;padding:50px 20px;color:var(--text3);}
.mood-tag{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:20px;font-size:12px;font-weight:600;margin-top:6px;}
@keyframes fadeUp{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);}}
.fade-up{animation:fadeUp 0.3s ease;}

/* ── NOTIFICATION PANEL ── */
.notif-panel{position:fixed;top:100px;right:20px;width:320px;background:var(--card);border:1px solid var(--border2);border-radius:var(--r);z-index:150;box-shadow:var(--shadow);max-height:80vh;overflow-y:auto;}
.notif-header{padding:14px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;background:var(--card);z-index:1;}
.notif-title{font-family:'Syne',sans-serif;font-weight:700;font-size:14.5px;}
.notif-item{padding:12px 16px;border-bottom:1px solid var(--border);display:flex;gap:10px;align-items:flex-start;cursor:pointer;transition:background 0.2s;}
.notif-item:hover{background:var(--card2);}
.notif-item.unread{border-left:2px solid var(--accent);}
.notif-icon{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;}
.notif-text{font-size:12.5px;color:var(--text2);line-height:1.5;}
.notif-time{font-size:10.5px;color:var(--text3);margin-top:2px;}
`;

// ── Helpers ──────────────────────────────────────────────────────────────
const COLORS = ["#ff6b35","#3d8bff","#00e5a0","#c084fc","#ffab00","#ff3d71","#00d4ff","#fb923c"];
const colorOf = n => COLORS[(n||"").charCodeAt(0) % COLORS.length];
const getInitials = n => (n||"?").split(" ").map(x=>x[0]).join("").toUpperCase().slice(0,2);

const timeAgo = ts => {
  const stamp = typeof ts==="string" ? new Date(ts).getTime() : (ts||Date.now());
  const d = Math.floor((Date.now()-stamp)/1000);
  if(d<60) return `${d}s`;
  if(d<3600) return `${Math.floor(d/60)}m`;
  if(d<86400) return `${Math.floor(d/3600)}h`;
  return `${Math.floor(d/86400)}d`;
};

const postTime = p => p.ts||(p.createdAt ? new Date(p.createdAt).getTime() : Date.now());
const getId = obj => {
  if(!obj) return undefined;
  const id = obj._id||obj.id;
  return id ? id.toString() : undefined;
};

const API = "http://localhost:5000/api";
const apiFetch = (path,opts={}) => fetch(`${API}${path}`,{credentials:"include",...opts});
const apiJSON = (path,opts={}) => apiFetch(path,{headers:{"Content-Type":"application/json"},...opts});

const BADGE = {
  campus:{bg:"rgba(61,139,255,0.15)",c:"#3d8bff"},
  event:{bg:"rgba(0,229,160,0.15)",c:"#00e5a0"},
  alert:{bg:"rgba(255,61,113,0.15)",c:"#ff6b8a"},
  news:{bg:"rgba(255,107,53,0.15)",c:"#ff8c5a"},
  sports:{bg:"rgba(192,132,252,0.15)",c:"#c084fc"},
  general:{bg:"rgba(255,255,255,0.07)",c:"#8888a8"},
};
const REACTIONS = ["🔥","❤️","😮","😂","👏","💡"];
const MOODS = ["😊 Happy","😮 Shocked","😡 Angry","🤔 Curious","😢 Sad","🎉 Excited"];

const SEED_EVENTS = [
  {id:"e1",name:"TechXplosion 2024",date:"2024-11-10",time:"9:00 AM",location:"Tech Park",tag:"event",rsvps:[]},
  {id:"e2",name:"Cricket Semi-Finals",date:"2024-11-09",time:"3:00 PM",location:"Sports Ground",tag:"sports",rsvps:[]},
  {id:"e3",name:"Photography Exhibition",date:"2024-11-15",time:"10:00 AM",location:"Arts Block",tag:"event",rsvps:[]},
  {id:"e4",name:"React Workshop",date:"2024-11-08",time:"5:00 PM",location:"Lab 4B",tag:"general",rsvps:[]},
  {id:"e5",name:"End-Sem Exams Begin",date:"2024-11-18",time:"9:00 AM",location:"Exam Hall",tag:"campus",rsvps:[]},
];

const SEED_CONFESSIONS = [
  {id:"cf1",text:"I studied all night for the wrong subject. Showed up to the wrong exam. Somehow passed. Campus life is truly something.",tag:"Academic",likes:42,ts:Date.now()-3600000},
  {id:"cf2",text:"The canteen pasta is genuinely the best thing about this college. I will fight anyone who disagrees.",tag:"Food",likes:87,ts:Date.now()-7200000},
  {id:"cf3",text:"Accidentally called my professor 'uncle' in class. He laughed. I died inside. 3 years ago and it still haunts me.",tag:"Awkward",likes:124,ts:Date.now()-86400000},
  {id:"cf4",text:"I've been attending the wrong tutorial for 3 weeks. The actual class is at the same time in the next building.",tag:"Academic",likes:56,ts:Date.now()-172800000},
];

const TICKER_ITEMS = [
  {e:"⚡",t:"BREAKING: Semester exams begin Nov 18 — check portal for hall tickets"},
  {e:"🎉",t:"TechXplosion 2024 registrations close Nov 10 — 12 events, ₹2L+ prizes"},
  {e:"🏏",t:"Cricket Semi-Finals: VIT vs SRM this Saturday 3PM at Ground 2"},
  {e:"📸",t:"Photography Exhibition accepting entries — Theme: Urban Life — Deadline Nov 15"},
  {e:"🍕",t:"React Workshop Friday 5PM Lab 4B — Free pizza for all attendees"},
  {e:"🚨",t:"Library hours extended till 11PM during exam season"},
];

// ── Spider Chart ──────────────────────────────────────────────────────────
const SpiderChart = ({data}) => {
  const cx=100,cy=100,r=72,keys=Object.keys(data),n=keys.length;
  const angle = i=>(i/n)*2*Math.PI-Math.PI/2;
  const pt = (i,s)=>({x:cx+r*s*Math.cos(angle(i)),y:cy+r*s*Math.sin(angle(i))});
  const webs = [0.25,0.5,0.75,1].map(s=>
    keys.map((_,i)=>pt(i,s)).map((p,i)=>`${i===0?"M":"L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ")+"Z"
  );
  const dataPath = keys.map((k,i)=>pt(i,Math.min(1,(data[k]||0)/100)))
    .map((p,i)=>`${i===0?"M":"L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ")+"Z";
  return (
    <svg width="200" height="200" viewBox="0 0 200 200">
      {webs.map((d,i)=><path key={i} d={d} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>)}
      {keys.map((_,i)=>{const p=pt(i,1);return <line key={i} x1={cx} y1={cy} x2={p.x.toFixed(1)} y2={p.y.toFixed(1)} stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>;})}
      <path d={dataPath} fill="rgba(255,107,53,0.18)" stroke="#ff6b35" strokeWidth="2"/>
      {keys.map((k,i)=>{const p=pt(i,Math.min(1,(data[k]||0)/100));return <circle key={i} cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r="4" fill="#ff6b35"/>;})}
      {keys.map((k,i)=>{const p=pt(i,1.28);return <text key={i} x={p.x.toFixed(1)} y={p.y.toFixed(1)} textAnchor="middle" dominantBaseline="central" fontSize="9" fill="#8888a8" fontFamily="DM Sans">{k}</text>;})}
    </svg>
  );
};

const DogLogo = ({size=34}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="50" r="48" fill="url(#dg)"/>
    <defs><radialGradient id="dg" cx="40%" cy="30%"><stop offset="0%" stopColor="#ff9500"/><stop offset="100%" stopColor="#ff3d71"/></radialGradient></defs>
    <ellipse cx="28" cy="35" rx="12" ry="16" fill="#c2410c" transform="rotate(-20 28 35)"/>
    <ellipse cx="72" cy="35" rx="12" ry="16" fill="#c2410c" transform="rotate(20 72 35)"/>
    <ellipse cx="28" cy="36" rx="7" ry="11" fill="#fb923c" transform="rotate(-20 28 36)"/>
    <ellipse cx="72" cy="36" rx="7" ry="11" fill="#fb923c" transform="rotate(20 72 36)"/>
    <ellipse cx="50" cy="55" rx="28" ry="26" fill="#fdba74"/>
    <ellipse cx="50" cy="65" rx="15" ry="10" fill="#fed7aa"/>
    <ellipse cx="50" cy="60" rx="6" ry="4" fill="#1c1917"/>
    <circle cx="48" cy="59" r="1.5" fill="white" opacity="0.7"/>
    <circle cx="38" cy="50" r="5" fill="#1c1917"/><circle cx="62" cy="50" r="5" fill="#1c1917"/>
    <circle cx="39.5" cy="48.5" r="1.5" fill="white"/><circle cx="63.5" cy="48.5" r="1.5" fill="white"/>
    <path d="M42 68 Q50 74 58 68" stroke="#c2410c" strokeWidth="2" fill="none" strokeLinecap="round"/>
    <rect x="30" y="76" width="40" height="7" rx="3.5" fill="#3d8bff"/>
    <circle cx="50" cy="79.5" r="3" fill="#fbbf24"/>
  </svg>
);

// ── Sun / Moon icons for toggle ───────────────────────────────────────────
const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);

const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

// ── PostCard ──────────────────────────────────────────────────────────────
const PostCard = ({post,users,me,openComments,setOpenComments,commentInputs,setCommentInputs,onLike,onDelete,onReaction,onAddComment,onViewUser}) => {
  const myId = getId(me);
  const postId = getId(post);
  const authorId = typeof post.userId==="object" ? getId(post.userId) : post.userId?.toString();
  const author = users.find(u=>getId(u)===authorId);
  const authorName = author?.name||"Campus User";
  const authorEmail = author?.email||"";
  const liked = (post.likes||[]).map(String).includes(myId);
  const bc = BADGE[post.tag]||BADGE.general;

  return (
    <div className="card post-card fade-up">
      <div className="post-header">
        <div className="post-avatar"
          style={{background:`linear-gradient(135deg,${colorOf(authorName)},${colorOf(authorName+"2")})`,color:"white",cursor:author?"pointer":"default"}}
          onClick={()=>author&&onViewUser(author)}>
          {getInitials(authorName)}
        </div>
        <div className="post-meta">
          <div className="post-author" style={{cursor:author?"pointer":"default"}} onClick={()=>author&&onViewUser(author)}>{authorName}</div>
          <div className="post-time">
            @{(authorEmail||"campus").split("@")[0]} · {timeAgo(postTime(post))} ago
            {post.location && ` · 📍${post.location}`}
          </div>
        </div>
        <span className="post-badge" style={{background:bc.bg,color:bc.c}}>{post.tag}</span>
      </div>
      {post.mood && <div className="mood-tag" style={{background:"rgba(255,255,255,0.05)",color:"var(--text2)",fontSize:12,marginBottom:8}}>{post.mood}</div>}
      <div className="post-title">{post.title}</div>
      <div className="post-body">{post.body}</div>
      <div className="reactions-bar">
        {REACTIONS.map(e=>{
          const arr=(post.reactions?.[e]||[]).map(String);
          const active=arr.includes(myId);
          return (
            <button key={e} className={`rxn-btn ${active?"active":""}`} onClick={()=>onReaction(postId,e)}>
              {e}{arr.length>0&&<span className="rxn-count">{arr.length}</span>}
            </button>
          );
        })}
      </div>
      <div className="post-actions" style={{marginTop:8}}>
        <button className={`pab ${liked?"active-like":""}`} onClick={()=>onLike(postId)}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill={liked?"currentColor":"none"} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          {(post.likes||[]).length}
        </button>
        <button className="pab" onClick={()=>setOpenComments(p=>({...p,[postId]:!p[postId]}))}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          {(post.comments||[]).length}
        </button>
        {authorId===myId&&(
          <button className="pab del" onClick={()=>onDelete(postId)} style={{marginLeft:"auto"}}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M9 6V4h6v2"/>
            </svg> Delete
          </button>
        )}
      </div>
      {openComments[postId]&&(
        <div className="comments-box">
          {(post.comments||[]).map(c=>{
            const cu=users.find(u=>getId(u)===c.userId?.toString());
            return (
              <div className="comment-row" key={c.id||c._id||Math.random()}>
                <div className="comment-av" style={{background:`linear-gradient(135deg,${colorOf(cu?.name||"")},${colorOf((cu?.name||"")+"x")})`,color:"white"}}>{getInitials(cu?.name||"?")}</div>
                <div className="comment-bubble">
                  <div className="comment-author">{cu?.name||"User"}</div>
                  <div className="comment-text">{c.text}</div>
                </div>
              </div>
            );
          })}
          <div className="comment-input-row">
            <input className="comment-input" placeholder="Add a comment..."
              value={commentInputs[postId]||""}
              onChange={e=>setCommentInputs(p=>({...p,[postId]:e.target.value}))}
              onKeyDown={e=>e.key==="Enter"&&onAddComment(postId)}/>
            <button className="btn-cmt" onClick={()=>onAddComment(postId)}>Post</button>
          </div>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
export default function App() {
  const [isDark, setIsDark] = useState(true);

  // Inject stylesheet into <head> once — required so html.light-mode selectors work
  useEffect(() => {
    let tag = document.getElementById("nau-styles");
    if (!tag) {
      tag = document.createElement("style");
      tag.id = "nau-styles";
      document.head.appendChild(tag);
    }
    tag.textContent = STYLES;
  }, []);

  // Toggle light/dark by adding class to <html> element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.remove("light-mode");
    } else {
      document.documentElement.classList.add("light-mode");
    }
  }, [isDark]);

  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [events] = useState(SEED_EVENTS);
  const [confessions, setConfessions] = useState(SEED_CONFESSIONS);
  const [currentUser, setCurrentUser] = useState(null);
  const [page, setPage] = useState("login");
  const [authMode, setAuthMode] = useState("login");
  const [activeTab, setActiveTab] = useState("home");
  const [authForm, setAuthForm] = useState({name:"",email:"",password:""});
  const [authError, setAuthError] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [newTag, setNewTag] = useState("general");
  const [newMood, setNewMood] = useState("😊 Happy");
  const [newLocation, setNewLocation] = useState("");
  const [editModal, setEditModal] = useState(false);
  const [editBio, setEditBio] = useState("");
  const [openComments, setOpenComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [showNotif, setShowNotif] = useState(false);
  const [hoveredPin, setHoveredPin] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [reminders, setReminders] = useState({});
  const [rsvps, setRsvps] = useState({});
  const [confessionLikes, setConfessionLikes] = useState({});
  const [newConfession, setNewConfession] = useState("");
  const [viewedUser, setViewedUser] = useState(null);
  const [showListModal, setShowListModal] = useState(false);
  const [listModalType, setListModalType] = useState("");
  const [listModalUsers, setListModalUsers] = useState([]);
  const [viewedUserPosts, setViewedUserPosts] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);



  const me = currentUser;
  const myId = getId(me);
  const myFollowing = (me?.following||[]).map(String);

  // ── Data fetching ──────────────────────────────────────────────────────
  const fetchPosts = useCallback(async () => {
    try {
      const res = await apiFetch("/posts");
      if(!res.ok) return;
      const data = await res.json();
      setPosts(data.map(p=>({...p,reactions:p.reactions||{},likes:(p.likes||[]).map(String),comments:p.comments||[]})));
    } catch(e){console.log("fetchPosts error:",e);}
  },[]);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await apiFetch("/users");
      if(!res.ok) return;
      setUsers(await res.json());
    } catch(e){console.log("fetchUsers error:",e);}
  },[]);

  const fetchMe = useCallback(async () => {
    try {
      const res = await apiFetch("/users/me");
      if(!res.ok) return;
      setCurrentUser(await res.json());
    } catch(e){console.log("fetchMe error:",e);}
  },[]);

  const fetchRequests = useCallback(async () => {
    try {
      const res = await apiFetch("/users/requests");
      if(res.ok) setPendingRequests(await res.json());
    } catch(e){console.log("fetchRequests error:",e);}
  },[]);

  useEffect(() => {
    if(page==="app"){fetchPosts();fetchUsers();fetchMe();fetchRequests();}
  },[page]);

  useEffect(() => {
    if(page!=="app") return;
    const id = setInterval(()=>{fetchPosts();fetchMe();fetchRequests();},30000);
    return ()=>clearInterval(id);
  },[page]);

  useEffect(() => {
    if(viewedUser){
      apiFetch(`/posts/user/${getId(viewedUser)}`)
        .then(r=>r.json())
        .then(data=>setViewedUserPosts(data.map(p=>({...p,reactions:p.reactions||{},likes:(p.likes||[]).map(String),comments:p.comments||[]}))))
        .catch(e=>console.log("viewedUser posts error:",e));
    }
  },[viewedUser]);

  // ── AUTH ──────────────────────────────────────────────────────────────
  const handleAuth = async () => {
    setAuthError("");
    try {
      const endpoint = authMode==="register" ? "/auth/signup" : "/auth/login";
      if(authMode==="register"&&(!authForm.name||!authForm.email||!authForm.password))
        return setAuthError("All fields required.");
      if(!authForm.email||!authForm.password) return setAuthError("Email and password required.");
      const res = await apiJSON(endpoint,{
        method:"POST",
        body:JSON.stringify(authMode==="register"
          ?{name:authForm.name,email:authForm.email,password:authForm.password}
          :{email:authForm.email,password:authForm.password}),
      });
      const data = await res.json();
      if(!res.ok) return setAuthError(data.error||"Auth failed");
      setCurrentUser(data);
      setPage("app");
    } catch(e){setAuthError("Server connection failed");}
  };

  const handleViewUser = user => {
    if(getId(user)===myId){setViewedUser(null);}
    else setViewedUser(user);
    setActiveTab("profile");
    setShowListModal(false);
  };

  const logout = async () => {
    await apiFetch("/auth/logout",{method:"POST"});
    setCurrentUser(null);setPosts([]);setUsers([]);
    setPage("login");setAuthForm({name:"",email:"",password:""});
  };

  // ── FEED ─────────────────────────────────────────────────────────────
  const feedPosts = [...posts].sort((a,b)=>postTime(b)-postTime(a));
  const displayedUser = viewedUser||me;
  const profilePosts = (viewedUser ? viewedUserPosts : posts.filter(p=>{
    const aid = typeof p.userId==="object" ? getId(p.userId) : p.userId?.toString();
    return aid===myId;
  })).sort((a,b)=>postTime(b)-postTime(a));

  // ── POST ACTIONS ──────────────────────────────────────────────────────
  const likePost = async pid => {
    setPosts(prev=>prev.map(x=>{
      if(getId(x)!==pid) return x;
      const likes = x.likes.map(String).includes(myId)
        ? x.likes.filter(id=>id.toString()!==myId)
        : [...x.likes,myId];
      return {...x,likes};
    }));
    try {
      const res = await apiJSON(`/posts/${pid}/like`,{method:"POST"});
      if(res.ok){
        const updated = await res.json();
        setPosts(prev=>prev.map(x=>getId(x)===pid?{...x,likes:(updated.likes||[]).map(String),reactions:updated.reactions||x.reactions}:x));
      }
    } catch(e){console.log("likePost error:",e);}
  };

  const deletePost = async pid => {
    setPosts(prev=>prev.filter(x=>getId(x)!==pid));
    try{await apiFetch(`/posts/${pid}`,{method:"DELETE"});}catch(e){console.log("deletePost error:",e);}
  };

  const addReaction = async (pid,emoji) => {
    setPosts(prev=>prev.map(x=>{
      if(getId(x)!==pid) return x;
      const r={...(x.reactions||{})};
      const arr=(r[emoji]||[]).map(String);
      r[emoji]=arr.includes(myId)?arr.filter(id=>id!==myId):[...arr,myId];
      return {...x,reactions:r};
    }));
    try {
      const res = await apiJSON(`/posts/${pid}/react`,{method:"POST",body:JSON.stringify({emoji})});
      if(res.ok){
        const updated = await res.json();
        setPosts(prev=>prev.map(x=>getId(x)===pid?{...x,reactions:updated.reactions||x.reactions}:x));
      }
    } catch(e){console.log("addReaction error:",e);}
  };

  const createPost = async () => {
    if(!newTitle.trim()||!newBody.trim()) return;
    try {
      const res = await apiJSON("/posts",{
        method:"POST",
        body:JSON.stringify({
          title:newTitle,body:newBody,tag:newTag,
          mood:newMood,location:newLocation||"Campus",
          mapX:Math.random()*70+15,mapY:Math.random()*60+20,
        }),
      });
      if(!res.ok) return;
      const data = await res.json();
      const normalized = {...data,likes:(data.likes||[]).map(String),reactions:data.reactions||{},comments:data.comments||[]};
      setPosts(prev=>[normalized,...prev]);
      setNewTitle("");setNewBody("");setNewTag("general");setNewMood("😊 Happy");setNewLocation("");
    } catch(e){console.log("createPost error:",e);}
  };

  const addComment = async pid => {
    const text = (commentInputs[pid]||"").trim();
    if(!text) return;
    setCommentInputs(p=>({...p,[pid]:""}));
    setPosts(prev=>prev.map(x=>getId(x)!==pid?x:{
      ...x,comments:[...(x.comments||[]),{id:"c"+Date.now(),userId:myId,text,ts:Date.now()}]
    }));
    try {
      const res = await apiJSON(`/posts/${pid}/comment`,{method:"POST",body:JSON.stringify({text})});
      if(res.ok){
        const updated = await res.json();
        setPosts(prev=>prev.map(x=>getId(x)===pid?{...x,comments:updated.comments||x.comments}:x));
      }
    } catch(e){console.log("addComment error:",e);}
  };

  // ── USER ACTIONS ──────────────────────────────────────────────────────
  const followUser = async uid => {
    try {
      const res = await apiJSON(`/users/${uid}/follow`,{method:"POST"});
      if(res.ok){await Promise.all([fetchUsers(),fetchMe()]);}
    } catch(e){console.log("followUser error:",e);}
  };

  const acceptRequest = async uid => {
    try {
      const res = await apiJSON(`/users/${uid}/accept`,{method:"POST"});
      if(res.ok){await Promise.all([fetchUsers(),fetchMe(),fetchRequests()]);}
    } catch(e){console.log("acceptRequest error:",e);}
  };

  const declineRequest = async uid => {
    try {
      await apiJSON(`/users/${uid}/decline`,{method:"POST"});
      await Promise.all([fetchRequests(),fetchMe()]);
    } catch(e){console.log("declineRequest error:",e);}
  };

  const saveProfile = async () => {
    try {
      const res = await apiJSON("/users/me",{method:"PUT",body:JSON.stringify({bio:editBio})});
      if(res.ok){
        const updated = await res.json();
        setCurrentUser(updated);
        setUsers(prev=>prev.map(u=>getId(u)===myId?{...u,bio:editBio}:u));
      }
    } catch(e){console.log("saveProfile error:",e);}
    setEditModal(false);
  };

  const toggleRsvp = eid=>setRsvps(p=>({...p,[eid]:!p[eid]}));
  const toggleReminder = eid=>setReminders(p=>({...p,[eid]:!p[eid]}));
  const addConfessionLike = id=>setConfessionLikes(p=>({...p,[id]:(p[id]||0)+1}));
  const postConfession = () => {
    if(!newConfession.trim()) return;
    setConfessions(prev=>[{id:"cf"+Date.now(),text:newConfession.trim(),tag:"Campus",likes:0,ts:Date.now()},...prev]);
    setNewConfession("");
  };

  // ── Derived data ──────────────────────────────────────────────────────
  const leaderboard = users.map(u=>{
    const uid=getId(u);
    const uPosts=posts.filter(p=>{const pid=typeof p.userId==="object"?getId(p.userId):p.userId?.toString();return pid===uid;});
    const likesRcvd=uPosts.reduce((a,p)=>a+(p.likes||[]).length,0);
    const score=uPosts.length*10+likesRcvd*5+(u.followers||[]).length*3;
    return {...u,postCount:uPosts.length,likesRcvd,score};
  }).sort((a,b)=>b.score-a.score).slice(0,5);

  const tagCounts = posts.reduce((acc,p)=>{acc[p.tag]=(acc[p.tag]||0)+1;return acc;},{});
  const maxTag = Math.max(...Object.values(tagCounts),1);
  const moodCounts = posts.reduce((acc,p)=>{if(p.mood)acc[p.mood]=(acc[p.mood]||0)+1;return acc;},{});

  const myPostCount = profilePosts.length;
  const myLikes = posts.reduce((a,p)=>a+((p.likes||[]).map(String).includes(myId)?1:0),0);
  const myComments = posts.reduce((a,p)=>a+(p.comments||[]).filter(c=>c.userId?.toString()===myId).length,0);
  const activityData = {
    Posts:Math.min(100,myPostCount*20),
    Likes:Math.min(100,myLikes*15),
    Comments:Math.min(100,myComments*20),
    Followers:Math.min(100,(me?.followers||[]).length*25),
    Following:Math.min(100,(me?.following||[]).length*20),
  };

  const activities = (me?.activities||[]).slice().reverse();
  const unreadCount = pendingRequests.length+activities.length;

  const now = new Date();
  const calYear=now.getFullYear(),calMonth=now.getMonth();
  const firstDay=new Date(calYear,calMonth,1).getDay();
  const daysInMonth=new Date(calYear,calMonth+1,0).getDate();
  const eventDays=events.map(e=>parseInt(e.date.split("-")[2]));
  const calDays=[];
  for(let i=0;i<firstDay;i++) calDays.push({day:null});
  for(let d=1;d<=daysInMonth;d++) calDays.push({day:d,hasEvent:eventDays.includes(d)});

  const mapPins = posts.filter(p=>p.mapX&&p.mapY).slice(0,8);
  const mapBuildings = [
    {label:"Admin",x:45,y:30,w:80,h:50},{label:"Tech\nPark",x:62,y:52,w:70,h:45},
    {label:"Lab\nBlock",x:27,y:57,w:65,h:40},{label:"Arts\nBlock",x:72,y:18,w:60,h:38},
    {label:"Sports\nGround",x:12,y:66,w:65,h:50},{label:"Library",x:48,y:75,w:60,h:35},
    {label:"Canteen",x:30,y:20,w:55,h:35},
  ];

  const TABS = [
    {id:"home",label:"Home",icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>},
    {id:"notifications",label:"Notifications",icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,badge:true},
    {id:"map",label:"Map",icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>},
    {id:"calendar",label:"Events",icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>},
    {id:"leaderboard",label:"Leaders",icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>},
    {id:"confessions",label:"Confess",icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>},
    {id:"profile",label:"Profile",icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>},
  ];

  const handleTabChange = tid => {
    if(tid==="profile") setViewedUser(null);
    setActiveTab(tid);
  };

  const postCardProps = {
    users,me,openComments,setOpenComments,commentInputs,setCommentInputs,
    onLike:likePost,onDelete:deletePost,onReaction:addReaction,
    onAddComment:addComment,onViewUser:handleViewUser,
  };

  // ═════════════════════════════════════════════════════════════════════
  // AUTH PAGE
  // ═════════════════════════════════════════════════════════════════════
  if(page==="login") return (
    <>
      <div className="auth-page">
        <div className="auth-left">
          <div className="auth-glow" style={{width:300,height:300,background:"var(--accent)",top:-80,right:-80,opacity:0.12}}/>
          <div className="auth-glow" style={{width:200,height:200,background:"var(--blue)",bottom:-40,left:-40,opacity:0.1}}/>

          {/* Light/dark toggle on auth page */}
          <button
            className="theme-toggle"
            style={{position:"absolute",top:20,right:20}}
            onClick={()=>setIsDark(d=>!d)}
            title={isDark?"Switch to light mode":"Switch to dark mode"}
          >
            {isDark ? <SunIcon/> : <MoonIcon/>}
          </button>

          <div style={{position:"relative",zIndex:1,textAlign:"center"}}>
            <div style={{marginBottom:24}}><DogLogo size={80}/></div>
            <h1 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:44,lineHeight:1.1,marginBottom:14}}>
              News<br/><span style={{background:"linear-gradient(135deg,var(--accent),var(--accent2))",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Around You</span>
            </h1>
            <p style={{color:"var(--text2)",fontSize:15,lineHeight:1.7,maxWidth:320}}>Your campus pulse — live news, events, confessions & more.</p>
            <div style={{marginTop:36,display:"flex",flexDirection:"column",gap:12,width:"100%",maxWidth:300}}>
              {["🗺️ Campus map with live news pins","📊 Analytics & trending topics","🏆 Student leaderboard","📅 Events calendar with reminders","🤫 Anonymous confessions board"].map(f=>(
                <div key={f} style={{display:"flex",alignItems:"center",gap:10,color:"var(--text2)",fontSize:13.5,textAlign:"left"}}>
                  <div style={{width:6,height:6,borderRadius:"50%",background:"var(--accent)",flexShrink:0}}/>{f}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="auth-right">
          <div className="auth-form-box fade-up">
            <h2>{authMode==="login"?"Welcome back 👋":"Join the campus"}</h2>
            <p>{authMode==="login"?"Sign in to see what's happening.":"Create your account and start sharing."}</p>
            {authError&&<div className="auth-error">{authError}</div>}
            {authMode==="register"&&(
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" placeholder="Your Name" value={authForm.name} onChange={e=>setAuthForm(p=>({...p,name:e.target.value}))}/>
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-input" type="email" placeholder="name@college.edu" value={authForm.email} onChange={e=>setAuthForm(p=>({...p,email:e.target.value}))}/>
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="••••••••" value={authForm.password} onChange={e=>setAuthForm(p=>({...p,password:e.target.value}))}/>
            </div>
            <button className="btn-primary" onClick={handleAuth}>{authMode==="login"?"Sign In →":"Create Account →"}</button>
            <div className="auth-switch">
              {authMode==="login"
                ?<>No account? <span onClick={()=>{setAuthMode("register");setAuthError("");}}>Sign up</span></>
                :<>Have account? <span onClick={()=>{setAuthMode("login");setAuthError("");}}>Sign in</span></>}
            </div>
          </div>
        </div>
      </div>
    </>
  );

  // ═════════════════════════════════════════════════════════════════════
  // MAIN APP
  // ═════════════════════════════════════════════════════════════════════
  return (
    <>

      {/* TICKER */}
      <div className="ticker-wrap">
        <div className="ticker-label">⚡ LIVE</div>
        <div style={{overflow:"hidden",flex:1}}>
          <div className="ticker-track">
            {[...TICKER_ITEMS,...TICKER_ITEMS].map((t,i)=>(
              <span className="ticker-item" key={i}><span>{t.e}</span>{t.t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* NAV */}
      <nav className="nav">
        <div className="nav-logo" onClick={()=>handleTabChange("home")}>
          <DogLogo size={32}/>
          <span className="nav-logo-tooltip">News Around You</span>
        </div>
        <div className="nav-tabs">
          {TABS.map(t=>(
            <button key={t.id} className={`nav-tab ${activeTab===t.id?"active":""}`} onClick={()=>handleTabChange(t.id)} style={{position:"relative"}}>
              {t.icon}{t.label}
              {t.badge&&pendingRequests.length>0&&(
                <div style={{position:"absolute",top:4,right:4,width:8,height:8,background:"#ff3d71",borderRadius:"50%",border:"2px solid var(--bg)"}}/>
              )}
            </button>
          ))}
        </div>
        <div className="nav-right">
          {/* THEME TOGGLE */}
          <button
            className="theme-toggle"
            onClick={()=>setIsDark(d=>!d)}
            title={isDark?"Switch to light mode":"Switch to dark mode"}
          >
            {isDark ? <SunIcon/> : <MoonIcon/>}
          </button>

          <div style={{position:"relative",cursor:"pointer"}} onClick={()=>setShowNotif(p=>!p)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text2)" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            {unreadCount>0&&<div className="notif-badge">{unreadCount}</div>}
          </div>
          <div className="nav-avatar" title="Logout" onClick={logout}>{getInitials(me?.name||"?")}</div>
          <span style={{fontSize:13,color:"var(--text2)"}}>{me?.name}</span>
        </div>
      </nav>

      {/* NOTIFICATION DROPDOWN */}
      {showNotif&&(
        <div className="notif-panel fade-up">
          <div className="notif-header">
            <span className="notif-title">Notifications</span>
            <button style={{background:"none",border:"none",color:"var(--accent)",fontSize:12,cursor:"pointer"}} onClick={()=>setShowNotif(false)}>✕</button>
          </div>
          {pendingRequests.length>0&&(
            <div style={{borderBottom:"1px solid var(--border)"}}>
              <div className="section-title" style={{padding:"10px 16px 4px"}}>Follow Requests</div>
              {pendingRequests.map(r=>(
                <div key={getId(r)} className="notif-item" style={{alignItems:"center"}}>
                  <div className="notif-icon" style={{background:colorOf(r.name),color:"white",fontWeight:700,fontSize:11}}>{getInitials(r.name)}</div>
                  <div style={{flex:1}}>
                    <div className="notif-text"><strong>{r.name}</strong> wants to follow you</div>
                    <div className="notif-time">{r.email}</div>
                  </div>
                  <div style={{display:"flex",gap:5,paddingRight:4}}>
                    <button className="btn-rsvp" style={{padding:"4px 10px",fontSize:10}} onClick={()=>acceptRequest(getId(r))}>Accept</button>
                    <button className="btn-cancel" style={{padding:"4px 8px",fontSize:11}} onClick={()=>declineRequest(getId(r))}>✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {activities.length>0&&(
            <div>
              <div className="section-title" style={{padding:"10px 16px 4px"}}>Recent Activity</div>
              {activities.slice(0,10).map((act,i)=>(
                <div className="notif-item" key={i}>
                  <div className="notif-icon" style={{background:colorOf(act.sender?.name||""),color:"white",fontWeight:700,fontSize:11}}>{getInitials(act.sender?.name||"?")}</div>
                  <div>
                    <div className="notif-text"><strong>{act.sender?.name||"Someone"}</strong> started following you</div>
                    <div className="notif-time">{timeAgo(new Date(act.timestamp).getTime())} ago</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {pendingRequests.length===0&&activities.length===0&&(
            <div style={{padding:20,textAlign:"center",color:"var(--text3)",fontSize:13}}>No notifications yet</div>
          )}
        </div>
      )}

      <div className="main-layout" onClick={()=>showNotif&&setShowNotif(false)}>
        {/* LEFT SIDEBAR */}
        <div>
          <div className="sidebar-mini-profile">
            <div className="mini-avatar" style={{background:`linear-gradient(135deg,${colorOf(me?.name||"")},${colorOf((me?.name||"")+"x")})`,color:"white"}}>{getInitials(me?.name||"?")}</div>
            <div className="mini-name">{me?.name}</div>
            <div className="mini-handle">@{me?.email?.split("@")[0]}</div>
            <div className="mini-stats">
              <div className="mini-stat"><div className="mini-stat-val">{(me?.followers||[]).length}</div><div className="mini-stat-lbl">Followers</div></div>
              <div className="mini-stat"><div className="mini-stat-val">{(me?.following||[]).length}</div><div className="mini-stat-lbl">Following</div></div>
            </div>
          </div>
          <div className="sidebar-nav">
            {TABS.map(t=>(
              <button key={t.id} className={`snav-item ${activeTab===t.id?"active":""}`} onClick={()=>handleTabChange(t.id)}>
                {t.icon}{t.label}
                {t.badge&&pendingRequests.length>0&&<span style={{marginLeft:"auto",background:"#ff3d71",color:"white",fontSize:9,padding:"2px 6px",borderRadius:10}}>{pendingRequests.length}</span>}
              </button>
            ))}
            <button className="snav-item" onClick={logout} style={{marginTop:8,color:"var(--text3)"}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Logout
            </button>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div>
          {/* HOME */}
          {activeTab==="home"&&(
            <>
              <div className="card create-box">
                <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                  <div className="post-avatar" style={{background:`linear-gradient(135deg,${colorOf(me?.name||"")},${colorOf((me?.name||"")+"2")})`,color:"white",flexShrink:0}}>{getInitials(me?.name||"?")}</div>
                  <textarea className="create-textarea" placeholder="What's happening on campus? Share news, events, alerts..." value={newBody} onChange={e=>setNewBody(e.target.value)} rows={3}/>
                </div>
                <div className="create-footer">
                  <input className="c-input" style={{width:160}} placeholder="Headline..." value={newTitle} onChange={e=>setNewTitle(e.target.value)}/>
                  <select className="c-input" value={newTag} onChange={e=>setNewTag(e.target.value)}>
                    {["general","campus","event","alert","news","sports"].map(t=><option key={t} value={t}>{t}</option>)}
                  </select>
                  <select className="c-input" value={newMood} onChange={e=>setNewMood(e.target.value)}>
                    {MOODS.map(m=><option key={m} value={m}>{m}</option>)}
                  </select>
                  <input className="c-input" style={{width:110}} placeholder="📍 Location" value={newLocation} onChange={e=>setNewLocation(e.target.value)}/>
                  <button className="btn-share" onClick={createPost}>Share →</button>
                </div>
              </div>
              {feedPosts.length===0
                ?<div className="card feed-empty"><div style={{fontSize:40,marginBottom:12}}>📰</div>No posts yet — be the first to share!</div>
                :feedPosts.map(p=><PostCard key={getId(p)} post={p} {...postCardProps}/>)
              }
            </>
          )}

          {/* MAP */}
          {activeTab==="map"&&(
            <div className="card fade-up">
              <div className="section-title">🗺️ Campus News Map</div>
              <div className="campus-map">
                <div className="map-grid"/>
                {mapBuildings.map((b,i)=>(
                  <div key={i} className="map-building" style={{left:`${b.x}%`,top:`${b.y}%`,width:b.w,height:b.h,transform:"translate(-50%,-50%)"}}>
                    {b.label.split("\n").map((l,j)=><div key={j}>{l}</div>)}
                  </div>
                ))}
                {mapPins.map(p=>{
                  const aid = typeof p.userId==="object"?getId(p.userId):p.userId?.toString();
                  const a = users.find(u=>getId(u)===aid);
                  const bc = BADGE[p.tag]||BADGE.general;
                  const pid = getId(p);
                  return (
                    <div key={pid} className="map-pin" style={{left:`${p.mapX}%`,top:`${p.mapY}%`}}
                      onMouseEnter={()=>setHoveredPin(pid)} onMouseLeave={()=>setHoveredPin(null)}>
                      <div className="map-pin-dot" style={{background:bc.c}}/>
                      {hoveredPin===pid&&(
                        <div className="map-tooltip">
                          <div style={{fontWeight:600,fontSize:12,marginBottom:2}}>{p.title}</div>
                          <div style={{color:"var(--text3)",fontSize:10}}>by {a?.name||"User"} · {timeAgo(postTime(p))} ago</div>
                        </div>
                      )}
                    </div>
                  );
                })}
                <div style={{position:"absolute",bottom:10,right:10,display:"flex",gap:6,flexWrap:"wrap"}}>
                  {Object.entries(BADGE).map(([k,v])=>(
                    <span key={k} style={{background:v.bg,color:v.c,padding:"2px 8px",borderRadius:20,fontSize:10,fontWeight:600}}>{k}</span>
                  ))}
                </div>
              </div>
              <div style={{marginTop:16}}>
                <div className="section-title">Recent Pinned News</div>
                {mapPins.slice(0,4).map(p=>{
                  const aid = typeof p.userId==="object"?getId(p.userId):p.userId?.toString();
                  const a = users.find(u=>getId(u)===aid);
                  const bc = BADGE[p.tag]||BADGE.general;
                  return (
                    <div key={getId(p)} style={{display:"flex",gap:10,padding:"10px 0",borderBottom:"1px solid var(--border)",alignItems:"center"}}>
                      <div style={{width:8,height:8,borderRadius:"50%",background:bc.c,flexShrink:0}}/>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:600,fontSize:13.5}}>{p.title}</div>
                        <div style={{color:"var(--text3)",fontSize:11.5}}>📍 {p.location||"Campus"} · {a?.name||"User"}</div>
                      </div>
                      <span className="post-badge" style={{background:bc.bg,color:bc.c}}>{p.tag}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* CALENDAR */}
          {activeTab==="calendar"&&(
            <div className="fade-up">
              <div className="card" style={{marginBottom:16}}>
                <div className="section-title">📅 Events Calendar — {now.toLocaleString("default",{month:"long",year:"numeric"})}</div>
                <div className="cal-grid" style={{marginBottom:8}}>
                  {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d=><div key={d} className="cal-header">{d}</div>)}
                  {calDays.map((c,i)=>(
                    <div key={i} className={`cal-day ${!c.day?"other-month":""} ${c.hasEvent?"has-event":""} ${selectedDay===c.day?"selected":""} ${c.day===now.getDate()&&!selectedDay?"today":""}`}
                      onClick={()=>c.day&&setSelectedDay(selectedDay===c.day?null:c.day)}>
                      {c.day||""}
                    </div>
                  ))}
                </div>
                {selectedDay&&(
                  <div style={{background:"var(--bg3)",borderRadius:8,padding:12,marginTop:8,fontSize:13,color:"var(--text2)"}}>
                    Events on {now.toLocaleString("default",{month:"long"})} {selectedDay}: {events.filter(e=>parseInt(e.date.split("-")[2])===selectedDay).length||"None"}
                  </div>
                )}
              </div>
              <div className="card">
                <div className="section-title">🎯 Upcoming Events</div>
                {events.map(ev=>{
                  const [,mon,day]=ev.date.split("-");
                  const bc=BADGE[ev.tag]||BADGE.general;
                  const isRsvpd=rsvps[ev.id];
                  const hasReminder=reminders[ev.id];
                  return (
                    <div className="event-item" key={ev.id}>
                      <div className="event-date-badge">
                        <div className="event-date-num">{parseInt(day)}</div>
                        <div className="event-date-mon">{new Date(2024,parseInt(mon)-1,1).toLocaleString("default",{month:"short"})}</div>
                      </div>
                      <div className="event-info">
                        <div className="event-name">{ev.name}</div>
                        <div className="event-meta">🕐 {ev.time} · 📍 {ev.location}</div>
                        <div style={{display:"flex",gap:4,marginTop:6,alignItems:"center"}}>
                          <span className="post-badge" style={{background:bc.bg,color:bc.c,fontSize:9}}>{ev.tag}</span>
                        </div>
                      </div>
                      <div style={{display:"flex",flexDirection:"column",gap:4}}>
                        <button className={`btn-rsvp ${isRsvpd?"rsvpd":""}`} onClick={()=>toggleRsvp(ev.id)}>{isRsvpd?"✓ Going":"RSVP"}</button>
                        <button className={`btn-reminder ${hasReminder?"set":""}`} onClick={()=>toggleReminder(ev.id)}>{hasReminder?"⏰ Set":"⏰ Remind"}</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* LEADERBOARD */}
          {activeTab==="leaderboard"&&(
            <div className="fade-up">
              <div className="card" style={{marginBottom:16}}>
                <div className="section-title">🏆 Student Leaderboard</div>
                {leaderboard.map((u,i)=>(
                  <div className="lb-item" key={getId(u)}>
                    <div className={`lb-rank ${i===0?"gold":i===1?"silver":i===2?"bronze":""}`}>{i===0?"👑":i+1}</div>
                    <div className="lb-av" style={{background:`linear-gradient(135deg,${colorOf(u.name)},${colorOf(u.name+"2")})`,color:"white"}}>{getInitials(u.name)}</div>
                    <div className="lb-info">
                      <div className="lb-name">{u.name}</div>
                      <div className="lb-sub">{u.postCount} posts · {u.likesRcvd} likes rcvd</div>
                    </div>
                    <div className="lb-score">{u.score}pts</div>
                  </div>
                ))}
                <div style={{marginTop:16,padding:12,background:"var(--bg3)",borderRadius:8,fontSize:13,color:"var(--text2)"}}>
                  💡 Points: 10 per post + 5 per like received + 3 per follower
                </div>
              </div>
              <div className="card">
                <div className="section-title">📊 News Analytics</div>
                <div style={{marginBottom:16}}>
                  <div style={{fontSize:13,color:"var(--text2)",marginBottom:10,fontWeight:500}}>Posts by Category</div>
                  {Object.entries(tagCounts).map(([tag,count])=>{
                    const bc=BADGE[tag]||BADGE.general;
                    return (
                      <div className="analytics-bar-row" key={tag}>
                        <div className="analytics-label" style={{color:bc.c}}>{tag}</div>
                        <div className="analytics-bar-bg"><div className="analytics-bar-fill" style={{width:`${(count/maxTag)*100}%`,background:bc.c}}/></div>
                        <div className="analytics-val">{count}</div>
                      </div>
                    );
                  })}
                </div>
                <div>
                  <div style={{fontSize:13,color:"var(--text2)",marginBottom:10,fontWeight:500}}>Mood Distribution</div>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                    {Object.entries(moodCounts).map(([mood,count])=>(
                      <div key={mood} style={{background:"var(--bg3)",borderRadius:8,padding:"6px 12px",fontSize:13,textAlign:"center"}}>
                        <div>{mood}</div><div style={{color:"var(--accent)",fontWeight:700}}>{count}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab==="notifications"&&(
            <div className="fade-up">
              <div className="card" style={{marginBottom:16}}>
                <div className="section-title">🔔 Follow Requests</div>
                {pendingRequests.length===0
                  ?<div style={{textAlign:"center",padding:20,color:"var(--text3)",fontSize:13}}>No pending requests</div>
                  :pendingRequests.map(r=>(
                    <div key={getId(r)} className="sug-card">
                      <div className="sug-av" style={{background:`linear-gradient(135deg,${colorOf(r.name)},${colorOf(r.name+"2")})`,color:"white"}}>{getInitials(r.name)}</div>
                      <div className="sug-info"><div className="sug-name">{r.name}</div><div className="sug-sub">{r.email}</div></div>
                      <div style={{display:"flex",gap:6}}>
                        <button className="btn-rsvp" onClick={()=>acceptRequest(getId(r))}>Accept</button>
                        <button className="btn-cancel" style={{padding:"6px 12px"}} onClick={()=>declineRequest(getId(r))}>Decline</button>
                      </div>
                    </div>
                  ))
                }
              </div>
              <div className="card">
                <div className="section-title">✨ Recent Activity</div>
                {activities.length===0
                  ?<div style={{textAlign:"center",padding:20,color:"var(--text3)",fontSize:13}}>No recent activity yet</div>
                  :activities.slice(0,20).map((act,i)=>(
                    <div className="notif-item" key={i} style={{cursor:"default"}}>
                      <div className="notif-icon" style={{background:colorOf(act.sender?.name||""),color:"white",fontWeight:700,fontSize:11}}>{getInitials(act.sender?.name||"?")}</div>
                      <div style={{flex:1}}>
                        <div className="notif-text"><strong>{act.sender?.name||"Someone"}</strong> started following you</div>
                        <div className="notif-time">{timeAgo(new Date(act.timestamp).getTime())} ago</div>
                      </div>
                      {act.sender&&(
                        <button className="btn-edit" style={{fontSize:11,padding:"4px 8px"}} onClick={()=>handleViewUser(act.sender)}>View</button>
                      )}
                    </div>
                  ))
                }
              </div>
            </div>
          )}

          {/* CONFESSIONS */}
          {activeTab==="confessions"&&(
            <div className="fade-up">
              <div className="card" style={{marginBottom:16}}>
                <div className="section-title">🤫 Anonymous Confessions</div>
                <div style={{fontSize:13,color:"var(--text3)",marginBottom:14}}>Post anonymously. No username shown. Keep it respectful.</div>
                <textarea className="create-textarea" placeholder="Share your campus confession anonymously..." value={newConfession} onChange={e=>setNewConfession(e.target.value)} rows={3}/>
                <button className="btn-share" style={{marginTop:10,marginLeft:"auto",display:"block"}} onClick={postConfession}>
                  Post Anonymously 🤫
                </button>
              </div>
              {confessions.map(c=>(
                <div className="confession-card fade-up" key={c.id}>
                  <div className="confession-text">"{c.text}"</div>
                  <div className="confession-footer">
                    <span className="confession-tag">{c.tag}</span>
                    <span style={{color:"var(--text3)",fontSize:11.5,marginLeft:"auto"}}>{timeAgo(c.ts)} ago</span>
                    <button style={{background:"none",border:"none",cursor:"pointer",color:"var(--text3)",fontSize:13,display:"flex",alignItems:"center",gap:4}} onClick={()=>addConfessionLike(c.id)}>
                      ❤️ {c.likes+(confessionLikes[c.id]||0)}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PROFILE */}
          {activeTab==="profile"&&(
            <div className="fade-up">
              {viewedUser&&(
                <button onClick={()=>setViewedUser(null)} style={{background:"none",border:"none",color:"var(--accent)",fontSize:13,fontWeight:600,display:"flex",alignItems:"center",gap:6,marginBottom:12,cursor:"pointer"}}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                  Back to My Profile
                </button>
              )}
              <div className="card" style={{marginBottom:14,padding:0,overflow:"hidden"}}>
                <div className="profile-cover"/>
                <div style={{padding:"0 20px",marginTop:-40,position:"relative",zIndex:1}}>
                  <div className="profile-av" style={{background:`linear-gradient(135deg,${colorOf(displayedUser?.name||"")},${colorOf((displayedUser?.name||"")+"2")})`,color:"white"}}>{getInitials(displayedUser?.name||"?")}</div>
                </div>
                <div style={{padding:"10px 20px 20px"}}>
                  <div className="profile-name">{displayedUser?.name}</div>
                  <div style={{color:"var(--text3)",fontSize:13.5,marginBottom:8}}>{displayedUser?.email}</div>
                  <div style={{color:"var(--text2)",fontSize:14,lineHeight:1.7,marginBottom:12}}>{displayedUser?.bio||<span style={{color:"var(--text3)",fontStyle:"italic"}}>No bio yet.</span>}</div>
                  <div className="profile-stats-row">
                    <div className="profile-stat"><div className="ps-val">{profilePosts.length}</div><div className="ps-lbl">Posts</div></div>
                    <div className="profile-stat" style={{cursor:"pointer"}} onClick={()=>{setListModalType("Followers");setListModalUsers((displayedUser?.followers||[]).map(String));setShowListModal(true);}}>
                      <div className="ps-val">{(displayedUser?.followers||[]).length}</div><div className="ps-lbl">Followers</div>
                    </div>
                    <div className="profile-stat" style={{cursor:"pointer"}} onClick={()=>{setListModalType("Following");setListModalUsers((displayedUser?.following||[]).map(String));setShowListModal(true);}}>
                      <div className="ps-val">{(displayedUser?.following||[]).length}</div><div className="ps-lbl">Following</div>
                    </div>
                  </div>
                  {viewedUser?(
                    <button
                      disabled={(viewedUser.pendingRequests||[]).map(String).includes(myId)}
                      className="btn-primary"
                      style={{marginTop:12,width:"auto",padding:"8px 24px"}}
                      onClick={()=>followUser(getId(viewedUser))}
                    >
                      {myFollowing.includes(getId(viewedUser))
                        ?"✓ Following"
                        :(viewedUser.pendingRequests||[]).map(String).includes(myId)
                          ?"Requested":"Follow"}
                    </button>
                  ):(
                    <button className="btn-edit" onClick={()=>{setEditBio(me?.bio||"");setEditModal(true);}}>✏️ Edit Bio</button>
                  )}
                </div>
              </div>
              {!viewedUser&&(
                <div className="card" style={{marginBottom:14}}>
                  <div className="section-title">🕸️ Activity Overview</div>
                  <div className="spider-wrap"><SpiderChart data={activityData}/></div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6}}>
                    {[["Posts",myPostCount],["Likes Given",myLikes],["Comments",myComments]].map(([l,v])=>(
                      <div key={l} style={{background:"var(--bg3)",borderRadius:8,padding:"8px 10px",textAlign:"center"}}>
                        <div style={{fontSize:11,color:"var(--text3)"}}>{l}</div>
                        <div style={{fontWeight:700,fontSize:19,color:"var(--accent)"}}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div style={{fontSize:11.5,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:"var(--text3)",marginBottom:10}}>
                {viewedUser?`${viewedUser.name}'s Posts`:"My Posts"}
              </div>
              {profilePosts.length===0
                ?<div className="card feed-empty"><div style={{fontSize:36,marginBottom:10}}>📝</div>No posts yet.</div>
                :profilePosts.map(p=><PostCard key={getId(p)} post={p} {...postCardProps}/>)
              }
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <div>
          <div className="card" style={{marginBottom:14}}>
            <div className="section-title">🔥 Trending</div>
            {[["#TechFest2024","342"],["#ExamSeason","218"],["#CampusLife","189"],["#Hackathon","97"],["#CricketFinal","76"]].map(([tag,count],i)=>(
              <div className="trend-item" key={tag}>
                <span className="trend-num">{i+1}</span>
                <span className="trend-tag">{tag}</span>
                <span className="trend-count">{count}</span>
              </div>
            ))}
          </div>
          {Object.keys(moodCounts).length>0&&(
            <div className="card" style={{marginBottom:14}}>
              <div className="section-title">📊 Today's Mood</div>
              {Object.entries(moodCounts).slice(0,3).map(([mood,count])=>(
                <div className="analytics-bar-row" key={mood}>
                  <div style={{fontSize:12,color:"var(--text2)",width:90,flexShrink:0}}>{mood}</div>
                  <div className="analytics-bar-bg">
                    <div className="analytics-bar-fill" style={{width:`${(count/Math.max(posts.length,1))*100}%`,background:"var(--accent)"}}/>
                  </div>
                </div>
              ))}
            </div>
          )}
          {users.filter(u=>getId(u)!==myId&&!myFollowing.includes(getId(u))).length>0&&(
            <div className="card" style={{marginBottom:14}}>
              <div className="section-title">👥 Suggested</div>
              {users.filter(u=>getId(u)!==myId&&!myFollowing.includes(getId(u))).slice(0,5).map(u=>(
                <div className="sug-card" key={getId(u)}>
                  <div className="sug-av" style={{background:`linear-gradient(135deg,${colorOf(u.name)},${colorOf(u.name+"2")})`,color:"white",cursor:"pointer"}} onClick={()=>handleViewUser(u)}>{getInitials(u.name)}</div>
                  <div className="sug-info">
                    <div className="sug-name" style={{cursor:"pointer"}} onClick={()=>handleViewUser(u)}>{u.name}</div>
                    <div className="sug-sub">{u.email}</div>
                  </div>
                  <button
                    disabled={(u.pendingRequests||[]).map(String).includes(myId)}
                    className={`btn-follow ${myFollowing.includes(getId(u))?"following":""}`}
                    onClick={()=>followUser(getId(u))}
                  >
                    {myFollowing.includes(getId(u))?"✓":(u.pendingRequests||[]).map(String).includes(myId)?"Requested":"Follow"}
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="card">
            <div className="section-title">📅 This Week</div>
            {events.slice(0,3).map(ev=>(
              <div key={ev.id} style={{padding:"8px 0",borderBottom:"1px solid var(--border)",display:"flex",gap:8,alignItems:"center"}}>
                <span style={{fontSize:18}}>{ev.tag==="sports"?"🏏":ev.tag==="event"?"🎉":ev.tag==="campus"?"🏫":"📌"}</span>
                <div style={{flex:1}}>
                  <div style={{fontWeight:600,fontSize:13}}>{ev.name}</div>
                  <div style={{color:"var(--text3)",fontSize:11}}>{ev.date.split("-").slice(1).join("/")} · {ev.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* EDIT BIO MODAL */}
      {editModal&&(
        <div className="modal-overlay" onClick={()=>setEditModal(false)}>
          <div className="modal-box fade-up" onClick={e=>e.stopPropagation()}>
            <div className="modal-title">Edit Profile</div>
            <div className="form-group">
              <label className="form-label">Bio</label>
              <textarea className="form-input" style={{minHeight:90,resize:"vertical"}} placeholder="Tell the campus about yourself..." value={editBio} onChange={e=>setEditBio(e.target.value)}/>
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={()=>setEditModal(false)}>Cancel</button>
              <button className="btn-save" onClick={saveProfile}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* FOLLOWERS/FOLLOWING MODAL */}
      {showListModal&&(
        <div className="modal-overlay" onClick={()=>setShowListModal(false)}>
          <div className="modal-box fade-up" onClick={e=>e.stopPropagation()} style={{width:400}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
              <div className="modal-title" style={{margin:0}}>{listModalType}</div>
              <button style={{background:"none",border:"none",color:"var(--text3)",cursor:"pointer",fontSize:18}} onClick={()=>setShowListModal(false)}>×</button>
            </div>
            <div style={{maxHeight:400,overflowY:"auto"}}>
              {listModalUsers.length===0
                ?<div style={{textAlign:"center",padding:20,color:"var(--text3)"}}>No users</div>
                :listModalUsers.map(uid=>{
                  const u=users.find(x=>getId(x)===uid.toString());
                  if(!u) return null;
                  return (
                    <div key={getId(u)} className="sug-card" style={{padding:"8px 0"}}>
                      <div className="sug-av" style={{background:`linear-gradient(135deg,${colorOf(u.name)},${colorOf(u.name+"2")})`,color:"white"}}>{getInitials(u.name)}</div>
                      <div className="sug-info"><div className="sug-name">{u.name}</div><div className="sug-sub">{u.email}</div></div>
                      <button className="btn-edit" style={{fontSize:11}} onClick={()=>handleViewUser(u)}>View</button>
                    </div>
                  );
                })
              }
            </div>
          </div>
        </div>
      )}
    </>
  );
}