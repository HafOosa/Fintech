from flask import Flask
from flask_cors import CORS
from crypto_data_service import crypto_bp
from transaction_service import transaction_bp
from wallet_service import wallet_bp

app = Flask(__name__)
CORS(app)

# Register blueprints
app.register_blueprint(crypto_bp)
app.register_blueprint(transaction_bp)
app.register_blueprint(wallet_bp)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)