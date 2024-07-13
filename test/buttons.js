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

  it('makes a GET request with a single value', async () => {
    fetchMock.get('/test?q=yes', 'plaintext')
    const button = make(`
      <button id=test action="/test" method=GET target="_this" name=q value=yes>
        Plain Text
      </button>
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

})
