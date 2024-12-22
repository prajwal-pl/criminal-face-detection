let labeledFaceDescriptors = [];

window.onload = async () => {
    try {
        // Load face-api.js models
        await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
            faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
            faceapi.nets.faceRecognitionNet.loadFromUri('/models')
        ]);
        console.log('Models loaded successfully');
    } catch (error) {
        console.error('Error loading models:', error);
    }
};

const uploadInput = document.getElementById('upload');
const uploadedImage = document.getElementById('uploadedImage');
const resultsContainer = document.getElementById('results');

uploadInput.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (file) {
        const imgUrl = URL.createObjectURL(file);
        uploadedImage.src = imgUrl;
        uploadedImage.style.display = 'block';
        await detectFaces(imgUrl);
    }
});

async function loadLabeledImages() {
    // This is where we'll load reference images
    const labels = ['person1', 'person2']; // Replace with actual names
    
    for (let label of labels) {
        const descriptions = [];
        const img = await faceapi.fetchImage(`reference_photos/${label}.jpg`);
        const detections = await faceapi
            .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptor();
        
        if (detections) {
            descriptions.push(detections.descriptor);
            labeledFaceDescriptors.push(new faceapi.LabeledFaceDescriptors(label, descriptions));
        }
    }
}

async function detectFaces(imageUrl) {
    try {
        // Clear previous results
        resultsContainer.innerHTML = '';
        
        const img = await faceapi.fetchImage(imageUrl);
        const canvas = faceapi.createCanvasFromMedia(img);
        resultsContainer.append(canvas);
        
        // Calculate the display size while maintaining aspect ratio
        const maxWidth = 900;
        const aspectRatio = img.width / img.height;
        const displaySize = {
            width: Math.min(maxWidth, img.width),
            height: Math.min(maxWidth / aspectRatio, img.height)
        };
        
        // Update image size
        uploadedImage.style.width = displaySize.width + 'px';
        uploadedImage.style.height = displaySize.height + 'px';
        
        faceapi.matchDimensions(canvas, displaySize);
        
        const detections = await faceapi
            .detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptors();
        
        if (labeledFaceDescriptors.length === 0) {
            await loadLabeledImages();
        }
        
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        
        if (labeledFaceDescriptors.length > 0) {
            const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);
            
            resizedDetections.forEach(detection => {
                const bestMatch = faceMatcher.findBestMatch(detection.descriptor);
                const box = detection.detection.box;
                const drawBox = new faceapi.draw.DrawBox(box, {
                    label: bestMatch.toString(),
                    lineWidth: 2,
                    boxColor: 'red',
                    drawLabelOptions: {
                        fontSize: 16,
                        padding: 5,
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        fontColor: 'white'
                    }
                });
                drawBox.draw(canvas);
            });
        } else {
            // If no reference images are loaded, just draw boxes
            faceapi.draw.drawDetections(canvas, resizedDetections);
        }
        
        // Set canvas size to match image
        canvas.style.width = displaySize.width + 'px';
        canvas.style.height = displaySize.height + 'px';
        
    } catch (error) {
        console.error('Error in face detection:', error);
        resultsContainer.innerHTML = `<p>Error processing image: ${error.message}</p>`;
    }
}
