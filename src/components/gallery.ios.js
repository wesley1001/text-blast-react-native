/**
 * List of top-level category hierarchies.
 */
'use strict'

var React = require('react-native')
var {
  Component,
  SegmentedControlIOS,
  StyleSheet,
  View,
} = React

var SearchCategoryList = require('./search-category-list')
var CategoryService = require('../services/category')
var CategoryList = require('./category-list')
var Category = require('./category')

class Gallery extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedIndex: 0
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <SegmentedControlIOS
          style={{ height: 30 }}
          values={[ 'Categories', 'Search' ]}
          selectedIndex={this.state.selectedIndex}
          onChange={(event) => {
            this.setState({ selectedIndex: event.nativeEvent.selectedSegmentIndex })
          }} />

        {this.state.selectedIndex === 0 ?
          <CategoryList
            style={styles.container}
            onCategorySelect={this._onCategorySelect.bind(this)}
            reloadCategories={this._reloadCategories.bind(this)}>
          </CategoryList>
          :
          <SearchCategoryList navigator={this.props.navigator} route={this.props.route} />
        }
      </View>
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

module.exports = Gallery
