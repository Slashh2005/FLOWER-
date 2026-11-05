/* Small progressive-enhancement script. The site works without it,
   except that enquiry forms need it to send. */
(function () {
  "use strict";

  var config = {};
  try {
    config = JSON.parse(document.getElementById("site-config").textContent);
  } catch (e) {}

  /* ---------- Mobile navigation ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    var setOpen = function (open, returnFocus) {
      toggle.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("is-open", open);
      toggle.querySelector(".nav-toggle__label").textContent = open ? "Close" : "Menu";
      if (!open && returnFocus) toggle.focus();
    };
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") !== "true";
      setOpen(open);
      if (open) {
        var first = nav.querySelector("a");
        if (first) first.focus();
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") setOpen(false, true);
    });
    document.addEventListener("click", function (e) {
      if (toggle.getAttribute("aria-expanded") === "true" && !nav.contains(e.target) && !toggle.contains(e.target)) setOpen(false);
    });
    var mq = window.matchMedia("(min-width: 52.01em)");
    var onChange = function () { if (mq.matches) setOpen(false); };
    mq.addEventListener ? mq.addEventListener("change", onChange) : mq.addListener(onChange);
  }

  /* ---------- Enquiry forms ---------- */
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  // South African or international numbers: 9–15 digits after stripping spaces, dashes, brackets and "+".
  var PHONE_RE = /^\+?\d{9,15}$/;

  function method() {
    if (config.formEndpoint) return "endpoint";
    if (config.whatsappNumber) return "whatsapp";
    if (config.email) return "email";
    return "none";
  }

  function todayISO() {
    var d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 10);
  }

  function labelText(el) {
    var label = el.form.querySelector('label[for="' + el.id + '"]');
    return label ? label.childNodes[0].textContent.trim() : el.name;
  }

  function validateField(el) {
    var value = (el.value || "").trim();
    var msg = "";
    if (el.required && !value) {
      msg = labelText(el) + " is required.";
    } else if (value && el.dataset.validate === "contact") {
      var compact = value.replace(/[\s\-()]/g, "");
      if (!EMAIL_RE.test(value) && !PHONE_RE.test(compact)) {
        msg = "Enter a valid WhatsApp number (e.g. 082 123 4567) or email address.";
      }
    } else if (value && el.dataset.validate === "future-date") {
      if (value < todayISO()) msg = "Please choose today or a future date.";
    } else if (el.type === "file" && el.files && el.files[0] && el.dataset.maxMb) {
      if (el.files[0].size > Number(el.dataset.maxMb) * 1024 * 1024) msg = "Please choose an image smaller than " + el.dataset.maxMb + " MB.";
    }
    var err = document.getElementById(el.id + "-error");
    if (err) {
      err.textContent = msg;
      err.hidden = !msg;
    }
    if (msg) el.setAttribute("aria-invalid", "true");
    else el.removeAttribute("aria-invalid");
    return msg;
  }

  function buildMessage(form) {
    var data = new FormData(form);
    var lines = [];
    var add = function (label, key) {
      var v = (data.get(key) || "").toString().trim();
      if (v) lines.push(label + ": " + v);
    };
    var isCustom = form.dataset.variant === "custom";
    lines.push(isCustom ? "Hi! I'd like to enquire about a custom bouquet." : "Hi! I have a question.");
    lines.push("");
    add("Name", "name");
    add("Contact", "contact");
    if (isCustom) {
      add("Occasion", "occasion");
      add("Bouquet", "bouquet");
      add("Colours", "colours");
      add("Message card", "card_message");
      add("Date needed", "date_needed");
      add("Delivery/collection", "fulfilment");
      add("Delivery area", "delivery_area");
      add("Notes", "notes");
      lines.push("");
      lines.push("Could you please confirm availability, final price and timing?");
    } else {
      add("Message", "message");
    }
    return lines.join("\n");
  }

  function showStatus(form, state, title, body) {
    var box = form.querySelector(".form-status");
    box.dataset.state = state;
    box.innerHTML = "";
    var t = document.createElement("p");
    t.className = "form-status__title";
    t.textContent = title;
    box.appendChild(t);
    body.forEach(function (node) { box.appendChild(node); });
    box.hidden = false;
    box.focus();
  }

  function para(text, link) {
    var p = document.createElement("p");
    p.textContent = text;
    if (link) {
      p.appendChild(document.createTextNode(" "));
      var a = document.createElement("a");
      a.href = link.href;
      a.textContent = link.text;
      if (link.newTab) { a.target = "_blank"; a.rel = "noopener"; }
      p.appendChild(a);
    }
    return p;
  }

  var NOT_CONFIRMED = "This is not an order confirmation. We'll contact you to confirm availability, final pricing and timing.";

  document.querySelectorAll("[data-enquiry-form]").forEach(function (form) {
    var fields = Array.prototype.slice.call(form.querySelectorAll("input:not([type=hidden]):not([type=radio]):not([name=_gotcha]), select, textarea"));
    var errorsBox = form.querySelector(".form-errors");
    var submit = form.querySelector('button[type="submit"]');
    var how = method();

    // Explain how the form will send
    var methodNote = form.querySelector("[data-form-method]");
    if (methodNote) {
      methodNote.textContent = {
        endpoint: "",
        whatsapp: "Pressing send opens WhatsApp with your details filled in — you'll need to press send there too.",
        email: "Pressing send opens your email app with your details filled in.",
        none: "Enquiries can't be sent online yet — the contact details are still being set up.",
      }[how];
      methodNote.hidden = !methodNote.textContent;
    }

    // Date: no past dates
    var date = form.querySelector('input[type="date"]');
    if (date) date.min = todayISO();

    // Prefill bouquet from ?bouquet=<slug>
    var size = form.querySelector('select[name="bouquet"]');
    var wanted = new URLSearchParams(location.search).get("bouquet");
    if (size && wanted) {
      Array.prototype.forEach.call(size.options, function (o) { if (o.dataset.slug === wanted) size.value = o.value; });
    }

    // Show delivery area only when delivery is chosen
    var conditional = form.querySelector('[data-show-when="Delivery"]');
    if (conditional) {
      form.addEventListener("change", function (e) {
        if (e.target.name === "fulfilment") conditional.hidden = e.target.value !== "Delivery";
      });
    }

    // Re-validate a field once the user has interacted with it
    fields.forEach(function (el) {
      el.addEventListener("blur", function () { if (el.value || el.hasAttribute("aria-invalid")) validateField(el); });
      el.addEventListener("input", function () { if (el.hasAttribute("aria-invalid")) validateField(el); });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      form.querySelector(".form-status").hidden = true;

      var problems = [];
      fields.forEach(function (el) {
        var msg = validateField(el);
        if (msg) problems.push({ el: el, msg: msg });
      });

      if (problems.length) {
        errorsBox.innerHTML = "";
        var h = document.createElement("h3");
        h.textContent = problems.length === 1 ? "Please fix 1 problem:" : "Please fix " + problems.length + " problems:";
        var ul = document.createElement("ul");
        problems.forEach(function (p) {
          var li = document.createElement("li");
          var a = document.createElement("a");
          a.href = "#" + p.el.id;
          a.textContent = p.msg;
          a.addEventListener("click", function (ev) { ev.preventDefault(); p.el.focus(); });
          li.appendChild(a);
          ul.appendChild(li);
        });
        errorsBox.appendChild(h);
        errorsBox.appendChild(ul);
        errorsBox.hidden = false;
        errorsBox.focus();
        return;
      }
      errorsBox.hidden = true;

      // Spam honeypot
      if (form.querySelector('[name="_gotcha"]').value) return;

      if (how === "endpoint") {
        submit.setAttribute("aria-busy", "true");
        submit.disabled = true;
        fetch(config.formEndpoint, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
          .then(function (res) {
            if (!res.ok) throw new Error("HTTP " + res.status);
            form.reset();
            if (conditional) conditional.hidden = true;
            showStatus(form, "success", "Thank you — your enquiry has been sent.", [para(NOT_CONFIRMED)]);
          })
          .catch(function () {
            var nodes = [para("Sorry, something went wrong and your enquiry wasn't sent. Please try again in a moment.")];
            if (config.whatsappNumber) nodes.push(para("Or send it to us on WhatsApp:", { href: "https://wa.me/" + config.whatsappNumber + "?text=" + encodeURIComponent(buildMessage(form)), text: "open WhatsApp", newTab: true }));
            showStatus(form, "error", "Your enquiry wasn't sent", nodes);
          })
          .finally(function () {
            submit.removeAttribute("aria-busy");
            submit.disabled = false;
          });
        return;
      }

      if (how === "whatsapp") {
        var waUrl = "https://wa.me/" + config.whatsappNumber + "?text=" + encodeURIComponent(buildMessage(form));
        window.open(waUrl, "_blank", "noopener");
        showStatus(form, "success", "Almost done — finish sending in WhatsApp", [
          para("WhatsApp should have opened with your details. Your enquiry is only sent once you press send in WhatsApp."),
          para("Didn't open?", { href: waUrl, text: "Open WhatsApp", newTab: true }),
          para(NOT_CONFIRMED),
        ]);
        return;
      }

      if (how === "email") {
        var subject = form.querySelector('[name="form"]').value + " — " + (config.businessName || "");
        var mail = "mailto:" + config.email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(buildMessage(form));
        window.location.href = mail;
        showStatus(form, "success", "Almost done — finish sending in your email app", [
          para("Your email app should have opened with your details. Your enquiry is only sent once you send that email."),
          para("Didn't open?", { href: mail, text: "Try again" }),
          para(NOT_CONFIRMED),
        ]);
        return;
      }

      showStatus(form, "error", "Enquiries aren't set up yet", [
        para("Online enquiries will be available soon. Nothing has been sent."),
      ]);
    });
  });
})();
