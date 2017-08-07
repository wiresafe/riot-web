/*
Copyright 2016 OpenMarket Ltd
Copyright 2017 Vector Creations Ltd

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

'use strict';

import React from 'react';
import GeminiScrollbar from 'react-gemini-scrollbar';
import request from 'browser-request';
import { _t } from 'matrix-react-sdk/lib/languageHandler';
import sanitizeHtml from 'sanitize-html';

var MatrixClientPeg = require("../../../node_modules/matrix-react-sdk/lib/MatrixClientPeg");
var _languageHandler = require('../../../node_modules/matrix-react-sdk/lib/languageHandler');
var dis = require('matrix-react-sdk/lib/dispatcher');
var _react = require('react');
var _react2 = _interopRequireDefault(_react);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = React.createClass({
    displayName: 'HomePage',

    propTypes: {
        // URL base of the team server. Optional.
        teamServerUrl: React.PropTypes.string,
        // Team token. Optional. If set, used to get the static homepage of the team
        //      associated. If unset, homePageUrl will be used.
        teamToken: React.PropTypes.string,
        // URL to use as the iFrame src. Defaults to /home.html.
        homePageUrl: React.PropTypes.string,
    },

    getInitialState: function() {
        return {
            iframeSrc: '',
            page: '',
        };
    },

    showForm: function(){
      var wireForm = document.getElementById('formDiv');
      var wButton = document.getElementById('WireButton');
      wireForm.style.display = 'block';
      wButton.style.display = 'none';
    },

    saveFormData: function(){
      var bankName = document.getElementById('bName');
      var bankAddress = document.getElementById('bAddress');
      var accountOwnerName = document.getElementById('accOwnerName');
      var bankRoutingNumber = document.getElementById('bRoutingNumber');
      var bankAccNumber = document.getElementById('bAccountNumber');
      if(localStorage.getItem("mx_last_room_id")){
        if (bankName.value == '' || bankAddress.value == '' || accountOwnerName.value == '' || bankRoutingNumber.value == '' || bankAccNumber.value == ''){
          //   _react2.default.createElement(
          //     'div',
          //     { className: 'mx_Login_error' },
          //     (0, _languageHandler._t)('Please enter all the details.')
          // )
            alert('Please enter all the details');
          }
          else{
          var details = `Wire Transfer Details:
          Bank Name: ${bankName.value}
          Bank Address: ${bankAddress.value}
          Account Owner Name: ${accountOwnerName.value}
          Bank Routing Number: ${bankRoutingNumber.value}
          Bank Account Number: ${bankAccNumber.value}
          `;
          var sendMessagePromise = MatrixClientPeg.get().sendTextMessage(localStorage.getItem("mx_last_room_id"), details);
          dis.dispatch({
            action: 'view_room',
            room_id: localStorage.getItem("mx_last_room_id")
          });
          sendMessagePromise.done(function(res) {
              dis.dispatch({
                  action: 'message_sent'
              });
          });
        }
      }
      else{
        alert("Please join a room before sending Wire Transfer Details!");
      }
    },

    translate: function(s) {
        s = sanitizeHtml(_t(s));
        // ugly fix for https://github.com/vector-im/riot-web/issues/4243
        s = s.replace(/Riot\.im/, '<a href="https://riot.im" target="_blank" rel="noopener">Riot.im</a>');
        s = s.replace(/\[matrix\]/, '<a href="https://matrix.org" target="_blank" rel="noopener"><img width="79" height="34" alt="[matrix]" style="padding-left: 1px;vertical-align: middle" src="home/images/matrix.svg"/></a>');
        return s;
    },

    componentWillMount: function() {
        this._unmounted = false;

        if (this.props.teamToken && this.props.teamServerUrl) {
            this.setState({
                iframeSrc: `${this.props.teamServerUrl}/static/${this.props.teamToken}/home.html`
            });
        }
        else {
            // we use request() to inline the homepage into the react component
            // so that it can inherit CSS and theming easily rather than mess around
            // with iframes and trying to synchronise document.stylesheets.

            let src = this.props.homePageUrl || 'home.html';

            request(
                { method: "GET", url: src },
                (err, response, body) => {
                    if (this._unmounted) {
                        return;
                    }

                    if (err || response.status < 200 || response.status >= 300) {
                        console.warn(`Error loading home page: ${err}`);
                        this.setState({ page: _t("Couldn't load home page") });
                        return;
                    }

                    body = body.replace(/_t\(['"]([\s\S]*?)['"]\)/mg, (match, g1)=>this.translate(g1));
                    this.setState({ page: body });
                }
            );
        }
    },

    componentWillUnmount: function() {
        this._unmounted = true;
    },

    render: function() {
        if (this.state.iframeSrc) {
            return (
                <div className="mx_HomePage">
                    <iframe src={ this.state.iframeSrc } />
                </div>
            );
        }
        else {
            return (
                <GeminiScrollbar autoshow={true} className="mx_HomePage">
                    <div className="mx_HomePage_body">
                      <div className = "mx_Login_box">
                          <div className="mx_Login_logo">
                            <img src="home/images/logo.png"/>
                          </div>
                          <button id="WireButton" className = "mx_Login_submit" onClick={this.showForm}>Send Wiring Information</button>
                          <div id ='formDiv' className = "mx_Login_type_container_home">
                            <form id = "detailsForm">
                              <input type="text" id = 'bName' className = "mx_Login_field" name = "bankName" placeholder="Bank Name"/>
                              <input type="text" id = 'bAddress' className = "mx_Login_field" name = "bankAddress" placeholder="Bank Address"/>
                              <input type="text" id = 'accOwnerName' className = "mx_Login_field" name = "accountOwnerName" placeholder="Account Owner Name"/>
                              <input type="text" id = 'bRoutingNumber' className = "mx_Login_field" name = "bankRoutingNumber" placeholder="Bank Routing Number"/>
                              <input type="text" id = 'bAccountNumber' className = "mx_Login_field" name = "bankAccountNumber" placeholder="Bank Account Number"/>
                              <a href="javascript:document.getElementById('detailsForm').reset();" className = "mx_Login_label_Home">Reset</a>
                              <input type="button" onClick={this.saveFormData} className = "mx_Home_submit" value = "Submit"/>
                            </form>
                          </div>
                        </div>
                    </div>
                </GeminiScrollbar>
            );
        }
    }
});
