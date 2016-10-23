/* global phantom */
/* eslint-disable */

var page = require('webpage').create();
var args = require('system').args;

var address = args[1] || '';

if (address.toString().length === 0) {
  console.log('Usage: screenshot.js URL');
  phantom.exit(1);
}

page.viewportSize = {
	width: 1920,
	height: 1080,
};

page.open(address, function (status) {
  if (status !== 'success') {
    console.log('Unable to load the address!');
    phantom.exit(1);
  }

  window.setTimeout(function () {
    page.evaluate(function () {
      if (!document.body.style.background) {
        document.body.style.backgroundColor = 'white';
      }
    });

    console.log(page.renderBase64('png'));
    phantom.exit();
  }, 1000);
});