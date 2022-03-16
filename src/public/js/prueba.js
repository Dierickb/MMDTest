textPrueba = () => {    
    const createDiv = document.createElement('p');
    const newContent = document.createTextNode("Holsadas5343asssss Dierick");

    createDiv.appendChild(newContent);

    let currentDiv = document.getElementById('dierickb');
    document.body.insertBefore(createDiv, currentDiv);
}

textPrueba()
