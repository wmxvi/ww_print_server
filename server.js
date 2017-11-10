'use strict';

/**
 * @author Mario Husha <mario@wizardsworkshop.co.uk>
 * Print Server
*/

/**
 * Modules
 */

var _ = require('underscore');
var http = require('http');
var bodyParser = require('body-parser');

var Server = function() {
    this._server  = require('express')();
};

Server.prototype = {
    init: function(params) {
        this.params = params || {};
        this.setupServer();
        this.startServer();
        this.initRoutes();
    },

    setupServer: function() {
        var params = this.params;

        this._server.set('port', params.port);
        this._server.use(bodyParser.urlencoded({extended: true}));
        this._server.use(bodyParser.json());
    },

    startServer: function() {
        var _this = this;
        this.client = this._server.listen(this._server.get('port'));
        console.log('\nPrinter server instance started [' + _this._server.get('port') + ']');
    },

    initRoutes: function() {
        var _this = this;


        this._server.get('/', function(req, res) {
            res.json({
                'type': 'success',
                'message': {
                    'available_routes': {
                        '/print': {
                            'params': [
                                'device_name',
                                'printer_data'
                            ]
                        }
                    }
                }
            });
        });
    }
};

exports.server = Server;
