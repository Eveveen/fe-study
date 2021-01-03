// 如当前url="https://www.baidu.com"， 跳转到"https://www.baidu.com/s?wd=js"
// 1. window.hisotry.pushState(data, title, url)
window.hisotry.pushState(null, null, 'https://www.baidu.com/s?wd=js');

// 2. window.hisotry.replaceState(data, title, url)
window.hisotry.replaceState(null, null, 'https://www.baidu.com/s?wd=js');
