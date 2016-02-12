/**
 * Order detail view.
 */
'use strict'

var React = require('react-native')
var {
  Component,
  Image,
  ListView,
  StyleSheet,
  Text,
  View,
} = React

var OrderService = require('../services/order')
var dateFormat = require('dateformat')

var ProgressImage = require('react-native-image-progress');
var Progress = require('react-native-progress/Pie')

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

class Order extends Component {
  constructor(props) {
    super(props)

    this.state = {
      dataSource: ds.cloneWithRows(this.props.order.messages || [])
    }
  }

  render() {
    return (
      <ListView
        style={styles.container}
        dataSource={this.state.dataSource}
        renderHeader={this._renderHeader.bind(this)}
        renderRow={this._renderRow.bind(this)}>
      </ListView>
    )
  }

  _renderHeader() {
    var order = this.props.order

    var status = OrderService.getStatusIcon(order, { style: styles.statusIcon, size: 14 })

    return (
      <View style={[ styles.container, { justifyContent: 'center' } ]}>

        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', flex: 1, backgroundColor: 'transparent', margin: 10, }}>
          <Text style={styles.orderText}>Date: { dateFormat(order.created, "mmm dS yyyy") }</Text>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', flex: 1, backgroundColor: 'transparent', margin: 10, }}>
          <Text style={styles.orderText}>Recipient: { order.toNumber + (order.toName ? ' (' + order.toName + ')' : '') }</Text>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', flex: 1, backgroundColor: 'transparent', margin: 10, }}>
          <Text>Order Status: { order.status === 'complete' ? 'Complete' : (order.status === 'error' ? 'Error' : 'Active') }</Text>

          {status}
        </View>

        <Text style={{ margin: 10 }}>{`Sent ${order.sentSuccess} messages out of ${order.size}`}</Text>
        {(order.status === 'error' && order.errorMessage) ?
          <Text style={{ margin: 10 }}>{`Error: ${order.errorMessage}`}</Text>
          : <View />
        }
      </View>
    )
  }

  _renderRow(message) {
    var padding = { }

    if (message._id === this.props.order.messages[0]._id) {
      padding = { paddingTop: 16 }
    } else if (message._id === this.props.order.messages[this.props.order.messages.length - 1]._id) {
      padding = { paddingBottom: 16 }
    }

    return (
      <View style={[ styles.category, padding ]}>
        <View style={{ flexDirection: 'row', position: 'relative', flex: 1, height: 128 }}>
          <ProgressImage
            style={styles.categoryImage}
            source={{ uri: message.media.replace('giphy_s.gif', 'giphy.gif') }}
            resizeMode="contain"
            indicator={Progress}
            indicatorProps={{
              size: 32
            }}
          />
        </View>
      </View>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  category: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  categoryImage: {
    flex: 1
  },
  categoryImageOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  statusIcon: {
    marginHorizontal: 10
  },
})

module.exports = Order
