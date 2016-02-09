/**
 * List of subcategories within a given category hierarchy.
 */
'use strict'

var React = require('react-native')
var {
  Component,
  StyleSheet,
} = React

var CategoryService = require('../services/category')
var CategoryList = require('./category-list')
var SubCategory = require('./subcategory')

class Category extends Component {
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
      component: SubCategory,
      props: {
        category: category
      },
    })
  }

  _reloadCategories() {
    return CategoryService.findOne(this.props.category)
      .then(function (category) {
        return category.subcategories
      })
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
})

module.exports = Category
