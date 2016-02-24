/*

  PluginDetect Javascript Library   http://www.pinlady.net/PluginDetect/

  Copyright (C) 2008-2016, Eric Gerds
  Released under MIT license http://www.pinlady.net/PluginDetect/license/



  Browser Plugin Detection for  QuickTime/Java/DevalVR/Flash/Shockwave/WindowsMediaPlayer/
                                Silverlight/VLC/AdobeReader/PDFReader/PDF.js/RealPlayer/
                                ActiveX


-------------------------------------------------------------------------------------------------


*** List of PUBLIC METHODS for PluginDetect

$.hasMimeType()
$.isMinVersion()
$.getVersion()
$.getInfo()
$.onWindowLoaded()
$.onBeforeInstantiate()
$.onDetectionDone()



---------------------------------------------------------------------------------------

*** List of SEMI-PUBLIC METHODS for PluginDetect
Semi-public methods are only intended to be used by the developer(s) of this script.



[Used to add plugins to the library]
$.addPlugin()

$.ABOUT.getListAllPlugins()
$.ABOUT.getListGetInfoPlugins()

$.win.disable()

[Used to create debug/status messages]
$.message.enable()
$.message.disable()
$.message.removeAll()
$.message.detectCountErr()

$.debug.enable()                   [only call this BEFORE running plugin detection]
$.debug.disable()

$.Plugins.java.verify.enable()    [only call this BEFORE running Java detection]
$.Plugins.java.verify.disable()
$.Plugins.java.getVerifyTagsDefault()
$.Plugins.java.JavaToJsBridge.enable()
$.Plugins.java.JavaToJsBridge.disable()
$.Plugins.java.JsToJavaBridge.enable()
$.Plugins.java.JsToJavaBridge.disable()

$.Plugins.pdfreader.verify.enable()   [only call this BEFORE running PDF detection]
$.Plugins.pdfreader.verify.disable()

$.Plugins.pdfjs.verify.enable()   [only call this BEFORE running PDF detection]
$.Plugins.pdfjs.verify.disable()



--------------------------------------------------------------------------------------------



  BOUNDARY() is a dummy function used to separate code modules.
  The BOUNDARY() function is used by the Script Generator (on the PluginDetect download page)
  to delete/keep portions of the output script, depending on what options the user selects.

  All instances of BOUNDARY("") and BOUNDARY/d*:"" in this script are removed by the
  Script Generator.
  
  Instances of BOUNDARY/d*:"" are used this way (AND MUST ALWAYS BE FOLLOWED BY A COMMA):
      { prop1:val1, BOUNDARY23:"...", prop2:val2, BOUNDARY24:"...", ... }

  Instances of BOUNDARY("") are used in this way (AND MUST NEVER BE PRECEDED OR FOLLOWED
  BY A COMMA):
      func1(); BOUNDARY("..."); var T = 1; BOUNDARY("..."); ...
      

 *** Note: We require a comma "," after BOUNDARY/d*:"" in all cases.
 The reason for this is that all instances of BOUNDARY are removed when the
 customized script is created by the download page.
 
 So, if we had this...
     { a:1, b:2, BOUNDARY22:"1" }
 The BOUNDARY would be removed and we would end up with this...
     { a:1, b:2, }
 This gives us an error, since b:2, has a comma, but there is no property following it.
 
 The solution to this would be to add a dummy property after BOUNDARY, like so...
     { a:1, b:2, BOUNDARY22:"1", z:0 }
 In which case we end up with this...
     { a:1, b:2, z:0 }



 *** Note: We do not allow a comma "," character before or after BOUNDARY("...")
 The reason for this is as follows...
 Some Javascript minifiers, such as Google's closure compiler, can rewrite our Javascript code
 in clever ways. For example, given the following:
      func1(); BOUNDARY("qqq"); return 1;

 The closure compiler may rewrite this code as,
      return func1(), BOUNDARY("qqq"), 1;

 While the code execution order is maintained, you will notice that the BOUNDARY()
 function has moved from the left side of the "return" to the right side.
 The problem we have here is that we use BOUNDARY() to help determine which parts
 of the script to keep/discard. And thus this rewritten code would thus not behave
 correctly anymore.


 => Hence, we choose to avoid BOUNDARY("...") with a comma before/after,
 and we want to always have a comma after BOUNDARY/d*:"..."
 both for the unminified code and the minified code.
 

 - The string associated with BOUNDARY will be evaluated using eval()/new Function(),
 and should evaluate to boolean true or boolean false.
 For example, these are valid...
   BOUNDARY("true")
   BOUNDARY("1")
   BOUNDARY("(1)")
   BOUNDARY("false")
   BOUNDARY("0")
   BOUNDARY("(0)")
   BOUNDARY("window.x")
   BOUNDARY("window.x ? 1 : 0")
   BOUNDARY("(function(){return 1})()")

 The string MUST NOT contain any " or ' characters.
 
 
 *** Update: the Google Closure Compiler is too aggressive in its minification of our source code.
 It does more than remove Javascript comments and replace variable names.
 It actually rewrites code! This behavior can interfere with our intended use of
 BOUNDARY("") and BOUNDARYXX:"" to customize the script. 
   Thus, we cannot use the Google Closure Compiler to minify our Javascript source code.
 Instead we will use the Yui minifier.
   However, AFTER the script has been customized by the Script Generator (ie. after all the
 instances of BOUNDARY are removed from the script), THEN you are free
 to use the Google Closure Compiler to accomplish further minification.


*/
function BOUNDARY(s){
   "use strict";
   if ((/['"]/).test(s))
   {
     alert("Error: BOUNDARY not allowed to contain quotation marks");
   }
}




// ------------------------------------------------------------------------------------------


// Note: all Javascript code appearing before this anonymous (function(){
// is automatically deleted by the PluginDetect download page.
(function(){  // wrapper function

// We use strict mode in the source code to help us find more potential errors.
// It is applied to all code in the wrapper function for development purposes.
//
// Note: we must make this the VERY FIRST item in this function, in order
// for strict mode to be applied. If we precede it with anything else, then strict mode
// will not work. Hence, we cannot use BOUNDARY to remove the "use strict" literal
// on the download page. Instead, the Script Generator will remove it directly
// without the use of BOUNDARY.
//
// Note: the Yui minifier normally just removes this string anyway by default.
//
// Note: if the user selects "debug mode" on the download page, then the Script Generator will
// add the string back into the script.
"use strict";


var $ = {  // Library Base


/*
    firstProperty and lastProperty are used by the Custom Script Generator.

    The format for these properties in an object is as follows:

        { firstProperty:"select.xxx.yyy",...

          script:{ select:{xxx:{yyy:"yyy"}},... },...

          lastProperty:"select.xxx.yyy"
        }
        

    Note that when an object has a script{} property, then it will usually also have
      a firstProperty/lastProperty. firstProperty will be the very first property of that
    object, and lastProperty will be the very last property of that object.
    When script generation is complete, then firstProperty/lastProperty are removed from
    all objects.

*/
firstProperty:"select.always.librarybase",


// [public]
version: "0.9.1",   // version of script

// [public]
name: "PluginDetect", // == script name == object name


BOUNDARY183:"0",    // We always remove this section via the Custom Script Generator



// [** PUBLIC **]
// This object contains general information about this library.
// The object is read by php to help generate web pages.
//
// NOTE: because this object will always be deleted by the ScriptGenerator,
// it is is NOT to be used by the PluginDetect script itself in any way.
//
// NOTE: our php code only reads the first few hundred bytes of this script.
// We do this because it should not be necessary for php to read in the entire script file.
// Hence this object must be within the first few hundred bytes of the beginning of 
// this script. This object must always be located near the very beginning
// of the script.
ABOUT:{

rDate: "01/04/2016",   // release date of the script MM/DD/YYYY

author: "Eric Gerds",

urlHome: "http://www.pinlady.net/PluginDetect/",

urlLicense: "http://www.pinlady.net/PluginDetect/license/",


// Get a list of all the plugin objects in $.Plugins{}.
// Return the result as an array of strings ["plugin1Name", "plugin2Name", ...]
getListAllPlugins: function(){

  $.message.write("{ }", $.message.end());
  $.message.write("{ START $.ABOUT.getListAllPlugins( ) }", $.message.end());

  var pluginName, result=[];

  for (pluginName in $.Plugins)
  {
     if ($.hasOwn($.Plugins, pluginName) &&
        $.Plugins[pluginName] && $.isFunc($.Plugins[pluginName].getVersion))
          result.push(pluginName);
  }

  result.sort();

  $.message.write("{ " + result.length +
    " plugin detectors listed within this library }", $.message.end());

  $.message.write("{ " + result.join(", ") + " }", $.message.end());

  $.message.write("{ END $.ABOUT.getListAllPlugins( ) }", $.message.end());

  return result;

},  // end of getListAllPlugins()


// Get a list of all the plugin objects that have getInfo() method.
// Return the result as an array of strings ["plugin1Name", "plugin2Name", ...]
getListGetInfoPlugins: function(){
  
  $.message.write("{ }", $.message.end());
  $.message.write("{ START $.ABOUT.getListGetInfoPlugins( ) }", $.message.end());

  var pluginName, result=[];

  for (pluginName in $.Plugins)
  {
     if ($.hasOwn($.Plugins, pluginName) &&
       $.Plugins[pluginName] && $.isFunc($.Plugins[pluginName].getVersion) &&
       $.isFunc($.Plugins[pluginName].getInfo))
          result.push(pluginName);
  }

  result.sort();

  $.message.write("{ " + result.length +
    " plugin detectors that contain a getInfo{ } object }", $.message.end());

  $.message.write("{ " + result.join(", ") + " }", $.message.end());

  $.message.write("{ END $.ABOUT.getListGetInfoPlugins( ) }", $.message.end());

  return result;

}  // end of getListGetInfoPlugins()



},  // end of ABOUT{}



// The script{} object is used by the Script Generator to help the user construct a customized script
// on the PluginDetect download page. The script{} object helps to determine whether the
// parent object of script{} should be included/excluded from the custom script.
//
// The user checks/unchecks various checkboxes on the download page to select which features 
// to include/exclude in the customized script.
script:{


/*
     select{} property is mandatory for each script{} object.
     select{} is used to control which sections of code are included/excluded
     in the final custom script on the download page.

     Note: Because this is the very first script{} object in this
     library, and because it is the very first script{} that is processed,
     the order of the select{} properties here will/should determine the order of
     the pluginCheckbox, methodCheckbox, and miscCheckbox properties as they appear
     in the header of the generated (custom) script.
     (not all browsers enumerate an object's properties in the order in which
     they are created. This is merely a convention for many browsers.)

*/
     select:{
        // Note: The property names within pluginCheckbox{}, methodCheckbox{}, miscCheckbox{},
        // xtra{}, always{} should all be lower case.
        pluginCheckbox:{},
        methodCheckbox:{},
        miscCheckbox:{},
        xtra:{},
        
        // Note: always{} is a dummy object. All properties within always{} will automatically
        // be given a value of "true". (ie. select.always.xxx == true)
        always:{librarybase:"librarybase"}
     },
     
     
/*
     target{} is optional.
     target{} allows you to attach the script{} object to another object.
     optional property.

     target:function(){
       return $.betterIE;
     },
*/



/*   labels for various checkboxes ().
     The checkboxLabel{} object is mandatory for all checkboxes.
     Objects not directly associated with a checkbox will not have a label.
     checkboxLabel:{
        pluginCheckbox:{},
        methodCheckbox:{},
        miscCheckbox:{}
     },

     
     

     errCheck{} is optional.
     errCheck can be
        a) a function...
           errCheck:function(code, select){}
        b) an object with properties that are function(s)...
           errCheck:{
               pluginCheckbox:{java:function(code, select){}},
               methodCheckbox:{},
               miscCheckbox:{},
               xtra:{}
           }
     The errCheck function is executed when a particular module has been selected/included
     in the final output script. The purpose if errCheck() is to check the final
     customized code for any particular errors that one might want to look for.
     The errCheck function has 2 input args - errCheck:function(code, select){...}
*/

     errCheck:function(code, select){
        // Note: code.customModuleScript is the code for the custom library base
        if (!select.miscCheckbox.allowactivex &&
             (/\.codebase|\.AXO|\.getAXO|\.ActiveX|ActiveXObject/).test(code.customModuleScript)
           )
              alert("Error: ActiveX code found in " + code.moduleName + " module");

        if (!select.miscCheckbox.showmessage &&
              !select.miscCheckbox.debugmode &&
                 (/alert[\s\n\r]*\(/).test(code.customModuleScript))
              alert("Error: there should be no alert( ) statements in " + code.moduleName + " module");

        if (!select.miscCheckbox.showmessage &&
              !select.miscCheckbox.debugmode &&
                 (/alert[\s\n\r]*\(/).test(code.customScript))
              alert("Error: there should be no alert( ) statements in your script");

     }



/*

     fileNameSuffix{} is used to add suffixes to the filename when you save the generated script
     fileNameSuffix:{
       pluginCheckbox:{}
     },




     include{} is optional.
     include can be 
        a) a function that returns an array of objects.
           include: function(select){return [...]}
        b) an object with properties that are function(s) that return an array of objects.
           include: abc:{xqz:function(select){return [...]}, ...}}

     When the current object (ie. the parent of script{}) is included in the final
     output script, then the include{} array specifies additional objects that must be included.
     The include array lists the dependencies that the current object has.
     The include function has one input arg - include:function(select){...}


*/

},   // end of script{}




/*

 The Allow ActiveX option gives us the ability to include/exclude code for ActiveX
 plugin detection. If you know that your target device/browser has no ActiveX, then you can
 make the script smaller by removing all the ActiveX related detection code.


 - When select.miscCheckbox.allowactivex == false, then for all browsers (including IE)
    $.browser.ActiveXEnabled == undefined
    $.browser.ActiveXFilteringEnabled == undefined

   In this case, the library is intended to only run on non-IE browsers.

   If, by any chance, IE were to run this script for allowactivex==false, then
   the navigator arrays would be checked for plugins, since this does not involve
   running any ActiveX plugin.
     Also, the <applet> tag on IE can run to accomplish Java detection, since that tag does not
   depend on ActiveX.
     We do not use <object>/<embed> tags on IE for plugin detection because those tags use 
   ActiveX to run a plugin.
     We do not use new ActiveXObject("...") because this uses ActiveX to run a plugin.


*/
allowActiveX:{

// This object assists in creating a custom version of the script for the user.
script:{

    select:{miscCheckbox:{allowactivex:"AllowActiveX"}},
    
    fileNameSuffix:function(select){
      return select.miscCheckbox.allowactivex ? "" : "!actvx"
    },
    
    checkboxLabel:{miscCheckbox:{allowactivex:{
      text: function(){return "Allow ActiveX plugin detection.<br>" +
        "If you select this option, then the library is intended for all browsers.<br>" +
        "If you deselect this option, then the library is intended only for " +
        "non-Internet Explorer browsers.";}

    }}}

} // end of script{}


}, // end of allowActiveX{}



BOUNDARY180:"select.miscCheckbox.debugmode",


// [private]
// This module will cause a "debug" checkbox to appear in the menu on the download page.
//
// Note: This object{} is private, and so it is ONLY called from WITHIN this Library.
// Debug mode is off by default, unless the user selects it via the checkbox.
debugmode:{

// We always delete this item, so then the debugmode{} object
// is automatically enabled when it is included in the script.
BOUNDARY0:"0",

isDisabled: 1,

BOUNDARY1:"select.miscCheckbox.debugmode",

script:{
    select:{miscCheckbox:{debugmode:"DebugMode"}},

    fileNameSuffix:"dbug",

    checkboxLabel:{miscCheckbox:{debugmode:{
      text: function(){
        return "Turn on debug mode (<i>for developers only</i>).<br>" +
          "Property $.dbug is set to 1 in the " + $.name + " source code.";
        }

    }}},

    // include:function(select){} tells us which other modules to include when using this module.
    //
    // We force the $.debug{} and $.message{} objects to be included in the script.
    include:function(){
      return [$.debug, $.message];
    }

},

// [public]
init: function(){

  if (!this.isDisabled)
  {
     // Turn on debug mode
     $.dbug=1;

     $.message.write("[ ]", $.message.end());
     $.message.write("[ *** WARNING. DEBUG MODE IS ON. All detection modules for a given plugin will be called during plugin detection. ]", $.message.end());
     $.message.write("[ *** WARNING. This only works if the plugin is set up for debug mode. ]", $.message.end());
  }
}

}, // end of debugmode{}



// The debug{} object allows us to force all/most detection modules within a plugin module
// to run. This is for debugging purposes.
//
// Debug mode is OFF by default. So you will have to turn it on if you want to use it.
//
// The debug{} object is only intended to be used by developers.
// We only use this debug{} object when output messages are shown.
// The debug{} object is automatically included in the output script when
// the message{} object is included.
//
// if $.dbug==1, then debug mode is ON. We run all detection modules within a given plugin
// (for debugging purposes), assuming that plugin is set up for debugging.
// Also, we force NOTF detection to occur if that plugin has NOTF detection module.
// if $.dbug==0 or undefined, then debug mode is OFF.
//
// Note: we have 2 separate modules - debugmode{} and debug{}, but they both deal with
// the debug mode for this Library. We have these 2 separate modules instead of just one
// module, because we want to have debug mode available in 2 different ways...
//   1) When the user selects the debug checkbox on the download page, then debug
//   should be automatically turned on in the custom script. The debugmode{} object
//   will accomplish this.
//   2) When the user selects the show messages checkbox, but not the debug checkbox,
//   then the custom script does not have debug mode automatically turned
//   on. But the user can turn debug mode on/off via scripting
//   ($.debug.enable(), $.debug.disable()).

BOUNDARY181:"select.xtra.debug",

debug: {

  
BOUNDARY0:"0",

// This object assists in creating a custom version of the script for the user.
script:{

    select:{xtra:{debug:"debug"}}

}, // end of script{}

BOUNDARY1:"select.xtra.debug",


// [** PUBLIC **]   $.debug.enable()
// Turn on debug mode.
enable:function(){

  $.dbug=1;
  
  $.message.write("[ ]", $.message.end());
  $.message.write("[ *** WARNING. DEBUG MODE IS ON. All detection modules for a given plugin will be called during plugin detection. ]", $.message.end());
  $.message.write("[ *** WARNING. This only works if the plugin is set up for debug mode. ]", $.message.end());
  $.message.write("[ *** WARNING. Initializing script again. ]", $.message.end());


  // This routine is called EXTERNALLY from this Library ONLY.
  // Hence it is [** PUBLIC **]. It is NOT called from WITHIN this Library.
  // Thus, $.init.library() will already have run when/if this routine is called.
  //
  // Because we also want to be able to debug the code within $.init.library(),
  // we call $.init.library() here.
  //
  // Note: do NOT call this routine from within $.init.library(),
  // because we must avoid infinite recursion.
  $.init.library();

}, // end of enable()

// [** PUBLIC **]   $.debug.disable()
// Turn off debug mode.
disable:function(){

  $.dbug=0;

  $.message.write("[ ]", $.message.end());
  $.message.write("[ *** WARNING. DEBUG MODE IS OFF. ]", $.message.end());


}  // end of disable()

}, // end of debug{}





/*

     This message{} object creates a message box at the top of your web page & prints out messages.
     The messages are used for debugging/development purposes.

     The ScriptGenerator is capable of removing all $.message.write()
     calls within this script. The code in this message object{} assists the
     ScriptGenerator in finding and removing the $.message.write() calls.


*/

BOUNDARY0:"select.miscCheckbox.showmessage",

message:{


BOUNDARY0:"0",  // We always delete this item, so then the message{} object
                // is automatically enabled when it is included in the script.

// [private]
// To enable or disable the $.message.write() method, set isDisabled property.
// == 1 to disable
// == 0/null/""/undefined to enable
isDisabled:1,


// This object assists in creating a custom version of the script for the user.
script:{

    select:{miscCheckbox:{showmessage:"ShowMessage"}},
    
    // If debug mode has been selected, then we do not bother showing the "msg" suffix,
    // because debug mode automatically shows messages anyway.
    fileNameSuffix:function(select){
      return select.miscCheckbox.showmessage && !select.miscCheckbox.debugmode ? "msg" : "";
    },

    checkboxLabel:{miscCheckbox:{showmessage:{
      text: function(){
        return "Show status/error messages (<i>for developers only</i>).<br>" +
        $.name + " will show various status/error messages at the top of your web page.";
      }

    }}},

    // include:function(select){} tells us which other modules to include when using this module.
    //
    // We add $.debug{} here because it can be useful when output messages are shown.
    include:function(){
      return [$.DOM, $.ev, $.win, $.debug];
    }
}, // end of script{}


BOUNDARY1:"select.miscCheckbox.showmessage",


hasRun: 0,

// [private]
// output <div> for messages
div: null,

// null, or number (units of pixels)
divMaxHeight: null,

// [private]
// The message object only outputs messages to the top most window
doc: window.top.document,


// [** PUBLIC **]   $.message.enable()
// Enable the message{} object for writing.
enable: function(divMaxHeight){

  var message=this;

  if ($.isNum(divMaxHeight) && divMaxHeight>0) message.divMaxHeight = divMaxHeight;

  message.isDisabled = 0;

  if (message.div) $.DOM.setStyle(message.div, ["display","block"]);

},

// [** PUBLIC **]   $.message.disable()
// Disable the message{} object for writing.
disable: function(){
  
  var message=this;

  message.isDisabled = 1;
  
  if (message.div) $.DOM.setStyle(message.div, ["display","none"]);

},


// [public]
// We use this routine as an end token to assist us in deleting all
// $.message.write() statments from the script.
// All $.message.write() statements must contain $.message.end() as its last input arg.
//     $.message.write($.message.end());
//     $.message.write("...", $.message.end());
//     $.message.write("...", 0, $.message.end());
//
// The reason for doing this is to be more reliable and safe in removing the messages,
// especially when using a Javascript minifier that can rewrite our code.
end:function(){
  return this;
},

// [private]
// If one or more $.message.write() statements are missing a $.message.end()
// input arg, then we set this property.
endError:0,


// [public]
//
// This routine measures time delays.
// obj is an input object{}
//
// If obj{} is empty, then store an initial date in obj{}.
// If obj{} already has initial date, then return the difference in time 
// between now and the stored date, and add a string for units.
//
// If reset is true, then empty the obj{}, and start all over.
//
// NOTE: this routine can only be called when used WITHIN a $.message.write()
// input argument.
time:function(obj, reset){

  var prop = "date0000", result="";

  if (obj)
  {
    if (!obj[prop] || reset) obj[prop]=new Date();
    else result = (new Date().getTime() - obj[prop].getTime()) + " millisec";
  }

  return result;

},


// [private]
// add <br> to message.div
addBR: function(){
  var message=this;
  if (message.div) message.div.appendChild(message.doc.createElement("br"));
},

// [private]
// add text to message.div
addText: function(text, b, err){

     var message=this, span=null,
       insertNode=message.doc.createTextNode(text);

     if (message.div)
     {
        if (b || err) span = message.doc.createElement("span");
        if (b) $.DOM.setStyle(span, ["fontWeight","bold"]);
        if (err) $.DOM.setStyle(span, ["color","#BB0000"]);
        if (span){
           message.div.appendChild(span);
           span.appendChild(insertNode);
        }
        else{
          message.div.appendChild(insertNode);
        }

     }

},


// [** PUBLIC **]   $.message.removeAll()
// Input S is a string, which contains all of the code for this Library.
// This routine removes all instances of $.message.write() from the string.
// Return {errStr:"error message", generatedScript:"..."}
removeAll: function(S){

   var message=this, keepGoing=1, count=0, count2=0, empty="",
   result={errStr:"", generatedScript:""};
   
   var replace = function()
   {
       count++;
       keepGoing=0;

       S = S.replace(message.RegExp.remove,

       // The function is called with the following m + 3 arguments where m is the number of
       // left capturing parentheses in the regExp. The first argument is the substring that matched.
       // The next m arguments are all of the captures that resulted from the search.
       // Argument m + 2 is the offset within stringObj where the match occurred,
       // and argument m + 3 is stringObj. The result is the string value that results
       // from replacing each matched substring with the corresponding return value
       // of the function call.
       function(match, $1, $2){

            // Note: when a capturing parenthesis does not capture anything, it is possible
            // that the input arg $n will be either "" or undefined (even though RegExp.$n would
            // just be be ""). For this reason, we let $n = $n || "" just to be safe.
            $1 = $1 || empty;
            $2 = $2 || empty;

            count2++;
            keepGoing=1;

            //   {$.message.write(),    Remove this pattern from string, replace with "{"
            //   ,$.message.write(),    Remove this pattern from string, replace with ","
            //   ;$.message.write(),    Remove this pattern from string, replace with ";"
            //   ,$.message.write();    Remove this pattern from string, replace with ";"
            if ($1.indexOf(",")>=0) return $2;
            if ($2.indexOf(",")>=0) return $1;


            //   {$.message.write();    Remove this pattern from string, replace with "{"
            //   }$.message.write();    Remove this pattern from string, replace with "}"
            //   ;$.message.write();    Remove this pattern from string, replace with ";"
            if ($2.indexOf(";")>=0) return $1;


            //   ;$.message.write()}    replace with ";}"
            //   ;$.message.write())    replace with ";)"
            return $1 + $2;

      });

     
   };   // end of replace()


   // We use a loop to remove each $.message() one by one.
   // We wanted to use str.replace(regex, function(){}) with a global regex, but that
   // would not work because we could not explicitly control the index of where each search would
   // begin. After a search, we wanted the index to decrease by 1 (at least),
   // because we want to successive searches to overlap by at least one character.
   // So, we use a regex without the global modifier, and just use a loop.
   // In each loop, the search starts at the beginning of the string.
   //
   // We use count to prevent infinite loop.
   while (keepGoing && count<3000){ replace(); }


 //  alert("count: " + count)
 //  alert(count2 + " instances of $.message removed")

   if (message.RegExp.detectAny.test(S)) result.errStr = "Error!\n" +
        "Unable to remove all the status/error messages from the " + $.name + " script.\n" +
        "Possible bug in this web page or in the " + $.name +  " script itself.";

   result.generatedScript = S;

   return result;

}, // end of removeAll()


// [** PUBLIC **]   $.message.detectCountErr()
// Called by Script Generator.
// Input string S.
// Return "error message" if error, # startTokens != # endTokens
// Return "" if everything is ok, # startTokens == # endTokens
detectCountErr:function(S){

   var message=this, count1, count2;

   if (!$.isString(S)) return "Script Error.\n" + "Input to detectCountErr( ) is not a string";

   // We use the regexes with global modifier to do a global search on S.
   count1 = S.match(message.RegExp.startTokenGlobal);
   count2 = S.match(message.RegExp.endTokenGlobal);

   var errMsg = "Script error.\n" +
    "The number of message.write( ) calls should be the same as the number of message.end( ) calls.";

   if (!count1 && !count2) return "";
   if (count1 && count2) return count1.length == count2.length ? "" : errMsg;

   return errMsg;

}, // end of detectCountErr()


// [private]
RegExp: {  // Regular expressions

  // [public]
  init:function(){

     var reg=this;

     // For message.checkString()
     reg.startToken = new RegExp(reg.startTokenStr);
     reg.startTokenGlobal = new RegExp(reg.startTokenStr, "g");

     reg.endToken = new RegExp(reg.endTokenStr);
     reg.endTokenGlobal = new RegExp(reg.endTokenStr, "g");


     // For message.removeAll()
     //
     reg.remove = new RegExp(

       "(" +    // ($1)
          // First char of match
          "[,\\;\\:\\[\\]\\{\\}\\(\\)]" +  "[\\s\\n\\r]*" +
          "|" +
          "[a-zA-Z\\$\\_\\d\\.]" + "[\\s\\n\\r]+" +
       ")" +


       /// Note:  .*? means non-greedy.
       reg.startTokenStr + "[\\s\\S]*?" + reg.endTokenStr +


       "(" +   // ($2)
                           // Last char of match
          "[\\s\\n\\r]*" + "[,\\;\\:\\[\\]\\{\\}\\(\\)]" +
          "|" +
          "[\\s\\n\\r]+" +  "[a-zA-Z\\$\\_\\d\\.]" +
       ")"

     );

  }, // end of init()



  // [private]
  // This regex detects the START of a $.message.write() statement.
  // This pattern is used to detect the start of the $.message.write() expression, as in...
  //     $.message.write("...", $.message.end());
  // As such, we cannot allow an input string to $.message.write() to contain this pattern.
  //
  // The pattern we search for is as follows...
  startTokenStr: "[a-zA-Z\\$\\_][a-zA-Z\\$\\_\\d\\.]*" +
                 "\\.message\\.write" + "[\\s\\n\\r]*" + "\\(",
  
  // [public]
  // Regex to find the startToken.
  startToken: null,
  
  // [public]
  // Regex to find the startToken, doing a global search
  startTokenGlobal: null,


  // [private]
  // This regex detects the END of a $.message.write() statement.
  // This pattern is used to detect the end of the $.message.write() expression, as in...
  //     $.message.write("...", $.message.end());
  // As such, we cannot allow an input string to $.message.write() to contain this pattern.
  //
  // The pattern we search for is as follows...
  endTokenStr: "[a-zA-Z\\$\\_][a-zA-Z\\$\\_\\d\\.]*" +
               "\\.message\\.end" + "[\\s\\n\\r]*" + "\\(" + "[\\s\\n\\r]*" + "\\)" +
               "[\\s\\n\\r]*" + "\\)",

  
  // [public]
  // Regex to find the endToken.
  endToken: null,
  
    // [public]
  // Regex to find the endToken, doing a global search
  endTokenGlobal: null,


  // [public]
  remove: null,

  // Regular expression to find and remove:
  //    $.message.write();      $.message.write()}
  //    obj.$.message.write();  obj.$.message.write()}
  //
  // from the PluginDetect script. Trailing ";" and "}" are not removed.
  // This is for the ScriptGenerator.
  //
  // Note:  .*? means non-greedy.
  // Note: We use positive lookahead (?=) so as not to include ; or } in the match.
  // Note: We consider the possibility that the user does not remove linebreaks,
  //   and so we look for \n\r also.
  // Note: "." is not a metacharacter inside "[]", so "[.]" is NOT the same as "."
  // Note: "." covers all characters except linebreak, so to match ALL characters we use "[\s\S]"


  // Regular expression to see if all the $.message calls have been removed from the script.
  // This is for the ScriptGenerator.
  detectAny: /\.message\.write|\.message\.end|\.message\.time|\.message\.args2String/

}, // end of RegExp{}



// [private]
checkStringError:0,

// [private]
checkString:function(S){

    var message=this, msg="";

    if (message.RegExp.startToken.test(S) || message.RegExp.endToken.test(S))
    {
        msg = " [ *** ERROR: " +
           "message.write( ) method not allowed to have \"" +
           RegExp.lastMatch +
           "\" within input string ]";

        // We only give this alert once.
        if (!message.checkStringError){
           message.checkStringError=1;
           alert(msg);
        }

        message.addText(msg, 1, 1);
           
    }

},  // end of checkString()


// [private]
// We store messages when message{} object is not enabled for writing.
storage: [],

// [private]
writeOneItem: function(E1){
  
  var message=this, x, tmp, errMsgLen=200;

  for (x=0;x<E1.length;x++){

    if (x==E1.length-1 && !E1[x]){
       message.addBR();
    }

    else if ($.isString(E1[x])){    // if string

       // Change color of message if "*error" or "*warning" occurs
       tmp = (/\*.*error|\*.*warning/i).test(E1[x]);
       message.addText(E1[x], 1, tmp);
       message.checkString(E1[x]);

    }
    else if (E1[x] && E1[x].message) // if error object
    {
       // Note: the following gives an error in IE 7...
       //    tmp = E1[x].name ? (E1[x].name+"").substring(0,errMsgLen) + ": " : "";
       //
       // We avoid the error by using this...
       tmp = E1[x].name && E1[x].name.substring ? E1[x].name.substring(0,errMsgLen) + ": " : "";

       tmp +=  E1[x].message.substring ? E1[x].message.substring(0,errMsgLen) : "";

       message.addText(tmp);
    }

  }


}, // end of writeOneItem()


// [public]
//
// This routine sends status/error messages to the top of the web page.
//
// input E1 can be a string or an error object, or an array of strings & error objects
// input skipBR == true, then no <br> will be added to the message
//
// If message object is not enabled, then we simply save each message input to storage.
// When message object is enabled, we write the contents of storage.
//
// Note: input strings must not have ");" or ")}"
// because we want to be able to easily remove $.message.write() from the PluginDetect script,
// using the ScriptGenerator.
//
// All write() calls are removed from the script by the ScriptGenerator, if the user
// selects that option.
write:function(E1, skipBR, dummy, dummy2){

  // We do not write when the window is unloading.
  if ($.win.unload) return;

  // Note, the last input arg for this routine should ALWAYS be the message{} object.
  // This comes from $.message.end().
  // Hence, E1, skipBR, dummy may all be == message{}.
  // The reason we require this is so we can easily find the beginning and end of
  // a message.write() statement, so that it can be removed from the script when desired.

  var message=this, x, errmsg;

  // Initialize
  if (!message.hasRun){
      message.hasRun = 1;
      message.RegExp.init();
  }


  // Check for errors.
  // If $.message.end() is not an input arg, then we have an error.
  // If $.message.end() is not the last input arg, then we have an error
  if ( (E1 !== message && skipBR !== message && dummy !== message) ||
       (E1 === message && $.isDefined(skipBR)) ||
       (skipBR === message && $.isDefined(dummy)) ||
       (dummy === message && $.isDefined(dummy2))
     ){

      // Note: we do NOT put "$.message.write()" or "$.message.end()"
      // into this string, or we would trigger an error within checkString().
      // Instead we use "message.write()" and "message.end()".
      errmsg =" [ *** ERROR: " +
           "message.write( ) method must have " +
           "message.end( ) as its last input argument ]";

      // We only give this alert once.
      if (!message.endError){
         message.endError=1;
         alert(errmsg);
      }

      if ($.isString(E1)){ E1 += errmsg; }
      else if ($.isArray(E1)){ E1.push(errmsg); }
      else E1=errmsg;

      skipBR=0;
  }


  // if E1 is null, 0, "", undefined, or message{} object then do nothing.
  // Note: we do this AFTER checking for errors, not before. Otherwise we 
  // may miss the opportunity to catch certain errors.
  if (!E1 || E1===message) return;



  if (!$.isArray(E1)) E1 = [E1];
  E1.push(skipBR && skipBR!==message ? 1 : 0);


  if (message.isDisabled)
  {
      message.storage.push(E1); // save messages when not enabled
      return;
  }


  message.initDiv();


  // If storage has items, then we display the entire contents of storage.
  // We also add the current input E1 to storage.
  if (message.storage.length)
  {
        message.storage.push(E1);
        
        for (x=0;x<message.storage.length;x++){
           message.writeOneItem(message.storage[x]);
           message.storage[x]=0;  // Empty the storage
        }

        message.storage = [];
        return;
  }


  message.writeOneItem(E1);


  // Set a vertical scrollbar for message <div> when height > message.divMaxHeight
  if (message.divMaxHeight && message.div &&
      $.isNum(message.divMaxHeight) && message.divMaxHeight>0)
  {
    if (
      ($.isNum(message.div.scrollHeight) && message.div.scrollHeight > message.divMaxHeight) ||
      ($.isNum(message.div.offsetHeight) && message.div.offsetHeight > message.divMaxHeight)
    ){

       $.DOM.setStyle(message.div, ["overflowY","auto", "height", message.divMaxHeight + "px"]);
       message.divMaxHeight = null;

     }

  }


},  // end of write()


// [private]
// Initialize the message <div>
initDiv:function(){

  var message=this;

  if (!message.div && !message.isDisabled)
  {
     message.div = message.doc.createElement("div");

     $.DOM.setStyle(message.div,
         ["color","black", "border","solid blue 2px",
          "padding","5px", "width","98%", "fontSize","18px",
          "margin","5px", "backgroundColor","#B3AAAA"
          ]
     );

     // Insert div into window.top.document.body
     $.DOM.insertDivInBody(message.div, 1);

     message.addText("This box displays STATUS/ERROR messages for " + $.name + " v" + $.version, 1);
     message.addBR();
     message.addText("This box is visible when you select the \"Show status/error messages\" option in the " + $.name + " download page.", 1);
     message.addBR();
     message.addBR();
     
     // Cleanup routine when window unloads
     $.ev.fPush([message.onUnload, message], $.win.unloadHndlrs);

  }

},  // end of initDiv()


// [private]
// ** EVENT HANDLER **
//
// Clean up message{} when window unloads.
// This helps to prevent memory leaks.
// We avoid the 'this' keyword, so we have $, message as input.
onUnload:function($, message){

   // We remove all links between Javascript objects and DOM nodes, if possible
   // to reduce memory leaks.

   var x;
   
   message.disable();

   $.DOM.emptyNode(message.div);
   $.DOM.removeNode(message.div);


   // If storage has items, then empty the storage
   if (message.storage && message.storage.length)
   {
       for (x=0;x<message.storage.length;x++){
           message.storage[x]=0;
       }
   }

   message.div = null;
   message.storage = [];


}, // end of onUnload()



// [public]
//
// Given input array [A, B, C, ...], return a string "A, B, C, ..."
// We use this routine to convert PluginDetect input arguments to a string.
//
// If you want to process MULTIPLE input arguments, then use:
//      $.message.args2String([A, B, C, D, ...])
// If you want to process a SINGLE input argument, and that single arg might be an array,
// then use this:
//      $.message.args2String([A])
// If you want to process a SINGLE input argument, and you know that it is not an array,
// then you can use this if you wish:
//      $.message.args2String(A)
//
//
// NOTE: this routine can only be called when used WITHIN a $.message.write()
// input argument. For example:
//      $.message.write( $.message.args2String("...") );
// The reason for this limitation is because the ScriptGenerator only removes
// $.message.[write or init], and we NEED to use this routine within a write()
// input argument.
args2String: function(args){

  var message=this, x, out=[];

  if ($.isDefined(args)){
     if (!$.isArray(args)) args=[args];

     for (x=0;x<args.length;x++){
        if ($.isString(args[x])) out[x] = "\"" + args[x] + "\"";
        else if (args[x]===null) out[x] = "null";
        else if ($.isFunc(args[x])){
           // Note: .*? means non-greedy
           if ((/(function[^\(]*?\()/i).test(args[x].toString()) &&
              (RegExp.$1).length<100 ) out[x] =  RegExp.$1 + " ){ }";
           else out[x] = "function F( ){ }";
        }
        else if ($.isArray(args[x])) out[x] = "[" + message.args2String(args[x]) + "]";
        else if ($.isNum(args[x])) out[x] = args[x].toString();
        else if (!$.isDefined(args[x])) break;
        else if (args[x] && args[x]!==true && args[x].toString) out[x] = "object{ }";
        else if (args[x]===true || args[x]===false) out[x] = args[x] + "";
        else out[x] = "???";
     }
  }
  return out.length ? out.join(", ") : "";


}  // end of args2String()


},  // end of message{} object



BOUNDARY1:"1",



// [public]
/*

 Add a plugin detection object to the Library.

 obj is an object that has code to detect one specific plugin.
     obj = { getVersion:function(){...} }
 obj must always have a getVersion() method.


 As an example, we show the recommended manner in which to add a plugin detection module
 to this Library...

    (function($){

       var pluginObj = {
         getVersion(){...}
         ...
       };

       $.addPlugin("pluginName", pluginObj)

    })(PluginDetect);

 
 As a general rule, pluginObj.getVersion() will detect the plugin, and then store the detection
 results in pluginObj.version and pluginObj.installed.
 The following pluginObj properties are reserved for use during/after plugin detection:
 
    pluginObj.version
    pluginObj.installed
    pluginObj.version0
    pluginObj.getVersionDone
    pluginObj.pluginName


 And then, your plugin detection may be performed as follows...
    var version = PluginDetect.getVersion("pluginName");
    var status = PluginDetect.isMinVersion("pluginName", "minVersion");


*/
//
//  @name is a string, which will be the name of the plugin, as in PluginDetect.getVersion(name)
//  @name is converted to lowercase, and spaces are removed.
addPlugin: function(name, obj){

  $.message.write($.message.time($.addPlugin,1), $.message.end());

  if (name && $.isString(name) && obj && $.isFunc(obj.getVersion))
  {
     // *** NAME MUST ALWAYS BE CONVERTED TO LOWERCASE().
     name = name.replace(/\s/g, "").toLowerCase();

     $.message.write("[ ]", $.message.end());
     $.message.write("[ START add plugin \"" + name + "\" ]", $.message.end());


     $.Plugins[name] = obj;


     if (!$.isDefined(obj.getVersionDone))
     {
        $.message.write("[ Initializing detection for plugin \"" + name + "\" ... ", 1,
           $.message.end());

        // These plugin properties hold the plugin detection results, to
        // speed up future plugin detection requests

        obj.installed = null;             // null, -1, 0, 1

        // obj.version is the version for a plugin that is installed and enabled.
        obj.version = null;               // null, number

        // obj.version0 is the version for a plugin that is installed, and enabled or disabled.
        obj.version0 = null;              // null, number

        obj.getVersionDone = null;        // null, 0, 1

        obj.pluginName = name;


        $.message.write(" ]", $.message.end());

     }


     $.message.write("[ END add plugin \"" + name + "\" in " + $.message.time($.addPlugin) + " ]", $.message.end());
  }

}, // end of addPlugin()


// Return a name that you can use to add to an object
// ie. obj[$.uniqueName()] = {};
uniqueName:function(){
  return $.name + "998";
},


// [private]
// When this script is inline in a web page, we still want the web page to pass HTML validation.
// Thus we break up any HTML end tags (like </object>) so the HTML parser does not see those
// tags in any Javascript strings.
// Instead of "</object>" we can use $.openTag + "/object>".
//
// As mentioned in the HTML 4 Recommendation's note about specifying non-HTML data in 
// element content, end tags are recognized within <script> elements, but other kinds
// of markup--such as start tags and comments--are not.
//
openTag:"<",


// [private]
// The advantage here is that we do not depend on Object, in case
// window.Object was modified.
hasOwnPROP: ({}).constructor.prototype.hasOwnProperty,


// [public]
//
// Tells us if obj has its own property (that was not inherited from the prototype chain).
// We use this when we have 
//   for (x in obj){
//     if ($.hasOwn(obj, x)){...}
//   }
//
// We can use...
// 1) var e,r;try{r=Object.prototype.hasOwnProperty.call(obj,prop)}catch(e){};return !!r;
// 2) return typeof obj!=='undefined' && obj!==null && Object.prototype.hasOwnProperty.call(obj, prop);
hasOwn: function(obj, prop){

   var r;
  
   // If obj is undefined, then Object.prototype.hasOwnProperty.call() gives error.
   // If obj===null, then Object.prototype.hasOwnProperty.call() gives error.
   try{r=$.hasOwnPROP.call(obj,prop);}
   catch(e){}
  
   return !!r;
},


// [private]
// Regexes used to detect object types.
// We do NOT use "g" modifier, so that the search
// always starts at beginning of string.
rgx:{ str:/string/i, num:/number/i, 
      fun:/function/i, arr:/array/i
},

// [private]
// The advantage here is that we do not depend on Object, in case
// window.Object was modified.
//
// According to ECMA-262 specs, we can get the
// value of an internal [[Class]] property for Object by using
// Object.prototype.toString. The "this" will point to Object.
// We override "this" and make it point to "obj" by using call(obj).
// Object.prototype.toString.call(obj)
//
// This technique works in IE 5.5+, Firefox 1+, Opera 6+, iPad, Konqueror
//
// Firefox:
// Object.prototype.toString.call(null): [object Null]
// Object.prototype.toString.call( ): [object Undefined]
// Object.prototype.toString.call(0): [object Number]
// Object.prototype.toString.call(''): [object String]
//
// IE:
// Object.prototype.toString.call(null): [object Object]
// Object.prototype.toString.call( ): [object Object]
// bject.prototype.toString.call(0): [object Number]
// Object.prototype.toString.call(''): [object String]
//
// Object.prototype.toString.call([ ]): [object Array]
// Object.prototype.toString.call({ }): [object Object]
// Object.prototype.toString.call(new Date()): [object Date]
// Object.prototype.toString.call(new Error()): [object Error]
// Object.prototype.toString.call(function(){}): [object Function]
//
toString: ({}).constructor.prototype.toString,



// [public]
//
// Apparently, the only real legitimate use for "typeof" is to tell when something
// is defined or not. So, we can use typeof a!="undefined"  OR  a!==this.undefined.
//
// Potential problem here with $.isDefined(). Say we have obj = instantiated plugin object.
// And say that obj.method() is a method of that plugin.
// Often times in IE, typeof obj.method == "unknown"
//  so that $.isDefined(obj.method) gives an error because we are unable to
//  pass an unknown as an input argument. Hence we want to avoid that situation
//  by simply testing obj.method() directly to see if there is a result.
//
isDefined:function(a){return typeof a != "undefined";},

// [public]
// Works for a==[] and a==new Array([])
// Note: typeof returns "object" instead of "array"
isArray:function(a){

   // return (a && a.constructor===Array)
   // a.constructor does not work across frames.
   // If a was created in a frame that is different from the frame in which this routine
   // is running, then we will not get the correct result.
   // See:
   // http://perfectionkills.com/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/

   // To get around this cross frames problem, we use...
   
   return $.rgx.arr.test($.toString.call(a));


},

// [public]
// Works for a=="" and a==new String("")
// Note: typeof does not work for new String(), so we use this instead.
isString:function(a){
   return $.rgx.str.test($.toString.call(a));
},

// [public]
// Works for a==1.3 and a==new Number(1.3)
// Note: typeof does not work for new Number(), so we use this instead.
isNum:function(a){
   return $.rgx.num.test($.toString.call(a));
},

// [public]
// Check if input is a string containing a number
isStrNum: function(a){
   return $.isString(a) && (/\d/).test(a);
},


// [public]
// Works for a==function(){} and a==new Function()
// Note: typeof does not work for new Function(), so we use this instead.
// Note: For IE 8, $.isFunc(document.createElement('a').toString) returns false, 
//   when it should be true.
isFunc:function(a){
   return $.rgx.fun.test($.toString.call(a));
},



// [private]
// Regular expressions used for processing numbers in PluginDetect
// The tokens used to separate digits in a string are assumed here to be "._,-"
//
// Whenever a token "._,-" in a number string is replaced, it is replaced by ","
getNumRegx: /[\d][\d\.\_,\-]*/,  // regex to find a number embedded in a string
splitNumRegx: /[\.\_,\-]/g,      // regex to split by tokens/replace tokens in a number string


// [private]
// Extract a number x.y.z from input string A
// We assume that the input string only contains a SINGLE number, NOT a
// range like 123 - 234. Usually, the number is of the form 1.4.2_03
// However, I have seen In Konqueror (Linux) where BlackDown Java gives
// it's Java version as 1.4.2-03
//
// We include an override input to change the regular expression if needed.
// We return null if there is no number.
//
// @A is a string within which we try to find a number
// @override is optional input string
getNum: function(A, override){

    var m = $.isStrNum(A) ?
         (override && $.isString(override) ? new RegExp(override) : $.getNumRegx).exec(A) :
            null;

    return m ? m[0] //m[0].replace($.splitNumRegx, ",")
         : null;

},

// [private]
// Input 2 string numbers "a1,b1,c1,d1" and "a2,b2,c2,d2"
// If num1 > num2 then return +1
// If num1 < num2 then return -1
// if num1 = num2 then return 0
// If num1 or num2 do not contain a number, then return 0
//
//
// Note: for the parseInt() method we must specify base 10, because some
// input strings may have leading 0's - ie. "08", etc... that otherwise
// would be interpreted as Base 8 (OCTAL) instead of base 10.
//
// If the 2 input numbers have a different number of digits, then we
// do not assume that the shorter number has zeros 
//  ie. 1,5 <> 1,5,0,0
// Instead, we assume that 1,5 = 1,5,A,B where A and B are unknown
//
// Hence if num1=1,5 and num2=1,5,1,0 then we return 0
compareNums: function(num1, num2, plugin){

var m1, m2, x, p = parseInt;

if ($.isStrNum(num1) && $.isStrNum(num2)){

    // If the plugin has it's own compareNums() method, then use that instead
    if ($.isDefined(plugin) && plugin.compareNums)
       return plugin.compareNums(num1, num2);

    m1 = num1.split($.splitNumRegx); m2 = num2.split($.splitNumRegx);

    for (x=0;x<Math.min(m1.length, m2.length);x++){
       if (p(m1[x],10) > p(m2[x],10)) return 1;    // num1 > num2
       if (p(m1[x],10) < p(m2[x],10)) return -1;    // num1 < num2
    }

}

return 0;  // num1 = num2, or one of the input nums is not a string number

},


// [private]
// Get rid of spaces, make sure a "," between every digit
// Make sure there are 4 digits, and get rid of leading zeros.
// num = input string number
// clip = 1, 2, 3 or 4
//   If clip = 4, then all 4 digits are allowed
//   If clip = 3, then first 3 digits are allowed, 4th digit is 0
//   If clip = 2, then first 2 digits are allowed, 3rd & 4th are 0
//   If clip = 1, then first 1 digit is allowed, 2nd & 3rd & 4th are 0
formatNum: function(num, clip){

   var x, n;

   if (!$.isStrNum(num)) return null;

   if (!$.isNum(clip)) clip=4;
   clip--;

   n = num.replace(/\s/g,"").split($.splitNumRegx).concat(["0","0","0","0"]);


   for (x=0;x<4;x++)
   {
     // We get rid of any leading zeros when detected.
     // ie.. 00001->1, 0000->0, 008a->8a, etc...
     if (/^(0+)(.+)$/.test(n[x])) n[x] = RegExp.$2;
     
     // clip digits if needed
     // or if number is missing, then set to 0
     if (x>clip || !(/\d/).test(n[x])) n[x]="0";
   }

   return n.slice(0,4).join(",");

},



/*

The methods in this BOUNDARY section are only included in the generated script if
any of the public methods shown by select.methodCheckbox in the download page are selected.

If one or more of these public methods are selected, then this should mean that
$.Plugins{} contains one or more objects. If no public methods are selected,
then $.Plugins is empty and/or no plugin detection is being performed.

The methods in this BOUNDARY section are only called by these public methods,
or from within $.Plugins{}, or from within $.codebase{}.


*/

BOUNDARY40:"select.xtra.pd",


// This object is only included when plugin detection is being done
pd:{


// Property is automatically removed by Script Generator
firstProperty:"select.xtra.pd",

  
BOUNDARY0:"0",

// This object assists in creating a custom version of the script for the user.
script:{
  
    select:{xtra:{pd:"pd"}},

    errCheck:function(code, select){
        if (!select.miscCheckbox.allowactivex &&
             (/\.codebase|\.AXO|\.getAXO|\.ActiveX|ActiveXObject/).test(code.customModuleScript)
           )
              alert("Error: ActiveX code found in " + code.moduleName + " module");
    }

}, // end of script{}

BOUNDARY1:"select.xtra.pd",


// [public]
// Get the property of an object.
//
// Plugin objects are not 100% reliable, so it is best to use a try-catch
// when interacting with the HTML tag that is instantiating a plugin.
//
// In some rare cases, we can get typeof obj[propName] == "unknown".
// This can happen in IE when dealing with an ActiveX object.
//
// Ex1.   typeof new ActiveXObject('Msxml2.XMLHTTP').abort == "unknown"
//
// Ex2. Given getJavaInfo.jar, which has a getVersion() method
//        typeof applet.getVersion == "unknown"
//
// Input "obj" is an object, usually an HTML tag that possibly instantiates a plugin.
// Input "propName" is a string.
// Input "value" is optional. If input value is given a value, then it will be
// the default return value.
//
// We do not want this method name to be mistaken for any other Javascript code
// in this script, hence we capitalize some of the letters.
getPROP: function(obj, propName, value){

  try{ if (obj) value = obj[propName]; }
  catch(e)
  {
     // Save error object to $.pd.errObj.
     this.errObj = e;

    $.message.write("[ WARNING: Accessing object[\"" + propName + "\"] causes an error. ]", 
      $.message.end());
  }

  return value;

},

// [public]
// Search the navigator.plugins[] array for a given plugin. Return the plugins object.
//
//
// ----------
// https://developer.mozilla.org/en-US/docs/Web/API/NavigatorPlugins.plugins
// In Firefox 29 and later, enumeration of the navigator.plugins[] array
// (and the navigator.mimeTypes[] array) may be restricted as a privacy measure.
// Applications that must check for the presence of a browser plugin
// should query navigator.plugins[] or navigator.mimeTypes[] by exact name instead of
// enumerating the navigator.plugins[] array and comparing every plugin's name.
// This privacy change does not disable any plugins; it just hides some plugin names
// from enumeration.
//
// For Firefox 29, the policy of which plugin names are uncloaked can be changed in the
// about:config pref "plugins.enumerable_names". The pref's value is a
// comma-separated list of plugin name prefixes (so the "QuickTime" prefix
// will match both "QuickTime Plug-in 7.7" and "QuickTime Plug-in 7.7.3").
// The default pref cloaks all plugin names except Flash, Shockwave
// (Director), Java, and QuickTime. To cloak *all* plugin names, set the
// pref to the empty string "". To cloak *no* plugin names, set the pref to
// magic value "*".
//
// Also see Bug 938885 - Fix plugincheck to not use plugin enumeration
// https://bugzilla.mozilla.org/show_bug.cgi?id=938885
// ----------
//
//
// We have several different methods to accomplish this search.
//    1) We look at navigator.mimeTypes["..."].enabledPlugin
//    2) We can perform a search using navigator.plugins["plugin name"]
//    3) We can do a brute force search thru navigator.plugins[i] by enumerating
//    all the items in the array. THERE IS NO GUARANTEE THAT THE BROWSER WILL
//    ALLOW US TO ENUMERATE ALL ITEMS in the array (due to security/privacy concerns),
//    but we try anyway.
//
//
//
// The IE browser traditionally never had anything in the navigator.plugins[] array.
// However, in IE 11/Win 8.1, I have seen some entries in the navigator.mimeTypes[]
// and navigator.plugins[] array. So, for IE 11+, it is possible for that browser
// to have items in the mimTypes[] and plugins[] arrays.
//
//
// Input to this routine is an object Q{}, with the following properties...
//
// Q.find is a {regex object OR regex string} that defines the plugin we are looking for.
// Q.find only needs to be present in EITHER plugin.name OR plugin.description in order
// to get a match.
// Q.find is mandatory.
//
// Q.find2 is a {regex object OR regex string} that defines the plugin we are looking for.
// Q.find2 only needs to be present in EITHER plugin.name OR plugin.description in order
// to get a match.
// Q.find2 is optional.
// Q.find2 can also be "", 0, null.
//
// Q.find2 complements the use of Q.find in order to refine the search.
// Q.find2 will only be used when Q.find has been defined.
// If Q.find matches plugin.name and Q.find2 matches plugin.description, then plugin has been found.
// If Q.find matches plugin.description and Q.find2 matches plugin.name, then plugin has been found.
// If Q.find gets a match, but Q.find2 does not get a match, then plugin not found.
//
//
// Q.avoid is a {regex object OR regex string} that tells us what string to avoid when looking for Q.find.
// We want Q.avoid to not be present in BOTH plugin.name and plugin.description,
//   because we are trying to filter out any 3rd party plugins that try to mimic other plugins.
// (The worst offender is the Totem plugin under Linux)
// Q.avoid is optional.
// Q.avoid can also be "", 0, null.
//
// If Q.num evaluates to boolean true, then the search will REQUIRE
//   a number BEFORE OR AFTER the Q.find match.
// Else do not look for a number before/after the Q.find match.
//
// Q.mimes is string/array of strings. Contains mimetypes that can be used to find
// the needed navigator.plugins[] object. If Q.mimes is defined, then we look for 
// navigator.mimeTypes[Q.mimes].enabledPlugin.(name/description)
//
// If Q.plugins evaluates to boolean true, then we do a brute force search by
// trying to ennumerate all items in the navigator.plugins[i] array.
//
// If Q.plugins is a string, then we also search using navigator.plugins[Q.plugins].
//
// If Q.plugins is an array of strings, then we search using navigator.plugins[Q.plugins[i]].
//
//
// if Q.dbug is defined, then simply return Q.dbug.
// This is for debugging / testing purposes.
//
// Q:{find:, avoid:, num:, mimes:, plugins:, dbug:}
findNavPlugin: function(Q){

  // For debugging purposes
  if (Q.dbug) return Q.dbug;
  
  var result=null;

  // *** We have to consider the navigator{} object to be hostile territory.
  // The behavior of the navigator{} object is not standardized.
  // Instead, its behaviour appears to be merely convention.
  // For this reason, we try to be conservative in how we handle this.
  // Also, this routine does not try to filter out any specific browser, it merely
  // uses object/feature detection.

  // We do not even assume that the navigator object exists, so we test for it.
  if (window.navigator)
  {
      var regex = { Find: $.isString(Q.find) ? new RegExp(Q.find, "i") : Q.find,
                  Find2: $.isString(Q.find2) ? new RegExp(Q.find2, "i") : Q.find2,
                  Avoid: Q.avoid ? ($.isString(Q.avoid) ? new RegExp(Q.avoid, "i") : Q.avoid) : 0,
                  Num: Q.num ? /\d/ : 0
                },
        i, obj, tmp, mimes, names,
        
        // Maybe a small speed advantage here, by saving these objects
        length, navigatorMimeTypes = navigator.mimeTypes, navigatorPlugins = navigator.plugins;


      // Look at mimeTypes navigator.mimeTypes[mimes].enabledPlugin to get the plugin object.
      //
      // We check for the existence of navigator.mimeTypes, but we do NOT
      // bother to check for navigator.mimeTypes.length. The reason we do not
      // look at the length is that it may theoretically be possible that 
      // navigator.mimeTypes.length===0, yet navigator.mimeTypes["..."] could still 
      // return a value. It may be possible that the browser hides the number of 
      // mimetypes it has, since it may not enumerate all mimetypes
      // (for security/privacy reasons).
      if (Q.mimes && navigatorMimeTypes)
      {
         // copy to a new array, to protect the original from alteration.
         mimes = $.isArray(Q.mimes) ? [].concat(Q.mimes) : ($.isString(Q.mimes) ? [Q.mimes] : []);

         for (i=0;i<mimes.length;i++)
         {
            obj=0;
            // We use try-catch here because we no longer assume that
            // navigator.mimeTypes["..."] is safe to use.
            try{if ($.isString(mimes[i]) && /[^\s]/.test(mimes[i]))
                 obj = navigatorMimeTypes[mimes[i]].enabledPlugin;}
            catch(e){}

            if (obj)
            {
               tmp = this.findNavPlugin_(obj, regex);
               if (tmp.obj) result = tmp.obj;

               $.message.write(tmp.obj ? "[ Found navigator.mimeTypes[\"" +
                     mimes[i] + "\"].enabledPlugin.name == \"" + tmp.obj.name + "\" ]" : 0, $.message.end());
               $.message.write(tmp.obj ? "[ Found navigator.mimeTypes[\"" +
                     mimes[i] + "\"].enabledPlugin.description == \"" + tmp.obj.description + "\" ]" : 0, $.message.end());

               if (result && !$.dbug) return result;
            }


         }  // end of loop

      }


      // If navigator.mimeTypes[mimes[i]].enabledPlugin does not find what we are
      // looking for, then there could be a few reasons for that:
      //
      // 1) There may be more than one instance of mimes[i] in the navigator.mimeTypes[]
      // array, but navigator.mimeTypes[mimes[i]] only points to ONE of those instances.
      // [The instance NOT being pointed to may be the one you are looking for].
      // In other words, there are 2 different plugins with the same mimetype,
      // which could lead to mimetype hijacking.]
      //
      // 2) Perhaps the browser does not allow us to query the navigator.mimeTypes[] array.
      //
      // 3) The plugin we are looking for is not installed.


      // Try to query the navigator.plugins[] array.
      //
      // We check for the existence of navigator.plugins, but we do NOT
      // bother to check for navigator.plugins.length. The reason we do not
      // look at the length is that it may theoretically be possible that 
      // navigator.plugins.length===0, yet navigator.plugins["..."] could still
      // return a value. It may be possible that the browser hides the number of 
      // plugins it has, since it may not enumerate all plugins
      // (for security/privacy reasons).
      if (Q.plugins && navigatorPlugins)
      {

         // We query navigator.plugins["plugin name"]
         //
         // copy to a new array, to protect the original from alteration.
         names = $.isArray(Q.plugins) ? [].concat(Q.plugins) : ($.isString(Q.plugins) ? [Q.plugins] : []);
         for (i=0;i<names.length;i++)
         {
            obj=0;
            // We use try-catch here because we no longer assume that
            // navigator.plugins["..."] is safe to use.
            try{if (names[i] && $.isString(names[i])) obj = navigatorPlugins[names[i]];}
            catch(e){}

            if (obj)
            {
               tmp = this.findNavPlugin_(obj, regex);
               if (tmp.obj) result = tmp.obj;

               $.message.write(tmp.obj ? "[ Found navigator.plugins[\"" + names[i] +
                     "\"].name == \"" + tmp.obj.name + "\" ]" : 0, $.message.end());
               $.message.write(tmp.obj ? "[ Found navigator.plugins[\"" + names[i] +
                     "\"].description == \"" + tmp.obj.description + "\" ]" : 0, $.message.end());

               if (result && !$.dbug) return result;
            }
         }


         // If we still have not found what we want, then we try via enumeration of
         // the navigator.plugins[] array.
         // If the browser does not enumerate all plugins, then it is probably preventing
         // some or all plugins from being enumerated due to privacy reasons.
         //
         // We are being conservative in checking that .length is an actual number.
         //
         // This last loop is probably the slowest, because we are enumerating ALL
         // items in the plugins array.
         length = navigatorPlugins.length;  // We speed up loop by using length=
         if ($.isNum(length))
         {
            for(i=0;i<length;i++)
            {
               obj=0;
               // We use try-catch here because we no longer assume that
               // navigator.plugins[i] is safe to use.
               try{obj = navigatorPlugins[i];}
               catch(e){}

               if (obj)
               {
                  tmp = this.findNavPlugin_(obj, regex);
                  if (tmp.obj) result = tmp.obj;

                  $.message.write(tmp.obj ? "[ Found navigator.plugins[" + i + "].name == \"" +
                      tmp.obj.name + "\" ]" : 0, $.message.end());
                  $.message.write(tmp.obj ? "[ Found navigator.plugins[" + i + "].description == \"" +
                      tmp.obj.description + "\" ]" : 0, $.message.end());

                  if (result && !$.dbug) return result;
               }
            }
         }
      }
  }

  return result;

},  // end of findNavPlugin()

// [private]
findNavPlugin_: function(pluginObj, regex){

  var description = pluginObj.description || "",
      name = pluginObj.name || "",
      result={};

  if (   ( // See if plugin description matches Find
           regex.Find.test(description) &&

           // See if plugin name matches Find2
           (!regex.Find2 || regex.Find2.test(name)) &&

           // We look for a number either before or after the regex match
           (!regex.Num || regex.Num.test(RegExp.leftContext + RegExp.rightContext))

         ) ||

         ( // See if plugin name matches Find
           regex.Find.test(name) &&

           // See if plugin description matches Find2
           (!regex.Find2 || regex.Find2.test(description)) &&

           // We look for a number either before or after the regex match
           (!regex.Num || regex.Num.test(RegExp.leftContext + RegExp.rightContext))

         )

     )

         // Make sure that plugin description/name does not match avoidStr.
         // Note, we cannot use .test(description+name) because of the chance
         // that the combined string would inadvertantly create a match.
         // So, we must test description and name separately.
         if ( !regex.Avoid || !(regex.Avoid.test(description) || regex.Avoid.test(name)) )

                  result.obj = pluginObj;

  return result;

},  // end of findNavPlugin_()



// [public]
// this is the default value of the delimiter used by $.getVersion()
getVersionDelimiter: ",",

// [public]
// Find the plugin object within $.Plugins{} that corresponds to the input "pluginName".
//
//  This routine is used by:
//    $.getVersion(), $.isMinVersion(), $.onDetectionDone(), $.getInfo(), $.onBeforeInstantiate()
findPlugin: function(pluginName){

  var plugin, result={status:-3, plugin:0};


  if (!$.isString(pluginName)){ // bad input argument
      $.message.write("[ ***** ERROR ***** Bad input argument. Plugin name should be a string. ]",
         $.message.end());
      return result;
  }


  // If we have a command like PluginDetect.getVersion(A) where A is a string of length == 1,
  // then we interpret that to mean the user is inputting the getVersionDelimiter.
  if (pluginName.length==1){this.getVersionDelimiter=pluginName; return result;}

  pluginName = pluginName.toLowerCase().replace(/\s/g,"");

  plugin = $.Plugins[pluginName];   // Look for plugin in the Plugins object

  if (!plugin || !plugin.getVersion){  // error if unrecognized plugin
     $.message.write("[ ***** ERROR ***** Bad input argument. Unrecognized plugin name: " +
       $.message.args2String(pluginName) + " ]", $.message.end());
     return result;
  
  }


  result.plugin = plugin;    // reference to current plugin being detected

  result.status=1;

  return result;

},   // end of findPlugin()

// Property is automatically removed by Script Generator
lastProperty:"select.xtra.pd"

},  // end of pd{}


BOUNDARY41:"0",  // We always delete this item


getPluginFileVersion_:{


// This object assists in creating a custom version of the script for the user.
script:{

    select:{xtra:{getPluginFileVersion:"getPluginFileVersion"}},

    target:function(){
       return $.getPluginFileVersion;
    },

    errCheck:function(code, select){
        if (!select.miscCheckbox.allowactivex &&
             (/\.codebase|\.AXO|\.getAXO|\.ActiveX|ActiveXObject/).test(code.customModuleScript)
           )
              alert("Error: ActiveX code found in " + code.moduleName + " module");
    }

} // end of script{}

}, // end of getPluginFileVersion_


BOUNDARY42:"select.xtra.getPluginFileVersion",

// [private]
// Get the version of the actual plugin file.
// navigator.plugins[i].filename is name of the actual plugin file, and the version of
// this file is given by navigator.plugins[i].version.
//
// This new source of info is available in Firefox 3.6+
// This is a NEW method of plugin detection, and therefore CAUTION is advised.
// We will perform certain check(s) on the result to make sure that everything is ok.
//
// UPDATE: the Microsoft Edge browser also appears to show info for 
// navigator.plugins[i].filename and navigator.plugins[i].version.
//
// @plugin is a navigator.plugins[i] object.
// @version is the plugin version acquired by other
//     means (plugin.name, plugin.description, etc...).
// @regex is optional input regex string, it overrides the default regex used for detecting 
//   a number within a string.
// @propName is optional input string, it opverrides the default value of "version".
//
// This routine will return either version, or fileVersion.
// Quite often, fileVersion will have more digits than version.
//
// The return value is NOT going to be formatted by this routine.
// This way, you will be able to see what the true precision of the detected version number is.
// [Formatting may add 0's to the version, which would hide the true precision
// of the detection result.]
getPluginFileVersion: function(plugin, version, regex, propName){

     var fileVersion, tmp, tmpFV, x, index=-1;

     // $.OS==1 (Windows), $.OS==2 (Mac)
     // Plugin File versions only available for Windows and Mac.
     // Linux does not seem to have versions for plugin files.
     // However, we do NOT filter based on OS, since OS detection comes from
     // navigator.userAgent, and that is unreliable.
     //
     if (!plugin) return version;
     
     propName = propName || "version";

     // Get value for fileVersion
     if (plugin[propName]) fileVersion = $.getNum(plugin[propName] + "", regex);


     $.message.write("[ ]", $.message.end());

     $.message.write(plugin[propName] && plugin.name ?
        "[ Found navigator.plugins[i].name: \"" + plugin.name + "\" ]" : 0, $.message.end());
     $.message.write(plugin[propName] && plugin.description ?
        "[ Found navigator.plugins[i].description: \"" + plugin.description + "\" ]" : 0, $.message.end());
  
     $.message.write(plugin[propName] ?
        "[ navigator.plugins[i]." + propName + 
           " appears to contain the following version number: \"" + fileVersion + "\" ]" : 0, $.message.end());


/*
     // If still no fileVersion, then we try something more generic, but more risky.
     // We try to enumerate the plugin object, and look for any property name that
     // contains "version" in it.
     // However, we only do this if "version" already exists, so we can compare
     // version & fileVersion later on (as a consistency check).
     if (!fileVersion && version)
     {
       try{
         for (x in plugin){
           if ((/version/i).test(x)){fileVersion = $.getNum(plugin[x] + ""); break;}
         }
       }catch(e){}
     }
*/

     if (!fileVersion || !version) return version || fileVersion || null;


     // At this point, both version and fileVersion are !== null



     // Note: we are assuming here that "version" is more reliable than "fileVersion",
     //   because plugin.version is a completely new method of plugin version detection.
     // Whereas "version" is derived from the traditional methods of plugin detection
     // such as looking at navigator.plugins[i].name and navigator.plugins[i].description.
     // Note: we are assuming here also that fileVersion is more precise than version.
     //
     // If there is an unacceptable discrepancy between version and fileVersion, then
     // this routine will simply return version.
     //
     // Check to make sure that fileVersion has a valid value that we can believe.
     // We compare the digits of version and fileVersion.
     //
     // It is OK if version[x] == fileVersion[x]
     // It is OK if version[x]==0 and fileVersion[x]>=0 (ie.  7,0,0,0  vs.  7,0,9,50)
     // It is NOT OK if version[x]>0 and fileVersion[x]!=version[x] (ie. 7,0,0,0  vs. 8,0,0,0)
     //    in which case we simply return version.
     // It is NOT OK if version = 7,0,9,0 and fileVersion = 7,1,9,0
     tmp = ($.formatNum(version)).split($.splitNumRegx);
     tmpFV = ($.formatNum(fileVersion)).split($.splitNumRegx);
     for (x=0;x<tmp.length;x++)
     {
         // if version[x]!="0" where x>index and index is the first
         // digit where the 2 numbers mismatch, then we have some kind
         // of error. So we return version.
         if (index>-1 && x>index && tmp[x]!="0") return version;
         
         if (tmpFV[x]!=tmp[x])
         {
             // index now points to the first digit where there
             // is a mismatch between version and fileVersion
             if (index==-1) index=x;

             // if fileVersion[x]!=version[x] && version[x]!="0"
             // then we have some kind of error, so return version
             if (tmp[x]!="0") return version;

         }

     }

     // fileVersion appears valid. Thus we return fileVersion
     return fileVersion;

},  // end of getPluginFileVersion()



BOUNDARY300:"select.miscCheckbox.allowactivex",

// [private]
// We save the window.ActiveXObject object to speed up access to the
// ActiveXObject, since we are repeatedly accessing it.
//
// Also, we do this in case someone modifies the value of window.ActiveXObject
// AFTER this script has loaded. In that case, we still have access to
// the original intended value.
// If there is some Javascript code BEFORE this libarary has loaded, then there 
// is a risk that the window.ActiveXObject has been modified.
//
// As of IE 11 / Win 8, the behavior of window.ActiveXObject changes.
// It is still a constructor function that can be used as new ActiveXObject("...").
// However, it will now give us:
//   typeof window.ActiveXObject == "undefined"
//   window.ActiveXObject evaluates to boolean false in an if() statement.
//
// *** Make sure to tell the end user to put this Library ahead of other Javascripts,
// if the user intends to modify the value of window.ActiveXObject.
AXO: (function(){

  // In the off chance that someone sets window.ActiveXObject = function(){....}
  // This would cause new ActiveXObject() to always return an object, no matter what
  // the input argument. This would cause non-IE browsers to be detected as IE
  // within this Library. To prevent this, we use the following code.
  var Z;
  try{Z=new window.ActiveXObject();}
  catch(e){}

  // As a consistency check, we want to make sure that
  // instantiation of new ActiveXObject() fails.
  // If it happens to return an object, then something is wrong.
  // Perhaps someone modified the value of window.ActiveXObject.
  return Z ? null : window.ActiveXObject;

})(),


// [private]
// Get ActiveX Object
// Save Error object to $.errObj
getAXO: function(progID){

  var obj = null;

  $.message.write($.message.time($.getAXO,1), $.message.end());  // Start measuring time delay

  try{obj = new $.AXO(progID);}
  catch(e){
    $.errObj = e;
    $.message.write("[ Unable to create ActiveXObject(" + $.message.args2String(progID) +
       ") in " + $.message.time($.getAXO) + ". Error.name: \"" + (e.name) + "\" " +
       "Error.message: \"" + (e.message) + "\" ]", $.message.end());
  }

  $.message.write(obj ? "[ created ActiveXObject(" + $.message.args2String(progID) + ") in " +
     $.message.time($.getAXO) + " ]" : 0, $.message.end());

  // This is the most ideal place to set the value of $.browser.ActiveXEnabled.
  // When this Library loads and initializes, it attempts to instantiate a list of
  // ActiveX objects, to see if ActiveX is enabled or not.
  // If we INCORRECTLY determine that ActiveX is disabled, then we still have one more
  // chance to get it right, when we are doing plugin detection and are trying to 
  // instantiate the ActiveX objects associated with that plugin.
  if (obj) $.browser.ActiveXEnabled = !0;

  return obj;

},  // end of getAXO()



/*

// [private]
// return value of (new ActiveXObject(progID)).methodName().
//
// Note: just because $.getAXO("pluginName") returns a value, that does not
// guarantee that the plugin is actually installed.
// It is possible for someone to try to trick us, by setting
// window.ActiveXObject = function(){}.
// However, this routine is more reliable in that it accounts for this trick.
callAXO: function(progID, methodName){

   var e, 
      // We init to "", not 0/null.
      // The reason is because the result of this routine may
      // get converted to a string using + "", so we need to be
      // consistent.
      result="";
   
   $.message.write($.message.time($.callAXO,1), $.message.end());  // Start measuring time delay

   if (progID && methodName)
   {
     // Note: we try to bypass any tricks that a web designer could do.
     // For example, if we have a browser that does not have ActiveX,
     // or has ActiveX disabled, and we created a constructor:
     //    window.ActiveXObject = function(){};
     //    window.ActiveXObject.prototype = methodName(){return "blablabla"};
     // Then that browser would return a value for new ActiveXObject()[methodName](),
     // when in fact it should NOT return any value, since ActiveX is not really
     // present.
     // The way to avoid this issue is to make sure that
     // window.ActiveXObject.prototype[methodName] does not exist.
     try{if ($.AXO.prototype[methodName]) return result}
     catch(e){}

     try{result = (new $.AXO(progID))[methodName]()}
     catch(e){}
     
     $.message.write("[ " +
       (result ? "Successfully called " : "Unable to call ") +
       "ActiveXObject(" + $.message.args2String(progID) + ")[" +
       $.message.args2String(methodName) + "]( ) in " +
       $.message.time($.callAXO) + " ]", $.message.end());

   }

   return result;

}, // end of callAXO()

*/



// ****************************************************************************************
// Initialize the Library


BOUNDARY50:"1",


// [** PUBLIC **]
// Contains all the browser detection results.
// This object is filled during initialization.
browser:{
  
// Property is automatically removed by Script Generator  
firstProperty:"select.always.browser",
  
BOUNDARY0:"0",

// This object assists in creating a custom version of the script for the user.
script:{

    select:{always:{browser:"browser"}},

    errCheck:function(code, select){
        if (!select.miscCheckbox.allowactivex &&
             (/\.codebase|\.AXO|\.getAXO|\.ActiveX|ActiveXObject/).test(code.customModuleScript)
           )
              alert("Error: ActiveX code found in " + code.moduleName + " module");
    }

}, // end of script{}

BOUNDARY1:"1",

  
// [private]
//
// Detect the Platform.
// Results are placed in $.OS
detectPlatform:function(){
  
  var browser=this, x,
     platform = window.navigator ? navigator.platform || "" : "";

  $.message.write($.message.time(browser.detectPlatform,1), $.message.end()); // start time measurement
  $.message.write("[ ]", $.message.end());
  $.message.write("[ START Detect Platform ]", $.message.end());

  // Detect Operating System, set value for $.OS
  // We look at navigator.platform because it is somewhat more reliable than navigator.userAgent.
  //
  // $.OS==1 for Windows     (most popular)
  // $.OS==2 for Macintosh   (2nd most popular)
  // $.OS==3 for Linux       (3rd most popular)
  // etc...
  $.OS=100;   // unknown OS or platform
  if (platform)
  {

        // RegExp platform, OS number
    var data_plat =
       
         // These are the 3 primary platforms on which PluginDetect has been tested
         // We use this info to prevent browser crashes, and enhance plugin detection.
         ["Win",1, "Mac",2, "Linux",3,

         // A popular BSD OS. Firefox can run on FreeBSD.
         // This OS is listed on the browsershots.org website.
         "FreeBSD",4, 
         
         // Unix, Sun unix, HP unix
         //"X11",5, "SunOS",6, "HP-UX",7,


         // *** Mobile devices have an id >= 20...
         
         // If specific mobile device not found, then we test
         // for a generic mobile device
         //"Mobile|Phone|Wireless",20,

         // Apple Devices
         "iPhone",21.1, "iPod",21.2, "iPad",21.3,
         
         // Mobile Windows devices
         // We test for these so we can distinguish between Windows mobile and Windows desktop
         "Win.*CE",22.1, "Win.*Mobile",22.2, "Pocket\\s*PC",22.3,

       //  "Blackberry",23, "PalmOS",24,

       //  "Nintendo\\s*Wii",29, "PlayStation",30,

         "",100]; // Dummy data at the end of array

     // We start the search at the END of the array, which involves more SPECIFIC platforms
     // The beginning of the array is more GENERIC.
     // Example, "WinCE" is at the end, and "Win" is at the beginning.
     for (x=data_plat.length-2;x>=0;x=x-2)
     {
         if (data_plat[x] && new RegExp(data_plat[x], "i").test(platform))
            {$.OS = data_plat[x+1]; break;}
     }


     // NOTE: if $.OS>=20 && $.OS<100, then we probably have a mobile device
     // if $.OS>=100 then device is unknown, probably mobile or a bot.
     $.message.write("[ " + $.name + ".OS: " + $.OS + " (" + (data_plat[x]) + ") ]", $.message.end());

  }

  $.message.write("[ END Detect Platform in " + $.message.time(browser.detectPlatform) + " ]", $.message.end());
  
}, // end of detectPlatform()


  
// [private]
//
// Detect Internet Explorer
//
// The naming convention for browser detection results is:
//   $.browser.isIE    $.browser.verIE
//   $.browser.isOpera $.browser.verOpera
//   $.browser.isGecko $.browser.verGecko
//   etc...
detectIE:function(){

   var browser=this,
     doc=document, x, tmp,

     // We do not assume that the userAgent even exists.
     // Hence we test for the presence of the navigator{} object first.
     // If no value, we use "".
     userAgent = window.navigator ? navigator.userAgent || "" : "",

     progid, progid1, progid2;
     


   BOUNDARY("select.miscCheckbox.allowactivex");

   $.message.write($.message.time(browser.detectIE,1), $.message.end()); // start time measurement
   $.message.write("[ ]", $.message.end());
   $.message.write("[ START ActiveX detection ]", $.message.end());


/*

   Note: for IE 11+ on Windows 8+, it is possible for a plugin to appear in the 
   navigator.plugins[] and navigator.mimeTypes[] arrays. If ActiveX is disabled,
   or ActiveX filtering is enabled, then those plugins will no longer be in
   the navigator arrays. Also, if a particular plugin is disabled in the Add-ons
   menu, then it will no longer appear in the navigator arrays.

*/

   browser.ActiveXFilteringEnabled = !1;
   browser.ActiveXEnabled = !1;

   // Note: our ActiveX detection only depends on whether certain ActiveX Objects can
   // be instantiated. This is feature detection, NOT browser detection.
   // We therefore allow ALL browsers to attempt to instantiate some ActiveX objects.
   //
   // Note: You can disable ActiveX in IE, which will disable all ActiveX objects
   // in the browser. However, you can have ActiveX enabled and have ActiveXFiltering
   // enabled, which means that most ActiveX objects will be disabled, but not all.



   // Get status of ActiveX filtering. Filtering ActiveX works for IE 9+.
   //
   // Note: msActiveXFilteringEnabled() is not 100% reliable.
   // When it returns "true", Filtering may still be disabled depending on the
   // browser security settings.
   //
   // Note: ActiveX Filtering does not turn off ActiveX. It merely disables
   // most ActiveX controls, though some controls will continue to function.

   try{browser.ActiveXFilteringEnabled = !!window.external.msActiveXFilteringEnabled();}
   catch(e){}


   // Now we determine if ActiveX is enabled or not, using a list of ActiveX controls.
   // In trying to determine whether ActiveX is enabled, the choice of which
   // ActiveXObjects to check for is debatable.
   // When newer versions of IE come out, make sure that we can detect
   // ActiveX with this list.
   // ** THIS LIST SHOULD BE KEPT UP TO DATE **



   // What follows is a list of pre-Approved ActiveX controls for IE 7.
   // At least some of these controls should be present in IE 5+.
   // These will help to verify that ActiveX is enabled, while simultaneously
   // avoiding the info bar popups in IE 7.
   //
   // We test for built-in Microsoft ActiveX objects first, since they should always be present.
   // We also test for Flash, because it is installed on 99% of all PC's.
   progid1 = [

     // In IE7 & IE8, I turned off all the add-ons in the "Manage Add-ons menu".
     // When I did this, these first 2 ActiveXObjects were unaffected.
     // Hence we try these 2 first, since the user cannot turn them off using the
     // add-on menu. The only way I know to turn these 2 objects off is in the
     // Security Tab - by turning off ActiveX itself.
     "Msxml2.XMLHTTP",                  // {F6D90F16-9C73-11D3-B32E-00C04F990BB4}
     "Msxml2.DOMDocument",              // {F6D90F11-9C73-11D3-B32E-00C04F990BB4}

     "Microsoft.XMLDOM",                // {2933BF90-7B36-11D2-B20E-00C04F983E60}
     "TDCCtl.TDCCtl",                   // {333C7BC4-460F-11D0-BC04-0080C7055A83}
     "Shell.UIHelper",                  // {64AB4BB7-111E-11d1-8F79-00C04FC2FBE1}
     "HtmlDlgSafeHelper.HtmlDlgSafeHelper", // {3050f819-98b5-11cf-bb82-00aa00bdce0b}
     "Scripting.Dictionary"             // {EE09B103-97E0-11CF-978F-00A02463E06F}

   ];

   // We can aso test for these controls to see if ActiveX is enabled.
   // Also, if we can create any of these ActiveX controls, then ActiveX filtering is off.
   // ActiveX filtering is supposed to turn off all the ActiveX controls for ordinary
   // browser plugins. So if any of these controls are on, then filtering is off.
   progid2 = [
                                          // Windows Media Player
        "WMPlayer.OCX",                   // {6BF52A52-394A-11d3-B153-00C04F79FAA6}

                                          // Flash
        "ShockwaveFlash.ShockwaveFlash",  // {D27CDB6E-AE6D-11cf-96B8-444553540000}

        "AgControl.AgControl"             // Silverlight

   ];

   // If we can create any ActiveX control in progid[], then
   // ActiveX is enabled. Note, we allow $.getAXO() to set the value
   // of browser.ActiveXEnabled.
   progid = progid1.concat(progid2);
   for (x=0;x<progid.length;x++)
   {
      if ($.getAXO(progid[x]) && !$.dbug) break;
   }

   // If ActiveX is enabled, and ActiveXFiltering APPEARS to be enabled,
   // then we can check if the Filtering is ACTUALLY enabled
   // or not. If certain ActiveX controls can be created, then
   // filtering is really off, regardless of what
   // msActiveXFilteringEnabled() says.
   if (browser.ActiveXEnabled && browser.ActiveXFilteringEnabled)
   {
          for (x=0;x<progid2.length;x++)
          {
             if ($.getAXO(progid2[x]))
             {
               browser.ActiveXFilteringEnabled = !1;  // false
               break;
             }

          }
   }


   $.message.write("[ " + $.name + ".browser.ActiveXEnabled: " + browser.ActiveXEnabled + " ]", 
     $.message.end());
   $.message.write("[ " + $.name + ".browser.ActiveXFilteringEnabled: " + browser.ActiveXFilteringEnabled + " ]", 
     $.message.end());
   $.message.write("[ END ActiveX detection in " + $.message.time(browser.detectIE) + " ]", 
     $.message.end());


   BOUNDARY("1");


   $.message.write($.message.time(browser.detectIE,1), $.message.end()); // start time measurement
   $.message.write("[ ]", $.message.end());
   $.message.write("[ START Detect Internet Explorer ]", $.message.end());


   // Determine if browser is IE.
   // This detection method is independent of the navigator.userAgent.
   // It works only for IE < 11, because IE 11+ does not support conditional compilation.
   // [Boolean]
   //
   // Code is based on  http://dean.edwards.name/weblog/2007/03/sniff/
   //
   // To detect IE we can use the conditional compilation:
   //    browser.isIE=/*@cc_on!@*/!1;
   //
   // However, some Javascript minifiers may not recognize conditional compilation,
   // and may treat it as a normal comment and just filter it out.
   // We get around this by putting the conditional compilation inside
   // a string.
   //
   // So, we can use either eval("") or new Function("")().
   //
   // isIE:!!new Function("return//@cc_on 1")()
   // isIE:!new Function("return 1//@cc_on-1")()
   // isIE:new Function("return!1//@cc_on||!0")()
   // isIE:new Function("return/*@cc_on!@*/!1")()
   // isIE:!!new Function("return 0//@cc_on+1")()
   //
   // Note: we do not need to use extra parentheses like (new Function("..."))(),
   // because our code cannot be confused with a function declaration. It is part of an
   // expression.
   // Ex.  AA = new Function()().
   //
   // Only when the code could be confused with a function declaration, do you need the extra
   // parentheses...
   // Ex.   function AA(){}      seen as a function declaration
   // Ex.   function AA(){}()    Starts off as a declaration, but then does not make sense
   // Ex.   (function AA(){})()  the parentheses means we have an expression, not a declaration.
   //
   // browser.isIE = new Function("return/*@cc_on!@*/!1")();
   //
   // Testing indicates that in many browsers, eval("/*@cc_on!@*/!1") is faster than
   // new Function("return/*@cc_on!@*/!1")(). The eval("") expression is also shorter.
   // Thus we use eval().
   //
   // *** Update: we use new Function() instead of eval(), because the Yui minifier
   // behaves better with new Function().


   // To detect IE, while being independent of the navigator.userAgent,
   // we can use a combination of methods:
   //
   //   a) If ActiveX is enabled, then we know that we have IE.
   //   If the user has ActiveX disabled, or we are not looking for the right progid's
   //   to determine if ActiveX is present, then we need to use other methods of detection.
   //
   //   b) Look at the document.documentMode. If this property is READ ONLY
   //    and is a number >=0, then we have IE 8+.
   //    According to Microsoft:
   //       When the current document has not yet been determined, documentMode returns a value of
   //       zero (0). This usually happens when a document is loading.
   //       When a return value of zero is received, try to determine the document
   //       compatibility mode at a later time.
   //
   //   c) See if the browser supports Conditional Compilation.
   //    If so, then we have IE < 11.
   //
   //   d) As of IE 11, typeof window.ActiveXObject === 'undefined'.
   //   However, window.ActiveXObject.constructor is still an object.
   //   So, if (typeof window.ActiveXObject === 'undefined' && window.ActiveXObject.constructor)
   //   then we have IE. 
   //      Or, we could also say if (window.ActiveXObject !== window.undefined)
   //   then we have IE. This also works for IE 11+.
   //      For now, we do not bother using this since we do not really need it (yet).
   //   If Microsoft ever decides to get rid of document.documentMode or makes
   //   the documentMode property read/write, then we can use this method.
   //
   //
   tmp = doc.documentMode;
   try{doc.documentMode = "";}
   catch(e){}

   // If we have ActiveX enabled, then we have IE.
   // Or, if we have a number, then we have IE.
   // Or, if we can see the conditional compilation, then we have IE.
   // Else we have a non-IE browser.
   //
   // Note: this detection method is not affected by other Javascripts on non-IE
   // browsers that may try to artificially set the document.documentMode to a number,
   // in order to trick this Library into thinking that it is IE.
   //
   // Note: we use new Function() instead of eval(), because the Yui minifier
   // behaves better with new Function().
   
   
   BOUNDARY("select.miscCheckbox.allowactivex");
   
   browser.isIE = browser.ActiveXEnabled;

   $.message.write(browser.ActiveXEnabled ?
     "[ " + $.name + ".browser.ActiveXEnabled == true. This indicates that your browser is IE. ]" : 0,
      $.message.end());

   BOUNDARY("1");



   browser.isIE = browser.isIE || $.isNum(doc.documentMode) || new Function("return/*@cc_on!@*/!1")();


   $.message.write($.isNum(doc.documentMode) ?
     "[ document.documentMode is a number, and is READ ONLY. This indicates IE 8+. ]" : 0, 
      $.message.end());

   // Note: we use new Function() instead of eval(), because the Yui minifier
   // behaves better with new Function().
   $.message.write(new Function("return/*@cc_on!@*/!1")() ?
     "[ Conditional compilation /*@cc_on!@*/!1 == true. This indicates that your browser is IE. ]" : 0, 
      $.message.end());


   // We switch the value back to be unobtrusive for non-IE browsers
   try{doc.documentMode = tmp;}
   catch(e){}


   $.message.write("[ " + $.name + ".browser.isIE: " + browser.isIE + " ]", $.message.end());


  // This is the IE version that PluginDetect uses internally.
  // [floating point number or null]
  //
  // We would like this version to be as close to the ACTUAL version of the IE browser
  // as possible. We only look at document mode and userAgent here, however, which have
  // their limitations.
  browser.verIE = null;
  if (browser.isIE)

     // The document.documentMode exists for IE 8+.
     // It can have a value of 0,5,7,8,9,10,11,...
     //
     // A value of 0 means that the browser has not determined the document mode yet.
     // A value of 5 indicates Quirks Mode.
     //
     // Note: in IE 8,9,10 when there is no doctype specified in the web page,
     // the browser sets document.documentMode == 5 (quirks mode).
     // For IE 11, when there is no doctype specified in the web page, 
     // the browser will NOT go into quirks mode.
     //
     // Hence, when documentMode is a number but is < 7, then we will use the userAgent instead
     // in the hope that we get a more accurate result.
     //
     browser.verIE = ($.isNum(doc.documentMode) && doc.documentMode >=7 ? doc.documentMode : 0) ||
       
       
       // The user Agent can be customized by the user to be ANYTHING they want,
       // and hence this result is not 100% reliable.
       //
       // If a user alters the userAgent so that IE version is not present, then we default to
       // browser.verIE = 7
       //
       // For IE < 11, we look for "MSIE 10.0", etc...
       //
       // For IE 11+, we look for "rv:11.0", etc...
       // Mozilla/5.0 (Windows NT 6.1; Trident/7.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E; rv:11.0) like Gecko
       //
       // We make sure there is no letter preceding "MSIE|rv:".
       // If there is more than one "MSIE|rv:", we only use the first one.
       // We also allow for the possibility that "MSIE|rv:" is at the very beginning of the string.
       // *? means non-greedy
       // ?? means non-greedy
       // ?: means to not save match in RegExp object
       ((/^(?:.*?[^a-zA-Z])??(?:MSIE|rv\s*\:)\s*(\d+\.?\d*)/i).test(userAgent) ?
         
           parseFloat(RegExp.$1, 10) : 7);
  

  $.message.write("[ " + $.name + ".browser.verIE: " + browser.verIE + " ]", $.message.end());
  $.message.write("[ END Detect Internet Explorer in " + $.message.time(browser.detectIE) + " ]", $.message.end());




// Reveal more detailed Internet Explorer version information
BOUNDARY("select.miscCheckbox.betterie");

browser.betterIE();

BOUNDARY("1");

  
}, // end of detectIE()



BOUNDARY48:"0",  // We always delete this item


betterIE_:{

// This object assists in creating a custom version of the script for the user.
script:{

    select:{miscCheckbox:{betterie:"BetterIE"}},

    target:function(){
       return $.browser.betterIE;
    },

    errCheck:function(code, select){
        if (!select.miscCheckbox.allowactivex &&
             (/\.codebase|\.AXO|\.getAXO|\.ActiveX|ActiveXObject/).test(code.customModuleScript)
           )
              alert("Error: ActiveX code found in " + code.moduleName + " module");
    },

    checkboxLabel:{miscCheckbox:{betterie:{
      
      text:function(){return "Use better Internet Explorer version detection.<br>" +
      "This feature will make " + $.name + ".browser.verIE independent of the navigator.userAgent. <br>" +
      "Additional properties that become available are " + $.name + ".browser.verIEtrue (true IE version), " +
      "and " + $.name + ".browser.docModeIE (document mode of IE). " +
      "See <a href='../guide/#ExtraProps'>Instructions</a> for more info.";}

    }}}

} // end of script{}

}, // end of betterIE_



// This object allows PluginDetect to use/reveal more accurate IE version information
BOUNDARY49:"select.miscCheckbox.betterie",


betterIE:function(){

  var browser=this, doc=document;

  // Get more detailed info on IE version.
  //
  // When we need to check for a specific property of the browser, there is no need to
  // check the browser version...we simply check that property.
  // However, when accessing a property/method causes a security popup or a browser bug,
  // then we DO need to look at the browser version to avoid those problems.
  // Hence, we need to determine the version of IE for PluginDetect.
  //
  //
  // **** Our requirements for IE version detection in PluginDetect are:
  //  1) Be able to distinguish IE Desktop < 7 from IE Desktop >=7 due to security popups,
  //  which were first introduced in IE 7 due to ActiveX security concerns.
  //  This may allow us to avoid security popups in some cases.
  //  Note: being in Quirks mode, where document.documentMode == 5, does not suddenly make
  //  the browser behave like IE 5, security wise.
  //
  //  2) Try to be independent of the navigator.userAgent, as much as possible
  //  The reason is that the userAgent can be changed by a user to anything they want in
  //  IE 8+ Developer Tools.
  //
  //  3) Java Plugin2 does not run on IE Desktop < 6, and Java Deployment Toolkit is
  //  only for IE Desktop >= 6, so be able to distinguish IE < 6 from IE >=6.
  //  So, the browser mode, document mode, quirks mode should not affect the
  //  IE version detection to the extent that it affects IE < 6 and IE >=6 detection.
  //
  //  4) Since browser mode & document mode were first introduced in IE 8+, this should not
  //  have any effect on version detection for IE < 8.
  //
  //  5) We can look at div.style object properties to tell us the version of IE,
  //  or even the Jscript version to tell us the IE version. But these things may be different
  //  between IE Desktop and IE mobile. And we would have to update the code each time
  //  a new IE version came out, which would make PluginDetect harder to maintain.
  //
  //  6) This method should give the correct value on both IE and IE mobile.
  //


  // TRUE version of IE, derived from clientCaps.
  // This is independent of browser mode/document mode/navigator.userAgent.
  // It gives the actual browser version, regardless of any browser settings.
  // [string "AA.BB.CCCC.DDDDD" or null]
  //
  // The clientCaps technique is the ONLY technique that I know of, that
  // will give the TRUE version of IE.
  // It works for IE 5+ and IE < 11.
  //
  // I have no info on how IE Mobile behaves with clientCaps.
  //
  browser.verIEtrue = null;


  // Document mode of IE.
  // [floating point number or null]
  //
  // If browser.docModeIE >= 6 for IE Desktop,
  //    then we have IE 6+ in Standards Mode.
  //
  // If browser.docModeIE == 5 for IE Desktop,
  //    then we have IE 6+ in Quirks mode,
  //    but this does not necessarily mean that the document is rendered
  //    as if it were IE 5. It seems more like IE 6, from my own testing.
  //
  // Note: For IE 5.5, browser.docModeIE == 5.5, but we do not know if it is
  //     in Standards Mode or Quirks mode. But no on uses IE 5.5 anymore.
  //
  // Note: For IE 5, browser.docModeIE == 5 also, but no one uses IE 5 anymore.
  // Hence browser.docModeIE == 5 means that IE version >= 6 in Quirks Mode.
  //
  // The document mode tells us the version of IE that APPEARS to be rendering 
  // the web page/DOCUMENT. The document mode tells us the level of 
  // HTML/CSS/Image support that is available when rendering the document.
  // It is the EFFECTIVE version of IE that renders the web page.
  //
  // browser.docModeIE is essentally independent of the navigator.userAgent.
  //
  // We can use browser.docModeIE to determine which stylesheets to use in your web page
  // for IE. Traditionally, people have used Conditional Comments to decide what
  // stylesheet to give to IE. But IE 10+ no longer supports Conditional
  // Comments in Standards Mode.
  // And for IE 8 & 9, you could modify the documentMode in the
  // Developer Tools (and hence the CSS support level), which would
  // not change the Conditional Comments behavior. Hence,
  // using Conditional Comments to serve up stylesheets to IE is
  // somewhat flawed, in my opinion.
  // On the other hand, Conditional Comments still work when Javascript
  // is disabled.
  //
  //
  // Note: I did some experiments on IE documentMode vs CSS properties.
  // When IE 9 is in docMode==9, the CSS behaves as IE 9.
  // When IE 9 is in docMode==8, the CSS behaves as IE 8.
  // When IE 9 is in docMode==7, the CSS behaves as IE 7.
  // When IE 9 is in docMode==5 (QuirksMode), the CSS behaves as IE 5 or 6.
  //
  // When IE 8 is in docMode==8, the CSS behaves as IE 8.
  // When IE 8 is in docMode==7, the CSS behaves as IE 7.
  // When IE 8 is in docMode==5 (QuirksMode), the CSS behaves as IE 5 or 6.
  //
  // When IE 7 is in Standards Mode, the CSS behaves as IE 7.
  // When IE 7 is in QuirksMode, the CSS behaves as IE 5 or 6.
  //
  // When IE 6 is in Standards Mode, the CSS behaves as IE 6.
  // When IE 6 is in Quirks Mode, the CSS behaves as IE 5 or 6.
  //
  // Thus, QuirksMode in IE Desktop gives us the CSS behavior of IE 5 and/or 6,
  // Even though the docMode==5. At least, that is what it appears to be to me.
  //
  browser.docModeIE = null;

  if (browser.isIE)
  {

    $.message.write($.message.time(browser.betterIE,1), $.message.end()); // start time measurement

    $.message.write("[ ]", $.message.end());

    $.message.write("[ START more reliable IE info ]", $.message.end());

    $.message.write("[ Getting more reliable version info on IE browser, " + 
        "independent from navigator.userAgent... ]", $.message.end());



    // Get the TRUE version of IE, namely browser.verIEtrue.
    // This value is independent of the Browser Mode/Document Mode/userAgent.
    // We use clientCaps to get this info.
    //
    // We create a tag, and set the clientCaps behavior.
    // It should be a tag that:
    //   a) is not visible in the web page
    //   b) IE should allow us to set obj.style.behavior
    //    In HTML5, any HTML tag is allowed to have a style attribute.
    //   d) Works with clientCaps for IE 5+
    // It seems IE allows us to use any tag, even if setting the style object on that
    // tag does not comply with W3C standards.
    //
    var verTrueFloat, obj = doc.createElement("div"), x,

      // Array of classids that can give us the IE version.
      // We use more than one classid, because sometimes a browser may be missing one
      // or more classids.
      CLASSID = [
         "{45EA75A0-A269-11D1-B5BF-0000F8051515}", // Internet Explorer Help
         "{3AF36230-A269-11D1-B5BF-0000F8051515}", // Offline Browsing Pack
         "{89820200-ECBD-11CF-8B85-00AA005B4383}"
      ];

    try{obj.style.behavior = "url(#default#clientcaps)";}
    catch(e){}

    for (x=0;x<CLASSID.length;x++)
    {
      try{

        // It appears there is no need to insert obj into the
        // DOM for IE 5.5+ to get the clientCaps info.
        //
        // This works for IE 5.5+.
        // For IE 5, we would need to insert obj into the DOM, then set the behaviour,
        // and then query.

        browser.verIEtrue = (obj.getComponentVersion(CLASSID[x], "componentid")).replace(/,/g,".");
        
        $.message.write("[ IE componentVersion " + CLASSID[x] + ": " + browser.verIEtrue + " ]", $.message.end());

      }catch(e){}
      
      if (browser.verIEtrue && !$.dbug) break;

    }

    // If browser.verIEtrue exists as string "AA.BB.CCCC.DDDD", then we
    // convert to a floating point number, which would give us AA.BB
    // If there is no valid value, then we get 0.
    verTrueFloat = parseFloat(browser.verIEtrue||"0", 10);




    // For IE 8+, we look at document.documentMode, and is thus independent
    // of the user Agent.
    browser.docModeIE = doc.documentMode ||


       // If document.documentMode is not defined, then we have IE < 8 Desktop.
       // We thus try to artificially create a document mode number for these
       // IE < 8 browsers.
       //
       // So, for IE 7, 6, 5.5, 5 in Standards Mode we look at verTrueFloat.
       //
       // We return 5 in Quirks mode, because document.documentMode gave 5 in Quirks mode.
       // We determine Standards Mode/Quirks mode via document.compatMode.
       // document.compatMode is "CSS1Compat" or "BackCompat".
       //
       // Note: for IE < 8, document.documentMode is not defined in the browser.
       // It is remotely possible, but unlikely, that a web designer
       // could set document.documentMode to some arbitrary value for IE < 8.
       // Should we handle this possibility? For now, we can ignore it, since it is highly
       // unlikely.
       ((/back/i).test(doc.compatMode || "") ? 5 : verTrueFloat) ||

       // If documentMode does not exist, and our artifical document mode does not 
       // exist either, then return value from user Agent.
       // Else return null.
       browser.verIE;




    // Version of IE, used internally by PluginDetect.
    //
    // We try to use the value derived from the FULL Version of IE first,
    // because the FULL version is independent of userAgent/document Mode/Browser Mode,
    // and so it gives the actual version of the browser.
    // PluginDetect wants to know when Security popups may occur (IE 7+),
    // or when certain plugins are compatible with IE. Wanting to know these things is 
    // more dependent on the ACTUAL (FULL) version of IE, as opposed to the APPARENT version
    // (given by the document mode/browser mode).
    //
    // If FULL version is not available, then we just use the version given
    // by the document mode. For most people, the document mode will be the actual IE version, 
    // anyway.
    browser.verIE = verTrueFloat || browser.docModeIE;

    
    
    $.message.write("[ document.documentMode (Document Mode): " +
          (doc.documentMode || "") + " ]", $.message.end());
    $.message.write("[ document.compatMode (Compatibility Mode): " +
          (doc.compatMode || "") + " ]", $.message.end());


    $.message.write("[ " + $.name + ".browser.verIEtrue (True IE browser version, from clientCaps): " +
           $.message.args2String(browser.verIEtrue) + " ]", $.message.end());
    $.message.write("[ " + $.name + ".browser.docModeIE (IE document mode): " + browser.docModeIE + " ]", $.message.end());
    $.message.write("[ " + $.name + ".browser.verIE (IE version, used internally by PluginDetect): " + 
           browser.verIE + " ]", $.message.end());
           
    $.message.write("[ ]", $.message.end());
    $.message.write("[ clientCaps.platform: " + obj.platform + " ]", $.message.end());
    $.message.write("[ clientCaps.cpuClass: " + obj.cpuClass + " ]", $.message.end());
    $.message.write("[ ]", $.message.end());


    $.message.write("[ END more reliable IE info in " + $.message.time(browser.betterIE) + " ]", $.message.end());

  }  // end of "if" statement


},  // end of betterIE()


BOUNDARY50:"1",

  
// [private]
//
// Detect non-IE Browsers
// This routine should be run AFTER detectIE().
//
// Note: perhaps in the future, we should only have $.browser.version instead
// of $.browser.verIE, $.browser.verOpera, $.browser.verGecko, etc... ?
//
// The naming convention for browser detection results is:
//   $.browser.isIE    $.browser.verIE
//   $.browser.isOpera $.browser.verOpera
//   $.browser.isGecko $.browser.verGecko
//   etc...
detectNonIE:function(){

  var browser=this, detected = 0,


     // We do not even assume that the navigator{} object exists.
     nav=window.navigator ? navigator : {},

     // When we are unsure whether certain navigator properties are defined or not,
     // we simply OR them with an empty string.
     //
     // For example, if nav.vendor is undefined or null or 0 or false, then vendor == "".
     // When you have an OR operator, and all the operands evaluate to false, then
     // the result will just be the very last operand.
     // http://blog.niftysnippets.org/2008/02/javascripts-curiously-powerful-or.html
     //
     // If the browser is IE, we set userAgent="".
     // We do this because if the user Agent for IE is modified to that of another browser,
     // then the non-IE detection code below will unintentionally pick it up.
     // Ex. for IE, if user agent is modified to imitate Firefox, then
     //  browser.isGecko == true while also browser.isIE == true.
     // To prevent this, we set userAgent=="" here.
     userAgent = browser.isIE ? "" : nav.userAgent || "",

     vendor = nav.vendor || "",
     product = nav.product || "";


  $.message.write($.message.time(browser.detectNonIE,1), $.message.end()); // start time measurement
  $.message.write("[ ]", $.message.end());
  $.message.write("[ START Detect non-IE browsers ]", $.message.end());


  // Detect if browser is Gecko or not.
  // To detect Gecko browser, we look for:
  //      navigator.product => "Gecko"
  //      and navigator.userAgent => "Gecko/[num]"
  //
  // Detect the Gecko CVS branch by looking at "rv:[num]"
  //  We can detect the CVS branch as far back as rv:0.9 or so, which dates back to 2002.
  //
  // Beginning in Gecko 0.9.0 (Netscape 6.1 in Gecko 0.9.2), navigator.userAgent contains the
  // CVS branch tag of the source which was used to create the version of Gecko
  // being used in the browser. The branch tag is contained in the comment area of
  // the user agent string and follows the string "rv:
  //
  // Gecko userAgent example:
  //  Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.0.7) Gecko/2009021910 Firefox/3.0.7
  //
  // See https://developer.mozilla.org/En/Browser_Detection_and_Cross_Browser_Support
  browser.isGecko =  // true or false
      !detected &&
      (/Gecko/i).test(product) &&
      (/Gecko\s*\/\s*\d/i).test(userAgent);   // test for "Gecko/[num]"
  detected = detected || browser.isGecko;

  browser.verGecko =    // Gecko CVS branch
      browser.isGecko ?
          $.formatNum(
            (/rv\s*\:\s*([\.\,\d]+)/i).test(userAgent) ?  // If false then we assume a CVS branch of 0.9.0
             RegExp.$1 : "0.9"
          ) : null;
          
  $.message.write("[ " + $.name + ".browser.isGecko: " + browser.isGecko + " ]", $.message.end());
  $.message.write("[ " + $.name + ".browser.verGecko: " + browser.verGecko + " ]", $.message.end());



  // Chrome, Opera, and Safari browsers can have "Safari/[num]" in the user agent.
  // Opera and Chrome can have "Chrome/[num]" in the user agent.
  // Hence, we detect Opera browser FIRST. THEN Chrome, and THEN Safari.



  // Detect Opera browser
  //
  //
  // Opera 22.0
  // Mozilla/5.0 (Windows NT 5.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36 OPR/22.0.1471.70
  //
  // Opera 12.15
  // Opera/9.80 (Windows NT 5.1) Presto/2.12.388 Version/12.15
  //
  // Opera 10.10
  // Opera/9.80 (Windows NT 5.1; U; en) Presto/2.2.15 Version/10.10
  //
  // Opera 10.01
  // Opera/9.80 (Windows NT 5.1; U; en) Presto/2.2.15 Version/10.01
  //
  // Opera 9.0
  // Opera/9.00 (Windows NT 5.1; U; en)
  //
  // Opera 8.53
  // Opera/8.53 (Windows NT 5.1; U; en)
  //
  // Opera 7.21
  // Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1) Opera 7.21 [en]
  //
  browser.isOpera = // true or false
    !detected &&
    (/(OPR\s*\/|Opera\s*\/\s*\d.*\s*Version\s*\/|Opera\s*[\/]?)\s*(\d+[\.,\d]*)/i).test(userAgent);
  detected = detected || browser.isOpera;

  browser.verOpera = browser.isOpera ? $.formatNum(RegExp.$2) : null;

  $.message.write("[ " + $.name + ".browser.isOpera: " + browser.isOpera + " ]", $.message.end());
  $.message.write("[ " + $.name + ".browser.verOpera: " + browser.verOpera + " ]", $.message.end());



  // Detect Microsoft Edge browser
  // Only the EdgeHTML version is available for detection.
  // The actual version of the Edge browser itself does not appear to be detectable at the moment.
  //
  // navigator.userAgent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.10240
  //
  browser.isEdge = // true or false
      !detected &&
      (/(Edge)\s*\/\s*(\d[\d\.]*)/i).test(userAgent);
  detected = detected || browser.isEdge;

  browser.verEdgeHTML = browser.isEdge ? $.formatNum(RegExp.$2) : null;

  $.message.write("[ " + $.name + ".browser.isEdge: " + browser.isEdge + " ]", $.message.end());
  $.message.write("[ " + $.name + ".browser.verEdgeHTML: " + browser.verEdgeHTML + " ]", $.message.end());



  // Detect Chrome browser
  //
  // Chrome 1.0.154+ (Desktop) has navigator.vendor = "Google".
  // Chrome 25 (Desktop) has navigator.vendor = "Google".
  // Chrome 25 (on iPad) has navigator.vendor = "Apple Computer, Inc".
  //
  // So, just looking at the vendor does not guarantee that we can detect Chrome.
  // The Chrome browser could have a vendor of "Google" or "Apple".
  // Note: "CriOS" is for Chrome on the iPad, which uses the iOS operating system.
  //
  //
  // Chrome 36.0
  // Mozilla/5.0 (Windows NT 5.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.125 Safari/537.36
  //
  browser.isChrome = // true or false
      !detected &&
      (/(Chrome|CriOS)\s*\/\s*(\d[\d\.]*)/i).test(userAgent);
  detected = detected || browser.isChrome;

  browser.verChrome = browser.isChrome ? $.formatNum(RegExp.$2) : null;

  $.message.write("[ " + $.name + ".browser.isChrome: " + browser.isChrome + " ]", $.message.end());
  $.message.write("[ " + $.name + ".browser.verChrome: " + browser.verChrome + " ]", $.message.end());


  // Detect Safari browser
  //
  // Many coders also look at navigator.vendor to detect Safari, but we account for the
  // case where there is no vendor specified.
  //
  // For Safari 3+, navigator.vendor contains string "Apple"
  // We have not verified this for Safari 2.
  //
  //
  // Safari 5.1.4
  // Mozilla/5.0 (Windows NT 5.1) AppleWebKit/534.54.16 (KHTML, like Gecko) Version/5.1.4 Safari/534.54.16
  //
  // Safari 7.0.3
  // Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_2) AppleWebKit/537.75.14 (KHTML, like Gecko) Version/7.0.3 Safari/537.75.14
  //
  browser.isSafari =   // true or false
      !detected &&
      ((/Apple/i).test(vendor) || !vendor) &&
      (/Safari\s*\/\s*(\d[\d\.]*)/i).test(userAgent);   // test for "Safari/[num]"
  detected = detected || browser.isSafari;

  // The Version/X.Y.Z part in the userAgent is present only from Safari 3 on and 
  // not in the earlier versions. Safari 3 was introduced in June 2007.     
  browser.verSafari = browser.isSafari &&
  
      (/Version\s*\/\s*(\d[\d\.]*)/i).test(userAgent) ? $.formatNum(RegExp.$1) : null;

  $.message.write("[ " + $.name + ".browser.isSafari: " + browser.isSafari + " ]", $.message.end());
  $.message.write("[ " + $.name + ".browser.verSafari: " + browser.verSafari + " ]", $.message.end());



  // Note (3/7/2013): Silk browser on Kindle Fire has the following:
  // navigator.uerAgent =
  // "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_3; en-us; Silk/1.0.22.153_10033210)
  // AppleWebKit/533.16 (KHTML, like Gecko) Version/5.0 Safari/533.16
  // Silk-Accelerated=true"
  // navigator.vendor = Google Inc.
  // navigator.product = Gecko
  // navigator.platform = Linux armv7i
  //
  // So, the Silk browser appears to be very similar to Safari, but for now we
  // will not try to detect Silk specifically. This browser only appears to have Flash
  // installed as a plugin, and was not able to display PDF documents within the browser.



  $.message.write("[ END Detect non-IE browsers in " + $.message.time(browser.detectNonIE) + " ]", $.message.end());


}, // end of detectNonIE()


// [public]
init:function(){
  
  $.message.write("[ ]", $.message.end());
  $.message.write("[ navigator.userAgent: " + (navigator.userAgent || "") + " ]", $.message.end());
  $.message.write("[ navigator.vendor: " + (navigator.vendor || "") + " ]", $.message.end());
  $.message.write("[ navigator.product: " + (navigator.product || "") + " ]", $.message.end());
  $.message.write("[ navigator.platform: " + (navigator.platform || "") + " ]", $.message.end());

  var browser=this;
  
  browser.detectPlatform();
  
  browser.detectIE();

  browser.detectNonIE();


}, // end of init()


// Property is automatically removed by Script Generator
lastProperty:"select.always.browser"

}, // end of browser{}


init:{

// [public]
hasRun:0,


// [public]
//
// Initialize the Library.
//
// *** This routine is normally only called once.
// However, it may be called more than once for debugging purposes.
// This routine should never be called by a plugin module.
// This routine shoule never be called from outside this library.
library:function(){

  // Assign Library to global variable
  window[$.name] = $;

  var init=this, doc=document;

  // Start measuring time delay when Library starts to initialize.
  // We only run this once.
  $.message.write(!init.hasRun ? $.message.time($,1) : 0, $.message.end());

  $.message.write($.message.time(init.library,1), $.message.end());

  $.message.write("[ ]", $.message.end());
  $.message.write("[ START Initializing " + $.name + " Library Base ]", $.message.end());


  BOUNDARY("select.miscCheckbox.debugmode");

  $.debugmode.init();  // Initialize debug mode, if the user has selected it.
                       // We run this before all other initializations, so that
                       // the initializations themselves can be debugged.

  BOUNDARY("select.xtra.win");

  $.win.init();

  BOUNDARY("1");


  // reference to <head> tag
  // Note: there is no guarantee that the <head> element even exists.
  // If it does not, then we simply return the <body>
  $.head = doc.getElementsByTagName("head")[0] ||
           doc.getElementsByTagName("body")[0] ||
           doc.body || null;


  // Because we have not done any browser/platform detection yet, the
  // code shown above cannot depend on any particular browser/platform.


  $.browser.init();


  init.hasRun=1;   // Last item

  $.message.write("[ END Initializing " + $.name + " Library Base in " + 
     $.message.time(init.library) + " ]", $.message.end());


} // end of library()


}, // end of init{}





// ****************************************************************************************
// Store, retrieve, and execute event handlers


BOUNDARY4:"select.xtra.ev",

ev:{
  
// Property is automatically removed by Script Generator
firstProperty:"select.xtra.ev",


BOUNDARY0:"0",

// This object assists in creating a custom version of the script for the user.
script:{

    select:{xtra:{ev:"ev"}},
    
    errCheck:function(code, select){
        if (!select.miscCheckbox.allowactivex &&
             (/\.codebase|\.AXO|\.getAXO|\.ActiveX|ActiveXObject/).test(code.customModuleScript)
           )
              alert("Error: ActiveX code found in " + code.moduleName + " module");
    },

    // include:function(select){} tells us which other modules to include when using this module.
    //
    // We do not include $.win{} here because $.win{} is optional.
    // We do not include $.message/BOUNDARY because they are automatically removed as needed.
    include:function(){return [];}

}, // end of script{}

BOUNDARY1:"select.xtra.ev",



// [public]
// Add events to window.
// event = "load", "unload", etc...
addEvent: function(obj, event, handler){

  if (obj && event && handler)
  {
     if (obj.addEventListener){   // non-IE browsers
        obj.addEventListener(event, handler, false);
     }
     else if (obj.attachEvent){   // Internet Explorer
        obj.attachEvent("on"+event, handler);
     }
     // For outdated browsers
     else obj["on"+event] = this.concatFn(handler, obj["on"+event]);
  }
}, // end of addEvent()


// [public]
// Remove events from window.
removeEvent: function(obj, event, handler){

  if (obj && event && handler)
  {
     if (obj.removeEventListener){
        obj.removeEventListener(event, handler, false);
     }
     else if (obj.detachEvent){
        obj.detachEvent("on"+event, handler);
     }
  }
}, // end of removeEvent


// [private]
// Combine 2 functions into 1.
// We make this routine a separate function here to avoid scoping issues with IE.
//
// Input a is always a function
// Input b may or may not be a function
// a() is always executed before b().
//
// Note, we cannot use any methods or properties of $ here because this routine
// might call win.onUnload(), which may (or may not) delete all the properties of $.
concatFn: function(a, b){
  return function()
  {
     a();
     if (typeof b == "function") b();
  };
},



// [** PUBLIC **]
// Returns an event handler.
// It allows handler f to receive input arguments when called.
// We made this a PUBLIC routine, so we have at least 4 input args.
handler:function(f, arg1, arg2, arg3, arg4){
  return function(){f(arg1, arg2, arg3, arg4);};
},


// [public]
// Returns an event handler that only runs once.
handlerOnce:function(f, arg1, arg2, arg3){
  return function()
  {  var t =  $.uniqueName();
     if (!f[t]){f[t]=1;f(arg1, arg2, arg3);}
  };
},


// [public]
// Returns an event handler that has a delay.
handlerWait:function(delay, f, arg1, arg2, arg3){
  var ev=this;
  return function(){ev.setTimeout(ev.handler(f, arg1, arg2, arg3), delay);};
},



// [** PUBLIC **]
setTimeout:function(handler, interval){
  
  // We prevent any more handlers from running when window unloads,
  // but only if $.win{} module is in the customized script.
  if ($.win && $.win.unload) return;

  setTimeout(handler, interval);

},


// [public]
// Push fun onto array arr
// fun = function or array [function, arg1, arg2, arg3, ...]
fPush:function(fun, arr){

  if ( $.isArray(arr) &&
        ( $.isFunc(fun) || ($.isArray(fun) && fun.length>0 && $.isFunc(fun[0])) )
      ) arr.push(fun);

},


// [private]
// Execute event handler f or event handler f with arguments [f, arg1, arg2, arg3]
// Pass PluginDetect as first input argument
// We execute f(PluginDetect, arg1, arg2, arg3)
call0: function(f){

  var length=$.isArray(f)?f.length:-1; // if length>=0 then we have an array

  if (length>0 && $.isFunc(f[0]))
  {
      //  Note: .*? means non-greedy
      $.message.write("[ executing " +
         (
            (((/(function[^\(]*?\()/i).test(f[0].toString()) && (RegExp.$1).length<100) ?
               RegExp.$1 + " ){ }" : "function F( ){ }"
            )
         ) + " ]", $.message.end()
      );

      f[0]($, length>1?f[1]:0, length>2?f[2]:0, length>3?f[3]:0);

  }
  else if ($.isFunc(f))
  {
      //  Note: .*? means non-greedy
      $.message.write("[ executing " +
         (
            (((/(function[^\(]*?\()/i).test(f.toString()) && (RegExp.$1).length<100) ?
               RegExp.$1 + " ){ }" : "function F( ){ }"
            )
         ) + " ]", $.message.end()
      );
      
      f($);

  }
  
  $.message.write( (!$.isFunc(f) && !$.isArray(f)) || ($.isArray(f) && !$.isFunc(f[0])) ?
    "[ *** WARNING: function / event handler not found ]" : 0, $.message.end());


},  // end of call0()


// [private]
// Execute all event handlers in the input array arr.
callArray0: function(arr){

  var ev=this, f;

  if ($.isArray(arr))
  {
     // Note: we account for the possibility here that executing ev.call0(arr[0]) here
     // might itself cause callArray0(arr) to be called. To prevent any conflicts
     // arising from this situation (infinite recursion), we let f = arr[0], 
     // then delete arr[0] from the array, and then execute f().
     while(arr.length)
     {
        f = arr[0];

        // Delete item from arr[] before being executed
        arr.splice(0,1);

        // If the window.unload event fires,
        // then the ONLY event handlers allowed to run should be $.win.unloadHndlrs[].
        // This statement is most likely not needed, but we use it anyway just to be safe.
        if ($.win && $.win.unload && arr!==$.win.unloadHndlrs){}

        else {ev.call0(f);}

     }

  }

},  // end of callArray0()


// [public]
// Execute function f or function f with arguments [f, arg1, arg2, arg3]
// Pass PluginDetect as first input argument
// We execute f(PluginDetect, arg1, arg2, arg3)
call:function(f){

  var ev=this;
  
  ev.call0(f);
  
  ev.ifDetectDoneCallHndlrs();

},   // end of call()


// [public]
// Execute all event handlers in the input array arr[]
callArray:function(arr){

  var ev=this;

  ev.callArray0(arr);

  ev.ifDetectDoneCallHndlrs();

},  // end of callArray()


// [public]
// Array of event handlers to be executed when we are done with ALL other handlers
// (except those that may be called when the window.unload event fires).
allDoneHndlrs: [],


// [private]
// Check if ALL plugin detections have been completed,
// all handlers for $.onDetectionDone() and $.onWindowLoaded() have run.
// Check if ALL event handlers have run, except for $.ev.allDoneHndlrs[] and $.win.unloadHndlrs[].
// If so, then call event handlers in $.ev.allDoneHndlrs[].
ifDetectDoneCallHndlrs: function(){

  var ev=this, x, plugin;

  if (!ev.allDoneHndlrs.length) return;


  // $.win{} may or may not be present.
  if ($.win)
  {
    // We only run this routine after window has loaded
    if (!$.win.loaded ||

      // if $.win.loadPrvtHndlrs.length != 0 then functions in $.win.loadPrvtHndlrs have not run yet,
      // so we exit and come back later when all functions have run.
      $.win.loadPrvtHndlrs.length ||

      // if $.win.loadPblcHndlrs.length != 0 then functions in $.win.loadPblcHndlrs has not run yet,
      // so we exit and come back later when all functions have run.
      $.win.loadPblcHndlrs.length)

        return;

  }


  if ($.Plugins)
  {
    // Search for plugins that have DoneHndlrs[] arrays.
    // Make sure that all functions in the $.Plugins.pluginName.DoneHndlrs[] array have executed.
    // If they have not run yet, then we exit.
    for (x in $.Plugins)
    {
       if ($.hasOwn($.Plugins, x))
       {
         plugin = $.Plugins[x];

         // We check for plugin.getVersion to filter out any properties of $.Plugins
         // that we are not interested in.
         if (plugin && $.isFunc(plugin.getVersion))
         {
           // if NOTF detection is still running, then return
           if (plugin.OTF==3 ||

               // if DoneHndlrs[] array has items, then one or more functions in array have yet to run
               (plugin.DoneHndlrs && plugin.DoneHndlrs.length) ||
               
               (plugin.BIHndlrs && plugin.BIHndlrs.length)

              ) return;
         }

       }

    } // x loop
  }



  // If we get this far, then all plugin detections have been completed
  

  $.message.write("[ ]", $.message.end());
  $.message.write("[ START event handlers $.ev.allDoneHndlrs ]", $.message.end());

  ev.callArray0(ev.allDoneHndlrs);

  $.message.write("[ END event handlers $.ev.allDoneHndlrs ]", $.message.end());
  $.message.write("[ ]", $.message.end());
  $.message.write("[ " + $.message.time($) + " after script initialization ]", $.message.end());


},  // end of ifDetectDoneCallHndlrs()


// Property is automatically removed by Script Generator
lastProperty:"select.xtra.ev"


},   // end of ev{}


// ********************************** PUBLIC METHODS **********************************************



BOUNDARY770:"0",


isMinVersion_:{

 // This object assists in creating a custom version of the script for the user.
 script:{

    select:{methodCheckbox:{isminversion:"isMinVersion"}},

    target:function(){
       return $.isMinVersion;
    },

    errCheck:function(code, select){
        if (!select.miscCheckbox.allowactivex &&
             (/\.codebase|\.AXO|\.getAXO|\.ActiveX|ActiveXObject/).test(code.customModuleScript)
           )
              alert("Error: ActiveX code found in " + code.moduleName + " module");
    },

    checkboxLabel:{methodCheckbox:{isminversion:{
       text:function(){
         return $.name +
           ".isMinVersion(pluginName, minVersion) method: tells if plugin version is >= minVersion.";
       }
    }}},
    
    // include:function(select){} tells us which other modules to include when using this module.
    // Do not put $.message/BOUNDARY in the array[] here because they are automatically
    // included/removed from the script as needed.
    include:function(){
      return [$.pd];
    }

 } // end of script{}

},

BOUNDARY771:"select.methodCheckbox.isminversion",


// [** PUBLIC **]   $.isMinVersion()
// Determine status of plugin
//
// 1 if plugin installed/enabled and version >= minVersion
// 0.5 if plugin installed/enabled, but we must wait to get the plugin version
// 0 if plugin installed/enabled but unable to determine plugin version
// -0.1 if plugin installed, enabled, version<minversion
// -0.2 if plugin installed but not enabled
// -0.5 if plugin perhaps installed, but we must wait to get installed/version
// -1 if plugin not installed/enabled
// -1.5 if plugin status is unknown
// -3 if bad input arguments
//
// We save the results in memory, so that multiple requests can retrieve the
// result from memory. Also, this can prevent memory leaks (some plugins may
// have leak problems)
isMinVersion: function(pluginName, minVersion, arg1, arg2){

    var i = $.pd.findPlugin(pluginName), plugin, result = -1;

    $.message.write($.message.time($.isMinVersion,1), $.message.end());  // Start measuring time delay

    if (i.status<0) return i.status;  // Exit if pluginName is not valid

    plugin = i.plugin;


    // Make sure minVersion is a valid number and is properly formatted
    minVersion =
       $.formatNum(
           $.isNum(minVersion) ? minVersion.toString():
             ($.isStrNum(minVersion) ? $.getNum(minVersion) : "0")
        );

    $.message.write("[ ]", $.message.end());
    $.message.write("[ START " + $.name + ".isMinVersion(" + 
       $.message.args2String([pluginName, minVersion, arg1, arg2]) + ") ]", $.message.end());



    // When plugin.getVersionDone == 1, then getVersion() has been called and
    // does not need to be called again.
    //
    // if plugin.getVersionDone == 0, then getVersion() has been called but may need
    // to be called again.
    //
    // if plugin.getVersionDone == null, then getVersion() has never been called.
    //
    if (plugin.getVersionDone != 1)
    {

       plugin.getVersion(minVersion, arg1, arg2);

       // If the plugin.getVersion() routine has NOT changed the value of plugin.getVersionDone
       //  (ie. plugin.getVersionDone is still null) then let plugin.getVersionDone = 1.
       // if the plugin.getVersion() routine has set the value of plugin.getVersionDone
       //  (ie. plugin.getVersionDone !==null) then do not change plugin.getVersionDone.
       if (plugin.getVersionDone === null) plugin.getVersionDone = 1;


    }



    // In this case, plugin.getVersion() returned some kind of result
    if (plugin.installed !== null)
    {
            // plugin.installed >=-0.1 installed & enabled
            // plugin.installed < -0.1 not installed, or not enabled, or unknown, or must wait for result
            //
            // plugin.installed = 1     installed, enabled, version known
            // plugin.installed = 0.7   installed, enabled, version>=minversion, version may not be precisely known
            // plugin.installed = 0.5   installed, enabled, version unknown, wait for final result.
            // plugin.installed = 0     installed, enabled, version unknown,
            // plugin.installed = -0.1  installed, enabled, version<minversion, version may not be precisely known
            // plugin.installed = -0.2  installed, disabled.
            // plugin.installed = -0.5  wait for results, installed/enabled unknown, version unknown
            // plugin.installed = -1    not installed, or not enabled
            // plugin.installed = -1.5  unable to determine if installed & enabled
            // plugin.installed = -3    bad input argument
            result =
               plugin.installed <= 0.5 ? plugin.installed :

                (plugin.installed == 0.7 ? 1 :

                  // else plugin.installed == 1 (installed and enabled)
                  
                  // if version is unknown, then return 0
                  (plugin.version === null ? 0 :

                      // if version>=minversion, then return 1
                      // if version<minversion, then return -0.1
                     ($.compareNums(plugin.version, minVersion, plugin) >= 0 ? 1 : -0.1)

                   ));

    

    }


    $.message.write("[ END " + $.name + ".isMinVersion(" + $.message.args2String([pluginName, minVersion, arg1, arg2]) +
        ") == " + result + " in " + $.message.time($.isMinVersion) + " ]", $.message.end());

    $.message.write("[ " + $.message.time($) + " after script initialization ]", $.message.end());

    $.message.write("[ ]", $.message.end());

    return result;

},  // end of isMinVersion()


BOUNDARY772:"0",


getVersion_:{

 // This object assists in creating a custom version of the script for the user.
 script:{

    select:{methodCheckbox:{getversion:"getVersion"}},

    target:function(){
       return $.getVersion;
    },

    errCheck:function(code, select){
        if (!select.miscCheckbox.allowactivex &&
             (/\.codebase|\.AXO|\.getAXO|\.ActiveX|ActiveXObject/).test(code.customModuleScript)
           )
              alert("Error: ActiveX code found in " + code.moduleName + " module");
    },

    checkboxLabel:{methodCheckbox:{getversion:{
      text:function(){
         return $.name +
           ".getVersion(pluginName) method: returns the specific version of the installed plugin.";
      }
    }}},
    
    // include:function(select){} tells us which other modules to include when using this module.
    // Do not put $.message/BOUNDARY in the array[] here because they are automatically
    // included/removed from the script as needed.
    include:function(){
      return [$.pd];
    }

 } // end of script{}

},

BOUNDARY773:"select.methodCheckbox.getversion",


// [** PUBLIC **]   $.getVersion()
// Get the plugin version
//
// return null or string version
// A null value means we are unable to determine the value
//
// We save the results in memory, so that multiple requests can retrieve the
// result from memory. Also, this can prevent memory leaks (some plugins may
// have leak problems).
//
// We make sure that plugin.getVersion() is only called once.
getVersion: function(pluginName, arg1, arg2){

    var i = $.pd.findPlugin(pluginName), plugin, result;
    
    $.message.write($.message.time($.getVersion,1), $.message.end());  // Start measuring time delay

    if (i.status<0) return null; // error if unable to initialize

    $.message.write("[ ]", $.message.end());
    $.message.write("[ START " + $.name + ".getVersion(" + 
      $.message.args2String([pluginName, arg1, arg2]) + ") ]", $.message.end());

    plugin = i.plugin;


    // When plugin.getVersionDone == 1, then getVersion() has been called and
    //   does not need to be called again.
    // When plugin.getVersionDone == 0, then getVersion() has been called and
    //   can be called again.
    // if plugin.getVersionDone == null, then getVersion() has not been called yet.
    if (plugin.getVersionDone !=1)
    {
       plugin.getVersion(null, arg1, arg2);
      
       // If the plugin.getVersion() routine has not set plugin.getVersionDone 
       //    (ie. plugin.getVersionDone == null) then let plugin.getVersionDone = 1.
       // if the plugin.getVersion() routine has set plugin.getVersionDone = 0 then do not
       //    change the value of plugin.getVersionDone.
       // If a version has been found then set plugin.getVersionDone = 1.
       if (plugin.getVersionDone === null) plugin.getVersionDone = 1;

    }


    // plugin.version is the version for a plugin that is installed and enabled.
    // plugin.version0 is the version for a plugin that is installed but enabled or disabled.
    result = (plugin.version || plugin.version0);

    // Customize the output number token to be "." or "," or whatever
    result = result ? result.replace($.splitNumRegx, $.pd.getVersionDelimiter) : result;


    $.message.write("[ END " + $.name + ".getVersion(" + $.message.args2String([pluginName, arg1, arg2]) + 
       ") == " + $.message.args2String(result) + " in " + $.message.time($.getVersion) + " ]", 
       $.message.end());

    $.message.write("[ " + $.message.time($) + " after script initialization ]", $.message.end());

    $.message.write("[ ]", $.message.end());

    return result;

},  // end of getVersion()




BOUNDARY782:"0",

hasMimeType_:{

 // This object assists in creating a custom version of the script for the user.
 script:{

    select:{methodCheckbox:{hasmimetype:"hasMimeType"}},

    target:function(){
       return $.hasMimeType;
    },

    errCheck:function(code, select){
        if (!select.miscCheckbox.allowactivex &&
             (/\.codebase|\.AXO|\.getAXO|\.ActiveX|ActiveXObject/).test(code.customModuleScript)
           )
              alert("Error: ActiveX code found in " + code.moduleName + " module");
    },

    checkboxLabel:{methodCheckbox:{hasmimetype:{
      text:function(){
         return $.name + ".hasMimeType(mimetype) method: tells if browser supports the mimetype. " +
         "This is based on data from the navigator.mimeTypes[ ] array.";
      }
    }}}

 } // end of script{}

},


BOUNDARY783:"select.methodCheckbox.hasmimetype",


// [** PUBLIC **]   $.hasMimeType()
// Verify the presence of the mimeType in the navigator.mimeTypes array.
// Verify that the mimetype is associated with an enabled plugin object. 
// If so, then return that mimetype object.
// Else return null.
//
// We allow mime input to be a string or an array[] of strings.
// This way, with an array, when a particular plugin has more than one mimetype 
// associated with it, we can search for all those mimetypes, 
// just in case one of the mimetypes is missing (which sometimes can happen).
//
// This is a little bit sloppy, in that the missing mimetype may be the one
// we are actually using when writing the <object> tags to the page.
// However, we really only need to verify ANY of the input mimetypes just to
// verify that the plugin is installed.
//
// Note: this routine is NOT related to the canPlayType() method found in HTML5
// for the <video>/<audio> tags.
// Example...
//   var testEl = document.createElement( "video" ), mpeg4, typeStr;
//   if (testEl.canPlayType){
//        var typeStr = testEl.canPlayType( "video/mp4; codecs=\"mp4v.20.8\"" );
//        mpeg4 = typeStr !== "";
//   }
//
hasMimeType: function(mime){

    // *** I have to consider the navigator{} object to be hostile territory.
    // The behavior of the navigator{} object is not standardized.
    // Instead, its behaviour appears to be merely convention.
    // For this reason, we try to be conservative in how we handle this.
    // Also, this routine does not try to filter out any specific browser, it merely
    // uses object/feature detection.
    //
    // The IE browser traditionally never had anything in the navigator.mimeTypes[] array.
    // However, in IE 11/Win 8.1, I have seen some entries in the navigator.mimeTypes[]
    // and navigator.plugins[] array. So, for IE 11+, it is possible for that browser
    // to have items in the mimTypes[] and plugins[] arrays.
    

    // We check for existence of navigator.mimeTypes, but we do NOT
    // bother to check for navigator.mimeTypes.length. The reason
    // is that it may theoretically be possible for length==0, yet
    // navigator.mimeTypes["..."] still returns a value. It may be possible
    // that the browser hides the number of mimetypes it has, since it may
    // not enumerate all mimetypes (for security/privacy reasons).
    if (mime && window.navigator && navigator.mimeTypes)
    {

      var mimeObj, pluginObj, i,
      
        length, navigatorMimeTypes = navigator.mimeTypes, // use these to increase speed

        // copy to a new array, to protect the original from alteration.
        Mimes = $.isArray(mime) ? [].concat(mime) : ($.isString(mime) ? [mime] : []);

      $.message.write($.message.time($.hasMimeType,1), $.message.end());  // Start measuring time delay
      $.message.write("[ ]", $.message.end());

      $.message.write("[ Search for navigator.mimeTypes[" +
          $.message.args2String(Mimes) + "] ]", $.message.end());

      length = Mimes.length;
      for (i=0;i<length;i++)
      {
         // Make sure string is not empty
         // Make sure mimetype is associated with enabled plugin

         // We use try-catch here because we no longer assume that
         // navigator.mimeTypes["..."] is safe to use.
         mimeObj = 0;
         try{
           if ($.isString(Mimes[i]) && /[^\s]/.test(Mimes[i]))
              mimeObj = navigatorMimeTypes[Mimes[i]];
         }
         catch(e){}


         pluginObj = mimeObj ? mimeObj.enabledPlugin : 0;
           
         // Using (name OR descr) instead of (name AND desc) is a somewhat less
         // strict requirement.
         // However, I have seen a case where the description was not defined,
         // but the name was. So, if the mimetype is present and enabled and
         // either the description OR name is present, then that should be
         // enough.
         if (pluginObj && ( pluginObj.name || pluginObj.description ))
         {
             $.message.write("[ MimeType found: \"" + mimeObj.type + "\" in " + 
               $.message.time($.hasMimeType) + " ]", $.message.end());
             return mimeObj;  // plugin object found
         }

      }   // end of for loop

   }

   $.message.write("[ MimeType not found in " + $.message.time($.hasMimeType) + " ]", $.message.end());
   return null;

},  // end of hasMimeType()




BOUNDARY774:"0",

getInfo_:{

 // This object assists in creating a custom version of the script for the user.
 script:{

    select:{methodCheckbox:{getinfo:"getInfo"}},

    target:function(){
       return $.getInfo;
    },

    errCheck:function(code, select){
        if (!select.miscCheckbox.allowactivex &&
             (/\.codebase|\.AXO|\.getAXO|\.ActiveX|ActiveXObject/).test(code.customModuleScript)
           )
              alert("Error: ActiveX code found in " + code.moduleName + " module");
    },

    checkboxLabel:{methodCheckbox:{getinfo:{
      text:function(){
         var list = $.ABOUT.getListGetInfoPlugins();

         return $.name +
           ".getInfo(pluginName) method: returns an object with properties that " + 
           "reveals additional info on the plugin. " +

           (list.length ? "This only applies to " + "pluginName == \"" + 
             list.join("\", \"") + "\"." : "");
      }
  
    }}},

    // include:function(select){} tells us which other modules to include when using this module.
    // Do not put $.message/BOUNDARY in the array[] here because they are automatically
    // included/removed from the script as needed.
    include:function(){
      return [$.pd, [$.isMinVersion, $.getVersion]];
    }

 } // end of script{}

},

BOUNDARY775:"select.methodCheckbox.getinfo",

// [** PUBLIC **]  $.getInfo()
getInfo: function(pluginName, arg1, arg2){

    var result = null, i=$.pd.findPlugin(pluginName), plugin, tmp;

    if (i.status<0) return result; // error if unable to initialize

    $.message.write($.message.time($.getInfo,1), $.message.end());  // Start measuring time delay
    
    $.message.write("[ ]", $.message.end());
    $.message.write("[ START " + $.name + ".getInfo(" +
      $.message.args2String([pluginName, arg1, arg2]) + ") ]", $.message.end());

    plugin = i.plugin;

    if ($.isFunc(plugin.getInfo))
    {
       // We need to have called plugin.getVersion() before plugin.getInfo() is called.
       // If plugin.getVersionDone === null then plugin.getVersion() was never called.
       // Either $.getVersion() and/or $.isMinversion() exists.
       if (plugin.getVersionDone === null){
           tmp = $.getVersion ? $.getVersion(pluginName, arg1, arg2) :
                     $.isMinVersion(pluginName, "0", arg1, arg2);
       }

       result = plugin.getInfo();
  
    }

    $.message.write("[ END " + $.name + ".getInfo(" + $.message.args2String([pluginName, arg1, arg2]) + ") in " + 
        $.message.time($.getInfo) + " ]", $.message.end());

    return result;

},  // end of getInfo()



BOUNDARY778:"0",

onDetectionDone_:{

 // This object assists in creating a custom version of the script for the user.
 script:{

    select:{methodCheckbox:{ondetectiondone:"onDetectionDone"}},

    target:function(){
       return $.onDetectionDone;
    },

    errCheck:function(code, select){
        if (!select.miscCheckbox.allowactivex &&
             (/\.codebase|\.AXO|\.getAXO|\.ActiveX|ActiveXObject/).test(code.customModuleScript)
           )
              alert("Error: ActiveX code found in " + code.moduleName + " module");
    },

    checkboxLabel:{methodCheckbox:{ondetectiondone:{
      text:function(){
         return $.name + ".onDetectionDone(pluginName, f) method: will execute the " +
         "event handler f when the detection of the plugin has been completed. " + 
         "This method can handle both OTF and NOTF plugin detection.";
      }
    }}},

    // include:function(select){} tells us which other modules to include when using this module.
    // Do not put $.message/BOUNDARY in the array[] here because they are automatically
    // included/removed from the script as needed.
    include:function(){
      return [$.pd, $.ev, [$.isMinVersion, $.getVersion]];
    }
 } // end of script{}

},


BOUNDARY779:"select.methodCheckbox.ondetectiondone",


// [** PUBLIC **]   $.onDetectionDone()
// This method excutes function f when plugin detection has been completed.
// This way the plugin result is available to function f.
//
// In the case where we have to wait for a Java applet to load and run (in order
// to get the Java detection result), we determine the Java JRE status by
// polling an applet every 250ms and also by polling when window.onload fires.
//
// Return 1 if detection is done (OTF detection completed).
// Return 0 if detection not done yet (NOTF detection underway).
// Return -1 if plugin name is not recognized.
onDetectionDone: function(pluginName, f, arg1, arg2){

   var i = $.pd.findPlugin(pluginName), z, plugin;

   // Exit if pluginName is not valid
   if (i.status == -3) return -1;

   plugin = i.plugin;



   // The presence of plugin.DoneHndlrs tells us that onDetectionDone() has been run
   // for this plugin.
   // DoneHndlrs[] array of functions is executed after detection of plugin has completed.
   if (!$.isArray(plugin.DoneHndlrs))
   { 
      plugin.DoneHndlrs = [];
     
      // We add a time measurement to plugin.DoneHndlrs, in case the detection is NOTF
      $.message.write($.message.time(plugin.DoneHndlrs,1), $.message.end()); // Start measuring time delay for NOTF detection

   }


   // We add a time measurement to onDetectionDone(), in case the detection is OTF
   $.message.write($.message.time($.onDetectionDone,1), $.message.end()); // Start measuring time delay for OTF detection

   $.message.write("[ ]", $.message.end());
   $.message.write("[ START " + $.name + ".onDetectionDone(" + 
     $.message.args2String([pluginName, f, arg1, arg2]) + ") ]", $.message.end());


   $.message.write( (!$.isFunc(f) && !$.isArray(f)) || ($.isArray(f) && !$.isFunc(f[0])) ?
     "[ *** WARNING: no valid event handler was specified for the onDetectionDone( ) method ]" : 0, 
     $.message.end());



   // If getVersionDone == null, then detection was never done, so try to detect plugin.
   //
   // If getVersionDone == 0, then detection was attempted but is still permitted,
   //    so try to detect again. This applies to Java.
   //
   if (plugin.getVersionDone != 1)
       // We check to make sure that isMinVersion() exists first. If not, then use getVersion().
       //  z = $.isMinVersion ?
       //     $.isMinVersion(pluginName, "0", arg1, arg2) : $.getVersion(pluginName, arg1, arg2);

       // We check to make sure that getVersion() exists first. If not, then use isMinVersion().
       // There is a specific reason why we choose this particular order...
       //
       // For IE, suppose the plugin being detected requires the codebase detection method.
       // In that case, it is faster to use getVersion() FIRST and THEN use isMinVersion()
       // afterwards in the event handler. The reason is that getVersion gives you the full
       // version and stores the result, so any subsequent isMinVersion/getVersion simply
       // looks up that stored result.
       // It is probably slower to use isMinVersion() first and then use getVersion() in the
       // event handler.
       //
       // Tip: if it is possible for the end user, they should NOT select the getVersion()
       // method on the PluginDetect download page. Select the isMinVersion() instead.
       // This will make IE detection for QuickTime/Java a little bit faster in some cases,
       // due to codebase detection of those plugins.
       //
       z = $.getVersion ?
             $.getVersion(pluginName, arg1, arg2) :
             $.isMinVersion(pluginName, "0", arg1, arg2);




   // At this point, plugin detection has already been attempted.


   // If plugin detection has been performed, and we got a result
   // then just execute function f immediately. This is only for OTF detection,
   // hence we cannot have -0.5 or +0.5.
   if (plugin.installed != -0.5 && plugin.installed != 0.5)
   {

           $.message.write("[ END " + plugin.pluginName + " detection for " + $.name + ".onDetectionDone(" + $.message.args2String([pluginName, f, arg1, arg2]) +
              ") in " + $.message.time($.onDetectionDone) + " ]", $.message.end());

           $.message.write("[ ]", $.message.end());

           $.message.write($.message.time($.onDetectionDone,1), $.message.end());  // Start measuring time delay

           $.message.write("[ START event handler " + $.message.args2String([f]) + " for " + $.name + ".onDetectionDone(" +
              $.message.args2String([pluginName, f, arg1, arg2]) + ") ]", $.message.end());

           $.ev.call(f);

           $.message.write("[ END event handler " + $.message.args2String([f]) + " for " + 
              $.name + ".onDetectionDone(" +
              $.message.args2String([pluginName, f, arg1, arg2]) + 
              ") in " + $.message.time($.onDetectionDone) + " ]", $.message.end());
              
           $.message.write("[ ]", $.message.end());

           return 1;     // Detection is done
   }


   // At this point, plugin detection has been attempted but we do not have a result
   // yet. We are using NOTF detection if we get this far.
   //
   // Note: it should only be possible for plugin.installed == -0.5 or +0.5 when the plugin
   // has NOTF code within it. Hence, we do not check here if a plugin.NOTF{} object exists.
   // Also, it is possible that the NOTF code may be in a differently named object anyway,
   // and the $.onDetectionDone routine should not have to be aware of the internal structure
   // of the plugin{} object anyway.

   // f is an event handler
   $.ev.fPush(f, plugin.DoneHndlrs);
   return 0;          // Detection is not done yet (NOTF)

},   // end of onDetectionDone()



BOUNDARY780:"0",

onWindowLoaded_:{

 // This object assists in creating a custom version of the script for the user.
 script:{

    select:{methodCheckbox:{onwindowloaded:"onWindowLoaded"}},

    target:function(){
       return $.onWindowLoaded;
    },

    errCheck:function(code, select){
        if (!select.miscCheckbox.allowactivex &&
             (/\.codebase|\.AXO|\.getAXO|\.ActiveX|ActiveXObject/).test(code.customModuleScript)
           )
              alert("Error: ActiveX code found in " + code.moduleName + " module");
    },

    checkboxLabel:{methodCheckbox:{onwindowloaded:{
      text:function(){
         return $.name + ".onWindowLoaded( f ) method: will execute the event handler f " + 
         "when the browser window has loaded.";
      }
    }}},

    // include:function(select){} tells us which other modules to include when using this module.
    // Do not put $.message/BOUNDARY in the array[] here because they are automatically
    // included/removed from the script as needed.
    include:function(){
      return [$.ev, $.win];
    }
 } // end of script{}

},

BOUNDARY781:"select.methodCheckbox.onwindowloaded",

// [** PUBLIC **]  $.onWindowLoaded()
onWindowLoaded: function(f){

    $.message.write("[ ]", $.message.end());
    $.message.write("[ Run " + $.name + ".onWindowLoaded(" + 
       $.message.args2String([f]) + ") ]", $.message.end());

    if ($.win.loaded){     // if window already loaded, then just execute f

      $.message.write("[ START event handler " + $.message.args2String([f]) +
           " for " + $.name + ".onWindowLoaded(" + $.message.args2String([f]) + ") ]", $.message.end());
      $.ev.call(f);
      $.message.write("[ END event handler " + $.message.args2String([f]) +
           " for " + $.name + ".onWindowLoaded(" + $.message.args2String([f]) + ") ]", $.message.end());

    }
    
    // f is an event handler
    else $.ev.fPush(f, $.win.loadPblcHndlrs);  // push the function f onto array $.win.loadPblcHndlrs

},   // end of onWindowLoaded()



BOUNDARY776:"0",

onBeforeInstantiate_:{

 // This object assists in creating a custom version of the script for the user.
 script:{

    select:{methodCheckbox:{onbeforeinstantiate:"onBeforeInstantiate"}},

    target:function(){
       return $.onBeforeInstantiate;
    },

    errCheck:function(code, select){
        if (!select.miscCheckbox.allowactivex &&
             (/\.codebase|\.AXO|\.getAXO|\.ActiveX|ActiveXObject/).test(code.customModuleScript)
           )
              alert("Error: ActiveX code found in " + code.moduleName + " module");
    },

    checkboxLabel:{methodCheckbox:{onbeforeinstantiate:{
      text:function(){
         return $.name + ".onBeforeInstantiate(pluginName, f) method: will execute the " + 
         "event handler f immediately before an attempt is made to run the plugin. " + 
         "(Note: sometimes it is necessary to start up the plugin in order to detect that plugin).";
      }
    }}},


    // include:function(select){} tells us which other modules to include when using this module.
    // Do not put $.message/BOUNDARY in the array[] here because they are automatically
    // included/removed from the script as needed.
    include:function(){
      return [$.pd, $.ev];
    }
 } // end of script{}

},

BOUNDARY777:"select.methodCheckbox.onbeforeinstantiate",


// [** PUBLIC **]  $.onBeforeInstantiate()
// Before a plugin is attempted to be instantiated, we run function f.
onBeforeInstantiate: function(pluginName, f){

    var i = $.pd.findPlugin(pluginName), plugin = i.plugin;

    if (i.status == -3) return;  // Exit if pluginName is not valid

    $.message.write("[ run " + $.name + ".onBeforeInstantiate(" +
      $.message.args2String([pluginName, f]) + ") ]", $.message.end());

    // BIHndlrs stands for "Before Instantiated Event Handlers".
    // BIHndlrs[] array of handlers is executed right before a plugin is instantiated.
    if (!$.isArray(plugin.BIHndlrs)) plugin.BIHndlrs = [];

    // f is an event handler
    $.ev.fPush(f, plugin.BIHndlrs);  // push the function f onto array plugin.BIHndlrs

},  // end of onBeforeInstantiate()





// ********************************* end of PUBLIC METHODS ************************************


// ********************************************************************************************
/*

 This section of code is used by the codebase plugin detection method.
 It is used for Internet Explorer 7+.




 With the introduction of Internet Explorer 7, it has become more difficult
 to do plugin detection for certain plugins using Javascript. The reason for this is that
 Internet Explorer 7 (and higher) gives a security popup when attempting to 
 instantiate many ActiveX Objects.

 For example, to detect the QuickTime plugin version we would normally use
 ActiveXObject("QuickTimeCheckObject.QuickTimeCheck.1").
 Unfortunately, IE 7+ gives a security popup for the instantiation of that
 ActiveXObject. This security warning goes away when the user clicks on it,
 and then never returns. However, we cannot absolutely rely on a user
 giving permission to instantiate such an ActiveXObject.

 Here is a more detailed explanation:
 http://blogs.msdn.com/ie/archive/2007/04/25/this-website-wants-to-run-the-following-add-on.aspx
 http://informationgift.com/2006/10/ie7_imminent_plugin_detection.html

 It is also more difficult to detect the presence of Sun/Oracle Java in IE 7+,
 again due to the security popups when attempting to instantiate various
 ActiveXObjects from javascript.

 A fresh install of WinXP with IE 7 in Virtual PC confirms these security popups.

 Due to these challenges, we came up with a new detection method, that relies on
 a classid that is most likely to already be security approved, and hence should not give 
 any popup. This is called the codebase detection method.


 The codebase detection method is as follows:

   1) Insert a dummy <object> tag into a <div>.
    The <object> tag will instantiate the plugin in question by specifying
    the appropriate classid. We add a specific codebase to this <object> tag
    such that codebase = "#version=....". We assume here that the classid
    is for a security approved ActiveX object.
    
   [Note:
       It is no longer necessary to insert the <object> tag into the DOM.
       We can do the following:
       var div = document.createElement("div")
       div.innerHTML = "<object classid='...' codebase='...'></object>"
   ]

   2) We then check the "object" property of the <object> tag.
   If the "object" property is an object, then the installed plugin version
   exceeds the version specified in the codebase.
   We do not have to wait for the page to fully load to check this "object"
   property. We can check it immediately after writing the <object> to the <div>.
   This is a huge advantage for PluginDetect!
   This technique is probably NOT well known by most people.

   3) By repeatedly writing <object> tags with different codebase versions to the
   page we can iteratively determine the exact plugin version.

   4) This technique is a generic plugin detector for IE, and can be used when
   other standard techniques fail.


 The codebase detection method only works with <object> tags for IE 5.5+.
 However, I would guess that newer versions of IE are more reliable, and hence we should
 perhaps limit this codebase technique to IE 7+ or so.


---------------------------------------------------------

 How is the codebase detection method any better than loading some dummy applet/movie,
 and then querying the applet/movie to get the plugin version?

 1) When you insert an <object> (which specifies a source applet/movie) into a document,
 you have to load an external movie file from the server. The codebase technique
 does not require that.

 2) When you insert an <object> (which specifies a source applet/movie) into a document,
 you cannot immediately query the applet/movie for the plugin version. Hence,
 you need to delay until the window loads, or you have to query the movie at certain
 intervals until the movie is initialized. This is very awkward.

 Our codebase technique can determine the plugin version immediately after 
 the <object> has been written. So there is no need for setTimeout() or 
 window.onload.

 3) If you only want to know if the plugin version is at least some minimum version,
 our codebase technique only starts up/initializes the plugin if the version is >
 minversion. In using a dummy movie/applet, the plugin will always need to start
 up - regardless of whether version is greater or less than the minversion.
 
 4) The codebase method gives a finer more precise output version than other
 methods. Probably you do not need that info, but it is there.
 For instance, the usual methods for QuickTime may give a version of 7,1,6,0
 whereas the codebase method can yield a version of 7,1,6,200.


-----------------------------------------------------------------------

  NOTE: The following issues deal with my codebase detection method.

  There are a few issues in this detection script relating to
  inserting and deleting <object> tags into the document.

  1) When we use javascript to delete an <object> tag (with an instantiated
     ActiveX control) from the DOM, and
     it's readyState != 4, then IE may not allow the onload event to fire for the
     window object. This is because even after we remove the <object> tag
     from the DOM, there is some reference in memory to this object tag.
     Javscript does not let go of object references in memory right away.
     We CAN call the Microsoft CollectGarbage() routine that would eliminate these
     objects from memory, but CollectGarbage() is not a standard ECMA approved routine,
     and Microsoft recommends that we do not use it.

     [Example. Sun JRE 1.3.1.2, JRE 1.2.2.17 
     have a tendency to have readyState == 1 for an instantiated object tag, 
     ie. obj["object"]==object.
     Hence, we force the garbage collector to run after plugin detection is done.]

     [When an <object> tag in a document has readyState==number && readyState < 4, 
     then the onload event for the window/body objects may not fire for IE]


     We can, however, add/delete the <object> tags from the DOM using VBScript so
     that the garbage is collected immediately. VBScript removes garbage
     immediately after a routine has finished. Hence VBScript has no need for an
     explicit garbage collection method.

   Pocket IE PC does not have VBScript capability. Also, it may be possible
   that some people may not have VBScript installed on their system.
   So, we should perhaps have a backup where inserting/deleting object tags
   is done with Javacript.


   2) Another issue is that when I insert an <object> tag into the <div>, perhaps I should
   do so WITHOUT the classid. After the tag has been inserted, THEN set the classid
   attribute. Supposedly this should be more reliable when inserting object tags with
   ActiveX controls.

   See http://msdn2.microsoft.com/en-us/library/ms537508.aspx
   The interesting quote: "When using createElement to add an Object or Embed
   element to a web page, use care to create the element, initialize its
   attributes, and add it to the page's DOM before creating the ActiveX control
   to be loaded by the new element. For more information, please see the
   createElement documentation."

   However, for the most part this does not really seem to be neccessary.


   3) We cannot insert <object> tags into the <div> using DOM methods.
   The codebase detection method does not work with DOM methods (ie.
   we createElement("object"), set its codebase, set its classid, and insert
   into the <div>.)
   For the purpose of only adding <object> tags to the <div>, we therefore use innerHTML.



*/


// Note: the entire codebase{} object is filtered out when allowactivex==false
BOUNDARY8:"select.xtra.codebase && select.miscCheckbox.allowactivex",

// Search the IE codebase to get the plugin version
codebase:{


BOUNDARY0:"0",

// This object assists in creating a custom version of the script for the user.
script:{

    select:{xtra:{codebase:"codebase"}},

    // include:function(select){} tells us which other modules to include when using this module.
    // Do not put $.message/BOUNDARY in the array[] here because they are automatically
    // included/removed from the script as needed.
    include:function(select){
      return (

           // When select.miscCheckbox.allowactivex == false, we include an empty array[].
           // The reason for this is because when allowactivex == false, the entire
           // codebase{} object is filtered out, and thus all of its includes{} are also
           // filtered out as well.
           // This way, the script is smaller when allowactivex == false.
           select.miscCheckbox.allowactivex ? [$.pd, $.ev, $.win, $.DOM] : []);
    }
}, // end of script{}

BOUNDARY1:"select.xtra.codebase && select.miscCheckbox.allowactivex",


// [public]
//
// The codebase{} object is based on using the <object>.object property in Internet Explorer
// to detect a plugin.
//
// To see if the codebase{} object is allowed to be used or not, we first check if
// ActiveX is enabled. If ActiveX is disabled, we could get a security popup in IE 6+ when
// attempting to use an <object> tag. In that case, we avoid running this
// routine to avoid the popups. Anyway the <object> tag would not work.
//
// Secondly, we check to see if the <object> tag has an "object" property that is defined
// or not. If it is defined, then codebase{} may be used. (ie. for an empty <object> tag,
// the object property will be null)
//
// Note: we do not need to look at $.browser.isIE or $.browser.verIE here. So we
// are independent of browser detection.
//
// Note: for IE 9+, ActiveX Filtering is possible. ActiveX filtering does not
// disable the <object> tag, and it does not disable all ActiveX controls.
// There are some ActiveX controls that still run, even when filtering is on.
// Therefore, we do not disable codebase detection when $.ActiveXFiltering is true.
// ActiveX filtering does not cause the <object> tag to have popups either.
//
// Note: we only look at the <object> tag.
// The <applet> tags has an object property, but it has no codebase version, and so
// it cannot be used for plugin version detection.
// The <embed> tag has no object property, and so cannot be used.
isDisabled: function(){

  if ($.browser.ActiveXEnabled &&

     $.isDefined($.pd.getPROP(document.createElement("object"), "object"))) return 0;

  return 1;

},



// [public]
//
// Return 1 if plugin version >= minversion and plugin installed/enabled, using codebase detection.
// Return -1 if plugin version < minversion and plugin installed/enabled, using codebase detection.
// Return 0 if we were not able to use codebase detection, or plugin not installed/enabled,
//   so answer is unknown.
//
// @codebase is the codebase{} object from a plugin.
// @minversion is the minimum PLUGIN version, not the minimum codebase version.
// @checkInstalledFirst is optional input. If == 1/true, then we check if plugin is installed
//    at all before proceeding with the detection. This will guarantee only ONE attempted
//    instantiation if plugin is not installed/not enabled/blocked.
//
// This method sets the values of:
//   codebase{min:{}, max:{}, L:{}, tagA:{} tagB:{}}
isMin: function(codebase, minversion, checkInstalledFirst){
  var CODEBASE=this,
     x, minversionCodeBase, result=0;


/*
  Note: $.getVersion() can cause codebase.search() to be called.
        $.isMinVersion() can cause codebase.isMin() to be called.
        
        However, $.getVersion() may also cause codebase.isMin() to be called
        when we have a line of code like this...
             if (codebase.isMin("...")>0) codebase.search();

        For this reason, we do NOT remove the codebase.isMin() stuff when $.isMinVersion()
        is removed from the script via the Script Generator.
        (ie. when select.methodCheckbox.isminversion is false).

        Also, $.isMinVersion() may cause codebase.search() to be called.

        For this reason, we do NOT remove codebase.search() stuff to be removed via the
        Script Generator.

*/


//  BOUNDARY("select.xtra.codebase && select.miscCheckbox.allowactivex && select.methodCheckbox.isminversion");


  if (!$.isStrNum(minversion) || CODEBASE.isDisabled()) return result;

  CODEBASE.init(codebase);



  $.message.write("[ ]", $.message.end());
  $.message.write("[ START codebase.isMin(" + $.message.args2String([minversion]) +
    ") for " + codebase.$$.pluginName + " (Internet Explorer) ]", $.message.end());
  $.message.write($.message.time(CODEBASE.isMin,1), $.message.end());  // Start measuring time delay


  // if !checkInstalledFirst then proceed.
  // if checkInstalledFirst and plugin installed then proceed.
  if (!checkInstalledFirst || CODEBASE.isActiveXObject(codebase, $.formatNum(codebase.DIGITMIN.join(","))))
  { // if installed

     // Find the lowest value of x such that codebase.Lower[x] instantiates an ActiveX object.
     // This section of code only needs to run once, and then the result is saved
     // in codebase.L ={x:x, v:"version"}
     if (!codebase.L)
     {
        codebase.L={};
        for (x=0;x<codebase.Lower.length;x++)
        {
           if (CODEBASE.isActiveXObject(codebase, codebase.Lower[x]))
           {
              // codebase.L = {x:x, v:"version"}
              codebase.L = CODEBASE.convert(codebase, codebase.Lower[x]);
              break;
           }
        }
     }


     // At this point, the codebase.L{} object always exists.


     // If codebase.L.x < 0 or !codebase.L.v, then Codebase method will not work in this case.
     // Very old versions of plugin may not be compatible with the codebase method.
     // Or plugin is not installed.
     //
     // If codebase.L.v exists, then codebase method is working for this plugin
     // and plugin is installed.
     if (codebase.L.v)
     {
        // convert minversion to a codebase
        minversionCodeBase = CODEBASE.convert(codebase, minversion, 1);

        $.message.write(minversionCodeBase.x >= 0 ?
          "[ plugin minversion " + $.message.args2String([minversion]) + " corresponds to codebase " +
          $.message.args2String([minversionCodeBase.v]) + " ]"
          : 0, $.message.end()
        );

        // result found
        if (minversionCodeBase.x >= 0) result =
          (codebase.L.x == minversionCodeBase.x ?
             CODEBASE.isActiveXObject(codebase, minversionCodeBase.v) :
               $.compareNums(minversion, codebase.L.v)<=0
          ) ? 1 : -1;

     }


  } // if installed


  $.message.write("[ codebase.min: " + codebase.min + " ]", $.message.end());
  $.message.write("[ codebase.max: " + codebase.max + " ]", $.message.end());
  $.message.write("[ codebase.version: " + codebase.version + " ]", $.message.end());


  $.message.write("[ END codebase.isMin(" + $.message.args2String([minversion]) +
     ") == " + $.message.args2String([result]) +
     " for " + codebase.$$.pluginName + " (Internet Explorer) in " + 
     $.message.time(CODEBASE.isMin) + " ]", $.message.end());
  $.message.write("[ ]", $.message.end());



//  BOUNDARY("select.xtra.codebase && select.miscCheckbox.allowactivex");


  return result;


}, // end of isMin()



// [public]
//
// Search for the IE codebase version number for a given plugin,
//   convert codebase version to plugin version, and return the result.
//
// Return string version if plugin is installed and we get a result.
// Return null if no result.
//
// @codebase is the codebase{} object from a plugin.
// @checkInstalledFirst is optional input. If == 1/true, then we check if plugin is installed
//    at all before proceeding with the detection. This will guarantee only ONE attempted
//    instantiation if plugin is not installed/not enabled/blocked.
//
// The string is of the format aa,bb,cc,dd
//
// This routine was written in a manner so as to minimize the number of instantiated
// plugin objects.
//
// This method sets the values of:
//   codebase{searchHasRun:{}, version:{}, min:{}, max:{}, tagA:{} tagB:{}}
search: function(codebase, checkInstalledFirst){

  var CODEBASE=this, plugin=codebase.$$, installed=0, exit;


//  BOUNDARY("select.xtra.codebase && select.miscCheckbox.allowactivex && select.methodCheckbox.getversion");


  exit = codebase.searchHasRun || CODEBASE.isDisabled() ? 1 : 0;
  codebase.searchHasRun = 1;
  if (exit) return codebase.version || null;  // return string version/null


  CODEBASE.init(codebase);


  $.message.write("[ ]", $.message.end());
  $.message.write("[ START codebase version search for " + 
    plugin.pluginName + " (Internet Explorer) ]", $.message.end());
  $.message.write($.message.time(CODEBASE.search,1), $.message.end());  // Start measuring time delay


  // Keep track of attempted instantiations
  $.message.write((CODEBASE.search.AXO1=0) ? 0 : 0, $.message.end());

  // Keep track of successful instantiations
  $.message.write((CODEBASE.search.AXO2=0) ? 0 : 0, $.message.end());


  $.message.write(checkInstalledFirst && CODEBASE.search.AXO1++ ? 0 : 0, $.message.end());


  // if !checkInstalledFirst then proceed.
  // if checkInstalledFirst and plugin installed then proceed.
  if (!checkInstalledFirst || CODEBASE.isActiveXObject(codebase, $.formatNum(codebase.DIGITMIN.join(","))))
  { // if installed


  $.message.write(checkInstalledFirst && CODEBASE.search.AXO2++ ? 0 : 0, $.message.end());


  var x, y, z,

   DIGITMAX=codebase.DIGITMAX, lowVersion, highVersion,
   
   // We choose bigNum to be > than any digit found in codebase.Upper[x] or codebase.Lower[x]
   bigNum=99999999,
   
   // Lower bound for EACH digit of our search for the codebase version.
   lower=[0,0,0,0],

   // Upper bound for EACH digit of our search for the codebase version.
   upper=[0,0,0,0];

  
  var testDigit = function(x, z){

       var version=[].concat(lower), tmp;
       version[x]=z;

       $.message.write("[ testing:[" + version + "] lower bound:[" + lower + 
         "] upper bound:[" + upper + "] ]", $.message.end());

       // Uncomment the next line for testing purposes only
       // return $.compareNums("0,0,0,0", version.join(",")) >=0 ? true : false;

       tmp = CODEBASE.isActiveXObject(codebase, version.join(","));

       $.message.write(CODEBASE.search.AXO1++ ? 0 : 0, $.message.end());
       if (tmp)
       {
         $.message.write(CODEBASE.search.AXO2++ ? 0 : 0, $.message.end());
         installed = 1;
         lower[x] = z;
       }
       else upper[x] = z;

       return tmp;

   }; // end of testDigit()




  // NOTE: We assume in this routine that codebase.DIGITMAX[x], codebase.max, and codebase.min all
  // have the same number of digits (which is 4).


  $.message.write("[ VersionMin:" + (codebase.min ? codebase.min : "null") +
     " VersionMax:" + (codebase.max ? codebase.max : "null") + " ]", $.message.end());



  $.message.write("[ We search between lower and upper bounds ]", $.message.end());


// -------------------------------------------

  // Search algorithm for each codebase digit
  //
  // If upper[x]-lower[x] > 16, then next digit[x] to test is Math.round((upper[x] + lower[x])/2)
  // If upper[x]-lower[x] <= 16, then next digit[x] to test is upper[x]-1
  //
  // The idea here is that an <object> tag that instantiates takes
  // much longer to occur than an <object> tag that does not instantiate.
  // For this reason, when the upper[x]-lower[x] gets below a certain level, 
  // we then complete the search by decrementing the codebase by 1 number at a time.
  // This reduces the number of instantiations for each digit.
  for (x=0;x<upper.length;x++)
  {
    
    // Set the value for lower[x].
    // If DIGITMIN[x] is undefined, then that implies 0.
    lower[x] = Math.floor(codebase.DIGITMIN[x]) || 0;

    lowVersion=lower.join(",");
    
    // lower.slice(0,x) means we keep the codebase digits that have been found so far.
    // concat([]) means that the remaining digits that have not been found yet receive big numbers.
    // slice(0,lower.length) means we keep the number of digits the same as lower[].
    //
    // We choose bigNum to be > than any digit found in Upper[x] or Lower[x]
    highVersion=lower.slice(0,x).concat([bigNum,bigNum,bigNum,bigNum]).slice(0,lower.length).join(",");


    // Find the value for upper[x].
    //
    // If we can find xmin such that Lower[xmin] <= lowVersion, highVersion < Upper[xmin],
    //     then upper[x] = codebase.DIGITMAX[xmin][x]
    // Else, upper[x] = maximum value of codebase.DIGITMAX[][x]
    for (z=0;z<DIGITMAX.length;z++)
    {
       // Sometimes, DIGITMAX[z] will be not be an array, so we check for that.
       if ($.isArray(DIGITMAX[z]))
       {
         // In case DIGITMAX[z].length < upper[x].length, we add extra 0's.
         DIGITMAX[z].push(0);

         // Assign a value to upper[x] for a given x.
         // We use the largest value of DIGITMAX[z][x] within a range of z.
         //
         // Given that lowVersion <= highVersion, we can see that there will always
         // be at least one value of z for which
         //   $.compareNums(highVersion, codebase.Lower[z]) >= 0 &&
         //   $.compareNums(lowVersion, codebase.Upper[z]) < 0
         // And hence upper[x] will always receive a value, assuming that DIGITMAX[z][x] > 0.
         if (DIGITMAX[z][x] > upper[x] &&
             $.compareNums(highVersion, codebase.Lower[z])>=0 &&
             $.compareNums(lowVersion, codebase.Upper[z])<0)
                upper[x] = Math.floor(DIGITMAX[z][x]);


       }
    }

    for (y=0;y<30;y++)
    {
       if (upper[x]-lower[x] <= 16)
       {
          // Decremental search of Digit x
          //
          // Note:
          //   for x=0, we have z>=lower[x]
          //   for x>0, we have z>=lower[x]+1.
          //   This reduces the number of instantiations in certain cases.
          for (z=upper[x];z>=lower[x]+(x?1:0);z--)
          {
             if (testDigit(x, z)) break;
          }

          break;
       }
       
      
       testDigit(x,

          Math.round((upper[x] + lower[x])/2)

         // (upper[x]-lower[x] > 64 ? Math.round((upper[x] + lower[x])/2) : upper[x]-16)

       );

    }

    if (!installed) break;    // unable to find version
    
    upper[x] = lower[x];

    $.message.write("[ Digit " + x + " found: " + lower + 
        " after " + $.message.time(CODEBASE.search) + " ]", $.message.end());
        
    $.message.write("[ ]", $.message.end());


  }   // end of x loop



// ------------------------------------


  // get codebase number and convert to plugin version number
  if (installed) codebase.version = CODEBASE.convert(codebase, lower.join(",")).v;


  $.message.write("[ codebase.min: " + codebase.min + " ]", $.message.end());
  $.message.write("[ codebase.max: " + codebase.max + " ]", $.message.end());
  $.message.write("[ codebase.version: " + codebase.version + " ]", $.message.end());
  

  $.message.write(installed ? "[ " + plugin.pluginName + " codebase version \"" + lower.join(",") +
    "\" detected, corresponds to plugin version \"" +
    CODEBASE.convert(codebase, lower.join(",")).v + "\" ]" : 0, $.message.end());


  } // if installed
  


  $.message.write("[ Attempted ActiveX instantiations: " + CODEBASE.search.AXO1 + " ]", $.message.end());
  $.message.write("[ Successful ActiveX instantiations: " + CODEBASE.search.AXO2 + " ]", $.message.end());



  $.message.write("[ END codebase version search for " + plugin.pluginName + " (Internet Explorer) in " +
    $.message.time(CODEBASE.search) + " ]", $.message.end());
  $.message.write("[ ]", $.message.end());



//  BOUNDARY("select.xtra.codebase && select.miscCheckbox.allowactivex");

  return codebase.version || null;  // return string version/null


},  // end of search()



// [private]
emptyNode: function(node){

  try{node.innerHTML = "";}
  catch(e){}

},


// [private]
// Contains instantiated codebase objects.
//
// {span:<span><object codebase="..."></object></span>, ...}
//
// We use a <span> tag because we can measure its width, which tells us
// the width of its children. We may not need this ability, but we make
// it available anyway.
//
// We use this object to intentionally save the plugin objects in memory.
//
HTML:[],

// [private]
// This is a pointer to keep track of how many HTML[] items have been checked
// for errors/issues.
// This pointer helps prevent checking any item more than once.
len: 0,


// [private]
// ** EVENT HANDLER **
// Remove all the instantiated plugins from all the <span> tags.
onUnload:function($, CODEBASE){

  var x, HTML = CODEBASE.HTML, obj;

  for (x=0;x<HTML.length;x++)
  {
    obj = HTML[x];
    if (obj)
    {
       HTML[x] = 0;  // we delete the object before deleting its properties
       CODEBASE.emptyNode(obj.span());
       obj.span = 0;
       obj.spanObj = 0;
       obj = 0;
    }
  }

  CODEBASE.iframe = 0;


}, // end of onUnload()


// [private]
// Make sure Upper[] & Lower[] are properly formatted.
init: function(codebase){

   var CODEBASE=this;


   if (!CODEBASE.iframe) // only runs once
   {
      // We create an <iframe> for a very special reason.
      // For the codebase detection technique, we use a <span> tag,
      // and we insert the <object> tag (which instantiates the plugin) into
      // that <span> using innerHTML.
      // The problem is this:
      //   1) if we use span = document.createElement("span"),
      //   2) and we have a plugin that hangs in some way,
      //
      // then the browser window may not load. The reason for this
      // is that the <span> was created using "document", which is a property
      // of "window". Hence window.onload meay never fire.
      // [This, of course, almost NEVER would happen. But we would like to address
      // the issue anyway.]
      //
      // Example: Java 1,2,2,17 when applet is instantiated, the readyState!=4.
      // IE will often not have the window.onload event occur.
      //
      // To avoid this issue altogether, we create an <iframe>, and insert into the DOM.
      // We open and close the iframe. Since the iframe is empty, it's window.onload
      // will (should) occur immediately.
      // Then we use the <iframe>.contentDocument to create the <span>,
      // such that span = <iframe>.contentDocument.createElement("span");
      // If the plugin hangs, then it will not matter, since the iframe onload
      // event has already occured. And hence the window.onload event will occur
      // as it normally should.
      //
      // [ As an alternative, you could simply remove all instances of the plugin
      // from the DOM and from memory, and then force the IE window.CollectGarbage() method
      // to run. You would do this whenever the reasyState of the <object> tag !=4.
      // This would also allow window.onload to occur.
      // The disadvantage here is that readyState property for <object> tag no longer exists
      // for IE 11+. ]

      var DOM=$.DOM, iframe;

      iframe = DOM.iframe.insert(0, "$.codebase{ }");
      CODEBASE.iframe = iframe;
      DOM.iframe.write(iframe, " ");
      DOM.iframe.close(iframe);   // iframe onload event should occur here, since
                                  // the iframe is empty.

      $.message.write("[ <iframe> ($.codebase{ }) contentDocument.readyState: " +
         (DOM.iframe.doc(iframe).readyState) + " ]", $.message.end());

   }


   if (!codebase.init)  // only runs once for each plugin
   {
     codebase.init=1;

     var x, classID;

     $.message.write("[ ]", $.message.end());
     $.message.write("[ START codebase.init( ) ]", $.message.end());
     $.message.write($.message.time(CODEBASE.init,1), $.message.end());  // Start measuring time delay

     // Remove all the instantiated plugin objects from memory as window unloads.
     $.ev.fPush([CODEBASE.onUnload, CODEBASE], $.win.unloadHndlrs);



     // codebase.version  ==  undefined or string
     // result of codebase version search

     // codebase.min      ==  undefined or string
     // highest codebase version that has instantiated the plugin so far
     
     // codebase.max      ==  undefined or string
     // lowest codebase version that has failed to instantiate the plugin so far

     // codebase.L=0      ==  undefined or object{}
     // L.x = lowest value of L.x such that codebase.Lower[L.x]
     // instantiates an ActiveX object.
     // If L.x < 0, then no instantiation has occurred.
     // L.v = Plugin version that corresponds to codebase.Lower[L.x].




     // create the HTML tags that we will insert into the DOM
     // to do the codebase detection.
     // HTML tag = codebase.tagA + version + codebase.tagB
     codebase.tagA = "<object width=\"1\" height=\"1\" " +

        // display:none prevents any src/data files from being downloaded from server.
        // So perhaps we should put dummy src file in param tag? It would be ok
        // to do so since IE will make no attempt to get the file.
        "style=\"display:none;\" " +

        "codebase=\"#version=";
        

     // codebase.$$.classID is the default classid used.
     // codebase.classID is the override value.
     classID = codebase.classID || codebase.$$.classID || "";

     codebase.tagB = "\" " +

          // We get a slight speed advantage by having the classid in this string,
          // as opposed to leaving it out, and inserting the object tag into the DOM
          // and then setting the classid.
          ((/clsid\s*:/i).test(classID) ? "classid=\"" : "type=\"") + classID + "\">" +


          // Add <param> tags for codebase version detection.
          // For some plugins, this may be necessary.
          (codebase.ParamTags ? codebase.ParamTags : "") +


          // It appears that when the plugin does not instantiate, then altHTML will not
          // occur within the <span>. The reason for this is that the <span> is never
          // inserted into the DOM. Hence the width of the <span> appears to always be 0,
          // regardless of whether the plugin instantiates or not.
          // Hence, we do not specify any altHTML here.

          $.openTag + "/object>";


     for (x=0;x<codebase.Lower.length;x++)
     {
         codebase.Lower[x]=$.formatNum(codebase.Lower[x]);
         codebase.Upper[x]=$.formatNum(codebase.Upper[x]);

         // Verify $.codebase.convert_(x)
         $.message.write(
            codebase.convert[x] ?
            (codebase.Lower[x] === CODEBASE.convert_(codebase, x,
                CODEBASE.convert_(codebase, x, codebase.Lower[x]), 1) ? 0 :
             "[ ***** ERROR ***** " + codebase.$$.pluginName +
             " $.codebase.convert_("+x+") is not correct ]"
            ) : 0, $.message.end()
         );

         // Verify $.codebase.convert(x)
         $.message.write(
            codebase.convert[x] ?
            (x === CODEBASE.convert(codebase, codebase.Lower[x]).x &&
             codebase.Lower[x] === CODEBASE.convert(codebase,
                CODEBASE.convert(codebase, codebase.Lower[x]).v, 1).v ? 0 :
             "[ ***** ERROR ***** " + codebase.$$.pluginName +
             " $.codebase.convert("+x+") is not correct ]"
            ) : 0, $.message.end()
         );
         
         // Verify $.codebase.convert(x) and $.codebase.convert_(x)
         $.message.write(
            codebase.convert[x] ?
            (CODEBASE.convert_(codebase, x, codebase.Lower[x]) ===
               CODEBASE.convert(codebase, codebase.Lower[x]).v ? 0 :
             "[ ***** ERROR ***** " + codebase.$$.pluginName +
             " $.codebase.convert("+x+") is not correct ]"
            ) : 0, $.message.end()
         );


         // Verify that Upper[x] > Lower[x]
         $.message.write( codebase.Upper[x] && codebase.Lower[x] &&
            $.compareNums($.formatNum(codebase.Upper[x]), $.formatNum(codebase.Lower[x]))>0 ? 0 :
             "[ ***** ERROR ***** " + codebase.$$.pluginName +
             " codebase.Upper["+x+"] should be > codebase.Lower["+x+"] ]", $.message.end()
         );
         
         // Verify that Lower[x] == Upper[x+1]
         $.message.write( 
            x<codebase.Lower.length-1 ?
            ( $.formatNum(codebase.Lower[x]) == $.formatNum(codebase.Upper[x+1]) ? 0 :
              "[ ***** ERROR ***** " + codebase.$$.pluginName +
              " codebase.Lower["+x+"] should be == codebase.Upper["+(x+1)+"] ]"
            ) : 0, $.message.end()
         );

         // Verify that Lower[x] > Lower[x+1]
         $.message.write( 
            x<codebase.Lower.length-1 ?
            ( $.compareNums($.formatNum(codebase.Lower[x]),$.formatNum(codebase.Lower[x+1]))>0 ? 0 :
              "[ ***** ERROR ***** " + codebase.$$.pluginName +
              " codebase.Lower["+x+"] should be > codebase.Lower["+(x+1)+"] ]"
            ) : 0, $.message.end()
         );

         // Verify that Upper[x] > Upper[x+1]
         $.message.write(
            x<codebase.Lower.length-1 ?
            ( $.compareNums($.formatNum(codebase.Upper[x]),$.formatNum(codebase.Upper[x+1]))>0 ? 0 :
              "[ ***** ERROR ***** " + codebase.$$.pluginName +
              " codebase.Upper["+x+"] should be > codebase.Upper["+(x+1)+"] ]"
            ) : 0, $.message.end()
         );


     }


     // Make sure Lower[Lower.length-1] = "0,0,0,0"
     $.message.write(
        $.formatNum(codebase.Lower[codebase.Lower.length-1]) === $.formatNum("0") ? 0 :
            "[ ***** ERROR ***** " + codebase.$$.pluginName +
            " codebase.Lower[ last item ] should be \"0\" ]", $.message.end()
     );

     $.message.write(
        (codebase.Lower.length != codebase.Upper.length ||
         codebase.Lower.length != codebase.convert.length ||
         codebase.Lower.length != codebase.DIGITMAX.length
        ) ? "[ ***** ERROR ***** " + codebase.$$.pluginName +
        " codebase arrays Lower[ ], Upper[ ], convert[ ], DIGITS[ ] should be the same length ]" : 0, $.message.end()
     );


     $.message.write("[ END codebase.init( ) in " + 
       $.message.time(CODEBASE.init) + " ]", $.message.end());

   }
},  // end of init()


// [private]
// Determine if <object> tag can be instantiated in the <head>,
// given a classid, and a codebase version.
// Return 0 or 1.
//
// Input version is a codebase version number.
isActiveXObject: function(codebase, version){

   var CODEBASE=this, result=0, plugin=codebase.$$,

     // We use a <span> because we can measure its width, which tells us
     // the width of its children. We may not need this ability, but we make
     // it available anyway.
     //
     // Note: we try to use the <iframe> document when creating the <span>.
     // Since the iframe will already be fully loaded, any plugins that hang
     // will not affect the iframe onload event (which already fired).
     // As a result, the window.onload event will not be prevented by a hanging
     // plugin.
     span = ($.DOM.iframe.doc(CODEBASE.iframe) || document).createElement("span");
     


   // Note: instantiating a plugin via an <object> tag can be rather SLOW for some plugins.
   // Thus, we wish to speed things up as much as possible.
   // We speed up results as follows:
   //   1) We store previous results in codebase.min & codebase.max.
   //   2) if version <= codebase.min, then we return "1" without having
   //      to instantiate another <object> tag.
   //   3) if version >= codebase.max, then we return "0" without having
   //      to attempt to instantiate another <object> tag.


   if (codebase.min && $.compareNums(version, codebase.min)<=0) return 1;
   
   // At this point we have (!codebase.min || version > codebase.min)

   if (codebase.max && $.compareNums(version, codebase.max)>=0) return 0;

   // At this point we have (!codebase.max || version < codebase.max)


BOUNDARY("select.xtra.codebase && select.miscCheckbox.allowactivex && select.methodCheckbox.onbeforeinstantiate");

   // Run the functions in the plugin.BIHndlrs array,
   // right before plugin object is instantiated.
   // These functions are only executed ONCE.
   if (plugin.BIHndlrs && plugin.BIHndlrs.length)
   {
          $.message.write("[ START event handlers for " + $.name + ".onBeforeInstantiate(" +
                  $.message.args2String(plugin.pluginName) + ") ]", $.message.end());

          $.ev.callArray(plugin.BIHndlrs);

          $.message.write("[ END event handlers for " + $.name + ".onBeforeInstantiate(" +
                  $.message.args2String(plugin.pluginName) + ") ]", $.message.end());

   }

BOUNDARY("select.xtra.codebase && select.miscCheckbox.allowactivex");


  //  document.body.insertBefore(span, document.body.firstChild)


   // Attempt instantiation
   //
   // Note: after instantiation, we do NOT try to access span.innerHTML any more,
   // because this can cause problems for some buggy plugins.
   // For example, for JRE 1,2,2,17 accessing span.innerHTML can cause a Java console popup
   // with errors. Naturally most Java versions do not have this problem, but we try to
   // be careful nonetheless.
   //
   // Note: trying to access the value of span.innerHTML (ie. var t = span.innerHTML) can
   // potentially cause a problem, when dealing with a buggy plugin.
   // So we avoid doing that. Somehow, span.innerHTML causes the browser
   // to access one or more properties of the plugin. And we want to avoid
   // unneccessary interaction with the plugin when possible.
   span.innerHTML = codebase.tagA + version + codebase.tagB;


   // Note, we do not access span.innerHTML here. Instead, we use
   // codebase.tagA + version + codebase.tagB
   $.message.write("[ Testing tag for ActiveX instantiation: " + 
      (codebase.tagA + version + codebase.tagB) + " ]", $.message.end());



   // Check if plugin has instantiated
   if ($.pd.getPROP(span.firstChild, "object")) result = 1;


   $.message.write(result ? "[ --- ActiveX has instantiated --- ]" : 0, $.message.end());

   $.message.write(result && $.isDefined($.pd.getPROP(span, "readyState")) ?
     "[ Tag readyState: " + $.pd.getPROP(span.firstChild, "readyState") + " ]" : 0, $.message.end());

   $.message.write(result ? "[ Tag width: " +
      ( $.isNum(span.scrollWidth) ? span.scrollWidth :
        ($.isNum(span.offsetWidth) ? span.offsetWidth : "unknown")
      ) + " pixels ]" : 0, $.message.end());



   if (result)
   {
     // plugin has instantiated

     // If result is "1" and (!codebase.min || version > codebase.min)
     //    then codebase.min = version
     codebase.min = version;

     // ** If plugin has instantiated, then SAVE it.
     // We do NOT delete the instantiated plugin from memory yet.
     // I believe this is safer than instantiating, then deleting, then instantiating, etc...
     //
     // Deleting the plugin right away might force a given plugin to repeatedly keep requesting
     // security permission to run. But if it stays in memory, then the browser/plugin
     // should remember that it already asked for permission when instantiating the next 
     // plugin object.
     //
     // We only delete the plugin from memory when the window unloads.
     CODEBASE.HTML.push({spanObj:span, span:CODEBASE.span});

   }

   // If result is "0" and (!codebase.max || version < codebase.max)
   //    then codebase.max = version
   else{
     // plugin has not instantiated

     codebase.max = version;

     span.innerHTML = "";
   }

   return result;


},  // end of isActiveXObject()


span: function(){return this.spanObj;},


// [private]
// Return codebase.convert[x](V, toCodebase).
// We use $.formatNum() just in case there are extra leading 0's, or missing digits.
convert_: function(codebase, x, V, toCodebase){

  var convert = codebase.convert[x];
  
  return convert ? ($.isFunc(convert) ?
    $.formatNum( convert(V.split($.splitNumRegx), toCodebase).join(",") ) : V) : convert;

},

// [private]
// Convert codebase version number to/from plugin version number.
//
// @toCodebase
//    if toCodebase, then convert V (as a plugin version #) to codebase number.
//    if !toCodebase, then convert V (as a codebase version #) to plugin version number.
//
// Return an object {v:conversion result, x:index}
convert: function(codebase, V, toCodebase){
   var CODEBASE=this, x, result, tmp;

   V = $.formatNum(V);
   result={v:V, x:-1};

   if (V)
   {
     for (x=0;x<codebase.Lower.length;x++)
     {
       // Make sure that CODEBASE.convert_() is able to convert for a given x.
       tmp = CODEBASE.convert_(codebase, x, codebase.Lower[x]);
       if (tmp &&

         // if toCodebase, then make sure plugin version >= codebase.convert[x](codebase.Lower[x])
         // if !toCodebase, then make sure codebase version >= codebase.Lower[x]
         $.compareNums(V, toCodebase ? tmp : codebase.Lower[x]) >=0 &&

         // if toCodebase, then make sure plugin version < codebase.convert[x](codebase.Upper[x])
         // if !toCodebase, then make sure codebase version < codebase.Upper[x]
         //
         // Note: by definition, we should have
         //    V < CODEBASE.convert_(codebase, 0, codebase.Upper[0])  for toCodebase
         //    V < codebase.Upper[0]                                  for !toCodebase
         // However, codebase.Upper[0] is chosen to be some arbitrary large number.
         // And V can be some arbitrary unknown large number.
         // Hence, we add "!x" here to make sure.
         (!x || $.compareNums(V, toCodebase ?
                CODEBASE.convert_(codebase, x, codebase.Upper[x]) : codebase.Upper[x]) <0)

       )
       {
          result.v = CODEBASE.convert_(codebase, x, V, toCodebase);
          result.x = x;
          break;
       }


     }   // end of loop x
   }

   return result;

},  // end of convert()


BOUNDARY3: "select.xtra.codebase && select.miscCheckbox.allowactivex",

z:0

},  // end of codebase{}


// *************************** End of Codebase Detection technique ********************************


// ********************************** Window Events ***********************************************

BOUNDARY10:"select.xtra.win",

win:{

// Property is automatically removed by Script Generator
firstProperty:"select.xtra.win",

BOUNDARY0:"0",

// This object assists in creating a custom version of the script for the user.
script:{
  
    select:{xtra:{win:"win"}},
    

    errCheck:function(code, select){
        if (!select.miscCheckbox.allowactivex &&
             (/\.codebase|\.AXO|\.getAXO|\.ActiveX|ActiveXObject/).test(code.customModuleScript)
           )
              alert("Error: ActiveX code found in " + code.moduleName + " module");
    },


    // include:function(select){} tells us which other modules to include when using this module.
    // Do not put $.message/BOUNDARY in the array[] here because they are automatically
    // included/removed from the script as needed.
    include:function(){
      return [$.ev];
    }

}, // end of script{}

BOUNDARY1:"select.xtra.win",

// [** PUBLIC **]
disable:function(){
   this.cancel = true;
},

// [private]
// If true, then window.onload event handlers never run
cancel: false,

// [public]
loaded: false,    // browser window has loaded (true/false)
                  // load event has fired.

// [public]
unload: false,    // browser window is unloading (true/false)
                  // unload event has fired.

// [private]
hasRun:0,

// [public]
// Initialize the win{} object
init: function(){

  var win=this;

  if (!win.hasRun)
  {
      win.hasRun=1;

      // If the library is loaded AFTER the window has loaded,
      // then we need to set win.loaded here.
      if ((/complete/i).test(document.readyState || "")){
         win.loaded=true;
         $.message.write("[ *** Warning: The " + $.name + 
           " library is loading AFTER the browser window has loaded. " +
           "This is unusual, but is still ok. ]", $.message.end());
      }
      
      // else library is loaded BEFORE window has loaded.
      else $.ev.addEvent(window, "load", win.onLoad);

      // We want to run the event handlers once before the window has fully unloaded.
      //
      // Note: window.onbeforeunload() will run when you do a POST from the page, and also
      // right before you leave the page. Since we do not want to run the unload
      // handlers after a POST, we avoid using the onbeforeunload() event.
      // window.beforeunload is an HTML5 standard.
      //
      // Hence we use the window.onunload() event.
      //
      // $.ev.addEvent(window, "beforeunload", win.onUnload);
      $.ev.addEvent(window, "unload", win.onUnload);

  }

},   // end of init()



// [public]
// Event handlers that will run when window loads.
// These are PRIVATE event handlers generated by this Library.
// (But the loadPrvtHndlrs[] array is public, as far as this $.win{} object is concerned.)
//
// loadPrvtHndlrs[] must run BEFORE loadPblcHndlrs[].
loadPrvtHndlrs: [],

// [public]
// Event handlers that will run when window loads.
// These are PUBLIC event handlers generated by the user, using $.onWindowLoaded().
//
// loadPrvtHndlrs[] must run BEFORE loadPblcHndlrs[].
loadPblcHndlrs: [],

// [public]
// Event handlers that will run as the browser window unloads.
// These event handlers are generated by this Library.
unloadHndlrs: [],


// [private]
// ** EVENT HANDLER **
// Runs as the browser window unloads.
// It does not use the "this" keyword, since it is an event handler.
//
// This is a cleanup routine.
//   - We try to prevent memory leaks, etc.. by cleaning up stuff here.
//   - Unbind all event handlers from their objects.
//   - Remove DOM nodes
onUnload: function(){

    var win=$.win;


    // This routine might be called 0, 1, or 2 times, depending
    // on the browser support for window.onbeforeunload and window.onunload.
    // But we only want this code to run.
    if (win.unload) return;

    
    win.unload = true;      // browser window has unloaded (or is unloading).
                            // Note: we set win.unload BEFORE $.ev.callArray(),
                            // because as far as those event handlers are concerned,
                            // the browser window has unloaded.
                            //
                            // When $.win.unload == true, then  
                            //  1) $.ev.callArray() will ONLY execute $.win.unloadHndlrs.
                            //     It will not execute any others.
                            //  2) $.ev.setTimeout() will NOT call setTimeout() any more.
                            //  3) $.message.write() will not work any more.


    // Remove window.onload, window.onunload event handlers
    $.ev.removeEvent(window, "load", win.onLoad);
    $.ev.removeEvent(window, "unload", win.onUnload);
    
    // execute all cleanup event handlers for window.onunload
    $.ev.callArray(win.unloadHndlrs);

    
    
    // Note: We could empty the entire Library of all properties to
    // prevent memory leaks from any closures.
    // This is the very last thing to do before the window unloads.
    //
    // Update: we decided not to empty the library, in case some stray event handler
    // ends up running AFTER this routine is done. So, we comment out the code below.
    //
    // for (var x in $){if (1) $[x]=0;}
    // $=0;


    // Note: if you want some kind of feedback that this onUnload() event handler has run,
    // then we cannot use alert(...). It does not work for all browsers in the
    // window.onunload handler.
    // Instead, simply uncomment the next line of code...
    //
    // window.close();


},  // end of onUnload



// [private]
// ** EVENT HANDLER **
// Runs when window loads.
// It does not use the "this" keyword, since it is an event handler.
//
onLoad: function(){

    var win = $.win;

    // Make sure this routine only runs once after win.loaded has been set.
    // We check for this because this routine may be called multiple times.
    // Note: It is possible for window.onunload to fire before window.onload.
    if (win.loaded || win.unload || win.cancel) return;


    $.message.write("[ ]", $.message.end());
    $.message.write("[ window.onload event has fired " + $.message.time($) +
       " after script initialization ]", $.message.end());




    win.loaded = true;   // browser window loaded.
                         // Note: we set win.loaded before $.ev.callArray(),
                         // because as far as those event handlers are concerned,
                         // the browser window has loaded.

    $.message.write($.message.time(win.onLoad,1), $.message.end());  // Start measuring time delay

    $.message.write("[ START event handlers for " +
          ($.onWindowLoaded ? $.name + ".onWindowLoaded( )" : "window.onload") + " ]", $.message.end());

    // execute all private event handlers for window.onload.
    // Private handlers must run BEFORE the public handlers.
    $.ev.callArray(win.loadPrvtHndlrs);

    // execute all public event handlers for window.onload.
    $.ev.callArray(win.loadPblcHndlrs);

    $.message.write("[ END event handlers for " +
         ($.onWindowLoaded ? $.name + ".onWindowLoaded( )" : "window.onload") +
         " in " + $.message.time(win.onLoad) + " ]", $.message.end());
         
    $.message.write("[ Array of window.onunload event handlers, $.win.unloadHndlrs.length: " +
          win.unloadHndlrs.length + " ]", $.message.end());


},  // end of onLoad()


// Property is automatically removed by Script Generator
lastProperty:"select.xtra.win"

},   // end of win{} object


// *************************** End of Window Events *****************************************



// **********************************************************************************
/*   Code needed for inserting/removing HTML tags into the DOM


  To be extra careful here, we do the following...
   -  We try to avoid interacting with any HTML plugin tags (<object>/<embed>/<applet>) as much
    as possible. By this we mean, not accessing any tag properties, unless necessary.
    Sometimes, an older browser may get confused as to whether we are accessing a tag
    property, or the plugin object itself.
   - Pointers to DOM nodes/HTML tags should be set to 0/null when no longer needed (Memory leaks?).


*/

BOUNDARY13:"select.xtra.DOM",

DOM:{

// Property is automatically removed by Script Generator
firstProperty:"select.xtra.DOM",

BOUNDARY0:"0",

// This object assists in creating a custom version of the script for the user.
script:{
  
    select:{xtra:{DOM:"DOM"}},
    
    
    errCheck:function(code, select){
        if (!select.miscCheckbox.allowactivex &&
             (/\.codebase|\.AXO|\.getAXO|\.ActiveX|ActiveXObject/).test(code.customModuleScript)
           )
              alert("Error: ActiveX code found in " + code.moduleName + " module");
    },


    // include:function(select){} tells us which other modules to include when using this module.
    // Do not put $.message/BOUNDARY in the array[] here because they are automatically
    // included/removed from the script as needed.
    include:function(){
      return [$.pd, $.ev, $.win];
    }

}, // end of script{}

BOUNDARY1:"select.xtra.DOM",



// [public]
isEnabled:{


// [public]
// This method tells us if the <object> tag is enabled or not.
// Return true/false, 1/0
//
objectTag: function(){

    // For IE && ActiveXEnabled && allowactivex, return 1
    // For non-IE, return 1
    // else return 0
    //
    // Note: when allowactivex = false, then we are not allowed to use <object>
    // tag for IE, since <object> tag uses ActiveX.

    var browser=$.browser, result=browser.isIE ? 0 : 1;

    BOUNDARY("select.xtra.DOM && select.miscCheckbox.allowactivex");

    // If ActiveX disabled, then using an <object> tag could cause a popup in the browser.
    if (browser.ActiveXEnabled) result=1;

    BOUNDARY("select.xtra.DOM");


    return !!result;

},


/*
  We comment out this section, because we do not really use these tags

// [public]
// We do not really use the <embed> tag. We only use <object> tags.
embedTag:function(){ return !!1;
},

// [public]
// <applet> tag is deprecated, and is only used for Java.
appletTag:function(){
  return !$.Plugins.java.applet.isDisabled.appletTag();
},

*/


// [public]
// This method tells us if the <object> tag for IE is enabled or not.
// Return true/false.
//
// If browser is IE and ActiveX is enabled, then return true.
// If browser is IE and ActiveX is NOT enabled, then return false.
//    In this case, IE 7+ gives a popup when an <object> tag is instantiated.
// If browser is NOT IE, return false.
//
// This routine does not depend on browser detection. It only depends on
// feature detection of a browser (ie. this.browser.ActiveXEnabled).
// This is more reliable, I believe, than using $.browser.isIE.
//
// When ActiveX is disabled in IE, the <object> tag seems
// to give a popup in IE 7+, even empty <object> tags with no classid.
// For IE < 7, the ActiveX control being instantiated with the <object> tag
// will also be disabled. Hence we avoid <object> tags when ActiveX is disabled.
//
// Note: ActiveX scripting being disabled does not disable ActiveX
// itself. However, disabling ActiveX scripting will still cause $.browser.ActiveXEnabled==false
//
// This routine is only really aimed at IE.
//
// Note: for IE 9+, ActiveX Filtering is possible. ActiveX filtering does not
// disable the <object> tag, and it does not disable all ActiveX controls.
// There are some ActiveX controls that still run, even when filtering is on.
// Therefore, we do not disable the <object> tag when $.ActiveXFiltering is true.
// ActiveX filtering does not cause the <object> tag to have popups either.
//
// Whenever possible, it would be a good idea to use the $.getAXO() method before
// using this method. It will halp to assist in getting the correct value for
// $.browser.ActiveXEnabled.
objectTagUsingActiveX: function(){
   
   var result=0;

   BOUNDARY("select.xtra.DOM && select.miscCheckbox.allowactivex");

   if ($.browser.ActiveXEnabled) result=1;

   BOUNDARY("select.xtra.DOM");

   return !!result;

},


// [public]
// Return 1 if we are allowed to access the "object" property of an HTML tag (which holds a
//   plugin object). This does not guarantee that the object property is defined, it merely
// says that we are allowed to access it.
// Return 0 if we are not allowed.
//
// When running this routine, it is assumed that the HTML tag has already been created and inserted
// into the DOM. We merely try to determine whether we are allowed to access the "object"
// property.
//
// This is directed at IE only for the purpose of plugin detection. So we are interested
// in the object property for <object>/<embed>/<applet> tags, which can hold a plugin object.
// Non-IE browsers do not have an object property for their HTML tags.
//
//
// For IE 6+, HTML tags that instantiate a plugin/addon often have an "object" property.
// The object property gives us access to the ActiveX control.
// So, we can access an ActiveX control using either:
//   1)  <tag>.ActiveXcontrolProperty
//   2)  <tag>.object.ActiveXcontrolProperty
//
// For IE < 7, accessing the "object" property can cause an error message.
// [Error message saying that an unsafe ActiveX control was attempted to be accessed].
// However, this Library is not to be used for IE < 7 anyway, so this limitation
// can be ignored..
//
// For non-IE browsers, we say that access to the object property is not allowed,
// because accessing that could cause potential problems (ie. it may accidentally interact
// with the plugin if there is a browser/plugin bug).
//
// Update: the object property is undefined for <embed> tags in IE.
// But it is defined for <object>/<applet> tags in IE.
// When ActiveX is enabled, we are allowed to access the object property for <object> tags.
// When ActiveX is disabled, we are NOT allowed to access the object property for <object> tags.
// When ActiveX is enabled/disabled and java.navigatorEnabled()==true, then we are allowed to
//   access the object property for the <applet> tag.
objectProperty:function(HTML){

  // This works for <embed>/<applet>/<object> tags.
  //
  // We do not really need to check for $.browser.isIE here, but we do it anyway to avoid
  // creating any unneccesary HTML tags in the majority of browsers.
  // This routine is only aimed at IE.
  if (HTML && HTML.tagName && $.browser.isIE)
  {

     // When HTML.tagName == applet, we want to avoid using document.createElement() to create
     // any additional <applet> tags.
     //   Creating additional <applet> tags could potentially cause
     // additional popups in IE when Java not installed. IE can show a popup when Java not
     // installed and an <applet> tag is created. I have seen a case (IE 11/Win 8 64 bit)
     // where N <applet> tags are created when Java not installed, so we get N popups in IE.
     //   Also, for IE 6/Win98SE with MS Java, accessing the object property of the <applet> tag
     // can cause a popup message saying that an unsafe ActiveX control is trying to run.
     // However, for IE 6/WinXP with MS Java, we get no such popup error message.
     // We do not bother trying to make this distinction here in the code, because IE 6
     // is already too outdated for anyone to care about it.
     //
     // So, we take our cues on the <applet> tag from the <object> tag.
     // If we are allowed to create <object> tags, then we create an <object> tag.
     //   If <object>.object is defined, then return 1. If undefined or generates an error, return 0.
     // If we are not allowed to create <object> tag, then just return 1 by default.
     if ((/applet/i).test(HTML.tagName))
        return (!this.objectTag() || $.isDefined($.pd.getPROP(document.createElement("object"), "object")) ? 1: 0);


     // For HTML.tagName == object/embed...
     // Note that it should be safe to use createElement() here, because HTML && HTML.tagName
     // exists, which means that this tag type has ALREADY been inserted into the DOM.
     // This means that this library already has enabled/allowed the use of this particular
     // HTML tag.
     // Hence, there is no need to check if ActiveX is enabled or not when creating
     // a generic <object> tag here. (IE can give a popup when ActiveX disabled and
     // an <object> tag is created.)
     //
     // For generic <object>/<embed> tags, if the object property is defined, then the property
     // is enabled for the HTML plugin object.
     return $.isDefined($.pd.getPROP(document.createElement(HTML.tagName), "object")) ? 1 : 0;

  }

  return 0;


} // end of objectProperty()


},  // end of isEnabled{}


// All HTML{} objects created by $.DOM.insert() are stored here.
// The only reason for this is to simplify cleanup.
HTML:[],


// [private]
// This <div> contains all the HTML tags used for instantiating plugins, such that
// <div id="plugindetect"><span><object></object></span><span><object></object></span>...</div>
//
// Note: When DOM.div points to a <div>, then it means that the <div> has been initialized and 
// it is in the DOM.
// If DOM.div does NOT point to a <div>, it could mean that there is no <div> in the DOM at all,
// or that the web page has a user defined <div> that has not been initialized yet.
div: null,

// [private]
// id of the <div id="plugindetect"></div>
divID: "plugindetect",

// [private]
// Width of the <div> in pixels
divWidth: 500,

// [private]
// Return the <div> used for plugin instantiation
getDiv: function(){

  return this.div || document.getElementById(this.divID) || null;

},

// [private]
// If user defined <div> found in web page and it has not been initialized, then initialize it.
// Else if no user defined <div> found in web page,
//   then create <div>, initialize it, and insert into web page.
//
initDiv: function(){

   var DOM=this, PDdiv;

   // Once it has been created, we do not run this code again.
   if (!DOM.div)  // <div> has not been initialized yet
   {
      PDdiv = DOM.getDiv();

      // If user defined <div id="plugindetect"></div> is found, then initialize it.
      // We place our instantiated plugins inside that.
      // We do this to give people the flexibility to choose where in the
      // web page that <div> will be located.
      if (PDdiv)
      {
         DOM.div = PDdiv;   // this means <div> is initialized

         // We do NOT set the style for this <div>, since it was defined by the user

         $.message.write("[ HTML tag <div id=\"" + DOM.div.id + "\">" +
            $.openTag + "/div> found ... specified by user ]", $.message.end());
      }

      else
      {
         DOM.div = document.createElement("div");  // this means <div> is initialized
         DOM.div.id = DOM.divID;

         // Set DOM.div style.
         DOM.setStyle(DOM.div, DOM.getStyle.div());
         

         $.message.write("[ HTML tag <div id=\"" + DOM.div.id + "\">" + 
           $.openTag + "/div> not found / not specified by user ]", $.message.end());
         
         // Warning: $.message() must always have an EVEN number of quotes,
         // so that it can be easily removed from the script later on.
         // Therefore, we craft the regex here very carefully.
         // Not to worry...if we make a mistake here, the download page (where we remove
         // the $.message()) will give us an error message.
         $.message.write("[ Inserting <div> tag into DOM: <div " +

            (( /(style\s*=\s*['"][^"']*[^'"]*["'])/i).test(DOM.div.outerHTML||"") ? RegExp.$1 : "") +

              " id=\"" + DOM.div.id + "\">" + $.openTag + "/div> ]", $.message.end()
         );


         // Note: we insert the <div> into the DOM only AFTER all of its
         // styles/properties have been set. This helps to avoid some
         // potential problems with some older browsers.
         DOM.insertDivInBody(DOM.div);

      }



      // When the window unloads, we make sure that the <div> is emptied,
      // because it may contain instantiated plugins.
      // This is a merely cleanup routine.
      //
      // *** We do NOT unload the <div> BEFORE the window unload event, because it
      // may potentially cause problems for certain plugins/browsers.
      // It is best to leave the <div> alone until the last possible moment.
      // Also, this way we can be certain that the <div> is always in the DOM when needed
      // by this Library.
      $.ev.fPush([DOM.onUnload, DOM], $.win.unloadHndlrs);

   }

   PDdiv=0;


}, // end of initDiv()


// [public]
// Instantiated plugins are given a size of DOM.pluginSize x DOM.pluginSize.
// Plugin size cannot be less than 1. It must always be >=1.
//
// We do not set width=height="0" when instantiating a plugin object because
// that may cause problems for some plugins.
// Note: the assumed units here are pixels.
pluginSize: 1,


iframeWidth: 40,
iframeHeight: 10,


// [public]
// The alternate HTML that is displayed by an HTML tag when a plugin does not instantiate.
// We MUST have the width of altHTML to be > $.DOM.pluginSize.
// When a <span> tag has the width of altHTML, then we know that it does not contain an
// instantiated plugin object.
altHTML: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;",


// [public]
// Empty a DOM node as safely as possible
// This node is actually going to be a <span>/<div> tag.
// The children of this <span> tag, if they exist, may be an HTML tag that displays
// active content.
//
// We avoid storing any child node (ie. DOM plugin node) into any variable.
emptyNode: function(node){

   var DOM=this;

   // This routine assumes we are emptying a <div> or <span>
   if (node && (/div|span/i).test(node.tagName||""))
   {
     
      $.message.write(node.innerHTML ? "[ removing " + node.innerHTML + " ]" : 0, $.message.end());

      // We set style to "display:none" to enhance the safety of removal for IE.
      //
      // Note: we set the style for the node object itself, which should be a <span>
      // tag. The node object is a PASSIVE element that contains 1 or more tags
      // that display plugin content. This is safe to do, because setting the
      // properties of a passive element is ok.
      //   On the other hand, modifying properties on an <object>/<embed>/<applet> tag
      // that is displaying active content from a plugin, can be dangerous.
      // Some browsers may incorrectly see this as an attempt to communicate with the plugin
      // itself, as opposed to setting a property of the HTML tag itself.
      //   Hence, we set the style of the node object itself, as opposed to setting
      // the style of each child within the node.
      if ($.browser.isIE)
          DOM.setStyle(node, ["display","none"]);


      // There are 2 ways to remove the children of a node.
      //   1) node.innnerHTML = ""
      //   2) node.removeChild(node.childNodes[x]);
      //
      // When dealing with an instantiated plugin (active content), I believe it is safer to use
      // innerHTML. We instantiated the plugin using innerHTML, and we should
      // delete the plugin the same way.
      // When dealing with passive content, we are free to use removeChild().
      //
      // Note: For IE 11 (Preview)/Win 7/Java 1,7,0,15
      // When ActiveX disabled, then this Library tries to instantiate an <applet>
      // tag. The applet itself generated a security popup when it was INSERTED
      // into the DOM. And then, the very same security popup was generated a second time
      // when it was REMOVED from the DOM using node.removeChild().
      // There should be no security popup when removing a node from the DOM!
      // However, node.innerHTML avoids the second security popup.
      // No doubt this is a Java/IE related bug. Hence, we use innerHTML to empty the node
      // object.
      try{node.innerHTML = "";}
      catch(e){}

   }

},  // end of emptyNode()


// [public]
// Remove node from DOM
removeNode:function(node){
  try{if (node && node.parentNode) node.parentNode.removeChild(node);}
  catch(e){}
},


// [private]
// ** EVENT HANDLER **
//
// Empty the DOM <div> when we are done using/needing it.
// We avoid the 'this' keyword, so we have $, DOM as input.
//
// Emptying the div is important because:
//  The <div> contains instantiated plugins. It is a good idea to remove
//  active content from the DOM before unloading the web page.
//  Hence this routine is called by $.win.onUnload().
//
onUnload: function($, DOM){

  var PDdiv, x, span, obj,
    HTML = DOM.HTML, len = HTML.length;

  if (len)
  {
     // Note that we process the instantiated HTML objects plugins in the
     // REVERSE order that they were instantiated just to be on the safe side.
     for (x=len-1;x>=0;x--)
     {
        obj = HTML[x];
        if (obj)
        {
           HTML[x] = 0;  // we delete the object before deleting its properties
           DOM.emptyNode(obj.span());
           DOM.removeNode(obj.span());
           obj.span = 0;   // remove Javascript/DOM node links to avoid memory leaks
           obj.spanObj = 0;
           obj.doc = 0;
           obj.objectProperty = 0;
        }

     }
  }

  // Empty the DOM <div> element
  PDdiv = DOM.getDiv();
  DOM.emptyNode(PDdiv);
  DOM.removeNode(PDdiv);

  obj = 0;
  span = 0;
  PDdiv = 0;
  DOM.div = 0;

  // alert("DOM.onUnload( ):\n" + len + " DOM.HTML objects unloaded")

},  // end of onUnload()



// [private]
// This method is bound to the HTML{} object, and so the "this" keyword refers to the HTML{} object.
// Return the <span> tag of the HTML{} object
span:function(){
   var obj=this;
   if (!obj.spanObj) obj.spanObj = obj.doc.getElementById(obj.spanId);

   return obj.spanObj || null;
},


// [private]
// This method is bound to the HTML{} object, and so the "this" keyword refers to the HTML{} object.
//
// Return the width of the inserted HTML{} object.
// The HTML{...} object contains the <span>, which contains the HTML tag that instantiates
// the browser plugin.
//
// We measure the width of the <span> container, instead of measuring
// the width of the HTML tag(s) contained within the <span> container.
// I believe it is safer and more reliable this way.
//
// *** NOTE: When you have a <span><object width=A height=B></object></span>
// when the <object> tag instantiates a plugin, the <span> width will stretch
// to width=A, but the <span> height does NOT stretch to height=B. Instead, it appears
// that the <span> height only goes to the line-height, or the height of a text line would
// be. This is a good reason why we only measure the <span> width, and not the <span> height.
//
// There is a very small chance that the browser/plugin thinks that when you try to access
// a property of the HTML tag, that you are trying to access a property of the plugin instead.
// So, we try to avoid interacting with the HTML tag that instantiates the plugin. Instead,
// we interact with the parent <span>.
//
// We avoid looking at "width/scrollWidth/offsetWidth/parentNode" properties of the HTML tag that
// instantiates the plugin.
// It does not make sense to look at the HTML tag scrollWidth when the HTML tag is displaying
// altHTML and the plugin is not instantiated. The HTML tag scrollWidth
// might not even be defined in that case. So, we can only look at the
// <span> scrollWidth.
//
// Note that .parentNode of the HTML tag is the <span>. But we cannot use
// the .parentNode property of the HTML tag because Chrome 2.0/JRE 1,6,0,10 thinks that
// .parentNode is a Java method - returns [Java Package "parentNode"].
//
// If the HTML tag is displaying altHTML, then we can measure its width by looking at the <span>.
// If the HTML tag is displaying the plugin, then we measure its width by looking at the <span>.
//
// Return a width number.
// If width is not defined, then return -1
//
width: function(){

   var obj=this, span=obj.span(),
       scrollWidth, offsetWidth, noWidth=-1;

   // Returns the entire width of an element (including areas hidden with scrollbars).
   // The <span> tag is an inline element, and hence should have no scrollbars.
   scrollWidth = span && $.isNum(span.scrollWidth) ? span.scrollWidth : noWidth;
   
   // Returns the width of an element, including borders and padding if any, but not margins.
   // In our case, the <span> elements have no borders, no padding, and no margins.
   offsetWidth = span && $.isNum(span.offsetWidth) ? span.offsetWidth : noWidth;

   // span.clientWidth appear to always be 0, so it does not give us any useful information


   // Note: Sometimes a browser may not recognize scrollWidth, or may not
   // recognize offsetWidth. Hence we look at both.
   //
   // Note: <span> tags are inline, and hence do not have scrollbars.
   // For some browsers, the <span> scrollWidth is given as 0 even though <span> width is > 0.
   //   This might be because the <span> has no scrollbars.
   //   Chrome && Safari seem to behave in this manner.
   // For other browsers, the <span> scrollWidth is given by >0.
   //
   // As a general rule, the <span> width should always by > 0.
   // It contains either an instantiated plugin (1px x 1px) or altHTML (>1px).
   //
   // So, we will try to return the offsetWidth of the <span>.
   // So if offsetWidth > 0, then we use that value.
   // If offsetWidth <=0, then we try to use scrollWidth. 
   // If scrollWidth >0, then we use that value.
   // If scrollWidth <=0, then we use Math.max(offsetWidth, scrollWidth).


   span=0;

   return offsetWidth > 0 ? offsetWidth :
     (scrollWidth > 0 ? scrollWidth : Math.max(offsetWidth, scrollWidth));



},    // end of width()


// [private]
// This method is bound to the HTML{} object, and so the "this" keyword refers to the HTML{} object.
//
// Given an HTML{} object, we return the HTML tag DOM object.
// The HTML{...} object contains the <span>, which contains the HTML tag that instantiates
// the browser plugin.
//
// Note: we intentionally avoid having any variable point to any HTML tag.
// This is a precaution to avoid possible memory leaks, to interact with plugin
// HTML tags as little as possible, etc...
obj: function(){

   var span = this.span();

   // return null if no result
   return span ? span.firstChild || null : null;

},


// [private]
// This method is bound to the HTML{} object, and so the "this" keyword refers to the HTML{} object.
//
// Given an HTML{} object, we return the HTML tag readyState.
// The HTML{...} object contains the <span>, which contains the HTML tag that instantiates
// the browser plugin.
//
// Get readyState of the HTML tag that attempts to instantiate a plugin.
// For IE < 11, we return the readyState of the HTML tag.
// For non-IE or IE 11+, we return undefined.
//
// [IE < 11 has a readyState property. IE 11+ has no readyState property.]
readyState: function(){

   var obj=this;

   // We only access the readyState property for a plugin object when we are sure
   // that a readyState property even exists. We do NOT want to access the readyState
   // property for an HTML tag if it is not officially supported by a browser,
   // because there is a possibility that the readyState "query" could be passed on to the
   // plugin itself, instead of just the HTML tag. We want to avoid interacting with
   // the plugin object itself, whenever possible.
   //
   // The readyState property can only exist for IE < 11. For IE 11+ it no longer exists.
   // If the <span> container has a readyState, then we look at the readyState for its child.
   //
   // We check for browser.isIE, in case a non-IE browser has a readyState property. This
   // routine is only for IE.

   return $.browser.isIE && $.isDefined($.pd.getPROP(obj.span(), "readyState")) ?
       $.pd.getPROP(obj.obj(), "readyState") : $.UNDEFINED;

},


// [private]
// This method is bound to the HTML{} object, and so the "this" keyword refers to the HTML{} object.
//
// Given an HTML{} object, we return the HTML tag "object" property.
// The HTML{...} object contains the <span>, which contains the HTML tag that instantiates
// the browser plugin.
//
//
// For IE 6+, HTML tags that instantiate a plugin/addon often have an "object" property.
// The object property gives us access to the ActiveX control.
// So, we can access an ActiveX control using either:
//   1)  <tag>.ActiveXcontrolProperty
//   2)  <tag>.object.ActiveXcontrolProperty
//
//
// NOTE:
// If <tag>.object is an object{}, then the plugin is installed, enabled, and is running.
//
// If <tag>.object is defined and evaluates to boolean false, then:
//  1) the plugin is not capable of instantiating in the HTML tag, either
//     because it is not installed, not enabled in the addons menu, or a security popup
//     is preventing it from running, or ActiveX is disabled.
//  OR
//  2) The plugin is capable of running in HTML tag, but its properties/methods
//    cannot be accessed via the HTML tag. This is either because the plugin authors
//    did not provide for this, or because plugin scripting has been turned off in the
//    browser settings.
//
// In other words, plugin.object being defined and evaluating to boolean false
// is not a guarantee that the plugin is not running in the HTML tag.
// Therefore, there is not enough information to determine the status of the plugin.
//
objectProperty: function(){

   var obj=this, DOM=obj.DOM, objectProperty;

   // if not enabled, then the returned objectProperty will be undefined
   if (DOM.isEnabled.objectProperty(obj)) objectProperty = $.pd.getPROP(obj.obj(), "object");

   return objectProperty;

},


// [private]
// EVENT HANDLER
// When HTML{} object has loaded, we set loaded = 1.
onLoadHdlr:function($, obj){
     obj.loaded = 1;
},




// [public]
// We determine if a plugin is active or not by looking at the width of the parent node 
// of the HTML tag that is used for instantiation. 
// Also, for IE we look at the "object" property of the HTML tag that is used for
// instantiation.
//
// This is an indirect method to determine plugin status.
// We do not attempt any Javascript to plugin object interaction to determine plugin status here,
// because that may not always be possible (ie. we do not directly query the Java applet 
// or Flash applet, etc...).
// We do not attempt to access any properties of the HTML tag that instantiates the plugin,
// because a buggy plugin/browser may try to interact with the plugin instead of access the
// HTML property. The only exception to this rule is for IE, but that is only one specific browser.
//
//
// RETURN VALUES:
// Return 1.5 (IE only, OTF) if "object" property exists for the HTML tag for the plugin,
//     and is an object, hence the plugin is installed & active.
// Return 1 if TagToTestHTML exists and it appears(most likely) to display active plugin content.
//   Hence the relevant plugin is installed/enabled and is running.
//   [This result is the most reliable for the <object> tag, because its behavior follows
//   a well defined standard - when a plugin is installed, its width == $.DOM.pluginSize so we
//   return 1, and when plugin is not installed/not enabled, it displays altHTML.]
//   [This result is NOT reliable for <applet> tags, because <applet> tags are deprecated.
//   If <applet> tag width == DOM.pluginSize then we cannot conclude that the plugin is active
//   or not. Chrome 5, for example, never shows altHTML in the <applet> tag. But, when it displays
//   altHTML then we know that the plugin is not installed/not enabled.]
// Return 0 if unsure about plugin status. Need more time to detect.
// Return -0.1 (IE only, OTF (I think)) if the plugin appears to be installed, 
//   but the enabled status is not determined yet. Need more time to detect the enabled status.
//   [This result can only occur for "detectInstNotEnabled" input arg == 1]
// Return -0.5 (IE only) if the plugin is installed but not enabled.
//   [This result can only occur for "detectInstNotEnabled" input arg == 1]
// Return -1 if node exists, and altHTML (text) is being displayed. We assume that the
//   node will continue as altHTML. This means that the plugin is not installed or disabled.
// Return -2 if node is empty (no text, no plugin object).
//
//
// When return value is 0 or -0.1, then we need more time to finish detection. Run this routine
// again in the future to get the final value.
// When return value is > 0 or < -0.1, then detection done. No need to run this routine again.
//
//
// INPUT ARGUMENTS:
// @TagToTestHTML - HTML object for tag that we are testing to see if it displays active content.
//    We are trying to see if the plugin within this tag is running or not.
//    Mandatory input. Object must be in an <iframe>.
// @DummySpanTagHTML - HTML object for dummy <span>altHTML<span>
//    inserted into DOM BEFORE TagToTestHTML.
//    Mandatory input. Object must be in an <iframe>.
// @DummyObjTagHTML1 - HTML object for dummy <object width=DOM.pluginSize>altHTML</object>
//    inserted into DOM AFTER TagToTestHTML. Object must be in an <iframe>.
// @DummyObjTagHTML2 - HTML object for dummy <object width=DOM.pluginSize>altHTML</object>
//    inserted into DOM AFTER TagToTestHTML. Object must be in an <iframe>.
// [It is mandatory to have one or both DummyObjTagHTML inputs]
// @NOTFcount - # of NOTF intervals that have passed since inserting the tag into web page
//    Can be undefined/null or a number>=0. Optional input.
// @detectInstNotEnabled - [1/0/undefined] Tells us if we should try to detect
//   the "installed but not enabled" staus for a plugin. This is for IE only. Optional input.
//
//
// *** Note: Suppose DummyObjTagHTML1 has a mimetype property, and DummyObjTagHTML2 has a
// classid property. So if TagToTestHTML has a mimetype, then we need to use the
// DummyObjTagHTML1 that has a mimetype when determining plugin status. 
// If TagToTestHTML has a classid, then we need to use the DummyObjTagHTML2 that has a
// classid when determining plugin status. We do this to maintain symmetry for IE,
// when trying to detect whether the plugin is installed but not enabled for TagToTestHTML.
// We try to make the the tags as similar as possible in order for this detection to work.
//
// NOTE: TagToTestHTML should be instantiated BEFORE DummyObjTagHTML1/DummyObjTagHTML2.
// The reason is that we wait for these dummy Tags to show their altHTML and THEN we
// look to see if TagToTestHTML is showing its altHTML.
//
getTagStatus: function(TagToTestHTML,
   DummySpanTagHTML, DummyObjTagHTML1, DummyObjTagHTML2,
   NOTFcount, NOTUSED, detectInstNotEnabled){


  var DOM=this;


  // Error.
  // The HTML tag we want to test does not seem to exist.
  if (!TagToTestHTML || !TagToTestHTML.span()) return -2;

  // TagToTestHTML.obj() is the plugin object in the DOM in question.
  // We wish to determine if active content is running in this object.
  var TagToTestWidth = TagToTestHTML.width(),

      // We intentionally avoid having any variables point to the HTML tag DOM object,
      // just to be overly cautious. We also remember not to use
      //  (TagToTestHTML.obj() + "...") to avoid interacting directly with the HTML tag 
      // or the plugin.
      TagToTestIsDomObj = TagToTestHTML.obj() ? 1 : 0,
  
      TagToTestReadyState = TagToTestHTML.readyState(),

      // This is an IE-only property
      TagToTestObjectProperty = TagToTestHTML.objectProperty();

  $.message.write("[ ]", $.message.end());
  $.message.write("[ TagToTestHTML is an <" + TagToTestHTML.tagName + "> tag ]", $.message.end());
  $.message.write("[ TagToTestHTML.tagName: " + TagToTestHTML.tagName + " ]", $.message.end());
  $.message.write("[ TagToTestHTML.obj( ): " + (TagToTestIsDomObj ? "HTML DOM object{ }" : null) + " ]", $.message.end());
  $.message.write("[ TagToTestHTML.object: " +
      (TagToTestObjectProperty ? "object{ }" : TagToTestObjectProperty) + " ]", $.message.end());
  $.message.write("[ TagToTestHTML.time: " + TagToTestHTML.time + " ]", $.message.end());
  $.message.write("[ TagToTestHTML.width: " + TagToTestWidth + " ]", $.message.end());
  $.message.write("[ TagToTestHTML.readyState: " + TagToTestReadyState + " ]", $.message.end());


  // When object property is an object{}, then the plugin is installed and enabled
  // and is running in the HTML tag.
  // IE only.
  if (TagToTestObjectProperty) return 1.5;




  var reg=/clsid\s*\:/i,

    // Find the Dummy Tag that has a classid
    classidObj = DummyObjTagHTML1 && reg.test(DummyObjTagHTML1.outerHTML||"") ? DummyObjTagHTML1 :
         (DummyObjTagHTML2 && reg.test(DummyObjTagHTML2.outerHTML||"") ? DummyObjTagHTML2 : 0),

    // Find the Dummy Tag that has no classid, which means the Dummy has a mimetype.
    typeObj = DummyObjTagHTML1 && !reg.test(DummyObjTagHTML1.outerHTML||"") ? DummyObjTagHTML1 :
         (DummyObjTagHTML2 && !reg.test(DummyObjTagHTML2.outerHTML||"") ? DummyObjTagHTML2 : 0),

    // If TagToTestHTML has a classid property, then DummyObjTagHTML = classidObj.
    // If TagToTestHTML has no classid property, then it is either an <applet> tag,
    //   or a tag with a mimetype. Then DummyObjTagHTML = typeObj.
    DummyObjTagHTML = TagToTestHTML && reg.test(TagToTestHTML.outerHTML || "") ? classidObj : typeObj;

  // Error
  // DummySpanTag or DummyObjectTag nodes are empty.
  // Therefore, we cannot determine the status of TagToTestHTML.
  if (!DummySpanTagHTML || !DummySpanTagHTML.span() ||
      !DummyObjTagHTML || !DummyObjTagHTML.span()) return -2;


       // DummyObjTagHTML.span() is <span><object width=DOM.pluginSize>altHTML</object></span>.
       // DummyObjTag1 is a dummy <object> tag that displays altHTML.
       // DummyObjTagWidth is the width of the parent <span>.
       //
       // We want to make sure that the <object> tag is displaying altHTML.
       // This empty object tag is just a dummy tag that we use as a test, to make sure that
       // the browser is capable of allowing tags to display altHTML.
  var DummyObjTagWidth = DummyObjTagHTML.width(),

       // DummySpanTagHTML.span() is only <span>altHTML</span>.
       // DummySpanTag is a <span> tag that displays altHTML.
       // DummySpanTagWidth is the width of the <span>.
       DummySpanTagWidth = DummySpanTagHTML.width(),


       DummyObjTagReadyState=DummyObjTagHTML.readyState();

  $.message.write("[ ]", $.message.end());
  $.message.write("[ DummyObjTagHTML is an <" + DummyObjTagHTML.tagName + "> tag ]", $.message.end());
  $.message.write("[ DummyObjTagHTML.tagName: " + DummyObjTagHTML.tagName + " ]", $.message.end());
  $.message.write("[ DummyObjTagHTML.object: " +
      (DummyObjTagHTML.objectProperty() ? "object{ }" : DummyObjTagHTML.objectProperty()) + " ]", $.message.end());
  $.message.write("[ DummyObjTagHTML.time: " + DummyObjTagHTML.time + " ]", $.message.end());
  $.message.write("[ DummyObjTagHTML.width: " + DummyObjTagWidth + " ]", $.message.end());
  $.message.write("[ DummyObjTagHTML.readyState: " + DummyObjTagReadyState + " ]", $.message.end());

  $.message.write("[ ]", $.message.end());
  $.message.write("[ DummySpanTagHTML.width: " + DummySpanTagWidth + " ]", $.message.end());

  $.message.write("[ ]", $.message.end());
  $.message.write($.isNum(NOTFcount) ? ("[ NOTF count: " + NOTFcount + " ]") : 0, $.message.end());


  // Make sure that the widths exist (should be >=0)
  if ( TagToTestWidth < 0 || DummyObjTagWidth < 0 ||

       // The dummy <span> width should be > DOM.pluginSize
       DummySpanTagWidth <= DOM.pluginSize

       ) return 0;  // unsure, need to wait longer.




  // We now look at several IE-only properties of the HTML tag.
  // From this we try to determine if the plugin is installed or not.
  // This is an EXPERIMENTAL technique that can show when a plugin is installed,
  // even when that plugin is DISABLED in the add-ons menu.
  // This only applies to IE < 11.
  //
  //
  // At this point, TagToTestObjectProperty could be undefined, false, null, 0, "".
  // I believe we are only interested in the case where TagToTestObjectProperty is defined,
  // because then other IE-only properties of the HTML tag should also be available for
  // us to look at.
  // [According to my testing of IE, if TagToTestObjectProperty is defined but is not an object{},
  // then it will only be null.]
  // Therefore, we have either:
  //
  //  1) the plugin is not capable of instantiating in the TagToTestHTML tag, either
  //     because it is not installed, not enabled in the addons menu, or a security popup
  //     is preventing it from running. altHTML will be displayed by the HTML tag.
  //     The plugin is not instantiated.
  //
  //  2) The plugin is capable of running in TagToTestHTML tag, but the plugin properties/methods
  //     cannot be accessed via the TagToTestHTML tag. This is either because the plugin authors
  //     did not provide for this, or because plugin scripting has been turned off in the
  //     browser settings. altHTML is NOT displayed.
  //
  //  3) The plugin is instantiated, but the HTML tag still only displays altHTML.
  //     This is a type of buggy behaviour I have seen in Foxit Reader.
  //     An active X control starts up and runs, but nothing except altHTML is displayed by
  //     the HTML tag. This case should be fairly uncommon.
  //
  //
  // In other words, $.isDefined(TagToTestObjectProperty) (== null)  is NOT a guarantee
  // that the plugin is NOT running in the HTML tag. Therefore, there is not enough
  // information to determine the status of the plugin based soley on TagToTestObjectProperty.
  // Thus we need more info.
  //
  // Hence, we will try to detect if the plugin is installed, by looking at
  // the HTML tag widths and readyStates. We only do this for IE.
  //
  //
  // Note: For IE 7, tags with classid are too slow, and only have useful values
  // until long AFTER window.onload has fired. Hence, we cannot detect anything in that case.
  // Even the Dummy Tags will have readyState==0 until long after window.onload.
  // However, tags with mimetypes are still fast enough and can be used.
  // For IE 8+, tags with either classid/mimetype can be used here.
  // For IE 6 and lower, it is probably even worse, but those browsers are no longer used
  // so we do not have to worry about them.
  //
  // A few observations:
  // 1) TagToTestHTML was inserted into the DOM first, and THEN we inserted
  //    DummyObjTagHTML.
  // 2) We considered having DummyObjTagHTML inserted into the DOM BEFORE
  //    TagToTestHTML, but that would have been risky. TagToTestHTML
  //    can take a relatively long time to insert into the DOM (compared to
  //    the dummy tags), and in the meantime it is possible that
  //    DummyObjTagHTML may have reached the point of displaying altHTML.
  // 3) The tags may or may not be displaying altHTML at the time we test them here.
  // 4) We make sure that the tagNames are the same, just to be on the safe side
  //    Since DummyObjTagHTML is an <object> tag, then TagTotestHTML should
  //    also be an <object> tag. We do not want to compare an <applet> tag
  //    to an <object> tag because they may not necessarily behave exactly
  //    alike.
  // 5) If TagToTestHTML has a mimetype, then DummyObjTagHTML should also
  //    have a mimetype. If TagToTestHTML has a classid, then DummyObjTagHTML
  //    should also have a classid. This will make the detection here more
  //    reliable.
  // 6) For a tag that does not instantiate any plugin, the readyState appears to
  //    only be capable of having values: 0, 4, complete, undefined.
  //    For a tag that instantiates and displays a plugin, the readyState appears
  //    to be capable of having values: 0, 1, 2, 3, 4, complete.
  // 7) If TagToTestHTML and DummyTagHTML both have the same width, but
  //    TagToTestHTML has readyState===0 and DummyTagHTML has readyState!==0
  //    then plugin is installed. Whether the plugin is enabled or not in the HTML tag is
  //    determined later on in this routine, depending on whether altHTML is
  //    eventually displayed or not.
  // 8) If TagToTestHTML width==1 and DummyTagHTML width==4.
  //    This case would not occur is the plugin is not installed.
  //    Thus, most likely the plugin is installed, and that will be handled elsewhere in
  //    this routine.
  //    We have 2 possibilities here:
  //   a) The plugin is installed and enabled. We simply wait long enough, and we will
  //      see that the plugin is indeed running because the altHTML would never display.
  //   b) The plugin is installed but not enabled. This means the plugin will not run
  //      in the <object> tag. Is this case even possible? If the plugin cannot run,
  //      just as the DummyObjTagHTML cannot run, then would they not just have the same
  //      width at any given moment?
  // 9) If TagToTestHTML width==4 and DummyTagHTML width==1 then
  //    most likely the plugin is not installed, and that will be handled elsewhere
  //    in this routine. However, this possibility probably will not happen because
  //    even though TagToTestHTML was inserted first, the 2 tags should display
  //    their altHTML at the same time. See 10).
  // 10) When we add an alert() or a large download image to create a delay, we see
  //    that the delay has no effect on when the Tags start to display their altHTML.
  //    It depends on waiting for another NOTF count, or waiting for window.onload
  //    to fire.
  //
  if (detectInstNotEnabled && !TagToTestHTML.pi &&
        
        $.isDefined(TagToTestObjectProperty) && $.browser.isIE &&

        TagToTestHTML.tagName == DummyObjTagHTML.tagName &&
      
        // We make sure that TagToTestHTML was instantiated before or at the
        // same time as DummyObjTagHTML.
        TagToTestHTML.time <= DummyObjTagHTML.time &&

        TagToTestWidth === DummyObjTagWidth &&

        // If the plugin is being blocked because it is disabled in the addons menu,
        // or because a security popup is blocking it, then its readyState is 0.
        //
        // readyState 0
        // Object is not initialized with data.
        //
        // readyState 1
        // Object is loading its data.
        //
        // readyState 2
        // Object has finished loading its data.
        //
        // readyState 3
        // User can interact with the object even though it is not fully loaded.
        //
        // readyState 4
        // Object is completely initialized
        //
        // Note: when a plugin cannot instantiate in the HTML tag, then
        // it appears to never have readyStates 1,2,3. So, it can only have
        // readyStates 0,4,complete,undefined.
        // It appears that the DummyObjTag reaches a higher readyState sooner
        // than the TagToTest.
        TagToTestReadyState===0 && DummyObjTagReadyState!==0


     // Plugin is probably installed = 1
     )   TagToTestHTML.pi = 1;
             



  $.message.write(TagToTestHTML.loaded===null ? 
    "[ *** Error: TagToTestHTML{ } needs to be within an <iframe> ]" : 0, $.message.end());
  $.message.write(DummySpanTagHTML.loaded===null ?
    "[ *** Error: DummySpanTagHTML{ } needs to be within an <iframe> ]" : 0, $.message.end());
  $.message.write(DummyObjTagHTML.loaded===null ?
    "[ *** Error: DummyObjTagHTML{ } needs to be within an <iframe> ]" : 0, $.message.end());



  // If DummyObjTagWidth is less than DummySpanTagWidth, then the
  // dummy object is not showing altHTML yet. We want to wait for dummy object to show 
  // its altHTML before proceeding.
  //
  // When dummy object is showing altHTML, then:
  //   Usually DummyObjTagWidth == DummySpanTagWidth
  //   There is a very small chance that DummyObjTagWidth > DummySpanTagWidth
  if (DummyObjTagWidth < DummySpanTagWidth ||

       // If one or more of out HTML{} objects has not fully loaded yet, then we need to wait
       !TagToTestHTML.loaded || !DummySpanTagHTML.loaded || !DummyObjTagHTML.loaded

      // Return 0 if unsure, need more time to detect
      // Return -0.1 if plugin appears to be installed, but need more time to determine
      //   enabled status.
     ) return TagToTestHTML.pi ? -0.1 : 0;



  // If we get this far, then all <iframe>s are fully loaded.





  // When TagToTestWidth == DummySpanTagWidth, this means that
  //   width of <span><obj width=DOM.pluginSize height=DOM.pluginSize>altHTML</obj></span> is
  //   >= width of <span>altHTML</span>
  //   (where <obj> is <object> or <applet> tag used to instantiate a plugin)
  //   This strongly implies that the plugin is not active and is displaying altHTML.
  //   We chose the altHTML and its fontSize to be > DOM.pluginSize.
  //
  // Note: In Opera 8/8.5/9.01/9.26, when <applet>altHTML</applet> displays altHTML,
  // the width == DummySpanTagWidth + 2. This is a quirk of that browser.
  // For most/all other browsers, when <applet> displays altHTML, the width == DummySpanTagWidth.
  //
  // Note: In Firefox, when plugin not activated, it can show a message asking
  // to activate the plugin. This causes the TagToTestWidth >> DummySpanTagWidth.
  // For this reason, we use TagToTestWidth == DummySpanTagWidth here,
  // and NOT TagToTestWidth >= DummySpanTagWidth.
  //
  // Note: For IE 6 + Java 1.2.2_017 for the <applet> tag, I have seen that the tag width was 0,
  // and DOM Obj for the tag seemed to not even exist. It is better to use !TagToTestIsDomObj
  // than width===0, because it is possible for width to be 0 while the Tag Dom object still
  // existed.
  // On the other hand, in those cases where the parent <span></span> is simply empty,
  // then !TagToTestIsDomObj will handle it.
  //
  //
  // TagToTest is displaying altHTML, or does not exist at all.
  if (TagToTestWidth == DummySpanTagWidth || !TagToTestIsDomObj)
  {
          return TagToTestHTML.pi ? -0.5 : -1;
  }



  // If TagToTestWidth==DOM.pluginSize then the plugin is probably active.
  //
  // IE: We also look at plugin.readyState==4 to make sure that status of the
  // tag will not change.
  //
  // IE 7/8: It turns out that even after window.onload has fired, the
  // final state of the <object>/<applet> tag may not have been reached. It turns out
  // that when Java is not installed, then when window.onload fires the tag
  // may still be in a state of flux and may still have a nodeType==1 but a readyState
  // of 0. Hence we have to look at the readyState here to prevent a false positive.
  else if (TagToTestWidth==DOM.pluginSize && TagToTestIsDomObj &&

             // If readyState not defined, then we have non-IE browser or IE 11+
             // If readyState is defined, we make sure == 4.
             (!$.isNum(TagToTestReadyState) || TagToTestReadyState === 4)

        ){
               return 1;
         }



  // If TagToTestWidth != DummySpanTagWidth
  // and if TagToTestWidth != DOM.pluginSize
  // then ...
  //
  // We add this code as a fallback position, to prevent a possible infinite NOTF loop.
  // We say here that detection is done by returning -0.5 or -1.
  return TagToTestHTML.pi ? -0.5 : -1;


},    // end of getTagStatus()


// [public]
// tag is a DOM object whose style will be set.
// inputStyle is input array, that specifies styleNames and styleValues.
//
setStyle: function(tag, inputStyle){

      var tagStyle = tag.style, x;

      if (tagStyle && inputStyle)
      {

         for (x=0;x<inputStyle.length;x=x+2)
         {
               
              //   tag.setAttribute(inputStyle[x], inputStyle[x+1])

               // We use try-catch when setting these styles in case the browser
               // gives an error and says that it is not allowed, and then stops execution.
               try{
                 tagStyle[inputStyle[x]] = inputStyle[x+1];
                 }
               catch(e){
               //   $.message.write(["[ HTML tag: Unable to set style " + inputStyle[x] + ", " +
               //      inputStyle[x+1] + " ? ] ", e], $.message.end());
               // We cannot use $.message.write here due to recursion. Message write itself
               // uses setStyle().
               }


         }
      }
      
      tag=0;
      tagStyle=0;

},    // end of setStyle()


// [private]
// Get style data for various HTML tags.
//
// Remember that we have to set these styles to override any CSS
// styles of the web page, that could make these tags visible due to inheritance,
// or cause them to misbehave in some way.
getStyle:{

  iframe:function(){
     return this.span();  // return array
  },


  // [public]
  // Return style data for <span>
  span:function(str){

      var DOM = $.DOM, result;

      result = str ? this.plugin() : ([].concat(this.Default).concat(
               ["display","inline",
                "fontSize",(DOM.pluginSize+3)+"px",
                "lineHeight",(DOM.pluginSize+3)+"px"
               ]));

      return result;

      // We make sure that the fontSize/lineheight of any text is not larger than
      // the height of the parent <div>.
      //
      // The <span> height == lineHeight.
      // Normally, a <span> child will have a width of DOM.pluginSize when the
      // plugin is instantiated, but if it displays
      // alternate text(ie. plugin not active) the width will be more than
      // DOM.pluginSize.
      // There is no point in setting width & height here in css, because span is
      // an inline element.


  },  // end of span()

  // [public]
  // Return style data for <div>
  div:function(){
      
      var DOM = $.DOM;
         
      return [].concat(this.Default).concat(

               ["display", "block",

                // Give some room for different plugins in the DOM.div.
                // Must set lineheight, fontSize for IE 7 so div has small height.
                "width", DOM.divWidth + "px",
                "height", (DOM.pluginSize+3) + "px",
                "fontSize", (DOM.pluginSize+3) + "px",
                "lineHeight", (DOM.pluginSize+3) + "px",

                // We wish to hide the <div> from the end user, so we position it off screen.
                // We do not want the end users to see the instantiated plugin objects,
                // since this library must be unobtrusive.
                //
                // We CANNOT use "display:none" or "visibility:hidden", or else the 
                // plugin detection will not work!
                //
                // Setting visibility = "hidden" causes the Java ActiveX object to
                // not instantiate correctly. It prevents the tag from loading properly, and
                // the getVersion() method then cannot be accessed.
                "position","absolute",
           
                "right","9999px",

                "top","-9999px"

               ]);

  },  // end of div()

  // [public]
  // Return style data for <object>/<embed>/<applet> tag that instantiates the plugin
  plugin:function(hidden){

      var DOM = $.DOM;

      // For the HTML tag that instantiates the plugin, we
      // have to allow for the possibility of using either
      // "visibility:hidden;" or "visibility:visible;".
      // The hope is that this will make it easier for some plugins to
      // instantiate. Some plugins were never intended to display
      // in a small DOM.pluginSize x DOM.pluginSize area.
      // For example, a PDF Reader or even a Media Player usually have
      // extra controls around their own display area - obviously they
      // were intended to be displayed in a large window, not a very small one.
      // In some cases, it may be possible that "visibility:visible;" would
      // cause problems.
      //
      // We do not use "display:none;", because that could prevent the plugin
      // from instantiating at all.
         
      return "background-color:transparent;" +
             "background-image:none;" +
             "vertical-align:baseline;" +
             "outline-style:none;" +
             "border-style:none;" +
             "padding:0px;" +
             "margin:0px;" +
             "visibility:" + (hidden ? "hidden;" : "visible;") +
             "display:inline;" +
             "font-size:" + (DOM.pluginSize+3) + "px;" +
             "line-height:" + (DOM.pluginSize+3) + "px;";

  }, // end of plugin()

  // [public]
  Default: [
      "backgroundColor","transparent",
      "backgroundImage","none",
      "verticalAlign","baseline",
      "outlineStyle","none",
      "borderStyle","none",
      "padding","0px",
      "margin","0px",
      "visibility","visible"  // container must be visible for plugins to work
  ]


},  // end of getStyle()


// [public]
// Insert div into <body>
//
// @div is the <div> tag to insert
// @top is true, false, or undefined. When true, then <div> is inserted into
// window.top.document.body, instead of window.document.body
insertDivInBody: function(div, top){

     var id="pd33993399", idObj=null,
       doc = top ? window.top.document : window.document,
       body = doc.getElementsByTagName("body")[0] || doc.body;

     // if <body> does not exist, then we try to create it using document.write()
     // We must have the document.body object before we can instantiate the plugin.
     if (!body)
     {
               try{

                   // Try to use document.write() to create <body> tag
                   // <div>o</div> is added to force <body> creation
                   //
                   // You would think that this <div>o</div> is always the very first child in the
                   // document.body, but that is not always true (at least in IE 8).
                   // For this reason, I give this div an id, so I can delete it later
                   // using getElementById().
                   doc.write("<div id=\"" + id + "\">." + $.openTag + "/div>");
                   idObj = doc.getElementById(id);

               }catch(e){
                  $.message.write(["[ Unable to use document.write? ] ", e], $.message.end());
               }

      }

      body = doc.getElementsByTagName("body")[0] || doc.body;

      if (body)
      {

         // There is a bug in IE. If you place a PluginDetect command in a script
         // element, and that script element is not a top level DOM node in the
         // <body>, then you will get an error message popup - but only if we use
         // body.appendChild() command to insert the div.
         //
         // For example:
         //  <body>
         //    <div>
         //      <script> var V=$.getVersion("Java")</script>
         //    </div>
         // </body>
         //
         // The above example is bad for IE, because appendChild would try to append
         // something when the <div> tag shown above has not been fully parsed yet.
         // The way around this is to insert our div element before body.firstChild.
         //
         // Hence we try to insert div BEFORE body.firstChild. This solves the problem.
         // http://blogs.msdn.com/ie/archive/2008/04/23/what-happened-to-operation-aborted.aspx
         //
         // if body.firstChild is null, then insertBefore() behaves like appendChild().
         body.insertBefore(div, body.firstChild);

         if (idObj) body.removeChild(idObj);
      
      }
            
   // else{  // else <body> does not exist yet, and could not be created using document.write()
             // if document.write() fails to generate the <body> due to an XHTML/XML
             // doctype, then we have 3 options:
             //   1) use DOM methods to generate <body> and add it to this
             //   document. The drawback is that we would have to remove this
             //   <body> object before the real <body> object is parsed
             //   in the HTML.
             //   2) Create a new document using Javascript, and add a <body> to that
             //   new document.
             //   3) Use a delay to wait until the <body> tag is parsed
             //
             // These approaches all have disadvantages of some sort, so for the
             // time being we would just recommend that you start Java detection
             // from within the <body> tag itself when dealing with XHTML documents
             // (ie. documents that do not allow document.write)

      // }

      div=0;

},   // end of insertDivInBody()


iframe:{

// [private]
// EVENT HANDLER
// When <iframe> loads, this routine is called.
// Runs all the handlers in array @arr
onLoad:function(arr, label){

   $.message.write("[ ]", $.message.end());
   $.message.write("[ <iframe> " + ($.isString(label) ? "(" + label + ") ": "") + "has loaded " +
            $.message.time($) + " after script initialization ]", $.message.end());
   
   $.ev.callArray(arr);

   $.message.write("[ ]", $.message.end());

},


// [public]
// Create <iframe> and insert into DOM.
// The <iframe> will contain instantiated plugins.
// When the <iframe> has fully loaded, the onLoad() handler will run.
insert:function(delay, label){

   var IFRAME=this, DOM = $.DOM, Container,
     iframe = document.createElement("iframe"),
     handler, win;


   DOM.setStyle(iframe, DOM.getStyle.iframe());
   
   iframe.width = DOM.iframeWidth;
   iframe.height = DOM.iframeHeight;


   DOM.initDiv();
   Container = DOM.getDiv();

   $.message.write("[ Inserting <iframe> " +
       ($.isString(label) ? "(" + label + ") ": "") + "into <div> ]" , $.message.end());

   // Must put <iframe> into DOM before we can access iframe.contentWindow or iframe.contentDocument.
   Container.appendChild(iframe);


   try{IFRAME.doc(iframe).open();}
   catch(e){
      $.message.write(["[ *** Error: Unable to open( ) <iframe> ] ", e], $.message.end());
   }



   iframe[$.uniqueName()] = [];
   handler = $.ev.handlerOnce(  // handler will only run once, due to $.ev.handlerOnce()
      $.isNum(delay) && delay>0 ?
         $.ev.handlerWait(delay, IFRAME.onLoad, iframe[$.uniqueName()], label) :
         $.ev.handler(IFRAME.onLoad, iframe[$.uniqueName()], label)
   );



   // Note: we use MULTIPLE techniques here to ensure that the <iframe> onload handler will 
   // get called. Otherwise the $.onDetectionDone() event handlers may never get called.


   // ** Attempt # 1
   $.ev.addEvent(iframe, "load", handler);
   
   // ** Attempt # 2
   // Note: for IE 8, if we were to have <iframe src="...">, then using $.ev.addEvent(iframe)
   // would not seem to work. So, we use iframe.onload as well as a backup, even
   // though we do not have a src property for the iframe.
   if (!iframe.onload) iframe.onload = handler;

   // ** Attempt # 3
   win = IFRAME.win(iframe);
   $.ev.addEvent(win, "load", handler);

   // ** Attempt # 4
   if (win && !win.onload) win.onload = handler;


   return iframe;

}, // end of insert()


// [public]
// Bind event handler to <iframe>. When iframe loads, then the event handler will run.
// We should perhaps rename this method to addOnLoadHandler().
addHandler:function(iframe, handler){
   if (iframe) $.ev.fPush(handler, iframe[$.uniqueName()]);
},


// [public]
close:function(iframe){
   try{this.doc(iframe).close()}
   catch(e){
      $.message.write(["[ *** Error: Unable to close( ) <iframe> ] ", e], $.message.end());
   }
},

// [public]
// Write to the <iframe>.
// Return the time delay >=0 (in ms) it took to insert the item into the DOM.
// Return -1 if unable to write.
write:function(iframe, str){
  
   var doc = this.doc(iframe), delay=-1, time;

   try{
      time = new Date().getTime();
      doc.write(str);
      delay = new Date().getTime() - time;
   }
   catch(e){
      $.message.write(["[ *** Error: Unable to write to <iframe> ] ", e], $.message.end());
   }

   return delay;
},

// [public]
win: function(iframe){
   try{return iframe.contentWindow}
   catch(e){}
   return null;
},

// [public]
doc: function(iframe){
   // Internet Explorer 8 (and higher) supports the contentDocument property only
   // if a !DOCTYPE is specified. For earlier versions of IE, use the contentWindow property.
   //
   // Under some circumstances, accessing contentWindow or contentDocument may cause an error.
   // So, we use try-catch.
   var doc;
   try{doc = iframe.contentWindow.document}
   catch(e){}
   try{if (!doc) doc = iframe.contentDocument}
   catch(e){}
   return doc || null;
}


}, // end of iframe{}




// [public]
// This routine inserts an HTML tag into the DOM.
// We return an HTML{} object.
//
//
// @tagName specifies the type of HTML tag to insert into the DOM.
// We insert the following into the DOM:
//        <span><tagName></tagName></span>
// We usually the span into one of 2 places:
//   1) a <div> such that  <div><span><tagName><tagName></span>...</div>
//       The <div> is in the <body> somewhere.
//   2) an <iframe> such that <body><span><tagName><tagName></span>...</body>
//
//
// @Container is optional.
// If specified, it can be a <div> or <iframe> into which we insert our HTML tags.
// If NOT specified, then we use the default <div> given by $.DOM.getDiv().
//
//
// Example
//   DOM.insert("object", ["Aname", "Aval"], ["Bname", "Bval"], altHTML)
//   would insert the following into a <div>:
//   <span><object width="1" height="1" Aname="Aval"><param name="Bname" value="Bval">altHTML</object></span>
//
//
// We put @tagName inside <div> so as to be compatible with XHTML.
// <div> can hold multiple spans.
//
// It seems that in pure XML documents, document.write/innerHTML will fail.
// However in XHTML, document.write fails but innerHTML works.
//
//
// @plugin is optional, is used to run the functions in
// the plugin.BIHndlrs array. It points to $.Plugins.plugin.
//
// Input arg "hidden" tells us to use "visibility:hidden;"  or  "visibility:visible;"
// 1 to use "visibility:hidden;"
// 0/undefined/null to use "visibility:visible;"
//
// This routine returns an HTML{} object
//      {span:HTMLspanTag, ...}
//
// The "span" property points to the span DOM object where we have
//       <span><tagName></tagName></span>
//       such that <div><span><tagName></tagName></span>...</div>
insert: function(tagName, misc, param, altHTML, plugin, hidden, Container){

         var DOM=this, tag, result, span, doc, x, tmp;


         $.message.write($.message.time(DOM.insert,1), $.message.end());  // Start measuring time delay


         // If input Container not specified, then make sure a <div> already exists in the DOM
         //    and is initialized.
         if (!Container){
           DOM.initDiv();
           Container = DOM.getDiv();
         }


         // Find the document{} object associated with Container.
         // If Container is not specified, then we default to document.
         if (Container)
         {
            if ((/div/i).test(Container.tagName)) doc = Container.ownerDocument;
            if ((/iframe/i).test(Container.tagName)) doc = DOM.iframe.doc(Container);
         }
         if (doc && doc.createElement){}
         else doc = document;




         if (!$.isDefined(altHTML)) altHTML="";


         // Generate tag string
         if ($.isString(tagName) && (/[^\s]/).test(tagName))
         {
            tagName = tagName.toLowerCase().replace(/\s/g,"");

            tag = $.openTag + tagName + " ";


         
            // Note: We set the style of the tag here, instead of setting it after
            // it is a child of the <span> element. Why? Reliability.
            //
            // We previously had inserted this tag into the <span> using innerHTML,
            // and THEN we set the tag style by accessing the style object itself 
            // ( via DOM.setStyle() ).
            // It turns out that in some rare cases, Firefox/Java would have some problems.
            // When we access the style object for the tag, we would have trouble querying 
            // the Java applet. Perhaps because the browser thinks that the style object 
            // is a Java applet method? (For this reason we use innerHTML instead of DOM
            // methods when constructing these HTML tags!!! It appears more reliable when
            // trying to query/interact with browser plugins.)
            //
            // In any case, we avoid this potential issue by setting the style inline,
            // ie. style="..." instead of using DOM.setStyle().
            //
            //
            // Note: Since this tag will be a child of a <span> element, then
            // we set the tag to a style of inline. Since spans are inline elements,
            // then the span children must be inline as well.
            // Since we are adding <object>/<applet>/<embed> tag to a <span>, we just wanted
            // to be sure.
            //
            // This is important to get right because at some point we may
            // need to look at the scrollWidth/offsetWidth of the <span>, and we want
            // to avoid getting a possible wrong value due to a child that has display:block
            // or display:inline-block;.
            //
            // When display is inline, then the child width can expand to allow
            // alternate content to show. When display is block, then the child width
            // may not expand when the alternate content is showing.
            //
            // Note: we are assuming here that input arg "misc" is not setting the style
            // of the tag.
            tag += "style=\"" + DOM.getStyle.plugin(hidden) + "\" ";



            var useDefault_width=1, useDefault_height=1;
            for (x=0;x<misc.length;x=x+2)
            {
                // Note: For Firefox 3.0.10 with JRE 1.6.0.11 when a parameter="",
                // we make sure that the parameter is not even included in the tag.
                // Otherwise, having codebase="" confuses the browser and then 
                // it cannot find the java class to run. This is a browser bug.
                // Higher versions of FF do not have this bug.
                // For this reason we test misc[x+1] and param[x+1]
                if (/[^\s]/.test(misc[x+1]))
                {
                    tag += misc[x] + "=\"" + misc[x+1] + "\" ";

                }
                
                if ((/width/i).test(misc[x])) useDefault_width=0;
                if ((/height/i).test(misc[x])) useDefault_height=0;

            }

            // If misc[] array does not specify width/height, then use default values
            // DOM.pluginSize is a number only.
            //
            // It's valid to use percentage values for height and width when you are using an HTML 4.01 doctype. 
            //    Ex. width="100%"
            // It's not valid in HTML5.
            // Pixel values are valid in HTML5 because it can sometimes be "semantic" to provide the intrinsic dimensions of a resource in the mark-up. 
            // But percentage values always imply that the values are presentational, so they are obsoleted 
            // in HTML5 and you should use CSS to provide those percentage dimensions instead.
            //
            // The width/height parameters thus assume pixels
            // Hence we use 
            //    width="DOM.pluginSize" height="DOM.pluginSize"
            // without using "px" here in the string
            //
            tag += (useDefault_width ? "width=\"" + DOM.pluginSize + "\" " : "") +
                   (useDefault_height ? "height=\"" + DOM.pluginSize + "\" " : "");

            // <embed> tags should be as follows: <embed width="..." height="..." type="..." />
            // We do NOT use <embed width="..." height="..." type="..."></embed>
            // Hence, we ignore the @param and @altHTML input args here.
            // The same goes for <img> tags.
            if (tagName=="embed" || tagName=="img")
            {
               tag += " />";
            }
            else
            {
               tag += ">";

               for (x=0;x<param.length;x=x+2)
               {
                if (/[^\s]/.test(param[x+1]))
                    tag += $.openTag + "param name=\"" + param[x] + "\" value=\"" + param[x+1] + "\" />";
               }

               tag += altHTML + $.openTag + "/" + tagName + ">";
            }


         }
         else{
            tagName = "";
            tag = altHTML;
         }




        // This is the default value of the HTMLobj{} we return.
        //
        // The spanObj property points to the <span></span> DOM object, which is the
        // parent container for <tagName></tagName>.
        //
        // Note: Normally, we could just use HTMLobj{}.obj().parentNode to get the span
        // object, but this does not work for Chrome 2 with JRE 1,6,0,10.
        // That browser thinks that .parentNode is a Java method for the applet.
        // Hence, it is safer to just use HTMLobj{}.span() to get the <span> tag directly.
        //
        // Also, instead of using HTMLobj{}.obj().tagName, we just add a tagName property.
        // Again, the reason is that some browsers/plugins may think that .tagName is a plugin
        // method as opposed to an HTML tag property. [We want to reduce the amount of
        // direct interaction with the HTML tag that displays a plugin, for safety reasons.]
        //
        // Note: We do NOT include a property in this HTMLobj{} that directly refers to the
        // <tagName></tagName> object. Thus, when plugin detection is completed, we only need
        // to empty the <span> and remove it from the DOM, and then that is all.
        // We do not need to bother to erase any properties of this HTMLobj{} that might
        // be pointing to an instantiated plugin.
        result = {spanId:"", spanObj:null, span:DOM.span, 
        
                 loaded:null, // == 0 when we have an <iframe> that has not loaded yet
                              // == null when we have some other HTML tag.

                 tagName:tagName, outerHTML:tag, DOM:DOM,

                 time:new Date().getTime(), // The start time (in ms) at which this tag was attempted to be inserted
                 insertDomDelay:-1, // Amount of time (in ms) it takes for a browser to insert this tag into the DOM
                                    // >=0 if successful, <0 otherwise

                 width:DOM.width, obj:DOM.obj, readyState:DOM.readyState,

                 objectProperty: DOM.objectProperty, doc:doc
        };




        // Insert the HTML tag into the Container
        if (Container && Container.parentNode)
        {

BOUNDARY("select.xtra.DOM && select.methodCheckbox.onbeforeinstantiate");

              // Here is where we run the functions in the plugin.BIHndlrs array,
              // right before the HTML tag is inserted into the DOM.
              if ((/div|iframe/i).test(Container.tagName) &&
                   plugin && plugin.BIHndlrs && plugin.BIHndlrs.length)
              {
                  $.message.write("[ START event handlers for " + $.name + ".onBeforeInstantiate(" +
                     $.message.args2String(plugin.pluginName) + ") ]", $.message.end());
                  
                  $.ev.callArray(plugin.BIHndlrs);

                  $.message.write("[ END event handlers for " + $.name + ".onBeforeInstantiate(" +
                     $.message.args2String(plugin.pluginName) + ") ]", $.message.end());
              }

BOUNDARY("select.xtra.DOM");

         // insert into <iframe>
         if ((/iframe/i).test(Container.tagName))
         {
             DOM.iframe.addHandler(Container, [DOM.onLoadHdlr, result]);

             result.loaded = 0; // <iframe> not fully loaded yet
             result.spanId = $.name + "Span" + DOM.HTML.length;

             span = "<span id=\"" + result.spanId + "\" style=\"" +
                DOM.getStyle.span(1) + "\">" + tag + "</span>";
            
             $.message.write("[ inserting <span> tag into <iframe>: " + span + " ]", $.message.end());

             // The exact time at which we start to insert the tag into the DOM
             result.time = new Date().getTime();

             // We write the span only to the <iframe> document
             // Return value is the time delay to insert into DOM.
             tmp = DOM.iframe.write(Container, span);

             // Amount of time it takes for a browser to insert a tag into the DOM
             if (tmp>=0) result.insertDomDelay = tmp;

         } // end of insert into <iframe>


         // insert into <div>
         else if ((/div/i).test(Container.tagName))
         {
              span = doc.createElement("span");

              DOM.setStyle(span, DOM.getStyle.span());


              // It appears to be best to insert the <span> and its children into the DOM
              // as late as possible. WE SET ALL THE STYLES / PROPERTIES OF THE <span> AND
              // ITS CHILDREN >>BEFORE<< INSERTING INTO THE DOM. This is very important!
              //
              // Why? Because if you insert into DOM first and then set the properties,
              // then in some rare cases, an older browser may think that accessing any
              // property, including the style object for the <object>/<applet> tag,
              // is intended to access the plugin instead. This can cause browser problems,
              // browser hangs, or other unpredictable behavior. This is a browser bug.
              // To avoid this problem, we set the styles/properties BEFORE inserting into the
              // DOM.
              //
              // After the tag is inserted into the DOM, then the plugin will start.
              //
              // Note: we insert the <span> into the DOM BEFORE we insert the HTML tag
              // into the <span>. (As opposed to inserting the HTML tag into the <span>, and then
              // inserting the <span> into the DOM). I have seen a case where this leads to
              // better reliability when querying a plugin (for outdated Java).
              // I have also seen better reliability for Adobe Reader.
              Container.appendChild(span);

              // Warning: $.message() must always have an EVEN number of quotes,
              // so that it can be easily removed from the script later on.
              // Therefore, we craft the regex here very carefully.
              // Not to worry...if we make a mistake here, the download page (where we remove
              // the $.message()) will give us an error message.
              $.message.write("[ inserting <span> tag into <div>: <span " +

                 ( (/(style\s*=\s*['"][^"']*[^'"]*["'])/i).test(span.outerHTML||"") ? RegExp.$1 : "" ) +

                 ">" + tag + $.openTag + "/span> ]", $.message.end()
              );


              try{
                // The exact time at which we start to insert the tag into the DOM
                result.time = new Date().getTime();

                span.innerHTML = tag; 

                // Amount of time it takes for a browser to insert a tag into the DOM
                result.insertDomDelay = new Date().getTime() - result.time;
              }
              catch(e){ $.message.write(["[ Unable to set span.innerHTML? ] ", e], $.message.end()); }

              result.spanObj = span;

         } // end of insert into <div>
        
       
         $.message.write("[ HTML tag has been inserted in " + $.message.time(DOM.insert) + " ]", $.message.end());


        }


         span = 0;
         Container = 0;

         DOM.HTML.push(result);

         return result;


},   // end of insert()


// Property is automatically removed by Script Generator
lastProperty:"select.xtra.DOM"


},  // end of DOM{} object


// ******************************************************************************************
/*

 *********** Begin file object **********



  This file{} object allows us to save inputFile, and return the
  most recent valid inputFile.
  For example, we can save and retrieve Jarfile and DummyPDF input strings.

  Note: For Java it is possible to repeatedly call PluginDetect
  with different verifyTagsArray values, thereby allowing us to instantiate a different
  HTML tag at different times.
  
  For example, here we call PluginDetect 3 times, and we supply the correct jarfile each time:
  $.isMinVersion("Java", 0, jarfile, [3,0,0]);   // instantiate HTML tag1
  $.isMinVersion("Java", 0, jarfile, [3,3,0]);   // instantiate HTML tag2
  $.isMinVersion("Java", 0, jarfile, [3,3,3]);   // instantiate HTML tag3
  
  However, if we only supplied the correct jarfile the very first time:
  $.isMinVersion("Java", 0, jarfile, [3,0,0]);  // instantiate HTML tag1
  $.isMinVersion("Java", 0, 0, [3,3,0]);        // instantiate HTML tag2
  $.isMinVersion("Java", 0, 0, [3,3,3]);        // instantiate HTML tag3

  then we have to make sure that the most recent valid jarfile is available EACH time
  we instantiate an HTML tag. Hence we created this file {} object to take care of this.

*/

BOUNDARY14:"select.xtra.file",

file:{

// Property is automatically removed by Script Generator
firstProperty:"select.xtra.file",

BOUNDARY0:"0",

// This object assists in creating a custom version of the script for the user.
script:{
  
    select:{xtra:{file:"file"}},

    errCheck:function(code, select){
        if (!select.miscCheckbox.allowactivex &&
             (/\.codebase|\.AXO|\.getAXO|\.ActiveX|ActiveXObject/).test(code.customModuleScript)
           )
              alert("Error: ActiveX code found in " + code.moduleName + " module");
    }

}, // end of script{}

BOUNDARY1:"select.xtra.file",



// [private]
// storage for any file inputs, regardless of whether they are valid or not
// plugin[file.any]
any:"fileStorageAny999",

// [private]
// storage for file input strings that appear to be valid and in the proper format
// plugin[file.valid]
valid: "fileStorageValid999",

// [public]
// Save inputFile to storage.
// extension input should have the format ".ext", ".jar", ".pdf", ""
save: function(plugin, extension, inputFile){

   var file=this, tmp;

   if (plugin && $.isDefined(inputFile))
   {
      // storage for file inputs, regardless of whether they are valid or not
      if (!plugin[file.any]) plugin[file.any]=[];
      
      // storage for file input strings that appear to be valid and in the proper format
      if (!plugin[file.valid]) plugin[file.valid]=[];

      // Save inputFile to fileAny[]
      plugin[file.any].push(inputFile);


      // Note: we do most of the regex checking against the inputFile within
      // plugin.verify{}. Very little regex checking is done here. We do this for a few reasons:
      //  1) We do this to minimize the # of times that Regex are used in this routine,
      //  for speed purposes.
      //  2) There will be less code in this section, making PluginDetect smaller,
      //  since people normally will not have plugin.verify{} in their script.
      //  3) We do this in case our regex checking within plugin.verify{} is too strict.
      //  If this too strict regex check were to be done in THIS routine, it might erroneously
      //  prevent an inputFile from instantiating and detecting the plugin.
      //  4) If someone has already run plugin.verify{} to verify his inputFile [path/]name, then
      //  there should be no need to run it all over again in this section of the script.



      // Split inputFile string into path, name, extension.
      tmp = file.split(extension, inputFile);

      // Save inputFile to fileValid[]
      if (tmp) plugin[file.valid].push(tmp);


      // When inputFile is undefined or in the proper string format, then we do not print
      // out any message. Else print out a message.
      //
      // When !inputFile, then inputFile is ignored.
      // !inputFile occurs when inputFile is undefined, 0, null, ""
      //
      // Note: this code does not catch as many errors with the inputFile input as $.Plugins.java.verify
      // does. For the most comprehensive warning/error messages on inputFile, use $.Plugins.java.verify.
      //
      // Note: we use $.message.args2String([inputFile]) instead of $.message.args2String(inputFile)
      // because inputFile might be an array itself. We do this so that when (or if) inputFile is
      // an array, the routine will return  "[  ]" around the inputFile value itself.
      $.message.write(

        (!$.isDefined(inputFile) || tmp ? null :
          (!inputFile ? "[ Input " + ($.message.args2String([inputFile])) + " ignored. Ok. ]" :
             "[ *** Warning: input " + ($.message.args2String([inputFile])) + " is ignored. ]"
            )
         ), $.message.end()
       );

   }

},  // end of save()

// [public]
getValidLength: function(plugin){
  return plugin && plugin[this.valid] ? plugin[this.valid].length : 0;
},

// [public]
getAnyLength: function(plugin){
  return plugin && plugin[this.any] ? plugin[this.any].length : 0;
},

// [public]
// If x is undefined, then return last item in plugin[file.valid].
// If x is a number, then return plugin[file.valid][x].
getValid: function(plugin, x){
  var file=this;
  return plugin && plugin[file.valid] ?
      file.get(plugin[file.valid], x) : null;
},

// [public]
// If x is undefined, then return last item in plugin[file.any].
// If x is a number, then return plugin[file.any][x].
getAny: function(plugin, x){
  var file=this;
  return plugin && plugin[file.any] ?
      file.get(plugin[file.any], x) : null;
},

// [private]
// Return storage[x]
// where storage[] == fileAny[] or fileValid[]
//
// If x is undefined, then return last item from storage[].
// If x is a number, then return storage[x].
// If x is defined and out of range, or storage[] is empty, then return null.
get: function(storage, x){

  var iLast = storage.length-1, i = $.isNum(x) ? x : iLast;

  // If i is out of range, then return null.
  // Else, return storage[i].
  return (i<0 || i>iLast) ? null : storage[i];

},

// [public]
// Split inputFile string into path, name, extension.
// extension input should have the format ".ext", ".jar", ".pdf", ""
//
// If inputFile can be split, then return
//   object = {name: inputFile name without extension,
//       path: inputFile path, 
//       ext: inputFile extension ".extension",
//       full: entire inputFile}
// If inputFile string cannot be split, then return null.
split: function(extension, inputFile){

     var obj=null, tmp, regex;
     
     extension = extension ? extension.replace(".", "\\.") : "";

     //  Expected format for inputFile
     // ([path/]name)(.extension)
     // Note, we allow for the possibility that the inputFile string begins/ends with whitespace.
     // We try not to be overly strict in our conditions here.
     //
     // RegExp.$1 is path + name
     // RegExp.$2 is ".extension"
     //
     // Name must have one or more characters
     // Last char in name should not be /
     regex = new RegExp("^(.*[^\\/])(" + extension + "\\s*)$");

     if ($.isString(inputFile) && regex.test(inputFile))
     {
        tmp=(RegExp.$1).split("/");  // RegExp.$1 is path + name

        obj={name:tmp[tmp.length-1], ext:RegExp.$2, full:inputFile};

        tmp[tmp.length-1] = "";

        obj.path = tmp.join("/");
     }

     return obj;

}, // end of split()


// Property is automatically removed by Script Generator
lastProperty:"select.xtra.file"


},  // ******* end of file object ********


// *********************************************************************************


BOUNDARY15:"select.xtra.verify",


// This verify object is used by other verify objects located in plugin.verify{}
// The verify objects help to verify file paths and names.
// Example, Dummy pdf (for PDF Reader detection) and jarfile (for Java detection).
verify:{
  
// Property is automatically removed by Script Generator
firstProperty:"select.xtra.verify",

BOUNDARY0:"0",

// This object assists in creating a custom version of the script for the user.
script:{
  
    select:{xtra:{verify:"verify"}},


    errCheck:function(code, select){
        if (!select.miscCheckbox.allowactivex &&
             (/\.codebase|\.AXO|\.getAXO|\.ActiveX|ActiveXObject/).test(code.customModuleScript)
           )
              alert("Error: ActiveX code found in " + code.moduleName + " module");
    },


    // include:function(select){} tells us which other modules to include when using this module.
    // Do not put $.message/BOUNDARY in the array[] here because they are automatically
    // included/removed from the script as needed.
    include:function(){
      return [$.DOM, $.file];
    }

}, // end of script{}

BOUNDARY1:"select.xtra.verify",



// [private]
RegExp:{

// Characters not allowed in file string \ * ? " < > |
//
// Note that / character is not allowed in a file name, but it is allowed in the path,
// hence the / character is allowed in the jarfile string.
//
// Note that : character is not allowed in a file name, but it is allowed in URL
// such as "http://", hence the : character is allowed in the jarfile string.
//
// RegExp.$1 shows the bad character(s) that are found.
// Note: Property name ending with "_" means that a match is a jarfile warning/error.
badChar_: /([\\\*\?"<>\|]+)/,

// Detect the \ character
backslash_: /\\/,


// file string should contain nonspace characters
// If it only contains spaces, then it will be ignored
nonSpace: /[^\s]/,


// file string should not have spaces at beginning/end
// Note: Property name ending with "_" means that a match is a file warning/error.
leadTrailSpace_: /^\s.*|.*\s$/,


// file name should not begin or end with " " or "."
// Note: Property name ending with "_" means that a match is a file warning/error.
name_SpaceDot_: /^([\s\.].*|.*[\s\.])$/,


// Paths do not begin with /
// Note: Property name ending with "_" means that a match is a file warning/error.
pathForwardSlash_: /^\/.*$/,


// Space/dot not allowed at beginning/end of any directory in the path.
//
// " " Space before/after "/" not allowed in path
// "." before/after "/" not allowed in path, except for "../" and "/../"
// Note: Property name ending with "_" means that a match is a file warning/error.
pathDir_SpaceDot_: /\/\s|\s\/|[^\.]\.\/|[^\/]\.\.\/|\/\.[^\.]|\/\.\.[^\/]/


},  // end of RegExp{}



// [public]
// Insert text node into verify.div
//
// text = text content
//
// S = array [style property, style value,...]
//
// or S = string where verify.style[S] is an object{}.
// S = "bold", "verified", "error", "warning"
//
// div is the target element
//
// br = false (boolean) will prevent line feed
addText: function(div, text, S, br){
     var verify=this, span=null,
       topWinDoc = window.top.document;

     if (div)
     {

        if ($.isString(S))
        {
           if (verify.style[S]) S=verify.style[S];
        }

        if ($.isArray(S))
        {
            span = topWinDoc.createElement("span");
            $.DOM.setStyle(span, S);
            div.appendChild(span);
        }

        if ($.isString(text))
        {
           text = text.replace(/&nbsp;/g,"\u00a0");
          (span ? span : div).appendChild(topWinDoc.createTextNode(text));
        }

        if (br!==false && br!==0) div.appendChild(topWinDoc.createElement("br"));

     }
},  // end of addText()


// [private]
style:{
  warning: ["fontWeight", "bold", "color", "#800000"],
  error: ["fontWeight", "bold", "color", "#E00000"],
  verified: ["fontWeight", "bold", "color", "blue"],
  bold: ["fontWeight", "bold"]
},


// [public]
// Initialize the _verify{} object.
// Print out a set of instructions for the plugin.
//
// pluginName = "Java", "PDFReader", etc...
// fileType = "jarfile", "DummyPDF", etc...
// fileName = "getJavaInfo.jar", "empty.pdf", etc...
init: function(_verify, pluginName, fileType, fileName, extension, extraArg){

  var verify=this, indent="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;",

    // We put output messages into <div> in the top most window of the DOM, in case PluginDetect
    // is inside a frame, where the frame is too small to display any messages.
    // If there are multiple frames, then each frame should output to its own unique <div>
    // somehow.
    div = window.top.document.createElement("div");

  $.DOM.setStyle(div,
     [ "color","black", "border","solid blue 2px",
       "padding","5px", "width","98%", "fontSize","18px",
       "margin","5px", "backgroundColor","#B3AAAA"
     ]
  );

  // Insert output <div> into window.top.document.body
  $.DOM.insertDivInBody(div, 1);


  verify.addText(div, $.name + " (v" + $.version + ")", "bold");
  verify.addText(div, "This box is visible when you select the \"Verify " +
     fileType + " [path/]name\" option for " + pluginName + " in the " +
     $.name + " download page.", "bold");
  verify.addText(div, "This box will verify that you correctly specified the " +
     fileType + " \"[path/]name" + extension +"\" string " +
     "in your " + pluginName + " detection code in this web page.", "bold");

  verify.addText(div);
  verify.addText(div, "The " + fileType + " input can be specified in the following commands: ");
  verify.addText(div, indent + $.name + ".onDetectionDone(\"" +
     pluginName + "\", event handler f, " + fileType + 
     ($.isDefined(extraArg) ? ", " + extraArg :"") + ")");
  verify.addText(div, indent + $.name + ".isMinVersion(\"" +
     pluginName + "\", minVersion, " + fileType + 
     ($.isDefined(extraArg) ? ", " + extraArg :"") + ")");
  verify.addText(div, indent + $.name + ".getVersion(\"" +
     pluginName + "\", " + fileType + 
     ($.isDefined(extraArg) ? ", " + extraArg :"") + ")");
  verify.addText(div, indent + $.name + ".getInfo(\"" +
     pluginName + "\", " + fileType + 
     ($.isDefined(extraArg) ? ", " + extraArg :"") + ")");

  verify.addText(div);
  verify.addText(div);
  verify.addText(div, "Please keep in mind the following points:", "bold");
  verify.addText(div, "- Even if " + $.name + " is able to sucessfully detect " + pluginName +
     ", that is NOT a guarantee that your " + fileType + " [path/]name is specified correctly. " +
     "The reason for this is that the " + fileType + " may not always be needed by " + $.name +
     " to detect " + pluginName + ".");
  verify.addText(div, "- On the other hand, an incorrectly specified " + fileType + " may prevent " + pluginName + " detection from working in certain cases.");
  verify.addText(div, "- Your " + fileType + " input string only needs to be specified in the very first " + pluginName + " related " + $.name +
      " command that is executed. " + $.name + " will remember your " + fileType + " input for all subsequent " +
      $.name + " " + pluginName + " commands. Of course, you are free to specify the " + fileType + " more than once if you wish.");
  verify.addText(div, "- PLEASE MAKE SURE THAT THE " + pluginName.toUpperCase() + " PLUGIN IS INSTALLED AND ENABLED IN YOUR BROWSER FOR " +
     "THIS VERIFICATION TEST. IF YOUR BROWSER HAS DEACTIVATED THE " + pluginName.toUpperCase() +
     " PLUGIN DUE TO SECURITY REASONS, THEN YOU WILL HAVE TO ACTIVATE IT FOR THIS TEST.");
  verify.addText(div, "- This " + fileType + " verification test may not work on all browsers. " +
     "If it keeps giving you errors and you believe that your " + fileType + " name/path are correct, " +
     "then try running this test on a different browser.");
  verify.addText(div, "- You do not need to run this verification test on all browsers. " +
     "You only need to pass this test on ONE browser.");
  verify.addText(div, "- This web page should be served by a WEB SERVER during the verification test.");

  verify.addText(div);
  verify.addText(div);
  verify.addText(div, "Your " + fileType + " input arguments should follow these rules: ", "bold");
  verify.addText(div, "- If any particular " + fileType + " input argument is not defined, or is not a string, or is a string that does not end in \"" +
     extension + "\", " + "then " + $.name + " will ignore that " + fileType + " input argument.");
  verify.addText(div, "- If you intentionally want " + $.name + " to ignore a certain " + fileType + " input argument, " +
     "then just leave it undefined, or use null, 0, or empty string \"\".");
  verify.addText(div, "- The " + fileType + " string should not contain the characters \\ * ? \" < > |");
  verify.addText(div, "- The " + fileType + " \"[path/]name" + extension + "\" string should not begin or end with a whitespace \" \".");

  verify.addText(div, "- The " + fileType + " path can be relative or absolute.");
  verify.addText(div, "- If the " + fileType + " path is relative, then it should be relative to the webpage itself, not relative to any Javascript file.");
  verify.addText(div, "- The " + fileType + " path should not contain backslash \"\\\". Use forwardslash \"/\" instead when needed.");
  verify.addText(div, "- The name in \"[path/]name" + extension + "\" should not begin or end with dot \".\" or whitespace \" \".");
  verify.addText(div, "- When the path of the " + fileType + " has one or more directories, " +
     "then each directory name should not begin or end with dot \".\" or whitespace \" \"." +
     " So, \"../directory1/directory2/" + fileName + "\" is ok, whereas \"../directory1./&nbsp;&nbsp;directory2/" + fileName + "\" would not be ok.");

  verify.addText(div, "- The " + fileType + " string can be a URL such as " +
     "\"http://www.mysite.com/files/" + fileName + "\", assuming that " + pluginName + " allows this.");


  verify.addText(div);
  verify.addText(div);
  verify.addText(div, "Starting verification of " + fileType + " [path/]name in your " +
     pluginName + " detection code...", "bold");
  verify.addText(div);


  return div;

},  // end of init()


// [public]
// Return 1/true if input arg (jarfile/DummyPDF'etc...) ok, 0/false if error.
//
// plugin = $.Plugins.java or $.Plugins.pdfreader
// pluginName = "Java" or "PDF Reader"
// fileType = "jarfile" or "DummyPDF"
// extension = ".jar" or ".pdf"
checkfile1: function(div, plugin, pluginName, fileType, extension){

      var verify=this, 
      obj, tmp, x,
      ignoreMsg = "&nbsp;&nbsp;&nbsp;( " + fileType + " is ignored. This is ok. ",
      warningMsg = "&nbsp;&nbsp;&nbsp;( Warning: ",
      errMsg = "&nbsp;&nbsp;&nbsp;( Error: ",
      ignoreCount=0,
      warningCount=0,
      errCount=0;


      // Show all the inputFiles found in the detection code.
      // Also check for any problems with the format of the inputFile string.
      // This checking is a bit extensive and perhaps a bit strict, which is why
      // we do this within plugin.verify only.
      // We use lots of Regular expressions here. This is ok, since speed
      // is not a concern for plugin.verify.
      var numFilesAny = $.file.getAnyLength(plugin), inputFile;
      if (numFilesAny===0){
          verify.addText(div, "Unable to verify " + fileType + " at this time. No " + fileType + " inputs found.", "error");
          return 0;
      }
      verify.addText(div, fileType + " input" + (numFilesAny>1?"s":"") +
           " to " + $.name + " " + (numFilesAny>1?"were":"was") + " found " + numFilesAny + " time" + (numFilesAny>1?"s":"") +
           " in your " + pluginName + " detection code as follows:");

      for (x=0;x<numFilesAny;x++)
      {
         inputFile = $.file.getAny(plugin, x);
         verify.addText(div, "&nbsp;&nbsp;" + fileType + " [path/]name" + ": " +
                ($.isString(inputFile) ? "\"" : "") + inputFile + ($.isString(inputFile) ? "\"" : ""),
               null, 0);
               
         obj = $.file.split(extension, inputFile);  // split into path, name, extension

         // inputFile could not be split into path, name, extension.
         // These items are either IGNORED, or they generate ERROR messages.
         if (!obj){

                  if (!$.isString(inputFile)){
                    ignoreCount++;
                    verify.addText(div, ignoreMsg + fileType + " not a string )", 0, 0);
                  }

                  else if (!verify.RegExp.nonSpace.test(inputFile)){
                    ignoreCount++;
                    verify.addText(div, ignoreMsg + fileType + " string is empty )", 0, 0);
                  }

                  else {
                    errCount++;
                    verify.addText(div, errMsg + fileType + " string must have format ",
                       "error", 0);
                    verify.addText(div, "\"[path/]name" + extension + "\"", "bold", 0);
                    verify.addText(div, " )", "error", 0);
                  }
         }  // end of if (!obj)


         else
         {      // inputFile was successfully split into path, name, extension.
                // These items are not IGNORED and they did not generate any ERROR messages.
                // They can, however, generate WARNING messages.
                //
                // These items will be used by PluginDetect for plugin detection, despite
                // any warnings. Why? Because some platforms are not limited by some
                // of these issues. For example, linux servers allow dot "." at the
                // start/end of directory names. Macintosh supposedly allows " " at start of
                // file names, etc...

             if (verify.RegExp.leadTrailSpace_.test(inputFile)){
                    warningCount++;
                    verify.addText(div, warningMsg + fileType + " string should not begin or end with whitespace ",
                       "warning", 0);
                    verify.addText(div, "\" \"", "bold", 0);
                    verify.addText(div, " )", "warning", 0);
             }

             else if (verify.RegExp.badChar_.test(inputFile)){

                warningCount++;
                tmp = RegExp.$1;
                if (verify.RegExp.backslash_.test(inputFile)){
                  verify.addText(div, warningMsg + fileType + " string should not have backslash ", "warning", 0);
                  verify.addText(div, "\\",
                     "bold", 0);
                  verify.addText(div, " character, but " + fileType + " path can use forward slash ", "warning", 0);
                  verify.addText(div, "/",
                     "bold", 0);
                  verify.addText(div, " )", "warning", 0);
                }

                else {
                  verify.addText(div, warningMsg + fileType + " string should not have ",
                     "warning", 0);
                  verify.addText(div, tmp, "bold", 0);
                  verify.addText(div, " character" + (tmp.length>1?"s":"") + " )", "warning", 0);
                }
            
             }

             else if (verify.RegExp.name_SpaceDot_.test(obj.name))
             {
                  warningCount++;
                  verify.addText(div, warningMsg + fileType + " string must have format ",
                     "warning", 0);
                  verify.addText(div, "\"[path/]name" + extension + "\"", "bold", 0);
                  verify.addText(div, ", and name should not begin or end with dot ", "warning", 0);
                  verify.addText(div, "\".\"", "bold", 0);
                  verify.addText(div, " or whitespace ", "warning", 0);
                  verify.addText(div, "\" \"", "bold", 0);
                  verify.addText(div, " )", "warning", 0);
             }

             else if (verify.RegExp.pathDir_SpaceDot_.test(obj.path))
             {
                   warningCount++;
                   verify.addText(div, warningMsg + "Directory in " + fileType + " path should not begin or end with dot ",
                      "warning", 0);
                   verify.addText(div, "\".\"", "bold", 0);
                   verify.addText(div, " or whitespace ", "warning", 0);
                   verify.addText(div, "\" \"", "bold", 0);
                   verify.addText(div, " )", "warning", 0);
             }

// Update: It turns out that paths that begin with "/" are absolute paths, meaning
// the path is relative to the top folder of the web domain.
// This is acceptable, as long as the web page is being displayed by a web server.
// If the page is being displayed without a web server, then it may not work.
/*
             else if (verify.RegExp.pathForwardSlash_.test(obj.path))
             {
                   warningCount++;
                   verify.addText(div, warningMsg + fileType + " path should not begin with forward slash ",
                      "warning", 0);
                   verify.addText(div, "/", "bold", 0);
                   verify.addText(div, " )", "warning", 0);
             }
*/
         }

         verify.addText(div);

      }   // end of for (x=..) loop
    
      
        verify.addText(div);


        if (ignoreCount>0){
           verify.addText(div, ignoreCount + " out of " + numFilesAny + " " + fileType + " inputs were ignored. ");
        }
        if (warningCount>0){
           verify.addText(div, "Warning: " + warningCount + " out of " + numFilesAny + " " + fileType + " inputs generated a warning. ",
              "warning");
        }
        if (errCount>0){
           verify.addText(div, "Error: " + errCount + " out of " + numFilesAny + " " + fileType + " inputs generated an error. " +
             "Unable to verify " + fileType + " at this time.", "error");
           return 0;
        }

        verify.addText(div);

        // Show all the valid inputFiles found in the detection code
        var numFilesValid = $.file.getValidLength(plugin);
        if (numFilesValid>0 && numFilesValid == numFilesAny){
           verify.addText(div, "All of your " + fileType + " inputs appear to have the proper \"[path/]name" + extension + "\" format.");
           verify.addText(div);
        }
        else if(numFilesValid>0 && numFilesValid != numFilesAny){
           verify.addText(div, numFilesValid + " out of " + numFilesAny + " " + fileType + " inputs " +
              " appear" + (numFilesValid==1?"s":"") + " to have the proper \"[path/]name" + extension + "\" format:");
           for (x=0;x<numFilesValid;x++){
               verify.addText(div, "&nbsp;&nbsp;" + fileType + " [path/]name" + ": " +
                 ( "\"" ) + $.file.getValid(plugin, x).full + ( "\"" ));
           }
           verify.addText(div);
        }
        else if (numFilesValid===0){
           verify.addText(div, "No valid " + fileType + " inputs found. Unable to verify " + fileType + " at this time.", 
              "error");
           return 0;
        }

        
        // If more than one valid inputFile string, then make sure that they are all the same
        if (numFilesValid>1)
        {
           tmp = $.file.getValid(plugin, 0).full;

           for (x=0;x<numFilesValid;x++)
           {
               if (tmp!==$.file.getValid(plugin, x).full)
               {  // Error, not all inputFile names are the same
                  verify.addText(div, "Error: all properly formatted " + fileType + " strings " +
                    "should be the SAME. Unable to verify " + fileType + " at this time.", "error");
                  return 0;
               }
           }
        }

        return 1; // everything is ok, no errors found


},  // end of checkfile1()


// Property is automatically removed by Script Generator
lastProperty:"select.xtra.verify"


},  // ************ end of verify object ************


BOUNDARY16:"1",


// The $.Plugins{} object contains one or more plugin objects. Each plugin object
// is responsible for the detection of a specific browser plugin.
//
// NOTE: All plugin objects within $.Plugins{} must be named using only lower case letters.
// Correct ->    Plugins:{quicktime:{...}, java:{...}, flash:{...}}
// Incorrect ->  Plugins:{QuickTime:{...}, Java:{...}, Flash:{...}}
Plugins:{},


// Property is automatically removed by Script Generator
lastProperty:"select.always.librarybase"


};  // End of Library Base



$.init.library(); // Initialize the Library Base



// *********************************************************************************
// QuickTime plugin detection
// Feel free to delete this section if you don't need QuickTime detection
//
// When using isMinVersion("QuickTime", num)
//  you should only have num = 3 digit number like "7.4.5.0"
// Specifying a 4th digit would only affect detection for IE, not for other browsers.
// Hence you should limit to 3 digits only so that you are consistent for all browsers.


BOUNDARY("select.pluginCheckbox.quicktime");


var QUICKTIME = {

  // Property is automatically removed by Script Generator
  firstProperty:"select.pluginCheckbox.quicktime",


  BOUNDARY0:"0",

  // This object assists in creating a custom version of the script for the user.
  script:{

    select:{pluginCheckbox:{quicktime:"QuickTime"}},

    fileNameSuffix:"QuickTime",

    checkboxLabel:"QuickTime",

    errCheck:function(code, select){
        if (!select.miscCheckbox.allowactivex &&
             (/\.axo|\.codebase|\.AXO|\.getAXO|\.ActiveX|ActiveXObject/).test(code.customModuleScript)
           )
              alert("Error: ActiveX code found in " + code.moduleName + " module");
    },


    // include:function(select){} tells us which other modules to include when using this module.
    //
    // Do not put $.message/BOUNDARY in the array[] here because they are automatically
    // included/removed from the script as needed.
    //
    // Any items in the outermost array must ALL be included (AND).
    // At least one item in an inner array must be included (OR).
    //
    // For this particular plugin, plugin.getVersion() must be called by either
    // $.isMinVersion or $.getVersion. Hence we use the inner array
    // [$.isMinVersion, $.getVersion] here.
    include:function(select){
         return [$.pd, 
         
         // When select.miscCheckbox.allowactivex == true, we include $.codebase{} since 
         // it is used for ActiveX plugin detection.
         // Otherwise, we do not include it to make the script smaller.
         (select.miscCheckbox.allowactivex ? $.codebase : 0),

         $.hasMimeType, [$.isMinVersion, $.getVersion]];
    }


  }, // end of script{}

  BOUNDARY1:"select.pluginCheckbox.quicktime",



// Set the value of the output variables for QuickTime detection.
// The output variables are QuickTime.version, QuickTime.installed, QuickTime.getVersionDone.
// This routine should always be run after completing a detection attempt.
//
// We input EITHER obj,version OR isMin.
// obj tells us whether the plugin is present or not.
// version tells us the plugin version.
// isMin tells us if plugin >= some minimum version.
setPluginStatus: function(obj, version, isMin){

  var QuickTime=this;


  $.message.write("[ ]", $.message.end());
  $.message.write("[ START Setting plugin status for QuickTime ]", $.message.end());


  // We set precision to 3 digits, by setting 4th digit to 0.
  QuickTime.version = version ? $.formatNum(version, 3) : null;


  QuickTime.installed =

       QuickTime.version ? 1 :

         (  // isMin is undefined, null, 0, > 0, < 0
            // 0.7 means plugin version >= minversion, plugin installed/enabled
            // -0.1 means plugin version < minversion, plugin installed/enabled
            isMin ? (isMin>0 ? 0.7 : -0.1) : (obj  ? 0 : -1)

         );

       
   // == 1 means QuickTime.getVersion() does not need to be called again
   // == 0 means Quicktime.getVersion() is allowed to be called again.
   //
   // QuickTime.installed==0.7 means that only an approximate version was detected. We can
   //   run getVersion() again later to get exact version.
   // QuickTime.installed==-0.1 means that only an approximate version was detected. We can
   //   run getVersion() again later to get exact version.
   // if QuickTime.nav.done===0, then detection result from QuickTime.nav{} will differ,
   //   depending on the value of @thirdParty input arg to PluginDetect.
   QuickTime.getVersionDone = QuickTime.installed==0.7 ||
      QuickTime.installed==-0.1 || QuickTime.nav.done===0 ? 0 : 1;


   $.message.write("[ QuickTime.getVersionDone: " + QuickTime.getVersionDone + " ]", $.message.end());
   $.message.write("[ QuickTime.installed: " + QuickTime.installed + " ]", $.message.end());
   $.message.write("[ QuickTime.version: " + QuickTime.version + " ]", $.message.end());


   $.message.write("[ END Setting plugin status for QuickTime ]", $.message.end());

   $.message.write("[ ]", $.message.end());


},  // end of setPluginStatus()


// [public]
// Get QuickTime version
//
// If @thirdParty == 1/true, then just look for a generic QuickTime media player,
// regardless of whether it is the genuine QuickTime Player or not.
// @thirdParty only applies to non-IE browsers.
getVersion: function(minVersion, thirdParty){

   var QuickTime=this, version=null, installed=0, tmp;


   thirdParty = $.browser.isIE ? 0 : thirdParty;


   // *** Detection Attempt # 0
   //
   // This is the fastest of all detection methods.
   // For non-IE browsers, and IE 11+ (which have a navigator.plugins[] array).
   if ((!installed || $.dbug) && QuickTime.nav.query(thirdParty).installed) installed = 1;
   if ((!version || $.dbug) && QuickTime.nav.query(thirdParty).version) version = QuickTime.nav.version;


   // The next several detection methods only use ActiveX.
   // So select.miscCheckbox.allowactivex can filter all of them out.
   BOUNDARY("select.pluginCheckbox.quicktime && select.miscCheckbox.allowactivex");


   // *** Detection Attempt # 1
   // For ActiveX based browsers only
   //
   // codebase.isMin() should not cause any browser security popups, and is reasonable fast
   // compared to codebase.search(). So we try this detection method BEFORE codebase.search().
   //
   // This detection attempt does NOT try to find out the exact QuickTime version.
   // It only attempts to determine if QuickTime version >= minversion. This is
   // done for speed reasons.
   //
   // QuickTime.codebase.isMin(minversion) detects if version >= minversion.
   // QuickTime.codebase.search() detects exact version.
   // QuickTime.codebase.isMin() is MUCH faster than QuickTime.codebase.search().
   //
   // For IE, we recommend using $.isMinVersion("QuickTime") instead of
   // $.getVersion("QuickTime") for speed reasons.
   //
   //
   // if tmp is 0, then we were not able to use codebase detection, or plugin
   //    not installed/enabled.
   // if tmp is 1, then we used codebase detection, and version >= minversion, plugin installed.
   // if tmp is -1, then we used codebase detection, and version < minversion, plugin installed.
   //
   tmp = !version ? QuickTime.codebase.isMin(minVersion) : 0;
   if (tmp)
   {
       QuickTime.setPluginStatus(0, 0, tmp);
       return;
   }


   // *** Detection Attempt # 2
   // For ActiveX based browsers only
   //
   // codebase.search() does not cause any security popups, but is slow, so we
   // try this method second.
   // Works for QuickTime 5+.
   if (!version || $.dbug)
   {
      tmp = QuickTime.codebase.search();
      if (tmp){
         installed = 1;
         version = tmp;
      }
   }


   // *** Attempt # 3
   // For ActiveX based browsers only
   //
   // This method can cause security popups in IE, so we try this LAST.
   // It also appears to be the slowest of all detection methods.
   // Works for QuickTime 4+.
   if ((!installed || $.dbug) && QuickTime.axo.query().installed) installed = 1;
   if ((!version || $.dbug) && QuickTime.axo.query().version) version = QuickTime.axo.version;



   BOUNDARY("select.pluginCheckbox.quicktime");


   QuickTime.setPluginStatus(installed, version);


},   // end of function getVersion()



// Get the QuickTime version from navigator arrays
nav:{

  // [public]
  // null = detection not performed yet.
  // 0 == Detection completed. Results may differ, depending on the value of @thirdParty input arg.
  // 1 == Detection completed. Results will be the same, regardless of the value for @thirdParty.
  done:null,

  // [public]
  // 1, 0
  installed:0,

  // [public]
  // Detected plugin version
  // [string/null]
  version:null,

  // [public]
  // result[0] stores the detection results for this.query(0)  - genuine QuickTime Player
  // result[1] stores the detection results for this.query(1)  - genuine/3rd party player
  // result[i] == {installed:{0 or 1}, version:{null or string}, plugin:{}}
  result:[0,0],

  // [private]
  // To ensure that we can detect QuickTime, we list a number of different
  // mimetypes that are associated with QuickTime.
  // We do this in case there is any mimetype hijacking by other plugins,
  // and in case the browser does not allow enumeration of the
  // navigator.plugins[] array.
  // We use these mimetypes along with navigator.mimeTypes[...].enabledPlugin
  // to find the plugin.
  mimeType: [
        "video/quicktime", "application/x-quicktimeplayer",
        "image/x-macpaint", "image/x-quicktime",
        "application/x-rtsp", "application/x-sdp", "application/sdp",
        "audio/vnd.qcelp", "video/sd-video", "audio/mpeg", "video/mp4",
        "video/3gpp2", "application/x-mpeg", "audio/x-m4b", "audio/x-aac", 
        "video/flc"
      ],


  // The genuine QuickTime plugin has the following results.
  //
  // ---------------------------------------------
  // For Windows & Mac...
  // name: QuickTime Plug-in 7.7.4
  // description: The QuickTime Plugin allows you to view a wide variety of multimedia content in Web pages. For more information, visit the QuickTime Web site.
  //
  // name: QuickTime Plug-in 7.2
  // description: The QuickTime Plugin allows you to view a wide variety of multimedia content in Web pages. For more information, visit the QuickTime Web site.
  //
  // name: QuickTime Plug-in 6.4
  // description: The QuickTime Plugin allows you to view a wide variety of multimedia content in Web pages. For more information, visit the QuickTime Web site.
  //
  // name: QuickTime Plug-in 5.0.2
  // description: The QuickTime Plugin allows you to view a wide variety of multimedia content in Web pages. For more information, visit the QuickTime Web site.
  //
  // name: QuickTime Plug-in 4.1.2
  // description: The QuickTime Plugin allows you to view a wide variety of multimedia content in Web pages. For more information, visit the QuickTime Web site.
  //
  // ------------------------------------------------
  // On the iPad, we get...
  // name: QuickTime Plug-in
  // description: The QuickTime Plug-in allows you to view a wide variety of multimedia content in Web pages. For more information, visit the QuickTime Web site.
  // filename: QuickTime Plugin.webplugin
  //
  // Notice that there is no version # here.
  //
  // ------------------------------------------------
  //
  //
  // In order to distinguish between Flip4Mac plugin and QuickTime plugin,
  // we should check for both "QuickTime" and "Plug-in".
  // I wanted to be more generic so that both "Plug-in" and "Plugin" are covered,
  // so we check for "Plug-?in"
  //
  // BTW, the Flip4Mac plugin has...
  // name: Flip4Mac Windows Media Plugin 2.2.3
  // description: The Flip4Mac WMV Plugin allows you to view Windows Media content using QuickTime.
  // filename: Flip4Mac WMV Plugin.plugin
  // version: 2.2.3.7
  //
  find: "QuickTime.*Plug-?in",


/*
     We want to be able to filter out 3rd party media players.

     For example, on Linux the Totem Player gives us...
     name: QuickTime Plug-in 7.6.6
     description: The Totem 3.0.1 plugin handles video and audio streams.

     Also, on Linux...
     name: QuickTime Plug-in 7.6.4
     description: Gecko Media Player 0.9.9.2 Video Player Plug-in for QuickTime, RealPlayer and Windows Media Player streams using MPlayer

     Ubuntu 10.04
     navigator.userAgent: Mozilla/5.0 (X11; Linux i686; rv:24.0) Gecko/20100101 Firefox/24.0
     plugin.name: QuickTime Plug-in 7.6.6
     plugin.description: The <a href="http://www.gnome.org/projects/totem/">Totem</a> 2.30.2 plugin handles video and audio streams.
     plugin.filename: libtotem-narrowspace-plugin.so

     Ubuntu 10.04
     navigator.userAgent: Mozilla/5.0 (X11; Linux i686; rv:24.0) Gecko/20100101 Firefox/24.0
     plugin.name: QuickTime Plug-in 7.6.4
     plugin.description: <a href="http://kdekorte.googlepages.com/gecko-mediaplayer">Gecko Media Player</a> 0.9.9.2<br><br>Video Player Plug-in for QuickTime, RealPlayer and Windows Media Player streams using <a href="http://mplayerhq.hu">MPlayer</a>
     plugin.filename: gecko-mediaplayer-qt.so

     Ubuntu 10.04
     navigator.userAgent: Mozilla/5.0 (X11; U; Linux i686; en-US) AppleWebKit/534.16 (KHTML, like Gecko) Chrome/10.0.648.133 Safari/534.16
     plugin.name: QuickTime Plug-in 7.6.6
     plugin.description: The <a href="http://www.gnome.org/projects/totem/">Totem</a> 2.30.2 plugin handles video and audio streams.
     plugin.filename: libtotem-narrowspace-plugin.so

     Ubuntu 14.10
     navigator.userAgent: Mozilla/5.0 (X11; Ubuntu; Linux i686; rv:33.0) Gecko/20100101 Firefox/33.0
     plugin.name: QuickTime Plug-in 7.6.6
     plugin.description: The <a href="http://www.gnome.org/">Videos</a> 3.10.1 plugin handles video and audio streams.
     plugin.filename: libtotem-narrowspace-plugin.so


     We thus filter out some of the 3rd party player imitators by looking
     at BOTH plugin.name && plugin.description.
     We accomplish this by specifying both "find" and "find2" input arguments.

     Question: should we only use "QuickTime" here, or "QuickTime.*Plug-?in"?
*/
  find2: "QuickTime.*Plug-?in",


  // For Genuine Apple QuickTime Player
  // If plugin.description is blank (which can sometimes happen), then we look at plugin.filename 
  // as a backup. The plugin.filename should have "QT"  on Windows, and "QuickTime" on Macintosh/iPad.
  //
  // iPad...
  // name: QuickTime Plug-in
  // description: The QuickTime Plug-in allows you to view a wide variety of multimedia content in Web pages. For more information, visit the QuickTime Web site.
  // filename: QuickTime Plugin.webplugin
  //
  // For a very old QuickTime on Macintosh PPC, I found in the navigator arrays...
  // name: QuickTime Plug-In 7.0
  // description:
  // filename: QuickTime Plugin.plugin
  //
  // Opera 10, MacIntel...
  // name: QuickTime-Plug-In 7.6.3
  // description:
  // filename: QuickTime Plugin.plugin
  //
  // Firefox 2, PPC Mac OS X
  // name: QuickTime Plug-In 7.0
  // description:
  // filename: QuickTime Plugin.plugin
  //
  // Chrome 28, Windows 7
  // name: QuickTime Plug-in 7.7.1
  // description: The QuickTime Plugin allows you to view a wide variety of multimedia content in Web pages. For more information, visit the QuickTime Web site.
  // filename: npqtplugin.dll
  //
  // Opera 8, WinXP
  // name: QuickTime Plug-in 7.7.5
  // description: The QuickTime Plugin allows you to view a wide variety of multimedia content in Web pages. For more information, visit the QuickTime Web site.
  // filename: C:\Program Files\Mozilla Firefox\Plugins\npqtplugin.dll
  find3filename: "QuickTime|QT",


  // These players we specifically try to filter out
  // to avoid being confused with the genuine QuickTime plugin.
  //
  // For QuickTime detection, there are some plugins (like VLC, Totem, etc...) that try to mimic
  // QuickTime in the navigator.plugins array.
  //
  // The Totem media player in Linux imitates QuickTime in navigator.plugins[].name
  // and navigator.mimeTypes to fool many plugin detectors. Since the genuine QuickTime player
  // does not play in Linux (except under Wine), we filter out these 3rd party players if possible.
  // The reason for filtering out 3rd party plugins is that we only want to detect
  // if the GENUINE QuickTime plugin is present, and not some pretender.
  // Why? Because Totem cannot play QuickTime VR.
  // We need to have a way to distinguish between some pretender and the real thing.
  //
  avoid: "Totem|VLC|RealPlayer|Helix|MPlayer|Windows\\s*Media\\s*Player",


  // This can be used to find the plugin via
  //    navigator.plugins[nav.plugins].name == nav.plugins
  // Note that this is only useful when navigator.plugins["..."].name has no number in it,
  // such as for the iPad. This works on the iPad, btw.
  // 
  // We obviously cannot use navigator.plugins[nav.plugins].name when .name has a version
  // number in it, because we do not know the version number beforehand.
  plugins: "QuickTime Plug-in",



  // Detect QuickTime Player, return object{installed:{0,1}, version:{null,"..."}, plugin:{}}
  //
  // @thirdParty == 0,1
  // if 0, then detect genuine QuickTime player
  // if 1, then detect genuine or 3rd party QuickTime player
  detect: function(thirdParty){
     
     var nav=this, plugin, reg,
         result={installed: 0, version: null, plugin:null};


     // Search navigator.plugins[] for the QuickTime plugin.
     //
     // We do NOT look for a version number yet. For Windows/Mac, there is a version
     // number available. For iPad, the version number is not available.
     // Querying a QuickTime movie to get the version does not work for the iPad.
     //
     plugin = $.pd.findNavPlugin({find:nav.find, 
        find2:thirdParty ? 0 : nav.find2, avoid: thirdParty ? 0 : nav.avoid,
        mimes:nav.mimeType, plugins:nav.plugins});


     // Debug stuff
     // Uncomment if we want to test the case where genuine plugin was not detected,
     // but third party plugin was detected, where plugin.description is empty.
     //
       // if (thirdParty){plugin = {name:"QuickTime Plugin 7.9", description:"",
         // filename:"C:\\Program Files\\Mozilla Firefox\\MPlayer\\thirdparty npqtplugin.dll"
         // filename:"C:/Program Files/Mozilla Firefox/MPlayer/thirdparty npqtplugin.dll"
         // filename:"thirdparty QuickTime.plugin"
       // }}else{plugin=null}


     if (plugin)
     {
        result.plugin = plugin;
        result.installed = 1;
        
        reg = new RegExp(nav.find, "i");
        
        // We look at plugin.name, because the version is given there
        // for the genuine QuickTime Player.
        // Also, 3rd party QuickTime Players will usually put "QuickTime Plug-in 7.x.x" in
        // plugin.name to try to mimic the genuine player.
        if (plugin.name && reg.test(plugin.name + "")) 
              result.version = $.getNum(plugin.name + "");
              
        // We do NOT look for plugin version in description.
        // It is not there for the genuine QuickTime player.
        // And for 3rd party players, we see the following...
        //    description: The Totem 3.0.1 plugin handles video and audio streams.
        //    description: Gecko Media Player 0.9.9.2 Video Player Plug-in for QuickTime, RealPlayer and Windows Media Player streams using MPlayer
        // 3rd party players tend to put their own plugin version there, instead of the 
        // QuickTime version.
     }
     
     return result;

  }, // end of detect()


  // [public]
  // if @thirdParty == true/1, then allow 3rd party QuickTime media players to be detected.
  // Otherwise, detect only the genuine Apple QuickTime player.
  // If both the genuine and 3rd party paler is present, then detect only the genuine.
  query: function(thirdParty){

     var nav=this, tmp0, tmp1;
     
     // nav.result[thirdParty] array only has 2 entries
     thirdParty = thirdParty ? 1 : 0;


     $.message.write($.message.time(nav.query,1), $.message.end());   // Start measuring time delay
     $.message.write("[ ]", $.message.end());
     $.message.write("[ START search navigator.plugins[ ] for QuickTime ]", $.message.end());
     $.message.write("[ @thirdParty == " + thirdParty + " ]", $.message.end());

     if (nav.done===null) // only run this the very first time
     {
        if ($.hasMimeType(nav.mimeType)) // mimetype found
        {
           tmp1 = nav.detect(1); // try to detect genuine or 3rd party QT plugin

           if (tmp1.installed) // genuine or 3rd party plugin found
           {
              tmp0 = nav.detect(0);  // try to detect genuine QT plugin only

              // For nav.result[1], we show genuine QT player result if available.
              // Otherwise use genuine/3rd party player detection result.
              // The reason for this is if both the genuine QT player AND a 3rd party QT player
              // are present, then we only want to display the result for the genuine QT player.
              nav.result=[tmp0, tmp0.installed ? tmp0 : tmp1];
           }


           // *** As a general rule, the plugin.name and plugin.description
           // should BOTH exist in the navigator arrays so that we can detect/verify the
           // genuine Apple QuickTime Player plugin.
           //   However, it appears that in some rare cases, the plugin.description may be empty.
           // Hence we would not be able to detect the genuine QuickTime plugin
           // by just looking at plugin.name and plugin.description.
           //   So, we also check plugin.filename to see if the genuine plugin is present.
           var pluginGen = nav.result[0], plugin3rd = nav.result[1],
            regAvoid=new RegExp(nav.avoid, "i"), regFileName=new RegExp(nav.find3filename, "i"),
            filename;

           pluginGen = pluginGen ? pluginGen.plugin : 0;
           plugin3rd = plugin3rd ? plugin3rd.plugin : 0;

           // if genuine QuickTime plugin not found and 3rd party QuickTime plugin found
           if (!pluginGen && plugin3rd &&

             // and plugin.name found but plugin.description NOT found
             plugin3rd.name && (!plugin3rd.description || (/^[\s]*$/).test(plugin3rd.description + "")) &&

             !regAvoid.test(plugin3rd.name + ""))
             {
                // Note: in some rare cases, the filename may include the full path name as well.
                // We are not interested in the path, however.
                //  C:\Program Files\Mozilla Firefox\Plugins\npqtplugin.dll
                filename = (plugin3rd.filename || "") + "";

                // Remove path from filename
                if ((/^.*[\\\/]([^\\\/]*)$/).test(filename))
                {
                  filename = RegExp.$1;
                  $.message.write("[ ]", $.message.end());
                  $.message.write("[ *** NOTE: plugin.filename includes a path, which is unusual. ]", $.message.end());
                  $.message.write("[ filename (without path): " + filename + " ]", $.message.end());
                }


                // and if plugin.filename corresponds to genuine QuickTime plugin filename
                if (filename && regFileName.test(filename) && !regAvoid.test(filename))
                
                  // then we say that genuine QuickTime has been found afterall.
                  nav.result[0] = nav.result[1];

             }

        }

        // If nav.result[0] and nav.result[0] are different, then
        // then nav.done=0. This means that nav.query(thirdParty) returns
        // a different result depending on the value of @thirdParty.
        // If nav.done=1, then nav.query(thirdParty) always returns the same detection result,
        // no matter what value @thirdParty has.
        nav.done = nav.result[0]===nav.result[1] ? 1 : 0;
        
        $.message.write("[ ]", $.message.end());
        $.message.write(nav.result[0] && nav.result[0].plugin ?
          "[ Genuine QuickTime plugin.name: " + nav.result[0].plugin.name + " ]" : 0, $.message.end());
        $.message.write(nav.result[0] && nav.result[0].plugin ?
          "[ Genuine QuickTime plugin.description: " + nav.result[0].plugin.description + " ]" : 0, $.message.end());
        $.message.write(nav.result[0] && nav.result[0].plugin ?
          "[ Genuine QuickTime plugin.filename: " + nav.result[0].plugin.filename + " ]" : 0, $.message.end());

        $.message.write("[ ]", $.message.end());
        $.message.write(nav.result[1] && nav.result[1].plugin ?
          "[ Genuine/3rd party QuickTime plugin.name: " + nav.result[1].plugin.name + " ]" : 0, $.message.end());
        $.message.write(nav.result[1] && nav.result[1].plugin ?
          "[ Genuine/3rd party QuickTime plugin.description: " + nav.result[1].plugin.description + " ]" : 0, $.message.end());
        $.message.write(nav.result[1] && nav.result[1].plugin ?
          "[ Genuine/3rd party QuickTime plugin.filename: " + nav.result[1].plugin.filename + " ]" : 0, $.message.end());

     }


     // If previously detected results are available, then use that.
     if (nav.result[thirdParty])
     {
         nav.installed = nav.result[thirdParty].installed;
         nav.version = nav.result[thirdParty].version;
     }
     
     
     $.message.write("[ ]", $.message.end());
     $.message.write("[ nav.installed: " + (nav.installed ? "true" : "false")  + " ]", $.message.end());
     $.message.write("[ nav.version: " + nav.version + " ]", $.message.end());
     $.message.write("[ nav.done: " + nav.done + " ]", $.message.end());
     $.message.write("[ END search navigator.plugins[ ] for QuickTime in " +
          $.message.time(nav.query) + "]", $.message.end());


     return nav;

  } // end of query()


}, // end of nav{}


// We filter out codebase{}, axo{} because they use ActiveX
BOUNDARY2: "select.pluginCheckbox.quicktime && select.miscCheckbox.allowactivex",


// Search the IE codebase to get the plugin version
codebase: {

    // [public]
    // The codebase{} requires classID.
    //
    // Security pre-approved control for IE 7+.
    // Microsoft has preApproved, and QuickTime installer has preApproved.
    // So no popup, so user does not have to approve to run this control.
    // Should not cause any security popup, as far as I can tell.
    classID: "clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B",


    // [public]
    // Returns 1, -1, or 0.
    isMin:function(minVersion){ 

       var codebase=this, tmp, result=0;
       
       codebase.$$ = QUICKTIME;

       if ($.isStrNum(minVersion))
       {
          // Note that detection of plugin version is limited to 3 digits for 
          // $.getVersion("QuickTime") for all browsers.
          //
          // However, using the codebase method, detection for plugin version >= minversion
          // has 4 digits of precision. This is potentially confusing.
          //
          // We force precision of detection for plugin version >= minversion to 3 digits
          // by altering _minVersion variable.
          //
          // If 4th digit of _minVersion is 0, then we leave it alone.
          // If 4th digit of _minVersion > 0, then set to 9999.
          //
          // Ex) If QuickTime version = 7,2,0,240
          //  then $.getVersion("QuickTime") = "7,2,0,0"
          //  then $.isMinVersion("QuickTime", "7,2,0,0") == 1
          //  then $.isMinVersion("QuickTime", "7,2,0,1") == -1
          //      (this result occurs because we altered minversion to "7,2,0,9999")
          tmp=minVersion.split($.splitNumRegx);
          if (tmp.length > 3 && parseInt(tmp[3], 10) > 0) tmp[3] = "9999";
          minVersion = tmp.join(",");
       
          // Returns 1, -1, or 0.
          result = $.codebase.isMin(codebase, minVersion);
       
       }
       
       return result;

    }, // end of isMin()
    
    // [public]
    search:function(){
       this.$$ = QUICKTIME;
       return $.codebase.search(this);
    },
    
/*
    // split up < from HTML tags to help the PluginDetect download page to validate
    // We can put () around "<" so that Javascript minifier does not combine the strings
    ParamTags:  "<param name=\"src\" value=\"\" />" +
                "<param name=\"controller\" value=\"false\" />",    // optional <param> elements
*/


    // [public]
    // DIGITMAX[x] specifies the max value that each digit of codebase version can have.
    // Given DIGITMAX[x] == [A,B,C,D] the maximum allowed codebase is A,B,C,D.
    //
    // The length of DIGITMAX[] is the same as length of Lower[].
    //
    // The 4th digit for QuickTime plugin version can be a very high number, like 200.
    // Thus, searching for the 4th digit slows down detection.
    // Since Firefox only reveals the first 3 digits for plugin version, there is no point
    // to searching for the 4th digit for IE.
    // Hence we leave the 4th entry in DIGITMAX[x] at 0.
    // This limits plugin version detection for IE to 3 digits.
    //
    // if DIGITMAX[x] == 0, then it corresponds to a non-existent codebase
    // between Lower[x] and Upper[x].
    //
    // if DIGITMAX[][x] does not exist, then it is assumed to be 0 by the codebase
    // detection routines.
    DIGITMAX:[ 
    
       // Codebase Range: 7,60,0,0+
       // QT Range:       8,0,0,0+
       [12,11,11],
       
       // Codebase Range: 7,50,0,0 - 7,60,0,0
       // QT Range:       7,5,0,0  - 7,6,0,0
       [7,60],
       
       // Codebase Range: 7,6,0,0 - 7,50,0,0
       // QT Range:       7,6,0,0 - 8,0,0,0
       [7,11,11],
       
       // Codebase Range: 7,5,0,0 - 7,6,0,0
       0,
       
       // Codebase Range: 0,0,0,0 - 7,5,0,0
       // QT Range:       0,0,0,0 - 7,5,0,0
       [7,11,11]

    ],

    // [public]
    // Min value for each digit of the codebase version
    //
    // Since QuickTime 4 and lower does not work with the codebase detection technique,
    // but QuickTime 5+ does, we use 5,0,0,0
    // This could speed up results slightly when QuickTime is not installed.
    DIGITMIN: [5,0,0,0],


   // [public]
   // These 2 arrays contain codebase version numbers.
   // They help to convert codebase version numbers to their
   // corresponding plugin version numbers.
   //
   // The rules for these 2 arrays are:
   //  1) Upper[0] is the highest codebase number you ever expect to encounter
   //  2) The last item in Lower[] is always "0"
   //  3) Upper[] is arranged in descending order
   //  4) Lower[] is arranged in descending order
   //  5) Lower[x] == Upper[x+1]
   //  6) The strings in Upper[x],Lower[x] do not have to be formatted.
   //     They are automatically formatted when they are used.
   //  7) Lower[x]<= codebase[x] < Upper[x] corresponds to convert[x]
   //  8) One and only one codebase number is allowed to map to
   //      any given plugin version number. This is IMPORTANT.
   //      When needed, set convert[x]==0 to accomplish this.
   //
   //
   // QuickTime 7.6.0 has codebase 7,6,0,92     *** codebase versioning has returned to normal again
   // QuickTime 7.5.5 has codebase 7,55,90,0    *** BUG in codebase versioning
   // QuickTime 7.5.0 has codebase 7,50,61,0    *** BUG in codebase versioning
   // QuickTime 7.4.5.67 has codebase 7,4,5,67
   // QuickTime 7.4.1.14 has codebase 7,4,1,14
   // QuickTime 7.4.0.91 has codebase 7,4,0,91
   // QuickTime 7.3.0.70 has codebase 7,3,0,70 etc...
   // QuickTime 7.2.0.240
   // QuickTime 7.1.6.200
   // QuickTime 7.1.5.120
   // QuickTime 7.1.3.100
   //
   // Note: from the arrays shown below, we see that 
   // codebase 7,55 maps to plugin version 7.5.5.
   // Also, we see that codebase 7.5.5 does NOT map to anything, because
   // convert[x] == 0. Thus rule #8 is not broken.
   //
   //
   Upper: ["999",  "7,60", "7,50", "7,6", "7,5"],
   Lower: ["7,60", "7,50", "7,6",  "7,5", "0"],
   

   // [public]
   // Convert plugin version to/from codebase number.
   // convert[x] is used to convert plugin version to/from codebase number, where
   //   Lower[x] <= codebase[x] number <= Upper[x]
   // This array has the same length as Upper[], Lower[].
   //
   // convert[x] == 1 means that codebase[x] ( == A.B.C.D) == plugin version A.B.C.D.
   // convert[x] == 0 means that codebase[x] does not have a corresponding plugin version,
   //     where  Lower[x]<= codebase[x] < Upper[x].
   //
   // if toCodebase, then convert to codebase number.
   // if !toCodebase, then convert to plugin version number.
   convert: [
     
     // Codebase Range: 7,60,0,0+
     // QT Range:       8,0,0,0+
     1,

     // Codebase Range: 7,50,0,0 - 7,60,0,0
     // QT Range:       7,5,0,0  - 7,6,0,0
     function(p, toCodebase)
     {   return toCodebase ?

         [p[0], p[1] + p[2], p[3], "0"] :
         
         // p[1] has exactly 2 digits
         [p[0], p[1].charAt(0), p[1].charAt(1), p[2]];
     },
     
     // Codebase Range: 7,6,0,0 - 7,50,0,0
     // QT Range:       7,6,0,0 - 8,0,0,0
     1,

     // Codebase Range: 7,5,0,0 - 7,6,0,0
     0,

     // Codebase Range: 0,0,0,0 - 7,5,0,0
     // QT Range:       0,0,0,0 - 7,5,0,0
     1

   ] // end of convert[]


},  // end of codebase{}



// Get the QuickTime version using ActiveX
axo:{

  // == 0 if not called
  // == 1 if called
  hasRun:0,

  // [public]
  // 1, 0
  installed:0,

  // [public]
  // Detected plugin version
  // [string/null]
  version:null,


  // This ActiveX control works for QuickTime 4+.
  // ActiveX control, not security pre-approved by Microsoft for IE 7+.
  // Also not pre-approved by Apple for IE 7+. User needs to give security approval.
  //
  // Note: The most recent test I did, the security popup still occurs in IE 8/QuickTime 7.7.2
  // QuickTime installers do not appear to make this control to be security pre-approved,
  // so when there is a security popup, the user will have to explicitly give permission to run.
  // Causes security popup in IE 7+ when instantiated.
  //
  // "QuickTimeCheckObject.QuickTimeCheck.1" tells us if QuickTime is
  // installed AND the precise QuickTime version.
  progID: ["QuickTimeCheckObject.QuickTimeCheck", "QuickTimeCheckObject.QuickTimeCheck.1"],


  // This ActiveX control works for QuickTime 5+.
  // Security pre-approved ActiveX control for IE 7+ (pre-Approved by Microsoft).
  // Also, Apple Corp. makes this control to be security pre-approved when QuickTime
  // is installed.
  // So, usually this control should not cause security popups in IE.
  //
  // Note: in one case that I tested, for IE 7 when QuickTime was never installed, 
  // it appears that even "QuickTime.QuickTime" object instantiated as new ActiveXObject()
  // can possibly cause a security popup in the browser.
  // (Or maybe it was some leftover from a previous QT install?)
  //
  progID0: "QuickTime.QuickTime",


  // [public]
  query: function(){

     var axo=this,
       obj, x, tmp,

       // $.getAXO(axo.progID) will cause a security popup, since it does not have
       // security pre-approval from Microsoft or Apple. The user would have to give it 
       // security approval.
       //
       // When ActiveX is disabled in the browser, all other QuickTime detection
       // methods will fail, which means that this routine will run.
       // Even though $.getAXO(axo.progID) will not instantiate an ActiveX object
       // when ActiveX is disabled, it will STILL give us a security popup
       // (At least on IE 8 when I tested this).
       //
       // So, the question is, how do we prevent this security popup from occuring
       // when ActiveX is disabled? A few options...
       //   1) disabled = axo.hasRun || !$.browser.ActiveXEnabled
       //   2) disabled = axo.hasRun || !$.getAXO(axo.progID0)
       disabled = axo.hasRun || !$.browser.ActiveXEnabled;

     axo.hasRun = 1;
     if (disabled) return axo;

     $.message.write($.message.time(axo.query,1), $.message.end());   // Start measuring time delay
     $.message.write("[ ]", $.message.end());
     $.message.write("[ START quicktime.axo.query( ) for ActiveX based browsers ]", $.message.end());

     
     for (x=0;x<axo.progID.length;x++)
     {

        // This is the old, traditional way of getting the QuickTime version
        // for ActiveX browsers.
        $.message.write("[ ]", $.message.end());
        obj = $.getAXO(axo.progID[x]);

        if (obj)
        {  axo.installed=1;

           tmp = $.pd.getPROP(obj, "QuickTimeVersion");
           if (tmp && tmp.toString)
           {  tmp = tmp.toString(16);                        //  convert hex number to hex string

              $.message.write("[ version (hex): " + tmp + "  ]", $.message.end());

              axo.version = parseInt(tmp.charAt(0)||"0", 16) +   // convert each hex digit to decimal
                 "." + parseInt(tmp.charAt(1)||"0", 16) +
                 "." + parseInt(tmp.charAt(2)||"0", 16);

              if (!$.dbug) break;
           }

        }

     }  // end of x loop


     // Alternate method...
     //
     // We can insert an <object> tag with quicktime.classID.
     // Since this classid is security preApproved for QuickTime, we can query
     // the <object> tag using DOMobj.GetQuickTimeVersion()
     // This method does not work reliably in older QuickTime, but it does in the
     // newer QuickTime players.
     //
     // Note:
     //  a) uses a preApproved classid, so will not cause a security popup.
     //  b) can cause a popup message saying "Some mimeTypes are no longer associated
     //     with QuickTime, etc...".
     //     However, this message is prevented if we use style="display:none;"
     //     or style="visibility:hidden;"
     //  g) does not work on older QuickTime players.
     //  h) causes IE to crash for QuickTime 7.5.5
     //
     // Update: it turns out that we can use $.getAXO(axo.progID0).GetQuickTimeVersion().
     // However, it is very slow.
     // So for now, we do not bother using it.
     //
/*
     $.message.write("[ quicktime.axo.query( ) at " + $.message.time(axo.query) + " ]", $.message.end());
     $.message.write("[ ]", $.message.end());

     obj = $.getAXO(axo.progID0);
     if (obj)
     {  axo.installed = 1;
        try{

          // In QT 5, this result gives a hex # version
          // In QT 7, this result gives a decimal # version
          tmp = $.getNum(obj.GetQuickTimeVersion() + "");
          if (tmp) axo.version = tmp;
        }
        catch(e){}
        $.message.write("[ $.getAXO(axo.progID0).GetQuickTimeVersion( ): " + tmp + " ]", $.message.end());
     }
*/


     $.message.write("[ ]", $.message.end());
     $.message.write("[ QuickTime plugin: " +
         (axo.installed ? "installed & enabled" : "not detected") + " ]", $.message.end());
     $.message.write("[ QuickTime version: " + axo.version + " ]", $.message.end());
     $.message.write("[ END quicktime.axo.query( ) for ActiveX based browsers in " +
          $.message.time(axo.query) + " ]", $.message.end());

     return axo;

  }  // end of query()

},   // end of axo{}


BOUNDARY3: "select.pluginCheckbox.quicktime",


// Property is automatically removed by Script Generator
lastProperty:"select.pluginCheckbox.quicktime"


}; // end of QUICKTIME{}


$.addPlugin("quicktime", QUICKTIME);



// ************************ End of QuickTime detection ***************************************





// ********************************************************************************************
/*   Java plugin detection



The overall methodology here is to not rely on any single method of Java plugin detection,
because different browsers on different platforms need different ways of detecting Java.
We try to use the fastest detection methods first, and if they fail, we attempt to use
progressively slower methods.



*/


BOUNDARY("select.pluginCheckbox.java");


var JAVA = {
  

// Property is automatically removed by Script Generator
firstProperty:"select.pluginCheckbox.java",


BOUNDARY0:"0",

// This object assists in creating a custom version of the script for the user.
script:{

  select:{pluginCheckbox:{java:"Java", verifyjava:"VerifyJava"}},

  fileNameSuffix:{pluginCheckbox:{java:"Java", verifyjava:""}},

  // Text shown in menu
  checkboxLabel:{pluginCheckbox:{
    java:{
       text:"Java&nbsp;&nbsp;&nbsp;" +
            "(<a href='../files/Java_Apps.zip'>Download the getJavaInfo.jar applet " +
            "along with a few Java examples</a>. Just right click and Save As)",
    verifyjava:{
       text:"Verify jarfile [path/]name.<br>" +
            "This will verify that you are specifying the correct [path/]name for " +
            "getJavaInfo.jar in your Java detection code.<br>" +
            "The results of this jarfile verification will be shown at the top of " + 
            "your web page when Java detection is performed. " +
            "This feature is for testing/debugging purposes only.<br>"
    }
  }}},

  errCheck:{pluginCheckbox:{
    java:function(code, select){
        if (!select.miscCheckbox.allowactivex &&
             (/\.axo|\.codebase|\.AXO|\.getAXO|\.ActiveX|ActiveXObject/).test(code.customModuleScript)
           )
              alert("Error: ActiveX code found in " + code.moduleName + " module");
    },
    verifyjava:0
  }},


  // include:function(select){} tells us which other modules to include when using this module.
  //
  // Do not put $.message/BOUNDARY in the array[] here because they are automatically
  // included/removed from the script as needed.
  //
  // Any items in the outermost array must ALL be included (AND).
  // At least one item in an inner array must be included (OR).
  //
  // For this particular plugin, plugin.getVersion() must be called by either
  // $.isMinVersion or $.getVersion. Hence we use the inner array
  // [$.isMinVersion, $.getVersion] here.
  include:{pluginCheckbox:{
             java:function(select){
                  return [$.pd, $.win, $.DOM, $.file,

                  // When select.miscCheckbox.allowactivex == true, we include $.codebase{} since
                  // it is used for ActiveX plugin detection.
                  // Otherwise, we do not include it to make the script smaller.
                  (select.miscCheckbox.allowactivex ? $.codebase : 0),
                  
                  $.hasMimeType, [$.isMinVersion, $.getVersion],

                  // We can perform NOTF detection using $.onDetectionDone().
                  $.ev, $.onDetectionDone];
             },

             verifyjava:function(){return [$.verify];}

  }}
}, // end of script{}


BOUNDARY1:"select.pluginCheckbox.java",




// Array of Java System Property names.
// ex. ["java.version", "java.vendor", ...]
// The Java applet reads data from this array using JSObject getMember(), getSlot().
// 
// This array can be empty, or it can contain strings.
Property_names: [],

// The Java applet will automatically fill this array with the values.
// Property_values[i] = System.getProperty(Property_names[i]).
// The Java applet writes data to this array using JSObject setSlot().
//
// We initialize the first item to null, because the Java applet expects this.
// When the array is filled, it will contain strings.
Property_values: [],

// The first applet that manages to put it's own unique id into this array will
// have write permission to the Property_values[] array.
Property_values_lock: [],


/*

The JavaToJSBridge{} object allows us to enable/disable the Java applet to browser Javascript
communication. This means we can enable/disable the sending of data from Java applets to
Javascript.

The JStoJavaBridge{} object allows us to enable/disable the browser Javascript to Java applet
communication. This means we can enable/disable the sending of data from Javascript to
Java applets.

We only use the JavaToJSBridge{} and JStoJavaBridge{} objects when output messages are shown.
If the message{} object is running, then these bridge objects will be useful.
The bridge objects are only intended to be used by developers for testing/debugging purposes.

*/


// *** Note: for the time being, we assume that our Java applet is not capable of
// Java to JS communication. We therefore hardcode disable this bridge.
// This way, as soon as the applets have fully loaded, they will then immediately be queried
// via JS to JAVA communication.
//
// When our Java applet becomes capable of JAVA to JS communication, then we
// set == 1.
JAVATOJSBRIDGE: 0,  // ==1 for enabled, ==0 for disabled.
                    // When ==1, then JS to JAVA applet query is delayed, because
                    // we want the JAVA to JS communication to occur before any
                    // possible JS to JAVA communication occurs.
                    // JAVA to JS is preferable because it should generate fewer
                    // security popup messages by the Java runtime.

JSTOJAVABRIDGE: 1,  // ==1 for enabled, ==0 for disabled.


BOUNDARY2:"select.pluginCheckbox.java && select.miscCheckbox.showmessage",

JavaToJsBridge:{
  // [** PUBLIC **]   $.Plugins.java.JavaToJsBridge.enable()
  enable: function(){
     JAVA.JAVATOJSBRIDGE = 1;

     $.message.write("[ ]", $.message.end());
     $.message.write("[ *** WARNING: JAVA to JAVASCRIPT bridge has been enabled. ]", $.message.end());
     $.message.write("[ Java applets are allowed to access browser Javascript. ]", $.message.end());
     $.message.write("[ ]", $.message.end());
  },
  // [** PUBLIC **]   $.Plugins.java.JavaToJsBridge.disable()
  disable: function(){
     JAVA.JAVATOJSBRIDGE = 0;
     
     $.message.write("[ ]", $.message.end());
     $.message.write("[ *** WARNING: JAVA to JAVASCRIPT bridge has been disabled. ]", $.message.end());
     $.message.write("[ Java applets are NOT allowed to access browser Javascript. ]", $.message.end());
     $.message.write("[ ]", $.message.end());
  }

}, // end of JavaToJsBridge{}

JsToJavaBridge:{
  // [** PUBLIC **]   $.Plugins.java.JsToJavaBridge.enable()
  enable: function(){
     JAVA.JSTOJAVABRIDGE = 1;
     
     $.message.write("[ ]", $.message.end());
     $.message.write("[ *** WARNING: JAVASCRIPT to JAVA bridge has been enabled. ]", $.message.end());
     $.message.write("[ Browser Javascript is allowed to access Java applets. ]", $.message.end());
     $.message.write("[ ]", $.message.end());
  },
  // [** PUBLIC **]   $.Plugins.java.JsToJavaBridge.disable()
  disable: function(){
     JAVA.JSTOJAVABRIDGE = 0;
     
     $.message.write("[ ]", $.message.end());
     $.message.write("[ *** WARNING: JAVASCRIPT to JAVA bridge has been disabled. ]", $.message.end());
     $.message.write("[ Browser Javascript is NOT allowed to access Java applets. ]", $.message.end());
     $.message.write("[ ]", $.message.end());
  }
}, // end of JsToJavaBridge{}

BOUNDARY3:"select.pluginCheckbox.java",


// Mimetypes associated with Java.
mimeType: [

       // mimeType[0] is the default mimetype that is most typically used to
       // instantiate a Java applet. This mimetype should always be the FIRST mimetype
       // in this array.
       "application/x-java-applet",

       // mimeType[1] is present in Gecko/Chrome browsers, but is absent in many
       // other browsers.
       // When mimeType[1] is present, it can also be used to instantiate a Java applet.
       // Testing confirms that :
       //     mimeObj("application/x-java-applet").enabledPlugin.description ==
       //         mimeObj("application/x-java-vm").enabledPlugin.description
       "application/x-java-vm",

       // mimeType[2] is typically present when mimeType[0] is present.
       // It also can be used to instantiate a Java applet.
       // Testing confirms that :
       //     mimeObj("application/x-java-applet").enabledPlugin.description ==
       //         mimeObj("application/x-java-bean").enabledPlugin.description
       // This has even been confirmed for outdated Java 1,3,0,10.
       "application/x-java-bean"
],

// Dummy mimetype that does not exist.
// To be as reliable and simple as possible, the mimetype has no capital letters
// and no numbers, just like "application/pdf".
mimeType_dummy: "application/dummymimejavaapplet",



// This classid is a pre-approved ActiveX control in IE 7+
// If there is more than one version of Java installed, then it will
// implement the highest installed Java version.
// This is referred to as DYNAMIC versioning.
//
// However, if you install JRE 1,6,0,2 or higher, then uninstall
// this will delete the approved registry key for this classid.
// HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Ext\PreApproved
//
// If a security popup occurs for this classid, and the user clicks on the bar
// to approve the control, then the registry key affected is
// HKEY_CURRENT_USER\SOFTWARE\Microsoft\Windows\CurrentVersion\Ext\Stats\8AD9C840...
// This key also allows the ActiveX control to run without any further
// security popups.
//
classID: "clsid:8AD9C840-044E-11D1-B3E9-00805F499D93",
//  CAFEEFAC-FFFF-FFFF-FFFF-ABCDEFFEDCBA

// Classid for a non-existent ActiveX control
// We make it similar to classID, except for the last group of digits.
classID_dummy: "clsid:8AD9C840-044E-11D1-B3E9-BA9876543210",



navigator:{

  // [public]
  init: function(){

     var nav=this, java=JAVA;

     $.message.write("[ window.navigator.javaEnabled( ): " + nav.a + " ]", $.message.end());

     // mimetype & plugin objects
     nav.mimeObj = $.hasMimeType(java.mimeType);

     if (nav.mimeObj) nav.pluginObj = nav.mimeObj.enabledPlugin;

  },  // end of init()


  // Value of navigator.javaEnabled().
  // Note: we make this routine get a value as the script is being loaded/parsed,
  // so that its value is ready to read even before Java detection occurs.
  // This way, a user can determine the value of java.navigator.javaEnabled() and
  // java.applet.isDisabled.appletTag() at any time, without having to do Java detection
  // first.
  //
  // It seems to me that navigator.javaEnabled() is a method that is common to most
  // browsers. But this method refers to a mere single plugin, which may not even necessarily run
  // on all browsers. Could it not be possible that one day this method becomes deprecated,
  // just like the <applet> tag? This is why we use a try{}catch(){} here.
  //
  // Note: IE 6 & 7 have a bug. And that is that
  //   typeof window.navigator.javaEnabled == "unknown"
  // So, I cannot easily test for the existence of window.navigator.javaEnabled.
  // Hence I just use a try-catch.
  //
  // Note: window.navigator.javaEnabled() is only called ONCE in this script.
  // Why?
  //  For FireFox (old version)/Iced Tea Java 1,7,0,0/Ubuntu, when we try to
  //  use insert_Query_Any() the value of navigator.javaEnabled() will incorrectly switch
  //  from true to false. This is obviously a bug in the browser and JRE.
  //  So, we get the value of navigator.javaEnabled() FIRST, and store it before we even try
  //  to do any Java detection.
  a:(function(){
       try{return window.navigator.javaEnabled();}
       catch(e){}
       return 1; // default if method does not run.
    })(),


  // [public]
  // javaEnabled() == window.navigator.javaEnabled()
  javaEnabled: function(){
     return !!this.a;
  },

  // [public]
  // mimeObj == $.hasMimeType(java.mimeType)
  mimeObj:0,

  // [public]
  // pluginObj == mimeObj.enabledPlugin
  pluginObj:0

},  // end of navigator{}



OTF: null,     // if 0,1,2 then detection was performed OTF
               // if 3 then detection is being performed NOTF but is not yet completed
               //   this means that java.installed==-0.5 or +0.5
               // if 4 then NOTF detection has been completed.



BOUNDARY19:"select.pluginCheckbox.java && select.methodCheckbox.getinfo",


// Beginning of java.info{} object. This object is used by java.getInfo()
info:{

// [private]
// navigator.plugins[i], derived from various routines
pluginObj:null,

// [private]
// Note, this routine does not call any detection routines.
// Hence we avoid any infinite feedback loops.
getPluginObj:function(){

   var info=this;

   if (info.pluginObj===null)
   {
      // java.navMime is more likely to get the highest installed Java version than
      // java.navigator.pluginObj, assuming that more than one Java is installed.
      // Why? Because navMime only returns the highest found value.
      //
      // ** We could also add in Java.navPlugin.pluginObj here, but we do not bother for now.
      // We can add this in later.
      info.pluginObj = JAVA.navMime.pluginObj || JAVA.navigator.pluginObj || 0;
   }
   
   return info.pluginObj;

},

// [private]
getNavPluginName:function(){
    var pluginObj = this.getPluginObj();
    return pluginObj ? pluginObj.name || "" : "";
},

// [private]
getNavPluginDescription:function(){
     var pluginObj = this.getPluginObj();
     return pluginObj ? pluginObj.description || "" : "";
},


// [private]
Plugin2Status: 0,  // == 0  unsure
                   // == 1  Java Plugin2 available, found via navigator array or by deduction
                   // == 2  Java Plugin2 available, found via DeployToolkit
                   // == 3  Java Plugin2 available, found via Java applet
                   // == -1 Java Plugin2 not available, found via navigator array or by deduction
                   // == -2 Java Plugin2 not available, found via DeployToolkit
                   // == -3 Java Plugin2 not available, found via Java applet
                   //
                   // Note: this property does NOT tell us whether the Java Plugin2 is
                   // enabled or not. It only tells us if the Plugin2 is present
                   // or not.

                   // Java applet should be more reliable in detecting Plugin2
                   // availability than the Deployment Toolkit.
                   // DeployToolkit is more reliable in detecting
                   // Plugin2 availablity than the navigator array.
                   // Hence we have the values -3, -2, -1, 0, +1, +2, +3
                   //
                   // +-3 overrides +-2 which overrides +-1 which overrides 0.
                   // The DTK plugin2 status overrides the navigator array plugin2 status.
                   // The applet plugin2 status overrides the DTK plugin2 status.

// [public]
setPlugin2Status: function(status)
{
  if ($.isNum(status)) this.Plugin2Status = status;
  $.message.write("[ Setting java.info.Plugin2Status to " + status + " ]", $.message.end());
},

/*
  [public]
  Return the value of java.info.Plugin2Status as it currently stands.
  java.info.Plugin2Status can be set by this routine, depending on the navigator.plugins[] array.
  It can also be set by the Deployment Toolkit detection code
  It can also be set by the query applet code.

*/
getPlugin2Status: function(){

  var info=this,
    
    tmp, NGJregex, CJregex, description, name;

  // Detect Plugin2 using navigator arrays.
  // Plugin2 can be +1, 0, -1 based on info from the navigator arrays.
  //
  if (info.Plugin2Status===0)
  {
     // Java Plugin 2 is present if we find:
     //  "Next Generation Java Plugin" (Windows/Linux)
     //  "Java Plugin 2 "              (Macintosh)
     NGJregex = /Next.*Generation.*Java.*Plug-?in|Java.*Plug-?in\s*2\s/i;

     CJregex = /Classic.*Java.*Plug-?in/i;

     description = info.getNavPluginDescription();
     name = info.getNavPluginName();

     // As of JRE 1,6,0,14+ / Windows (and I believe Linux also),
     // the navigator.plugins array will show:
     //   "Next Generation Java Plugin"  when Plugin2 is enabled
     //   "Classic Java Plug-in" when Plugin2 is not enabled
     //
     // Lower versions of Java will simply show:
     //   "Java Plug-in"
     //
     // Apparently Java 1,6,0,14+ contains both the Classic and the Next Generation
     // Java plugins. For the older browsers not capable of Plugin2, they
     // will simply use the Classic plugin. For the newer browsers, they will
     // simply use the Next Gen.
     //
     // However, looking at the navigator array to determine Plugin2 presence
     // is not very reliable. java.info.Plugin2Status values given here can be overridden
     // by the Deployment Toolkit, and also by the Java applets themselves.
     //
     //
     if (NGJregex.test(description) || NGJregex.test(name))
     {
         info.setPlugin2Status(1);
         $.message.write("[ Java Plugin2 present according to navigator.plugins[ ] array ]", $.message.end());
     }

     else if (CJregex.test(description) || CJregex.test(name))
     {
         info.setPlugin2Status(-1);
         $.message.write("[ Java Plugin2 not present according to navigator.plugins[ ] array ]", $.message.end());
     }


     // If the vendor is Sun/Oracle for IE on Windows,
     // and version is high enough, then we have Plugin2 by default.
     //
     // Note: we do not look at whether Java is enabled or not here.
     // We use info.getVendor() here instead of java.vendor to make sure that we
     // have the most up to date value for the vendor.
     //
     // Note: I originally used "$.browser.isIE && $.OS==1",
     // but "$.browser.isIE" should be sufficient.
     else if ($.browser.isIE && (/Sun|Oracle/i).test(info.getVendor()))
     {
          tmp = info.isMinJre4Plugin2();
          if (tmp > 0)
          {
             info.setPlugin2Status(1);
             $.message.write("[ Java Plugin2 appears to be present ]", $.message.end());
          }
          else if (tmp < 0)
          {
             info.setPlugin2Status(-1);
             $.message.write("[ Java Plugin2 appears to not be present ]", $.message.end());
          }

     }

  }

  return info.Plugin2Status;

},   // end of getPlugin2Status()


// [public]
// We check if the JRE version is the minimum needed for Plugin2 to be present.
// Return 1 if version >= minVersion
// Return -1 if version < minVersion.
// Return 0 if no java version is available.
//
// Input version is optional.
//
// According to https://jdk6.dev.java.net/plugin2/
//     For Windows, we need JRE 1,6,0,10+ for Plugin2 to be present.
//     For Linux/Unix also 1,6,0,10+
isMinJre4Plugin2: function(version){

  var java=JAVA,
    minVersion="",
    appletCodebase, webstartCodebase,
    appletResult0=java.applet.getResult()[0];


  // Windows
  //
  // Plugin2 is JRE 1,6,0,10+, but 1,6,0,10 and 1,6,0,11 do not work with
  // Firefox 3.6+ / Chrome 4+ due to a bug.
  //
  // Gecko rv:1.9.2+ (Firefox 3.6+) and Chrome were designed to work ONLY
  // with Java Plugin2.
  //
  // For 1,6,0,10 & 1,6,0,11 the <applet> tag will not show alternate
  // content, which could make PluginDetect think the plugin is instantiated.
  // Also navigator.javaEnabled() is true and java mimetype exists in these 2 cases.
  //
  // However, Firefox 3.0 - 3.5.8 can handle JRE 1,6,0,10 and 1,6,0,11
  //
  if ($.OS==1) minVersion = "1,6,0,10";

  // Macintosh
  // According to http://bugs.sun.com/bugdatabase/view_bug.do?bug_id=6761033
  //    For Mac OS X, we need JRE 1,6,0,12+ for Plugin2 to possibly be present.
  else if ($.OS==2) minVersion = "1,6,0,12";

  // Linux
  else if ($.OS==3) minVersion = "1,6,0,10";

  else minVersion = "1,6,0,10";


  // If no input version, then we try to find the Java version.
  // *** Note: we may be trying to get the version here BEFORE java.setPluginStatus() had
  // a chance to set the version. Hence we may look at one or more individual Java detection
  // modules. We do not run any modules if possible. As for appletCodebase.isMin(), we only run
  // if it has previously run so we do not start up Java.
  if (!version)
  {

    version =

       // If one or more applets gave a specific version result, then use that.
       // Info from a Java applet is the most reliable info we can get, so we check this first.
       // Note, we make sure it is not a range, but a specific version.
       // This version result can also come from appletCodebase.version.
       (appletResult0 && !java.applet.isRange(appletResult0) ? appletResult0 : 0) ||
       
           java.DTK.version ||

           java.version;


       // This BOUNDARY filters out codebase{} related code, which depends on ActiveX
       BOUNDARY("select.pluginCheckbox.java && select.methodCheckbox.getinfo && select.miscCheckbox.allowactivex");

       appletCodebase=java.applet.codebase;
       webstartCodebase=java.WebStart.codebase;

       version = version || webstartCodebase.version || appletCodebase.version ||

         // If no specific Java version found, then we look at appletCodebase.isMin().
         // This comes in handy in case $.getVersion() was not selected in the Script Library
         // download page, meaning that a specific Java version may not be detected.
         //
         // We only run appletCodebase.isMin() if it has already been PREVIOUSLY run, because we
         // do not want to cause Java to start up here...we do not know here what the verifyTags array
         // says about allowing codebase detection. We could check, but there is no need.
         // The simplest approach here is to check for the presence of appletCodebase.min first.
         //
         // If appletCodebase indicates JRE is minVersion or higher for IE, then we set version to minVersion.
         //
         // if appletCodebase.min exists, then appletCodebase.isMin(minVersion) is >0 or < 0. It is !== 0.
         //
         (appletCodebase.min && minVersion ? (appletCodebase.isMin(minVersion, true)>0 ? minVersion : "0,0,0,0") : 0);

       BOUNDARY("select.pluginCheckbox.java && select.methodCheckbox.getinfo");

  }

  version = $.formatNum($.getNum(version));


  return version ? ($.compareNums(version, minVersion)>=0 ? 1 : -1) : 0;

},  // end of isMinJre4Plugin2()



// Check if browser is incompatible with Java Plugin2.
// Return 1 if browser not compatible with Java Plugin2.
// Return 0 if unknown or unsure.
//
// https://jdk6.dev.java.net/plugin2/#SUPPORTED_PLATFORMS
BrowserForbidsPlugin2: function(){

  var browser=$.browser;
  
  // For unknown or mobile platforms, we cannot say anything about Plugin2.
  if ($.OS>=20) return 0;


  if ( 
     // Plugin2 does not run on Internet Explorer < 6.
     // However, this Library does not support IE < 6, and
     // no one uses IE < 6 any more.
     // Thus we do not have to check for IE < 6 here.
     // (browser.isIE && browser.verIE < 6) ||

     // If browser is Firefox version < 3.0 (rv <1.9) then Plugin2 is false.
     (browser.isGecko && $.compareNums(browser.verGecko, "1,9,0,0") < 0) ||

     // Opera 10.50 introduced support for Java Plugin2
     // http://my.opera.com/sitepatching/blog/2010/02/25/new-java-support-and-object-parsing
     // If Opera < 10.50 then Plugin2 is false.
     //
     // Note:
     // browser.verOpera "10,50,0,0" corresponds to Opera 10.50
     // browser.verOpera "10,5,0,0" would correspond to Opera 10.05
     (browser.isOpera && $.compareNums(browser.verOpera, "10,50,0,0") < 0)
     
  ) return 1;   // Browser forbids Plugin2


  return 0;

},  // end of BrowserForbidsPlugin2()


// Check if browser only runs with Java Plugin2
// Return 1 if it does
// Return 0 if unknown or unsure
BrowserRequiresPlugin2: function(){

  var browser=$.browser;

  // For unknown or mobile platforms, we do not know what the requirements are.
  if ($.OS>=20) return 0;


  if (
    // Gecko rv:1.9.2+ (Firefox 3.6+) was designed to work ONLY with Java Plugin2.
    (browser.isGecko && $.compareNums(browser.verGecko, "1,9,2,0")>=0) ||

    // Chrome will only work with Java Plugin2.
    browser.isChrome ||
  
    // It seems as though Opera 10.60+ only works with Plugin2 on Windows.
    // But I cannot find any documentation to say that this is Opera's official
    // policy. Anyway, Opera has navigator.javaEnabled() == false for Opera 10.60+
    // for the Classic java Plugin, so we do not really even need to test
    // for Opera here.
    //
    // Since I can only extensively test Java for Opera / Windows, we only test for that.
    ($.OS==1 && browser.isOpera && $.compareNums(browser.verOpera, "10,60,0,0") >= 0)
    
  ) return 1;  // Browser requires Plugin2


  return 0;

},


// [private]
// List of Java vendors
// Oracle, Sun, Apple, Microsoft
//
// What about OpenJDK, IBM Java?
//
VENDORS: ["Sun Microsystems Inc.", "Apple Computer, Inc.", "Oracle Corporation", "IBM Corporation"],
VENDORS_reg: [/Sun/i,              /Apple/i,               /Oracle/i,            /IBM/i],


// [private]
// Try to get specific vendor name from navigator.plugins[i] .name & .description
getNavVendor:function(){

  var info=this, x,
    name=info.getNavPluginName(), description=info.getNavPluginDescription(),
    result="";

  if (name || description)
  {
    for (x=0;x<info.VENDORS.length;x++)
    {
      if (info.VENDORS_reg[x].test(name) || info.VENDORS_reg[x].test(description)){
         result=info.VENDORS[x]; break;
      }
    }
  }
  return result;

},


// vendor for JRE 1,7,0,0+ is "Oracle"
// vendor for JRE < 1,7,0,0 is "Sun" for Windows/Linux, and "Apple" for Mac
//
// Oracle Corp bought Sun Corp, and hence the vendor name for Java 1,7,0,0+ has changed
// from Sun to Oracle.
//
// Apple stopped supporting/writing Java JRE's for Macintosh, so Oracle took over 
// that responsibility for JRE 1,7,0,0+. Hence the vendor name for Java 1,7,0,0+
// has changed from Apple to Oracle.
OracleMin: "1,7,0,0",

// [private]
// When the possible Java vendor is Oracle or Sun, we decide based on the JRE version.
OracleOrSun: function(v){
   var info=this;
   
   $.message.write(v ? "[ Java " + v + " detected as coming from vendor \"" +
          info.VENDORS[$.compareNums($.formatNum(v), info.OracleMin)<0 ? 0 : 2] + "\" ]" : 0, $.message.end());

   return info.VENDORS[$.compareNums($.formatNum(v), info.OracleMin)<0 ? 0 : 2];
},

// [private]
// When the possible Java vendor is Oracle or Apple, we decide based on the JRE version.
OracleOrApple: function(v){
   var info=this;

   return info.VENDORS[$.compareNums($.formatNum(v), info.OracleMin)<0 ? 1 : 2];
},


// [private]
// Get the Java vendor, but WITHOUT starting up/running Java.
// Make sure this routine does not cause any infinite feedback loops.
// If no vendor found, then return "".
getVendor: function(){

  var info=this, java=JAVA,

      // ** Detection attempt # 1
      //
      // vendor is empty string or filled string.
      // Note: in case that setPluginStatus() has not run yet or had a chance
      // to place java.applet.getResult() into java.vendor, we look at
      // java.applet.getResult()[1] also.
      vendor = java.vendor || java.applet.getResult()[1] || "",

      appletCodebase, webstartCodebase, version;


  if (!vendor)
  {
      // ** Detection attempt # 2

      // Version of installed JRE that can ONLY be from Oracle/Sun,
      // since it uses Oracle/Sun ActiveX classid.
      version = java.DTK.version;

      // This BOUNDARY filters out codebase{} related code, which depends on ActiveX
      BOUNDARY("select.pluginCheckbox.java && select.methodCheckbox.getinfo && select.miscCheckbox.allowactivex");

      appletCodebase = java.applet.codebase;
      webstartCodebase = java.WebStart.codebase;


      // Version of installed JRE that can ONLY be from Oracle/Sun,
      // since it uses Oracle/Sun ActiveX classid.
      version = version || webstartCodebase.version || appletCodebase.version ||


          // We only run appletCodebase.isMin() if it already was run previously, meaning
          // appletCodebase.min must already have a value. We do this because Java can be very slow
          // to start up.
          //
          // Note: appletCodebase.isMin() must not cause info.getVendor() to run, otherwise
          // we get an infinite feedback loop.
          //
          // appletCodebase.isMin() can be 0, -1, 1.
          // But if appletCodebase.min exists, then appletCodebase.isMin() is >0 or < 0, it is !==0.
         (appletCodebase.min ? (appletCodebase.isMin(info.OracleMin, true)>0 ? info.OracleMin : "0,0,0,0") : 0);

     BOUNDARY("select.pluginCheckbox.java && select.methodCheckbox.getinfo");


     // DTK or codebase detection (both are only for IE)
     if (version) vendor=info.OracleOrSun(version);
     
     else
     {
        // ** Detection attempt # 3
        //
        // try to find specific vendor name from navigator.plugins[i]
        vendor = info.getNavVendor() || "";
        if (vendor){}

        // ** Detection attempt # 4
        //
        else if (java.version)  // detect vendor based on our best guess
        {                       // This is last, because it is the least reliable

           // Can we search navigator.plugins[] here, and if we find "Java(TM)" then we
           // can say Oracle/Sun?  Are non-Oracle Java allowed to say "Java(TM)"
           // in their name/description?

           // Macintosh is usually Oracle or Apple
           if ($.OS==2) vendor=info.OracleOrApple(java.version);

           // Windows is usually only Sun/Oracle
           // Linux JAVA is usually Sun/Oracle.
           else if ($.OS==1 || $.OS==3) vendor=info.OracleOrSun(java.version);

        }

     }


  }

  // If vendor was found, then set java.vendor
  // Update: We should only set java.vendor from within setPluginStatus().
  // if (vendor) java.vendor = vendor;

  return vendor;

},   // end of getVendor()


// [private]
// Tells whether Java Plugin2 is installed and enabled or not.
// Return +1, 0, -1
//
// This routine translates the value of java.info.getPlugin2Status() into
// whether Java Plugin2 is installed and enabled or not.
isPlugin2InstalledEnabled: function(){

  var info=this, java=JAVA,

    result = -1,  // -1: Plugin2 not installed/not enabled
                  // 0: unknown
                  // 1: Plugin2 installed & enabled

    javaInstalled=java.installed,

    Plugin2Status = info.getPlugin2Status(),

    BrowserRequiresPlugin2 = info.BrowserRequiresPlugin2(),

    BrowserForbidsPlugin2 = info.BrowserForbidsPlugin2(),

    // -1, 0, 1
    isMinJre4Plugin2 = info.isMinJre4Plugin2();



   if (javaInstalled!==null && javaInstalled>=-0.1) // Java installed and enabled
   {
      // most certain result
      // from Java applet query
      if (Plugin2Status>=3) result = 1;
      else if (Plugin2Status<=-3){}

      // Reasonably sure
      // from Deployment Toolkit query
      else if (Plugin2Status==2) result = 1;
      else if (Plugin2Status==-2){}

      // Reasonably sure
      else if (BrowserRequiresPlugin2 && Plugin2Status>=0 && isMinJre4Plugin2>0) result = 1;
      else if (BrowserForbidsPlugin2 && Plugin2Status<=0 && isMinJre4Plugin2<0){}

      // Somewhat sure
      else if (BrowserRequiresPlugin2) result = 1;
      else if (BrowserForbidsPlugin2){}

      else if (Plugin2Status>0) result=1;
      else if (Plugin2Status<0){}


      // Note: having isMinJre4Plugin2>0 does not really tell us
      // if Plugin2 is present or not. On Mac, it is possible to have
      // isMinJre4Plugin2>0 and yet Plugin2 is not enabled.
      //    else if (isMinJre4Plugin2>0){ result=1 }
      //
      // On the other hand, having isMinJre4Plugin2<0 means that
      // Plugin2 is not present.
      else if (isMinJre4Plugin2<0){}

      else result=0;


   }  // if Java not installed/not enabled, then result==-1
                                


   return result;

}, // end of isPlugin2InstalledEnabled()


// This object is returned by getInfo()
result:{

   // Return the instantiated Deployment Toolkit object.
   // Else return deployTK.status.
   //
   // If we return deployTK.status, it will be either:
   // == null (no attempt was made to instantiate the Toolkit, so we do not know if it is
   //  present or not)
   // == 0 (an attempt was made to instantiate, but the Toolkit is not installed/not enabled)
   getDeploymentToolkitObj: function()
   {
       var java=JAVA, info=java.info, DTK=java.DTK;

       // We try to force the Toolkit to instantiate in the web page.
       // The input arg 1 means that we try to instantiate for ALL browsers.
       // (Without the input arg, the instantiation would not occur for some browsers.)
       DTK.query(1);

       info.updateResult();

       return DTK.status && DTK.HTML ? DTK.HTML.obj() : DTK.status;

   }  // end of getDeployToolkitObj()
   


}, // end of result

// [public]
// Update the properties of the result{} object
updateResult:function(){

  var info=this, java=JAVA, applet=java.applet,

    x, javaInstalled=java.installed,

    // Calling updateResult() should not force the Deployment Toolkit to run,
    // because the Toolkit can sometimes cause a Java based popup.
    deployTK = java.DTK,

    queryResult = applet.results,

    result = info.result;
    



  result.DeployTK_versions = [].concat(
     $.isArray(deployTK.VERSIONS) ? deployTK.VERSIONS : []
  );
  // Note: we do not format the result.DeployTK_versions array. We leave it in the
  // exact format as given by the DTK plugin.


  result.vendor = info.getVendor();

  result.isPlugin2 = info.isPlugin2InstalledEnabled();

  // 0: Detection is OTF if java.OTF<3
  // 1: Detection is pending and will be NOTF if java.OTF==3
  // 2: Detection is NOTF if java.OTF>3
  result.OTF = java.OTF<3 ? 0 : (java.OTF==3 ? 1 : 2);


  // Get instantiated Java applet
  result.JavaAppletObj = null;
  for (x=0;x<queryResult.length;x++)
  {
    if (queryResult[x][0] && applet.HTML[x] && applet.HTML[x].obj())
    {
       result.JavaAppletObj = applet.HTML[x].obj();
       break;
    }
  }



  // Status of <object>/<applet> tags used for Java detection
  var allApplets=[null, null, null, null];
  for (x=0;x<queryResult.length;x++)  // x corresponds to a particular HTML tag
  {

     // queryResult[x][0] -> applet.active[x]==2
     if (queryResult[x][0]) allApplets[x] = 1;        // 1: Bridge[x] Active & Java Applet[x] Active
                                                      // for this HTML tag

     // At this point, queryResult[x][0] is either null or 0.
     // If it is null, then the applet has not even been attempted to
     // be instantiated.
     // If it is 0, then an attempt at instantiation has been made, but
     // no applet query results were obtained.


     else if (queryResult[x][0]!==null)   // ===0
     {

       // Make sure the applet.active[] array is up to date before using that data.
       // We do this via isAppletActive(x).
       if (java.NOTF) java.NOTF.isAppletActive(x);

       if (applet.active[x]>0)

                   allApplets[x] = 0;          // 0: Bridge[x] not Active & Java Applet[x] Active,
                                               // or jarfile path/name was incorrect
                                               // or we did not wait for a detection result due to
                                               //   verifyTags array setting for the applet.
       // else applet.active[x] <=0
       else if (

             applet.allowed[x]>=1 &&        // only give results for those tags that the
                                            // user specifies.

             java.OTF!=3 &&                 // java.OTF == 3 means java.installed=-0.5 or +0.5.
                                            // If java.installed==0.5 or -0.5, then we need to
                                            // wait before we give any numerical results. In the
                                            // meantime, we just return null.

              (
                // If applet(x) is disabled, then assign a value of -1.
                applet.isDisabled.single(x) ||

                // Java not installed or not enabled.
                // This disables all applets[x]
                javaInstalled==-0.2 || javaInstalled==-1 ||

                // Java Applet[x] disabled
                applet.active[x]<0 ||

                // If we get this far, then we have IE with ActiveX enabled.
                // The object tag has not displayed any altHTML (yet).
                //
                // x==3 represents the <object> tag with Oracle/Sun Java ActiveX.
                //
                // If Microsoft Java is present, then this <object> tag will not run.
                (x==3 && (/Microsoft/i).test(result.vendor))

              )


           )  allApplets[x] = -1;    // Java Applet[x] not able to run for this HTML tag.


     }
     

     // x==3 is <object> tag with Oracle/Sun Java ActiveX.
     // If codebase detection method gave a result, then we say that
     // <object> tag with ActiveX gave a result.
     // Codebase detection occurs without inserting applet into the DOM,
     // and without trying to query the applet.
     //
     // "queryResult[0][0]" corresponds to a codebase detection result.
     //
     // queryResult[0][0] -> applet.active[0]==1.5
     else if (x==3 && queryResult[0][0]) allApplets[x] = 0;

     // else queryResult[x][0] === null at this point.
     //
     // Applet was not inserted into the DOM to be queried.
     // However, we can still check if the corresponding HTML tag is disabled.
     else if (applet.isDisabled.single(x))
         allApplets[x] = -1;    // Java Applet[x] not able to run for this HTML tag.



  }    // end of loop x


  // We do not use the allApplets[0] result because that corresponds to the codebase
  // detection technique. The tag for allApplets[0] is handled and covered
  // by allApplets[3].
  result.objectTag = allApplets[1];
  result.appletTag = allApplets[2];
  
  BOUNDARY("select.pluginCheckbox.java && select.methodCheckbox.getinfo && select.miscCheckbox.allowactivex");
  
  result.objectTagActiveX = allApplets[3];
  
  BOUNDARY("select.pluginCheckbox.java && select.methodCheckbox.getinfo");


  // Get name and description from navigator.plugins array.
  // This could be useful when trying to detect the type of JVM
  // such as IcedTea, OpenJDK, Blackdown, Sun, etc...
  result.name = info.getNavPluginName();
  result.description= info.getNavPluginDescription();


  // Fill the result.All_versions[] array
  result.All_versions = [].concat(
     (result.DeployTK_versions.length ? result.DeployTK_versions :
              ($.isString(java.version) ? [java.version] : [])
      )
  );
  // Format array
  var A1=result.All_versions;
  for (x=0;x<A1.length;x++){ A1[x] = $.formatNum($.getNum(A1[x])); }


  return result;

}  // end of updateResult()


},  // end of java.info{} object


// [public]
// This function is a read-only interface to get information to the user
// The return value is an object result{}.
// We assume here that java.getVersion() has already been called.
//
// Usage:
//   var info = $.Plugins.java.getInfo();
//
// The getInfo() object is READ-ONLY and has properties that reveal extra info on the
// Java plugin.
getInfo: function(){

  var info=this.info;

  info.updateResult();

  return info.result;

},  // end of getInfo()


BOUNDARY20:"select.pluginCheckbox.java",




// [** PUBLIC **]   $.Plugins.java.getVerifyTagsDefault()
// Return the default value for the verifyTagsArray
getVerifyTagsDefault: function(){

  // return [1,0,1] or [1,1,1]
  return [1, this.applet.isDisabled.VerifyTagsDefault_1() ? 0 : 1, 1];

},  // end of getVerifyTagsDefault()



// [public]
// Get installed Java version
getVersion: function(_minVersion, jarfile, verifyTags){

  var java = this,     // java stands for $.Plugins.java
    tmp,
    applet = java.applet,
    verify = java.verify,
    navigator = java.navigator,


    // Note that we have a "version" variable and a "versionEnabled" variable.
    // "version" gets a value from the non-applet detection methods.
    // "versionEnabled" gets a value from either the non-applet or the applet detection methods.
    //
    // The "version" variable will receive a value from any detection methods that use the
    // Deployment Toolkit object, the navigator.mimetypes array, the navigator.plugins array.
    // These methods will detect Java regardless of the value of navigator.javaEnabled().
    //
    // The "versionEnabled" variable will receive its value from "version" if
    // navigator.javaEnabled() is true, or it receives a value from methods that guarantee
    // that Java is installed and enabled, such as : insert_Query_Any()
    //
    // The reason for all this has to do with Java being enabled or not.
    // It turns out that navigator.javaEnabled() for non-IE browsers is not always
    // correct. Meaning that in some cases, navigator.javaEnabled() == false when in
    // fact Java IS installed and enabled. For example, IcedTea Java 1,7,0,0 in Firefox 2
    // under Ubuntu Linux has problems - if we try to use the Javascript to Java bridge to
    // get the Java version, then navigator.javaEnabled() can be false, even if we refresh
    // the page.
    //
    // Hence, we need to separate Java detection from navigator.javaEnabled().
    //
    version = null, vendor = null, versionEnabled = null;



  // Initialize Java detection
  if (java.getVersionDone === null)
  {
        $.message.write(
           !java.JAVATOJSBRIDGE ? "[ *** WARNING: JAVA to JAVASCRIPT bridge is disabled. ]" : 0, 
           $.message.end());

        $.message.write(
           !java.JSTOJAVABRIDGE ? "[ *** WARNING: JAVASCRIPT to JAVA bridge is disabled. ]" : 0,
           $.message.end());

        java.OTF = 0;   // Detection has begun

        navigator.init();

        if (verify) verify.init();  // begin verification of jarfile path/name

        $.message.write("[ ]", $.message.end());

  }
  
  
  applet.setVerifyTagsArray(verifyTags);


  // We keep track of each valid jarfile input
  $.file.save(java, ".jar", jarfile);



  // If java.getVersionDone === 0 then java.getVersion() was previously run.
  // It also means that we are permitted to run java.getVersion() again, but
  // we will ONLY be using the applet.insert_Query_Any() method to obtain
  // any additional info.
  //
  // Note: this statement comes AFTER $.file.save(),
  // so that we can keep track of all input jarfile during jarfile verification.
  //
  // Note: this statement comes AFTER applet.setVerifyTagsArray(),
  // because the verifyTagsArray has to be set properly before running 
  // applet.insert_Query_Any().
  if (java.getVersionDone === 0)
  {
      if (applet.should_Insert_Query_Any())
      {
         tmp = applet.insert_Query_Any(_minVersion);

         // Note, we always update plugin status after applet.insert_Query_Any(),
         // regardless of whether something was detected or not.
         java.setPluginStatus(tmp[0], tmp[1], version, _minVersion);  // version, vendor

      }

      return;  // all other detection methods have already been used, so we exit

  }


  // It is possible that the NON-APPLET methods may not show Java as a plugin,
  // even though Java is installed and enabled for the browser.
  // This can happen in older Opera/Konqueror browsers(Windows) and also on the Macintosh.




   // ***** NON-APPLET DETECTION METHOD # 0
   //
   // This attempt can get the specific java version from the mimeTypes array.
   //
   if ((!version || $.dbug) && java.navMime.query().version) version = java.navMime.version;


   // ***** NON-APPLET DETECTION METHOD # 1
   //
   if ((!version || $.dbug) && java.navPlugin.query().version) version = java.navPlugin.version;



   // ***** NON-APPLET DETECTION METHOD # 2
   // This is the most reliable non-applet method for detecting the Oracle Java version(s)
   // that are installed.
   // However, when Java is outdated, the Deployment Toolkit might possibly give a popup.
   // This is very undesirable behavior. Hence, we may not want to
   // use this as the very FIRST non-applet detection method.
   //
   // Check if the Deployment Toolkit is able to get the Java version.
   if ((!version || $.dbug) && java.DTK.query().version) version = java.DTK.version;



   // This section is for ActiveX code only
   BOUNDARY("select.pluginCheckbox.java && select.miscCheckbox.allowactivex");

   // ***** NON-APPLET DETECTION METHOD # 3
   // We try to detect the version of Oracle Java Web Start, and based on this
   // we can say what version of Java is installed. For Internet Explorer only.
   if ((!version || $.dbug) && java.WebStart.query().version) version = java.WebStart.version;

   BOUNDARY("select.pluginCheckbox.java");





   // Copy "version" to "versionEnabled" if everything is ok
   //
   // If non-applet detection methods have some kind of problem, then we will fall
   // back on the applet detection methods.
   if (java.nonAppletDetectionOk(version)) versionEnabled = version;



   // We update plugin status before the applet detection method, because the
   // applet method depends on plugin status up to this point.
   java.setPluginStatus(versionEnabled, vendor, version, _minVersion);




   // ***** APPLET DETECTION METHOD # 1
   // Try to get the Java version (only if versionEnabled == null) by querying an external applet.
   //
   // if applet.should_Insert_Query_Any() == true then we run java applet even if we already know
   // the java version.
   //
   // This detection method tries to get the specific Java version by starting up the
   // Java runtime, which can be relatively slow. The previous attempts 
   // (ie. the NONAPPLET DETECTION METHODS) are much faster, hence we tried them first.
   if ( applet.should_Insert_Query_Any() )
   {
        tmp = applet.insert_Query_Any(_minVersion);
        if (tmp[0])
        {
           versionEnabled = tmp[0];
           vendor = tmp[1];
        }

   }




  // Update plugin status again
  java.setPluginStatus(versionEnabled, vendor, version, _minVersion);




}, // end of function getVersion()




// Return 1 if the "version" result from the non-applet detection methods is sufficient
//   for us to say that Java is really installed and enabled.
// Return 0 if the "version" result from the non-applet detection methods is not sufficient
//   for us to say that Java is really installed and enabled.
//   Java is possibly incompatible with the browser, or Java is possibly not enabled.
//   The applet detection methods will be used for further investigation.
//
// Note: if this routine incorrectly returns "0", it should be ok because
// the applet detection methods will be used as a backup.
// If this routine incorrectly returns "1", then you have a false positive.
//
// Note: version input should only come from non-applet detection methods.
//
// Input "version" is the result of non-applet detection.
nonAppletDetectionOk: function(version){

   var java=this, navigator=java.navigator, browser=$.browser, ok=1;


   // When you disable Java in Firefox, then the Deployment Toolkit
   // still thinks that Java is present. The Deployment ToolKit does not reveal
   // whether Java is enabled in the browser or not.


   // If plugin version not present, then not OK (applet methods will thus be used).
   if (!version ||

       // non-applet methods detected a Java version.
       // Now, we try to make sure that Java is enabled, or at least appears to be enabled.
       // This applies to both IE and non-IE browsers, since both have a navigator.javaEnabled().
       //
       // Case i)
       //   navigator.javaEnabled()==true, then Java appears enabled, so OK.
       //   (navigator.javaEnabled() is not 100% reliable, so a false positive detection
       //   is very possible here, but that is still better than a false negative detection)
       //
       // Case ii)
       //   navigator.javaEnabled()==false, then Java appears not to be enabled, so NOT OK.
       //   So, we will have to insert applets and query.
       //
       // Note:
       // navigator.javaEnabled() properties for IE are as follows...
       // In IE6/IE7 WinXP, navigator.javaEnabled() reflects the settings from
       //     Tools -> Internet Options -> Security Tab -> Custom Level -> Java Permissions
       // So when Java Permissions is set to "disable", then navigator.javaEnabled()
       // is false. When Java Permission is enabled, then navigator.javaEnabled() is true.
       // This holds regardless of whether Sun/Oracle JVM or Microsoft JVM is present
       //
       // In IE5 Win98SE, navigator.javaEnabled is always true regardless of
       // Java Permissions.
       // In IE5.5 Win98SE, navigator.javaEnabled is always true regardless of the
       // Java Permission settings. This appears to be a bug.
       //
       // When navigator.javaEnabled() is false in IE, then the <applet> tag is disabled
       // and will not display any Java applet at all - neither with the MS JVM or the
       // Oracle/Sun JVM. However, you can still use the <object> tag to display Java
       // applets with the Sun/Oracle JRE (just use the
       // Sun/Oracle classid = "8AD9C840-044E-11D1-B3E9-00805F499D93").
       //
       // Note:
       // If navigator.javaEnabled() is false in IE, then <applet> tag is disabled, though
       // the <object> tag may still be able to run Java.
       // If navigator.javaEnabled() is false in non-IE, then there is a chance that Java
       // is disabled for all tags, or is not installed.
       // In either case, we would want to use Java applets to verify whether Java can run
       // or not.
       !navigator.javaEnabled() ||


       // Non-applet methods detected a Java version.
       // Java appears to be enabled.
       // If no Java mimeType exists for non-IE browsers, then not Ok. Applet methods will be used.
       (!browser.isIE && !navigator.mimeObj) // ||


       // Update: we comment out this next line of code.
       // There is no need to check for this condition.
       // If ActiveX is disabled, or ActiveX filtering is enabled, then 
       // the non-applet detection methods will not detect anything.
       // This should be true for IE < 11 (which does not use navigator arrays),
       // as well as IE 11+ (which allows the use of navigator arrays)
       // Hence @ok is set to 0 anyway.
       //
       //
       // Non-applet methods detected a Java version.
       // Java appears to be enabled.
       // If ActiveX not enabled in IE, then not Ok. Applet methods will be used.
       //
       // (browser.isIE && !browser.ActiveXEnabled)
       
       ){ok=0}



   // After this point, we can use browser version detection to determine if the
   // detected plugin version is compatible with the browser version. For example,
   // if "Next Generation Java Plugin 2" is installed into a browser that can only run
   // "Classic Java".
   //
   // The problem here is that browser version detection is rather unreliable,
   // since it is based on navigator.userAgent.
   // So, if we skip the code that depends on browser version detection, then the worst
   // case error here would be a "false positive" plugin detection.
   //
   // This would mean that we would say that the plugin is installed/enabled, when really it would
   // not run or even cause a browser hang/plugin crash. In this case, the end user would notice
   // that the plugin is not compatible, and would disable it or update it.
   //
   // Hence, for the time being we simply comment out the code shown below.



   // Case # 0
   // For mobile/unknown platforms, we do not have enough info
   //
   // else if ($.OS>=20){}


   // Case # 1a
   //
   // Browser not compatible with Java?
   //
   // else if (java.info && java.info.getPlugin2Status()<0 && java.info.BrowserRequiresPlugin2()) {ok=0}


   // Case # 1b
   //
   // Using this code can cause a popup/plugin crash in FireFox 2.0.0.20 / JRE 1,7,0,2.
   // So, should we allow the popup, or should we allow a false positive detection?
   // We choose the false positive, so we comment out this code.
   // Besides, the user will eventually become aware of this problem, and fix it anyway.
   //
   // else if (java.info && java.info.getPlugin2Status()>0 && java.info.BrowserForbidsPlugin2()) {ok=0}


   // Case # 1c
   //
   // Browser not compatible with Java?
   // Just because the non-applet methods detect Java does not mean that Java will
   // actually run in the browser.
   //
   // We comment out this code for now. It appears that navigator.javaEnabled() == false
   // for this case, which automatically means that the applet detection methods
   // will sort everything out. Also, this code would cause the old Java plugin to run,
   // which is very slow to start up.
   //
   // else if (version && java.info && !java.info.isMinJre4Plugin2(version) && java.info.BrowserRequiresPlugin2()){ok=0}




   return ok;

},   // end of nonAppletDetectionOk()



// This routine sets the value of the output variables for the Java detection.
// The output variables of the java detection are java.version0, java.version, java.installed,
// and java.getVersionDone.
// This routine should always be run after completing a Java detection attempt.
setPluginStatus: function(versionEnabled, vendor, version, _minVersion){

   var java=this, tmp, isMinVersion=0, applet=java.applet;

   $.message.write("[ ]", $.message.end());
   $.message.write("[ START Setting plugin status for Java ]", $.message.end());


   // version, java.version0 are from non-applet detection methods
   version = version || java.version0;



   // Get value for isMinVersion.
   //
   // if isMinVersion > 0, then >= some minimum version #
   // if isMinVersion < 0, then < some maximum version #
   //
   // Check if versionEnabled is a string version range,
   //  >= some minimum #, or < some maximum #.
   tmp = applet.isRange(versionEnabled);
   if (tmp)
   {
       // As a consistency check, we make sure that versionEnabled is consistent with _minVersion.
       if (applet.setRange(tmp, _minVersion) == versionEnabled) isMinVersion = tmp;

       // We erase versionEnabled, because it is not a specific version #.
       // It only tells us if we have > or < a version #.
       versionEnabled = 0;

   }


   // OTF detection has completed, using non-applet and/or applet detection methods
   //
   // if OTF (java.installed==null) and Java installed (version!=null) and Java applet
   //   did not give any result (versionEnabled==null)
   //   then we set java.installed = -0.2 (Java installed but not enabled).
   //
   // 0.7 means plugin version >= minversion, plugin installed/enabled
   // -0.1 means plugin version < minversion, plugin installed/enabled
   //
   // Note: there is the possibility that after setting java.installed=1,
   // you may run this routine later and then set java.installed=-0.2.
   // This is possible if a non-applet method detects the java version,
   // but then an OTF applet method says not installed.
   //
   // THE ORDER OF DETECTION METHODS IS IMPORTANT HERE when calling this routine
   // repeatedly... we use the non-applet methods first,
   // and then the applet methods. We do it in this order because applet methods
   // are more reliable and also slower.
   // Hence we are able to go from java.installed=1 to java.installed=-0.2.
   //
   if (java.OTF < 3) java.installed = isMinVersion ? ( isMinVersion>0 ? 0.7 : -0.1 ) :
              ( versionEnabled ? 1 : (version ? -0.2 : -1) );




   // OTF detection has completed, using applet detection methods
   //
   // If none of the applet methods show any OTF results, then override any results from
   // the non-applet methods, and set the status to not installed or not enabled.
   // [This reduces FALSE POSITIVE detections from the non-applet detection methods, more than
   // increasing the chances of a FALSE NEGATIVE detection]
   //
   //
   // "java.OTF == 2 && java.NOTF" means that detection using applet detection has completed OTF,
   // and that the NOTF detection code is present but was not needed.
   // We check for java.NOTF, because if java.NOTF is not present then it is possible that
   // Java might be detected by NOTF.
   //
   // If we did not check for "java.NOTF" here, then when the java.NOTF module is absent, we could
   // end up with java.installed==-1 when in fact Java could have been detected by NOTF, and in fact
   // was detected by the non-applet methods. Hence, we would get a FALSE NEGATIVE here. We wish
   // to avoid that.
   //
   // Update: java.NOTF will always be present now, since we make it a permanent part of the
   // script. The user can no longer remove java.NOTF from the script.
   if (java.OTF == 2 && java.NOTF &&

        // We make sure that all the applet detection methods found nothing
        // Note, we do not use !versionEnabled here because versionEnabled can
        // get its value from both non-applet and applet methods. And here, we
        // ONLY want values from the applet methods.
        !java.applet.getResult()[0]
       )


         java.installed = version ? -0.2 : -1;




   // NOTF detection is currently running, using Java applets.
   // We only run this section once, this is why we check for -0.5/0.5
   if (java.OTF == 3 && java.installed!=-0.5 && java.installed!=0.5)
   {
        // If java.NOTF.isJavaActive()>=1, Java applet can run or is running, so java.installed = 0.5.
        // We wait until JRE loads&runs/window.onload to get the Java version.
        //
        // Otherwise, Java possibly installed but we must
        // wait until JRE loads&runs/window.onload to find out, so java.installed = -0.5.
        //
        // The "1" input argument means that we do not query the applet tag widths
        // to see if Java is active.
        // Instead, we just return the results from the previous query.
        // This is faster.
        java.installed = (java.NOTF.isJavaActive(1) >= 1 ? 0.5 : -0.5);

   
   }


   // NOTF detection with Java applets has just completed.
   // We only run this section once, this is why we check for -0.5/0.5
   if (java.OTF == 4 && (java.installed==-0.5 || java.installed==0.5))
   {
     // Java installed, enabled, and Java version is known.
     if (versionEnabled){ java.installed = 1; }
     
     else if (isMinVersion)
     {
        java.installed = isMinVersion>0 ? 0.7 : -0.1;
     }

     // Javascript2Java bridge is disabled, or applet scripting is disabled
     // or we just did not wait long enough to get data from applet query
     //
     // Here, we try to see if Java is active without relying on the Javascript/Java bridge.
     // If it is active, then Java is installed, enabled, and running.
     //
     // The "1" input argument means that we do not query the applet tag widths
     // to see if Java is active.
     // Instead, we just return the results from the previous query.
     // This is faster.
     else if (java.NOTF.isJavaActive(1)>=1)
     {

        // If non-applet methods found a Java version (ie. in the navigator.plugins or
        // navigator.mimeTypes array), and browser is running
        // an applet (though the applet itself cannot report any Java version), then
        // Java is installed and enabled.
        if (version){
             java.installed = 1;
             versionEnabled = version;
        }

        else java.installed = 0;

     }

     // Java installed but not enabled.
     else if (version) java.installed = -0.2;

     // Java could not be detected.
     else java.installed = -1;

   }




   // Set plugin.version, plugin.version0, plugin.vendor

   // version, java.version0 are from non-applet methods
   if (version) java.version0 = $.formatNum($.getNum(version));
  
   if (versionEnabled && !isMinVersion) java.version = $.formatNum($.getNum(versionEnabled));

   if (vendor && $.isString(vendor))  java.vendor = vendor;
   if (!java.vendor) java.vendor = "";



   // Here we set java.getVersionDone.
   // Once it is set to 1, it cannot be changed.
   //
   // if === 0 then getVersion() method can be called again.
   // if ==1 then getVersion() will never be called again.

   // If we are verifying jarfile [path/]name, then continue to allow java.getVersion() to
   // be called. This way, we can continue to collect any jarfile path/names in a web page,
   // and analyze them.
   if (java.verify && java.verify.isEnabled()) { java.getVersionDone = 0; }

   else if (java.getVersionDone!=1)
   {
        if (java.OTF < 2){ java.getVersionDone = 0; }

        // Else java.OTF >=2, so insert_Query_Any() has been called
        else
        {
           // If all applets have attempted to be inserted into HTML then getVersionDone = 1.
           // If it is still possible to insert one or more applets into HTML, then set = 0.
           java.getVersionDone = java.applet.can_Insert_Query_Any() ? 0 : 1;
        }

   }
   
   $.message.write("[ java.getVersionDone: " + $.message.args2String(java.getVersionDone) + " ]", $.message.end());
   $.message.write("[ java.vendor: " + $.message.args2String(java.vendor) + " ]", $.message.end());
   $.message.write("[ java.version0: " + $.message.args2String(java.version0) + " ]", $.message.end());
   $.message.write("[ java.version: " + $.message.args2String(java.version) + " ]", $.message.end());
   $.message.write("[ java.installed: " + $.message.args2String(java.installed) + " ]", $.message.end());
   

   $.message.write("[ java.applet.HTML[ ]: " + 
       $.message.args2String([java.applet.HTML]) + " ]", $.message.end());
   $.message.write("[ java.applet.active[ ]: " + 
       $.message.args2String([java.applet.active]) + " ]", $.message.end());
   $.message.write("[ java.applet.results[ ]: " + 
       $.message.args2String([java.applet.results]) + " ]", $.message.end());

   $.message.write("[ java.applet.IDforJAVAtoJS[ ]: " + 
       $.message.args2String([java.applet.IDforJAVAtoJS]) + " ]", $.message.end());
   $.message.write("[ java.applet.IDforJStoJAVA[ ]: " + 
       $.message.args2String([java.applet.IDforJStoJAVA]) + " ]", $.message.end());


   $.message.write("[ END Setting plugin status for Java ]", $.message.end());
   $.message.write("[ ]", $.message.end());

},   // end setPluginStatus()



// -------------------------------------------------------------------------------------------
/* 
    Java WebStart detection
    This is for IE only.

    We use codebase detection for Java Web Start, which in turn gives us the Java version.


    JRE 1,6,0,0 -> Does NOT add registry key to make WebStart security PreApproved
    JRE 1,6,0,1 -> Does NOT add registry key to make WebStart security PreApproved
    JRE 1,6,0,2 -> Adds registry key to make preapproved
    JRE 1,6,0,3 -> Adds registry key to make preapproved
    JRE 1,6,0,7 -> Adds registry key to make preapproved
    JRE 1,6,0,37 -> Adds registry key to make preapproved
    JRE 1,6,0,43 -> Adds registry key to make preapproved
    
    JRE 1,7,0,0 -> Adds registry key to make preapproved
    JRE 1,7,0,3 -> Adds registry key to make preapproved
    JRE 1,7,0,21 -> Does NOT add registry key to make WebStart security PreApproved
    JRE 1,7,0,40 -> Does NOT add registry key to make WebStart security PreApproved
    JRE 1,7,0,71 -> Does NOT add registry key to make WebStart security PreApproved


    The advantage that codebase detection for WebStart has is that at most, it only 
    appears to cause one security popup message. However, for IE 11/Win10 with outdated
    Java, codebase detection for Java (using classid 8AD9...) can give you MANY security
    popup messages.



*/

// This section is for ActiveX code only
BOUNDARY25:"select.pluginCheckbox.java && select.miscCheckbox.allowactivex",

WebStart:{
  
  // 0 if not run yet
  // 1 if already has run
  hasRun: 0,

  // [public]
  version: "",
  
  // Search the IE codebase to get the plugin version, using Java WebStart.
  // This works for Java JRE 1,6,0,0 and higher.
  codebase: {

    // Java WebStart classid.
    // This value will override the java.classID for codebase plugin detection
    classID: "clsid:5852F5ED-8BF4-11D4-A245-0080C6F74284",


    // We use the "checkInstalledFirst" input arg to make the routine check if the plugin 
    // is installed first, using only ONE attempted instantiation. If not installed, 
    // then detection ends. If it is installed, then the routine continues with more 
    // attempted instantiations.
    // We do this in case EACH codebase instantiation creates a separate security
    // popup. In this case, if the user blocks the first attempted instantiation, then the
    // detection is over and no further instantiations/popups from this routine will occur.
    isMin:function(minVersion, checkInstalledFirst){
      this.$$ = JAVA;
      return $.codebase.isMin(this, minVersion, checkInstalledFirst);
    },
    
    search:function(checkInstalledFirst){
      this.$$ = JAVA;
      return $.codebase.search(this, checkInstalledFirst);
    },


    // No need for param tags
    // ParamTags:  "<param name=\"src\" value=\"\" />",



    // DIGITMAX[x] specifies the max value that each digit of codebase version can have.
    // Given DIGITMAX[x] == [A,B,C,D] the maximum allowed codebase is A,B,C,D.
    //
    // The length of DIGITMAX[] is the same as length of Lower[].
    //
    // if DIGITMAX[x] == 0, then it corresponds to a non-existent codebase
    // between Lower[x] and Upper[x].
    //
    DIGITMAX:[ 

        // WebStart
        // Codebase Range: 6,0,0,0+
        // JRE Range:      1,6,0,0+
        //
        // JRE 1,7,0,71 -> Codebase 7,0,710,0
        [12,4,2048],

        // WebStart
        // Codebase Range: 0,0,0,0 - 6,4,1024,0
        // JRE Range:      0,0,0,0 - 6,4,1024,0
        //
        [5,4,1024]

    ],


    // Min value for each digit
    // Java Web Start should never go below 5
    DIGITMIN: [5,0,0,0],



   // These 2 arrays contain codebase version numbers.
   // They help to convert codebase version numbers to their
   // corresponding plugin version numbers.
   //
   // The rules for these 2 arrays are:
   //  1) Upper[0] is the highest codebase number you ever expect to encounter
   //  2) The last item in Lower[] is always "0"
   //  3) Upper[] is arranged in descending order
   //  4) Lower[] is arranged in descending order
   //  5) Lower[x] == Upper[x+1]
   //  6) The strings in Upper[x],Lower[x] do not have to be formatted.
   //     They are automatically formatted when they are used.
   //  7) Lower[x]<= codebase[x] < Upper[x] corresponds to convert[x]
   //  8) One and only one codebase number is allowed to map to
   //      any given plugin version number. This is IMPORTANT.
   //      When needed, set convert[x]==0 to accomplish this.
   //
   //
   Upper: ["999", "6"],
   Lower: ["6",   "0"],



   // The codebase detection technique seems to make IE try to connect with
   // activex.microsoft.com/objects/ocget.dll
   // There does not appear to be any way to prevent this from happening.
   // See http://support.microsoft.com/kb/323207
   //
   // Update: this may no longer be true. The codebase technique no
   // longer inserts anything into the DOM. Need to retest to see if
   // this still happens.



   // Convert plugin version to/from codebase number.
   // convert[x] is used to convert plugin version to/from codebase number, where
   //   Lower[x] <= codebase[x] number <= Upper[x]
   // This array has the same length as Upper[], Lower[].
   //
   // convert[x] == 1 means that codebase[x] ( == A.B.C.D) == plugin version A.B.C.D.
   // convert[x] == 0 means that codebase[x] does not have a corresponding plugin version,
   //     where  Lower[x]<= codebase[x] < Upper[x].
   //
   // if toCodebase, then convert to codebase number.
   // if !toCodebase, then convert to plugin version number.
   convert: [

     // WebStart
     // Codebase Range: 6,0,0,0+
     // JRE Range:      1,6,0,0+
     function(p, toCodebase)
     {   return toCodebase ?

         // version "1,7,0,71"  to codebase "7,0,710,0"
         // version "1,8,0,71"  to codebase "8,0,710,0"
         // version "1,9,0,71"  to codebase "9,0,710,0"
         // version "1,12,0,71" to codebase "12,0,710,0"
         // version "2,0,0,0"   to codebase "99,0,0,0"
         // version "3,0,0,0"   to codebase "99,0,0,0"
         [parseInt(p[0],10)>1 ? "99" : p[1], p[2], p[3]+"0", "0"] :


         // codebase "7,0,710,0" to version "1,7,0,71"
         //
         // p[2] usually has length>=2
         // So we remove the last character of p[2]
         // Except if p[2]=="0", then we do not remove anything.
         ["1", p[0], p[1], p[2].substring(0,p[2].length-1||1)]
     },
     
     1

   ] // end of convert[]


  },  // end of codebase{}


  // Determine when it is safe to run the Deployment Toolkit.
  // Here we deal with the cases that cannot handle the Java Deployment Toolkit.
  //
  // Return 1 if disabled
  // Return 0 if not disabled
  isDisabled: function(){
    
    var WebStart=this;

    if (!$.browser.isIE || WebStart.hasRun) return 1;

    if ($.dbug) return 0;

    if (
        // if <object> tag using ActiveX is disabled, then
        // we do not insert into DOM.
        // Otherwise, IE could give a popup for an <object> tag.
        //
        // Note: there is no browser/OS detection here.
        // Only feature detection, which is more reliable.
        !$.DOM.isEnabled.objectTagUsingActiveX() ||
        
        // We only do a codebase search for JRE 1,7,0,0+
        //
        // codebase.isMin() returns:
        //    0, then we were not able to use codebase detection, or plugin not installed/enabled.
        //    1, then we used codebase detection, and version >= minversion, plugin installed.
        //   -1, then we used codebase detection, and version < minversion, plugin installed.
        //
        // The "true" input arg will make the routine check if the plugin is installed first,
        // using only ONE instantiation. If not installed, then detection ends.
        // We do this in case EACH codebase instantiation creates a separate security
        // popup. In this case, if the user blocks the first instantiation, then the 
        // detection is over and no further popups from this routine will occur.
        WebStart.codebase.isMin("1,7,0,0", true) <= 0

       ) return 1;


    return 0;   // WebStart is ok


  }, // end of isDisabled()
  
  query: function(){

    var WebStart=this,
      version=null,
      exit = WebStart.isDisabled();

    WebStart.hasRun = 1;
    if (exit) return WebStart;


    $.message.write($.message.time(WebStart.query,1), $.message.end());   // Start measuring time delay
    $.message.write("[ ]", $.message.end());
    $.message.write("[ START Java Web Start detection ]", $.message.end());



    version = WebStart.codebase.search();
    if (version) WebStart.version = version;


    $.message.write(["[ Java version detected: " + (version ? version : "none") + " ] "], $.message.end());

    $.message.write("[ END Java Web Start detection in " + $.message.time(WebStart.query) +
     " ]", $.message.end());

    $.message.write("[ ]", $.message.end());


    return WebStart;

  } // end of query()


}, // end of WebStart{}


BOUNDARY26:"select.pluginCheckbox.java",


// -------------------------------------------------------------------------------------------
/* ***** Begin Deployment Toolkit object *****


  We use the Deployment Toolkit Object for Java detection because it will (I believe) become
  the standard method of Sun Java plugin detection, starting with JRE 1,6,0,10.
  At least, it should be for Windows.


  The problems with relying ONLY on the Deployment toolkit object for plugin detection are:
    a) The user may never have installed a sufficiently high JRE version and thus will not
     have the deployment toolkit object installed
    b) We do not know if the toolkit will ever be a part of Java on Macintosh or Linux
    c) What about Java that is not from Sun?
    d) The Deployment Toolkit does not seem to pay attention to whether Java is enabled or disabled
     in the browser.

  For these reasons, we also try to detect java with methods that do not involve the
  Deployment Toolkit object.


  Note: the DTK may sometimes cause a popup to occur when Java is out of date.
  The popup is not generated by the browser. It is generated by the DTK/JRE itself,
  and hence this popup can occur for both IE and non-IE browsers.


------------
Some Deployment ToolKit data from Firefox 10/WinXP follows...


DTK detected JRE version(s): 1.7.0_03
DTK.isPlugin2( ): 0
DTK.browserJVM: null
DTK.deployVersion: undefined
DTK.runningJVM: null
DTK.version: 1.6.0_10
DTK pluginObj.name: Java(TM) Platform SE 6 U10
DTK pluginObj.description: Java(TM) Platform SE binary
DTK mimetype: application/npruntime-scriptable-plugin;DeploymentToolkit
DTK pluginObj.filename: npdeploytk.dll


DTK detected JRE version(s): 1.7.0_03
DTK.isPlugin2( ): 0
DTK.browserJVM: null
DTK.deployVersion: undefined
DTK.runningJVM: null
DTK.version: 1.6.0_11
DTK pluginObj.name: Java(TM) Platform SE 6 U11
DTK pluginObj.description: Java(TM) Platform SE binary
DTK mimetype: application/npruntime-scriptable-plugin;DeploymentToolkit
DTK pluginObj.filename: npdeploytk.dll


DTK detected JRE version(s): 1.7.0_03
DTK.isPlugin2( ): 0
DTK.browserJVM: null
DTK.deployVersion: undefined
DTK.runningJVM: null
DTK.version: 1.6.0_14
DTK pluginObj.name: Java Deployment Toolkit 6.0.140.8
DTK pluginObj.description: NPRuntime Script Plug-in Library for Java(TM) Deploy
DTK mimetype: application/npruntime-scriptable-plugin;DeploymentToolkit
DTK pluginObj.filename: npdeploytk.dll


DTK detected JRE version(s): 1.7.0_03
DTK.isPlugin2( ): 0
DTK.browserJVM: null
DTK.deployVersion: undefined
DTK.runningJVM: null
DTK.version: 1.6.0_17
DTK pluginObj.name: Java Deployment Toolkit 6.0.170.4
DTK pluginObj.description: NPRuntime Script Plug-in Library for Java(TM) Deploy
DTK mimetype: application/npruntime-scriptable-plugin;DeploymentToolkit
DTK pluginObj.filename: npdeploytk.dll


DTK detected JRE version(s): 1.7.0_03
DTK.isPlugin2( ): 0
DTK.browserJVM: null
DTK.deployVersion: undefined
DTK.runningJVM: null
DTK.version: 1.6.0_18
DTK pluginObj.name: Java Deployment Toolkit 6.0.180.7
DTK pluginObj.description: NPRuntime Script Plug-in Library for Java(TM) Deploy
DTK mimetype: application/java-deployment-toolkit
DTK pluginObj.filename: npdeploytk.dll


DTK detected JRE version(s): 1.7.0_03
DTK.isPlugin2( ): 0
DTK.browserJVM: null
DTK.deployVersion: undefined
DTK.runningJVM: null
DTK.version: 1.6.0_20
DTK pluginObj.name: Java Deployment Toolkit 6.0.200.2
DTK pluginObj.description: NPRuntime Script Plug-in Library for Java(TM) Deploy
DTK mimetype: application/java-deployment-toolkit
DTK pluginObj.filename: npdeployJava1.dll


DTK detected JRE version(s): 1.6.0_31
DTK.isPlugin2( ): 1
DTK.browserJVM: null
DTK.deployVersion: undefined
DTK.runningJVM: null
DTK.version: 1.6.0_31
DTK pluginObj.name: Java Deployment Toolkit 6.0.310.5
DTK pluginObj.description: NPRuntime Script Plug-in Library for Java(TM) Deploy
DTK mimetype: application/java-deployment-toolkit
DTK pluginObj.filename: npdeployJava1.dll


DTK detected JRE version(s): 1.7.0_02
DTK.isPlugin2( ): 0
DTK.browserJVM: null
DTK.deployVersion: undefined
DTK.runningJVM: null
DTK.version: 1.6.0_31
DTK pluginObj.name: Java Deployment Toolkit 6.0.310.5
DTK pluginObj.description: NPRuntime Script Plug-in Library for Java(TM) Deploy
DTK mimetype: application/java-deployment-toolkit
DTK pluginObj.filename: npdeployJava1.dll


DTK detected JRE version(s): 1.7.0
DTK.isPlugin2( ): 0
DTK.browserJVM: null
DTK.deployVersion: undefined
DTK.runningJVM: null
DTK.version: 10.0.0
DTK pluginObj.name: Java Deployment Toolkit 7.0.0.147
DTK pluginObj.description: NPRuntime Script Plug-in Library for Java(TM) Deploy
DTK mimetype: application/java-deployment-toolkit
DTK pluginObj.filename: npdeployJava1.dll


DTK detected JRE version(s): 1.7.0_01
DTK.isPlugin2( ): 0
DTK.browserJVM: null
DTK.deployVersion: undefined
DTK.runningJVM: null
DTK.version: 10.1.0
DTK pluginObj.name: Java Deployment Toolkit 7.0.10.8
DTK pluginObj.description: NPRuntime Script Plug-in Library for Java(TM) Deploy
DTK mimetype: application/java-deployment-toolkit
DTK pluginObj.filename: npdeployJava1.dll


DTK detected JRE version(s): 1.7.0_02
DTK.isPlugin2( ): 1
DTK.browserJVM: null
DTK.deployVersion: 10.2.0
DTK.runningJVM: null
DTK.version: 10.2.0
DTK pluginObj.name: Java Deployment Toolkit 7.0.20.13
DTK pluginObj.description: NPRuntime Script Plug-in Library for Java(TM) Deploy
DTK mimetype: application/java-deployment-toolkit
DTK pluginObj.filename: npdeployJava1.dll


DTK detected JRE version(s): 1.7.0_03
DTK.isPlugin2( ): 1
DTK.browserJVM: null
DTK.deployVersion: 10.3.0
DTK.runningJVM: null
DTK.version: 10.3.0
DTK pluginObj.name: Java Deployment Toolkit 7.0.30.5
DTK pluginObj.description: NPRuntime Script Plug-in Library for Java(TM) Deploy
DTK mimetype: application/java-deployment-toolkit
DTK pluginObj.filename: npdeployJava1.dll


*/

DTK: {

   // 0 if not run yet
   // 1 if already has run
   hasRun:0,

   // [public]
   status: null,      // == null   query() method not called yet
                      // ==  0     DTK not installed/not enabled
                      // == -1     DTK installed/enabled but no Oracle/Sun Java
                      // == 1      DTK installed/enabled and Oracle/Sun Java detected

   // [public]
   VERSIONS: [],      // All detected JRE versions (as unformatted version strings)

   // [public]
   version: "",       // Highest detected JRE version (empty string or formatted string version)

   // [public]
   HTML: null,        // HTML object for Deployment Toolkit.
                      // An HTML object allows us to access a DOM object, its <span> parent, etc...

   Plugin2Status: null,

   // This is the classid for the Deployment Toolkit
   // It is also an approved ActiveX control for IE 7+
   //
   // Note: The Oracle DeployJava.js script specifies that the DTK classid is
   // "clsid:CAFEEFAC-DEC7-0000-0000-ABCDEFFEDCBA". This is the classid we will
   // use to instantiate the DTK
   //   However, in the Registry I noticed that there is another classid very similar to
   // that. The classid for this key is "clsid:CAFEEFAC-DEC7-0000-0001-ABCDEFFEDCBA".
   // It ALSO works to instantiate the DTK, at least for JRE 7+.
   //
   // From JRE 1,6,0,10- 1,6,0,19 there appears to be only 1 classid.
   // From JRE 1,6,0,20+ there appears to be 2 classids.
   // We list the newer classid first.
   classID: ["clsid:CAFEEFAC-DEC7-0000-0001-ABCDEFFEDCBA",    // newer classid
             "clsid:CAFEEFAC-DEC7-0000-0000-ABCDEFFEDCBA"],   // older classid


   // This is the mimetype for the Deployment Toolkit
   // We list the newer mimetype first.
   mimeType: [ "application/java-deployment-toolkit",                         // new mimetype
                 "application/npruntime-scriptable-plugin;DeploymentToolkit"  // old mimetype
             ],

 // Determine when it is safe to run the Deployment Toolkit.
 // Here we deal with the cases that cannot handle the Java Deployment Toolkit.
 //
 // Return 1 if DTK disabled
 // Return 0 if DTK not disabled
 isDisabled: function(instantiate){

   var deployTK=this;

   // If we already inserted an instance into the DOM, then absolutely do not 
   // allow another instantiation
   if (deployTK.HTML) return 1;
   
   // We want to force instantiation
   if (instantiate || $.dbug) return 0;

   if ( deployTK.hasRun ||

        // We have decided to disable the DTK for ALL non-IE browsers.
        // The reason is that it produces browser generated popups when outdated,
        // in addition to the JRE/DTK itself producing a popup when outdated.
        // Besides, non-IE browsers have the navigator arrays for Java detection.
        //
        // The downside to disabling for all non-IE browsers is that when Java is disabled
        // in the browser, but is still installed, we won't be able to tell the
        // user that Java is installed but not enabled. We can only say that
        // Java is not installed or not enabled. But given how many security popups
        // that Java generates for the end user, this is a reasonable trade off.
        //
        //
        // We disable DTK when <object> tag using ActiveX is disabled.
        //
        // For IE, we use DTK. IE<11 does not have navigator arrays for detection of Java,
        // so we only have the DTK (can give popups) or Java applets (can give popups) 
        // to accomplish detection.
        // Either way, we get a popup when Java is outdated.
        // So we might as well use the DTK, since it is much faster that running 
        // Java applets.
        //
        // if <object> tag using ActiveX is disabled, then
        // we do not insert into DOM.
        // Otherwise, IE could give a popup for an <object> tag.
        //
        // Note: there is no browser/OS detection here.
        // Only feature detection, which is more reliable.
        !$.DOM.isEnabled.objectTagUsingActiveX()



        // Exclude old versions of IE.
        //
        // Update: there is no need to explicitly exclude versions of IE < 6,
        // even though the DTK is not supported for IE < 6.
        // The reasons for this are:
        // 1) The Deployment Toolkit will not install on Windows that have IE 5/5.5 anyway.
        // 2) Nobody uses IE 5.5 anymore.
        // 3) PluginDetect is not officially supported for IE < 6
        // 4) If browser.verIE ever should get a value < 6, then the DTK should still 
        //  be able to run. Why? Because most likely, the actual IE version 
        //  is > 6, but the user simply modified their userAgent, or the browser is in 
        //  quirks mode (where document.document.documentMode == 5).
        //
        // (browser.isIE && browser.verIE<6) ||


        // We need to exclude older Gecko browsers from running the DTK to prevent a plugin crash.
        // Deployment Toolkit is not compatible with older Gecko browsers.
        // So, we exclude browser.verGecko <= "1.6"
        //
        // Update (4/17/10) : Gecko browsers now seem to block old versions of Deployment Toolkit
        // for Security reasons. They appear to disable the plugin completely.
        //
        // (browser.isGecko && $.compareNums(browser.verGecko, $.formatNum("1.6"))<=0) ||


        // Safari/Windows cannot handle old DTK mimetype.
        // However, the new DTK mimetype was introduced with JRE 1,6,0,18
        // appears to be mostly compatible with Safari 3 & 4. The only drawback
        // with the new mimetype DTK is if you remove the instantiated DTK DOM object from the page
        // and then reload the page, the browser will crash. The same thing happens if you
        // set display:none to the DTK DOM object.
        //
        // The only acceptable thing you can do at this point is to
        // shift the <div> off the screen. Then Safari will not crash.
        //
        // Update: Even with the new mimetype, there is a major flaw.
        // If DTK is instantiated, and Java plugin is instantiated, and then we reload
        // the page, the browser will crash.
        // Hence, Safari is not yet fully compatible with the Java DTK.
        //
        // Update: When we instantiate DTK with the new mimetype, then remove the DTK,
        // and then reload, then Safari crashes. No need to even instantiate Java.
        //
        // So far, Safari 5.0/Windows and lower will crash.
        //
        // Update: Given the fact that Safari/Windows allows you to easily change the user agent,
        // there might not be much point in trying to filter out Safari crashes here.
        // Maybe we should just let Safari/Windows crash, then. It's a really bad browser,
        // and anyone who uses it deserves what they get.
        //
        // (browser.isSafari && $.OS==1 && (!browser.verSafari||$.compareNums(browser.verSafari, "5,1,0,0")<0)) ||


        // As of Chrome 10, it appears that we get a popup in the browser when we try to
        // instantiate an outdated Deployment Toolkit. Hence, we just disable the DTK
        // for Chrome to avoid any popups.
        //
        // browser.isChrome


      )  return 1; // Deployment Toolkit is disabled. Do not run it.
       

       return 0;   // DTK is ok


   },   // end of isDisabled()


 // [public]
 // Find the installed Sun/Oracle Java version(s) using the Java Deployment Toolkit Plugin.
 // The DTK is only present assuming you installed JRE 1,6,0,10 or higher.
 // The advantage of the DTK is that Java never has to get started, which means detection
 // should be very fast.
 //   However, the DTK may sometimes cause a popup to occur when Java is out of date.
 // The popup is not generated by the browser. It is generated by the DTK/JRE itself,
 // and hence this popup can occur for both IE and non-IE browsers.
 //   It would be nice if there is a toolkit object for Safari/Mac someday as well.
 //
 // This routine returns the Deployment Toolkit object.
 //
 // What is the lowest JRE that the DTK can detect? It is Sun JRE 1,4,0,0+
 //
 // If instantiate==1/true, then this routine will always attempt to instantiate
 query: function(instantiate){

   var deployTK=this, java=JAVA,
      x, tmp, altHTML=$.DOM.altHTML,
      obj={},
      jvms,
      DOMobj=null,
      len=null,   // len==null means DTK not installed, len!==null means DTK installed
      exit = deployTK.isDisabled(instantiate);


   deployTK.hasRun = 1;
   if (exit) return deployTK;

   deployTK.status=0;

   $.message.write($.message.time(deployTK.query,1), $.message.end());   // Start measuring time delay
   $.message.write("[ ]", $.message.end());
   $.message.write("[ START Java Deployment Toolkit detection ]", $.message.end());


   if ($.DOM.isEnabled.objectTagUsingActiveX())  // Check if <object> tag using ActiveX
   {                                             // can be used

      // This BOUNDARY filters out ActiveX related code
      BOUNDARY("select.pluginCheckbox.java && select.miscCheckbox.allowactivex");

      // There is more than one classid for the DTK.
      // We try each one of them until we get a result.
      for (x=0;x<deployTK.classID.length;x++)
      {
        $.message.write("[ ]", $.message.end());


        // The Deployment toolkit should probably only be used for IE 6+
        deployTK.HTML = $.DOM.insert("object", ["classid", deployTK.classID[x]], [], altHTML);


        DOMobj = deployTK.HTML.obj();               // DTK in the DOM

        // If DTK object gives a result, then we leave this loop.
        // If DTK object does not give a result, then we continue with the loop and
        // try instantiating with another classid.
        if ($.pd.getPROP(DOMobj,"jvms")){ break; }

        else{}


        $.message.write("[ Deployment Toolkit with classid \"" +
            deployTK.classID[x] + "\" is not working ]", $.message.end());

      } // loop


      BOUNDARY("select.pluginCheckbox.java");

   }

   // Else we look for mimetypes in the navigator.mimeTypes[] array.
   // Deployment Toolkit should only be instantiated if the mimetype exists.
   else
   {
     tmp=$.hasMimeType(deployTK.mimeType);
     if (tmp && tmp.type)
     {
       deployTK.HTML = $.DOM.insert("object", ["type", tmp.type], [], altHTML);   // DTK HTML object
       DOMobj = deployTK.HTML.obj();  // DTK in the DOM
     }

   }

   $.message.write("[ ]", $.message.end());

   if (DOMobj)
   {

       BOUNDARY("select.pluginCheckbox.java && select.methodCheckbox.getinfo");

       try{

         // if java.info.getPlugin2Status() == -1, 0, +1 then set the value here,
         // because DTK is more reliable than navigator array in finding Plugin2 status.
         //
         // Update: If DTK says Plugin2 == true, then we can be certain that is correct.
         // If DTK says Plugin2 == false, then we CANNOT be completely certain that is
         // correct. Why? If the DTK is much older than the JRE, it may simply not
         // be able to correctly determine Plugin status.
         // This problem is not so likely to occur for IE, more likely for non-IE browsers.
         //
         // deployTK.Plugin2Status == true : Java Plugin2 was detected
         // deployTK.Plugin2Status == false : Java Plugin2 was not detected, which means either
         //    Plugin2 is really not present, or it is present but was not detected.
         if (Math.abs(java.info.getPlugin2Status())<2) deployTK.Plugin2Status = DOMobj.isPlugin2();

       }
       catch(e){
          $.message.write(["[ Deployment Toolkit.isPlugin2( ) method does not run ] ", e], $.message.end())
       }


       if (deployTK.Plugin2Status!==null)
       {

          if (deployTK.Plugin2Status) java.info.setPlugin2Status(2)

          // When deployTK.Plugin2Status is false, it means either that there is no Plugin2,
          // or that the DTK simply cannot detect Plugin2.
          //
          // For ActiveX based browsers (IE), we will simply trust what the DTK says.
          //
          // For non-IE browsers, it is possible that an outdated DTK is being used by
          //  the browser, and it simply cannot detect the Plugin status.
          // Or, should we simply trust the DTK always?
          else if ($.DOM.isEnabled.objectTagUsingActiveX() || 
             java.info.getPlugin2Status()<=0) java.info.setPlugin2Status(-2);
          
          // if java.info.getPlugin2Status()==1 but deployTK.Plugin2Status is 0/false,
          // then we will leave the Plugin2 Status as is.

       
          $.message.write("[ Java is Plugin2 (according to Deployment Toolkit): " +
              (deployTK.Plugin2Status ? "yes" : "no") + " ] ", $.message.end());

       }


       BOUNDARY("select.pluginCheckbox.java");

       try{

          jvms = $.pd.getPROP(DOMobj,"jvms");
          if (jvms)
          {
             // When we updated to Firefox 3.0.11 with JRE 1,6,0,2 & 1,6,0,10
             // the browser would crash with PluginDetect.
             // Apparently, using DOMobj.jvms.get().version repeatedly may cause
             // the browser to hang.
             // On the other hand, when I define jvms=DOMobj.jvms and then only
             // use jvms.get().version then everything works fine.
             // Seems to be a browser/deployTK bug.
             // So, we need to be more careful here when querying the deployTK plugin.


             len = jvms.getLength();   // get # of installed Sun JRE's
             if ($.isNum(len))         // If one or more JRE's are found, then store the results
             {
                // len>0 means status=1, len==0 means status -1
                deployTK.status = len > 0 ? 1 : -1;

                for (x=0;x<len;x++)
                {
                  // The Deployment Toolkit sorts the version numbers from lowest to highest.
                  // But we fill the deployTK.VERSIONS[] array from highest to lowest.

                  tmp = $.getNum(jvms.get(len-1-x).version);

                  // For the time being, we do not format the version numbers in the array
                  if (tmp){ 
                    deployTK.VERSIONS.push(tmp);
                    obj["a"+$.formatNum(tmp)]=1;
                  }

                }
             }

          }

       }catch(e){
          $.message.write(["[ Deployment Toolkit: Unable to query? ] ", e], $.message.end())
       }


       // Consistency check.
       // If 2 or more of the same versions are repeated, then we have some kind
       // of error (DTK not compatible with browser?). 
       // So, we ignore all the versions detected by the Deployment Toolkit.
       // This practically never should happen.
       // However, in Safari 5.1/WindowsXP, with JRE 1,6,0,31 & 1,6,0,14
       // the DTK reported 1,6,0,14 twice. So, it is remotely possible for the DTK to
       // be wrong sometimes. Perhaps DTK is not compatible with Safari/Windows.
       //
       // Update: we do not bother with this consistency check. 
       // DTK is compatible with IE, and other browsers.
       // And we rarely if ever will need to run DTK for non-IE browsers anyway.
       // So we comment out this code.
/*
       tmp=0;
       for (x in obj){if (obj[x]==1 && (/^a/).test(x)) tmp++}
       if (tmp && tmp!==deployTK.VERSIONS.length)
       {
          $.message.write("[ Potential problem with Deployment Toolkit. Will ignore DTK results. ]", $.message.end());
          deployTK.VERSIONS=[];
       }
*/

       // deployTK.version only looks at the highest version.
       if (deployTK.VERSIONS.length) deployTK.version = $.formatNum(deployTK.VERSIONS[0]);

   }   // end "if (DOMobj)"
   


   $.message.write(["[ Java versions detected by Deployment Toolkit: " +
      (deployTK.VERSIONS.length ? $.message.args2String(deployTK.VERSIONS) : "none") + " ] "], $.message.end());

   $.message.write("[ END Java Deployment Toolkit detection in " + $.message.time(deployTK.query) +
     ". Toolkit is " +
     (
       (deployTK.status==1 || deployTK.status==-1) ? "installed & enabled" : "not installed/not enabled"
     ) + ". ]", $.message.end());

   $.message.write("[ ]", $.message.end());


   return deployTK;


 }   // end of method query()

},   // ***** end of Deployment ToolKit object *****



// -----------------------------------------------------------------------------------------------


/*
     Return the highest installed JRE version based on "jpi-version" found in the
     navigator.mimeTypes[] array.

    It used to be the case (static versioning) that applets could be
    deployed with specific classids to specify a specific Java version, like so:
      jpi_classid= clsid:CAFEEFAC-0015-0000-0011-ABCDEFFEDCBA
      jpi_mimetype=application/x-java-applet;jpi-version=1.5.0_11
      <object type="application/x-java-applet;jpi-version=1.5.0_11"></object>
      etc...

    See http://java.sun.com/products/plugin/versions.html


    But due to security concerns, now only the highest available Java will run,
    regardless of the users attempt to specify a specific Java version to be used for
    an applet.

    This is one of the reasons we only look at the HIGHEST version shown in the mimetypes array.
    
    To find the highest version, we enumerate the navigator.mimeTypes[i] array and the
    navigator.mimeTypes["..."].enabledPlugin[i] array.
    
    Note: The browser may not allow enumeration of navigator.mimeTypes[i], however,
    due to security/privacy reasons. In which case we fall back on enumerating
    the navigator.mimeTypes["..."].enabledPlugin[i] array.

*/
navMime:{

  // 0 if not run yet
  // 1 if already has run
  hasRun:0,

  // [public]
  // Detected Java jpi mimetype that shows the Java version #
  mimetype: "",

  // [public]
  // Highest detected Java version found from jpi mimetype.
  // "" or "version string"
  version: "",

  // [public]
  mimeObj:0,

  // [public]
  pluginObj:0,


  regexJPI: /^\s*application\/x-java-applet;jpi-version\s*=\s*(\d.*)$/i,

  isDisabled: function(){

    var navMime=this, java=JAVA;

    // We do not bother to exclude any specific browsers here.
    // We strictly use object/feature detection, which is preferable.
    if ( navMime.hasRun ||

         !java.navigator.mimeObj

       ) return 1;


    // I have not ever seen "jpi-version" on any MacPPC browser, nor have
    // I seen it on any IntelMac browsers. So, we do not need to worry
    // about any Rosetta mode stuff on Mac regarding "jpi-version".
    //
    // Update: Safari 3.1/Mac has "jpi-version=..." hence the newer Safari browsers
    // finally reveal the java version without having to start up the Java
    // runtime environment.
    //
    // Update: On Macintosh/Lion Java is not installed by default, but in the
    //  navigator.mimeTypes array they have "application/x-java-applet;jpi-version=1.6.0_24"
    //  and in the plugins array they have
    //  navigator.plugins[x].description: "Displays Java applet content, or a placeholder if Java is not installed."
    //  navigator.plugins[x].name: "Java Applet Plug-in"
    // So, even when Java is not installed, they have a Java jpi-mimetype and a Java plugin object.
    //
    // Thus, Macintosh puts PHONY data into the navigator.mimeTypes and navigator.plugins array.
    // We cannot trust navigator data for Java on Macintosh.



    // Using the jpi-version stuff in the mimetypes array to get the Java version
    // is VERY unreliable on Macintosh.
    // See as an example, https://bugzilla.mozilla.org/show_bug.cgi?id=635880
    // I have had some feedback from Mac users that confirms that the jpi-version stuff
    // has a problem.
    //
    // Oracle's deployJava.js (version from 2011) also looks at the jpi-version
    // to get the plugin version, apparently for ANY platform.
    //
    // To deal with this, we can filter out any plugin object that has the word "placeholder"
    // in it.
    //
    //var regex = /placeholder/i;
    //if ( regex.test(navigator.pluginObj.description || "") ||
    //     regex.test(navigator.pluginObj.name || "") ) return 1;

    // Filter out all Macintoshes?
    //if ($.OS==2) return 1;




    return 0;

  },   // end of isDisabled()


  // Given a mimetype{} Object, check if mimetype matches the "jpi-version",
  // and if so, then save it.
  update: function(mimeObj){

     var navMime=this,

        // We make a very strict assumption here:
        // that mimeObj is not necessarily always an object.
        // So, we test mimeObj to make sure that it is.
        pluginObj = mimeObj ? mimeObj.enabledPlugin : 0,
        
        // Get version number from JPI mimeType, if it exists
        tmp = mimeObj && navMime.regexJPI.test(mimeObj.type || "") ?
               $.formatNum($.getNum(RegExp.$1)) : 0;

     if (tmp && pluginObj && (pluginObj.description || pluginObj.name))
     {
         $.message.write("[ Found mimetype \"" + mimeObj.type + "\" ]", $.message.end());

         // Save the highest jpi version.
         //
         // Blackdown Java in Linux has multiple jpi versions in Linux, even though only a
         // single Java JRE is present. So we only take the highest one.
         //
         // For Windows, having multiple JREs installed does not guarantee multiple JPIs,
         // thus using mimetype to detect multiple JREs is not reliable enough.
         // So we only take the highest one.
         if ($.compareNums(tmp, navMime.version || $.formatNum("0"))>0)
         { 
            navMime.version = tmp;
            $.message.write("[ navMime.version: " + navMime.version + " ]", $.message.end());

            navMime.mimeObj = mimeObj;
            $.message.write("[ navMime.mimeObj: " + navMime.mimeObj + " ]", $.message.end());

            navMime.pluginObj = pluginObj;
            $.message.write("[ navMime.pluginObj: " + navMime.pluginObj + " ]", $.message.end());

            navMime.mimetype = mimeObj.type;
            $.message.write("[ navMime.mimetype: " + navMime.mimetype + " ]", $.message.end());

         }

     }

  },  // end of update()

  // [public]
  // Query navigator.mimeTypes[] array for the Java version.
  // Return the navMime object.
  //
  // ----------
  // https://developer.mozilla.org/en-US/docs/Web/API/NavigatorPlugins.plugins
  // In Firefox 29 and later, enumeration of the navigator.plugins[] array
  // (and the navigator.mimeTypes[] array) may be restricted as a privacy measure.
  // Applications that must check for the presence of a browser plugin
  // should query navigator.plugins[] or navigator.mimeTypes[] by exact name instead of
  // enumerating the navigator.plugins[] array and comparing every plugin's name.
  // This privacy change does not disable any plugins; it just hides some plugin names
  // from enumeration.
  //
  // For Firefox 29, the policy of which plugin names are uncloaked can be changed in the
  // about:config pref "plugins.enumerable_names". The pref's value is a
  // comma-separated list of plugin name prefixes (so the "QuickTime" prefix
  // will match both "QuickTime Plug-in 7.7" and "QuickTime Plug-in 7.7.3").
  // The default pref cloaks all plugin names except Flash, Shockwave
  // (Director), Java, and QuickTime. To cloak *all* plugin names, set the
  // pref to the empty string "". To cloak *no* plugin names, set the pref to
  // magic value "*".
  //
  // Also see Bug 938885 - Fix plugincheck to not use plugin enumeration
  // https://bugzilla.mozilla.org/show_bug.cgi?id=938885
  // ----------
  //
  // Even though Firefox 29+ may not necessarily allow enumeration of 
  // navigator.mimeTypes[i], it may still allow enumeration of
  // navigator.mimeTypes["java mimetype"].enabledPlugin[i].
  // So, we try both methods of enumeration here.
  query: function(){

     var navMime=this, java=JAVA,
       x, y, mimeObj, pluginObj, javaMimeType,

       length, navigatorMimeTypes = navigator.mimeTypes, // try to speed up routine with this
                                                         // since this routine uses a brute force
                                                         // search.
       exit = navMime.isDisabled();

     navMime.hasRun = 1;
     if (exit) return navMime;

     $.message.write($.message.time(navMime.query,1), $.message.end());  // Start measuring time delay
     $.message.write("[ ]", $.message.end());
     $.message.write("[ START Java navigator.mimeTypes[application/x-java-applet;jpi-version=...] search ] ", $.message.end());


     // Note: we are assuming here that the browser allows us to iterate thru the 
     // navigator.mimeTypes[] array. Some browsers may not allow enumeration, 
     // due to privacy/security concerns.
     //
     // We enumerate the mimetypes given by
     // navigator.mimeType[x] where x is a numerical index.
     $.message.write("[ ]", $.message.end());
     $.message.write("[ Enumerating navigator.mimeTypes[i] ]", $.message.end());
     
     // Since we are going to enumerate the navigator.mimeTypes[] array, we make sure that
     // the array has a length property that is a number.
     // Normally, we would never check this, but I no longer consider the
     // mimeTypes array behavior to be reliable.
     // The behavior is not based on any standard, merely convention.
     //
     length = navigatorMimeTypes.length; // save for extra speed in the loop (brute force search)
     if ($.isNum(length))
     {
        for (x=0;x<length;x++)
        {
           // We use try-catch here because we no longer assume that
           // navigator.mimeTypes["..."] is safe to use.
           mimeObj = 0;
           try{mimeObj = navigatorMimeTypes[x]}
           catch(e){}

           navMime.update(mimeObj);

        }   // finished searching thru all mimetypes
     }


     // If no result found, then we enumerate the mimetypes given by
     // navigator.mimeTypes["...."].enabledPlugin[y] where y is a numerical index.
     if (!navMime.version || $.dbug)
     {
        javaMimeType = $.isArray(java.mimeType) ? java.mimeType : [java.mimeType];
        for (x=0;x<javaMimeType.length;x++)
        {
          $.message.write("[ ]", $.message.end());
          $.message.write("[ Enumerating navigator.mimeTypes[\"" + 
             javaMimeType[x] + "\"].enabledPlugin[i] ]", $.message.end());


          // We use try-catch here because we no longer assume that
          // navigator.mimeTypes["..."] is safe to use.
          mimeObj = 0;
          try{mimeObj = navigatorMimeTypes[javaMimeType[x]]}
          catch(e){}

          // We make a very strict assumption here:
          // that navigator.mimeTypes[x] is not necessarily always an object.
          // So, we test mimeObj to make sure that it is.
          pluginObj = mimeObj ? mimeObj.enabledPlugin : 0;

          length = pluginObj ? pluginObj.length : null; // save length for extra speed
          if ($.isNum(length))
          {
             for (y=0;y<length;y++)
             {
                // We use try-catch here because we no longer assume that
                // navigator.plugins[y] is safe to use.
                mimeObj = 0;
                try{mimeObj = pluginObj[y]}
                catch(e){}

                navMime.update(mimeObj);

             }  // y loop
          }

        }  // x loop

     }


     $.message.write("[ ]", $.message.end());
     $.message.write("[ Highest Java version found: " + navMime.version + " ] ", $.message.end());

     $.message.write("[ END Java navigator.mimeTypes[application/x-java-applet;jpi-version=...] search in " +
         $.message.time(navMime.query) + " ] ", $.message.end());
     $.message.write("[ ]", $.message.end());

     return navMime;

  }  // end of query()

},   // end of navMime object



/*

  Get the Java version from the navigator.plugins[] array

*/
navPlugin: {

  // 0 if not run yet
  // 1 if already has run
  hasRun:0,

  // [public]
  version:"",


/*
      navigator.plugins[x] name & description for Sun/Oracle Java on WinXP/Linux


      name(Linux): Java(TM) Plug-in 1.4.2_11-b06
      description: Java(TM) Plug-in 1.4.2_11

      name(Linux): Java(TM) Plug-in 1.5.0_06-b05
      description: Java(TM) Plug-in 1.5.0_06

      name(Linux): Java(TM) Plug-in 1.6.0_18
      description: The next generation Java plug-in for Mozilla browsers.

      name(Linux): Java(TM) Plug-in 1.7.0_03
      description: The next generation Java plug-in for Mozilla browsers.

      name(Linux): Java(TM) Plug-in 1.7.0_05
      description: <a href="http://java.sun.com">Java</a> plug-in for NPAPI-based browsers.

      A.enabledPlugin.name(Linux): Java(TM) Plug-in 10.55.2
      A.enabledPlugin.description: Next Generation Java Plug-in 10.55.2 for Mozilla browsers
      A.enabledPlugin.filename: libnpjp2.so
      A.enabledPlugin.version: 10.55.2
      A.type: application/x-java-applet;jpi-version=1.7.0_55

      A.enabledPlugin.name(Linux): Java(TM) Plug-in 11.5.2
      A.enabledPlugin.description: Next Generation Java Plug-in 11.5.2 for Mozilla browsers
      A.enabledPlugin.filename: libnpjp2.so
      A.enabledPlugin.version: 11.5.2
      A.type: application/x-java-applet;jpi-version=1.8.0_05




      name(WinXP): Java Plug-in
      description: Java Plug-in 1.4.1 for Netscape Navigator (DLL Helper)

      name(WinXP): Java Plug-in
      description: Java Plug-in 1.4.1_03 for Netscape Navigator (DLL Helper)

      name(WinXP): Java Plug-in
      description: Java Plug-in 1.4.2_16 for Netscape Navigator (DLL Helper)

      name(WinXP): Java(TM) 2 Platform Standard Edition 5.0
      description: Java Plug-in 1.5.0 for Netscape Navigator (DLL Helper)

      name(WinXP): Java(TM) 2 Platform Standard Edition 5.0 Update 5
      description: Java Plug-in 1.5.0_05 for Netscape Navigator (DLL Helper)

      name(WinXP): Java(TM) 2 Platform Standard Edition 5.0 Update 7
      description: Java Plug-in 1.5.0_07 for Netscape Navigator (DLL Helper)

      name(WinXP): Java(TM) 2 Platform Standard Edition 5.0 U22
      description: Java Plug-in 1.5.0_22 for Netscape Navigator (DLL Helper)

      name(WinXP): Java(TM) Platform SE 6
      description: Java Plug-in 1.6.0 for Netscape Navigator (DLL Helper)

      name(WinXP): Java(TM) Platform SE 6 U31
      description: Next Generation Java Plug-in 1.6.0_31 for Mozilla browsers


      Note: Beginning with JRE 1,7,0,0 / Windows in the navigator.plugins array, the
      plugin numbering scheme appears to have changed. THE NUMBERS NO LONGER APPEAR TO
      HAVE THE FORMAT 1,A,B,C ON WINDOWS.


      name(WinXP): Java(TM) Platform SE 7
      description: Next Generation Java Plug-in 10.0.0 for Mozilla browsers

      name(WinXP): Java(TM) Platform SE 7 U3
      description: Next Generation Java Plug-in 10.3.0 for Mozilla browsers

      name(WinVista): Java(TM) Platform SE 7 U4
      description: Next Generation Java Plug-in 10.4.0 for Mozilla browsers

      name(WinXP): Java(TM) Platform SE 7 U5
      description: Next Generation Java Plug-in 10.5.0 for Mozilla browsers

      [JRE 7 U6, Beta 12, developer preview version]
      name(WinXP): Java(TM) Platform SE 7 U6
      description: Next Generation Java Plug-in 10.6.2 for Mozilla browsers

      JRE 7 U13
      name(WinXP): Java(TM) Platform SE 7 U13
      description: Next Generation Java Plug-in 10.13.2 for Mozilla browsers

      [JRE 8, Beta 41, developer preview version]
      name(WinXP): Java(TM) Platform SE 8
      description: Next Generation Java Plug-in 11.0.0 for Mozilla browsers

      name(Win7): Java(TM) Platform SE 8 U5
      description: Next Generation Java Plug-in 11.5.2 for Mozilla browsers
      Has mimetype "application/x-java-applet;jpi-version=1.8.0_05"



*/



  // Look at plugin.name, plugin.description.
  // Search for "Java TM Platform #A.#B Update#C", and translate to "1,A,B,C"
  // Search for "Java TM Platform #A.#B U#C", and translate to "1,A,B,C"
  // Search for "Java TM Platform #A.#B", and translate to "1,A,B,0"
  getPlatformNum:function(){
      
      var java=JAVA,
      
        result=0,

        regex = /Java.*TM.*Platform[^\d]*(\d+)[\.,_]?(\d*)\s*U?(?:pdate)?\s*(\d*)/i,

        // Java TM Platform (A)(.)(B) Update(C)
        //
        // findNavPlugin() will use mimetypes[] and plugins[] arrays to match the regex.
        // We do not specify "num:" input because the regex itself already specifies numbers
        pluginObj =
          // {find:, avoid:, num:, mimes:, plugins:}
          $.pd.findNavPlugin({find:regex, mimes:java.mimeType, plugins:1});



      //    pluginObj = {name:"", description:"Java(TM) Platform SE 7"}
      //    pluginObj = {name:"", description:"Java(TM) Platform SE 7.2"}
      //    pluginObj = {name:"", description:"Java(TM) Platform SE 7.00"}
      //    pluginObj = {name:"", description:"Java(TM) Platform SE 7.2 U"}
      //    pluginObj = {name:"", description:"Java(TM) Platform SE 7.2 Update"}
      //    pluginObj = {name:"", description:"Java(TM) Platform SE 7.2 U00"}
      //    pluginObj = {name:"", description:"Java(TM) Platform SE 7.2 Update00"}
      //    pluginObj = {name:"", description:"Java(TM) Platform SE 7.2 U3"}
      //    pluginObj = {name:"", description:"Java(TM) Platform SE 7.2 Update3"}
      //    pluginObj = {name:"", description:"Java(TM) Platform SE 7."}
      //    pluginObj = {name:"", description:"Java(TM) Platform SE 7. U35"}
      //    pluginObj = {name:"", description:"Java(TM) Platform SE 7 U40"}
      //    pluginObj = {name:"", description:"Java(TM) Platform SE 7 k40"}


      if (pluginObj &&
      
            (regex.test(pluginObj.name||"") || regex.test(pluginObj.description||"")) &&

            // As a CONSISTENCY CHECK, we make sure that Platform version >= 5
            parseInt(RegExp.$1, 10)>=5)
            {

               result = "1," + RegExp.$1 + "," +
                 (RegExp.$2 ? RegExp.$2 : "0") + "," +
                 (RegExp.$3 ? RegExp.$3 : "0");

               $.message.write("[ ]", $.message.end());
               $.message.write("[ Java Platform detected in navigator.plugins array, version = " +
                   result + " ] ", $.message.end());
               $.message.write("[ navigator.plugins[x].name: \"" + pluginObj.name + "\" ] ", $.message.end());
               $.message.write("[ navigator.plugins[x].description: \"" + pluginObj.description + "\" ] ", $.message.end());

            }

      return result;

  }, // end of getPlatformNum()



  // Look at plugin.name, plugin.description.
  // Search for "Java" and "Plug-in", and then a version #.
  //
  // A) We search for "Plug-in", not "Plugin"
  // On Firefox-MacIntel, we get
  //     description: Runs Java applets using the latest installed versions of Java. For more information: Java Embedding Plugin. Run version test: Test Your JVM.
  //     name: Java Embedding Plugin 0.9.6
  // Note that 0.9.6 is not the actual version of the Java JRE
  // Since we are searching for "Plug-in" instead of "Plugin" then we
  // will not see that useless version number.
  //
  //
  // B) We allow for the possibility of text between "Java" and "Plug-in",
  // even though there usually is not.
  //
  // In Konqueror/Linux it can appear as
  //     description: "Blackdown Java-Linux Java(TM) Plug-in".
  // Hence we search for  "Java[^\\d]*Plug-in"
  //
  // In Konqueror 3.5, Knoppix 5:
  //     description: Java Plug-in KJAS for Konqueror
  //     name: Java Plug-in
  //     description: Blackdown Java-Linux Java(TM) Plug-in 1.3.1
  //     name: Java(TM) Plug-in Blackdown-1.3.1-FCS
  //
  // C) As a general rule, there are no numbers between "Java" and "Plug-in".
  // So we search for this first: /Java[^\d]*Plug-in/i   and then try to get a number.
  // If that fails, then we search for /Java.*Plug-in/i  and then try to get a number.
  //
  getPluginNum:function(){

      var navPlugin=this, java=JAVA,
          result=0, p1, p2, regex, pluginObj,
          dbug=0;



      // dbug = {name:"", description:"Java Plug-in 10.13.2"}
      // dbug = {name:"", description:"Java Plug-in 11.0.0"}
      // dbug = {name:"", description:"Java Plug-in 1.5.0_05"}
      // dbug = {name:"", description:"Java Plug-in 1.7.0"}
      // dbug = {name:"", description:"Java 1.4.2_11 Plug-in"}



      // As a general rule, the version number occurs only BEFORE/AFTER "Java Plug-in".
      // num1: means we look for a number before/after the match
      // findNavPlugin() will use mimetypes[] and plugins[] arrays to match the regex.
      regex = /Java[^\d]*Plug-in/i;
      pluginObj = $.pd.findNavPlugin({find:regex, num:1, mimes:java.mimeType, plugins:1, dbug:dbug});
      if (pluginObj)
      { 
         // We look for the version # in pluginObj.description and pluginObj.name.
         p1 = navPlugin.checkPluginNum(pluginObj.description, regex);
         p2 = navPlugin.checkPluginNum(pluginObj.name, regex);
         
         // Take highest number
         result = p1 && p2 ? ($.compareNums(p1, p2) > 0 ? p1 : p2) : (p1 || p2);
      }



      // If no result, then try one more time, but this time we allow for
      // a number IN BETWEEN "Java" and "Plugin".
      // This should be very rare, I've only seen it in one case.
      //
      // On Mac OS X 10.3  (Mac PPC), we found the following...
      // name: Java Plug-in for Cocoa
      // description: Java 1.4.2_11 Plug-in (Cocoa)
      if (!result)
      {
         // The regex looks for a number.
         // num: undefined, so we do NOT bother looking for a number before/after the match
         // findNavPlugin() will use mimetypes[] and plugins[] arrays to match the regex.
         regex = /Java.*\d.*Plug-in/i;
         pluginObj = $.pd.findNavPlugin({find:regex, mimes:java.mimeType, plugins:1, dbug:dbug});
         if (pluginObj)
         {
            // We look for the version # in pluginObj.description and pluginObj.name.
            p1 = navPlugin.checkPluginNum(pluginObj.description, regex);
            p2 = navPlugin.checkPluginNum(pluginObj.name, regex);

            // Take highest number
            result = p1 && p2 ? ($.compareNums(p1, p2) > 0 ? p1 : p2) : (p1 || p2); // Take highest number
         }
      }


      $.message.write(result ? "[ ]" : 0, $.message.end());
      $.message.write(result ? "[ Java Plug-in detected in navigator.plugins array, version = " +
          result + " ] " : 0, $.message.end());
      $.message.write(result && pluginObj ? "[ navigator.plugins[x].name: \"" +
          pluginObj.name + "\" ] " : 0, $.message.end());
      $.message.write(result && pluginObj ? "[ navigator.plugins[x].description: \"" +
          pluginObj.description + "\" ] " : 0, $.message.end());


      return result;


  },  // end of getPluginNum()


  checkPluginNum:function(str, regex){

      var result, tmp;


      result = regex.test(str) ? $.formatNum($.getNum(str)) : 0;


      // Suppose we have the format "A,B,C,0" where A>=10.
      // We convert this to the format "1,A-3,0,B"
      //
      // We perform this conversion because JRE 1,7,0,0 / Windows has changed the 
      // Plugin version number format.
      //
      // Example:
      //    name(WinXP): Java(TM) Platform SE 7
      //    description: Next Generation Java Plug-in 10.0.0 for Mozilla browsers
      //
      //    JRE 7 U13
      //    name(WinXP): Java(TM) Platform SE 7 U13
      //    description: Next Generation Java Plug-in 10.13.2 for Mozilla browsers
      //
      //    [JRE 8, Beta 41, developer preview version]
      //    name(WinXP): Java(TM) Platform SE 8
      //    description: Next Generation Java Plug-in 11.0.0 for Mozilla browsers
      if (result && $.compareNums(result, $.formatNum("10"))>=0)
      {
             tmp = result.split($.splitNumRegx);
             result = $.formatNum("1," + (parseInt(tmp[0],10)-3) + ",0," + tmp[1]);
      }



      // VERSION # CHECK
      // Valid version strings have the format "1,A,B,C" where A>=3
      //
      // Also, on Mac OSX, they can have "Java Plug-in 2" for Next Generation Java Plugin2.
      // The "2" here refers to the Next Generation Java, not the Java version.
      //
      // Note: what happens after 1,9,0,0? Do they go to 2,0,0,0 or 1,10,0,0?
      //
      // So for now, we expect 1,A,B,C where A>=3
      // If p1<1,3,0,0 or p1>=2,0,0,0 then set p1=0
      // If p2<1,3,0,0 or p2>=2,0,0,0 then set p2=0
      //


      //alert("p1: " + p1 + "\np2: " + p2)

      if (result &&
           ($.compareNums(result, 
             $.formatNum("1,3"))<0 || $.compareNums(result, $.formatNum("2"))>=0)
          ) result=0;

      return result;

  }, // end of checkPluginNum()


  // [public]
  query:function(){

     var navPlugin=this, java=JAVA,
         tmp, version=0,
         exit = navPlugin.hasRun || !java.navigator.mimeObj;

     navPlugin.hasRun = 1;
     if (exit) return navPlugin;

     $.message.write($.message.time(navPlugin.query,1), $.message.end());  // Start measuring time delay
     $.message.write("[ ]", $.message.end());
     $.message.write("[ START Java navigator.plugins[ ] search ]", $.message.end());


     // Get Platform version
     if (!version || $.dbug)
     {
          tmp = navPlugin.getPlatformNum();
          if (tmp) version = tmp;
     }

     // Get Plugin version
     if (!version || $.dbug)
     {
          tmp = navPlugin.getPluginNum();
          if (tmp) version = tmp;
     }


     if (version) navPlugin.version=$.formatNum(version);

     $.message.write("[ ]", $.message.end());
     $.message.write("[ END Java navigator.plugins[ ] search in " +
        $.message.time(navPlugin.query) + " ]", $.message.end());
     $.message.write("[ ]", $.message.end());

     return navPlugin;


  }  // end of query()

  
},    // end of navPlugin object


// -----------------------------------------------------------------------------------------------



// *****  Begin applet object *****

applet:{

  // This BOUNDARY filters out codebase{} related code, which depends on ActiveX
  BOUNDARY0: "select.pluginCheckbox.java && select.miscCheckbox.allowactivex",

  // Search the IE codebase to get the plugin version, using a Java applet.
  // This works for Java JRE 1,2,2,7 and higher.
  codebase: {

    // We use the "checkInstalledFirst" input arg to make the routine check if the plugin
    // is installed first, using only ONE attempted instantiation. If not installed, 
    // then detection ends. If it is installed, then the routine continues with more 
    // attempted instantiations.
    // We do this in case EACH codebase instantiation creates a separate security
    // popup. In this case, if the user blocks the first attempted instantiation, then the
    // detection is over and no further instantiations/popups from this routine will occur.
    isMin:function(minVersion, checkInstalledFirst){
      this.$$ = JAVA;
      return $.codebase.isMin(this, minVersion, checkInstalledFirst);
    },
    
    search:function(checkInstalledFirst){
      this.$$ = JAVA;
      return $.codebase.search(this, checkInstalledFirst);
    },

    // Note: we add the "code" param here, because I 
    // have noticed a browser crash in IE 7,8 for JRE 1,4,2,19 without it.
    // It seems that the "code" parameter makes things run more smoothly, even
    // though IE will never even try to download the dummy class file, since
    // the codebase detection method uses style="display:none;" for the <object> tag.
    ParamTags:  "<param name=\"code\" value=\"A9999.class\" />" +

                // http://java.sun.com/javase/6/docs/technotes/guides/plugin/developer_guide/special_attributes.html#specialattributes
                "<param name=\"codebase_lookup\" value=\"false\" />",



    // DIGITMAX[x] specifies the max value that each digit of codebase version can have.
    // Given DIGITMAX[x] == [A,B,C,D] the maximum allowed codebase is A,B,C,D.
    //
    // The length of DIGITMAX[] is the same as length of Lower[].
    //
    // if DIGITMAX[x] == 0, then it corresponds to a non-existent codebase
    // between Lower[x] and Upper[x].
    //
    DIGITMAX:[ 
    
        // Codebase Range: 10,0,0,0+
        // JRE Range:      1,7,0,0+
        //
        // JRE 1,7,0,0  -> Codebase 10,0,0,0
        // JRE 1,7,0,10 -> Codebase 10,10,0,0
        // JRE 1,7,0,55 -> Codebase 10,55,0,0
        // JRE 1,7,0,65 -> Codebase 10,65,0,0
        // Note: because JRE 1,7,0,65 exists we let the
        // last digit be 128 instead of 64.
        //
        // JRE 1,8,0,5  -> Codebase 11,5,0,0
        // JRE 1,9,0,0  -> Codebase 12,0,0,0
        // JRE 1,12,0,0 -> Codebase 15,0,0,0
        [15,128],
    
        // Codebase Range: 5,0,20,0 - 10,0,0,0
        // JRE Range:      1,5,0,2 - 7,0,0,0
        //
        // JRE 1,6,0,37 -> Codebase 6,0,370,0
        // JRE 1,5,0,22 -> Codebase 5,0,220,0
        [6,0,512],

        // Codebase Range: 1,5,0,20 - 5,0,20,0
        0,

        // Codebase Range: 1,4,1,20 - 1,5,0,20
        // JRE Range:      1,4,1,2  - 1,5,0,2
        //
        // JRE 1,5,0,1 -> Codebase 1,5,0,10
        // Digit 1 is 5
        //
        // JRE 1,4,2,19 -> Codebase 1,4,2,190
        // Digit 3 is 190, so we choose 2^N > 190 which is 256
        // Digit 2 is 2
        //
        // JRE 1,4,1,7  -> Codebase 1,4,1,70
        [1,5,2,256],

        // Codebase Range: 1,4,1,2 - 1,4,1,20
        0,
        
        // Codebase Range: 1,4,1,0 - 1,4,1,2
        // JRE Range:      1,4,1,0 - 1,4,1,2
        //
        // JRE 1,4,1,1  -> Codebase 1,4,1,1
        // JRE 1,4,1,0  -> Codebase 1,4,1,0
        [1,4,1,1],

        // Codebase Range: 1,4,0,0 - 1,4,1,0
        // JRE Range:      1,4,0,0 - 1,4,1,0
        //
        // JRE 1,4,0,4  -> Codebase 1,4,0,40
        [1,4,0,64],

        // Codebase Range: 0,0,0,0 - 1,4,0,0
        // JRE Range:      0,0,0,0 - 1,4,0,0
        //
        // JRE 1,3,1,28 -> Codebase 1,3,1,28
        // Digit 3 is 28, so we choose 2^N > 28 which is 32
        //
        // JRE 1,3,0,5  -> Codebase 1,3,0,5
        // JRE 1,2,2,17 -> Codebase 1,2,2,17
        [1,3,2,32]

        ],


    // Min value for each digit
    DIGITMIN: [1,0,0,0],



   // These 2 arrays contain codebase version numbers.
   // They help to convert codebase version numbers to their
   // corresponding plugin version numbers.
   //
   // The rules for these 2 arrays are:
   //  1) Upper[0] is the highest codebase number you ever expect to encounter
   //  2) The last item in Lower[] is always "0"
   //  3) Upper[] is arranged in descending order
   //  4) Lower[] is arranged in descending order
   //  5) Lower[x] == Upper[x+1]
   //  6) The strings in Upper[x],Lower[x] do not have to be formatted.
   //     They are automatically formatted when they are used.
   //  7) Lower[x]<= codebase[x] < Upper[x] corresponds to convert[x]
   //  8) One and only one codebase number is allowed to map to
   //      any given plugin version number. This is IMPORTANT.
   //      When needed, set convert[x]==0 to accomplish this.
   //
   //
   Upper: ["999", "10",     "5,0,20",   "1,5,0,20", "1,4,1,20", "1,4,1,2", "1,4,1", "1,4"],
   Lower: ["10",  "5,0,20", "1,5,0,20", "1,4,1,20", "1,4,1,2",  "1,4,1",   "1,4",   "0"],



   // The codebase detection technique seems to make IE try to connect with
   // activex.microsoft.com/objects/ocget.dll
   // There does not appear to be any way to prevent this from happening.
   // See http://support.microsoft.com/kb/323207
   //
   // Update: this may no longer be true. The codebase technique no
   // longer inserts anything into the DOM. Need to retest to see if
   // this still happens.



   // Convert plugin version to/from codebase number.
   // convert[x] is used to convert plugin version to/from codebase number, where
   //   Lower[x] <= codebase[x] number <= Upper[x]
   // This array has the same length as Upper[], Lower[].
   //
   // convert[x] == 1 means that codebase[x] ( == A.B.C.D) == plugin version A.B.C.D.
   // convert[x] == 0 means that codebase[x] does not have a corresponding plugin version,
   //     where  Lower[x]<= codebase[x] < Upper[x].
   //
   // if toCodebase, then convert to codebase number.
   // if !toCodebase, then convert to plugin version number.
   convert: [

     // Codebase Range: 10,0,0,0+
     // JRE Range:      1,7,0,0+
     function(p, toCodebase)
     {   return toCodebase ?

         // version "1,7,0,0"  to codebase "10,0,0,0"
         // version "1,7,0,9"  to codebase "10,9,0,0"
         // version "1,8,0,0"  to codebase "11,0,0,0"
         // version "1,9,0,0"  to codebase "12,0,0,0"
         // version "1,10,0,0" to codebase "13,0,0,0"
         // version "1,11,0,0" to codebase "14,0,0,0"
         // version "2,0,0,0"  to codebase "99,0,0,0"
         // version "3,0,0,0"  to codebase "99,0,0,0"
         [parseInt(p[0],10)>1 ? "99" : parseInt(p[1],10)+3+"", p[3], "0", "0"] :
         
         // codebase "10,9,0,0" to version "1,7,0,9"
         ["1", parseInt(p[0],10)-3+"", "0", p[1]]
     },

     // Codebase Range: 5,0,20,0 - 10,0,0,0
     // JRE Range:      1,5,0,2 - 7,0,0,0
     function(p, toCodebase)
     {   return toCodebase ?
         
         // version "1,5,0,2" to codebase "5,0,20,0"
         // version "1,6,0,35" to codebase "6,0,350,0"
         [p[1], p[2], p[3]+"0", "0"] :
         
         // codebase "5,0,20,0" to version "1,5,0,2"
         // codebase "6,0,350,0" to version "1,6,0,35"
         //
         // p[2] usually has length>=2
         // So we remove the last character of p[2]
         // Except if p[2]=="0", then we do not remove anything.
         // For example p==["6","0","0","0"]
         ["1", p[0], p[1], p[2].substring(0,p[2].length-1||1)]
     },
     
     // Codebase Range: 1,5,0,20 - 5,0,20,0
     0,

     // Codebase Range: 1,4,1,20 - 1,5,0,20
     // JRE Range:      1,4,1,2  - 1,5,0,2
     function(p, toCodebase)
     {   return toCodebase ?

         // version "1,4,1,2" to codebase "1,4,1,20"
         // version "1,5,0,1" to codebase "1,5,0,10"
         [p[0], p[1], p[2], p[3]+"0"] :
         
         // codebase "1,4,1,20" to version "1,4,1,2"
         // codebase "1,5,0,10" to version "1,5,0,1"
         //
         // p[3] usually has length>=2
         // So we remove the last character of p[3]
         // Except if p[3]=="0", then we do not remove anything.
         [p[0], p[1], p[2], p[3].substring(0,p[3].length-1||1)]
     },

     // Codebase Range: 1,4,1,2 - 1,4,1,20
     0,
     
     // Codebase Range: 1,4,1,0 - 1,4,1,2
     // JRE Range:      1,4,1,0 - 1,4,1,2
     1,

     // Codebase Range: 1,4,0,0 - 1,4,1,0
     // JRE Range:      1,4,0,0 - 1,4,1,0
     function(p, toCodebase)
     {   return toCodebase ?
         
         // version "1,4,0,4" to codebase "1,4,0,40"
         [p[0], p[1], p[2], p[3]+"0"] :
         
         // codebase "1,4,0,40" to version "1,4,0,4"
         //
         // p[3] usually has length>=2
         // So we remove the last character of p[3]
         // Except if p[3]=="0", then we do not remove anything.
         [p[0], p[1], p[2], p[3].substring(0,p[3].length-1||1)]
     },

     // Codebase Range: 0,0,0,0 - 1,4,0,0
     // JRE Range:      0,0,0,0 - 1,4,0,0
     1

   ] // end of convert[]


  },  // end of codebase{}


  BOUNDARY1: "select.pluginCheckbox.java",


   // Query results for applet 0, applet1, applet2, applet3.
   //
   // Note: Applet 0 use the codebase detection method, and does not use
   // the Javascript/Java bridge.
   // Applets 1,2,3 use the normal applet insert into DOM & query method. This uses
   // the Javascript/Java bridge.
   //
   // We intentionally initialize this with "null" values.
   // If there is anything other than null (ie. 0 or string) then detection has been
   // attempted. If there is a string version, then detection was successful.
   //
   // results[0] is Java detection result for <object> tag (IE browser only) using
   //     codebase technique (ActiveX).
   // results[1] is Java detection result for <object> tag (all browsers).
   // results[2] is Java detection result for <applet> tag (all browsers).
   // results[3] is Java detection result for <object> tag (IE browser only) using ActiveX.
   // results[4] is Java detection result for <embed> tag (all browsers)
   results: [[null,null], [null,null], [null,null], [null,null], [null,null]],


   // Tells us which Java applet is Active and running in the applet.HTML array.
   //
   // applet.active[x]>0  if applet.HTML[x] appears to be active.
   // applet.active[x]==0 if unsure whether applet.HTML[x] is active, not enough info available.
   // applet.active[x]<0  if applet.HTML[x] is unable to run.
   //
   // The following values are based on the return values of $.DOM.getTagStatus(),
   // except for the value "2", which we added here:
   //
   // == 2 if plugin is active, and the Java/Javascript bridge is active and working.
   //    This is based on a Java applet actually being queried.
   // == 1.5 (IE only) if "object" property exists for the HTML tag for the plugin,
   //     and is an object, hence the plugin is active.
   // == 1 if plugin appears to be active. This is based on the width of various tags.
   // == 0 if unsure about plugin status.
   // == -1 if altHTML (text) is being displayed.
   //   This means that the plugin is not installed or disabled.
   // == -2 if applet.HTML[x] is empty (no text, no plugin object).
   active: [0, 0, 0, 0, 0],


   // Arrays save the applet Number (ID) to show which applet is responsible
   // for the data received.
   //
   // Ex. If Applet # N sends data via JAVAtoJS communication, then we save "N" in
   // the IDforJAVAtoJS[] array, etc...
   IDforJAVAtoJS: [],
   IDforJStoJAVA: [],


   // *** EVENT HANDLER
   //
   // Given data from Java applet N, we save the data to applet.results[N]
   // and applet.active[N].
   //
   //   This routine can be called either by a Java applet directly (Java to Javascript communication,
   // or JAVAtoJS), or by another Javascript routine.
   //   If called by a Javascript routine, then that particular Javascript routine queries the 
   // Java applet directly(JStoJAVA communication), and then passes that data into this routine.
   //   If called by a Java applet, then that applet uses routineName.call() in order to
   // properly set the "this" keyword for this routine.
   //
   //   The disadvantage that Javascript to Java (JStoJAVA) communication has, at least for a
   // signed applet, is that Java may give a security popup message saying that the website
   // is trying to control the applet.
   //   However, JAVAtoJS communication (at least for a signed applet) does NOT appear to
   // give us this popup message.
   //   So, we may prefer JAVAtoJS over JStoJAVA for reasons of user friendliness.
   //
   //
   // @N = applet number
   //   should be a string if called by a Java applet
   //   should be a number if called by Javascript
   //   Should be integer > 0
   // @JStoJava = 1 if Javascript has queried the Java applet to get the data,
   //   else is 0/undefined if Java applet is calling this Javascript routine directly.
   // @version = java version data received from applet or Javascript routine
   // @vendor = java vendor data received
   // @isPlugin2 = true (boolean) or "true" (string) if Java installed and Java runtime is Plugin2.
   //            = false (boolean) or "false" (string) if Java installed and Java runtime is NOT Plugin2.
   // @data2 = extra data input
   //
   //
   // @N, @version, @vendor may not have the correct data or format.
   // Return 1 if data successfully saved.
   // Return 0 is unable to save data (bad data, or applet.results[] already has data)
   //
   // The "this" keyword will NOT be used in this routine.
   // It can be called by a Java applet, which in our case will not set the "this" keyword.
   saveData:function(N, JStoJava, version, vendor, isPlugin2, data2){

       var java=JAVA,
         applet=java.applet,
         result = 0,
         N1=-1, version1="", vendor1="";


       try{N1 = parseInt(N + "", 10);}
       catch(e){}


       try{
          // We use $.getNum() here because it is possible for the version
          // to have letters.
          // ie. JRE 1,7,0,6 beta 12 gives "1.7.0-06-ea" for DOMobj.getVersion()
          // so the $.getNum() will remove the letters.
          version1 = $.getNum(version + "");  // add "" to convert to string
       }catch(e){}

       // At this point, version1 is either "" or "string number" or null
       

       try{
          vendor1 = vendor + "";  // add "" to convert to string
       }catch(e){}
       // At this point, vendor1 is a string. The string may or may not be empty.


       isPlugin2 = (isPlugin2==="true" ? true : (isPlugin2==="false" ? false : isPlugin2));


       $.message.write("[ ]", $.message.end());
       $.message.write("[ " +
          (JStoJava ? "(JStoJAVA) Javascript has queried Java applet # " + N1 + " " :
           "(JAVAtoJS) Java applet # " + N1 + " has sent data to Javascript") +
           " ]", $.message.end());



       if (N1<=0 || N1>=applet.results.length || applet.results[N1][0])
       {  // unsuccessful save
       }

       // At this point, N1 is an integer >= 0.
       // At this point, applet.results[N1] has no useful data.


       // else if one or both bridges are disabled,
       else if ((JStoJava && !java.JSTOJAVABRIDGE) ||
           (!JStoJava && !java.JAVATOJSBRIDGE))
       {
            // unsuccessful save

            $.message.write(!java.JAVATOJSBRIDGE ? "[ (JAVAtoJS) Java applet # " + 
              N1 + ": " + " data will NOT be saved because JAVA to JS bridge is disabled ]" : 0, $.message.end());
       
            $.message.write(!java.JSTOJAVABRIDGE ? "[ (JStoJAVA) Java applet # " +
              N1 + ": " + " data will NOT be saved because JS to JAVA bridge is disabled ]" : 0, $.message.end());

       }


       // We specifically need to check that version1 is a string that contains a number
       // because we cannot assume that that the applet will give data in the correct format.
       else if (!$.isStrNum(version1) ||

            // In Java debug mode, we do NOT save this result during OTF detection.
            // This will force NOTF detection to begin.
            //  This way, we insure that NOTF Java detection will occur in debug mode.
            //  We save the result for NOTF detection in Java debug mode.
            ($.dbug && java.OTF<3)

        ){ // unsuccessful save

        }
        
        else
        { // successful save
        
          // *** Important Note: we do NOT use...
          //    applet.results[N1] = [version1, vendor1];
          // because this generates a NEW array for applet.results[N1].
          // We want to keep the SAME array. Hence we use
          // the code shown below...
          applet.results[N1][0] = version1;
          applet.results[N1][1] = vendor1;
          applet.results[N1][2] = isPlugin2;
          if (data2) applet.results[N1][3] = data2;



          // isPlugin2 stuff
          BOUNDARY("select.pluginCheckbox.java && select.methodCheckbox.getinfo");
          
          // We do not bother checking the value of java.info.Plugin2Status here,
          // because a Java applet is the highest authority as to whether
          // Plugin2 is true or false. It overrides the values of Plugin2Status
          // derived from the Deployment Toolkit/Navigator array/deduction.
          if (isPlugin2===true){
            java.info.setPlugin2Status(3); 
          }

          if (isPlugin2===false){
            java.info.setPlugin2Status(-3); 
          }

          BOUNDARY("select.pluginCheckbox.java");



          // Java applet is active, and the Java/Javascript bridge is working.
          applet.active[N1] = 2;
          
          if (JStoJava){
              applet.IDforJStoJAVA.push(N1);  // Save the appletNum for JStoJava.
          }

          else
          {
              applet.IDforJAVAtoJS.push(N1);  // Save the appletNum for JavatoJS.
         

              // If we are not in debug mode, and the
              // JAVATOJSBRIDGE is active/allowed, then...
              //   We disable JStoJava, since we now know
              // that JavaToJS works and because we
              // prefer to get our data via JavaToJs.
              // This preference is due to the fact that for signed
              // Java applets, a Javascript to Java applet communication
              // may cause an additional security popup message to be
              // generated by the JRE. We try to avoid this additional
              // popup when possible.
              if (!$.dbug && java.JAVATOJSBRIDGE) java.JSTOJAVABRIDGE = 0;
          
          }


          result = 1;
       }


       $.message.write("[ (" + (JStoJava ? "JStoJAVA" : "JAVAtoJS") + ") Java applet # " + N1 + ": " + 
          (result ? "saving data from Java applet" : "data from applet NOT saved") + 
          " ]", $.message.end());
       $.message.write("[ (" + (JStoJava ? "JStoJAVA" : "JAVAtoJS") + ") Java applet # " + N1 + ": version = " + version1 + " ]", $.message.end());
       $.message.write("[ (" + (JStoJava ? "JStoJAVA" : "JAVAtoJS") + ") Java applet # " + N1 + ": vendor = " + vendor1 + " ]", $.message.end());
       $.message.write("[ (" + (JStoJava ? "JStoJAVA" : "JAVAtoJS") + ") Java applet # " + N1 + ": isPlugin2 = " + isPlugin2 + " ]", $.message.end());

       $.message.write("[ ]", $.message.end());


       return result;

   }, // end of saveData()



   // Return results from any applet detection method.
   //
   // applet.results[0] holds the results from the codebase detection.
   // We check that LAST because it is an experimental detection method,
   // and there is no guarantee that the algorithm used to translate a codebase
   // version to a plugin version will always be the same for future Java releases.
   // They may release a Java in the future that requires a different algorithm
   // from the one that is currently being used.
   // The results from applet.results[x>0] are to be considered more reliable.
   // Also,   applet.results[0] = [version, null]
   // and     applet.results[x>0] = [version, vendor]
   getResult: function(){

     var applet=this, queryResult=applet.results, x, R=[];
     for (x=queryResult.length-1;x>=0;x--){
       R = queryResult[x];
       if (R[0]) break;
     }

     // Note: we return a copy of results array, not the
     // results array itself.
     R = [].concat(R);

     return R;


   }, // end of getResult()


   // HTML object for dummy <span> tag
   // <span>altHTML</span>
   // Instantiated BEFORE applet.HTML[]
   DummySpanTagHTML: 0,

   // [** PUBLIC **]
   //
   // HTML[0] is the HTML object for Java applet 0
   // HTML[1] is the HTML object for Java applet 1
   // HTML[2] is the HTML object for Java applet 2
   // HTML[3] is the HTML object for Java applet 0
   // HTML[4] is the HTML object for Java applet 0
   //
   // An HTML object allows us to access a DOM object, its span container, etc...
   HTML: [0, 0, 0, 0, 0],

   // HTML object for dummy <object> tag
   // <span><object type="dummyMimeType">altHTML</object></span>
   // Instantiated AFTER applet.HTML[]
   DummyObjTagHTML: 0,

   // HTML object for dummy <object> tag
   // <span><object classid="clsid:xxxxxxxx">altHTML</object></span>
   // Instantiated AFTER applet.HTML[]
   DummyObjTagHTML2: 0,


   // Tells us when to instantiate applet 0, applet 1, applet 2.
   // The rules governing the instantiations are found in applet.should_Insert_Query()
   //
   // If allowed[x]==3 then we always try to instantiate/query applet[x],
   //   regardless of whether non-applet methods gave any result,
   //   and regardless of whether any other applets gave any result.
   //
   // If allowed[x]==2.8 and no other applets gave any result, then we
   // try to instantiate/query applet[x].
   //
   // If allowed[x]==2 then we try to instantiate/query applet[x] when
   //   (the non-applet methods (java.version0) gave no result) ||
   //   navigator.javaEnabled()==false || $.browser.ActiveXEnabled==false.
   //
   // If allowed[x]==1 then we try to instantiate/query applet[x] when
   //   (the non-applet methods (java.version0) gave no result &&
   //    the other applet methods gave no result) ||
   //    navigator.javaEnabled()==false || $.browser.ActiveXEnabled==false
   //
   // If allowed[x]==0 then we never try to instantiate applet[x].
   //
   // The value shown below is the default that is used if the user
   // does not specify anything for the verifyTags array.
   // If the user does specify the verifyTags array, then it is stored in
   // the allowed[] array.
   allowed: [1, 1, 1, 1, 1],

   // Given input 'a'
   // If VerifyTags contains the value 'a', then return 1
   // Else return 0
   VerifyTagsHas: function(a){
      var applet=this, x;
      for (x=0;x<applet.allowed.length;x++){
         if (applet.allowed[x]===a) return 1;
      }
      return 0;
   },

   // Save the verifyTags[] array in the applet.allowed[] array.
   //
   // Note:
   //   applet.allowed[1] = verifyTags[0]
   //   applet.allowed[2] = verifyTags[1]
   //   applet.allowed[3] = verifyTags[2]
   //   applet.allowed[0] = applet.allowed[3]
   //
   //   applet.allowed[0] refers to the codebase detection method, using <object> tag ActiveX
   //   applet.allowed[1] refers to <object> tag
   //   applet.allowed[2] refers to <applet> tag
   //   applet.allowed[3] refers to <object> tag with ActiveX
   //
   // We should not assume that the input verifyTags has the correct length.
   saveAsVerifyTagsArray: function(verifyTags){

     var applet=this, x;
     if ($.isArray(verifyTags))
     {
       for (x=1;x<applet.allowed.length;x++)
       {
          if (verifyTags.length>x-1 && $.isNum(verifyTags[x-1]))
          {
             if (verifyTags[x-1]<0) verifyTags[x-1]=0;
             if (verifyTags[x-1]>3) verifyTags[x-1]=3;

             applet.allowed[x]=verifyTags[x-1];

           }
       
       }
       applet.allowed[0] = applet.allowed[3];
       
       $.message.write("[ Setting verifyTags[" + $.message.args2String(verifyTags) + "] ]", $.message.end());
       $.message.write("[ Setting applet.allowed[" + $.message.args2String(applet.allowed) + "] ]", $.message.end());

     }

   },
   

// Set the value of the verifyTagsArray
//
// verifyTagsArray will determine when PluginDetect can/should start the Java plugin
// using both <applet> and <object> tags. We do not bother with <embed> tags.
//
// For Internet Explorer, we can instantiate Java with:
//   <object> tag without any ActiveX
//   <applet> tag
//   <object> tag with ActiveX classid
//
// For non-Internet Explorer browsers, we instantiate Java with:
//   <object> tag
//   <applet> tag
setVerifyTagsArray: function(userVerifyTagsArray){

  var applet=this, java=JAVA;

  // We set the default value first, no matter what else is going on.
  if (java.getVersionDone===null) applet.saveAsVerifyTagsArray(java.getVerifyTagsDefault());

  // We override the default and user specified verifyTagsArray when in debug mode
  if ($.dbug) applet.saveAsVerifyTagsArray([3,3,3])

  // User specified verifyTagsArray
  else if (userVerifyTagsArray) applet.saveAsVerifyTagsArray(userVerifyTagsArray);


},


isDisabled:{

// [public]
// We return true/false to tell if a specific applet(N) is disabled or not
//  (based on browser settings & browser capabilities).
// Return true if disabled.
// Return false otherwise.
//
single: function(N){

    var isDisabled=this;
    
    // If all Java applets are disabled, then all Java HTML tags are disabled.
    if (isDisabled.all()) return 1;

    // applet(1) is <object> tag (all browsers) that runs Java applet.
    // So, return whether the <object> tag is enabled/disabled
    if (N==1) return !$.DOM.isEnabled.objectTag();

    // applet(2) is <applet> tag (all browsers) that runs Java applet.
    // So, return whether the <applet> tag is enabled/disabled
    if (N==2) return isDisabled.AppletTag();

    
    // Filter out ActiveX related code
    BOUNDARY("select.pluginCheckbox.java && select.miscCheckbox.allowactivex");

    // applet(0) is <object> tag using codebase technique (ActiveX)
    if (N===0) return $.codebase.isDisabled();

    // applet(3) is <object> tag (IE browser only) using ActiveX that runs Java applet.
    if (N==3) return !$.DOM.isEnabled.objectTagUsingActiveX();

    BOUNDARY("select.pluginCheckbox.java");


    return 1;  // disabled

},  // end of single()


all_: null,

// [private]
// Return 1 if all Java applets are disabled
//   (ie. JRE is disabled, so do not even try to run Java applet)
// Return 0 if Java applets are not disabled. (ie. ok to try to run Java applet)
//
// This routine is used so we can avoid browser popups/crashes/hangs when trying
// to run Java applets in a web page.
//
all: function(){

    var isDisabled=this, java=JAVA,
        navigator=java.navigator, result, browser=$.browser;

    // We only need to run this once
    if (isDisabled.all_===null)
    {

       if (

       // Prevent Opera browser hangs/crashes
       //
       // Opera 10.01, 10.10, 10.53 / Windows has a problem.
       // When Java not installed or not enabled, the browser
       // will hang/crash when we insert an <applet> tag and then query that applet.
       // navigator.javaEnabled() == false in these cases.
       //
       // Opera 9 / Windows crashes when we insert an <object> tag when Java not installed.
       //
       // However, old versions of Opera have no mimetype.
       // Thus, we try to limit the cases where Opera is prevented from instantiating
       // an applet. We do this by also looking at navigator.javaEnabled() here.
       //
       // For Opera 8, 9, 10, 11, 12, when Java not installed/not enabled then
       // navigator.javaEnabled() == false according to my testing on Windows.
       //
       // Note: we specify "if (browser version < some #)", which is better than
       //  "if (browser version > some #)" because we only know the complete behavior of
       // yesterdays browsers, not tomorrows.
       //
       // I have noticed that for Opera 12.15 and lower, javaEnabled() will be false
       // when Java is unable to run or is not installed. So, we look at Opera < 13.
       // This will avoid any potential browser crashes. We are simply working around a
       // browser bug here.
       //
       // We cannot rely on navigator.mimeObj here, because in Opera 10, JRE 1,7,0,3
       // the plugin is installed, the mimetype object is present,
       // but the Next Gen Java does not run in that version of Opera, so the
       // browser crashes. Hence, we can only rely on navigator.javaEnabled().
       (browser.isOpera && $.compareNums(browser.verOpera, "13,0,0,0") < 0 && !navigator.javaEnabled()) ||


       // If both the <applet> tag and the <object> tag are disabled, then JRE is disabled
       (isDisabled.AppletTag() && !$.DOM.isEnabled.objectTag()) ||


       // We wish to avoid any popups in Firefox when trying to instantiate an applet
       // when Java is not installed. These popups can occur in older versions of Firefox,
       // for both the <applet> and the <object> tags.
       // It may occur in other browsers as well.
       //
       // Hence, we say that Java is disabled for non-IE browsers when no Java mimetype present.
       // If !browser.isIE && !mimetype && !window.java.lang.System then JRE not installed/not enabled.
       //
       // We actually would like to check for the window.java.lang here, since very old versions
       // of Opera displayed no Java mimetype, but did have window.java.lang. However, this is
       // for VERY old Opera versions, and so can safely be ignored.
       // Besides, window.java is deprecated and also was somewhat buggy in Opera and Firefox.
       // There are cases where window.java.lang can cause a browser crash, unless you
       // access this object in a very careful way.
       //
       // Hence, we just use...
       // if !browser.isIE && !mimetype then JRE not installed/not enabled.
       //
       (!navigator.mimeObj && !browser.isIE)
       

       ){ result=1; }    // JRE disabled



       else result=0;


   
       $.message.write(result ? "[ Note: All Java applets are DISABLED in this browser. Java will not run. ]" : 0, $.message.end());

       isDisabled.all_ = result;


    }

  return isDisabled.all_;

},   // end of all()



// This method tells us if the <applet> tag is disabled or not.
// Return true/false, 1/0
//
// This does not tell us if the JRE or the Java plugin is disabled, only the <applet> tag itself.
// The <applet> tag can be disabled while the JRE and the Java plugin are still enabled.
//
// Why do we need to know this?
// When Java is disabled in Security settings for IE 7+, any <applet> tag
// will give us a security popup in the browser.
//
// This routine is only really aimed at IE.
//
// For all other browsers, we just say that the <applet> tag is enabled.
// The value of navigator.javaEnabled() has not always been reliable (in the past) 
// in telling us if we can use the tag. Besides, we will rely on other indicators
// to tell us if we are allowed to run Java or not.
AppletTag: function(){

  var java=JAVA, navigator=java.navigator;
  return $.browser.isIE ? !navigator.javaEnabled() : 0;

},
// Note: We do not need to have an ObjectTag() method here, because we can
// use the $.DOM.isEnabled.objectTag() method.

  

// VerifyTagsDefault_1 corresponds to the <applet> tag in the Default VerifyTagsArray.
// This routine VerifyTagsDefault_1() tells us if the <applet> tag in the
// Default VerifyTagsArray should be disabled or not.
//
// VerifyTagsDefault_0 corresponds to tag # 0 (object tag) in the Default VerifyTagsArray.
// VerifyTagsDefault_1 corresponds to tag # 1 (applet tag) in the Default VerifyTagsArray.
// VerifyTagsDefault_2 corresponds to tag # 2 (object tag, ActiveX) in the Default VerifyTagsArray.
//
// If the user does not specify his own VerifyTagsArray for Java detection, then we
// use a default VerifyTagsArray.
//
// The <applet> tag is DEPRECATED, and sometimes even gives a browser popup when Java is
// not installed (a popup asking to download Java).
// So, we try to avoid <applet> tags as a general rule.
// We only allow <applet> tags in old versions of some browsers, since they may sometimes
// only be able to use <applet> tags and not <object> tags to instantiate a Java applet.
//
//
// return 1 when the <applet> tag is disabled in the Default VerifyTagsArray
// return 0 when the <applet> tag is not disabled in the Default VerifyTagsArray
//
// Note: as a reminder, the VerifyTagsArray merely tells PluginDetect the USER PREFERENCE
// for which HTML tags are allowed to be instantiated with Java and which are not.
// When VerifyTagsArray[x] is 0, the tag will NEVER instantiate during the course of Java
// detection. When ==1, the user prefers the tag to instantiate when needed/allowed.
// [assuming the tag is enabled in the browser settings, and when needed during
// the course of plugin detection]
//
VerifyTagsDefault_1: function(){

  var browser=$.browser, result=1;   // this == isDisabled{} object


  // Filter out ActiveX related code
  BOUNDARY("select.pluginCheckbox.java && select.miscCheckbox.allowactivex");

  // For IE when ActiveX is disabled in security settings,
  // we allow <applet> tag, because the <object> tag is disabled.
  //
  // Note: In IE 9, they introduce "ActiveX Filtering", which allows the user to turn
  // off ActiveX. It deactivates both the <object> tag and the <applet> tag.
  if (browser.isIE && !browser.ActiveXEnabled) result = 0;

  BOUNDARY("select.pluginCheckbox.java");



  // Older browsers on Desktop platforms may not implement Java
  // with the <object> tag. They may only recognize the <applet> tag for Java.
  // So, we allow <applet> tags on older browsers.
  if (
       
       // For older IE, we allow the <applet> tag.
       // IE 8 and below is on Win XP, which could still potentially have Microsoft Java.
       // The <applet> tag can detect MS Java (whereas the HTML5 <object> tag cannot).
       // Old IE does not really follow any standards.
       // Newer IE are more standards compliant, and hence should avoid <applet> tags.
       (browser.isIE && browser.verIE<9) ||


       // There is no need to allow the Chrome browser to use the <applet> tag at all.
       // Chrome 2+ is well behaved for the <object> tag for Java.
       // Chrome 2 has popup for <applet> tag when Java not installed.
       // Chrome 16 has popup for <applet> tag when Java not installed.
       // So, we do not enable the <applet> tag for any version of Chrome.


       // Gecko 2 corresponds to Firefox 4.
       //
       // For older Gecko versions, we allow <applet> tags.
       //
       // For Firefox 4+, we appear to not get any popups for either <applet> or
       // <object> tags when Java is not installed.
       (browser.verGecko && $.compareNums(browser.verGecko, $.formatNum("2")) < 0) ||


       // Safari seems to always have a Java mimetype, even when Java is not installed.
       // Thus, PluginDetect will try to instantiate an applet for Safari even when Java
       // is not installed.
       //
       // Safari 4 & 5 / Windows gives a popup when we insert an <applet> tag
       // when Java not installed. So, we only allow older Safari's to use 
       // the <applet> tag.
       // Safari 3+ is well behaved for the <object> tag for Java.
       //
       // Older Safari browsers do not have a value for browser.verSafari.
       // So, if Safari, and (no browser.verSafari value, or browser.verSafari<4), then
       // allow <applet> tag.
       //
       // Some older Safari's may not be able to use <object> tag for Java,
       // so we allow <applet> tag.
       (browser.isSafari && (!browser.verSafari || $.compareNums(browser.verSafari, $.formatNum("4")) < 0)) ||


       // We only allow <applet> tag for old versions of Opera < 11.
       // Newer versions do not need the <applet> tag since they can use <object> tag instead.
       (browser.isOpera && $.compareNums(browser.verOpera, $.formatNum("11")) < 0)


     ) result = 0;


   // If @result==0, then <applet> tag is enabled in the default verifyTagsArray.
   //
   // If @result==1, then <applet> tag is disabled in the default verifyTagsArray
   //
   // Any unknown platform/browser is assumed to follow the HTML standards.
   // Thus we allow the use of the <object> tag for Java for those cases.
   // <applet> tags are deprecated, and should be avoided.
   

   return result;


}  // end of VerifyTagsDefault_1()



},  // end of isDisabled{}





// Tells us if we CAN INSERT into web page AND QUERY Java applet[x] or not.
// This is based on:
//  a) whether we already instantiated applet[x]
//  b) whether the browser allows us to use the HTML tag associated with applet[x]
//
// This is not based on what the user wants or prefers, and thus
// we ignore the value of applet.allowed[x] here.
// [applet.allowed[x] is the user preference for when applet[x] is instantiated]
//
// applet(0) is <object> tag (IE browser only) using codebase technique (ActiveX)
// applet(1) is <object> tag (all browsers) that runs Java applet
// applet(2) is <applet> tag (all browsers) that runs Java applet
// applet(3) is <object> tag (IE browser only) using ActiveX that runs Java applet
can_Insert_Query: function(appletNum){

   var applet=this, result0=applet.results[0][0], result=applet.getResult()[0];

   if (
        // If HTML for applet(x) has already been inserted into the web page, then
        // we cannot insert again. So, return 0.
        applet.HTML[appletNum]  ||
   
        // appletNum==0 is the applet that uses codebase detection.
        //
        // if result0 is not null and is not a string version range (ie. ">1,7,0,0" or "<1,7,0,0"),
        // then we cannot insert again. So, return 0.
        //
        // Note: if result0 is null, then detection has never been attempted for this applet.
        // if result0 is 0 or "", then detection has been attempted, but nothing was found,
        //   so we do not allow another attempt for this applet.
        //
        // If result0 is a string version range (ie. ">1,7,0,0"), then detection has been attempted,
        // and we are allowed to attempt it again. This occurs for codebase detection
        // where we previously used applet.codebase.isMin().
        //
        // result0 can be null, 0, "".
        // result0 can be a string such as "1,7,0,0" or ">1,7,0,0" or "<1,7,0,0".
        (appletNum===0 && result0!==null && !applet.isRange(result0)) ||

        // appletNum==0 is the applet that uses codebase detection.
        //
        // if result (from ANY applet) is a string with a specific version, then there 
        // is no need to use codebase detection anymore.
        (appletNum===0 && result && !applet.isRange(result))


       ) return 0;


   // If applet(x) has not been inserted into the web page yet, then
   // we return whether the HTML tag for applet(x) is enabled or not.
   return !applet.isDisabled.single(appletNum);

},

can_Insert_Query_Any: function(){

   var applet=this, x;
   for (x=0;x<applet.results.length;x++){
        if (applet.can_Insert_Query(x)) return 1;
   }
   return 0;

},


// This routine tells us if we SHOULD INSERT into web page AND QUERY Java applet[x] or not,
// based on what the browser allows (applet.can_Insert_Query()) and based on what the 
// user wants (ie. applet.allowed[]).
//
// This routine is to be run only AFTER the non-applet methods have been attempted.
// java.version0 = result of the non-applet methods.
//
// appletNum refers to the number of the applet, is a number -1,0,1,2
//
// applet(0) is <object> tag (IE browser only) using codebase technique (ActiveX)
// applet(1) is <object> tag (all browsers) that runs Java applet
// applet(2) is <applet> tag (all browsers) that runs Java applet
// applet(3) is <object> tag (IE browser only) using ActiveX that runs Java applet
should_Insert_Query: function(appletNum){
  var applet=this, allowed=applet.allowed, java=JAVA, 

      appletResult0=applet.getResult()[0];
    
  // if !applet.getResult()[0], then appletResult0 = false.
  // if appletNum>0 && applet.getResult()[0], then appletResult0 = true.
  //    applet.getResult()[0] is a specific version string (ie. "1,7,0,0").
  //
  // if appletNum===0 && applet.getResult()[0] is a version range (ie. ">1,7,0,0"),
  //   then appletResult0 = false.
  // This means we have used applet.codebase.isMin() previously for this applet,
  // so we are allowed to use codebase detection again for this applet.
  //
  // if appletNum===0 && applet.getResult()[0] is a specific version (ie. "1,7,0,0"),
  //   then appletResult0 = true.
  // This means we have used applet.codebase.search() previously for this applet,
  // so we are NOT allowed to do the detection again for this applet.
  //
  appletResult0 = appletResult0 && (appletNum>0 || !applet.isRange(appletResult0));


  if (!applet.can_Insert_Query(appletNum) || allowed[appletNum]===0) return 0;



  if (
       // if applet.allowed[x]==3 then always try to instantiate the applet.
       allowed[appletNum]==3 ||

       // if applet.allowed[x]==2.8 and no other applets gave any result yet,
       // then instantiate this applet.
       (allowed[appletNum]==2.8 && !appletResult0)

     ) return 1;


  // If non-applet detection has a potential problem
  if (!java.nonAppletDetectionOk(java.version0))
  {
    if (
        // and applet.allowed[x]==2 then instantiate the applet.
        allowed[appletNum]==2 ||

        // and applet.allowed[x]==1 and no other applets gave any result yet,
        // then instantiate this applet.
        (allowed[appletNum]==1 && !appletResult0)
        
        ) return 1;

  }


  // Do not instantiate the applet.
  return 0;


},  // end of should_Insert_Query()


should_Insert_Query_Any: function(){

   var applet=this, x;

   for (x=0;x<applet.allowed.length;x++){
      if (applet.should_Insert_Query(x)) return 1;
   }

   return 0;

},  // end of should_Insert_Query_Any()


// We query Java applet[x] to get the Java version/vendor and then save the data.
// This routine involves a Javascript to Java applet communication (JStoJAVA).
//
// Input is a number (0, 1, 2, 3, ...) which refers to applet 0 in the DOM, applet 1 in the DOM, etc...
// The applet in the DOM is accessed via its HTML object.
//
query: function(appletNum){

     var applet=this,

        java=JAVA,

        version=null, vendor=null, isPlugin2=null,

        DOMobj, HTML=applet.HTML[appletNum];


     $.message.write($.message.time(applet.query,1), $.message.end());  // Start measuring time delay

     

     // If applet not ready for querying, then exit.
     var queryReadyState = java.NOTF.queryReadyState(appletNum);
     if (queryReadyState != 1) return;


     // Get the applet in the DOM.
     // The "true" input arg will force focus on this applet,
     // which makes applet query more reliable in IE in some cases.
     //
     // Update: we force focus on the HTML tag inside the <span> container.
     // We need to force focus when querying Java applets for certain situations.
     // For example, if you run a webpage with Java detection for PluginDetect 0.6.1, 
     // but the mouse is outside the window,
     // then the document may not have focus. In that case, when you query the applet, the applet
     // may just hang the browser until you move the mouse into the document. (ie IE8/JRE 1,6,0,2)
     // For this reason, we give you the ability to focus on the applet when focus==true.
     // The hang state occurs for verifyTags array [3,0,3] & [0,3,3] & [3,3,3].
     // The hang state does NOT occur for [0,0,3], [0,3,0], [3,0,0], or [3,3,0].
     //
     // Update: We can force focus on the <div> container instead. This also works and prevents
     // IE8/JRE 1,6,0,2 from hanging. And we can avoid accessing any methods of the instantiated
     // plugin object, which could potentially confuse the browser as to whether the method was
     // a Java method or a method of the object/applet/embed tag.
     //
     // Update: Forcing focus will remove focus from any <input> text boxes on a web page.
     // This occurs especially when Java is not installed, because then the Java HTML
     // tags are inserted into the web page, and focus is forced onto the <div>.
     // This behavior is intrusive, which we do not want.
     // Also, the hang state NO LONGER occurs for IE 8/ JRE 1,6,0,2....but I am not sure
     // why that is. Many changes have occurred to this library in the meantime.
     // Hence, for now we will NO LONGER force focus on the <div> container, since it
     // does not appear to be needed any more.
     //
     DOMobj = HTML.obj();



     $.message.write("[ ]", $.message.end());
     $.message.write("[ START (JStoJAVA) Javascript query of Java applet # " + appletNum + " ]", $.message.end());

     $.message.write(HTML ?
           "[ (JStoJAVA) Java applet # " + appletNum + " width: " + HTML.width() + " pixels ]" : 0, $.message.end());

     $.message.write("[ (JStoJAVA) Java applet # " + appletNum + ".readyState: " + HTML.readyState() + " ]", $.message.end());

     $.message.write($.browser.isIE ?
           "[ (JStoJAVA) Java applet # " + appletNum + ".object: " +

           // If DOMobj.object type conversion evaluates to true, we do not convert
           // DOMobj.object to a string, because it may not always be possible.
           // So we simply return "object{ }" string.
           // If DOMobj.object type conversion evaluates to false, then we
           // convert to string.
           (HTML.objectProperty() ? "object{ }" : HTML.objectProperty()) + " ]" : 0, $.message.end());

     $.message.write(HTML ?
           "[ (JStoJAVA) Java applet # " + appletNum + ".tagName: " + HTML.tagName + " ]" : 0, $.message.end());



     try{

           version = DOMobj.getVersion() + "";   // add "" to convert to string

           $.message.write(["[ (JStoJAVA) Java applet # " + appletNum + ": " + 
               " applet has been successfully queried ]"], $.message.end())


           vendor = DOMobj.getVendor() + "";

           // We only clear the statusbar before window loaded using "".
           // Then when window does load, the browser will see an empty statusbar
           // and will put whatever it usually does there, like "Done".
           //
           // Or, we could just use " " instead.
           //
           // If we clear the statusbar after window loaded using "", then after
           // detection is done we may get a message like "Loading ...." in IE6.
           // As a solution, we could use " " instead, which would prevent that from
           // happening. If you are really picky, you could use
           // $.getInfo("Java").JavaAppletObj.statusbar(message here)
           DOMobj.statusbar($.win.loaded ? " " : " ");


           isPlugin2 = DOMobj.isPlugin2();


           // Note: it is possible for DOMobj.getVersion to be an object, and for
           // DOMobj.getVersion() to run, and still get no results. Thus,
           // not having an error occur in this try{}catch{} does not mean that we got
           // any results. Thus, we do not output message.write() results based on
           // whether the try{}catch{} had an error or not. Instead, our message.write()
           // should only be based on whether version/vendor receive a value or not.


           // Now that the DOMobj is loaded and running, we could make it invisible.
           // On second thought, we do NOT make the DOMobj invisible because the user
           // may want to interact with the applet later on.
     }
     catch(e){$.message.write(["[ (JStoJAVA) Java applet # " + appletNum + ": " , e, " ]"], $.message.end())}



     // If we are able to save the applet data...
     if (applet.saveData(appletNum, 1, version, vendor, isPlugin2))
     {


     } // end  if applet.saveData()

     

     $.message.write("[ END (JStoJAVA) Javascript query of Java applet # " + appletNum +
         " in " + $.message.time(applet.query) + " ]", $.message.end());


},    // end of query() method


// Input version is a string ... "1,7,0,0" or "<1,7,0,0" or ">1,7,0,0" etc...
// Return +1 if input version is a minimum ... ">1,7,0,0"
// Return -1 if input version is a maximum ... "<1,7,0,0"
// Else return 0.
isRange: function(version){

  return (/^[<>]/).test(version||"") ? (version.charAt(0)==">" ? 1 : -1) : 0;

},

// Input version is a string version ... "1,7,0,0,"  etc...
// Input range is >0, <0, 0/null/undefined/""
//
// If range > 0, then return ">" + version
// If range < 0, then return "<" + version
// If range is 0/null/undefined/"", then return version
setRange: function(range, version){

  return (range ? (range>0 ? ">" : "<") : "") + ($.isString(version) ? version : "");

},


// Insert Java HTML tags into the DOM
// Return the HTML{} object
//
// @N = 1,2,3,4  HTML tag number
// @Container is the <div>/<iframe> tag that will contain the Java HTML tag (optional)
// @altHTML is alternate HTML (optional)
// @width, @height are the tag width, height in pixels (optional).
//    width,height should be a number, or a string number.
//    ie. width=100, width="100"  NOT width="100px"
insertJavaTag:function(N, Container, altHTML, width, height){

  var java=JAVA, HTMLobj = 0,

    javaClass="A.class",

    // Most recent valid input jarfile string specified by the user
    jarfile = $.file.getValid(java),

    // We need to determine the jarfile path here, so we can assign the path to the codebase
    // parameter. So we split up jarfile.
    jarname=jarfile.name+jarfile.ext, jarpath=jarfile.path;


   // For the purpose of Java detection with applets, we want the very top
   // of the window heirarchy to contain a reference to this Library.
   // That way, the Java applets can easily find this library.
   if (window.top[$.name] !== $) window.top[$.name] = $;


   var archive = ["archive", jarname, "code", javaClass],
       size = (width ? ["width", width] : []).concat( height ? ["height", height] : []),
       mayscript = ["mayscript", "true"],
       scriptable = ["scriptable", "true", "codebase_lookup", "false"].concat(mayscript),
       tagID = ["plugindetect", N],
       
       navigator=java.navigator,

       // Get the mimetype for non-IE browsers.
       // If the mimeType object exists, then we get the type value.
       // If that is not available, then we default to java.mimeType[0]
       // For IE, we just use java.mimeType[0]
       mimeType = !$.browser.isIE && navigator.mimeObj && navigator.mimeObj.type ?
            navigator.mimeObj.type : java.mimeType[0];



   if (N==1)
   {
         // Here we instantiate a Java applet using the <object> tag.
         // We also add the java input arg to run the callback functions when the
         // plugin is about to be instantiated.
         //
         // For IE, we are looking for a way to create an applet without using ActiveX
         // and the classid 8AD9... just in case that classid is (rarely) not approved
         // for IE 7+. Also, this leaves open the possibility of being able to detect
         // non-Sun Java JREs.
         //
         // This leaves us with 2 possibilities:
         //  A) The <applet> tag, which is deprecated and probably not a good idea to use in
         //     HTML Strict and XHTML Strict doctypes.
         //  B) The <object> tag, but we need to find a way to do that without ActiveX.
         //     To do this is possible, but it seems I need to use the "code" attribute, even 
         //     though it is not an official attribute of the <object> tag. But without "code", IE
         //     will not create the Java applet.
         //
         // This works for IE 8, IE 7, IE 6, IE 5
         //
         // Update: For IE 6/7/8/9, JRE 1,6,0,12+ we can use an HTML5 compatible <object> tag.
         // However, for JRE < 1,6,0,12 the HTML5 <object> tag does NOT work.
         // The HTML5 compatible tag does not have a "code" attribute.
         // We will use this HTML5 <object> tag to be forwards compatible with HTML5.
         // We will not worry about JRE < 1,6,0,12 because we can still detect Java with
         // the <applet> tag and the <object> tag + ActiveX.
         //
         // Note: The <object> tag with a "code" attribute (ex. code = "A.class") is 
         // not HTML5 compatible.
         // Also, in WinXP/IE7 when Java was never installed, when you try to run Java
         // with <object> tag that uses "code" attribute
         // then you will get a popup. This probably also occurs for other IE versions
         // as well. The popup says "The page you are viewing uses Java. More information 
         // on Java is on the Microsoft website".
         // Thus, I recommend using an HTML5 compatible tag. We use "code" as a param
         // such that <param name="code" value="A.class">.
         HTMLobj = $.browser.isIE ?            // applet 0


             // IE browser
             // We use HTML5 compatible <object> tag.
             $.DOM.insert("object",
                 ["type", mimeType].concat(size),
                 ["codebase", jarpath].concat(archive).concat(scriptable).concat(tagID),
                 altHTML, java, 0, Container) :

     /*
             // IE browser
             // Not HTML5 compatible
             $.DOM.insert("object",
                 ["type", mimeType].concat(archive).concat(size),
                 ["codebase", jarpath].concat(archive).concat(scriptable).concat(tagID),
                 altHTML, java, 0, Container) :
     */

             // all non-IE browsers
             // We use HTML5 compatible <object> tag.
             // HTML5 does not allow "classid", "archive", or "code" to be used as attributes of <object> tag.
             // HTML5 <object> tag for Java should be compatible with XHTML/HTML.
             $.DOM.insert("object",
                 ["type", mimeType].concat(size),
                 ["codebase", jarpath].concat(archive).concat(scriptable).concat(tagID),
                 altHTML, java, 0, Container);

      /*

              // all non-IE browsers
              // Not HTML5 compatible
             $.DOM.insert("object",
                 ["type", mimeType, "archive", jarname, "classid", "java:"+javaClass].concat(size),
                 ["codebase", jarpath, "archive", jarname].concat(scriptable).concat(tagID),
                 altHTML, java, 0, Container);
       */



   }


   // Here we instantiate a Java applet using the <applet> tag.
   // We also add the java input arg to run the callback functions when the
   // plugin is about to be instantiated.
   if (N==2)
   {
      // Note: the <applet> tag is deprecated.
      //
      // Note: It seems that Safari 1 & Safari 2 on Macintosh need <applet> tag in order
      // to get the Java version.
      //
      // Note: On WinXP/IE 7 that never had any Java ever installed, when you try
      // to instantiate an <applet> tag, you get a popup message: "The page
      // you are viewing uses Java. More information on Java is on the
      // Microsoft website". So, the <applet> tag can cause popups in some versions of
      // IE. This popup allows you to choose an option :"never show this message again".
      //
      // Note: On some non-IE browsers, when trying to instantiate <applet> tag when
      // Java not installed, you can get a popup asking to download Java.
      HTMLobj = $.browser.isIE ?
            
            // IE browsers
            // IE8 cannot handle <applet codebase="..."><applet>
            //   so we give it <applet><param codebase="..."></applet>  instead
            $.DOM.insert("applet",
                ["alt", altHTML].concat(mayscript).concat(archive).concat(size),
                ["codebase", jarpath].concat(scriptable).concat(tagID),
                altHTML, java, 0, Container) :

            // all non-IE browsers
            $.DOM.insert("applet",
                ["codebase", jarpath, "alt", altHTML].concat(mayscript).concat(archive).concat(size),
                [].concat(scriptable).concat(tagID),
                altHTML, java, 0, Container);

   }


   // This BOUNDARY filters out ActiveX related code
   BOUNDARY("select.pluginCheckbox.java && select.miscCheckbox.allowactivex");

   // Here we instantiate a Java applet using the <object> tag with ActiveX.
   // We also add the java input arg to run the callback functions when the
   // plugin is about to be instantiated.
   // This is for IE only.
   // applet.should_Insert_Query(2) is false for non-IE browsers.
   //
   // Note: there is a small issue in the detection method here.
   // JRE 1,6,0,02+ and JRE 1,5,0,14 <= JRE < 1,6,0,0 seem to
   // install/uninstall the "8AD9C840-044E-11D1-B3E9-00805F499D93" classid
   // and JavaWebStart from the preApproved registry key. So when you uninstall
   // a JRE in that range, then "8AD9C840-044E-11D1-B3E9-00805F499D93" and WebStart are no longer
   // Security Approved ActiveX controls. Then if you install a non security approved
   // JRE .... such as JRE < 1,5,0,14 or JRE 1,6,0,0-1,6,0,1
   // (which do not install those entries back into the preApproved registry key),
   // then the "8AD9C840-044E-11D1-B3E9-00805F499D93" classid may cause a security popup in IE 7+,
   // even though that classid is supposed to be pre-approved for all JREs in IE 7+.
   // However, the <object> tag WITHOUT ActiveX could still detect Java even in this case.
   //
   if (N==3)
   {
       HTMLobj = $.browser.isIE ?

               // IE
               $.DOM.insert("object",
                ["classid", java.classID].concat(size),
                ["codebase", jarpath].concat(archive).concat(scriptable).concat(tagID),
                altHTML, java, 0, Container):
                
               // non-IE
               // Cannot instantiate ActiveX plugin for these browsers
               $.DOM.insert();

   }

   BOUNDARY("select.pluginCheckbox.java");


   if (N==4)
   {
       HTMLobj = $.DOM.insert("embed",
           ["codebase", jarpath].concat(archive).concat(["type", mimeType]).concat(scriptable).concat(size).concat(tagID),
           [],
           altHTML, java, 0, Container);

   }

   if (HTMLobj){ HTMLobj.tagID = N }
   else HTMLobj = $.DOM.insert();

   return HTMLobj;


}, // end of insertJavaTag()



// Create <iframe> to hold our HTML tags.
// We specify a delay of 99ms before the iframe onload handler runs.
// The delay helps to insure that the HTML tags reach their final state before
// we look at the HTML tags. This is just an added safety measure.
insertIframe:function(label){
    return $.DOM.iframe.insert(99, label);
},


// We INSERT into web page AND QUERY ANY Java applet(s).
//
// We do not wait for window.onload. We just query immediately.
// If there is no result, then we query the applet in regular intervals until we get a result
// or up until window.onload.
//
// Set java.installed = -0.5 when we put an applet in the page and are waiting for JRE
// to run, and we do not know if Java installed/enabled.
// Set java.installed = 0.5 when we put an applet in the page and are waiting for JRE
// to run, and we know that Java is installed/enabled.
//
// We try to use the <object> tag to instantiate an applet to be compatible with pages
// that are (X)HTML Strict. If that fails, we use an <applet> tag.
//
// Note: deleting a Java applet from the DOM causes window.onload to not fire for an
// old version of Konqueror, so perhaps we should only delete the applets AFTER 
// window.onload has fired.
//
insert_Query_Any: function(_minVersion){

  var applet=this, java=JAVA, DOM=$.DOM,

    // result of applet query for applets 0, 1, 2
    queryResult=applet.results,

    AppletHTML=applet.HTML,   // HTML objects for Java applets

    altHTML=DOM.altHTML,

    tmp, iframe,

    // Most recent valid input jarfile string specified by the user
    jarfile = $.file.getValid(java);


   // This BOUNDARY filters out codebase{} related code, which depends on ActiveX
   BOUNDARY("select.pluginCheckbox.java && select.miscCheckbox.allowactivex");

   // If no applet result yet, then try codebase detection technique.
   // We try the codebase detection method BEFORE we try the applet query method.
   // (The applet query method is when we insert an applet into the DOM, and then query
   //  the applets.)
   //
   // We do this for a few reasons:
   // 1) In some older versions of Java, an applet could always have a readyState < 4,
   //    and since the applet is inserted into the DOM, it may potentially prevent
   //    window.onload from firing.
   // 2) The very first time that an applet is queried via the Java/Javascript bridge,
   //    there can sometimes be a very long delay. The codebase method does not use
   //    this bridge, and so this potential delay is avoided.
   // 3) The very first time an applet is started up can sometimes be very long.
   //    An applet is started up in the codebase method, and also in the applet query
   //    method. Hence, this delay is the same for both methods.
   // 4) Hence, the codebase method appears to be faster than the applet query method.
   // 5) Whenever a new Java method is released, we need to make sure that the codebase
   //    version to plugin version translation is still correct.
   //
   if (applet.should_Insert_Query(0))
   {
      if (java.OTF<2) java.OTF=2; // indicates that Java applet was used to attempt Java detection

      $.message.write("[ Querying Java applet # 0 using codebase version search ]", $.message.end());


      // Codebase detection method does not require us to insert anything into the DOM.
      // So, we do not use AppletHTML[0] = DOM.insert();


      queryResult[0] = [0,0]; // initialize to indicate that detection has been attempted



      // applet.codebase.isMin() returns:
      //    0, then we were not able to use codebase detection, or plugin not installed/enabled.
      //    1, then we used codebase detection, and version >= minversion, plugin installed.
      //   -1, then we used codebase detection, and version < minversion, plugin installed.
      //
      // applet.codebase.search() returns:
      //   plugin version as a string ("1,7,0,0" etc...) using codebase detection, plugin installed.
      //   null, plugin not detected using codebase method.
      //
      tmp = _minVersion ? applet.codebase.isMin(_minVersion, true) : applet.codebase.search(true);

      // queryResult[0][0] is given a range string version (ie. ">1,7,0,0" ) or a
      //  specific string version (ie. "1,7,0,0" )
      if (tmp) queryResult[0][0] = _minVersion ? applet.setRange(tmp, _minVersion) : tmp;


      // If the codebase method has detected Java, (codebase method uses the
      // "object" property to do its detection) then the plugin is active => 1.5
      //
      // If codebase method could not detect Java, then => -1.
      applet.active[0] = tmp ? 1.5  : -1;


   }

   BOUNDARY("select.pluginCheckbox.java");


   // If no valid jarfile specified, then exit.
   if (!jarfile) return applet.getResult();



   // HTML object for an empty <span> tag with only altHTML.
   // <span>altHTML</span>.
   // We instantiate this BEFORE applet.HTML[1], applet.HTML[2], applet.HTML[3]
   // are instantiated.
   if (!applet.DummySpanTagHTML)
   {
      // insert <iframe> into DOM for applet.DummySpanTagHTML.
      iframe = applet.insertIframe("applet.DummySpanTagHTML");

      // Insert <span> tag into <iframe>
      applet.DummySpanTagHTML = DOM.insert("", [], [], altHTML, 0, 0, iframe);

      DOM.iframe.close(iframe);
   }



   // appletNum[x]==1  ->  <object> tag
   // appletNum[x]==2  ->  <applet> tag
   var appletNum = [1, 2], x;

   // This BOUNDARY filters out ActiveX related code
   BOUNDARY("select.pluginCheckbox.java && select.miscCheckbox.allowactivex");

   // appletNum[x]==1  ->  <object> tag with ActiveX
   appletNum = appletNum.concat([3]);

   BOUNDARY("select.pluginCheckbox.java");

   for (x=0;x<appletNum.length;x++)
   {
      if (applet.should_Insert_Query(appletNum[x]))
      {
         if (java.OTF<2) java.OTF=2; // indicates that Java applet(s) were inserted
                                     // into the web page for querying.
     
         $.message.write("[ ]", $.message.end());
         $.message.write("[ Inserting Java applet # " + appletNum[x] + " into DOM for querying ]", $.message.end());

         // Initialize to indicate that detection is being attempted.
         // We do this BEFORE creating the Java HTML tag, not after.
         // It is possible that the Java applet itself may call applet.SaveData(),
         // which sets queryResult[]. Setting queryResult too late here could
         // potentially erase data created by applet.SaveData().
         queryResult[appletNum[x]] = [0,0];

         // insert <iframe> into DOM for applet.HTML[appletNum[x]].
         iframe = applet.insertIframe("applet.HTML[" + appletNum[x] + "]");
         
       //  DOM.iframe.addHandler(iframe, function(){alert('')});

         // Insert Java HTML tag into <iframe>
         AppletHTML[appletNum[x]] = applet.insertJavaTag(appletNum[x], iframe, altHTML);
       
         DOM.iframe.close(iframe);

         applet.query(appletNum[x]);

      }


   }  // x loop



   // Note: we insert DummyObjTagHTML and DummySpanTagHTML AFTER inserting the Java plugin objects
   // AppletHTML[0], AppletHTML[1], AppletHTML[2].
   // We do this because we wait for DummyObjTagHTML and DummySpanTagHTML to show their altHTML.
   // THEN we can look at the status of the Java plugin objects using isJavaActive()
   // and shouldContinueQuery()


   if (DOM.isEnabled.objectTag())  // Make sure it is safe to insert <object> tag
   {

      // Dummy HTML object for an empty <object> tag with altHTML.
      // <span><object type="dummyMimeType"
      //    width=DOM.pluginSize height=DOM.pluginSize>altHTML</object></span>
      //
      // We only instantiate this Dummy object if AppletHTML[1] was instantiated,
      // because they both use a mimetype.
      // We only instantiate this Dummy object if AppletHTML[2] was instantiated,
      // because AppletHTML[2] uses an <applet> tag. There is no classid here or
      // mimetype for the <applet> tag, but we use a mimetype for the dummy tag anyway.
      //
      // We do not need to add any <param>s here since this dummy tag never instantiates.
      if (!applet.DummyObjTagHTML && (AppletHTML[1] || AppletHTML[2]))
      {
           $.message.write("[ ]", $.message.end());
           
           // insert <iframe> into DOM for applet.DummyObjTagHTML.
           iframe = applet.insertIframe("applet.DummyObjTagHTML");

           // Insert <span> tag into <iframe>
           applet.DummyObjTagHTML =
             DOM.insert("object", ["type", java.mimeType_dummy], [], altHTML, 0, 0, iframe);

           DOM.iframe.close(iframe);
      }

      // Dummy HTML object for an empty <object> tag with altHTML.
      // <span><object classid="clsid:dummyClassid"
      //    width=DOM.pluginSize height=DOM.pluginSize>altHTML</object></span>
      //
      // We only instantiate this Dummy object if AppletHTML[3] was instantiated,
      // because they both use a classid.
      //
      // We do not need to add any <param>s here since this dummy tag never instantiates.
      if (!applet.DummyObjTagHTML2 && AppletHTML[3])
      {
           $.message.write("[ ]", $.message.end());

           // insert <iframe> into DOM for applet.DummyObjTagHTML2.
           iframe = applet.insertIframe("applet.DummyObjTagHTML2");

           applet.DummyObjTagHTML2 =
             DOM.insert("object", ["classid", java.classID_dummy], [], altHTML, 0, 0, iframe);
             
           DOM.iframe.close(iframe);
      }
   
   }


   // If any applet that was inserted into the document has not
   //  given any OTF result, then we must use NOTF detection.
   java.NOTF.init();


   return applet.getResult();


}  // end of insert_Query_Any()


},  // ******* end of applet{} object *******





NOTF: {    // ******* Beginning of NOTF object *******


count: 0,   // counts the number of times that NOTF.onIntervalQuery() is called.
            // onIntervalQuery() is called at regular intervals during NOTF detection.

count2: 0,

countMax: 25,   // Max # intervals allowed for each <iframe>.
                // Total length of time = NOTF.intervalLength x NOTF.countMax

intervalLength: 250, // Length of time between attempts to query Java applets
                     // for NOTF detection. Interval is in milliseconds.




// [public]
// Begin NOTF detection
init: function(){
  
  var NOTF=this, java=JAVA;


  // If any applet that was inserted into the document has not
  //  given any OTF result, then we must use NOTF detection.
  if (java.OTF<3 && NOTF.shouldContinueQuery())
  {

       $.message.write("[ One or more Java applets inserted into web page have not yet given a result, must use NOTF detection ]", $.message.end());
       $.message.write("[ START NOTF Java detection ]", $.message.end());

       java.OTF = 3;    // Detection is now being performed NOTF
                        // Setting = 3 means that this section of code can
                        // only be executed ONCE.


       // Query Java applets at regular intervals.
       // Note: We use setTimeout instead of setInterval.
       $.ev.setTimeout(NOTF.onIntervalQuery, NOTF.intervalLength);


       $.message.write($.message.time(NOTF,1), $.message.end());  // Start measuring time delay for NOTF detection
  

  }

},  // end of init()



// Return 1 if all HTML{} objects that currently exist are loaded.
// Return 0 otherwise.
//
// This routine assumes that at least one Java HTML tag has already been inserted
// into the DOM.
allHTMLloaded:function(){

  return this.allDummyHTMLloaded() && this.allJavaHTMLloaded() ? 1 : 0;

}, // end of allHTMLloaded()

// Return 1 if all Java HTML{} objects that currently exist are loaded.
// Return 0 otherwise.
allJavaHTMLloaded:function(){

  var applet=JAVA.applet, x,
    arr = applet.HTML;

  for (x=0;x<arr.length;x++){
    if (arr[x] && arr[x].loaded!==null && !arr[x].loaded) return 0; // not loaded yet
  }
  
  return 1;  // all are loaded

}, // end of allJavaHTMLloaded()

// Return 1 if all Dummy HTML{} objects that currently exist are loaded.
// Return 0 otherwise.
//
// Note: we assume that all HTML objects that exist are for <iframe>s, and so we
// can easily determine when they load.
allDummyHTMLloaded:function(){

   var applet=JAVA.applet, x,
    arr = [applet.DummySpanTagHTML, applet.DummyObjTagHTML, applet.DummyObjTagHTML2];
    
   for (x=0;x<arr.length;x++){
    if (arr[x] && arr[x].loaded!==null && !arr[x].loaded) return 0; // not loaded yet
  }

  return 1; // all are loaded

}, // end of allDummyHTMLloaded()


// Return 0 if applet is not ready to be queried yet. Try again later.
//   Note: if HTML object for applet does not exist, then we still return 0.
// Return 1 if applet is ready to be queried.
// Return 2 if applet is no longer able to be queried. It can never be queried again.
//
// This routine deals with TIMING RELATED ISSUES only. Java applets should only be queried
// at the appropriate time. As a result of this, the ORDER of the code in this routine
// is very important.
//
// When we use the word "query" here, as in queryReadyState(), we are referring to the
// Javascript to Java applet communication (JStoJAVA), NOT the Java applet to Javascript 
// communication (JAVAtoJS).
// We are trying to determine when we are ready to allow Javascript to query the Java applet.
//
// *** Note: JStoJAVA communication can cause an extra Java security popup message to occur,
// at least for signed applets.
// The message is along the lines of "This website is trying to access or control Java" etc...
// We would like to avoid this popup if possible. We can do this by delaying the JStoJAVA,
// and simply waiting for JAVAtoJS to occur first. If we receive the plugin detection data
// via JAVAtoJS, then there is no longer any need for JStoJAVA to occur.
queryReadyState: function(appletNum){

  var NOTF=this, java=JAVA, applet=java.applet,
    HTML=applet.HTML[appletNum], appletResults = applet.results[appletNum],
    readyState, DOMobj, tmp,
    errObj1=0, errObj2=0;


  // These items are in units of NOTF counts. 
  // Hence they are integers >=0.
  var delayBeforeJStoJAVAQueryBegins = 10,   // during this time, we hope that JAVAtoJS plugin
                                             // detection occurs.
    timeAllowedForJStoJAVAQueryToOccur = 5;  // during this time, we allow JStoJAVA plugin
                                             // detection to occur.


   // Note: for $.codebase{} Java detection, HTML will be 0.
   // Hence this routine will never return "1" (applet ready to be queried) for 
   // the codebase detection results. It can only return 1 for actual Java applets.


   // If the Java applet already gave results, then there is no need to access/query the 
   // applet again.
   //
   // This is the very FIRST thing we must check for in this routine.
   //
   // This way, if a detection result already arrived from JAVAtoJS communication, we can
   // then guarantee that no JStoJAVA communication is ever attempted.
   // This can potentially avoid any Java security popup messages that can be generated
   // when JStoJAVA communication occurs.
   //
   // On the other hand, if the detection result arrived from JStoJAVA, then we make sure that
   // the Java applet is not queried again.
   if (appletResults[0])
        return 2;   // Never query again


   // At this point, there are no detection results for the applet yet



   if (!HTML ||

       // Timing related issue.
       // Make sure that all HTML <iframe>s are loaded
       // for all Java tags before we try to query this applet.
       // Yes, this is conservative, but we want to give enough time
       // for the JavaToJS to occur.
       //
       // !NOTF.allJavaHTMLloaded()
       //
       !NOTF.allHTMLloaded()


       // Make sure that only this particular applet HTML <iframe> is loaded.
       // We do this in case one or more of the applet HTML's do not load in
       // a reasonable period of time.
       //
       // HTML.loaded === null means we do not have an iframe.
       // But for Java, this HTML is assumed to always be an <iframe>,
       //   assuming that HTML has been given a value.
       // !HTML.loaded


       ) return 0;  // not ready yet. Try again later.
                    // Either this <iframe> has not been inserted into the DOM,
                    // or it has been inserted but has not fully loaded yet.


   // At this point, there are no detection results for the applet yet.
   // The HTML object for the applet has fully loaded.



   // qrs = queryReadyState{} object
   if (!HTML.qrs) HTML.qrs = {result: null, count: NOTF.count, count2: NOTF.count};
   var qrs = HTML.qrs;
   

   // If applet should never be queried again, then we are done. Return that result.
   if (qrs.result == 2 ||

      // If the NOTF count has not changed since the last time we ran this routine,
      // then just return the same result.
      (qrs.result !== null && NOTF.count === qrs.count)
      
      ) return qrs.result; // Return previous result



   // We set this AFTER the previous statement where we check for "NOTF.count === qrs.count"
   qrs.count = NOTF.count;


   $.message.write(java.JSTOJAVABRIDGE && java.JAVATOJSBRIDGE && qrs.count == qrs.count2 && delayBeforeJStoJAVAQueryBegins ?
       "[ Applet # " + appletNum +
       ": begin delay of JStoJAVA. Waiting for JAVAtoJS to occur first. ]" : 0, $.message.end());

   $.message.write(java.JSTOJAVABRIDGE && java.JAVATOJSBRIDGE && qrs.count - qrs.count2 < delayBeforeJStoJAVAQueryBegins ?
       "[ Applet # " + appletNum + ": There are " +
       (delayBeforeJStoJAVAQueryBegins - qrs.count + qrs.count2) + 
       " more NOTF counts until JStoJAVA is allowed to begin. ]" : 0, $.message.end());

   $.message.write(java.JSTOJAVABRIDGE && java.JAVATOJSBRIDGE && qrs.count - qrs.count2 == delayBeforeJStoJAVAQueryBegins ?
       "[ Applet # " + appletNum + ": JStoJAVA will begin now. ]" : 0, $.message.end());


   $.message.write(java.JSTOJAVABRIDGE && !java.JAVATOJSBRIDGE && qrs.count - qrs.count2 <= timeAllowedForJStoJAVAQueryToOccur ?
       "[ Applet # " + appletNum + ": There are " +
       (timeAllowedForJStoJAVAQueryToOccur - qrs.count + qrs.count2) +
       " more NOTF counts allowed for JStoJAVA to occur. ]" : 0, $.message.end());



   // This is the very NEXT thing to check for, after setting qrs.count, before doing anything else.
   // This will prevent an infinite loop.
   // It limits the total numbers of counts permitted.
   if (
       // Timing related issue.
       // After a maximum number of counts, we are done.
       qrs.count - qrs.count2 >

          // If Java to JS bridge is enabled, then we use delayBeforeJStoJAVAQueryBegins.
          // If disabled, then no delay.
          (java.JAVATOJSBRIDGE ? delayBeforeJStoJAVAQueryBegins : 0) +

          timeAllowedForJStoJAVAQueryToOccur
      )
   {
       qrs.result = 2;
       return 2;   // Never query again
   }



   // If the Java to JS bridge has been disabled, then there is no reason
   // to delay the JS to Java applet query. Hence we return 1 for an immediate applet query.
   //
   // Note: We test for this AFTER checking for "qrs.count - qrs.count2 > some number".
   // If we tested BEFORE, then we could potentially get an infinite loop,
   // if applet never gives a query result and its width never reaches the width of altHTML.
   if (!java.JAVATOJSBRIDGE) return 1;



   DOMobj = HTML.obj();
   readyState = HTML.readyState();
   if (
       // Timing related issue.
       // For non-IE, readyState will be null.
       // For IE, readyState will/should be a number.
       //
       // Note: readyState is defined for IE < 11.
       // In some cases for old Java versions on old IE browsers, the browser/applet can
       // crash/hang if we query the applet before the readyState is 4. To prevent this
       // crash, we look at readyState when it is a number.
       //
       // if readyState is not a number, then just query the applet.
       // However, if we do have a readyState number, then we wait until readyState==4 to reduce
       // the chance of any browser/plugin crashes/hangs.
       //
       // Note: We test for this AFTER checking for "qrs.count - qrs.count2 > some number".
       // If we tested BEFORE, then we could potentially get an infinite loop,
       // if there is a browser bug where the readyState never reaches 4.
       ($.isNum(readyState) && readyState!=4) ||

       // If DOMobj does not exist yet, then we wait.
       //
       // Note: We test for this AFTER checking for "qrs.count - qrs.count2 > some number".
       // If we tested BEFORE, then we could potentially get an infinite loop,
       // if DOMobj never resolves to an actual object.
       !DOMobj)

   {
      qrs.result = 0;
      return 0;    // Not ready to be queried yet
   }


   // ** Very special trick being used here.
   // When Javascript tries to access a property/method of a Java applet (JStoJAVA), the browser
   // Javascript may WAIT for the applet to respond (at least for SOME browsers/JRE's).
   // The same might apply for a non-existing property/method of the Java applet.
   //
   //
   // For signed applets, when Javascript tries to access an existing applet 
   // property/method (JStoJAVA), we can get a Java security popup message:
   //   "This website is requesting access & control of Java..."
   // However, when Javascript tries to access a NON-existing property/method, then we do NOT
   // seem to get the popup message.
   // Also, when the Java applet itself tries to access the browser Javascript (JAVAtoJS), 
   // then we do NOT get this popup message.
   //
   //
   //
   // So, what we do here is something very unusual.
   // We try to DELAY the Javascript to Java query, in order to let the Java to Javascript
   // query occur first. This is for the purpose of preventing the Java security popup
   // message discussed (above).
   // We intentionally let Javascript try to access a NON-EXISTENT property of the Java applet.
   // The Javascript may or may not wait while the applet starts up.
   // When the applet has inited, it will SEND
   // data to the Javascript routine saveData(), which saves the data in appletResults[appletNum].
   // Then the normal Javascript thread in the Library will
   // continue. But since appletResults[appletNum] now has a value, then
   // the Javascript call on the Java applet will not need to occur,
   // and hence we avoid the Java security popup message.
   //
   // If the Java to Javascript routine does not run, then the normal Javascript to Java applet
   // query will simply occur.
   //
   // *** This trick here seems to work for IE 8, to prevent the Java security
   // popup message that occurs for JStoJAVA communication.
   // It seems to force IE to wait. By this, we mean that the browser Javascript stops
   // and waits until the applet has started, and then the Javascript proceeds with the
   // next line of code.
   //
   // Note: we do this BEFORE checking for "qrs.count - qrs.count2 < some number".
   // This way, we do not wait to use this special trick. We can just use it right away.
   // Note: we do this BEFORE checking the value of java.JSTOJAVABRIDGE.

   try{tmp = DOMobj.dummyAppletProp();}
   catch(e){
     errObj1 = e;
     $.message.write(["[ Java applet # " + appletNum + ".dummyAppletProp( ): ", errObj1, " ]"], $.message.end());
     $.message.write("[ Java applet # " + appletNum + ".dummyAppletProp( ) error.name: " + errObj1.name + " ]", $.message.end());
     $.message.write("[ Java applet # " + appletNum + ".dummyAppletProp( ) error.message: " + errObj1.message + " ]", $.message.end());
   }

   if (appletResults[0])         // If the browser waited long enough from this trick, 
   {                             // then the JAVAtoJS will have sent data in the meantime.
                                 // If so, then we do not allow JStoJAVA communication 
                                 // for this applet.
       qrs.result = 2;
       return 2;   // Never query again
   }



   if (
       // If we intentionally disabled the Javascript to Java bridge, then
       // the Java applet query is disabled.
       // However, we set result = 0, so that the NOTF count can continue for a while.
       // This gives the Java to Javascript communication some time to still occur,
       // assuming that the Java to Javascript bridge is enabled.
       !java.JSTOJAVABRIDGE ||

       // Timing related issue.
       // We intentionally add a delay here.
       //
       // We do this because there is a race between the Java to Javascript communication (JAVAToJS)
       // and the Javascript to Java communication (JStoJAVA).
       // We want the JAVAToJS to occur first, because the JStoJAVA can cause a
       // security popup message to occur.
       // However, the JAVAtoJS does not give us the popup message.
       //
       // This trick here seems to help Firefox avoid the Java popup message.
       // The only question here is how many counts should be wait?
       qrs.count - qrs.count2 < delayBeforeJStoJAVAQueryBegins
      ){
        qrs.result = 0;
        return 0;    // Not ready to be queried yet
      }


   // If we get this far, then we are permitted to query the Java applet
   // by accessing its real/existing properties and methods.


   // We try to access one of the methods of the Java applet, to see if it is possible.
   try{tmp = DOMobj.getVersion();}
   catch(e){
     errObj2 = e;
     $.message.write(["[ Java applet # " + appletNum + ".getVersion( ): ", errObj2, " ]"], $.message.end());
     $.message.write("[ Java applet # " + appletNum + ".getVersion( ) error.name: " + errObj2.name + " ]", $.message.end());
     $.message.write("[ Java applet # " + appletNum + ".getVersion( ) error.message: " + errObj2.message + " ]", $.message.end());
   }


   // If errObj2, then applet.getVersion() does not seem to work.
   if (errObj2)
   {
      
      // If the 2 error objects give the same error type/name, then the
      // getVersion() property simply does not exist, so we return 0,
      // which means we continue to wait. The Java applet should not be queried yet.
      

      // If the 2 error objects give a different error type/name, then this means that the user
      // chose NOT to give permission for Javascript/Java interaction.
      // [When Javascript tries to access a signed applet, we get a popup asking for
      // permission to allow this interaction.]
      // So if the user clicks on "Cancel", then we return 2, which means the Java applet
      // should never be queried.
      //
      // In this case, we should disable querying for ALL Java applets, since the user
      // does not want the Javascript / Java interaction.

      if (errObj1 && errObj1 !== errObj2 && errObj1.name !== errObj2.name){
          qrs.result = 2;
          java.JSTOJAVABRIDGE = 0;   // Disable the Javascript to Java bridge for all Java applets
      }
      else qrs.result = 0;

      return qrs.result;
   }


   // If we get this far, then Javascript can successfully access the properties and
   // methods of the Java applet. Hence, the applet is ready to be accessed by Javascript.

   qrs.result = 1;
   return 1;         // Applet is ready to be queried now


}, // end of queryReadyState()



// Check if we should continue querying the applets.
//
// If one or more applets should still be queried, then return 1.
// If none of the applets should be queried any more, then return 0.
shouldContinueQuery: function(){

    var NOTF=this, java=JAVA, applet=java.applet, x, result;

    
    // If onload event has fired for all <iframes> that currently exist, 
    // and if all Java related HTML tags are done being queried, then
    // we end the plugin detection.
    if (NOTF.allHTMLloaded())
    {
      
       $.message.write("[ All <iframe>s used for Java detection have loaded. ]", $.message.end());

       // result == 0 means we are done with detection
       // == 1 means we are not done yet
       result=0;
       for (x=0;x<applet.results.length;x++)
       {
          // Check if HTML[x] exists, and if its queryReadyState indicates that it
          // is not done yet, then we will wait longer before terminating the
          // plugin detection.
          if (applet.HTML[x] && NOTF.queryReadyState(x) != 2)
          { result=1; break; }
       }

      if (!result){
         $.message.write("[ Java NOTF detection is done. None of the applets need to be queried any further. ]", $.message.end());
         return result;
      }
    }


    result=0;
    for (x=0;x<applet.results.length;x++)
    {
        // Check if applet[x] has already been inserted into the web page.
        if (applet.HTML[x])
        {
            // Check if no detection results have been obtained yet for applet[x]
            if (!applet.results[x][0] &&

            // If applet.allowed[x] == 2 or 3, then we wait for the detection results for applet[x]
            // if applet.allowed[x] == 1 and none of the other applets have given a result yet,
            //    then we wait for the detection results for applet[x]
            // if applet.allowed[x] === 0, then we do not wait for detection results for applet[x]
            (applet.allowed[x]>=2 || (applet.allowed[x]==1 && !applet.getResult()[0])) &&

            // If >=0, then Java might still be able to run for this tag.
            // If < 0, then it displays altHTML and Java is not going to run for this HTML object.
            //
            // When NOTF.count==0, then we wait one count before even looking at the value
            // of NOTF.isAppletActive(x). This way we allow NOTF{} to query
            // this applet at least once.
            (!NOTF.count || NOTF.isAppletActive(x)>=0)

            ){

            // Note: we do NOT return result right away after result = 1.
            // We cycle thru ALL the applets, and THEN return the result.
            // This is so all the properties on each applet are updated properly via
            // NOTF.isAppletActive(x).
            $.message.write("[ applet # " + x + " still needs to be queried. Querying will continue... ]", $.message.end());
            result = 1;
            }


        }


    }  // x loop

    $.message.write(result ? 0 : 
      "[ Java NOTF detection is done. None of the applets need to be queried any further. ]", $.message.end());
    return result;

},  // end of shouldContinueQuery()


// Determine if any Java applets are active or not.
// We determine this without using the Java/Javascript bridge.
//
//
// Return 1 or 1.5 if Java applet(s) are active. The usefulness of this result is that it can confirm
// that Java is active and running, even when the Javascript/Java bridge is disabled
// (ie. when the applet query gives no result).
//
// Return 0 if unknown (at this time) whether any Java applets can run.
//
// Return -1 if all Java applets are unable to run. The usefulness of this result is that it prevents
// us from having to wait until window.onload fires to say that Java not installed. This is
// useful for pages that take a very long time to load.
//
// Return -2 if applet.HTML does not contain any applets.
//
//
// This routine assumes that one or more Java applets (<applet>/<object> tags) 
// have attempted to be instantiated. It will try to determine if Java is running and active
// in these <applet>/<object> tags, but will do so without trying to query these
// applets via the Java/Javascript bridge. Instead, this routine will look at the 
// size of the applet/object tags and determine if Java is active or if the altHTML is 
// being displayed.
// An instantiated Java applet will have a width=height=1. An HTML tag that cannot run
// Java will display alternate text (altHTML) and should then have a width > 1.
//
//
// This is a new method of Java detection. It can be used to see determine if the 
// Java/Javascript bridge is enabled or disabled. For example, if Java is Active,
// but the query of the applets gave no result, then the bridge is disabled.
//
// if doNotQueryApplet is true, then do not bother "querying" the applets (ie. looking
// at the tag widths). Instead, we just return the value from a PREVIOUS
// query (java.applet.active[appletNum])
isJavaActive: function(doNotQueryApplet){

   var NOTF=this, java=JAVA, x, tmp, highest = -9;

   for (x=0;x<java.applet.HTML.length;x++){
         tmp = NOTF.isAppletActive(x, doNotQueryApplet);
         if (tmp > highest) highest=tmp;
   }

   return highest;

},


// Determine if Java applet(x) is Active or not for IE and non-IE browsers.
//
// This routine does not initiate any querying of any Java applet.
// It does not use the Java/Javascript bridge.
// It only looks at HTML tag widths, and the HTML tag "object" property (IE only),
// the mimetype, and navigator.javaEnabled().
//
// This routine returns the following values:
//
// == 2 if Java applet is running and has already been queried via the Java/Javascript bridge.
// == 1.5 (IE only) if "object" property exists for the HTML tag for the plugin,
//     and is an object, hence the plugin is active.
// == 1 if plugin appears to be active. This is based on the width of various tags.
// == 0 if unsure about plugin status.
// == -1 if altHTML (text) is being displayed.
//   This means that the plugin is not installed or disabled.
// == -2 if applet.HTML is empty (no text, no plugin object).
//
// if doNotQueryApplet is true, then do not bother querying the applet (ie. looking
// at the tag widths or tag.object property). Instead, we just return the value from a previous
// query (active[appletNum])
isAppletActive: function(appletNum, doNotQueryApplet){

   var NOTF=this, java=JAVA, navigator=java.navigator,

      applet=java.applet, HTMLobj=applet.HTML[appletNum],

      active=applet.active, x, isAnyActive=0,

      appletStatus, result=active[appletNum];


   if (doNotQueryApplet ||
   
          // if active[appletNum]>=1.5, then there is no need to
          // run this routine again, because the highest possible return value
          // from this routine is 1.5.
          // When active[appletNum]>=1.5, then we are completely certain that the
          // applet is active, and so we know that the return value can never be < 1.5 from
          // this point on.
          // It is also possible that active[appletNum]==2 from an applet query,
          // and since this routine's max return value is 1.5, then we definitely
          // would not want to run this routine.
          //
          // We considered making the cuttoff active[appletNum] >= 1, but 1 is based
          // on tag widths, and it is remotely possible that widths can change during
          // the course of detection.
          result >= 1.5 ||

          // If the HTMLobj does not exist, then there is no point in running this
          // routine. The reason why we do this is 2 fold:
          //
          // 1) For the codebase detection method, there is never going to be
          //    an HTMLobj object, and so running this routine is not appropriate.
          //    Also, $.DOM.getTagStatus() was not designed to look at the
          //    codebase detection applet. It is only for normal applets.
          //    Hence, there is no reason to change the value of java.applet.active[].
          //
          // 2) If no attempt has been made to instantiate an applet, then
          //   HTMLobj will not exist. So running this routine would not be
          //   appropriate. Hence, there is no reason to change the 
          //   value of java.applet.active[].
          !HTMLobj ||

          !HTMLobj.span()


             ) return result;


   $.message.write("[ ]", $.message.end());
   $.message.write("[ START Checking status of applet # " + appletNum +
       " without using the Java/Javascript bridge ]", $.message.end());


   // We wish to determine if Java is running in the HTMLobj.
   // $.DOM.getTagStatus() output range is from -2 to 1.5.
   appletStatus =
         $.DOM.getTagStatus(HTMLobj, applet.DummySpanTagHTML, 
             applet.DummyObjTagHTML, applet.DummyObjTagHTML2, NOTF.count);

   $.message.write("[ $.DOM.getTagStatus(applet # " + appletNum + "): " + appletStatus + " ]", $.message.end());
   $.message.write("[ END Checking status of applet # " + appletNum +
       " without using the Java/Javascript bridge ]", $.message.end());
   $.message.write("[ ]", $.message.end());

   // Check if ANY of the applets appear to be active or not
   for (x=0;x<active.length;x++){if (active[x]>0) isAnyActive=1;}



   // ==-2
   // In some cases, when the object cannot instantiate, we get applet==null instead
   // of applet = text node (which would come from the altHTML inside the tag).
   // This seems to occur for IE 6, for example. So appletStatus == -2 in that case.
   //
   // ==-1 or -0.5
   // altHTML is being displayed.
   // This result can occur well before window.onload.
   // We assume here that the browser will not display a quick flash of altHTML
   // before displaying the active content. If altHTML is being displayed, then it will
   // stay that way.
   //
   // ==0 or -0.1
   // Unsure at this time if the plugin can run or is running.
   //
   // ==1.5
   // For IE only, when object property of the HTML tag (for the plugin) is defined
   // and is an object, then the plugin is installed and enabled and is running.
   if (appletStatus != 1) result = appletStatus



   // At this point, appletStatus == 1.
   //
   // IE: appletStatus==1 means Java is Active and running.
   // Because IE is only one browser, we can test this on all versions of IE fairly easily.
   // We tested up to IE 11. When tag width == $.DOM.pluginSize for applet/object tags,
   // then plugin is active. (If altHTML is being displayed for applet/object tags, then 
   // we see that Java is not active).
   //
   // non-IE: There are too many non-IE browsers with too many browser versions on different
   // OS's to be able to test all possible combinations. This is a very open ended situation
   // as far as a new Java detection technique is concerned. The danger here is that we
   // may say that Java is active when in fact it is not (ie. a false positive).
   // To enhance reliability and reduce the chance of false positives, we limit the situations
   //  where this routine will return a "1".
   // We do this by requiring:
   //    A) The Java mimetype must exist.
   //    B) We require java.version0 !== null.
   //       This means a Java version was detected by the Deployment Toolkit or in the
   //       navigator array.
   //       Without this requirement, it is possible that we would say that Java is installed
   //       but we do not know the version.
   //    C) We wait until window.onload has fired before we conclude that Java is Active.
   //       The status of the HTML tags should not change once window.onload has fired.
   //       [Note: we do not need to wait for window.onload to conclude that Java is absent]
   //    D) We make a comparison to an empty <object> tag with altHTML to see if it is capable
   //       of having a scrollWidth > 1.
   //    E) navigator.javaEnabled() is true
   //
   //
   // Note: There are cases where appletStatus==1 yet Java does not run.
   // When appletStatus==1, the width of the tag == $.DOM.pluginSize.
   // This especially occurs for the <applet> tag, since the applet tag is deprecated.
   // When Java not running, the <applet> tag SHOULD show altHTML - but sadly this is not always
   // the case. For example...
   //   In Chrome 5, when Java not installed/not enabled, the <applet> tag does not show altHTML
   // and hence appletStatus==1.
   //   In Opera 9.51+, when Java not installed/not enabled, the <applet> tag width does not expand
   // to show altHTML. The <applet> tag stays at a width of $.DOM.pluginSize, and hence we
   // get appletStatus==1.
   //   For IE, the <applet> tag DOES expand to show altHTML (we tested up to IE 11).
   //
   // For these reasons, we cannot solely rely on appletStatus==1 for non-IE browsers 
   // to tell us that a plugin is active. We thus also rely on other info such 
   // as navigator.javaEnabled(), etc...
   else if ( $.browser.isIE ||

             (  // non-IE browsers

                // if status==1 and java.version0 && javaEnabled() && mimetype && <object> tag,
                // then applet[x] is active.
                // The <object> tag is considered to be a standards compliant tag, which shows
                // altHTML when the plugin is not instantiated.
                //
                // If we do not have an <object> tag (ie. <applet> tag / <embed> tag), 
                // then we consider the tag
                // to be active only if one or more of the other tags are already active.
                // Why? Because the <applet> tag is deprecated, and it does not always
                // consistently show its altHTML.
                java.version0 && navigator.javaEnabled() && navigator.mimeObj &&

                (HTMLobj.tagName=="object" || isAnyActive)

             )



           ) result = 1              // Java appears to be active.



   else result = 0;        // unsure if Java can run or not


   active[appletNum] = result;

   $.message.write("[ java.isAppletActive(applet # " + appletNum + "): " + result + " ]", $.message.end());

   return result;


},    // end of isAppletActive()


// ** EVENT HANDLER **
// queries applet at regular intervals (determined by the SetTimeout()).
// Cannot use "this" keyword here.
onIntervalQuery: function(){

     var NOTF=JAVA.NOTF, result;
     
     NOTF.count++;  // Set this BEFORE any other code runs.

     $.message.write("[ ]", $.message.end());
     $.message.write("[ START NOTF.onIntervalQuery( ) for NOTF count == " + (NOTF.count) + " ]", $.message.end());



     // JAVA.OTF == 3 means that JAVA.installed == -0.5 or +0.5
     // So detection is not done yet...
     if (JAVA.OTF == 3)
     {
         // We query all applets, BEFORE running shouldContinueQuery()
         result = NOTF.queryAllApplets();

         // If we cannot continue to query the applets, then Java detection has been completed.
         // We save the results, clear the interval, and run the functions in the array.
         if (!NOTF.shouldContinueQuery()) NOTF.queryCompleted(result);

     }


     // If detection not done yet, then we run this routine again after a delay
     if (JAVA.OTF == 3) $.ev.setTimeout(NOTF.onIntervalQuery, NOTF.intervalLength);

     $.message.write("[ END NOTF.onIntervalQuery( ) for NOTF count == " + (NOTF.count) + " ]", $.message.end());

},  // end of onIntervalQuery()


// Query the external Java applet getJavaInfo.jar to get the Java version & vendor.
// Return [detectionDone, version, vendor].
// detectionDone = true/false. If true, then a Java version was found, or we determined
//   that Java cannot run.
//
// This is for NOTF detection.
// We query all possible Java applets so that we know which applets are active and
// which are not.
queryAllApplets: function(){

     var NOTF=this, java=JAVA, applet=java.applet, x, result;

     // applet.HTML[0] is the container for applet 0
     // applet.HTML[1] is the container for applet 1
     // applet.HTML[2] is the container for applet 2
     // applet.HTML[3] is the container for applet 3
     for (x=0;x<applet.results.length;x++){
          applet.query(x);  // get [version, vendor]
     }

     result = applet.getResult();

     // Note: we have to look at BOTH result[0] && result[1] to verify that
     // the applet is running. Looking at just result[0] is not good enough,
     // because the codebase technique can give a value, which ends up
     // only in result[0].
     $.message.write($.isNum(NOTF.count) ? "[ NOTF Java detection after " +
        $.message.time(NOTF) +
        ", query # " + NOTF.count +
        ", result: " + (result[0] && result[1] ? "installed": "not yet") +
        " ]" : null, $.message.end());


     return result;

}, // end of queryAllApplets()



// The applet querying has been completed, so we now:
//   set plugin status
//   clear the interval
//   execute the functions in the $.Plugins.java.DoneHndlrs[] array
//
// This method is only called by onIntervalQuery()
//  hence it is only called when this.installed == -0.5 or 0.5
//
// The input variables come from the results of querying the external applet.
// This is for NOTF detection.
queryCompleted: function(result){

     var NOTF=this,  // NOTF object
         java=JAVA;


     // queryCompleted() should only be called once
     if (java.OTF >= 4) return;
     java.OTF = 4;    // NOTF Detection has now been completed



     // We intentionally query the width/object property of all the applets one last time,
     // to make sure that the applet.active[] array is updated,
     // regardless of whether the applets gave a detection result or not.
     NOTF.isJavaActive();


     // result[0] is detected version
     // result[1] is detected vendor
     java.setPluginStatus(result[0], result[1], 0); // set the $.Plugins.java.version


     $.message.write("[ END NOTF Java detection in " + $.message.time(NOTF) + " ]", $.message.end());
     $.message.write("[ " + $.message.time($) + " after script initialization ]", $.message.end());




     // It is possible to start NOTF detection...
     //
     // 1) by using getVersion() or isMinVersion()
     // 2) or by using onDetectionDone()
     //
     // To see if onDetectionDone() was used to call this routine, we check for the presence of
     // onDetectionDone() && DoneHndlrs[] array.
     $.message.write($.onDetectionDone && java.DoneHndlrs ? "[ END " + java.pluginName +
          " detection for " +
          $.name + ".onDetectionDone(" + $.message.args2String(java.pluginName) + ") in " +
          $.message.time(java.DoneHndlrs) + " ]" : 0, 
          $.message.end());

     $.message.write($.onDetectionDone && java.DoneHndlrs ? "[ START event handlers for " + $.name +
           ".onDetectionDone(" + $.message.args2String(java.pluginName) + ") ]" : 0,
           $.message.end());


     // Execute the event handlers f specified by the $.onDetectionDone("pluginName", f) method.
     //
     // Note: we execute callArray() even when DoneHndlrs[] is empty or does not exist.
     // The reason is that callArray() will automatically check if ALL event handlers
     // are done, and then runs some final cleanup handlers (since we just completed detection for
     // this one plugin).
     $.ev.callArray(java.DoneHndlrs);


     $.message.write($.onDetectionDone && java.DoneHndlrs ? "[ END event handlers for " + $.name +
           ".onDetectionDone(" + $.message.args2String(java.pluginName) + ") ]": 0, 
           $.message.end());


     // We can destroy an applet.
/*
     var HTML = java.applet.HTML, x;
     for (x=0;x<HTML.length;x++)
     {
         try{
           if (HTML[x]) HTML[x].obj().destroy();
           alert(x);
         }catch(e){}
     };
*/


}   // end of queryCompleted() method


},               // ********* End of NOTF object **********



// ************************* verify jarfile ***************************
// Verify that your jarfile name & path are correct when using PluginDetect's Java detection.


BOUNDARY22:"select.pluginCheckbox.java && select.pluginCheckbox.verifyjava",


verify:{

BOUNDARY0:"0",   // We always delete this item, so then the verify{} object
                 // is automatically enabled when it is included in the script.

// [private]
// == 1 to disable the verify routine. Verify routine will not run.
// == 0/null/""/undefined to enable verify routine. Verify routine will run.
isDisabled:1,


BOUNDARY1:"select.pluginCheckbox.java && select.pluginCheckbox.verifyjava",

// [private]
// output <div> that holds verify messages
div: null,

// [** PUBLIC **]   $.Plugins.java.verify.enable()
// Enable the verify{} object for writing.
enable: function(){
   this.isDisabled = 0;
},

// [** PUBLIC **]   $.Plugins.java.verify.disable()
// Disable the verify{} object from writing.
disable: function(){
   this.isDisabled = 1;
},

// [public]
isEnabled: function(){
   return !this.isDisabled;
},


// [private]
// Insert text node into verify.div
//
// text = text content
//
// S = array [style property, style value,...]
// or S = "bold", "verified", "error", "warning"
//
// br = false (boolean) will prevent line feed
addText: function(text, S, br){
     var verify=this;
     $.verify.addText(verify.div, text, S, br);
},


// [public]
//
// Begin Java applet verification.
// Run init() only once.
// When this routine runs, it means that Java detection has been initiated by the user.
init: function(){

  var verify = this;

  // if disabled, return
  // if this routine already ran, return
  if (!verify.isEnabled() || verify.div) return;

  verify.div = $.verify.init(verify, "Java", "jarfile", "getJavaInfo.jar", ".jar", "verifyTagsArray");

  verify.addText();
  verify.addText("[ONE LAST REMINDER ABOUT GETTING SECURITY APPROVAL FOR JAVA SO THE APPLET CAN RUN...");
  
  verify.addText("For Java 7 update 51 and higher, unsigned applets no longer run by default. " +
   "If the applet you are using is unsigned, then you may have to go into your Java Control Panel " + 
   "and add this web page (or just the domain) to the Exception Site List.");
  verify.addText("As an alternative, you could use a signed applet - but the cost for the certificate is high.]");
  verify.addText();
  verify.addText();


  // We wait for all the user specified plugin detections to be fully completed.
  // This allows us to accumulate all possible references to the input jarfile.
  // Then we execute verify.onReady().
  $.ev.fPush([verify.onReady, verify], $.ev.allDoneHndlrs);
  
  $.ev.fPush([verify.onUnload, verify], $.win.unloadHndlrs);

}, // end of init()


// [private]
// ** EVENT HANDLER **
onUnload: function($, verify){

   verify.disable();
  
   $.DOM.emptyNode(verify.div);
   $.DOM.removeNode(verify.div);

   verify.div = null;

}, // end of onUnload()


// [private]
// ** EVENT HANDLER **
// This is an event handler, hence we have $, verify as inputs.
// Verify the plugin when ready.
onReady: function($, verify){

    var java=JAVA;

    if (!$.verify.checkfile1(verify.div, java, "Java", "jarfile", ".jar")) return; // Error

    verify.addText("We now attempt to display a Java applet in each of the 2 boxes shown below.");
    verify.addText("The Java applets will appear as ", 0, 0);
    verify.addText("RED", ["color","#E00000", "fontWeight","bold"], 0);
    verify.addText(" rectangles, and will display the Java version and the Java vendor.");
    verify.addText("If one or both applets are visible, then Java is installed & enabled, and your jarfile path/name are correct.", "bold");
    verify.addText("If neither applet is visible, then Java may not be installed & enabled, or your jarfile path/name may not be correct.", "bold");
    verify.addText("We assume here that jarfile = \"" + $.file.getValid(java).full + "\"");
    verify.addText();

    // Insert Java applets into verify.div
    // These applets provide a visual verification of the jarfile path/name.
    var DOM = $.DOM,
    
       wrapperDiv1 = document.createElement("div"),
       wrapperDiv2 = document.createElement("div"),

       appDiv1 = document.createElement("div"), // contains applet 1
       appDiv2 = document.createElement("div"), // contains applet 2

       bgDiv1 = document.createElement("div"),  // displays background text within divApp1
       bgDiv2 = document.createElement("div"),  // displays background text within divApp2

       clear = document.createElement("br"),    // clear the css float
       altHTML = DOM.altHTML,
       appWidth="350px", appHeight="80px",
       applet=java.applet,


       defaultStyle = DOM.getStyle.Default.concat(
            ["display", "block",
             "fontSize", "15px",
             "lineHeight", "15px"
            ]),

       wrapperDivStyle = defaultStyle.concat([
                "position", "relative",
                "border", "solid black 1px",
                "marginLeft","20px",
                "marginTop", "10px",
                "width", appWidth,
                "height", appHeight,
                "styleFloat", "left",  // float style for IE
                "cssFloat", "left"     // float style for non-IE
             ]),

       appDivStyle = defaultStyle.concat([
                "position", "relative",
                "zIndex", "2",
                "width", appWidth,
                "height", appHeight
             ]),
             
       bgDivStyle = defaultStyle.concat([
                "backgroundColor","#8888AA",
                "position", "absolute",
                "left","0px",
                "top","0px",
                "zIndex", "1",
                "width", appWidth,
                "height", appHeight,
                "textAlign", "center"
        ]),

       bgText = "<br><br><b>This Java applet is not running</b>";

    DOM.setStyle(wrapperDiv1, wrapperDivStyle);
    DOM.setStyle(wrapperDiv2, wrapperDivStyle);
    DOM.setStyle(appDiv1, appDivStyle);
    DOM.setStyle(appDiv2, appDivStyle);
    DOM.setStyle(bgDiv1, bgDivStyle);
    DOM.setStyle(bgDiv2, bgDivStyle);
    DOM.setStyle(clear, ["clear","both"]);

    wrapperDiv1.appendChild(appDiv1);
    wrapperDiv1.appendChild(bgDiv1);
    wrapperDiv2.appendChild(appDiv2);
    wrapperDiv2.appendChild(bgDiv2);
    
    bgDiv1.innerHTML = bgText;
    bgDiv2.innerHTML = bgText;

    verify.div.appendChild(wrapperDiv1);
    verify.div.appendChild(wrapperDiv2);
    verify.div.appendChild(clear);
    verify.addText();
    verify.addText();
    
    // Java applet using <object> tag
    verify.app1 = applet.insertJavaTag(1, appDiv1, altHTML, appWidth, appHeight);
    
    // Java applet using <applet> tag
    verify.app2 = applet.insertJavaTag(2, appDiv2, altHTML, appWidth, appHeight);

    verify.getJarVersion = verify.getJarVersion_();
    verify.getJarVersion();


}, // end of onReady()


// [private]
// Input is applet{} object
// Query the applet
queryApplet:function(applet){

   var obj=0, result={appVer:0, version:0, vendor:0, isPlugin2:0};

   if (applet)
   {
      obj = applet.obj();
      if (obj)
      {  // Applet version
         try{result.appVer = obj.getAppVersion() + ""}    // add "" to convert to string
         catch(e){}
         
         // Java version
         try{result.version = obj.getVersion() + ""}
         catch(e){}

         // Java vendor
         try{result.vendor = obj.getVendor() + ""}
         catch(e){}

      }

   }

   return result;


},  // end of queryApplet()


// [private]
// Get the version of the getJavaInfo.jar
getJarVersion_:function(){
  
   var verify=this;
   
   // This function is an event handler, hence we are unable to use the
   // "this" keyword here.
   return function()
   {
     var java = JAVA, result;

     // Count the number of times we run this routine
     if ($.isNum(verify.count)) verify.count++
     else verify.count=0;

     result = verify.queryApplet(verify.app1);
     if (!result.version) result = verify.queryApplet(verify.app2);

     if (result.version)
     {
       verify.addText("We have detected that one or both Java applets (shown above) are currently running.");
       verify.addText("Java/Javascript bridge: works");
       verify.addText("Java version: " + result.version);
       verify.addText("Java vendor: " + result.vendor);
       verify.addText("Applet version: " + result.appVer);
       verify.addText("");

       verify.addText("jarfile input argument \"" +
          ($.file.getValid(java)?$.file.getValid(java).full:"") +
          "\" : VERIFIED (path and name are correct)", "verified");

       verify.addText("");
       verify.addText("DONE", "verified");
       verify.addText();

     }
     else{
       // If the Java plugin is not active, then we run this routine again.
       // We do this in case the user needs to "click to activate" the plugin.
       // At that point, we automatically run this routine again.
       $.ev.setTimeout(verify.getJarVersion, 1000);
     }

   };


}  // end of getJarVersion()



},  // ************************ end of verify object ****************************


BOUNDARY23:"select.pluginCheckbox.java",


// Property is automatically removed by Script Generator
lastProperty:"select.pluginCheckbox.java"


};  // end of java{}


$.addPlugin("java", JAVA);



// ************************** End of Java detection ********************************






// *********************************************************************************
/* 

  DevalVR plugin detection
  Works for Internet Explorer 6+

  DevalVR is NOT a pre-approved ActiveX control. So, you will at some point
  have to click on the security info bar to get it to run in IE 7.
  When you install Deval by visiting their website, they ask you to click
  on the security bar.
  This security popup comes up if you embed an <object> tag with the Deval classid,
  or you try to instantiate new ActiveXObject("DevalVRXCtrl.DevalVRXCtrl.1").

*/


BOUNDARY("select.pluginCheckbox.devalvr");

var DEVALVR = {


  // Property is automatically removed by Script Generator
  firstProperty:"select.pluginCheckbox.devalvr",


  BOUNDARY0:"0",

  // This object assists in creating a custom version of the script for the user.
  script:{

    select:{pluginCheckbox:{devalvr:"DevalVR"}},

    fileNameSuffix:"DevalVR",

    checkboxLabel:"DevalVR",

    errCheck:function(code, select){
        if (!select.miscCheckbox.allowactivex &&
             (/\.axo|\.codebase|\.AXO|\.getAXO|\.ActiveX|ActiveXObject/).test(code.customModuleScript)
           )
              alert("Error: ActiveX code found in " + code.moduleName + " module");
    },

    // include:function(select){} tells us which other modules to include when using this module.
    //
    // Do not put $.message/BOUNDARY in the array[] here because they are automatically
    // included/removed from the script as needed.
    //
    // Any items in the outermost array must ALL be included (AND).
    // At least one item in an inner array must be included (OR).
    //
    // For this particular plugin, plugin.getVersion() must be called by either
    // $.isMinVersion or $.getVersion. Hence we use the inner array
    // [$.isMinVersion, $.getVersion] here.
    //
    include:function(select){
         return [$.pd,

           // When select.miscCheckbox.allowactivex == true, we include $.DOM{} since it is used
           //   for ActiveX plugin detection.
           // When select.miscCheckbox.allowactivex == false, we do NOT include $.DOM.
           // This way, the script is smaller when allowactivex == false.
           (select.miscCheckbox.allowactivex ? $.DOM : 0),


           $.hasMimeType, [$.isMinVersion, $.getVersion]]
    }

  }, // end of script{}

  BOUNDARY1:"select.pluginCheckbox.devalvr",


// [public]
// Get Deval version
getVersion: function(){

   var deval=this, version = null, installed;


   // ** Attempt # 1 to detect, using navigator arrays.
   if ((!installed || $.dbug) && deval.nav.query().installed) installed = 1;
   if ((!version || $.dbug) && deval.nav.query().version) version = deval.nav.version;

   BOUNDARY("select.pluginCheckbox.devalvr && select.miscCheckbox.allowactivex");

   // ** Attempt # 2 to detect, using ActiveX.
   if ((!installed || $.dbug) && deval.axo.query().installed) installed = 1;
   if ((!version || $.dbug) && deval.axo.query().version) version = deval.axo.version;

   BOUNDARY("select.pluginCheckbox.devalvr");


   deval.installed = version ? 1 : (installed ? 0 : -1);
   deval.version = $.formatNum(version);

  
},   // end of getVersion()


// Get the DevalVR version from navigator arrays.
nav:{

  // == 0 if not called
  // == 1 if called
  hasRun:0,

  // 1, 0
  installed:0,

  // Detected plugin version
  // [string/null]
  version:null,

  mimeType: "application/x-devalvrx",


  query: function(){

     var nav=this,
        version, obj,
        disabled = nav.hasRun || !$.hasMimeType(nav.mimeType);

     nav.hasRun = 1;
     if (disabled) return nav;


     $.message.write($.message.time(nav.query,1), $.message.end());   // Start measuring time delay
     $.message.write("[ ]", $.message.end());
     $.message.write("[ START search navigator.plugins[ ] for DevalVR ]", $.message.end());



     // Get plugin obj, but do not require numbers in the result.
     //
     // Firefox, WinXP
     // A.enabledPlugin.name: DevalVR 3D Plugin
     // A.enabledPlugin.description: DevalVR 3D Plugin 0,9,0,2
     obj = $.pd.findNavPlugin({find:"DevalVR.*Plug-?in", mimes:nav.mimeType, plugins:"DevalVR 3D Plugin"});

     if (obj && (/Plug-?in(.*)/i).test(obj.description || "")) version = $.getNum(RegExp.$1);



     if (obj) nav.installed = 1;
     if (version) nav.version = version;


     $.message.write("[ ]", $.message.end());
     $.message.write("[ DevalVR installed: " + (nav.installed ? "true" : "false")  + " ]", $.message.end());
     $.message.write("[ DevalVR version: " + nav.version + " ]", $.message.end());
     $.message.write("[ END search navigator.plugins[ ] for DevalVR in " +
          $.message.time(nav.query) + " ]", $.message.end());

     return nav;

  } // end of query()


}, // end of nav{}


BOUNDARY3:"select.pluginCheckbox.devalvr && select.miscCheckbox.allowactivex",


// Get the DevalVR version using ActiveX
axo:{

  // == 0 if not called
  // == 1 if called
  hasRun:0,

  // [public]
  // 1, 0
  installed:0,

  // [public]
  // Detected plugin version
  // [string/null]
  version:null,
  
  // Security Pre-Approved ActiveX control for IE
  progID: ["DevalVRXCtrl.DevalVRXCtrl", "DevalVRXCtrl.DevalVRXCtrl.1"],
  
  classID: "clsid:5D2CF9D0-113A-476B-986F-288B54571614",


  // [public]
  query: function(){

     var axo=this, deval=DEVALVR,
       version, x, obj, tmp,
       disabled = axo.hasRun;

     axo.hasRun = 1;
     if (disabled) return axo;

     $.message.write($.message.time(axo.query,1), $.message.end());   // Start measuring time delay
     $.message.write("[ ]", $.message.end());
     $.message.write("[ START deval.axo.query( ) for ActiveX based browsers ]", $.message.end());


     for (x=0;x<axo.progID.length;x++)
     {
        obj = $.getAXO(axo.progID[x]);
        if (obj){
          axo.installed = 1;
          if (!$.dbug) break;
        }
     }


     if (obj && $.DOM.isEnabled.objectTagUsingActiveX())
     {
        tmp = $.pd.getPROP(
                $.DOM.insert("object", ["classid", axo.classID], ["src", ""], "", deval).obj(),
                "pluginversion");

        if (tmp && tmp.toString)
        {
               // For version number "0.3.2.1" the value returned is 0x00030201
               // Should be 8 digits long. If any missing digits, then add them
               // to the beginning of the string.
               //
               // For plugin version "0.7.0.19" the value returned is 0x00070013
               version = "00000000" + tmp.toString(16); //  convert hex number to hex string
               version = version.substr(version.length-8, 8);

               $.message.write("[ version: " + version + " (hex) ]", $.message.end());


               // Now, divide the string into 2 digit pieces
               version = 
                   parseInt(version.substr(0,2)||"0", 16) + "," +
                   parseInt(version.substr(2,2)||"0", 16) + "," +
                   parseInt(version.substr(4,2)||"0", 16) + "," +
                   parseInt(version.substr(6,2)||"0", 16);

               if (version) axo.version = version;
        
        }

     }



     $.message.write("[ ]", $.message.end());
     $.message.write("[ DevalVR installed: " + (axo.installed ? "true" : "false") + " ]", $.message.end());
     $.message.write("[ DevalVR version: " + axo.version + " ]", $.message.end());
     $.message.write("[ END deval.axo.query( ) for ActiveX based browsers in " +
          $.message.time(axo.query) + " ]", $.message.end());

     return axo;

  }  // end of query()

},   // end of axo{}


BOUNDARY4:"select.pluginCheckbox.devalvr",


// Property is automatically removed by Script Generator
lastProperty:"select.pluginCheckbox.devalvr"

}; // end of devalvr{}


$.addPlugin("devalvr", DEVALVR);



// ************************** End of DevalVR detection ****************************





// ***************************** Start of Flash detection *************************


BOUNDARY("select.pluginCheckbox.flash");

var FLASH = {


  // Property is automatically removed by Script Generator
  firstProperty:"select.pluginCheckbox.flash",


  BOUNDARY0:"0",

  // This object assists in creating a custom version of the script for the user.
  script:{

    select:{pluginCheckbox:{flash:"Flash"}},

    fileNameSuffix:"Flash",

    checkboxLabel:"Flash",

    errCheck:function(code, select){
        if (!select.miscCheckbox.allowactivex &&
             (/\.axo|\.codebase|\.AXO|\.getAXO|\.ActiveX|ActiveXObject/).test(code.customModuleScript)
           )
              alert("Error: ActiveX code found in " + code.moduleName + " module");
    },

    // include:function(select){} tells us which other modules to include when using this module.
    //
    // Do not put $.message/BOUNDARY in the array[] here because they are automatically
    // included/removed from the script as needed.
    //
    // Any items in the outermost array must ALL be included (AND).
    // At least one item in an inner array must be included (OR).
    //
    // For this particular plugin, plugin.getVersion() must be called by either
    // $.isMinVersion or $.getVersion. Hence we use the inner array
    // [$.isMinVersion, $.getVersion] here.
    include:function(){
        return [$.pd, $.getPluginFileVersion, $.DOM, $.hasMimeType, [$.isMinVersion, $.getVersion]]
    }

  }, // end of script{}

  BOUNDARY1:"select.pluginCheckbox.flash",


  mimeType: "application/x-shockwave-flash",


// Set the status of the plugin.
setPluginStatus: function(installed, version, precision)
{

    $.message.write("[ ]", $.message.end());
    $.message.write("[ START set plugin status ]", $.message.end());

    var flash=this, getVersionDone;

    flash.installed = version ? 1 : (installed ? 0 : -1);

    flash.precision = precision;

    flash.version = $.formatNum(version);


    // flash.getVersionDone == 1 means flash.getVersion() does not need to be called again.
    // flash.getVersionDone == 0 means flash.getVersion() is allowed to be called again.
    //
    // if flash.installed==-1 => 1   Plugin not installed, no need to call again
    // if flash.instance.version => 1  Plugin was queried directly, we got all 4 digits of version, 
    //   version is accurate, no need to call again.
    // if flash.axo.version => Plugin was queried directly using ActiveX, we got all 4 digits,
    //   version is accurate, no need to call again.
    //
    // if plugin was detected using passive methods (ie. from navigator arrays), then 
    // we allow flash.getVersion() to be called again.
    //
    getVersionDone = flash.installed==-1 || flash.instance.version;

    BOUNDARY("select.pluginCheckbox.flash && select.miscCheckbox.allowactivex");

    getVersionDone = getVersionDone || flash.axo.version;

    BOUNDARY("select.pluginCheckbox.flash");

    flash.getVersionDone = getVersionDone ? 1 : 0;


    $.message.write("[ ]", $.message.end());
    $.message.write("[ flash.installed: " + flash.installed + " ]", $.message.end());
    $.message.write("[ flash.version: " + flash.version + " ]", $.message.end());
    $.message.write("[ flash.precision: " + flash.precision + " ]", $.message.end());
    $.message.write("[ flash.getVersionDone: " + flash.getVersionDone + " ]", $.message.end());
    $.message.write("[ END set plugin status ]", $.message.end());

},  // end of setPluginStatus()


// Find the precision for a string number
// "a.b.c.d" -> 4
// "a.b.c"   -> 3
// etc...
//
// @str - input string that contains a number.
//   This can be "aaaa 7.7 bbb", or "7.7"
getPrecision:function(str){

   if ($.isString(str))
   {
      var x, num="\\d+", dot="[\\._,]", arr=[num, num, num, num];

      for (x=4;x>0;x--){
         if ((new RegExp(arr.slice(0, x).join(dot))).test(str)) return x;
      }
   }
   return 0;

}, // end of getPrecision()


// [public]
// Get Flash version
//
// "instantiate" input arg will try to force flash.instance{} to run for non-IE browsers.
getVersion: function(dummy, instantiate){

  var flash=this,
    version=null, installed=0, precision=0;


/*

     Using the navigator arrays to detect will not usually give us the 4th digit in the
     plugin version, but the advantage is speed, and also it will never cause
     a security popup in the browser when Flash is very outdated.
     [I have seen Firefox give a popup when you try to run a very outdated Flash].

     On the other hand, the navigator arrays may not give the correct plugin version.
     It is possible for an uninstaller to not remove all the files, and this would cause
     an outdated flash to appear in the navigator.plugins[] array.
     So if you installa newer flash, then both plugins may appear in the array.

     If you attempt to instantiate the plugin in the DOM, you get all 4 digits. But if the plugin
     is outdated, the browser may give a security poup and will block the plugin.

     So, as a general rule, instantiation will be our LAST detection attempt.
     However, if the input arg "instantiate" is true, then instantiation WILL always
     occur for non-IE browsers.

*/



  // ** Attempt # 1 to detect, using navigator arrays.
  if ((!installed || $.dbug) && flash.navPlugin.query().installed) installed = 1;
  if ((!version || $.dbug) && flash.navPlugin.query().version){ 
     version = flash.navPlugin.version;
     precision = flash.navPlugin.precision;
  }

  BOUNDARY("select.pluginCheckbox.flash && select.miscCheckbox.allowactivex");

  // ** Attempt # 2 to detect, using ActiveX.
  // Reveals all 4 digits of plugin version.
  if ((!installed || $.dbug) && flash.axo.query().installed) installed = 1;
  if ((!version || $.dbug) && flash.axo.query().version){
     version = flash.axo.version;
     precision = flash.axo.precision;
  }

  BOUNDARY("select.pluginCheckbox.flash");


  $.message.write(instantiate ? "[ User input specifies that for non-IE browsers, " +
      "the plugin will be inserted into DOM and queried. ]" : 0, $.message.end());

  // ** Attempt # 3 to detect, by inserting flash object into DOM, and querying.
  // Reveals all 4 digits of plugin version. This is for non-IE browsers only.
  //
  // This is the most reliable method, but also the slowest.
  // Also, there is a chance that an outdated Flash player could cause a security popup
  // in a browser (Firefox, etc...). So we put this detection method last.
  //
  // So we only run this routine in limited cases.
  if (((!installed && !version) || instantiate || $.dbug) && flash.instance.query().version)
  {     
     installed = 1;
     version = flash.instance.version;
     precision = flash.instance.precision;
  }


  flash.setPluginStatus(installed, version, precision);


},  // end of getVersion()


// Get the Flash version using navigator.plugins[] array
navPlugin:{

  // == 0 if not called
  // == 1 if called
  hasRun:0,

  // [public]
  // 1, 0
  installed:0,
  
  // [public]
  // Precision of version #
  // Can be 0, 1, 2, 3, 4 digits
  precision:0,

  // [public]
  // Detected plugin version
  // [string/null]
  version:null,


  // Extract number from string.
  //
  // Numbers can be of the form "xx.yy.zz" or "xx,yy,zz" or "xx.yy rzz"
  // where r is the revision number
  //
  // Note: in Linux for FireFox/Opera it is "xx.yy dzz"
  //
  // Return is "xx,yy,zz" or ""
  getNum: function(A){
     if (!A) return null;
     var m = /[\d][\d\,\.\s]*[rRdD]{0,1}[\d\,]*/.exec(A);
     return m ? m[0].replace(/[rRdD\.]/g,",").replace(/\s/g,"") : null;
  },


  // [public]
  query: function(){

     var navPlugin=this, flash=FLASH,
       version, obj,
       disabled = navPlugin.hasRun || !$.hasMimeType(flash.mimeType);

     navPlugin.hasRun = 1;
     if (disabled) return navPlugin;

     $.message.write($.message.time(navPlugin.query,1), $.message.end());   // Start measuring time delay
     $.message.write("[ ]", $.message.end());
     $.message.write("[ START flash.navPlugin.query( ) ]", $.message.end());
     

     // Get the plugin object.
     // We require the object.(name/description) to have a number
/*
    Firefox 1.5 Ubuntu 6 Linux (2006)
    description: Shockwave Flash 7.0 r63
    name: Shockwave Flash
    
    Safari/419.3 MacIntel (2007)
    description: Shockwave Flash 9.0 r45
    name: Shockwave Flash
    
    Chrome 22 MacIntel (2012)
    description: Shockwave Flash 11.4 r402
    name: Shockwave Flash

    Firefox 2 WinXP (2007)
    description: Shockwave Flash 9.0 r45
    name: Shockwave Flash
    
    Note: RealPlayer has the word "Flash" in one of its plugins.
    name: RealNetworks(tm) RealDownloader PepperFlashVideoShim Plug-In (32-bit)
    description: RealNetworks(tm) RealDownloader PepperFlashVideoShim Plug-In

*/
     // Search for flash in navigator.plugins.
     // We do NOT look for a number at this point.
     // We search for "Shockwave.*Flash" using a few methods...
     //   a) via navigator.mimeTypes[ mimes ].enabledPlugin
     //   b) via navigator.plugins[ plugins ]
     //   c) enumeration of navigator.plugins[i]
     obj = $.pd.findNavPlugin(
       {find:"Shockwave.*Flash", mimes:flash.mimeType, plugins:["Shockwave Flash"]});

     if (obj)
     {
        navPlugin.installed = 1;
        if (obj.description) version = navPlugin.getNum(obj.description);
     }

     // See if a more accurate plugin version can be detected by looking at obj.version.
     // This gives us the actual version of the dll plugin file.
     if (version) version = $.getPluginFileVersion(obj, version);

     // Try one more time to get more accurate plugin version, by looking at obj.filename.
     // navigator.plugins[i].filename: "NPSWF32_18_0_0_232.dll" gives us a version
     //  of 18,0,0,232.
     //
     if (version && /(\d+[_,]\d+[_,]\d+[_,]\d+)[^\d]+$/.test(obj.filename)){
        version = $.getPluginFileVersion(
         {filename: RegExp.$1, name:obj.name, description:obj.description}, version, 0, "filename");

     }

     if (version){
        navPlugin.version = version;
        navPlugin.precision = flash.getPrecision(version);
     }

     $.message.write("[ ]", $.message.end());
     $.message.write("[ Flash plugin: " +
         (navPlugin.installed ? "installed & enabled" : "not detected") + " ]", $.message.end());
     $.message.write("[ Flash version: " + navPlugin.version + " ]", $.message.end());
     $.message.write("[ Flash version precision: " + navPlugin.precision + " digits ]", $.message.end());
     $.message.write("[ END flash.navPlugin.query( ) in " +
          $.message.time(navPlugin.query) + " ]", $.message.end());

     return navPlugin;

  }  // end of query()

}, // end of navPlugin


BOUNDARY3:"select.pluginCheckbox.flash && select.miscCheckbox.allowactivex",


// Get the Flash version using ActiveX
axo:{

  // == 0 if not called
  // == 1 if called
  hasRun:0,

  // [public]
  // 1, 0
  installed:0,
  
  // [public]
  // Precision of version #
  // Can be 0, 1, 2, 3, 4 digits
  precision:0,

  // [public]
  // Detected plugin version
  // [string/null]
  version:null,


  // Security Pre-Approved ActiveX control for IE
  progID: "ShockwaveFlash.ShockwaveFlash",
  
  classID: "clsid:D27CDB6E-AE6D-11CF-96B8-444553540000",


  // [public]
  query: function(){

     var axo=this,
       version, x, obj,
       disabled = axo.hasRun;

     axo.hasRun = 1;
     if (disabled) return axo;

   // Error testing for $.message.write() method
   //   $.message.write("[ $$$.hgtfytf.yy.message.write ( ]", $.message.end());
   //   $.message.write("[ $$$.hgtfytf.yy.message.end ( ) ) ]", $.message.end());
   //   $.message.write("[ ]");
   //   $.message.write($.message.end(), {})

     $.message.write($.message.time(axo.query,1), $.message.end());   // Start measuring time delay
     $.message.write("[ ]", $.message.end());
     $.message.write("[ START flash.axo.query( ) for ActiveX based browsers ]", $.message.end());

     for (x=0;x<10;x++)
     {
        obj = $.getAXO(axo.progID + (x ? "." + x : ""));
        if (obj)
        {
           axo.installed = 1;

           version = 0;
           try{
             version = $.getNum(obj.GetVariable("$version")+"");
             $.message.write("[ ActiveXObject.GetVariable(\"$version\"): \"" + 
                obj.GetVariable("$version") + "\" ]", $.message.end());
           }
           catch(e){}

           if (version)
           {    axo.version = version;
                axo.precision = FLASH.getPrecision(version);
                if (!$.dbug) break;
           }
        }

     }


     $.message.write("[ ]", $.message.end());
     $.message.write("[ Flash plugin: " +
         (axo.installed ? "installed & enabled" : "not detected") + " ]", $.message.end());
     $.message.write("[ Flash version: " + (axo.version ? axo.version : null) + " ]", $.message.end());
      $.message.write("[ Flash version precision: " + axo.precision + " digits ]", $.message.end());
     $.message.write("[ END flash.axo.query( ) for ActiveX based browsers in " +
          $.message.time(axo.query) + " ]", $.message.end());

     return axo;

  }  // end of query()

},   // end of axo{}


BOUNDARY4:"select.pluginCheckbox.flash",


// We try to get the plugin version by instantiating the plugin in the DOM.
// This is intended for non-IE browsers only.
// It will give all 4 digits of the plugin version.
// However, trying to instantiate the plugin when outdated, may cause some browsers to give
// a security popup.
instance:{


   // == 0 if not called
   // == 1 if called
   hasRun: 0,
   
   // [public]
   // Precision of version #
   // Can be 0, 1, 2, 3, 4 digits
   precision:0,

   // [public]
   // String version if plugin detected
   // null otherwise
   version: null,

   // [public]
   // Holds the instantiated plugin object using <object> tag
   HTML: null,

   // [public]
   // Holds the instantiated plugin object using <embed> tag
   HTML2: null,


   isEnabled:function(){

      var instance=this, flash=FLASH, result=1;

      if (instance.hasRun ||

           // If <object> tag uses ActiveX, then do not insert into DOM.
           // This routine is only intended for non ActiveX browsers,
           // (though ActiveX browser are capable of running this routine).
           //
           // Note: when ActiveX is disabled in IE, and you try to use an <object>
           // tag, you could get a security popup.
           //
           // Note: For IE < 11, there are no items in the the navigator.mimeTypes[] and
           // navigator.plugins[] arrays.
           //
           // Note: For IE 11+, it is possible for a plugin to have items in the
           // navigator.mimeTypes[] and navigator.plugins[] arrays, depending on the
           // plugin installer. When ActiveX is disabled, those items in the array
           // will be removed, assuming the plugin uses ActiveX.
           //
           // Thus, when ActiveX is disabled, there should be no items for this
           // plugin in the navigator.mimeTypes[] array. Hence we would
           // not insert anything into the DOM, because we check for $.hasMimeType(mimeType),
           // as shown below. So we again would avoid any security popup in IE.
           //
           //
           // For some reason, IE 8+ hangs when instantiating this Flash object,
           // unless we include the "src"/"movie" parameter.
           // By hang we mean that window.onload never fires.
           //
           // For non-IE browsers, we do not need to include the "src"/"movie" parameter.
           // swfobject.js does not use "src" parameter for non-IE browsers.
           //
           // We filter out all ActiveX based browsers, since the instance{} is really
           // only intended for non ActiveX browsers anyway.
           $.DOM.isEnabled.objectTagUsingActiveX() ||
           

           // If no <object> tag allowed, then we do not instantiate.
           !$.DOM.isEnabled.objectTag() ||


           // If no mimetypes exists, then we do not insert plugin into DOM.
           // Otherwise we could get a popup in Firefox when the plugin not installed.
           //
           !$.hasMimeType(flash.mimeType)

        ) result = 0;


      return result;

   },  // end of isEnabled()


   // [public]
   // Instantiate the plugin
   query:function(){

      var instance=this, flash=FLASH, tmp,
          enabled=instance.isEnabled();

      instance.hasRun = 1;
      if (enabled)
      {
         $.message.write($.message.time(instance.query,1), $.message.end());   // Start measuring time delay
         $.message.write("[ ]", $.message.end());
         $.message.write("[ START instantiate Flash and query ]", $.message.end());

         // Insert Flash <object> tag to get more accurate Flash version.
         // This method gives more precise version info than the navigator.plugins array.
         //
         instance.HTML = $.DOM.insert("object",
           ["type",flash.mimeType],
           ["play","false", "menu","false"], //"allowScriptAccess","always"],
           "", flash);
         try{
           tmp = instance.HTML.obj().GetVariable("$version") + "";
           instance.version = $.getNum(tmp);
           $.message.write("[ <object>.GetVariable(\"$version\"): \"" + tmp + "\" ]", $.message.end());
         }
         catch(e){}


/*
           Note: it may be possible that the <object> tag does not work for Flash on some 
           wayward browsers. In that case, we could use the <embed> tag.
           
           On the Adobe site...http://www.adobe.com/software/flash/about/
           the following code is used to run a Flash app...

           <object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" 
             codebase="http://fpdownload.macromedia.com/get/shockwave/cabs/flash/swflash.cab#version=7,0,0,0" 
             width="159" height="91" id="flashAbout_small" align="">
             <param name="movie" value="/swf/software/flash/about/flashAbout_info_small.swf" />
             <param name="quality" value="high" />
             <param name="bgcolor" value="#FFFFFF" />
             <param name="wmode" value="opaque" />
             <embed src="/swf/software/flash/about/flashAbout_info_small.swf" 
               quality="high" bgcolor="#FFFFFF" width="159" height="91" 
               wmode="opaque" name="flashAbout_small" align="" 
               type="application/x-shockwave-flash" 
               pluginspage="http://www.adobe.com/go/getflashplayer">
             </embed>
           </object>

           Below we use the <embed> tag.

*/
         if (!instance.version || $.dbug)
         {
            instance.HTML2 = $.DOM.insert("embed",
              ["type",flash.mimeType, "play","false", "menu","false"],
              [],
              "", flash);
            try{
               tmp = instance.HTML2.obj().GetVariable("$version") + "";
               instance.version = $.getNum(tmp);
               $.message.write("[ <embed>.GetVariable(\"$version\"): \"" + tmp + "\" ]", $.message.end());
            }
            catch(e){}

         }


         instance.precision = flash.getPrecision(instance.version);
         
         $.message.write("[ Flash plugin version: " + instance.version + " ]", $.message.end());
         
         $.message.write("[ Flash plugin version precision: " + instance.precision + " digits ]", $.message.end());

         $.message.write("[ END instantiate Flash and query in " +
               $.message.time(instance.query) + " ]", $.message.end());


      }

      return instance;

   }  // end of query()

}, // end of instance{}


BOUNDARY5:"select.pluginCheckbox.flash && select.methodCheckbox.getinfo",


// [public]
getInfo:function(){

   var flash = FLASH, 
     result={

         version: flash.version,

         precision: flash.precision,

         // Points to <object>/<embed> tag for an instantiated Flash object.
         // This allows you to communicate with Flash directly.
       //  flashObj: (flash.instance.HTML2 ? flash.instance.HTML2.obj() : null) ||
       //     (flash.instance.HTML ? flash.instance.HTML.obj() : null)
            
         flashObjUsed: (flash.instance.HTML2 && flash.instance.HTML2.obj()) ||
             (flash.instance.HTML && flash.instance.HTML.obj()) ? true : false

     };


    // Filter out all ActiveX related code
     BOUNDARY("select.pluginCheckbox.flash && select.methodCheckbox.getinfo && select.miscCheckbox.allowactivex");

     result.flashObjUsed = result.flashObjUsed || (flash.axo.version ? true : false);

     BOUNDARY("select.pluginCheckbox.flash && select.methodCheckbox.getinfo");


     return result;

}, // end of getInfo()


BOUNDARY6:"select.pluginCheckbox.flash",


// Property is automatically removed by Script Generator
lastProperty:"select.pluginCheckbox.flash"


};  // end of flash{}


$.addPlugin("flash", FLASH);



// ***************************** End of flash detection *************************





// **********************************************************************************
// Shockwave plugin detection


BOUNDARY("select.pluginCheckbox.shockwave");


var SHOCKWAVE = {


  // Property is automatically removed by Script Generator
  firstProperty:"select.pluginCheckbox.shockwave",

  
  BOUNDARY0:"0",

  // This object assists in creating a custom version of the script for the user.
  script:{

    select:{pluginCheckbox:{shockwave:"Shockwave"}},

    fileNameSuffix:"Shockwave",

    checkboxLabel:"Shockwave",
   
    errCheck:function(code, select){
        if (!select.miscCheckbox.allowactivex &&
             (/\.axo|\.codebase|\.AXO|\.getAXO|\.ActiveX|ActiveXObject/).test(code.customModuleScript)
           )
              alert("Error: ActiveX code found in " + code.moduleName + " module");
    },

    // include:function(select){} tells us which other modules to include when using this module.
    //
    // Do not put $.message/BOUNDARY in the array[] here because they are automatically
    // included/removed from the script as needed.
    //
    // Any items in the outermost array must ALL be included (AND).
    // At least one item in an inner array must be included (OR).
    //
    // For this particular plugin, plugin.getVersion() must be called by either
    // $.isMinVersion or $.getVersion. Hence we use the inner array
    // [$.isMinVersion, $.getVersion] here.
    include:function(){
         return [$.pd, $.getPluginFileVersion, $.hasMimeType, [$.isMinVersion, $.getVersion]]
    }
  }, // end of script{}

  BOUNDARY1:"select.pluginCheckbox.shockwave",


// [public]
// Get Shockwave version
getVersion: function(){

   // If Shockwave not found, then return null
   // Else return Shockwave version # x.y.z
   //

   var shockwave=this, version=null, installed;

  
   if ((!installed || $.dbug) && shockwave.nav.query().installed) installed = 1;
   if ((!version || $.dbug) && shockwave.nav.query().version) version = shockwave.nav.version;


   BOUNDARY("select.pluginCheckbox.shockwave && select.miscCheckbox.allowactivex");

   if ((!installed || $.dbug) && shockwave.axo.query().installed) installed = 1;
   if ((!version || $.dbug) && shockwave.axo.query().version) version = shockwave.axo.version;

   BOUNDARY("select.pluginCheckbox.shockwave");


   shockwave.installed = version ? 1 : (installed ? 0 : -1);

   shockwave.version = $.formatNum(version);

},  // end of getVersion()
  

// Get the Shockwave version from navigator arrays.
nav:{

  // == 0 if not called
  // == 1 if called
  hasRun:0,

  // 1, 0
  installed:0,

  // Detected plugin version
  // [string/null]
  version:null,

  mimeType: "application/x-director",


  query: function(){

     var nav=this, 
        version, obj,
        disabled = nav.hasRun || !$.hasMimeType(nav.mimeType);

     nav.hasRun = 1;
     if (disabled) return nav;


     $.message.write($.message.time(nav.query,1), $.message.end());   // Start measuring time delay
     $.message.write("[ ]", $.message.end());
     $.message.write("[ START search navigator.plugins[ ] for Shockwave ]", $.message.end());

     // Get plugin obj, but do not require numbers in the result.
     //
     // Firefox, WinXP
     // A.enabledPlugin.name: Shockwave for Director
     // A.enabledPlugin.description: Adobe Shockwave for Director Netscape plug-in, version 12.0.2.122
     // A.enabledPlugin.filename: np32dsw_1202122.dll
     // A.enabledPlugin.version: 12.0.2.122
     obj = $.pd.findNavPlugin({find:"Shockwave\\s*for\\s*Director",
           mimes:nav.mimeType, plugins:"Shockwave for Director"});

     // Attempt # 1 to get the plugin version
     if (obj && obj.description) version = $.getNum(obj.description + "");

     // Attempt # 2 to get the plugin version.
     //
     // See if a more accurate plugin version can be detected by looking at p.version.
     // This gives us the actual version of the dll plugin file.
     if (version) version = $.getPluginFileVersion(obj, version);



     if (obj) nav.installed = 1;
     if (version) nav.version = version;
     

     $.message.write("[ ]", $.message.end());
     $.message.write("[ Shockwave installed: " + (nav.installed ? "true" : "false")  + " ]", $.message.end());
     $.message.write("[ Shockwave version: " + nav.version + " ]", $.message.end());
     $.message.write("[ END search navigator.plugins[ ] for Shockwave in " +
          $.message.time(nav.query) + " ]", $.message.end());

     return nav;

  } // end of query()


}, // end of nav{}


BOUNDARY3:"select.pluginCheckbox.shockwave && select.miscCheckbox.allowactivex",


// Look at ActiveX objects to detect Shockwave.
// Works for Shockwave 7+.
axo:{

   // == 0 if not called
   // == 1 if called
   hasRun: 0,

   // == 1 if installed
   // == 0, null otherwise
   installed:null,

   // Shockwave version [string/null]
   version:null,
   
   // pre-Approved ActiveX controls for Shockwave
   progID: ["SWCtl.SWCtl", "SWCtl.SWCtl.1", "SWCtl.SWCtl.7", "SWCtl.SWCtl.8",
     "SWCtl.SWCtl.11", "SWCtl.SWCtl.12"],

   classID: "clsid:166B1BCA-3F9C-11CF-8075-444553540000",


   query:function(){
     
      var axo=this, obj, x,
          version, queryStr, revision,
          enabled = !axo.hasRun;
      
      axo.hasRun = 1;
      if (enabled)
      {
         $.message.write($.message.time(axo.query,1), $.message.end());   // Start measuring time delay
         $.message.write("[ ]", $.message.end());
         $.message.write("[ START ActiveX Shockwave query ]", $.message.end());


         for (x=0;x<axo.progID.length;x++)
         {
            obj = $.getAXO(axo.progID[x]);
            if (obj)
            {
               axo.installed=1;
               queryStr="";

               try{
                 queryStr=obj.ShockwaveVersion("") + "";
                 $.message.write(queryStr && queryStr.length ? 
                    "[ axo.ShockwaveVersion(\"\"): " + queryStr + " ]" : 0, $.message.end());
               }
               catch(e){}

               if ((/(\d[\d\.\,]*)(?:\s*r\s*(\d+))?/i).test(queryStr))
               {
                  revision = RegExp.$2;
                  version = $.formatNum(RegExp.$1);

                  if (revision)
                  {  version = version.split($.splitNumRegx);
                     version[3] = revision;
                     version = version.join(",");
                  }

               }
               
               if (version)
               {  axo.version = version;
                  if (!$.dbug) break;
               }

            }

         }  // end of x loop


         $.message.write("[ installed: " + (axo.installed ? "true" : "false") + " ]", $.message.end());
         $.message.write("[ version: " + axo.version + " ]", $.message.end());

         $.message.write("[ END ActiveX Shockwave query in " +
               $.message.time(axo.query) + " ]", $.message.end());

      }

      return axo;

   } // end of query()

},  // end of axo{}


BOUNDARY4:"select.pluginCheckbox.shockwave",


// Property is automatically removed by Script Generator
lastProperty:"select.pluginCheckbox.shockwave"


};  // end of shockwave{}


$.addPlugin("shockwave", SHOCKWAVE);



// ************************ End of shockwave detection **************************





// *********************************************************************************
/*
 Windows Media Player plugin detection

 We can detect the WMP plugin version for Internet Explorer, and sometimes for
 Firefox (when the Windows Media Player Firefox Plugin is installed).


 There are 2 versions of the WMP plugin for non-IE browsers:
  1) The old version, which is is automatically included on old versions of Windows,
     up to and including some versions of WinXP.
  2) The newer WMP Firefox plugin, which only appears to run on WinXP and above.
     This plugin is not included with the OS. You have to download and install it
     yourself in order to use it.

 See:
   http://kb.mozillazine.org/Windows_Media_Player
   http://support.mozilla.com/en-US/kb/Using%20the%20Windows%20Media%20Player%20plugin%20with%20Firefox

   http://windows.microsoft.com/en-US/windows/downloads/windows-media-player
   http://windows.microsoft.com/en-US/windows/products/windows-media-player/wmcomponents


*/


BOUNDARY("select.pluginCheckbox.windowsmediaplayer");


var WINDOWSMEDIAPLAYER = {
  
  
  // Property is automatically removed by Script Generator
  firstProperty:"select.pluginCheckbox.windowsmediaplayer",


  BOUNDARY0:"0",

  // This object assists in creating a custom version of the script for the user.
  script:{

    select:{pluginCheckbox:{windowsmediaplayer:"WindowsMediaPlayer"}},

    fileNameSuffix:"WMP",

    checkboxLabel:"Windows Media Player",

    errCheck:function(code, select){
        if (!select.miscCheckbox.allowactivex &&
             (/\.axo|\.codebase|\.AXO|\.getAXO|\.ActiveX|ActiveXObject/).test(code.customModuleScript)
           )
              alert("Error: ActiveX code found in " + code.moduleName + " module");
    },


    // include:function(select){} tells us which other modules to include when using this module.
    //
    // Do not put $.message/BOUNDARY in the array[] here because they are automatically
    // included/removed from the script as needed.
    //
    // Any items in the outermost array must ALL be included (AND).
    // At least one item in an inner array must be included (OR).
    //
    // For this particular plugin, plugin.getVersion() must be called by either
    // $.isMinVersion or $.getVersion. Hence we use the inner array
    // [$.isMinVersion, $.getVersion] here.
    include:function(){
         return [$.pd, $.DOM, $.hasMimeType, [$.isMinVersion, $.getVersion]]
    }
  }, // end of script{}

  BOUNDARY1:"select.pluginCheckbox.windowsmediaplayer",



  // Set the status of the plugin.
  // We set wmp.version, wmp.installed
  //
  setPluginStatus: function(version, installed)
  {
     var wmp=this;

     $.message.write("[ ]", $.message.end());
     $.message.write("[ START Setting plugin status for WMP ]", $.message.end());


     if (version) wmp.version = $.formatNum(version);

     wmp.installed = wmp.version ? 1 : (installed ? 0 : -1);


     // == 1 means wmp.getVersion() does not need to be called again
     // == 0 means wmp.getVersion() is allowed to be called again.
     //
     // If WMP was detected, but WMP version was NOT detected, then we allow
     // wmp.getVersion() to run again.
     wmp.getVersionDone = wmp.installed===0 ? 0 : 1;


     $.message.write("[ wmp.installed: " + wmp.installed + " ]", $.message.end());
     $.message.write("[ wmp.version: " + wmp.version + " ]", $.message.end());
     $.message.write("[ wmp.getVersionDone: " + wmp.getVersionDone + " ]", $.message.end());
     $.message.write("[ END Setting plugin status for WMP ]", $.message.end());
     $.message.write("[ ]", $.message.end());


  },  // end of setPluginStatus()

// [public]
// Get WMP version
// @instantiate input arg will try to force wmp.FirefoxPlugin{} to run for non-IE browsers.
getVersion: function(dummy, instantiate){

    var wmp=this,
      installed, version=null;


    // Detection Attempt # 1
    if ((!installed || $.dbug) && wmp.nav.query().installed) installed = 1;


    BOUNDARY("select.pluginCheckbox.windowsmediaplayer && select.miscCheckbox.allowactivex");

    // Detection Attempt # 2
    if ((!installed || $.dbug) && wmp.axo.query().installed) installed = 1;
    if ((!version || $.dbug) && wmp.axo.query().version) version = wmp.axo.version;

    BOUNDARY("select.pluginCheckbox.windowsmediaplayer");


    $.message.write(instantiate ? "[ User input specifies that for non-IE browsers, " +
      "the plugin will be inserted into DOM and queried. ]" : 0, $.message.end());


    // Detection Attempt # 3
    //
    // This is for non-IE browsers only. We insert WMP into the DOM and query
    // to get the plugin version.
    // There is a chance that trying to run an outdated WMP player could cause a
    // security popup in your browser.
    //
    // So we only run this routine in limited cases.
    if (((!installed && !version) || instantiate || $.dbug) && wmp.FirefoxPlugin.query().version)
    {
       installed = 1;
       version = wmp.FirefoxPlugin.version;
    }


    wmp.setPluginStatus(version, installed);


},  // end of getVersion()


// These mimetypes are not necessarily unique to Windows Media Player.
// They can be hijacked by other players, possibly.
// But, they are specific to Windows Media Player.
//
// Note: the mimetype "application/x-ms-wmp" was specifically added for the
// new WMP Firefox plugin by Microsoft. When instantiating the WMP, we try to use
// this mimetype specifically, to avoid any potential conflict between the old
// and new WMP plugins.
//   In case the STANDARD and the NEW WMP plugin are both enabled in the browser,
// we try to use this specific mimetype when instantiating the WMP. This will
// ensure that we are instantiating using the new plugin only.
//  For this reason, we list this mimetype FIRST, so when we instantiate, we
// obtain an active mimetype using "$.hasMimeType(FFplugin.mimeType).type".
//
// The WMP Firefox plugin is scriptable so we can query it for the plugin version.
mimeType: ["application/x-ms-wmp", "application/asx", "application/x-mplayer2",
        "video/x-ms-asf", "video/x-ms-wm", "video/x-ms-asf-plugin"],


find:[
    // Regular expression string used to detect WMP Firefox Plugin
    //
    // New Firefox WMP plugin...
    // name: Microsoft® Windows Media Player Firefox Plugin
    // description: np-mswmp
    //
    // Note: the new WMP Firefox plugin needs to be FIRST in this array.
    "Microsoft.*Windows\\s*Media\\s*Player.*Firefox.*Plug-?in",

    // Regular expression string used to detect the ORIGINAL Windows Media Player for
    // non-IE browsers. The original WMP is on Windows only : WinXP and lower.
    // This is a very old plugin.
    //
    // Original WMP plugin, Firefox, WinXP
    // name: Windows Media Player Plug-in Dynamic Link Library
    // description: Npdsplay dll
    "Windows\\s*Media\\s*Player\\s*Plug-?in\\s*Dynamic\\s*Link\\s*Library",

    // On Macintosh, we look for Flip4Mac.
    // Flip4Mac is the "official" Windows Media player for Macintosh.
    //
    // name: Flip4Mac Windows Media Plugin 2.2.3
    // description: The Flip4Mac WMV Plugin allows you to view Windows Media content using QuickTime.
    // filename: Flip4Mac WMV Plugin.plugin
    // version: 2.2.3.7
    //
    "Flip4Mac.*Windows\\s*Media.*Plug-?in|Flip4Mac.*WMV.*Plug-?in"
],


// These players we specifically try to filter out
// to avoid being confused with the genuine WMP plugin.
// Note: This is most likely not even necessary, since the find:"" string
// is highly specific, and should filter out pretty much all other
// 3rd party media players that handle Windows Media.
avoid: "Totem|VLC|RealPlayer|Helix",


plugins:[
// This string is used for detection via window.navigator.plugins[...].
// We CANNOT use "Microsoft® Windows Media Player Firefox Plugin" here,
// because the "®" is not the correct character.
// navigator.plugins["Microsoft® Windows Media Player Firefox Plugin"] will NOT work.
// However, this WILL work:
//   navigator.plugins["Microsoft" + String.fromCharCode(174) +  " Windows Media Player Firefox Plugin"]
//
// Note: the new WMP Firefox plugin needs to be FIRST in this array.
   "Microsoft" + String.fromCharCode(174) + " Windows Media Player Firefox Plugin",

   "Windows Media Player Plug-in Dynamic Link Library"
],




/*

 Detect the STANDARD ORIGINAL Windows Media Player in navigator arrays,
 or the new Windows Media Player Firefox plugin.


 From http://kb.mozillazine.org/Windows_Media_Player ...

 Standard WMP plugin: In Windows XP and earlier, the WMP plugin file "npdsplay.dll" and
 related plugin files are normally included in the Windows Media Player program folder. 
 The WMP plugin is automatically detected through plugin scanning and will be used by 
 Mozilla applications for embedded media that require the WMP plugin. 
 Important: Microsoft Security Bulletin MS06-006 (February 2006) reported a vulnerability 
 in the standard Windows Media Player plugin file "npdsplay.dll" on Windows 2000 and 
 Windows XP systems, that could result in remote code execution when using 
 non-Microsoft web browsers. The "Security Update for Windows Media Player Plug-in (KB911564)", 
 available from Windows Update or from the download links given in the security bulletin, 
 updates the file "npdsplay.dll" 
 (normally located in the C:\Program Files\Windows Media Player folder) to version 3.0.2.629. 
 If your system includes the standard WMP plugin, make sure that it is the updated version 
 of this file.

 Restoring the standard plugin...

 The standard WMP plugin will work on most Windows versions and Mozilla-based browsers 
 but it may be missing functionality that the new WMP plugin offers. You can restore the
 standard WMP plugin files that are normally included on most Windows XP and earlier operating 
 systems. To check for these files, type about:plugins into the location bar. There should be 
 an entry for "Windows Media Player Plug-in Dynamic Link Library" (File name: npdsplay.dll) and 
 two entries for Microsoft® DRM (File name: npdrmv2.dll and File name: npwmsdrm.dll). If you
 do not see these files, follow these steps:

  1. If some or all of the files are missing, you can download the individual files from
  dlldump.com and place them in the Windows Media Player directory
  (usually C:\Program Files\Windows Media Player):
        npdsplay.dll: http://www.dlldump.com/download-dll-files_new.php/dllfiles/N/npdsplay.dll/3.0.2.629/
        npwmsdrm.dll: http://www.dlldump.com/download-dll-files_new.php/dllfiles/N/npwmsdrm.dll/9.00.00.3250/
        npdrmv2.dll: http://www.dlldump.com/download-dll-files_new.php/dllfiles/N/npdrmv2.dll/9.00.00.32508/
  
  2. Reopen your browser and see if the WMP plugin is now working. If it isn't, follow
  these additional steps:
  
  3. A Windows Media Player Plug-in for Netscape Navigator installer (not supported on 
  Windows Vista) can be downloaded here and should resolve the issue [17] but the 
  included files are older versions. After running the installer, copy the more recent 
  versions of npdsplay.dll, npdrmv2.dll and npwmsdrm.dll from dlldump.com to the 
  Windows Media Player directory, if they were replaced by older versions.
  
  4. If the Windows Media Player plugin still does not work, copy the npdsplay.dll, 
  npdrmv2.dll and npwmsdrm.dll files to the installation directory plugins folder; 
  for example, to the C:\Program Files\Mozilla Firefox\plugins folder in Firefox.


 New WMP plugin for Windows XP and above: Windows 7/Vista and some versions of Windows XP do
 not include the standard WMP plugin. Microsoft's Technet division has developed a new 
 Windows Media Player Firefox Plugin (file name "np-mswmp.dll") for Windows XP and above. 
 This new plugin can be installed to solve a missing plugin issue (see below) or to take
 advantage of its new features (e.g., scripting support) on systems that already include 
 the standard WMP plugin. Instructions for installing the new WMP plugin in Firefox or 
 another browser are given below.

 Firefox and SeaMonkey users on Windows XP or above can install the Windows Media Player 
 Firefox Plugin provided by Microsoft. To install this plugin, download the installer file 
 to your computer, then close your browser and run the installer. The plugin installer adds 
 the file "np-mswmp.dll" to the Firefox installation directory "plugins" folder, typically 
 C:\Program Files\Mozilla Firefox\plugins or, on 64-bit Windows, 
 C:\Program Files (x86)\Mozilla Firefox\plugins. Starting in Firefox 4, the "plugins" folder 
 does not exist by default but is created as needed.

 If you need to copy the plugin from another location, you can manually create a new "plugins" 
 folder within the installation directory for your Mozilla application and then copy 
 "np-mswmp.dll" to the plugins folder you created. For example, for SeaMonkey on 64-bit Windows, 
 copy "np-mswmp.dll" to the "C:\Program Files (x86)\SeaMonkey\plugins" folder. 
 (In Mozilla/Firefox 21 and above, you will need to create a new "browser" folder and, 
 inside that, a "plugins" folder, or else you will need to set plugins.load_appdir_plugins 
 to true in about:config.)

 Windows 7 users can install the HTML5 Extension for Windows Media Player Firefox Plug-in,
 which adds an extension that allows playback of H.264-encoded videos and additionally
 installs the WMP plugin by creating a C:\Users\<username>\AppData\Roaming\Mozilla\plugins
 folder and placing the file "np-mswmp.dll" in that location.


*/
nav:{

  // == 0 if not called
  // == 1 if called
  hasRun:0,

  // 1, 0
  installed:0,


  query: function(){

     var nav=this, wmp=WINDOWSMEDIAPLAYER,
        obj,
        disabled = nav.hasRun || !$.hasMimeType(wmp.mimeType);

     nav.hasRun = 1;
     if (disabled) return nav;


     $.message.write($.message.time(nav.query,1), $.message.end());   // Start measuring time delay
     $.message.write("[ ]", $.message.end());
     $.message.write("[ START search navigator.plugins[ ] for Windows Media Player ]", $.message.end());


     // Get navigator.plugins object for Windows Media Player.
     // We do NOT look for a version # during this search.
     obj = $.pd.findNavPlugin({find:wmp.find.join("|"), avoid:wmp.avoid,
         mimes:wmp.mimeType, plugins:wmp.plugins});


     if (obj) nav.installed = 1;


     $.message.write("[ ]", $.message.end());
     $.message.write("[ installed: " + (nav.installed ? "true" : "false") + " ]", $.message.end());
     $.message.write("[ END search navigator.plugins[ ] for Windows Media Player in " +
          $.message.time(nav.query) + " ]", $.message.end());

     return nav;

  } // end of query()


}, // end of nav{}


/*

 We try to get the WMP plugin version by instantiating the WMP Firefox plugin.
 The Firefox plugin will only run on WinXP or later.
 
 Running this may cause your browser to give a security popup asking for permission
 to run an outdated plugin.

*/
FirefoxPlugin:{

     // == 0 if not called
     // == 1 if called
     hasRun: 0,

     // Detected Windows Media Player version
     // [string/null]
     version: null,


     // Return 1 when detection is disabled
     // Return 0 when detection is enabled
     //
     // We will exclude certain browsers from this instantiation for various reasons.
     // There is no need to check which operating system they are on, since we are
     // checking for the WMP Firefox plugin mimetype, which will only be present
     // on Windows.
     isDisabled: function(){

       var FFplugin=this, wmp=WINDOWSMEDIAPLAYER, browser=$.browser;

       if (
            FFplugin.hasRun ||


            // We need to exclude older Gecko browsers to prevent a plugin crash when
            // instantiating the WMP Firefox plugin.
            // So, we exclude browser.verGecko < "1.8"
            (browser.isGecko && $.compareNums(browser.verGecko, $.formatNum("1.8")) < 0) ||
         

            // We exclude older versions of Opera.
            // For Opera 9.00 I have seen the browser crash when instantiating Firefox WMP plugin
            // using application/x-ms-wmp" mimetype in some cases. And besides, the plugin
            // is not scriptable for Opera 9 anyway. So there is no point in instantiating
            // anyway for Opera < 10.
            (browser.isOpera && $.compareNums(browser.verOpera, $.formatNum("10")) < 0) ||


            // If <object> tag uses ActiveX, then do not insert into DOM.
            // This routine is only intended for non ActiveX browsers,
            //
            // Note: when ActiveX is disabled in IE, and you try to use an <object>
            // tag, you could get a security popup.
            //
            // Note: For IE < 11, there are no items in the the navigator.mimeTypes[] and
            // navigator.plugins[] arrays.
            //
            // Note: For IE 11+, it is possible for a plugin to have items in the
            // navigator.mimeTypes[] and navigator.plugins[] arrays, depending on the
            // plugin installer. When ActiveX is disabled, those items in the array
            // will be removed, assuming the plugin uses ActiveX.
            //
            // Thus, when ActiveX is disabled, there should be no items for this
            // plugin in the navigator.mimeTypes[] array. Hence we would
            // not insert anything into the DOM, because we also check for $.hasMimeType(mimeType)
            // So we again would avoid any security popup in IE.
            //
            // We filter out all ActiveX based browsers, since the instance{} is really
            // only intended for non ActiveX browsers anyway.
            $.DOM.isEnabled.objectTagUsingActiveX() ||
            
            !$.hasMimeType(wmp.mimeType) ||

            // We avoid looking for nums
            // Also, we only use find[0] and plugins[0] because we
            // specifically are only interested in the new WMP Firefox Plugin,
            // not the old WMP plugin.
            !$.pd.findNavPlugin({find:wmp.find[0], avoid:wmp.avoid,
                mimes:wmp.mimeType, plugins:wmp.plugins[0]})

         ) return 1;    // disabled
         

         return 0;


     }, // end of isDisabled()


     query: function(){

        var FFplugin=this, wmp=WINDOWSMEDIAPLAYER, version,
            disabled = FFplugin.isDisabled();

        FFplugin.hasRun = 1;
        if (disabled) return FFplugin;

        $.message.write($.message.time(FFplugin.query,1), $.message.end());  // Start measuring time delay
        $.message.write("[ ]", $.message.end());
        $.message.write("[ START Windows Media Player Firefox Plugin query ]", $.message.end());
        
        // Insert dummy <div><object ...>...</object></div> into <body> to test the plugin.
        // We intentionally avoid using data="data:" + wmp.mimeType[0] + ","
        //  because otherwise it will not get the version # in Firefox 3 beta.
        // It seems that data="data:" generally prevents WMP object from instantiating,
        // so we should not use that.
        //
        // Instead, we just use data="" and src=""
        // See http://mikeknowles.com/blog/2009/06/16/MultipleBrowserWindowsMediaPlayerObjectTag.aspx
        //
        // An example of an <object> tag used for WMP would be:
        // <object type="application/x-ms-wmp" width="500" height="330" data="/download/video.wmv">
        // <param name="src" value="/download/video.wmv" />
        // <param name="autoStart" value="true" />
        // WMP not installed
        // </object>
        version = $.pd.getPROP(
             $.DOM.insert("object", 
                 ["type", $.hasMimeType(wmp.mimeType).type, "data",""],
                 ["src",""], "", wmp).obj(),
             "versionInfo");
                   

        if (version) FFplugin.version = $.getNum(version);


        $.message.write("[ version: " + FFplugin.version + " ]", $.message.end());
        $.message.write("[ END Windows Media Player Firefox Plugin query in " + 
           $.message.time(FFplugin.query) + " ]", $.message.end());

        $.message.write("[ ]", $.message.end());


        return FFplugin;


     } // end of query()
  

},  // end of FirefoxPlugin{}


BOUNDARY3:"select.pluginCheckbox.windowsmediaplayer && select.miscCheckbox.allowactivex",


// Look at ActiveX objects to detect Windows Media Player
axo:{


   // == 0 if not called
   // == 1 if called
   hasRun: 0,

   // == 1 if installed
   // == 0, null otherwise
   installed:null,

   // WMP version [string/null]
   version:null,
   
   // pre-Approved controls for WMP
   // This appears to work for WMP 7 and higher, and is a preApproved ActiveX control
   // Note, we could also add "WMPlayer.OCX.7" here just to be complete.
   progID: ["WMPlayer.OCX", "WMPlayer.OCX.7"],

   // This is the security pre-approved activex control.
   //
   // There seem to be additional ActiveX controls with other classids associated with WMP.
   // They seem to be involved when embedding media into a web page. They
   // do not appear to be pre-approved, and may cause a security popup.
   // They appear to be involved with various mimetypes for the <object> tag.
   // For example, the mimetypes "application/x-mplayer2", "video/x-ms-asf", "video/x-ms-asf-plugin"
   // are associated with "clsid:CD3AFA8F-B84F-48F0-9393-7EDC34128127".
   // Other wmp mimetypes seem to have other classids as well.
   // See the REGISTRY key:
   // [HKEY_LOCAL_MACHINE\SOFTWARE\Classes\MIME\Database\Content Type\...]
   // for other WMP mimetypes and their classids.
   // I am not entirely sure at the moment, but it could be that Microsoft has
   // assigned a unique classid for each particular codec used by the WMP.
   // A given WMP codec is associated with a mimetype and a classid.
   classID: "clsid:6BF52A52-394A-11D3-B153-00C04F79FAA6",


   query:function(){

      var axo=this,
          obj, x, version,
          enabled = !axo.hasRun;
      
      axo.hasRun = 1;
      if (enabled)
      {
         $.message.write($.message.time(axo.query,1), $.message.end());   // Start measuring time delay
         $.message.write("[ ]", $.message.end());
         $.message.write("[ START ActiveX Windows Media Player query ]", $.message.end());


         for (x=0;x<axo.progID.length;x++)
         {
           obj = $.getAXO(axo.progID[x]);

           if (obj)
           {  axo.installed = 1;

              // versionInfo property appears to work for Windows Media Player 7+
              version = $.pd.getPROP(obj, "versionInfo", 0);

              if (version) version=$.getNum(version);

              if (version)
              {  axo.version = version;
                 if (!$.dbug) break;
              }

           }

         }


         $.message.write("[ installed: " + (axo.installed ? "true" : "false") + " ]", $.message.end());
         $.message.write("[ version: " + axo.version + " ]", $.message.end());

         $.message.write("[ END ActiveX Windows Media Player query in " +
               $.message.time(axo.query) + " ]", $.message.end());

      }

      return axo;

   } // end of query()

},  // end of axo{}



BOUNDARY4:"select.pluginCheckbox.windowsmediaplayer && select.methodCheckbox.getinfo",


result:0,

// [public]
// Return extra info on the WMP plugin.
getInfo: function(){

  var wmp=this, status=wmp.installed;

  if (!wmp.result)
  {
     wmp.result={

       BOUNDARY0:"select.pluginCheckbox.windowsmediaplayer && select.methodCheckbox.getinfo && select.miscCheckbox.allowactivex",

       ActiveXPlugin: !!(wmp.axo.version),

       BOUNDARY1:"select.pluginCheckbox.windowsmediaplayer && select.methodCheckbox.getinfo",

       FirefoxPlugin: !!((status===0 || status==1) &&
          $.pd.findNavPlugin({find:wmp.find[0], avoid:wmp.avoid,
          mimes:wmp.mimeType, plugins:wmp.plugins[0]})),

       DllPlugin: !!((status===0 || status==1) &&
            $.pd.findNavPlugin({find:wmp.find[1], avoid:wmp.avoid,
            mimes:wmp.mimeType, plugins:wmp.plugins[1]})),

       Flip4macPlugin: !!((status===0 || status==1) &&
            $.pd.findNavPlugin({find:wmp.find[2], avoid:wmp.avoid,
            mimes:wmp.mimeType, plugins:1}))


     }; // end of result{}


     // When PluginDetect gives a version # for the WMP plugin, or the Firefox plugin 
     // is installed, then this means that the plugin is installed and that you can 
     // interact with the player using Javascript to control it.
     wmp.result.Scriptable = !!(status==1 || wmp.result.FirefoxPlugin);

  }


  $.message.write(wmp.result ? 
     "[ " + $.name + ".getInfo(\"" + wmp.pluginName + "\").FirefoxPlugin: " +
     wmp.result.FirefoxPlugin + " ]" : 0, $.message.end());
  $.message.write(wmp.result ? 
     "[ " + $.name + ".getInfo(\"" + wmp.pluginName + "\").DllPlugin: " +
     wmp.result.DllPlugin + " ]" : 0, $.message.end());
  $.message.write(wmp.result ? 
     "[ " + $.name + ".getInfo(\"" + wmp.pluginName + "\").Flip4macPlugin: " +
     wmp.result.Flip4macPlugin + " ]" : 0, $.message.end());
  $.message.write(wmp.result ? 
     "[ " + $.name + ".getInfo(\"" + wmp.pluginName + "\").ActivexPlugin: " +
     wmp.result.ActivexPlugin + " ]" : 0, $.message.end());
  $.message.write(wmp.result ?
     "[ " + $.name + ".getInfo(\"" + wmp.pluginName + "\").Scriptable: " +
     wmp.result.Scriptable + " ]" : 0, $.message.end());

  return wmp.result;

},  // end of getInfo()


BOUNDARY5:"select.pluginCheckbox.windowsmediaplayer",


// Property is automatically removed by Script Generator
lastProperty:"select.pluginCheckbox.windowsmediaplayer"


};  // end of windowsmediaplayer{}


$.addPlugin("windowsmediaplayer", WINDOWSMEDIAPLAYER);


// ********************** End of Windows Media Player detection *************************





// **********************************************************************************
/*
   Silverlight plugin detection

   It appears that Silverlight is a preapproved ActiveX control. Good.
   If you have never installed Silverlight, and you instantiate the ActiveX control,
   will you get a security bar popup in Internet Explorer?  No. (Good)
   And when it IS installed, it is preApproved. So again, no security popup.

*/

BOUNDARY("select.pluginCheckbox.silverlight");


var SILVERLIGHT = {


  // Property is automatically removed by Script Generator
  firstProperty:"select.pluginCheckbox.silverlight",


  BOUNDARY0:"0",

  // This object assists in creating a custom version of the script for the user.
  script:{

    select:{pluginCheckbox:{silverlight:"Silverlight"}},

    fileNameSuffix:"Silver",

    checkboxLabel:"Silverlight",

    errCheck:function(code, select){
        if (!select.miscCheckbox.allowactivex &&
             (/\.axo|\.codebase|\.AXO|\.getAXO|\.ActiveX|ActiveXObject/).test(code.customModuleScript)
           )
              alert("Error: ActiveX code found in " + code.moduleName + " module");
    },

    // include:function(select){} tells us which other modules to include when using this module.
    //
    // Do not put $.message/BOUNDARY in the array[] here because they are automatically
    // included/removed from the script as needed.
    //
    // Any items in the outermost array must ALL be included (AND).
    // At least one item in an inner array must be included (OR).
    //
    // For this particular plugin, plugin.getVersion() must be called by either 
    // $.isMinVersion or $.getVersion. Hence we use the inner array
    // [$.isMinVersion, $.getVersion] here.
    include:function(){
         return [$.pd, $.hasMimeType, [$.isMinVersion, $.getVersion]] 
    }
  }, // end of script{}

  BOUNDARY1:"select.pluginCheckbox.silverlight",



  // [public]
  //
  // Get Silverlight version
  //
  // We cannot rely on the navigator array to give us the plugin version,
  // because the first digit may not b correct.
  // For Silverlight 2 beta 1, the plugins array says the version is 1.xxx.yyy.zzz
  // when it should say 2.xxx.yyy.zzz.
  //
  //
  // Also for IE, the codebase version technique may not work work properly due
  // to a bug with Silverlight.
  //
  // Hence, we must instantiate the plugin, and query it to get the version #.
  // The Opera browser does not seem to allow us to query the plugin to get the
  // version #, however.
  //
  // The Silverlight build numbers are xMMDD - last year x was '2' and this year it is '3'.
  // So if you get the current date you could determine the highest possible build
  // that could exist (e.g. today would be 1.0.30308 for a Silverlight 1.0
  // servicing release or 2.0.30308 for an updated Silverlight 2 Beta release
  getVersion: function(){

    var silver=this,
      version = null, installed=0;


    if ((!installed || $.dbug) && silver.nav.query().installed) installed = 1;
    if ((!version || $.dbug) && silver.nav.query().version) version = silver.nav.version;


    BOUNDARY("select.pluginCheckbox.silverlight && select.miscCheckbox.allowactivex");

    if ((!installed || $.dbug) && silver.axo.query().installed) installed = 1;
    if ((!version || $.dbug) && silver.axo.query().version) version = silver.axo.version;

    BOUNDARY("select.pluginCheckbox.silverlight");


    silver.version = $.formatNum( version );

    silver.installed = version ? 1 : (installed ? 0 : -1);



}, // end of getVersion()

// Get the Silverlight version from navigator arrays
nav:{

  // == 0 if not called
  // == 1 if called
  hasRun:0,

  // 1, 0
  installed:0,

  // Detected plugin version
  // [string/null]
  version:null,

  mimeType: ["application/x-silverlight", "application/x-silverlight-2"],


  query: function(){

     var nav=this,
        result, version, obj,
        disabled = nav.hasRun || !$.hasMimeType(nav.mimeType);

     nav.hasRun = 1;
     if (disabled) return nav;


     $.message.write($.message.time(nav.query,1), $.message.end());   // Start measuring time delay
     $.message.write("[ ]", $.message.end());
     $.message.write("[ START search navigator.plugins[ ] for Silverlight ]", $.message.end());


     // Get plugin obj, but do not require numbers in the result.
     //
     // Firefox, WinXP
     // A.enabledPlugin.name: Silverlight Plug-In
     // A.enabledPlugin.description: 5.1.20125.0
     //
     obj = $.pd.findNavPlugin({find:"Silverlight.*Plug-?in",
          mimes:nav.mimeType, plugins:"Silverlight Plug-In"});


     if (obj) nav.installed = 1;

     // If we get this far, then the Silverlight plugin is installed.
     // Now we get the plugin version.
     if (obj && obj.description) version = $.formatNum($.getNum(obj.description + ""));


     // The problem with using plugin.description is that the number gives an
     // incorrect result for Silverlight 2 beta 1. The very first digit is incorrect.
     // We could try to force the digit to be the correct way.
     // Is there an elegant way to make sure the first digit is correct?
     if (version)
     {
           result = version.split($.splitNumRegx);

           // 30226 is the date of release for Silverlight 2 beta 1 (year 3, month 02, day 26)
           // plugin.description INCORRECTLY gives "1,0,30226,2" instead of "2,0,30226,2"
           // so we check for that, and correct it.
           if (parseInt(result[0],10)<2 && parseInt(result[2],10) >= 30226) result[0]="2";

           version = result.join(",");
     }


     if (version) nav.version = version;
     

     $.message.write("[ ]", $.message.end());
     $.message.write("[ Silverlight installed: " + (nav.installed ? "true" : "false") + " ]", $.message.end());
     $.message.write("[ Silverlight version: " + nav.version + " ]", $.message.end());
     $.message.write("[ END search navigator.plugins[ ] for Silverlight in " +
          $.message.time(nav.query) + " ]", $.message.end());

     return nav;

  } // end of query()


}, // end of nav{}


BOUNDARY3: "select.pluginCheckbox.silverlight && select.miscCheckbox.allowactivex",


// Get the Silverlight version using ActiveX.
// This routine searches for the plugin version # using a brute force method.
//
//
/*  Email message from Silverlight developer :

  The versions of Silverlight released at MIX'07 last year (0.90 and 0.95 for what
  became 1.0 and the 1.1 alpha respectively)  as well as the prior CTP releases 
  were all less than version 1.0 but all were timebombed and the timebomb expired 
  last year. Additionally the Release Candidates released in July and 
  early August (build number less than 20816) were also timebombed and have
  also expired. The earliest releases didn't have the IsVersionSupported
  method and for those that did, the timebomb will keep the control from
  responding to the method.

 

  In addition to the Silverlight 2 Beta 1 released at MIX'08, the following
  quick list is the version numbers that you may come across "in the wild".
  Checking IsVersionSupported with a build one higher than what I list 
  below could be useful to show "higher than" without looping through
  every possible build number.

     Silverlight 1.0
        o   1.0.20816
        o   1.0.20926 (Windows only - no corresponding Mac build)
        o   1.0.21115
        o   1.0.30109

     Silverlight 1.1 alpha
       o   1.1.20816
       o   1.1.20926 (Windows only - no corresponding Mac build)


   If you wanted to do the loop, the build numbers are xMMDD - last year x was '2'
   and this year it is '3'. So if you get the current date you could determine
   the highest possible build that could exist 
   (e.g. today would be 1.0.30308 for a Silverlight 1.0 servicing release
   or 2.0.30308 for an updated Silverlight 2 Beta release).


   Also, for builds since the 1.0 RTW, if you want to test out
   different builds just to check your version script, it's easier
   to edit the version number in the registry than it is to actually 
   install the build. HKLM\Software\Microsoft\Silverlight has a Version 
   key that is used by the IsVersionSupported method.


*/
axo:{

  // == 0 if not called
  // == 1 if called
  hasRun:0,

  // 1, 0
  installed:0,

  // Detected plugin version
  // [string/null]
  version:null,

  // Security Pre-Approved ActiveX control for IE
  progID: "AgControl.AgControl",

  //classID: "clsid:DFEAF541-F3E1-4C24-ACAC-99C30715084A",


  // maxdigits, mindigits are used for a brute force search to determine the exact
  // plugin version #.
  // Version format is MajorVersion.MinorVersion.Build.Revision
  // where the Build = xMMDD where x = (1-9), MM = month (01-12), DD = day (01-31)
  // maxdigit = [(max MajorVersion) + 1, (max Minor Version) + 1, (max x) +1, 
  //    (max MM), (max DD), (max Revision)]
  //
  // Theoretically, the max Build # xMMDD is 91231, and the min Build # is 10101.
  // However, is it possible that they may one day change the format of the build
  // where the max Build # is 99999?
  //
  // maxdigit[x] = max possible value for a digit + 1
  //
  // So if max Build == 91231 then maxdigit == [a, 10, 10,13,32, 10]
  // maxdigit: [20, 10, 10,13,32, 10],
  maxdigit: [20, 10, 10,100,100, 10],

  // mindigit[x] = min possible value for a digit
  mindigit: [0, 0, 0,0,0, 0],


  // Uncomment this next line of code if you want to pretend
  // that the installed Silverlight version == testVersion.
  //
  // testVersion:[19, 9, 9,99,99, 9],


  // obj is plugin object.
  // data[] is an array.
  IsVersionSupported: function(obj, data){
     var axo=this;
     
     $.message.write("[ test: " + axo.format(data) + " ]", $.message.end());

     try{
       return axo.testVersion ? 
          $.compareNums($.formatNum(axo.testVersion.join(",")), $.formatNum(data.join(",")))>=0 :
          obj.IsVersionSupported(axo.format(data))
     }
     catch(e){}
  
     return 0;
  },

  // Return a version number in a format used by plugin.IsVersionSupported() method
  // data[] is an array.
  format: function(data){
      var axo=this;
      return (
          data[0] + "." +                     // 1 or more digits
          data[1] + "." +                     // 1 digit?
          data[2] +                           // 1 digit
          axo.make2digits(data[3]) +          // month of build, 2 digits
          axo.make2digits(data[4]) + "." +    // day of build, 2 digits
          data[5]                             // 1 digit?
       );
  },

  make2digits: function(a){
      return (a<10 ? "0" : "") + a + "";
  },


  query: function(){

     var axo=this,
       x, obj,
       disabled = axo.hasRun;

     axo.hasRun = 1;
     if (disabled) return axo;

     $.message.write($.message.time(axo.query,1), $.message.end());   // Start measuring time delay
     $.message.write("[ ]", $.message.end());
     $.message.write("[ START brute force search for Silverlight version for ActiveX based browsers ]", $.message.end());


     obj = $.getAXO(axo.progID);       // Instantiate the plugin using ActiveX

     if (obj) axo.installed = 1;


     // Search for exact plugin version.
     //
     // Note: IsVersionSupported(minversion) is a method that tells you
     // if the installed plugin version > minversion
     if (obj && axo.IsVersionSupported(obj, axo.mindigit))
     {

        var result = [].concat(axo.mindigit),
          count, iterations=0;

        // Begin the search for plugin version
        //
        // We could improve this search algorithm by making it a binary search.
        for (x=0;x<axo.maxdigit.length;x++)
        {
           count=0;
           while(axo.maxdigit[x]-axo.mindigit[x]>1 && count<20)
           {
              count++;
              iterations++;

              result[x] = Math.round((axo.maxdigit[x] + axo.mindigit[x])/2);

              if (axo.IsVersionSupported(obj, result)){axo.mindigit[x]=result[x]}
              else {axo.maxdigit[x]=result[x]}

           }
           
           result[x] = axo.mindigit[x];

        }   // end of x loop

        axo.version = axo.format(result);

        $.message.write("[ Search iterations: " + iterations + " ]", $.message.end());

     }   // end of search


     $.message.write("[ ]", $.message.end());
     $.message.write("[ Silverlight installed: " + (axo.installed ? "true" : "false") + " ]", $.message.end());
     $.message.write("[ Silverlight version: " + axo.version + " ]", $.message.end());
     $.message.write("[ END brute force search for Silverlight version for ActiveX based browsers in " +
          $.message.time(axo.query) + " ]", $.message.end());

     return axo;

  }  // end of query()

},   // end of axo{}


BOUNDARY4:"select.pluginCheckbox.silverlight",


// Property is automatically removed by Script Generator
lastProperty:"select.pluginCheckbox.silverlight"


};  // end of silverlight{}


$.addPlugin("silverlight", SILVERLIGHT);



// *********************** End of Silverlight detection *************************





// **********************************************************************************
// VLC Player plugin detection
//

BOUNDARY("select.pluginCheckbox.vlc");


var VLC = {


  // Property is automatically removed by Script Generator
  firstProperty:"select.pluginCheckbox.vlc",


  BOUNDARY0:"0",

  // This object assists in creating a custom version of the script for the user.
  script:{

    select:{pluginCheckbox:{vlc:"VLC"}},

    fileNameSuffix:"VLC",

    checkboxLabel:"VLC Player",

    errCheck:function(code, select){
        if (!select.miscCheckbox.allowactivex &&
             (/\.axo|\.codebase|\.AXO|\.getAXO|\.ActiveX|ActiveXObject/).test(code.customModuleScript)
           )
              alert("Error: ActiveX code found in " + code.moduleName + " module");
    },

    // include:function(select){} tells us which other modules to include when using this module.
    //
    // Do not put $.message/BOUNDARY in the array[] here because they are automatically
    // included/removed from the script as needed.
    //
    // Any items in the outermost array must ALL be included (AND).
    // At least one item in an inner array must be included (OR).
    //
    // For this particular plugin, plugin.getVersion() must be called by either 
    // $.isMinVersion or $.getVersion. Hence we use the inner array
    // [$.isMinVersion, $.getVersion] here.
    include:function(select){
         return [$.pd, $.getPluginFileVersion, $.DOM,
         
         // When select.miscCheckbox.allowactivex == true, we include $.codebase{} since
         // it is used for ActiveX plugin detection.
         // Otherwise, we do not include it to make the script smaller.
         (select.miscCheckbox.allowactivex ? $.codebase : 0),
         
         $.hasMimeType, [$.isMinVersion, $.getVersion]]
    }
  }, // end of script{}

  BOUNDARY1:"select.pluginCheckbox.vlc",



 // Input 2 string numbers "a1,b1,c1,d1" and "a2,b2,c2,d2"
 // If num1 > num2 then return +1
 // If num < num2 then return -1
 // if num1 = num2 then return 0
 // If num1 or num2 do not contain a number, then return 0
 //
 // We assume that c1,c2 = number and sometimes a letter [a-z]
 // This is an issue that is unique to the VLC player
 //
 //
 // Note: for the parseInt() method we must specify base 10, because some
 // input strings may have leading 0's - ie. "08", etc... that otherwise
 // would be interpreted as Base 8 (OCTAL) instead of base 10.
 //
 // If the 2 input numbers have a different number of digits, then we
 // do not assume that the shorter number has zeros
 //  ie. 1,5 <> 1,5,0,0
 // Instead, we assume that 1,5 = 1,5,A,B where A and B are unknown
 //
 // Hence if num1=1,5 and num2=1,5,1,0 then we return 0
 compareNums: function(num1, num2){

   var m1 = num1.split($.splitNumRegx), m2 = num2.split($.splitNumRegx),
      x, a1, a2, b1, b2, t;


   for (x=0;x<Math.min(m1.length, m2.length);x++){

       // num1
       t = /([\d]+)([a-z]?)/.test(m1[x]);   // + = 1 or more, ? = 0 or 1 time
       a1 = parseInt(RegExp.$1, 10);        // convert string num to number
       b1 = ( x==2 && RegExp.$2.length>0 ) ? RegExp.$2.charCodeAt(0) : -1; // convert letter to number

       // num2
       t = /([\d]+)([a-z]?)/.test(m2[x]);   // + = 1 or more, ? = 0 or 1 time
       a2 = parseInt(RegExp.$1, 10);        // convert string num to number
       b2 = ( x==2 && RegExp.$2.length>0 ) ? RegExp.$2.charCodeAt(0) : -1; // convert letter to number


       // Compare the number portion of the strings.
       // If num1 > num2 then return 1
       // if num1 < num2 then return -1
       if (a1 != a2) return (a1 > a2 ? 1 : -1);
       

       // Compare the letter portion of the strings.
       // If a1==b1 then look at a2 and b2
       if (x==2 && b1 != b2) return (b1 > b2 ? 1 : -1);


   }

   return 0  // num1 = num2

  },
  
  
  // Set the value of the output variables for VLC detection.
  // The output variables are vlc.version, vlc.installed, vlc.getVersionDone.
  // This routine should always be run after completing a detection attempt.
  //
  // We input EITHER obj,version OR isMin.
  // obj tells us whether the plugin is present or not.
  // version tells us the plugin version.
  // isMin tells us if plugin >= some minimum version.
  setPluginStatus: function(obj, version, isMin){

    var vlc=this;

    $.message.write("[ ]", $.message.end());
    $.message.write("[ START Setting plugin status for VLC Player ]", $.message.end());


    vlc.installed =

       version ? 1 :

         (  // isMin is undefined, null, 0, > 0, < 0
            // 0.7 means plugin version >= minversion, plugin installed/enabled
            // -0.1 means plugin version < minversion, plugin installed/enabled
            isMin ? (isMin>0 ? 0.7 : -0.1) : (obj  ? 0 : -1)

         );


    if (version) vlc.version = $.formatNum(version);


    // == 1 means vlc.getVersion() does not need to be called again
    // == 0 means vlc.getVersion() is allowed to be called again.
    vlc.getVersionDone = vlc.installed==1 || vlc.installed==-1 || vlc.instance.hasRun ? 1 : 0


    $.message.write("[ vlc.getVersionDone: " + vlc.getVersionDone + " ]", $.message.end());
    $.message.write("[ vlc.installed: " + vlc.installed + " ]", $.message.end());
    $.message.write("[ vlc.version: " + vlc.version + " ]", $.message.end());


    $.message.write("[ END Setting plugin status for VLC Player ]", $.message.end());

    $.message.write("[ ]", $.message.end());


  },  // end of setPluginStatus()


// [public]
// Get VLC version
// @instantiate input arg will tell us if we are allowed to use the 
//   instance{} object for detection.
getVersion: function(_minVersion, instantiate){

    var vlc=this, installed, version=null, tmp;


    // *** Detection Attempt # 0
    //
    if ((!installed || $.dbug) && vlc.nav.query().installed) installed = 1;
    if ((!version || $.dbug) && vlc.nav.query().version) version = vlc.nav.version;


    BOUNDARY("select.pluginCheckbox.vlc && select.miscCheckbox.allowactivex");

    // *** Detection Attempt # 1
    //
    if ((!installed || $.dbug) && vlc.axo.query().installed) installed = 1;
    if ((!version || $.dbug) && vlc.axo.query().version) version = vlc.axo.version;



    // *** Detection Attempt # 2
    //
    // codebase.isMin() is faster than codebase.search(), so we
    // try codebase.isMin() first.
    //
    // This detection attempt does NOT try to find out the exact plugin version.
    // It only attempts to determine if version >= minversion. This is
    // done for speed reasons.
    //
    // vlc.codebase.isMin(minversion) detects if version >= minversion.
    // vlc.codebase.search() detects exact version.
    // vlc.codebase.isMin() is MUCH faster than vlc.codebase.search().
    //
    // For IE, we recommend using $.isMinVersion("vlc") instead of
    // $.getVersion("vlc") for speed reasons.
    //
    //
    // if tmp is 0, then we were not able to use codebase detection, or plugin
    //    not installed/enabled.
    // if tmp is 1, then we used codebase detection, and version >= minversion, plugin installed.
    // if tmp is -1, then we used codebase detection, and version < minversion, plugin installed.
    //
    if (!version || $.dbug)
    {

       tmp = vlc.codebase.isMin(_minVersion);
       if (tmp)
       {
           vlc.setPluginStatus(0, 0, tmp);
           return;
       }

    }


    // *** Detection Attempt # 3
    //
    // codebase.search() does not cause any security popups, but is slower than codebase.isMin().
    if (!version || $.dbug)
    {
       tmp = vlc.codebase.search();
       if (tmp){
          installed = 1;
          version = tmp;
       }
    }

    BOUNDARY("select.pluginCheckbox.vlc");



    // *** Detection attempt # 4
    //
    if ((!version && instantiate) || $.dbug)
    {
      tmp = vlc.instance.query().version;
      if (tmp){
         installed = 1;
         version = tmp;
      }
    }


    vlc.setPluginStatus(installed, version, 0);


},  // end of getVersion()


// Get the VLC Player version from navigator arrays
nav:{

  // [private]
  // == 0 if not called
  // == 1 if called
  hasRun:0,

  // [public]
  // 1, 0
  installed:0,

  // [public]
  // Detected plugin version
  // [string/null]
  version:null,


  /*
     Suppose that we have VLC and a similar plugin B in the same browser.
     Suppose there is some mimetype hijacking going on, and plugin B imitates
     the navigator.plugins[i].name property, and the browser does not allow
     enumeration of the navigator.plugins[] array.
     In this case, how do we detect VLC, while still filtering out plugin B?
     
     We do this by supplying as many nav.mimeType values as possible for VLC.
     We do this by supplying as many nav.plugins values as possible for VLC.

  */



  // To ensure that we can detect VLC Player, we list a number of different
  // mimetypes that are associated with VLC.
  // We do this in case there is any mimetype hijacking by other plugins,
  // and in case the browser does not allow enumeration of the 
  // navigator.plugins[] array.
  // We use navigator.mimeTypes[...].enabledPlugin here to find the plugin.
  mimeType: [
     "application/x-vlc-plugin", "application/x-google-vlc-plugin",
     "application/mpeg4-muxcodetable", "application/x-matroska", "application/xspf+xml",
     "video/divx", "video/webm", "video/x-mpeg", "video/x-msvideo", "video/ogg",
     "audio/x-flac", "audio/amr", "audio/amr"  
  ],


  // On Windows XP, we get the following...
  //
  //
  // name: VLC multimedia plugin
  // description: VLC multimedia plugin Version "0.8.2"<br><br>VideoLAN WWW: <a href="http://www.videolan.org/">http://www.videolan.org/</a>
  //
  // name: VLC multimedia plugin
  // description: VLC multimedia plugin Version "0.8.5"<br><br>VideoLAN WWW: <a href="http://www.videolan.org/">http://www.videolan.org/</a>
  //
  // name: VLC Multimedia Plugin
  // description: Version 0.8.6a, copyright 1996-2006 The VideoLAN Team<br><a href="http://www.videolan.org/">http://www.videolan.org/</a>
  //
  // name: VLC Multimedia Plugin
  // description: Version 0.8.6f, copyright 1996-2007 The VideoLAN Team<br><a href="http://www.videolan.org/">http://www.videolan.org/</a>
  //
  // name: "VLC Multimedia Plug-in"
  // description: "Version 1.1.1, copyright 1996-2010 The VideoLAN Team<br><a href="http://www.videolan.org/">http://www.videolan.org/</a>"
  //
  // name: VLC Multimedia Plug-in
  // description: Version 1.1.11, copyright 1996-2011 The VideoLAN Team http://www.videolan.org/
  // description: "Version 1.1.11, copyright 1996-2011 The VideoLAN Team<br><a href="http://www.videolan.org/">http://www.videolan.org/</a>"
  //
  // name: "VLC Web Plugin"
  // description: "VLC media player Web Plugin 2.0.0-rc"
  //
  // name: VLC Web Plugin
  // description: VLC media player Web Plugin 2.0.6
  //
  // name: VLC Web Plugin
  // description: VLC media player Web Plugin 2.1.0
  //
  //
  // On Ubuntu 12.04/Firefox 11
  //
  // name: "VLC Web Plugin"
  // description: "Version 2.0.8 Twoflower, copyright 1996-2011 VideoLAN and Authors<br /><a href="http://www.videolan.org/vlc/">http://www.videolan.org/vlc/</a>"
  //
  //
  find: "VLC.*Plug-?in",
  
  // We use this to filter out 3rd party Media Players that try to imitate VLC.
  // We do this by looking at BOTH plugin.name and plugin.description.
  find2: "VLC|VideoLAN",


  // We filter out the Totem media player because it mimics the VLC
  // plugin.name/plugin.description in order to fool plugin detectors into
  // thinking it is the VLC player.
  //
  // name: VLC Multimedia Plugin (compatible Totem 2.30.2)
  // description: The Totem 2.30.2 plugin handles video and audio streams.
  avoid: "Totem|Helix",


  // In case there is another plugin that engages in mimetype hijacking, and
  // in case the browser does not allow ennumeration of navigator.plugins, then
  // we list all the possible strings to use for navigator.plugins[...] 
  // in order to find the VLC plugin.
  plugins: ["VLC Web Plugin", "VLC Multimedia Plug-in", 
    "VLC Multimedia Plugin", "VLC multimedia plugin"],


  // [public]
  query: function(){

     var nav=this,
        version, obj,
        disabled = nav.hasRun || !$.hasMimeType(nav.mimeType);

     nav.hasRun = 1;
     if (disabled) return nav;


     $.message.write($.message.time(nav.query,1), $.message.end());   // Start measuring time delay
     $.message.write("[ ]", $.message.end());
     $.message.write("[ START search navigator.plugins[ ] for VLC Player ]", $.message.end());


     // Look for VLC Player, do not look for number
     //
     // We do not require numbers in the result
     obj = $.pd.findNavPlugin({find:nav.find, avoid:nav.avoid,
         mimes:nav.mimeType, plugins:nav.plugins});


     if (obj)
     {
        nav.installed = 1;

        // The problem with the version # for VLC is that it can be a number and a letter,
        // instead of just a pure number.
        // Should we format the version as 0,8,6f,0 ?
        // If we include the letter, then we need to adjust compareNums() method
        //
        // We include an override string for the pattern detection of
        // versions in the form of "0.8.6f"
        if (obj.description) version = $.getNum(obj.description + "", "[\\d][\\d\\.]*[a-z]*");


        version = $.getPluginFileVersion(obj, version);


        if (version) nav.version = version;
     
     }

     $.message.write("[ ]", $.message.end());
     $.message.write("[ VLC Player installed: " + (nav.installed ? "true" : "false")  + " ]", $.message.end());
     $.message.write("[ VLC Player version: " + nav.version + " ]", $.message.end());
     $.message.write("[ END search navigator.plugins[ ] for VLC Player in " +
          $.message.time(nav.query) + " ]", $.message.end());

     return nav;

  } // end of query()


}, // end of nav{}


// Instantiate the plugin for non-IE browsers, and query the plugin directly.
instance:{

  // [public]
  // == 0 if not called
  // == 1 if called
  hasRun:0,

  // [public]
  // 1, 0
  installed:0,

  // [public]
  // Detected plugin version
  // [string/null]
  version:null,


  mimeType: "application/x-vlc-plugin",

  
  HTML:0,


  // [private]
  isDisabled:function(){

     var instance=this, result=1;
     
     if (instance.hasRun) {}
     
     else if ($.dbug) result=0;

     // non-IE browsers
     else if (VLC.nav.installed && $.hasMimeType(instance.mimeType)) result=0;

     return result;

  }, // end of isDisabled()


  // [public]
  query:function(){

     var instance=this, altHTML=$.DOM.altHTML,
       version=null, obj=0,
       isDisabled = instance.isDisabled();
     
     instance.hasRun=1;
     
     if (isDisabled) return instance;
     
     
     $.message.write($.message.time(instance.query,1), $.message.end());   // Start measuring time delay
     $.message.write("[ ]", $.message.end());
     $.message.write("[ START vlc.instance.query( ) ]", $.message.end());



     // Instantiate the plugin in an <object> tag here.
     instance.HTML = $.DOM.insert("object",
                  ["type", instance.mimeType],

                  ["autoplay","no", "loop","no", "volume","0"],

                  altHTML, VLC);
                  
     obj = instance.HTML.obj();
     if (obj)
     {
       try{if (!version) version = $.getNum(obj.VersionInfo);}
       catch(e){}

       try{if (!version) version = $.getNum(obj.versionInfo());}
       catch(e){}

     }

     if (version){
         instance.version = version;
         instance.installed = 1;
     }


     $.message.write("[ VLC version: " + instance.version + " ]", $.message.end());
     $.message.write("[ END vlc.instance.query( ) in " +
          $.message.time(instance.query) + " ]", $.message.end());

     return instance;


  } // end of query()



}, // end of instance{}




BOUNDARY3:"select.pluginCheckbox.vlc && select.miscCheckbox.allowactivex",


// Get the VLC Player version using ActiveX
axo:{

  // == 0 if not called
  // == 1 if called
  hasRun:0,

  // [public]
  // 1, 0
  installed:0,

  // [public]
  // Detected plugin version
  // [string/null]
  version:null,


  // The classid for the VLC plugin corresponds to "VideoLAN.VLCPlugin" and "VideoLAN.VLCPlugin.2".
  //
  // It does NOT correspond to "VideoLAN.VLCPlugin.1".
  // "VideoLAN.VLCPlugin.1" corresponds to a different classid.
  progID: "VideoLAN.VLCPlugin",     // version independent progId


  // [public]
  query: function(){

     var axo=this,
       obj, version, 
       disabled = axo.hasRun;

     axo.hasRun = 1;
     if (disabled) return axo;

     $.message.write($.message.time(axo.query,1), $.message.end());   // Start measuring time delay
     $.message.write("[ ]", $.message.end());
     $.message.write("[ START vlc.axo.query( ) for ActiveX based browsers ]", $.message.end());


     obj = $.getAXO(axo.progID);

     if (obj)
     {
        axo.installed=1;

        // In future versions, we should check if p.versionInfo() works.
        // For VLC 1.1.11, obj.versionInfo() does not work.
        //
        // We include an override string for the pattern detection of
        // versions in the form of "0.8.6f"
        //
        // obj.VersionInfo does not seem to work for VLC 2.0.
        // Has the Javascript API for VLC changed somehow?
        version = $.getNum($.pd.getPROP(obj, "VersionInfo"), "[\\d][\\d\\.]*[a-z]*");

        if (version) axo.version = version;

     }


     $.message.write("[ ]", $.message.end());
     $.message.write("[ VLC plugin: " +
         (axo.installed ? "installed & enabled" : "not detected") + " ]", $.message.end());
     $.message.write("[ VLC version: " + axo.version + " ]", $.message.end());
     $.message.write("[ END vlc.axo.query( ) for ActiveX based browsers in " +
          $.message.time(axo.query) + " ]", $.message.end());

     return axo;

  }  // end of query()

},   // end of axo{}


// Search the IE codebase to get the plugin version
codebase: {

    // This is the classid, according to the add-ons menu in IE
    classID: "clsid:9BE31822-FDAD-461B-AD51-BE1D1C159921",

    
    isMin:function(minVersion){ 
       this.$$ = VLC;
       return $.codebase.isMin(this, minVersion);
    },
    
    search:function(){
       this.$$ = VLC;
       return $.codebase.search(this);
    },
    
/*
    // split up < from HTML tags to help the PluginDetect download page to validate
    // We can put () around "<" so that Javascript minifier does not combine the strings
    // optional <param> elements
    ParamTags:
        "<param name=\"volume\" value=\"0\" />" +
        "<param name=\"autoplay\" value=\"no\" />" +
        "<param name=\"loop\" value=\"no\" />" +
        "<param name=\"fullscreen\" value=\"no\" />" +
        "<param name=\"hidden\" value=\"yes\" />",
*/

    // DIGITMAX[x] specifies the max value that each digit of codebase version can have.
    // Given DIGITMAX[x] == [A,B,C,D] the maximum allowed codebase is A,B,C,D.
    //
    // The length of DIGITMAX[] is the same as length of Lower[].
    //
    // if DIGITMAX[x] == 0, then it corresponds to a non-existent codebase
    // between Lower[x] and Upper[x].
    //
    // if DIGITMAX[][x] does not exist, then it is assumed to be 0 by the codebase
    // detection routines.
    //
    // VLC version 1.1.11 so DIGITMAX[2]>11
    // VLC version 0.9.9  so DIGITMAX[1]>0
    DIGITMAX:[ 

       [11,11,16]

    ],

    // Min value for each digit of the codebase version
    DIGITMIN: [0,0,0,0],



   // These 2 arrays contain codebase version numbers.
   // They help to convert codebase version numbers to their
   // corresponding plugin version numbers.
   //
   // The rules for these 2 arrays are:
   //  1) Upper[0] is the highest codebase number you ever expect to encounter
   //  2) The last item in Lower[] is always "0"
   //  3) Upper[] is arranged in descending order
   //  4) Lower[] is arranged in descending order
   //  5) Lower[x] == Upper[x+1]
   //  6) The strings in Upper[x],Lower[x] do not have to be formatted.
   //     They are automatically formatted when they are used.
   //  7) Lower[x]<= codebase[x] < Upper[x] corresponds to convert[x]
   //  8) One and only one codebase number is allowed to map to
   //      any given plugin version number. This is IMPORTANT.
   //      When needed, set convert[x]==0 to accomplish this.
   //
   Upper: ["999"],
   Lower: ["0"],
   


   // Convert plugin version to/from codebase number.
   // convert[x] is used to convert plugin version to/from codebase number, where
   //   Lower[x] <= codebase[x] number <= Upper[x]
   // This array has the same length as Upper[], Lower[].
   //
   // convert[x] == 1 means that codebase[x] ( == A.B.C.D) == plugin version A.B.C.D.
   // convert[x] == 0 means that codebase[x] does not have a corresponding plugin version,
   //     where  Lower[x]<= codebase[x] < Upper[x].
   //
   // if toCodebase, then convert to codebase number.
   // if !toCodebase, then convert to plugin version number.
   convert: [1] // end of convert[]


},  // end of codebase{}


BOUNDARY4:"select.pluginCheckbox.vlc",


// Property is automatically removed by Script Generator
lastProperty:"select.pluginCheckbox.vlc"


};  // end of vlc{}


$.addPlugin("vlc", VLC);


// ****************************** End of VLC detection ********************************





// ****************************** Adobe PDF Reader detection ********************************
/*


   We can detect Adobe Reader 5+ with PluginDetect


   Limitations to Adobe Reader detection:

   In the Adobe Reader preferences, you can disable the "Display in Browser" option.
     For Adobe Reader 10/WindowsXP/IE, this will disable the Reader plugin within IE.
   The plugin is no longer detectable within IE. When you try to display a pdf within IE,
   the standalone Adobe Reader takes over to display the pdf.
     For Adobe Reader 10/WindowXP/Firefox, this apparently does NOT disable the plugin.
   You can still detect the Adobe Reader in the browser, and you can display pdfs within
   the browser.

     Note, however, in Firefox you can change the browser prefs to automatically open a pdf in
   the external Adobe Reader. In this case, the plugin is still detectable.
   I have not tested Adobe Reader/Linux to see if this behavior is similar.

     For Adobe Reader 11, Adobe Reader preferences no longer allow you to set the
   "Display in Browser" option. You need to disable the Adobe Reader in the browser's 
   settings. When you do so, then the Adobe Reader will open up PDF's in the standalone
   Adobe Reader (at least for IE).

   
   
     NOTE: Adobe Reader 11/Windows XP SP3/IE 8 is NOT compatible with the codebase
   attribute that uses a version #. In other words, we cannot use
   <object codebase="#version=0,0,0,1"></object>  for Adobe Reader.
   Therefore, we cannot use the codebase detection method for Adobe Reader.


*/


BOUNDARY("select.pluginCheckbox.adobereader");


var ADOBEREADER = {


  // Property is automatically removed by Script Generator
  firstProperty:"select.pluginCheckbox.adobereader",


  BOUNDARY0:"0",

  // This object assists in creating a custom version of the script for the user.
  script:{

    select:{pluginCheckbox:{adobereader:"AdobeReader", verifyadobereader:"VerifyAdobeReader"}},

    fileNameSuffix:{pluginCheckbox:{adobereader:"AdobeReader", verifyadobereader:""}},

    checkboxLabel:{pluginCheckbox:{adobereader:{
      text: "Adobe PDF Reader&nbsp;&nbsp;&nbsp;" +
            "(<a href='../files/detectAdobe.pdf'>Download the DummyPDF document used by this detector</a>. " +
            "Just right click and Save As)",
      verifyadobereader:{
        text:"Verify Adobe Reader [path/]name.<br>" +
             "This will help verify that you are specifying the correct [path/]name " +
             "for DummyPDF in your Adobe Reader detection code.<br>" +
             "The results of this verification will be shown at the top of your " +
             "web page when Adobe Reader detection is performed. " +
             "This feature is for testing/debugging purposes only.<br>"
        }
      }}},

    errCheck:{pluginCheckbox:{
      adobereader:function(code, select){
        if (!select.miscCheckbox.allowactivex &&
             (/\.axo|\.codebase|\.AXO|\.getAXO|\.ActiveX|ActiveXObject/).test(code.customModuleScript)
           )
              alert("Error: ActiveX code found in " + code.moduleName + " module");
      },
      verifyadobereader:0
    }},


    // include:function(select){} tells us which other modules to include when using this module.
    //
    // Do not put $.message/BOUNDARY in the array[] here because they are automatically
    // included/removed from the script as needed.
    //
    // Any items in the outermost array must ALL be included (AND).
    // At least one item in an inner array must be included (OR).
    //
    // For this particular plugin, plugin.getVersion() must be called by either
    // $.isMinVersion or $.getVersion. Hence we use the inner array
    // [$.isMinVersion, $.getVersion] here.
    include:{pluginCheckbox:{
       adobereader:function(select){

          return [$.pd, $.getPluginFileVersion, $.file, $.onDetectionDone,

                  $.hasMimeType, [$.isMinVersion, $.getVersion]].concat(
         
               // When select.miscCheckbox.allowactivex == true, we include these objects
               // since they are used for ActiveX plugin detection.
               // When select.miscCheckbox.allowactivex == false, we do NOT include them.
               // This way, the script is smaller when allowactivex == false.
               select.miscCheckbox.allowactivex ? [$.DOM, $.ev] : []

          )
       },
       verifyadobereader:function(){
         return [$.verify]
       }
    }}

  }, // end of script{}


  BOUNDARY1:"select.pluginCheckbox.adobereader",



  OTF: null,   // if 0,1,2 then detection was performed OTF
               // if 3 then detection is being performed NOTF but is not yet completed
               // if 4 then NOTF detection has been completed.
               // when OTF==3 it means that reader.installed==-0.5 or +0.5



  // This routine sets the value of all the output variables for the $.Plugins.adobereader{} object.
  // The output variables of the detection are adobereader.version, adobereader.installed,
  // and adobereader.getVersionDone.
  //
  // We call this routine right before returning from adobereader.getVersion().
  //
  setPluginStatus: function(){

     $.message.write("[ ]", $.message.end());
     $.message.write("[ START set plugin status ]", $.message.end());

     var reader=this, OTF = reader.OTF,

        detected_nav = reader.nav.detected,
        version_nav = reader.nav.version,
        precision_nav = reader.nav.precision,
        
        precision = precision_nav,
        version = version_nav,
        installed = detected_nav>0;   // is plugin installed & enabled ? true/false

     $.message.write("[ adobereader.nav.detected: " + reader.nav.detected + " ]", $.message.end());
     $.message.write("[ adobereader.nav.version: " + reader.nav.version + " ]", $.message.end());
     $.message.write("[ adobereader.nav.precision: " + reader.nav.precision + " ]", $.message.end());



     BOUNDARY("select.pluginCheckbox.adobereader && select.miscCheckbox.allowactivex");
     
     // ActiveX
     var detected_axo = reader.axo.detected,
        version_axo = reader.axo.version,
        precision_axo = reader.axo.precision,

        detected_doc = reader.doc.detected,
        version_doc = reader.doc.version,
        precision_doc = reader.doc.precision,

        detected_doc2 = reader.doc2.detected,
        version_doc2 = reader.doc2.version,
        precision_doc2 = reader.doc2.precision;


     // Note: version_doc2 must come first, since it supercedes all others.
     version = version_doc2 || version || version_axo || version_doc;
     
     precision = precision_doc2 || precision || precision_axo || precision_doc;

     installed = detected_doc2>0 || installed || detected_axo>0 || detected_doc>0; // is plugin installed & enabled ? true/false
     

     $.message.write("[ adobereader.axo.detected: " + reader.axo.detected + " ]", $.message.end());
     $.message.write("[ adobereader.axo.version: " + reader.axo.version + " ]", $.message.end());
     $.message.write("[ adobereader.axo.precision: " + reader.axo.precision + " ]", $.message.end());
     
     $.message.write("[ adobereader.doc.detected: " + reader.doc.detected + " ]", $.message.end());
     $.message.write("[ adobereader.doc.version: " + reader.doc.version + " ]", $.message.end());
     $.message.write("[ adobereader.doc.precision: " + reader.doc.precision + " ]", $.message.end());

     $.message.write("[ adobereader.doc2.detected: " + reader.doc2.detected + " ]", $.message.end());
     $.message.write("[ adobereader.doc2.version: " + reader.doc2.version + " ]", $.message.end());
     $.message.write("[ adobereader.doc2.precision: " + reader.doc2.precision + " ]", $.message.end());


     // end of ActiveX

     BOUNDARY("select.pluginCheckbox.adobereader");



     version = version || null;
     reader.version = $.formatNum(version);
     reader.precision = precision;



     // -1 -> Adobe Reader not installed/not enabled as a plugin in the browser,
     // but it is possible that Adobe Reader may be installed and able to display
     // PDFs outside the browser (as a standalone application).
     var readerInstalled = -1;

     // if NOTF Detection is being performed
     if (OTF == 3) readerInstalled = reader.version ? 0.5 : -0.5;
     
     // 1 -> installed & enabled, version is known
     else if (version) readerInstalled = 1;
     
     // 0 -> installed & enabled, version is not known
     else if (installed) readerInstalled = 0;

     else
     {
       BOUNDARY("select.pluginCheckbox.adobereader && select.miscCheckbox.allowactivex");

       // -0.15 -> Adobe Reader installed, but not enabled for <object>/<embed> tags.
       // This occurs in IE when the Adobe Reader ActiveX control is disabled in
       // the add-ons menu. Note that disabling the ActiveX control merely disables
       // the <object>/<embed> tags for the plugin. It does not completely
       // disable the plugin, however, because you can still display a PDF
       // in the browser window/<iframe> (when the browser URL points to the PDF location).
       //
       // Update: For Adobe Reader < 11, when you disable the ActiveX control in the
       // add-ons menu, then you can still display PDFs in the browser window.
       // However, for Adobe Reader >= 11, the behavior has changed. When you disable
       // in the add-ons menu, and then try to display a PDF in the browser, you will
       // end up with the PDF displaying in the standalone application.
       //
       // So, this means the PDF Reader is installed, and it can display PDF
       // documents in the browser and/or standalone application.
       // But <object>/<embed> tags definitely cannot be used to display a PDF.
       if (detected_axo==-0.5 || detected_doc==-0.5) readerInstalled = -0.15;
       
       // -1.5 -> ActiveX will not run in an ActiveX based browser.
       // Unable to determine if Adobe Reader plugin is installed or not.
       else if ($.browser.isIE &&
                (!$.browser.ActiveXEnabled || $.browser.ActiveXFilteringEnabled))
                   readerInstalled = -1.5;

       BOUNDARY("select.pluginCheckbox.adobereader");

     }

     reader.installed = readerInstalled;



     // When getVersionDone == 1, then it should stay that way.
     if (reader.getVersionDone != 1)
     {
         var getVersionDone = 1;

         // If we are verifying all the DummyPDF [path/]names, then we force getVersionDone
         // to remain at 0. This way plugin.getVersion() will continue to be called,
         // and we can examine all the instances of the DummyPDF input arg to PluginDetect.
         if ( (reader.verify && reader.verify.isEnabled()) ||

               // NOTF detection means getVersionDone=0
               reader.installed == 0.5 || reader.installed == -0.5
               
             ) getVersionDone = 0;


         else
         {
           BOUNDARY("select.pluginCheckbox.adobereader && select.miscCheckbox.allowactivex");
           
           // if doc2.isDisabled()==1, then that means doc2{} can and probably should run again,
           // so getVersionDone=0
           if (reader.doc2.isDisabled()==1) getVersionDone = 0;
           
           BOUNDARY("select.pluginCheckbox.adobereader");
         }
         

         reader.getVersionDone = getVersionDone;
     }



     $.message.write("[ ]", $.message.end());
     $.message.write("[ adobereader.installed: " + reader.installed + " ]", $.message.end());
     $.message.write("[ adobereader.version: " + reader.version + " ]", $.message.end());
     $.message.write("[ adobereader.precision: " + reader.precision + " ]", $.message.end());
     $.message.write("[ adobereader.getVersionDone: " + reader.getVersionDone + " ]", $.message.end());
     $.message.write("[ END set plugin status ]", $.message.end());


  },  // end of setPluginStatus()


// [public]
// Detect Adobe Reader version
// Adobe Reader seems to work with IE 6+, Opera 8.5+, Firefox 1+, Chrome, Safari
getVersion: function(_minVersion, DummyPDF){

    var reader=this, version=0, 
      verify = reader.verify;


    // This only runs once
    if (reader.getVersionDone === null)
    {
       reader.OTF = 0;   // Detection has begun

       if (verify) verify.init();  // begin verification of dummy pdf path/name
    }


    // We keep track of each valid DummyPDF input
    $.file.save(reader, ".pdf", DummyPDF);


    // If reader.getVersionDone === 0 then reader.getVersion() was previously run.
    // It also means that we are permitted to run reader.getVersion() again, but
    // we will only be using the doc2{} to obtain any additional info.
    //
    // Note: this statement comes AFTER the "$.file.save()" statement,
    // so that we can keep track of all input DummyPDF strings during DummyPDF verification.
    if (reader.getVersionDone === 0)
    {
        BOUNDARY("select.pluginCheckbox.adobereader && select.miscCheckbox.allowactivex");
        
        reader.doc2.insertHTMLQuery();
        
        BOUNDARY("select.pluginCheckbox.adobereader");
        
        reader.setPluginStatus();
        
        return;
    }


    // Detection attempt # 1
    if ((!version || $.dbug) && reader.nav.query().version){ 
       version = 1;
    }


    BOUNDARY("select.pluginCheckbox.adobereader && select.miscCheckbox.allowactivex");

    // Detection attempt # 2
    // Uses ActiveX
    if ((!version || $.dbug) && reader.axo.query().version){ 
       version = 1;
    }


    // Detection attempt # 3
    // Uses ActiveX
    if ((!version || $.dbug) && reader.doc.query().version){ 
       version = 1;
    }
    

    // Detection attempt # 4
    // Uses ActiveX
    if (1){
       reader.doc2.insertHTMLQuery();
    }


    BOUNDARY("select.pluginCheckbox.adobereader");



    reader.setPluginStatus();


},   // end of getVersion()


// Find the precision for a string number
// "a.b.c.d" -> 4
// "a.b.c"   -> 3
// etc...
//
// @str - input string that contains a number.
//   This can be "aaaa 7.7 bbb", or "7.7"
// @pre - optional input regex str to look for in front of the number
// @post - optional input regex str to look for after the number
getPrecision:function(str, pre, post){

   if ($.isString(str))
   {
      pre = pre || "";
      post = post || "";

      var x, num="\\d+", dot="[\\.]", arr=[num, num, num, num];

      for (x=4;x>0;x--){
         if ((new RegExp(pre + arr.slice(0, x).join(dot) + post)).test(str)) return x;
      }
   }
   return 0;

}, // end of getPrecision()


// Get the Adobe PDF Reader version from the navigator.plugins array
nav:{

  // > 0  plugin detected
  // ==0 detection not attempted yet
  // < 0  not detected
  detected:0,

  // Detected Adobe Reader version
  // [string/null]
  version:null,
  
  // [public]
  // Precision of version #
  // Can be 0, 1, 2, 3, 4 digits
  precision:0,
  
  // We look for more than one mimetype, in case some 3rd party plugin hijacks
  // some of Adobe Reader's mimetypes.
  mimeType: ["application/pdf", "application/vnd.adobe.pdfxml"],


  // We use this to search navigator.plugins[].name or 
  // navigator.plugins[].description for a match.
  //
  // pattern for the genuine Adobe Reader plugin
  // We look for "Plugin" or "Plug-in" -> "Plug-?in"
  // We look for "PDF\\s*Plug-?in" or "Acrobat\\s*Plug-?in" or "Reader\\s*Plug-?in"
  // We look for "Adobe.*"
  //
  //
  // ---------------------------------
  // Windows...
  //
  // name: Adobe Acrobat
  // description: Adobe Acrobat Plug-In Version 6.00 for Netscape
  //
  // name: Adobe Acrobat
  // description: Adobe PDF Plug-In For Firefox and Netscape "9.3.3"
  //
  // name: Adobe Acrobat
  // description: Adobe PDF Plug-In For Firefox and Netscape "9.4.0"
  // version: 9.4.0.195
  //
  // Windows/Reader 11.0.1...
  // name: Adobe Acrobat
  // description: Adobe PDF Plug-In For Firefox and Netscape 11.0.01
  //
  // name: Adobe Acrobat
  // description: Adobe PDF Plug-In For Firefox and Netscape 11.0.02
  //
  // name: Adobe Acrobat
  // description: Adobe PDF Plug-In For Firefox and Netscape 11.0.03
  //
  // Windows/Reader 9...
  // name: Adobe Acrobat
  // description: Adobe PDF Plug-In For Firefox and Netscape
  //
  // --------------------------------
  // Linux...
  //
  // name: Adobe Reader 7.0
  // description: The Adobe Reader plugin is used to enable viewing of PDF and FDF files from within the browser.
  //
  // name: Adobe Reader 8.0
  // description: The Adobe Reader plugin is used to enable viewing of PDF and FDF files from within the browser.
  //
  // name: Adobe Reader 9.3
  // description: The Adobe Reader plugin is used to enable viewing of PDF and FDF files from within the browser.
  //
  // Linux/Reader 9: "Adobe Reader Plugin"
  //
  // -------------------------------
  // Macintosh...
  //
  // name: Adobe Acrobat and Reader Plug-in
  // description: Adobe Acrobat and Reader Plug-in for Web Browsers, Version 8.1.0
  //
  // Mac PPC/Reader 7...
  // name: Adobe Acrobat and Reader Plug-in
  // description: Adobe Acrobat and Reader Plug-in for Web Browsers, Version 7.0.5
  // version: 7.0.5
  //
  // name: Adobe Acrobat and Reader Plug-in
  // description: Adobe Acrobat and Reader Plug-in for Web Browsers, Version 9.3.2
  //
  find: "Adobe.*PDF.*Plug-?in|Adobe.*Acrobat.*Plug-?in|Adobe.*Reader.*Plug-?in",


  // Search navigator.plugins[nav.plugins]
  plugins: ["Adobe Acrobat", "Adobe Acrobat and Reader Plug-in", "Adobe Reader Plugin"],


  query: function(){

     var nav=this,
       obj, version=null;

     if (nav.detected || !$.hasMimeType(nav.mimeType)) return nav;


     $.message.write("[ ]", $.message.end());
     $.message.write("[ START adobereader.nav.query( ) ]", $.message.end());


     // Look for Acrobat in plugins array, but do NOT look for version number yet.
     obj = $.pd.findNavPlugin({find:nav.find, mimes:nav.mimeType,
        plugins:nav.plugins});


     nav.detected = obj ? 1 : -1;

     if (obj)
     {    // get plugin version

          // Attempt # 1 to get plugin version.
          //
          // Get plugin version by looking at p.name and p.description.
          // This is the standard way of getting the plugin version.
          //
          // For Acrobat < 8/Windows, p.description shows version
          // For Acrobat >= 9.4/Windows, p.description shows version
          // For Acrobat 8+/Linux, p.name shows version
          //
          version = $.getNum(obj.description) || $.getNum(obj.name);
          $.message.write("[ Version detect attempt # 1, " +
              "look at plugin description/name, version = " + version + " ]", $.message.end());


          // Note: For Reader 5.1.0 we have
          //     p.description = Adobe Acrobat Plug-In Version 5.10 for Netscape
          //     p.version = 5.1.0.193
          // This gives us a version result of 5,10,0,0 which is wrong.
          // Given version = A,B,C,D  it appears that 0<=B<=9 and 0<=C<=9
          //
          // Do we need to verify that B and C < 10?


          // Attempt # 2 to get the plugin version.
          //
          // See if a more accurate plugin version can be detected by looking at p.version.
          // This gives us the actual version of the dll plugin file.
          //
          // Note: normally I would use "if (version) version = $.getPluginFileVersion()"
          // here but since the plugin version is not always available from Attempt # 1
          // we do not use that.
          version = $.getPluginFileVersion(obj, version);
          $.message.write("[ Version detect attempt # 2, " +
              "look at version of plugin dll, version = " + version + " ]", $.message.end());


          // Attempt # 3 to get the plugin version.
          //
          if (!version) version=nav.attempt3();
          $.message.write(!version || $.dbug ?
              "[ Version detect attempt # 3, " +
              "look at mimetypes, version = " + nav.attempt3() + " ]" : 0, $.message.end());

    
          if (version){ 
             nav.version = version;  
             nav.precision = ADOBEREADER.getPrecision(version);
          }

     
     }


     $.message.write($.hasMimeType(nav.mimeType) ?
        "[ navigator.plugins[i].name: " +
        $.hasMimeType(nav.mimeType).enabledPlugin.name + " ]" : 0, $.message.end());
     $.message.write($.hasMimeType(nav.mimeType) ?
        "[ navigator.plugins[i].description: " +
        $.hasMimeType(nav.mimeType).enabledPlugin.description + " ]" : 0, $.message.end());

     $.message.write("[ Adobe Reader plugin: " + 
        (nav.detected>0 ? "detected" : "not detected") + " ]", $.message.end());
     $.message.write("[ Adobe Reader version: " + (nav.version) + " ]", $.message.end());
     $.message.write("[ Adobe Reader version precision: " + (nav.precision) + " ]", $.message.end());
     $.message.write("[ END adobereader.nav.query( ) ]", $.message.end());

     return nav;

  },  // end of query()


/*

  Attempt # 3 to get the plugin version.
  This is the least accurate method of getting the plugin version, and is only used
  as a last resort when all other methods (dealing with the navigator arrays)
  have failed.

  For Adobe Reader 8.0 - 9.3 on Windows, the version is not shown in the
  navigator.plugins[i].(name/description), but it is shown for Reader < 8 and > 9.3.
  However, we may be able to deduce the major plugin version by looking at the
  mimetypes associated with Adobe Reader.

  Note: Adobe Reader on Windows and Linux may have different numbers of mimetypes,
  so just blindly counting the number of mimetypes to guess the plugin version
  is not a good idea. Thus, we go by the actual presence of certain
  individual mimetypes to tell us the Adobe Reader version.

  Note: the mere presence of certain mimetypes may not be an absolute guarantee, due
  to possible mimetype hijacking by 3rd party PDF plugins. However, we cannot be absolutely
  certain which plugin (Adobe or 3rd party) will be used when displaying a PDF, since
  the navigator arrays are not reliable enough across all browsers to reveal info
  on mimetype hijacking. So, instead we can try to look at adobe mimetypes that have
  the name "adobe" in them. I can only hope that any mimetypes with the "adobe" name
  in them will not be used/hijacked by 3rd party PDF Readers.
  Till now, I have not seen any 3rd party PDF Readers use such mimetypes anyway.

  What follows is a list of mimetypes associated with each version of Adobe Reader.


                Adobe Reader
                version (Windows)     Mimetype
              ---------------------------------------------
                      11             application/pdf
                                     application/vnd.adobe.pdfxml
                                     application/vnd.adobe.x-mars
                                     application/vnd.fdf
                                     application/vnd.adobe.xfdf
                                     application/vnd.adobe.xdp+xml
                                     application/vnd.adobe.xfd+xml

                      10             application/pdf
                                     application/vnd.adobe.pdfxml
                                     application/vnd.adobe.x-mars
                                     application/vnd.fdf
                                     application/vnd.adobe.xfdf
                                     application/vnd.adobe.xdp+xml
                                     application/vnd.adobe.xfd+xml

                      9              application/pdf
                                     application/vnd.adobe.pdfxml
                                     application/vnd.adobe.x-mars
                                     application/vnd.fdf
                                     application/vnd.adobe.xfdf
                                     application/vnd.adobe.xdp+xml
                                     application/vnd.adobe.xfd+xml

                      8              application/pdf
                                     application/vnd.adobe.x-mars
                                     application/vnd.fdf
                                     application/vnd.adobe.xfdf
                                     application/vnd.adobe.xdp+xml
                                     application/vnd.adobe.xfd+xml

                      7              application/pdf
                                     application/vnd.fdf
                                     application/vnd.adobe.xfdf
                                     application/vnd.adobe.xdp+xml
                                     application/vnd.adobe.xfd+xml

                      6              application/pdf
                                     application/vnd.fdf
                                     application/vnd.adobe.xfdf
                                     application/vnd.adobe.xdp+xml
                                     application/vnd.adobe.xfd+xml

                      5              application/pdf

*/
  attempt3: function(){

     var version=null;
     
     if ($.OS==1) // Windows only
     {
        // mimetype present in Reader 9+/Windows
        //
        if ($.hasMimeType("application/vnd.adobe.pdfxml")) version="9"

        // mimetype present in Reader 8+/Windows
        //
        else if ($.hasMimeType("application/vnd.adobe.x-mars")) version="8"
                 
        // mimetype present in Reader 6+/Windows
        //
        else if ($.hasMimeType("application/vnd.adobe.xfdf")) version="6"

     }

     return version;


  }  // end of attempt3()


},   // end of nav{}


// Filter out all ActiveX related code 
BOUNDARY3: "select.pluginCheckbox.adobereader && select.miscCheckbox.allowactivex",


// Query
// Return {precision:, version:}
//
// precision is 0,1,2,3 digits
//  0 means no digits
//  1 means "x"
//  2 means "x.y"
//  3 means "x.y.z"
activexQuery: function(pluginObj){

   var VERSIONS="", reg, x, tmp, match,
      result={precision:0, version:null};

   try
   {
      if (pluginObj)
      {
        VERSIONS = pluginObj.GetVersions() + "";

        $.message.write("[ Adobe Reader plugin object has been successfully queried for plugin version ]", $.message.end());
        $.message.write("[ Query result: " + VERSIONS + " ]", $.message.end());
      }
   }
   catch(e)
   {
      $.message.write(["[ Unable to query Adobe Reader plugin object ] ", e], $.message.end())
   }
  

   // I have noticed that for Adobe Reader 7.0.7, the VERSIONS string has multiple
   // numbers present, such as "=7.0.0,=7.0.5,=7.0.7"
   // so we will look for the HIGHEST number and simply take that.
   // I notice the same issue for Adobe Reader 8.1.1
   //
   // For Adobe Reader 11, VERSIONS ==
   // "Accessibility=11.0.,AcroForm=11.0.,Annots=11.0.,Checkers=11.0.,DigSig=11.0.," + 
   // "DVA=11.0.,eBook=11.0.,EScript=11.0.,IA32=11.0.,MakeAccessible=11.0.," + 
   // "Multimedia=11.0.,PDDom=11.0.,PPKLite=11.0.,ReadOutLoud=11.0.,reflow=11.0.," + 
   // "SaveAsRTF=11.0.,Search=11.0.,SendMail=11.0.,Spelling=11.0.,Updater=11.0.,weblink=11.0.,"
   //
   //
   if (VERSIONS && $.isString(VERSIONS))
   {
        // Note: the VERSIONS string can contain an item like ",IA32=11.0.,"
        // hence we added the "=" to the regular expression.
        // We search for string "=5.0.0.0"
        // Note the global modifier "g" because we want all matches.
        // Note: we CANNOT use ?= positive lookahead for string.match()
        reg = /\=\s*[\d\.]+/g;
        
        // VERSIONS = "IA32=11.0., qq=11.0.1, q39 = 11.0.8"

        match = VERSIONS.match(reg);
        if (match)
        {
          // alert("VERSIONS: " + VERSIONS)
          // alert("match.length: " + match.length)
          // alert("match[0]: " + match[0] + "\n" +
          //  "match[match.length-1]: " + match[match.length-1]);

          // Find highest version #
          for (x=0;x<match.length;x++)
          {
               // One could ideally just compare tmp and version directly,
               // using "if (tmp > version) ..."
               // but the problem is that tmp and version are not guaranteed to
               // have the same number of digits, or even the same number of digits
               // between corresponding decimal points. Hence, we use
               // $.format() and $.compareNums().
               tmp = $.formatNum($.getNum(match[x]));
               if  (tmp && (!result.version || $.compareNums(tmp, result.version)>0)) result.version = tmp;

          }

          result.precision = ADOBEREADER.getPrecision(VERSIONS, "\\=\\s*");

       }

   }


   return result;


}, // end of activexQuery()



// Get the Adobe PDF Reader version for IE by instantiating an ActiveX object
axo:{

  // [public]
  // > 0   plugin installed & enabled
  // 0     detection not attempted yet
  // -0.5  plugin appears to be installed but not enabled for ActiveX, not enabled for <object>/<embed> tag.
  //          PDF document may only display in iframe/frame/browser window.
  // -1    plugin not detected
  detected:0,

  // [public]
  // Detected Adobe Reader version
  // [string/null]
  version:null,

  // [public]
  // Precision of version #
  // Can be 0, 1, 2, 3, 4 digits
  precision:0,
  
  
  // Security Pre-Approved ActiveX controls for Adobe Reader for IE
  //
  // For Adobe Reader 11, in the Registry key:
  // [HKEY_LOCAL_MACHINE\SOFTWARE\Classes\MIME\Database\Content Type\application/pdf]
  // The classid entry is "CLSID"="{CA8A...}".
  // This classid corresponds to the ActiveX control object "AcroPDF.PDF" && "AcroPDF.PDF.1".
  //
  // Adobe Reader 11 -  "AcroPDF.PDF", "AcroPDF.PDF.1"
  // Adobe Reader 10 -  "AcroPDF.PDF", "AcroPDF.PDF.1"
  // Adobe Reader 9  -  "AcroPDF.PDF", "AcroPDF.PDF.1"
  // Adobe Reader 8  -  "AcroPDF.PDF", "AcroPDF.PDF.1"
  // Adobe Reader 7  -  "AcroPDF.PDF", "AcroPDF.PDF.1"
  // Adobe Reader 6  -  "PDF.PdfCtrl.5"
  // Adobe Reader 5  -  "PDF.PdfCtrl.5"
  // Adobe Reader 4  -  "PDF.PdfCtrl.1"
  //
  // Note: The ActiveX controls "AcroPDF.PDF", "AcroPDF.PDF.1" have a GetVersions() method,
  // that allows us to see the version of the Adobe Reader plugin.
  // For the purposes of generic PDF Reader detection, however, we do not need to know
  // the plugin version.
  //
  progID: [ // "AcroPDF.FDF", "AcroPDF.FDF.1",
            // "AcroIEHelper.AcroIEHlprObj",
            // "AcroExch.XDPDoc",
            // "AcroExch.Document",
   "AcroPDF.PDF", "AcroPDF.PDF.1", "PDF.PdfCtrl", "PDF.PdfCtrl.5", "PDF.PdfCtrl.1"],

  // Dummy progID that should never instantiate
  progID_dummy: "AcroDUMMY.DUMMY",

  query: function(){

     var axo=this, reader=ADOBEREADER, query,
       obj, version, precision, x, dummyErrObj;

     if (axo.detected) return axo;


     $.message.write("[ ]", $.message.end());
     $.message.write("[ START adobereader.axo.query( ) for ActiveX based browsers ]", $.message.end());


     axo.detected = -1;
     

     // *** There is a bug with Adobe Reader 11 / Internet Explorer 11 / Win7.
     // When we try to run the plugin using ActiveX, the plugin SOMETIMES might
     // silently switch to desktop mode (ie. PDF displays outside the browser).
     // In other words, this bug occurs when we use
     //   1) new ActiveXObject("...") for Adobe Reader
     //   2) When we use <object>/<embed> tag to display a PDF
     // We can detect when this bug occurs by looking at the error object.

     // We use a progID that we know does not exist,
     // then we save the error object.
     obj = $.getAXO(axo.progID_dummy);
     if (!obj) dummyErrObj = $.errObj;


     // We look at progID[x] here.
     // See if Adobe Reader is installed or not.
     for (x=0;x<axo.progID.length;x++)
     {
           obj = $.getAXO(axo.progID[x]);
           if (obj)
           {
              axo.detected = 1;     // Adobe Reader installed & enabled

              // Try to get plugin version using progID[x].
              // This should only work for Adobe Reader 7+.
              query = reader.activexQuery(obj);
              version = query.version;
              precision = query.precision;

              if (!$.dbug && version) break;
           }
           
           // If the ActiveX object does not instantiate, but the error object
           // gives a different message from dummyErrObj, then the Active plugin appears to be 
           // installed, but is disabled. PDF documents will not display with the Active X plugin -
           // they will only display within iframe/frame/browser window/desktop application.
           else if (dummyErrObj && $.errObj &&
             dummyErrObj !== $.errObj && dummyErrObj.message !== $.errObj.message){

                 axo.detected = -0.5;

             }
     }

     if (version) axo.version = version;
     if (precision) axo.precision = precision;


     $.message.write("[ ]", $.message.end());
     $.message.write("[ Adobe Reader plugin: " + 
        (axo.detected>0 ? "installed & enabled" : "not detected") + " ]", $.message.end());
     $.message.write("[ Adobe Reader version: " + (axo.version) + " ]", $.message.end());
     $.message.write("[ Adobe Reader version precision: " + (axo.precision) + " ]", $.message.end());
     $.message.write("[ END adobereader.axo.query( ) for ActiveX based browsers ]", $.message.end());

     return axo;

  }  // end of query()



},   // end of axo{}



doc:{     // ***** start of doc object *****
          // PDF <object> tag using ActiveX classid is inserted into DOM and instantiated,
          // and then we try to detect.

  // [public]
  // ==1     plugin installed & enabled
  // ==0     detection not attempted yet
  // ==-0.5  (IE only) plugin appears to be installed but not enabled for <object>/<embed> tag.
  // ==-1    plugin not detected
  detected:0,

  // [public]
  // Detected Adobe Reader version
  // [string/null]
  version:null,
  
  // [public]
  // Precision of version #
  // Can be 0, 1, 2, 3, 4 digits
  precision:0,


  // Classid for the Adobe Readers Security Approved ActiveX control
  classID: "clsid:CA8A9780-280D-11CF-A24D-444553540000",

  // Classid for a non-existent ActiveX control
  // We make it similar to classID, except for the last group of digits.
  classID_dummy: "clsid:CA8A9780-280D-11CF-A24D-BA9876543210",


  // HTML object for dummy span tag
  // <span>altHTML</span>
  // Should be instantiated BEFORE doc.HTML.
  DummySpanTagHTML: 0,

  // HTML object for empty pdf document
  // An HTML object allows us to access a DOM object, its span container, etc...
  HTML: 0,

  // HTML object for dummy <object> tag1
  // <span><object type="dummyMimeType">altHTML</object></span>
  // Should be instantiated AFTER doc.HTML.
  DummyObjTagHTML1: 0,

  // HTML object for dummy <object> tag2
  // <span><object classid="clsid:dummyClassID">altHTML</object></span>
  // Should be instantiated AFTER doc.HTML.
  DummyObjTagHTML2: 0,


  // Return 1 when detection is disabled
  // Return 0 when detection is enabled
  isDisabled: function()
  {
     var doc=this, disabled=0;

     // If we have already inserted the DummyPDF
     // into the web page, then we are done.
     // This insures that query() can only run once.
     if (doc.HTML) disabled=1

     // In debug mode, we allow all browsers
     else if ($.dbug){}

     else if (

         // Only IE uses the doc{} object.
         // if <object> tag using ActiveX is disabled, then
         // we do not insert into DOM.
         // Otherwise, IE could give a popup for an <object> tag.
         //
         // Note: there is no browser/OS detection here.
         // Only feature detection, which is more reliable.
         !$.DOM.isEnabled.objectTagUsingActiveX()


         ) disabled=1;


     return disabled;

  }, // end of isDisabled()


  // Insert into DOM and query an <object> tag.
  //
  // The <object> tag can give us a plugin version for Adobe Reader 5+.
  // We only need <object> tags to detect the version of Adobe Reader 5 & 6
  // (Reader 7+ is handled by the axo{} object), and to detect when the Adobe plugin
  // is "installed but not enabled" in IE (when it is disabled in the addons menu).
  //
  // **** WARNING: due to reliability concerns, we should always try to avoid
  // displaying a PDF via an <object> tag whenever possible.
  // We only do that here as a last resort. Most PDF Readers seem to be
  // better suited to displaying PDF's outside the browser, or in the browser
  // window/frame (without using <object>/<embed> tags.)
  // <object> tags do not appear to be a very popular way of displaying
  // PDFs, and this is why I believe that PDF Reader authors may not put
  // a high priority on making PDF Readers work well with <object> tags.
  // For this reason, using <object> tags for detection is the very LAST thing we do.
  //
  // NOTE: We use visibiliy:hidden for the <object> tag for Adobe Reader.
  // This could potentially speed up instantiation.
  // Adobe Reader still seems to be detected ok for this.
  // Also, PDF Readers were never really intended to display
  // PDFs in such a small <object> tag as used by PluginDetect, especially
  // when the Reader may add toolbars/scrollbars/etc.., hence we
  // use visibility:hidden.
  //
  // NOTE: Because we are also trying to detect if the plugin is "installed but not
  // enabled", we NEED THE 2 OBJECT TAGS TO BE AS SIMILAR AS POSSIBLE.
  // This way, any small differences in the runtime properties of the 2 object <tags> can help
  // us more reliably distingish between the plugin being "not installed" or
  // "installed but not enabled" by the $.DOM.getTagStatus() routine.
  // The only actual difference between the 2 will be the classid.
  //
  // NOTE: The 'reader' input arg causes the onBeforeInstantiate() event handlers to be executed.
  query: function(){

     var doc=this, reader=ADOBEREADER,
       altHTML=$.DOM.altHTML,

       detectInstNotEnabled=1, iframe, 
       
       query, version, precision,

       // if ==1 give tag a style of visibility:hidden
       // if ==0/undefined give tag a style of visibility:visible
       hidden=1,

       tagStatus;

     if (doc.isDisabled()) return doc;


     // At this point, the code only runs ONCE


     $.message.write("[ ]", $.message.end());
     $.message.write("[ START adobereader.doc.query( ) for ActiveX based browsers ]", $.message.end());



     // Create <iframe>.
     //
     // onload event handler for iframe will wait 99ms, and then execute.
     //
     // The delay helps to insure that the HTML tags reach their final state before
     // we look at the HTML tags. This is just an added safety measure.
     iframe = $.DOM.iframe.insert(99, "Adobe Reader");



     // This is an HTML object for an empty <span> tag with only altHTML.
     // <span>altHTML</span>
     // We instantiate BEFORE doc.HTML.
     doc.DummySpanTagHTML = $.DOM.insert("",
                  [], [],
                  altHTML, reader, hidden, iframe);

     // Instantiate the Adobe Reader in an <object> tag here.
     //
     // Note that if we instantiate an <object> tag with type="application/pdf"
     // instead of classid="...", and if a 3rd party pdf reader is installed
     // and associated with the mimetype "application/pdf", then this <object> tag
     // could cause a security popup in IE 7+. Hence we use the Adobe classid
     // to instantiate instead, because the Adobe classid is security approved in IE.
     // Also, because the Adobe classid specifically targets that software.
     doc.HTML = $.DOM.insert("object",

                  // Adobe Reader classid
                  ["classid", doc.classID],

                  // We do not need to supply a DummyPDF file for detection.
                  // Detection works regardless for Adobe Reader on IE.
                  // Should we add a DummyPDF file here anyway?
                  // It would really only be used by Adobe Reader 5 & 6 anyway,
                  // since Adobe Reader 7+ is adequately handled by the axo{} object.
                  // And when we have the plugin disabled in the addons menu
                  // (for any version of the plugin), then the DummyPDF
                  // will never be loaded anyway.
                  [], // ["src", ""],

                  altHTML, reader, hidden, iframe);


     // This is an HTML object for an <object> tag a dummy classid, which will cause
     // the altHTML to be displayed.
     // It must be instantiated AFTER doc.HTML.
     //
     // We do not need to add any <param>s here since this dummy tag never instantiates.
     doc.DummyObjTagHTML2 = $.DOM.insert("object",

                  // Dummy classid does not exist, so it will not instantiate any plugin.
                  ["classid", doc.classID_dummy],

                  [],

                  altHTML, reader, hidden, iframe);



     // No more tags to insert, so we close the <iframe>
     $.DOM.iframe.close(iframe);


     // Attempt # 1 to detect the plugin
     //
     // Here we try to determine if plugin status, without actually querying the plugin.
     // This routine can potentially tell us if the plugin is "installed but not enabled"
     // for the <object>/<embed> tags. We do this right after the HTML tags were instantiated,
     // but before we query the plugin.
     tagStatus = $.DOM.getTagStatus(doc.HTML, doc.DummySpanTagHTML,
                doc.DummyObjTagHTML1, doc.DummyObjTagHTML2,
                0, 0, detectInstNotEnabled);


     // Attempt # 2 to detect the plugin
     query = reader.activexQuery(doc.HTML.obj());
     version = query.version;
     precision = query.precision;


     doc.detected = tagStatus>0 || version ? 1 : 

           // If plugin is installed but not enabled for <object>/<embed> tags,
           // then return -0.5.
           //
           // Note: tagStatus==-0.5 (IE only) means plugin is installed but not enabled for
           //    <object>/<embed> tags.
           //
           // Note: tagStatus==-0.1 (IE only) means plugin is installed, but enabled status was
           // not determined yet for <object>/<embed> tags, and we need more time to determine that.
           // This is how we GENERALLY interpret this result.
           // However, SPECIFICALLY for Adobe Reader, tagSTatus==-0.1 means
           // installed but not enabled. The reason why we know that is because
           // when Adobe Reader is installed & enabled, we get +1.5 (IE only).
           // If we do NOT get +1.5, then Adobe Reader is either not installed,
           // or installed but not enabled. Since -0.1 means installed (GENERALLY), then
           // we know that Adobe Reader is installed but not enabled.
           //
           (tagStatus==-0.1 || tagStatus==-0.5 ? -0.5 : -1);

     if (version) doc.version = version;
     if (precision) doc.precision = precision;


     $.message.write("[ ]", $.message.end());
     $.message.write("[ Adobe Reader plugin: " + 
        (doc.detected>0 ? "installed & enabled" :
           (doc.detected==-0.5 ? "installed, but not enabled for <object>/<embed> tags" : "not detected")
        ) + " ]", $.message.end());
     $.message.write("[ Adobe Reader version: " + (doc.version) + " ]", $.message.end());
     $.message.write("[ Adobe Reader version precision: " + (doc.precision) + " ]", $.message.end());
     $.message.write("[ END adobereader.doc.query( ) for ActiveX based browsers ]", $.message.end());

     return doc;



  } // end of query()

}, // end of doc{}


// This object queries an Adobe PDF document to get the plugin version.
// Adobe Javascript in Adobe Reader must be enabled in order for this to work.
// The PDF document contains Adobe Javascript that will send the application version
// to the browser.
//
// This object is only intended for ActiveX based browsers.
// This object performs NOTF plugin detection.
doc2:{

  // [public]
  // ==1     plugin installed & enabled
  // ==0     detection not attempted yet
  // ==-0.5  (IE only) plugin appears to be installed, but unable to get version result.
  // ==-1    unable to detect plugin using this detection method
  detected:0,

  // [public]
  // Detected Adobe Reader version
  // [string/null]
  version:null,
  
  // [public]
  // Precision of version #
  // Can be 0, 1, 2, 3, 4 digits
  precision:0,

  // [private]
  // Classid for the Adobe Readers Security Approved ActiveX control
  classID: "clsid:CA8A9780-280D-11CF-A24D-444553540000",
  
  // [private]
  mimeType: "application/pdf",

  // [private]
  // HTML object for empty pdf document
  // An HTML object allows us to access a DOM object, its <span> container, etc...
  HTML: 0,


  // [private]
  count: 0,   // counts the number of times that doc2.onIntervalQuery() is called.
              // onIntervalQuery() is called at regular intervals during NOTF detection.

  // [private]
  count2: 0,   // Specifies the count at which the messageHandler{} is set
  time2: 0,    // Specifies the time (in ms) at which the messageHandler{} is set

  // [private]
  intervalLength: 25,  // Length of time between attempts to query
                       // for NOTF detection. Interval is in milliseconds.
                       //
                       // Note: we use a relatively short interval here.
                       // We want to know relatively quickly when the plugin
                       // causes the <object>.messageHandler property to have a defined
                       // value, which then allows us to set that property
                       // equal to an event handler.
                       

  // [private]
  // *** Choose this value carefully, since this determines the maximum time we wait
  // for the PDF doc to send a message to the browser.
  // After that time has elapsed, we force the NOTF plugin detection to end,
  // assuming that the plugin has not already been detected.
  //
  // max time to wait = intervalLength * maxCount
  //
  // Note: when Adobe Reader Javascript has been disabled, then this is the length
  // of time we must wait for the plugin detection to end. However, most people will
  // not bother to disable Javascript within Adobe Reader.
  //
  // I have noticed in IE, that the actual interval lengths are longer than the one we
  // specified in this Library. Hence,
  //    max time to wait >= intervalLength * maxCount
  //
  // Note: Adobe Reader can sometimes be very slow to start up. 
  // But, we do not want to wait too long in case Adobe Javascript is disabled.
  // For this reason, we choose...
  //         7.5 sec < max time < 10 sec
  //         7500/intervalLength  <  maxCount < 10000/intervalLength
  //         300 < maxCount < 400
  //
  maxCount: 350,



  // [public]
  // Return 0 if doc{} is enabled at the moment
  // Return 1 if doc{} is disabled at the moment, but it may become enabled in the future
  // Return 2 if doc{} is disabled permanently.
  isDisabled: function()
  {
     var doc2=this, reader=ADOBEREADER,
       axo=reader.axo, nav=reader.nav, doc=reader.doc,
       version, precision,
       disabled=0, DummyPDF;


     // If doc2.HTML exists, then we have already inserted the DummyPDF
     // into the web page. Then we are done.
     // doc2{} is permanently disabled.
     // This insures that insertHTMLQuery() only runs once.
     if (doc2.HTML) disabled=2;
     

     else if ($.dbug){}


     // Only IE uses the doc2{} object.
     // If <object> tag using ActiveX is disabled, then
     // we do not insert into DOM.
     // Otherwise, IE could give a popup for an <object> tag.
     //
     // Note: there is no browser/OS detection here.
     // Only feature detection, which is more reliable.
     else if (!$.DOM.isEnabled.objectTagUsingActiveX()) disabled=2;



     // We only run doc2{} under certain circumstances.
     //  a) Adobe Reader 11+ is installed. Querying Adobe Reader via the <object> tag
     //   works ok for 11+. 
     //   (Does not work so well for Adobe Reader 10 / IE. Browser hangs.)
     //  b) Version is known to < 3 digits precision
     //  We thus use doc2{} in the hopes that it can give us more precision for 
     //  the detected plugin version. Querying Adobe Reader via the <object> tag
     // appears to give 3 digits precision (AA.BB.CC.00).
     else{
        version = (nav ? nav.version : 0) || (axo ? axo.version : 0) || 
           (doc ? doc.version : 0) || 0;
        precision = (nav ? nav.precision : 0) || (axo ? axo.precision : 0) || 
           (doc ? doc.precision : 0) || 0;

        if (!version || !precision ||
            precision>2 || 
            $.compareNums($.formatNum(version), $.formatNum("11"))<0)
            { disabled=2; }
     }


     if (disabled < 2)
     {
         DummyPDF = $.file.getValid(reader);
         if (!DummyPDF || !DummyPDF.full) disabled=1;  // doc2{} is disabled for now.
                                                       // But if DummyPDF exists in the future,
                                                       // then doc2{} will be enabled.
     }

     return disabled;

},  // end of isDisabled()


// [private]
handlerSet: 0,


// [private]
// Returns an EVENT HANDLER.
onMessage:function(){
  var doc2=this;

  // ** EVENT HANDLER **
  // This event handler runs when the browser receives a message from the PDF document.
  // @msg is an array.
  return function(msg)
  {
    
    if (doc2.version) return; // Make sure handler only runs once

    doc2.detected = 1;

    if ($.isArray(msg)) msg=msg[0];
    msg = $.getNum(msg + "");

    $.message.write("[ ]", $.message.end());
    $.message.write("[ START <object>.onMessage( ) handler execution ]", $.message.end());
    $.message.write("[ <object>.onMessage( ) data received: " + msg + " ]", $.message.end());

    if (msg) // The version number in msg must be properly formatted
    {

       // 10 -> 10,0,0,0
       // A -> A,0,0,0
       if ((/^(\d+)[.,_]?$/).test(msg)){
          msg = RegExp.$1 + ",0,0,0";
          doc2.precision = 3;
       }

       // 10.101 -> 10,1,1,0
       // 11.008 -> 11,0,8,0
       // 15.00920069 -> 15,9,20069,0
       else if ((/^(\d+)[.,_](\d)(\d\d)$/).test(msg) ||
                (/^(\d+)[.,_](\d\d\d)(\d\d\d\d\d)$/).test(msg)
               ){
          msg = RegExp.$1 + "," + RegExp.$2 + "," + RegExp.$3 + ",0";
          doc2.precision = 3;
       }
       
       // Handle unknown case.
       // This case should not happen.
       else if ((/^(\d+)[.,_](\d\d\d)(\d\d\d\d\d)(\d+)$/).test(msg)){
          msg = RegExp.$1 + "," + RegExp.$2 + "," + RegExp.$3 + "," + RegExp.$4;
          doc2.precision = 4;
       }
       
       // Handle unknown case.
       // This case should not happen.
       // A.BC -> A,B,C,0
       else if ((/^(\d+)[.,_](\d)(\d)$/).test(msg)){
          msg = RegExp.$1 + "," + RegExp.$2 + "," + RegExp.$3 + ",0";
          doc2.precision = 3;
       }
       
       // Handle unknown case.
       // This case should not happen.
       // A.B -> A,B,0,0
       else if ((/^(\d+)[.,_](\d)$/).test(msg)){
          msg = RegExp.$1 + "," + RegExp.$2 + ",0,0";
          doc2.precision = 3;
       }


       doc2.version = $.formatNum(msg);


       // Normally, we would not bother calling setPluginStatus() here.
       // We would just let queryCompleted() call setPluginStatus().
       // However, in the rare case where this event handler runs AFTER
       // queryCompleted(), we would want the plugin status to be updated again.
       // So, we run setPluginStatus() here as well.
       ADOBEREADER.setPluginStatus();

    }

    $.message.write("[ " + ((new Date()).getTime()-doc2.time2) +
                 " ms have elapsed after <object>.messageHandler{ } has been set ]", $.message.end());
    $.message.write("[ END <object>.onMessage( ) handler execution ]", $.message.end());

  } // end of event handler

}, // end of onMessage


// [private]
// When <object>.messageHandler !== undefined, return 1
// Else return 0
isDefinedMsgHandler: function(obj, undefined){
   // Note, we do NOT use $.isDefined() here, because
   // obj is an HTML tag, and for IE sometimes an HTML
   // tag property associated with a plugin can be "unknown",
   // which cannot be given as an input to a function.
   try{ return obj ? obj.messageHandler !== undefined : 0 }
   catch(e){}
   return 1;
},


// [private]
queryObject: function(){
    var doc2=this,
       HTML = doc2.HTML,
       obj = HTML ? HTML.obj() : 0;


   if (!obj) return;


   // The PDF doc will automatically post a message to the browser as soon as it loads.
   // We need to set the message handler at the right time in order to receive the message.
   // If it is too soon or too late, this detection will not work.
   //
   // We wait until pdf doc has fully loaded, and
   // if getObj().messageHandler is no longer undefined,
   // then we can set it. But we only set it ONCE.
   if (!doc2.handlerSet && doc2.isDefinedMsgHandler(obj))
   {
      try{
         obj.messageHandler = { onMessage: doc2.onMessage() };
      }catch(e){}
      
      $.message.write("[ ]", $.message.end());
      $.message.write("[ START waiting for data from <object>.messageHandler{ } ]", $.message.end());
      $.message.write("[ <object>.messageHandler{ } has been set ]", $.message.end());

      doc2.handlerSet = 1; // We make sure that handler is set only once

      // Once the PDF doc has loaded and the handler has been set,
      // we wait a given period of time before forcing the plugin detection
      // to end. We save the count and the time to keep track of how long it takes to
      // get the data.
      doc2.count2 = doc2.count;
      doc2.time2 = (new Date()).getTime(); // time in ms

   }


   if (!doc2.detected)
   {
      // If <iframe> loaded and !handlerSet, then no need to run this routine again.
      //    (This occurs when Adobe Reader not installed, not enabled)
      if (doc2.count>3 && !doc2.handlerSet){
         doc2.detected = -1;
        // plugin not installed
      }


      // - If Adobe Javascript is disabled, then message will never be received.
      // - Or, sometimes the plugin may just be too slow.
      //
      // We figure out here if we should force the plugin detection to end.
      // We do this when a min time has passed, and a min # intervals have passed.
      else if (doc2.time2 && doc2.count - doc2.count2 >= doc2.maxCount &&
         (new Date()).getTime() - doc2.time2 >= doc2.intervalLength * doc2.maxCount){
         doc2.detected = -0.5;
         // plugin installed, but no result from plugin query
      }
   }


   if (doc2.detected)
   {

      if (doc2.detected!=-1)
      {
        $.message.write("[ ]", $.message.end());
 
        $.message.write("[ " + ((new Date()).getTime()-doc2.time2) +
                 " ms have elapsed after <object>.messageHandler{ } has been set ]", $.message.end());

        $.message.write("[ Min time we would wait for data from messageHandler: " +
                  (doc2.intervalLength * doc2.maxCount) + " ms ]", $.message.end());

        $.message.write("[ Min time we would wait for data from messageHandler: " +
                  (doc2.maxCount) + " intervals ]", $.message.end());

        $.message.write("[ " + (doc2.count-doc2.count2) +
                 " intervals have elapsed after messageHandler{ } has been set ]", $.message.end());

        $.message.write("[ Set length of each interval: " + doc2.intervalLength + " ms ]", $.message.end());

        $.message.write("[ Actual Length of each interval: " + 
           Math.round(((new Date()).getTime()-doc2.time2) / (doc2.count-doc2.count2)) + " ms ]", $.message.end());

        $.message.write("[ END waiting for data from <object>.messageHandler{ } ]", $.message.end());

      }

   }

  
}, // end of queryObject()


// [public]
// Insert into DOM and query an <object> tag.
//
insertHTMLQuery: function(){
    
     var doc2=this, reader=ADOBEREADER,
       altHTML=$.DOM.altHTML, DummyPDF,

       iframe,

       // if ==1 give tag a style of visibility:hidden
       // if ==0/undefined give tag a style of visibility:visible
       // Note: must be visible in order to query the plugin.
       hidden=0;

     if (doc2.isDisabled()) return doc2;


     // From here, the code only runs once


     $.message.write("[ ]", $.message.end());
     $.message.write("[ START adobereader.doc2.insertHTMLQuery( ) for ActiveX based browsers ]", $.message.end());


     if (reader.OTF<2) reader.OTF=2;   // indicates that this routine was called


     // Most recent valid input DummyPDF string specified by the user
     DummyPDF = $.file.getValid(reader).full; 
     
     
     //if (DummyPDF) DummyPDF += "#scrollbar=0&toolbar=0&statusbar=0&navpanes=0&messages=0";


     // Create <iframe>.
     //
     // onload event handler for iframe will not be delayed, hence the 0 input.
     iframe = $.DOM.iframe.insert(0, "Adobe Reader");


     // *** For some strange reason, when iframe width < 25, then we cannot query the
     // PDF document.

     // *** For some strange reason, this <script> object is needed by IE 8 for the
     // Javascript bridge to work between the PDF and the browser.
     $.DOM.iframe.write(iframe, '<script type="text/javascript"></script>');


     // Instantiate the Adobe Reader in an <object> tag here.
     // Adobe classid specifically targets that software.
     doc2.HTML = $.DOM.insert("object",
                  ["data", DummyPDF].concat( 
                   $.browser.isIE ? ["classid", doc2.classID] : ["type", doc2.mimeType] ),

                  ["src", DummyPDF],

                  altHTML, reader, hidden, iframe);

     // add handler to run when <iframe> loads
     $.DOM.iframe.addHandler(iframe, doc2.onIntervalQuery);


     // We set OTF BEFORE closing the <iframe>
     if (reader.OTF<3 && doc2.HTML)
     {
        reader.OTF = 3;     // Detection is now being performed NOTF
                            // Setting = 3 means that this section of code can
                            // only be executed ONCE.

        $.message.write("[ ]", $.message.end());
        $.message.write("[ START NOTF ADOBEREADER detection ]", $.message.end());

        $.message.write($.message.time(doc2, 1), $.message.end());  // Start measuring time delay for NOTF detection

     }


     // No more tags to insert, so we close the <iframe>
     $.DOM.iframe.close(iframe);



     $.message.write("[ ]", $.message.end());
     $.message.write("[ Adobe Reader plugin: " +
        (doc2.detected>0 ? "installed & enabled" :
           (doc2.detected==-0.5 ? "installed, but not enabled for <object>/<embed> tags" : "not detected")
        ) + " ]", $.message.end());
     $.message.write("[ Adobe Reader version: " + (doc2.version) + " ]", $.message.end());
     $.message.write("[ Adobe Reader version precision: " + (doc2.precision) + " ]", $.message.end());
     $.message.write("[ END adobereader.doc2.insertHTMLQuery( ) for ActiveX based browsers ]", $.message.end());


     return doc2;

  }, // end of insertHTMLQuery()



// [private]
// ** EVENT HANDLER **
// queries pdf object status at regular intervals.
// This is for NOTF detection.
onIntervalQuery: function(){

     // *** We avoid putting any $.message.write() statements in this routine, because
     // they slow down the browser and it then takes longer for the PDF doc to 
     // send a message to the browser.

     var reader = ADOBEREADER, doc2=reader.doc2;

     doc2.count++;  // Set this BEFORE any other code runs.

     // reader.OTF == 3 means that reader.installed == -0.5 or +0.5
     // If we are in NOTF mode and pdf object has not given any result yet...
     if (reader.OTF == 3)
     {
         doc2.queryObject();

         if (doc2.detected) doc2.queryCompleted();
     }

     // If detection not done yet, then we run this routine again after a delay
     if (reader.OTF == 3) $.ev.setTimeout(doc2.onIntervalQuery, doc2.intervalLength);


},   // end of onIntervalQuery()


// [private]
queryCompleted:function(){
  
     var doc2=this, reader=ADOBEREADER;

     // queryCompleted() should only be called once.
     // We use this next line of code to guarantee that it only
     // runs ONCE.
     if (reader.OTF == 4) return;
     reader.OTF = 4;    // NOTF Detection has now been completed


     reader.setPluginStatus();


     $.message.write("[ END NOTF ADOBEREADER detection in " + $.message.time(doc2) + " ]", $.message.end());
     $.message.write("[ " + $.message.time($) + " after script initialization ]", $.message.end());



     // It is possible to start NOTF detection...
     //
     // 1) by using getVersion() or isMinVersion()
     // 2) or by using onDetectionDone()
     //
     // To see if onDetectionDone() was used to call this routine, we check for the presence of
     // onDetectionDone() && DoneHndlrs[] array.
     $.message.write($.onDetectionDone && reader.DoneHndlrs ? "[ END " + reader.pluginName + 
          " detection for " + $.name + ".onDetectionDone(" + $.message.args2String(reader.pluginName) + ") in " +
          $.message.time(reader.DoneHndlrs) + " ]" : 0, 
          $.message.end());

     $.message.write($.onDetectionDone && reader.DoneHndlrs ? "[ START event handlers for " + 
           $.name + ".onDetectionDone(" + $.message.args2String(reader.pluginName) + ") ]" : 0, 
           $.message.end());

     // Execute the event handlers f specified by the $.onDetectionDone("pluginName", f) method.
     //
     // Note: we execute callArray() even when DoneHndlrs[] is empty or does not exist.
     // The reason is that callArray() will automatically check if ALL event handlers
     // are done, and then runs some final cleanup handlers (since we just completed detection for
     // this one plugin).
     $.ev.callArray(reader.DoneHndlrs);

     $.message.write($.onDetectionDone && reader.DoneHndlrs ? "[ END event handlers for " + 
          $.name + ".onDetectionDone(" + $.message.args2String(reader.pluginName) + ") ]" : 0, 
          $.message.end());


}, // end of queryCompleted()

z:0


}, // end of doc2{}



BOUNDARY33:"select.pluginCheckbox.adobereader && select.methodCheckbox.getinfo",

// [public]
getInfo:function(){

   var reader=this;

   reader.setPluginStatus();

   var result={

         // 0: Detection is OTF if reader.OTF<3
         // 1: Detection is pending and will be NOTF if reader.OTF==3
         // 2: Detection is NOTF if reader.OTF>3
         OTF:(reader.OTF<3 ? 0 : (reader.OTF==3 ? 1 : 2)),

         DummyPDFused: false,

         version: reader.version,

         precision: reader.precision

     };

     // Filter out all ActiveX related code
     BOUNDARY("select.pluginCheckbox.adobereader && select.methodCheckbox.getinfo && select.miscCheckbox.allowactivex");

     if (reader.doc2.detected==1 || reader.doc2.detected==-0.5) result.DummyPDFused = true;

     BOUNDARY("select.pluginCheckbox.adobereader && select.methodCheckbox.getinfo");

     return result;

}, // end of getInfo{}



BOUNDARY7:"select.pluginCheckbox.adobereader && select.pluginCheckbox.verifyadobereader",



// ******* verify pdf ********
// Verify that your DummyPDF name & path are correct.

// [public]
verify:{


BOUNDARY0:"0",   // We always delete this item, so then the verify{} object
                 // is automatically enabled when it is included in the script.

// == 1 to disable the verify routine. Verify routine will not run.
// == 0/null/""/undefined to enable verify routine. Verify routine will run.
isDisabled:1,


BOUNDARY34:"select.pluginCheckbox.adobereader && select.pluginCheckbox.verifyadobereader",


// output <div> that holds verify messages
div: null,


// [** PUBLIC **]   $.Plugins.pdfreader.verify.enable()
// Enable the verify{} object for writing.
enable: function(){
   this.isDisabled = 0;
},

// [** PUBLIC **]   $.Plugins.pdfreader.verify.disable()
// Disable the verify{} object from writing.
disable: function(){
   this.isDisabled = 1;
},

// [public]
isEnabled: function(){
   return !this.isDisabled;
},

// Insert text node into verify.div
//
// text = text content
//
// S = [style property, style value,...]
// or S = "bold", "verified", "error", "warning"
//
// br = false (boolean) will prevent line feed
addText: function(text, S, br){
     var verify=this;
     $.verify.addText(verify.div, text, S, br);
},

// [public]
// Run init() only once.
// When this routine runs, it means that pdf detection has been initiated by the user.
init: function(){

  var verify = this;

  // if disabled, return
  // if this routine already ran, return
  if (!verify.isEnabled() || verify.div) return;

  verify.div = $.verify.init(verify, "AdobeReader", "DummyPDF", "empty.pdf", ".pdf");

  // We wait for all the user specified plugin detections to be fully completed.
  // This allows us to accumulate all possible references to the input DummyPDF.
  // Then we execute verify.onReady().
  $.ev.fPush([verify.onReady, verify], $.ev.allDoneHndlrs);
  
  $.ev.fPush([verify.onUnload, verify], $.win.unloadHndlrs);

}, // end of init()


// [private]
// ** EVENT HANDLER **
onUnload: function($, verify){

   verify.disable();
  
   $.DOM.emptyNode(verify.div);
   $.DOM.removeNode(verify.div);

   verify.div = null;

}, // end of onUnload()



// ** EVENT HANDLER **
// This is an event handler, hence we have $, verify as inputs.
// Verify the plugin when ready.
onReady: function($, verify){

  var reader = ADOBEREADER, topWinDoc = window.top.document;

  if (!$.verify.checkfile1(verify.div, reader, "Adobe Reader", "DummyPDF", ".pdf")) return; // Error

  // Insert iframe to verify the PDF path/filename.
  // There is a question as to whether we insert an <iframe> or an <object> tag for this
  // verification test. The <object> tag, for non-IE browsers, should not give any popups.
  // However, the <iframe> will perhaps be more reliable in showing a PDF, even though
  // an <iframe> may give you a popup when no PDF reader is installed/enabled.
  var iframe, DummyPDF = $.file.getValid(reader);
  if (DummyPDF) DummyPDF = DummyPDF.full;

  verify.addText();
  verify.addText("The box shown below should display the " + $.name + " DummyPDF document.");
  verify.addText("If it does, then the [path/]filename for DummyPDF in your detection code is correct.");
  verify.addText("[Or, if a standalone PDF viewer pops up and displays the DummyPDF document, " +
    "then the [path/]filename for DummyPDF is correct.]");
  verify.addText();
  iframe = topWinDoc.createElement("iframe");
  iframe.width = "98%";
  iframe.height = "300";
  iframe.src = DummyPDF;
  $.DOM.setStyle(iframe,
     [ "border","solid black 1px",
       "padding","1px"
     ]
  );
  verify.div.appendChild(iframe);
  
  verify.addText();
  verify.addText();
  verify.addText();
  
  verify.addText("DONE", "verified");
  verify.addText();

} // end of onReady()

},   // end of verify object



BOUNDARY9: "select.pluginCheckbox.adobereader",


// Property is automatically removed by Script Generator
lastProperty:"select.pluginCheckbox.adobereader"


}; // end of adobereader{}


$.addPlugin("adobereader", ADOBEREADER);



// ****************************** End of Adobe PDF Reader detection ***************************






// ****************************** PDF Reader detection ****************************************
/*

  This detector will look for any generic pdf reader installed in a browser.
  We try to detect the PDF Reader, regardless of whether the Reader is a browser plugin,
  or is native (built-in) to the browser.

  NOTE: Given any uncertainty in this detection routine, we would rather have a false
  positive as opposed to a false negative!!! In other words, we would rather say that
  PDF is installed and be wrong, as opposed to saying that PDF is not installed and be wrong.

  ...

--->  We now discuss the different ways in which a user may view a PDF document on his or her
  computer. Understanding this will help us to better detect various PDF Readers on
  different browsers.
  
  There are 2 main ways that you can view a PDF document on your computer:
    1) In a PDF Reader standalone application (there is no browser involved here).

    2) Inside a browser. The browser may have a built-in (native) PDF viewer, or you may
    have to install a browser plugin to be able to view PDF documents in your browser.
 

  We can usually detect PDF Readers that are within a browser by using PluginDetect.

  We CANNOT detect standalone applications from within a browser. However, if a PDF Reader
  plugin is detected in a browser, then we may safely ASSUME that the corresponding
  PDF Reader standalone application is also on the computer. For example, if the
  Adobe PDF Reader browser plugin is detected, then we know that the Adobe Reader
  standalone PDF Reader is also present on the same computer.


--->  We are primarily concerned with PDF Readers inside a browser, so now we focus on the issues
  that deal with PDF Readers in various browsers...
  
  There are a few different ways in which a browser may display a PDF document:
    1) The browser displays the PDF directly in the browser window. The URL of the browser
    points directly at the PDF, as in URL == "http://www.mywebsite.com/doc.pdf"
    The PDF document is NOT embedded inside a web page.
    In my opinion, the majority of users see a PDF document directly in the browser window,
    because that way the document will appear the largest.
    2) The browser displays a web page, and embedded within the web page is an <iframe> tag or
    a <frame> tag which displays the PDF document.
    3) The browser displays a web page, and embedded within the web page is an <object> tag or
    an <embed> tag which displays the PDF document.



---> For the Internet Explorer browser, PDF Readers can be detected by:
     1) instantiating new ActiveXObject("...")
     2) instantiating an <object> tag with a classid="clsid:..." or type="application/pdf"

  For Adobe Reader in IE, detection is quite simple. We can use new ActiveXObject() to detect
  the plugin. The browser does not give any security popups when instantiating the ActiveX
  control, because the ActiveX control is given security preapproval. You can even
  use an <object> tag to detect the Adobe Reader plugin, and no security popup will occur.

  Up until Adobe Reader < 11, you could change the Reader preferences so that PDF documents
  would NOT display in the browser (applies to ALL browsers). When you try to view a PDF
  in the browser (either the window, or in a <iframe>/<frame>), the PDF would be downloaded
  and then the standalone application would pop up and display the PDF. When this happens,
  there is NO way to detect the Adobe Reader plugin, because the plugin has been fully disabled.
  
  On the other hand, for Adobe Reader 11+, you no longer can go into the Adobe Reader prefs
  in order to activate/deactivate the browser plugins. Instead, you now have to go into
  the browser's settings, and disable/enable the plugin.

  The reason why I mention this, is because in IE we enable/disable plugins in the add-ons menu.
  It appears that it is possible in IE for PluginDetect to detect a plugin, even when
  disabled in the add-ons menu. It is not possible to get the plugin version, but it is
  possible to detect that it is "installed but not enabled". 
  
  And for Adobe Reader 11+, if a user decided that they only wanted to view PDFs outside the
  browser, then PluginDetect will be able to detect that situation. Prior to Adobe Reader 11,
  we could not detect when a user can view PDFs outside of IE.
  

---> An ActiveX control in IE can be prevented from running in IE in the following ways:
    1) The specific ActiveX control has been disabled in the add-ons menu of the browser.
    In this case, PluginDetect can detect that the plugin (Active control) is installed, 
    but that its ActiveX control is disabled. We do this using an <object> tag.
    For Adobe Reader, is disabled in the add-ons menu, for example, we can use the <object> tag
    to detect that Adobe Reader is installed, but its ActiveX control is disabled. 
    [We discuss this in more detail in a moment]
    2) The ActiveX control does not have security approval to run in the browser. When
    you try to instantiate the control, a security popup will display in the browser.
    The user will have to give permission for it to run. And from that point on, the
    ActiveX control should run without any popups. In this case, when the <object> tag
    is used to instantiate an ActiveX control, and we get a security popup, then we
    can detect this. We will see that the ActiveX control is installed but not enabled.
    3) You can disable ActiveX in the security settings, which will prevent ALL ActiveX
    controls from running. As a matter of fact, when you do this, any <object> tag in a 
    web page will most likely give a security popup. It is NOT possible for PluginDetect
    to detect if an ActiveX control is installed & enabled, and it is NOT possible to 
    detect if an ActiveX control is installed & not enabled.
    4) For IE 9+, there is a new feature called "ActiveX Filtering". The ActiveX filter,
    when enabled, will disable most ActiveX controls (but not all). It is possible to have
    ActiveX filtering on, while ActiveX itself is also still enabled. It is NOT possible 
    for PluginDetect to detect if an ActiveX control is installed & enabled, and it is 
    NOT possible to detect if an ActiveX conytrol is installed & not enabled.

  So, we can only detect possibilities 1) & 2) above, though we can easily detect when
  ActiveX is disabled or filtered.
  
  
---> When an ActiveX control is prevented from running, we are curious to see how this
  affects the ability to display a PDF document in <object/<embed> tags, in
  <iframe>/<frame> tags, and in the browser window itself.

      1) In IE 8, WinXP SP3, Foxit Reader 3 
      gives a security popup in the browser when we try to display a PDF with
      an <object> tag, where the <object> tag uses type="application/pdf". 
      In this case...
      The <iframe> is still able to display a PDF document.
      The browser window is still able to display a PDF document.
      It would appear that the ActiveX control associated with the <object>/<embed> tags
      does not affect the <iframe>/window.

      2) In IE 8, WinXP SP3, Adobe Reader 11
      We disable the Adobe Reader plugin in the add-ons menu.
      The <object>/<embed> tags will thus not display any PDF.
      The <iframe> tag will not display any PDF, and will actually give a security popup
         that it was about to download the PDF.
      The browser window will not display any PDF either. Instead, the PDF will download
        and will appear in the standalone application.

      3) In IE 8, WinXP SP3, Adobe Reader 11
      We can disable ActiveX in the browser.
      The <object>/<embed> tags will not display any PDF.
      The <iframe> tag CAN display a PDF.
      The browser window CAN display a PDF.

      4) In IE 8, WinXP SP3, Adobe Reader 10
      We disable the ActiveX control associated with the Adobe Reader plugin in the add-ons menu.
      The <object>/<embed> tags will NOT display any PDF, because they use ActiveX.
      The <iframe> CAN display a PDF, because it does not use ActiveX.
      The browser window CAN display a PDF, because it does not use ActiveX.


  Based on these few cases we can draw a few conclusions:

      1) ActiveX is required by the <object>/<embed> tags to display a PDF document.
      If you disable the ActiveX control associated with the plugin in the add-ons menu,
      or you disable ActiveX, or you enable ActiveX filtering, then the
      <object>/<embed> tags will be unable to display a PDF.
      
      2) ActiveX does not appear to have any effect on the <iframe>/<frame> tags in their
      ability to display a PDF. The same can be said for the browser window.
      The <iframe> tag, the <frame> tag, and the browser window can display a PDF regardless
      of whether ActiveX is enabled or not. (This assumes that the browser/standalone app are
      set to allow a PDF to display within the browser.)

 ***  3) When we detect that a PDF Reader is installed, but not able
      to display a PDF in the <object>/<embed> tag, then we cannot generically say whether
      the <iframe>/browser window are able to display a PDF. 
      In the case of Foxit Reader, the PDF would display in the <iframe>/window.
      In the case of Adobe Reader < 11, the PDF would display in the <iframe>/window.
      In the case of Adobe Reader 11+, the PDF would NOT display in the <iframe>/window,
         instead the PDF would download and display in the standalone application.


---> In Firefox you can change the browser prefs to automatically open a pdf in
  the external/standalone PDF Reader application. The pdf would no longer display
  inside the browser window itself. Because of this ability in Firefox
  (and probably some other browsers) to force a pdf
  to always open in the external reader application, it is probably not a good idea
  to use a HIDDEN <IFRAME> to try to detect if any pdf reader is installed in the browser.
  [We can detect pdfreaders in IE/Firefox by putting a Dummy pdf inside an iframe, and looking
  at iframe.contentWindow.document, etc...]. So, the hidden iframe trick to detect pdf readers
  is probably not a good idea, since the Dummy pdf could pop up in the external application.



*/


BOUNDARY("select.pluginCheckbox.pdfreader");


var PDFREADER = {


  // Property is automatically removed by Script Generator
  firstProperty:"select.pluginCheckbox.pdfreader",


  BOUNDARY0:"0",

  // [public]
  // This object assists in creating a custom version of the script for the user.
  script:{

    select:{pluginCheckbox:{pdfreader:"PDFReader", verifypdfreader:"VerifyPDFReader"}},

    fileNameSuffix:{pluginCheckbox:{pdfreader:"PDFReader", verifypdfreader:""}},

    checkboxLabel:{pluginCheckbox:{pdfreader:{
      text: "Generic PDF Reader&nbsp;&nbsp;&nbsp;" +
            "(<a href='../files/empty.pdf'>Download the DummyPDF document used by this detector</a>. " + 
            "Just right click and Save As)",
      verifypdfreader:{
        text:"Verify DummyPDF [path/]name.<br>" +
             "This will help verify that you are specifying the correct [path/]name " + 
             "for DummyPDF in your PDF Reader detection code.<br>" +
             "The results of this verification will be shown at the top of your " +
             "web page when PDF Reader detection is performed. " + 
             "This feature is for testing/debugging purposes only.<br>"
        }
      }}},

    errCheck:{pluginCheckbox:{
      pdfreader:function(code, select){
        if (!select.miscCheckbox.allowactivex &&
             (/\.axo|\.codebase|\.AXO|\.getAXO|\.ActiveX|ActiveXObject/).test(code.customModuleScript)
           )
              alert("Error: ActiveX code found in " + code.moduleName + " module");
      },
      verifypdfreader:0
    }},

    // [public]
    // include:function(select){} tells us which other modules to include when using this module.
    //
    // Do not put $.message/BOUNDARY in the array[] here because they are automatically
    // included/removed from the script as needed.
    //
    // Any items in the outermost array must ALL be included (AND).
    // At least one item in an inner array must be included (OR).
    //
    // For this particular plugin, plugin.getVersion() can be called by either
    // $.isMinVersion() or $.getVersion(). However, since $.getVersion() will always
    // return null in this case, then we only include $.isMinVersion here.
    include:{pluginCheckbox:{
       pdfreader:function(){
          return [$.ev, $.win, $.DOM, $.file, 

          // We can perform NOTF detection using $.onDetectionDone().
          $.onDetectionDone,

          $.hasMimeType, $.isMinVersion]
       },
       verifypdfreader:function(){
         return [$.verify]
       }
    }}
  }, // end of script{}

  BOUNDARY1:"select.pluginCheckbox.pdfreader",



  OTF: null,   // if 0,1,2 then detection was performed OTF
               // if 3 then detection is being performed NOTF but is not yet completed
               // if 4 then NOTF detection has been completed.
               // when OTF==3 it means that reader.installed==-0.5 or +0.5

  // If == 0, then do not detect 3rd party PDF Readers for IE. Only detect Adobe Reader for IE.
  // If == 1, then try to detect 3rd party PDF Readers for IE, in addition to Adobe Reader.
  //
  // We set the default value to 0. So if there is no input detectIE3P specified by the user, 
  // then by default we use the value of 0.
  detectIE3P: 0,



  // This routine sets the value of all the output variables for the $.Plugins.pdfreader object.
  // The [public] output variables of the PDF Reader detection are reader.version, reader.installed,
  // and reader.getVersionDone.
  //
  // We call this routine right before returning from reader.getVersion() and
  // before returning from reader.NOTF.queryCompleted().
  //
  // reader.getVersionDone determines whether reader.getVersion() can be called again.
  // Basically, if the user did not specify a DummyPDF and a PDF Reader was not detected,
  // then we allow getVersion() to be called again, in the hopes that a DummyPDF will be
  //  specified the next time.
  // getVersion() can be called again if getVersionDone==0
  // getVersion() cannot be called again if getVersionDone==1
  //
  // ** Please make sure that reader.OTF is up to date when running this routine.
  // Make sure reader.doc.result is up to date.
  // Make sure reader.mime.result is up to date.
  // Make sure reader.axo.result is up to date.
  setPluginStatus: function(){

     $.message.write("[ ]", $.message.end());
     $.message.write("[ START set plugin status ]", $.message.end());


     var reader=this, OTF = reader.OTF,

        result_doc = reader.doc.result,   // >0 pdf detected, <0 pdf not detected, ==0 detection is ongoing (wait)
        result_mime = reader.mime.result, // >0 pdf detected, <0 pdf not detected, ==0 detection is ongoing (wait)
        
        installed = result_doc>0 || result_mime>0; // is plugin installed & enabled ? true/false
     $.message.write("[ pdfreader.mime.result: " + reader.mime.result + " ]", $.message.end());
     $.message.write("[ pdfreader.doc.result: " + reader.doc.result + " ]", $.message.end());


     BOUNDARY("select.pluginCheckbox.pdfreader && select.miscCheckbox.allowactivex");

     // ActiveX only
     var result_axo = reader.axo.result;     // >0 pdf detected, <0 pdf not detected, ==0 detection is ongoing (wait)
     installed = installed || result_axo>0;  // is plugin installed & enabled ? true/false
     $.message.write("[ pdfreader.axo.result: " + reader.axo.result + " ]", $.message.end());
     // end of ActiveX

     BOUNDARY("select.pluginCheckbox.pdfreader");


     // Note: If (result_mime>0 || result_axo>0) && result_doc<0,
     //   then we still say pdf reader installed.
     //   The reason is that it is possible for a pdf reader to be installed,
     //   but the browser may require a click to activate the reader. In that
     //   case, result_doc<0 despite the reader being installed.



     // We do not detect PDF Reader version, because this is a generic PDF Reader detector.
     // Different readers will have different version numbers, so there is no point.
     reader.version = null;



     // if NOTF Detection is being performed
     if (OTF == 3){ reader.installed = -0.5; }


     // else OTF Detection has been completed or NOTF Detection has been completed.
     else
     {
              //  reader.installed = 0      PDF reader installed & enabled, but plugin version unknown
              //  reader.installed = -1     not installed/not enabled in the browser.
              //                            However, it is still possible that a PDF Reader
              //                            is installed on the computer and that the
              //                            standalone application will display PDFs outside 
              //                            the browser.
              installed = installed ? 0 : -1;

              BOUNDARY("select.pluginCheckbox.pdfreader && select.miscCheckbox.allowactivex");

              // ActiveX
              if (installed==-1) installed =
                
                 // Plugin is installed but not enabled for <object>/<embed> tags
                 // reader.installed = -0.15  installed, but not enabled for <object>/<embed> tags.
                 //   PDF documents may be displayed in the browser
                 //   and/or in the standalone application. It depends
                 //   on the browser/reader settings. But <object>/<embed>
                 //   tags cannot be used for PDFs.
                 //   This can occur in IE when the plugin ActiveX control is disabled in
                 //   the add-ons menu.
                 result_axo == -0.5 || result_doc == -0.5 ? -0.15 :

                  ($.browser.isIE && 
                  
                   // For the moment, we only can say -1.5 for IE.
                   // For non-IE browsers, we should always be able to tell one way
                   // or the other if installed or not.
                   //
                   //  reader.installed = -1.5   unable to determine if PDF Reader is present or not.
                   //     Browser is Internet Explorer only. There are a few reasons why the plugin
                   //     status is unknown. ActiveX may be disabled, which prevents detection.
                   //     If reader.detectIE3P==false, then we do not detect 3rd party PDF readers,
                   //     so we do not know if a 3rd party reader is present or not.
                   (!$.browser.ActiveXEnabled || $.browser.ActiveXFilteringEnabled || !reader.detectIE3P) ? -1.5 : -1);

              // end of ActiveX

              BOUNDARY("select.pluginCheckbox.pdfreader");


              reader.installed = installed;

     }



     // If we are verifying all the DummyPDF [path/]names, then we force getVersionDone
     // to remain at 0. This way plugin.getVersion() will continue to be called,
     // and we can examine all the instances of the DummyPDF input arg to PluginDetect.
     if (reader.verify && reader.verify.isEnabled()){
           reader.getVersionDone = 0;
     }

     // When getVersionDone == 1, then it should stay that way.
     else if (reader.getVersionDone != 1)
     {

        // If PDF Reader was not detected (yet)
        // and doc{} is not permanently disabled (yet)
        // then getVersionDone=0.
        //
        // This occurs when reader.installed == -0.5
        // or when reader.installed == -1 and reader.doc.isDisabled()<2
        //
        reader.getVersionDone =
         (
            reader.installed == -0.5 ||
           (reader.installed == -1 && reader.doc.isDisabled1()<2 && reader.doc.isDisabled2()<2)
         ) ? 0 : 1;

     }


     $.message.write("[ pdfreader.OTF: " + reader.OTF + " ]", $.message.end());
     $.message.write("[ pdfreader.version: " + reader.version + " ]", $.message.end());
     $.message.write("[ pdfreader.installed: " + reader.installed + " ]", $.message.end());
     $.message.write("[ pdfreader.getVersionDone: " + reader.getVersionDone + " ]", $.message.end());
     $.message.write("[ END set plugin status ]", $.message.end());


  },  // end of setPluginStatus()


  // [public]
  //
  // DummyPDF is [path/]name for Dummy pdf file
  // detectIE3P:
  //   ==1 detect 3rd Party PDF Readers in IE
  //      This most likely will cause a security popup in IE when a 3rd
  //      party PDF Reader is encountered.
  //   ==0 do not detect 3rd Party in IE, only detect Adobe Reader in IE.
  //      No security popup will occur, since Adobe Reader is security pre-Approved
  //      by the installer.
  getVersion: function(_minVersion, DummyPDF, detectIE3P){

    var reader = this,

        // detected is false when plugin has not been detected (yet)
        // detected is true when plugin has been detected
        detected=false,

        doc = reader.doc,
        verify = reader.verify;
        

    // We only save detectIE3P if it is defined.
    // If it is not defined, then we do not change the value of reader.detectIE3P.
    if ($.isDefined(detectIE3P)) reader.detectIE3P = detectIE3P ? 1 : 0;


    // This only runs once
    if (reader.getVersionDone === null)
    {
        reader.OTF = 0;   // Detection has begun

        if (verify) verify.init();  // begin verification of dummy pdf path/name

    }



    // We keep track of each valid DummyPDF input
    $.file.save(reader, ".pdf", DummyPDF);


    // If reader.getVersionDone === 0 then reader.getVersion() was previously run.
    // It also means that we are permitted to run reader.getVersion() again, but
    // we will only be using the doc.insertHTMLQuery() method to obtain
    // any additional info.
    //
    // Note: this statement comes AFTER the "$.file.save()" statement,
    // so that we can keep track of all input DummyPDF strings during DummyPDF verification.
    if (reader.getVersionDone === 0)
    {

          // During verification of DummyPDF, if PDF Reader has already been detected,
          // then there is no need to try to detect all over again.
          // Otherwise, that might just mess up the value of reader.installed...
          // reader.installed could switch from 0 to -0.5, which we would like to prevent
          // during verification.
          if (verify && verify.isEnabled() && 
              $.isNum(reader.installed) && reader.installed>=0) return;


          // PDF reader detected if >0
          //
          // PDF Reader not detected if < 0
          // (at least according to doc.insertHTMLQuery, but a false negative is possible)
          //
          // PDF Reader status not known yet if ==0
          if (doc.insertHTMLQuery() >0) detected = true;

          // Note, we run setPluginStatus() here, regardless of whether detected is true
          // or false. The reason is that it is possible that reader.OTF may
          // have changed to 3 (ie. NOTF detection has now begun),
          // after running doc.insertHTMLQuery(), which means
          // that reader.installed must be updated by setPluginStatus().
          reader.setPluginStatus();


          return;  // all other detection methods have already been used, so we exit

    }



    // PDF Reader Detection Attempt # 1.
    //
    if ((!detected || $.dbug) && reader.mime.query()>0) detected = true;


    BOUNDARY("select.pluginCheckbox.pdfreader && select.miscCheckbox.allowactivex");

    // PDF Reader Detection Attempt # 2.
    // ActiveX only.
    //
    if ((!detected || $.dbug) && reader.axo.query()>0) detected = true;

    BOUNDARY("select.pluginCheckbox.pdfreader");



    // PDF Reader Detection Attempt # 3.
    // Thus is for ActiveX and non-ActiveX browsers.
    //
    if ((!detected || $.dbug) && doc.insertHTMLQuery()>0) detected = true;



    reader.setPluginStatus();


  
},  // end of getVersion()


mime:{    // ***** start of mime{} object *****
          // This object contains all the PDF detection methods that
          // involve looking at the navigator.mimeTypes array.
          //
          // Note: IE 11+ has a navigator.mimeTypes array that can be populated.
          // So, it is possible to (one day) detect PDF Readers in IE with this routine.


  mimeType: "application/pdf",

  // [public]
  // result>0 - pdf reader was detected.
  // result<0 - pdf reader was NOT detected (at least, not using this method).
  // result==0 - no result yet.
  result:0,


  // [public]
  query: function(){

     var mime=this;
    
     if (!mime.result)
     {
        $.message.write("[ ]", $.message.end());
        $.message.write("[ START PDF mimetype search for all browsers ]", $.message.end());

        mime.result = $.hasMimeType(mime.mimeType) ? 1 : -1;

        $.message.write("[ " +
           (mime.result>0 ? "PDF mimetype found, PDF Reader appears to be installed" :
           "PDF mimetype not found, PDF Reader not found") +
            " ]", $.message.end());

        $.message.write("[ END PDF mimetype search for all browsers ]", $.message.end());


     }

     return mime.result;

  }  // end of query()


},  // end of mime{} object


BOUNDARY3: "select.pluginCheckbox.pdfreader && select.miscCheckbox.allowactivex",


axo:{    // ***** start of axo{} object *****
         // This object contains all the PDF detection methods that
         // involve instantiating ActiveX objects using $.getAXO().
         // This is for detecting PDF Readers in ActiveX based browsers.
         //
         // NOTE: the axo{} object is not capable of detecting all possible
         // PDF Readers for IE. It can only detect a limited number of Readers.
         // The doc{} object is actually capable of detecting
         // all the PDF Readers for IE, at least in theory.
         // The purpose of the axo{} object is simply that it can detect
         // things more quickly than the doc{} object, so we do not have to bother
         // trying to download the DummyPDF and insert it into the DOM.


  // [public]
  // >0    pdf reader was detected.
  // 0     no result yet.
  // -0.5  plugin appears to be installed but not enabled for ActiveX, not enabled for <object>/<embed> tag.
  //          PDF document may only display in iframe/frame/browser window.
  // -1    pdf reader was NOT detected (at least, not using this method).
  result:0,
  

  // Security Pre-Approved ActiveX controls for Adobe Reader for IE
  //
  // Adobe Reader 10 -  "AcroPDF.PDF", "AcroPDF.PDF.1"
  // Adobe Reader 9  -  "AcroPDF.PDF", "AcroPDF.PDF.1"
  // Adobe Reader 8  -  "AcroPDF.PDF", "AcroPDF.PDF.1"
  // Adobe Reader 7  -  "AcroPDF.PDF", "AcroPDF.PDF.1"
  // Adobe Reader 6  -  "PDF.PdfCtrl.5"
  // Adobe Reader 5  -  "PDF.PdfCtrl.5"
  // Adobe Reader 4  -  "PDF.PdfCtrl.1"
  //
  // Note: The ActiveX controls "AcroPDF.PDF", "AcroPDF.PDF.1" have a GetVersions() method,
  // that allows us to see the version of the Adobe Reader plugin.
  // For the purposes of generic PDF Reader detection, however, we do not need to know
  // the plugin version.
  //
  // For Adobe Reader 11, in the Registry key:
  // [HKEY_LOCAL_MACHINE\SOFTWARE\Classes\MIME\Database\Content Type\application/pdf]
  // The classid entry is "CLSID"="{CA8A...}".
  // This classid corresponds to the ActiveX control object "AcroPDF.PDF" && "AcroPDF.PDF.1".
  progID: ["AcroPDF.PDF", "AcroPDF.PDF.1", "PDF.PdfCtrl", "PDF.PdfCtrl.5", "PDF.PdfCtrl.1"],


  // Dummy progID that should never instantiate
  progID_dummy: "AcroDUMMY.DUMMY",


  // 3rd party PDF Reader ActiveX Controls for IE
  prodID3rd: [

     // Nitro PDF Viewer
     //
     // For Nitro PDF 3.1.1.12, in the Registry key:
     // [HKEY_LOCAL_MACHINE\SOFTWARE\Classes\MIME\Database\Content Type\application/pdf]
     // The classid entry is "CLSID"="{3A7B4EA1...}".
     // This classid corresponds to "NitroPDF.IE.ActiveDoc" & "NitroPDF.IE.ActiveDoc.8".
     // Also, new ActiveXObject("NitroPDF.IE.ActiveDoc") instantiates without giving any
     // security popups.
     // Also, the <object> tag with mimetype "application/pdf" instantiates without
     // any security popup in IE, and <object>.object gives an object.
     // Apparently, the installer gives security pre-approval to the plugin.
     // Note: "NitroPDF.NitroPDFCtrl" is not security pre-approved, and would give a popup.
     "NitroPDF.IE.ActiveDoc",

     // PDF XChange Viewer
     //
     // For XChangeVwer 2.0, in the Registry key:
     // [HKEY_LOCAL_MACHINE\SOFTWARE\Classes\MIME\Database\Content Type\application/pdf]
     // The classid entry is "CLSID"="{C5D07EB6...}".
     // This classid corresponds to the ActiveX control "PDFXCviewIEPlugin.CoPDFXCviewIEPlugin".
     // Nothing appears to be security pre approved by the installer, however.
     // Both new ActiveXObject("PDFXCviewIEPlugin...") and the <object> tag with 
     // mimetype "application/pdf" cause a security popup in IE.
     // If we give security approval, then "PDFXCviewIEPlugin.CoPDFXCviewIEPlugin"
     // will instantiate, as well as the <object> tag. Also,
     // <object>.object is an object, so the plugin is easily detected either way.
     //
     // The same data here applies to XChangeVwer 2.5 as well.
     "PDFXCviewIEPlugin.CoPDFXCviewIEPlugin", "PDFXCviewIEPlugin.CoPDFXCviewIEPlugin.1",

     // Foxit Reader
     //
     // For Foxit Reader 5.4.5, in the Registry key:
     // [HKEY_LOCAL_MACHINE\SOFTWARE\Classes\MIME\Database\Content Type\application/pdf]
     // The classid entry is "CLSID"="{9A9F603B-51A8-4630-AE99-4BBF01675575}".
     // This tells us the classid that is associated with the browser mimetype "application/pdf".
     // We can find the ActiveX control that corresponds to this classid in the Registry keys:
     // [HKEY_LOCAL_MACHINE\SOFTWARE\Classes\"FoxitReader.FoxitReaderCtl" &&
     //   "FoxitReader.FoxitReaderCtl.1".
     // When we get a popup from trying to instantiate new ActiveXObject("FoxitReader.FoxitReaderCtl")
     // and we give it security approval, then from then on $.getAXO("...") returns
     // the ActiveX object, and this also gives security approval to the <object> tag
     // with mimetype "application/pdf".
     //
     // For Foxit Reader 5.1.4, in the Registry key:
     // [HKEY_LOCAL_MACHINE\SOFTWARE\Classes\MIME\Database\Content Type\application/pdf]
     // The classid entry is "CLSID"="{05563215...}".
     // We can find the ActiveX control that corresponds to this classid in the Registry keys:
     // [HKEY_LOCAL_MACHINE\SOFTWARE\Classes\"FOXITREADEROCX.FoxitReaderOCXCtrl.1"
     // When we instantiate new ActiveXObject("FOXITREADEROCX.FoxitReaderOCXCtrl.1")
     // we get an ActiveX object.
     //
     // What is very strange about Foxit: For Foxit 5.4 and lower, when we try to instantiate
     // the <object> tag using mimetype "application/pdf". We give it security approval in IE,
     // and then the popup bar goes away when we try to instantiate again. The strange
     // thing here is that the <object> tag continues to display altHTML, and
     // <object>.object continues to be null, despite the security approval.
     //
     // For Foxit Reader 3.3.1, 2.1, 1.3, in the Registry key 
     // [...\MIME\Database\Content Type\application/pdf]]
     // The classid entry is "CLSID"="{14E8BBD8...}".
     // This classid corresponds to "FoxitReader.Document".
     // When we get a popup from trying to instantiate new ActiveXObject("FoxitReader.Document")
     // and we give it security approval, then $.getAXO("...") will NOT
     // return any ActiveX object. It will NOT instantiate. However, all this will
     // give security approval to the <object> tag with mimetype "application/pdf".
     // Therefore, we CANNOT use "FoxitReader.Document".
     //
     "FoxitReader.FoxitReaderCtl", "FoxitReader.FoxitReaderCtl.1",
     "FOXITREADEROCX.FoxitReaderOCXCtrl", "FOXITREADEROCX.FoxitReaderOCXCtrl.1"

  ],


  // [public]
  query: function(){

     var axo=this, reader=PDFREADER, x, dummyErrObj;

     // Detection is enabled when no detection result has occured.
     // We do not need to filter out any non-IE browsers here using
     // $.browser.isIE because new ActiveXObject() will be undefined
     // in non-IE browsers anyway.
     // This reduces our dependency on browser detection, and that is 
     // a good thing.
     if (!axo.result)
     {
          // Find PDF Reader for Internet Explorer
          // We try to detect Adobe Reader here.
          // Note:  $.getAXO(reader.progID[0]).GetVersions() works for Adobe Reader 7+
          // For Adobe Reader < 7 the GetVersions() method does not work.
          // So, we only try to instantiate the ActiveX object for Adobe Reader,
          //  since we are not trying to get the version here anyway.

          $.message.write("[ ]", $.message.end());
          $.message.write("[ START PDF Reader detection for ActiveX based browsers ]", $.message.end());


          axo.result = -1;
          
          // *** There is a bug with Adobe Reader 11 / Internet Explorer 11 / Win7.
          // When we try to run the plugin using ActiveX, the plugin SOMETIMES might
          // silently switch to desktop mode (ie. PDF displays outside the browser).
          // In other words, this bug occurs when we use
          //   1) new ActiveXObject("...") for Adobe Reader
          //   2) When we use <object>/<embed> tag to display a PDF
          // We can detect when this bug occurs by looking at the error object.

          // We use a progID that we know does not exist,
          // then we save the error object.
          if (!$.getAXO(axo.progID_dummy)) dummyErrObj = $.errObj;

          
          // Search for Adobe Reader
          for (x=0;x<axo.progID.length;x++)
          {
               if ($.getAXO(axo.progID[x]))
               {
                 axo.result = 1;
                 if (!$.dbug) break;
               }
               
               // If the ActiveX object does not instantiate, but the error object
               // gives a different message from dummyErrObj, then the Active plugin appears to be
               // installed, but is disabled. PDF documents will not display with the Active X plugin -
               // they will only display within iframe/frame/browser window/desktop application.
               else if (dummyErrObj && $.errObj &&
                  dummyErrObj !== $.errObj && dummyErrObj.message !== $.errObj.message){

                     axo.result = -0.5;

               }
          }


          // Search for 3rd Party PDF Readers
          if ((axo.result < -0.5 && reader.detectIE3P) || $.dbug)
          {
             for (x=0;x<axo.prodID3rd.length;x++)
             { if ($.getAXO(axo.prodID3rd[x]))
               {
                 axo.result = 1; 
                 if (!$.dbug) break;
               }
             }
          }

          $.message.write(axo.result>0 ? "[ PDF Reader detected ]" : "[ PDF Reader not detected ]", $.message.end());
          $.message.write("[ END PDF Reader detection for ActiveX based browsers ]", $.message.end());

     }

     return axo.result;
  
  }   // end of query()


},    // end of axo{} object


BOUNDARY4: "select.pluginCheckbox.pdfreader",



doc:{     // ***** start of doc{} object *****

/*

  Using a PDF document that is inserted into the DOM, we try to detect
  if a PDF Reader is installed.

*/

   // [public]
   // Result for doc.insertHTMLQuery().
   // This shows the combined results for doc.insertHTMLQuery1() and doc.insertHTMLQuery2().
   //
   // >0     pdf reader was detected.
   // ==0    no result yet. Need to wait. Query again later.
   // -0.1   (IE only) Probably installed. Need to wait. Query again later.
   // -0.5   (IE only) Installed but not enabled.
   // <-0.5  pdf reader was NOT detected (at least, not using this method).
   result:-1,


   // [private]
   // Result for doc.insertHTMLQuery1().
   //
   // >0     pdf reader was detected.
   // ==0    no result yet. Need to wait. Query again later.
   // -0.1   (IE only) Probably installed. Need to wait. Query again later.
   // -0.5   (IE only) Installed but not enabled.
   // <-0.5  pdf reader was NOT detected (at least, not using this method).
   result1:-1,

   // [private]
   // Result for doc.insertHTMLQuery2().
   //
   // 1      pdf reader was detected.
   // 0      no result yet. Need to wait. Query again later.
   // -1     pdf reader was NOT detected (at least, not using this method).
   result2:-1,
   

   // [private]
   // classid for Adobe Reader, Security Approved Active X control for IE
   classID: "clsid:CA8A9780-280D-11CF-A24D-444553540000",

   // [private]
   // Classid for a non-existent ActiveX control
   // We make it similar to classID, except for the last group of digits.
   classID_dummy: "clsid:CA8A9780-280D-11CF-A24D-BA9876543210",
  
   // [private]
   mimeType: "application/pdf",

   // [private]
   // Dummy mimetype that does not exist.
   // To be as reliable and simple as possible, the mimetype has no capital letters
   // and no numbers, just like "application/pdf".
   mimeType_dummy: "application/dummymimepdf",
   

   // [private]
   // HTML object for dummy span tag
   // <span>altHTML</span>
   // Should be instantiated BEFORE doc.HTML1.
   DummySpanTagHTML: 0,

   // [private]
   // HTML object for pdf document using an <object> tag.
   // An HTML object allows us to access a DOM object, its <span> container, etc...
   HTML1: 0,

   // [private]
   // HTML object for pdf document using an <img> tag.
   HTML2: 0,

   // [private]
   // HTML object for dummy <object> tag1
   // <span><object type="dummyMimeType">altHTML</object></span>
   // Should be instantiated AFTER doc.HTML1.
   DummyObjTagHTML1: 0,



// [public]
insertHTMLQuery: function(){

    var doc=this;

    doc.insertHTMLQuery1();
    doc.insertHTMLQuery2();

    return doc.queryObject();

},


// [public]
// Get the detection results
queryObject: function(NOTFcount){

   var doc=this, 
      query1=doc.queryObject1(NOTFcount),
      query2=doc.queryObject2(NOTFcount),

   result = query1>0 || query2<0 ? query1 :  // return q1 if q1 detected || q2 not detected

     ( // q1 <= 0, q2 >= 0

        query1<-0.5 || query2>0  ? query2 :    // return q2 if q1 not detected || q2 detected

         (  // -0.5 <= q1 <= 0, q2 = 0

            // Since q2==0, then detection should continue for the time being.
            // Which means we either return 0 or -0.1
            query1==-0.1 ? query1 : 0

         )
     );


   // In debug mode, we want to make sure that both query1 and query2
   // detections are completely done.
   // If one or both are not done, then we return 0 or -0.1.
   if ($.dbug)
      result = query1==-0.1 ? query1 : (!query1 || !query2 ? 0 : result);


   doc.result = result;


   return result;

}, // end of queryObject()



// [private]
avoidBrowser: function(){

   var browser=$.browser;

   if (

        // For very old versions of Gecko, the browser shows a popup bar (plugin finder service)
        // when trying to insert a pdf <object> tag into the web page and
        // no pdf plugin (ie. no mimetype) is installed.
        //
        // This probably holds for Windows/Mac/Linux/FreeBSD.
        // Since we want to avoid the popup bar, we can filter out old Gecko versions.
        // Higher versions by default do not show the popup bar unless the user changes the
        // browser settings.
        //
        // We leave open the possibility that other browsers may spoof the Gecko
        // browser userAgent. So we allow DummyPDF to be used for higher numbered
        // browser versions.
        (browser.isGecko && $.compareNums(browser.verGecko, $.formatNum("10"))<=0 && $.OS<=4) ||


        // Opera 10.10 - 10.53 on Windows would hang/crash when we try to insert a pdf object
        // when no pdf plugin (ie. no mimetype) is present. This is a browser bug.
        //
        // Also, for Opera <=8, the <object> tag would not show altHTML and hence
        // it would look like the dummy pdf file was running in the <object> tag.
        // This is a browser bug, where the browser is not following accepted web standards.
        //
        // Opera on these Desktop OSes does not have built in pdf capability anyway.
        (browser.isOpera && $.compareNums(browser.verOpera, $.formatNum("11"))<=0 && $.OS<=4) ||

       
        // Chrome 6+ has a built-in PDF Reader.
        // When the built-in Chrome PDF Reader is active, the application/pdf mimetype is present. 
        // Thus, there is no real need to use this detection method in Chrome for
        // lower Chrome versions with no pdf mimetype.
        //
        // However, we leave open the possibility that other browsers may spoof the Chrome
        // browser userAgent. So we allow DummyPDF to be used for higher numbered
        // Chrome versions.
        //
        // We leave open the slight possibility that FUTURE versions of Chrome might not
        // necessarily have the application/pdf mimetype for the built-in PDF Reader?
        // In that case, we would NOT filter out Chrome.
        //
        (browser.isChrome && $.compareNums(browser.verChrome, $.formatNum("10"))<0 && $.OS<=4)



    ) return 1;
       
    return 0;


}, // end of avoidBrowser()


// [private]
// Return 1 if pdf exists
// return 0 otherwise
hasDummyPDF: function(){

   var DummyPDF = $.file.getValid(PDFREADER);
   if (!DummyPDF || !DummyPDF.full) return 0;

   return 1;

}, // end of hasDummyPDF()


// [public]
// This routine is used for to see if doc.insertHTMLQuery1() is disabled or not.
//
// We filter out certain browsers, because they may have bugs/undesirable behavior.
//
// We try, whenever possible, to only filter out browser versions < (some number),
// or browser versions == (some number).
//
// Note: $.OS==1 for Windows, $.OS==2 for Mac, $.OS==3 for Linux,
// $.OS==4 for FreeBSD
//
// Return 0 if doc.insertHTMLQuery1() is enabled at the moment
// Return 1 if doc.insertHTMLQuery1() is disabled at the moment, but it may become enabled in the future
// Return 2 if doc.insertHTMLQuery1() is disabled permanently.
isDisabled1: function(){

      var doc=this, disabled=0;


      // If doc.HTML1 exists, then we have already inserted the DummyPDF
      // into the web page. Then we are done.
      // doc.insertHTMLQuery1() is permanently DISABLED.
      // This insures that doc.insertHTMLQuery1() only runs once.
      if (doc.HTML1 ||

          !$.DOM.isEnabled.objectTag()){ disabled=2; }

      // If debug mode, or there is a mimetype in the navigator.mimeTypes[] array,
      // then doc.insertHTMLQuery1() is ENABLED.
      else if ($.dbug || $.hasMimeType(doc.mimeType)){ }

      // Else if no mimetype, we do not necessarily disable doc.insertHTMLQuery1().
      // That is because some browsers may have a built in PDF Reader that
      // does not show up in the navigator arrays.
      // For older specific browsers, however, doc.insertHTMLQuery1() is disabled.
      else if ( doc.avoidBrowser() )
      {
           disabled=2;   // DummyPDF not allowed to be used.
                         // doc.insertHTMLQuery1() is permanently disabled.

      }


      if (disabled < 2 && !doc.hasDummyPDF())
      {
           disabled=1; // doc.insertHTMLQuery1() is disabled for now.
                       // But if DummyPDF exists in the future, then it will be enabled.
      }

      return disabled;

},   // end of isDisabled1()


// [public]
// This routine is used for to see if doc.insertHTMLQuery2() is disabled or not.
//
// We filter out certain browsers, because they may have bugs/undesirable behavior.
//
// We try, whenever possible, to only filter out browser versions < (some number),
// or browser versions == (some number).
//
// Note: $.OS==1 for Windows, $.OS==2 for Mac, $.OS==3 for Linux,
// $.OS==4 for FreeBSD
//
// Return 0 if doc.insertHTMLQuery2() is enabled at the moment
// Return 1 if doc.insertHTMLQuery2() is disabled at the moment, but it may become enabled in the future
// Return 2 if doc.insertHTMLQuery2() is disabled permanently.
isDisabled2: function(){

      var doc=this, disabled=0, browser=$.browser;


      // If doc.HTML2 exists, then we have already inserted the DummyPDF
      // into the web page. Then we are done.
      // doc.insertHTMLQuery2() is permanently DISABLED.
      // This insures that doc.insertHTMLQuery2() only runs once.
      if (doc.HTML2){ disabled=2; }

      // If debug mode, or there is a mimetype in the navigator.mimeTypes[] array,
      // then doc.insertHTMLQuery2() is ENABLED.
      else if ($.dbug){ }

      // IE is not capable of getting a result from <img> tag.
      // We do not bother filtering out any other specific browsers, because
      // most are unable to use <img> for a pdf document, and because browser
      // detection is inherently unreliable anyway.
      else if (browser.isIE){ disabled=2; }


      if (disabled < 2 && !doc.hasDummyPDF())
      {
           disabled=1; // doc.insertHTMLQuery2() is disabled for now.
                       // But if DummyPDF exists in the future, then it will be enabled.
      }


      return disabled;

},   // end of isDisabled2()




// [private]
/*
 Insert PDF <object> tag into DOM and see PDF displays or not.


 return >0 if browser can display pdf using an <object> tag
 return 0 no result yet. Need to wait. Query again later.
 return -0.1   (IE only) Probably installed. Need to wait. Query again later.
 return -0.5   (IE only) Installed but not enabled.
 return <-0.5  pdf reader was NOT detected (at least, not using this method).


 Note: There is no guarantee that all PDF Readers are able to display a PDF document via
 an <object> tag.


 The <object> tag can also tell us if the plugin is "installed but not enabled" for IE.
 This occurs if the PDF <object> tag is disabled dues to a security popup in the browser,
 or due to being disabled in the add-ons menu.

 **** WARNING: due to reliability concerns, we should always try to avoid
 displaying a PDF via an <object> tag whenever possible.
 We only do that here as a last resort. Most PDF Readers seem to be
 better suited to displaying PDF's outside the browser, or in the browser
 window/frame (without using <object>/<embed> tags.)
 <object> tags do not appear to be a very popular way of displaying
 PDFs, and this is why I believe that PDF Reader authors may not put
 a high priority on making PDF Readers work well with <object> tags.
 For this reason, using <object> tags for detection is the very LAST thing we do.

 NOTE: We use visibiliy:hidden for the <object> tags.
 This could potentially speed up instantiation.
 PDF Readers were never really intended to display
 PDFs in such a small <object> tag as used by PluginDetect, especially
 when the Reader may add toolbars/scrollbars/etc.., hence we
 use visibility:hidden.

 NOTE: Because we are also trying to detect if the plugin is "installed but not
 enabled" for IE, we NEED THE 2 OBJECT TAGS TO BE AS SIMILAR AS POSSIBLE.
 This way, any small differences in the runtime properties of the 2 object <tags> can help
 us more reliably distingish between the plugin being "not installed" or
 "installed but not enabled" by the $.DOM.getTagStatus() routine.
 For this reason, both <object> tags will have a classid, or both <object> tags
 will have a mimetype.
 [Should both tags have the same "data" and "src" parameters? I want to make the 2 tags
 similar, but I want to make sure the Dummy <object> tag does not display anything.
 We let the Dummy tag not have any data/src parameters, to GUARANTEE that
 it does not instantiate anything.]

 NOTE: The 'reader' input causes the onBeforeInstantiate event handlers to be executed.



 Non-IE browsers:
 This detection method is useful for non-IE browsers that have a built in
 PDF Reader, yet have no pdf mimetype in the navigator.mimeTypes array.

 For example, Safari/iPad has a PDF reader built into the browser,
 yet there is no pdf mimetype in the navigator.mimeTypes array, and no
 plugin in the navigator.plugins array.

 Note: Safari/Mac has built in pdf viewing capability
 Note: Safari/Ipad has built in pdf viewing capability


 Internet Explorer:
 This detection method can detect both Adobe and 3rd party PDF readers.

 When detecting 3rd party PDF readers, the instantiated <object> tag
 will most likely cause a security popup in IE. This detection method
 can still detect the 3rd party reader, despite this popup.
 Also, displaying a PDF in an <iframe> or directly in the browser window will
 probably still work, because most people display a PDF without any <object>/<embed>
 tags anyway.

 Also, when you disable the Adobe Reader in the IE addons menu, you only
 seem to disable Adobe Reader for new ActiveXObject() and the <object>/<embed> tag.
 But the Adobe Reader still seems to display PDFs within
 the browser window. Whether it can display PDFs in an <iframe>
 could depend on the version of Adobe Reader.

 **** WARNING: due to reliability concerns, we should always try to avoid
 displaying a PDF via an <object> tag whenever possible.
 We only do that here as a LAST resort. We try to use other detection
 methods FIRST.
   Most PDF Readers seem to be better suited to displaying PDF's outside
 the browser, or in the browser window/frame/iframe (without using
 <object>/<embed> tags). <object> tags do not appear to be a very popular
 way of displaying PDFs, and this is why I believe that PDF Reader authors
 may not put a high priority on making PDF Readers work well with <object> tags.
 For this reason, we strongly recommend using <object> tags as a LAST resort.

 In this case of Generic PDF Reader detection, we will usually need to use the
 <object> tag for:
     1) PDF Readers built into some browsers, that do not reveal an "application/pdf"
        mimetype in the navigator.mimeTypes[] array.
     2) 3rd Party PDF Readers in IE.

    All the other cases will be handled by the other PDF Reader detection methods.
*/
insertHTMLQuery1: function(){

  var doc=this, reader=PDFREADER,
  
    DummyPDF, iframe,

    // if ==1 give <tag> a style of visibility:hidden
    // if ==0/undefined give <tag> a style of visibility:visible
    //
    // We set hidden==1 because the PDF Reader detector is trying to detect an
    // unknown number of different PDF Readers, and perhaps not all
    // of them are designed to handle being displayed in a 1x1 object.
    // It seems for Foxit Reader 5.1/WinVista/IE 9 things are more reliable
    // this way. It also seems to speed up instantiation.
    // We do not need to query the instantiated plugin anyway, we only
    // look at HTML tag attributes. So tag does not need to be visible.
    // We would only leave it visible if we had to query an unknown plugin.
    hidden=1,

    altHTML=$.DOM.altHTML;


   if (doc.isDisabled1()) return doc.result1;
   

   // From here, the code only runs once

   doc.result1 = 0;                  // detection begins
   if (reader.OTF<2) reader.OTF=2;   // indicates that this routine was called

   
   $.message.write("[ ]", $.message.end());

   // Most recent valid input DummyPDF string specified by the user
   DummyPDF = $.file.getValid(reader).full;


   // Create <iframe>.
   //
   // onload event handler for iframe will wait 99ms, and then execute.
   //
   // The delay helps to insure that the HTML tags reach their final state before
   // we look at the HTML tags. This is just an added safety measure.
   iframe = $.DOM.iframe.insert(99, "PDFReader");



   // This is an HTML object for an empty <span> tag with only altHTML.
   // <span>altHTML</span>
   // We instantiate BEFORE doc.HTML1.
   doc.DummySpanTagHTML = $.DOM.insert("", [], [],
            altHTML, reader, hidden, iframe);


   // Do we need to use codebase attribute for relative paths?
   doc.HTML1 = $.DOM.insert("object",

              ($.browser.isIE && !reader.detectIE3P ? 

                // Detect Adobe Reader only.
                // This should not trigger any security popups in IE.
                ["classid", doc.classID] :

                // Detect any and all PDF Readers.
                // This may trigger a security popup in IE
                // when a non-Adobe PDF Reader is installed.
                ["type", doc.mimeType]

               ).concat(["data", DummyPDF]),
              
               // We must always have src=DummyPDF for non-IE.
               // We cannot ever have src="", data="". The reason is that for 
               // certain browser/reader combinations, you could get a popup saying that 
               // there was an error.
               // For example, we get an error popup for Firefox/Foxit Reader/Adobe Reader 6.
               // It is generally safer to include src, data when trying to instantiate.
               //
               // Note: In Adobe Reader 6 for IE, when we use a DummyPDF in the <object> tag,
               // it takes a long time for the Reader to start up. We could intentionally
               // set src="",data="" to get an immediate detection result, however.
               ["src", DummyPDF],
               
               altHTML, reader, hidden, iframe);


   // This is a Dummy <object> tag with altHTML. It does not instantiate anything.
   //
   // Note: we insert Dummy <object> tag AFTER inserting the PDF object.
   // We do this because we wait for the Dummy <object> Tag to show its altHTML.
   // THEN we look at the status of the PDF plugin object.
   doc.DummyObjTagHTML1 = $.DOM.insert("object",

             // If the PDF Reader <object> tag has a mimetype, then the
             // Dummy <object> tag must have the same.
             // If the PDF Reader <object> tag has a classid, then the
             // Dummy <object> tag must have the same.
             ( $.browser.isIE && !reader.detectIE3P ?

                ["classid", doc.classID_dummy] :
            
                ["type", doc.mimeType_dummy]

             ),
             
             [],
             altHTML, reader, hidden, iframe);



   // No more tags to insert, so we close the <iframe>
   $.DOM.iframe.close(iframe);




/*   
   if doc.result ==-0.1 (IE only), then it would appear that a PDF Reader is probably installed,
   but the enabled status of the plugin is not determined yet, so we need more time to detect.
   This occurs when the plugin causes a security popup for an <object> tag,
   or the plugin is disabled in the addons menu when trying to run an <object> tag.
   This situation appears to be easy to detect.

   If doc.result===0, then we do not have any result yet.
   In this case, we try to "reinstantiate" the <object> tags one more time, and then
   try to detect the result. The reason for this is discussed below.

   If inserting an <object> tag causes an IE security popup, and the user then gives 
   security approval to the <object> tag, then we are left with a few possibilities
   on how we can detect the newly security approved <object> tag:

   0) We can insert the <object> tag into the DOM, and now <object>.object property
      returns an object. Hence the plugin is now easily detectable.
      The viewer can now display PDFs in the <object> tag.
   1) We can insert the <object> tag into the DOM, and <object>.object is null.
   1a) If the plugin actually runs in the <object> tag and
      displays in the tag, then we can easily detect that by looking at the HTML tag width,
      and just waiting long enough to make sure the result is correct.
      The HTML tag width will thus go to DOM.pluginSize.
   1b) If the plugin starts up and runs, but still cannot display anything
      in the HTML tag, then the tag will eventually display altHTML.
      (You would think that this case is not possible, since the <object> tag originally
      gave a security popup, meaning that some kind of ActiveX control was attempting
      to run. This could be some kind of buggy behavior by the plugin itself).
      If the plugin is starting up for the very first time in the web page,
      then it will need to load. In that case, the readyState will be 4 after
      it has loaded. When we immediately query the tag after inserting into the DOM,
      we would get
      doc.HTML1 readyState==4, width==4  &&  doc.DummyObjTagHTML readyState==4, width==4.
      In this case, we would be unable to see whether the plugin is installed.

   Case #1b is a problem for us, but there appears to be 3 ways around that:
    i) We can reload the page. What can happen here is that
    since the plugin is still running, it does not need to start up and load. Hence
    the readyState remains at 0, and so we have
    doc.HTML1 readyState==0, width==4  &&  doc.DummyObjTagHTML readyState==4, width==4.
    In this case, we would say that the plugin is installed.
    AS AN ALTERNATIVE, you could simply try to instantiate the plugin a second time
    with an HTML tag. The readyState would remain at 0, and you could thus detect
    that the plugin is installed.

   ii) We instantiate the doc.HTML1 & doc.DummyObjTagHTML a second time.
   Since the plugin already is up and running, then there is no startup time delay
   that would allow the readyState to go from 0 to 4.
   In this case, we would once again get
   doc.HTML1 readyState==0, width==4  &&  doc.DummyObjTagHTML readyState==4, width==4.
   And this means once again that we can detect the plugin.

   iii) We could try to instantiate the ActiveX control using $.getAXO("...")
   before trying to instantiate via an <object> tag. In this case, the $.getAXO("...")
   would cause the security popup in IE, and if the user clicks on the popup bar,
   then in the future $.getAXO("...") would return an object, and so it would never
   even be necessary to instantiate the <object> tag.
   This strange case seems to have occured for Foxit Reader, and appears to be a bug with
   Foxit itself. Thus, in pdfreader.axo{} we try to instantiate a Foxit
   ActiveX control to avoid this issue.
   But even if we do not do this, we can still instantiate a second time
   to get around this, it would seem.
*/
   doc.queryObject1();  // We do not input NOTF.count yet.
   if ($.browser.isIE && doc.result===0)
   {
      doc.HTML1.span().innerHTML = doc.HTML1.outerHTML;

      doc.DummyObjTagHTML1.span().innerHTML = doc.DummyObjTagHTML1.outerHTML;

   }



   // begin NOTF detection.
   reader.NOTF.init();


},  // end of insertHTMLQuery1()


// [private]
// Insert <img src="empty.pdf"> tag into DOM and see if PDF displays or not.
//
// return >0 if browser can display pdf using an <iframe> tag
// return <0 if browser cannot display pdf using an <iframe> tag
// return 0 if unknown at this time
//
// Note: Safari browsers (at least some of them) appear to be able to display a
// pdf document using an <img> tag. I am not aware of any other browsers that can do this.
// Safari in iOS 8 has a bug, where it cannot display a pdf using an <object> tag.
// So, we use the <img> tag as a backup detection method.
insertHTMLQuery2: function(){

  var doc=this, reader=PDFREADER,
  
    altHTML=$.DOM.altHTML,
     
    // if ==1 give <tag> a style of visibility:hidden
    // if ==0/undefined give <tag> a style of visibility:visible
    //
    // We set hidden==1 because the PDF Reader detector is trying to detect an
    // unknown number of different PDF Readers, and perhaps not all
    // of them are designed to handle being displayed in a 1x1 object.
    // It seems for Foxit Reader 5.1/WinVista/IE 9 things are more reliable
    // this way. It also seems to speed up instantiation.
    // We do not need to query the instantiated plugin anyway, we only
    // look at HTML tag attributes. So tag does not need to be visible.
    // We would only leave it visible if we had to query an unknown plugin.
    hidden=1,

    iframe;


   if (doc.isDisabled2()) return doc.result2;
   
   
   // From here, the code only runs once

   doc.result2 = 0;                  // detection begins
   if (reader.OTF<2) reader.OTF=2;   // indicates that this routine was called

   
   $.message.write("[ ]", $.message.end());



   // Create <iframe>.
   //
   // onload event handler for iframe will wait 99ms, and then execute.
   //
   // The delay helps to insure that the HTML tags reach their final state before
   // we look at the HTML tags. This is just an added safety measure.
   iframe = $.DOM.iframe.insert(99, "PDFReader2");



   // This is an HTML object for <img> tag.
   doc.HTML2 = $.DOM.insert("img",
            ["alt", altHTML, 
             "src", $.file.getValid(reader).full], 
             [],
             altHTML, reader, hidden, iframe);


   $.ev.addEvent(doc.HTML2.obj(), "load", $.ev.handler(doc.onImgLoaded, doc));


   // No more tags to insert, so we close the <iframe>
   $.DOM.iframe.close(iframe);



   // begin NOTF detection.
   reader.NOTF.init();


},  // end of insertHTMLQuery2()


// [private]
// ** EVENT HANDLER **
onImgLoaded: function(doc){
   doc.imgLoaded=1;
},


// [private]
// Query the doc.HTML1 object to see if it is displaying a PDF object.
// This is for insertHTMLQuery1().
//
// Let doc.result = DOM.getTagStatus().
//
// If result>0, then pdf reader was detected. Browser can display pdf document.
//    Detection is done.
// If result==0, then we do not know yet. Need to wait. Query again later.
// If result==-0.1, then (IE only) Probably installed. Need to wait. Query again later.
// If result==-0.5, then (IE only) Installed but not enabled.
// If result<-0.5, then pdf reader was NOT detected (at least, not using this method).
//    Detection is done.
queryObject1: function(NOTFcount)
{
      var doc=this, reader=PDFREADER, result1=0, detectInstNotEnabled=1;


      $.message.write("[ ]", $.message.end());
      $.message.write("[ START pdfreader.doc.queryObject1( ) - query of instantiated PDFReader ]", $.message.end());


      result1 = $.DOM.getTagStatus(doc.HTML1, doc.DummySpanTagHTML,
              doc.DummyObjTagHTML1, 0, null, null, detectInstNotEnabled);


      $.message.write( "[ " +

        (reader.NOTF && $.isNum(NOTFcount) ?
           "NOTF PDFreader detection after " + $.message.time(reader.NOTF) +
           ", query # " + NOTFcount + ", result: " : "PDFreader detection result: "
        ) +

        (result1===0 ? "no result yet" :

           (result1>0 ? "Installed & enabled" :

               // IE only
               (result1==-0.1 ? "Installed, but enabled status not determined yet" :

                  // IE only
                  (result1==-0.5 ? "Installed, but not enabled for <" + doc.HTML1.tagName + "> tag" :
                      "Unable to detect pdf reader using this method"
                  )
               )
           )

        ) + " ]", $.message.end());

      $.message.write("[ END pdfreader.doc.queryObject1( ) ]", $.message.end());


      doc.result1 = result1;

      return result1;

},  // end of queryObject1()


// [private]
// Query the doc.HTML2 object to see if it is displaying a PDF object.
// This is for insertHTMLQuery2().
//
// Return 1  -> installed
// Return 0  -> Wait for result
// Return -1 -> Unable to detect plugin using this method
queryObject2: function(NOTFcount){
    
    var doc=this, reader=PDFREADER, result2;

    $.message.write("[ ]", $.message.end());
    $.message.write("[ START pdfreader.doc.queryObject2( ) - query of instantiated PDFReader ]", $.message.end());


    if (doc.HTML2.loaded){ doc.result2 = doc.imgLoaded ? 1 : -1; }
    result2 = doc.result2;

    $.message.write( "[ " +

         (reader.NOTF && $.isNum(NOTFcount) ?
            "NOTF PDFreader detection after " + $.message.time(reader.NOTF) +
            ", query # " + NOTFcount + ", result: " : "PDFreader detection result: "
         ) +

         (result2===0 ? "no result yet" :

           (result2>0 ? "Installed & enabled" : "Unable to detect pdf reader using this method")

         ) +

         " ]", $.message.end());

    $.message.write("[ END pdfreader.doc.queryObject2( ) ]", $.message.end());


    return result2;

}   // end of queryObject2()


},   // ***** end of doc object *****




NOTF:{     // ***** NOTF object *****

count: 0,   // counts the number of times that NOTF.onIntervalQuery() is called.
            // onIntervalQuery() is called at regular intervals during NOTF detection.

intervalLength: 250,  // Length of time between attempts to query
                      // for NOTF detection. Interval is in milliseconds.

// [public]
// Begin NOTF detection
init: function(){
  
   var NOTF=this, reader=PDFREADER, doc=reader.doc;


   if (reader.OTF<3 && (doc.HTML1 || doc.HTML2))
   {
      reader.OTF = 3;     // Detection is now being performed NOTF
                          // Setting = 3 means that this section of code can
                          // only be executed ONCE.


      // Query pdf object at regular intervals.
      // Note: We use setTimeout instead of setInterval.
      $.ev.setTimeout(NOTF.onIntervalQuery, NOTF.intervalLength);

      $.message.write("[ ]", $.message.end());
      $.message.write("[ START NOTF PDFreader detection ]", $.message.end());

      $.message.write($.message.time(NOTF,1), $.message.end());  // Start measuring time delay for NOTF detection

    }


},  // end of init()


// ** EVENT HANDLER **
// queries pdf object status at regular intervals (determined by the SetTimeout()).
// This is for NOTF detection.
onIntervalQuery: function(){

     $.message.write("[ ]", $.message.end());
     $.message.write("[ START NOTF.onIntervalQuery( ) ]", $.message.end());
     
     var doc=PDFREADER.doc, NOTF=PDFREADER.NOTF, result;
     
     NOTF.count++;  // Set this BEFORE any other code runs.

     // PDFREADER.OTF == 3 means that PDFREADER.installed == -0.5 or +0.5
     // If we are in NOTF mode and pdf object has not given any result yet...
     if (PDFREADER.OTF == 3)
     {
         result = doc.queryObject(NOTF.count);

         // If result>0, then detection has been completed.
         // If result<-0.1, then detection has been completed.
         // Then save the results, clear the interval, and run the event handlers.
         if (result>0 || result<-0.1) NOTF.queryCompleted();
     }

     // If detection not done yet, then we run this routine again after a delay
     if (PDFREADER.OTF == 3) $.ev.setTimeout(NOTF.onIntervalQuery, NOTF.intervalLength);

     $.message.write("[ END NOTF.onIntervalQuery( ) ]", $.message.end());


},   // end of onIntervalQuery()


// The pdf object querying has been completed, so we now:
//   set this.installed
//   clear the interval
//   execute the functions in the $.Plugins.pdfreader.DoneHndlrs[] array
//
// This method is only called by onIntervalQuery()
//  hence it is only called when reader.OTF == 3.
//
// if doc.result > 0, then PDF Reader was detected
// if doc.result < 0, then PDF Reader was not detected
// if doc.result == 0 unknown. Perhaps detection did not have enough time to complete.
//   PDF Reader was not detected.
queryCompleted: function(){

     var NOTF=this, reader=PDFREADER;

     // queryCompleted() should only be called once.
     // We use this next line of code to guarantee that it only
     // runs ONCE.
     if (reader.OTF == 4) return;
     reader.OTF = 4;    // NOTF Detection has now been completed


     reader.setPluginStatus();


     $.message.write("[ END NOTF PDFreader detection in " + $.message.time(NOTF) + " ]", $.message.end());
     $.message.write("[ " + $.message.time($) + " after script initialization ]", $.message.end());



     // It is possible to start NOTF detection...
     //
     // 1) by using getVersion() or isMinVersion()
     // 2) or by using onDetectionDone()
     //
     // To see if onDetectionDone() was used to call this routine, we check for the presence of
     // onDetectionDone() && DoneHndlrs[] array.
     $.message.write($.onDetectionDone && reader.DoneHndlrs ? "[ END " + reader.pluginName + 
          " detection for " + $.name + ".onDetectionDone(" + $.message.args2String(reader.pluginName) + ") in " +
          $.message.time(reader.DoneHndlrs) + " ]" : 0, 
          $.message.end());

     $.message.write($.onDetectionDone && reader.DoneHndlrs ? "[ START event handlers for " + 
           $.name + ".onDetectionDone(" + $.message.args2String(reader.pluginName) + ") ]" : 0, 
           $.message.end());

     // Execute the event handlers f specified by the $.onDetectionDone("pluginName", f) method.
     //
     // Note: we execute callArray() even when DoneHndlrs[] is empty or does not exist.
     // The reason is that callArray() will automatically check if ALL event handlers
     // are done, and then runs some final cleanup handlers (since we just completed detection for
     // this one plugin).
     $.ev.callArray(reader.DoneHndlrs);

     $.message.write($.onDetectionDone && reader.DoneHndlrs ? "[ END event handlers for " + 
          $.name + ".onDetectionDone(" + $.message.args2String(reader.pluginName) + ") ]" : 0, 
          $.message.end());



}   // end of queryCompleted()



},    // ***** end of NOTF object *****


BOUNDARY33:"select.pluginCheckbox.pdfreader && select.methodCheckbox.getinfo",

// [public]
getInfo:function(){

   var reader=this, 

      result={

         // 0: Detection is OTF if reader.OTF<3
         // 1: Detection is pending and will be NOTF if reader.OTF==3
         // 2: Detection is NOTF if reader.OTF>3
         OTF:(reader.OTF<3 ? 0 : (reader.OTF==3 ? 1 : 2)),

         // The DummyPDF is actually only used/loaded when an <object> tag with a PDF is
         // instantiated, then we get reader.doc.result>0.
         // If the <object> tag is inserted into the DOM but reader.doc.result<0 then
         // the DummyPDF was never used/loaded.
         DummyPDFused: (reader.doc.result>0 ? true : false)

     };
     

     return result;

},

BOUNDARY34:"select.pluginCheckbox.pdfreader && select.pluginCheckbox.verifypdfreader",



// ******* verify pdf ********
// Verify that your DummyPDF name & path are correct.

// [public]
verify:{


BOUNDARY0:"0",   // We always delete this item, so then the verify{} object
                 // is automatically enabled when it is included in the script.

// == 1 to disable the verify routine. Verify routine will not run.
// == 0/null/""/undefined to enable verify routine. Verify routine will run.
isDisabled:1,


BOUNDARY34:"select.pluginCheckbox.pdfreader && select.pluginCheckbox.verifypdfreader",


// output <div> that holds verify messages
div: null,


// [** PUBLIC **]   $.Plugins.pdfreader.verify.enable()
// Enable the verify{} object for writing.
enable: function(){
   this.isDisabled = 0;
},

// [** PUBLIC **]   $.Plugins.pdfreader.verify.disable()
// Disable the verify{} object from writing.
disable: function(){
   this.isDisabled = 1;
},

// [public]
isEnabled: function(){
   return !this.isDisabled;
},

// Insert text node into verify.div
//
// text = text content
//
// S = [style property, style value,...]
// or S = "bold", "verified", "error", "warning"
//
// br = false (boolean) will prevent line feed
addText: function(text, S, br){
     var verify=this;
     $.verify.addText(verify.div, text, S, br);
},

// [public]
// Run init() only once.
// When this routine runs, it means that pdf detection has been initiated by the user.
init: function(){

  var verify = this;

  // if disabled, return
  // if this routine already ran, return
  if (!verify.isEnabled() || verify.div) return;

  verify.div = $.verify.init(verify, "PDFReader", "DummyPDF", "empty.pdf", ".pdf");

  // We wait for all the user specified plugin detections to be fully completed.
  // This allows us to accumulate all possible references to the input DummyPDF.
  // Then we execute verify.onReady().
  $.ev.fPush([verify.onReady, verify], $.ev.allDoneHndlrs);
  
  $.ev.fPush([verify.onUnload, verify], $.win.unloadHndlrs);

}, // end of init()


// [private]
// ** EVENT HANDLER **
onUnload: function($, verify){

   verify.disable();
  
   $.DOM.emptyNode(verify.div);
   $.DOM.removeNode(verify.div);

   verify.div = null;

}, // end of onUnload()



// ** EVENT HANDLER **
// This is an event handler, hence we have $, verify as inputs.
// Verify the plugin when ready.
onReady: function($, verify){

  var reader = PDFREADER, topWinDoc = window.top.document;

  if (!$.verify.checkfile1(verify.div, reader, "PDF Reader", "DummyPDF", ".pdf")) return; // Error

  // Insert iframe to verify the PDF path/filename.
  // There is a question as to whether we insert an <iframe> or an <object> tag for this
  // verification test. The <object> tag, for non-IE browsers, should not give any popups.
  // However, the <iframe> will perhaps be more reliable in showing a PDF, even though
  // an <iframe> may give you a popup when no PDF reader is installed/enabled.
  var iframe, DummyPDF = $.file.getValid(reader);
  if (DummyPDF) DummyPDF = DummyPDF.full;

  verify.addText();
  verify.addText("The box shown below should display the " + $.name + " DummyPDF document.");
  verify.addText("If it does, then the [path/]filename for DummyPDF in your detection code is correct.");
  verify.addText("[Or, if a standalone PDF viewer pops up and displays the DummyPDF document, " +
    "then the [path/]filename for DummyPDF is correct.]");
  verify.addText();
  iframe = topWinDoc.createElement("iframe");
  iframe.width = "98%";
  iframe.height = "300";
  iframe.src = DummyPDF;
  $.DOM.setStyle(iframe,
     [ "border","solid black 1px",
       "padding","1px"
     ]
  );
  verify.div.appendChild(iframe);
  
  verify.addText();
  verify.addText();
  verify.addText();
  
  verify.addText("DONE", "verified");
  verify.addText();

} // end of onReady()

},   // end of verify object



BOUNDARY35:"select.pluginCheckbox.pdfreader",


// Property is automatically removed by Script Generator
lastProperty:"select.pluginCheckbox.pdfreader"


};  // end of pdfreader{}


$.addPlugin("pdfreader", PDFREADER);



// ****************************** End of PDF Reader detection **********************************




// *********************************************************************************************
/*  RealPlayer Detection




 ------------------------------------
 ToDo:


 Done:

    - PluginDetect.getVersion() will return the value of obj.GetVersionInfo() whenever possible.
    This is done to be consistent with other RealPlayer detection scripts that use
    obj.GetVersionInfo().

    - IE returns a value for obj.GetVersionInfo() since the earliest versions of RealPlayer.
    Non-IE browsers return a value for obj.GetVersionInfo() since RealPlayer 12+.

    - For non-IE browsers on Windows, for RealPlayer 11.0.0.xx, since obj.GetVersionInfo()
    is not available, we will derive the approximate value of GetVersionInfo() using
    the mimetypes array ("application/vnd.rn-realplayer-javascript") and a lookup table.

    - For non-IE browsers on Windows, for RealPlayer < 11, since obj.GetVersionInfo()
    is not available, we get the approximate value using the mimetype 
    "application/vnd.rn-realplayer-javascript".

    - The odd thing about obj.GetVersionInfo() for IE in RealPlayer 11.xx.yy is that
    the returned version # (11.0.0.zz) is not shown in the "About RealPlayer" dialog.
    For example, RealPlayer 11.0.7 (Build 6.0.14.875) can be shown in the "About RealPlayer"
    dialog, but obj.GetVersionInfo() returns 11,0,0,468.
    And for non-IE, the mimetypes array will only reveal the number 6.0.12.69.

    - Tested RealPlayer 12,0,0,1569 and 11,1,0,116 and 10,1,0,412 on Safari 5/Mac.
    PluginDetect successfully detected the RealPlayer version.
    The navigator.mimtypes array does not show any version numbers.
    In the "About RealPlayer" dialog for the parent application, it shows the version(build) as 
      10.1.0(412) - which matches the GetversionInfo() result.
    We can instantiate RealPlayer in the web page, and use GetVersionInfo().
    It is best when instantiating in Safari/Mac not to use any src file. Just instantiate 
      without any real media file, or else RealPlayer might give a popup if it 
      cannot play that file.
    - Could not install and run RealPlayer 8 on the Mac I was testing, due to not being
    compatible.

    - Filter out RealPlayer 10.xx when instantiating?
    - Make a table to show version vs build vs getVersion(), etc...
      Build A.B.C.D result from PluginDetect will have some uncertainty in
      the last digit D.
    - To detect Realplayer version in non-IE browsers, we must instantiate and query.
      Look for lowest realplayer version where we can detect player version
      and compare this to the mimetypes array version. For this mimetypes version and higher,
      we can instantiate. For lower versions, don't bother.
    - minVersion can be different for each platform, if you need it to be. Discuss in docs.
    - What about Linux?
    - Test in Vista
    - What about 64 bit RealPlayer? What if 64 bit player has different dllVersion from 32bit?
    Answer: SP 1.1 and later versions will work on Microsoft Windows XP and
    Windows Vista 64-bit operating systems; older versions will not. 
    Please see the RealPlayer system requirements for a complete list of supported 
    operating systems.
    - If we cannot get dllVersion from mimetype array, then instantiate anyway? Yes.
    - Test RealPlayer 11 in Firefox, to see that version detection works as expected.

-----------------------------------------------------------------------------


What follows is a table on available version numbers for various RealPlayers

GetVersionInfo() indicates major and minor version information for the 
RealPlayer plugin (ie. the plugin, not the parent RealPlayer).

We have several ways of referring to the same RealPlayer
 1) RealPlayer Release Version. Shown in "About RealPlayer" dialog.
 2) Standalone Build Number. Shown in "About RealPlayer" dialog
 3) Plugin version ( ie. GetversionInfo() )
 4) The version # shown on the RealPlayer installer.
  Right-click on installer -> properties



The Build # for the parent RealPlayer may or may not be the same as the version #
for the embedded RealPlayer.

Note: The "Javascript plugin" for Firefox in the table below is for 
the mimetype:"application/vnd.rn-realplayer-javascript".


 Release version         Firefox              Firefox         Internet Explorer
 & Build version      GetVersionInfo()   (Javascript plugin)   GetVersionInfo()
 for Parent Player   (Embedded version)                      (Embedded version)
 -------------      ------------------   ----------------    -------------------

  16.0.3.51              16,0,3,51          16,0,3,51          16,0,3,51
  August 15, 2013
  Installer:16.0.3.51

  15.0.0.198             15,0,0,198         15,0,0,198         15,0,0,198
  November 10, 2011
  Installer:15.0.0.198
  [Note: all the component versions of this player match the player version,
  so the version numbering scheme makes sense now!!!]

  14.0.2.633             14,0,2,633         12.0.1.633         14,0,2,633
  January 26, 2011
  Installer:12.0.1.633

  14.0.1.609             14,0,1,609         12.0.1.609         14,0,1,609
  November 10, 2010
  Installer:12.0.1.609

  SP 1.1.5               12,0,0,879         6.0.12.775         12,0,0,879
  Build 12.0.0.879
  July 01, 2010
  Installer:12.0.0.879

  SP 1.1.4               12.0.0.756         6.0.12.732         12,0,0,756
  Build 12.0.0.756
  May 03, 2010
  Installer:12.0.0.756

  SP 1.1.3               12.0.0.658         6.0.12.732         12,0,0,658
  Build 12.0.0.658
  March 22, 2010
  Installer:12.0.0.658

  SP 1.1.1               12.0.0.608         6.0.12.709         12,0,0,608
  Build 12.0.0.614
  March 01, 2010
  Installer:12.0.0.614

  SP 1.1                 12,0,0,582         6.0.12.688         12,0,0,582
  Build 12.0.0.591
  February 16, 2010
  Installer:12.0.0.591

  SP 1.0.5               12.0.0.297         6.0.12.448         12,0,0,297
  Build 12.0.0.343
  November 19, 2009
  Installer:12.0.0.343

  SP 1.0.2               12.0.0.297         6.0.12.448         12,0,0,297
  Build 12.0.0.319
  October 14, 2009
  Installer:12.0.0.319

  SP 1.0                 12,0,0,297         6.0.12.448         12,0,0,297
  Build 12.0.0.297
  Aug 18, 2009
  Installer:12.0.0.297

  SP 1.0 (Beta)          12,0,0,186         6.0.12.338         12,0,0,186
  Build 12.0.0.196
  June 21, 2009
  Installer:12.0.0.196

  SP 1.0 (Beta)
  Build 12.0.0.173       12,0,0,173?        6.0.12.320?        12,0,0,173?
  (Unable to find 
   installer for this
   build)



[*** 6.0.11.2799 - 6.0.12.69 belongs to Build 6.0.14 RealPlayer 11  ***]

  11.1.3                   null            6.0.12.69          11,0,0,663
  Build 6.0.14.995
  June 26, 2009
  Installer:11.0.0.674

  11.1.2                   null            6.0.12.69          11,0,0,663
  Build 6.0.14.954
  June 10, 2009
  Installer:11.0.0.673

  11.1.1                   null            6.0.12.69          11,0,0,663
  Build 6.0.14.944
  April 24, 2009
  Installer:11.0.0.663
 
  11.1.1                   null            6.0.12.69?         11,0,0,660?
  Build 6.0.14.941
 (Unable to get 
  installer:11.0.0.660)

  11.1                     null            6.0.12.69          11,0,0,468
  Build 6.0.14.895
  March 18, 2009
  Installer:11.0.0.614

  11.0.8                   null            6.0.12.69          11,0,0,468
  Build 6.0.14.891
  February 24, 2009
  Installer:11.0.0.581

  11.0.7.a                 null            6.0.12.69          11,0,0,468
  Build 6.0.14.881
  February 12, 2009
  Installer:11.0.0.559

  11.0.7                   null            6.0.12.69          11,0,0,468
  Build 6.0.14.875
  January 30, 2009
  Installer:11.0.0.544

  11.0.6                   null            6.0.12.69          11,0,0,468
  Build 6.0.14.835
  Nov 4, 2008
  Installer:11.0.0.477
 
  11.0.5                   null            6.0.12.69          11,0,0,468
  Build 6.0.14.826
  September 17, 2008
  Installer:11.0.0.468

  11.0.4                   null            6.0.12.46          11,0,0,431
  Build 6.0.14.806
  July 07, 2008
  Installer:11.0.0.453

  11.0.3                   null            6.0.12.46          11,0,0,431
  Build 6.0.14.806
  April 10, 2008
  Installer:11.0.0.446

  11.0.1 (Beta)            null            6.0.12.46          11,0,0,431
  Build 6.0.14.794
  Jan 11, 2008
  Installer:11.0.0.431

  Unable to get installer
  Installer:11.0.0.422

  11                       null            6.0.11.3006        11,0,0,372
  Build 6.0.14.738
  Nov 12, 2007
  Installer:11.0.0.372
  
  11 (Beta)                null            6.0.11.2806        11,0,0,180
  Build 6.0.14.552
  Oct 23, 2007
  Installer:11.0.0.183

  11 (Beta)                null            6.0.11.2806        11,0,0,180
  Build 6.00.14.550
  September 07, 2007
  Installer:11.0.0.181

  11 (Beta)                null            6.0.11.2804        11,0,0,172
  Build 6.0.14.544
  August 09, 2007
  Installer:11.0.0.175
 
  11 (Beta)                null            6.0.11.2804        11,0,0,172
  Build 6.0.14.543
  July 31, 2007
  Installer:11.0.0.174

  11 (Beta)                null            6.0.11.2799        11,0,0,167
  Build 6.0.14.536
  June 26, 2007
  Installer:11.0.0.167

  11 (Beta)                null            6.0.11.2749        11,0,0,114
  Build 6.0.14.484
  June 5, 2007
  Installer:11.0.0.114



[*** RealPlayer Enterprise versions ***]

  RealPlayer Enterprise 2.1.2
  Build 6.0.12.1810

  RealPlayer Enterprise 2.1.1
  Build 6.0.12.1798

  RealPlayer Enterprise 1.14
  Build 6.0.11.2651

  6.0.11.2378
  6.0.11.2160
  6.0.11.1760


[*** 6.0.12.1016 - 6.0.12.1741 belongs to RealPlayer 10.5 ***]
 Real.com shows build 6.0.12.1040 is part of RealPlayer 10.5
 Real.com shows build 6.0.12.1016 is part of RealPlayer 10.5 Beta


  10.5                     null            6.0.12.1739        6,0,12,1739
  Build 6.0.12.1741
  October 16, 2006
  Installer:6.0.12.1741

  10.5                     null            6.0.12.1698        6,0,12,1698
  Build 6.0.12.1698
  September 13, 2006
  Installer:6.0.12.1698

  10.5                     null            6.0.12.1483        6,0,12,1483
  Build 6.0.12.1483
  February 17, 2006
  Installer:6.0.12.1483

  10.5                     null            6.0.12.1465        6,0,12,1465
  Build 6.0.12.1465
  November 29, 2005
  Installer:6.0.12.1465

  10.5                     null            6.0.12.1348        6,0,12,1348
  Build 6.0.12.1348
  October 10, 2005
  Installer:6.0.12.1348

  10.5                     null            6.0.12.1212        6,0,12,1212
  Build 6.0.12.1235
  June 30, 2005
  Installer:6.0.12.1235

  10.5                     null            6.0.12.1212        6,0,12,1212
  Build 6.0.12.1212
  June 02, 2005
  Installer:6.0.12.1212

  10.5                     null            6.0.12.1059        6,0,12,1059
  Build 6.0.12.1059
  February 16, 2005
  Installer:6.0.12.1059
  
  10.5 (Beta)
  Build 6.0.12.1016
 (Installer not 
   available)


[*** ***]

  10.0                     null            6.0.12.872         6,0,12,872
  Build 6.0.12.883
  June 30, 2004
  Installer:6.0.12.883
  
  10.0
  Build 6.0.12.857
  March 2004

  RealOne Player 2.0       null            6.0.11.847         6,0,11,847
  Build 6.0.11.872
  January 22, 2004
  Installer:7.0.0.2151

  RealOne Player 1.0       null            6.0.10.505         6,0,10,505
  Build 6.0.10.505
  August 15, 2002
  Installer:7.0.0.1364

  Build 6.0.9.584          null              null             6,0,8,1024
  Year 2000
  Installer:6.0.9.665



*/


BOUNDARY("select.pluginCheckbox.realplayer");


var REALPLAYER = {

  // Property is automatically removed by Script Generator
  firstProperty:"select.pluginCheckbox.realplayer",

  BOUNDARY0:"0",

  // This object assists in creating a custom version of the script for the user.
  script:{

    select:{pluginCheckbox:{realplayer:"RealPlayer"}},

    fileNameSuffix:"RealPlayer",

    checkboxLabel:"RealPlayer",

    errCheck:function(code, select){
        if (!select.miscCheckbox.allowactivex &&
             (/\.axo|\.codebase|\.AXO|\.getAXO|\.ActiveX|ActiveXObject/).test(code.customModuleScript)
           )
              alert("Error: ActiveX code found in " + code.moduleName + " module");
    },

    // include:function(select){} tells us which other modules to include when using this module.
    //
    // Do not put $.message/BOUNDARY in the array[] here because they are automatically
    // included/removed from the script as needed.
    //
    // Any items in the outermost array must ALL be included (AND).
    // At least one item in an inner array must be included (OR).
    //
    // For this particular plugin, plugin.getVersion() must be called by either
    // $.isMinVersion or $.getVersion. Hence we use the inner array
    // [$.isMinVersion, $.getVersion] here.
    include:function(){
         return [$.pd, $.getPluginFileVersion, $.DOM, $.win,
               $.hasMimeType, [$.isMinVersion, $.getVersion]]
    }

  }, // end of script{}

BOUNDARY1:"select.pluginCheckbox.realplayer",


  mimeType: ["audio/x-pn-realaudio-plugin", "audio/x-pn-realaudio"],

  // pre-Approved Active X control for RealPlayer
  classID: "clsid:CFCDAA03-8BE4-11cf-B84B-0020AFBBCCFA",



// This routine sets the value of the output variables for the plugin detection.
// The output variables of the detection are realplayer.version, realplayer.installed.
setPluginStatus: function(installed, version){

   var real=this, getVersionDone;

   $.message.write("[ ]", $.message.end());
   $.message.write("[ START Setting plugin status for RealPlayer ]", $.message.end());

   if (version) real.version = $.formatNum($.getNum(version));

   real.installed = real.version ? 1 : ( installed ? 0 : -1 );
   


   getVersionDone = real.installed==-1 || real.instance.version;

   BOUNDARY("select.pluginCheckbox.realplayer && select.miscCheckbox.allowactivex");

   // ActiveX only
   getVersionDone = getVersionDone || real.axo.version;

   BOUNDARY("select.pluginCheckbox.realplayer");

   // == 1 means real.getVersion() does not need to be called again
   // == 0 means real.getVersion() is allowed to be called again.
   //
   // If plugin was detected, but plugin version was NOT detected, then we allow
   // real.getVersion() to run again.
   real.getVersionDone = getVersionDone ? 1 : 0;



   $.message.write("[ real.version: " + real.version + " ]", $.message.end());
   $.message.write("[ real.installed: " + real.installed + " ]", $.message.end());
   $.message.write("[ real.getVersionDone: " + real.getVersionDone + " ]", $.message.end());

   $.message.write("[ END Setting plugin status for RealPlayer ]", $.message.end());
   $.message.write("[ ]", $.message.end());

},   // end setPluginStatus()


// Detect if RealPlayer is installed using navigator arrays
navObj: {

  // == 0 if not called
  // == 1 if called
  hasRun: 0,

  // 1 if RealPlayer is installed
  // 0, null otherwise
  installed: null,
  
  version: null,

  // We search the navigator.plugins[] array, and we MUST have it match this regular expression
  find: "RealPlayer.*Plug-?in",

  // Filter out imitators
  //
  // There is a RealPlayer download plugin...
  //    name: "RealPlayer Download Plugin"
  //    description: "RealPlayer Download Plugin"
  // To filter out the RealPlayer download plugin, we add "Download"
  avoid: "Totem|QuickTime|Helix|VLC|Download",

  // For Windows XP, we get the following navigator.plugins[] data...
  //
  //
  // RealPlayer 10.0
  // name: "RealPlayer(tm) G2 LiveConnect-Enabled Plug-In (32-bit) "
  // description: "RealPlayer(tm) LiveConnect-Enabled Plug-In"
  //
  // RealPlayer 11.0.0.372
  // name: "RealPlayer(tm) G2 LiveConnect-Enabled Plug-In (32-bit) "
  // description: "RealPlayer(tm) LiveConnect-Enabled Plug-In"
  //
  // RealPlayer 16.0.3.51
  // name: "RealPlayer(tm) G2 LiveConnect-Enabled Plug-In (32-bit) "
  // description: "RealPlayer(tm) LiveConnect-Enabled Plug-In"
  //
  //
  // For Mac, some outdated RealPlayer data
  // name: RealPlayer Plugin
  // description: Plugin that plays RealMedia content
  //
  plugins:["RealPlayer(tm) G2 LiveConnect-Enabled Plug-In (32-bit) ",
    "RealPlayer(tm) G2 LiveConnect-Enabled Plug-In (64-bit) ", 
    "RealPlayer Plugin"],


  query:function(){

     var navObj=this, real=REALPLAYER,
         tmp,
         enabled=!navObj.hasRun && $.hasMimeType(real.mimeType);

     navObj.hasRun = 1;
     if (enabled)
     {
       $.message.write("[ ]", $.message.end());
       $.message.write("[ START look for RealPlayer in navigator[ ] arrays ]", $.message.end());

       $.message.write("[ mimetype \"" + $.hasMimeType(real.mimeType).type + "\": found ]", $.message.end());
       $.message.write("[ mimetypeObj.enabledPlugin.description: \"" +
               $.hasMimeType(real.mimeType).enabledPlugin.description + "\" ]", $.message.end());
       $.message.write("[ mimetypeObj.enabledPlugin.name: \"" +
               $.hasMimeType(real.mimeType).enabledPlugin.name + "\" ]", $.message.end());


       // RealPlayer navigator.plugins[i] exists, then RealPlayer is installed.
       // We do not look for a version number here in the navigator.plugins[] array.
       // Is mimetype hijacking by other plugins something to consider here?
       tmp = $.pd.findNavPlugin({find:navObj.find, avoid:navObj.avoid,
          mimes:real.mimeType, plugins:navObj.plugins});

       navObj.installed = tmp ? 1 : 0;
       $.message.write("[ RealPlayer plugin detected: " + (navObj.installed ? "true" : "false")  + " ]", $.message.end());


       // If the RealPlayer version >= 15, then the plugin file version == RealPlayer version.
       // If RealPlayer version < 15, then plugin file version != RealPlayer version
       tmp = $.getPluginFileVersion(tmp);
       if (tmp && $.compareNums($.formatNum(tmp), $.formatNum("15"))>=0) navObj.version = tmp;
       $.message.write("[ RealPlayer plugin version: " + navObj.version + " ]", $.message.end());


       $.message.write("[ END look for RealPlayer in navigator[ ] arrays ]", $.message.end());

     }

     return navObj;


  }  // end of query()

},  // end of navObj{}


// Get plugin version from the RealPlayer Version plugin.
// This object can only get the plugin version for RealPlayer 10 & 11 on Windows.
JS:{

  // == 0 if not called
  // == 1 if called
  hasRun: 0,

  // is a string version
  //  (plugin version of RealPlayer, derived from the RealPlayer Version plugin.
  //   This only has a value for RealPlayer 10 & 11.)
  // or is null
  version: null,

  regStr: "RealPlayer.*Version.*Plug-?in",

  mimetype: "application/vnd.rn-realplayer-javascript",


  // Data used to convert version/build numbers (derived from GetVersionInfo())
  // Convert 11.0.0.xx
  // We added dummy data at q1[1] and q1[q1.length] to serve as endpoints
  q1:[ [11,0,0], [999],
       [663],[663],[663],[660],[468],[468],[468],[468],[468],[468],
       [431],[431],[431],[372],[180],[180],[172],[172],[167],[114],
       [0]
     ],

  // Data used to convert version/build numbers (derived from mimetype array)
  // Convert 6.0.ww.xx
  // We added dummy data at q3[1] and q3[q3.length] to serve as endpoints
  q3:[ [6,0], [12,99],
       [12,69],[12,69],[12,69],[12,69],[12,69],[12,69],[12,69],[12,69],[12,69],[12,69],
       [12,46],[12,46],[12,46],[11,3006],[11,2806],[11,2806],[11,2804],[11,2804],[11,2799],[11,2749],
       [11,2700]
     ],

  // Data used to convert version/build numbers
  // Convert 6.0.14.xx
  // We added dummy data at q2[1] and q2[q2.length] to serve as endpoints
/*
q2:[ [6,0,14], [999],
 [995],[954],[944],[941],[895],[891],[881],[875],[835],[826],[806],[806],[794],[738],[552],[550],[544],[543],[536],[484],
 [400]
],
*/


  // Compare input arrays a and b
  // Each array contains numbers
  // Return 1 if a>b
  // Return -1 if a<b
  // Return 0 if a==b
  // The 2 arrays do not need to have the same length
  compare: function(a,b){

     var x, A=a.length, B=b.length, q1, q2;

     for (x=0;x<Math.max(A,B);x++){
        q1 = x<A ? a[x] : 0;
        q2 = x<B ? b[x] : 0;

        if (q1>q2) return 1;    // a>b
        if (q1<q2) return -1;   // a<b
     }

     return 0;  // a==b

  },  // end of compare()


  // Examine iNum for a pattern, determined by q1.
  // If no pattern match, then return null.
  // If a match is found, then return a number, determined by q2.
  //
  // iNum is a string number or null.
  // q1 is an array, contains the numbers that we search for.
  // q2 is an array, contains the numbers we convert to if a match is found.
  //
  // Note that we do not require iNum.length == q1[0].length + q1[1].length
  convertNum: function(iNum, q1, q2){

     var JS=this, tmp, LStmp, x, noMatch=null;

     if (!iNum || !(tmp = $.formatNum(iNum))) return noMatch;

     tmp=tmp.split($.splitNumRegx);
     for (x=0;x<tmp.length;x++){tmp[x] = parseInt(tmp[x],10)}

     // if most sig digits of iNum do not match q1[0], then exit
     if (JS.compare(tmp.slice(0, Math.min(q1[0].length,tmp.length)), q1[0])!==0) return noMatch;

     // Store least sig digits of iNum
     LStmp = tmp.length>q1[0].length ? tmp.slice(q1[0].length) : [];

     // if least sig digits of iNum out of range, then exit
     if (JS.compare(LStmp,q1[1])>0 || JS.compare(LStmp,q1[q1.length-1])<0) return noMatch;


     for (x=q1.length-1;x>=1;x--)
     {
       if (x==1) break;
       if (JS.compare(q1[x],LStmp)===0 && JS.compare(q1[x],q1[x-1])===0) break;
       if (JS.compare(LStmp,q1[x])>=0 && JS.compare(LStmp,q1[x-1])<0) break;
     }
   
     return q2[0].join(".") + "." + q2[x].join(".");

  },  // end of convertNum()


  isEnabled:function(){

     var JS=this;

     // This allows query() to only run once.
     // It also filters out any browsers that do not have the correct mimetype.
     // I only have data on JS{} for RealPlayer < 12 on Windows.
     return !JS.hasRun && $.OS==1 && $.hasMimeType(JS.mimetype) ? 1 : 0;

  },

  query:function(){
     
      var JS=this, JSVersion, tmp, plugin12status,
          enabled=JS.isEnabled();
      
      JS.hasRun = 1;
      if (enabled)
      {
         $.message.write("[ ]", $.message.end());
         $.message.write("[ START look for RealPlayer<12 in navigator[ ] arrays ]", $.message.end());

         $.message.write("[ mimetype \"" + $.hasMimeType(JS.mimetype).type + "\": found ]", $.message.end());
         $.message.write("[ mimetypeObj.enabledPlugin.description: \"" +
               $.hasMimeType(JS.mimetype).enabledPlugin.description + "\" ]", $.message.end());
         $.message.write("[ mimetypeObj.enabledPlugin.name: \"" +
               $.hasMimeType(JS.mimetype).enabledPlugin.name + "\" ]", $.message.end());

         // We only use navigator.mimeTypes for the plugin search,
         // so we assume that the mimetype never gets hijacked by another plugin.
         tmp = $.pd.findNavPlugin({find:JS.regStr, mimes:JS.mimetype});
         if (tmp) JSVersion = $.formatNum($.getNum(tmp.description));


         // Set the value of plugin12status.
         // If ==1, then RealPlayer version >=12 based on JSVersion
         // If ==-1, then RealPlayer version <12 based on JSVersion
         if (JSVersion)
         {
              var JSVersionArr = JSVersion.split($.splitNumRegx);
              plugin12status = 1;

              // The JSVersion for the last RealPlayer 11 is 6.0.12.69
              // The JSVersion for the first RealPlayer 12 is 6.0.12.318
              if (JS.compare(JSVersionArr, [6,0,12,200])<0) plugin12status=-1;

              // RealPlayer 10.xx
              // Build 6.0.12.857 - 6.0.12.1739
              // JSVersion roughly equals Build #
              else if (JS.compare(JSVersionArr, [6,0,12,1739])<=0 &&
                        JS.compare(JSVersionArr, [6,0,12,857])>=0) plugin12status=-1;

              $.message.write("[ RealPlayer appears to be " + 
                (plugin12status>0 ? ">" : "<") + " version 12 ]", $.message.end());


              // Set the value of JS.version
              if (plugin12status<0)
              {
                 // RealPlayer 11.xx
                 // Build 6.0.14.xx
                 //
                 // Convert JSVersion 6.0.11.2749 - 6.0.12.69 to RealPlayer Version 11.0.0.xx
                 tmp = JS.convertNum(JSVersion, JS.q3, JS.q1);

                 // If tmp, then RealPlayer 11 is present
                 // Else RealPlayer < 11.
                 JS.version = tmp ? tmp : JSVersion;

              }

         }


         $.message.write("[ RealPlayer plugin version: " + JS.version + " ]", $.message.end());
         $.message.write("[ END look for RealPlayer<12 in navigator[ ] arrays ]", $.message.end());

      }
      
      return JS;


  } // end of query()

}, // end of JS{}


// We try to get the RealPlayer version by instantiating the plugin in the DOM.
// This routine is only intended for non ActiveX browsers,
// (though ActiveX browser are capable of running this routine).
instance:{

   // == 0 if not called
   // == 1 if called
   hasRun: 0,

   // String version if plugin detected
   // null otherwise
   version:null,

   // Holds the instantiated plugin object
   HTML: null,

   isEnabled:function(){

      var instance=this, real=REALPLAYER, result=1;


      // If the <object> tag is disabled, then instantiation is disabled.
      if (!$.DOM.isEnabled.objectTag()){ result = 0; }  // disabled


      // For debug mode, we bypass all the browser/OS filtering (below) just
      // so we see how all the browsers behave with this routine.
      else if ($.dbug){}


      else if (instance.hasRun ||

           // If <object> tag uses ActiveX, then do not insert into DOM.
           // This routine is only intended for non ActiveX browsers,
           // (though ActiveX browsers are capable of running this routine).
           //
           // Note: when ActiveX is disabled in IE, and you try to use an <object>
           // tag, you could get a security popup.
           //
           // Note: For IE < 11, there are no items in the the navigator.mimeTypes[] and
           // navigator.plugins[] arrays.
           //
           // Note: For IE 11+, it is possible for a plugin to have items in the
           // navigator.mimeTypes[] and navigator.plugins[] arrays, depending on the
           // plugin installer. When ActiveX is disabled, those items in the array
           // will be removed, assuming the plugin uses ActiveX.
           //
           // Thus, when ActiveX is disabled, there should be no items for this
           // plugin in the navigator.mimeTypes[] array for IE 11+. Hence we would
           // not insert anything into the DOM, because we check for $.hasMimeType(real.mimeType),
           // as shown below. So we again would avoid any security popup in IE.
           //
           $.DOM.isEnabled.objectTagUsingActiveX() ||

           // If no mimetypes exists, then we do not insert plugin into DOM.
           // Otherwise we could get a popup in Firefox when the plugin not installed.
           !$.hasMimeType(real.mimeType) ||



           // RealPlayer stops at version 11 for Linux, and version 11 does not
           // allow us to use GetVersionInfo(). So this routine is disabled for Linux.
           //
           // I do not know at this point if the version numbers for RealPlayer mobile version
           // are the same as RealPlayer desktop version.



           // We filter out old browser versions on those OSes,
           // just to be sure that those older browsers do not crash when trying to
           // instantiate RealPlayer. I'm not saying that they will crash, merely that it
           // might be a good idea.
           // Whenever we instantiate a plugin to get the version, the possibility
           // of a browser bug exists that could cause the browser to crash.
           //
           // We only instantiate for Gecko>=1.8.
           ($.browser.isGecko && $.compareNums($.browser.verGecko, $.formatNum("1,8"))<0) ||


           // Opera<10 does not allow use of <object> tag to instantiate, only <embed> tag.
           // We prefer to only use <object> tag.
           // On Windows, Opera<10 cannot query RealPlayer plugin to get the version.
           //
           // Older versions of Opera tend to crash with RealPlayer, so we filter them out.
           ($.browser.isOpera && $.compareNums($.browser.verOpera, $.formatNum("10"))<0)


        ) result = 0;     // disabled


      return result;

   },  // end of isEnabled()


   // Instantiate the plugin
   query:function(){

      var instance=this, real=REALPLAYER, obj,
          enabled=instance.isEnabled();

      instance.hasRun = 1;
      if (enabled)
      {
          $.message.write($.message.time(instance.query,1), $.message.end());   // Start measuring time delay
          $.message.write("[ ]", $.message.end());
          $.message.write("[ START instantiate RealPlayer and query ]", $.message.end());

          instance.HTML = $.DOM.insert("object",
               ["type", real.mimeType[0]],
               ["src","",                 // Do not use any source file
                "autostart","false",      // do not play anything
                "imagestatus","false",    // display no info
                "controls","stopbutton"   // only display a stop button
             ], "", real);

/*
          // <embed> tag should work, perhaps even better than <object>,
          // because <embed> has been in use longer than <object>.
          instance.HTML = $.DOM.insert("embed",
             ["type",real.mimeType[0],
              "src","",                  // Do not use any source file
              "autostart","false",       // do not play anything
              "imagestatus","false",     // display no info
              "controls","stopbutton"    // only display a stop button
             ],
             [], "", real
          );
*/

          obj = instance.HTML.obj();

          // The GetVersionInfo() method appears to be the best way to get the RealPlayer
          // plugin version.
          try{instance.version = $.getNum(obj.GetVersionInfo())}
          catch(e){}

          $.message.write("[ RealPlayer plugin version: " + instance.version + " ]", $.message.end());

          $.message.write("[ tag.width: " + instance.HTML.width() + " ]", $.message.end());

          // For some reason, in Firefox 4 RC 1, when I test the AllPlugins.html page,
          // I get a popup in the browser saying that the RealPlayer plugin has crashed,
          // for RealPlayer 12. This only seems to happen when I instantiate another
          // plugin AFTER RealPlayer has been instantiated.
          // I do not know if this is a browser bug or a RealPlayer bug. Either way,
          // the popup can be prevented by removing the instantiated RealPlayer object
          // right after the query. However, we do not want to remove any object
          // until AFTER window.onload (older Konqueror browsers would not fire
          // window.onload when we deleted an applet from the page.) So, as an alternative
          // we simply set the style to display:none. Seems to work just fine.
          //
          // This prevents any potential RealPlayer crash.
          $.DOM.setStyle(obj, ["display", "none"]);


          $.message.write("[ END instantiate RealPlayer and query in " +
               $.message.time(instance.query) + " ]", $.message.end());

      }

      return instance;

   }  // end of query()

}, // end of instance{}


BOUNDARY3: "select.pluginCheckbox.realplayer && select.miscCheckbox.allowactivex",


// Look at ActiveX objects to detect RealPlayer
axo:{

   // == 0 if not called
   // == 1 if called
   hasRun: 0,

   // == 1 if installed
   // == 0, null otherwise
   installed:null,

   // RealPlayer version [string/null]
   version:null,
   
   // pre-Approved controls for Real Player   control.GetVersionInfo();
   progID: [
     "rmocx.RealPlayer G2 Control",    // pre-Approved for IE 7+
     "rmocx.RealPlayer G2 Control.1",  // pre-Approved for IE 7+
     "RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)",
     "RealVideo.RealVideo(tm) ActiveX Control (32-bit)",
     "RealPlayer"
   ],


   query:function(){
     
      var axo=this,
        obj, x, version;

      if (!axo.hasRun)
      {
         axo.hasRun = 1;

         $.message.write($.message.time(axo.query,1), $.message.end());   // Start measuring time delay
         $.message.write("[ ]", $.message.end());
         $.message.write("[ START ActiveX RealPlayer query ]", $.message.end());

         for (x=0;x<axo.progID.length;x++)
         {
           obj = $.getAXO(axo.progID[x]);

           if (obj)
           {
              axo.installed = 1;

              version=0;
              try{version=obj.GetVersionInfo() + "";}
              catch(e){}

              if (version){
                axo.version = version;
                if (!$.dbug) break;
              }

           }

         }

         $.message.write("[ installed: " + (axo.installed ? "true" : "false") + " ]", $.message.end());
         $.message.write("[ version: " + axo.version + " ]", $.message.end());

         $.message.write("[ END ActiveX RealPlayer query in " +
               $.message.time(axo.query) + " ]", $.message.end());

      }

      return axo;

   } // end of query()

},  // end of axo{}


BOUNDARY4: "select.pluginCheckbox.realplayer",


// [public]
// Get install status and version for RealPlayer plugin.
// "instantiate" input arg will try to force real.instance{} to run for non-IE browsers.
getVersion: function(dummy, instantiate){

  var real=this,

      version=null,  // This is the version of the RealPlayer plugin,
                     // which may or may not be the same as the
                     // RealPlayer parent app version.
                     // In the latest RealPlayer releases, the 2 are the same.

      installed=0;



  BOUNDARY("select.pluginCheckbox.realplayer && select.miscCheckbox.allowactivex");

  // ** Detection attempt # 1
  // Look at new ActiveXObject() to detect the plugin.
  // This works reliably for Internet Explorer.
  if ((!installed || $.dbug) && real.axo.query().installed) installed = 1;
  if ((!version || $.dbug) && real.axo.query().version) version = real.axo.version;

  BOUNDARY("select.pluginCheckbox.realplayer");


  // ** Detection attempt # 2
  // See if the plugin version is in the navigator arrays.
  // Version # only available for RealPlayer 15+.
  if ((!installed || $.dbug) && real.navObj.query().installed) installed = 1;
  if ((!version || $.dbug) && real.navObj.query().version) version = real.navObj.version;


  // ** Detection attempt # 3
  // Get plugin version from the navigator.plugins array,
  // but this is only for RealPlayer < 12.
  if ((!version || $.dbug) && real.JS.query().version)
  { 
      installed = 1;
      version = real.JS.version;
  }


  // ** Detection attempt # 4
  // Instantiate and query() RealPlayer in the DOM to get the plugin version.
  // This works for both IE and non-IE browsers, however
  // it is only intended for non-IE browsers.
  //
  // This is the most consistent and reliable method of plugin version detection
  // for non-IE browsers. It is also the slowest, since we are instantiating the 
  // plugin in the DOM and querying it.
  //
  // There is a chance that trying to run an outdated RealPlayer could cause a
  // security popup in your browser. So we only run this routine in limited cases.
  if (((!installed && !version) || instantiate || $.dbug) && real.instance.query().version)
  {
      installed = 1;
      version = real.instance.version;
  }




  real.setPluginStatus(installed, version);


},   // end of getVersion()


// Property is automatically removed by Script Generator
lastProperty:"select.pluginCheckbox.realplayer"

};  // end of realplayer{}


$.addPlugin("realplayer", REALPLAYER);


// ****************************** End of RealPlayer detection ******************************




// ******************************************************************************************
// Detect Internet Explorer Components using clientCaps.
// ClientCaps only works for IE < 11.



BOUNDARY("select.pluginCheckbox.iecomponent");

var IECOMPONENT = {
  
  // Property is automatically removed by Script Generator
  firstProperty:"select.pluginCheckbox.iecomponent",

  BOUNDARY0:"0",

  // This object assists in creating a custom version of the script for the user.
  script:{

    select:{pluginCheckbox:{iecomponent:"IEcomponent"}},

    fileNameSuffix:"IEcomponent",

    checkboxLabel:"Component (A generic component detector based on clientCaps. Internet Explorer only.)",

    errCheck:function(code, select){
        if (!select.miscCheckbox.allowactivex &&
             (/\.axo|\.codebase|\.AXO|\.getAXO|\.ActiveX|ActiveXObject/).test(code.customModuleScript)
           )
              alert("Error: ActiveX code found in " + code.moduleName + " module");
    },

    // include:function(select){} tells us which other modules to include when using this module.
    //
    // Do not put $.message/BOUNDARY in the array[] here because they are automatically
    // included/removed from the script as needed.
    //
    // Any items in the outermost array must ALL be included (AND).
    // At least one item in an inner array must be included (OR).
    //
    // For this particular plugin, plugin.getVersion() must be called by either
    // $.isMinVersion or $.getVersion. Hence we use the inner array
    // [$.isMinVersion, $.getVersion] here.
    include:function(){
         return [ [$.isMinVersion, $.getVersion] ]
    }

  }, // end of script{}


  BOUNDARY1:"select.pluginCheckbox.iecomponent",


// Set the component status.
//
setPluginStatus: function(installed, version, err){

   var IEComp=this;

   IEComp.version = $.formatNum(version);
   
   IEComp.installed =
       
       version ? 1 :

         (  // installed is undefined, null, 0, true, 1.
            // 0 means component is installed but version is unknown
            installed ? 0 :
            
              // If there is an error, then -3
              // Otherwise component not installed/not enabled, so -1
              (err ? -3 : -1)

         );


}, // end of setPluginStatus()

// [public]
getVersion:function(minVersion, compid){

   var IEComp=this,
      installed=null, version=null;

   // We can call this routine with a different classid each time,
   // so we set getVersionDone==0 so that getVersion() can be called
   // again.
   IEComp.getVersionDone = 0;


   if (compid && $.isString(compid) && (/[^\s]+/).test(compid))
   {
      compid = compid.replace(/\s/g,"");

   }
   else
   {  // error, no valid classid/mimetype input given
      IEComp.setPluginStatus(0,0,1);
      return;
   }


   // Get info from clientCaps
   if (!IEComp.obj)
   {
      IEComp.obj = document.createElement("div");

      try{IEComp.obj.style.behavior = "url(#default#clientcaps)"}
      catch(e){}
   
   }



   try{
       // This works for IE 5.5+ and IE < 11.
       // For IE 5, we would need to insert obj into the DOM, then set the behaviour,
       // and then query.
       version = IEComp.obj.getComponentVersion(compid, "componentid").replace(/,/g,".");

   }
   catch(e){}


   try{
       if (!version)
         installed = IEComp.obj.isComponentInstalled(compid, "componentid")  ? 1 : 0;
   }
   catch(e){}



   IEComp.setPluginStatus(installed, version);



},  // end of getVersion()

// Property is automatically removed by Script Generator
lastProperty:"select.pluginCheckbox.iecomponent"

}; // end of iecomponent{}


$.addPlugin("iecomponent", IECOMPONENT);


// **************************** End of IE Component *************************************




// ********************************************************************************************
// Try to detect any ActiveX control based on the classid/mimetype


BOUNDARY("select.pluginCheckbox.activex");

var ACTIVEX = {

  // Property is automatically removed by Script Generator
  firstProperty:"select.pluginCheckbox.activex",

  BOUNDARY0:"0",

  // This object assists in creating a custom version of the script for the user.
  script:{

    select:{pluginCheckbox:{activex:"ActiveX"}},

    fileNameSuffix:"ActiveX",

    checkboxLabel:"ActiveX (A generic plugin detector based on ActiveX. Internet Explorer only.)",

    errCheck:function(code, select){
        if (!select.miscCheckbox.allowactivex &&
             (/\.axo|\.codebase|\.AXO|\.getAXO|\.ActiveX|ActiveXObject/).test(code.customModuleScript)
           )
              alert("Error: ActiveX code found in " + code.moduleName + " module");
    },

    // include:function(select){} tells us which other modules to include when using this module.
    //
    // Do not put $.message/BOUNDARY in the array[] here because they are automatically
    // included/removed from the script as needed.
    //
    // Any items in the outermost array must ALL be included (AND).
    // At least one item in an inner array must be included (OR).
    //
    // For this particular plugin, plugin.getVersion() must be called by either
    // $.isMinVersion or $.getVersion. Hence we use the inner array
    // [$.isMinVersion, $.getVersion] here.
    include:function(select){
         return [
           // When select.miscCheckbox.allowactivex == true, we include $.codebase{} since
           // it is used for ActiveX plugin detection.
           // Otherwise, we do not include it to make the script smaller.
           (select.miscCheckbox.allowactivex ? $.codebase : 0),
         
           [$.isMinVersion, $.getVersion]]
    }

  }, // end of script{}

  BOUNDARY1:"select.pluginCheckbox.activex",


  // Save detection info for each classid in storage{}
  storage:{},


  BOUNDARY2:"select.pluginCheckbox.activex && select.miscCheckbox.allowactivex",

  // Search the IE codebase to get the plugin version
  codebase: {

    isMin:function(minVersion){
       this.$$ = ACTIVEX;
       return $.codebase.isMin(this, minVersion);
    },

    search:function(){ 
       this.$$ = ACTIVEX;
       return $.codebase.search(this); 
    },

    classID: "",

/*
    ParamTags: "<param name=\"src\" value=\"\" />",
*/

    // DIGITMAX[x] specifies the max value that each digit of codebase version can have.
    // Given DIGITMAX[x] == [A,B,C,D] the maximum allowed codebase is A,B,C,D.
    //
    // The length of DIGITMAX[] is the same as length of Lower[].
    //
    // if DIGITMAX[x] == 0, then it corresponds to a non-existent codebase
    // between Lower[x] and Upper[x].
    //
    // if DIGITMAX[][x] does not exist, then it is assumed to be 0 by the codebase
    // detection routines.
    DIGITMAX:[ [100,100,100,0] ],

    // Min value for each digit of the codebase version
    DIGITMIN: [0,0,0,0],



   // These 2 arrays contain codebase version numbers.
   // They help to convert codebase version numbers to their
   // corresponding plugin version numbers.
   //
   // The rules for these 2 arrays are:
   //  1) Upper[0] is the highest codebase number you ever expect to encounter
   //  2) The last item in Lower[] is always "0"
   //  3) Upper[] is arranged in descending order
   //  4) Lower[] is arranged in descending order
   //  5) Lower[x] == Upper[x+1]
   //  6) The strings in Upper[x],Lower[x] do not have to be formatted.
   //     They are automatically formatted when they are used.
   //  7) Lower[x]<= codebase[x] < Upper[x] corresponds to convert[x]
   //  8) One and only one codebase number is allowed to map to
   //      any given plugin version number. This is IMPORTANT.
   //      When needed, set convert[x]==0 to accomplish this.
   //
   Upper: ["99999"],
   Lower: ["0"],


   // Convert plugin version to/from codebase number.
   // convert[x] is used to convert plugin version to/from codebase number, where
   //   Lower[x] <= codebase[x] number <= Upper[x]
   // This array has the same length as Upper[], Lower[].
   //
   // convert[x] == 1 means that codebase[x] ( == A.B.C.D) == plugin version A.B.C.D.
   // convert[x] == 0 means that codebase[x] does not have a corresponding plugin version,
   //     where  Lower[x]<= codebase[x] < Upper[x].
   //
   // if toCodebase, then convert to codebase number.
   // if !toCodebase, then convert to plugin version number.
   convert: [1]


  },  // end of codebase{}


// Clone the ActiveX.codebase{} object.
// This routine is not intended as a generic clone routine.
clone:function(obj, name){

  var ActiveX=this, x, result,
  
     count=0, countMax=20;

  // We do not clone number, string, null, or function
  if ($.isNum(obj) || $.isString(obj) || obj===null || $.isFunc(obj) ||

      // We do not clone these objects, to avoid infinite recursion.
      // Each of these objects is a parent of ActiveX.codebase.
      obj===$ || obj===$.Plugins || obj===ActiveX
      
      ) return obj;
      
  // We want to avoid cloning any window object, or any element in the DOM.
  // These conditions in the "if statement" are obviously very sloppy,
  // since a Javascript object to be cloned could conceivably contain
  // a window/firstChild/appendChild property. But in this limited case,
  // that will not occur.
  else if (obj.window || obj.firstChild || obj.appendChild)
  {
      $.message.write("[ *** Error in \"" + ActiveX.pluginName + "\" detection module. ]", $.message.end());
      $.message.write("[ *** Error: object " + (name ? "\"" + name + "\" " : " ") +
         "to be cloned should not be in the DOM, " + 
         "and should not have properties names that are the same as the " + 
         "properties names of a DOM object. ]", $.message.end());
      return obj;
  }


  // clone array[]
  else if ($.isArray(obj)) result=[]

  // clone object{}
  else if (obj) result={};

  for (x in obj)
  {
      if ($.hasOwn(obj, x))
      {
         // If the object has too many properties, then it may not be a simple Javascript object.
         // So, we give a warning.
         count++;
         $.message.write(count>countMax ?
            "[ *** Warning: \"" + ActiveX.pluginName + "\" detection module trying to clone " +
            " an object with more than " + countMax + " properties ]" :
           0, $.message.end());

         result[x] = ActiveX.clone(obj[x], x);
      }
  }


  return result;


},  // end of clone()


BOUNDARY3:"select.pluginCheckbox.activex",


// Set the plugin status.
//
// if isMin is 0, then we were not able to use codebase detection, or plugin
//    not installed/enabled.
// if isMin is 1, then we used codebase detection, and version >= minversion, plugin installed.
// if isMin is -1, then we used codebase detection, and version < minversion, plugin installed.
//
// isMin/version can be undefined.
setPluginStatus: function(isMin, version, err){

   var ActiveX=this;


   // We set getVersionDone==0 so that getVersion() can be called again
   // for a different classid.
   ActiveX.getVersionDone = 0;

   ActiveX.version = $.formatNum(version);
   
   ActiveX.installed =
       version ? 1 :

         (  // isMin is undefined, null, 0, > 0, < 0
            // 0.7 means plugin version >= minversion, plugin installed/enabled
            // -0.1 means plugin version < minversion, plugin installed/enabled
            isMin ? (isMin>0 ? 0.7 : -0.1) : 
            
              // If there is an error, then -3
              // Otherwise plugin not installed/not enabled, so -1
              (err ? -3 : -1)

         );


}, // end of setPluginStatus()


// [public]
getVersion:function(minVersion, classid, digitmax){

   var ActiveX=this, isMin=null, version=null, x, codebase, tmp,
       // storage index
       Sindex="";


   // We filter out everything, since it all deals with ActiveX
   BOUNDARY("select.pluginCheckbox.activex && select.miscCheckbox.allowactivex");
   
   
   if ($.codebase.isDisabled())
   {
      ActiveX.setPluginStatus(0, 0);
      return;
   }


   if (classid && $.isString(classid) && (/[^\s]+/).test(classid))
   {
      classid = classid.replace(/\s/g,"");

      // For the storage index, we replace ":", "-", "/" with "$"
      Sindex = classid.replace(/[\:\-\/]/g,"$");

   }
   else
   {  // error, no valid classid/mimetype input given
      ActiveX.setPluginStatus(0,0,1);
      return;
   }



   if ($.isArray(digitmax))
   {
     
      if (!digitmax.length) digitmax.push(0);

      // Check for errors in digitmax
      for (x=0;x<digitmax.length;x++)
      {
        
         if (!$.isDefined(digitmax[x])) digitmax[x]=0;

         if (!$.isNum(digitmax[x]) || digitmax[x]<0 || digitmax[x]>99999999)
         {   // error in digitmax[]
             ActiveX.setPluginStatus(0,0,1);
             return;
         }

      }
   
      // If detection was previously run for this classid
      if (Sindex && ActiveX.storage[Sindex])
      {
         codebase = ActiveX.storage[Sindex].codebase;

         // Check if digitmax[x] > previously used digitmax[x]
         tmp = 0;
         for (x=0;x<Math.max(digitmax.length, codebase.DIGITMAX[0].length);x++)
         {

           if ((x<digitmax.length ? digitmax[x] : 0) >
               (x<codebase.DIGITMAX[0].length ? codebase.DIGITMAX[0][x] : 0))
               {tmp = 1; break;} // The 2 arrays are different

         }


         // if digitmax[x] > previously used digitmax[x]
         if (tmp && codebase.version)
         {
             // Check if one or more digits from the previous detection result are == one or more
             // items in the previously used digitmax[] array
             tmp = codebase.version.split($.splitNumRegx);
             for (x=0;x<Math.max(tmp.length, codebase.DIGITMAX[0].length);x++)
             {
               if ((x<tmp.length ? tmp[x] : 0) ===
                   (x<codebase.DIGITMAX[0].length ? codebase.DIGITMAX[0][x] : 0))
                   // if so, then we erase the ActiveX.storage[Sindex] object,
                   // so that detection can start over for this classid.
                   {ActiveX.storage[Sindex] = null; break;}
             }

         }

      }

   }
   // digitmax is not an array
   else{digitmax=[0];}


   // If detection has never been done for this given classid,
   // then create the ActiveX.storage[Sindex] object.
   if (Sindex && !ActiveX.storage[Sindex])
   {
      // clone the ActiveX.codebase{} object, and place into storage{}
      ActiveX.storage[Sindex]={ codebase:ActiveX.clone(ActiveX.codebase) };

      ActiveX.storage[Sindex].codebase.classID = classid;
           
      // If no valid digitmax, then we use the default value codebase.DIGITMAX
      if ($.isArray(digitmax) && digitmax.length)
          ActiveX.storage[Sindex].codebase.DIGITMAX = [ [].concat(digitmax) ];
   }




   if (minVersion)
   {
      // if isMin is 0, then we were not able to use codebase detection, or plugin
      //    not installed/enabled.
      // if isMin is 1, then we used codebase detection, and version >= minversion, plugin installed.
      // if isMin is -1, then we used codebase detection, and version < minversion, plugin installed.
      isMin = ActiveX.storage[Sindex].codebase.isMin(minVersion);

      // If we ran codebase.search() previously, then codebase.version will
      // be available. So we include it in the output results.
      version = ActiveX.storage[Sindex].codebase.version;

   }

   else
   {
      isMin = 0;

      version = ActiveX.storage[Sindex].codebase.search();

   }


   BOUNDARY("select.pluginCheckbox.activex");

   ActiveX.setPluginStatus(isMin, version);



},  // end of getVersion()

// Property is automatically removed by Script Generator
lastProperty:"select.pluginCheckbox.activex"

};  // end of activex{} object


$.addPlugin("activex", ACTIVEX);



// ****************************** End of ActiveX detection ******************************




// ****************************** Begin PDF.js detection ********************************


/*


   We attempt to detect Firefox's built in PDF Reader called "PDF.js".

   WARNING: it is this author's opinion that the detection method used here is brittle.
   I believe it could break very easily. If Firefox changes in certain ways, or PDF.js
   changes in certain ways, it is possible that it may no longer be possible to detect PDF.js.
   It's not even supposed to be possible right now to detect it, so we went a little
   outside the box on this one.

   This code only tries to detect PDF.js on Gecko browsers. It will not be detected on 
   any other browsers.


*/


BOUNDARY("select.pluginCheckbox.pdfjs");

var PDFJS = {

  // Property is automatically removed by Script Generator
  firstProperty:"select.pluginCheckbox.pdfjs",

  BOUNDARY0:"0",

  // [public]
  // This object assists in creating a custom version of the script for the user.
  script:{

    select:{pluginCheckbox:{pdfjs:"PDFjs", verifypdfjs:"VerifyPDFjs"}},

    fileNameSuffix:{pluginCheckbox:{pdfjs:"PDFjs", verifypdfjs:""}},

    checkboxLabel:{pluginCheckbox:{pdfjs:{
      text:"PDF.js (Firefox PDF Reader)&nbsp;&nbsp;&nbsp;" + 
           "(<a href='../files/empty.pdf'>Download the DummyPDF document used by this detector</a>. " +
           "Just right click and Save As)",
      verifypdfjs:{
        text:"Verify DummyPDF [path/]name.<br>" +
           "This will help verify that you are specifying the correct [path/]name for " + 
           "DummyPDF in your PDF.js detection code.<br>" +
           "The results of this verification will be shown at the top of your " + 
           "web page when PDF.js detection is performed. " + 
           "This feature is for testing/debugging purposes only.<br>"
      }
    }}},

    errCheck:{pluginCheckbox:{
      pdfjs:function(code, select){
        if (!select.miscCheckbox.allowactivex &&
             (/\.axo|\.codebase|\.AXO|\.getAXO|\.ActiveX|ActiveXObject/).test(code.customModuleScript)
           )
              alert("Error: ActiveX code found in " + code.moduleName + " module");
      },
      verifypdfjs:0
    }},

    // [public]
    // include:function(select){} tells us which other modules to include when using this module.
    //
    // Do not put $.message/BOUNDARY in the array[] here because they are automatically
    // included/removed from the script as needed.
    //
    // Any items in the outermost array must ALL be included (AND).
    // At least one item in an inner array must be included (OR).
    //
    // For this particular plugin, $.getVersion() will always return null.
    // Hence we only require $.isMinVersion() to be included in the script.
    // We do not require $.getVersion() since it will only return null.
    include:{pluginCheckbox:{
        pdfjs: function(){
           return [$.ev, $.win, $.DOM, $.file,
           
                       // We can perform NOTF detection using $.onDetectionDone().
                       $.onDetectionDone, $.isMinVersion, $.hasMimeType]
        },
        verifypdfjs: function(){
           return [$.verify]
        }
    }}
  }, // end of script{}

  BOUNDARY1:"select.pluginCheckbox.pdfjs",



OTF: null,   // if 0,1,2 then detection was performed OTF
             // if 3 then detection is being performed NOTF but is not yet completed
             // if 4 then NOTF detection has been completed.
             // when OTF==3 it means that pdfjs.installed==-0.5 or +0.5

// This routine sets the value of all the output variables for the $.Plugins.pdfjs object.
//
// We call this routine right before returning from pdfjs.getVersion() and
// before returning from pdfjs.NOTF.queryCompleted().
//
// ** Please make sure that pdfjs.OTF is up to date when running this routine.
// Make sure pdfjs.doc.result is up to date.
setPluginStatus: function(){

   var pdfjs=this,

      result_doc = pdfjs.doc.result,   // >0 pdf detected, <0 pdf not detected, ==0 not yet

      OTF = pdfjs.OTF;
     
     $.message.write("[ ]", $.message.end());
     $.message.write("[ START set plugin status ]", $.message.end());

     // We do not detect pdfjs version
     pdfjs.version = null;


     // if NOTF Detection is being performed
     if (OTF == 3){ pdfjs.installed = -0.5; }


     // else OTF Detection has been completed or NOTF Detection has been completed.
     else
     {
              //  pdfjs.installed = 0       pdfjs installed & enabled
              //  pdfjs.installed = -1      not installed/not enabled in the browser.
              //
              pdfjs.installed = result_doc>0 ? 0 : -1;

     }
     
     
     // If we are verifying all the DummyPDF [path/]names, then we force getVersionDone
     // to remain at 0. This way plugin.getVersion() will continue to be called,
     // and we can examine all the instances of the DummyPDF input arg to PluginDetect.
     if (pdfjs.verify && pdfjs.verify.isEnabled()){
           pdfjs.getVersionDone = 0;
     }

     // When getVersionDone == 1, then it should stay that way.
     else if (pdfjs.getVersionDone != 1)
     {

        // If PDF.js was not detected (yet)
        // and doc{} is not permanently disabled (yet)
        // then getVersionDone=0.
        //
        // This occurs when pdfjs.installed == -0.5
        // or when pdfjs.installed == -1 and pdfjs.doc.isDisabled()<2
        //
        pdfjs.getVersionDone =
         (pdfjs.installed == -0.5 || (pdfjs.installed == -1 && pdfjs.doc.isDisabled()<2)) ? 0 : 1;



     }


     $.message.write("[ pdfjs.version: " + pdfjs.version + " ]", $.message.end());
     $.message.write("[ pdfjs.installed: " + pdfjs.installed + " ]", $.message.end());
     $.message.write("[ pdfjs.getVersionDone: " + pdfjs.getVersionDone + " ]", $.message.end());
     $.message.write("[ pdfjs.doc.result: " + pdfjs.doc.result + " ]", $.message.end());
     $.message.write("[ END set plugin status ]", $.message.end());


},  // end of setPluginStatus()

// [public]
getVersion: function(_minVersion, DummyPDF){

    var pdfjs = this,

        // detected is false when plugin has not been detected (yet)
        // detected is true when plugin has been detected
        detected=false,

        verify = pdfjs.verify,
        doc = pdfjs.doc;


    // This only runs once
    if (pdfjs.getVersionDone === null)
    {
        pdfjs.OTF = 0;   // Detection has begun

        if (verify) verify.init();  // begin verification of jarfile path/name

    }


    // We keep track of each valid DummyPDF input
    $.file.save(pdfjs, ".pdf", DummyPDF);


    // If pdfjs.getVersionDone === 0 then pdfjs.getVersion() was previously run.
    // It also means that we are permitted to run pdfjs.getVersion() again.
    //
    // Note: this statement comes AFTER the "$.file.save()" statement,
    // so that we can keep track of all input DummyPDF strings during DummyPDF verification.
    if (pdfjs.getVersionDone === 0)
    {

          // During verification of DummyPDF, if PDF Reader has already been detected,
          // then there is no need to try to detect all over again.
          // Otherwise, that might just mess up the value of pdfjs.installed...
          // pdfjs.installed could switch from 0 to -0.5, which we would like to prevent
          // during verification.
          if (verify && verify.isEnabled() && 
              $.isNum(pdfjs.installed) && pdfjs.installed>=0) return;


    }


    // Detection Attempt.
    //
    if ((!detected || $.dbug) && doc.insertHTMLQuery()>0) detected = true;


    pdfjs.setPluginStatus();


}, // end of getVersion()



doc:{     // ***** start of doc object *****
          // PDF <object> tags is inserted into DOM and instantiated,
          // and then we try to detect.

   // [public]
   // result>0 - pdfjs was detected.
   // result<0 - pdfjs was NOT detected (at least, not using this method).
   // result==0 - no result yet. Need to wait. Query again later.
   result:0,


   mimeType: "application/pdf",

   // Dummy mimetype that does not exist.
   // To be as reliable and simple as possible, the mimetype has no capital letters
   // and no numbers, just like "application/pdf".
   mimeType_dummy: "application/dummymimepdf",


   // HTML object for dummy span tag
   // <span>altHTML</span>
   // Should be instantiated BEFORE doc.HTML.
   DummySpanTagHTML: 0,

   // HTML object for empty pdf document
   // An HTML object allows us to access a DOM object, its span container, etc...
   HTML: 0,


   // HTML object for dummy <object> tag1
   // <span><object type="dummyMimeType">altHTML</object></span>
   // Should be instantiated AFTER doc.HTML.
   DummyObjTagHTML1: 0,


   // [public]
   // We filter out certain browsers, because they may have bugs/undesirable behavior,
   // or do not work with the plugin
   //
   // Return 0 if doc{} is enabled at the moment
   // Return 1 if doc{} is disabled at the moment, but it may become enabled in the future
   // Return 2 if doc{} is disabled permanently.
   isDisabled: function()
   {
      var doc=this, pdfjs=PDFJS, disabled=0, browser=$.browser, DummyPDF;

      // Note: we disable specifically for IE. Otherwise, in debug mode our code
      // would say that PDFjs is installed when some PDF Reader (Adobe Reader, etc...)
      // is installed and able to use <object> tags without showing any mimetype in
      // the mimetypes array.
      //
      // Note: In debug mode, all non-IE browsers are allowed to run the PDF.js detection
      // code.

      // If pdfjs.OTF>=2, then we have already inserted the DummyPDF
      // into the web page. Then we are done.
      // doc{} is permanently disabled.
      // This insures that insertHTMLQuery() only runs once.
      if (pdfjs.OTF>=2 ||

        // If <object> tag is disabled, then it is not safe to use.
        // The doc{} object uses the <object> tag for detection.
        !$.DOM.isEnabled.objectTag() ||
        
        // We filter out ActiveX based browsers
        $.DOM.isEnabled.objectTagUsingActiveX()
      
      ){disabled=2;}


      // Debug mode overrides any browser specific issues ( shown below).
      // In debug mode, all non-IE browsers will be allowed to run
      // the PDF.js detection code (even though it is only normally allowed for Gecko).
      else if ($.dbug){}


      else if (

        // **** PDF.js is only being detected on Gecko browsers. It is possible to run
        // PDFjs on other browsers, but we are only interested in Gecko because Gecko has
        // PDFjs built in. We want to see when this native pdf reader is active or not.
        //
        // Note: it only appears natively on Gecko Firefox. Other Gecko based browsers
        // do not appear to have PDF.js built in.
        // For example, SeaMonkey (based on Gecko 24/Firefox 24) does not have PDF.js built in.
        !browser.isGecko ||
        
        
        // For very old versions of Gecko, the browser shows a popup bar (plugin finder service)
        // when trying to insert a pdf <object> tag into the web page and 
        // no pdf plugin (ie. no mimetype) is installed.
        //
        // This probably holds for Windows/Mac/Linux/FreeBSD.
        // Since we want to avoid the popup bar, we can filter out old Gecko versions.
        // Higher versions by default do not show the popup bar unless the user changes the
        // browser settings.
        //
        // Very old Gecko versions do not support the PDF.js addon.
        $.compareNums(browser.verGecko, $.formatNum("10"))<0 ||

        
        // PDF.js comes built in to Firefox 19+.
        // However, it is possible that FF < 19 may have PDF.js as an installable add-on.
        // Newer versions of PDF.js will not install into older versions of Firefox, which
        // is a good thing for us.
        //
        // For FF < 19, I believe that when a normal PDF Reader (Adobe/Foxit) is
        // installed and enabled, then it will be the default PDF Reader,
        // even if the PDFjs addon is present and enabled. A normal PDF reader
        // that you install will have application/pdf mimetype in the navigator.mimeTypes[]
        // array.
        //
        // For FF < 19, when no normal PDF Reader (Adobe/Foxit/etc...) is present,
        // then the PDFjs addon will be the default reader.
        //
        //
        // For Gecko < 19, if a mimetype is present, then some installable PDF Reader (Adobe/Foxit)
        // is present, and it is most likely the default PDF Reader. Hence PDF.js detection
        // would be disabled in this case.
        //
        // For Gecko < 19, if NO mimetype is present 
        // (ie. no normal PDF Reader (Adobe/Foxit/etc...) is present), then we try to detect PDF.js.
        // So detection is enabled in this case.
        ($.compareNums(browser.verGecko, $.formatNum("19"))<0 && $.hasMimeType(doc.mimeType))


       ){
            disabled=2;   // DummyPDF not allowed to be used.
                          // doc{} is permanently disabled.
        }


       if (disabled < 2)
       {
          DummyPDF = $.file.getValid(pdfjs);
          if (!DummyPDF || !DummyPDF.full) disabled=1; // doc{} is disabled for now.
                                                       // But if DummyPDF exists in the future,
                                                       // then doc{} will be enabled.
       }

       return disabled;


   },   // end of isDisabled()



   tabIndex: null,


   // We keep track of any detection methods that are used to detect the plugin.
   // Strings only.
   method:"",


   // [public]
   // Query to see if PDF.js is installed and enabled.
   // If result>0, then pdfjs was detected.
   //    Detection is done.
   // If result<0, then pdfjs was NOT detected (at least, not using this method).
   //    Detection is done.
   // If result==0, then we do not know yet. Need to wait. Query again later.
   //
   //
   // This routine determines if PDF.js is installed & the default reader.
   // There may be more than one way to detect PDF.js:
   //
   // 1) <object onload="alert('PDF.js installed')">
   //  It appears that the onload event handler works for PDF.js in Firefox,
   //  but not for any other PDF Reader.
   //  We can also use <object>.onload = function(){};
   //  This does not appear to work for the <embed> tag.
   //  (Update: this detection method turns out to be unreliable. Do not use.)
   //
   // 2) Look at <object>.contentDocument. This appears to be an object only for
   //  PDF.js. For other PDF Readers, it appears to be null or undefined.
   //  (Update: this detection method turns out to be unreliable..
   //   The contentDocument property is only an object{} for a short instant, and 
   //   then can be null again. So this detection method is timing sensitive.
   //   Under some circumtances, therefore, this method can fail.)
   //  This does not appear to work for the <embed> tag.
   //
   // 3) If there is no application/pdf mimetype in the navigator.mimeTypes array,
   // yet the <object type="application/pdf" data="empty.pdf" width="1"> still
   // has a width of one, then PDF.js is present.
   //   a) The problem here is this only works if no other PDF Reader is present, since
   // other installable PDF Readers will cause the mimetype to be present in the
   // mimetypes array. 
   //   b) Also, someday PDF.js may have a mimetype in the mimetypes array.
   //
   // 4) The other way to possibly detect PDF.js is to insert 2 <object> tags.
   // Tag 1 has type="application/pdf", data="empty.pdf"
   // Tag 2 only has type="application/pdf".
   // Because PDF.js has no mimetype associated with it in the mimetypes array,
   // Tag 2 will only show altHTML.
   // We avoid this technique, however, because it is probably not safe to instantiate
   // an <object> tag with type="application/pdf" but without data="empty.pdf",
   // since there are many different PDF readers, and some of them could conceivably
   // cause a browser crash under that circumstance.
   //
   // 5) We can look at the tabIndex property of the <object> tag.
   // So far, this seems to work ok for Firefox.
   //
   queryObject: function(NOTFcount)
   {
      var doc=this,

        obj = doc.HTML ? doc.HTML.obj() : 0,
        
        tagStatus, objTabIndex,

        // In debug mode, we wait until after <iframe> has loaded to save the detection results
        saveResult = $.dbug && (doc.HTML && !doc.HTML.loaded) ? 0 : 1;

      $.message.write($.message.time(doc.queryObject,1), $.message.end());   // Start measuring time delay
      $.message.write("[ ]", $.message.end());
      $.message.write("[ START query PDF object to find PDF.js ]", $.message.end());
      
      $.message.write($.isNum(NOTFcount) ? "[ NOTF interval count: " + NOTFcount + " ]" : 0, $.message.end());



      // If plugin not detected yet, then look at <object> tag status.
      //
      // Note: in debug mode, we check the tag status, regardless of whether
      // we have detected the plugin or not.
      //
      // If tagStatus > 0, then we have a result
      // If tagStatus < -0.1, then we have a result
      // If tagStatus is 0 or -0.1, then we must wait and then query again later.
      //
      // Note: when tagStatus>0 or <-0.1 then <iframe> has loaded.
      tagStatus = $.DOM.getTagStatus(doc.HTML, doc.DummySpanTagHTML,
             doc.DummyObjTagHTML1, 0);



             
      /*

         Note, for our plugin detection we do NOT use:
            if (){}        // detection method # 1
            else if (){}   // detection method # 2
            else if (){}   // detection method # 3

         because want ALL of the detection methods to run during debug mode.

         Hence we use this instead:
            if (!result || dbug){ result=... }   // detection method # 1
            if (!result || dbug){ result=... }   // detection method # 2
            if (!result || dbug){ result=... }   // detection method # 3

         We also make sure that detection method # 1 is the most reliable method, 
         and then we go down in reliability. The last detection method will be the
         least reliable.

      */



      // Attempt # 1 to detect PDFJS
      // This is the most reliable detection method for the plugin, and so it goes first.
      //
      // If tag displays altHTML, then no PDF Reader is present.
      // This detection attempt is reliable.
      if ((!doc.result || $.dbug) && tagStatus<-0.1)
      {
         if (saveResult) doc.result=-1;
         doc.method += "1,";
         $.message.write("[ Detection method # 1 has determined that the plugin is not installed/not active ]", $.message.end());
      }


      // Attempt # 2 to detect PDFJS.
      // This is the second most reliable detection method, and so it goes second.
      //
      // If tag is displaying a PDF, but there is no mimetype,
      // then PDF.js is active.
      // Note: For the time being, PDF.js does not have any mimetype in the
      // navigator.mimeTypes[] array. So if an HTML tag is displaying a PDF document,
      // and there is no mimetype in the mimetypes array, then we assume that
      // PDF.js is active.
      if ((!doc.result || $.dbug) && tagStatus>0 && !$.hasMimeType(doc.mimeType))
      {
         if (saveResult) doc.result=1;
         doc.method += "2,";
         $.message.write("[ Detection method # 2 has determined that the plugin is installed & active ]", $.message.end());
      }


/*
      // Attempt # 3 to detect PDFJS
      //
      if ((!doc.result || $.dbug) && tagStatus>0)
      {
         tmp=0;
         try
         {
           if (doc.HTML && doc.HTML.span())
           {
             for (x in doc.HTML.span())
             {
               tmp++;

               // If the plugin gives an error here for the <object>/<embed> tag,
               // then it is not installed.
               // This error appears to only occur for Adobe Reader.
               // Apparently, we cannot enumerate the properties of the <object>/<embed>
               // tag for Adobe Reader.
               if (obj)
               {
                  for (x in obj){break}
               }

               break;

             }

           }

         }
         catch(e){tmp++;}
         if (tmp==2)
         {
            if (saveResult) doc.result=-1;
            doc.method += "3,";
            $.message.write("[ Detection method # 3 has determined that the plugin is not installed/not active ]", $.message.end());

         }
      }
*/

      // Attempt # 4 to detect PDFJS.
      // This is the least reliable detection method for the plugin, and so it goes last.
      //
      // This detection attempt is probably brittle.
      // If Firefox or PDFJS change in certain ways, this detection method
      // may no longer work.
      //
      // If the tabIndex for the <object> tag has changed, then that means
      // that PDF.js is installed and is running.
      //
      // Note: For lower Gecko versions that have no built in PDFJS, the tabIndex may
      // change for Adobe Reader plugin. Hence, we filter out those Gecko versions 
      // via doc.isDisabled().
      //
      // Note: if we set the tabIndex on the HTML tag during instantiation, then
      // the tabIndex will not change, and hence this detection method would no longer work.
      //
      // Note: if a mimeTypeObj is found, then another installed PDF Reader is present,
      // so in that case we look at tabIndex.
      //
      // Save obj.tabIndex into doc.tabIndex
      try{objTabIndex = obj ? obj.tabIndex : null;}
      catch(e){}
      if (!$.isNum(doc.tabIndex) && $.isNum(objTabIndex)) doc.tabIndex = objTabIndex;

      if ((!doc.result || $.dbug) && tagStatus>0)
      {
         if ($.isNum(objTabIndex) && $.isNum(doc.tabIndex) && doc.tabIndex !== objTabIndex)
         {
            if (saveResult) doc.result=1;
            doc.method += "4,";
            $.message.write("[ Detection method # 4 has determined that the plugin is installed & active ]", $.message.end());

         }
         
         // Attempt # 5 to detect PDFJS.
         // If <iframe> has loaded, and no other detection methods found anything,
         // then after N counts, we say plugin not installed.
         // Note: when tagStatus>0 or <-0.1 then <iframe> has loaded.
         else{
            if (saveResult) doc.result=-1;
            doc.method += "5,";
            $.message.write("[ Detection method # 5 has determined that the plugin is not installed / not enabled ]", $.message.end());
         }

      }




      $.message.write(obj ?
             ("[ <" + obj.tagName + " type=\"" + doc.mimeType + "\">.tabIndex: " + obj.tabIndex + " ]") : 0, $.message.end());

      $.message.write(doc.DummyObjTagHTML1 && doc.DummyObjTagHTML1.obj() ?
             ("[ <" + doc.DummyObjTagHTML1.obj().tagName + 
              " type=\"" + doc.mimeType_dummy + "\">.tabIndex: " + 
              doc.DummyObjTagHTML1.obj().tabIndex + " ]") : 0, $.message.end());

      $.message.write(doc.HTML.span() ?
             ("[ <span>.tabIndex: " + doc.HTML.span().tabIndex + " ]") : 0, $.message.end());


      $.message.write(obj ?
             ("[ <" + obj.tagName + " type=\"" + doc.mimeType + "\">.version: " + obj.version + " ]") : 0, $.message.end());

      $.message.write(obj && obj.contentDocument ?
             ("[ <" + obj.tagName + " type=\"" + doc.mimeType + "\">.contentDocument: object{ } ]") : 0, $.message.end());

      $.message.write(obj && obj.contentDocument===0 ?
             ("[ <" + obj.tagName + " type=\"" + doc.mimeType + "\">.contentDocument: 0 ]") : 0, $.message.end());

      $.message.write(obj && obj.contentDocument===null ?
             ("[ <" + obj.tagName + " type=\"" + doc.mimeType + "\">.contentDocument: null ]") : 0, $.message.end());

      $.message.write(obj && typeof obj.contentDocument==='undefined' ?
             ("[ <" + obj.tagName + " type=\"" + doc.mimeType + "\">.contentDocument: undefined ]") : 0, $.message.end());




      $.message.write(doc.result > 0 ? "[ PDF.js was detected. It is the default PDF viewer for this browser ]" : 0, $.message.end());
      $.message.write(doc.result ===0 ? "[ No detection result yet ]" : 0, $.message.end());
      $.message.write(doc.result <0 ? "[ PDF.js not installed/not enabled ]" : 0, $.message.end());

      $.message.write("[ END query PDF object to find PDF.js, in " + 
         $.message.time(doc.queryObject) + " ]", $.message.end());


      return doc.result;


},  // end of queryObject()



// [public]
// [This is the only public method for the doc{} object]
//
// Insert PDF <object> tags into DOM and see is PDF displays or not.
// We do not wait for window.onload before checking. We just check immediately.
// If there is no result, then we check the pdf document every 250ms or so until we get a result
// or up until window.onload.
//
// return >0 if PDF.js appears to be present
// return <0 if browser cannot use PDF.js to display a PDF document
// return 0 if unknown, no result yet.
//
// Note: There is no guarantee that all PDF Readers are able to display a PDF document via
// an <object> tag.
//
//
// **** WARNING: due to reliability concerns, we should perhaps try to avoid
// displaying a PDF via an <object> tag whenever possible.
// Most PDF Readers seem to be
// better suited to displaying PDF's outside the browser, or in the browser
// window/frame (without using <object>/<embed> tags.)
// <object> tags do not appear to be a very popular way of displaying
// PDFs, and this is why I believe that PDF Reader authors may not put
// a high priority on making PDF Readers work well with <object> tags.
// For this reason, using <object> tags for detection is the very LAST thing we do.
//
// NOTE: We use visibiliy:hidden for the <object> tags.
// This could potentially speed up instantiation.
// PDF Readers were never really intended to display
// PDFs in such a small <object> tag as used by PluginDetect, especially
// when the Reader may add toolbars/scrollbars/etc.., hence we
// use visibility:hidden.
//
insertHTMLQuery: function(){

  var doc=this, pdfjs=PDFJS,

    DummyPDF, iframe,

    // if ==1 give <tag> a style of visibility:hidden
    // if ==0/undefined give <tag> a style of visibility:visible
    //
    // We set hidden==1 because PDF Readers are not really
    // designed to handle being displayed in a 1x1 object.
    // We do not need to query the instantiated plugin anyway, we only
    // look at HTML tag attributes. So tag does not need to be visible.
    // We would only leave it visible if we had to query an unknown plugin.
    hidden=1,

    altHTML=$.DOM.altHTML;



   if (doc.isDisabled()) return doc.result;
   
   
   // From here the code only runs once


   if (pdfjs.OTF<2) pdfjs.OTF=2;   // indicates that this routine was called


   // Most recent valid input DummyPDF string specified by the user
   DummyPDF = $.file.getValid(pdfjs).full;


   // Create <iframe>.
   //
   // onload event handler for iframe will wait 99ms, and then execute.
   //
   // The delay helps to insure that the HTML tags reach their final state before
   // we look at the HTML tags. This is just an added safety measure.
   iframe = $.DOM.iframe.insert(99, "PDFjs");


   // This is an HTML object for an empty <span> tag with only altHTML.
   // <span>altHTML</span>
   // We instantiate BEFORE doc.HTML.
   doc.DummySpanTagHTML = $.DOM.insert("", [], [],
            altHTML, pdfjs, hidden, iframe);



   // Instantiate pdf using a normal <object> tag.
   // Both PDF.js and PDF Reader plugins in Gecko can handle this.
   doc.HTML = $.DOM.insert("object",

               ["type", doc.mimeType, "data", DummyPDF],

               ["src", DummyPDF],

               altHTML, pdfjs, hidden, iframe);



/*
   // Instantiate pdf using a normal <embed> tag.
   // Both PDF.js and PDF Reader plugins in Gecko can handle this.
   if (1)
   {
       doc.HTML = $.DOM.insert("embed",

               ["type", doc.mimeType, "src", DummyPDF],

               [],

               "", pdfjs, hidden, iframe);

   }
*/



   // This is a Dummy <object> tag with altHTML. It does not instantiate anything.
   //
   // Note: we insert Dummy <object> tag AFTER inserting the PDF object.
   // We do this because we wait for the Dummy <object> Tag to show its altHTML.
   // THEN we look at the status of the PDF plugin object.
   doc.DummyObjTagHTML1 = $.DOM.insert("object",

             // If the PDF Reader <object> tag has a mimetype, then the
             // Dummy <object> tag must have the same.
             // If the PDF Reader <object> tag has a classid, then the
             // Dummy <object> tag must have the same.
             ["type", doc.mimeType_dummy],

             [],

             altHTML, pdfjs, hidden, iframe);


   // No more tags to insert, so we close the <iframe>
   $.DOM.iframe.close(iframe);


   // We do not input NOTF.count yet.
   doc.queryObject();


   // If doc.result>0, then pdf reader detected (installed & enabled). Detection Done.
   // If doc.result==0, then no detection result yet, need to wait for more info.
   // If doc.result<0, then pdf reader not detected (using this detection method)
   //    or is installed but not enabled. Detection Done.
   //
   // In debug mode, we filter out OTF detection.
   // We only allow NOTF detection in debug mode.
   if (doc.result && !$.dbug) return doc.result;



   // If doc.result == 0 then we begin NOTF detection.
   pdfjs.NOTF.init();



   return doc.result;       // return 0, meaning we do not know anything yet


}  // end of insertHTMLQuery()



},   // ***** end of doc object *****


NOTF:{     // ***** NOTF object *****


count: 0,   // counts the number of times that NOTF.onIntervalQuery() is called.
            // onIntervalQuery() is called at regular intervals during NOTF detection.


intervalLength: 250,  // Length of time between attempts to query
                      // for NOTF detection. Interval is in milliseconds.


// [public]
// Begin NOTF detection
init: function(){

   var NOTF=this, pdfjs=PDFJS, doc=pdfjs.doc;
   
   if (pdfjs.OTF<3 && doc.HTML)
   {
      pdfjs.OTF = 3;     // Detection is now being performed NOTF
                         // Setting = 3 means that this section of code can
                         // only be executed ONCE.


      // Query pdf object at regular intervals.
      // Note: We use setTimeout instead of setInterval.
      $.ev.setTimeout(NOTF.onIntervalQuery, NOTF.intervalLength);

   
      $.message.write("[ ]", $.message.end());
      $.message.write("[ START NOTF PDFjs detection ]", $.message.end());

      $.message.write($.message.time(NOTF,1), $.message.end());  // Start measuring time delay for NOTF detection

   }


},  // end of init()


// ** EVENT HANDLER **
// queries pdf object status at regular intervals (determined by the SetTimeout()).
// This is for NOTF detection.
onIntervalQuery: function(){

     $.message.write("[ ]", $.message.end());
     $.message.write("[ START NOTF.onIntervalQuery( ) ]", $.message.end());
     
     var doc=PDFJS.doc, NOTF=PDFJS.NOTF;
     
     NOTF.count++;  // Set this BEFORE any other code runs.

     // PDFJS.OTF == 3 means that PDFJS.installed == -0.5 or +0.5
     // If we are in NOTF mode and pdf object has not given any result yet...
     if (PDFJS.OTF == 3)
     {
         doc.queryObject(NOTF.count);

         // If (doc.result!==0) then pdf object detection has been completed.
         // doc.result can be <0, >0, ===0.
         // Then save the results, clear the interval, and run the functions in the array.
         if (doc.result) NOTF.queryCompleted();

     }

     // If detection not done yet, then we run this routine again after a delay
     if (PDFJS.OTF == 3) $.ev.setTimeout(NOTF.onIntervalQuery, NOTF.intervalLength);

     $.message.write("[ END NOTF.onIntervalQuery( ) ]", $.message.end());

},   // end of onIntervalQuery()



// The pdf object querying has been completed, so we now:
//   set this.installed
//   clear the interval
//   execute the functions in the $.Plugins.pdfjs.DoneHndlrs[] array
//
// This method is only called by onIntervalQuery()
//  hence it is only called when pdfjs.OTF == 3.
//
// if doc.result > 0, then PDF Reader was detected
// if doc.result < 0, then PDF Reader was not detected
// if doc.result == 0 unknown. Perhaps detection did not have enough time to complete.
//   PDF Reader was not detected.
queryCompleted: function(){

     var NOTF=this, pdfjs=PDFJS;

     // queryCompleted() should only be called once.
     // We use this next line of code to guarantee that it only
     // runs ONCE.
     // Note: this routine can be called by onIntervalQuery.
     if (pdfjs.OTF == 4) return;
     pdfjs.OTF = 4;    // NOTF Detection has now been completed


     pdfjs.setPluginStatus();
     
     
     $.message.write("[ END NOTF PDFjs detection in " + $.message.time(NOTF) + " ]", $.message.end());
     $.message.write("[ " + $.message.time($) + " after script initialization ]", $.message.end());



     // It is possible to start NOTF detection...
     //
     // 1) by using getVersion() or isMinVersion()
     // 2) or by using onDetectionDone()
     //
     // To see if onDetectionDone() was used to call this routine, we check for the presence of
     // onDetectionDone() && DoneHndlrs[] array.
     $.message.write($.onDetectionDone && pdfjs.DoneHndlrs ? "[ END " + pdfjs.pluginName + 
          " detection for " + $.name + ".onDetectionDone(" + $.message.args2String(pdfjs.pluginName) + ") in " +
          $.message.time(pdfjs.DoneHndlrs) + " ]" : 0,
          $.message.end());

     $.message.write($.onDetectionDone && pdfjs.DoneHndlrs ? "[ START event handlers for " +
          $.name + ".onDetectionDone(" + $.message.args2String(pdfjs.pluginName) + ") ]" : 0,
          $.message.end());


     // Execute the event handlers f specified by the $.onDetectionDone("pluginName", f) method.
     //
     // Note: we execute callArray() even when DoneHndlrs[] is empty or does not exist.
     // The reason is that callArray() will automatically check if ALL event handlers
     // are done, and then runs some final cleanup handlers (since we just completed detection for
     // this one plugin).
     $.ev.callArray(pdfjs.DoneHndlrs);


     $.message.write($.onDetectionDone && pdfjs.DoneHndlrs ? "[ END event handlers for " + 
          $.name + ".onDetectionDone(" + $.message.args2String(pdfjs.pluginName) + ") ]" : 0,
          $.message.end());


}   // end of queryCompleted()



},    // ***** end of NOTF object *****


BOUNDARY34:"select.pluginCheckbox.pdfjs && select.pluginCheckbox.verifypdfjs",


// ******* verify pdf ********
// Verify that your DummyPDF name & path are correct.

// [public]
verify:{

BOUNDARY0:"0",   // We always delete this item, so then the verify{} object
                 // is automatically enabled when it is included in the script.

// [private]
// == 1 to disable the verify routine. Verify routine will not run.
// == 0/null/""/undefined to enable verify routine. Verify routine will run.
isDisabled:1,


BOUNDARY34:"select.pluginCheckbox.pdfjs && select.pluginCheckbox.verifypdfjs",

// [private]
// output <div> that holds verify messages
div: null,


// [** PUBLIC **]   $.Plugins.pdfjs.verify.enable()
// Enable the verify{} object for writing.
enable: function(){
   this.isDisabled = 0;
},

// [** PUBLIC **]   $.Plugins.pdfjs.verify.disable()
// Disable the verify{} object from writing.
disable: function(){
   this.isDisabled = 1;
},

// [public]
isEnabled: function(){
   return !this.isDisabled;
},

// [private]
// Insert text node into verify.div
//
// text = text content
//
// S = [style property, style value,...]
// or S = "bold", "verified", "error", "warning"
//
// br = false (boolean) will prevent line feed
addText: function(text, S, br){
     var verify=this;
     $.verify.addText(verify.div, text, S, br);
},

// [public]
// Run init() only once.
// When this routine runs, it means that pdf detection has been initiated by the user.
init: function(){

  var verify = this;

  // if disabled, return
  // if this routine already ran, return
  if (!verify.isEnabled() || verify.div) return;

  verify.div = $.verify.init(verify, "PDFjs", "DummyPDF", "empty.pdf", ".pdf");

  // We wait for all the user specified plugin detections to be fully completed.
  // This allows us to accumulate all possible references to the input DummyPDF.
  // Then we execute verify.onReady().
  $.ev.fPush([verify.onReady, verify], $.ev.allDoneHndlrs);
  
  $.ev.fPush([verify.onUnload, verify], $.win.unloadHndlrs);

}, // end of init()


// [private]
// ** EVENT HANDLER **
onUnload: function($, verify){

   verify.disable();
  
   $.DOM.emptyNode(verify.div);
   $.DOM.removeNode(verify.div);

   verify.div = null;

}, // end of onUnload()


// [private]
// ** EVENT HANDLER **
// This is an event handler, hence we have $, verify as inputs.
// Verify the plugin when ready.
onReady: function($, verify){

  var pdfjs = PDFJS, topWinDoc = window.top.document;

  if (!$.verify.checkfile1(verify.div, pdfjs, "PDFjs", "DummyPDF", ".pdf")) return; // Error

  // Insert iframe to verify the PDF path/filename.
  // There is a question as to whether we insert an <iframe> or an <object> tag for this
  // verification test. The <object> tag, for non-IE browsers, should not give any popups.
  // However, the <iframe> will perhaps be more reliable in showing a PDF, even though
  // an <iframe> may give you a popup when no PDF reader is installed/enabled.
  var iframe, DummyPDF = $.file.getValid(pdfjs);
  if (DummyPDF) DummyPDF = DummyPDF.full;

  verify.addText();
  verify.addText("The box shown below should display the " + $.name + " DummyPDF document.");
  verify.addText("If it does, then the [path/]filename for DummyPDF in your detection code is correct.");
  verify.addText("[Or, if a standalone PDF viewer pops up and displays the DummyPDF document, " +
    "then the [path/]filename for DummyPDF is correct.]");
  verify.addText();
  iframe = topWinDoc.createElement("iframe");
  iframe.width = "98%";
  iframe.height = "300";
  iframe.src = DummyPDF;
  $.DOM.setStyle(iframe,
     [ "border","solid black 1px",
       "padding","1px"
     ]
  );
  verify.div.appendChild(iframe);

  verify.addText();
  verify.addText();
  verify.addText();

  verify.addText("DONE", "verified");
  verify.addText();

} // end of onReady()

},   // end of verify object



BOUNDARY35:"select.pluginCheckbox.pdfjs",

// Property is automatically removed by Script Generator
lastProperty:"select.pluginCheckbox.pdfjs"

};  // end of pdfjs{} object


$.addPlugin("pdfjs", PDFJS);


// ****************************** End of PDF.js detection ******************************

BOUNDARY("1");

})(); // end of wrapper function



