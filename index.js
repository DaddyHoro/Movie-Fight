const autoCompleteConfig = {
    renderOptions(movie){
        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
        return `
            <img src="${imgSrc}" />
            ${movie.Title} (${movie.Year})
            `
    },
    inputValue(movie){
        return movie.Title;
    },
    async fetchData (searchTerm){
        const result = await axios.get('https://www.omdbapi.com/',{
            params: {
                apikey: 'be42c85a',
                s: searchTerm
            }
        })
        .then(response => {
            if(response.data.Error)
                return null
            else return response.data.Search
        })
        .catch(err => {
            console.log(err)
            return []
        })

        return result
    }
}

createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector('#left-autocomplete'),
    onOptionSelect(movie){
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie,document.querySelector('#left-summary'),'left');
    }
});
createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector('#right-autocomplete'),
    onOptionSelect(movie){
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie,document.querySelector('#right-summary'),'right');
    }
});

let rightMovie;
let leftMovie;

const onMovieSelect = async (movie, summaryElement,side) => {
    const respone = await axios.get('https://www.omdbapi.com/',{
        params: {
            apikey: 'be42c85a',
            i: movie.imdbID
            }
        })
        .catch( err => {
            console.log(err)
        })
        
    summaryElement.innerHTML = movieTemplate(respone.data);

    if(side === 'right'){
        rightMovie = respone.data;
    }else{
        leftMovie = respone.data;
    }

    if(leftMovie && rightMovie){
        runComparison()
    }
}

const runComparison = () => {
    const leftStats = document.querySelectorAll('#left-summary .notification')
    const rightStats = document.querySelectorAll('#right-summary .notification')

   leftStats.forEach((left,index) => {
        if(index){
            right = rightStats[index]
            resetDefault(right,left);
            comparationLogic(right,left);
        }
    });
}

const resetDefault = (right, left) => {

    right.classList.remove('is-danger','is-success')
    right.classList.remove('is-success','is-success')

    right.classList.add('is-success')
    left.classList.add('is-success')
}

const comparationLogic = (right,left) => {
    
    let rightValue = parseFloat(right.dataset.value);
    let leftValue = parseFloat(left.dataset.value);

    let isRightValid = !isNaN(rightValue);
    let isLeftValid = !isNaN(leftValue);

    if (isRightValid && isLeftValid) {
        if (rightValue > leftValue) {
            left.classList.remove('is-success');
            left.classList.add('is-danger');
        } else if (leftValue > rightValue) {
            right.classList.remove('is-success');
            right.classList.add('is-danger');
        }
    }

    if (!isRightValid) {
        right.classList.remove('is-success');
        right.classList.add('is-danger');
    }

    if (!isLeftValid) {
        left.classList.remove('is-success');
        left.classList.add('is-danger');
    }
        
}

const movieTemplate = movieDetail => {

    const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g,"").replace(/,/g,""));
    const metascore = parseInt(movieDetail.Metascore);
    const imdbRating = parseFloat(movieDetail.imdbRating);
    const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g,""));

    return `
    <article class="media"> 
        <figure class="media-left">
            <p class="image">
            <img src="${movieDetail.Poster}"/>
            </p>
        </figure>
        <div class="media-content">
            <div class="content">
                <h1>${movieDetail.Title}</h1>
                <h4>${movieDetail.Genre}</h4>
                <p>${movieDetail.Plot}</p>
            </div>
        </div>
    </article>
    <article class="notification is-warning">
      <p class="title">${movieDetail.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
    <article data-value="${dollars}" class="notification is-success">
      <p class="title">${movieDetail.BoxOffice}</p>
      <p class="subtitle">BoxOffice</p>
    </article>
    <article data-value="${metascore}" class="notification is-success">
      <p class="title">${movieDetail.Metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>
    <article data-value="${imdbRating}" class="notification is-success">
      <p class="title">${movieDetail.imdbRating}</p>
      <p class="subtitle">Rating</p>
    </article>
    <article data-value="${imdbVotes}" class="notification is-success">
      <p class="title">${movieDetail.imdbVotes}</p>
      <p class="subtitle">Votes</p>
    </article>
    `
}