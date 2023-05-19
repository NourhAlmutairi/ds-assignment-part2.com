const $date = document.querySelector('#date');
const $result = document.querySelector('#result');
const $loading = document.querySelector('#loading');

const BASE_URL = window.location.origin;

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const dayParam = urlParams.get('day');

const todayString = () => {
    const today = new Date();
    const dd = today.getDate().toString();
    const mm = (today.getMonth() + 1).toString();
    const yyyy = today.getFullYear().toString();

    const todayStr = `${yyyy}-${mm.padStart(2,'0')}-${dd.padStart(2,'0')}`;
    return todayStr;
};

const renderInfo = (resultDiv, media_type, link, imageUrl, title, date, explanation, author) => {
    const el = `
    <div class="card">
        <a class="image-link" href="${link}" target="_blank" rel="noopener noreferrer">
                <img src="${imageUrl}" alt="${title}" class="image">
            </a>
            <div class="info-result">
                <h1 class="title-result">${title}</h1>
                <span class="date-result"><time>${date}</time></span>
                ${author? `<span class="author-result">© ${author}</span>` : ''}
            </div>
        </div>
        <div class="explanation-result">
            <p>
                ${explanation}
            </p>
        </div>
    `;
    resultDiv.innerHTML = el;
};

const fetchDataApod = async (date) => {
    try {
        const request = await fetch(`https://api.nasa.gov/planetary/apod?api_key=MSfjWOlBSbHH7ciS0WxaS1OLDPA59imKSHPLPK0b&thumbs=true&date=${date}`);
        if (request.status >= 400 && request.status < 600) throw new Error("Bad response from server")
        const data = await request.json();
        return data;
    } catch (error) {
        console.log('ERR FETCH');
        return error;
    }
};

const filterData = (data) => {
    const { date, explanation, media_type, title } = data;
    let author, imageUrl, link;

    if (media_type === 'image') {
        author = data.copyright;
        imageUrl = data.url;
        link = data.hdurl;
    } else {
        imageUrl = data.thumbnail_url;
        link = data.url;
    }
    return { media_type, link, imageUrl, title, date, explanation, author}
};

const searchDay = () => {
    const pickedDay = $date.value;
    window.location.href = `?day=${pickedDay}`;
    
};

const preloadImage = (url) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = url;
    })
};

const main = async () => {
    try {
        $date.setAttribute("max", todayString());
        $date.setAttribute("value", dayParam);
        if (dayParam) {
            $loading.style.opacity = 1;
            const data = await fetchDataApod(dayParam);
            const { media_type, link, imageUrl, title, date, explanation, author} = filterData(data);
            const img = await preloadImage(imageUrl);
            console.log(img);
            renderInfo($result, media_type, link, imageUrl, title, date, explanation, author);
        }
        
    } catch (error) {
        console.log('ERR MAIN');
        console.log(error)
    }
};

main();