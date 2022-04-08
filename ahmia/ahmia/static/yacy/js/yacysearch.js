function Progressbar(length, parent) {
  // the number of steps of the bar
  this.length = length;
  // the current position, expressed in steps (so 100% = length)
  this.position = 0;
  // the current percentage of the bar
  this.percentage = 0


  // use this function to display the progress, because it updates everything
  this.step = function(count) {
    if (this.position < this.length)
      this.position += count;

    // update the bar
    this.percentage = this.position*(100/this.length);
    this.fill.style.width = this.percentage + "%";

    // if the end is reached, the bar is hidden/removed
    if(this.position >= this.length) {
      this.fill.style.visibility = "hidden";
    }
  }

  // the actual progressbar
  var bar = document.createElement("div");
  bar.id = "resProgBar";
  bar.className ="ProgressBar";

  // the actual bar
  this.fill = document.createElement("div");
  this.fill.id = "resProgFill";
  this.fill.className = "ProgressBarFill";
  this.fill.style.width = "0%"
  bar.appendChild(this.fill);

  // the container for the elements used by the Progressbar
  this.element = document.createElement("div");
  this.element.style.textAlign = "center";
  // get hasLayout in IE, needed because of the percentage as width of the bar
  this.element.className = "gainlayout";

  // results counter inside progress bar
  var resCounter = document.getElementById("resCounter");
  resCounter.style.display = "inline";
  bar.appendChild(resCounter);

  // the result sites navigation
  var resNav = document.getElementById("resNav");
  resNav.style.display = "inline";
  bar.appendChild(resNav);
  this.element.appendChild(bar);
  parent.appendChild(this.element);
}

function addHover() {
  if (document.all&&document.getElementById) {
    var divs = document.getElementsByTagName("div");
    for (i=0; i<divs.length; i++) {
      var node = divs[i];
      if (node.className=="searchresults") {
        node.onmouseover=function() {
          this.className+=" hover";
        }
        node.onmouseout=function() {
          this.className=this.className.replace(" hover", "");
        }
      }
    }
  }
}

function statistics(offset, itemscount, itemsperpage, totalcount, localResourceSize, remoteResourceSize, remoteIndexCount, remotePeerCount, navurlbase) {
  if (totalcount == 0) return;
  if (offset >= 0) document.getElementById("resultsOffset").firstChild.nodeValue = offset;
  if (itemscount >= 0) document.getElementById("itemscount").firstChild.nodeValue = itemscount;
  document.getElementById("totalcount").firstChild.nodeValue = totalcount;
  if (document.getElementById("localResourceSize") != null) document.getElementById("localResourceSize").firstChild.nodeValue = localResourceSize;
  if (document.getElementById("remoteResourceSize") != null) document.getElementById("remoteResourceSize").firstChild.nodeValue = remoteResourceSize;
  if (document.getElementById("remoteIndexCount") != null) document.getElementById("remoteIndexCount").firstChild.nodeValue = remoteIndexCount;
  if (document.getElementById("remotePeerCount") != null) document.getElementById("remotePeerCount").firstChild.nodeValue = remotePeerCount;
  document.getElementById("resNav").firstChild.nodeValue = "X";
  // compose page navigation

  resnav = "";
  thispage = Math.floor(offset / itemsperpage);
  if (thispage == 0) {
  	resnav += ("<img src=\"env/grafics/navdl.gif\" alt=\"arrowleft\" width=\"16\" height=\"16\" />&nbsp;");
  } else {
  	resnav += ("<a id=\"prevpage\" href=\"");
      resnav += (navurlbase + "&amp;startRecord=" + ((thispage - 1) * itemsperpage));
  	resnav += ("\"><img src=\"env/grafics/navdl.gif\" alt=\"arrowleft\" width=\"16\" height=\"16\" /></a>&nbsp;");
  }
  
  numberofpages = Math.floor(Math.min(10, 1 + ((totalcount.replace(/\./g,'') - 1) / itemsperpage)));
  if (!numberofpages) numberofpages = 10;
  for (i = 0; i < numberofpages; i++) {
      if (i == thispage) {
         resnav += "<img src=\"env/grafics/navs";
         resnav += (i + 1);
         resnav += (".gif\" alt=\"page");
         resnav += (i + 1);
         resnav += ("\" width=\"16\" height=\"16\" />&nbsp;");
      } else {
         resnav += ("<a href=\"");
         resnav += (navurlbase + "&amp;startRecord=" + (i * itemsperpage));
         resnav += ("\"><img src=\"env/grafics/navd");
         resnav += (i + 1);
         resnav += (".gif\" alt=\"page");
         resnav += (i + 1);
         resnav += ("\" title=\"use the TAB key to navigate to next page\" width=\"16\" height=\"16\" /></a>&nbsp;");
      }
  }
  if (thispage >= numberofpages) {
  	resnav += ("<img src=\"env/grafics/navdr.gif\" alt=\"arrowright\" title=\"use the TAB key to navigate to next page\" width=\"16\" height=\"16\" />");
  } else {
      resnav += ("<a id=\"nextpage\" href=\"");
      resnav += (navurlbase + "&amp;startRecord=" + ((thispage + 1) * itemsperpage));
      resnav += ("\"><img src=\"env/grafics/navdr.gif\" alt=\"arrowright\" title=\"use the TAB key to navigate to next page\" width=\"16\" height=\"16\" /></a>");
  }
 
  document.getElementById("resNav").innerHTML = resnav;
}


