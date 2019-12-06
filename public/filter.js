let dropDownLoad = document.querySelector('.dropDownTemplate').innerHTML;
let carListTemplate = document.querySelector('.carList').innerHTML;

let dropDownTemplate = Handlebars.compile(dropDownLoad);
let carList = Handlebars.compile(carListTemplate);

let carsList = document.querySelector('.results');

let dropDowns = document.querySelector('.dropdowns');

window.onload = () => {
    let color;
    let brand;
    axios
        .get('http://api-tutor.herokuapp.com/v1/colors')
        .then(res => {
            color = res.data;
            color.unshift('any');
            axios
                .get('http://api-tutor.herokuapp.com/v1/makes')
                .then(res => {
                    brand = res.data;
                    brand.unshift('any');

                    let data = { color, brand };
                    let html = dropDownTemplate(data);
                    dropDowns.innerHTML = html;

                    let colorDropDown = document.querySelector('.colorDropDown');
                    let brandDropDown = document.querySelector('.brandDropDown');
                    let filterBtn = document.querySelector('.filterBtn');
                    let viewBtn = document.querySelector('.viewBtn');

                    viewBtn.addEventListener('click', () => {
                        axios
                            .get('/api/fetch/favourites')
                            .then(res => {
                                let list = res.data.response;
                                let cars = { select: false, items: list };
                                let html = carList(cars);
                                carsList.innerHTML = html;
                                renderRemove();
                            });
                    });

                    filterBtn.addEventListener('click', () => {
                        let color = colorDropDown.value;
                        let brand = brandDropDown.value;
                        if (color !== 'any' && brand !== 'any') {
                            axios
                                .get('http://api-tutor.herokuapp.com/v1/cars/make/' + brand + '/color/' + color)
                                .then(res => {
                                    let list = res.data
                                    let cars = { select: true, items: list };
                                    let html = carList(cars);
                                    carsList.innerHTML = html;
                                    renderSave();
                                });
                        } else if (color !== 'any' && brand === 'any') {
                            axios
                                .get('http://api-tutor.herokuapp.com/v1/cars/color/' + color)
                                .then(res => {
                                    let list = res.data
                                    let cars = { select: true, items: list };
                                    let html = carList(cars);
                                    carsList.innerHTML = html;
                                    renderSave();
                                });
                        } else if (color === 'any' && brand !== 'any') {
                            axios
                                .get('http://api-tutor.herokuapp.com/v1/cars/make/' + brand)
                                .then(res => {
                                    let list = res.data
                                    let cars = { select: true, items: list };
                                    let html = carList(cars);
                                    carsList.innerHTML = html;
                                    renderSave();
                                });
                        } else {
                            axios
                                .get('http://api-tutor.herokuapp.com/v1/cars')
                                .then(res => {
                                    let list = res.data
                                    let cars = { select: true, items: list };
                                    let html = carList(cars);
                                    carsList.innerHTML = html;
                                    renderSave();
                                });
                        }
                    })

                    const renderSave = () => {
                        let saveBtn = document.querySelector('.saveBtn');

                        saveBtn.addEventListener('click', () => {
                            const selected = Array.from(document.querySelectorAll(".saveChk:checked"));

                            const selectedCars = selected.map(e => e.value);
                            for (const car of selectedCars) {
                                let details = car.split('-');
                                let record = { make: details[0], model: details[1], color: details[2], price: details[3], reg_number: details[4] }
                                axios
                                    .post('/api/save/favourite', record)
                                    .then(res => {
                                        let response = res.data.response
                                        carsList.innerHTML = response;
                                    });
                            }
                        })
                    }

                    const renderRemove = () => {
                        let removeBtn = document.querySelector('.removeBtn');

                        removeBtn.addEventListener('click', () => {
                            const selected = Array.from(document.querySelectorAll(".saveChk:checked"));
                            const selectedCars = selected.map(e => e.value);
                            for (const car of selectedCars) {
                                let details = car.split('-');
                                let reg_number = details[4];
                                axios
                                    .post('/api/remove/favourite', { reg: reg_number })
                                    .then(res => {
                                        let list = res.data.response;
                                        let cars = { select: false, items: list };
                                        let html = carList(cars);
                                        carsList.innerHTML = html;
                                        renderRemove();
                                    });
                            }
                        });
                    }

                });

        });
}