(function($) {


    /**
     * Panel-ify an element.
     * @param {object} userConfig User config.
     * @return {jQuery} jQuery object. 
     */
    $.fn.panel = function(userConfig) {

        // No elements?
            if (this.length == 0)
                return $this;

        // Multiple elements?
            if (this.length > 1) {

                for (var i=0; i < this.length; i++)
                    $(this[i]).panel(userConfig);

                return $this;

            }

        // Vars.
            var $this = $(this),
                $body = $('body'),
                $window = $(window),
                id = $this.attr('id'),
                config;

        // Config.
            config = $.extend({

                // Delay.
                    delay: 0,

                // Hide panel on link click.
                    hideOnClick: false,

                // Hide panel on escape keypress.
                    hideOnEscape: false,

                // Hide panel on swipe.
                    hideOnSwipe: false,

                // Reset scroll position on hide.
                    resetScroll: false,

                // Reset forms on hide.
                    resetForms: false,

                // Side of viewport the panel will appear.
                    side: null,

                // Target element for "class".
                    target: $this,

                // Class to toggle.
                    visibleClass: 'visible'

            }, userConfig);

            // Expand "target" if it's not a jQuery object already.
                if (typeof config.target != 'jQuery')
                    config.target = $(config.target);

        // Panel.

            // Methods.
                $this._hide = function(event) {

                    // Already hidden? Bail.
                        if (!config.target.hasClass(config.visibleClass))
                            return;

                    // If an event was provided, cancel it.
                        if (event) {

                            event.preventDefault();
                            event.stopPropagation();

                        }

                    // Hide.
                        config.target.removeClass(config.visibleClass);

                    // Post-hide stuff.
                        window.setTimeout(function() {

                            // Reset scroll position.
                                if (config.resetScroll)
                                    $this.scrollTop(0);

                            // Reset forms.
                                if (config.resetForms)
                                    $this.find('form').each(function() {
                                        this.reset();
                                    });

                        }, config.delay);

                };

            // Vendor fixes.
                $this
                    .css('-ms-overflow-style', '-ms-autohiding-scrollbar')
                    .css('-webkit-overflow-scrolling', 'touch');

            // Hide on click.
                if (config.hideOnClick) {

                    $this.find('a')
                        .css('-webkit-tap-highlight-color', 'rgba(0,0,0,0)');

                    $this
                        .on('click', 'a', function(event) {

                            var $a = $(this),
                                href = $a.attr('href'),
                                target = $a.attr('target');

                            if (!href || href == '#' || href == '' || href == '#' + id)
                                return;

                            // Cancel original event.
                                event.preventDefault();
                                event.stopPropagation();

                            // Hide panel.
                                $this._hide();

                            // Redirect to href.
                                window.setTimeout(function() {

                                    if (target == '_blank')
                                        window.open(href);
                                    else
                                        window.location.href = href;

                                }, config.delay + 10);

                        });

                }

            // Event: Touch stuff.
                $this.on('touchstart', function(event) {

                    $this.touchPosX = event.originalEvent.touches[0].pageX;
                    $this.touchPosY = event.originalEvent.touches[0].pageY;

                })

                $this.on('touchmove', function(event) {

                    if ($this.touchPosX === null
                    ||  $this.touchPosY === null)
                        return;

                    var diffX = $this.touchPosX - event.originalEvent.touches[0].pageX,
                        diffY = $this.touchPosY - event.originalEvent.touches[0].pageY,
                        th = $this.outerHeight(),
                        ts = ($this.get(0).scrollHeight - $this.scrollTop());

                    // Hide on swipe?
                        if (config.hideOnSwipe) {

                            var result = false,
                                boundary = 20,
                                delta = 50;

                            switch (config.side) {

                                case 'left':
                                    result = (diffY < boundary && diffY > (-1 * boundary)) && (diffX > delta);
                                    break;

                                case 'right':
                                    result = (diffY < boundary && diffY > (-1 * boundary)) && (diffX < (-1 * delta));
                                    break;

                                case 'top':
                                    result = (diffX < boundary && diffX > (-1 * boundary)) && (diffY > delta);
                                    break;

                                case 'bottom':
                                    result = (diffX < boundary && diffX > (-1 * boundary)) && (diffY < (-1 * delta));
                                    break;

                                default:
                                    break;

                            }

                            if (result) {

                                $this.touchPosX = null;
                                $this.touchPosY = null;
                                $this._hide();

                                return false;

                            }

                        }

                    // Prevent vertical scrolling past the top or bottom.
                        if (($this.scrollTop() < 0 && diffY < 0)
                        || (ts > (th - 2) && ts < (th + 2) && diffY > 0)) {

                            event.preventDefault();
                            event.stopPropagation();

                        }

                });

            // Event: Prevent certain events inside the panel from bubbling.
                $this.on('click touchend touchstart touchmove', function(event) {
                    event.stopPropagation();
                });

            // Event: Hide panel if a child anchor tag pointing to its ID is clicked.
                $this.on('click', 'a[href="#' + id + '"]', function(event) {

                    event.preventDefault();
                    event.stopPropagation();

                    config.target.removeClass(config.visibleClass);

                });

        // Body.

            // Event: Hide panel on body click/tap.
                $body.on('click touchend', function(event) {
                    $this._hide(event);
                });

            // Event: Toggle.
                $body.on('click', 'a[href="#' + id + '"]', function(event) {

                    event.preventDefault();
                    event.stopPropagation();

                    config.target.toggleClass(config.visibleClass);

                });

        // Window.

            // Event: Hide on ESC.
                if (config.hideOnEscape)
                    $window.on('keydown', function(event) {

                        if (event.keyCode == 27)
                            $this._hide(event);

                    });

        return $this;

    };

})(jQuery);
/*******************************************************************************
 * Copyright 2017 Adobe Systems Incorporated
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/
if (window.Element && !Element.prototype.closest) {
    Element.prototype.closest =
        function (s) {
            'use strict';
            var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                el      = this,
                i;
            do {
                i = matches.length;
                while (--i >= 0 && matches.item(i) !== el) {
                }
            } while ((i < 0) && (el = el.parentElement));
            return el;
        };
}

if (window.Element && !Element.prototype.matches) {
    Element.prototype.matches =
        Element.prototype.matchesSelector ||
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector ||
        Element.prototype.oMatchesSelector ||
        Element.prototype.webkitMatchesSelector ||
        function (s) {
            'use strict';
            var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                i       = matches.length;
            while (--i >= 0 && matches.item(i) !== this) {
            }
            return i > -1;
        };
}

if (!Object.assign) {
    Object.assign = function (target, varArgs) { // .length of function is 2
        'use strict';
        if (target === null) {
            throw new TypeError('Cannot convert undefined or null to object');
        }

        var to = Object(target);

        for (var index = 1; index < arguments.length; index++) {
            var nextSource = arguments[index];

            if (nextSource !== null) {
                for (var nextKey in nextSource) {
                    if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                        to[nextKey] = nextSource[nextKey];
                    }
                }
            }
        }
        return to;
    };
}

(function (arr) {
    'use strict';
    arr.forEach(function (item) {
        if (item.hasOwnProperty('remove')) {
            return;
        }
        Object.defineProperty(item, 'remove', {
            configurable: true,
            enumerable: true,
            writable: true,
            value: function remove() {
                this.parentNode.removeChild(this);
            }
        });
    });
})([Element.prototype, CharacterData.prototype, DocumentType.prototype]);

/*******************************************************************************
 * Copyright 2016 Adobe Systems Incorporated
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/
(function () {
    'use strict';

    var NS = 'cmp';
    var IS = 'image';

    var EMPTY_PIXEL = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    var LAZY_THRESHOLD = 0;
    var SRC_URI_TEMPLATE_WIDTH_VAR = '{.width}';

    var selectors = {
        self : '[data-' + NS + '-is="' + IS +'"]',
        image : '[data-cmp-hook-image="image"]'
    };

    var lazyLoader = {
        'cssClass' : 'cmp-image__image--is-loading',
        'style' : {
            'height': 0,
            'padding-bottom': '' // will be replaced with % ratio
        }
    };

    var properties = {
        /**
         * An array of alternative image widths (in pixels).
         * Used to replace a {.width} variable in the src property with an optimal width if a URI template is provided.
         */
        'widths': {
            'default' : [],
            'transform' : function(value) {
                // number[]
                var widths = [];
                value.split(',').forEach(function(item) {
                    item = parseFloat(item);
                    if (!isNaN(item)) {
                        widths.push(item);
                    }
                });
                return widths;
            }
        },
        /**
         * Indicates whether the image should be rendered lazily.
         */
        'lazy': {
            'default': false,
            'transform': function(value) {
                // boolean
                return !(value === null || typeof value === 'undefined');
            }
        },
        /**
         * The image source.
         *
         * Can be a simple image source, or a URI template representation that
         * can be variable expanded - useful for building an image configuration with an alternative width.
         * e.g. '/path/image.img{.width}.jpeg/1506620954214.jpeg'
         */
        'src': {
        }
    };

    var devicePixelRatio = window.devicePixelRatio || 1;

    function readData(element) {
        var data = element.dataset;
        var options = [];
        var capitalized = IS;
        capitalized = capitalized.charAt(0).toUpperCase() + capitalized.slice(1);
        var reserved = ['is', 'hook' + capitalized];

        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                var value = data[key];

                if (key.indexOf(NS) === 0) {
                    key = key.slice(NS.length);
                    key = key.charAt(0).toLowerCase() + key.substring(1);

                    if (reserved.indexOf(key) === -1) {
                        options[key] = value;
                    }
                }
            }
        }

        return options;
    }

    function Image(config) {
        var that = this;

        function init(config) {
            // prevents multiple initialization
            config.element.removeAttribute('data-' + NS + '-is');

            setupProperties(config.options);
            cacheElements(config.element);

            if (!that._elements.noscript) {
                return;
            }

            that._elements.container = that._elements.link ? that._elements.link : that._elements.self;

            unwrapNoscript();

            if (that._properties.lazy) {
                addLazyLoader();
            }

            window.addEventListener('scroll', that.update);
            window.addEventListener('resize', that.update);
            window.addEventListener('update', that.update);
            that._elements.image.addEventListener('cmp-image-redraw', that.update);
            that.update();
        }

        function loadImage() {
            var hasWidths = that._properties.widths && that._properties.widths.length > 0;
            var replacement = hasWidths ? '.' + getOptimalWidth() : '';
            var url = that._properties.src.replace(SRC_URI_TEMPLATE_WIDTH_VAR, replacement);

            if (that._elements.image.getAttribute('src') !== url) {
                that._elements.image.setAttribute('src', url);
                window.removeEventListener('scroll', that.update);
            }

            if (that._lazyLoaderShowing) {
                that._elements.image.addEventListener('load', removeLazyLoader);
            }
        }

        function getOptimalWidth() {
            var containerWidth = that._elements.self.clientWidth;
            var optimalWidth = containerWidth * devicePixelRatio;
            var len = that._properties.widths.length;
            var key = 0;

            while ((key < len-1) && (that._properties.widths[key] < optimalWidth)) {
                key++;
            }

            return that._properties.widths[key].toString();
        }

        function addLazyLoader() {
            var width = that._elements.image.getAttribute('width'); 
            var height = that._elements.image.getAttribute('height');

            if (width && height) {
                var ratio = (height / width) * 100;
                var styles = lazyLoader.style;

                styles['padding-bottom'] = ratio + '%';

                for (var s in styles) {
                    if (styles.hasOwnProperty(s)) {
                        that._elements.image.style[s] = styles[s];
                    }
                }
            }
            that._elements.image.setAttribute('src', EMPTY_PIXEL);
            that._elements.image.classList.add(lazyLoader.cssClass);
            that._lazyLoaderShowing = true;
        }

        function unwrapNoscript() {
            var tmp = document.createElement('div');
            tmp.innerHTML = decodeNoscript(that._elements.noscript.textContent.trim());
            var imageElement = tmp.firstElementChild;
            imageElement.removeAttribute('src');
            that._elements.noscript.parentNode.removeChild(that._elements.noscript);
            that._elements.container.insertBefore(imageElement, that._elements.container.firstChild);

            if (that._elements.container.matches(selectors.image)) {
                that._elements.image = that._elements.container;
            } else {
                that._elements.image = that._elements.container.querySelector(selectors.image);
            }
        }

        function removeLazyLoader() {
            that._elements.image.classList.remove(lazyLoader.cssClass);
            for (var property in lazyLoader.style) {
                if (lazyLoader.style.hasOwnProperty(property)) {
                    that._elements.image.style[property] = '';
                }
            }
            that._elements.image.removeEventListener('load', removeLazyLoader);
            that._lazyLoaderShowing = false;
        }

        function isLazyVisible() {
            if (that._elements.container.offsetParent === null) {
                return false;
            }

            var wt = window.pageYOffset,
                wb = wt + document.documentElement.clientHeight,
                et = that._elements.container.getBoundingClientRect().top + wt,
                eb = et + that._elements.container.clientHeight;

            return eb >= wt - LAZY_THRESHOLD && et <= wb + LAZY_THRESHOLD;
        }

        function cacheElements(wrapper) {
            that._elements = {};
            that._elements.self = wrapper;
            var hooks = that._elements.self.querySelectorAll('[data-' + NS + '-hook-' + IS + ']');

            for (var i = 0; i < hooks.length; i++) {
                var hook = hooks[i];
                var capitalized = IS;
                capitalized = capitalized.charAt(0).toUpperCase() + capitalized.slice(1);
                var key = hook.dataset[NS + 'Hook' + capitalized];
                that._elements[key] = hook;
            }
        }

        function setupProperties(options) {
            that._properties = {};

            for (var key in properties) {
                if (properties.hasOwnProperty(key)) {
                    var property = properties[key];
                    if (options && options[key] != null) {
                        if (property && typeof property.transform === 'function') {
                            that._properties[key] = property.transform(options[key]);
                        } else {
                            that._properties[key] = options[key];
                        }
                    } else {
                        that._properties[key] = properties[key]['default'];
                    }
                }
            }
        }

        that.update = function () {
            if (that._properties.lazy) {
                if (isLazyVisible()) {
                    loadImage();
                }
            } else {
                loadImage();
            }
        };

        if (config.element) {
            init(config);
        }
    }

    function onDocumentReady() {
        var elements = document.querySelectorAll(selectors.self);
        for (var i = 0; i < elements.length; i++) {
            new Image({ element: elements[i], options: readData(elements[i]) });
        }

        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
        var body             = document.querySelector('body');
        var observer         = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                // needed for IE
                var nodesArray = [].slice.call(mutation.addedNodes);
                if (nodesArray.length > 0) {
                    nodesArray.forEach(function (addedNode) {
                        if (addedNode.querySelectorAll) {
                            var elementsArray = [].slice.call(addedNode.querySelectorAll(selectors.self));
                            elementsArray.forEach(function (element) {
                                new Image({ element: element, options: readData(element) });
                            });
                        }
                    });
                }
            });
        });

        observer.observe(body, {
            subtree      : true,
            childList    : true,
            characterData: true
        });
    }

    if (document.readyState != 'loading'){
        onDocumentReady();
    } else {
        document.addEventListener('DOMContentLoaded', onDocumentReady());
    }

    /*
        on drag & drop of the component into a parsys, noscript's content will be escaped multiple times by the editor which creates
        the DOM for editing; the HTML parser cannot be used here due to the multiple escaping
     */
    function decodeNoscript(text){
        text = text.replace(/&(amp;)*lt;/g, '<');
        text = text.replace(/&(amp;)*gt;/g, '>');
        return text;
    }

})();

/*
 *  Copyright 2016 Adobe Systems Incorporated
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.7";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
/*******************************************************************************
 * Copyright 2017 Adobe Systems Incorporated
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/
(function () {
    'use strict';

    var NS = 'cmp';
    var IS = 'search';

    var DELAY = 300; // time before fetching new results when the user is typing a search string
    var LOADING_DISPLAY_DELAY = 300; // minimum time during which the loading indicator is displayed
    var PARAM_RESULTS_OFFSET = 'resultsOffset';

    var keyCodes = {
        TAB: 9,
        ENTER: 13,
        ESCAPE: 27,
        ARROW_UP: 38,
        ARROW_DOWN: 40
    };

    var selectors = {
        self : '[data-' + NS + '-is="' + IS +'"]',
        item : {
            self : '[data-' + NS + '-hook-' + IS + '="item"]',
            title : '[data-' + NS + '-hook-' + IS + '="itemTitle"]',
            focused : '.' + NS + '-search__item--is-focused'
        }
    };

    var properties = {
        /**
         * The minimum required length of the search term before results are fetched.
         */
        minLength: {
            'default' : 3,
            transform : function(value) {
                // number
                value = parseFloat(value);
                return isNaN(value) ? null : value;
            }
        },
        /**
         * The maximal number of results fetched by a search request.
         */
        resultsSize: {
            'default' : 10,
            transform : function(value) {
                // number
                value = parseFloat(value);
                return isNaN(value) ? null : value;
            }
        }
    };

    var idCount = 0;

    function readData(element) {
        var data = element.dataset;
        var options = [];
        var capitalized = IS;
        capitalized = capitalized.charAt(0).toUpperCase() + capitalized.slice(1);
        var reserved = ['is', 'hook' + capitalized];

        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                var value = data[key];

                if (key.indexOf(NS) === 0) {
                    key = key.slice(NS.length);
                    key = key.charAt(0).toLowerCase() + key.substring(1);

                    if (reserved.indexOf(key) === -1) {
                        options[key] = value;
                    }
                }
            }
        }

        return options;
    }

    function toggleShow(element, show) {
        if (element) {
            if (show !== false) {
                element.style.display = 'block';
                element.setAttribute('aria-hidden', false);
            } else {
                element.style.display = 'none';
                element.setAttribute('aria-hidden', true);
            }
        }
    }

    function serialize(form) {
        var query = [];
        if (form && form.elements) {
            for (var i = 0; i < form.elements.length; i++) {
                var node = form.elements[i];
                if (!node.disabled && node.name) {
                    var param = [node.name, encodeURIComponent(node.value)];
                    query.push(param.join('='));
                }
            }
        }
        return query.join('&');
    }

    function mark(node, regex) {
        if (!node || !regex) {
            return;
        }

        // text nodes
        if (node.nodeType == 3) {
            var nodeValue = node.nodeValue;
            var match = regex.exec(nodeValue);

            if (nodeValue && match) {
                var element = document.createElement('mark');
                element.className = NS + '-search__item-mark';
                element.appendChild(document.createTextNode(match[0]));

                var after = node.splitText(match.index);
                after.nodeValue = after.nodeValue.substring(match[0].length);
                node.parentNode.insertBefore(element, after);
            }
        } else if (node.hasChildNodes()) {
            for (var i = 0; i < node.childNodes.length; i++) {
                // recurse
                mark(node.childNodes[i], regex);
            }
        }
    }

    function Search(config) {
        if (config.element) {
            // prevents multiple initialization
            config.element.removeAttribute('data-' + NS + '-is');
        }

        this._cacheElements(config.element);
        this._setupProperties(config.options);

        this._action = this._elements.form.getAttribute('action');
        this._resultsOffset = 0;
        this._hasMoreResults = true;

        this._elements.input.addEventListener('input', this._onInput.bind(this));
        this._elements.input.addEventListener('focus', this._onInput.bind(this));
        this._elements.input.addEventListener('keydown', this._onKeydown.bind(this));
        this._elements.clear.addEventListener('click', this._onClearClick.bind(this));
        document.addEventListener('click', this._onDocumentClick.bind(this));
        this._elements.results.addEventListener('scroll', this._onScroll.bind(this));

        this._makeAccessible();
    }

    Search.prototype._displayResults = function() {
        if (this._elements.input.value.length === 0) {
            toggleShow(this._elements.clear, false);
            this._cancelResults();
        } else if (this._elements.input.value.length < this._properties.minLength) {
            toggleShow(this._elements.clear, true);
        } else {
            this._updateResults();
            toggleShow(this._elements.clear, true);
        }
    };

    Search.prototype._onScroll = function(event) {
        // fetch new results when the results to be scrolled down are less than the visible results
        if (this._elements.results.scrollTop + 2 * this._elements.results.clientHeight >= this._elements.results.scrollHeight) {
            this._resultsOffset += this._properties.resultsSize;
            this._displayResults();
        }
    };

    Search.prototype._onInput = function(event) {
        var self = this;
        self._cancelResults();
        // start searching when the search term reaches the minimum length
        this._timeout = setTimeout(function() {
            self._displayResults();
        }, DELAY);
    };

    Search.prototype._onKeydown = function(event) {
        var self = this;

        switch (event.keyCode) {
            case keyCodes.TAB:
                if (self._resultsOpen()) {
                    event.preventDefault();
                }
                break;
            case keyCodes.ENTER:
                if (!self._resultsOpen()) {
                    self._elements.form.submit();
                } else {
                    var focused = self._elements.results.querySelector(selectors.item.focused);
                    if (focused) {
                        focused.click();
                    }
                }
                break;
            case keyCodes.ESCAPE:
                self._cancelResults();
                break;
            case keyCodes.ARROW_UP:
                if (self._resultsOpen()) {
                    event.preventDefault();
                    self._stepResultFocus(true);
                }
                break;
            case keyCodes.ARROW_DOWN:
                if (self._resultsOpen()) {
                    event.preventDefault();
                    self._stepResultFocus();
                } else {
                    // test the input and if necessary fetch and display the results
                    self._onInput();
                }
                break;
            default:
                return;
        }
    };

    Search.prototype._onClearClick = function(event) {
        event.preventDefault();
        this._elements.input.value = '';
        toggleShow(this._elements.clear, false);
        toggleShow(this._elements.results, false);
    };

    Search.prototype._onDocumentClick = function(event) {
        var inputContainsTarget =  this._elements.input.contains(event.target);
        var resultsContainTarget = this._elements.results.contains(event.target);

        if (!(inputContainsTarget || resultsContainTarget)) {
            toggleShow(this._elements.results, false);
        }
    };

    Search.prototype._resultsOpen = function() {
        return this._elements.results.style.display !== 'none';
    };

    Search.prototype._makeAccessible = function() {
        var id = NS + '-search-results-' + idCount;
        this._elements.input.setAttribute('aria-owns', id);
        this._elements.results.id = id;
        idCount++;
    };

    Search.prototype._generateItems = function (data, results) {
        var self = this;

        data.forEach(function (item) {
            var el = document.createElement('span');
            el.innerHTML = self._elements.itemTemplate.innerHTML;
            el.querySelectorAll(selectors.item.title)[0].appendChild(document.createTextNode(item.title));
            el.querySelectorAll(selectors.item.self)[0].setAttribute('href', item.url);
            results.innerHTML += el.innerHTML;
        });
    };

    Search.prototype._markResults = function() {
        var nodeList = this._elements.results.querySelectorAll(selectors.item.self);
        var escapedTerm = this._elements.input.value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
        var regex = new RegExp('(' + escapedTerm + ')', 'gi');

        for (var i = this._resultsOffset - 1; i < nodeList.length; ++i) {
            var result = nodeList[i];
            mark(result, regex);
        }
    };

    Search.prototype._stepResultFocus = function(reverse) {
        var results = this._elements.results.querySelectorAll(selectors.item.self);
        var focused = this._elements.results.querySelector(selectors.item.focused);
        var newFocused;
        var index = Array.prototype.indexOf.call(results, focused);
        var focusedCssClass = NS + '-search__item--is-focused';

        if (results.length > 0) {

            if (!reverse) {
                // highlight the next result
                if (index < 0) {
                    results[0].classList.add(focusedCssClass);
                } else if (index + 1 < results.length) {
                    results[index].classList.remove(focusedCssClass);
                    results[index + 1].classList.add(focusedCssClass);
                }

                // if the last visible result is partially hidden, scroll up until it's completely visible
                newFocused = this._elements.results.querySelector(selectors.item.focused);
                if (newFocused) {
                    var bottomHiddenHeight = newFocused.offsetTop + newFocused.offsetHeight - this._elements.results.scrollTop - this._elements.results.clientHeight;
                    if (bottomHiddenHeight > 0) {
                        this._elements.results.scrollTop += bottomHiddenHeight;
                    } else {
                        this._onScroll();
                    }
                }

            } else {
                // highlight the previous result
                if (index >= 1) {
                    results[index].classList.remove(focusedCssClass);
                    results[index - 1].classList.add(focusedCssClass);
                }

                // if the first visible result is partially hidden, scroll down until it's completely visible
                newFocused = this._elements.results.querySelector(selectors.item.focused);
                if (newFocused) {
                    var topHiddenHeight = this._elements.results.scrollTop - newFocused.offsetTop;
                    if (topHiddenHeight > 0) {
                        this._elements.results.scrollTop -= topHiddenHeight;
                    }
                }
            }
        }
    };

    Search.prototype._updateResults = function() {
        var self = this;
        if (self._hasMoreResults) {
            var request = new XMLHttpRequest();
            var url = self._action + '?' + serialize(self._elements.form) + '&' + PARAM_RESULTS_OFFSET + '=' + self._resultsOffset;

            request.open('GET', url, true);
            request.onload = function() {
                // when the results are loaded: hide the loading indicator and display the search icon after a minimum period
                setTimeout(function() {
                    toggleShow(self._elements.loadingIndicator, false);
                    toggleShow(self._elements.icon, true);
                }, LOADING_DISPLAY_DELAY);
                if (request.status >= 200 && request.status < 400) {
                    // success status
                    var data = JSON.parse(request.responseText);
                    if (data.length > 0) {
                        self._generateItems(data, self._elements.results);
                        self._markResults();
                        toggleShow(self._elements.results, true);
                    } else {
                        self._hasMoreResults = false;
                    }
                    // the total number of results is not a multiple of the fetched results:
                    // -> we reached the end of the query
                    if (self._elements.results.querySelectorAll(selectors.item.self).length % self._properties.resultsSize > 0) {
                        self._hasMoreResults = false;
                    }
                } else {
                    // error status
                }
            };
            // when the results are loading: display the loading indicator and hide the search icon
            toggleShow(self._elements.loadingIndicator, true);
            toggleShow(self._elements.icon, false);
            request.send();
        }
    };

    Search.prototype._cancelResults = function() {
        clearTimeout(this._timeout);
        this._elements.results.scrollTop = 0;
        this._resultsOffset = 0;
        this._hasMoreResults = true;
        this._elements.results.innerHTML = '';
    };

    Search.prototype._cacheElements = function(wrapper) {
        this._elements = {};
        this._elements.self = wrapper;
        var hooks = this._elements.self.querySelectorAll('[data-' + NS + '-hook-' + IS + ']');

        for (var i = 0; i < hooks.length; i++) {
            var hook = hooks[i];
            var capitalized = IS;
            capitalized = capitalized.charAt(0).toUpperCase() + capitalized.slice(1);
            var key = hook.dataset[NS + 'Hook' + capitalized];
            this._elements[key] = hook;
        }
    };

    Search.prototype._setupProperties = function(options) {
        this._properties = {};

        for (var key in properties) {
            if (properties.hasOwnProperty(key)) {
                var property = properties[key];
                if (options && options[key] != null) {
                    if (property && typeof property.transform === 'function') {
                        this._properties[key] = property.transform(options[key]);
                    } else {
                        this._properties[key] = options[key];
                    }
                } else {
                    this._properties[key] = properties[key]['default'];
                }
            }
        }
    };

    function onDocumentReady() {
        var elements = document.querySelectorAll(selectors.self);
        for (var i = 0; i < elements.length; i++) {
            new Search({ element: elements[i], options: readData(elements[i]) });
        }

        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
        var body = document.querySelector('body');
        var observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                // needed for IE
                var nodesArray = [].slice.call(mutation.addedNodes);
                if (nodesArray.length > 0) {
                    nodesArray.forEach(function (addedNode) {
                        if (addedNode.querySelectorAll) {
                            var elementsArray = [].slice.call(addedNode.querySelectorAll(selectors.self));
                            elementsArray.forEach(function (element) {
                                new Search({ element: element, options: readData(element) });
                            });
                        }
                    });
                }
            });
        });

        observer.observe(body, {
            subtree      : true,
            childList    : true,
            characterData: true
        });
    }

    if (document.readyState != 'loading'){
        onDocumentReady();
    } else {
        document.addEventListener('DOMContentLoaded', onDocumentReady());
    }

})();


// Wrap bindings in anonymous namespace to prevent collisions
jQuery(function($) {
    "use strict;"

 function applyComponentStyles() {

  //Top Level Navigation (expected to only be one of these)
  $(".cmp-navigation--top .cmp-navigation").not("[data-top-nav-processed='true']").each(function() {
            // Mark the component element as processed to avoid the cyclic processing (see .not(..) above).
            var nav = $(this).attr("data-top-nav-processed", true),
                $body = $('body');
            
            // Toggle Nav
            $('<div id="toggleNav">' +
                 '<a href="#navPanel" class="toggle"></a>' +
                '</div>'
            ).appendTo($body); 
            
         // Navigation Panel.
            $(
                '<div id="navPanel" class="cmp-navigation--mobile">' +
                    '<nav class="cmp-navigation">' +
                        $(this).html() +
                    '</nav>' +
                '</div>'
            )
                .appendTo($body)
                .panel({
                    delay: 500,
                    hideOnClick: true,
                    hideOnSwipe: true,
                    resetScroll: true,
                    resetForms: true,
                    side: 'left',
                    target: $body,
                    visibleClass: 'navPanel-visible'
                });
        });
    }

  applyComponentStyles();
  
  $(".responsivegrid").bind("DOMNodeInserted", applyComponentStyles);
});