/* Category expansion is native HTML; JavaScript only enhances sorting. */
'use strict';

for (const category of document.querySelectorAll('.math-digest-index .digest-category')) {
  const control = category.querySelector('.digest-sort');
  const select = control.querySelector('select');
  const body = category.querySelector('tbody');
  const indexHeading = category.querySelector('.digest-index-heading');
  const importanceHeading = category.querySelector('.digest-importance-heading');

  function sortFamilies() {
    const byImportance = select.value === 'importance';
    const rows = Array.from(body.rows);
    rows.sort((a, b) => {
      const importance = byImportance
        ? Number(b.dataset.importance) - Number(a.dataset.importance) : 0;
      return importance || Number(a.dataset.familyId) - Number(b.dataset.familyId);
    });
    body.append(...rows);
    indexHeading.removeAttribute('aria-sort');
    importanceHeading.removeAttribute('aria-sort');
    (byImportance ? importanceHeading : indexHeading)
      .setAttribute('aria-sort', byImportance ? 'descending' : 'ascending');
  }

  select.addEventListener('change', sortFamilies);
  // Respect form values restored by the browser when returning to the index.
  sortFamilies();
  control.hidden = false;
}
