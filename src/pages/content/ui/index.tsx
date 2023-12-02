import {createRoot} from 'react-dom/client';
import App from '@pages/content/ui/app';
import refreshOnUpdate from 'virtual:reload-on-update-in-view';
import injectedStyle from './injected.css?inline';

refreshOnUpdate('pages/content');

window.addEventListener("load", myMain, false);

function myMain(e) {
  const jsInitChecktimer = setInterval(checkForJS_Finish, 250);

  function checkForJS_Finish() {
    if (document.querySelector('textarea')) {
      clearInterval(jsInitChecktimer);

      const root = document.createElement('div');
      root.id = 'novelai-tag-picker-content-view-root';

      const textarea = document.querySelector('textarea');
      textarea.parentElement.insertBefore(root, textarea);
      textarea.style.display = 'none';

      const rootIntoShadow = document.createElement('div');
      rootIntoShadow.id = 'shadow-root';

      const shadowRoot = root.attachShadow({mode: 'open'});
      shadowRoot.appendChild(rootIntoShadow);

      const styleElement = document.createElement('style');
      styleElement.innerHTML = injectedStyle;
      shadowRoot.appendChild(styleElement);

      createRoot(rootIntoShadow).render(<App textarea={textarea}/>);
    }
  }
}