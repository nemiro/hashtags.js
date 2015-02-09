(function(window){
  "use strict";

  function HtUtils() {
  }

  /**
   *
   * @param {HTMLElement} el
   * @param {string} clName
   * @param {number} [limit]
   * @returns {HTMLElement}
   */
  HtUtils.prototype.getClosestByClass = function htuGetClosest(el, clName, limit) {
    limit = limit || parseInt(limit) || -1;
    while (limit !== 0) {
      if (this.hasClass(el, clName)) return el;
      if (--limit === 0) return null;
      el = el.parentNode;
    }
    return null;
  };

  /**
   *
   * @param el
   * @param clName
   * @returns {boolean}
   */
  HtUtils.prototype.hasClass = function htuHasCls(el, clName) {
    if (!el || !el.className) return false;
    return (' ' + el.className + ' ').indexOf(' ' + clName + ' ') >= 0;
  };

  /**
   *
   * @param el
   * @param clName
   * @private
   */
  HtUtils.prototype.addClass = function htuAddCls(el, clName) {
    el.className += ' ' + clName;
  };

  /**
   *
   * @param el
   * @param clName
   * @private
   */
  HtUtils.prototype.removeClass = function htuRemCls(el, clName) {
    el.className = el.className.replace(new RegExp('[\\s]*' + clName + '[\\s]*', 'g'), '');
  };

  /**
   * @see http://stackoverflow.com/questions/10149963/adding-event-listener-cross-browser
   * add event cross browser
   *
   * @param elem
   * @param event
   * @param fn
   */
  HtUtils.prototype.addEvent = function htuAddEvent(elem, event, fn) {
    // avoid memory overhead of new anonymous functions for every event handler that's installed
    // by using local functions
    function listenHandler(e) {
      var ret = fn.apply(this, arguments);
      if (ret === false) {
        e.stopPropagation();
        e.preventDefault();
      }
      return (ret);
    }

    function attachHandler() {
      // set the this pointer same as addEventListener when fn is called
      // and make sure the event is passed to the fn also so that works the same too
      var ret = fn.call(elem, window.event);
      if (ret === false) {
        window.event.returnValue = false;
        window.event.cancelBubble = true;
      }
      return (ret);
    }

    if (elem.addEventListener) {
      elem.addEventListener(event, listenHandler, false);
    } else {
      elem.attachEvent("on" + event, attachHandler);
    }
  };

  /**
   * @see https://gist.github.com/dciccale/6226151
   *
   * @param target
   * @param type
   * @param event
   * @private
   */
  HtUtils.prototype.triggerEvent = function htuTriggerEvent(target, type, event) {

    var doc = document;
    if (doc.createEvent) {
      event = new Event(type);
      target.dispatchEvent(event);
    } else if (document.createEventObject) {
      event = doc.createEventObject();
      target.fireEvent('on' + type, event);
    }
    /* else if (typeof target['on' + type] == 'function' ) {
     target['on' + type]();
     } else if (typeof target[type] == 'function' ) {
     target[type]();
     }/**/
  };

  /**
   *
   * @param oElm
   * @param css3Prop
   * @returns {string}
   */
  HtUtils.prototype.getStyle = function htuGetElStyle(oElm, css3Prop){
    var strValue = "";

    if(window.getComputedStyle){
      strValue = getComputedStyle(oElm).getPropertyValue(css3Prop);
    }
    //IE
    else if (oElm.currentStyle){
      try {
        strValue = oElm.currentStyle[css3Prop];
      } catch (e) {}
    }

    return strValue;
  };

  window.htUtils = new HtUtils();

})(window);