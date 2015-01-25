"use strict"

/**
 * Created by inemiro on 1/13/15.
 */
function HashTags(){this.init.apply(this, arguments)}

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
        styleAttrs : [
            'background',
            'color',
            'border',
            'padding',
            'margin'
        ]
    },

    /**
     * @type {String}
     */
    value : null,
    /**
     * @type {HTMLElement}
     */
    target : null,

    /**
     * @type {HTMLElement}
     */
    container : null,

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
            this.value = options.value + '';
        }

        // extend options
        var k, defOpts = this.defaultOptions;
        for(k in defOpts) {
            if(options[k] === void 0) {
                options[k] = defOpts[k];
            }
        }

        this.options = options;

        this.target = el;

        this.container = this.generateContainer(el);

        this.setUp();

    },

    setUp : function hashtagsSetup() {

        this.container.classList.add('ht-hashtags-container');

        var tags = this.value.split(this.options.separator);

        console.warn('tags', tags);

    },

    /**
     *
     * @param {HTMLElement} sourceEl
     * @returns {HTMLElement}
     */
    generateContainer : function(sourceEl) {

        if( sourceEl.nodeName.toLowerCase() != 'input' ) {

            if( this.value === null ) {
                this.value = sourceEl.textContent || sourceEl.innerText;
            }

            return sourceEl;
        }

        return this.cloneInput(sourceEl);
    },

    /**
     *
     * @param {HTMLElement} inputEl
     * @returns {HTMLElement}
     */
    cloneInput : function( inputEl ) {

        var container,
            opts = this.options;

        // generate container
        container = document.createElement('div');

        if( opts.copyStyle ) {
            // copy input style
            if( inputEl.getAttribute('type') == 'text') {
                // copy width
                container.style.width = inputEl.offsetWidth;
            }

            // copy style attrs
            var computedStyle = window.getComputedStyle(inputEl, null);
            var i = 0, k, s, attrs = opts.styleAttrs, ii = attrs.length;
            for(;i<ii;++i) {
                k=attrs[i];
                if(s=computedStyle[k]) {
                    container.style[k] = s;
                }
            }
        }

        if(this.value === null) {
            this.value = inputEl.value;
        }

        // append container to DOM
        inputEl.parentNode.insertBefore(container, inputEl);

        return container;
    },

    /**
     *
     * @param {string|object} item
     * @returns {boolean}
     */
    addItem : function( item ) {

        if( typeof(item) === 'string' ) {
            item = {value:item};
        }

        if( typeof(item) !== 'object' ) {
            return false;
        }

        // TODO

    },

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
    }
}

module.exports = HashTags;
