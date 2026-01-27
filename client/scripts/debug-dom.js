const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    try {
        // Navigate to localhost:3000
        console.log('Navigating to http://localhost:3000...');
        await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 60000 });

        // Wait for the specific section to be visible
        console.log('Waiting for "coding-methods" section...');
        const selector = 'h2';
        await page.waitForSelector(selector);

        // Evaluate valid sections
        const html = await page.evaluate(() => {
            // Find the specific h2 with text "5 Cấp độ"
            const headings = Array.from(document.querySelectorAll('h2'));
            const targetHeading = headings.find(h => h.textContent.includes('5 Cấp độ'));

            if (targetHeading) {
                // Traverse up to find the container section
                let section = targetHeading.closest('section');
                return section ? section.outerHTML : 'Section found but outerHTML failed';
            }
            return 'Heading "5 Cấp độ" not found';
        });

        console.log('--- DOM DUMP START ---');
        console.log(html);
        console.log('--- DOM DUMP END ---');

    } catch (error) {
        console.error('Error during DOM inspection:', error);
    } finally {
        await browser.close();
    }
})();
