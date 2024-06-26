describe("Targeting", async () => {
  beforeEach(async () => {
    clearWorkArea()
  })

  afterEach(async () => {
    fetchMock.restore()
    clearWorkArea()
  })

  it('replaces itself', async () => {
    fetchMock.get('/test', 'plaintext')
    const button = make('<button id=test action="/test" target="_this">Plain Text</button>')
    button.click()
    await fetchMock.flush(true)
    const button2 = document.getElementById('test')
    assertNull(button2)
  })

  it('replaces a target by ID', async () => {
    fetchMock.get('/test', '<div id=response>success</div>')
    make(`
      <button id=button action="/test" target="#response-target">Plain Text</button>
      <div id=response-target>Target</div>
    `)
    let button = byId('button')
    button.click()
    await fetchMock.flush(true)

    const response = byId('response')
    assertTruthy(byId('button'))
    assertEqual(response.innerHTML, 'success')
  })

  it('will not replace an item if an iFrame with the same name exists', async () => {
    fetchMock.get('/test', '<div id=response>success</div>')
    make(`
      <button id=button action="/test" target="#response-target">Plain Text</button>
      <iframe name="#response-target" id=iframe></iframe>
      <div id=response-target>Target</div>
    `)
    let button = byId('button')
    button.click()
    await fetchMock.flush(true)

    assertTruthy(byId('button'))
    assertTruthy(byId('iframe'))
    assertTruthy(byId('response-target'))
  })

})

describe("<button>", async () => {
  beforeEach(async () => {
    clearWorkArea();
  })

  afterEach(async () => {
    fetchMock.restore()
    clearWorkArea()
  })

  it('makes a GET request by default', async () => {
    fetchMock.get('/test', 'plaintext')
    const button = make('<button id=test action="/test" target="_this">Plain Text</button>')
    button.click()
    await fetchMock.flush(true)
    const button2 = document.getElementById('test')
    assertEqual(button2, null)
  })

  it('makes a GET request', async () => {
    fetchMock.get('/test', 'plaintext')
    const button = make(`
      <button id=test action="/test" method=GET target="_this">Plain Text</button>
    `)
    button.click()
    await fetchMock.flush(true)
    const button2 = document.getElementById('test')
    assertEqual(button2, null)
  })

  it('makes a POST request', async () => {
    fetchMock.post('/test', 'plaintext')
    const button = make(`
      <button id=test action="/test" method=POST target="_this">Plain Text</button>
    `)
    button.click()
    await fetchMock.flush(true)
    const button2 = document.getElementById('test')
    assertEqual(button2, null)
  })

  it('makes a PUT request', async () => {
    fetchMock.put('/test', 'plaintext')
    const button = make(`
      <button id=test action="/test" method=PUT target="_this">Plain Text</button>
    `)
    button.click()
    await fetchMock.flush(true)
    const button2 = document.getElementById('test')
    assertEqual(button2, null)
  })

  it('makes a PATCH request', async () => {
    fetchMock.patch('/test', 'plaintext')
    const button = make(`
      <button id=test action="/test" method=PATCH target="_this">Plain Text</button>
    `)
    button.click()
    await fetchMock.flush(true)
    const button2 = document.getElementById('test')
    assertEqual(button2, null)
  })

  it('makes a DELETE request', async () => {
    fetchMock.delete('/test', 'plaintext')
    const button = make(`
      <button id=test action="/test" method=DELETE target="_this">Plain Text</button>
    `)
    button.click()
    await fetchMock.flush(true)
    const button2 = document.getElementById('test')
    assertEqual(button2, null)
  })

  it('replaces itself with plaintext', async () => {
    fetchMock.get('/test', 'plaintext')
    const div = make(`
    <div><button id=test action="/test" target="_this">Plain Text</button></div>
    `);
    const button = byId('test')
    button.click()
    await fetchMock.flush(true)
    assertEqual(div.innerHTML, 'plaintext')
  })

  it('replaces itself with an HTML element', async () => {
    fetchMock.get("/test", '<div id=response>Success!</div>')
    const button = make(`
      <button id=test action="/test" target="_this">HTML</button>
    `)
    button.click()
    await fetchMock.flush(true)
    const response = byId('response')
    assertEqual(response.innerHTML, 'Success!')
  })

  it('replaces itself with multiple HTML elements', async () => {
    fetchMock.get("/test", `
      <div id=response>Success!</div>
      <style id=stylesheet>div { color: red }</style>
    `)
    const button = make('<button id=test action="/test" target="_this">HTML</button>')
    button.click()
    await fetchMock.flush(true)
    const div = byId('response')
    const style = byId('stylesheet')
    assertEqual(div.innerHTML, 'Success!')
    assertTruthy(style)
  })
})

describe("<form>", async () => {
  beforeEach(async () => {
    clearWorkArea()
  })

  afterEach(async () => {
    fetchMock.restore()
    clearWorkArea()
  })

  it('issues PUT requests', async () => {
    fetchMock.put((url, options) => {
      assertEqual(url, '/test')
      assertEqual(options.body.get('i1'), 'test')
      return true
    }, '<div id=response>success</div>')
    make(`
      <form action=/test method=PUT target=_this>
        <input type=hidden name=i1 value=test>
        <button>submit</button>
      </form>
    `)
    const button = find('button')
    button.click()
    await fetchMock.flush(true)
    assertTruthy(find('#response'))
  })

  it('issues PATCH requests', async () => {
    fetchMock.patch((url, options) => {
      assertEqual(url, '/test')
      assertEqual(options.body.get('i1'), 'test')
      return true
    }, '<div id=response>success</div>')
    make(`
      <form action=/test method=PATCH target=_this>
        <input type=hidden name=i1 value=test>
        <button>submit</button>
      </form>
    `)
    const button = find('button')
    button.click()
    await fetchMock.flush(true)
    assertTruthy(find('#response'))
  })

  it('issues DELETE requests', async () => {
    fetchMock.delete((url, options) => {
      assertEqual(url, '/test')
      assertNull(options.body)
      return true
    }, '<div id=response>success</div>')
    make(`
      <form action=/test method=DELETE target=_this>
        <input type=hidden name=i1 value=test>
        <button>submit</button>
      </form>
    `)
    const button = find('button')
    button.click()
    await fetchMock.flush(true)
    assertTruthy(find('#response'))
  })

})

describe("Misc", async () => {
  beforeEach(async () => {
    clearWorkArea()
  })

  afterEach(async () => {
    fetchMock.restore()
    clearWorkArea()
  })

  it('old methods are case-independent', async () => {
    fetchMock.get('/test', '<div id=response>success</div>')
    const button = make('<button id=test action="/test" target="_this" method=get>Plain Text</button>')
    button.click()
    await fetchMock.flush(true)
    assertNull(find('#test'))
    assertTruthy(find('#response'))
  })

  it('new methods are case-independent', async () => {
    fetchMock.put('/test', '<div id=response>success</div>')
    const button = make('<button id=test action="/test" target="_this" method=put>Plain Text</button>')
    button.click()
    await fetchMock.flush(true)
    assertNull(find('#test'))
    assertTruthy(find('#response'))
  })

})
