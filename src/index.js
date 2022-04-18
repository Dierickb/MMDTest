const app = require('./app');

async function main() {
    try {       
        console.log('Database connected');
        //Starting the server
        app.listen(app.get("port"), () => {
            console.log("Server on port", app.get("port"));
        });
    } catch (e) {
        console.error(e)
    };
};

main();