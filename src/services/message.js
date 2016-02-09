const SEAPI = require('./api')

var queryString = require('query-string')

module.exports = {
  find: (params) => {
    return fetch(SEAPI + '/messages?' + queryString.stringify(params))
      .then(function (response) {
        return response.json()
      })
  }
}
