document.addEventListener('DOMContentLoaded', (event) => {
    const predictButton = document.getElementById('predictButton');
    predictButton.addEventListener('click', uploadAndPredict);
    var class_names = ['Bacterial Pneumonia', 'Normal', 'Viral Pneumonia'];
    var xray_not = ['Not X-Ray', 'X-Ray']

    async function preprocessImage(image) {
        const tensor = tf.browser.fromPixels(image);
        const resized = tf.image.resizeBilinear(tensor, [299, 299]);
        const normalized = resized.div(tf.scalar(255));
        return normalized.expandDims(0); // Add a batch dimension
    }

    async function predictImage(image, model) {
        const preprocessedImage = await preprocessImage(image);
        const predictions = await model.predict(preprocessedImage);
        const classIndex = predictions.argMax(1).dataSync()[0];
        const probability = predictions.dataSync()[0][classIndex];
        return { classIndex, probability };
    }

    async function uploadAndPredict() {
        console.log('Button clicked!');
        const Model = await tf.loadLayersModel('model-xray/model.json');
        const loadedModel = await tf.loadLayersModel('model/model.json');
        console.log('Model loaded successfully!');
        const fileInput = document.getElementById('file');
        const file = fileInput.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = async (e) => {
                const loadedImage = new Image();
                loadedImage.onload = async () => {
                    try {
                        const model = Model;

                        if (model) {
                            const predictionResult = await predictImage(loadedImage, model);
                            const classLabel = xray_not[predictionResult.classIndex];
                            console.log(classLabel);
                            if (classLabel == 'Not X-Ray') {
                                document.getElementById('predictionText').textContent = `Prediction: ${classLabel}`;
                                const probabilityElement = document.getElementById('predictionProbability');
                                if (predictionResult.probability !== undefined) {
                                    const probabilityText = `(Probability: ${predictionResult.probability.toFixed(4)})`;
                                    probabilityElement.textContent = probabilityText;
                                } else {
                                    probabilityElement.textContent = ''; // Handle undefined probability
                                }

                                // Display the uploaded image
                                const uploadedImageElement = document.getElementById('uploadedImage');
                                uploadedImageElement.src = loadedImage.src;
                                uploadedImageElement.style.display = 'block'; // Make sure the image is visible

                                // Display the prediction result container
                                document.getElementById('predictionResult').style.display = 'block';
                            } else {

                                try {
                                    const model = loadedModel;

                                    if (model) {
                                        const predictionResult = await predictImage(loadedImage, model);
                                        const classLabel = class_names[predictionResult.classIndex];
                                        console.log(classLabel);
                                        document.getElementById('predictionText').textContent = `Prediction: ${classLabel}`;
                                        const probabilityElement = document.getElementById('predictionProbability');
                                        if (predictionResult.probability !== undefined) {
                                            const probabilityText = `(Probability: ${predictionResult.probability.toFixed(4)})`;
                                            probabilityElement.textContent = probabilityText;
                                        } else {
                                            probabilityElement.textContent = ''; // Handle undefined probability
                                        }

                                        // Display the uploaded image
                                        const uploadedImageElement = document.getElementById('uploadedImage');
                                        uploadedImageElement.src = loadedImage.src;
                                        uploadedImageElement.style.display = 'block'; // Make sure the image is visible

                                        // Display the prediction result container
                                        document.getElementById('predictionResult').style.display = 'block';
                                    } else {
                                        alert('Error loading model');
                                    }
                                } catch (error) {
                                    console.error('Error during prediction:', error);
                                    alert('An error occurred during prediction');
                                }

                            }
                        } else {
                            alert('Error loading model');
                        }
                    } catch (error) {
                        console.error('Error during prediction:', error);
                        alert('An error occurred during prediction');
                    }
                };

                loadedImage.src = e.target.result;
            };

            reader.readAsDataURL(file);
        }
    }
});