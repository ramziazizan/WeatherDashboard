// script.js

// !!! PENTING: GANTI DENGAN KUNCI API ANDA DARI OpenWeatherMap !!!
const API_KEY = "a7828f00e8a3a6d923a96c1a3b87e1a6"; 
// Ganti "YOUR_API_KEY_HERE" dengan kunci yang Anda dapatkan setelah mendaftar di OpenWeatherMap.

const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const weatherResult = document.getElementById('weather-result');
const errorDisplay = document.getElementById('error-message');

// Set kota default Medan saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    // Karena nilai input sudah "Medan, ID", kita panggil pencarian otomatis
    getWeather(cityInput.value); 
});

// Event Listener saat tombol dicari diklik
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeather(city);
    }
});

// Event Listener saat tombol ENTER ditekan di input
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) {
            getWeather(city);
        }
    }
});


// --- FUNGSI ASINKRON UTAMA: MENGAMBIL DATA DARI API ---
async function getWeather(city) {
    // 1. Tampilkan loading dan bersihkan error
    weatherResult.innerHTML = '<p class="loading-text">Sedang mengambil data...</p>';
    errorDisplay.textContent = ''; 

    // 2. Buat URL API
    // units=metric: menggunakan Celcius (°C)
    // q=${city}: menggunakan kota yang dimasukkan
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    try {
        // 3. Panggil API menggunakan fetch()
        const response = await fetch(apiUrl);

        // 4. Tangani jika respons tidak berhasil (misal: Kota tidak ditemukan)
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Kota tidak ditemukan. Mohon periksa ejaan.');
            }
            throw new Error(`Gagal mengambil data cuaca (Status: ${response.status})`);
        }

        // 5. Konversi respons menjadi JSON
        const data = await response.json();

        // 6. Tampilkan hasilnya
        displayWeather(data);

    } catch (error) {
        // 7. Tampilkan pesan error
        errorDisplay.textContent = `Error: ${error.message}`;
        weatherResult.innerHTML = ''; // Kosongkan tampilan cuaca
    }
}


// --- FUNGSI MENAMPILKAN HASIL CUACA KE HTML ---
function displayWeather(data) {
    // Ambil data penting
    const cityName = data.name;
    const temp = Math.round(data.main.temp); // Suhu dibulatkan
    const description = data.weather[0].description;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed; // Kecepatan angin dalam meter/detik

    // Buat HTML untuk menampilkan hasil
    weatherResult.innerHTML = `
        <p class="city-name">${cityName}</p>
        <p class="temperature">${temp}°C</p>
        <p class="description">${description.charAt(0).toUpperCase() + description.slice(1)}</p>
        <div class="details">
            <p>Kelembapan: ${humidity}%</p>
            <p>Kecepatan Angin: ${windSpeed} m/s</p>
        </div>
    `;
    
    // Opsional: Tambahkan sedikit penyesuaian CSS/tema berdasarkan cuaca (misalnya jika hujan)
    const weatherMain = data.weather[0].main.toLowerCase();
    if (weatherMain.includes('rain') || weatherMain.includes('drizzle')) {
        weatherResult.style.background = 'linear-gradient(135deg, #888 0%, #444 100%)';
    } else if (weatherMain.includes('clear')) {
        weatherResult.style.background = 'linear-gradient(135deg, #6dd5fa 0%, #2980b9 100%)';
    } else {
         weatherResult.style.background = 'linear-gradient(135deg, #f7f7f7 0%, #ccc 100%)';
    }
}
