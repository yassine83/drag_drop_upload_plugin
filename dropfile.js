/*
* Plugin name :dropfile
* Author : Yassine Ettalhi
* Version :1.0 le Mercredi 30/04/2014 
*/

(function($){

	/*
	* options array for the plugin
	* default options
	*/

    var opts = {
    	message : "Drag Drop your files here",/*the displayed message in the drop area  */
    	url : 'put the default url uploadin folder here'             /* default folder to upload files change it to convent you*/
    } 



	$.fn.dropfile = function(options){
    var jsonsession = [];
    /* merging user options with the defaults if they exist*/
		  if(options) 
			$.extend(opts,options);
			
			
		$(this).each(function(){
			$("<span>").addClass('instructions').append(options.message).appendTo(this);		
            

            /*
            * a the moment we are inserting the image it can happen that the user refresh the page 
            * so that make the displayed images(already uploaded) disapear from the browser ,so a the moment 
            * of uploading image we declare sessionStorage variable in wich , we save the attribute of the 
            * uploaded images so that we can reuse them if a refresh page happen.
            * NOTA: after submitting operation we must delete this sesssionStorage variable 
            */

               var photos=[];
               /*
               * if there is some images in the sessionStorage variable called here ('jsonsession')
               * we parse it to retrieve the images 
               */
              if(sessionStorage.getItem('jsonsession')!=null){
                  photos = jQuery.parseJSON(sessionStorage.getItem('jsonsession'));
              }
             
            
             if(photos.length != 0){
                for(var i=0;i<photos.length;i++){
                
                  var photo =  photos[i];                  
                  var table = $('<table>');
                  table.addClass('tables');
                  var tr =$('<tr>');
                  /*
                  * create a div element to put the image
                  */
                  var div = $('<div/>');                                 
                  div.addClass('img');
                  div.attr('id','id'+i);

                  
                  var tdimg = $('<td>');
                   tdimg.append(photo.content);
                   tdimg.appendTo($(tr));

                  /*
                  * div element wich display the image noun
                  */

                  var tdname = $('<td>');
                  tdname.append(photo.name);
                  tdname.appendTo($(tr));
                 
                  /*
                  * remove link of the image 
                  */
                 
                  var a = $('<a/>');
                     
                      a.html('Delete'); 
                      a.attr('url',photo.url);
                      a.attr('class','btn btn-danger');
                      a.attr('id_div',div.attr('id'));

                      $(a).bind('click',function(event){
                        var id= event.target;                       
                        var xhr2 = new XMLHttpRequest();                                         
                        
                        xhr2.onreadystatechange = function(){                         
                           if (xhr2.readyState == 4) 
                           {
                               var json2 = jQuery.parseJSON(xhr2.responseText);                          
                                
                               if(json2.result==true)
                               {   

                                   /*
                                   * suppression de l'élément supprimé de sessionStorage.
                                   */                               
                                     var nouveauphotos =[];

                                     for(var j=0;j<photos.length;j++ )
                                     {
                                          if(photos[j].id != json2.id){
                                            nouveauphotos.push(photos[j]);
                                          }
                                     }
                                     sessionStorage.setItem('jsonsession',JSON.stringify(nouveauphotos));
                                     /*
                                     * suppression de la div.
                                     */ 
                                       
                                      
                                     
                                       $("#"+$(id).attr('id_div')).remove();
                              }
                        }
                        }

                        xhr2.open('post',$(id).attr('url'),true);                       
                        xhr2.send();                         
                        return false;
                      });
                  
                    var tdlien = $('<td>');
                    tdlien.append($(a));
                    tdlien.appendTo($(tr));
                    tr.appendTo($(table));
                    table.appendTo($(div));
                    div.insertAfter($(this));

               }
             }
             
             
            
            
            var input = $('<input/>');
            input.attr('type','file');
            input.attr('class','inputuploader');           
            input.appendTo(this);
            
            /*
            * adding an input file to make choice to upload by drag and drop or via input file.
            */
           
            var surinput = $('<input/>');
            surinput.attr('class','surinput');           
            surinput.attr('value','Uploader');
            surinput.appendTo(this);
            $(this).on('change',$(surinput),function(e){
            	//console.log(e.target.files;);
            	var files = e.target.files;

            	/*upload files with upload function */
                  upload(files,$(this),0);
            });

          


     /* adding a progress bar showing uploading progress*/
      $('<div/>').addClass('progressbar').appendTo(this);  
      			$(this).bind({
      				dragenter : function(e){
      					e.preventDefault();
      				},
      				dragover : function(e){
      					$(this).addClass("hover");
                          
      					e.preventDefault();
      				},
      				dragleave : function(e){
      					$(this).removeClass("hover");
                         
      					e.preventDefault();
      				}
      			});
      			this.addEventListener('drop',function(e){
                           var files =e.dataTransfer.files;
      
                           upload(files,$(this),0);
                       
      					e.preventDefault();
      					//console.log(files); 
      
      			},false);
      
      		});

         /*
          * ulpoading function using XMLHttpRequest object.
         */
		function upload(files,area,index){
               var file = files[index];
               var xhr = new XMLHttpRequest();
               var progress = area.find('.progressbar');
              /*
              * Evénements
              */
               xhr.addEventListener('load',function(e){
              	var json = jQuery.parseJSON(e.target.responseText);                 
              	area.removeClass('hover');
              	if(json.error)
                {
              		alert(json.error);
              		return false;
              	}
              	else
                {
                  /*
                  * saving attributes of uploaded images in the sessionStorage
                  */                 
                  var photos = [];
                    
                   if(sessionStorage.getItem('jsonsession')==null){
                    photos[0] = json;
                    sessionStorage.setItem('jsonsession',JSON.stringify(photos));
                   }
                   else{
                    photos = jQuery.parseJSON(sessionStorage.getItem('jsonsession'));
                    photos.push(json);                    
                    sessionStorage.setItem('jsonsession',JSON.stringify(photos));
                   }
                    

                  var table = $('<table>');
                  table.addClass('tables');
                  var tr =$('<tr>');
              		/*
              		* div element containing  the new uploaded image
              		*/
              		var div = $('<div/>');              		            		
               		div.addClass('img');               		
               		//div.append(json.content);
                  var tdimg = $('<td>');
                   tdimg.append(json.content);
                   tdimg.appendTo($(tr));

               		/*
              		* div element containing noun of the new uploaded image
              		*/
               		
                  var tdname = $('<td>');
                  tdname.append(json.name);
                  tdname.appendTo($(tr));
               		
               		/*
              		* div element containing image remove link.
              		*/
               		
               		var a = $('<a/>');                    
                      a.html('supprimer');             
                      a.attr('class','btn btn-danger');
                      $(a).click(function(event){
                      	var xhr1 = new XMLHttpRequest();  	
                      	
                      	xhr1.onreadystatechange=function(){
                          if (xhr1.readyState == 4) 
                           {
                            		var json1 = jQuery.parseJSON(xhr1.responseText);
                               
                            		if(json1.result==true)
                                {
                                     /*
                                      * updating the sessionStorage variable in case success remove
                                      */
                                      photos = jQuery.parseJSON(sessionStorage.getItem('jsonsession'));
                                      var nouveauphotos =[];
                                     
                                       for(var j=0 ; j<photos.length ; j++ )
                                       {
                                          if(photos[j].id != json1.id){
                                            nouveauphotos.push(photos[j]);
                                          }
                                       }                               

                                      sessionStorage.setItem('jsonsession',JSON.stringify(nouveauphotos));
                                       /*
                                       * suppression de la div aprés suppression de l'image.
                                       */
                                			div.remove();
                            		}
                            }
                      	}
                      	                  	
                      	xhr1.open('post',json.url,true);
                        xhr1.send(); 
                      	return false;
                      });
               		
                  var tdlien = $('<td>');
                  tdlien.append($(a));
               		tdlien.appendTo($(tr));
               		tr.appendTo($(table));
                  table.appendTo($(div));
               		div.insertAfter(area);             
                     
              	}             	

              },false);
               xhr.upload.addEventListener('progress',function(e){

               	if(e.lengthComputable){
               		var perc = (Math.round(e.loaded/e.total)*100)+"%";
               		progress.css('width',0);
                    progress.css('width',perc).html(perc);
                    
                    alert(perc);
                    progress.css('width',0).html('');
                    
               	}

               },false);

              xhr.open('post',opts.url,true);
              xhr.setRequestHeader('content-type','multipart/form-data');
              xhr.setRequestHeader('file-type',file.type);
              xhr.setRequestHeader('file-size',file.size);
              xhr.setRequestHeader('file-name',file.name);
              xhr.send(file);

		}/* end upload function */         
	}
}(jQuery));
