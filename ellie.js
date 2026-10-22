// Ellie the butterfly. Mood is set with data-mood on the <svg>.
export const ELLIE_SVG = `
<svg class="ellie" viewBox="0 0 110 92" role="img" aria-label="Ellie the butterfly" data-mood="ready">
  <g class="wing wing-l">
    <path d="M53 40C40 8 8 4 6 24c-2 16 18 24 44 22Z" class="bw1"/>
    <path d="M51 50c-21 0-37 12-31 26 6 12 24 0 32-20Z" class="bw2"/>
    <circle cx="28" cy="26" r="8" class="bloop"/>
  </g>
  <g class="wing wing-r">
    <path d="M57 40c13-32 45-36 47-16 2 16-18 24-44 22Z" class="tw1"/>
    <path d="M59 50c21 0 37 12 31 26-6 12-24 0-32-20Z" class="tw2"/>
    <circle cx="82" cy="26" r="8" class="tloop"/>
  </g>
  <rect x="49" y="34" width="12" height="44" rx="6" class="body"/>
  <path d="M50 20Q46 8 40 6M60 20q4-12 10-14" class="ant"/>
  <circle cx="40" cy="6" r="2.5" class="antd"/><circle cx="70" cy="6" r="2.5" class="antd"/>
  <circle cx="55" cy="30" r="11" class="head"/>
  <g class="eyes e-dot"><circle cx="51" cy="29" r="2.3"/><circle cx="59" cy="29" r="2.3"/><circle cx="51.8" cy="28.2" r=".8" class="shine"/><circle cx="59.8" cy="28.2" r=".8" class="shine"/></g>
  <g class="eyes e-closed"><path d="M48.5 30q2.5-3 5 0M56.5 30q2.5-3 5 0"/></g>
  <g class="eyes e-star"><path d="M51 26l1 2 2.2.3-1.6 1.5.4 2.2-2-1.1-2 1.1.4-2.2-1.6-1.5 2.2-.3zM59 26l1 2 2.2.3-1.6 1.5.4 2.2-2-1.1-2 1.1.4-2.2-1.6-1.5 2.2-.3z"/></g>
  <ellipse cx="47" cy="34" rx="2.5" ry="1.6" class="cheek"/><ellipse cx="63" cy="34" rx="2.5" ry="1.6" class="cheek"/>
  <path d="M52 34q3 3 6 0" class="mouth m-smile"/>
  <path d="M52 33.5q3 4.5 6 0Z" class="mouth m-open"/>
  <path d="M52.5 35h5" class="mouth m-flat"/>
  <circle cx="55" cy="35" r="1.6" class="mouth m-o"/>
</svg>`;

export const MINI_BUTTERFLY = `<svg viewBox="0 0 26 22" aria-hidden="true"><path d="M12 10C8 0 0 2 1 8c1 4 6 4 11 3Z" fill="#97C459"/><path d="M14 10C18 0 26 2 25 8c-1 4-6 4-11 3Z" fill="#85B7EB"/><path d="M12 12C6 13 4 19 8 20c3 0 4-4 4-7Z" fill="#C0DD97"/><path d="M14 12c6 1 8 7 4 8-3 0-4-4-4-7Z" fill="#B5D4F4"/><rect x="12" y="6" width="2" height="14" rx="1" fill="#D85A30"/></svg>`;

export const STAGE_ART = {
  egg: `<svg viewBox="0 0 22 22" aria-hidden="true"><ellipse cx="11" cy="12" rx="6" ry="8" fill="#FAEEDA" stroke="#BA7517" stroke-width="2"/></svg>`,
  caterpillar: `<svg viewBox="0 0 30 22" aria-hidden="true"><circle cx="5" cy="14" r="4" fill="#97C459"/><circle cx="12" cy="13" r="4.5" fill="#97C459"/><circle cx="20" cy="12" r="5.5" fill="#639922"/><circle cx="19" cy="11" r="1.2" fill="#173404"/><circle cx="23" cy="11" r="1.2" fill="#173404"/></svg>`,
  chrysalis: `<svg viewBox="0 0 22 22" aria-hidden="true"><path d="M11 2c7 4 6 16 0 18-6-2-7-14 0-18Z" fill="#C0DD97" stroke="#3B6D11" stroke-width="2"/></svg>`,
  butterfly: MINI_BUTTERFLY,
};
