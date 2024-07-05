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
      assertEqual(url, '/test?i1=test')
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
