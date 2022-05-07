const app = require('./app');
const Sectors = require('./models/economicSector')
async function main() {
    try {       
        require('./accessDB')
        Sectors.pullDB()
        //Starting the server
        app.listen(app.get("port"), () => {
            console.log("Server on port", app.get("port"));
        });
        require('./insert')
    } catch (e) {
        console.error(e)
    };
};

main();