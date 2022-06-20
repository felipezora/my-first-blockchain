const transactionQueue = [];
const blockChain = [];
const chainHashes = [];

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

// Taken from https://stackoverflow.com/questions/59777670/how-can-i-hash-a-string-with-sha256-in-js
function sha256(ascii) {
    function rightRotate(value, amount) {
        return (value>>>amount) | (value<<(32 - amount));
    };
    
    var mathPow = Math.pow;
    var maxWord = mathPow(2, 32);
    var lengthProperty = 'length'
    var i, j; // Used as a counter across the whole file
    var result = ''

    var words = [];
    var asciiBitLength = ascii[lengthProperty]*8;
    
    //* caching results is optional - remove/add slash from front of this line to toggle
    // Initial hash value: first 32 bits of the fractional parts of the square roots of the first 8 primes
    // (we actually calculate the first 64, but extra values are just ignored)
    var hash = sha256.h = sha256.h || [];
    // Round constants: first 32 bits of the fractional parts of the cube roots of the first 64 primes
    var k = sha256.k = sha256.k || [];
    var primeCounter = k[lengthProperty];
    /*/
    var hash = [], k = [];
    var primeCounter = 0;
    //*/

    var isComposite = {};
    for (var candidate = 2; primeCounter < 64; candidate++) {
        if (!isComposite[candidate]) {
            for (i = 0; i < 313; i += candidate) {
                isComposite[i] = candidate;
            }
            hash[primeCounter] = (mathPow(candidate, .5)*maxWord)|0;
            k[primeCounter++] = (mathPow(candidate, 1/3)*maxWord)|0;
        }
    }
    
    ascii += '\x80' // Append Ƈ' bit (plus zero padding)
    while (ascii[lengthProperty]%64 - 56) ascii += '\x00' // More zero padding
    for (i = 0; i < ascii[lengthProperty]; i++) {
        j = ascii.charCodeAt(i);
        if (j>>8) return; // ASCII check: only accept characters in range 0-255
        words[i>>2] |= j << ((3 - i)%4)*8;
    }
    words[words[lengthProperty]] = ((asciiBitLength/maxWord)|0);
    words[words[lengthProperty]] = (asciiBitLength)
    
    // process each chunk
    for (j = 0; j < words[lengthProperty];) {
        var w = words.slice(j, j += 16); // The message is expanded into 64 words as part of the iteration
        var oldHash = hash;
        // This is now the undefinedworking hash", often labelled as variables a...g
        // (we have to truncate as well, otherwise extra entries at the end accumulate
        hash = hash.slice(0, 8);
        
        for (i = 0; i < 64; i++) {
            var i2 = i + j;
            // Expand the message into 64 words
            // Used below if 
            var w15 = w[i - 15], w2 = w[i - 2];

            // Iterate
            var a = hash[0], e = hash[4];
            var temp1 = hash[7]
                + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) // S1
                + ((e&hash[5])^((~e)&hash[6])) // ch
                + k[i]
                // Expand the message schedule if needed
                + (w[i] = (i < 16) ? w[i] : (
                        w[i - 16]
                        + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15>>>3)) // s0
                        + w[i - 7]
                        + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2>>>10)) // s1
                    )|0
                );
            // This is only used once, so *could* be moved below, but it only saves 4 bytes and makes things unreadble
            var temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) // S0
                + ((a&hash[1])^(a&hash[2])^(hash[1]&hash[2])); // maj
            
            hash = [(temp1 + temp2)|0].concat(hash); // We don't bother trimming off the extra ones, they're harmless as long as we're truncating when we do the slice()
            hash[4] = (hash[4] + temp1)|0;
        }
        
        for (i = 0; i < 8; i++) {
            hash[i] = (hash[i] + oldHash[i])|0;
        }
    }
    
    for (i = 0; i < 8; i++) {
        for (j = 3; j + 1; j--) {
            var b = (hash[i]>>(j*8))&255;
            result += ((b < 16) ? 0 : '') + b.toString(16);
        }
    }
    return result;
};

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

// Takes the first two transactions from the transactionQueue and make a block with a default nonce and two transactions
function prebuildBlock(){
    if(transactionQueue.length > 1){
        let blockTransactions = [];
        let transactionsHashes = [];
        blockTransactions.push(transactionQueue.shift());
        blockTransactions.push(transactionQueue.shift());
        for(let k = 0; k<blockTransactions.length; k++){
            let elem = JSON.stringify(blockTransactions[i]);
            hash(elem).then((hex) => transactionsHashes.push(hex));
        }
        let combinedHash = transactionsHashes.shift();
        combinedHash += transactionsHashes.shift();
        let rootHash = "";
        hash(combinedHash).then((hex) => rootHash = hex);
        if(blockChain.length < 1){
            let newBlock = {
                "header": {
                    "blockIndex": blockChain.length,
                    "prevHash": "random",
                    "rootHash": rootHash,
                    "nonce": 0
                },
                "blockTransactions": blockTransactions
            };
            blockChain.push(newBlock);
        } else {
            let lastBlock = blockChain[blockChain.length-1];
            let newBlock = {
                "header": {
                    "prevHash": lastBlock[""],
                    "rootHash": rootHash,
                    "nonce": 0
                },
                "blockTransactions": blockTransactions
            }
        }
    }
}

// Make a Merkle Tree with all the transactions of the passed array of transactions
function merkleTree(transactionsArr){
    if(transactionsArr && transactionsArr.length > 0){
        let treeBelow = [];
        let actualTree = [...transactionsArr];
        while(actualTree.length > 0){
            // in case we are in the lower branch of the tree, all tree leaves are of object type
            if(typeof actualTree[0] == 'object'){
                let first = JSON.stringify(actualTree.shift());
                let second = JSON.stringify(actualTree.shift());
                let levelHash = '';
                if(second){
                    levelHash += sha256(first);
                    levelHash += sha256(second);
                    levelHash = sha256(levelHash);
                    treeBelow.push(levelHash);
                } else {
                    levelHash = sha256(first);
                    treeBelow.push(levelHash);
                }
            } // in case we are not in the lower branch of the tree, all tree leaves are of string type
            else if(typeof actualTree[0] == 'string'){
                let first = actualTree.shift();
                let second = actualTree.shift();
                let levelHash = '';
                if(second){
                    levelHash += first;
                    levelHash += second;
                    levelHash = sha256(levelHash);
                    treeBelow.push(levelHash);
                } else {
                    treeBelow.push(first);
                }
            } else {
                console.log('ERROR');
                return null;
            }
        } if(treeBelow.length > 1){
            treeBelow.unshift(merkleTree(treeBelow))
        }
        return treeBelow[0];
    } else {
        console.log('ERROR');
        return null;
    }
}

function proofOfWork(){}