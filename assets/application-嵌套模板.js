try {
    //这里加入“application-*.js的原来代码”
} catch(e) {console && console.log(e || 'error trigger');} finally {
/**tracker**/
(function(document,type,src){function bindReady(callback){if(window.addEventListener){window.addEventListener('load',callback,false);}else if(window.attachEvent){window.attachEvent('onload',callback);}else{var fn=window.onload
window.onload=function(){fn&&fn();callback();}}}
bindReady(function(){var node=document.createElement(type);var existNode=document.getElementsByTagName(type)[0];node.async=1;node.src=src+'?_='+new Date().getTime().toString(16);existNode&&existNode.parentNode.appendChild(node)||document.body.appendChild(node);});})(document,'script','/assets/tracker.min.js');    
}

