(function () {
  "use strict";

  document.documentElement.classList.add("js");

  // ----- Mobile nav toggle -----
  var nav = document.querySelector("[data-nav]");
  var toggle = document.querySelector("[data-nav-toggle]");
  if (nav && toggle) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      if (!open) {
        document.querySelectorAll(".nav__item--dropdown.is-open").forEach(function (li) {
          li.classList.remove("is-open");
          var b = li.querySelector("[data-nav-dropdown-toggle]");
          if (b) b.setAttribute("aria-expanded", "false");
        });
      }
    });
  }

  // ----- Services dropdown: click toggle on mobile only; hover on desktop -----
  function closeAllNavDropdowns() {
    document.querySelectorAll(".nav__item--dropdown.is-open").forEach(function (li) {
      li.classList.remove("is-open");
      var btn = li.querySelector("[data-nav-dropdown-toggle]");
      if (btn) btn.setAttribute("aria-expanded", "false");
    });
  }
  var navMq = window.matchMedia("(max-width: 1100px)");
  document.querySelectorAll("[data-nav-dropdown-toggle]").forEach(function (btn) {
    var item = btn.closest(".nav__item--dropdown");
    if (!item) return;
    btn.addEventListener("click", function (e) {
      if (!navMq.matches) return;
      e.preventDefault();
      e.stopPropagation();
      var willOpen = !item.classList.contains("is-open");
      closeAllNavDropdowns();
      if (willOpen) {
        item.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });
  document.addEventListener("click", function (ev) {
    if (!navMq.matches) return;
    if (!(ev.target && ev.target.closest && ev.target.closest(".nav__item--dropdown"))) {
      closeAllNavDropdowns();
    }
  });
  if (typeof navMq.addEventListener === "function") {
    navMq.addEventListener("change", closeAllNavDropdowns);
  }

  // ----- Active link highlighting -----
  var path = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
  if (path === "") path = "index.html";
  var servicePaths = ["services.html", "infrastructure-integration.html", "erp-consulting.html", "adp-integration.html", "paychex-integration.html"];
  document.querySelectorAll(".nav__links a, .nav__sub a").forEach(function (a) {
    var href = (a.getAttribute("href") || "").toLowerCase();
    if (!href || href.indexOf("http") === 0) return;
    if (href === path || (path === "index.html" && (href === "" || href === "./" || href === "index.html"))) {
      a.classList.add("is-active");
    }
  });
  if (servicePaths.indexOf(path) >= 0) {
    var svcBtn = document.querySelector("[data-nav-dropdown-toggle]");
    if (svcBtn) svcBtn.classList.add("is-active");
  }

  // ----- Year in footer -----
  var year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();

  // ----- Reveal-on-scroll -----
  var revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }
  window.setTimeout(function () {
    document.querySelectorAll(".reveal:not(.is-visible)").forEach(function (el) {
      el.classList.add("is-visible");
    });
  }, 800);

  // ----- IntegrateXpress forms → Formspree (category per form) -----
  function getFormEndpoint(formEl) {
    var fromAttr = (formEl.getAttribute("data-form-endpoint") || "").trim();
    if (fromAttr) return fromAttr;
    var fromConfig =
      typeof window !== "undefined" && window.INTEGRATEXPRESS_FORM_ENDPOINT
        ? String(window.INTEGRATEXPRESS_FORM_ENDPOINT).trim()
        : "";
    if (fromConfig) return fromConfig;
    var action = (formEl.getAttribute("action") || "").trim();
    if (action.indexOf("formspree.io") !== -1) return action;
    return "";
  }

  function getSubmitterName(data) {
    var full = (data.get("fullName") || "").toString().trim();
    if (full) return full;
    var first = (data.get("firstName") || "").toString().trim();
    var last = (data.get("lastName") || "").toString().trim();
    return (first + " " + last).trim();
  }

  function initIxForm(form) {
    var errorBox = form.querySelector("[data-form-error]");
    var successBox = form.querySelector("[data-form-success]");
    var category = (form.getAttribute("data-form-category") || "Website inquiry").trim();
    var successMsg =
      form.getAttribute("data-form-success-msg") ||
      "Thank you — your message was sent. We'll reply within one business day.";

    var payrollParam = (new URLSearchParams(window.location.search).get("payroll") || "").toLowerCase();
    var payrollSelect = form.querySelector('[name="payrollPartner"]');
    if (payrollSelect && payrollParam) {
      var payrollMap = { adp: "ADP", paychex: "Paychex" };
      var payrollValue = payrollMap[payrollParam];
      if (payrollValue) payrollSelect.value = payrollValue;
    }

    form.querySelectorAll(".form__check input[type=checkbox]").forEach(function (cb) {
      var wrap = cb.closest(".form__check");
      cb.addEventListener("change", function () {
        if (wrap) wrap.classList.toggle("is-checked", cb.checked);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (successBox) {
        successBox.hidden = true;
        successBox.textContent = "";
      }

      var data = new FormData(form);
      var name = getSubmitterName(data);
      var email = (data.get("email") || "").toString().trim();
      var missing = [];

      form.querySelectorAll("[required]").forEach(function (field) {
        if (field.type === "checkbox" || field.type === "radio") return;
        var val = (field.value || "").toString().trim();
        var label = field.labels && field.labels[0] ? field.labels[0].textContent.replace("*", "").trim() : field.name;
        if (!val) missing.push(label);
      });

      if (!email) missing.push("Email");
      var emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (email && !emailValid) missing.push("a valid Email");

      if (missing.length) {
        if (errorBox) {
          errorBox.textContent = "Please provide: " + missing.join(", ") + ".";
          errorBox.classList.add("is-visible");
        }
        return;
      }
      if (errorBox) errorBox.classList.remove("is-visible");

      var submitEndpoint = getFormEndpoint(form);
      if (!submitEndpoint) {
        if (errorBox) {
          errorBox.textContent = "Form is not configured. Please email Services@IntegrateXpress.com directly.";
          errorBox.classList.add("is-visible");
        }
        return;
      }

      var submitBtn = form.querySelector('[type="submit"]');
      var fd = new FormData(form);
      fd.set("category", category);
      fd.set("_subject", "[" + category + "] " + (name || "New inquiry"));
      fd.set("_replyto", email);

      if (submitBtn) submitBtn.disabled = true;

      fetch(submitEndpoint, {
        method: "POST",
        body: fd,
        headers: { Accept: "application/json" }
      })
        .then(function (res) {
          if (res.ok) {
            form.reset();
            form.querySelectorAll(".form__check").forEach(function (w) {
              w.classList.remove("is-checked");
            });
            if (successBox) {
              successBox.textContent = successMsg;
              successBox.hidden = false;
            }
            return;
          }
          return res.json().then(function (body) {
            var msg = "Submission failed. Please try again or email Services@IntegrateXpress.com.";
            if (body && typeof body.error === "string") msg = body.error;
            throw new Error(msg);
          });
        })
        .catch(function (err) {
          if (errorBox) {
            errorBox.textContent =
              (err && err.message) ||
              "Something went wrong. Please try again or email Services@IntegrateXpress.com.";
            errorBox.classList.add("is-visible");
          }
        })
        .finally(function () {
          if (submitBtn) submitBtn.disabled = false;
        });
    });
  }

  document.querySelectorAll("[data-ix-form], [data-getstarted-form]").forEach(initIxForm);

  // ----- Accreditation detail dialog -----
  var accredDialog = document.getElementById("accred-dialog");
  var accredGrid = document.querySelector("[data-accred-grid]");
  if (accredDialog && accredGrid && typeof accredDialog.showModal === "function") {
    var accredTitle = document.getElementById("accred-dialog-title");
    var accredBody = accredDialog.querySelector("[data-accred-dialog-body]");
    var accredClose = accredDialog.querySelector("[data-accred-dialog-close]");

    function openAccredDialog(article) {
      var tid = article.getAttribute("data-accred-template");
      var title = article.getAttribute("data-accred-title");
      var tpl = tid ? document.getElementById(tid) : null;
      if (!tpl || !accredTitle || !accredBody) return;
      accredTitle.textContent = title || "";
      while (accredBody.firstChild) accredBody.removeChild(accredBody.firstChild);
      accredBody.appendChild(tpl.content.cloneNode(true));
      accredDialog.showModal();
    }

    accredGrid.addEventListener("click", function (e) {
      var t = e.target;
      if (!t || !t.closest) return;
      if (!t.closest(".accred__thumb, button.more")) return;
      var article = t.closest(".accred[data-accred-template]");
      if (!article) return;
      e.preventDefault();
      openAccredDialog(article);
    });

    if (accredClose) {
      accredClose.addEventListener("click", function () {
        accredDialog.close();
      });
    }
    accredDialog.addEventListener("click", function (e) {
      if (e.target === accredDialog) accredDialog.close();
    });
  }

  // ----- Contact map location stars -----
  var mapIframe = document.querySelector("[data-map-iframe]");
  var mapExternalLink = document.querySelector("[data-map-external-link]");
  var mapLocationBtns = document.querySelectorAll("[data-map-location]");
  if (mapIframe && mapLocationBtns.length) {
    function setMapLocation(btn) {
      var lat = btn.getAttribute("data-lat");
      var lng = btn.getAttribute("data-lng");
      var zoom = btn.getAttribute("data-zoom") || "13";
      var label = btn.getAttribute("data-label") || "Location";
      if (!lat || !lng) return;

      mapIframe.src = "https://www.google.com/maps?q=" + lat + "," + lng + "&z=" + zoom + "&output=embed";
      mapIframe.title = label + " on Google Maps";

      if (mapExternalLink) {
        mapExternalLink.href = "https://www.google.com/maps?sll=" + lat + "," + lng + "&q=" + lat + "," + lng + "&z=" + zoom;
      }

      mapLocationBtns.forEach(function (b) {
        var active = b === btn;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-pressed", active ? "true" : "false");
      });
    }

    mapLocationBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        setMapLocation(btn);
      });
    });
  }
})();
