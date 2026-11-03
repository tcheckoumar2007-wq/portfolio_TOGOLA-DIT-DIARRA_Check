const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  });
}

// Navigation clavier et fermeture automatique du menu mobile.
if (toggle && nav) {
  nav.addEventListener('click', (event) => {
    if (event.target.closest('a') && nav.classList.contains('open')) {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Ouvrir le menu');
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav.classList.contains('open')) {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Ouvrir le menu');
      toggle.focus();
    }
  });
}

// Recherche et filtres de la galerie des projets.
const projectCards = [...document.querySelectorAll('#project-list .project-card')];
const searchField = document.querySelector('#project-search');
const resultMessage = document.querySelector('#project-result');
const filterButtons = [...document.querySelectorAll('.filter-chip')];
let selectedFilter = 'all';
const normalizeSearchText = (value) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('fr');
function updateProjects() {
  if (!projectCards.length) return;
  const query = normalizeSearchText((searchField?.value || '').trim());
  let visible = 0;
  projectCards.forEach((card) => {
    const categories = (card.dataset.categories || '').split(/\s+/);
    const matchesFilter = selectedFilter === 'all' || categories.includes(selectedFilter);
    const matchesSearch = !query || normalizeSearchText(card.textContent).includes(query);
    const show = matchesFilter && matchesSearch;
    card.hidden = !show;
    if (show) visible += 1;
  });
  if (resultMessage) resultMessage.textContent = `${visible} projet${visible > 1 ? 's' : ''} affiché${visible > 1 ? 's' : ''}`;
}
searchField?.addEventListener('input', updateProjects);
filterButtons.forEach((button) => button.addEventListener('click', () => {
  selectedFilter = button.dataset.filter || 'all';
  filterButtons.forEach((item) => {
    const active = item === button;
    item.classList.toggle('active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  updateProjects();
}));

// Bouton de retour en haut, affiché après le premier écran.
const backToTop = document.createElement('button');
backToTop.className = 'back-to-top';
backToTop.type = 'button';
backToTop.setAttribute('aria-label', 'Revenir en haut de la page');
backToTop.innerHTML = '<span aria-hidden="true">↑</span>';
document.body.append(backToTop);
const updateBackToTop = () => backToTop.classList.toggle('visible', window.scrollY > 500);
window.addEventListener('scroll', updateBackToTop, { passive: true });
updateBackToTop();
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
