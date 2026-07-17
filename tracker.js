const { execSync } = require('child_process');
const fs = require('fs');

const SHORTS_LIMIT_SECONDS = 60; 
let shortsWatchedTime = 0;

console.log("Remote Tracker Started... Monitoring your main phone.");

setInterval(() => {
    try {
        // Remotely grab screen layout from main phone over Wi-Fi
        execSync("adb shell uiautomator dump /data/local/tmp/uidump.xml", { stdio: 'ignore' });
        execSync("adb pull /data/local/tmp/uidump.xml .", { stdio: 'ignore' });
        
        const layoutData = fs.readFileSync('uidump.xml', 'utf8').toLowerCase();
        
        if (layoutData.includes('text="shorts"')) {
            shortsWatchedTime += 2;
            console.log(`Shorts detected! Total time: ${shortsWatchedTime}s`);
            
            if (shortsWatchedTime >= SHORTS_LIMIT_SECONDS) {
                console.log("Limit reached! Closing YouTube and launching Plank screen.");
                
                // Close YouTube on main phone
                execSync("adb shell am force-stop com.google.android.youtube");
                
                // PASTE YOUR GITHUB PAGES URL HERE TO OPEN IT ON YOUR MAIN PHONE:
                execSync("adb shell am start -a android.intent.action.VIEW -d https://mehdude12.github.io/shorts-blocker/");
                
                shortsWatchedTime = 0; 
            }
        }
    } catch (error) {
        // Keeps script running if Wi-Fi blips
    }
}, 2000);
