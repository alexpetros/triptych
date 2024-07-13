# Specifications

This is a document in which I'm keeping track of the various technical decisions I'm making in the
polyfill, so that the proposals can be built out with the necessary specificity.

## Hyperlinks
- Anchors with the `target` attribute will replace the target, instead of a hard navigation

## Buttons
- HTTP buttons are only enabled if the `action` attribute is a valid URL
- If the `method` attribute is a valid HTTP method (any casing), use that, otherwise use GET
- If the `target` attribute is specified, it will replace the first element that matches that
  selector, unless there is an iFrame with an identical name
- Buttons with a name and value will send that data, in the URL if GET/DELETE, the body otherwise
- The presence of a valid `action` supersedes the form action

## Forms
- Forms support the PUT, PATCH, and DELETE methods
- Forms support the `target` attribute, and replace the target instead of the whole page

## Targeting and Replacement
- If the `target` is a preexisting special keyword or iFrame, preexisting behavior takes precedence
- If the `target` is an invalid query selector, or a query selector that does not return any
  elements, then nothing happens
- Add additional `_this` keyword which targets the element that made the request (`_self` is taken)

# Navigation
- History is only saved if there is a full-page navigation
- Back button will show the page as it was when the navigation occurred (including any partial,
  non-navigation replacements that happened). This mimics existing navigation behavior
- History is only saved if there is a full-page navigation

## Misc
- Query strings are dropped from the URL, to mimic ([4.10.22.3](https://www.w3.org/TR/2011/WD-html5-20110525/association-of-controls-and-forms.html#form-submission-algorithm))


# Unresolved
- Should there be a history toggle?
- Should buttons implement existing iFrame and "special" targets
