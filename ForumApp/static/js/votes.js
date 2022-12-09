
    var myCookie = document.cookie.split(";").find(function(cookie) {
        return cookie.startsWith("votedcounter=");

      });

      var PostCookie = document.cookie.split(";").find(function(cookie) {
        return cookie.startsWith("postVoteCounter=");
      });
    var upvoteCommentElements = document.getElementsByClassName('fa fa-arrow-up comment');
    var downvoteCommentElements = document.getElementsByClassName('fa fa-arrow-down comment');
    
    var upvotePostElements = document.getElementsByClassName('fa fa-arrow-up post');
    var downvotePostElements = document.getElementsByClassName('fa fa-arrow-down post');


    if (myCookie) {
        // If the cookie exists, retrieve its value and store it in the votes variable
        var votedcounter = parseInt(myCookie.split("=")[1]);
        
      } else {
        // If the cookie does not exist, set the initial value of the votes variable to 0
        var votedcounter = 0;
        
      }

      if (PostCookie){
            var postVoteCounter = parseInt(PostCookie.split("=")[1]);

        } 
        else {

            var postVoteCounter = 0;
        }

    // Loop through the elements
    for (var i = 0; i < upvoteCommentElements.length; i++) 
    {
        
        (function(i) 
        {
            upvoteCommentElements[i].addEventListener("click", function() 
            {
                console.log(votedcounter)
         
                //if (upvoteCommentElements[i].className.indexOf("active") > -1) {
                    
                if (votedcounter % 2 == 0) 
                {
                    // Add the "active" class to the current element
                    upvoteCommentElements[i].className += " active";
                    console.log(upvoteCommentElements[i].className)
                   
                   var commentId = $(this).data('commentid');
                   console.log(votedcounter)

                    //Make an AJAX request to update the up vote count for the comment
                        $.ajax({
                            url: `/comment/${commentId}/vote/add`,
                            type: 'POST',
                            success: function(response) {
                                // Update the display to show the updated vote count

                                if(response.votes >= 0)
                                {
                                    $(upvoteCommentElements[i]).next().text(response.votes + ' Upvotes');
                                }else
                                {
                                    $(upvoteCommentElements[i]).next().text(response.votes + ' Downvotes');
                                }


                                console.log("it updates")
                            }
                        });

                        votedcounter++;
                        document.cookie = "votedcounter=" + votedcounter;

                        // Remove the "active" class from the current element
                        upvoteCommentElements[i].className = upvoteCommentElements[i].className.replace("active", "");
                        
                }

            });

            downvoteCommentElements[i].addEventListener("click", function() 
            {
                if (votedcounter % 2 != 0) {
                    //add active class
                    console.log(upvoteCommentElements[i].className)
                    upvoteCommentElements[i].className += " active";
                    console.log(upvoteCommentElements[i].className)
                    
                    var commentId = $(this).data('commentid');
                    console.log(commentId)
                    console.log(votedcounter)
                    //Make an AJAX request to update the up vote count for the comment

                    $.ajax({
                        url: `/comment/${commentId}/vote/subtract`,
                        type: 'POST',
                        success: function(response) {
                            // Update the display to show the updated vote count
            
                            if(response.votes >= 0)
                            {
                                $(upvoteCommentElements[i]).next().text(response.votes + ' Upvotes');
                            }else{
                                $(upvoteCommentElements[i]).next().text(response.votes + ' Downvotes');
                            }
                        }
                    });
                    votedcounter--;
                    document.cookie = "votedcounter=" + votedcounter;

                    // Remove the "active" class from the current element
                    upvoteCommentElements[i].className = upvoteCommentElements[i].className.replace("active", "");
                } 

            });

        })(i)   

    }

    // post element functionality 
    for (var i = 0; i < upvotePostElements.length; i++) 
    {
        
        (function(i) 
        {
            console.log(postVoteCounter)
            upvotePostElements[i].addEventListener("click", function() 
            {
                console.log(postVoteCounter)
                if (postVoteCounter % 2 == 0) 
                {
                    // Add the "active" class to the current element
                    upvotePostElements[i].className += " active";
                    console.log(upvotePostElements[i].className)
                   
                   var postId = $(this).data('postid');
                   console.log(postVoteCounter)

                    //Make an AJAX request to update the up vote count for the comment
                        $.ajax({
                            url: `/post/${postId}/vote/add/`,
                            type: 'POST',
                            success: function(response) {
                                // Update the display to show the updated vote count

                                if(response.votes >= 0)
                                {
                                    $(upvotePostElements[i]).next().text(response.votes + ' Upvotes');
                                }else
                                {
                                    $(upvotePostElements[i]).next().text(response.votes + ' Downvotes');
                                }


                                console.log("it updates")
                            }
                        });

                        postVoteCounter++;
                        document.cookie = "postVoteCounter=" + postVoteCounter;

                        // Remove the "active" class from the current element
                        upvotePostElements[i].className = upvotePostElements[i].className.replace("active", "");
                        
                }

            });

            downvotePostElements[i].addEventListener("click", function() 
            {
                console.log(postVoteCounter)
                if (postVoteCounter % 2 != 0) {
                    //add active class
                    console.log(upvotePostElements[i].className)
                    upvotePostElements[i].className += " active";
                    console.log(upvotePostElements[i].className)
                    
                    var postId = $(this).data('postid');
   
                    //Make an AJAX request to update the up vote count for the post
                    $.ajax({
                        url: `/post/${postId}/vote/subtract/`,
                        type: 'POST',
                        success: function(response) {
                            // Update the display to show the updated vote count

                            if(response.votes >= 0)
                            {
                                $(upvotePostElements[i]).next().text(response.votes + ' Upvotes');
                            }else
                            {
                                $(upvotePostElements[i]).next().text(response.votes + ' Downvotes');
                            }


                            console.log("it updates")
                        }
                    });
                    postVoteCounter--;
                    document.cookie = "postVoteCounter=" + postVoteCounter;

                    // Remove the "active" class from the current element
                    upvotePostElements[i].className = upvotePostElements[i].className.replace("active", "");
                } 

            });

        })(i) 

    }