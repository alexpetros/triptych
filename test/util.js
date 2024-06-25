function find(query) {
  return getWorkArea().querySelector(query)
}

function byId(id) {
  return document.getElementById(id)
}

function make(htmlStr) {
  const makeFn = function () {
    const workArea = getWorkArea();
    const template = document.createElement('template')
    template.innerHTML = htmlStr

    const children = Array.from(template.content.children)
    for (const child of children) {
      workArea.appendChild(child)
    }
    processNode(workArea)
    return children[0]
  }

  if (getWorkArea()) {
    return makeFn()
  } else {
    ready(makeFn)
  }
}

function ready(fn) {
  if (document.readyState !== 'loading') {
    fn()
  } else {
    document.addEventListener('DOMContentLoaded', fn)
  }
}

function getWorkArea() {
  return byId("work-area")
}

function clearWorkArea() {
  var workArea = getWorkArea();
  if (workArea) workArea.innerHTML = ""
}

class AssertionError extends Error {}

function assertNull(x) {
  if (x !== null && x !== undefined) {
    throw new AssertionError(`Expected ${x} to be null or undefined`)
  }
}

function assertTruthy(x) {
  if (!x) {
    throw new AssertionError(`Expected ${x} to be truthy`)
  }
}

function assertEqual(left, right) {
  if (left !== right) {
    throw new AssertionError(`Expected
      left: ${left}
      to be equal to
      right: ${right}
      `)
  }
}

// endregion
