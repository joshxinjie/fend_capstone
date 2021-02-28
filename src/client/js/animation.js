const sectionNodeList = document.querySelectorAll("section");

/**
 * @description Return the index of smallest number in array
 * @param {Array} array
 * @returns {number} index
*/
function minElemArray(array) {
    var index = 0;
    var value = array[0];
    for (var i = 1; i < array.length; i++) {
        if (array[i] < value) {
            value = array[i];
            index = i;
        }
    }
    return index
}

/**
 * @description Return the section that is in view
 * @returns {Element} sectionInView
*/
function getSectionInView() {
    let distFromTop = []
    for (const eachSection of sectionNodeList) {
        let rect = eachSection.getBoundingClientRect();
        distFromTop.push(Math.abs(rect.top))
    }

    let largestSectionIndex = minElemArray(distFromTop)

    let sectionInView = sectionNodeList[largestSectionIndex]

    return sectionInView
}

function zoomBackgroundWhenScroll() {
    sectionInView = getSectionInView();
    for (const eachSection of sectionNodeList) {
        if (eachSection == sectionInView) {
            let sectionID = eachSection.getAttribute("id");
            let sectionBackground = document.getElementById(sectionID + "-background");
            let distanceToTop = eachSection.getBoundingClientRect().top;
            // let distanceToTop = window.pageYOffset + eachSection.getBoundingClientRect().top
            let zoomFactor = 100 + (distanceToTop * -1) * 0.1;
            console.log(`Section: ${sectionID}`);
            // console.log(`Zoom Factor: ${zoomFactor}%`);
            // console.log(`Scroll top: ${document.scrollingElement.scrollTop}`);
            // console.log(`Distance to top: ${distanceToTop}`)
            if ((zoomFactor > 100) && (sectionBackground != null)){
                sectionBackground.style.backgroundSize = `${zoomFactor}%`;
            }
        }
    }
}

function stickSearchBarToTop() {
    let searchBar = document.getElementById("search-bar");
    // Get the offset position of the searchBar
    let sticky = searchBar.offsetTop;
    if (window.pageYOffset >= sticky) {
        searchBar.classList.add("sticky")
    } else {
        searchBar.classList.remove("sticky");
    }
}

document.addEventListener("scroll", zoomBackgroundWhenScroll);
document.addEventListener("scroll", stickSearchBarToTop);