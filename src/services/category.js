const SEAPI = require('./api')
const SEAPIv2 = SEAPI.replace('v1', 'v2')

var queryString = require('query-string')

module.exports = {
  findOne: (slug) => {
    return fetch(SEAPI + '/category?' + queryString.stringify({ slug: slug }))
      .then((response) => response.json())
  },

  find: (params) => {
    return fetch(SEAPIv2 + '/categories?' + queryString.stringify(params))
      .then((response) => response.json())
  }
}
