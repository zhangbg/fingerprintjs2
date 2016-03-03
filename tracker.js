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
    
    (function () {
        //  be rly sure not to destroy a thing!
        if (!document.querySelectorAll && !document.querySelector) {
            var style = document.createStyleSheet(),
                innerSelect = function (selector, maxCount) {
                    var all = document.all, l = all.length, i, resultSet = [];
                    style.addRule(selector, "foo:bar");
                    for (i = 0; i < l; i += 1) {
                        if (all[i].currentStyle.foo === "bar") {
                            resultSet.push(all[i]);
                            if (resultSet.length > maxCount) {
                                break;
                            }
                        }
                    }
                    style.removeRule(0);
                    return resultSet;
                };
            
            document.querySelectorAll = function (selector) {
                return innerSelect(selector, Infinity);
            };
            document.querySelector = function (selector) {
                return innerSelect(selector, 1)[0] || null;
            };
        }
    })();
    
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
        isIE : function () {
			if (navigator.appName === "Microsoft Internet Explorer") {
				return true;
			} else if (navigator.appName === "Netscape" && /Trident/.test(navigator.userAgent)) { // IE 11
				return true;
			}
			return false;
		},
        stringify : function (obj) {
            if ("JSON" in window) {
                return JSON.stringify(obj);
            }

            var t = typeof obj;
            if (t != "object" || obj === null) {
                // simple data type
                if (t == "string") obj = '"' + obj.replace(/"/g,'\\\"') + '"';
                return String(obj);
            } else {
                // recurse array or object
                var n, v, json = [], arr = (obj && obj.constructor == Array);

                for (n in obj) {
                    v = obj[n];
                    t = typeof v;
                    if (obj.hasOwnProperty(n)) {
                        if (t == "string") {
                            v = '"' + v.replace(/"/g,'\\\"') + '"';
                        } else if (t == "object" && v !== null){
                            v = this.stringify(v);
                        }
                        json.push((arr ? "" : '"' + n + '":') + String(v));
                    }
                }

                return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
            }
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
			
			if (_utility.isObject(data)) {
				dataStr = thiz.param(data);
				if (method === 'get') {
					url = url + ((url.indexOf('?') === -1) ? '?' : '') + dataStr;
					dataStr = undefined;
				}
			}

            if (settings.cors && 'XDomainRequest' in window && window.XDomainRequest !== null) {
                xmlHttp = new XDomainRequest();
                xmlHttp.open(method, url);
                xmlHttp.onerror = function () {
                    _utility.isFunction(settings.error) && settings.error.apply(xmlHttp, [result, xmlHttp]);
                };
                xmlHttp.onload = function () {
                    _utility.isFunction(settings.success) && settings.success.apply(xmlHttp, [result, xmlHttp]);
                };
            } else {
                xmlHttp = new (XMLHttpRequest || ActiveXObject)('Microsoft.XMLHTTP');
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
            }
			xmlHttp.send(dataStr);

			return xmlHttp;
        }
    };
    
    function Tracker(options) {
        var defaults = {
            swfContainerId : "fingerprint_tracker",
            swfContainerId2 : "fingerprint_tracker",
			swfPath : "./FontList.swf",
			swfPath2 : "./FontList2.swf"
        };
        this.options = _utility.extend({}, defaults, options || {});
    }
    Tracker.prototype = {
        getDetail : function (done) {
            var that = this;
            if (that.details) {
                typeof done === 'function' && done(that.details);
                return;
            }
            var webglObj = this.getWebgl();
            this.details = {
                'platform' : this.getPlatform(),
                'cookieEnabled' : this.getCookieEnabled(),
                'doNotTrack' : this.getDoNotTrack(),
                'timeZone' : this.getTimeZone(),
                'screenResolution' : this.getScreenResolution(),
                'localStorage' : this.getLocalStorage(),
                'sessionStorage' : this.getSessionStorage(),
                'language' : this.getLanguage(),
                'touchSupport' : this.getTouchSupport(),
                'WebGL Vendor' : webglObj.webGLVendor,
                'WebGL Renderer' : webglObj.webGLRenderer,
                'plugins' : this.getPlugins()
            };
            var func = function (fonts) {
                that.details.fonts = fonts.join(', ');
                typeof done === 'function' && done(that.details);
            };
            this.getFlashFonts(func);
        },
        log : function () {
            this.getDetail(function (details) {
                var elem = document.querySelector('.username') || {'innerHTML' : ''};
                details.username = elem.innerHTML.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '') || 'unknown'; //TODO
                _utility.ajax({
                    cors : true,
                    url : 'http://10.201.50.181/v2/user/test',
                    method : 'post',
                    data : {'data' : _utility.stringify(details)},
                    success : function (result, xmlHttp) {
                        window.console && console.log('服务器请求成功');
                    },
                    error : function (result, xmlHttp) {
                        window.console && console.log('服务器请求错误');
                    }
                }); 
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
				return navigator.doNotTrack || '-';
			} else {
				return "-";
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
        },
        getPlugins : function () {
            var plist = [], pd = window.PluginDetect || '';
            if (pd && pd.browser.isIE) {
                var nbPlugins = 0;
                var pluginsList = ["QuickTime", "Java", "DevalVR", "Flash", "Shockwave",
                    "WindowsMediaPlayer", "Silverlight", "VLC", "AdobeReader", "PDFReader",
                    "RealPlayer", "PDFjs"];
                pd.getVersion(".");
                for (i = 0; i < pluginsList.length; i++) {
                    var ver = pd.getVersion(pluginsList[i]);
                    if(ver != null){
                        plist.push('Plugin ' + nbPlugins++ + ': ' + pluginsList[i] + ' ' + ver);
                    }
                }
            } else {
                var np = window.navigator.plugins;
                var temp, length = np.length;
                for (var i = 0; i < length; i++) {
                    temp = np[i];
                    plist.push([temp.name, temp.description || '-', temp.filename].join(', '));
                }
                plist.sort();
                for (i = 0; i < plist.length; i++) {
                    plist[i] = 'Plugin ' + i + ': ' + plist[i];
                }
            }
            return plist.join('; ');
        },
        getJSFonts : function (done) {
			var that = this;
			// doing js fonts detection in a pseudo-async fashion
			return setTimeout(function () {

				// a font will be compared against all the three default fonts.
				// and if it doesn't match all 3 then that font is not available.
				var baseFonts = ["monospace", "sans-serif", "serif"];

				//we use m or w because these two characters take up the maximum width.
				// And we use a LLi so that the same matching fonts can get separated
				var testString = "mmmmmmmmmmlli";

				//we test using 72px font size, we may use any size. I guess larger the better.
				var testSize = "72px";

				var h = document.getElementsByTagName("body")[0];

				// create a SPAN in the document to get the width of the text we use to test
				var s = document.createElement("span");
				s.style.fontSize = testSize;
				s.innerHTML = testString;
				var defaultWidth = {};
				var defaultHeight = {};
				for (var index in baseFonts) {
					//get the default width for the three base fonts
					s.style.fontFamily = baseFonts[index];
					h.appendChild(s);
					defaultWidth[baseFonts[index]] = s.offsetWidth; //width for the default font
					defaultHeight[baseFonts[index]] = s.offsetHeight; //height for the defualt font
					h.removeChild(s);
				}
				var detect = function (font) {
					var detected = false;
					for (var index in baseFonts) {
						s.style.fontFamily = font + "," + baseFonts[index]; // name of the font along with the base font for fallback.
						h.appendChild(s);
						var matched = (s.offsetWidth !== defaultWidth[baseFonts[index]] || s.offsetHeight !== defaultHeight[baseFonts[index]]);
						h.removeChild(s);
						detected = detected || matched;
					}
					return detected;
				};
				var fontList = [
					"Andale Mono", "Arial", "Arial Black", "Arial Hebrew", "Arial MT", "Arial Narrow", "Arial Rounded MT Bold", "Arial Unicode MS",
					"Bitstream Vera Sans Mono", "Book Antiqua", "Bookman Old Style",
					"Calibri", "Cambria", "Cambria Math", "Century", "Century Gothic", "Century Schoolbook", "Comic Sans", "Comic Sans MS", "Consolas", "Courier", "Courier New",
					"Garamond", "Geneva", "Georgia",
					"Helvetica", "Helvetica Neue",
					"Impact",
					"Lucida Bright", "Lucida Calligraphy", "Lucida Console", "Lucida Fax", "LUCIDA GRANDE", "Lucida Handwriting", "Lucida Sans", "Lucida Sans Typewriter", "Lucida Sans Unicode",
					"Microsoft Sans Serif", "Monaco", "Monotype Corsiva", "MS Gothic", "MS Outlook", "MS PGothic", "MS Reference Sans Serif", "MS Sans Serif", "MS Serif", "MYRIAD", "MYRIAD PRO",
					"Palatino", "Palatino Linotype",
					"Segoe Print", "Segoe Script", "Segoe UI", "Segoe UI Light", "Segoe UI Semibold", "Segoe UI Symbol",
					"Tahoma", "Times", "Times New Roman", "Times New Roman PS", "Trebuchet MS",
					"Verdana", "Wingdings", "Wingdings 2", "Wingdings 3",
                    '仿宋', '华文中宋', '华文仿宋', '华文宋体', '华文彩云', '华文新魏', '华文楷体', '华文琥珀', 
                    '华文细黑', '华文行楷', '华文隶书', '宋体', '幼圆', '微软雅黑', '新宋体', '方正兰亭超细黑简体',
                    '方正兰亭黑_YS_GB18030', '方正姚体', '方正舒体', '楷体', '汉仪南宫体简', '汉仪娃娃篆简',
                    '汉仪瘦金书简', '汉仪篆书繁', '隶书', '黑体'
				];
				var extendedFontList = [
					"Abadi MT Condensed Light", "Academy Engraved LET", "ADOBE CASLON PRO", "Adobe Garamond", "ADOBE GARAMOND PRO", "Agency FB", "Aharoni", "Albertus Extra Bold", "Albertus Medium", "Algerian", "Amazone BT", "American Typewriter",
					"American Typewriter Condensed", "AmerType Md BT", "Andalus", "Angsana New", "AngsanaUPC", "Antique Olive", "Aparajita", "Apple Chancery", "Apple Color Emoji", "Apple SD Gothic Neo", "Arabic Typesetting", "ARCHER",
					"ARNO PRO", "Arrus BT", "Aurora Cn BT", "AvantGarde Bk BT", "AvantGarde Md BT", "AVENIR", "Ayuthaya", "Bandy", "Bangla Sangam MN", "Bank Gothic", "BankGothic Md BT", "Baskerville",
					"Baskerville Old Face", "Batang", "BatangChe", "Bauer Bodoni", "Bauhaus 93", "Bazooka", "Bell MT", "Bembo", "Benguiat Bk BT", "Berlin Sans FB", "Berlin Sans FB Demi", "Bernard MT Condensed", "BernhardFashion BT", "BernhardMod BT", "Big Caslon", "BinnerD",
					"Blackadder ITC", "BlairMdITC TT", "Bodoni 72", "Bodoni 72 Oldstyle", "Bodoni 72 Smallcaps", "Bodoni MT", "Bodoni MT Black", "Bodoni MT Condensed", "Bodoni MT Poster Compressed",
					"Bookshelf Symbol 7", "Boulder", "Bradley Hand", "Bradley Hand ITC", "Bremen Bd BT", "Britannic Bold", "Broadway", "Browallia New", "BrowalliaUPC", "Brush Script MT", "Californian FB", "Calisto MT", "Calligrapher", "Candara",
					"CaslonOpnface BT", "Castellar", "Centaur", "Cezanne", "CG Omega", "CG Times", "Chalkboard", "Chalkboard SE", "Chalkduster", "Charlesworth", "Charter Bd BT", "Charter BT", "Chaucer",
					"ChelthmITC Bk BT", "Chiller", "Clarendon", "Clarendon Condensed", "CloisterBlack BT", "Cochin", "Colonna MT", "Constantia", "Cooper Black", "Copperplate", "Copperplate Gothic", "Copperplate Gothic Bold",
					"Copperplate Gothic Light", "CopperplGoth Bd BT", "Corbel", "Cordia New", "CordiaUPC", "Cornerstone", "Coronet", "Cuckoo", "Curlz MT", "DaunPenh", "Dauphin", "David", "DB LCD Temp", "DELICIOUS", "Denmark",
					"DFKai-SB", "Didot", "DilleniaUPC", "DIN", "DokChampa", "Dotum", "DotumChe", "Ebrima", "Edwardian Script ITC", "Elephant", "English 111 Vivace BT", "Engravers MT", "EngraversGothic BT", "Eras Bold ITC", "Eras Demi ITC", "Eras Light ITC", "Eras Medium ITC",
					"EucrosiaUPC", "Euphemia", "Euphemia UCAS", "EUROSTILE", "Exotc350 Bd BT", "FangSong", "Felix Titling", "Fixedsys", "FONTIN", "Footlight MT Light", "Forte",
					"FrankRuehl", "Fransiscan", "Freefrm721 Blk BT", "FreesiaUPC", "Freestyle Script", "French Script MT", "FrnkGothITC Bk BT", "Fruitger", "FRUTIGER",
					"Futura", "Futura Bk BT", "Futura Lt BT", "Futura Md BT", "Futura ZBlk BT", "FuturaBlack BT", "Gabriola", "Galliard BT", "Gautami", "Geeza Pro", "Geometr231 BT", "Geometr231 Hv BT", "Geometr231 Lt BT", "GeoSlab 703 Lt BT",
					"GeoSlab 703 XBd BT", "Gigi", "Gill Sans", "Gill Sans MT", "Gill Sans MT Condensed", "Gill Sans MT Ext Condensed Bold", "Gill Sans Ultra Bold", "Gill Sans Ultra Bold Condensed", "Gisha", "Gloucester MT Extra Condensed", "GOTHAM", "GOTHAM BOLD",
					"Goudy Old Style", "Goudy Stout", "GoudyHandtooled BT", "GoudyOLSt BT", "Gujarati Sangam MN", "Gulim", "GulimChe", "Gungsuh", "GungsuhChe", "Gurmukhi MN", "Haettenschweiler", "Harlow Solid Italic", "Harrington", "Heather", "Heiti SC", "Heiti TC", "HELV",
					"Herald", "High Tower Text", "Hiragino Kaku Gothic ProN", "Hiragino Mincho ProN", "Hoefler Text", "Humanst 521 Cn BT", "Humanst521 BT", "Humanst521 Lt BT", "Imprint MT Shadow", "Incised901 Bd BT", "Incised901 BT",
					"Incised901 Lt BT", "INCONSOLATA", "Informal Roman", "Informal011 BT", "INTERSTATE", "IrisUPC", "Iskoola Pota", "JasmineUPC", "Jazz LET", "Jenson", "Jester", "Jokerman", "Juice ITC", "Kabel Bk BT", "Kabel Ult BT", "Kailasa", "KaiTi", "Kalinga", "Kannada Sangam MN",
					"Kartika", "Kaufmann Bd BT", "Kaufmann BT", "Khmer UI", "KodchiangUPC", "Kokila", "Korinna BT", "Kristen ITC", "Krungthep", "Kunstler Script", "Lao UI", "Latha", "Leelawadee", "Letter Gothic", "Levenim MT", "LilyUPC", "Lithograph", "Lithograph Light", "Long Island",
					"Lydian BT", "Magneto", "Maiandra GD", "Malayalam Sangam MN", "Malgun Gothic",
					"Mangal", "Marigold", "Marion", "Marker Felt", "Market", "Marlett", "Matisse ITC", "Matura MT Script Capitals", "Meiryo", "Meiryo UI", "Microsoft Himalaya", "Microsoft JhengHei", "Microsoft New Tai Lue", "Microsoft PhagsPa", "Microsoft Tai Le",
					"Microsoft Uighur", "Microsoft YaHei", "Microsoft Yi Baiti", "MingLiU", "MingLiU_HKSCS", "MingLiU_HKSCS-ExtB", "MingLiU-ExtB", "Minion", "Minion Pro", "Miriam", "Miriam Fixed", "Mistral", "Modern", "Modern No. 20", "Mona Lisa Solid ITC TT", "Mongolian Baiti",
					"MONO", "MoolBoran", "Mrs Eaves", "MS LineDraw", "MS Mincho", "MS PMincho", "MS Reference Specialty", "MS UI Gothic", "MT Extra", "MUSEO", "MV Boli",
					"Nadeem", "Narkisim", "NEVIS", "News Gothic", "News GothicMT", "NewsGoth BT", "Niagara Engraved", "Niagara Solid", "Noteworthy", "NSimSun", "Nyala", "OCR A Extended", "Old Century", "Old English Text MT", "Onyx", "Onyx BT", "OPTIMA", "Oriya Sangam MN",
					"OSAKA", "OzHandicraft BT", "Palace Script MT", "Papyrus", "Parchment", "Party LET", "Pegasus", "Perpetua", "Perpetua Titling MT", "PetitaBold", "Pickwick", "Plantagenet Cherokee", "Playbill", "PMingLiU", "PMingLiU-ExtB",
					"Poor Richard", "Poster", "PosterBodoni BT", "PRINCETOWN LET", "Pristina", "PTBarnum BT", "Pythagoras", "Raavi", "Rage Italic", "Ravie", "Ribbon131 Bd BT", "Rockwell", "Rockwell Condensed", "Rockwell Extra Bold", "Rod", "Roman", "Sakkal Majalla",
					"Santa Fe LET", "Savoye LET", "Sceptre", "Script", "Script MT Bold", "SCRIPTINA", "Serifa", "Serifa BT", "Serifa Th BT", "ShelleyVolante BT", "Sherwood",
					"Shonar Bangla", "Showcard Gothic", "Shruti", "Signboard", "SILKSCREEN", "SimHei", "Simplified Arabic", "Simplified Arabic Fixed", "SimSun", "SimSun-ExtB", "Sinhala Sangam MN", "Sketch Rockwell", "Skia", "Small Fonts", "Snap ITC", "Snell Roundhand", "Socket",
					"Souvenir Lt BT", "Staccato222 BT", "Steamer", "Stencil", "Storybook", "Styllo", "Subway", "Swis721 BlkEx BT", "Swiss911 XCm BT", "Sylfaen", "Synchro LET", "System", "Tamil Sangam MN", "Technical", "Teletype", "Telugu Sangam MN", "Tempus Sans ITC",
					"Terminal", "Thonburi", "Traditional Arabic", "Trajan", "TRAJAN PRO", "Tristan", "Tubular", "Tunga", "Tw Cen MT", "Tw Cen MT Condensed", "Tw Cen MT Condensed Extra Bold",
					"TypoUpright BT", "Unicorn", "Univers", "Univers CE 55 Medium", "Univers Condensed", "Utsaah", "Vagabond", "Vani", "Vijaya", "Viner Hand ITC", "VisualUI", "Vivaldi", "Vladimir Script", "Vrinda", "Westminster", "WHITNEY", "Wide Latin",
					"ZapfEllipt BT", "ZapfHumnst BT", "ZapfHumnst Dm BT", "Zapfino", "Zurich BlkEx BT", "Zurich Ex BT", "ZWAdobeF"];

				fontList = fontList.concat(extendedFontList);
				var available = [];
				for (var i = 0, l = fontList.length; i < l; i++) {
					if (detect(fontList[i])) {
						available.push(fontList[i]);
					}
				}
				done(available);
			}, 1);
		},
        getFlashFonts : function (done) {
            var that = this;
            if (typeof window.swfobject !== "undefined" && swfobject.hasFlashPlayerVersion("9.0.0")) {
                var hiddenCallback = "___fp_swf_loaded";
                window[hiddenCallback] = function (fonts) {
                    done(fonts);
                };
                
                var id = this.options.swfContainerId;
                var elem = document.getElementById(id);
                elem && elem.parentNode && elem.parentNode.removeChild(elem);
                var node = document.createElement("div");
                node.setAttribute("id", id);
                document.body.appendChild(node);
                
                var flashvars = {
                    onReady : hiddenCallback
                };
                var flashparams = {
                    allowScriptAccess : "always",
                    menu : "false"
                };
                swfobject.embedSWF(this.options.swfPath, id, "1", "1", "9.0.0", false, flashvars, flashparams, {}, function (e) {
                    if (!e.success) {
                        that.getJSFonts(done);
                    } else {
                        window.console && console.dir(e);
                    }
                });
            } else if (_utility.isIE()) { //It's just for IE11 && Edge browser.
                var id = this.options.swfContainerId2;
                var elem = document.getElementById(id);
                elem && elem.parentNode && elem.parentNode.removeChild(elem);
                var node = document.createElement("div");
                node.setAttribute("id", id);
                node.innerHTML = '<embed name="flashfontshelper" width="1" height="1" id="flashfontshelper" src="' + this.options.swfPath2 + '" type="application/x-shockwave-flash" wmode="transparent" flashvars="" swliveconnect="true"></embed>';
                document.body.appendChild(node);
                
                setTimeout(function () {
                    var obj = document.getElementById("flashfontshelper");
                    if (obj && typeof(obj.GetVariable) != "undefined") {
                        var fonts = obj.GetVariable("/:user_fonts");
                        done(fonts.split(','));
                    } else {
                       that.getJSFonts(done); 
                    }
                }, 500);
            } else {
                this.getJSFonts(done);
            }
        },
        getTouchSupport : function () {
			var maxTouchPoints = 0;
			var touchEvent = false;
			if (typeof navigator.maxTouchPoints !== "undefined") {
				maxTouchPoints = navigator.maxTouchPoints;
			} else if (typeof navigator.msMaxTouchPoints !== "undefined") {
				maxTouchPoints = navigator.msMaxTouchPoints;
			}
			try {
				document.createEvent("TouchEvent");
				touchEvent = true;
			} catch (_) {
				/* squelch */
			}
			var touchStart = "ontouchstart" in window;
			return ['Max touchpoints: ' + maxTouchPoints, 'TouchEvent supported: ' + touchEvent, 'onTouchStart supported: ' + touchStart].join(', ');
		},
        getWebgl : function () {
            var webGLData, webGLVendor, webGLRenderer;
            try {
                var fa2s = function(fa) {
                    gl.clearColor(0.0, 0.0, 0.0, 1.0);
                    gl.enable(gl.DEPTH_TEST);
                    gl.depthFunc(gl.LEQUAL);
                    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
                    return "[" + fa[0] + ", " + fa[1] + "]";
                };
                var maxAnisotropy = function(gl) {
                    var anisotropy, ext = gl.getExtension("EXT_texture_filter_anisotropic") || gl.getExtension("WEBKIT_EXT_texture_filter_anisotropic") || gl.getExtension("MOZ_EXT_texture_filter_anisotropic");
                    return ext ? (anisotropy = gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT), 0 === anisotropy && (anisotropy = 2), anisotropy) : null;
                };
                var canvas = document.createElement("canvas");
                var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
                var result = [];
                var vShaderTemplate = "attribute vec2 attrVertex;varying vec2 varyinTexCoordinate;uniform vec2 uniformOffset;void main(){varyinTexCoordinate=attrVertex+uniformOffset;gl_Position=vec4(attrVertex,0,1);}";
                var fShaderTemplate = "precision mediump float;varying vec2 varyinTexCoordinate;void main() {gl_FragColor=vec4(varyinTexCoordinate,0,1);}";
                var vertexPosBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, vertexPosBuffer);
                var vertices = new Float32Array([-0.2, -0.9, 0, 0.4, -0.26, 0, 0, 0.732134444, 0]);
                gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
                vertexPosBuffer.itemSize = 3;
                vertexPosBuffer.numItems = 3;
                var program = gl.createProgram(), vshader = gl.createShader(gl.VERTEX_SHADER);
                gl.shaderSource(vshader, vShaderTemplate);
                gl.compileShader(vshader);
                var fshader = gl.createShader(gl.FRAGMENT_SHADER);
                gl.shaderSource(fshader, fShaderTemplate);
                gl.compileShader(fshader);
                gl.attachShader(program, vshader);
                gl.attachShader(program, fshader);
                gl.linkProgram(program);
                gl.useProgram(program);
                program.vertexPosAttrib = gl.getAttribLocation(program, "attrVertex");
                program.offsetUniform = gl.getUniformLocation(program, "uniformOffset");
                gl.enableVertexAttribArray(program.vertexPosArray);
                gl.vertexAttribPointer(program.vertexPosAttrib, vertexPosBuffer.itemSize, gl.FLOAT, !1, 0, 0);
                gl.uniform2f(program.offsetUniform, 1, 1);
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexPosBuffer.numItems);
                if (gl.canvas != null) { result.push(gl.canvas.toDataURL()); }
                result.push("extensions:" + gl.getSupportedExtensions().join(";"));
                result.push("webgl aliased line width range:" + fa2s(gl.getParameter(gl.ALIASED_LINE_WIDTH_RANGE)));
                result.push("webgl aliased point size range:" + fa2s(gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE)));
                result.push("webgl alpha bits:" + gl.getParameter(gl.ALPHA_BITS));
                result.push("webgl antialiasing:" + (gl.getContextAttributes().antialias ? "yes" : "no"));
                result.push("webgl blue bits:" + gl.getParameter(gl.BLUE_BITS));
                result.push("webgl depth bits:" + gl.getParameter(gl.DEPTH_BITS));
                result.push("webgl green bits:" + gl.getParameter(gl.GREEN_BITS));
                result.push("webgl max anisotropy:" + maxAnisotropy(gl));
                result.push("webgl max combined texture image units:" + gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS));
                result.push("webgl max cube map texture size:" + gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE));
                result.push("webgl max fragment uniform vectors:" + gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS));
                result.push("webgl max render buffer size:" + gl.getParameter(gl.MAX_RENDERBUFFER_SIZE));
                result.push("webgl max texture image units:" + gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS));
                result.push("webgl max texture size:" + gl.getParameter(gl.MAX_TEXTURE_SIZE));
                result.push("webgl max varying vectors:" + gl.getParameter(gl.MAX_VARYING_VECTORS));
                result.push("webgl max vertex attribs:" + gl.getParameter(gl.MAX_VERTEX_ATTRIBS));
                result.push("webgl max vertex texture image units:" + gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS));
                result.push("webgl max vertex uniform vectors:" + gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS));
                result.push("webgl max viewport dims:" + fa2s(gl.getParameter(gl.MAX_VIEWPORT_DIMS)));
                result.push("webgl red bits:" + gl.getParameter(gl.RED_BITS));
                result.push("webgl renderer:" + gl.getParameter(gl.RENDERER));
                result.push("webgl shading language version:" + gl.getParameter(gl.SHADING_LANGUAGE_VERSION));
                result.push("webgl stencil bits:" + gl.getParameter(gl.STENCIL_BITS));
                result.push("webgl vendor:" + gl.getParameter(gl.VENDOR));
                result.push("webgl version:" + gl.getParameter(gl.VERSION));
                result.push("webgl vertex shader high float precision:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT ).precision);
                result.push("webgl vertex shader high float precision rangeMin:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT ).rangeMin);
                result.push("webgl vertex shader high float precision rangeMax:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT ).rangeMax);
                result.push("webgl vertex shader medium float precision:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_FLOAT ).precision);
                result.push("webgl vertex shader medium float precision rangeMin:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_FLOAT ).rangeMin);
                result.push("webgl vertex shader medium float precision rangeMax:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_FLOAT ).rangeMax);
                result.push("webgl vertex shader low float precision:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_FLOAT ).precision);
                result.push("webgl vertex shader low float precision rangeMin:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_FLOAT ).rangeMin);
                result.push("webgl vertex shader low float precision rangeMax:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_FLOAT ).rangeMax);
                result.push("webgl fragment shader high float precision:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT ).precision);
                result.push("webgl fragment shader high float precision rangeMin:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT ).rangeMin);
                result.push("webgl fragment shader high float precision rangeMax:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT ).rangeMax);
                result.push("webgl fragment shader medium float precision:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT ).precision);
                result.push("webgl fragment shader medium float precision rangeMin:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT ).rangeMin);
                result.push("webgl fragment shader medium float precision rangeMax:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT ).rangeMax);
                result.push("webgl fragment shader low float precision:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_FLOAT ).precision);
                result.push("webgl fragment shader low float precision rangeMin:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_FLOAT ).rangeMin);
                result.push("webgl fragment shader low float precision rangeMax:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_FLOAT ).rangeMax);
                result.push("webgl vertex shader high int precision:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_INT ).precision);
                result.push("webgl vertex shader high int precision rangeMin:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_INT ).rangeMin);
                result.push("webgl vertex shader high int precision rangeMax:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_INT ).rangeMax);
                result.push("webgl vertex shader medium int precision:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_INT ).precision);
                result.push("webgl vertex shader medium int precision rangeMin:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_INT ).rangeMin);
                result.push("webgl vertex shader medium int precision rangeMax:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_INT ).rangeMax);
                result.push("webgl vertex shader low int precision:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_INT ).precision);
                result.push("webgl vertex shader low int precision rangeMin:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_INT ).rangeMin);
                result.push("webgl vertex shader low int precision rangeMax:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_INT ).rangeMax);
                result.push("webgl fragment shader high int precision:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_INT ).precision);
                result.push("webgl fragment shader high int precision rangeMin:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_INT ).rangeMin);
                result.push("webgl fragment shader high int precision rangeMax:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_INT ).rangeMax);
                result.push("webgl fragment shader medium int precision:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_INT ).precision);
                result.push("webgl fragment shader medium int precision rangeMin:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_INT ).rangeMin);
                result.push("webgl fragment shader medium int precision rangeMax:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_INT ).rangeMax);
                result.push("webgl fragment shader low int precision:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_INT ).precision);
                result.push("webgl fragment shader low int precision rangeMin:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_INT ).rangeMin);
                result.push("webgl fragment shader low int precision rangeMax:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_INT ).rangeMax);
                webGLData = result.join(", ");

                canvas = document.createElement('canvas');
                var ctx = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
                if(ctx.getSupportedExtensions().indexOf("WEBGL_debug_renderer_info") >= 0) {
                    webGLVendor = ctx.getParameter(ctx.getExtension('WEBGL_debug_renderer_info').UNMASKED_VENDOR_WEBGL);
                    webGLRenderer = ctx.getParameter(ctx.getExtension('WEBGL_debug_renderer_info').UNMASKED_RENDERER_WEBGL);
                } else {
                    webGLVendor = "Not supported";
                    webGLRenderer = "Not supported";
                }
            } catch(e){
                webGLData = '-'; //"Not supported";
                webGLVendor = '-'; //"Not supported";
                webGLRenderer = '-'; //"Not supported";
            }
            return {
                'webGLData' : webGLData,
                'webGLVendor' : webGLVendor,
                'webGLRenderer' : webGLRenderer
            };
        }
    };
    
    var tracker = new Tracker();
    if (location.pathname !== '/users/sign_in' && document.querySelector('.username')) {
        tracker.log();
    }
    // tracker.log();
    
    /* _utility.addEvent(window, 'load', function (e) {
        
    }); */
    
    return tracker;
});