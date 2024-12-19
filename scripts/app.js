// Select elements
const upload = document.getElementById('upload');
const result = document.getElementById('result');

// Load the model
async function loadModel() {
    const model = await tf.loadGraphModel('model/model.json'); // Load model from the folder
    console.log("Model loaded successfully!");
    return model;
}

// Predict the color
async function predictColor(file, model) {
    // Create an image element from the uploaded file
    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);

    img.onload = async () => {
        // Convert the image to a tensor (AI-compatible format)
        const tensor = tf.browser.fromPixels(img)
            .resizeNearestNeighbor([224, 224]) // Resize to 224x224 pixels
            .expandDims(); // Add batch dimension

        // Run the prediction
        const predictions = await model.predict(tensor).data();

        // Find the color with the highest confidence
        const colors = ['Red', 'Green', 'Blue']; // Replace with your actual categories
        const maxIndex = predictions.indexOf(Math.max(...predictions));

        // Show the result
        result.textContent = `Predicted Color: ${colors[maxIndex]}`;
    };
}

// Initialize the app
loadModel().then((model) => {
    // Trigger prediction when a file is uploaded
    upload.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            predictColor(file, model);
        }
    });
});
