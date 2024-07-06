describe("Misc", async () => {
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
