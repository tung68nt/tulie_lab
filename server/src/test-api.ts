
import axios from 'axios';

async function test() {
    try {
        const id = 'c99ebfd5-0249-47d2-abed-bc7035a267eb';
        console.log(`Testing GET /api/courses/${id}/full ...`);
        // We need a token. I'll skip auth for a moment by calling the controller directly or assume it's publicly accessible for this test if I modify routes.
        // Actually, I can just use the diagnostic script approach but within the express app context if I want.
        // But the easiest is to just see if the route is registered.
    } catch (e) {
        console.error(e);
    }
}
test();
