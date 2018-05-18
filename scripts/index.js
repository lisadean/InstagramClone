const IMG_DIR = 'images/';
const MAX_DIMENSION = '225';

var imageList = [
    {
        src: 'three-otter-babies.jpg',
        caption: 'Three baby otters at the Cleveland Metroparks Zoo',
        attrib: 'https://www.clevescene.com/scene-and-heard/archives/2017/11/17/three-adorable-baby-otters-born-at-the-cleveland-metroparks-zoo'
    },
    {
        src: 'playful-otters.jpeg',
        caption: 'Playful otters',
        attrib: 'http://www.pbs.org/wnet/nature/charlie-curious-otters/15571/'
    },
    {
        src: 'laughing-otter.jpg',
        caption: 'Winking otter',
        attrib: 'https://www.mnn.com/earth-matters/animals/photos/15-fascinating-facts-about-otters/otterly-awesome'
    },
    {
        src: 'mother-sleeping-pup.jpg',
        caption: 'Mother otter cuddling sleeping pup',
        attrib: 'https://www.telegraph.co.uk/news/2016/10/26/sea-otter-cuddles-her-pup-to-keep-it-dry-and-warm-while-it-sleep/'
    },
    {
        src: 'otter-blep.jpg',
        caption: "Otter 'blep'",
        attrib: 'https://grandfather.com/things-to-do/wildlife-habitats/river-otters/'
    },
    {
        src: 'otter-eating-alligator.jpg',
        caption: 'Otter eating alligator',
        attrib: 'https://news.nationalgeographic.com/news/2014/03/140306-otter-alligator-florida-predator-photos-wildlife/'
    },
    {
        src: 'derpy-otter.jpg',
        caption: 'Derpy otter',
        attrib: 'https://www.littlethings.com/fall-in-love-with-otters/'
    },
    {
        src: 'otter-family.jpg',
        caption: 'Otter family',
        attrib: 'https://mothership.sg/2017/04/marina-otters-move-to-singapore-river-after-losing-their-original-home-to-rival-bishan-family/'
    },
    {
        src: 'giant-river-otter.png',
        caption: 'Giant river otter',
        attrib: 'https://www.reddit.com/r/pics/comments/6a298d/this_picture_of_a_giant_sea_otter_makes_it_very/'
    }
]

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
    return document.querySelector('[button-overlay-left]');
}

function getRightArrowButton() {
    return document.querySelector('[button-overlay-right]');
}

function getFirstImageElement() {
    return document.querySelector('[data-image-index="0"]')
}

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

function toggleOverlayLayer() {
    getOverlayLayer().classList.toggle('hidden');
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

function loadClickedImage(imageObject, imageElement) {
    var img = getOverlayImage();
    var imgCaption = getOverlayImageCaption();
    var imgAttribUrl = getOverlayImageAttribUrl();
    img.setAttribute('src', imageElement.getAttribute('src'));
    img.setAttribute('alt', imageElement.getAttribute('alt'));
    img.setAttribute('data-image-index', imageElement.getAttribute('data-image-index'));
    imgCaption.textContent = imageObject.caption;
    imgAttribUrl.setAttribute('href', imageObject.attrib);
    imgAttribUrl.textContent = getHostName(imageObject.attrib);
    var index = Number(imageElement.getAttribute('data-image-index'));
    // index == 0 ? getLeftArrowButton().classList.add('hidden') : getLeftArrowButton().classList.remove('hidden');
    // index == imageList.length - 1 ? getRightArrowButton().classList.add('hidden') : getRightArrowButton().classList.remove('hidden');
}

function loadImages(imageArray) {
    var imageContainer = document.querySelector('[data-image-grid]');
    imageArray.forEach((image, index, array) => {
        var newImage = document.createElement('img');
        newImage.setAttribute('src', IMG_DIR + image.src);
        newImage.setAttribute('alt', image.caption);
        newImage.setAttribute('data-thumbnail','');
        newImage.setAttribute('data-image-index', index);
        newImage.addEventListener('click', event => {
            event.preventDefault();
            loadClickedImage(image, newImage);
            toggleOverlayLayer();
        });
        newImage.onload = resizeImage(newImage);
        var newAnchor = document.createElement('a');
        newAnchor.setAttribute('href', '#');
        var newDiv = document.createElement('div');
        newAnchor.appendChild(newImage);
        newDiv.appendChild(newAnchor);
        imageContainer.appendChild(newDiv);
    });
}

function loadNextImage(index) {
    var image = imageList[index];
    getOverlayImage().setAttribute('src', IMG_DIR + image.src);
    getOverlayImage().setAttribute('alt', image.caption);
    getOverlayImage().setAttribute('data-image-index', index);
    getOverlayImageCaption().textContent = image.caption;
    getOverlayImageAttribUrl().setAttribute('href', image.attrib);
    getOverlayImageAttribUrl().textContent = getHostName(image.attrib);
}

function leftArrow() {
    var index = Number(getOverlayImageIndex());
        if (index > 0) {
            var newIndex = index - 1;
            loadNextImage(newIndex);
            index == 0 ? getLeftArrowButton().classList.add('hidden') : getLeftArrowButton().classList.remove('hidden');
        }
}

function rightArrow() {
    var index = Number(getOverlayImageIndex());
        if (index < imageList.length - 1) {
            var newIndex = index + 1;
            loadNextImage(newIndex);
            index == imageList.length - 1 ? getRightArrowButton().classList.add('hidden') : getRightArrowButton().classList.remove('hidden');
        }
}

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
        toggleOverlayLayer();
    });
    // Escape key
    document.onkeydown = function(event) {
        if (event.keyCode == 27) {
            toggleOverlayLayer();
        }
    };
}

function addButtonOverlayListener() {
    var leftButton = document.querySelector('[data-overlay-left-arrow]');
    leftButton.addEventListener( 'click', event => {
        leftArrow();
    });
    var rightButton = document.querySelector('[data-overlay-right-arrow]');
    rightButton.addEventListener( 'click', event => {
        rightArrow();
    });
}

function tempWorkOnOverlayLayer(){
    getFirstImageElement().click();
}

function main() {
    loadImages(imageList);
    addOverlayImageOnLoadListener();
    addOverlayExitListener();
    addButtonOverlayListener();

    tempWorkOnOverlayLayer();
}

main();