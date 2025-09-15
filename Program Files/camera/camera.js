"use strict";

// Camera application JavaScript
let video, canvas, ctx;
let stream = null;
let capturedImageData = null;

// Helper functions for managing disabled state of anchor elements
function setDisabled(elementId, disabled) {
    const element = document.getElementById(elementId);
    if (disabled) {
        element.setAttribute('disabled', 'disabled');
    } else {
        element.removeAttribute('disabled');
    }
}

// Initialize the camera application
function initCamera() {
    video = document.getElementById('video');
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    
    updateStatus('Camera app initialized. Starting camera...');
    
    // Auto-start camera when app loads
    startCamera();
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
            setDisabled('stop-camera-btn', false);
            setDisabled('capture-btn', false);
        };
        
    } catch (error) {
        console.error('Error accessing camera:', error);
        updateStatus('Tap anywhere to start camera. Camera access required.', 'error');
        
        // Add click handler to retry camera start
        document.getElementById('camera-container').addEventListener('click', () => {
            startCamera();
        }, { once: true });
    }
}

// Stop the camera
function stopCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
        video.srcObject = null;
    }
    
    setDisabled('stop-camera-btn', true);
    setDisabled('capture-btn', true);
    
    updateStatus('Camera stopped.');
}

// Capture a demo photo (for testing without camera)
function captureDemo() {
    try {
        const resolution = document.getElementById('resolution').value;
        const [width, height] = resolution.split('x').map(Number);
        
        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;
        
        // Create a colorful demo image
        ctx.fillStyle = '#4a90e2';
        ctx.fillRect(0, 0, width, height);
        
        // Add some patterns to make it more realistic
        ctx.fillStyle = '#ff6b6b';
        ctx.fillRect(width * 0.1, height * 0.1, width * 0.3, height * 0.3);
        
        ctx.fillStyle = '#4ecdc4';
        ctx.fillRect(width * 0.6, height * 0.2, width * 0.3, height * 0.3);
        
        ctx.fillStyle = '#45b7d1';
        ctx.fillRect(width * 0.2, height * 0.6, width * 0.6, height * 0.3);
        
        // Add text
        ctx.fillStyle = '#ffffff';
        ctx.font = Math.floor(width / 20) + 'px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('MainOS Camera Demo', width / 2, height / 2);
        ctx.fillText(`${width}x${height}`, width / 2, height / 2 + Math.floor(width / 15));
        
        const now = new Date();
        ctx.fillText(now.toLocaleString(), width / 2, height / 2 + Math.floor(width / 10));
        
        // Get the quality setting
        const quality = parseFloat(document.getElementById('quality').value);
        
        // Convert canvas to compressed JPEG
        capturedImageData = canvas.toDataURL('image/jpeg', quality);
        
        // Show preview
        showPreview(capturedImageData, width, height, quality);
        
        updateStatus(`Demo photo captured! Resolution: ${width}x${height}, Quality: ${quality}`, 'success');
        setDisabled('save-btn', false);
        
    } catch (error) {
        console.error('Error capturing demo photo:', error);
        updateStatus('Error: Failed to capture demo photo.', 'error');
    }
}
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
        setDisabled('save-btn', false);
        
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
        
        // Get username, fallback to default if not available
        const username = (system?.user?.username) || 'default';
        const filepath = `C:/users/${username}/photos/${filename}`;
        
        // Ensure the photos directory exists
        await ensureDirectoryExists(`C:/users/${username}/photos`);
        
        // Convert base64 to blob and save
        const base64Data = capturedImageData.split(',')[1];
        
        // Save using MainOS filesystem (use save method instead of write)
        iofs.save(filepath, base64Data, "t=jpg", true);
        
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
            iofs.save(dirPath, "", "t=d", true);
        }
    } catch (error) {
        console.warn('Could not create directory:', dirPath, error);
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
    // Open Explorer to photos folder
    const username = (system?.user?.username) || 'default';
    if (window.parent && window.parent.run) {
        window.parent.run('explorer', {startDir: `C:/users/${username}/photos`});
    }
}

// Hide preview and return to camera view
function hidePreview() {
    document.getElementById('preview-container').style.display = 'none';
    video.style.display = 'block';
    setDisabled('save-btn', true);
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
        return false;
    }
    return true;
}

// Handle keyboard shortcuts
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        event.preventDefault();
        capturePhoto();
    } else if (event.code === 'Enter') {
        event.preventDefault();
        if (!document.getElementById('save-btn').hasAttribute('disabled')) {
            savePhoto();
        }
    } else if (event.code === 'Escape') {
        event.preventDefault();
        if (document.getElementById('preview-container').style.display !== 'none') {
            hidePreview();
        }
    }
});

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