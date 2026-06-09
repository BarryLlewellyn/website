const isTouchDevice =
  navigator.maxTouchPoints > 0;

/* ---------------- IMPORT PROJECTS ---------------- */

const projectModules =
  import.meta.glob('./projects/**/data.json', {
    eager: true
  });

const projects =
  Object.entries(projectModules)
    .map(([path, module]) => {

      const folder =
        path.split('/')[2];

      const slug =
        module.default.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');

      return {

        ...module.default,

        folder,

        slug

      };

    });

/* ---------------- SERIES DESCRIPTIONS ---------------- */

const seriesDescriptions = {

  "Polyphony": [

    "In a world of mass production, where strict requirements dictate the forms of objects, Barry Llewellyn liberates materials by allowing them to morph, crack and melt. The outcome manifests in the Polyphony series - a collection of illuminated wall pieces that embrace a more organic form language and reflect the rhythm of the natural world. From puckering glass and unruly ceramics to overflowing metal, the elements compose unique organisms, each playing with light in their own way. In a time when our domestic environment is dominated by straight edges, standardisation and efficiency, ‘Polyphony’ presents a refreshing harmony with a daring dance between hard and soft, synthetic and natural.",

    "Each piece is cast from salvaged pewter, melted down and recast in sand moulds. The glass elements combine virgin glass with found artefacts such as marbles, which are melted down and fused in the kiln. The glass and ceramic elements are attached using techniques borrowed from jewellery making. Concealed wiring on the backside brings illumination and interactive controls to the piece."

  ],

  "Lalalamp": [

    "The Lalalamp project began by questioning the status-quo when it came to creating one off or limited edition pieces: Why is it that most designers put the majority of their focus on crafting their work, but put little effort into how they source their materials? What would happen if we shifted the focus towards extracting materials that would normally be deemed uneconomical to work with? Discarded polyurethane foam became our material of choice.",

    "Polyurethane foam is extremely tricky to recycle, due to its cross-linked structure, meaning it often ends up in the landfill. There are a number of organisations in the Netherlands focusing on mechanical-based recycling processes, involving shredding PU foam to be used in new materials such as rebonded foam. The downside to these processes is that the material is down-cycled, and it becomes increasingly difficult to recycle in the future. Our goal was to create a body of work that truly elevates this waste material and transforms it into something truly desirable.",
    
    "The outcome is the Lalalamp series. We developed a method for spinning the foam into rope, using a collection of custom made machines and jigs. The ropes are winded around the foam base form of the lamp, with each rope layer tessellating into the next, held together by friction. The surface of the foam is finished with a moss-like nylon fibre coating. The lampshade is a tortoiseshell of handmade ceramic tile, with each slightly irregular tile matching the handmade quality of the rope. The work is brought together functionally with a cast metal touch switch, a light tap illuminates the piece.",

    "The Lalalamp collection makes waste material truly unrecognizable in the world of collectible design. This series is made in collaboration with Sarah Roseman, and is represented by Galerie Scène Ouverte in Paris."

  ],

  "Primordial Antics": [

    "The discovery of fossils and remnants from the Mesozoic era reshaped our understanding of the earth’s history. While some organic matter was preserved, other remains transformed over millions of years into crude oil — a resource that has fuelled both human development and widespread pollution.",

    "Through Primordial Antics, Barry Llewellyn works with discarded PU foam, a contemporary byproduct of fossil fuel. The lamp’s serpentine form evokes the primordial origins of its material, collapsing deep geological time into a contemporary object."

  ],

  "Habitat Lamp": [

    "The Habitat Lamp series takes its name from potentially habitable exoplanets discovered beyond our solar system. Each lamp is composed from a unique carved stone base, from which a cast metal stem meanders upward into a fused glass inlaid lampshade, combining geological and celestial references within a single form."


  ],

  "Adansonia": [

    "Introducing the Adansonia series by Barry Llewellyn, a collection of ceramic sculptures hand-built using a coiling technique. Each piece is crafted with a loose, organic approach, tapering off at the top to form orbs, each with a distinct personality. Emerging from the orbs are abstract clay elements that give the pieces a plant-like presence, resembling natural growths from a smooth, rounded base. The crystalline glaze flows naturally over the smooth surfaces, accentuating these features.",

    "The Adansonia series captures the essence of transformation, freezing the fluidity of clay and glaze in time. The once soft and malleable materials become fossilised through the firing process, creating a moment suspended in a sedimentary state."

  ],

  "Vascular Bloom": [

    ""

  ],

  "Perrenial": [

    "Perennial refers to that which returns, persists, and endures. The series explores the recurring nature of plant life through mineral-based materials including concrete, ceramic, stone, and metal. Working intuitively, Barry Llewellyn allows each material to reveal its own tendencies — concrete cures, ceramic vitrifies, steel bends and connects. Organic forms become suspended in a fossilised, almost geological state, balancing growth and permanence."

  ],

  "Other": [

    ""

  ]

};

const homepageGrid =
  document.querySelector('.homepage-grid');

const customCursor =
  document.querySelector('.custom-cursor');

const drawerOverlay =
  document.querySelector('.drawer-overlay');

/* ---------------- GENERATE PROJECTS ---------------- */

const sortedProjects = [...projects]

  .filter(project => project.status === 'published')

  .sort((a, b) => {

    return a.folder.localeCompare(b.folder);

  });

window.sortedProjects = sortedProjects;

window.seriesDescriptions = seriesDescriptions;

/* ---------------- GENERATE ---------------- */

sortedProjects.forEach(project => {

  project.imagesLoaded = false;

  /* ---------------- HOMEPAGE CARD ---------------- */

  const projectCard =
    document.createElement('div');

  projectCard.classList.add('project-card');

  projectCard.dataset.slug = project.slug;

  projectCard.dataset.title = project.title;

  const projectIndex =
  sortedProjects.indexOf(project);

  const image =
  document.createElement('img');

image.src =
  `projects/${project.folder}/01.jpg`;

image.alt = project.title;

image.loading =
  projectIndex < 4
    ? 'eager'
    : 'lazy';

image.decoding = 'async';

  projectCard.appendChild(image);

  homepageGrid.appendChild(projectCard);

  /* ---------------- DRAWER ---------------- */

  const drawer =
    document.createElement('div');

  drawer.classList.add('drawer');

  drawer.id = project.slug;

  /* ---------------- SPECS ---------------- */

  let specsHTML = '';

  Object.entries(project.specs).forEach(([key, value]) => {

    if (!value) return;

    specsHTML += `
      <p>${key}: ${value}</p>
    `;

  });

/* ---------------- TAGS ---------------- */

let tagsHTML = '';

Object.entries(project.tags).forEach(([key, value]) => {

  if (key === 'materials') {

    value
      .filter(Boolean)
      .forEach(material => {

        tagsHTML += `
          <span>#${material}</span>
        `;

      });

  } else if (key === 'type') {

    const cleanTypes =
      Array.isArray(value)
        ? value.filter(Boolean)
        : [value];

    cleanTypes.forEach(type => {

      tagsHTML += `
        <span>#${type}</span>
      `;

    });

  } else {

    if (value) {

      tagsHTML += `
        <span>#${value}</span>
      `;

    }

  }

});

  /* ---------------- DESCRIPTION ---------------- */

let descriptionHTML = [];

const seriesDescription =
  seriesDescriptions[
    project.tags.series
  ] || [];

let combinedDescription;

if (
  project.description.length > 0 &&
  project.description[0] === '--'
) {

  combinedDescription =
    project.description.slice(1);

} else {

  combinedDescription = [

    ...seriesDescription,

    ...project.description

  ];

}

combinedDescription.forEach(paragraph => {

  descriptionHTML += `
    <p>${paragraph}</p>
  `;

});

  drawer.innerHTML = `

    <div class="drawer-layout">

      <div class="drawer-text">

        <div class="drawer-text-grid">

          <div class="drawer-meta">

            <h1 class="meta-title">
              ${project.title}
            </h1>

            <div class="meta-specs">
  ${specsHTML}
</div>

<div class="meta-tags">

  <p>Tags:</p>

  <div class="tags-list">
    ${tagsHTML}
  </div>

</div>

          </div>

          <div class="meta-description">
            ${descriptionHTML}
          </div>

        </div>

      </div>

      <div class="drawer-images"></div>

    </div>

  `;

  document.body.appendChild(drawer);

});

if (!isTouchDevice) {

/* ---------------- CURSOR ---------------- */

const projectImages =
  document.querySelectorAll('.project-card img');

const drawers =
  document.querySelectorAll('.drawer');

if (window.innerWidth > 900) {

  document.addEventListener('mousemove', (e) => {

    customCursor.style.left = `${e.clientX}px`;

    customCursor.style.top = `${e.clientY}px`;

  });

  document.addEventListener('mouseover', (e) => {

    const image =
      e.target.closest('.project-card img');

    if (!image) {

      customCursor.style.opacity = '0';

      return;

    }

    const projectCard =
      image.closest('.project-card');

    customCursor.style.opacity = '1';

    customCursor.textContent =
      projectCard.dataset.title;

  });

}

/* ---------------- DRAWER POSITION ---------------- */

function updateDrawerPosition(drawer) {

  const expand =
    parseFloat(drawer.dataset.expand);

  const maxTop =
    window.innerHeight * 0.25;

  const newTop =
    maxTop * (1 - expand);

  drawer.style.top = `${newTop}px`;

}

/* ---------------- LOAD DRAWER IMAGES ---------------- */

function loadDrawerImages(project, drawer) {

  if (project.imagesLoaded) return;

  project.imagesLoaded = true;

  const drawerImages =
    drawer.querySelector('.drawer-images');

  const loadedImages = [];

  for (let i = 1; i <= 8; i++) {

    const number =
      String(i).padStart(2, '0');

    const path =
      `projects/${project.folder}/${number}.jpg`;

    const testImage =
      new Image();

    testImage.onload = () => {

      loadedImages.push({
        index: i,
        path
      });

      loadedImages.sort((a, b) => {
        return a.index - b.index;
      });

      drawerImages.innerHTML = '';

      loadedImages.forEach(imageData => {

        const image =
          document.createElement('img');

        image.src =
          imageData.path;

        drawerImages.appendChild(image);

      });

    };

    testImage.src = path;

  }

}

/* ---------------- OPEN ---------------- */

function openDrawer(slug) {

  const targetDrawer =
    document.getElementById(slug);

  if (!targetDrawer) return;

  if (window.innerWidth <= 900) {

  targetDrawer.style.top = '0';

}

  const project =
    sortedProjects.find(p => p.slug === slug);

  drawers.forEach(drawer => {

    drawer.classList.remove('active');

  });

  targetDrawer.classList.add('active');

  document.body.style.overflow = 'hidden';

  targetDrawer.scrollTop = 0;

  targetDrawer.dataset.expand = '0';

  updateDrawerPosition(targetDrawer);

  loadDrawerImages(project, targetDrawer);

  window.location.hash = slug;

}

/* ---------------- CLICK PROJECT ---------------- */

document.addEventListener('click', (e) => {

  if (document.querySelector('.drawer.active')) {

    const clickedInsideDrawer =
      e.target.closest('.drawer');

    if (!clickedInsideDrawer) {

      closeDrawer(
  document.querySelector('.drawer.active')
);

    }

    return;

  }

 const image =
  e.target.closest('.project-card img');

if (!image) return;

const projectCard =
  image.closest('.project-card');

  if (!projectCard) return;

  openDrawer(projectCard.dataset.slug);

});

/* ---------------- CLOSE ---------------- */

function closeDrawer(drawer) {

  drawer.classList.remove('active');

  drawer.scrollTop = 0;

  drawer.dataset.expand = '0';

  updateDrawerPosition(drawer);

  history.replaceState(
    "",
    document.title,
    window.location.pathname + window.location.search
  );

  setTimeout(() => {

  document.body.style.overflow = 'auto';

}, 300);

}

/* ---------------- EXPANSION ---------------- */

drawers.forEach(drawer => {

  if (drawer.id === 'aboutDrawer') return;

  drawer.addEventListener('wheel', (e) => {

    if (!drawer.classList.contains('active')) return;

    let expand =
      parseFloat(drawer.dataset.expand);

    if (e.deltaY > 0 && expand < 1) {

      e.preventDefault();

      expand += e.deltaY * 0.0015;

      if (expand > 1) expand = 1;

      drawer.dataset.expand = expand;

      updateDrawerPosition(drawer);

    }

    else if (
      e.deltaY < 0 &&
      drawer.scrollTop <= 0
    ) {

      e.preventDefault();

      expand += e.deltaY * 0.0015;

    if (expand <= -0.00) {

  e.preventDefault();
  e.stopPropagation();

  expand = 0;

  closeDrawer(drawer);

  setTimeout(() => {
    document.body.style.overflow = 'auto';
  }, 150);

  return;

}

      if (expand < 0) {
        expand = 0;
      }

      drawer.dataset.expand = expand;

      updateDrawerPosition(drawer);

    }

  }, { passive: false });

});

/* ---------------- FILTER STATES ---------------- */

const filterTags =
  document.querySelectorAll('.filter-tag');

const clearTagsButton =
  document.querySelector('.clear-tags');

const activeFilters = {

  year: null,

  category: null,

  type: null,

  series: null,

  size: null,

  materials: []

};

/* ---------------- FILTER PROJECTS ---------------- */

function filterProjects() {

  sortedProjects.forEach(project => {

    const projectCard =
      document.querySelector(
        `.project-card[data-slug="${project.slug}"]`
      );

    let visible = true;

    ['year', 'category', 'series', 'size']

  .forEach(category => {

    if (
      activeFilters[category] &&
      project.tags[category] !== activeFilters[category]
    ) {

      visible = false;

    }

  });

if (activeFilters.type) {

  const cleanTypes =
    Array.isArray(project.tags.type)
      ? project.tags.type.filter(Boolean)
      : [project.tags.type];

  if (
    !cleanTypes.includes(activeFilters.type)
  ) {

    visible = false;

  }

}

    activeFilters.materials.forEach(material => {

  const cleanMaterials =
    project.tags.materials.filter(Boolean);

  if (
    !cleanMaterials.includes(material)
  ) {

    visible = false;

  }

});

projectCard.style.display =
  visible ? 'flex' : 'none';

  /* ---------------- TAG AVAILABILITY ---------------- */

  filterTags.forEach(tag => {

    tag.classList.remove('disabled');

    const filterGroup =
      tag.closest('.filter-group');

    const category =
      filterGroup.dataset.category;

    const value =
      tag.dataset.tag;

    if (tag.classList.contains('active')) {
      return;
    }

    let valid = false;

    sortedProjects.forEach(project => {

      let matches = true;

     ['year', 'category', 'series', 'size']

  .forEach(testCategory => {

    if (testCategory === category) return;

    if (
      activeFilters[testCategory] &&
      project.tags[testCategory] !== activeFilters[testCategory]
    ) {

      matches = false;

    }

  });

if (
  activeFilters.type &&
  category !== 'type'
) {

  const cleanTypes =
    Array.isArray(project.tags.type)
      ? project.tags.type.filter(Boolean)
      : [project.tags.type];

  if (
    !cleanTypes.includes(activeFilters.type)
  ) {

    matches = false;

  }

}

      activeFilters.materials.forEach(material => {

  if (
    category === 'materials' &&
    material === value
  ) {
    return;
  }

  const cleanMaterials =
    project.tags.materials.filter(Boolean);

  if (
    !cleanMaterials.includes(material)
  ) {

    matches = false;

  }

});

      if (matches) {

        if (category === 'materials') {

          if (
            project.tags.materials.includes(value)
          ) {

            valid = true;

          }

        } else {

          if (category === 'type') {

  const cleanTypes =
    Array.isArray(project.tags.type)
      ? project.tags.type.filter(Boolean)
      : [project.tags.type];

  if (
    cleanTypes.includes(value)
  ) {

    valid = true;

  }

} else {

  if (
    project.tags[category] === value
  ) {

    valid = true;

  }

}

        }

      }

    });

    if (!valid) {

      tag.classList.add('disabled');

    }

  });

  });

}


/* ---------------- TAG CLICK ---------------- */

filterTags.forEach(tag => {

  tag.addEventListener('click', () => {

    const filterGroup =
      tag.closest('.filter-group');

    const category =
      filterGroup.dataset.category;

    const value =
      tag.dataset.tag;

    if (category === 'materials') {

      const index =
        activeFilters.materials.indexOf(value);

      if (index > -1) {

        activeFilters.materials.splice(index, 1);

        tag.classList.remove('active');

      } else {

        activeFilters.materials.push(value);

        tag.classList.add('active');

      }

    } else {

      filterGroup
        .querySelectorAll('.filter-tag')
        .forEach(button => {

          button.classList.remove('active');

        });

      if (activeFilters[category] === value) {

        activeFilters[category] = null;

      } else {

        activeFilters[category] = value;

        tag.classList.add('active');

      }

    }

    filterProjects();

    const hasActiveFilters =

      activeFilters.year ||
      activeFilters.category ||
      activeFilters.type ||
      activeFilters.series ||
      activeFilters.size ||
      activeFilters.materials.length > 0;

    clearTagsButton.style.display =
      hasActiveFilters
        ? 'block'
        : 'none';

  });

});

/* ---------------- CLEAR TAGS ---------------- */

clearTagsButton.addEventListener('click', () => {

  activeFilters.year = null;
  activeFilters.category = null;
  activeFilters.type = null;
  activeFilters.series = null;
  activeFilters.size = null;
  activeFilters.materials = [];

  filterTags.forEach(tag => {

    tag.classList.remove('active');

    tag.classList.remove('disabled');

  });

  clearTagsButton.style.display = 'none';

  filterProjects();

});

/* ---------------- HASH ROUTING ---------------- */

window.addEventListener('load', () => {

  const slug =
    window.location.hash.replace('#', '');

  if (!slug) return;

  openDrawer(slug);

});

/* ---------------- LOGO HANDOFF ---------------- */

const heroLogo =
  document.getElementById('heroLogo');

const headerLogo =
  document.querySelector('.header-logo');

function updateLogoTransition() {

  if (!heroLogo || !headerLogo) return;

  const rect =
    heroLogo.getBoundingClientRect();

  const start =
    window.innerHeight * 0.15;

  const end =
    -rect.height * -0.1;

  let progress =
    (start - rect.bottom) /
    (start - end);

  progress =
    Math.max(
      0,
      Math.min(1, progress)
    );

  headerLogo.style.transform =
    `translateY(${120 - (120 * progress)}px)`;

}

window.addEventListener(
  'scroll',
  updateLogoTransition
);

window.addEventListener(
  'resize',
  updateLogoTransition
);

updateLogoTransition();

/* ---------------- ABOUT DRAWER ---------------- */

const aboutButton =
  document.getElementById('aboutButton');

const aboutDrawer =
  document.getElementById('aboutDrawer');

aboutButton.addEventListener('click', (e) => {

  e.stopPropagation();

  document
    .querySelectorAll('.drawer')
    .forEach(drawer => {

      drawer.classList.remove('active');

    });

  aboutDrawer.classList.add('active');

  aboutDrawer.scrollTop = 0;

  aboutDrawer.dataset.expand = '0';

  aboutDrawer.style.top = '32vh';

  document.body.style.overflow = 'hidden';

});

const contactButton =
  document.getElementById('contactButton');

const contactDrawer =
  document.getElementById('contactDrawer');

contactButton.addEventListener('click', (e) => {

  e.stopPropagation();

  document
    .querySelectorAll('.drawer')
    .forEach(drawer => {

      drawer.classList.remove('active');

    });

 contactDrawer.classList.add('active');

contactDrawer.scrollTop = 0;

contactPull = 0;

contactDrawer.style.top = '62vh';

  document.body.style.overflow = 'hidden';

});

const aboutExhibitions =
  document.querySelector('.about-exhibitions');

aboutDrawer.addEventListener('wheel', (e) => {

  if (!aboutDrawer.classList.contains('active')) return;

  if (
    e.deltaY < 0 &&
    aboutExhibitions.scrollTop <= 0
  ) {

    e.preventDefault();

    closeDrawer(aboutDrawer);

    return;

  }

  aboutExhibitions.scrollTop += e.deltaY;

  e.preventDefault();

}, { passive: false });

let contactPull = 0;

contactDrawer.addEventListener('wheel', (e) => {

  if (!contactDrawer.classList.contains('active')) return;

  if (e.deltaY < 0) {

    e.preventDefault();

    contactPull += Math.abs(e.deltaY);

    if (contactPull > 120) {

      contactPull = 0;

      closeDrawer(contactDrawer);

    }

  } else {

    contactPull = 0;

  }

}, { passive: false });

document.addEventListener('click', (e) => {

  const clickedTag =
    e.target.closest('.filter-tag');

  const clickedGroup =
    e.target.closest('.filter-group');

  const clickedClear =
    e.target.closest('.clear-tags');

  const clickedProject =
    e.target.closest('.project-card');

  if (
  clickedTag ||
  clickedClear ||
  clickedProject
) return;

  const firstProject =
    document.querySelector('.homepage-grid');

  const projectTop =
    firstProject.getBoundingClientRect().top;

  if (e.clientY > projectTop) return;

  activeFilters.year = null;
  activeFilters.category = null;
  activeFilters.type = null;
  activeFilters.series = null;
  activeFilters.size = null;
  activeFilters.materials = [];

  filterTags.forEach(tag => {

    tag.classList.remove('active');
    tag.classList.remove('disabled');

  });

  clearTagsButton.style.display = 'none';

  filterProjects();

});

}