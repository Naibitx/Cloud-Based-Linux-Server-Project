from flask import Flask, jsonify
from flask_cors import CORS
import psutil
import time
import csv
import os
import traceback
import threading
from collections import deque

app = Flask(__name__)
CORS(app, resources={r"/metrics": {"origins": "http://localhost:*"}})

PIPE_PATH = "/tmp/metrics_pipe"

CSV_FILE = "metric_logs.csv"

HISTORY_LENGTH = 30

cpu_history = deque(maxlen=HISTORY_LENGTH)
memory_history = deque(maxlen=HISTORY_LENGTH)
io_read_history = deque(maxlen=HISTORY_LENGTH)
io_write_history = deque(maxlen=HISTORY_LENGTH)
filesystem_history = deque(maxlen=HISTORY_LENGTH)
os_user_history = deque(maxlen=HISTORY_LENGTH)
os_system_history = deque(maxlen=HISTORY_LENGTH)
os_idle_history = deque(maxlen=HISTORY_LENGTH)

def csv_saves(metrics):
    try:
        file_exist = os.path.isfile(CSV_FILE)
        with open(CSV_FILE, mode='a', newline='') as f:
            writer= csv.writer(f)
            if not file_exist:
                writer.writerow(["Timestamp", "CPU Usage(%)", "Memory Usage(%)", "IO(Disk) Read(MB)", "IO(Disk) Write(MB)","Disk Usage(%)", "OS User Time(s)", "OS System Time(s)", "OS Idle Time(s)"])
            
            writer.writerow([
                time.strftime("%Y-%m-%d %H:%M:%S"),
                metrics["CPU Usage(%)"],
                metrics["Memory Usage(%)"],
                metrics["IO(Disk) Read(MB)"],
                metrics["IO(Disk) Write(MB)"],
                metrics["Disk Usage(%)"],
                metrics["OS User Time(s)"],
                metrics["OS System Time(s)"],
                metrics["OS Idle Time(s)"]
            ])
    except FileNotFoundError:
        print(f"Error: {CSV_FILE} file not Found")
    except PermissionError:
        print(f"Error: You dont have write permission on {CSV_FILE} file")
    except OSError as a:
        print(f"Error: Disk issue occured when accessing {CSV_FILE} file")
    except Exception as e:
        print(f"Error: unexpected error when saving data to {CSV_FILE}: {e}")
        traceback.print_exc()

def monitor_cpu(): # funtion tracks cpu usage
    return psutil.cpu_percent(interval=1)

def monitor_io(): # function tracs io statistics 
    io_counter= psutil.disk_io_counters()
    read_bytes= io_counter.read_bytes/ (1024*1024) #converting to MB
    write_bytes= io_counter.write_bytes / (1024*1024) #converting to MB
    return read_bytes, write_bytes

def monitor_memory():# funciton tracks memory usage
    return psutil.virtual_memory().percent

def monitor_disk(): # function tracks disk usage
    return psutil.disk_usage('/').percent

def monitor_os():# functiont racks OS which is the cpu times
    os_use = psutil.cpu_times()
    return os_use.user, os_use.system, os_use.idle

def get_metrics():# funciton collects the metrics
    cpu_use= monitor_cpu()
    memory_use= monitor_memory()
    io_read, io_write= monitor_io()
    disk_use= monitor_disk()
    os_user, os_system, os_idle = monitor_os()

    cpu_history.append(cpu_use)
    memory_history.append(memory_use)
    io_read_history.append(io_read)
    io_write_history.append(io_write)
    filesystem_history.append({
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
        "usage": disk_use
    })
    os_user_history.append(os_user)
    os_system_history.append(os_system)
    os_idle_history.append(os_idle)

    return{
        "CPU Usage(%)": cpu_use,
        "Memory Usage(%)": memory_use,
        "IO(Disk) Read(MB)": io_read,
        "IO(Disk) Write(MB)": io_write,
        "Disk Usage(%)": disk_use,
        "OS User Time(s)": os_user,
        "OS System Time(s)": os_system,
        "OS Idle Time(s)": os_idle

}

def show_metrics(metrics):
    print(f"CPU Usage: {metrics['CPU Usage(%)']}%")
    print(f"Memory Usage: {metrics['Memory Usage(%)']}%")
    print(f"Disk Read: {metrics['IO(Disk) Read(MB)']:.2f}MB")
    print(f"Disk Write: {metrics['IO(Disk) Write(MB)']:.2f}MB")
    print(f"Disk Usage: {metrics['Disk Usage(%)']}%")
    print(f"CPU User Time: {metrics['OS User Time(s)']:.2f}s")
    print(f"CPU System Time: {metrics['OS System Time(s)']:.2f}s")
    print(f"CPU Idle Time: {metrics['OS Idle Time(s)']:.2f}s")
    print("-"* 50)

def write_to_pipe():
    if not os.path.exists(PIPE_PATH):
        os.mkfifo(PIPE_PATH)

    while True:
        try:
            metrics = get_metrics()
            with open(PIPE_PATH, "w") as pipe:
                pipe.write(str(metrics)+ "\n")
            time.sleep(4)
        except BrokenPipeError:
            print("Pipe is not being read")
        except Exception as e:
            print(f"Error writing to pipe: {e}")
            traceback.print_exc()

def back_task():
    while True:
        metrics = get_metrics()
        show_metrics(metrics)
        csv_saves(metrics)
        time.sleep(5)

@app.route('/metrics', methods=['GET'])
def api_metrics():
    try:
        metrics = get_metrics()
        metrics.update({
            "cpu_history": list(cpu_history),
            "memory_history": list(memory_history),
            "io_read_history": list(io_read_history),
            "io_write_history": list(io_write_history),
            "filesystem_history": list(filesystem_history),
            "os_user_history": list(os_user_history),
            "os_system_history": list(os_system_history),
            "os_idle_history": list(os_idle_history),
        })
        return jsonify(metrics)
    except Exception as e:
        return jsonify({"Error: ": str(e)}), 500
        
if __name__ == "__main__":
    thread_A = threading.Thread(target=back_task, daemon=True)
    thread_B = threading.Thread(target=write_to_pipe, daemon=True)

    thread_A.start()
    thread_B.start()

    app.run("0.0.0.0", port =5001)







