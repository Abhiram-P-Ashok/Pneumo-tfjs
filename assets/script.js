var model;
var img;
var classNames = [];
var _validFileExtensions = [".jpg", ".jpeg", ".png"];    
function Validate(oForm) {
    img = oForm.getElementsByTagName("input");
    for (var i = 0; i < img.length; i++) {
        var oInput = img[i];
        if (oInput.type == "file") {
            var sFileName = oInput.value;
            if (sFileName.length > 0) {
                var blnValid = false;
                for (var j = 0; j < _validFileExtensions.length; j++) {
                    var sCurExtension = _validFileExtensions[j];
                    if (sFileName.substr(sFileName.length - sCurExtension.length, sCurExtension.length).toLowerCase() == sCurExtension.toLowerCase()) {
                        blnValid = true;
                        break;
                    }
                }
                
                if (!blnValid) {
                    alert("Sorry, " + sFileName + " is invalid, allowed extensions are: " + _validFileExtensions.join(", "));
                    return false;
                }
            }
        }
    }
  
    return true;
}
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