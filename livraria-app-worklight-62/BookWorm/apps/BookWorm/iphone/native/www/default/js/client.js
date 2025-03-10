
/* JavaScript content from js/client.js in folder common */
$( init );


function init() {
// Associate Jquery events to buttons
$('#gbook').click( findBook );
$('#fav').click( wishList );
$('#config').click( testAdapter );

}

/* Invokes XML Soap Webservice using adapter */


function testAdapter(){
	console.log("Testing adapter");
	
	var invocationData = {
			adapter : 'Login',
			procedure : 'Login',
			parameters : ['brother']
		};
	
	WL.Client.invokeProcedure(invocationData,{
		onSuccess : showResults(),
		onFailure : alert('Error')
	});
}


function showResults(result){
	console.log("Adapter response");
	alert(result);
}
	

/* invokes Webservice Directly */
function deleteBook(vnumber) {
	vurl = "http://192.241.171.69:8080/Book/webresources/com.percivallucena.book.book/" + vnumber;
	
	$.ajax({
		  url: vurl,
		  type: 'DELETE',
		      dataType: 'json',
		         data: '',
		  success: function(response) { wishList(); }
		      });
}


// CALLS REST WEBSERVICE TO ADD NEW ITEM TO THE LIST
function favourite(data){
	
	var res = data.split("$$$"); 
	var vdata = {
			    author:res[0],
			    collection:"wish",
			    other:"",
			    title:res[1],
			    user:"plucena@gmail.com"
			    };
	
	$.ajax({
        type: "POST",
        url: "http://192.241.171.69:8080/Book/webresources/com.percivallucena.book.book/",
        data: JSON.stringify(vdata),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        processData: true,
        success: function (vdata, status, jqXHR) {
            alert("success..." + vdata);
        },
        error: function (xhr) {
            alert("error" + xhr.responseText);
        }
    });
}


function findBook() {
	findAll();
	return false;
}

function wishList(){
	var gbWS ="http://192.241.171.69:8080/Book/webresources/com.percivallucena.book.book/";
	// faz chamda ao WS REST via ajax	
	  $.ajax({
		type: 'GET',
		url: gbWS,
		crossDomain: true,
		dataType: "json", 
		success: renderList2, // função de retorno do WS
		error: function(xhr, status, error) {
			  var err = eval("(" + xhr.responseText + ")");
			  alert(err.Message);
		}
	});
}

function findAll() {
	// cria query REST
	var gbWS = "https://www.googleapis.com/books/v1/volumes?q="
		+ $('#titulo').val() + "+inauthor:" + $('#autor').val()  
		+ "&key=AIzaSyAqCL-OhWfKu2j_NeYrBLWdiw4PEblL9kk";
	// faz chamda ao WS REST via ajax	
	  $.ajax({
		type: 'GET',
		url: gbWS,
		dataType: "json", 
		success: renderList // função de retorno do WS
	});
}


function renderList(data) {
	$('#resultado').html("");
    var linha = "<table  bgcolor='#EEEEEE' width='100%'>";
	 linha = linha + "<th bgcolor='#DDDDDD' align='left' style='width:40%;'>Title</th>";
	 linha = linha +  "<th bgcolor='#DDDDDD'align='left' style='width:40%;'>Author</th>";
	 linha = linha +  "<th bgcolor='#DDDDDD' align='left' style='width:10%;'>Estimated Price</th>";
	 linha = linha +  "<th bgcolor='#DDDDDD' align='left' style='width:10%;'></th>";


	 i=0;
	 $.each( data.items, function() {
		 if(data.items[i].saleInfo.listPrice == undefined)
             valor="?";
		 else valor=data.items[i].saleInfo.listPrice.amount;			

		 dbook =  data.items[i].volumeInfo.title + "$$$" + data.items[i].volumeInfo.authors[0]; 
		 dlink =  "<a href='#' class='ui-shadow ui-btn ui-corner-all ui-btn-icon-left ui-icon-plus ui-btn-b'" +
		  "onclick=\"favourite('" +  dbook + "');\"" + ">&nbsp;</a>";
		 
		 
		 linha = linha + "<tr> <td class='results1'>" +
		   data.items[i].volumeInfo.title  + "</td>" +
		  "<td class='results2'>" +
	 	  data.items[i].volumeInfo.authors[0] + "</td>" +
	 	  "<td class='results3'>" +
	 	  "$:" + valor + "</td>" +
	 	  "<td class='results2'>";
	 	  linha = linha + dlink + "</td></tr>";
		   i++;	
	});
	 linha = linha + "</table>";
	 $('#resultado').append(linha);
}




function renderList2(data) {
	$('#resultado').html("");
    var linha = "<table  bgcolor='#EEEEEE' width='100%'>";
	 linha = linha + "<th bgcolor='#DDDDDD' align='left' style='width:40%;'>Title</th>";
	 linha = linha +  "<th bgcolor='#DDDDDD'align='left' style='width:40%;'>Author</th>";
	 linha = linha +  "<th bgcolor='#DDDDDD' align='left' style='width:10%;'></th>";


	 i=0;
	 $.each( data, function() {
		 
	
		 linha = linha + "<tr>";
		 linha =  linha + "<td class='results1'>";
	 	 linha =  linha +  data[i].title  + "</td>";
	 	 linha =  linha +  "<td class='results2'>";
	 	 linha =  linha + data[i].author + "</td>";
	 	 linha =  linha +  "<td class='results3'><a href='#' class='ui-shadow ui-btn ui-corner-all ui-btn-icon-left ui-icon-minus ui-btn-b' " +
	 	 		" onclick=\"deleteBook('" + data[i].id + "')\"" + " >&nbsp;</a></td>";
	 	 linha =  linha +  "</tr>";
		 		 i++;	
	});
	 linha = linha + "</table>";
	 $('#resultado').append(linha);
}
