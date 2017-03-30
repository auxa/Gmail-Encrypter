var ws = new WebSocket('ws://localhost:8000');
ws.onmessage = function(data) {
  var ul = document.getElementById("consoleList");
  var li = document.createElement("li");
  li.appendChild(document.createTextNode(data.data));
  ul.appendChild(li);
  updateScroll();
};
function updateScroll(){
    var element = document.getElementById("consoleList");
    element.scrollTop = element.scrollHeight;
}
