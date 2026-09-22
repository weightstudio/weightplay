// One authoritative guide source is reused by static HTML and in-game help.
import {PAGES} from './page-copy.mjs?v=7';
export const guides=Object.freeze(Object.fromEntries(Object.entries(PAGES).map(([locale,page])=>[locale,Object.freeze([...page.guide])])));
