const postDatos = async (data) => {
    let json = JSON.stringify(data);
    return await fetch( ('/PrevTest'), {
        method: 'POST',
        body: json,
        headers: {
            'Content-Type': 'application/json'
        }
    })
};

const checkBoxFunc = (taskss) => {
    let taskk = [];
    let k = 0;
    for (let j = 0; j < taskss.length; j++) {
        if (taskss[j].checked === true) {
            taskk[k] = parseInt(taskss[j].id);
            k = k + 1;
        };
    };
    return taskk;
};


const validateCardsContent = async () => {
    const principalProcess = document.getElementById("principalProcess");

    principalProcess.addEventListener('submit', async (e) => {
        e.preventDefault();

        const task = checkBoxFunc(e.target.elements)

        await postDatos(task)
        window.location.href = "/MinTicTest";
    });
};

validateCardsContent();