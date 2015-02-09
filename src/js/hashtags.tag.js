"use strict";

/**
*
* @param {string} value
* @param {Object} [params]
* @constructor
*/
function HtTag(value, params){
  this.value = value;

  // extend params if specified
  if( typeof(params) === 'object' ) {
    for(var k in params) {
      if(!params.hasOwnProperty(k)) continue;
      this.params[k] = params[k];
    }
  }
}

/**
*
* @type {Object}
*/
HtTag.prototype.params = {
  cssTag     : 'ht-hashtag',
  cssLabel   : 'ht-hashtag-label',
  cssValue   : 'ht-hashtag-value',
  cssActions : 'ht-hashtag-actions',
  cssActRemove  : 'ht-hashtag-remove'
};

/**
*
* @type {string}
*/
HtTag.prototype.value = null;

/**
 *
 * @type {HTMLElement}
 * @private
 */
HtTag.prototype._node = null;

/**
*
* @param {string} tagName
* @returns {HTMLElement}
* @private
*/
HtTag.prototype._ces = function(tagName){
  return document.createElement( tagName || 'span');
};

/**
*
* @returns {string}
*/
HtTag.prototype.toString = function tagToString(){
  return this.value;
};

/**
*
* @returns {HTMLElement}
*/
HtTag.prototype.getNode = function tagToString( nodeClass ){
  if(!this._node) this._node = this.generateNode();
  if( nodeClass === void 0 ) return this._node;
  var k, node, cn = this._node.childNodes;
  for(k in cn) {
    if(!cn.hasOwnProperty(k)) continue;
    node = cn[k];
    if( node.className.indexOf(nodeClass) === 0 ) {
      return node;
    }
  }
  return null;
};

/**
 *
 * @param {string} value
 */
HtTag.prototype.setValue = function tagSetValue(value){
  var node = this.getNode(this.params.cssValue);
  node.textContent = node.innerText = this.value = value;
};

/**
*
* @returns {HTMLElement}
*/
HtTag.prototype.generateNode = function tagGenNode(){
  var
    _ces = this._ces,
    params = this.params,
    node = _ces(),
    label = _ces(),
    value = _ces(),
    actions = this._generateActionsNode()
  ;

  // set classes
  node.className  = params.cssTag;
  label.className = params.cssLabel;
  value.className = params.cssValue;

  // set value
  value.textContent = value.innerText = this.value;

  // append sub-nodes to main node
  node.appendChild(label);
  node.appendChild(value);
  node.appendChild(actions);

  node.tag = this;

  return node;
};

/**
 *
 */
HtTag.prototype.focus = function() {
  htUtils.addClass(this.getNode(), 'ht-hashtag--focused');
};

/**
 *
 */
HtTag.prototype.blur = function() {
  htUtils.removeClass(this.getNode(), 'ht-hashtag--focused');
};

/**
 *
 * @private
 * @returns {HTMLElement}
 */
HtTag.prototype._generateActionsNode = function tagActionNode() {
  var
    _ces = this._ces,
    params = this.params,
    node = _ces(),
    remove = _ces()
  ;

  node.className   = params.cssActions;
  remove.className = params.cssActRemove;

  node.appendChild(remove);

  return node;
};