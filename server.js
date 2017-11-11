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
var fs = require('fs');
var cmd = require('node-cmd');

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
                                'print_string'
                            ]
                        }
                    }
                }
            });
        });

        this._server.post('/print', function(req, res) {
            var path = '/queue/' + new Date.now() + '.txt',
            buffer = new Buffer(req.body.print_string);

            fs.open(path, 'w', function(err, fd) {
                if (err) {
                    throw 'Failed to open file: ' + err;
                }

                fs.write(fd, buffer, 0, buffer.length, null, function(err) {
                    if (err) throw 'Failed to write file: ' + err;
                    fs.close(fd, function() {
                        this.rawPrint(
                            req.body.device_name,
                            path
                        );
                    });
                });
            });
        });
    },

    rawPrint: function(device, file) {
        cmd.run('lpr -o raw -H localhost -P ' + device + ' ' + file);
    }
};

exports.server = Server;
