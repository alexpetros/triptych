# Triptych - Polyfill for three small HTML proposals

Give buttons and forms access to additional HTTP methods, and let buttons, forms, and links target
parts of the page for partial replacement.

```html
<!-- Replaces <main> with the result of GET /home -->
<a href=/home target="main">Home</a>
<main></main>

<!-- Replaces the whole page with the result of DELETE /users/354 -->
<button action=/users/354 method=DELETE></button>

<!-- Replaces itself with the result of DELETE /users/354 -->
<button action=/users/354 method=DELETE target="_this"></button>

<!-- Replaces the #user-info div with the result of PUT/users/354-->
<div id=user-info></div>
<form action="/users/354" method=PUT target="#user-info">
  <input type=text name=name>
  <input type=text name=bio>
  <button>Submit</button>
</form>
```

## Background
These three, small additions to HTML dramatically expand its expressive power, and make plain HTML
compelling for a variety of interactive web applications:

- Enable buttons to make HTTP requests without wrapping them in forms
- Enable forms and buttons to make PUT, PATCH, and DELETE requests
- Enable links, forms, and buttons to target a part of the DOM for replacement

I outline the rationale for these proposals in [this talk I gave at Big Sky Dev Con
2024](https://unplannedobsolescence.com/blog/life-and-death-of-htmx/).
The standards proposals for each of these issues is forthcoming - if you're interested in working on
that reach out to me!

## Installation

Include triptych as a script in your HTML:

```html
<script src="triptych.js"></script>
```

## Design Goals

This project aims to demonstrate the efficacy of the above three HTML enhancements, to advocate for
their addition to the HTML standard, and to provide that functionality until then.

Because the ultimate goal of Triptych is to be incorporated into the HTML standard, it does not
use namespaced custom attributes, but instead uses existing (or plausible) HTML standard attributes
in a backwards compatible manner. Much of the script's complexity results from the need to not break
existing uses of attributes like `target` or `method`.

## Limitations

Because these features are meant to be incorporated into the standard, they simulate the desired
browser behavior, up to the limit of JavaScript's ability.

The most significant of these limitations is on forms. When submitting a POST form, the default
behavior is to push that URL onto the URL bar and displays the resulting HTML from the form;
clicking the refresh button resubmits the POST request—after the user confirms that they intended
this. Triptych simulates that behavior for PUT requests by replacing the entire document with
the result of the PUT request and pushing the new URL, but it cannot make the refresh button
resumbit that PUT request—a refresh will just issue a GET request.

Ideally, for all of these requests, the browser should show a loading bar, the same way that
clicking on a link does. This behavior is impossible to simulate in JavaScript but would
significantly benefit the user if incorporated into the browser.

## Development

The entire source is in `./triptych.js`.

To run the tests, first install the dev dependencies with `npm install`.
Then, run the tests by opening `./test/index.html` in your browser.

### To-do

* Add full-page tests that verify existing GET/POST forms are not affected
* Push new methods to history

## FAQ

### Should I use this in my project?

This library's featureset will track the proposals that it is supporting, which will have to
incporate feedback, and thus cannot provide strong backwards compatibility guarantees, at the start.

That having been said, it is versioned as a pre-1.x, so feel free to make use of it as an early
adopter if you like, and as the proposal firms up, I will make the necessary changes and log them
appropriately.

### Is it deployed to a CDN?

Not yet, but soon.
