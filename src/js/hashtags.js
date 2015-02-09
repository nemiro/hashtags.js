"use strict";

/**
 *
 * @constructor
 */
function HashTags(){this.init.apply(this, arguments);/**/}

/**
*
* @public
* @type {Object}
*/
HashTags.prototype = {
  /**
   *
   */
  constructor : HashTags,

  /**
   *
   */
  defaultOptions : {
      value : '',
      label : '#',
      separator : ' ',
      removeBtn : true,
      copyStyle : true,
      inputMinWidth : 50,
      inputMaxWidth : 0,
      inputMaxLength : 0,
      inputPlaceholder : '',
      invalidChars : new RegExp('[^\\s\\w-]+','gi'),
      styleAttrs : [
          'background',
          'color',
          'border',
          'padding',
          'margin'
      ]
  },

  /**
   * @type {HtTag}
   */
  tag : null,

  /**
   * @type {Array<HtTag>}
   */
  tags : [],

  /**
   * @type {HTMLElement}
   */
  target : null,

  /**
   * @type {HTMLElement}
   */
  container : null,

  /**
   * @type {HTMLElement}
   */
  input : null,

  /**
   * @type {Object}
   */
  options : {},

  /**
   *
   * @param {HTMLElement} el
   * @param {Object} [options]
   */
  init : function( el, options ) {

      if( !(el instanceof HTMLElement) ) {
          console.warn('wrong element', el);
          this.log('HashTags element not instance of the HTMLElement');
          return;
      }

      if( typeof(options) !== 'object' ) {
          options = {};
      }

      if( options.value !== void 0 ) {
          this.tags = this.extract(options.value);
      }

      // extend options
      var k, defOpts = this.defaultOptions;
      for(k in defOpts) {
        if(!defOpts.hasOwnProperty(k)) continue;
        if(options[k] === void 0) {
            options[k] = defOpts[k];
        }
      }

      this.options = options;

      this.target = el;

      this.container = this.generateContainer(el);
      this.input = this.generateInput();
      this.container.appendChild(this.input);

      this.bindEvents();
      this.resizeInput();
      //this.setUp();

  },

  bindEvents : function htBindEvents() {

    htUtils.addEvent(this.container, 'click', (ev) => {
      ev = ev || window.event;
      var targ = ev.target;
      if(!targ) return;
      if( targ == this.container ) {
        this.input.focus();
        //this._triggerEvent(this.input, 'focus');
        return;
      }
      var htClName = 'ht-hashtag';
      var htTag = htUtils.getClosestByClass(targ, htClName, 3);
      if( htTag ) {
        this.setTag(htTag.tag);
        return;
      }
    });

  },

  //setUp : function hashtagsSetup() {
  //
  //    this.container.classList.add('ht-hashtags-container');
  //
  //    var tags = this.value.split(this.options.separator);
  //
  //    console.warn('tags', tags);
  //
  //},

  /**
   *
   * @param {string} str
   */
  push : function htPushString(str){

    // replace not valid characters
    var invalidChars = this.options.invalidChars;
    if( invalidChars instanceof RegExp ) {
      str = (str+'').replace(invalidChars,'');
    }

    // trim spaces
    str = (str+'').trim();
    if(!str.length) return;

    var i = 0, tags = this.extract(str), ii = tags.length;
    var defaultTagParams = {}; // TODO
    for(;i<ii;++i) this.addTag(new HtTag(tags[i], defaultTagParams));
  },

  /**
   *
   * @param {string} str
   * @returns {Array}
   */
  extract : function htExtract(str) {
    return ((str||'')+'').split(this.getSeparator());
  },

  /**
   *
   * @param {HtTag} tag
   */
  addTag : function htAddTag(tag) {
    if( !(tag instanceof HtTag) ) return;
    this.container.appendChild(tag.getNode());
    this.container.appendChild(this.input); // append input to end
    this.tags.push(tag);
    this.resizeInput();
  },

  /**
   *
   * @returns {Array.<HtTag>}
   */
  getTags : function htGetTags() {
    return this.tags;
  },

  /**
   *
   * @returns {string}
   */
  getValue : function htGetValue() {
    return this.tags.join(this.getSeparator());
  },

  /**
   *
   * @returns {string}
   */
  getSeparator : function htGetSep(){
    return this.options.separator;
  },

  /**
   *
   * @param {string} sep
   */
  setSeparator : function htSetSep(sep) {
    this.options.separator = sep + '';
  },

  /**
   *
   * @param {HtTag} tag
   */
  setTag : function htSetTag(tag) {
    if(!(tag instanceof HtTag)) return;
    this.unsetTag();
    this.tag = tag;
    tag.focus();
  },

  /**
   *
   */
  unsetTag : function htUnsetTag() {
    if(this.tag) this.tag.blur();
  },

  /**
  *
  * @param {HTMLElement} sourceEl
  * @returns {HTMLElement}
  */
  generateContainer : function(sourceEl) {

      if( sourceEl.nodeName.toLowerCase() !== 'input' ) {

          if( this.value === null ) {
              this.value = sourceEl.textContent || sourceEl.innerText;
          }

          return sourceEl;
      }

    throw new Error('clone input not implemented yet');
      //return this.cloneInput(sourceEl);
  },

  /**
   *
   * @returns {HTMLElement}
   */
  generateInput : function htGenInput() {
    var opt = this.options;
    var input = document.createElement('input');
    input.className = 'ht-hashtag-input';

    var maxLength = opt.inputMaxLength;
    if( maxLength > 1 ) {
      input.maxLength = maxLength;
    }

    var placeholder = opt.inputPlaceholder;
    if( placeholder ) {
      input.placeholder = placeholder;
    }

    htUtils.addEvent(input, 'focus', () => {
      this.unsetTag();
      htUtils.addClass(this.container, 'ht-hashtag-container--focused');
    });
    htUtils.addEvent(input, 'blur', () => {
      htUtils.removeClass(this.container, 'ht-hashtag-container--focused');
    });
    htUtils.addEvent(input, 'keyup', () => {
      var val = input.value;
      if( val.indexOf(this.getSeparator()) !== -1 ) {
        var i = 0, values = this.extract(val), ii = values.length;
        for(;i<ii-1;++i) this.push(values[i]);
        input.value = values[ii]||'';
        input.focus();
      }
    });

    return input;
  },

  /**
   *
   */
  resizeInput : function htResizeInput() {

    var width, contPadding = 0, inp = this.input,
      cont = this.container, opt = this.options,
      contWidth;

    // container padding
    contPadding += +(htUtils.getStyle(cont, 'padding-left')||'').split('px').shift();
    contPadding += +(htUtils.getStyle(cont, 'padding-right')||'').split('px').shift();
    contWidth = cont.offsetWidth - contPadding;

    // reset width
    inp.style.width = 0;

    // calculate new width
    width = contWidth - inp.offsetLeft;

    // correct width
    if( opt.inputMinWidth > width ) {
      // if width is smaller, that min width,
      // than input will be on new row,
      // so set it the whole width of container
      width = contWidth;
    }
    if( opt.inputMaxWidth ) {
      // limit max width
      width = Math.min(width, opt.inputMaxWidth);
      // because cont can have smaller width,
      // than max width option
      width = Math.min(width, contWidth);
    }

    // set new width
    inp.style.width = width + 'px';
  },

  ///**
  // *
  // * @param {HTMLElement} inputEl
  // * @returns {HTMLElement}
  // */
  //cloneInput : function( inputEl ) {
  //
  //    var container,
  //        opts = this.options;
  //
  //    // generate container
  //    container = document.createElement('div');
  //
  //    if( opts.copyStyle ) {
  //        // copy input style
  //        if( inputEl.getAttribute('type') == 'text') {
  //            // copy width
  //            container.style.width = inputEl.offsetWidth;
  //        }
  //
  //        // copy style attrs
  //        var computedStyle = window.getComputedStyle(inputEl, null);
  //        var i = 0, k, s, attrs = opts.styleAttrs, ii = attrs.length;
  //        for(;i<ii;++i) {
  //            k=attrs[i];
  //            if(s=computedStyle[k]) {
  //                container.style[k] = s;
  //            }
  //        }
  //    }
  //
  //    if(this.value === null) {
  //        this.value = inputEl.value;
  //    }
  //
  //    // append container to DOM
  //    inputEl.parentNode.insertBefore(container, inputEl);
  //
  //    return container;
  //},

  /**
   *
   * @param {String} msg
   */
  log : function( msg ) {
      if(!window.console) alert(msg);
      else if(!console.error) console.log(msg);
      else console.error(msg);
  }
};

////////////////////
// export

if(window.jQuery) {
    /**
     *
     * @returns {jQuery}
     */
    window.jQuery.fn.hashtags = function() {
        var $el = $(this);
        if(!$el.data('hashtags') ) {
            $el.data('hashtags', new HashTags(this));
        }
        return $el;
    };
}

window.module = window.module || {};
module.exports = HashTags;