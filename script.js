/* ==========================================
   FILTRES ET BOUTON VOIR PLUS
========================================== */

const boutons = document.querySelectorAll('.filtre-btn');
const projets = document.querySelectorAll('.grille-projets > .projet-carte');
const boutonVoirPlus = document.getElementById('voir-plus-projets');

const nombreParPage = 6;

let filtreActif = document.querySelector('.filtre-btn.actif')?.dataset.filtre || 'tous';
let nombreVisible = nombreParPage;

// Affichage des projets
function afficherProjets() {

  // Sélectionne les projets correspondant au filtre
  const projetsFiltres = [...projets].filter(projet => {
    return filtreActif === 'tous' ||
      projet.dataset.categorie === filtreActif;
  });

  // Masque tous les projets
  projets.forEach(projet => {
    projet.style.display = 'none';
  });

  // Affiche les projets dans la limite définie
  projetsFiltres.slice(0, nombreVisible).forEach(projet => {
    projet.style.display = 'block';
  });

  // Affiche le bouton uniquement s'il reste des projets
  if (boutonVoirPlus) {
    const projetsRestants = projetsFiltres.length > nombreVisible;

    boutonVoirPlus.hidden = !projetsRestants;
  }

  // Actualise les intégrations Instagram
  if (window.instgrm?.Embeds) {
    window.instgrm.Embeds.process();
  }
}

// Gestion des boutons de filtres
boutons.forEach(bouton => {

  bouton.addEventListener('click', () => {

    boutons.forEach(b => b.classList.remove('actif'));

    bouton.classList.add('actif');

    filtreActif = bouton.dataset.filtre;

    // Réinitialise le nombre de projets visibles
    nombreVisible = nombreParPage;

    afficherProjets();

  });

});

// Gestion du bouton Voir plus
if (boutonVoirPlus) {

  boutonVoirPlus.addEventListener('click', () => {

    nombreVisible += nombreParPage;

    afficherProjets();

  });

}

// Affichage initial
afficherProjets();


/* ==========================================
   OUVERTURE DES DESCRIPTIONS DE PROJETS
========================================== */

document.querySelectorAll('.projet-info').forEach(info => {

  info.addEventListener('click', () => {

    const carte = info.closest('.projet-carte');

    carte.classList.toggle('ouvert');

  });

});


/* ==========================================
   CARROUSELS DES PROJETS
========================================== */

document.querySelectorAll('.carrousel').forEach(carrousel => {

  const images = carrousel.querySelectorAll('img');
  const suivant = carrousel.querySelector('.carrousel-suivant');
  const precedent = carrousel.querySelector('.carrousel-precedent');

  // Ignore les carrousels qui n'ont pas de flèches
  if (!images.length || !suivant || !precedent) return;

  let index = 0;

  suivant.addEventListener('click', (e) => {

    e.stopPropagation();

    images[index].classList.remove('active');

    index = (index + 1) % images.length;

    images[index].classList.add('active');

  });

  precedent.addEventListener('click', (e) => {

    e.stopPropagation();

    images[index].classList.remove('active');

    index = (index - 1 + images.length) % images.length;

    images[index].classList.add('active');

  });

});


/* ==========================================
   LECTURE DES VIDÉOS YOUTUBE ET LOCALES
========================================== */

const modal = document.getElementById('video-modal');
const player = modal.querySelector('.video-modal-player');
const modalContenu = modal.querySelector('.video-modal-contenu');

document.querySelectorAll('.video-miniature').forEach(miniature => {

  miniature.addEventListener('click', () => {

    const idYoutube = miniature.getAttribute('data-video-id');
    const srcLocal = miniature.getAttribute('data-video-src');

    // Détecte les YouTube Shorts
    const estShort = miniature.closest('.youtube-short') !== null;

    // Adapte le format de la fenêtre
    modalContenu.classList.toggle('format-short', estShort);

    // Vidéo YouTube
    if (idYoutube) {

      player.innerHTML = `
        <iframe
          src="https://www.youtube.com/embed/${idYoutube}?autoplay=1"
          title="Vidéo YouTube"
          frameborder="0"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowfullscreen>
        </iframe>
      `;

    }

    // Vidéo locale MP4
    else if (srcLocal) {

      player.innerHTML = `
        <video controls autoplay playsinline
               style="width:100%; height:100%;">
          <source src="${srcLocal}" type="video/mp4">
          Votre navigateur ne prend pas en charge cette vidéo.
        </video>
      `;

    } else {
      return;
    }

    modal.classList.add('ouverte');

  });

});

// Fermer la fenêtre vidéo
function fermerModal() {

  modal.classList.remove('ouverte');

  player.innerHTML = '';

  modalContenu.classList.remove('format-short');

}

// Bouton de fermeture
modal.querySelector('.video-modal-fermer').addEventListener('click', fermerModal);

// Fermeture au clic en dehors de la vidéo
modal.addEventListener('click', (e) => {

  if (e.target === modal) {
    fermerModal();
  }

});


/* ==========================================
   FENÊTRES DE DÉTAIL DES PROJETS
========================================== */

const detailModal = document.getElementById('detail-modal');
const detailBody = detailModal.querySelector('.detail-modal-corps');

document.querySelectorAll('.ouvre-detail').forEach(el => {

  el.addEventListener('click', (e) => {

    if (e.target.closest('button')) return;

    const templateId = el.getAttribute('data-modal-target');
    const template = document.getElementById(templateId);

    // Évite une erreur si le template n'existe pas
    if (!template) return;

    detailBody.innerHTML = '';

    detailBody.appendChild(template.content.cloneNode(true));

    detailModal.classList.add('ouverte');

    // Active le carrousel dans la fenêtre de détail
    const carrousel = detailBody.querySelector('.detail-carrousel');

    if (carrousel) {

      const images = carrousel.querySelectorAll('img');
      const suivant = carrousel.querySelector('.detail-suivant');
      const precedent = carrousel.querySelector('.detail-precedent');

      if (images.length && suivant && precedent) {

        let index = 0;

        suivant.addEventListener('click', () => {

          images[index].classList.remove('active');

          index = (index + 1) % images.length;

          images[index].classList.add('active');

        });

        precedent.addEventListener('click', () => {

          images[index].classList.remove('active');

          index = (index - 1 + images.length) % images.length;

          images[index].classList.add('active');

        });

      }

    }

  });

});

// Fermer la fenêtre de détail
function fermerDetailModal() {

  detailModal.classList.remove('ouverte');

  detailBody.innerHTML = '';

}

// Bouton de fermeture
detailModal.querySelector('.detail-modal-fermer').addEventListener(
  'click',
  fermerDetailModal
);

// Fermeture au clic en dehors de la fenêtre
detailModal.addEventListener('click', (e) => {

  if (e.target === detailModal) {
    fermerDetailModal();
  }

});


/* ==========================================
   FERMETURE DES MODALES AVEC ÉCHAP
========================================== */

document.addEventListener('keydown', (e) => {

  if (e.key === 'Escape') {

    if (modal.classList.contains('ouverte')) {
      fermerModal();
    }

    if (detailModal.classList.contains('ouverte')) {
      fermerDetailModal();
    }

  }

});