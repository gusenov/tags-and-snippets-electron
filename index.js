/*eslint-env node, es6 */

import { DHTMLX } from './architecture/third-party.js';
import { Приложение } from './architecture/классы/Приложение.js';

// DHTMLX.Event(window, "load", function () {
  window.dhx4.skin = 'material';
  // window.dhx4.skin = 'dhx_skyblue';
  // window.dhx4.skin = 'dhx_web';
  // window.dhx4.skin = 'dhx_terrace';

  let приложение = new Приложение();
// });
