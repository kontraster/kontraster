/* global phantom */
/* eslint-disable */

var page = require('webpage').create();
var args = require('system').args;

var address = args[1] || '';
var output = args[2];
var withoutTextOutput = args[3];
var outputSettings = { format: 'png' };

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

  page.evaluate(function () {
    if (!document.body.style.backgroundColor) {
      document.body.style.backgroundColor = 'white';
    }
  });

  window.setTimeout(function () {
    page.render(output, outputSettings);

    page.evaluate(function () {
      Array.prototype.forEach.call(document.querySelectorAll('*'), function (element) {
        element.style.color = 'transparent';
      });
    });

    window.setTimeout(function () {
      page.render(withoutTextOutput, outputSettings);
      phantom.exit();
    }, 1000);
  }, 1000);
});
