
    var ReplyCookie = document.cookie.split(";").find(function(cookie) {
        return cookie.startsWith("replyVoteCounter=");
      });

    
    var upvoteCommentElements = document.getElementsByClassName('fa fa-arrow-up comment');
    var downvoteCommentElements = document.getElementsByClassName('fa fa-arrow-down comment');
    
    var upvotePostElements = document.getElementsByClassName('fa fa-arrow-up post');
    var downvotePostElements = document.getElementsByClassName('fa fa-arrow-down post');

    function delayedLog() {
        console.log('This message is delayed by 2 seconds');
    }

    if (ReplyCookie)
    {
        var replyVoteCounter = parseInt(ReplyCookie.split("=")[1]);
    }
    else{
        var replyVoteCounter = 0;
    }

    // Loop through the elements
    for (var i = 0; i < upvoteCommentElements.length; i++) 
    {
        
        (function(i) 
        {
            upvoteCommentElements[i].addEventListener("click", function() 
            {
                upvoteCommentElements[i].classList.add("active");
                console.log(upvoteCommentElements[i].style.backgroundColor)
         
                if (upvoteCommentElements[i].style.backgroundColor == "rgb(204, 204, 204)") 
                {
                    upvoteCommentElements[i].style = "background-color: ''" 
                    downvoteCommentElements[i].style = "background-color: ''" 

                    var commentId = $(this).data('commentid');

                    //Make an AJAX request to update the up vote count for the comment
                        $.ajax({
                            url: `/comment/${commentId}/vote/unvote/`,
                            type: 'POST',
                            success: function(response) {
                                if (response.redirect) {
                                    // Update the URL in the browser to the new location
                                    window.location.href = response.redirect;
                                }else {
                                    // Update the display to show the updated vote count
                                    setTimeout(delayedLog, 20000);
                                    if(response.votes >= 0)
                                    {
                                        $(upvoteCommentElements[i]).next().text(response.votes + ' Upvotes');
                                    }else
                                    {
                                        $(upvoteCommentElements[i]).next().text(response.votes + ' Downvotes');
                                    }

                                }
                                
                                console.log("comment unvoted")
                            }
                        });
                   
                }
                else
                {
                    upvoteCommentElements[i].style = "background-color: #ccc;";
                    downvoteCommentElements[i].style = "background-color: ''";
                    var commentId = $(this).data('commentid');

                    //Make an AJAX request to update the up vote count for the comment
                        $.ajax({
                            url: `/comment/${commentId}/vote/add`,
                            type: 'POST',
                            success: function(response) {
                                if (response.redirect) {
                                    // Update the URL in the browser to the new location
                                    window.location.href = response.redirect;
                                }else {
                                    // Update the display to show the updated vote count
                                    setTimeout(delayedLog, 20000);
                                    if(response.votes >= 0)
                                    {
                                        $(upvoteCommentElements[i]).next().text(response.votes + ' Upvotes');
                                    }else
                                    {
                                        $(upvoteCommentElements[i]).next().text(response.votes + ' Downvotes');
                                    }

                                }
                                
                                console.log("it updates")
                            }
                        });

                        // Remove the "active" class from the current element
                        //upvoteCommentElements[i].className = upvoteCommentElements[i].className.replace("active", "");
                        upvoteCommentElements[i].classList.toggle("active");

                }

            });

            downvoteCommentElements[i].addEventListener("click", function() 
            {
                downvoteCommentElements[i].classList.add("active");
                if (downvoteCommentElements[i].style.backgroundColor == "rgb(204, 204, 204)") {
                    //add active class
                    downvoteCommentElements[i].style = "background-color: ''" 
                    upvoteCommentElements[i].style = "background-color: ''" 
                    
                    var commentId = $(this).data('commentid');
                    console.log(commentId)
                    //Make an AJAX request to update the up vote count for the comment
                    $.ajax({
                        url: `/comment/${commentId}/vote/unvote`,
                        type: 'POST',
                        success: function(response) {
                            if (response.redirect) {
                                // Update the URL in the browser to the new location
                                window.location.href = response.redirect;
                            }
                            // Update the display to show the updated vote count
                            setTimeout(delayedLog, 2000);
                            if(response.votes >= 0)
                            {
                                $(upvoteCommentElements[i]).next().text(response.votes + ' Upvotes');
                            }else{
                                $(upvoteCommentElements[i]).next().text(response.votes + ' Downvotes');
                            }

                            console.log("unvoted")
                        }
                    });

                } 
                else{
                    downvoteCommentElements[i].style = "background-color: #ccc;";
                    upvoteCommentElements[i].style = "background-color: ''";
                    
                    
                    var commentId = $(this).data('commentid');
                    console.log(commentId)
                    //Make an AJAX request to update the up vote count for the comment

                    $.ajax({
                        url: `/comment/${commentId}/vote/subtract`,
                        type: 'POST',
                        success: function(response) {
                            if (response.redirect) {
                                // Update the URL in the browser to the new location
                                window.location.href = response.redirect;
                            }
                            // Update the display to show the updated vote count
                            setTimeout(delayedLog, 2000);
                            if(response.votes >= 0)
                            {
                                $(upvoteCommentElements[i]).next().text(response.votes + ' Upvotes');
                            }else{
                                $(upvoteCommentElements[i]).next().text(response.votes + ' Downvotes');
                            }
                        }
                    });

                    // Remove the "active" class from the current element
                    downvoteCommentElements[i].classList.toggle("active");
                }
            });
        })(i)   

    }

    // post element functionality 
    for (var i = 0; i < upvotePostElements.length; i++) 
    {
        
        (function(i) 
        {
            upvotePostElements[i].addEventListener("click", function() 
            {
                // Add the "active" class to the current element
                //upvotePostElements[i].className += " active";
                upvotePostElements[i].classList.add("active");
                console.log(upvotePostElements[i].style.backgroundColor)
                if (upvotePostElements[i].style.backgroundColor == "rgb(204, 204, 204)" )
                {
                    upvotePostElements[i].style = "background-color: ''" 
                    downvotePostElements[i].style = "background-color: ''" 

                    var postId = $(this).data('postid');

                    //Make an AJAX request to unvote for post
                    $.ajax({
                        url: `/post/${postId}/vote/unvote/`,
                        type: 'POST',
                        success: function(response) {
                            if (response.redirect) {
                                // Update the URL in the browser to the new location
                                window.location.href = response.redirect;
                            }
                            // Update the display to show the updated vote count
                            setTimeout(delayedLog, 2000);
                            if(response.votes >= 0)
                            {
                                $(upvotePostElements[i]).next().text(response.votes + ' Upvotes ');
                            }else
                            {
                                $(upvotePostElements[i]).next().text(response.votes + ' Downvotes ');
                            }

                            console.log("post unvoted")
                        }
                    });
                }
                else
                {
                    upvotePostElements[i].style = "background-color: #ccc;";
                    downvotePostElements[i].style = "background-color: ''";
                    
                    console.log(upvotePostElements[i].className)
                    
                    var postId = $(this).data('postid');

                    //Make an AJAX request to update the up vote count for the comment
                        $.ajax({
                            url: `/post/${postId}/vote/add/`,
                            type: 'POST',
                            success: function(response) {
                                if (response.redirect) {
                                    // Update the URL in the browser to the new location
                                    window.location.href = response.redirect;
                                }
                                // Update the display to show the updated vote count
                                setTimeout(delayedLog, 2000);
                                if(response.votes >= 0)
                                {
                                    $(upvotePostElements[i]).next().text(response.votes + ' Upvotes ');
                                }else
                                {
                                    $(upvotePostElements[i]).next().text(response.votes + ' Downvotes ');
                                }


                                console.log("voted add")
                            }
                        });

                }

                    // Remove the "active" class from the current element
                    //upvotePostElements[i].className = upvotePostElements[i].className.replace("active", "");
                    upvotePostElements[i].classList.toggle("active");
                
            });
        

            downvotePostElements[i].addEventListener("click", function() 
            {
                //add active class
                //upvotePostElements[i].className += " active";
                downvotePostElements[i].classList.add("active");
                
                if (downvotePostElements[i].style.backgroundColor == "rgb(204, 204, 204)")
                {
                    downvotePostElements[i].style = "background-color: ''" 
                    upvotePostElements[i].style = "background-color: ''" 

                    var postId = $(this).data('postid');

                    //Make an AJAX request to unvote for post
                    $.ajax({
                        url: `/post/${postId}/vote/unvote/`,
                        type: 'POST',
                        success: function(response) {
                            if (response.redirect) {
                                // Update the URL in the browser to the new location
                                window.location.href = response.redirect;
                            }
                            // Update the display to show the updated vote count
                            setTimeout(delayedLog, 2000);
                            if(response.votes >= 0)
                            {
                                $(upvotePostElements[i]).next().text(response.votes + ' Upvotes ');
                            }else
                            {
                                $(upvotePostElements[i]).next().text(response.votes + ' Downvotes ');
                            }

                            console.log("unvoted")
                        }
                    });

                }
                else
                {
                    downvotePostElements[i].style = "background-color: #ccc;";
                    upvotePostElements[i].style = "background-color: ''";
                    
                    console.log(upvotePostElements[i].className)
                    
                    var postId = $(this).data('postid');

                    //Make an AJAX request to update the up vote count for the post
                    $.ajax({
                        url: `/post/${postId}/vote/subtract/`,
                        type: 'POST',
                        success: function(response) {
                            if (response.redirect) {
                                // Update the URL in the browser to the new location
                                window.location.href = response.redirect;
                            }
                            setTimeout(delayedLog, 2000);
                            // Update the display to show the updated vote count

                            if(response.votes >= 0)
                            {
                                $(upvotePostElements[i]).next().text(response.votes + ' Upvotes ');
                            }else
                            {
                                $(upvotePostElements[i]).next().text(response.votes + ' Downvotes ');
                            }


                            console.log("it updates")
                        }
                    });
            }
                // Remove the "active" class from the current element
                //downvotePostElements[i].className = upvotePostElements[i].className.replace("active", "");
                downvotePostElements[i].classList.toggle("active");

            });

        })(i) 

    }


    // reply element functionality 
    
    
    var upvoteReplyElements = document.getElementsByClassName('fa fa-arrow-up reply');
    var downvoteReplyElements = document.getElementsByClassName('fa fa-arrow-down reply');

    
    for (var i = 0; i < upvoteReplyElements.length; i++) 
    {
        (function(i) 
        {
            console.log(replyVoteCounter)
            upvoteReplyElements[i].addEventListener("click", function() 
            {
                console.log(replyVoteCounter)
                if (replyVoteCounter % 2 == 0) 
                {
                    // Add the "active" class to the current element
                    upvoteReplyElements[i].className += " active";
                    console.log(upvoteReplyElements[i].className)
                   
                   var replyId = $(this).data('replyid');
                   console.log(replyVoteCounter)

                    //Make an AJAX request to update the up vote count for the comment
                        $.ajax({
                            url: `/reply/${replyId}/vote/add/`,
                            type: 'POST',
                            success: function(response) {
                                if (response.redirect) {
                                    // Update the URL in the browser to the new location
                                    window.location.href = response.redirect;
                                }
                                setTimeout(delayedLog, 2000);
                                // Update the display to show the updated vote count

                                if(response.votes >= 0)
                                {
                                    $(upvoteReplyElements[i]).next().text(response.votes + ' Upvotes');
                                }else
                                {
                                    $(upvoteReplyElements[i]).next().text(response.votes + ' Downvotes');
                                }


                                console.log("it updates")
                            }
                        });

                        replyVoteCounter++;
                        document.cookie = "replyVoteCounter=" + replyVoteCounter;

                        // Remove the "active" class from the current element
                        upvoteReplyElements[i].className = upvoteReplyElements[i].className.replace("active", "");
                        
                }

            });

            downvoteReplyElements[i].addEventListener("click", function() 
            {
                console.log(replyVoteCounter)
                if (replyVoteCounter % 2 != 0) {
                    //add active class
                    console.log(downvoteReplyElements[i].className)
                    downvoteReplyElements[i].className += " active";
                    console.log(downvoteReplyElements[i].className)
                    
                    var replyId = $(this).data('replyid');
   
                    //Make an AJAX request to update the up vote count for the post
                    $.ajax({
                        url: `/reply/${replyId}/vote/subtract/`,
                        type: 'POST',
                        success: function(response) {
                            if (response.redirect) {
                                // Update the URL in the browser to the new location
                                window.location.href = response.redirect;
                            }
                            setTimeout(delayedLog, 2000);
                            // Update the display to show the updated vote count

                            if(response.votes >= 0)
                            {
                                $(upvoteReplyElements[i]).next().text(response.votes + ' Upvotes');
                            }else
                            {
                                $(upvoteReplyElements[i]).next().text(response.votes + ' Downvotes');
                            }


                            console.log("it updates")
                        }
                    });
                    replyVoteCounter--;
                    document.cookie = "replyVoteCounter=" + replyVoteCounter;

                    // Remove the "active" class from the current element
                    downvoteReplyElements[i].className = upvoteReplyElements[i].className.replace("active", "");
                } 

            });

        })(i) 

    }



    //nested reply functionality 

    var NestReplyCookie = document.cookie.split(";").find(function(cookie) {
        return cookie.startsWith("NestreplyVoteCounter=");
      });


      if (NestReplyCookie)
      {
          var NestreplyVoteCounter = parseInt(NestReplyCookie.split("=")[1]);
      }
      else{
          var NestreplyVoteCounter = 0;
      }
    
    var upvoteNestReplyElements = document.getElementsByClassName('fa fa-arrow-up nestreply');
    var downvoteNestReplyElements = document.getElementsByClassName('fa fa-arrow-down nestreply');

    
    for (var i = 0; i < upvoteNestReplyElements.length; i++) 
    {
        (function(i) 
        {
            console.log(NestreplyVoteCounter)
            upvoteNestReplyElements[i].addEventListener("click", function() 
            {
                console.log(NestreplyVoteCounter)
                if (NestreplyVoteCounter % 2 == 0) 
                {
                    // Add the "active" class to the current element
                    upvoteNestReplyElements[i].className += " active";
                    console.log(upvoteNestReplyElements[i].className)
                   
                   var nestreplyId = $(this).data('nestreply');
                   console.log(NestreplyVoteCounter)

                    //Make an AJAX request to update the up vote count for the comment
                        $.ajax({
                            url: `/reply/${nestreplyId}/vote/add/`,
                            type: 'POST',
                            success: function(response) {
                                // Update the display to show the updated vote count
                                console.log(response)
                                if (response.redirect) {
                                    // Update the URL in the browser to the new location
                                    window.location.href = response.redirect;
                                }
                                setTimeout(delayedLog, 2000);
                                if(response.votes >= 0)
                                {
                                    $(upvoteNestReplyElements[i]).next().text(response.votes + ' Upvotes');
                                }else
                                {
                                    $(upvoteNestReplyElements[i]).next().text(response.votes + ' Downvotes');
                                }

                                console.log("it updates")
                            }
                        });

                        NestreplyVoteCounter++;
                        document.cookie = "NestreplyVoteCounter=" + NestreplyVoteCounter;

                        // Remove the "active" class from the current element
                        upvoteNestReplyElements[i].className = upvoteNestReplyElements[i].className.replace("active", "");
                        
                }

            });

            downvoteNestReplyElements[i].addEventListener("click", function() 
            {
                console.log(NestreplyVoteCounter)
                if (NestreplyVoteCounter % 2 != 0) {
                    //add active class
                    console.log(downvoteNestReplyElements[i].className)
                    downvoteNestReplyElements[i].className += " active";
                    console.log(downvoteNestReplyElements[i].className)
                    
                    var nestreplyId = $(this).data('nestreply');
   
                    //Make an AJAX request to update the up vote count for the post
                    $.ajax({
                        url: `/reply/${nestreplyId}/vote/subtract/`,
                        type: 'POST',
                        success: function(response) {
                            // Update the display to show the updated vote count
                            if (response.redirect) {
                                // Update the URL in the browser to the new location
                                window.location.href = response.redirect;
                            }
                            setTimeout(delayedLog, 2000);

                            if(response.votes >= 0)
                            {
                                $(upvoteNestReplyElements[i]).next().text(response.votes + ' Upvotes');
                            }else
                            {
                                $(upvoteNestReplyElements[i]).next().text(response.votes + ' Downvotes');
                            }


                            console.log("it updates")
                        }
                    });
                    NestreplyVoteCounter--;
                    document.cookie = "NestreplyVoteCounter=" + NestreplyVoteCounter;

                    // Remove the "active" class from the current element
                    downvoteNestReplyElements[i].className = downvoteNestReplyElements[i].className.replace("active", "");
                } 

            });

        })(i) 

    }