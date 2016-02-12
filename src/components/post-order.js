/**
 * Post order confirmation screen.
 */
'use strict'

var React = require('react-native')
var {
  ActivityIndicatorIOS,
  Alert,
  Component,
  ListView,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} = React

var Icon = require('react-native-vector-icons/FontAwesome')
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

class PostOrder extends Component {
  render() {
    return (
        style={styles.container}
        onCategorySelect={this._onCategorySelect.bind(this)}
        reloadCategories={this._reloadCategories.bind(this)}>
      </CategoryList>
    )
  }

  _onCategorySelect(category) {
    this.props.navigator.push({
      title: category.title,
      component: Category,
      props: {
        category: category.slug
      },
    })
  }

  _reloadCategories() {
    return CategoryService.find({
      offset: 0,
      limit: 100
    })
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1
  }
})

module.exports = PostOrder
