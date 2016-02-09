/**
 * List of top-level category hierarchies.
 */
'use strict'

var React = require('react-native')
var {
  Component,
  StyleSheet,
} = React

var CategoryService = require('../services/category')
var CategoryList = require('./category-list')
var Category = require('./category')

class Gallery extends Component {
  render() {
    return (
      <CategoryList
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

module.exports = Gallery
