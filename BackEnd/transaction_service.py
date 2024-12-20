from flask import Flask, jsonify, request
from web3 import Web3
import os
import json

app = Flask(__name__)

# Web3 Setup
INFURA_URL = os.getenv("INFURA_URL", "https://mainnet.infura.io/v3/921797fd23b84a2fa2bb0f8a43c0bfe1")
web3 = Web3(Web3.HTTPProvider(INFURA_URL))

@app.route('/transaction/send_eth', methods=['POST'])
def send_eth():
    data = request.json
    sender = data['sender']
    private_key = data['private_key']
    recipient = data['recipient']
    amount = web3.toWei(data['amount'], 'ether')

    # Build transaction
    nonce = web3.eth.getTransactionCount(sender)
    tx = {
        'nonce': nonce,
        'to': recipient,
        'value': amount,
        'gas': 21000,
        'gasPrice': web3.toWei('50', 'gwei')
    }
    signed_tx = web3.eth.account.sign_transaction(tx, private_key)
    tx_hash = web3.eth.send_raw_transaction(signed_tx.rawTransaction)
    return jsonify({'transaction_hash': tx_hash.hex()})

@app.route('/transaction/send_token', methods=['POST'])
def send_token():
    data = request.json
    token_address = data['token_address']
    sender = data['sender']
    private_key = data['private_key']
    recipient = data['recipient']
    amount = data['amount']

    # Token contract ABI (standard ERC20 ABI)
    erc20_abi = json.loads(open('erc20_abi.json').read())
    token_contract = web3.eth.contract(address=Web3.toChecksumAddress(token_address), abi=erc20_abi)

    # Build transaction
    nonce = web3.eth.getTransactionCount(sender)
    tx = token_contract.functions.transfer(
        Web3.toChecksumAddress(recipient),
        web3.toWei(amount, 'ether')
    ).buildTransaction({
        'chainId': 1,
        'gas': 200000,
        'gasPrice': web3.toWei('50', 'gwei'),
        'nonce': nonce
    })

    signed_tx = web3.eth.account.sign_transaction(tx, private_key)
    tx_hash = web3.eth.send_raw_transaction(signed_tx.rawTransaction)
    return jsonify({'transaction_hash': tx_hash.hex()})

if __name__ == '__main__':
    app.run(debug=True)
