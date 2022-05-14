const app = require('./app');
const Sectors = require('./models/EconomicSector')
const Process = require('./models/Process.models')
async function main() {
    try {       
        require('./accessDB')
        Sectors.pullDB()
        Process.pullDB()
        //Starting the server
        app.listen(app.get("port"), () => {
            console.log("Server on port", app.get("port"));
        });
    } catch (e) {
        console.error(e)
    };
};

main();