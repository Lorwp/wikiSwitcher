/* GLOBAL (needed???) */
var pageTitle = mw.config.get( 'wgTitle' );
var currUser = mw.config.get( 'wgUserName' );
if ( pageTitle === currUser && mw.config.get( 'wgNamespaceNumber' ) === 2 ) {
	var pageID = 0;
	if ( typeof(editAvailable) == 'undefined' || editAvailable === '' ) { var editAvailable = "User:" + currUser + "/Availability"; }
	else { editAvailable = "User:" + currUser + "/" + editAvailable; }
	getPageText();
	loadAvailabilities();
}
/* GLOBAL */
 
function jqEsc( expression ) {
    return expression.replace( /[!"#$%&'()*+,.\/:;<=>?@\[\\\]^`{|}~]/g, '\\$&' );
}
 
function getPageText() {
	return $.ajax({
		url: mw.config.get( 'wgServer' ) + mw.config.get( 'wgScriptPath' ) + '/api.php?titles=' + editAvailable.replace(' ','_') + '&action=query&prop=revisions&rvprop=content&format=json&indexpageids=true',
		dataType: 'json',
		success: function(response){
			pageID = response.query.pageids;
			var pageCurrText = response.query.pages[pageID].revisions[0]['*'];
			var currStatus = pageCurrText.substring( pageCurrText.indexOf( "|" )+1, pageCurrText.length-2 );
			console.warn( 'Starting status: %s', currStatus );
			if( currStatus.indexOf( "|" ) != '-1' ){
				console.warn( 'Extra parameter: true' );
				if ( currStatus.indexOf( "=" ) != '-1' ){
					console.warn( 'Extra parameter isBool: true' );
					var currStatusExtraPara = currStatus.substring( currStatus.indexOf( "|" )+1, currStatus.indexOf( "=" ) );
					var currStatusExtraVal = currStatus.substring( currStatus.indexOf( "=" )+1, currStatus.length );
					if ( currStatusExtraVal == '' && currStatusExtraVal == '0' ){
						currStatusExtraVal = 'false';
					} else {
						currStatusExtraVal = 'true';
					}
					console.warn( 'currStatusExtraPara: %s\ncurrStatusExtraVal: %s', currStatusExtraPara, currStatusExtraVal );
				} else {
					console.warn( 'Extra parameter isBool: false' );
					var currStatusExtraPara = currStatus.substring( currStatus.indexOf( "|" )+1, currStatus.length );
					console.warn( 'currStatusExtraPara: %s', currStatusExtraPara );
				}
				currStatus = currStatus.substring( 0, currStatus.indexOf( "|" ) );
				console.warn( 'currStatus: %s',  currStatus );
			} else {
				console.warn( 'Extra parameter: false' );
			}
		},
		error: function(response){
			console.log( 'Failed! Page contains:\n%o', response );
			var pageCurrText = '';
		}
	});
}
 
function loadAvailabilities() {
	var linkAvailable = mw.util.addPortletLink(
		'p-personal',
		'#',
		'Update status',
		'pt-available',
		'Set wikiBreak status',
		null,
		'#pt-watchlist'
	);
	$( linkAvailable ).click( function ( e ) {
		e.preventDefault();
		/* STUFF TO DO */alert( "You should know this isn't ready yet fool!!!" )/* STUFF TO DO */
	});
}
 
function editThePage( newPageText, pageSummary ) {
	var anEditToken = mw.user.tokens.get( 'editToken' );
	console.log( 'Got token: %s', anEditToken );
	pageSummary = pageSummary.substring(0, 189) + " - [[User:Technical 13/Scripts/wikiSwitcher|wiki break switcher]]";
	console.log( 'Edit summary:\n%s\nNew content:\n%s', pageSummary, newPageText )
	var request = {
		'action': 'edit',
		'title': pageTitle,
		'text': newPageText,
		'summary': pageSummary,
		'token': anEditToken
	}
	var api = new mw.Api();
	api.post(request)
}
 
function changeAvailability() {
	console.log( 'Setting availability to %s', availability );
	//<nowiki> Set up the new template to use
	var pageNewText = '{{' + 'WikibreakSwitch|' + availability + '}}';
	//</nowiki>
	editThePage( pageNewText, currUser + ' is now ' + availability );
}
