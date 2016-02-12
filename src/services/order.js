const SEAPI = require('./api')
var utils = require('./utils')

var React = require('react-native')
var { View } = React

var Icon = require('react-native-vector-icons/FontAwesome')
var queryString = require('query-string')

module.exports = {
  find: (params) => {
    return fetch(SEAPI + '/orders?' + queryString.stringify(params))
      .then(utils.checkResponseStatus)
      .then((response) => response.json())
  },

  create: (params) => {
    return fetch(SEAPI + '/orders', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params)
    }).then(utils.checkResponseStatus)
  },

  getStatusIcon: (order, props) => {
    var icon = <View {...props} />
    if (order.status === 'complete') {
      icon = <Icon name="check" size={20} color="green" {...props} />
    } else if (order.status === 'error') {
      icon = <Icon name="exclamation-triangle" size={20} color="red" {...props} />
    } else if (order.status === 'active') {
      icon = <Icon name="comment" size={20} color="white" {...props} />
    }

    return icon
  }
}
