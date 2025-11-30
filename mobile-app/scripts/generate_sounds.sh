#!/bin/bash

# Create sounds directory if it doesn't exist
mkdir -p mobile-app/assets/sounds

# 1. Collect Coin: High pitch ping (Sine wave, short decay)
ffmpeg -y -f lavfi -i "sine=frequency=1000:duration=0.1" -af "afade=t=out:st=0:d=0.1" mobile-app/assets/sounds/collect_coin.mp3

# 2. Upgrade Start: Mechanical noise (Sawtooth, lower pitch)
ffmpeg -y -f lavfi -i "anoisesrc=c=brown:r=44100:a=0.5:d=0.5" -af "lowpass=f=500" mobile-app/assets/sounds/upgrade_start.mp3

# 3. Upgrade Complete: Fanfare (Major chord arpeggio)
ffmpeg -y -f lavfi -i "sine=frequency=523.25:duration=0.1" -f lavfi -i "sine=frequency=659.25:duration=0.1" -f lavfi -i "sine=frequency=783.99:duration=0.4" -filter_complex "[0:a][1:a][2:a]concat=n=3:v=0:a=1" mobile-app/assets/sounds/upgrade_complete.mp3

# 4. Drill Plant: Whoosh (White noise sweep)
ffmpeg -y -f lavfi -i "anoisesrc=color=white:duration=0.3" -af "volume='if(lt(t,0.15), 4*t, 1-4*(t-0.15))':eval=frame" mobile-app/assets/sounds/drill_plant.mp3

# 5. Drill Harvest: Pop + Chime
ffmpeg -y -f lavfi -i "sine=frequency=800:duration=0.05" -f lavfi -i "sine=frequency=1200:duration=0.2" -filter_complex "[0:a][1:a]concat=n=2:v=0:a=1" mobile-app/assets/sounds/drill_harvest.mp3

# 6. Button Tap: Short click
ffmpeg -y -f lavfi -i "sine=frequency=2000:duration=0.02" -af "afade=t=out:st=0:d=0.02" mobile-app/assets/sounds/button_tap.mp3

# 7. Error: Low buzz
ffmpeg -y -f lavfi -i "sawtooth=frequency=150:duration=0.3" -af "afade=t=out:st=0.2:d=0.1" mobile-app/assets/sounds/error.mp3

echo "Placeholder sounds generated in mobile-app/assets/sounds/"
