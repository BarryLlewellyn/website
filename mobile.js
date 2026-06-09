const isTouchDevice =
  navigator.maxTouchPoints > 0;

if (!isTouchDevice) {

  // Desktop uses app.js

} else {

  const projectOverlay =
    document.getElementById(
      'mobileProjectOverlay'
    );

  const filterOverlay =
    document.getElementById(
      'mobileFilterOverlay'
    );

  const pageOverlay =
    document.getElementById(
      'mobilePageOverlay'
    );

  const projects =
    window.sortedProjects || [];

  const activeFilters = {

    year: null,

    category: null,

    type: null,

    series: null,

    size: null,

    materials: []

  };

  /* ---------------------------------- */
  /* HELPERS                            */
  /* ---------------------------------- */

  function lockBody() {

    document.body.style.overflow =
      'hidden';

  }

  function unlockBody() {

    document.body.style.overflow =
      '';

  }

  function closeAllOverlays() {

    projectOverlay.classList.remove(
      'active'
    );

    filterOverlay.classList.remove(
      'active'
    );

    pageOverlay.classList.remove(
      'active'
    );

    projectOverlay.innerHTML = '';

    filterOverlay.innerHTML = '';

    pageOverlay.innerHTML = '';

    unlockBody();

  }

  function buildSpecs(project) {

    let html = '';

    Object.entries(project.specs)
      .forEach(([key, value]) => {

        if (!value) return;

        html += `
          <p>
            ${key}: ${value}
          </p>
        `;

      });

    return html;

  }

  function buildTags(project) {

    let html = '';

    Object.entries(project.tags)
      .forEach(([key, value]) => {

        if (
          key === 'materials'
        ) {

          value
            .filter(Boolean)
            .forEach(material => {

              html += `
                <span>
                  #${material}
                </span>
              `;

            });

        }

        else if (
          key === 'type'
        ) {

          const cleanTypes =
            Array.isArray(value)
              ? value.filter(Boolean)
              : [value];

          cleanTypes.forEach(type => {

            html += `
              <span>
                #${type}
              </span>
            `;

          });

        }

        else if (value) {

          html += `
            <span>
              #${value}
            </span>
          `;

        }

      });

    return html;

  }

  function buildDescription(project) {

    const seriesDescription =
      window.seriesDescriptions[
        project.tags.series
      ] || [];

    let combinedDescription;

    if (
      project.description.length > 0 &&
      project.description[0] === '--'
    ) {

      combinedDescription =
        project.description.slice(1);

    }

    else {

      combinedDescription = [

        ...seriesDescription,

        ...project.description

      ];

    }

    return combinedDescription
      .map(paragraph => {

        return `
          <p>${paragraph}</p>
        `;

      })
      .join('');

  }

  function buildImages(project) {

    let html = '';

    for (
      let i = 1;
      i <= 8;
      i++
    ) {

      const number =
        String(i)
          .padStart(2, '0');

      const path =
        `projects/${project.folder}/${number}.jpg`;

      html += `

        <img
          src="${path}"
          loading="lazy"
          onerror="this.remove()"
        >

      `;

    }

    return html;

  }

  function getProject(slug) {

    return projects.find(
      project =>
        project.slug === slug
    );

  }

  /* ---------------------------------- */
  /* PROJECT OVERLAY                    */
  /* ---------------------------------- */

  function openProject(project) {

    lockBody();

    projectOverlay.innerHTML = `

      <div class="mobile-project-close">

        <button
          id="mobileCloseProject"
        >
          [×]
        </button>

        <div>

          ${project.title}

        </div>

      </div>

      <div
        class="mobile-project-content"
      >

        <h1
          class="mobile-project-title"
        >

          ${project.title}

        </h1>

        <div
          class="mobile-project-specs"
        >

          ${buildSpecs(project)}

        </div>

        <div
          class="mobile-project-images"
        >

          ${buildImages(project)}

        </div>

        <div
          class="mobile-project-description"
        >

          ${buildDescription(project)}

        </div>

        <div
          class="mobile-project-tags"
        >

          ${buildTags(project)}

        </div>

      </div>

    `;

    projectOverlay.classList.add(
      'active'
    );

    document
      .getElementById(
        'mobileCloseProject'
      )
      .addEventListener(
        'click',
        closeAllOverlays
      );

  }

  /* ---------------------------------- */
  /* PROJECT CARD CLICK                 */
  /* ---------------------------------- */

  document
    .querySelectorAll(
      '.project-card'
    )
    .forEach(card => {

      card.addEventListener(
        'click',
        e => {

          e.preventDefault();

          const slug =
            card.dataset.slug;

          const project =
            getProject(slug);

          if (!project) return;

          openProject(project);

        }
      );

    });

const footer = document.createElement('div');

footer.className = 'mobile-footer';

footer.innerHTML = `
  © Barry Llewellyn 2026<br>
  Click here to join the mailing list
`;

document
  .querySelector('.homepage-grid')
  .after(footer);

  /* ---------------------------------- */
  /* FILTER PROJECTS                    */
  /* ---------------------------------- */

  function applyFilters() {

    projects.forEach(project => {

      const card =
        document.querySelector(
          `.project-card[data-slug="${project.slug}"]`
        );

      if (!card) return;

      let visible = true;

      [
        'year',
        'category',
        'series',
        'size'
      ]

      .forEach(category => {

        if (

          activeFilters[
            category
          ]

          &&

          project.tags[
            category
          ] !==

          activeFilters[
            category
          ]

        ) {

          visible = false;

        }

      });

      if (
        activeFilters.type
      ) {

        const types =
          Array.isArray(
            project.tags.type
          )

          ?

          project.tags.type

          :

          [
            project.tags.type
          ];

        if (
          !types.includes(
            activeFilters.type
          )
        ) {

          visible = false;

        }

      }

      activeFilters.materials
        .forEach(material => {

          if (

            !project.tags.materials
              .includes(
                material
              )

          ) {

            visible = false;

          }

        });

      card.style.display =
        visible
          ? ''
          : 'none';

    });

  }

    /* ---------------------------------- */
  /* FILTER OVERLAY                     */
  /* ---------------------------------- */

  function buildFilterGroup(
    title,
    category,
    values
  ) {

    return `

      <div
        class="mobile-filter-group"
      >

        <h3>
          ${title}
        </h3>

        ${values.map(value => {

          return `

            <button
              class="mobile-filter-button"
              data-category="${category}"
              data-value="${value}"
            >

              ${value}

            </button>

          `;

        }).join('')}

      </div>

    `;

  }

  function openFilters() {

    lockBody();

    filterOverlay.innerHTML = `

      <div
        class="mobile-filter-header"
      >

        <strong>
          Filters
        </strong>

        <button
          id="closeFilters"
        >
          ×
        </button>

      </div>

      <div
        class="mobile-filter-content"
      >

        ${buildFilterGroup(
          'Year',
          'year',
          [
            '2026',
            '2025',
            '2024',
            '2023',
            '2022',
            '2021',
            '2020'
          ]
        )}

        ${buildFilterGroup(
          'Category',
          'category',
          [
            'Mirror',
            'Floor lamp',
            'Table lamp',
            'Hanging lamp',
            'Wall piece',
            'Table',
            'Sculpture',
            'Event / Club'
          ]
        )}

        ${buildFilterGroup(
          'Material',
          'materials',
          [
            'Ceramic',
            'Stone',
            'Metal',
            'Glass',
            'Foam',
            'Found material'
          ]
        )}

        ${buildFilterGroup(
          'Type',
          'type',
          [
            'Object',
            'Curation',
            'Collaboration'
          ]
        )}

        ${buildFilterGroup(
          'Series',
          'series',
          [
            'Polyphony',
            'Lalalamp',
            'Primordial Antics',
            'Habitat Lamp',
            'Adansonia',
            'Vascular Bloom',
            'Perennial',
            'Other'
          ]
        )}

        ${buildFilterGroup(
          'Size',
          'size',
          [
            'Tiny',
            'Small',
            'Medium',
            'Large',
            'Huge'
          ]
        )}

        <button
          id="clearMobileFilters"
        >

          Clear Filters

        </button>

      </div>

    `;

    filterOverlay.classList.add(
      'active'
    );

    document
      .getElementById(
        'closeFilters'
      )
      .addEventListener(
        'click',
        closeAllOverlays
      );

    document
      .querySelectorAll(
        '.mobile-filter-button'
      )
      .forEach(button => {

        button.addEventListener(
          'click',
          () => {

            const category =
              button.dataset.category;

            const value =
              button.dataset.value;

            if (
              category ===
              'materials'
            ) {

              const index =
                activeFilters
                  .materials
                  .indexOf(
                    value
                  );

              if (
                index > -1
              ) {

                activeFilters
                  .materials
                  .splice(
                    index,
                    1
                  );

              }

              else {

                activeFilters
                  .materials
                  .push(
                    value
                  );

              }

            }

            else {

              activeFilters[
                category
              ] =

              activeFilters[
                category
              ] === value

              ?

              null

              :

              value;

            }

            applyFilters();

          }

        );

      });

    document
      .getElementById(
        'clearMobileFilters'
      )
      .addEventListener(
        'click',
        () => {

          activeFilters.year =
            null;

          activeFilters.category =
            null;

          activeFilters.type =
            null;

          activeFilters.series =
            null;

          activeFilters.size =
            null;

          activeFilters.materials =
            [];

          applyFilters();

        }
      );

  }

  /* ---------------------------------- */
  /* ABOUT                              */
  /* ---------------------------------- */

  function openAbout() {

    lockBody();

    const aboutDrawer =
      document.getElementById(
        'aboutDrawer'
      );

    pageOverlay.innerHTML = `

  <div class="mobile-project-close">

    <button id="closePage">
      [x]
    </button>

    <div>
      About
    </div>

  </div>

  <div class="mobile-page-content">

    ${aboutDrawer.innerHTML}

  </div>

`;

    pageOverlay.classList.add(
      'active'
    );

    document
      .getElementById(
        'closePage'
      )
      .addEventListener(
        'click',
        closeAllOverlays
      );

  }

  /* ---------------------------------- */
  /* CONTACT                            */
  /* ---------------------------------- */

 function openContact() {

  lockBody();

  const contactDrawer =
    document.getElementById(
      'contactDrawer'
    );

  pageOverlay.innerHTML = `

    <div class="mobile-project-close">

      <button id="closePage">
        [x]
      </button>

      <div>
        Contact
      </div>

    </div>

    <div class="mobile-page-content">

  ${contactDrawer.innerHTML}

</div>

</div>

  `;

  pageOverlay.classList.add(
    'active'
  );

  document
    .getElementById(
      'closePage'
    )
    .addEventListener(
      'click',
      closeAllOverlays
    );

}

  /* ---------------------------------- */
  /* BUTTONS                            */
  /* ---------------------------------- */

  const aboutButton =
    document.getElementById(
      'aboutButton'
    );

  const contactButton =
    document.getElementById(
      'contactButton'
    );

  const filterButton =
    document.getElementById(
      'mobileFiltersButton'
    );

  if (aboutButton) {

    aboutButton.addEventListener(
      'click',
      e => {

        e.preventDefault();

        openAbout();

      }
    );

  }

  if (contactButton) {

    contactButton.addEventListener(
      'click',
      e => {

        e.preventDefault();

        openContact();

      }
    );

  }

  if (filterButton) {

    filterButton.addEventListener(
      'click',
      e => {

        e.preventDefault();

        openFilters();

      }
    );

  }

  /* ---------------------------------- */
  /* INIT                               */
  /* ---------------------------------- */

  applyFilters();

}