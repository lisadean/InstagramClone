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

function getOverlayImage() {
    return document.querySelector('[data-overlay-image]');
}

function getImages(){
    return document.querySelectorAll('[data-thumbnail]');
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

function loadImages(imageArray) {
    var imageContainer = document.querySelector('[data-image-grid]');
    imageArray.forEach(image => {
        var newImage = document.createElement('img');
        newImage.setAttribute('src', IMG_DIR + image.src);
        newImage.setAttribute('alt', image.caption);
        newImage.setAttribute('data-thumbnail','');
        newImage.addEventListener('click', event => {
            event.preventDefault();
            getOverlayImage().setAttribute('src', newImage.getAttribute('src'));
            getOverlayLayer().classList.remove('hidden');
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

function exitOverlay() {
    getOverlayLayer().classList.add('hidden');
}

function addOverlayExitListener() {
    // Button
    var overlayExitIcon = document.querySelector('[data-overlay-exit]');
    overlayExitIcon.addEventListener('click', event => {
        exitOverlay();
    });
    // Escape key
    document.onkeydown = function(event) {
        if (event.keyCode == 27) {
            exitOverlay();
        }
    };
}

function main() {
    loadImages(imageList);
    addOverlayExitListener();
}

main();