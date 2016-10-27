/* global phantom */
/* eslint-disable */

var page = require('webpage').create();
var args = require('system').args;

var address = args[1] || '';
var output = args[2];

if (address.toString().length === 0) {
  console.error('Usage: screenshot.js URL');
  phantom.exit(1);
}

page.viewportSize = {
	width: 1920,
	height: 1080,
};

page.open(address, function (status) {
  if (status !== 'success') {
    console.error('Unable to load the address.');
    phantom.exit(1);
  }

  window.setTimeout(function () {
    page.evaluate(function () {
      if (!document.body.style.backgroundColor) {
        document.body.style.backgroundColor = 'white';
      }
    });

    page.render(output, { format: 'png' });
    phantom.exit();
  }, 250);
});
