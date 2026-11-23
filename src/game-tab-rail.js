/* Shared illustrated tab rails for Battle and nested management panels. */
(() => {
  'use strict';
  function mount(nav) {
    if (!(nav instanceof HTMLElement) || nav.tagName !== 'NAV') throw new TypeError('TAB_RAIL_NAV_REQUIRED');
    const selector='[aria-selected="true"],[data-wp-frame-action="tab"]:is([aria-pressed="true"],[aria-current="page"]),.wp-play-icon-tab[aria-pressed="true"]';
    let selected;
    nav.dataset.wpPlayActions='';
    nav.dataset.wpTabRail='';
    if(nav.children.length>=4)for(const button of nav.children)button.style.setProperty('--wp-button-art-size','20px','important');
    const geometry=new ResizeObserver(update);
    function update() {
      const next=nav.querySelector(selector);
      if(next!==selected){if(selected)geometry.unobserve(selected);if(next)geometry.observe(next);}
      const parent=nav.getBoundingClientRect(), rect=next?.getBoundingClientRect();
      if(!rect?.width||!parent.width){nav.removeAttribute('data-wp-tab-marker');selected=next;return;}
      const ratio=nav.offsetWidth/parent.width;
      nav.style.setProperty('--wp-tab-x',((rect.left+rect.width/2-parent.left)*ratio)+'px');
      nav.style.setProperty('--wp-tab-width',(rect.width*ratio*.9)+'px');
      nav.setAttribute('data-wp-tab-marker','');selected=next;
    }
    const changes=new MutationObserver(update);
    changes.observe(nav,{subtree:true,childList:true,attributes:true,attributeFilter:['aria-selected','aria-pressed','aria-current','hidden']});
    geometry.observe(nav);queueMicrotask(update);
    return Object.freeze({element:nav,destroy(){geometry.disconnect();changes.disconnect();nav.removeAttribute('data-wp-tab-marker');}});
  }
  window.WeightPlayTabRail=Object.freeze({mount});
})();
