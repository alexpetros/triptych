// These are vars so that they just get redeclared if the script is re-executed
var ADDITIONAL_FORM_METHODS = ['PUT', 'PATCH', 'DELETE']
var EXISTING_TARGET_KEYWORDS = ['_self', '_blank', '_parent', '_top', '_unfencedTop']

/**
  * @param {string} html
  * @param {string} url
  * @param {boolean} addHistory
  */
function replacePage(html, url, addHistory) {
  if (!history.state) {
    const state = { html: document.documentElement.innerHTML, url: window.location.href }
    history.replaceState(state, "")
  }

  // Replace the page's HTML and, if applicable, add it to the history state
  document.querySelector('html').innerHTML = html
  if (addHistory) history.pushState({ html, url }, "", url)


  // We have to manually execute all the scripts that we inserted into the page
  document.querySelectorAll('script').forEach(oldScript => {
    const newScript = document.createElement("script")
    Array.from(oldScript.attributes).forEach(attr => {
      newScript.setAttribute(attr.name, attr.value)
    })

    const scriptText = document.createTextNode(oldScript.innerHTML)
    newScript.appendChild(scriptText)
    oldScript.replaceWith(newScript)
  })
}

/**
  * @param {string} rawUrl
  * @param {string} method
  * @param {FormData} formData
  * @param {string} target
  */
function ajax(rawUrl, method, formData, target) {
  // Remove the query string form the URL, if it's present
  const queryIndex = rawUrl.indexOf('?')
  let url = queryIndex > -1 ? rawUrl.substring(0, queryIndex) : rawUrl

  /** @param {Event} e */
  return async (e) => {
    // End immediately if there's an iFrame with the target name
    if (document.querySelector(`iframe[name="${target}"]`)) return null
    // This comes after the iFrame check so that normal iFrame targeting is preserved
    e.preventDefault()

    let targetElement
    if (target === '_this') {
      targetElement = e.target
    } else {
      targetElement = document.querySelector(target)
    }

    if (!targetElement) {
      console.error(`no element found for target ${target} - ignorning`)
      return null
    }

    const opts = { method }
    // If the methods allow for request bodies, add the data there
    if (method !== 'GET' && method !== 'DELETE') {
      opts.body = formData
    // Otherwise, if there is formData at all, add it to the URL params
    } else if (formData != null) { // != null checks for both null and undefined
      const queryParams = (new URLSearchParams(formData)).toString()
      url += '?' + queryParams
    }

    const res = await fetch(url, opts)
    const responseText = await res.text()
    if (targetElement) {
      const template = document.createElement('template')
      template.innerHTML = responseText
      processNode(template)

      // @ts-ignore - all the targets are going to be Elements
      targetElement.replaceWith(template.content)
    } else {
      replacePage(responseText, res.url)
    }
  }
}

/**
  * @param {Document | Element} node
  */
function processNode(node) {
  // Find all the forms
  const forms = node.querySelectorAll('form')
  for (const form of forms) {
    const method = form.getAttribute('method')
    const target = form.getAttribute('target') || undefined
    // Only process forms that a) have subtree targets or b) have new methods
    if (target || ADDITIONAL_FORM_METHODS.includes(method)) {
      const url = form.getAttribute('action')
      const formData = new FormData(form)
      form.addEventListener('submit', ajax(url, method, formData, target))
    }
  }

  // Find the buttons with an action attribute
  const buttons = node.querySelectorAll('button[action]')
  for (const button of buttons) {
    const url = button.getAttribute('action')
    const target = button.getAttribute('target')
    const method = button.getAttribute('method') || 'GET'
    let formData
    if (button.getAttribute('name')) {
      formData = new FormData()
      formData.append(button.getAttribute('name'), button.getAttribute('value'))
    }
    button.addEventListener('click', ajax(url, method, formData, target))
  }

  // Find the links with a target attribute
  const links = node.querySelectorAll('a[target]')
  for (const link of links) {
    const target = link.getAttribute('target')
    const url = link.getAttribute('href')
    if (url && !EXISTING_TARGET_KEYWORDS.includes(target) ) {
      link.addEventListener('click', ajax(url, 'GET', undefined, target))
    }
  }
}

// Process all the nodes once when the DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => { processNode(document) })
} else {
  processNode(document)
}

// Handle forward/back buttons
window.addEventListener("popstate", (event) => {
  if (event.state) replacePage(event.state.html, event.state.url, true)
}, { once: true })

