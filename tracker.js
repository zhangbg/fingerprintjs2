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
        isIE : function () {
			if (navigator.appName === "Microsoft Internet Explorer") {
				return true;
			} else if (navigator.appName === "Netscape" && /Trident/.test(navigator.userAgent)) { // IE 11
				return true;
			}
			return false;
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
        var defaults = {
            swfContainerId : "fingerprint_tracker",
			swfPath : "flash/compiled/FontList.swf"
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
            this.details =  {
                'platform' : this.getPlatform(),
                'cookieEnabled' : this.getCookieEnabled(),
                'doNotTrack' : this.getDoNotTrack(),
                'timeZone' : this.getTimeZone(),
                'screenResolution' : this.getScreenResolution(),
                'localStorage' : this.getLocalStorage(),
                'sessionStorage' : this.getSessionStorage(),
                'language' : this.getLanguage(),
                'plugins' : this.getPlugins()
            };
            var func = function (fonts) {
                that.details.fonts = fonts.join(', ');
                typeof done === 'function' && done(that.details);
            }
            this.getFlashFonts(func); 
        },
        log : function () {
            this.getDetail(function (details) {
               _utility.ajax({
                    url : 'http://www.gridsum.com',
                    method : 'post',
                    data : details,
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
					"Verdana", "Wingdings", "Wingdings 2", "Wingdings 3"
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
            } else {
                this.getJSFonts(done);
            }
        }
    };
    
    var tracker = new Tracker();
    tracker.log();
    
    /* _utility.addEvent(window, 'load', function (e) {
        
    }); */
    
    return tracker;
});