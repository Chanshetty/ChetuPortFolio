/**
 * Skills Advanced Component
 * Renders accordion categories, subcategories, skill tags,
 * and a modal explanation panel — all from JSON data.
 *
 * Author: Laxman Chanshetty
 */

'use strict';

/* ─── State ──────────────────────────────────────────────────── */
let skillsData   = null;
let activeModal  = null;

/* ─── Init ───────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', async () => {
  await loadSkillsData();
  renderCategories();
  initModal();
  initKeyboardNav();
});

/* ═══════════════════════════════════════════════════════════════
   DATA LOADING
═══════════════════════════════════════════════════════════════ */
async function loadSkillsData() {
  try {
    const res  = await fetch('/api/skills');
    const json = await res.json();
    skillsData = json.data;
  } catch (err) {
    console.error('[Skills] Failed to load skills data:', err);
    document.getElementById('skillsRoot').innerHTML =
      '<p style="color:#da1e28;text-align:center;padding:40px;">Failed to load skills data.</p>';
  }
}

/* ═══════════════════════════════════════════════════════════════
   RENDER CATEGORIES
═══════════════════════════════════════════════════════════════ */
function renderCategories() {
  if (!skillsData) return;

  const root = document.getElementById('skillsRoot');
  root.innerHTML = '';

  skillsData.categories.forEach((cat, catIndex) => {
    const totalSkills = cat.subcategories.reduce((sum, sub) => sum + sub.skills.length, 0);
    const colorClass  = catIndex === 0 ? 'blue' : 'purple';

    /* ── Category Card ── */
    const card = document.createElement('div');
    card.className   = 'category-card';
    card.dataset.catId = cat.id;

    /* ── Category Header ── */
    card.innerHTML = `
      <div class="category-header" role="button" tabindex="0"
           aria-expanded="false" aria-controls="body-${cat.id}"
           id="header-${cat.id}">

        <div class="category-icon-wrap"
             style="background:${cat.colorLight}; border:1px solid ${cat.colorBorder}; color:${cat.color};">
          <i class="${cat.iconFallback || cat.icon}"></i>
        </div>

        <div class="category-meta">
          <div class="category-title">${cat.title}</div>
          <div class="category-subtitle">${cat.subtitle}</div>
        </div>

        <div class="category-stats">
          <span class="stat-pill"
                style="color:${cat.color}; border-color:${cat.colorBorder}; background:${cat.colorLight};">
            ${cat.subcategories.length} subcategories
          </span>
          <span class="stat-pill"
                style="color:${cat.color}; border-color:${cat.colorBorder}; background:${cat.colorLight};">
            ${totalSkills} skills
          </span>
        </div>

        <div class="category-chevron" style="color:${cat.color};">
          <i class="fas fa-chevron-down"></i>
        </div>
      </div>

      <div class="category-body" id="body-${cat.id}" role="region" aria-labelledby="header-${cat.id}">
        <div class="category-body-inner" id="inner-${cat.id}">
          ${renderSubcategories(cat, colorClass)}
        </div>
      </div>
    `;

    root.appendChild(card);

    /* ── Accordion Toggle ── */
    const header = card.querySelector('.category-header');
    header.addEventListener('click', () => toggleCategory(card, cat.id));
    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleCategory(card, cat.id);
      }
    });

    /* ── Skill Tag Click Handlers ── */
    card.querySelectorAll('.skill-tag').forEach(tag => {
      tag.addEventListener('click', () => {
        openModal({
          skillName:    tag.dataset.skillName,
          explanation:  tag.dataset.explanation,
          categoryTitle: cat.title,
          color:        cat.color,
          colorLight:   cat.colorLight,
          colorBorder:  cat.colorBorder,
          icon:         cat.iconFallback || cat.icon,
          colorClass,
        });
      });

      tag.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          tag.click();
        }
      });
    });
  });
}

/* ─── Render Subcategories HTML ──────────────────────────────── */
function renderSubcategories(cat, colorClass) {
  return cat.subcategories.map(sub => `
    <div class="subcategory">
      <div class="subcategory-header">
        <div class="subcategory-icon"
             style="background:${cat.colorLight}; color:${cat.color};">
          <i class="${sub.icon}"></i>
        </div>
        <span class="subcategory-title">${sub.title}</span>
        <span class="subcategory-count">${sub.skills.length} skills</span>
      </div>
      <div class="skills-tags">
        ${sub.skills.map(skill => `
          <button
            class="skill-tag ${colorClass}"
            tabindex="0"
            role="button"
            aria-label="${skill.name} — click for details"
            data-skill-name="${escapeAttr(skill.name)}"
            data-explanation="${escapeAttr(skill.explanation)}"
          >
            <span class="tag-dot"></span>
            ${escapeHtml(skill.name)}
            <i class="fas fa-info-circle tag-info-icon"></i>
          </button>
        `).join('')}
      </div>
    </div>
  `).join('');
}

/* ═══════════════════════════════════════════════════════════════
   ACCORDION TOGGLE
═══════════════════════════════════════════════════════════════ */
function toggleCategory(card, catId) {
  const body    = document.getElementById(`body-${catId}`);
  const header  = card.querySelector('.category-header');
  const isOpen  = card.classList.contains('open');

  if (isOpen) {
    /* Close */
    card.classList.remove('open');
    body.classList.remove('open');
    header.setAttribute('aria-expanded', 'false');
  } else {
    /* Open */
    card.classList.add('open');
    body.classList.add('open');
    header.setAttribute('aria-expanded', 'true');

    /* Smooth scroll to card after a short delay */
    setTimeout(() => {
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  }
}

/* ═══════════════════════════════════════════════════════════════
   MODAL
═══════════════════════════════════════════════════════════════ */
function initModal() {
  const overlay   = document.getElementById('skillModalOverlay');
  const closeBtn  = document.getElementById('modalClose');
  const dismissBtn = document.getElementById('modalDismiss');

  /* Close on overlay click */
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  /* Close button */
  closeBtn.addEventListener('click', closeModal);
  dismissBtn.addEventListener('click', closeModal);
}

function openModal({ skillName, explanation, categoryTitle, color, colorLight, colorBorder, icon, colorClass }) {
  const overlay    = document.getElementById('skillModalOverlay');
  const iconWrap   = document.getElementById('modalIconWrap');
  const badge      = document.getElementById('modalCategoryBadge');
  const nameEl     = document.getElementById('modalSkillName');
  const explEl     = document.getElementById('modalExplanation');
  const dismissBtn = document.getElementById('modalDismiss');

  /* Populate */
  iconWrap.style.background = colorLight;
  iconWrap.style.border     = `1px solid ${colorBorder}`;
  iconWrap.style.color      = color;
  document.getElementById('modalIcon').className = icon;

  badge.textContent         = categoryTitle;
  badge.style.color         = color;
  badge.style.borderColor   = colorBorder;
  badge.style.background    = colorLight;

  nameEl.textContent        = skillName;
  explEl.textContent        = explanation;

  dismissBtn.style.background = color;
  dismissBtn.style.color      = '#fff';

  /* Open */
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  /* Focus management */
  setTimeout(() => {
    document.getElementById('modalClose').focus();
  }, 300);

  activeModal = { skillName };
}

function closeModal() {
  const overlay = document.getElementById('skillModalOverlay');
  overlay.classList.remove('open');
  document.body.style.overflow = '';
  activeModal = null;
}

/* ═══════════════════════════════════════════════════════════════
   KEYBOARD NAVIGATION
═══════════════════════════════════════════════════════════════ */
function initKeyboardNav() {
  document.addEventListener('keydown', (e) => {
    /* Escape closes modal */
    if (e.key === 'Escape' && activeModal) {
      closeModal();
    }
  });
}

/* ═══════════════════════════════════════════════════════════════
   UTILITIES
═══════════════════════════════════════════════════════════════ */

/** Escape HTML special characters for safe innerHTML insertion */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"');
}

/** Escape for HTML attribute values */
function escapeAttr(str) {
  return String(str)
    .replace(/&/g, '&')
    .replace(/"/g, '"')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/'/g, function() { return '&#x27;'; });
}

// Made with Bob
