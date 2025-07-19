# Calibre Search Provider for GNOME Shell

This GNOME Shell extension enables you to search your Calibre library directly from the shell overview.

It is a work in progress and requires manual configuration.

> [!WARNING]
> This extension stores your calibre server credentials in the GNOME settings database. If your credentials are part of your security model, this extension may not be suitable for you.

## Installation

1. Clone this repository into your local GNOME Shell extensions folder:

    ```bash
    git clone https://github.com/fractalmachinist/calibre-search ~/.local/share/gnome-shell/extensions/calibre-search@fractalmachinist.github.com
    ```

2. Restarting the shell with <kbd>Alt</kbd>+<kbd>F2</kbd> and <kbd>r</kbd> is not supported under Wayland. Instead, log out and log back in to reload extensions.

3. Enable the Calibre Search Provider extension using GNOME Extensions or GNOME Tweaks.

> **Note:** On Wayland sessions, shell restarts via <kbd>Alt</kbd>+<kbd>F2</kbd> are unavailable. Always log out and back in after installing or updating extensions.

### Potential Issue
During development, I encountered issues where the preferences configuration worked fine, but the search results failed. I fixed this by:
- Copying the `calibre-search@fractalmachinist.github.com/schemas/org.gnome.shell.extensions.calibre-search.gschema.xml` file to `/usr/share/glib-2.0/schemas/`
- Running `sudo glib-compile-schemas /usr/share/glib-2.0/schemas/` to compile the schemas.
- Restarting GNOME Shell (log out and back in).

This is not recommended by GNOME and may be an issue specific to my development environment. If you encounter similar issues, consider this workaround.

## Configuration

The extension is configured via GNOME settings. You must set the following options in the preferences window:

- **Calibre Base URL**: The base URL of your Calibre server (e.g., `http://localhost:8080`).
- **Library ID**: The ID of the Calibre library to search. If you visit a Calibre library page in the browser, the ID is part of the URL (e.g., `http://localhost:8080/#library_id=THIS_RIGHT_HERE_FOLKS&panel=book_list`)
- **Username**: Your Calibre server username (if authentication is required).
- **Password**: Your Calibre server password (if authentication is required).

To open the preferences, use GNOME Extensions or run:

```bash
gnome-extensions prefs calibre-search@fractalmachinist.github.com
```

Configuration changes take effect when the extension is activated. You may need to disable and re-enable the extension after changing settings, or log out and back in to apply the changes.

## Usage

When typing a query in GNOME’s activity view, Calibre books matching your search will be displayed. Selecting a result will open the book details page in your default web browser. Selecting the search results block (to the left of the search results) will open the Calibre search results page in your browser.

## Acknowledgements

This extension is inspired by other GNOME Shell search providers and uses GNOME Shell's search provider API.

## License

Calibre Search Provider for GNOME Shell  
Copyright (C) 2025 Contributors

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
