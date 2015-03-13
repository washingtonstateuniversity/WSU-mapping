
var scriptTag =  document.getElementById('WSUMAPS');//document.currentScript;//document.scripts[document.scripts.length - 1];

var parentTag = scriptTag.parentElement;
alert(parentTag.id);



var wrapper = document.createElement('div');
wrapper.id = "mapping";

var parent = scriptTag.parentNode;
parent.insertBefore(wrapper, scriptTag.nextSibling);

var container = document.createElement('div');
container.innerHTML = '<span style="color:red;">Hello</span>';  
wrapper.appendChild(container);
