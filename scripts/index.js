const IMG_DIR = 'images/';
const MAX_DIMENSION = '225';

/******************************************************************************/
// Getters

function getOverlayLayer() {
    return document.querySelector('[data-overlay-layer]');
}

function getOverlayImageContainer() {
    return document.querySelector('[data-overlay-image-container]');
}

function getOverlayImage() {
    return document.querySelector('[data-overlay-image]');
}

function getOverlayImageIndex() {
    return getOverlayImage().getAttribute('data-image-index');
}

function getOverlayImageCaption() {
    return document.querySelector('[data-caption]');
}

function getOverlayImageAttrib() {
    return document.querySelector('[data-attrib]');
}

function getOverlayImageAttribUrl() {
    return document.querySelector('[data-attrib-url]');
}

function getImages(){
    return document.querySelectorAll('[data-thumbnail]');
}

function getLeftArrowButton() {
    return document.querySelector('[data-overlay-left-arrow]');
}

function getRightArrowButton() {
    return document.querySelector('[data-overlay-right-arrow]');
}

function getFirstImageElement() {
    var images = getImages();
    return images[0];
}

/******************************************************************************/
// Helper functions

// Copied from http://www.primaryobjects.com/2012/11/19/parsing-hostname-and-domain-from-a-url-with-javascript/
function getHostName(url) {
    var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
    if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
    return match[2];
    }
    else {
        return null;
    }
}

function getFileName(path) {
    return path.split('\\').pop().split('/').pop();;
}

function toggleOverlayLayer() {
    getOverlayLayer().classList.toggle('hidden');
}

function hideOverlayLayer() {
    getOverlayLayer().classList.add('hidden');
}

function resizeImage(image) {
    var width, height;
    var ratio = 1;
    var wait = setInterval(function() {
        width = image.naturalWidth;
        height = image.naturalHeight;
        if (width && height) {
            clearInterval(wait);       
            if (height > MAX_DIMENSION) {
                ratio = MAX_DIMENSION / height;
                width = width * ratio;
                height = height * ratio;
            }
            if (width > MAX_DIMENSION) { 
                ratio = MAX_DIMENSION / width;
                width = width * ratio;
                height = height * ratio;
            }
            image.width = width;
            image.height = height;          
            return image;
        }
    }, 30);   
}

function getImageIndex (imageElement) {
    var images = getImages();
    var fileName = getFileName(imageElement.src);
    var currentIndex;
    var position = 'middle';
    images.forEach((image, index) => {
        if (getFileName(image.src) == fileName) {
            currentIndex = index;
        }
    });
    if (currentIndex == 0) {position = 'first'}
    if (currentIndex == images.length - 1) { position = 'last'}
    return {
        index: currentIndex,
        position: position
    };
}

function toggleArrowButtons(position) {
    if (position == 'first') {
        getLeftArrowButton().classList.add('see-through');
        getRightArrowButton().classList.remove('see-through');
    } else if (position == 'last') {
        getLeftArrowButton().classList.remove('see-through');
        getRightArrowButton().classList.add('see-through');
    } else {
        getLeftArrowButton().classList.remove('see-through');
        getRightArrowButton().classList.remove('see-through');
    }
}

function loadImage(image, element) {
    element.setAttribute('src', IMG_DIR + image.src);
    element.setAttribute('alt', image.caption);
}

function loadImageGrid(IMAGE_ARRAY) {
    var imageContainer = document.querySelector('[data-image-grid]');
    IMAGE_ARRAY.forEach((image) => {
        var imgElement = document.createElement('img');
        loadImage(image, imgElement);
        imgElement.setAttribute('data-thumbnail','');
        imgElement.addEventListener('click', event => {
            event.preventDefault();
            loadOverlayImage(image);
            toggleOverlayLayer();
        });
        imgElement.onload = resizeImage(imgElement);
        var aElement = document.createElement('a');
        aElement.setAttribute('href', '#');
        var divElement = document.createElement('div');
        aElement.appendChild(imgElement);
        divElement.appendChild(aElement);
        imageContainer.appendChild(divElement);
    });
}

function loadOverlayImage(imageData) {
    var img = getOverlayImage();
    var imgCaption = getOverlayImageCaption();
    var imgAttribUrl = getOverlayImageAttribUrl();
    loadImage(imageData, img);
    imgCaption.textContent = imageData.caption;
    imgAttribUrl.setAttribute('href', imageData.attrib);
    imgAttribUrl.textContent = getHostName(imageData.attrib);
    var currentLocation = getImageIndex(img);
    var position = currentLocation.position;
    toggleArrowButtons(position);
}

function loadNextImage(direction) {
    var img = getOverlayImage();
    var newIndex;
    var currentLocation = getImageIndex(img);
    var currentIndex = currentLocation.index;
    var position = currentLocation.position;
    if (direction == 'L' && position != 'first') {
        newIndex = currentIndex - 1;
    } else if (direction == 'R' && position != 'last') {
        newIndex = currentIndex + 1;
    } else {
        newIndex = currentIndex;
    }
    loadOverlayImage(IMAGE_LIST[newIndex]);
}

function leftArrow() {
    if (getOverlayImage().src) {
        loadNextImage('L');
    }
}

function rightArrow() {
    if (getOverlayImage().src) {
        loadNextImage('R');
    }
}

/******************************************************************************/
// Listeners

function addOverlayImageOnLoadListener() {
    // To get current overlay image height and set that on parent container. Sidebar
    // would not stretch to full height without that.
    var image = getOverlayImage();
    image.addEventListener('load', event => {
        getOverlayImageContainer().setAttribute('style', `height: ${image.height}px`);
    });
    window.addEventListener('resize', event => {
        getOverlayImageContainer().setAttribute('style', `height: ${image.height}px`);
    });
}

function addOverlayExitListener() {
    // Button
    var overlayExitIcon = document.querySelector('[data-overlay-exit]');
    overlayExitIcon.addEventListener('click', event => {
        hideOverlayLayer();
    });
    // Escape key
    document.addEventListener( 'keydown', event => {
        if (event.keyCode == 27) {
            hideOverlayLayer();
        }
    });
}

function addLeftButtonListener() {
    // Button
    var leftButton = document.querySelector('[data-overlay-left-arrow]');
    leftButton.addEventListener( 'click', event => {
        leftArrow();
    });
    // Left arrow key
    document.addEventListener( 'keydown', event => {
        if (event.keyCode == 37) {
            leftArrow();
        }
    });
}

function addRightButtonListener() {
    // Button
    var rightButton = document.querySelector('[data-overlay-right-arrow]');
    rightButton.addEventListener( 'click', event => {
        rightArrow();
    });
    // Right arrow key
    document.addEventListener( 'keydown', event => {
        if (event.keyCode == 39) {
            rightArrow();
        }
    });
}

/******************************************************************************/
// Main program

function tempWorkOnOverlayLayer(){
    getFirstImageElement().click();
    toggleArrowButtons('first');
}

function main() {
    loadImageGrid(IMAGE_LIST);
    addOverlayImageOnLoadListener();
    addOverlayExitListener();
    addLeftButtonListener();
    addRightButtonListener();

    // tempWorkOnOverlayLayer();
}

main();