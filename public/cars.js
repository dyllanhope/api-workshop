let listTemplate = document.querySelector('.list').innerHTML;
let carListTemplate = document.querySelector('.carList').innerHTML;
let template = Handlebars.compile(listTemplate);
let carList = Handlebars.compile(carListTemplate);
let colorList = document.querySelector('.colors');
let brandList = document.querySelector('.brands');
let carsList = document.querySelector('.cars');

axios
.get('http://api-tutor.herokuapp.com/v1/colors')
.then(res => {
    let list = res.data
    let colors = { items: list };
    let html = template(colors);
    
    colorList.innerHTML = html;
});

axios
.get('http://api-tutor.herokuapp.com/v1/makes')
.then(res => {
    let list = res.data
    let makes = { items: list };
    let html = template(makes);
    
    brandList.innerHTML = html;
});

axios
.get('http://api-tutor.herokuapp.com/v1/cars')
.then(res => {
    let list = res.data
    let cars = {items: list};
    let html = carList(cars);
    carsList.innerHTML = html;
});
