
import { handleSearch } from './js/searchHandler'
import { zoomBackgroundWhenScroll } from './js/animation'

import "./styles/header.scss"
import "./styles/base.scss"
import "./styles/carousel.scss"
import "./styles/footer.scss"

document.addEventListener("scroll", zoomBackgroundWhenScroll);

export { handleSearch, zoomBackgroundWhenScroll };