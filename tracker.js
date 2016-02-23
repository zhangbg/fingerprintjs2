/*
 * Copyright (c) 2016-? 
 * @author      zhangbiaoguang
 * @version     1.0.0 (Semantic Versioning 2.0.0)
 * Date: 2015-11-27
*/

(function (name, context, definition) {
	"use strict";
	if (typeof module !== "undefined" && module.exports) {
		module.exports = definition();
	} else if (typeof define === "function" && define.amd) {
		define(definition);
	} else {
		context[name] = definition();
	}
})('FpTracker', this, function () {
    "use strict";
    
    var toString = Object.prototype.toString;
    var _utility = {
        isFunction : function (o) {
            return toString.call(o) === '[object Function]';
        },
        isObject : function (o) {
            return toString.call(o) === '[object Object]';
        },
        parseJSON : function (jsonString) {
            var result;
            try {
                if (window.parseJSON) {
                    result = window.parseJSON(jsonString);
                } else {
                    result = (Function('return ' + jsonString))();
                }
            } catch (e) {
                result = jsonString;
            }
            return result;
        },
        addEvent : function (elem, type, handler) {
            if (document.addEventListener) {
                elem.addEventListener(type, handler, false);
            } else {
                elem.attachEvent('on' + type, handler);
            }
        },
        removeEvent : function (elem, type, handler) {
            if (document.removeEventListener) {
                elem.removeEventListener(type, handler, false);
            } else {
                elem.detachEvent('on' + type, handler);
            }
        },
        extend : function (target) {
            target = target || {};
            var i = 1, length = arguments.length, source, key, src;
            for (; i < length; i++) {
                if ((source = arguments[i]) !== null) {
                    for (key in source) {
                        if ((src = source[key]) !== undefined) {
                            target[key] = src;
                        }
                    }
                }
            }
            return target;
        },
        getTimeZone : function () {
            return Math.round(new Date().getTimezoneOffset() / -60) + "";
        },
        param : function (data) {
            if (!_utility.isObject(data)) {
                return;
            }
            var key, tarray = [], value, i = 0, length, temp, newkey;
            for (key in data) {
                if (data.hasOwnProperty(key)) {
                    value = data[key];
                    if (toString.call(value) === '[object Array]') {
                        tempArr = [];
                        for (i = 0, length = value.length; i < length; i++) {
                            temp = value[i];
                            if (_utility.isObject(temp)) {
                                for (newkey in temp) {
                                    tarray.push(encodeURIComponent(key) + '[' + i + '][' + encodeURIComponent(newkey) + ']=' + encodeURIComponent(temp[newkey]));  //items[4][itemId]=item-11-005
                                }
                            } else if (typeof temp !== 'object') {
                                tarray.push(encodeURIComponent(key) + '[]=' + encodeURIComponent(value));
                            }
                        }
                    } else if (_utility.isObject(value)) {
                        for (newkey in value) {
                            tarray.push(encodeURIComponent(key) + '[' + encodeURIComponent(newkey) + ']=' + encodeURIComponent(value[newkey]));  //items[4][itemId]=item-11-005
                        }
                    } else {
                        tarray.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
                    }
                }
            }
            return tarray.join('&');
        },
        ajax : function (settings) {//{url:'', method:'', data:{}, headers:{}, success:function(){}, error:function(){}}
			settings = settings || {};
			var thiz = this, dataStr, xmlHttp, key, result,
				url = settings.url || '/', method = (settings.method || 'get').toLowerCase(),
				async = settings.async === false ? false : true, data = settings.data, headers = settings.headers;

			xmlHttp = new (XMLHttpRequest || ActiveXObject)('Microsoft.XMLHTTP');

			if (_utility.isObject(data)) {
				dataStr = thiz.param(data);
				if (method === 'get') {
					url = url + ((url.indexOf('?') === -1) ? '?' : '') + dataStr;
					dataStr = undefined;
				}
			}

			xmlHttp.open(method, url, async);
			xmlHttp.onreadystatechange = function () {
				if (xmlHttp.readyState === 4) {
					result = _utility.parseJSON(xmlHttp.responseText);
					if (xmlHttp.status >= 200 && xmlHttp.status < 300) {
						_utility.isFunction(settings.success) && settings.success.apply(xmlHttp, [result, xmlHttp]);
					} else {
						_utility.isFunction(settings.error) && settings.error.apply(xmlHttp, [result, xmlHttp]);
					}
				}
				_utility.isFunction(settings.always) && settings.always.apply(xmlHttp, [result, xmlHttp]);
			};

			if (method === 'post' || _utility.isObject(headers)) {
				headers = headers || {};
				headers['Content-type'] = headers['Content-type'] || 'application/x-www-form-urlencoded';
				for (key in headers) {
					if (headers.hasOwnProperty(key)) {
						xmlHttp.setRequestHeader(key, headers[key]);
					}
				}
			}
			xmlHttp.send(dataStr);

			return xmlHttp;
        }
    };
    
    function Tracker(options) {
        var defaults = {};
        this.options = _utility.extend({}, defaults, options || {});
    }
    Tracker.prototype = {
        getDetail : function () {
            return {
                'platform' : this.getPlatform(),
                'cookieEnabled' : this.getCookieEnabled(),
                'doNotTrack' : this.getDoNotTrack(),
                'timeZone' : this.getTimeZone(),
                'screenResolution' : this.getScreenResolution(),
                'localStorage' : this.getLocalStorage(),
                'sessionStorage' : this.getSessionStorage(),
                'language' : this.getLanguage()
            };
        },
        log : function () {
            var params = this.getDetail();
            _utility.ajax({
                url : 'http://www.gridsum.com',
                method : 'get',
                data : params,
                success : function (result, xmlHttp) {
                    window.console && console.log('服务器请求成功');
                },
                error : function (result, xmlHttp) {
                    window.console && console.log('服务器请求错误');
                }
            });
        },
        getPlatform : function () {
            if (navigator.platform) {
				return navigator.platform;
			} else {
				return "unknown";
			}
        },
        getCookieEnabled : function () {
            if (navigator.platform) {
				return navigator.cookieEnabled ? 'yes' : 'no';
			} else {
				return "yes";
			}
        },
        getDoNotTrack : function () {
            if (navigator.platform) {
				return navigator.doNotTrack;
			} else {
				return "unknown";
			}
        },
        getTimeZone : function () {
            return Math.round(new Date().getTimezoneOffset() / -60) + "";
        },
        getScreenResolution : function () {
            return screen.width + 'x' + screen.height + 'x' + screen.colorDepth; 
        },
        getLocalStorage : function () {
            var result;
            try {
				result = !!window.localStorage;
			} catch (e) {
				result = true; // SecurityError when referencing it means it exists
			} finally {
                result = result ? 'true' : 'false';
            }
            return result;
        },
        getSessionStorage : function () {
            var result;
            try {
				result = !!window.sessionStorage;
			} catch (e) {
				result = true; // SecurityError when referencing it means it exists
			} finally {
                result = result ? 'true' : 'false';
            }
            return result;
        },
        getLanguage : function () {
            return navigator.language || navigator.userLanguage || navigator.browserLanguage || navigator.systemLanguage;
        }
    };
    
    var tracker = new Tracker();
    tracker.log();
    
    /* _utility.addEvent(window, 'load', function (e) {
        
    }); */
    
    return tracker;
});