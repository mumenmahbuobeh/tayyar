'use strict';
const { contextBridge, ipcRenderer } = require('electron');

const EVENTS = ['dl:update', 'dl:progress', 'dl:removed', 'settings', 'ui:add-url', 'ui:clip-url'];
const inv = (name) => (...args) => ipcRenderer.invoke(name, ...args);

const bridge = {
  list: inv('list'),
  platform: inv('platform'),
  settings: {
    get: inv('settings:get'),
    set: inv('settings:set'),
  },
  getSettings: inv('settings:get'),
  setSettings: inv('settings:set'),
  probe: inv('probe'),
  add: inv('add'),
  pause: inv('pause'),
  resume: inv('resume'),
  pauseAll: inv('pauseAll'),
  resumeAll: inv('resumeAll'),
  remove: inv('remove'),
  open: inv('open'),
  reveal: inv('reveal'),
  chooseDir: inv('chooseDir'),
  openExtensionFolder: inv('openExtensionFolder'),
  openUrl: inv('openUrl'),
  installUpdate: inv('installUpdate'),
  on(channel, cb) {
    if (!EVENTS.includes(channel)) return;
    ipcRenderer.on(channel, (_e, payload) => cb(payload));
  },
};

// Expose both window.tayyar and window.api for maximum compatibility
contextBridge.exposeInMainWorld('tayyar', bridge);
contextBridge.exposeInMainWorld('api', bridge);

