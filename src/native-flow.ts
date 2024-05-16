import { Connection } from '@solana/web3.js';
import { mintTo } from '@solana/spl-token';
import { getWallet, deployToken } from './common';

const solWallet = getWallet();
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

async function transferToken(): Promise<void> {
    const mintId = await deployToken(connection, solWallet);

    // THIS WILL NOT WORK BECAUSE NO ATA
    await mintTo(
        connection,
        solWallet,
        mintId,
        solWallet.publicKey,
        solWallet.publicKey,
        1000000
    );

    console.log('Tokens set successfully.');
}


transferToken().then(r => {
        console.log(r)
    }
)