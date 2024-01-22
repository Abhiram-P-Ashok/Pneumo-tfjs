function uploadAndPredict() {
    var formData = new FormData($('#uploadForm')[0]);

    $.ajax({
        type: 'POST',
        url: '/',  // Change this to the correct route
        data: formData,
        contentType: false,
        processData: false,
        success: function (data) {
            console.log('Success Data:', data);
        
            // Update the prediction and image on the same page
            $('#predictionText').text('Prediction: ' + data.prediction);
            $('#uploadedImage').attr('src', '/static/uploads/' + data.filename);
            $('#predictionResult').show();
        },
        
        error: function (error) {
            console.log('Error:', error);
        }
    });
}
