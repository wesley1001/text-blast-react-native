/**
 * Reusable component for selecting a contact from the user's address book.
 *
 * Supports prop-based filtering as well as filtering via dynamic user query.
 */
'use strict'

var React = require('react-native')
var {
  ActivityIndicatorIOS,
  Alert,
  Component,
  ListView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} = React

var Contacts = require('react-native-contacts')
var cachedContacts = []

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

class ContactPicker extends Component {
  constructor(props) {
    super(props)

    this.state = {
      dataSource: ds.cloneWithRows([]),
      loaded: false,
      searchQuery: '',
    }
  }

  componentDidMount() {
    if (!cachedContacts.length) {
      Contacts.getAll((err, contacts) => {
        if (err && err.type === 'permissionDenied') {
          console.error('error initializing contacts', err)
          Alert.alert('Error', 'Permission denied. Please update the contacts preference in your settings.')
        } else {
          cachedContacts = contacts

          this._updateData()
        }
      })
    } else {
      this._updateData()
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

  _updateData() {
    let contacts = this._getFilteredContacts(this.state.searchQuery)

    this.setState({
      dataSource: ds.cloneWithRows(contacts),
      loaded: true
    })
  }

  _renderHeader() {
    let loader = <View />

    if (!this.state.loaded) {
      loader = (
        <ActivityIndicatorIOS
          animating={true}
          style={{ alignItems: 'center', justifyContent: 'center', margin: 10 }}
          size="small"
        />
      )
    }

    return (
      <View style={styles.container}>
        <View style={styles.searchInputContainer}>
          <TextInput
            style={styles.searchInput}
            value={this.state.searchQuery}
            placeholder='Filter'
            clearButtonMode='while-editing'
            autoCorrect={false}
            autoCapitalize='none'
            onChangeText={(searchQuery) => {
              let contacts = this._getFilteredContacts(searchQuery)

              this.setState({
                dataSource: ds.cloneWithRows(contacts),
                searchQuery: searchQuery
              })
            }}
          />
        </View>

        {loader}
      </View>
    )
  }

  _renderRow(contact) {
    return (
      <TouchableHighlight underlayColor='royalblue' style={styles.row} onPress={() => {
        this.props.onSelectContact(Object.assign({
          displayName: getContactName(contact)
        }, contact))
      }}>
        <View>
          <Text style={styles.contactName}>{getContactName(contact)}</Text>
        </View>
      </TouchableHighlight>
    )
  }

  _getFilteredContacts(searchQuery) {
    let contacts = cachedContacts

    if (this.props.contactsFilter) {
      contacts = contacts.filter(this.props.contactsFilter)
    }

    if (searchQuery && searchQuery.length) {
      searchQuery = searchQuery.toLowerCase()
      contacts = contacts.filter((contact) => contactMatchesQuery(contact, searchQuery))
    }

    return contacts
  }
}

function getContactName (contact) {
  return ((contact.givenName || '') + ' ' + (contact.familyName || '')).trim()
}

function contactMatchesQuery (contact, query) {
  if (contact.givenName && contact.givenName.toLowerCase().indexOf(query) >= 0) {
    return true
  }

  if (contact.familyName && contact.familyName.toLowerCase().indexOf(query) >= 0) {
    return true
  }

  if (getContactName(contact).toLowerCase().indexOf(query) >= 0) {
    return true
  }

  for (var i = 0; i < contact.phoneNumbers.length; ++i) {
    let phoneNumber = contact.phoneNumbers[i]
    let number = phoneNumber.number

    if (number.indexOf(query) >= 0) {
      return true
    }
  }

  return false
}

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  row: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: '#eee',
    borderColor: '#eee',
  },
  contactName: {
    fontSize: 14
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

module.exports = ContactPicker
