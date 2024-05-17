"use strict"

function getAdvice() {
  let num = document.getElementById("numberInputst");
  let adviceTxt = document.getElementById("adviceTxt");
  adviceTxt.innerHTML = "<p>" + num + "</p>";
}