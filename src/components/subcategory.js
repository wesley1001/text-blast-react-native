/**
 * Order form for customizing and purchasing a text blast of the given subcategory.
 */
'use strict'

var React = require('react-native')
var {
  Alert,
  Component,
  Image,
  Platform,
  StyleSheet,
  ScrollView,
  Text,
  View,
} = React

var ProgressImage = require('react-native-image-progress');
var Progress = require('react-native-progress/Pie')
var ContactPicker = require('./contact-picker')

var { GiftedForm, GiftedFormManager } = require('react-native-gifted-form')
var validator = require('validator')

const SEAPI = require('../services/api')
var StoreKit = require('../services/storekit')

var config = {
  sizes: [
    {
      title: 'Basic',
      value: 5,
      price: 0.99
    },
    {
      title: 'Normal',
      value: 12,
      price: 1.99
    },
    {
      title: 'Heavy',
      value: 30,
      price: 3.99
    },
    {
      title: 'Evil',
      value: 100,
      price: 9.99
    }
  ],

  intervals: [
    {
      title: '15 Minutes',
      value: 15 * 60
    },
    {
      title: 'Hourly',
      value: 60 * 60
    },
    {
      title: 'Daily',
      value: 15 * 60 * 60 * 24
    },
    {
      title: 'Blitz',
      value: 5
    }
  ],

  intervalMap: { },
  sizeMap: { }
}

config.sizes.forEach((size) => {
  config.sizeMap[size.value] = size
})

config.intervals.forEach((interval) => {
  config.intervalMap[interval.value] = interval
})

class SubCategory extends Component {
  constructor(props) {
    super(props)

    this.formName = 'subcategory-form'
    this.state = {
      toNumber: "",
      fromName: "",
      hasCustomMessage: false,
      customMessage: "",
      size: 12,
      interval: 15 * 60
    }
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <GiftedForm
          formName={this.formName}

          openModal={(route) => {
            this.props.navigator.push(Object.assign(Object.assign({ }, route), {
              title: route.getTitle(),
              component: () => route.renderScene(this.props.navigator),
              renderLeftButton: () => route.renderLeftButton(this.props.navigator),
              renderRightButton: () => route.renderRightButton(this.props.navigator),
            }))
          }}

          clearOnClose={false}

          scrollEnabled={false}

          defaults={this.state}

          validators={{
            toNumber: {
              title: 'Recipient Number',
              validate: [{
                validator: 'isLength',
                arguments: [1, 20],
                message: '{TITLE} must be between {ARGS[0]} and {ARGS[1]} characters'
              }]
            },
            fromName: {
              title: 'Your Name',
              validate: [{
                validator: 'isLength',
                arguments: [1, 50],
                message: '{TITLE} is required to comply with spam regulations'
              }]
            },
            size: {
              title: 'Blast Intensity',
              validate: [{
                validator: (...args) => (args[0] !== undefined),
                message: '{TITLE} is required',
              }]
            },
            interval: {
              title: 'Blast Interval',
              validate: [{
                validator: (...args) => (args[0] !== undefined),
                message: '{TITLE} is required',
              }]
            },
            customMessage: {
              title: 'Custom Message',
              validate: [{
                validator: 'isLength',
                arguments: [0, 120],
                message: '{TITLE} must be less than {ARGS[1]} characters'
              }]
            },
          }}
        >
          <GiftedForm.GroupWidget title="Preview Messages">
            <ScrollView horizontal={true}>
              {this.props.category.messages.map((message, i) => (
                <View style={[ styles.messageContainer, {
                  marginLeft: (i === 0 ? 4 : 0)
                }]} key={i}>
                  <ProgressImage
                    style={styles.message}
                    resizeMode="cover"
                    source={{ uri: message.media.replace('giphy.gif', 'giphy_s.gif') }}
                    indicator={Progress}
                    indicatorProps={{
                      size: 32
                    }}
                  />
                  <Image
                    style={styles.message}
                    resizeMode="cover"
                    source={{ uri: message.media.replace('giphy_s.gif', 'giphy.gif') }}
                  />
                </View>
              ))}
            </ScrollView>
          </GiftedForm.GroupWidget>

          <GiftedForm.GroupWidget title="Customize Text Blast">
            <GiftedForm.RowWidget
              underlayColor='royalblue'
              title='Select Recipient'
              onPress={() => {
                this.props.navigator.push({
                  title: 'Select Contact',
                  component: ContactPicker,
                  props: {
                    onSelectContact: this._onSelectContact.bind(this),
                    contactsFilter: (contact) => {
                      return contact.phoneNumbers && contact.phoneNumbers.length > 0
                    }
                  }
                })
              }}
            />

            <GiftedForm.TextInputWidget
              ref='toNumber'
              name='toNumber'
              title='To Number'
              placeholder='262-271-5555'
              clearButtonMode='while-editing'
              value={this.state.toNumber}
              onChangeText={(value) => this.setState({ toNumber: value }) }
            />

            <GiftedForm.TextInputWidget
              ref='toName'
              name='toName'
              title='To Name'
              placeholder=''
              clearButtonMode='while-editing'
              value={this.state.toName}
              onChangeText={(value) => this.setState({ toName: value }) }
            />
          </GiftedForm.GroupWidget>

          <GiftedForm.SeparatorWidget />

          <GiftedForm.TextInputWidget
            name='fromName'
            title='Your Name'
            placeholder=''
            clearButtonMode='while-editing'
            onChangeText={(value) => this.setState({ fromName: value }) }
          />

          <GiftedForm.SeparatorWidget />

          <GiftedForm.ModalWidget
            title='Blast Intensity'
            displayValue='size'
            underlayColor='royalblue'
            transformValue={(value) => (config.sizeMap[value].title + ' (' + value + ')') }
          >
            <GiftedForm.GroupWidget title='Select Blast Intensity'>
              <GiftedForm.SelectWidget
                name='size'
                title='Blast Intensity'
                multiple={false}
                onSelect={(value) => {
                  this.setState({ size: value })
                }}
              >
                {config.sizes.map((size, i) => (
                  <GiftedForm.OptionWidget
                    key={i}
                    underlayColor='royalblue'
                    title={`${size.title} (${size.value} / \$${size.price})`}
                    value={size.value}
                  />
                ))}
              </GiftedForm.SelectWidget>
            </GiftedForm.GroupWidget>
          </GiftedForm.ModalWidget>

          <GiftedForm.SeparatorWidget />

          <GiftedForm.ModalWidget
            title='Message Interval'
            displayValue='interval'
            underlayColor='royalblue'
            transformValue={(value) => config.intervalMap[value].title }
          >
            <GiftedForm.GroupWidget title='Select Message Interval'>
            </GiftedForm.GroupWidget>

            <GiftedForm.SelectWidget
              name='interval'
              title='Message Interval'
              multiple={false}
              onSelect={(value) => {
                this.setState({ interval: value })
              }}
            >
              {config.intervals.map((interval, i) => (
                <GiftedForm.OptionWidget
                  key={i}
                  underlayColor='royalblue'
                  title={interval.title}
                  value={interval.value}
                />
              ))}
            </GiftedForm.SelectWidget>
          </GiftedForm.ModalWidget>

          <GiftedForm.SeparatorWidget />

          <GiftedForm.ModalWidget
            title='Custom Message'
            displayValue='hasCustomMessage'
            underlayColor='royalblue'
            transformValue={(value) => (value ? '\u2714' : '') }
          >
            <GiftedForm.SeparatorWidget />

            <GiftedForm.SwitchWidget
              name='hasCustomMessage'
              title='Custom Message? (+ $1.00)'
              value={this.state.hasCustomMessage}
              onValueChange={(value) => {
                this.setState({ hasCustomMessage: value })
              }}
            />

            <GiftedForm.TextAreaWidget
              name='customMessage'
              value={this.state.customMessage}
              placeholder='Custom Message'
              maxLength={120}
              multiline={true}
              style={styles.customMessage}
              onChangeText={(value) => {
                this.setState({ customMessage: value })
              }}
            />

            <GiftedForm.NoticeWidget title='Optionally add a custom welcome message that will be sent before any other messages. (Max 120 characters)' />
          </GiftedForm.ModalWidget>

          <GiftedForm.SeparatorWidget />

          <GiftedForm.SubmitWidget
            title={`Send Text Blast (\$${this._orderTotal()})`}
            onSubmit={this._onPurchase.bind(this)}
          />
        </GiftedForm>
      </ScrollView>
    )
  }

  _onSelectContact(contact) {
    if (contact.phoneNumbers && contact.phoneNumbers.length > 0) {
      var number = null

      // attempt to find best phone number
      for (var i = 0; i < contact.phoneNumbers.length; ++i) {
        var current = contact.phoneNumbers[i]

        if (current.label === 'mobile') {
          number = current.number
          break
        } else if (!number) {
          number = current.number
        }
      }

      if (number) {
        console.log('selected contact', number, contact.displayName, contact)

        this.setState({
          toNumber: number,
          toName: contact.displayName
        })

        // TODO / HACK: workaround this gifted-form value cruft
        GiftedFormManager.updateValue(this.formName, 'toNumber', number)
        GiftedFormManager.updateValue(this.formName, 'toName', contact.displayName)

        this.refs.toNumber.forceUpdateValue()
        this.refs.toName.forceUpdateValue()

        return this.props.navigator.pop()
      }
    }

    console.log('error invalid contact phone numbers', contact)
    Alert.alert('Error', `Error contact ${contact.displayName} has no valid phone number`)
  }

  _onPurchase(isValid, values, validationResults, cb) {
    let productId = 'text.blast.' + this.state.size + (this.state.hasCustomMessage ? '.custom' : '')

    if (!isValid) {
      return
    }

    console.log(values)
    return StoreKit.purchase(productId)
      .then((order) => this._onPurchaseSuccess(order, cb))
      .catch(function (err) {
        console.log('error initializing order', err)
        Alert.alert('Error', "Error placing order. Please contact support@seshapp.com if this continues to happen.")
        cb([])
      })
  }

  _onPurchaseSuccess(order, cb) {
    console.log('in-app purchase successful', JSON.stringify(order))
    var self = this
    var price = self._orderTotal()

    var params = Object.assign({
      category: self.props.category.slug,
      price: Math.floor(price * 100),
      desc: 'blast of ' + self.state.size + ' mms messages',
      platform: Platform.OS,
      transactionId: order.transactionId,
      receipt: order.receipt
    }, self.state)

    params.toNumber = self._sanitizeNumber(params.toNumber)

    if (!validator.isMobilePhone(params.toNumber, 'en-US') && params.toNumber.charAt(0) !== '+' && params.toNumber.length > 10) {
      params.toNumber = '+' + params.toNumber
    }

    if (order.toName) params.toName = order.toName

    return fetch(SEAPI + '/orders', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params)
    }).then(checkResponseStatus)
      .then(() => {
        Alert.alert('Success', 'Order placed successfully!')

        self.setState({
          toNumber: "",
          toName: ""
        })
        cb([])
      })
      .catch((err) => {
        console.log('error initializing order', err)
        Alert.alert('Error', `Error initializing order. Please double-check the recipient number ${params.toNumber} or contact support@seshapp.com with transaction ID ${order.transactionId}.`)
        cb([])
      })
  }

  _orderTotal() {
    return config.sizeMap[this.state.size].price + (this.state.hasCustomMessage ? 1.00 : 0)
  }

  _isPurchaseReady() {
    return this._isMobilePhoneValid(this.state.toNumber) &&
      this.state.fromName && this.state.fromName.length > 0 &&
      this.state.size &&
      this.state.interval
  }

  _isMobilePhoneValid(number) {
    number = this._sanitizeNumber(number)

    return number && (validator.isMobilePhone(number, 'en-US') || (number.length >= 10 && number.length <= 13))
  }

  _sanitizeNumber(number) {
    if (number) {
      return number.toString().replace(' ', '').replace('-', '').replace('(', '').replace(')', '')
    } else {
      return ''
    }
  }
}

function checkResponseStatus (response) {
  console.log('response', response)

  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    let error = new Error(response.statusText)
    error.response = response
    throw error
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  messageContainer: {
    position: 'relative',
    width: 96,
    height: 96,
    marginRight: 4,
  },
  message: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  customMessage: {
    width: 200,
    height: 100
  }
})

module.exports = SubCategory
