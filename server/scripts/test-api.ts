
import axios from 'axios';

async function test() {
    const url = 'http://localhost:5001/api/products?isPublished=true';
    console.log(`Calling API: ${url}`);
    try {
        const res = await axios.get(url);
        console.log('Status:', res.status);
        console.log('Total in meta:', res.data.meta?.total);
        console.log('Items returned:', res.data.data?.length);
        if (res.data.data?.length > 0) {
            console.log('First item title:', res.data.data[0].title);
            console.log('First item isPublished:', res.data.data[0].isPublished);
        }
    } catch (e: any) {
        console.error('API Call Failed:', e.message);
        if (e.response) {
            console.error('Response data:', e.response.data);
        }
    }
}

test();
