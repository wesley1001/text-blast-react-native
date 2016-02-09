/**
 * List of FAQ questions and accompanying answer detail pages.
 */
'use strict'

var React = require('react-native')
var {
  Component,
  ListView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
} = React

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
const faqItems = require('../services/faq')

class FAQ extends Component {
  constructor(props) {
    super(props)

    this.state = {
      dataSource: ds.cloneWithRows(faqItems)
    }
  }

  render() {
    return (
      <ListView
        style={styles.container}
        dataSource={this.state.dataSource}
        renderRow={this._renderRow.bind(this)}>
      </ListView>
    )
  }

  _renderRow(qa) {
    return (
      <TouchableHighlight underlayColor='royalblue' style={styles.row} onPress={() => {
        this.props.navigator.push({
          title: 'FAQ',
          component: FAQAnswer,
          props: {
            qa: qa
          }
        })
      }}>
        <View>
          <Text style={styles.rowText}>{qa.q}</Text>
        </View>
      </TouchableHighlight>
    )
  }
}

class FAQAnswer extends Component {
  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderText}>{this.props.qa.q}</Text>
          </View>

          <View style={styles.cardBody}>
            <Text style={styles.cardBodyText}>{this.props.qa.a}</Text>
          </View>
        </View>
      </ScrollView>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  row: {
    backgroundColor: '#fff',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    borderColor: '#eee',
  },
  rowText: {
    fontSize: 14
  },
  card: {
    flex: 1,
    margin: 10,
    backgroundColor: "#fff",
    borderRadius: 3,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 1
    }
  },
  cardHeader: {
    backgroundColor: "#ffc900",
    borderColor: '#eee',
    borderBottomWidth: 1,
    padding: 10,
  },
  cardHeaderText: {
    fontSize: 14,
  },
  cardBody: {
    padding: 10,
  },
  cardBodyText: {
    fontSize: 16,
    lineHeight: 18,
  },
})

module.exports = FAQ
