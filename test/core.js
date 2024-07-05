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

describe("URL and Method parsing", async () => {
  beforeEach(async () => {
    clearWorkArea()
  })

  afterEach(async () => {
    fetchMock.restore()
    clearWorkArea()
  })

  it('Existing query params are stripped', async () => {
    fetchMock.get('/test?q=yes', 'plaintext')
    const button = make(`
      <button id=test action="/test?other=no" method=GET target="_this" name=q value=yes>
        Plain Text
      </button>
    `)
    button.click()
    await fetchMock.flush(true)
    const button2 = document.getElementById('test')
    assertEqual(button2, null)
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
