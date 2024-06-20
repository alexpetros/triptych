const ADDITIONAL_FORM_METHODS = ['PUT', 'PATCH', 'DELETE']
const EXISTING_TARGET_KEYWORDS = ['_self', '_blank', '_parent', '_top', '_unfencedTop']

/**
  * @param {string} url
  * @param {string} method
  * @param {FormData} data
  * @param {string} target
  */
function ajax(url, method, data, target) {
  /** @param {Event} e */
  return async (e) => {
    e.preventDefault()  // The new actions override old ones


    let targetElement
    if (target === '_this') {
      targetElement = e.target
    } else if (target) {
      targetElement = document.querySelector('target')
      if (!targetElement) {
        console.error(`no element found for target ${target} - ignorning`)
        return null
      }
    }

    const opts = { method }
    if (method !== 'GET' && method !== 'DELETE') {
      opts.body = data
    } // else convert to URL params

    const res = await fetch(url, opts)
    const responseText = await res.text()
    if (targetElement) {
      const template = document.createElement('template')
      template.innerHTML = responseText
      processNode(template)
      console.log(template.content.children)

      // @ts-ignore - all the targets are going to be Elements
      // TODO Support for retargeting
      targetElement.replaceWith(template.content)
    } else {
      // TODO check for html wrapper?
      document.querySelector('html').innerHTML = responseText
      processNode(document)
      // TODO push to url and history
      // Handle redirects
    }
  }
}

/**
  * @param {Document | Element} node
  */
function processNode(node) {
  // #1 forms can PUT, PATCH, and DELETE
  const forms = node.querySelectorAll('form')
  for (const form of forms) {
    const method = form.getAttribute('method')
    const target = form.getAttribute('target') || undefined
    // Only process forms that a) have subtree targets or b) have new methods
    // TODO move this into query selector?
    if (target || ADDITIONAL_FORM_METHODS.includes(method)) {
      const url = form.getAttribute('action')
      const data = new FormData(form)
      form.addEventListener('submit', ajax(url, method, data, target))
    }
  }

  // #2 buttons can make requests on their own
  const buttons = node.querySelectorAll('button[action]')
  for (const button of buttons) {
    const url = button.getAttribute('action')
    const target = button.getAttribute('target')
    const method = button.getAttribute('method') || 'GET'
    // TODO add the name/value if appropriate
    button.addEventListener('click', ajax(url, method, undefined, target))
  }

  // #3 Links, buttons and forms can target
  const links = node.querySelectorAll('a[target]')
  for (const link of links) {
    const target = link.getAttribute('target')
    const hasExistingBehavior = EXISTING_TARGET_KEYWORDS.includes(target) ||
      document.querySelector(`iframe[name=${target}]`)

    const url = link.getAttribute('href')
    if (!hasExistingBehavior) {
      link.addEventListener('click', ajax(url, 'GET', undefined, target))
    }
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => { processNode(document) });
} else {
  processNode(document)
}
