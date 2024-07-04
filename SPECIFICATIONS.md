# Specifications

This is a document in which I'm keeping track of the various technical decisions I'm making in the
polyfill, so that the proposals can be built out with the necessary specificity.

## Buttons
- HTTP buttons are only enabled if the `action` attribute is a valid URL
- If the `method` attribute is a valid HTTP method (any casing), use that, otherwise use GET
- If the `target` attribute is specified, it will replace the first element that matches that
  selector, unless there is an iFrame with an identical name
- [Unimplemented] iFrame targeting
- [Unimplemented] Existing special targets for forms and links
- [Unimplemented] Buttons with a name and value will send that data, in the URL if GET/DELETE, the
  body otherwise


## Hyperlinks
- Anchors with the `target` attribute will replace the


## Forms

## Misc
- If the target element is an invalid query selector, or does not appear
- Add additional "_this" keyword which targets the element that made the request
- Query strings are dropped ([4.10.22.3](https://www.w3.org/TR/2011/WD-html5-20110525/association-of-controls-and-forms.html#form-submission-algorithm))

## Unresolved
