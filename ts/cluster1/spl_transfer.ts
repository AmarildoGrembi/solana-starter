import { Commitment, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import wallet from "../wba-wallet.json"
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Mint address
const mint = new PublicKey("G6zuBrG1Qss4EnThm89y9x6UjMMXyJWjM4bBouyEFrr2");

// Recipient address (Fellow turbine3 collegue)
const to = new PublicKey("NRbeR2CtzCRjTNRoWF2YeYZhiT3kJ941ydBaU7sTVDR");

(async () => {
    try {
        // Get the token account of the fromWallet address, and if it does not exist, create it
        const ataFrom = await getOrCreateAssociatedTokenAccount(connection, keypair, mint, keypair.publicKey);
        console.log(`Your ata is: ${ataFrom.address.toBase58()}`);

        // Get the token account of the toWallet address, and if it does not exist, create it
        const ataTo = await getOrCreateAssociatedTokenAccount(connection, keypair, mint, to);
        console.log(`Fellow ata is: ${ataTo.address.toBase58()}`);
        // Transfer the new token to the "toTokenAccount" we just created

        const transferTX = await transfer(connection, keypair, ataFrom.address, ataTo.address, keypair.publicKey, 20, []);
        console.log(`Your transfer txid: ${transferTX}`);

    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();