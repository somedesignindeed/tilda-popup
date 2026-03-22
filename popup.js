(function() {
  const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyggk5XXmliotXDuo0IwK-QpC81lntVc9euvFFt0-1UgMkOF4Jwx_GHwtb_iDhjB_f8gw/exec";

  // ─── УТИЛИТЫ ────────────────────────────────────────────────
  function lbl() {
    return "display:block;font-size:12px;color:#888;margin-bottom:4px;font-family:sans-serif;";
  }
  function inp() {
    return "display:block;width:100%;box-sizing:border-box;margin-bottom:12px;" +
           "padding:8px 10px;border:1px solid #ddd;border-radius:6px;" +
           "font-size:14px;font-family:sans-serif;outline:none;";
  }
  function colorField(id, label, def) {
    return `<div>
      <label style="${lbl()}">${label}</label>
      <input type="color" id="${id}" value="${def}"
        style="width:100%;height:36px;border:1px solid #ddd;border-radius:6px;
               cursor:pointer;padding:2px;box-sizing:border-box;">
    </div>`;
  }

  // ─── ГЛАВНЫЙ ОБЪЕКТ ──────────────────────────────────────────
  window.CPM = {

    async init() {
      try {
        const res  = await fetch(APPS_SCRIPT_URL);
        const data = await res.json();
        if (data.active !== "true") return;
        const delay = parseInt(data.delay) || 0;
        setTimeout(() => CPM.showPopup(data), delay * 1000);
      } catch(e) {}
    },

    showPopup(d) {
      if (document.getElementById("cpm_popup")) return;

      const animStyles = {
        fade:    "opacity:0;transition:opacity .4s ease",
        scale:   "opacity:0;transform:scale(.85);transition:opacity .4s ease,transform .4s ease",
        slideUp: "opacity:0;transform:translateY(40px);transition:opacity .4s ease,transform .4s ease",
        none:    ""
      };
      const anim = animStyles[d.animation] || animStyles.fade;

      const overlay = document.createElement("div");
      overlay.id = "cpm_popup";
      overlay.style.cssText =
        "position:fixed;inset:0;z-index:99999;display:flex;" +
        "align-items:center;justify-content:center;" +
        (d.bgImage
          ? `background:url(${d.bgImage}) center/cover;`
          : "background:rgba(0,0,0,.5);");

      const box = document.createElement("div");
      box.id = "cpm_popup_box";
      box.style.cssText =
        `background:${d.bgColor || "#ffffff"};` +
        `border-radius:${d.borderRadius || 12}px;` +
        "padding:40px;max-width:480px;width:90%;text-align:center;" +
        `box-shadow:0 20px 60px rgba(0,0,0,.2);${anim}`;

      box.innerHTML = `
        <h2 style="margin:0 0 16px;
          font-size:${(parseInt(d.fontSize) || 16) + 8}px;
          color:${d.titleColor || "#000"};font-family:sans-serif;">
          ${d.title || ""}
        </h2>
        <p style="margin:0 0 28px;line-height:1.6;
          font-size:${d.fontSize || 16}px;
          color:${d.textColor || "#555"};font-family:sans-serif;">
          ${d.text || ""}
        </p>
        <button id="cpm_popup_btn"
          style="background:${d.btnColor || "#000"};color:#fff;border:none;
                 padding:14px 32px;cursor:pointer;font-family:sans-serif;
                 border-radius:${Math.min(parseInt(d.borderRadius) || 8, 50)}px;
                 font-size:${d.fontSize || 16}px;">
          ${d.button || "Закрыть"}
        </button>
      `;

      overlay.appendChild(box);
      document.body.appendChild(overlay);

      if (d.animation !== "none") {
        requestAnimationFrame(() => requestAnimationFrame(() => {
          box.style.opacity   = "1";
          box.style.transform = "scale(1) translateY(0)";
        }));
      }

      document.getElementById("cpm_popup_btn").onclick = () => overlay.remove();
      overlay.onclick = e => { if (e.target === overlay) overlay.remove(); };
    },

    openAdminPanel() {
      if (document.getElementById("cpm_admin_panel")) return;

      const panel = document.createElement("div");
      panel.id = "cpm_admin_panel";
      panel.style.cssText =
        "position:fixed;bottom:24px;right:24px;background:#fff;" +
        "border-radius:14px;width:340px;z-index:999999;" +
        "box-shadow:0 8px 40px rgba(0,0,0,.25);font-family:sans-serif;overflow:hidden;";

      panel.innerHTML = `
        <div style="background:#111;color:#fff;padding:16px 20px;
                    display:flex;justify-content:space-between;align-items:center;">
          <span style="font-weight:600;font-size:15px;">⚙️ Управление попапом</span>
          <span id="cpm_panel_close"
            style="cursor:pointer;font-size:22px;line-height:1;opacity:.7;">×</span>
        </div>
        <div style="display:flex;border-bottom:1px solid #eee;">
          <div class="cpm_tab" data-tab="0"
            style="flex:1;text-align:center;padding:10px 4px;font-size:13px;
                   cursor:pointer;border-bottom:2px solid #111;font-weight:600;">Контент</div>
          <div class="cpm_tab" data-tab="1"
            style="flex:1;text-align:center;padding:10px 4px;font-size:13px;
                   cursor:pointer;color:#999;">Дизайн</div>
          <div class="cpm_tab" data-tab="2"
            style="flex:1;text-align:center;padding:10px 4px;font-size:13px;
                   cursor:pointer;color:#999;">Поведение</div>
        </div>
        <div style="padding:20px;max-height:400px;overflow-y:auto;">
          <div class="cpm_pane" data-pane="0">
            <label style="${lbl()}">Показывать попап</label>
            <label style="display:flex;align-items:center;gap:8px;margin-bottom:14px;cursor:pointer;">
              <input type="checkbox" id="cpm_active" style="width:18px;height:18px;cursor:pointer;">
              <span style="font-size:14px;color:#333;">Включён</span>
            </label>
            <label style="${lbl()}">Заголовок</label>
            <input id="cpm_f_title" style="${inp()}" placeholder="Заголовок попапа">
            <label style="${lbl()}">Текст</label>
            <textarea id="cpm_f_text" style="${inp()}height:72px;resize:vertical;" placeholder="Текст попапа"></textarea>
            <label style="${lbl()}">Кнопка</label>
            <input id="cpm_f_button" style="${inp()}" placeholder="Текст кнопки">
          </div>
          <div class="cpm_pane" data-pane="1" style="display:none;">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">
              ${colorField("cpm_f_bgColor",    "Фон попапа",     "#ffffff")}
              ${colorField("cpm_f_titleColor", "Цвет заголовка", "#000000")}
              ${colorField("cpm_f_textColor",  "Цвет текста",    "#555555")}
              ${colorField("cpm_f_btnColor",   "Цвет кнопки",    "#000000")}
            </div>
            <label style="${lbl()}">Размер шрифта (px)</label>
            <input id="cpm_f_fontSize" type="number" min="10" max="32" style="${inp()}" placeholder="16">
            <label style="${lbl()}">Закругление углов (px)</label>
            <input id="cpm_f_borderRadius" type="number" min="0" max="50" style="${inp()}" placeholder="12">
            <label style="${lbl()}">Фоновое изображение (URL)</label>
            <input id="cpm_f_bgImage" style="${inp()}" placeholder="https://...">
            <label style="${lbl()}">Анимация появления</label>
            <select id="cpm_f_animation" style="${inp()}">
              <option value="fade">Плавное появление</option>
              <option value="scale">Масштаб</option>
              <option value="slideUp">Снизу вверх</option>
              <option value="none">Без анимации</option>
            </select>
          </div>
          <div class="cpm_pane" data-pane="2" style="display:none;">
            <label style="${lbl()}">Задержка появления (сек)</label>
            <input id="cpm_f_delay" type="number" min="0" max="60" style="${inp()}" placeholder="0">
            <p style="font-size:12px;color:#bbb;margin:0;">0 — сразу при загрузке страницы</p>
          </div>
        </div>
        <div style="padding:0 20px 20px;">
          <button id="cpm_save_btn"
            style="width:100%;background:#111;color:#fff;border:none;
                   padding:12px;border-radius:8px;cursor:pointer;
                   font-size:14px;font-weight:600;font-family:sans-serif;">
            Сохранить
          </button>
          <p id="cpm_status"
            style="text-align:center;font-size:13px;color:#888;
                   margin:8px 0 0;font-family:sans-serif;min-height:18px;"></p>
        </div>
      `;

      document.body.appendChild(panel);

      document.getElementById("cpm_panel_close").onclick =
        () => document.getElementById("cpm_admin_panel").remove();

      document.querySelectorAll(".cpm_tab").forEach(tab => {
        tab.onclick = () => CPM.switchTab(parseInt(tab.dataset.tab));
      });

      document.getElementById("cpm_save_btn").onclick = () => CPM.savePopup();

      fetch(APPS_SCRIPT_URL).then(r => r.json()).then(d => {
        document.getElementById("cpm_active").checked          = d.active === "true";
        document.getElementById("cpm_f_title").value           = d.title        || "";
        document.getElementById("cpm_f_text").value            = d.text         || "";
        document.getElementById("cpm_f_button").value          = d.button       || "";
        document.getElementById("cpm_f_delay").value           = d.delay        || "0";
        document.getElementById("cpm_f_bgColor").value         = d.bgColor      || "#ffffff";
        document.getElementById("cpm_f_titleColor").value      = d.titleColor   || "#000000";
        document.getElementById("cpm_f_textColor").value       = d.textColor    || "#555555";
        document.getElementById("cpm_f_btnColor").value        = d.btnColor     || "#000000";
        document.getElementById("cpm_f_fontSize").value        = d.fontSize     || "16";
        document.getElementById("cpm_f_borderRadius").value    = d.borderRadius || "12";
        document.getElementById("cpm_f_bgImage").value         = d.bgImage      || "";
        document.getElementById("cpm_f_animation").value       = d.animation    || "fade";
      }).catch(() => {});
    },

    switchTab(i) {
      document.querySelectorAll(".cpm_tab").forEach((t, idx) => {
        t.style.borderBottom = idx === i ? "2px solid #111" : "2px solid transparent";
        t.style.fontWeight   = idx === i ? "600" : "normal";
        t.style.color        = idx === i ? "#111" : "#999";
      });
      document.querySelectorAll(".cpm_pane").forEach((p, idx) => {
        p.style.display = idx === i ? "block" : "none";
      });
    },

    async savePopup() {
      const get = id => document.getElementById(id);
      const payload = {
        active:       String(get("cpm_active").checked),
        title:        get("cpm_f_title").value,
        text:         get("cpm_f_text").value,
        button:       get("cpm_f_button").value,
        delay:        get("cpm_f_delay").value,
        bgColor:      get("cpm_f_bgColor").value,
        titleColor:   get("cpm_f_titleColor").value,
        textColor:    get("cpm_f_textColor").value,
        btnColor:     get("cpm_f_btnColor").value,
        fontSize:     get("cpm_f_fontSize").value,
        borderRadius: get("cpm_f_borderRadius").value,
        bgImage:      get("cpm_f_bgImage").value,
        animation:    get("cpm_f_animation").value,
      };
      const status = get("cpm_status");
      status.textContent = "Сохраняем...";
      try {
        await fetch(APPS_SCRIPT_URL, {
          method: "POST",
          body: JSON.stringify(payload)
        });
        status.style.color = "#2a9d5c";
        status.textContent = "✅ Сохранено!";
      } catch(e) {
        status.style.color = "#e63946";
        status.textContent = "❌ Ошибка сохранения";
      }
    }
  };

})();

