const app = require('./app');
const Sectors = require('./models/EconomicSector')
async function main() {
    try {       
        require('./accessDB')
        Sectors.pullDB()
        //Starting the server
        app.listen(app.get("port"), () => {
            console.log("Server on port", app.get("port"));
        });
    } catch (e) {
        console.error(e)
    };
};

main();