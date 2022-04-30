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

const advices = async (task) => {
    if (task.busisnessName === '') {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Debe colocar el nombre y selecconar el departamento en el que se encuentra la empresa',
        });
    } else {
        let res = await postIndex('/', task);
        window.location.href = res.url;
    };
}

const formHomeSubmit = () => {
    const buttonId = document.getElementById('formHome')
    buttonId.addEventListener('submit', async (e) => {
        e.preventDefault();
        let tasks = e.target.elements;

        let task = { name: '', sector: '' };

        task = {
            busisnessName: tasks[0].value.toUpperCase(),
            sector: tasks[1].value
        };

        advices(task)

    });
};

formHomeSubmit();