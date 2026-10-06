// Shared by the server layout (inline <head> script) and the client theme store.

export const THEME_STORAGE_KEY = "island-theme";

/**
 * Runs in <head> before first paint (see app/layout.tsx): resolves the stored preference or the
 * OS setting into a `light`/`dark` class on <html>, so there is no flash of the wrong theme.
 */
export const themeInitScript = `(function(){var d=document.documentElement;d.classList.add('js');try{var p=localStorage.getItem('${THEME_STORAGE_KEY}');var r=(p==='light'||p==='dark')?p:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');d.classList.add(r);}catch(e){}})();`;
