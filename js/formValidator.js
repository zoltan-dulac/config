/**
 * @author zoltan
 */
var formValidator = new function () {
	var me = this;
	
	var formToValidate;
	var hasErrors;

	me.init = function () {
		if (EventHelpers.hasPageLoadHappened(arguments)) {
			return;
		}
		
		formToValidate = document.getElementById('creditCardForm');
		EventHelpers.addEvent(formToValidate, "submit", validate);
	}
	
	function validate(e) {
		var theForm = EventHelpers.getEventTarget(e);
		var validatorObjects = config.getValue("formValidator." + theForm.id + ".inputs");
		
		// Before we do anything, let's clear all the old errors
		clearErrors();
		
		if (!validatorObjects) {
			return;
		}
		
		for (i in validatorObjects) {
			var validatorObject = validatorObjects[i];
			var elementNode = theForm[i];
			if (elementNode) {
				
				if (validatorObject.isMandatory == "true" && isBlank(elementNode.value)) {
					addError(elementNode, 
						config.getValue("formValidator.errors.mandatoryField"));
				} else if (validatorObject.pattern && elementNode.value.match(validatorObject.pattern) == null) {
					addError(elementNode, validatorObject.unmatchError);					
				}
			}
		}
		
		if (hasErrors) {
			showErrorMessageWarning();
			window.scrollTo(0,0);
			EventHelpers.preventDefault(e);
		} else {
			window.alert(config.getScriptedValue(
				"formValidator.templates.submissionAlert",
				{
					ccNum: formToValidate.ccNum.value,
					ccType: formToValidate.ccType.value
				}));
			EventHelpers.preventDefault(e);
		}
	}
	
	function addError(fieldNode, string) {
		var errorMessage = document.createElement("div");
		errorMessage.className = "fieldMessage";
		errorMessage.innerHTML = string;
			
		fieldNode.parentNode.appendChild(errorMessage);	
		hasErrors = true;
	}
	
	function clearErrors () {
		var errorNodes = getElementsByClassName(document, "fieldMessage");
		
		for (var i=0; i<errorNodes.length; i++) {
			var errorNode = errorNodes[i];
			errorNode.parentNode.removeChild(errorNode);
		}
		
		hasErrors = false;
	}
	
	function showErrorMessageWarning() {
		document.getElementById("messages").innerHTML =
			config.getValue("formValidator.templates.hasError");
	}
	
	function isBlank(s) {
		
		return (s.trim() == "");
	}
	
	/*
	 * getElementsByClassName(): from http://snook.ca/archives/javascript/your_favourite_1/
	 */
	function getElementsByClassName(node, classname)
	{
	    var a = [];
	    var re = new RegExp('(^| )'+classname+'( |$)');
	    var els = node.getElementsByTagName("*");
	    for(var i=0,j=els.length; i<j; i++)
	        if(re.test(els[i].className))a.push(els[i]);
	    return a;
	}
}

//EventHelpers.addPageLoadEvent('formValidator.init');
config.addLoadEvent(formValidator.init);
