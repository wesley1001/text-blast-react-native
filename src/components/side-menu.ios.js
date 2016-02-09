/**
 * Side navigation menu used within top-level drawer component.
 */
'use strict'

var React = require('react-native')
var {
  Alert,
  Component,
  View,
  Text,
  TouchableHighlight,
  ScrollView,
  StyleSheet,
} = React

var Mailer = require('NativeModules').RNMail

var Gallery = require('./gallery')
var FAQ = require('./faq')
var Legal = require('./legal')

class SideMenu extends Component {
  render() {
    return (
      <ScrollView style={styles.menu}>
        <TouchableHighlight underlayColor='royalblue' style={styles.row} onPress={() => {
          this._onMenuItemPressed({ title: 'TextBlast', component: Gallery })
        }}>
          <View>
            <Text style={styles.rowText}>Home</Text>
          </View>
        </TouchableHighlight>

        <TouchableHighlight underlayColor='royalblue' style={styles.row} onPress={() => {
          this._onMenuItemPressed({ title: 'FAQ', component: FAQ })
        }}>
          <View>
            <Text style={styles.rowText}>FAQ</Text>
          </View>
        </TouchableHighlight>

        <TouchableHighlight underlayColor='royalblue' style={styles.row} onPress={() => {
          this._onMenuItemPressed({ title: 'Legal', component: Legal })
        }}>
          <View>
            <Text style={styles.rowText}>Legal</Text>
          </View>
        </TouchableHighlight>

        <TouchableHighlight underlayColor='royalblue' style={styles.row} onPress={() => {
          Mailer.mail({
            subject: '[Text Blast iOS]',
            recipients: ['support@seshapp.com'],
            body: '',
          }, (err, event) => {
            if (err) {
              Alert.alert('Error', 'Failed to open mail. Please manually send an email to support@seshapp.com')
            }
          })

          this._onMenuItemPressed()
        }}>
          <View>
            <Text style={styles.rowText}>Contact</Text>
          </View>
        </TouchableHighlight>
      </ScrollView>
    )
  }

  _onMenuItemPressed(route) {
    this.props.onSelectMenuItem(route)
  }
}

var styles = StyleSheet.create({
  menu: {
    flex: 1,
    paddingTop: 20
  },
  row: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: '#eee',
    borderColor: '#eee',
    padding: 16,
  },
  rowText: {
    fontSize: 16
  }
})

module.exports = SideMenu
