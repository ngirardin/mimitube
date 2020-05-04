const fs = require("fs");

const lines = fs
  .readFileSync("in.csv")
  .toString()
  .split("\r\n")
  .map(line => {
    const [file, dateInStr] = line.split(",");
    const dateIn = new Date(dateInStr);

    const newMonth = dateIn.getMonth() + 2;
    const newDay = dateIn.getDate() + 2;
    const newHour = dateIn.getHours() + 12;
    const newMinutes = dateIn.getMinutes();

    const newMonthF = newMonth < 10 ? `0${newMonth}` : newMonth;
    const newDayF = newDay < 10 ? `0${newDay}` : newDay;
    const newHour24 = newHour > 24 ? newHour - 24 : newHour;
    const newHourF = newHour24 < 10 ? `0${newHour24}` : newHour24;
    const newMinutesF = newMinutes < 10 ? `0${newMinutes}` : newMinutes;

    const dateOut = `2020-${newMonthF}-${newDayF} ${newHourF}:${newMinutesF}:00`;

    const out = `ffmpeg -i ${file} -metadata creation_time="${dateOut}" -c copy out/${file}`;

    console.log([file, dateInStr, dateOut]);
    return out;
  });

fs.writeFileSync("3_update_dates.ps1", lines.join("\n"));
