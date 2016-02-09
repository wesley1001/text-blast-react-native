/**
 * Webview for displaying the privacy policy and terms of service.
 */
'use strict'

var React = require('react-native')
var {
  Component,
  WebView,
} = React

class Legal extends Component {
  render() {
    return (
      <WebView
        style={{ flex: 1 }}
        url={'https://textblast.io/legal'}
        startInLoadingState={true}
        javaScriptEnabled={true}
        onShouldStartLoadWithRequest={() => true }
        onNavigationStateChange={(navState) => console.log(navState)}
      />
    )
  }
}

module.exports = Legal
