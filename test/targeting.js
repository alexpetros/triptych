describe("Targeting and replacement", async () => {
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
