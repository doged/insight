'use strict';

angular.module('insight.currency').controller('CurrencyController',
  function($scope, $rootScope, Currency) {

    var _roundFloat = function(x, n) {
      if(!parseInt(n, 10) || !parseFloat(x)) n = 0;

      return Math.round(x * Math.pow(10, n)) / Math.pow(10, n);
    };

    $rootScope.currency.getConvertion = function(value) {
      value = value * 1; // Convert to number

      if (!isNaN(value) && typeof value !== 'undefined' && value !== null) {
        if (value === 0.00000000) return '0 ' + this.symbol; // fix value to show

        var response;

        if (this.symbol === 'USD') {
          response = _roundFloat((value * this.factor), 2);
        } else if (this.symbol === 'mDOGED') {
          this.factor = 1000;
          response = _roundFloat((value * this.factor), 5);
        } else {
          this.factor = 1;
          response = value;
        }
        // prevent sci notation
        if (response < 1e-7) response=response.toFixed(8);

        return response + ' ' + this.symbol;
      }

      return 'value error';
    };

    $scope.setCurrency = function(currency) {
      $rootScope.currency.symbol = currency;

      if (currency === 'USD') {
        Currency.get({}, function(res) {
          $rootScope.currency.factor = $rootScope.currency.bitstamp = res.data.bitstamp;
        });
      } else if (currency === 'mDOGED') {
        $rootScope.currency.factor = 1000;
      } else {
        $rootScope.currency.factor = 1;
      }
    };

    // Get initial value
    Currency.get({}, function(res) {
      $rootScope.currency.bitstamp = res.data.bitstamp;
    });

  });
