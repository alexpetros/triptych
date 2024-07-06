describe("<a>", async () => {
  beforeEach(async () => {
    clearWorkArea();
  })

  afterEach(async () => {
    fetchMock.restore()
    clearWorkArea()
  })

  it('does not target links without valid href', async () => {
    fetchMock.get('/test', '<div id=res>response</div>')
    const link = make('<a id=link action="/test" method=GET target="_this">Click me</a>')
    link.click()
    await fetchMock.flush(true)
    assertTruthy(document.getElementById('link'))
  })

  it('replaces itself if the target is "_this"', async () => {
    fetchMock.get('/test', '<div id=res>response</div>')
    const link = make('<a id=link href=/test target="_this">Click me</a>')
    link.click()
    await fetchMock.flush(true)
    assertNull(document.getElementById('link'))
    assertTruthy(document.getElementById('res'))
  })

  it('replaces the target if the target is a valid CSS selector', async () => {
    fetchMock.get('/test', '<div id=res>response</div>')
    make(`
      <a id=link href=/test target=#res-target>Click me</a>
      <div id=res-target>Target</div>
    `)

    document.getElementById('link').click()

    await fetchMock.flush(true)
    assertTruthy(document.getElementById('link'))
    assertNull(document.getElementById('res-target'))
    assertTruthy(document.getElementById('res'))
  })

  it('will not replace an item if an iFrame with the same name exists', async () => {
    fetchMock.get('/test', '<div id=response>success</div>')
    make(`
      <a id=link href="/test" target="#response-target">Plain Text</a>
      <iframe name="#response-target" id=iframe></iframe>
      <div id=response-target>Target</div>
    `)
    let link = byId('link')
    link.click()
    await fetchMock.flush(true)
    assertTruthy(byId('link'))
    assertTruthy(byId('iframe'))
    assertTruthy(byId('response-target'))
  })

  // Add this back when tests can live in their own browsing contexts

  // it('will not replace an item if the target is "_blank"', async () => {
  //   fetchMock.get('/test', '<div id=response>success</div>')
  //   make(`
  //     <a id=link href="/test" target="_blank">Plain Text</a>
  //     <iframe name="#response-target" id=iframe></iframe>
  //     <div id=response-target>Target</div>
  //   `)
  //   let link = byId('link')
  //   link.click()
  //   await fetchMock.flush(true)
  //   assertTruthy(byId('link'))
  //   assertTruthy(byId('iframe'))
  //   assertTruthy(byId('response-target'))
  // })

})

