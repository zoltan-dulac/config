/**
 * @author zoltan
 */
var myApp = new function(){

	var form;
    function submitFormEvent(e){
		var amount = document.getElementById('amount').innerHTML;
		var creditCardType = document.getElementById('ccType').value;
		var month = document.getElementById('month').value;
		
		
        var configString = config.getScriptedValue("myApp.confirmCharge.text", {
            amount: amount,
            creditCardType: creditCardType,
            month: month
        });
        
        if (window.confirm(configString)) {
            window.location = config.getValue("myApp.confirmCharge.url");
        }
        return;
    }
	
	function showBrowserWarning() {
		var message = document.getElementById('message');
		
		message.innerHTML = config.getValue("myApp.templates.browserWarning");
			
	}
	
	this.init = function () {
		if (EventHelpers.hasPageLoadHappened(arguments)) {
			return;
		}
		
		/*
		 * showMessage
		 */
		showBrowserWarning();
		
		submitForm = document.getElementById('myApp-form');	
		EventHelpers.addEvent(submitForm, 'submit', submitFormEvent );
	}
}

EventHelpers.addPageLoadEvent('myApp.init');
