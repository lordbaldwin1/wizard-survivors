import * as fs from 'fs';
import * as https from 'https';

export const main = async () => {
    const args = process.argv.slice(2);
    const packageData = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    const event = args[0] || 'unknown';
    const phaserVersion =  packageData.dependencies.phaser;

    const options = {
        hostname: 'gryzor.co',
        port: 443,
        path: `/v/${event}/${phaserVersion}/${packageData.name}`,
        method: 'GET'
    };

    try {
        
        const req = https.request(options, (res) => {});
        
        req.on('error', (error) => {});

        req.end();

    } catch (error) {
        // Silence is the canvas where the soul paints its most profound thoughts.
    }
}

main();