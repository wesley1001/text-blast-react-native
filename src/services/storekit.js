var InAppUtils = require('NativeModules').InAppUtils

var products = [
  'text.blast.5',
  'text.blast.5.custom',
  'text.blast.12',
  'text.blast.12.custom',
  'text.blast.30',
  'text.blast.30.custom',
  'text.blast.100',
  'text.blast.100.custom'
]

var storekit = module.exports = {
  ready: new Promise((resolve, reject) => {
    InAppUtils.loadProducts(products, (err, products) => {
      if (err) {
        console.log('storekit error initializing products', err)
        return reject(err)
      } else {
        return resolve(products)
      }
    })
  }),

  purchase: (productId) => {
    return storekit.ready
      .then(() => {
        return new Promise((resolve, reject) => {
          InAppUtils.purchaseProduct(productId, (err, response) => {
            if (response && response.productIdentifier) {
              return resolve({
                transactionId: response.transactionIdentifier,
                productId: response.productIdentifier
              })
            } else {
              console.log('storekit error purchasing product', productId, err)
              return reject(err || 'unknown payment error')
            }
          })
        })
      })
  }
}
