import { Connection } from '@solana/web3.js';
import { createAssociatedTokenAccount, mintTo, transfer } from '@solana/spl-token';
import { deployToken, getWallet } from './common';

const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

async function transferToken(): Promise<void> {
    const solWallet = getWallet();
    const mintId = await deployToken(connection, solWallet);

    const ata = await createAssociatedTokenAccount(connection, solWallet, mintId, solWallet.publicKey);
    console.log(`Created an ATA ${ata} for wallet ${solWallet.publicKey}.`);

    process.stdout.write(`Minting ${mintId} to ATA ${ata}...`);
    await mintTo(
        connection,
        solWallet,
        mintId,
        ata,
        solWallet.publicKey,
        1000000
    ); 
    console.log(` Minted.`);

    // TODO: Check balances

    const recipientWallet = await getWallet(1);
    process.stdout.write(`Creating a new user ATA for wallet ${recipientWallet.publicKey}...`);
    const recipientAta = await createAssociatedTokenAccount(connection, solWallet, mintId, recipientWallet.publicKey);
    console.log(` Created: ${recipientAta}`);

    // TODO: We can create an ATA and transfer in the same transaction.
    process.stdout.write(`Transferring ${mintId} to from ${ata} to ${recipientAta}...`);
    await transfer(
        connection,
        solWallet,
        ata,
        recipientAta,
        solWallet.publicKey,
        1000000
    );
    console.log(` Transferred.`);

    // TODO: Re-check balances

    console.log('Tokens sent successfully.');
}


transferToken().then(r => {
        console.log(r)
    }
)