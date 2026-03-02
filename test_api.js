async function testHeroImages() {
    try {
        console.log('Testing GET http://localhost:5000/api/hero-images ...');
        const res = await fetch('http://localhost:5000/api/hero-images');
        console.log('Status:', res.status);
        if (res.ok) {
            const data = await res.json();
            console.log('Data:', data);
        } else {
            console.log('Response Status Text:', res.statusText);
        }
    } catch (err) {
        console.error('Error:', err.message);
    }
}

testHeroImages();
