// Small, authored square functional symbols. No font glyph/fallback dependency.
export function actionIconMarkup(id){
 const art=id==='interact'?'<path fill="#f5c475" stroke="#ffe8a9" stroke-width="2" d="M25 43V29h5v-9h5v13h3V17h5v17h3V23h5v18l-8 10H32z"/><path fill="#659a9b" d="M27 48h18v9H27z"/><path fill="#ffe285" d="m13 17 5-5 5 5-5 5zm36-4 3-6 3 6 6 3-6 3-3 6-3-6-6-3z"/>':'<path fill="#83eadb" stroke="#d4fff0" stroke-width="2" d="m32 11 11 4-5 17 12 8 5 2v8H34l-8-13z"/><path fill="#e3b664" d="m17 28 8 3-4 13 9 7v6H13l-4-10z"/><path fill="none" stroke="#edffd7" stroke-width="3" d="M7 14h16M5 21h13M47 56h12"/>';
 return `<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><path fill="#0c2838" stroke="#9ab8b0" stroke-width="2" d="M7 3h50l4 4v50l-4 4H7l-4-4V7z"/><path fill="#173f4b" d="M8 8h48v48H8z"/>${art}</svg>`;
}
