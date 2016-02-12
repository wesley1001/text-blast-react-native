/**
 * List of current and past orders and their respective statuses.
 */
'use strict'

var React = require('react-native')
var {
  ActivityIndicatorIOS,
  Component,
  Image,
  ListView,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} = React

var Icon = require('react-native-vector-icons/FontAwesome')
var Emoji = require('react-native-emoji')
var dateFormat = require('dateformat')

var Order = require('./order')
var OrderService = require('../services/order')

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

class Orders extends Component {
  constructor(props) {
    super(props)

    this.state = {
      dataSource: ds.cloneWithRows([]),
      loaded: false,
      isRefreshing: false,
      error: false
    }
  }

  componentDidMount() {
    this._reloadData()
  }

  render() {
    if (!this.state.loaded || this.state.dataSource.getRowCount() > 0) {
      return (
        <ListView
          style={styles.container}
          dataSource={this.state.dataSource}
          renderHeader={this._renderHeader.bind(this)}
          renderRow={this._renderRow.bind(this)}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this._reloadData.bind(this)}
              title="Loading..."
              colors={['#000000']}
              progressBackgroundColor="transparent"
            />
          }>
        </ListView>
      )
    } else {
      var errorMessage = 'No orders found in your account.'

      if (this.state.error) {
        errorMessage = 'Error loading orders'
      }

      return (
        <View style={[ styles.container, { justifyContent: 'center' } ]}>
          <View style={styles.centered}>
            <Text style={[ styles.centered, { fontSize: 24 } ]}><Emoji name="cry" /></Text>
            <Text style={[ styles.centered, { marginVertical: 6 } ]}>{errorMessage}</Text>

            {!this.state.isRefreshing ? (
                <TouchableOpacity style={[ styles.centered, { padding: 8 } ]} onPress={this._reloadData.bind(this)}>
                  <Icon name="refresh" size={20} color="#000" />
                </TouchableOpacity>
              ) : (
                <ActivityIndicatorIOS
                  animating={true}
                  style={[ styles.centered, { padding: 8 } ]}
                  size="small"
                />
              )
            }
          </View>
        </View>
      )
    }
  }

  _renderHeader() {
    if (this.state.loaded) {
      return <View />
    } else {
      return (
        <ActivityIndicatorIOS
          animating={true}
          style={{ alignItems: 'center', justifyContent: 'center', margin: 10 }}
          size="small"
        />
      )
    }
  }

  _renderRow(order) {
    var padding = { }

    if (order._id === this._orders[0]._id) {
      padding = { paddingTop: 16 }
    } else if (order._id === this._orders[this._orders.length - 1]._id) {
      padding = { paddingBottom: 16 }
    }

    var status = OrderService.getStatusIcon(order, { style: styles.statusIcon })

    return (
      <TouchableOpacity style={[ styles.category, padding ]} onPress={() => {
        this.props.navigator.push({
          title: `Order "${order.category.title}"`,
          component: Order,
          props: {
            order: order
          }
        })
      }}>
        <View style={{ position: 'relative', justifyContent: 'center', flex: 1 }}>
          {
            order.messages.length > 0 ?
              <Image style={styles.categoryImage} source={{ uri: order.messages[0].media.replace('giphy.gif', 'giphy_s.gif') }} resizeMode="cover" />
              : <View />
          }
          {
            order.messages.length > 0 ?
              <Image style={styles.categoryImage} source={{ uri: order.messages[0].media.replace('giphy_s.gif', 'giphy.gif') }} resizeMode="cover" />
              : <View />
          }
          <View style={[ styles.categoryImage, styles.categoryImageOverlay ]} />

          {status}
          <Text style={[ styles.orderText, { alignSelf: 'center', fontSize: 16 } ]}>{ order.category.title }</Text>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1, backgroundColor: 'transparent' }}>
            <Text style={styles.orderText}>{ dateFormat(order.created, "mmm dS yyyy") }</Text>

            <Text style={styles.orderText}>{ order.toNumber }</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  _reloadData() {
    var self = this

    self.setState({ isRefreshing: true })

    return OrderService.find({ offset: 0, limit: 100, user: "test" })
      .then(function (orders) {
        console.log('orders', orders)
        self._orders = orders

        self.setState({
          dataSource: ds.cloneWithRows(orders),
          isRefreshing: false,
          loaded: true,
          error: false
        })
      }).catch(function (err) {
        console.log('error loading orders', err)

        self.setState({
          isRefreshing: false,
          loaded: true,
          error: true
        })
      })
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
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  categoryImageOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  categoryContainer: {
    flex: 1,
    marginTop: 20,
    marginBottom: 20,
    alignSelf: 'center',
    position: 'relative'
  },
  orderText: {
    backgroundColor: 'transparent',
    fontSize: 14,
    color: '#fff',
    textShadowRadius: 2,
    textShadowOffset: { width: 0, height: 2 },
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    margin: 6,
  },
  statusIcon: {
    backgroundColor: 'transparent',
    alignSelf: 'flex-end',
    margin: 6,
  },
  centered: {
    alignSelf: 'center'
  },
  centeredText: {
    textAlign: 'center'
  },
})

module.exports = Orders
