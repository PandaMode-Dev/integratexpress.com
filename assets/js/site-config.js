/**
 * Site-wide settings — edit before publishing.
 *
 * SQUARESPACE FORM (recommended for lead capture in Squarespace dashboard):
 *   1. In Squarespace: add a page (e.g. "Get Started") with a Form block.
 *   2. Publish the site and copy the full page URL.
 *   3. Paste it below (include https://). Leave empty to use the built-in form (mailto fallback).
 */
// Public form page on Squarespace. If www DNS points to GitHub, switch this to your
// Squarespace built-in URL (Settings → Domains), e.g. https://YOURSITE.squarespace.com/home-1
window.INTEGRATEXPRESS_SQUARESPACE_FORM_URL = "https://www.integratexpress.com/home-1";

/**
 * Optional: Formspree / Getform endpoint for the built-in form (same fields as get-started.html).
 * Used only when SQUARESPACE_FORM_URL is empty. Example: "https://formspree.io/f/xxxx"
 */
window.INTEGRATEXPRESS_FORM_ENDPOINT = "";

(function () {
  "use strict";
  var sqUrl = (window.INTEGRATEXPRESS_SQUARESPACE_FORM_URL || "").trim();
  if (!sqUrl) return;

  function mountSquarespaceForm() {
    var host = document.querySelector("[data-squarespace-form-host]");
    var form = document.querySelector("[data-getstarted-form]");
    if (!host || !form) return;

    form.hidden = true;
    host.hidden = false;

    var iframe = document.createElement("iframe");
    iframe.src = sqUrl;
    iframe.title = "Project intake form";
    iframe.setAttribute("loading", "lazy");
    iframe.className = "squarespace-form-iframe";
    host.appendChild(iframe);

    var hint = form.querySelector(".form-hint");
    if (hint) {
      hint.textContent = "Form hosted on Squarespace. Submissions appear in your Squarespace dashboard.";
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountSquarespaceForm);
  } else {
    mountSquarespaceForm();
  }
})();
