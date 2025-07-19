import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import Gio from 'gi://Gio';
import St from 'gi://St';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import GLib from 'gi://GLib';

const SETTINGS_SCHEMA = 'org.gnome.shell.extensions.calibre-search';
let settings = new Gio.Settings({ schema_id: SETTINGS_SCHEMA });

console.info('[CalibreSearchProvider] Extension loaded');

class SearchProvider {
    constructor(extension) {
        this._extension = extension;
        this._lastSearchResponse = null;
        console.info('[CalibreSearchProvider] SearchProvider constructed');
    }

    /**
     * The application of the provider.
     *
     * Applications will return a `Gio.AppInfo` representing themselves.
     * Extensions will usually return `null`.
     *
     * @type {Gio.AppInfo}
     */
    get appInfo() {
        console.debug('[CalibreSearchProvider] get appInfo called');
        // Faking name and icon for GNOME Shell acceptance
        let appInfo = Gio.AppInfo.get_default_for_uri_scheme('https');
        appInfo.get_name = () => 'Calibre Books';
        appInfo.get_icon = () => Gio.icon_new_for_string('system-search');
        return appInfo;
    }

    /**
     * Whether the provider offers detailed results.
     *
     * Applications will return `true` if they have a way to display more
     * detailed or complete results. Extensions will usually return `false`.
     *
     * @type {boolean}
     */
    get canLaunchSearch() {
        console.debug('[CalibreSearchProvider] get canLaunchSearch called');
        return true;
    }

    /**
     * The unique ID of the provider.
     *
     * Applications will return their application ID. Extensions will usually
     * return their UUID.
     *
     * @type {string}
     */
    get id() {
        console.debug('[CalibreSearchProvider] get id called');
        return this._extension.uuid;
    }

    /**
     * Launch the search result.
     *
     * This method is called when a search provider result is activated.
     *
     * @param {string} result - The result identifier
     * @param {string[]} terms - The search terms
     */
    activateResult(result, terms) {
        let CALIBRE_BASE_URL = settings.get_string('calibre-base-url');
        let CALIBRE_LIBRARY_ID = settings.get_string('calibre-library-id');
        let url = `${CALIBRE_BASE_URL}/#book_id=${result}&library_id=${CALIBRE_LIBRARY_ID}&panel=book_details`;
        console.info(`[CalibreSearchProvider] activateResult called for result: ${result}, terms: ${terms}`);
        try {
            Gio.AppInfo.launch_default_for_uri(url, null);
            console.info(`[CalibreSearchProvider] Launched URL: ${url}`);
        } catch (e) {
            console.info(`[CalibreSearchProvider] Failed to launch URL: ${url}`);
            console.error(e);
        }
    }

    /**
     * Launch the search provider.
     *
     * This method is called when a search provider is activated. A provider can
     * only be activated if the `appInfo` property holds a valid `Gio.AppInfo`
     * and the `canLaunchSearch` property is `true`.
     *
     * Applications will typically open a window to display more detailed or
     * complete results.
     *
     * @param {string[]} terms - The search terms
     */
    launchSearch(terms) {
        let CALIBRE_BASE_URL = settings.get_string('calibre-base-url');
        let CALIBRE_LIBRARY_ID = settings.get_string('calibre-library-id');
        let search = encodeURIComponent(terms.join(' '));
        let url = `${CALIBRE_BASE_URL}/#library_id=${CALIBRE_LIBRARY_ID}&panel=book_list&search=${search}`;
        console.info(`[CalibreSearchProvider] launchSearch called with terms: ${terms}`);
        Gio.AppInfo.launch_default_for_uri(url, null);
        console.info(`[CalibreSearchProvider] Launched search URL: ${url}`);
    }

    /**
     * Create a result object.
     *
     * This method is called to create an actor to represent a search result.
     *
     * Implementations may return any `Clutter.Actor` to serve as the display
     * result, or `null` for the default implementation.
     *
     * @param {ResultMeta} meta - A result metadata object
     * @returns {Clutter.Actor|null} An actor for the result
     */
    createResultObject(meta) {
        console.debug('[CalibreSearchProvider] createResultObject called', meta);
        return null; // Use default result rendering
    }

    /**
     * Get result metadata.
     *
     * This method is called to get a `ResultMeta` for each identifier.
     *
     * If @cancellable is triggered, this method should throw an error.
     *
     * @async
     * @param {string[]} results - The result identifiers
     * @param {Gio.Cancellable} cancellable - A cancellable for the operation
     * @returns {Promise<ResultMeta[]>} A list of result metadata objects
     */
    async getResultMetas(results, cancellable) {
        console.info(`[CalibreSearchProvider] getResultMetas called for results: ${results}`);
        let response = this._lastSearchResponse;
        let CALIBRE_BASE_URL = settings.get_string('calibre-base-url');
        let CALIBRE_LIBRARY_ID = settings.get_string('calibre-library-id');
        let USERNAME = settings.get_string('username');
        let PASSWORD = settings.get_string('password');
        let metas = await Promise.all(results.map(async id => {
            let meta = response && response.metadata && response.metadata[id] ? response.metadata[id] : {};
            console.debug(`[CalibreSearchProvider] Processing metadata for id ${id}:`, meta);
            // Cover fetch will use size from createIcon callback
            let coverPath = null;
            return {
                id,
                name: meta.title || `Book #${id}`,
                description: meta.authors ? meta.authors.join(', ') : '',
                clipboardText: meta.title || '',
                createIcon: async size => {
                    // Get scale factor from theme context
                    let scale = St.ThemeContext.get_for_stage(global.stage).scale_factor;
                    let width = Math.round(0.75 * size * scale);
                    let height = Math.round(size * scale);
                    try {
                        coverPath = await fetchAndSaveCover(id, CALIBRE_LIBRARY_ID, width, height, USERNAME, PASSWORD, CALIBRE_BASE_URL);
                    } catch (e) {
                        console.error(`[CalibreSearchProvider] Failed to fetch cover for id ${id}:`, e);
                    }
                    if (coverPath && GLib.file_test(coverPath, GLib.FileTest.EXISTS)) {
                        return new St.Icon({ gicon: Gio.icon_new_for_string(coverPath), icon_size: size });
                    } else {
                        return new St.Icon({ icon_name: 'book', icon_size: size });
                    }
                }
            };
        }));
        return metas;
    }

    /**
     * Initiate a new search.
     *
     * This method is called to start a new search and should return a list of
     * unique identifiers for the results.
     *
     * If @cancellable is triggered, this method should throw an error.
     *
     * @async
     * @param {string[]} terms - The search terms
     * @param {Gio.Cancellable} cancellable - A cancellable for the operation
     * @returns {Promise<string[]>} A list of result identifiers
     */
    async getInitialResultSet(terms, cancellable) {
        let CALIBRE_BASE_URL = settings.get_string('calibre-base-url');
        let CALIBRE_LIBRARY_ID = settings.get_string('calibre-library-id');
        let USERNAME = settings.get_string('username');
        let PASSWORD = settings.get_string('password');
        let search = encodeURIComponent(terms.join(' '));
        let url = `${CALIBRE_BASE_URL}/interface-data/books-init?library_id=${CALIBRE_LIBRARY_ID}&search=${search}&sort=timestamp.desc&${Date.now()}`;
        console.info(`[CalibreSearchProvider] getInitialResultSet called with terms: ${terms}`);
        console.debug(`[CalibreSearchProvider] Fetching URL: ${url}`);
        try {
            let text = await fetchCalibreWithCurl(url, USERNAME, PASSWORD);
            // Check if response is valid JSON
            let json;
            try {
                json = JSON.parse(text);
            } catch (parseErr) {
                console.error('[CalibreSearchProvider] Failed to parse JSON response:', parseErr);
                console.error('[CalibreSearchProvider] Raw response:', text);
                throw new Error('Calibre API did not return valid JSON. Check authentication, network, or server status.');
            }
            this._lastSearchResponse = json;
            let ids = (json.search_result && json.search_result.book_ids) ? json.search_result.book_ids.map(String) : [];
            console.info(`[CalibreSearchProvider] Found book ids: ${ids}`);
            return ids;
        } catch (e) {
            console.error('[CalibreSearchProvider] Error in getInitialResultSet (curl):', e);
            throw e;
        }
    }

    /**
     * Refine the current search.
     *
     * This method is called to refine the current search results with
     * expanded terms and should return a subset of the original result set.
     *
     * Implementations may use this method to refine the search results more
     * efficiently than running a new search, or simply pass the terms to the
     * implementation of `getInitialResultSet()`.
     *
     * If @cancellable is triggered, this method should throw an error.
     *
     * @async
     * @param {string[]} results - The original result set
     * @param {string[]} terms - The search terms
     * @param {Gio.Cancellable} cancellable - A cancellable for the operation
     * @returns {Promise<string[]>}
     */
    async getSubsearchResultSet(results, terms, cancellable) {
        console.info(`[CalibreSearchProvider] getSubsearchResultSet called with results: ${results}, terms: ${terms}`);
        try {
            return await this.getInitialResultSet(terms, cancellable);
        } catch (e) {
            console.error('[CalibreSearchProvider] Error in getSubsearchResultSet:', e);
            throw e;
        }
    }

    /**
     * Filter the current search.
     *
     * This method is called to truncate the number of search results.
     *
     * Implementations may use their own criteria for discarding results, or
     * simply return the first n-items.
     *
     * @param {string[]} results - The original result set
     * @param {number} maxResults - The maximum amount of results
     * @returns {string[]} The filtered results
     */
    filterResults(results, maxResults) {
        console.debug(`[CalibreSearchProvider] filterResults called with maxResults: ${maxResults}`);
        return results.slice(0, maxResults);
    }
}

// Helper to fetch Calibre API results using curl with Digest authentication
function fetchCalibreWithCurl(url, username, password) {
    return new Promise((resolve, reject) => {
        let argv = [
            'curl',
            '-s', // silent
            '--digest',
            '-u', `${username}:${password}`,
            url
        ];
        let proc = new Gio.Subprocess({
            argv,
            flags: Gio.SubprocessFlags.STDOUT_PIPE | Gio.SubprocessFlags.STDERR_PIPE
        });
        proc.init(null);
        proc.communicate_utf8_async(null, null, (proc, res) => {
            try {
                let [, stdout, stderr] = proc.communicate_utf8_finish(res);
                if (stderr && stderr.length > 0) {
                    console.error('[CalibreSearchProvider] curl stderr:', stderr);
                }
                resolve(stdout);
            } catch (e) {
                reject(e);
            }
        });
    });
}

// Helper to fetch and save Calibre book cover with Digest authentication
async function fetchAndSaveCover(id, libraryId, width, height, username, password, baseUrl) {
    const tmpDir = GLib.get_tmp_dir();
    const coversDir = GLib.build_filenamev([tmpDir, 'calibre-covers']);
    if (!GLib.file_test(coversDir, GLib.FileTest.IS_DIR)) {
        GLib.mkdir_with_parents(coversDir, 0o700);
    }
    const fileName = `${id}_${width}x${height}`;
    const filePath = GLib.build_filenamev([coversDir, fileName]);
    if (GLib.file_test(filePath, GLib.FileTest.EXISTS)) {
        return filePath;
    }
    const url = `${baseUrl}/get/thumb/${id}/${libraryId}?sz=${width}x${height}`;
    return new Promise((resolve, reject) => {
        let argv = [
            'curl',
            '-s',
            '--digest',
            '-u', `${username}:${password}`,
            '-o', filePath,
            url
        ];
        let proc = new Gio.Subprocess({
            argv,
            flags: Gio.SubprocessFlags.STDOUT_PIPE | Gio.SubprocessFlags.STDERR_PIPE
        });
        proc.init(null);
        proc.communicate_utf8_async(null, null, (proc, res) => {
            try {
                let [, , stderr] = proc.communicate_utf8_finish(res);
                if (stderr && stderr.length > 0) {
                    console.error('[CalibreSearchProvider] curl stderr (cover):', stderr);
                }
                resolve(filePath);
            } catch (e) {
                reject(e);
            }
        });
    });
}

export default class WebSearchProviderExtension extends Extension {
    enable() {
        console.info('[CalibreSearchProvider] Extension enabled');
        this._provider = new SearchProvider(this);
        Main.overview.searchController.addProvider(this._provider);
    }

    disable() {
        console.info('[CalibreSearchProvider] Extension disabled');
        Main.overview.searchController.removeProvider(this._provider);
        this._provider = null;
    }
}