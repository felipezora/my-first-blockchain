const transactionQueue = [];

// Returns a random integer from 0 to 100
function rand(){
    return Math.floor(Math.random() * 101)
}

wallets = {
    "Bob": rand(),
    "Alice": rand(),
    "Natalia": rand(),
    "Marina": rand(),
    "Leandro": rand(),
    "Edgar": rand(),
    "David": rand(),
    "Daniel": rand(),
    "Daniela": rand(),
    "Nicolás": rand(),
    "Felipe": rand(),
    "Juan": rand(),
    "Diana": rand(),
    "Gabriel": rand()
};

// to create a hash value from a String using SHA256
async function hash(string) {
    const utf8 = new TextEncoder().encode(string);
    const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((bytes) => bytes.toString(16).padStart(2, '0'))
      .join('');
    return hashHex;
}
// how to use it
hash('foo').then((hex) => console.log(hex));

// Transfers ZORACOINS from wallet of the person A to wallet of the person B
function transfer(fromWallet, toWallet, ammount){
    var ammountInt = 0;
    // initial validations
    if(typeof ammount == "number" && wallets[fromWallet] && wallets[toWallet]){
        ammountInt = parseInt(ammount);
    } else {
        return "Error en la transacción";
    }
    if(wallets[fromWallet] > ammountInt && ammountInt > 0){
        wallets[fromWallet] = wallets[fromWallet] - ammountInt;
        wallets[toWallet] = wallets[toWallet] + ammountInt;
        let newTransaction = {
            "origin_wallet_updated": wallets[fromWallet],
            "destination_wallet_updated": wallets[toWallet],
            "description": `${fromWallet} ha transferido ${ammount} ZORACOINS a ${toWallet}`
        }
        transactionQueue.push(newTransaction);
        return "Transferencia exitosa";
    } else {
        return "Error en la transacción";
    }
}

// Takes the first two transactions from the transactionQueue and make a block
function mineBlock(){

}

function proofOfWork(){}