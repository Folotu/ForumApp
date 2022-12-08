// Get a reference to the button and the container for the text field

// const button = document.getElementById('my-button');
// const textFieldContainer = document.getElementById('text-field-container');



// // Add an event listener that listens for a click event on the button
// button.addEventListener('click', function() {
//     // Check if the container already contains a text field
//     if (textFieldContainer.children.length > 0) {
//         // If the container already contains a text field, then return without adding another one
//         return;
//     }

//     // Create the text field
//     const textField = document.createElement('input');
//     textField.type = 'text';

//     // Add the text field to the container
//     textFieldContainer.appendChild(textField);

//     // Show the container
//     textFieldContainer.style.display = 'block';
// });


// const button = document.getElementsByClassName('btn btn-primary comm');

// const textFieldContainer = document.getElementsByClassName('btn btn-primary commfield');

// console.log(button)
// for (i = 0; i < button.length; i++) {
// // Add an event listener that listens for a click event on the button
// button.addEventListener('click', 
// function() 
// {
//     button[i].addEventListener
//     ('click', function()
//         {
//             console.log(this)
//     // Check if the container already contains a text field
//     // if (textFieldContainer.children.length > 0) {
//     //     // If the container already contains a text field, then return without adding another one
//     //     return;
//     // }

//     // Create the text field
//     // const textField = document.createElement('input');
//     // textField.type = 'text';

//     // Add the text field to the container
//     // textFieldContainer.appendChild(textField);



//     // Show the container
//     textFieldContainer.style.display = 'block';
//         }
//     )
// })};


 const button = document.getElementById('comment-button');

 const textFieldContainer = document.getElementById('comment-text');



// Add an event listener that listens for a click event on the button
button.addEventListener('click', function() {
    // Check if the container already contains a text field
    if (textFieldContainer.children.length > 0) {
        // If the container already contains a text field, then return without adding another one
        return;
    }

    // Create the text field
    const textField = document.createElement('input');
    textField.type = 'text';

    // Add the text field to the container
    textFieldContainer.appendChild(textField);

    // Show the container
    textFieldContainer.style.display = 'block';
});

$("#comment-button").click(function() 
{
   
    $("#comDiv").toggle();

});


$("#reply-button").click(function() 
{
   
    $("#repDiv").toggle();

});


$("#replyNest-button").click(function() 
{
   
    $("#NestrepDiv").toggle();

});