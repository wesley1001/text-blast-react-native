module.exports = {
  checkResponseStatus: (response) => {
    if (response && response.status >= 200 && response.status < 300) {
      return response
    } else {
      let error = new Error(response && response.statusText)
      error.response = response
      throw error
    }
  }
}
