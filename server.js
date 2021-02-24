let exec = require('child_process').exec;
const msgpack = require("msgpack-lite");
function splitLines(t) { return t.split(/\r\n|\r|\n/); }
exec('cd NimbusReliefFunding && REACH_CONNECTOR_MODE=ALGO REACH_DEBUG=1 ./reach run', (err, stdout, stderr) =>{
    let splited = splitLines(stdout);
    let transationNumber = 1;
    console.log("Transations:");
    let isSmartContract = false;
    let startOfSmartContract = false;
    for(line of splited){
        //console.log(line);
        if (isSmartContract) {
            if (!startOfSmartContract) {
                console.log("Transation number:" + transationNumber);
                startOfSmartContract = true;
            }
            console.log(line);
            transationNumber++;
            if(line === "}"){
                isSmartContract = false;
                startOfSmartContract = false;
            }
        }
        if(line.startsWith("smart contract transaction:")){
            isSmartContract = true;
            // console.log("Is smart contract");
            continue;
        }
        if(line.includes("sendAndConfirm:")){
            console.log("Transation number:" + transationNumber);
            let decoded = msgpack.decode(Buffer.from(line.split("sendAndConfirm: ")[1], 'base64'));
            //console.log(decoded);
            for (const key in decoded) {
                if (Object.hasOwnProperty.call(decoded, key)) {
                    const element = decoded[key];
                    // console.log("key:");
                    // console.log(key);
                    process.stdout.write(key + ": ")
                    if(key === "sig"){                     
                        console.log(Buffer.from(element).toString('base64'));    
                    }
                    else{
                        console.log("{");    
                        for (const innerKey in element) {
                            if (Object.hasOwnProperty.call(element, innerKey)) {
                                const el = element[innerKey];
                                process.stdout.write(innerKey+": ");
                                if (Buffer.isBuffer(el)) {
                                    if (innerKey === "note") {
                                        console.log(Buffer.from(el).toString());    
                                        
                                    }
                                    else{
                                        console.log(Buffer.from(el).toString("base64"));    

                                    }
                                }
                                else{
                                    console.log(el);
                                }
                            }
                        }
                        console.log("}");
                    }
                        
                }
            }
            transationNumber++;
            console.log("");
            //console.log(line.split("sendAndConfirm: ")[1]);
        }
    }
});
