/* global phantom */
/* eslint-disable */

var page = require('webpage').create();
var args = require('system').args;

var address = args[1] || '';
var screenshotOutputBase = args[2];
var screenshotOutputHeadings = args[3];
var screenshotOutputText = args[4];
var outputSettings = { format: 'png' };

var preRenderDelay = 1000;

if (
  address.toString().length === 0 ||
  screenshotOutputBase.toString().length === 0 ||
  screenshotOutputHeadings.toString().length === 0 ||
  screenshotOutputText.toString().length === 0
) {
  console.error('Usage: screenshot.js ');
  phantom.exit(1);
}

// TODO: Render screenshots for multiple viewports
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
      window.screenshot = {
        /**
         * Hide an element’s text.
         */
        hideElementText: function (element) {
          element.style.cssText = element.style.cssTextOriginal + '; color: transparent !important';
        },
        /**
         * Reset text visibility for given element to initial CSS values.
         */
        resetElementTextVisibility: function (element) {
          element.style.cssText = element.style.cssTextOriginal;
        },
      };

      /**
       * Test whether an element’s font weight is bold-ish.
       * @see https://www.w3.org/wiki/CSS/Properties/font-weight#Values
       * @return {Boolean}
       */
      function isComputedFontWeightBold(computedStyle) {
        return (
          // Check if font weight is explicitly set to bold
          computedStyle.fontWeight === 'bold' ||
          // Check if font weight is equal or larger than 700, and therefore bold
          parseInt(computedStyle.fontWeight) >= 700
        );
      }

      /**
       * Test whether given element’s text is considered large scale.
       * @see https://www.w3.org/TR/WCAG20/#larger-scaledef
       * @return {Boolean}
       */
      function isElementTextLargeScale(element) {
        var computedStyle = window.getComputedStyle(element);
        var fontSize = parseInt(computedStyle.fontSize);

        // Pixel to point conversion based on:
        // http://reeddesign.co.uk/test/points-pixels.html
        return (
          fontSize >= 24 ||
          fontSize >= 19 && isComputedFontWeightBold(computedStyle)
        );
      }

      /**
       * Test whether given element is the inverse of isElementTextLargeScale().
       * @return {Boolean}
       */
      function isNotElementTextLargeScale(element) {
        return !isElementTextLargeScale(element);
      }

      var elements = Array.prototype.slice.call(document.querySelectorAll('body *'));
      window.screenshot.headingElements = elements.filter(isElementTextLargeScale);
      window.screenshot.textElements = elements.filter(isNotElementTextLargeScale);

      if (!document.body.style.backgroundColor) {
        document.body.style.backgroundColor = 'white';
      }

      elements.forEach(function (element) {
        element.style.cssTextOriginal = element.style.cssText;
      });
  });

  setTimeout(function () {
    // Render a base image
    page.render(screenshotOutputBase, outputSettings);

    // Hide plain text and render image
    page.evaluate(function prepareHeadingScreenshot() {
      window.screenshot.textElements.forEach(window.screenshot.hideElementText);
    });

    setTimeout(function () {
      page.render(screenshotOutputHeadings, outputSettings);

      // Hide headings, reset plain text visibility, and render an image
      page.evaluate(function prepareTextScreenshot() {
        window.screenshot.headingElements.forEach(window.screenshot.hideElementText);
        window.screenshot.textElements.forEach(window.screenshot.resetElementTextVisibility);
      });

      setTimeout(function () {
        page.render(screenshotOutputText, outputSettings);
        phantom.exit();
      }, preRenderDelay);
    }, preRenderDelay);
  }, preRenderDelay);
});
