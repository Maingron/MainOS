"use strict";

// Camera application JavaScript
let video, canvas, ctx;
let stream = null;
let capturedImageData = null;

// Initialize the camera application
function initCamera() {
    video = document.getElementById('video');
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    
    updateStatus('Camera app initialized. Click "Start Camera" to begin.');
}

// Start the camera
async function startCamera() {
    try {
        updateStatus('Requesting camera access...');
        
        const constraints = {
            video: {
                width: { ideal: 640 },
                height: { ideal: 480 },
                facingMode: 'environment' // Prefer back camera on mobile
            },
            audio: false
        };
        
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = stream;
        
        video.onloadedmetadata = () => {
            updateStatus('Camera started successfully. Ready to capture photos.');
            document.getElementById('start-camera-btn').disabled = true;
            document.getElementById('stop-camera-btn').disabled = false;
            document.getElementById('capture-btn').disabled = false;
        };
        
    } catch (error) {
        console.error('Error accessing camera:', error);
        updateStatus('Error: Could not access camera. Please check permissions.', 'error');
    }
}

// Stop the camera
function stopCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
        video.srcObject = null;
    }
    
    document.getElementById('start-camera-btn').disabled = false;
    document.getElementById('stop-camera-btn').disabled = true;
    document.getElementById('capture-btn').disabled = true;
    
    updateStatus('Camera stopped.');
}

// Capture a photo
function capturePhoto() {
    if (!stream) {
        updateStatus('Error: Camera not started.', 'error');
        return;
    }
    
    try {
        const resolution = document.getElementById('resolution').value;
        const [width, height] = resolution.split('x').map(Number);
        
        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;
        
        // Draw the current video frame to canvas
        ctx.drawImage(video, 0, 0, width, height);
        
        // Get the quality setting
        const quality = parseFloat(document.getElementById('quality').value);
        
        // Convert canvas to compressed JPEG
        capturedImageData = canvas.toDataURL('image/jpeg', quality);
        
        // Show preview
        showPreview(capturedImageData, width, height, quality);
        
        updateStatus('Photo captured successfully!', 'success');
        document.getElementById('save-btn').disabled = false;
        
    } catch (error) {
        console.error('Error capturing photo:', error);
        updateStatus('Error: Failed to capture photo.', 'error');
    }
}

// Show preview of captured photo
function showPreview(imageData, width, height, quality) {
    const previewContainer = document.getElementById('preview-container');
    const previewImage = document.getElementById('preview-image');
    const photoInfo = document.getElementById('photo-info');
    
    previewImage.src = imageData;
    
    // Calculate approximate file size
    const sizeBytes = Math.round((imageData.length - 'data:image/jpeg;base64,'.length) * 3 / 4);
    const sizeKB = (sizeBytes / 1024).toFixed(1);
    
    photoInfo.innerHTML = `
        <strong>Preview:</strong><br>
        Resolution: ${width}x${height}<br>
        Quality: ${quality}<br>
        Estimated size: ${sizeKB} KB
    `;
    
    previewContainer.style.display = 'block';
    video.style.display = 'none';
}

// Save the captured photo
async function savePhoto() {
    if (!capturedImageData) {
        updateStatus('Error: No photo to save.', 'error');
        return;
    }
    
    try {
        const filename = document.getElementById('filename').value || 'photo.jpg';
        const filepath = `C:/Users/${system.user.username}/Pictures/${filename}`;
        
        // Ensure the Pictures directory exists
        await ensureDirectoryExists(`C:/Users/${system.user.username}/Pictures`);
        
        // Convert base64 to blob and save
        const base64Data = capturedImageData.split(',')[1];
        
        // Save using MainOS filesystem
        iofs.write(filepath, base64Data);
        
        updateStatus(`Photo saved as ${filename}`, 'success');
        
        // Generate a new filename for next photo
        generateNextFilename();
        
    } catch (error) {
        console.error('Error saving photo:', error);
        updateStatus('Error: Failed to save photo.', 'error');
    }
}

// Ensure directory exists
async function ensureDirectoryExists(dirPath) {
    try {
        if (!iofs.exists(dirPath)) {
            iofs.mkdir(dirPath);
        }
    } catch (error) {
        console.warn('Could not create directory:', dirPath);
    }
}

// Generate next filename
function generateNextFilename() {
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, '-').substring(0, 19);
    document.getElementById('filename').value = `photo-${timestamp}.jpg`;
}

// View saved photos
function viewPhotos() {
    // Open Explorer to Pictures folder
    if (window.parent && window.parent.run) {
        window.parent.run('explorer', {startDir: `C:/Users/${system.user.username}/Pictures`});
    }
}

// Hide preview and return to camera view
function hidePreview() {
    document.getElementById('preview-container').style.display = 'none';
    video.style.display = 'block';
    document.getElementById('save-btn').disabled = true;
    capturedImageData = null;
}

// Update status message
function updateStatus(message, type = 'info') {
    const statusEl = document.getElementById('status');
    statusEl.textContent = message;
    statusEl.className = type;
}

// Check camera support
function checkCameraSupport() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        updateStatus('Error: Camera not supported in this browser.', 'error');
        document.getElementById('start-camera-btn').disabled = true;
        return false;
    }
    return true;
}

// Handle window unload
window.addEventListener('beforeunload', () => {
    stopCamera();
});

// Initialize when page loads
window.addEventListener('load', () => {
    if (checkCameraSupport()) {
        initCamera();
        generateNextFilename();
    }
});

// Initialize immediately if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (checkCameraSupport()) {
            initCamera();
            generateNextFilename();
        }
    });
} else {
    if (checkCameraSupport()) {
        initCamera();
        generateNextFilename();
    }
}