import { TOKEN_PROGRAM_ID, createMint } from '@solana/spl-token';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import * as bip39 from 'bip39';
import { config } from 'dotenv';
import { HDKey } from './HDKey';

config({
    path: './env'
})

export const getWallet = (index = 0): Keypair => {
    const DEFAULT_PATH = (index: number) => `m/44'/501'/${index}'/0'`;

    const seed = bip39.mnemonicToSeedSync(process.env.MNEMONIC as string);
    const hd = HDKey.fromMasterSeed(seed.toString('hex'));

    return Keypair.fromSeed(hd.derive(DEFAULT_PATH(index)).privateKey);
}

export const deployToken = async (connection: Connection, wallet: Keypair): Promise<PublicKey> => {
    const tokenProgramId: PublicKey = new PublicKey(TOKEN_PROGRAM_ID);

    process.stdout.write(`Deploying token... `);

    // Create new token mint
    const mintId = await createMint(
        connection,
        wallet,
        wallet.publicKey,
        null,
        9, // Decimals
        undefined,
        undefined,
        tokenProgramId
    );

    console.log(` MintId: ${mintId.toString()}`);

    return mintId;
}