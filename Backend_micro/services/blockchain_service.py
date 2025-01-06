from web3 import Web3
import json

class BlockchainService:
    def __init__(self, rpc_url, contract_address, abi_path, private_key):
        self.web3 = Web3(Web3.HTTPProvider(rpc_url))
        if not self.web3.is_connected():
            raise Exception("Failed to connect to Ganache.")

        self.contract_address = contract_address
        self.private_key = private_key

        # Load the ABI from Remix
        with open(abi_path, "r") as abi_file:
            self.abi = json.load(abi_file)
        self.contract = self.web3.eth.contract(address=contract_address, abi=self.abi)
        self.account = self.web3.eth.account.from_key(private_key).address

    def get_balance(self, address):
        balance = self.contract.functions.balanceOf(address).call()
        return self.web3.from_wei(balance, 'ether')

    def mint_tokens(self, to: str, amount: float):
        try:
            # Convert the amount to Wei
            amount_in_wei = self.web3.to_wei(amount, 'ether')

            # Build the transaction
            transaction = self.contract.functions.mint(to, amount_in_wei).build_transaction({
                'from': self.account,
                'gas': 2000000,
                'gasPrice': self.web3.eth.gas_price,
                'nonce': self.web3.eth.get_transaction_count(self.account),
            })

            # Sign the transaction
            signed_tx = self.web3.eth.account.sign_transaction(transaction, private_key=self.private_key)

            # Send the signed transaction
            tx_hash = self.web3.eth.send_raw_transaction(signed_tx.raw_transaction)

            # Return the transaction hash
            return tx_hash.hex()
        except Exception as e:
            print(f"Error in mint_tokens: {e}")
            raise e


    def transfer_tokens(self, to: str, amount: float):
        try:
            # Convert amount to Wei
            amount_in_wei = self.web3.to_wei(amount, 'ether')

            # Build the transaction
            transaction = self.contract.functions.transfer(to, amount_in_wei).build_transaction({
                'from': self.account,
                'gas': 200000,
                'gasPrice': self.web3.eth.gas_price,
                'nonce': self.web3.eth.get_transaction_count(self.account),
            })

            # Sign the transaction
            signed_tx = self.web3.eth.account.sign_transaction(transaction, private_key=self.private_key)

            # Send the signed transaction using the correct attribute
            tx_hash = self.web3.eth.send_raw_transaction(signed_tx.raw_transaction)

            # Return the transaction hash
            return tx_hash.hex()
        except Exception as e:
            print(f"Error in transfer_tokens: {e}")
            raise e
    
    def create_wallet(self):
        """
        Creates a new Ethereum wallet.
        """
        account = self.web3.eth.account.create()
        return {
            "address": account.address,
            "private_key": account.key.hex()
        }
    
    def transfer_tokens_from(self, from_address: str, private_key: str, to_address: str, amount: float):
         """
         Transfers tokens from one wallet to another, with gas fees paid by the deployer.
         """
         try:
             # Convert amount to Wei
             amount_in_wei = self.web3.to_wei(amount, 'ether')
        
             # Build the transaction
             transaction = self.contract.functions.transferFromTo(
                 from_address, to_address, amount_in_wei
             ).build_transaction({
                 'from': self.account,  # Deployer account pays for gas
                 'gas': 200000,
                 'gasPrice': self.web3.eth.gas_price,
                 'nonce': self.web3.eth.get_transaction_count(self.account),  # Use deployer's nonce
             })
        
             # Sign the transaction using the deployer's private key
             signed_tx = self.web3.eth.account.sign_transaction(transaction, private_key=self.private_key)
        
             # Send the signed transaction
             tx_hash = self.web3.eth.send_raw_transaction(signed_tx.raw_transaction)
        
             return tx_hash.hex()
         except Exception as e:
             print(f"Error in transfer_tokens_from: {e}")
             raise e