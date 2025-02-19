
/* JavaScript content from js/watson.js in folder common */
$("#searchbtn" ).click(function() {
  searchvalue = $("#searchterm").val();	
  
  var gbWS ="http://pergunte.mybluemix.net/watson/search/"+searchvalue;	
	  $.ajax({
		type: 'GET',
		url: gbWS,
		crossDomain: true,
		dataType: "text", 
		success: renderList2, // função de retorno do WS
		error: function(xhr, status, error) {
			  var err = eval("(" + xhr.responseText + ")");
			  alert(err.Message);
		}
	});	  
});

function renderList2(data) {
   var sdata = data.substring(1,data.length-1);
   var jdata = $.parseJSON(sdata);
   console.log(jdata);
   var sresults = "";
   $('#results').html("");
   
   for (i = 0; i < jdata.question.evidencelist.length; i++) { 
       sresults = sresults + jdata.question.evidencelist[i].text + "<BR><BR>";
   	}

   $('#results').append(sresults);
} 