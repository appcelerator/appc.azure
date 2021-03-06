var _ = require('lodash')

/**
 * Wires up the built-in models and listens for any external models that
 * need to be wired up.
 */
exports.postCreate = function () {
  var self = this

  this.on('init-model', function (Model) {
    if (!Model.connector || (Model.connector.name || Model.connector) !== self.name) {
      return
    }

    var bindings = {
      /**
       * Creates a new table within a storage account.
       * @param [opts] The create options. { timeoutIntervalInMs: The optional timeout interval, in milliseconds, to use for the request }
       * @param callback(error, successful, response) 'error' will contain information if an error occurs; otherwise 'successful' will be true if the operation was successful. 'response' will contain information related to this operation.
      */
      createTable: curryTableServiceMethod('createTable'),
      /**
       * Creates a new table within a storage account if it doesn't exists.
       * @param [opts] The create options. { timeoutIntervalInMs: The optional timeout interval, in milliseconds, to use for the request }
       * @param callback(error, successful, response) 'error' will contain information if an error occurs; otherwise 'successful' will be true if the operation was successful. 'response' will contain information related to this operation.
       */
      createTableIfNotExists: curryTableServiceMethod('createTableIfNotExists'),
      /**
       * Gets a table properties.
       * @param [opts] The get options. { timeoutIntervalInMs: The optional timeout interval, in milliseconds, to use for the request }
       * @param callback(error, successful, response) 'error' will contain information if an error occurs; otherwise 'successful' will be true if the operation was successful. 'response' will contain information related to this operation.
       */
      getTable: curryTableServiceMethod('getTable'),
      /**
       * Deletes a table from a storage account.
       * @param [opts] The delete options. { timeoutIntervalInMs: The optional timeout interval, in milliseconds, to use for the request }
       * @param callback(error, successful, response) 'error' will contain information if an error occurs; otherwise 'successful' will be true if the operation was successful. 'response' will contain information related to this operation.
       */
      deleteTable: curryTableServiceMethod('deleteTable')
    }

    var bindingsKeys = Object.keys(bindings)
    for (var i = 0; i < bindingsKeys.length; i++) {
      var key = bindingsKeys[i]
      Model[key] = bindings[key]
    }
  })
}

/**
 * Creates a function that will call the specified table service method, handling the response properly.
 * @param method
 * @returns {Function}
 */
function curryTableServiceMethod (method) {
  return function tableServiceMethod (opts, callback) {
    if (_.isFunction(opts)) {
      callback = opts
      opts = {}
    }
    this.getConnector()._execute(this, method, opts, callback)
  }
}
