# ANONYMIZATION NOTE
These are copy-pasted from my browser's developer tools, with sensitive information redacted.
Anonymization replaces values with IDs from the settings like so:
- {calibre-base-url}
- {calibre-library-id}
- {username}
- {password}

Auth-related values have been redacted by replacement with "x" (for strings, including digit strings) or "0" (for numbers). The book metadata is redacted, and its ID has been replaced with "1230". That value is never ambiguously applied: any time you see "1230", it refers to the book ID.


# Single Book

## Book Page
URL: `{calibre-base-url}/#book_id=1230&library_id={calibre-library-id}&panel=book_details`


## Book Cover
### Book Cover Request
```
GET /get/thumb/1230/{calibre-library-id}?sz=300x400 HTTP/1.1
Host: {calibre-base-url fragment}
User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0
Accept: image/avif,image/webp,image/png,image/svg+xml,image/*;q=0.8,*/*;q=0.5
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Sec-GPC: 1
Authorization: Digest username="{username}", realm="calibre", nonce="xxxxxxxxxxxxxxxxxxxx:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", uri="/get/thumb/1230/{calibre-library-id}?sz=300x400", algorithm=MD5, response="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", qop=auth, nc=00000000, cnonce="xxxxxxxxxxxxxxxx"
Connection: keep-alive
Referer: {calibre-base-url}/
Priority: u=4, i
Pragma: no-cache
Cache-Control: no-cache
```

*Thourgh testing, I found that the `sz` parameter was very flexible and could be set to many unconventional values. I saw issues when I set it to `sz=1x10` and haven't checked deeply.*

### Book Cover Response
```
HTTP/1.1 200 OK
Accept-Ranges: bytes
Content-Length: 15795
Content-Type: image/jpeg
Date: Sat, 19 Jul 2025 16:34:25 GMT
ETag: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
Keep-Alive: timeout=120
Server: calibre 8.5.0
Set-Cookie: android_workaround=xxxxxxxxxxxxxxxxxxxx:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx; Path=/get/thumb/1230/{calibre-library-id}; Version=1
```
*This was followed by a JSON body.*

# Search Page

# Search Results (JSON)
## Search Results Request
```
GET /interface-data/books-init?library_id={calibre-library-id}&search=Searchterm&sort=timestamp.desc&1752900000000 HTTP/1.1
Host: {calibre-base-url fragment}
User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0
Accept: */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Sec-GPC: 1
Authorization: Digest username="{username}", realm="calibre", nonce="xxxxxxxxxxxxxxxxxxxx:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", uri="/interface-data/books-init?library_id={calibre-library-id}&search=Searchterm&sort=timestamp.desc&1752900000000", algorithm=MD5, response="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", qop=auth, nc=00000000, cnonce="xxxxxxxxxxxxxxxx"
Connection: keep-alive
Referer: {calibre-base-url}/
Pragma: no-cache
Cache-Control: no-cache
```

## Search Results Response
```
HTTP/1.1 200 OK
Calibre-Uncompressed-Length: 00000
Content-Encoding: gzip
Content-Type: application/json; charset=UTF-8
Date: Sat, 19 Jul 2025 16:34:24 GMT
Keep-Alive: timeout=120
Server: calibre 8.5.0
Transfer-Encoding: chunked
```

```json
{
    "search_result": {
        "total_num": 1,
        "sort_order": "desc",
        "num_books_without_search": 000,
        "offset": 0,
        "num": 1,
        "sort": "timestamp",
        "base_url": "/ajax/search/{calibre-library-id}",
        "query": "A search term",
        "library_id": "{calibre-library-id}",
        "book_ids": [ 1230 ],
        "vl": ""
    },
    "sortable_fields": [
        [ "author_sort", "Authors" ],
        [ "timestamp", "Date" ],
        [ "cover", "Has cover" ],
        [ "id", "Id" ],
        [ "languages", "Languages" ],
        [ "last_modified", "Modified" ],
        [ "pubdate", "Published" ],
        [ "publisher", "Publisher" ],
        [ "rating", "Rating" ],
        [ "series", "Series" ],
        [ "size", "Size" ],
        [ "tags", "Tags" ],
        [ "sort", "Title" ]
    ],
    "field_metadata": {
        "authors": { "table": "authors", "column": "name", "link_column": "author", "category_sort": "sort", "datatype": "text", "is_multiple": { "cache_to_list": ",", "ui_to_list": "&", "list_to_ui": " & " }, "kind": "field", "name": "Authors", "search_terms": [ "authors", "author" ], "is_custom": false, "is_category": true, "is_csp": false, "label": "authors", "display": {}, "is_editable": true, "rec_index": 2 },
        "languages": { "table": "languages", "column": "lang_code", "link_column": "lang_code", "category_sort": "lang_code", "datatype": "text", "is_multiple": { "cache_to_list": ",", "ui_to_list": ",", "list_to_ui": ", " }, "kind": "field", "name": "Languages", "search_terms": [ "languages", "language" ], "is_custom": false, "is_category": true, "is_csp": false, "label": "languages", "display": {}, "is_editable": true, "rec_index": 21 },
        "series": { "table": "series", "column": "name", "link_column": "series", "category_sort": "(title_sort(name))", "datatype": "series", "is_multiple": {}, "kind": "field", "name": "Series", "search_terms": [ "series" ], "is_custom": false, "is_category": true, "is_csp": false, "label": "series", "display": {}, "is_editable": true, "rec_index": 8 },
        "formats": { "table": null, "column": null, "datatype": "text", "is_multiple": { "cache_to_list": ",", "ui_to_list": ",", "list_to_ui": ", " }, "kind": "field", "name": "Formats", "search_terms": [ "formats", "format" ], "is_custom": false, "is_category": true, "is_csp": false, "label": "formats", "display": {}, "is_editable": true, "rec_index": 13 },
        "publisher": { "table": "publishers", "column": "name", "link_column": "publisher", "category_sort": "name", "datatype": "text", "is_multiple": {}, "kind": "field", "name": "Publisher", "search_terms": [ "publisher" ], "is_custom": false, "is_category": true, "is_csp": false, "label": "publisher", "display": {}, "is_editable": true, "rec_index": 9 },
        "rating": { "table": "ratings", "column": "rating", "link_column": "rating", "category_sort": "rating", "datatype": "rating", "is_multiple": {}, "kind": "field", "name": "Rating", "search_terms": [ "rating" ], "is_custom": false, "is_category": true, "is_csp": false, "label": "rating", "display": {}, "is_editable": true, "rec_index": 5 },
        "news": { "table": "news", "column": "name", "category_sort": "name", "datatype": null, "is_multiple": {}, "kind": "category", "name": "News", "search_terms": [], "is_custom": false, "is_category": true, "is_csp": false, "label": "news", "display": {}, "is_editable": true },
        "tags": { "table": "tags", "column": "name", "link_column": "tag", "category_sort": "name", "datatype": "text", "is_multiple": { "cache_to_list": ",", "ui_to_list": ",", "list_to_ui": ", " }, "kind": "field", "name": "Tags", "search_terms": [ "tags", "tag" ], "is_custom": false, "is_category": true, "is_csp": false, "label": "tags", "display": {}, "is_editable": true, "rec_index": 6 },
        "identifiers": { "table": null, "column": null, "datatype": "text", "is_multiple": { "cache_to_list": ",", "ui_to_list": ",", "list_to_ui": ", " }, "kind": "field", "name": "Identifiers", "search_terms": [ "identifiers", "identifier", "isbn" ], "is_custom": false, "is_category": true, "is_csp": true, "label": "identifiers", "display": {}, "is_editable": true, "rec_index": 20 },
        "author_sort": { "table": null, "column": null, "datatype": "text", "is_multiple": {}, "kind": "field", "name": "Author sort", "search_terms": [ "author_sort" ], "is_custom": false, "is_category": false, "is_csp": false, "label": "author_sort", "display": {}, "is_editable": true, "rec_index": 12 },
        "au_map": { "table": null, "column": null, "datatype": "text", "is_multiple": { "cache_to_list": ",", "ui_to_list": null, "list_to_ui": null }, "kind": "field", "name": null, "search_terms": [], "is_custom": false, "is_category": false, "is_csp": false, "label": "au_map", "display": {}, "is_editable": true, "rec_index": 18 },
        "comments": { "table": null, "column": null, "datatype": "text", "is_multiple": {}, "kind": "field", "name": "Comments", "search_terms": [ "comments", "comment" ], "is_custom": false, "is_category": false, "is_csp": false, "label": "comments", "display": {}, "is_editable": true, "rec_index": 7 },
        "cover": { "table": null, "column": null, "datatype": "int", "is_multiple": {}, "kind": "field", "name": "Cover", "search_terms": [ "cover" ], "is_custom": false, "is_category": false, "is_csp": false, "label": "cover", "display": {}, "is_editable": true, "rec_index": 17 },
        "id": { "table": null, "column": null, "datatype": "int", "is_multiple": {}, "kind": "field", "name": "Id", "search_terms": [ "id" ], "is_custom": false, "is_category": false, "is_csp": false, "label": "id", "display": {}, "is_editable": true, "rec_index": 0 },
        "last_modified": { "table": null, "column": null, "datatype": "datetime", "is_multiple": {}, "kind": "field", "name": "Modified", "search_terms": [ "last_modified" ], "is_custom": false, "is_category": false, "is_csp": false, "label": "last_modified", "display": { "date_format": "dd MMM yyyy" }, "is_editable": true, "rec_index": 19 },
        "ondevice": { "table": null, "column": null, "datatype": "text", "is_multiple": {}, "kind": "field", "name": "On device", "search_terms": [ "ondevice" ], "is_custom": false, "is_category": false, "is_csp": false, "label": "ondevice", "display": {}, "is_editable": true, "rec_index": 23 },
        "path": { "table": null, "column": null, "datatype": "text", "is_multiple": {}, "kind": "field", "name": "Path", "search_terms": [], "is_custom": false, "is_category": false, "is_csp": false, "label": "path", "display": {}, "is_editable": true, "rec_index": 14 },
        "pubdate": { "table": null, "column": null, "datatype": "datetime", "is_multiple": {}, "kind": "field", "name": "Published", "search_terms": [ "pubdate" ], "is_custom": false, "is_category": false, "is_csp": false, "label": "pubdate", "display": { "date_format": "MMM yyyy" }, "is_editable": true, "rec_index": 15 },
        "marked": { "table": null, "column": null, "datatype": "text", "is_multiple": {}, "kind": "field", "name": null, "search_terms": [ "marked" ], "is_custom": false, "is_category": false, "is_csp": false, "label": "marked", "display": {}, "is_editable": true, "rec_index": 24 },
        "in_tag_browser": { "table": null, "column": null, "datatype": "text", "is_multiple": {}, "kind": "field", "name": null, "search_terms": [ "in_tag_browser" ], "is_custom": false, "is_category": false, "is_csp": false, "label": "in_tag_browser", "display": {}, "is_editable": true, "rec_index": 26 },
        "series_index": { "table": null, "column": null, "datatype": "float", "is_multiple": {}, "kind": "field", "name": null, "search_terms": [ "series_index" ], "is_custom": false, "is_category": false, "is_csp": false, "label": "series_index", "display": {}, "is_editable": true, "rec_index": 10 },
        "series_sort": { "table": null, "column": null, "datatype": "text", "is_multiple": {}, "kind": "field", "name": "Series sort", "search_terms": [ "series_sort" ], "is_custom": false, "is_category": false, "is_csp": false, "label": "series_sort", "display": {}, "is_editable": true, "rec_index": 25 },
        "sort": { "table": null, "column": null, "datatype": "text", "is_multiple": {}, "kind": "field", "name": "Title sort", "search_terms": [ "title_sort" ], "is_custom": false, "is_category": false, "is_csp": false, "label": "sort", "display": {}, "is_editable": true, "rec_index": 11 },
        "size": { "table": null, "column": null, "datatype": "float", "is_multiple": {}, "kind": "field", "name": "Size", "search_terms": [ "size" ], "is_custom": false, "is_category": false, "is_csp": false, "label": "size", "display": {}, "is_editable": true, "rec_index": 4 },
        "timestamp": { "table": null, "column": null, "datatype": "datetime", "is_multiple": {}, "kind": "field", "name": "Date", "search_terms": [ "date" ], "is_custom": false, "is_category": false, "is_csp": false, "label": "timestamp", "display": { "date_format": "dd MMM yyyy" }, "is_editable": true, "rec_index": 3 },
        "title": { "table": null, "column": null, "datatype": "text", "is_multiple": {}, "kind": "field", "name": "Title", "search_terms": [ "title" ], "is_custom": false, "is_category": false, "is_csp": false, "label": "title", "display": {}, "is_editable": true, "rec_index": 1 },
        "uuid": { "table": null, "column": null, "datatype": "text", "is_multiple": {}, "kind": "field", "name": null, "search_terms": [ "uuid" ], "is_custom": false, "is_category": false, "is_csp": false, "label": "uuid", "display": {}, "is_editable": true, "rec_index": 16 },
    },
    "virtual_libraries": { "18th Century": "tags:\"=18th Century\"", "PDFs": "format:pdf" },
    "bools_are_tristate": true,
    "book_display_fields": [ "authors", "series", "identifiers", "tags", "formats", "path", "comments" ],
    "fts_enabled": false,
    "book_details_vertical_categories": [],
    "fields_that_support_notes": [ "publisher", "authors", "series", "tags", "languages" ],
    "categories_using_hierarchy": [ "series"],
    "metadata": {
        "1230": {
            "formats": [ "EPUB" ],
            "format_sizes": { "EPUB": 0000000 },
            "authors": [ "Author Name", "Author Name" ],
            "languages": [ "eng" ],
            "publisher": "Publisher Name",
            "tags": [ "tag 1", "tag 2", "tag 3", "tag 4", "tag 5", "tag 6", "tag 7", "tag 8", "tag 9", "tag 10" ],
            "identifiers": { "isbn": "0000000000000", "google": "xxxxxxxxxxxx" },
            "author_sort": "Author Name, Author Name",
            "comments": "<p class=\"description\">This used to be an 850-character description, which is pretty typical in my library.</p>",
            "last_modified": "2020-01-01T00:00:00+00:00",
            "pubdate": "2000-00-00T00:00:00+00:00",
            "series_index": 1.0,
            "sort": "Text here used to sort the title",
            "size": 0000000,
            "timestamp": "2020-01-01T00:00:00+00:00",
            "title": "The full title of the book",
            "uuid": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
            "urls_from_identifiers": [
                [ "Google", "google", "xxxxxxxxxxxx", "https://books.google.com/books?id=xxxxxxxxxxxx" ],
                [ "0000000000000", "isbn", "0000000000000", "https://www.worldcat.org/isbn/0000000000000" ]
            ],
            "lang_names": { "eng": "English" }
        }
    },
    "library_id": "{calibre-library-id}"
}
```