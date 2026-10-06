import { catalogSeed, fleetSeed, logbookSeed } from '../data/seed';

const VERSION = 'u2-1';

function clone(value){ return JSON.parse(JSON.stringify(value)); }

export function initStorage(){
  if (localStorage.getItem('skyops_u2_version') !== VERSION) {
    localStorage.setItem('skyops_u2_catalogo', JSON.stringify(catalogSeed));
    localStorage.setItem('skyops_u2_flota', JSON.stringify(fleetSeed));
    if (!localStorage.getItem('skyops_u2_bitacora')) localStorage.setItem('skyops_u2_bitacora', JSON.stringify(logbookSeed));
    if (!localStorage.getItem('skyops_u2_manifiesto')) localStorage.setItem('skyops_u2_manifiesto', '[]');
    localStorage.setItem('skyops_u2_version', VERSION);
  }
}
export function read(key, fallback=[]){
  initStorage();
  try { return JSON.parse(localStorage.getItem(key)) ?? clone(fallback); } catch { return clone(fallback); }
}
export function write(key, value){ localStorage.setItem(key, JSON.stringify(value)); }
export const keys = {
  catalog:'skyops_u2_catalogo', fleet:'skyops_u2_flota', manifest:'skyops_u2_manifiesto', logbook:'skyops_u2_bitacora'
};
