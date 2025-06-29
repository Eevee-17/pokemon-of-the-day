async function load_api() {
    let api_resp = await fetch("./pokemon_days.json");
    if (api_resp.ok) {
        return await api_resp.json();
    }
    return null;
}

let date = new Date();

let day_formatted;
if (date.getDate() < 10) {
    day_formatted = '0' + date.getDate();
} else {
    day_formatted = date.getDate().toString();
}

let date_formatted = (date.getMonth() + 1) + '/' + day_formatted;

date_disp.innerHTML = date_formatted;


load_api().then(api => {
    if (api) {
        potd.innerHTML = api[date_formatted];
    }
});
