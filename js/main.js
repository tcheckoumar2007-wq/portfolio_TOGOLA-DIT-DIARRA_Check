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

// Agrandissement des visuels de projets, utilisable à la souris et au clavier.
const projectImages = document.querySelectorAll('.project-image img, .detail-cover img, .evidence-gallery img');
let imageViewer;
let imageViewerImage;
let imageViewerCaption;
let imageViewerTrigger;

function createImageViewer() {
  imageViewer = document.createElement('dialog');
  imageViewer.className = 'image-viewer';
  imageViewer.setAttribute('aria-label', 'Agrandissement de l’image');

  const closeButton = document.createElement('button');
  closeButton.className = 'image-viewer-close';
  closeButton.type = 'button';
  closeButton.setAttribute('aria-label', 'Fermer l’image agrandie');
  closeButton.textContent = '×';

  imageViewerImage = document.createElement('img');
  imageViewerCaption = document.createElement('p');
  imageViewerCaption.className = 'image-viewer-caption';

  imageViewer.append(closeButton, imageViewerImage, imageViewerCaption);
  document.body.append(imageViewer);

  closeButton.addEventListener('click', () => imageViewer.close());
  imageViewer.addEventListener('click', (event) => {
    if (event.target === imageViewer) imageViewer.close();
  });
  imageViewer.addEventListener('cancel', (event) => {
    event.preventDefault();
    imageViewer.close();
  });
  imageViewer.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      imageViewer.close();
    }
  });
  imageViewer.addEventListener('close', () => {
    imageViewerTrigger?.focus();
    imageViewerTrigger = null;
  });
}

function openImageViewer(image) {
  if (!imageViewer) createImageViewer();
  imageViewerTrigger = image;
  imageViewerImage.src = image.currentSrc || image.src;
  imageViewerImage.alt = image.alt;
  imageViewerCaption.textContent = image.closest('figure')?.querySelector('figcaption')?.textContent.trim() || image.alt;
  imageViewer.showModal();
  imageViewer.querySelector('.image-viewer-close').focus();
}

projectImages.forEach((image) => {
  image.tabIndex = 0;
  image.setAttribute('role', 'button');
  image.setAttribute('aria-haspopup', 'dialog');
  image.title = 'Cliquer pour agrandir';
});

document.addEventListener('click', (event) => {
  const image = event.target.closest('.project-image img, .detail-cover img, .evidence-gallery img');
  if (!image) return;
  event.preventDefault();
  openImageViewer(image);
});

document.addEventListener('keydown', (event) => {
  const image = event.target.closest?.('.project-image img, .detail-cover img, .evidence-gallery img');
  if (!image || (event.key !== 'Enter' && event.key !== ' ')) return;
  event.preventDefault();
  openImageViewer(image);
});

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
