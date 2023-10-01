import {
    ASSOCIATED_TOKEN_PROGRAM_ID,
    getAssociatedTokenAddress,
    TOKEN_PROGRAM_ID,
	createAssociatedTokenAccount,
} from '@solana/spl-token';
import {
    Connection,
    Keypair,
    PublicKey,
    SystemProgram,
    SYSVAR_RENT_PUBKEY,
    TransactionInstruction,
    Transaction,
    sendAndConfirmTransaction,
} from '@solana/web3.js';
import {
    criarKeypair,
} from './util';
import fs from 'mz/fs';
import os from 'os';
import path from 'path';
import yaml from 'yaml';


const lo = require("buffer-layout");


const CONFIG_FILE_PATH = path.resolve(
    os.homedir(),
    '.config',
    'solana',
    'cli',
    'config.yml',
);

async function getOrCreateAssociatedTokenAccount(
    connection: Connection,
    mint: PublicKey,
    wallet: Keypair
): Promise<PublicKey> {
    const associatedTokenAddress = await getAssociatedTokenAddress(mint, wallet.publicKey)
    if (await connection.getAccountInfo(associatedTokenAddress)) {
		console.log(`found associated token account for ${wallet.publicKey.toBase58()} - ${associatedTokenAddress}`)
        return associatedTokenAddress
    }


    console.log("create associated token account for", wallet.publicKey.toBase58())
    return await createAssociatedTokenAccount(connection, wallet, mint , wallet.publicKey)
}


export async function main() {

    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
    console.log(`Solana dev net OK`);

    const progKeypair = await criarKeypair(
        path.join(
            path.resolve(__dirname, './dist/program'), 
            'mint-keypair.json'
    ));
    const progId = progKeypair.publicKey;
    console.log(`Program: ${progId.toBase58()}`);
    
	const userKeypair = await criarKeypair(
        path.join(
            path.resolve(__dirname, './soldev'), 
            'hospede.json'
    ));
	
	console.log(`From: ${userKeypair.publicKey.toBase58()}`);
	
	const toKeypair = await criarKeypair(
        path.join(
            path.resolve(__dirname, './soldev'), 
            'nomah.json'
    ));
	
    console.log(`To: ${toKeypair.publicKey.toBase58()}`);
	
	const anotherKeypair = await criarKeypair(
        path.join(
            path.resolve(__dirname, './soldev'), 
            'proprietario.json'
    ));
	
    console.log(`To: ${anotherKeypair.publicKey.toBase58()}`);
	
	const nomahPublicKey = new PublicKey("BjgVt1qWfn1zg3nfD558WJ817gAtMk1BPtwzkEewVDfT");
	
	const nftPublicKey = new PublicKey("7kXDdo8DHxE2P7FojMdWDQN2Ub8tcrG5J2nSS3TGMPD6");
	const authorityPubkey = new PublicKey("DHXkmtaajZJ7TWhoRTthqZew3x6hTHibur18ACiz5zdE");
	const nomahTokenPubkey = new PublicKey("AQLkjCye1AcmG9WGpU7Jgq2A5Av1Sw5ChnTyErF9AXk6");
	const fromTokenPubkey = await getOrCreateAssociatedTokenAccount(connection, nftPublicKey, userKeypair);
	
	const mintAuthority = new PublicKey("DHXkmtaajZJ7TWhoRTthqZew3x6hTHibur18ACiz5zdE");

	let data = Buffer.alloc(8) // 8 bytes
    lo.ns64("value").encode(5000000, data);

    const instrucoes = new TransactionInstruction({
        keys: [
			// user 
            {
                pubkey: userKeypair.publicKey,
                isSigner: true,
                isWritable: true,
            },
			// pricipal service provider
            {
                pubkey: toKeypair.publicKey,
                isSigner: false,
                isWritable: true,
            },
			// loyalty payee
			{
                pubkey: anotherKeypair.publicKey,
                isSigner: false,
                isWritable: true,
            },
			// NFT owner at the moment
			{
				pubkey: nomahPublicKey, 
				isSigner: false, 
				isWritable: true
			},
			// Owner associated account for the Token NFT
			{
				pubkey: nomahTokenPubkey, 
				isSigner: false, 
				isWritable: true
			},
			// user (which will receive the NFT)
			{
				pubkey: fromTokenPubkey, 
				isSigner: false, 
				isWritable: true
			},
			// token authorityPubkey (who has power to transfer the token)			
			{
				pubkey: nomahPublicKey, 
				isSigner: false, 
				isWritable: true
			},			
			// SPL Token program ID
			{
				pubkey: TOKEN_PROGRAM_ID, 
				isSigner: false, 
				isWritable: false
			},
			// Nativie program ID
			{
				pubkey: SystemProgram.programId, 
				isSigner: false, 
				isWritable: false
			},
        ],
        programId: progId,
        data: data,
    })
    await sendAndConfirmTransaction(
        connection,
        new Transaction().add(instrucoes),
        [userKeypair],
    )
}

main().then(
    () => process.exit(),
    err => {
      console.error(err);
      process.exit(-1);
    },
  );