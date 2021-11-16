const a = document.getElementsByTagName('a')[0];
const queryObject = {};
const search = window.location.search;
search.replace(/([^&=?]+)=([^&]+)/g, (m, $1, $2) => (queryObject[$1] = decodeURIComponent($2)));

a.href = queryObject.redirectUrl;

document.cookie = `userId=lubai1123123`;

// document.write(queryObject.name)