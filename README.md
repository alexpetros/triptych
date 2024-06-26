# Triptych - Polyfill for three small HTML proposals

Replace `<main>` with the result of `GET /home:`
```html
<a href=/home target="main">Home</a>
<main></main>
```

Replace the whole page with the result of `DELETE /users/354`:
```html
<button action=/users/354 method=DELETE></button>
```

Replace the button with the result of `DELETE /users/354`
```html
<button action=/users/354 method=DELETE target="_this"></button>
```

Replace the #user-info `<div>` with the result of `PUT /users/354`
```html
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

Inspired by [htmx](https://htmx.org/), [htmz](https://leanrada.com/htmz/), and the entire ecosystem of attribute-based hypermedia libraries.

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

The main limitation involves full page navigations. When submitting a POST form, the default
behavior is to push that URL onto the URL bar and displays the resulting HTML from the form;
clicking the refresh button resubmits the POST request—after the user confirms that they intended
this.

When "target"s are not supplied on buttons and forms, Triptych simulates the full-page behavior to
the best of its ability. It replaces the entire document and uses the
[history API](https://developer.mozilla.org/en-US/docs/Web/API/History) to update the browser URL
and history. Clicking "back" should basically work as expected.

However, because of (very reasonable) limitations in JavaScript, Triptych cannot alter the behavior
of the refresh button to make it resubmit a PUT, as proposed. Nor can it simulate one of the primary
benefit of doing a POST-redirect pattern—that it resets the current JS environment.

Also, for all of these requests, the browser should show a loading bar, the same way that
clicking on a link does. This behavior is impossible to simulate in JavaScript but would
significantly benefit the user if incorporated into the browser.

## Development

The entire source is in `./triptych.js`.

To run the tests, first install the dev dependencies with `npm install`.
Then, run the tests by opening `./test/index.html` in your browser.

You can also play around with manual tests by running `npm run dev`

### To-do

* Add full-page tests that verify existing GET/POST forms are not affected
* Push new methods to history

## FAQ

### Should I use this in my project?

Not yet, but soon.

This library's featureset will track the proposals that it is supporting, which will have to
incporate feedback, and thus cannot provide strong backwards compatibility guarantees at the start.

That having been said, it is versioned as a pre-1.x, so feel free to make use of it as an early
adopter if you like, and as the proposal firms up, I will make the necessary changes and log them
appropriately. It's not deployed to a CDN yet, but will be soon.

### What if multiple elements match the target?

Targeting is done using the [querySelector API](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector), which performs a depth-first pre-order traversal of the document's nodes. The target will be the first matching element found, per that algorithm.
