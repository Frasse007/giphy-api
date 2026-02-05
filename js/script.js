console.log("script.js loaded");
// Gets API Key from config file to avoid committing it
const apiKey = CONFIG.API_KEY
const baseEndpoint = 'https://api.giphy.com/v1/gifs/search';

// Container, button and search/input field
const gifContainer = document.querySelector('#gif-container');
const fetchButton = document.querySelector('#fetch-gif-btn');
const searchInput = document.querySelector('#search-input');

// Array for image URLs
let images = [];

// Async function to fetch GIFs
async function getGifs(searchTerm) {
    // Builds the API endpoint URL using template literals
    const endpoint = `${baseEndpoint}?api_key=${apiKey}&q=${searchTerm}&limit=25&offset=0&rating=g&lang=en&bundle=messaging_non_clips`;

    console.log('Fetching from:', endpoint);

    try {
        // Shows loading to improve UX
        gifContainer.innerHTML = '<p class="text-center">Loading GIFs...</p>';

        // Gets data from Giphy API
        const response = await fetch(endpoint);

        // Checks that response is ok before parsing
        if (!response.ok) {
            throw new Error(`API Error: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();

        // Extracts only the original image URLs from the API response
        images = data.data.map(gif => gif.images.original.url);

        // Log to preview the data
        console.log('Fetched images:', images);
        console.log(`Found ${images.length} GIFs for: ${searchTerm}`);

        displayGifs();
    } catch (error) {
        console.error('Error fetching GIFs:', error);
    }
}

// Function to displays GIFs
function displayGifs() {
    // Clear anything currently in container
    gifContainer.innerHTML = '';

    // Check if there are images to display
    if (images.length === 0) {
        gifContainer.innerHTML = '<p class="text-center">No GIFs found. Try a different search!</p>';
        return;
    }

    // Iterate through images array and add each to the container
    images.forEach(imageUrl => {
        // Create HTML structure using template literals
        const imgElement = `
        <div class="col-lg-3 col-md-4 col-sm-6 mb-3">
            <img src="${imageUrl}" class="img-fluid rounded shadow-sm" alt="GIF" loading="lazy">
        </div>
        `;
        gifContainer.innerHTML += imgElement
    });
}

// Attaches event listener to search button
fetchButton.addEventListener('click', async () => {
    // Get the search term and remove any extra spaces with .trim()
    const searchTerm = searchInput.value.trim();
    
    // Checks if there is a search term
    if (searchTerm) {
        await getGifs(searchTerm)
    } else {
        alert('Please enter a search term!');
    }
});

// Allows pressing 'enter' while in the input field to search
searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        fetchButton.click();
    }
});