FLASK_PORT=5001
FLASK_DIR="/home/naibys.alzugarayofficial/scripts/metrics.py"
FLASK_LOG="/var/log/flask.log"
FLASK_CMD="python3 metrics.py"


REACT_PORT=3000
REACT_DIR="/home/naibys.alzugarayofficial/scripts/dashboard.js"
REACT_LOG="/var/log/react.log"
REACT_CMD=flask --app metrics run --host=0.0.0.0 --port=5001


# === FLASK SERVER ===
if ! nc -z localhost $FLASK_PORT; then
    echo "$(date): Flask API is down! Restarting..." >> $FLASK_LOG
    cd /home/naibys.alzugarayofficial/scripts
    nohup $FLASK_CMD > $FLASK_LOG 2>&1 &
else
    echo "$(date): Flask API is running." >> $FLASK_LOG
fi

# === REACT DASHBOARD ===
if ! nc -z localhost $REACT_PORT; then
    echo "$(date): React Dashboard is down! Restarting..." >> $REACT_LOG
    cd /home/naibys.alzugarayofficial/scripts
    nohup $REACT_CMD > $REACT_LOG 2>&1 &
else
    echo "$(date): React Dashboard is running." >> $REACT_LOG
fi