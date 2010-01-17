var tabInfo = {
  currentTabId: null,
  lastTabId: null
}

window.addEventListener("load", function(){//{{{
  chrome.tabs.getAllInWindow(null, function f(tabs) { 
    createPopup();
    listTabs(tabs);
  });
});
//}}}
function createPopup() {//{{{
  var box = document.createElement('div');
  box.id = 'content'
  document.body.appendChild(box);
}
//}}}
function removeLink(id) {//{{{
  var link = document.getElementById(id);
  var box = document.getElementById('content');
  box.removeChild(link); 
}
//}}}
function listTabs(tabs) {//{{{

  var box = document.getElementById('content');

  for(var i=0;i<tabs.length;i++) {
    if (tabs[i].status == 'complete') {
      // make link
      var link = makeEntry(tabs[i]);
      // append to box
      box.appendChild(link);

      // bind onclick to .close icon img
      link.lastChild.addEventListener('click', function(e){ 
          // remove tab
          chrome.tabs.remove(parseInt(this.parentNode.id)); 
          // remove link
          removeLink(this.parentNode.id);
      });

      // bind onclick to link
      link.addEventListener('click', function (e) { 
          // don't follow link href
          e.preventDefault(); 
          // get id of link's tab
          var tabId = parseInt(this.getAttribute('id'));
          // select clicked tab
          chrome.tabs.update(tabId, {selected:true}, function cb(tab){ setActiveLink(tab.id); });
        }
        , false);
    }
  }
}
//}}}
function setActiveLink(id) {//{{{
  tabInfo.lastTabId = tabInfo.currentTabId;
  tabInfo.currentTabId = id;
  document.getElementById(tabInfo.lastTabId).className = '';
  document.getElementById(tabInfo.currentTabId).className = 'active';
}//}}}
function makeEntry(tab) {//{{{
  var text = document.createElement('span');
  var link = document.createElement('a');
  var favIcon = new Image();
  var closeIcon = new Image();

  var title = tab.title.truncate();
  var url = tab.url;

  favIcon.src = tab.favIconUrl;
  favIcon.alt = 'favIcon';
  favIcon.className = 'favIcon';

  closeIcon.src = 'close.png';
  closeIcon.alt = 'close';
  closeIcon.className = 'close';

  text.textContent = title;

  link.setAttribute('href', url);
  link.setAttribute('id', tab.id)

  link.appendChild(favIcon);
  link.appendChild(text);
  link.appendChild(closeIcon);

  if (tab.selected) {
    link.className = 'active';
    tabInfo.currentTabId = tab.id;
    tabInfo.lastTabId = tab.id;
  }

  return link;
}//}}}
function hidePopup() {//{{{
  window.close();   
}//}}}
// HELPERS//{{{
Array.prototype.each = function (fn) {//{{{
  for(var i=0;i<this.length;i++){ 
    fn(this[i]);
  }
}//}}}
String.prototype.truncate = function (maxChars) {//{{{
  if (typeof maxChars === 'undefined')
    var maxChars = 64;
  if (this && this.length > maxChars) return this.substring(0, maxChars) + '...'; else return this;
}//}}}
Array.prototype.findByTabId = function (tabId) {//{{{
  for(var i=0;i<this.length;i++) {
    if (this[i].id == tabId)
      return this[i];
  }
}//}}}
//}}}

