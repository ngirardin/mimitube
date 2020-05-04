$folderIn = $args[0]
$folderOut = "$($folderIn)temp"

New-Item -Force -ItemType "directory" -Name "$folderOut" 

Get-ChildItem $folderIn -Filter *.mp4 | Foreach-Object { 
    $stdOut = (ffprobe.exe $_.FullName) 2>&1 | ForEach-Object { "$_" }
    $creationTimeLine = $stdOut[1].Split("`r") | Select-String -Pattern "creation_time   : (.*).000000Z"
    $creationTime = $creationTimeLine.Matches.Groups[1].Value

    #ffmpeg.exe -i $_.FullName -vf "scale=3840:2160,fps=fps=50" -c:v libx265 -preset veryfast -c:a aac -y "$($folderOut)\$($creationTime)-h265.mp4"
    
    # if (!$?) {
    #     exit
    # }

    # Remove the source file
    # Remove-Item $_.FullName
    Write-Output "$_;$creationTime "
}

# 931 le 14 


# Get-ChildItem $folderOut -Filter *.mp4 |
# Sort-Object |
# Foreach-Object { "file '$($_.Name)'" } |
# Out-File -FilePath $list -Encoding ascii

#ffmpeg.exe -f concat -safe 0 -i "$list" -c copy "$folderIn\out.mp4"