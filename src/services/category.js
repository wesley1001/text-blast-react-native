const SEAPI = require('./api')
const SEAPIv2 = SEAPI.replace('v1', 'v2')

var queryString = require('query-string')
var utils = require('./utils')

module.exports = {
  findOne: (slug) => {
    return fetch(SEAPI + '/category?' + queryString.stringify({ slug: slug }))
      .then(utils.checkResponseStatus)
      .then((response) => response.json())
  },

  find: (params) => {
    return fetch(SEAPIv2 + '/categories?' + queryString.stringify(params))
      .then(utils.checkResponseStatus)
      .then((response) => response.json())
  },

  search: (params) => {
    return fetch(SEAPI + '/categories/search?' + queryString.stringify(params))
      .then(utils.checkResponseStatus)
      .then((response) => response.json())
  }
}
