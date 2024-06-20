# Missing Piece - Tiny HTML Additions for Massive Impact

- Enable buttons to make HTTP requests without wrapping them in forms
- Enable forms and buttons to make PUT, PATCH, and DELETE requests
- Enable links, forms, and buttons to target a part of the DOM for replacement

These three, small additions to HTML dramatically expand its expressive power, and make it
sufficient for a variety of interactive web applications.

I outline the rationale for these proposals in [this talk I gave at Big Sky Dev Con
2024](https://unplannedobsolescence.com/blog/life-and-death-of-htmx/). The standards proposals for
each of these issues is forthcoming.

## Design Goals

This project aims to demonstrate the efficacy of the above three HTML enhancements, to advocate for
their addition to the HTML standard, and to provide that functionality until then.

Because the ultimate goal of Missing Piece is to be incorporated into the HTML standard, it does not
use namespaced custom attributes, but instead uses existing (or plausible) HTML standard attributes
in a backwards compatible manner. Much of the script's complexity results from the need to not break
existing uses of attributes like `target` or `method`.

## FAQ

### Should I use this in my project?

This library's featureset will track the proposals that it is supporting, which will have to
incporate feedback, and thus cannot provide strong backwards compatibility guarantees, at the start.

That having been said, it is versioned as a pre-1.x, so feel free to make use of it as an early
adopter if you like, and as the proposal firms up, I will make the necessary changes and log them
appropriately.

### Is it deployed to a CDN?

Not yet, but soon.
