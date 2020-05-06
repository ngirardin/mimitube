$in = ".\GX012931.MP4"

# 360
ffmpeg.exe -i $in -vf "drawtext=text=360:fontcolor=white:fontsize=1000,scale=640x360,fps=fps=30" -b:v 276k -minrate 138k -maxrate 400k -tile-columns 1 -g 240 -threads 4 -quality good -crf 36 -c:v libvpx-vp9 -c:a libopus -pass 1 -speed 4 640x360_30.webm
ffmpeg.exe -i $in -vf "drawtext=text=360:fontcolor=white:fontsize=1000,scale=640x360,fps=fps=30" -b:v 276k -minrate 138k -maxrate 400k -tile-columns 1 -g 240 -threads 4 -quality good -crf 36 -c:v libvpx-vp9 -c:a libopus -pass 2 -speed 4 -y 640x360_30.webm

# 720
ffmpeg.exe -i $in -vf "drawtext=text=720:fontcolor=white:fontsize=1000,scale=1280x720,fps=fps=50" -b:v 1800k -minrate 900k -maxrate 2610k -tile-columns 2 -g 240 -threads 8 -quality good -crf 32 -c:v libvpx-vp9 -c:a libopus -pass 1 -speed 4  1280x720_50.webm
ffmpeg.exe -i $in -vf "drawtext=text=720:fontcolor=white:fontsize=1000,scale=1280x720,fps=fps=50" -b:v 1800k -minrate 900k -maxrate 2610k -tile-columns 2 -g 240 -threads 8 -quality good -crf 32 -c:v libvpx-vp9 -c:a libopus -pass 2 -speed 4 -y 1280x720_50.webm

# 1080
ffmpeg.exe -i $in -vf "drawtext=text=1080:fontcolor=white:fontsize=1000,scale=1920x1080,fps=fps=50" -b:v 3000k -minrate 1500k -maxrate 4350k -tile-columns 2 -g 240 -threads 8 -quality good -crf 31 -c:v libvpx-vp9 -c:a libopus -pass 1 -speed 4  1920x1080_50.webm
ffmpeg.exe -i $in -vf "drawtext=text=1080:fontcolor=white:fontsize=1000,scale=1920x1080,fps=fps=50" -b:v 3000k -minrate 1500k -maxrate 4350k -tile-columns 3 -g 240 -threads 8 -quality good -crf 31 -c:v libvpx-vp9 -c:a libopus -pass 2 -speed 4 -y 1920x1080_50.webm

# # 2160 h265
# ffmpeg.exe -i $in -vf "scale=3840x2160,fps=fps=50" -c:v libx265 -c:a aac 3840x2160_50.mp4

# 2160 vp9
ffmpeg.exe -i $in -vf "drawtext=text=2160:fontcolor=white:fontsize=1000,scale=3840x2160,fps=fps=50" -b:v 18000k -minrate 9000k -maxrate 26100k -tile-columns 3 -g 240 -threads 24 -quality good -crf 15 -c:v libvpx-vp9 -c:a libopus -pass 1 -speed 4  3840x2160_50.webm 
ffmpeg.exe -i $in -vf "drawtext=text=2160:fontcolor=white:fontsize=1000,scale=3840x2160,fps=fps=50" -b:v 18000k -minrate 9000k -maxrate 26100k -tile-columns 3 -g 240 -threads 24 -quality good -speed 4 -crf 15 -c:v libvpx-vp9 -c:a libopus -pass 2 -y 3840x2160_50.webm

.\packager-win.exe `
    in="640x360_30.webm, stream=video, output=360.webm" `
    in="1280x720_50.webm, stream=video, output=720.webm" `
    in="1920x1080_50.webm, stream=video, output=1080.webm" `
    in="3840x2160_50.webm, stream=video, output=2160.webm" `
    --ad_cues "500;200;300" `
    --mpd_output out.mpd