import os
import platform

# print(os.getcwd)

def get_desktop_path():
    desktop_path = ""
    if platform.system() == "Windows":
        desktop_path = os.path.join(os.path.expanduser("~"), "Desktop")
    elif platform.system() == "Darwin":  # macOS
        desktop_path = os.path.join(os.path.expanduser("~"), "Desktop")
    elif platform.system() == "Linux":
        desktop_path = os.path.join(os.path.expanduser("~"), "Desktop")
    return desktop_path


app_name = "MyApp.exe"
desktop_path = get_desktop_path()

if desktop_path:
    app_path = os.path.join(desktop_path, app_name)
    print(f"Path to {app_name}: {app_path}")
else:
    print("Desktop path not found.")
