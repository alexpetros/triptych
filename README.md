# Triptych - New Attributes for HTML

[Triptych](https://alexanderpetros.com/triptych) is a polyfill for three small HTML proposals:

1. [Support PUT, PATCH, and DELETE on forms](https://alexanderpetros.com/triptych/form-http-methods) ([WHATWG issue](https://github.com/whatwg/html/issues/3577#issuecomment-2294931398))
2. [Enable buttons to make HTTP requests without being wrapped in forms](https://alexanderpetros.com/triptych/button-actions)
3. Enable links, forms, and buttons to target a part of the DOM for replacement

Work on these proposals is in progress: we've put out the first one and the next two are coming soon.
If you're interested in working on that, reach out to me!

Status updates at: [https://alexanderpetros.com/triptych#status](https://alexanderpetros.com/triptych#status)

## Examples

When the link is clicked, replace `<main>` with the result of `GET /home:`

```html
<a href="/home" target="main">Home</a>
<main> <!-- Existing page content --> </main>
```

When the button is clicked, replace the whole page with the result of `DELETE /users/354`:
```html
<button action="/users/354" method="DELETE"></button>
```

When the button is clicked, replace the button with the result of `DELETE /users/354`
```html
<button action="/users/354" method="DELETE" target="_this"></button>
```

When the form is submitted, replace `<div id=user-info>` with the result of `PUT /users/354`
```html
<div id="user-info"></div>
<form action="/users/354" method="PUT" target="#user-info">
  <input type="text" name="name">
  <input type="text" name="bio">
  <button>Submit</button>
</form>
```

## Background and Design Goals

Triptych is a standards-compatible implementation of a featureset that is both core to HTML, and has a lot of recent traction in the library ecosystem: declarative HTTP requests and partial page replacement.
I outline the rationale for these proposals in [this talk I gave at Big Sky Dev Con 2024](https://unplannedobsolescence.com/blog/life-and-death-of-htmx/).

HTML has always supported declarative requests.
The hyperlink is fundamental to the grammar of the web, and the `<a>` tag lets developers specify an HTTP request and subsequent page navigation.
HTML 2.0 introduced `<form>` elements, which lets developers specify an alternate HTTP Method (`POST`) and take user input either via URL query parameters or request bodies.

The existing semantics for declarative HTTP requests have two major missing pieces: they do not support the full set of HTTP Methods (specifically `PUT`, `PATCH`, and `DELETE`), and they only support the relatively strict paradigms of navigation and form submission.

The library ecosystem shows significant demand for these two features, as well as a third: partial replacement of the DOM with the results of that network request.
The [buzziest](https://risingstars.js.org/2023/en#section-framework) library that supports these features is [htmx](https://htmx.org/), but it is far from alone.
37Signals (which invented Ruby on Rails) maintains [Hotwired](https://hotwired.dev/), an HTML-over-the-wire framework with an HTML interface, [Turbo](https://turbo.hotwired.dev/), for partial page replacement.
[Unpoly](https://unpoly.com/) adds attributes that let you target fragments of the page to get replaced, and supports the full range of HTTP methods.

Triptych is an attempt to incorporate in attributed-based DOM replacement into the HTML standard, in
a manner that best fits existing HTML semantics. It aims to demonstrate the efficacy of these
proposals, to advocate for their addition to the HTML standard, and to provide that functionality as
a polyfill until then. Its design is primarily inspired by [htmx](https://htmx.org/) and
[htmz](https://leanrada.com/htmz/).

Because the goal of Triptych is to be incorporated into the HTML standard, it does not use namespaced custom attributes (like `ng-*`, `hx-*`, and so on), but instead uses existing (or plausible) HTML standard attributes in a backwards compatible manner.
Much of the script's complexity results from the need to not break existing uses of attributes like `target` or `method`.


## Installation

There is no CDN yet, but even if I upload it to one, [you probably shouldn't use it](https://blog.wesleyac.com/posts/why-not-javascript-cdn).

Instead, install it like this:

1. Copy `triptych.js` to a folder in your project, i.e. `/vendor/triptych-0.1.0.js`
1. Serve it at that URL with a really long cache time (I usually set it to a year)
1. Include it in your document like this:

```html
<script src="/vendor/triptych-0.1-0.js"></script>
```

Make sure to include the version number in the file name so that if/when you update it, the users who have it cached will download the new version.

I will upload it to `npm` soon, so you can include it as a dependency and serve it straight from node modules (instead of copying).

## Limitations

Because these features are meant to be incorporated into the standard, they simulate the desired browser behavior, up to the limit of JavaScript's ability.

The main limitation involves full page navigation.
When submitting a POST form, the default behavior is to push that URL onto the URL bar and displays the resulting HTML from the form;
clicking the refresh button resubmits the POST request—after the user confirms that they intended this.

When `target`s are not supplied on buttons and forms, Triptych simulates the full-page behavior to the best of its ability.
It replaces the entire document and uses the [history API](https://developer.mozilla.org/en-US/docs/Web/API/History) to update the browser URL
and history.
Clicking "back" should basically work as expected.

However, because of (very reasonable) limitations in JavaScript, Triptych cannot alter the behavior of the refresh button to make it resubmit a PUT, as proposed.
Nor can it simulate one of the primary benefit of doing a POST-redirect pattern—that it resets the current JS environment.

Also, for all of these requests, the browser should show a loading bar, the same way that clicking on a link does.
This behavior is impossible to simulate in JavaScript but would significantly benefit the user if incorporated into the browser—it's one of the main things lacking from *all* JavaScript frameworks.

## Development

The entire source is in `./triptych.js`.

To run the tests, first install the dev dependencies with `npm install`.
Then, run the tests by opening `./test/index.html` in your browser.

You can also play around with manual tests by running `npm run dev`

### To-do

* Add full-page tests that verify existing GET/POST forms are not affected
* Investigate server-side re-targeting controls (probably headers)
* Investigate CSS attributes for in-progress requests

## FAQ

### Should I use this in my project?

Yes and no.

The traditional purpose of a polyfill is to provide functionality to webpages before that functionality becomes standard.
In the case of Triptych, some of that functionality cannot be simulated in JavaScript (see the Limitations section, above).

The purpose of this "polyfill" is to provide a demonstration of how these proposals would transform the capabilities of basic HTML.
This library's featureset will track the proposals that it is supporting, which will have to incporate feedback, and thus cannot provide strong backwards compatibility guarantees at the start.
But you should definitely use it to get a sense of what authoring HTML could be like.

### What if multiple elements match the target?

Targeting is done using the [querySelector API](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector), which performs a depth-first pre-order traversal of the document's nodes.
The target will be the first matching element found, per that algorithm.
