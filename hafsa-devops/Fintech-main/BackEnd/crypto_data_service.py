import requests
from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/crypto/price', methods=['GET'])
def get_price():
    crypto_id = request.args.get('crypto_id')
    response = requests.get(f'https://api.coingecko.com/api/v3/simple/price?ids={crypto_id}&vs_currencies=usd')
    return jsonify(response.json())

@app.route('/crypto/chart', methods=['GET'])
def get_chart():
    crypto_id = request.args.get('crypto_id')
    response = requests.get(f'https://api.coingecko.com/api/v3/coins/{crypto_id}/market_chart?vs_currency=usd&days=7')
    return jsonify(response.json())

if __name__ == '__main__':
    app.run(debug=True)
