from fastapi import FastAPI
import requests
import threading
import time
from datetime import datetime, timezone
import logging
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Query

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Configuration du logging
logging.basicConfig(level=logging.INFO)

# Variable globale pour stocker les données live
live_data = {}
live_data_lock = threading.Lock()  # Verrou pour éviter les accès concurrents


def fetch_live_price():
    """
    Fonction pour récupérer les données live toutes les 60 secondes.
    """
    global live_data
    url = "https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT"
    while True:
        try:
            response = requests.get(url)
            if response.status_code == 200:
                data = response.json()
                with live_data_lock:
                    live_data = {
                        "price": float(data["price"]),
                        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S", time.gmtime()),
                    }
                logging.info(f"Données live mises à jour : {live_data}")
            else:
                logging.error(f"Erreur lors de la récupération des données live : {response.status_code}")
        except Exception as e:
            logging.error(f"Exception dans fetch_live_price : {e}")
        time.sleep(60)  # Attente de 60 secondes


@app.on_event("startup")
def start_fetching_data():
    """
    Démarrer la récupération des données live lors du démarrage de l'application.
    """
    threading.Thread(target=fetch_live_price, daemon=True).start()


@app.get("/")
def read_root():
    """
    Endpoint racine pour vérifier que le serveur fonctionne.
    """
    return {"message": "Welcome to the Ethereum API"}


def timestamp_to_date_time(ts):
    """
    Convertir un timestamp en date et heure.
    """
    dt = datetime.fromtimestamp(ts / 1000, tz=timezone.utc)
    date = dt.strftime('%Y-%m-%d')
    time = dt.strftime('%H:%M:%S')
    return date, time


def fetch_historical_data():
    """
    Fonction pour récupérer les données historiques.
    """
    try:
        url = "https://api.binance.com/api/v3/klines"
        limit = 1000
        start_time = 0
        historical_data = []

        while True:
            params = {
                "symbol": "ETHUSDT",
                "interval": "1d",
                "startTime": start_time,
                "limit": limit
            }
            response = requests.get(url, params=params)
            logging.info(f"Request to Binance API: {response.url}")
            if response.status_code == 200:
                data = response.json()
                if not data:
                    break  # Stop si aucune donnée n'est retournée
                historical_data.extend([
                    {
                        "date": timestamp_to_date_time(entry[0])[0],
                        "time": timestamp_to_date_time(entry[0])[1],
                        "price": float(entry[4]),
                        "source": "Historical"
                    }
                    for entry in data
                ])
                start_time = data[-1][0] + 1  # Next batch
            else:
                logging.error(f"Erreur de l'API Binance : {response.status_code}")
                break

        return historical_data

    except Exception as e:
        logging.error(f"Une erreur s'est produite : {e}")
        raise e

def parse_date(date_str):
    """
    Convertit une chaîne de caractères en objet datetime selon différents formats.
    """
    if not date_str:
        return None
    try:
        # Format complet avec millisecondes (ISO 8601)
        return datetime.strptime(date_str, "%Y-%m-%dT%H:%M:%S.%fZ")
    except ValueError:
        try:
            # Format sans millisecondes
            return datetime.strptime(date_str, "%Y-%m-%dT%H:%M:%S")
        except ValueError:
            try:
                # Format simple (YYYY-MM-DD)
                return datetime.strptime(date_str, "%Y-%m-%d")
            except ValueError as e:
                logging.error(f"Erreur de conversion de la date: {date_str} - {str(e)}")
                raise e
            
@app.get("/api/historical")
def get_historical_data(start_date: str = None, end_date: str = None):
    """
    Récupère les données historiques en fonction des plages de dates.
    """
    data = fetch_historical_data()
    start_date = parse_date(start_date) if start_date else None
    end_date = parse_date(end_date) if end_date else None

    logging.info(f"Start Date: {start_date}, End Date: {end_date}")

    if start_date or end_date:
        filtered_data = [
            d for d in data
            if (not start_date or datetime.strptime(f"{d['date']} {d['time']}", "%Y-%m-%d %H:%M:%S") >= start_date)
            and (not end_date or datetime.strptime(f"{d['date']} {d['time']}", "%Y-%m-%d %H:%M:%S") <= end_date)
        ]
        return filtered_data

    return data



@app.get("/api/live")
def get_live_price():
    """
    Endpoint pour retourner les données live actuelles.
    """
    with live_data_lock:
        if live_data:
            return live_data
    return {"message": "Aucune donnée live disponible"}

@app.get("/api/statistics")
def get_statistics():
    """
    Endpoint pour retourner les statistiques des prix historiques.
    """
    data = fetch_historical_data()
    prices = [d["price"] for d in data]
    if not prices:
        return {"message": "Aucune donnée disponible"}
    return {
        "average_price": sum(prices) / len(prices),
        "min_price": min(prices),
        "max_price": max(prices),
        "volatility": (sum((x - sum(prices) / len(prices)) ** 2 for x in prices) / len(prices)) ** 0.5
    }
