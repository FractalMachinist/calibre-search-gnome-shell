import Gio from 'gi://Gio';
import Adw from 'gi://Adw';

import {ExtensionPreferences, gettext as _} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class CalibreSearchPreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        window._settings = this.getSettings();

        const page = new Adw.PreferencesPage({
            title: _('Calibre Search'),
            icon_name: 'system-search-symbolic',
        });
        window.add(page);

        const group = new Adw.PreferencesGroup({
            title: _('Connection'),
            description: _('Configure Calibre server connection and authentication'),
        });
        page.add(group);

        // Calibre Base URL
        const urlRow = new Adw.EntryRow({
            title: _('Calibre Base URL'),
        });
        window._settings.bind('calibre-base-url', urlRow, 'text', Gio.SettingsBindFlags.DEFAULT);
        group.add(urlRow);

        // Library ID
        const libRow = new Adw.EntryRow({
            title: _('Library ID'),
        });
        window._settings.bind('calibre-library-id', libRow, 'text', Gio.SettingsBindFlags.DEFAULT);
        group.add(libRow);

        // Username
        const userRow = new Adw.EntryRow({
            title: _('Username'),
        });
        window._settings.bind('username', userRow, 'text', Gio.SettingsBindFlags.DEFAULT);
        group.add(userRow);

        // Password
        const passRow = new Adw.EntryRow({
            title: _('Password'),
        });
        window._settings.bind('password', passRow, 'text', Gio.SettingsBindFlags.DEFAULT);
        group.add(passRow);
    }
}
