// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Search the bookmarks when entering the search keyword.

// Traverse the bookmark tree, and print the folder and nodes.
function dumpBookmarks() {
  var bookmarkTreeNodes = chrome.bookmarks.getTree(
    function(bookmarkTreeNodes) {
		$('#bookmarks').append(dumpTreeNodes(bookmarkTreeNodes));
    });
}
function dumpTreeNodes(bookmarkNodes) {
  var list = $('<ul>');
  var i;
  var j ;
  
  
  var bbrId = "1" ; 
 for (i = 0; i < bookmarkNodes.length; i++) {
   list.append(dumpNode(bookmarkNodes[i],  bbrId));
 }
	return list;
}
function dumpNode(bookmarkNode, rootId) {
  if (bookmarkNode.title) { //Make sure that
	
	if (!bookmarkNode.children) {
        return $('<span></span>');
    }
	
	if (bookmarkNode.title == "Bookmarks bar") {
        return $('<span></span>');
    }
	
    var anchor = $('<a>');
    //anchor.attr('href', bookmarkNode.url);
    anchor.text( bookmarkNode.title  );
    /*
     * When clicking on a bookmark in the extension, a new tab is fired with
     * the bookmark url.
     */
    anchor.click(function() {
      //chrome.tabs.create({url: bookmarkNode.url});
	  // Clean everything in bookmarks bar
	  chrome.bookmarks.getChildren(rootId, function(childNodes){
		for (i = 0; i < childNodes.length; i++) {
			chrome.bookmarks.remove(childNodes[i].id ) ;
		}
	  });
	  
	  // Add new bookmarks
	  chrome.bookmarks.getChildren(bookmarkNode.id, function(childNodes){
		for (i = 0; i < childNodes.length; i++) {
			chrome.bookmarks.create({
				'parentId': rootId,
				'title': childNodes[i].title,
				'url': childNodes[i].url
			} ) ;
		}
	  });
    });
    var span = $('<span>');
    // Show add and edit links when hover over.
    span.append(anchor);
  }
  var li = $(bookmarkNode.title ? '<li>' : '<div>').append(span);
  if (bookmarkNode.children && bookmarkNode.children.length > 0) {
    li.append(dumpTreeNodes(bookmarkNode.children, rootId));
  }
  return li;
}

document.addEventListener('DOMContentLoaded', function () {
  dumpBookmarks();
});
