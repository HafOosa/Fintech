from flask import Flask, jsonify, request
from web3 import Web3
from eth_account import Account
import os
import json
from cryptography.fernet import Fernet

app = Flask(__name__)

# Setup Web3 provider
INFURA_URL = os.getenv("INFURA_URL", "https://mainnet.infura.io/v3/921797fd23b84a2fa2bb0f8a43c0bfe1")
web3 = Web3(Web3.HTTPProvider(INFURA_URL))

# Secure private key encryption
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key")
fernet = Fernet(SECRET_KEY.encode())

@app.route('/wallet/create', methods=['POST'])
def create_wallet():
    # Generate Ethereum wallet
    account = Account.create()
    encrypted_private_key = fernet.encrypt(account.key)
    return jsonify({
        'address': account.address,
        'encrypted_private_key': encrypted_private_key.decode()
    })

@app.route('/wallet/balance', methods=['GET'])
def get_balance():
    address = request.args.get('address')
    balance = web3.eth.get_balance(address)
    return jsonify({'balance': web3.fromWei(balance, 'ether')})

@app.route('/wallet/import', methods=['POST'])
def import_wallet():
    data = request.json
    private_key = data['private_key']
    decrypted_private_key = fernet.decrypt(private_key.encode()).decode()
    account = Account.privateKeyToAccount(decrypted_private_key)
    return jsonify({'address': account.address})

if __name__ == '__main__':
    app.run(debug=True)
