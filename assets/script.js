/* Load TensorFlow.js
var class_names = ['Bacterial Pneumonia', 'Normal', 'Viral Pneumonia'];
async function loadModel() {
    try {
        const modelJson = await fetch('model/model.json');
        const modelJsonData = await modelJson.json();
        const modelWeights = await Promise.all([
            fetch('model/group1-shard1of3.bin'),
            fetch('model/group1-shard2of3.bin'),
            fetch('model/group1-shard3of3.bin')
        ]);
        const modelWeightsData = await Promise.all(modelWeights.map(response => response.arrayBuffer()));

        const model = await tf.loadLayersModel(bundleResourceProvider(modelJsonData, modelWeightsData));
        return model;
    } catch (error) {
        console.error('Error loading model:', error);
        return null;
    }
}


function bundleResourceProvider(modelJsonData, modelWeightsData) {
    return {
        async modelJson() {
            return modelJsonData;
        },
        async weights() {
            return modelWeightsData;
        },
        async load() {
            // No explicit loading needed for in-memory data
        }
    };
}

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
function uploadAndPredict() {
    const fileInput = document.getElementById('file');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
            const loadedImage = new Image();
            loadedImage.src = e.target.result;
            loadedImage.onload = async () => {
                try {
                    const model = await loadModel();
                    if (model) {
                        const predictionResult = await predictImage(loadedImage, model);
                        const classLabel = class_names[predictionResult.classIndex]; // Assuming class_names is defined globally
                        document.getElementById('predictionText').textContent = `Prediction: ${classLabel} (Probability: ${predictionResult.probability.toFixed(4)})`;
                        document.getElementById('uploadedImage').src = loadedImage.src;
                    } else {
                        alert('Error loading model');
                    }
                } catch (error) {
                    console.error('Error during prediction:', error);
                    alert('An error occurred during prediction');
                }
            };
        };
        reader.readAsDataURL(file);
    }
}
document.getElementById('predictButton').addEventListener('click', uploadAndPredict);
*/
  