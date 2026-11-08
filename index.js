let posterSection = document.querySelector(".popular_poster_container")
let popularText = document.querySelector(".popular_name")
let allInfoCont = document.querySelector(".descr_container")
let genreInfo = document.querySelector(".genre_cont")
let dateText = document.querySelector(".date_text")
let ratingText = document.querySelector(".star_text")
let descrText = document.querySelector(".description_text")
let switchContainer = document.querySelector(".switch_container")
let mediaType = document.querySelector(".media_type")
let viewAllMovies = document.querySelector(".view_all_btn")
let movieSection = document.querySelector(".view_movie_section")
let searchBar = document.querySelector(".header_search")
let searchResultsContainer = document.querySelector(".search_results")
let searchButton = document.querySelector(".search_logo_container")
let headerHome = document.querySelectorAll(".header_home")
let headerMovies = document.querySelector(".header_movies")
let headerTv = document.querySelector(".header_series")
let moviesInitialized = false;
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MWJlZDY0OTdkZWI4MTQzMDJhOWQ3YzY1YjE3NTczNiIsIm5iZiI6MTc3NzIwMDcxNi42MzEsInN1YiI6IjY5ZWRlZTRjOTg0ZDY0MjcyOTE1MGQ4MyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.XNVHhQ4kbKB55P496uT5LX_T10C6KFxsPgeJo-gyQPo'
  }
};
headerMovies.addEventListener("click", () => {
  showPage("allmoviespage", "header_movies")
  headerMovies.classList.add("selected_header")
  fetch(`https://api.themoviedb.org/3/trending/movie/week`, options)
  .then(res => res.json())
  .then((data) => renderMovieCards(data.results, true))
})
headerTv.addEventListener("click", () => {
  showPage("allmoviespage", "header_series")
  headerTv.classList.add("selected_header")
  fetch(`https://api.themoviedb.org/3/trending/tv/week`, options)
  .then(res => res.json())
  .then((data) => renderMovieCards(data.results, true))
})
headerHome.forEach(el => {
  el.addEventListener("click", () => {
    showPage("homepage", "header_home")
    el.classList.add("selected_header")
    console.log("clicked");
  })
})
function showPage(id, activeItem = null) {
  let allPages = document.querySelectorAll(".page")
  allPages.forEach((page) => {
    page.classList.remove("on")
  })


  let allHeaderItems = document.querySelectorAll(".header_item")

  allHeaderItems.forEach((item) => {
    item.classList.remove("selected_header")
  })
  if(activeItem != null){
    document.querySelector(`.${activeItem}`).classList.add("selected_header")
  }

  let pageToShow = document.querySelector(`#${id}`)
  console.log(pageToShow);
  pageToShow.classList.add("on")
  window.scrollTo(0,0)
}
viewAllMovies.addEventListener("click", () => {
  showPage("allmoviespage")
})
// function getCurentCont(){
let buttonSelected = 1
let imageSlide = ""
  switchContainer.addEventListener("click", (e) => {

    if(buttonSelected > e.target.classList[1].slice(4)){
          console.log("image slide to right");
      setTimeout(() => {buttonSelected = e.target.classList[1].slice(4);}, 300)
      imageSlide = "right"
    }
    if(buttonSelected < e.target.classList[1].slice(4)){
      console.log("image slide to left");
      buttonSelected = e.target.classList[1].slice(4)
      setTimeout(() => {buttonSelected = e.target.classList[1].slice(4);}, 300)
      imageSlide = "left"
    }
    
    console.log(e.target.classList.contains("btn_1"));
    if(e.target.classList.contains("btn_1")){
      document.querySelectorAll('.selected_content').forEach(el => el.classList.remove("selected_content"))
      e.target.classList.add("selected_content")
      loadHero("movie", 0)
    } 
    else if(e.target.classList.contains("btn_2")){
      document.querySelectorAll('.selected_content').forEach(el => el.classList.remove("selected_content"))
      e.target.classList.add("selected_content")
      loadHero("tv", 0)
    } 
    else if(e.target.classList.contains("btn_3")){
      document.querySelectorAll('.selected_content').forEach(el => el.classList.remove("selected_content"))
      e.target.classList.add("selected_content")
      loadHero("movie", 1)
    }
    else if(e.target.classList.contains("btn_4")){
      document.querySelectorAll('.selected_content').forEach(el => el.classList.remove("selected_content"))
      e.target.classList.add("selected_content")
      loadHero("tv", 1)
    }
    else if(e.target.classList.contains("btn_5")){
      document.querySelectorAll('.selected_content').forEach(el => el.classList.remove("selected_content"))
      e.target.classList.add("selected_content")
      loadHero("movie", 2)
    }
})
// }
loadHero()

function loadGenres() {
  return fetch('https://api.themoviedb.org/3/genre/movie/list?language=en', options)
    .then(res => res.json())
    .then(res => {
      return loadAllGenres(res.genres)
    })
}

function loadAllGenres(movieGenres) {
  return fetch('https://api.themoviedb.org/3/genre/tv/list?language=en', options)
    .then(res => res.json())
    .then(res => {
      let allGenres = res.genres.concat(movieGenres)
      let allFilteredGenres = [...new Map(allGenres.map(item => [item.id, item])).values()]
      return allFilteredGenres
    })
}

async function loadMovie(id, mediaType = "movie"){
  console.log(id);
  movieSection.innerHTML = ""
  showPage("moviepage")
  if(mediaType == "movie"){
    const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?language=en`, options);
    const movie = await res.json();
    const videosRes = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?language=en`, options);
    const promoVideos = await videosRes.json();
    const trailer = promoVideos.results.find( v => v.type === 'Trailer' && v.site === 'YouTube' );
    console.log(trailer);
      if(trailer == undefined){
    renderMovie(movie, null, mediaType)
  }
  else{
  renderMovie(movie, trailer.key, mediaType)
  }
  }
  else{
    const res = await fetch(`https://api.themoviedb.org/3/tv/${id}?language=en`, options);
    const movie = await res.json();
    const videosRes = await fetch(`https://api.themoviedb.org/3/tv/${id}/videos?language=en`, options);
    const promoVideos = await videosRes.json();
    const trailer = promoVideos.results.find( v => v.type === 'Trailer' && v.site === 'YouTube' );
      if(trailer == undefined){
    renderMovie(movie, null, mediaType)
  }
  else{
  renderMovie(movie, trailer.key, mediaType)
  }
  }


  
}
function renderMovie(movie, trailerKey, mediaType){
  console.log(movie);
    let posterContainer = document.createElement("div")
    posterContainer.classList.add("movie_poster_container")
  if(!trailerKey){
    let moviePosterImage = document.createElement("img")
    let poster = movie.backdrop_path ? `https://image.tmdb.org/t/p/w${1280}${movie.backdrop_path}` : "./images/placeholder_wide.jpg"
    moviePosterImage.src = poster
    posterContainer.appendChild(moviePosterImage)
    movieSection.appendChild(posterContainer)
    let movieTitle = document.createElement("h1")
    movieTitle.textContent = movie.title || movie.name
    posterContainer.appendChild(movieTitle)
    movieTitle.classList.add("movie_title")
    let movieDescription = document.createElement("p")
    movieDescription.textContent = movie.overview
    posterContainer.appendChild(movieDescription)
    movieDescription.classList.add("movie_description")
  }
  else{
    let trailerLink = `https://www.youtube.com/embed/${trailerKey}`
    let trailerFrame = document.createElement("iframe")
    trailerFrame.src = trailerLink
    trailerFrame.width = "1280"
    trailerFrame.height = "720"
    trailerFrame.style.border = "none"
    posterContainer.appendChild(trailerFrame)
    movieSection.appendChild(posterContainer)

  }
  let smallMoviePoster = document.createElement("img")
  let poster = movie.poster_path ? `https://image.tmdb.org/t/p/w${300}${movie.poster_path}` : "./images/placeholder.png"
  smallMoviePoster.src = poster
  movieSection.appendChild(smallMoviePoster)
  console.log(allFilteredGenres);
  let currentPosterGenres = movie.genres
  console.log(currentPosterGenres[0]?.id);
  console.log(allFilteredGenres[0]?.id);
  // console.log(allFilteredGenres.includes(currentPosterGenres[0]));
  // console.log(currentPosterGenres[0]);
  // console.log(allFilteredGenres[20]);
  // console.log(currentPosterGenres[0] == allFilteredGenres[20]);
      let movieInfo = document.createElement("div")
      movieSection.appendChild(movieInfo);
      movieInfo.classList.add("movie_info")
      let currentPosterGenreFixed = []
      b = 0
      while(currentPosterGenres.length > b){
      if(typeof(currentPosterGenres[b]) == "object"){
        tempId = currentPosterGenres[b].id
        console.log(tempId);
        
      currentPosterGenreFixed.push(tempId)
      }
      b++
      console.log(b);
      console.log(movieGenreFixed);
    }
    // if(!!genreInfo.querySelector("div")){
    //   document.querySelectorAll('.genre_badge').forEach(el => el.remove());
    // }
    let movieTitleDescription = document.createElement("div")
    movieInfo.appendChild(movieTitleDescription)
    movieTitleDescription.classList.add("movie_title_description")
    movieTitleDescription.textContent = movie.title || movie.name
  let movieGenres = document.createElement("div")
  movieSection.appendChild(movieGenres);
  movieGenres.classList.add("movie_page_genre_container")

  for (let i = 0; i < allFilteredGenres.length; i++) {
  if(currentPosterGenreFixed.includes(allFilteredGenres[i].id)){
  console.log(i);
  let genreTemp = allFilteredGenres[i].name
  console.log(genreTemp);

  let genreAdder = document.createElement("div");
  genreAdder.classList.add("movie_page_genre")
  genreAdder.textContent = genreTemp
  movieGenres.appendChild(genreAdder)
  console.log(movieGenres);
}
  
}
movieInfo.appendChild(movieGenres)
let movieInfoCont = document.createElement("div")
movieSection.appendChild(movieInfoCont)
movieInfoCont.classList.add("movie_info_container")
movieInfoCont.appendChild(smallMoviePoster)
movieInfoCont.appendChild(movieInfo)

let movieDescriptionDescr = document.createElement("div")
movieInfo.appendChild(movieDescriptionDescr)
movieDescriptionDescr.classList.add("movie_description_descr")
movieDescriptionDescr.textContent = movie.overview

let additionalInfo = document.createElement("div")
additionalInfo.classList.add("additional_info")
movieInfo.appendChild(additionalInfo)
let originCountry = document.createElement("div")
originCountry.textContent = `Country: ${movie.origin_country[0]}`
additionalInfo.appendChild(originCountry)
let rating = document.createElement("div")
rating.textContent = `Rating: ${movie.vote_average.toFixed(1)}`
additionalInfo.appendChild(rating)
let releaseDate = document.createElement("div")
if(mediaType == "movie"){
releaseDate.textContent = `Release Date: ${movie.release_date}`
}
if(mediaType == "series"){
releaseDate.textContent = `Release Date: ${movie.first_air_date}`
}
if(mediaType == "movie"){
additionalInfo.appendChild(releaseDate)
let runtime = document.createElement("div")
let formattedRuntimeH = Math.trunc(movie.runtime/60)
console.log(formattedRuntimeH);
console.log(Math.floor((movie.runtime/60).toFixed(1)) == (movie.runtime/60).toFixed(1));
if(Math.floor((movie.runtime/60).toFixed(1)) == (movie.runtime/60).toFixed(1)){
  runtime.textContent = `Runtime: ${Math.trunc((movie.runtime/60).toFixed(1))} hours`

}
else{
  let formattedRuntimeM = Math.trunc(((movie.runtime/60).toFixed(1)-formattedRuntimeH)*60)
  runtime.textContent = `Runtime: ${formattedRuntimeH} h ${formattedRuntimeM} min`
}
additionalInfo.appendChild(runtime)
}
else if(mediaType == "series"){
  let status = document.createElement("div")
  additionalInfo.appendChild(status)
  status.textContent = `Status: ${movie.status}`
}
let companies = document.createElement("div")
companies.classList.add("companies")
companies.textContent = "Producers: "
additionalInfo.appendChild(companies)
for (let i = 0; i < movie.production_companies.length; i++) {
  let company = document.createElement("div")
  if(i == movie.production_companies.length - 1){
    company.textContent = `${movie.production_companies[i].name}.`
  }
  else{
    company.textContent = `${movie.production_companies[i].name}, `
  }
  companies.appendChild(company)
}
if(companies.childElementCount == 0){
  companies.textContent = "Producers: N/A"
}


}
// fetch(url)
//   .then(res => res.json())
//   .then((result) => console.log(result))


// const res = await fetch(url);
// const result = res.json()

// loadGenre -> loadAllGennre 

async function renderMovieCards(movieList, viewAll = false){
  let moviePosterCounter = 0
  console.log(moviePosterCounter);
  
  console.log(movieList);
  allFilteredGenres = await loadGenres()
  console.log(allFilteredGenres);

  let movieCount = viewAll
      ? 20
      : 4

  let popularMovies = viewAll 
    ? document.querySelector(".view_all_section") 
    : document.querySelector(".most_popular_list")

  popularMovies.innerHTML = ""

  // let popularMovies = null;

  // if(viewAll == true) {
  //   popularMovies = document.querySelector(".view_all_section")
  // } else {
  //   popularMovies = document.querySelector(".most_popular_list")
  // }

  let firstMovieIndex = 0
  if(!viewAll){
    firstMovieIndex = Math.floor(Math.random()*20)
    console.log(firstMovieIndex);
    while(firstMovieIndex > 16 || firstMovieIndex < 3){
      firstMovieIndex = Math.floor(Math.random()*20)
      console.log(firstMovieIndex);
    }
  }



  const w = 300;
    
  while(moviePosterCounter < movieCount){
      let movieCard = movieList[firstMovieIndex]
      console.log(movieCard);
      let link = movieCard.poster_path
      let movie_id = movieCard.id
      let currentPosterGenres = movieCard.genre_ids
      currentPosterGenresSliced = currentPosterGenres.slice(0,2)
      console.log(currentPosterGenresSliced);
      let posterTitle = document.createElement("p")
      posterTitle.classList.add("small_poster_title")
      posterTitle.textContent = movieCard.title
      console.log(posterTitle);
    
      let posterURL = `https://image.tmdb.org/t/p/w${w}${link}`
      console.log("iteration");
      console.log(link);
      let posterSmallContainer = document.createElement("div")
      posterSmallContainer.classList.add("poster_image_container")
      popularMovies.appendChild(posterSmallContainer)
      console.log(posterSmallContainer);
      posterSmallContainer.addEventListener("click", () => {
        console.log(movieCard);
        loadMovie(movie_id, movieCard.media_type)
      })
      
    

      let popularPosterSmall = document.createElement("img");
      popularPosterSmall.src = posterURL;
      if(popularPosterSmall.src == "https://image.tmdb.org/t/p/w300null"){
        popularPosterSmall.src = "./images/placeholder.png"
      }
      popularMovies.appendChild(popularPosterSmall);
      popularPosterSmall.classList.add("popular_img_small")
      let genreAdderContainer = document.createElement("div")
      genreAdderContainer.classList.add("small_poster_genre_container")
      posterSmallContainer.appendChild(genreAdderContainer)

      let rating = movieList[firstMovieIndex].vote_average.toFixed(1)
      console.log(rating);
      let starSmall = document.createElement("img")
      starSmall.src = "./images/star.svg"
      starSmall.width = "30"
      starSmall.height = "30"
      let smallRateDiv = document.createElement("div")
      let smallRateText = document.createElement("p")
      smallRateText.textContent = rating
      smallRateDiv.appendChild(smallRateText)
      smallRateDiv.appendChild(starSmall)
      smallRateDiv.classList.add("star_cont_small")
      posterSmallContainer.appendChild(smallRateDiv)
      
      for (let i = 0; i < allFilteredGenres.length; i++) {
        if(currentPosterGenresSliced.includes(allFilteredGenres[i].id)){
        // console.log(i);
        // console.log(genreArr[i].name);
        let genreTemp = allFilteredGenres[i].name
        console.log(genreTemp);
        
        let genreAdder = document.createElement("div");
        genreAdder.classList.add("small_poster_genre")
        genreAdder.textContent = genreTemp
        genreAdderContainer.appendChild(genreAdder)
      }
        
      }

      posterSmallContainer.appendChild(popularPosterSmall)
      posterSmallContainer.appendChild(posterTitle)


      moviePosterCounter++
      firstMovieIndex = firstMovieIndex + 1
    
  }
  
}



// ПРОЙТИСЬ ЦИКЛОМ ПО 1 МАСИВУ І ЯКЩО Є НАЗВА ЯК У 2 МАСИВІ НЕ ДОДАВАТИ

async function loadHero(contentType = "movie", index = 0){
  const allGenres = await loadGenres();

  fetch(`https://api.themoviedb.org/3/trending/${contentType}/week`, options)
    .then(res => res.json())
    .then((res) => {
      if(!moviesInitialized){
        renderMovieCards(res.results)
        renderMovieCards(res.results, true)
        moviesInitialized = true 
      }

      let mostPopularMovie = res.results[index]
      loadHeroImage(1280,mostPopularMovie.backdrop_path)
      
      if("first_air_date" in mostPopularMovie){
        if("genres" in mostPopularMovie){
          loadHeroText(mostPopularMovie.name)
          loadGeneralInfo(mostPopularMovie.genres, allGenres, mostPopularMovie.first_air_date.slice(0,4), mostPopularMovie.vote_average.toFixed(1), mostPopularMovie.overview, "Series")
        }
        else{
          loadHeroText(mostPopularMovie.name)
          loadGeneralInfo(mostPopularMovie.genre_ids, allGenres, mostPopularMovie.first_air_date.slice(0,4), mostPopularMovie.vote_average.toFixed(1), mostPopularMovie.overview, "Series")
        }

      }
      else{
        if("genres" in mostPopularMovie){
          loadHeroText(mostPopularMovie.title)
          loadGeneralInfo(mostPopularMovie.genres, allGenres, mostPopularMovie.release_date.slice(0,4), mostPopularMovie.vote_average.toFixed(1), mostPopularMovie.overview, "Movie")
        }
        else{
          loadHeroText(mostPopularMovie.title)
          loadGeneralInfo(mostPopularMovie.genre_ids, allGenres, mostPopularMovie.release_date.slice(0,4), mostPopularMovie.vote_average.toFixed(1), mostPopularMovie.overview, "Movie")
        }
      }
      // loadHeroText(mostPopularMovie.title)
      // loadGeneralInfo(mostPopularMovie.genre_ids, allGenres, mostPopularMovie.release_date.slice(0,4), mostPopularMovie.vote_average.toFixed(1), mostPopularMovie.overview)
    })
    .catch(err => console.error(err));
  }
  

  //tv means series, movie means movies
  



function loadHeroImage(width, url) {
    let imageURL = `https://image.tmdb.org/t/p/w${width}${url}`
    console.log(imageURL);
          // document.querySelectorAll('.popular_img').forEach(el => el.remove());
      let popularPoster = document.createElement("img");
        popularPoster.src = imageURL;
        posterSection.appendChild(popularPoster);
        popularPoster.classList.add("popular_img")
        console.log(imageSlide);


        
    if(imageSlide != ""){
      console.log(switchContainer);
      
      document.querySelectorAll(".switch_container button").forEach(button => {
          button.disabled = true;
      });
      // document.querySelectorAll('.popular_img').forEach(el => el.remove());
      popularPoster.classList.add("new_image")
      document.querySelectorAll('.popular_img').forEach(el => {if(!el.classList.contains("new_image")){
        el.classList.add("old_image")
        console.log(imageSlide);
        
      }})
      if(imageSlide == "left"){
        console.log("абмз баобаобао");
        console.log(imageSlide);
        
        document.querySelectorAll('.new_image').forEach(el => el.classList.add("slide_in_image_right"))
        setTimeout(() => {document.querySelectorAll('.new_image').forEach(el => el.classList.add("slide_in_image_right_transition"));}, 100)
        document.querySelectorAll('.old_image').forEach(el => el.classList.add("slide_out_image_left"))
        setTimeout(() => {document.querySelectorAll('.old_image').forEach(el => el.remove());
          document.querySelectorAll('.new_image').forEach(el => el.classList.remove("new_image", "slide_in_image_right", "slide_in_image_right_transition"));
      document.querySelectorAll(".switch_container button").forEach(button => {
          button.disabled = false;
      });
        }, 300)
      }
      if(imageSlide == "right"){
        
        document.querySelectorAll('.new_image').forEach(el => el.classList.add("slide_in_image_left"))
        setTimeout(() => {document.querySelectorAll('.new_image').forEach(el => el.classList.add("slide_in_image_left_transition"));}, 100)
        document.querySelectorAll('.old_image').forEach(el => el.classList.add("slide_out_image_right"))
        setTimeout(() => {document.querySelectorAll('.old_image').forEach(el => el.remove());
          document.querySelectorAll('.new_image').forEach(el => el.classList.remove("new_image", "slide_in_image_left", "slide_in_image_left_transition"));
      document.querySelectorAll(".switch_container button").forEach(button => {
          button.disabled = false;
      });
        }, 300)
      }
    }
}

function loadHeroText(title){
  popularText.textContent = title
}
function cleanSearch(){
  searchResultsContainer.innerHTML = ""
  searchResultsContainer.classList.remove("show")
  searchResultsContainer.classList.add("hide")
}

function loadGeneralInfo(movieGenre, genreArr, date, rating, description, mediaTypeText){
    console.log(movieGenre);
    let i = 0
    let b = 0
    console.log(typeof(movieGenre[0]));
    console.log(genreArr[0].id);
    console.log(genreArr.length);
    movieGenreFixed = []
    while(movieGenre.length > b){
      if(typeof(movieGenre[b]) == "object"){
        tempId = movieGenre[b].id
        console.log(tempId);
        
      movieGenreFixed.push(tempId)
      }
      b++
      console.log(b);
      console.log(movieGenreFixed);
    }
    if(!!genreInfo.querySelector("div")){
      document.querySelectorAll('.genre_badge').forEach(el => el.remove());
    }
    
    

    while (genreArr.length > i) {
      if(movieGenre.includes(genreArr[i].id) || movieGenreFixed.includes(genreArr[i].id)){
        console.log(i);
        console.log(genreArr[i].name);
        let genreTemp = genreArr[i].name
        console.log(genreTemp);
        let genreAdder = document.createElement("div");
        genreAdder.textContent = genreTemp
        genreInfo.appendChild(genreAdder)
        genreAdder.classList.add("genre_badge")
      }
      i = i + 1
    }
    dateText.textContent = date
    ratingText.textContent = rating
    descrText.textContent = description
    console.log(movieGenreFixed.length);
    
    mediaType.textContent = mediaTypeText
  }
  searchBar.addEventListener("input", (e) => searchMovie(e))
  async function searchMovie(e){
    let queryField = e.target
    let query = queryField.value.trim()
    if(query.length <= 0){
      cleanSearch()
      return
    }
    // let response = await fetch(`https://api.themoviedb.org/3/search/tv?&language=en-US&query=${query}&page=1`, options);
    // let data = await response.json();
    // console.log(data);
    // let movieList = data.results
    // console.log(movieList);


    // console.log((e.target.value).trim());
    // let responseTv = await fetch(`https://api.themoviedb.org/3/search/tv?&language=en-US&query=${query}&page=1`, options);
    // let dataTv = await responseTv.json();
    // console.log(dataTv);
    // let tvList = dataTv.results
    // console.log(tvList);

    // console.log((e.target.value).trim());
    // let responseMovie = await fetch(`https://api.themoviedb.org/3/search/movie?&language=en-US&query=${query}&page=1`, options);
    // let dataMovie = await responseMovie.json();
    // console.log(dataMovie);
    // let movieList = dataMovie.results
    // console.log(movieList);



    const urls = [ `https://api.themoviedb.org/3/search/tv?&language=en-US&query=${query}&page=1`, `https://api.themoviedb.org/3/search/movie?&language=en-US&query=${query}&page=1` ]; 
    try {
       const originalPromises = urls.map(url => fetch(url, options));
       const responses = await Promise.all(originalPromises);
        const jsonPromises = responses.map(response => response.json());
        const data = await Promise.all(jsonPromises); 
        console.log("ALL MEDIA !!!",  data);
        data.forEach(el => {
          let mediaFlag = "tv"
          el.results.forEach(el => {
            el.media_type = mediaFlag
          })
          mediaFlag = "movie"
        })

        let searchList = []
        let extendedSearchList = []

        searchResultsContainer.innerHTML = ""
        data.forEach(el => {
          // console.log(el.results.slice(0,2));
          const temp = el.results.slice(0,2)
          const extendedTemp = el.results.slice(0,10)
          if(temp.length == 0 || extendedTemp.length == 0){
            return
          }

          searchList.push(...temp)
          extendedSearchList.push(...extendedTemp)
          console.log(extendedSearchList);

        })
        searchButton.addEventListener("click", () => {
          renderMovieCards(extendedSearchList, true)
          setTimeout(() => {showPage("allmoviespage")}, 500)  
        })
        console.log(searchList, "jfsdjfksdf");

        if(searchList.length == 0){
          cleanSearch()
          return
        }

        searchList.forEach(el => {
          let movie = document.createElement("div")
          movie.classList.add("movie_search_card")
          movie.id = el.id
          searchResultsContainer.appendChild(movie)
          let movieTitle = document.createElement("p")
          movieTitle.textContent = el.title
          if(movieTitle.textContent == ""){
            movieTitle.textContent = el.name
            movieTitle.classList.add("series")
          }
          else{
            movieTitle.classList.add("movie")
          }
          movie.addEventListener("click", () => {
            loadMovie(movie.id, movieTitle.classList[0])
            queryField.value = ""
            searchResultsContainer.classList.remove("show")
            searchResultsContainer.classList.add("hide")
          })
          let moviePoster = document.createElement("img")
          let poster = el.poster_path ? `https://image.tmdb.org/t/p/w${300}${el.poster_path}` : "./images/placeholder.png"
          moviePoster.src = poster
          console.log(moviePoster.src);
          movie.appendChild(movieTitle)
          movie.appendChild(moviePoster)          
        })

        searchResultsContainer.classList.add("show")
        searchResultsContainer.classList.remove("hide")
    } catch (error) {
      console.log(error);
      
    }
    
  }
  
  






