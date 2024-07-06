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

})
