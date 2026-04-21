import { extension_settings, getContext } from '../../../extensions.js';
import { saveSettingsDebounced } from '../../../../script.js';

const extensionName = 'SceneKit';
const defaultSettings = {};

function loadSettings() {
    extension_settings[extensionName] ??= {};
    Object.assign(extension_settings[extensionName], {
        ...defaultSettings,
        ...extension_settings[extensionName],
    });
}

jQuery(async () => {
    loadSettings();
    console.log(`[${extensionName}] loaded`);
});
