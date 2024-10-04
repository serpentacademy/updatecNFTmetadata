import {
    getAssetWithProof,
    updateMetadata,
    UpdateArgsArgs,
    getCurrentRoot
  } from '@metaplex-foundation/mpl-bubblegum';
  import { Keypair, Connection, clusterApiUrl, Cluster } from '@solana/web3.js';
  import {  generateSigner, Signer,createSignerFromKeypair, keypairIdentity, keypairPayer } from '@metaplex-foundation/umi';
  import * as fs from 'fs';
  import bs58 from 'bs58';
  import umi from '@metaplex-foundation/umi';
  import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
  import { mplBubblegum } from '@metaplex-foundation/mpl-bubblegum';


  function createUmiPublicKey(address: string): umi.PublicKey {
    return address as umi.PublicKey; // Cast string to PublicKey type
  }



/* 
initializeUmi: Similar to initializeUmi, but with an additional step: it registers the mplBubblegum plugin in Umi to 
enable interaction with cNFTs, such as fetching proofs and updating metadata.

*/
// Initialize UMI with the Solana RPC endpoint and register the mpl-bubblegum plugin
async function initializeUmi(): Promise<any> {
    const rpcUrl = 'https://api.mainnet-beta.solana.com'; // Use 'mainnet-beta' for production
    const umi = createUmi(rpcUrl, 'confirmed'); // Create Umi instance with confirmed commitment level
  
    // Load the keypair from your wallet JSON file
  
      // Step 2: Load the keypair from your wallet JSON file
  const walletKeypairData = JSON.parse(fs.readFileSync('./keypair.json', 'utf8'));
  const walletKeypair = Keypair.fromSecretKey(new Uint8Array(walletKeypairData));

  const myKeypair = umi.eddsa.createKeypairFromSecretKey(walletKeypair.secretKey);

    // Create a signer from the keypair and set it as the identity
    const myKeypairSigner = createSignerFromKeypair(umi, myKeypair);
    umi.use(keypairIdentity(myKeypairSigner)); // Use the keypair for signing
  
    // Register the mpl-bubblegum plugin to enable cNFT methods
    umi.use(mplBubblegum());
  
    return umi;
  }


  
  async function updateCNFTMetadata() {

    //Step 1: Initializes Umi and loads a cNFT asset using getAssetWithProof, which retrieves the NFT metadata and proof from the Merkle tree.

    const umi = await initializeUmi(); // Initialize UMI with the proper context
    const assetId: umi.PublicKey = createUmiPublicKey('YOUR_CNFT_HASH_PUBLIC_KEY '); // Replace with the actual asset ID

    //const assetId: umi.PublicKey = 'AfM57i9vp8fkCcNrTuvpu79o4HsqE5ss6nN37y2Eht9k' as umi.PublicKey; // Replace with the actual asset ID
    const collectionMint = createUmiPublicKey('COLLECTION_MINT_PUBLIC_KEY'); // Replace with the actual collection mint
    const leafOwner = createUmiPublicKey('LEAF_OWNER_cnft_OWNER'); // Replace with the leaf owner's public key
    const leafIndex = 0; // Replace with the actual leaf index
  
    // Fetch the proof for the asset using the correct UMI context
    console.log("1")
    const assetWithProof = await getAssetWithProof(umi, assetId);
  
    // Define the updated metadata

    //Step 2: Defines new metadata for the cNFT, specifically the name (Bad Mutation) and URI pointing to a new metadata file on Arweave.

    const updateArgs: UpdateArgsArgs = {
      name: 'Bad Mutation',
      uri: 'https://arweave.net/fX3Si--27TYGl27BDEFgl6YZ8STgqgHZ3WGwwSnKA_Q',
    };
  
    // Get the current root of the Merkle tree

    const connection = new Connection('https://api.mainnet-beta.solana.com'); // You can switch to devnet if needed

    const merkleTree = 'MERKLE_TREE_ADDRESS' as umi.PublicKey; // Replace with the actual Merkle tree public key


      
        
              // Step 2: Load the keypair from your wallet JSON file
  const walletKeypairData = JSON.parse(fs.readFileSync('./keypair.json', 'utf8'));
  const walletKeypair = Keypair.fromSecretKey(new Uint8Array(walletKeypairData));

  const myKeypair = umi.eddsa.createKeypairFromSecretKey(walletKeypair.secretKey);

    // Create a signer from the keypair and set it as the identity
    const myKeypairSigner = createSignerFromKeypair(umi, myKeypair);
//Step 3: Uses updateMetadata from the mpl-bubblegum library to update the cNFT's metadata. It passes the asset proof, metadata, leaf owner, and the new metadata. The myKeypairSigner signs the transaction.


        await updateMetadata(umi, {
          ...assetWithProof,
          leafOwner,
          currentMetadata: assetWithProof.metadata,
          updateArgs,
          authority: myKeypairSigner,
          collectionMint: collectionMint,
        }).sendAndConfirm(umi)
        console.log("done")
      }
  updateCNFTMetadata().catch(console.error);