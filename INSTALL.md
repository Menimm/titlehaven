
# Installing Bookmark Haven on Ubuntu

This guide will help you set up Bookmark Haven to run automatically when your Ubuntu system starts.

## Prerequisites

- Ubuntu Linux (or any systemd-based distribution)
- Node.js and npm installed
- sudo privileges

## Installation Steps

1. Clone or download this repository to your server
2. Navigate to the project directory
3. Make the installation script executable:
   ```
   chmod +x install-service.sh
   ```
4. Run the installation script with sudo:
   ```
   sudo ./install-service.sh
   ```
5. The script will:
   - Build the application
   - Create a systemd service
   - Enable the service to start on boot
   - Start the service immediately

## Accessing the Application

After installation, you can access Bookmark Haven at:
```
http://your-server-ip:8080
```

## Managing the Service

- Check status: `sudo systemctl status bookmark-haven.service`
- Restart: `sudo systemctl restart bookmark-haven.service`
- Stop: `sudo systemctl stop bookmark-haven.service`
- Disable autostart: `sudo systemctl disable bookmark-haven.service`
- View logs: `sudo journalctl -u bookmark-haven.service`

## Manual Installation

If you prefer to set up the service manually:

1. Build the application: `npm install && npm run build`
2. Install serve globally: `npm install -g serve`
3. Edit the `bookmark-haven.service` file:
   - Update the User field to your username
   - Update the WorkingDirectory to the full path of the project
4. Copy the service file: `sudo cp bookmark-haven.service /etc/systemd/system/`
5. Reload systemd: `sudo systemctl daemon-reload`
6. Enable and start: `sudo systemctl enable bookmark-haven.service && sudo systemctl start bookmark-haven.service`
