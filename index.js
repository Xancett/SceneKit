import { extension_settings, renderExtensionTemplateAsync } from '../../../extensions.js';
import { saveSettingsDebounced } from '../../../../script.js';

const extensionName = 'SceneKit';

const defaultSettings = {
    enabled: false,
    general: {
        debug: false,
    },
    sceneBehavior: {},
};

function getSettings() {
    return extension_settings[extensionName];
}

function loadSettings() {
    extension_settings[extensionName] ??= {};
    const s = extension_settings[extensionName];

    // Top-level defaults
    for (const [key, val] of Object.entries(defaultSettings)) {
        if (s[key] === undefined) s[key] = val;
    }
    // Nested section defaults
    for (const [section, defaults] of Object.entries(defaultSettings)) {
        if (typeof defaults === 'object' && defaults !== null) {
            s[section] ??= {};
            for (const [key, val] of Object.entries(defaults)) {
                s[section][key] ??= val;
            }
        }
    }
}

function applySettingsToUI() {
    const s = getSettings();
    $('#scenekit_enabled').prop('checked', s.enabled);
    $('#scenekit_debug').prop('checked', s.general.debug);
    setBodyEnabled(s.enabled);
}

function setBodyEnabled(enabled) {
    const body = $('#scenekit_settings_body');
    body.toggleClass('scenekit-disabled', !enabled);
    body.find('input').prop('disabled', !enabled);
}

jQuery(async () => {
    loadSettings();

    const html = await renderExtensionTemplateAsync(`third-party/${extensionName}`, 'settings');
    $('#extensions_settings').append(html);

    applySettingsToUI();

    $('#scenekit_enabled').on('change', function () {
        getSettings().enabled = this.checked;
        setBodyEnabled(this.checked);
        saveSettingsDebounced();
    });

    $('#scenekit_debug').on('change', function () {
        getSettings().general.debug = this.checked;
        saveSettingsDebounced();
    });

    console.log(`[${extensionName}] loaded`);
});
