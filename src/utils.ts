export function cron_to_string(cron: string) {
  const [minutes, hour, _days, _months, weekdays] = cron.split(" ");

  let zero_minutes;
  if (+minutes == 0) {
    zero_minutes = "00";
  }

  return hour + ":" + (zero_minutes || minutes) + " " + get_weekdays_from_cron(weekdays)
}

function get_weekdays_from_cron(weekdays_cron: string) {
  if (isNaN(Number.parseInt(weekdays_cron))) return "gpt-generated";

  let result = "";
  const weekdays = weekdays_cron.split(",");

  for (const day of weekdays) {
    if (day == "") break;
    const index = +day;
    if (result.length > 0) {
      result += ", " + Weekdays[index]
    } else {
      result += Weekdays[index]
    }
  }

  return result
}

enum Weekdays {
  "mon" = 1,
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
  "sun"
}