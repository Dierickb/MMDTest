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
    if (task.busisnessName === '' || task.sector === 'Sector empresarial') {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Debe colocar el nombre y el sector al que pertenece la empresa',
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

        task = {
            busisnessName: tasks[0].value.toUpperCase(),
            sector: tasks[1].value
        };

        advices(task)

    });
};

formHomeSubmit();