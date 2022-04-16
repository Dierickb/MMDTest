const statesArr = [
    {
        "id": 91,
        "name": "Amazonas",
        "lon": -1.0197222,
        "lat": -71.9383333
    },
    {
        "id": 5,
        "name": "Antioquia",
        "lon": 7,
        "lat": -75.5
    },
    {
        "id": 81,
        "name": "Arauca",
        "lon": 7.0902778,
        "lat": -70.7616667
    },
    {
        "id": 8,
        "name": "Atlántico",
        "lon": 10.75,
        "lat": -75
    },
    {
        "id": 13,
        "name": "Bolívar",
        "lon": 9,
        "lat": -74.3333333
    },
    {
        "id": 15,
        "name": "Boyacá",
        "lon": 5.5,
        "lat": -72.5
    },
    {
        "id": 17,
        "name": "Caldas",
        "lon": 5.25,
        "lat": -75.5
    },
    {
        "id": 18,
        "name": "Caquetá",
        "lon": 1,
        "lat": -74
    },
    {
        "id": 85,
        "name": "Casanare",
        "lon": 5.5,
        "lat": -71.5
    },
    {
        "id": 19,
        "name": "Cauca",
        "lon": 2.5,
        "lat": -76.8333333
    },
    {
        "id": 20,
        "name": "Cesar",
        "lon": 9.3333333,
        "lat": -73.5
    },
    {
        "id": 27,
        "name": "Chocó",
        "lon": 6,
        "lat": -77
    },
    {
        "id": 25,
        "name": "Cundinamarca",
        "lon": 5,
        "lat": -74.1666667
    },
    {
        "id": 23,
        "name": "Córdoba",
        "lon": 8.3333333,
        "lat": -75.6666667
    },
    {
        "id": 94,
        "name": "Guainía",
        "lon": 2.5,
        "lat": -69
    },
    {
        "id": 95,
        "name": "Guaviare",
        "lon": 1.6894444,
        "lat": -72.8202778
    },
    {
        "id": 41,
        "name": "Huila",
        "lon": 2.5,
        "lat": -75.75
    },
    {
        "id": 44,
        "name": "La Guajira",
        "lon": 11.5,
        "lat": -72.5
    },
    {
        "id": 47,
        "name": "Magdalena",
        "lon": 10,
        "lat": -74.5
    },
    {
        "id": 50,
        "name": "Meta",
        "lon": 3.5,
        "lat": -73
    },
    {
        "id": 52,
        "name": "Nariño",
        "lon": 1.5,
        "lat": -78
    },
    {
        "id": 54,
        "name": "Norte de Santander",
        "lon": 8,
        "lat": -73
    },
    {
        "id": 86,
        "name": "Putumayo",
        "lon": 0.5,
        "lat": -76
    },
    {
        "id": 63,
        "name": "Quindío",
        "lon": 4.5,
        "lat": -75.6666667
    },
    {
        "id": 66,
        "name": "Risaralda",
        "lon": 5,
        "lat": -76
    },
    {
        "id": 88,
        "name": "San Andrés",
        "lon": 12.5847222,
        "lat": -81.7005556
    },
    {
        "id": 68,
        "name": "Santander",
        "lon": 7,
        "lat": -73.25
    },
    {
        "id": 70,
        "name": "Sucre",
        "lon": 9,
        "lat": -75
    },
    {
        "id": 73,
        "name": "Tolima",
        "lon": 3.75,
        "lat": -75.25
    },
    {
        "id": 76,
        "name": "Valle del Cauca",
        "lon": 3.75,
        "lat": -76.5
    },
    {
        "id": 97,
        "name": "Vaupés",
        "lon": 0.25,
        "lat": -70.75
    },
    {
        "id": 99,
        "name": "Vichada",
        "lon": 5,
        "lat": -69.5
    }
];
const formHomeSelect = document.getElementById("formHomeSelect");

const postIndex = async (url, data) => {
    let json = JSON.stringify(data);
    return await fetch(url, {
        method: 'POST',
        body: json,
        headers: {
            'Content-Type': 'application/json'
        }
    })
    
};

const formHomeSubmit = () => {
    const buttonId = document.getElementById('formHome')
    buttonId.addEventListener('submit', async (e) => {
        let task = {
            name: '',
            sector: ''
        };
        e.preventDefault();

        let tasks = e.target.elements;
        task = {
            busisnessName: tasks[0].value.toUpperCase(),
            sector: tasks[1].value
        };

        if (task.busisnessName === '' ) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Debe colocar el nombre y selecconar el departamento en el que se encuentra la empresa',
            });
        } else {
            let res = await postIndex('/',task);
            window.location.href = res.url;
        };

    });
};

formHomeSubmit();