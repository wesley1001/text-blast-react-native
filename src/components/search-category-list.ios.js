/**
 * List of top-level category hierarchies.
 */
'use strict'

var React = require('react-native')
var {
  Component,
  StyleSheet,
  TextInput,
  View,
} = React

var CategoryService = require('../services/category')
var CategoryList = require('./category-list')
var SubCategory = require('./subcategory')

class SearchCategoryList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      searchQuery: '',
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.searchInputContainer}>
          <TextInput
            style={styles.searchInput}
            value={this.state.searchQuery}
            placeholder='Search'
            clearButtonMode='while-editing'
            autoCorrect={false}
            autoCapitalize='none'
            onChangeText={(searchQuery) => {
              this.setState({
                searchQuery: searchQuery
              })

              if (this.timeout) {
                clearTimeout(this.timeout)
                this.timeout = null
              }

              if (!searchQuery.length) {
                this.refs.categoryList.reload()
              } else {
                this.timeout = setTimeout(() => {
                  this.timeout = null
                  this.refs.categoryList.reload()
                }, 400)
              }
            }}
          />
        </View>

        <CategoryList
          ref='categoryList'
          style={styles.container}
          onCategorySelect={this._onCategorySelect.bind(this)}
          reloadCategories={this._reloadCategories.bind(this)}>
        </CategoryList>
      </View>
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
    var query = this.state.searchQuery.trim()

    if (query.length > 2) {
      return CategoryService.search({
        query: query,
        limit: 5
      })
    } else {
      return new Promise((resolve) => {
        resolve([ ])
      })
    }
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  searchInputContainer: {
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderBottomColor: '#eee',
    borderTopColor: '#eee',
    borderTopWidth: 2,
    borderBottomWidth: 1,
  },
  searchInput: {
    borderRadius: 4,
    backgroundColor: '#EAEAEA',
    height: 40,
    paddingHorizontal: 12,
  },
})

module.exports = SearchCategoryList
