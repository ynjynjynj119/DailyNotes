$.ajaxSetup
({
  dataType: "text"
});

/*
send form data via ajax and return the data to callback function 
*/
function send_form( name , func )
{
	var url = $('#'+name).attr('action');
	
	var params = {};
	$.each( $('#'+name).serializeArray(), function(index,value) 
	{
		params[value.name] = value.value;
	});
	
	
	$.post( url , params , func );	
}

/*
send form data via ajax and show the return content to pop div 
*/

function send_form_pop( name )
{
	return send_form( name , function( data ){ show_pop_box( data ); } );
}


function show_pop_box( data , popid )
{
	if( popid == undefined ) popid = 'lp_pop_box'
	//console.log($('#' + popid) );
	if( $('#' + popid).length == 0 )
	{
		var did = $('<div><div id="' + 'lp_pop_container' + '"></div></div>');
		did.attr( 'id' , popid );
		did.css( 'display','none' );
		$('body').prepend(did);
	} 
	
	if( data != '' )
		$('#lp_pop_container').html(data);
	
	var left = ($(window).width() - $('#' + popid ).width())/2;
	
	$('#' + popid ).css('left',left);
	$('#' + popid ).css('display','block');
}

function hide_pop_box( popid )
{
	if( popid == undefined ) popid = 'lp_pop_box'
	$('#' + popid ).css('display','none');
}

function __( text , values )
{
	return $.i18n._( text , values);
}


function remember()
{
	$("input.remember").each( function()
	{
		// read cookie
		if( $.cookie( 'tt2-'+$(this).attr('name')) == 1)
		{
			$(this).attr('checked','true');
		}

		// save cookie
		

		$(this).unbind('click');
		$(this).bind('click',function(evt)
		{
			if( $(this).is(':checked') )
				$.cookie( 'tt2-'+$(this).attr('name') , 1  );
			else
				$.cookie( 'tt2-'+$(this).attr('name') , 0  );
		});

	});

}

function namecard()
{
	 $('.namecard').tooltipster
	 ({
	 	'interactive':true,
	 	'functionBefore':load_user_tooltips
     });
	/*
	$("a.namecard").each( function()
	{
		
	});*/
}

function load_user_tooltips( origin , continueTooltip )
{
	$.ajax(
	{
        type: 'POST',
        url: '?c=dashboard&a=user_tooltips&uid='+origin.data('uid'),
        success: function(data)
        {
            origin.data('tooltipsterContent', data);
            continueTooltip();
        }
    });
}

function load_buddy()
{
	var url = '?c=buddy&a=data' ;
	var params = { };
	$.post( url , params , function( data )
	{
		// add content to list
		$('#buddy_list').html(data);
		//buddy_click();
		//bind_feed();
		done();
		
	} );
	doing();
}

function load_feed( max_id )
{
	var url = '?c=feed&a=data' ;
	var params = { 'max_id':max_id };
	$.post( url , params , function( data )
	{
		// add content to list
		$('#feed_list li.more').remove();
		$('#feed_list').append(data);
		bind_feed();
		namecard();
		done();
		
	} );
	doing();
}


function load_todo( type )
{
	var url = '?c=dashboard&a=todo_data&type=' + type ;
	var params = {};
	$.post( url , params , function( data )
	{
		// add content to list
		$('#todo_list_'+type).html(data);

		// bind event
		if( type != 'follow' )
			bind_todo();
		else
			bind_follow_todo();

		done();
	} );

	doing();	

}

function todo_add( text, star )
{
	var url = '?c=dashboard&a=todo_add' ;

	if( star == 1 ) is_star = 1 ;
	else is_star = 0;


	var params = { 'text' : text , 'is_star' : is_star };
	$.post( url , params , function( data )
	{
		var data_obj = $.parseJSON( data );
		 
		if( data_obj.err_code == 0 )
		{
			if( data_obj.data.other != 1 )
			{
				if( is_star == 0 )
					$('#todo_list_normal').prepend( $(data_obj.data.html) );
				else
					$('#todo_list_star').prepend( $(data_obj.data.html) );
				
			}
			window.location.reload();

			$('#todo_form [name=content]').val('');			
		}
		else
		{
			alert( __('JS_API_CALL_ERROR' , [ data_obj.err_code , data_obj.message ] ) );
		}

		done();
	} );

	doing();
}


function todo_forward( tid , url )
{
	if( $('#t-'+tid).hasClass('red') ) return alert(__('JS_CANNOT_ASSIGN_PRIVATE_TODO'));
	else
	{
		show_float_box( __('JS_SELECT_MEMBER_TO_ASSIGN') , url );
		// $('#people_box').modal({ 'show':true,'remote':url });
	} 
}

// bind evt
function bind_gbox( tid , is_public )
{
	$(".gbox li.public a").unbind('click');
	$(".gbox li.public a").bind('click',function(evt)
	{
		todo_public( tid , 'private'  );
	});

	$(".gbox li.private a").unbind('click');
	$(".gbox li.private a").bind('click',function(evt)
	{
		todo_public( tid , 'public'  );
	});

	$(".gbox li.star.public a").unbind('click');
	$(".gbox li.star.public a").bind('click',function(evt)
	{
		todo_star( tid , 'remove' , 1 );
	});

	$(".gbox li.star.private a").unbind('click');
	$(".gbox li.star.private a").bind('click',function(evt)
	{
		todo_star( tid , 'remove' , 0 );
	});

	$(".gbox li.nostar.pri a").unbind('click');
	$(".gbox li.nostar.pri a").bind('click',function(evt)
	{
		todo_star( tid , 'add' , 0 );
	});

	$(".gbox li.nostar.pub a").unbind('click');
	$(".gbox li.nostar.pub a").bind('click',function(evt)
	{
		todo_star( tid , 'add' , 1 );
	});

		

	$(".gbox li.follow a").unbind('click');
	$(".gbox li.follow a").bind('click',function(evt)
	{
		todo_unfollow( tid  );
	});

	$(".gbox li.nofollow a").unbind('click');
	$(".gbox li.nofollow a").bind('click',function(evt)
	{
		todo_follow( tid  );
	});

}

function todo_star( tid , type , is_public )
{
	var url = '?c=dashboard&a=todo_star' ;
	var params = { 'tid' : tid  , 'type' : type };
	$.post( url , params , function( data )
	{
		done();

		var data_obj = $.parseJSON( data );
		 
		if( data_obj.err_code == 0 )
		{
			if( type == 'add' )
			{
				if( is_public == 1 )
					$("ul.gbox li.nostar").removeClass('nostar pub pri').addClass('star public');
				else
					$("ul.gbox li.nostar").removeClass('nostar pub pri').addClass('star private');

				$('#todo_list_star').prepend( $("#t-"+tid) );
				bind_todo();
				bind_gbox( tid );
			}	
			else
			{
				if( is_public == 1 )
					$("ul.gbox li.star").removeClass('public private star').addClass('nostar pub');
				else
					$("ul.gbox li.star").removeClass('public private star').addClass('nostar pri');
				$('#todo_list_normal').prepend( $("#t-"+tid) );
				bind_todo();
				bind_gbox( tid );

			}
				

		}
		else
		{
			alert( __('JS_API_ERROR_INFO' , [ data_obj.err_code , data_obj.message ] ) );
		}

		
	} );	
	doing();
}


function todo_remove_comment( hid )
{
	if( confirm( __('JS_REMOVE_COMMENT_CONFIRM') ) )
	{
		var url = '?c=dashboard&a=todo_remove_comment' ;
		var params = { 'hid' : hid  };
		$.post( url , params , function( data )
		{
			var data_obj = $.parseJSON( data );
			 
			if( data_obj.err_code == 0 )
			{
				$('#hid-'+hid).remove();
			}
			else
			{
				alert( __('JS_API_ERROR_INFO' , [ data_obj.err_code , data_obj.message ] ) );
			}
			done();
		} );
		doing();
	}

	

}

function todo_add_comment( tid , comment )
{
	var url = '?c=dashboard&a=todo_add_comment' ;
	var params = { 'tid' : tid  , 'text' : comment };
	$.post( url , params , function( data )
	{
		var data_obj = $.parseJSON( data );
		 
		if( data_obj.err_code == 0 )
		{
			$('#todo_history').append( $(data_obj.data.html) );//prepend(
			$('#comment_text').val('');
		}
		else
		{
			alert( __('JS_API_ERROR_INFO' , [ data_obj.err_code , data_obj.message ] ) );
		}

		done();

	} );

	doing();
}

function todo_update( tid , text )
{
	var url = '?c=dashboard&a=todo_update' ;
	var params = { 'tid' : tid  , 'text' : text };
	$.post( url , params , function( data )
	{
		var data_obj = $.parseJSON( data );
		 
		if( data_obj.err_code == 0 )
		{
			$('#t-'+tid).replaceWith( $(data_obj.data.html) );
			bind_todo();
			show_todo_detail( tid );
		}
		else
		{
			alert( __('JS_API_ERROR_INFO' , [ data_obj.err_code , data_obj.message ] ) );
		}
		done();
	} );	
	doing();
}

function todo_assign( tid , uid )
{
	//alert(tid + '~' + uid );
	var url = '?c=dashboard&a=todo_assign' ;
	var params = { 'tid' : tid  , 'uid' : uid };
	$.post( url , params , function( data )
	{
		var data_obj = $.parseJSON( data );
		 
		if( data_obj.err_code == 0 )
		{
			close_float_box();
			$('#t-'+tid).remove();
			tdboard_close();
		}
		else
		{
			alert( __('JS_API_ERROR_INFO' , [ data_obj.err_code , data_obj.message ] ) );
		}
		done();
	} );	
	doing();


}

function mark_todo_done( tid )
{
	
	var url = '?c=dashboard&a=todo_done' ;
	var params = { 'tid' : tid };
	$.post( url , params , function( data )
	{
		var data_obj = $.parseJSON( data );
		 
		if( data_obj.err_code == 0 )
		{
			$('#todo_list_done').prepend($('#t-'+tid));
			bind_todo();
		}
		else
		{
			alert( __('JS_API_ERROR_INFO' , [ data_obj.err_code , data_obj.message ] ) );
		}
		done();
	} );	
	doing();
}

function mark_todo_undone( tid )
{
	var url = '?c=dashboard&a=todo_reopen' ;
	var params = { 'tid' : tid };
	$.post( url , params , function( data )
	{
		var data_obj = $.parseJSON( data );
		 
		if( data_obj.err_code == 0 )
		{
			$('#todo_list_normal').prepend($('#t-'+tid));
			bind_todo();
		}
		else
		{
			alert( __('JS_API_ERROR_INFO' , [ data_obj.err_code , data_obj.message ] ) );
		}
		done();
	} );
	doing();
}



function show_todo_detail_center( tid )
{
	show_float_box( __('JS_TODO_CENTER_PAGE_TITLE') , '?c=dashboard&a=todo_center&tid=' + tid );
}

function show_todo_detail( tid )
{
	// check todo_board exists or not
	// if not exists , create it
	//alert('detail-'+tid);
	close_all_side_board();

	if( $('#tdboard').length == 0 )
	{
		var did = $('<div></div>');
		did.attr( 'id' , 'tdboard' );
		did.css( 'display','none' );
		$('body').prepend(did);
	}
	else
	{
		$('#tdboard').html('');
		$('#tdboard').hide();
	}

	var xy = $("#side_container").position();
	$('#tdboard').css('top' , xy.top);
	$('#tdboard').css('left' , xy.left);
	
	$('#tdboard').fadeIn('slow');

	var url = '?c=dashboard&a=todo_detail' ;
	var params = { 'tid' : tid };
	$.post( url , params , function( data )
	{
		// add content to list
		$('#tdboard').html(data);
		$('#side_container').css('visibility','hidden');
		namecard();
		//enable_at('comment_text');
		done();

		if( typeof JS_TODO_DETAIL_CALLBACK == 'function'  ) JS_TODO_DETAIL_CALLBACK();

	} );

	$('#tdboard').html('<h2 class="loading">Loading...</h2>');
	doing();	

}

function check_online()
{
	var url = '?c=dashboard&a=user_online' ;
	
	var params = {};
	$.post( url , params , function( data )
	{
		var data_obj = $.parseJSON( data );
		//console.log( data_obj ); 
		if( data_obj.err_code == 0 )
		{
			var uids = new Array();
			if(!data_obj.data) return false;
			for( var i = 0; i < data_obj.data.length ; i++ )
			{
				uids.push(parseInt(data_obj.data[i].uid));
			}

			//console.log( uids );
				
			if( uids.length > 0 )
			{
				$('#im_buddy_list li').each( function()
				{
					if( $.inArray( parseInt($(this).attr('uid')) , uids ) == -1 )
						$(this).removeClass('online');
					else
						$(this).addClass('online');
				} );
			}	
		}
	});		
}


function blue_buddy_list()
{
	if( $( '#im_buddy_list li.user_line.new_message').length < 1 )
		if($('#im_header'))
			$('#im_header').removeClass('new_message');
}

function cast_send( text )
{
	//alert( text );
	var url = '?c=feed&a=cast' ;
	
	var params = { 'text' : text  };
	$.post( url , params , function( data )
	{
		var data_obj = $.parseJSON( data );
		 
		if( data_obj.err_code == 0 )
		{
			$('#feed_list').prepend( $(data_obj.data.html) );
			bind_feed();
			$('#cast_form [name=text]').val('');
		}
		else
		{
			alert( __('JS_API_ERROR_INFO' , [ data_obj.err_code , data_obj.message ] ) );
		}
		done();
	} );
	doing();
}



function tdboard_close()
{
	$('#tdboard').fadeOut('fast');
	$('#side_container').css('visibility','visible');
}

function fdboard_close()
{
	$('#fdboard').fadeOut('fast');
	$('#side_container').css('visibility','visible');
}

function bind_follow_todo()
{
	// this -- > a 
	// this.parentNode --> .todo_row
	// this.parentNode.parentNode ---> .todo_fav
	// this.parentNode.parentNode.parentNode -----> li	

	$('#todo_list_follow li a.item').each( function()
	{
		$(this.parentNode).unbind( 'click' );
		$(this.parentNode).bind( 'click' , function(evt)
		{
			evt.stopPropagation();
			show_todo_detail( $('#'+this.parentNode.parentNode.id).attr('tid') );
			return false;
		} );

		$('#'+this.parentNode.parentNode.parentNode.id).unbind('click');
		$('#'+this.parentNode.parentNode.parentNode.id).bind('click' , 	function( )
		{
			if( $(this).hasClass('nofollow') )
				todo_follow( $(this).attr('tid') );
			else
				todo_unfollow( $(this).attr('tid') );	

		});
		
		
		
		
	});
}

function bind_todo()
{
	//alert('in');
	$('li a.todo_play').unbind('click');
	$('li a.todo_play').bind('click' , function(evt)
	{
		var mtype;

		if( $(this.parentNode).hasClass('ing') )
			mtype = 'pause';
		else
			mtype = 'start';
		
		var tid = $(this).attr('tid');
		var url = '?c=dashboard&a=todo_start&tid=' + tid + '&type=' + mtype  ;
	
		var params = {};
		$.post( url , params , function( data )
		{
			var data_obj = $.parseJSON( data );
				 
			if( data_obj.err_code == 0 )
			{
				if( mtype == 'pause' )
				{
					$('#t-'+tid).removeClass('ing');
					console.log('remove class');
				}
					
				else
				{
					$('#t-'+tid).addClass('ing');
					console.log('add class');
				}
					
				// buddy_click();
				done();

			}
			else
			{
				alert( __('JS_API_ERROR_INFO' , [ data_obj.err_code , data_obj.message ] ) );
			}
		} );

		doing();
		evt.stopPropagation();
		
	});



	$('#todo_list_star li a.item,#todo_list_normal li a.item,#todo_list_done li a.item').each( function()
	{
		// this -- > a 
		// this.parentNode --> .todo_row
		// this.parentNode.parentNode ---> .todo_fav
		// this.parentNode.parentNode.parentNode -----> li		

		$(this.parentNode).unbind( 'click' );
		$(this.parentNode).bind( 'click' , function(evt)
		{
			evt.stopPropagation();
			show_todo_detail( $('#'+this.parentNode.parentNode.id).attr('tid') );
			return false;
		} );

		$(this.parentNode.parentNode).unbind( 'click' );
		$(this.parentNode.parentNode).bind( 'click' , function(evt)
		{
			evt.stopPropagation();
			
			if( this.parentNode.parentNode.id != 'todo_list_done' )
			{
				var is_public = 0;
				if( $('#'+this.parentNode.id).hasClass('blue') ) 
					is_public  = 1;

				if( this.parentNode.parentNode.id == 'todo_list_star' )
					todo_star( $('#'+this.parentNode.id).attr('tid')  , 'remove' , is_public );
				else
					todo_star( $('#'+this.parentNode.id).attr('tid')  , 'add' , is_public );
			}

			

			return false;
		} );
		


		
		$('#'+this.parentNode.parentNode.parentNode.id).unbind('click');
		$('#'+this.parentNode.parentNode.parentNode.id).bind('click' , 	function( )
		{
			if( this.parentNode.id == 'todo_list_done' )
			{
				mark_todo_undone( $(this).attr('tid') );
			}
			else
			{
				mark_todo_done( $(this).attr('tid') );  
				// 
			}	
				

		});
		
	});
	

}

function bind_feed()
{
	$('#feed_list li.todo .hotarea').each( function()
	{
		$(this).css({'cursor':'pointer'});

		$(this).unbind( 'click' );
		$(this).bind( 'click' , function(evt)
		{
			evt.stopPropagation();
			show_todo_detail( $('#'+this.parentNode.id).attr('tid') );
			return false;
		} );
	});

	$('#feed_list li.cast .hotarea').each( function()
	{
		$(this).css({'cursor':'pointer'});

		$(this).unbind( 'click' );
		$(this).bind( 'click' , function(evt)
		{
			evt.stopPropagation();
			show_feed_detail( $('#'+this.parentNode.id).attr('fid') );
			return false;
		} );
	});


}


function buddy_search()
{
	$('#buddy_key').bind( 'keyup keydown' , function(evt)
	{
		if( $('#buddy_key').val() != '' )
		{
			$('#buddy_list li.user').each(function()
			{
				if( ($(this).attr('pinyin').indexOf( $('#buddy_key').val() ) < 0) 
					&& ( $(this).attr('user').indexOf( $('#buddy_key').val() ) < 0 ))
				 	$(this).css('display','none');
				else 
					$(this).css('display','block');
			});
		}
		else
		{
			$('#buddy_list li.user').each(function()
			{
				$(this).css('display','block');
			});
		}

		
	});
}

function buddy_click()
{
	
	$('li.user').unbind('click');
	$('li.user').bind('click',function(evt)
	{
		$(this).toggleClass('selected');
		buddy_build_names();

		if( $("li.selected").length > 0 )
			$('#buddy_mulit_box').slideDown();
		else
			$('#buddy_mulit_box').slideUp();
		
	});
}

function buddy_build_names()
{
	$("#namelist").empty();
	$('li.user.selected').each( function()
	{
		$("#namelist").append( $('<li class="nameitem" uid="' + $(this).attr('uid') + '"><i class="icon-user"></i>'+ $(this).attr('user') +'</li>') )
	});
	
}

function cast_at_check()
{
	$('#cast_text').bind( 'keydown keyup' , function(evt)
	{
		if( /@/.test( $('#cast_text').val() ) ) $('#cast_user_tips').text(__('JS_CAST_MENTION_EXPLAIN_MENONTED'));
		else $('#cast_user_tips').text(__('JS_CAST_MENTION_EXPLAIN_ALL'));

		if( $('#cast_text').val() == '' ) $('#cast_form [type=submit]').attr('disabled',true);
		else  $('#cast_form [type=submit]').attr('disabled',false);
	});
}


function admin_user_on( uid )
{
	return admin_user( uid , 1 );
}

function admin_user_off( uid )
{
	return admin_user( uid , 0 );
}


function admin_user( uid , on )
{
	var url = '?c=buddy&a=admin_user&set=' + on  ;
	
	var params = { 'uid' : uid  };
	$.post( url , params , function( data )
	{
		var data_obj = $.parseJSON( data );
			 
		if( data_obj.err_code == 0 )
		{
			$('li#uid-'+uid).replaceWith( $(data_obj.data.html) );
			// buddy_click();
		}
		else
		{
			alert( __('JS_API_ERROR_INFO' , [ data_obj.err_code , data_obj.message ] ) );
		}
	} );
}


function save_password()
{
	if( $('#password_form [name=oldpassword]').val() == '' )
	{
		alert( __('JS_OLD_PASSWORD_CANNOT_EMPTY') );
		return false;
	}

	if( $('#password_form [name=newpassword]').val() == '' )
	{
		alert( __('JS_NEW_PASSWORD_CANNOT_EMPTY') );
		return false;
	}

	if( $('#password_form [name=newpassword]').val() != $('#password_form [name=newpassword2]').val() )
	{
		alert( __('JS_TWO_PASSWORDS_NOT_SAME') );
		return false;
	}

	send_form( 'password_form' , function(data){ password_updated( data ); } )

}


function password_updated( data )
{
	var data_obj = $.parseJSON( data );
	 
	if( data_obj.err_code == 0 )
	{
		
		alert(__('JS_PASSWORD_CHANGED'));
		close_float_box();
		location = '?c=guest&a=logout';
	}
	else
	{
		alert(__('JS_API_CONNECT_ERROR'));
	}
}


function profile_updated( data )
{
	var data_obj = $.parseJSON( data );
	 
	if( data_obj.err_code == 0 )
	{
		
		close_float_box();
	}
	else
	{
		if( data_obj.err_code == 10006 )
			alert(__('JS_FILL_MOBILE_EMAIL_PLZ'));
		else
			alert( __('JS_API_ERROR_INFO' , [ data_obj.err_code , data_obj.message ] ) );
	}
}


function admin_close_user( uid )
{
	if( confirm( __('JS_ACCOUNT_CLOSE_CONFIRM') ) )
	{
		var url = '?c=buddy&a=user_close' ;
	
		var params = { 'uid' : uid  };
		$.post( url , params , function( data )
		{
			//console.log( data );
			var data_obj = $.parseJSON( data );
			//console.log( data_obj );
			 
			if( data_obj.err_code == 0 )
			{
				$('li#uid-'+uid).remove();
			}
			else
			{
				alert( __('JS_API_ERROR_INFO' , [ data_obj.err_code , data_obj.message ] ) );
			}
		} );	
	}

	
}


function user_reset_password( uid , uname )
{
	if( confirm( __('JS_RESET_PASSWORD_CONFIRM',[uname]) ))
	{
		var url = '?c=dashboard&a=user_reset_password&uid=' + uid ;
		var params = {};
		$.post( url , params , function( data )
		{
			var data_obj = $.parseJSON( data );
			//console.log( data_obj );
			 
			if( data_obj.err_code == 0 )
			{
				// 显示新密码
				noty(
				{
					layout:'topRight',
					text:uname+'的密码已经被重置为' + data_obj.data.newpass,
					closeWith:['button'],
					buttons: [
				    {
				    	addClass: 'btn btn-primary btn-small', text: '关闭', onClick: function($noty) 
				    	{
				    		$noty.close()
				      	}
				    }]
				});
			}
			else
			{
				alert( __('JS_API_ERROR_INFO' , [ data_obj.err_code , data_obj.message ] ) );
			}
		});

	}
}


function user_added( data )
{
	var data_obj = $.parseJSON( data );
	//console.log( data_obj );
			 
	if( data_obj.err_code == 0 )
	{
		//$('li#uid-'+uid).remove();
		$('#buddy_list').append( $(data_obj.data.html) );
		
		$('html, body').animate({
                    scrollTop: $("footer").offset().top
                     }, 1000);

		$('#buddy_form [type=text]').val('');

		$('#buddy_form [type=password]').val('');

		//buddy_click();
		
	}
	else
	{
		if( data_obj.err_code == 100002 )
		{
			return alert( __('JS_ALL_CANNOT_EMPTY') );
		}
		else
		{
			alert( __('JS_API_ERROR_INFO' , [ data_obj.err_code , data_obj.message ] ) );
		}	

	}

		
}


function edit_tag( uid )
{
	$('#t-tags-'+uid).hide();
	$('#t-tags-link-'+uid).hide();
	$('#t-tags-edit-'+uid).show();
	
	if( $('#t-tags-input-'+uid+'_tag').length < 1 )
		$('#t-tags-input-'+uid).tagsInput({'defaultText':__('JS_ADD_GRUOP_NAME')});
}

function save_tag( uid )
{
	var url = '?c=buddy&a=update_groups&uid='+uid+'&groups='+encodeURIComponent($('#t-tags-input-'+uid).val()) ;
	
	var params = {};
	$.post( url , params , function( data )
	{
		var data_obj = $.parseJSON( data );
		 
		done();
		if( data_obj.err_code == 0 )
		{
			$('#uid-'+uid).replaceWith( $(data_obj.data.html) );
		}
		else
		{
			alert( __('JS_API_ERROR_INFO' , [ data_obj.err_code , data_obj.message ] ) );
		}
	} );

	doing();	

}

function cancel_tag( uid )
{
	$('#t-tags-'+uid).show();
	$('#t-tags-link-'+uid).show();
	$('#t-tags-edit-'+uid).hide();
}


function doing()
{
	$("li#doing_gif").show();
}

function done()
{
	$("li#doing_gif").hide();
	
}

function show_float_box( title , url )
{
	$('#float_box').off('show');
	$('#float_box').on('show', function () 
	{
  		$('#float_box_title').text(title);
  		$('#float_box .modal-body').load(url);
	})

	$('#float_box .modal-body').html('<div class="muted"><center>Loading</center>');
	$('#float_box').modal({ 'show':true });

}

function close_float_box()
{
	$('#float_box').modal('hide');
}

function assign_chooser()
{
	if( $('#todo_form [name=private]:checked').val() == 1 )
	{
		alert( __('JS_CANNOT_ADD_PRIVATE_TODO_TO_OTHERS') );
		return false;
	} 

	show_float_box( '点击你要加TODO的同事' , '?c=dashboard&a=people_box&jsfunc=assign_set&self=1' );
}

function assign_set( tid , uid , uname )
{
	$('#assign_chooser_span a').html('给 <i class="icon-user"></i> '+uname);
	$('#todo_assign_uid').val(uid);
	close_float_box();
}

function at_chooser()
{
	show_float_box( __('JS_SELECT_MEMBER_TO_METION') , '?c=dashboard&a=people_box&jsfunc=cast_at_selected&multi=1' );
}

function cast_at_selected( uids , unames )
{
	$.each( unames , function()
	{
		//alert( this );
		var that = this;
		$('#cast_text').val( $('#cast_text').val() + ' @'+that );
	} );
	close_float_box();
	$('#cast_text').focus();
}

function close_all_side_board()
{
	$('#tdboard').hide();
	$('#fdboard').hide();	
	//$('#side_container').css( 'visibility' , 'visible' );
}



function get_img_src( file , fn ) 
{
	if ($.browser.msie) {
		if ($.browser.version <= 6) {
			fn(file.value);
			return;
		} else if ($.browser.version <= 8) {
			var src = '';
			file.select();
			try {
				src = document.selection.createRange().text;
			} finally {
				document.selection.empty();
			}
			src = src.replace(/[)'"%]/g, function(s){ return escape(escape(s)); });
			fn(src);
			return;
		}
	}
	if ($.browser.mozilla) {
		var oFile = file.files[0];
		if (oFile.getAsDataURL) {
			fn(oFile.getAsDataURL());
			return;
		}
	}
	try {
		var oFile = file.files[0];
		var oFReader = new FileReader();
		oFReader.onload = function (oFREvent) {
			/*
			var img = new Image();
			img.onload = function( evt )
			{

			}
			img.src = oFREvent.target.result;
			*/
			fn(oFREvent.target.result);
		};
		oFReader.onerror = function(a) {
			fn(options.okImg);
		};
		oFReader.readAsDataURL(oFile);
	} catch(e) {
		fn(options.okImg);
	}
}

function kset( key , value )
{
	if( window.localStorage )
	return window.localStorage.setItem( key , value );
}

function kget( key  )
{
	if( window.localStorage )
	return window.localStorage.getItem( key );
}

function kremove( key )
{
	if( window.localStorage )
	return window.localStorage.removeItem( key );
}


Array.prototype.unique =
  function() {
    var a = [];
    var l = this.length;
    for(var i=0; i<l; i++) {
      for(var j=i+1; j<l; j++) {
        // If this[i] is found later in the array
        if (this[i] === this[j])
          j = ++i;
      }
      a.push(this[i]);
    }
    return a;
  };



if( $.cookie( 'tt2-sound-enable' ) != 1 && $.cookie( 'tt2-sound-enable' ) != 0  )
$.cookie( 'tt2-sound-enable' , 1 );
