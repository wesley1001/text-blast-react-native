/**
 * Reusable component for displaying a list of categories that the user may select.
 *
 * Used in Gallery and Category.
 */
'use strict'

var React = require('react-native')
var {
  ActivityIndicatorIOS,
  Alert,
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

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

class CategoryList extends Component {
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
    this._reloadCategories()
  }

  render() {
    if (!this.state.error || this.state.dataSource.getRowCount() > 0) {
      return (
        <ListView
          style={styles.container}
          dataSource={this.state.dataSource}
          renderHeader={this._renderHeader.bind(this)}
          renderRow={this._renderCategory.bind(this)}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this._reloadCategories.bind(this)}
              title="Loading..."
              colors={['#000000']}
              progressBackgroundColor="transparent"
            />
          }>
        </ListView>
      )
    } else {
      return (
        <View style={[ styles.container, { justifyContent: 'center' } ]}>
          <View style={styles.centered}>
            <Text style={[ styles.centered, { fontSize: 24 } ]}><Emoji name="cry" /></Text>
            <Text style={[ styles.centered, { marginVertical: 6 } ]}>{'Error loading categories'}</Text>

            {!this.state.isRefreshing ? (
                <TouchableOpacity style={[ styles.centered, { padding: 8 } ]} onPress={this._reloadCategories.bind(this)}>
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

  _renderCategory(category) {
    var padding = { }

    if (category._id === this._categories[0]._id) {
      padding = { paddingTop: 16 }
    } else if (category._id === this._categories[this._categories.length - 1]._id) {
      padding = { paddingBottom: 16 }
    }

    return (
      <TouchableOpacity style={[ styles.category, padding ]} onPress={() => {
        this.props.onCategorySelect(category)
      }}>
        <View style={{ flexDirection: 'row', position: 'relative' }}>
          {
            category.image ?
              <Image style={styles.categoryImage} source={{ uri: category.image }} resizeMode="cover" /> :
              <Image style={styles.categoryImage} source={{ uri: category.messages[0].media.replace('giphy.gif', 'giphy_s.gif') }} resizeMode="cover" />
          }
          {
            category.image ?  null : <Image style={styles.categoryImage} source={{ uri: category.messages[0].media.replace('giphy_s.gif', 'giphy.gif') }} resizeMode="cover" />
          }
          <View style={[ styles.categoryImage, styles.categoryImageOverlay ]} />

          <View style={[ styles.centered, { flex: 1, flexDirection: 'column', backgroundColor: 'transparent' } ]}>
            <Text style={styles.categoryText}>{ category.title }</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  _reloadCategories() {
    var self = this

    self.setState({ isRefreshing: true })
    return self.props.reloadCategories()
      .then(function (categories) {
        self._categories = categories

        self.setState({
          dataSource: ds.cloneWithRows(categories),
          isRefreshing: false,
          loaded: true,
          error: false
        })
      }).catch(function (err) {
        console.log('error loading categories', err)

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
  categoryText: {
    alignSelf: 'center',
    fontSize: 16,
    marginTop: 20,
    marginBottom: 20,
    color: '#fff',
    textShadowRadius: 2,
    textShadowOffset: { width: 0, height: 2 },
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
  },
  centered: {
    alignSelf: 'center'
  },
  centeredText: {
    textAlign: 'center'
  },
})

module.exports = CategoryList
