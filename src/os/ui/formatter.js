goog.provide('os.ui.formatter');
goog.require('os.array');


goog.require('os.time.TimeInstant');


/**
 * Formats the data to be a link if it passes the regex
 *
 * @param {string} value The value
 * @return {string} The HTML for the cell
 */
os.ui.formatter.urlNewTabFormatter = function(value) {
  if (typeof value !== 'object') {
    if (value != null) {
      // does this even have a URL?
      if (os.url.URL_REGEXP_LINKY.test(value) && !os.ui.slick.formatter.ANCHOR.test(value)) {
        var newValue = '';
        var splitVal = value.split(' ');
        var cite = 1;

        // If theres only 1 value, make it 'Link'
        if (splitVal.length === 1) {
          if (os.url.URL_REGEXP_LINKY.test(value)) {
            var cleanValue = os.ui.sanitize(value);
            newValue = os.string.linkify(cleanValue, '_blank', 'slick-cell-link', cleanValue);
          }
        } else if (splitVal.length < 500) { // performance suffers horribly here for long text (browser-crashingly bad)
          // If theres more than 1 value, put a number on it
          os.array.forEach(splitVal, function(elem, index, arr) {
            if (os.url.URL_REGEXP_LINKY.test(elem)) {
              var url = os.ui.sanitize(String(elem));
              elem = os.string.linkify(url, '_blank', 'slick-cell-link', url, '[' + cite + ']');
              cite++;
            }

            newValue = newValue.concat(elem) + ' ';
          });
        }
        // If this cell is a URL format, use it
        if (newValue !== '') {
          value = newValue.trim();
        }
      }
    }
  } else if (os.instanceOf(value, os.time.TimeInstant.NAME)) {
    value = value.toString();
  } else {
    value = '';
  }

  return value;
};
