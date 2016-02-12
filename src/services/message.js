const SEAPI = require('./api')

var queryString = require('query-string')
var utils = require('./utils')

module.exports = {
  find: (params) => {
    return fetch(SEAPI + '/messages?' + queryString.stringify(params))
      .then(utils.checkResponseStatus)
      .then((response) => response.json())
  }
}
