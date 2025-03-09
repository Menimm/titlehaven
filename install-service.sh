
#!/bin/bash

# Exit on any error
set -e

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo "Please run this script as root or with sudo"
  exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d 'v' -f 2)
NODE_MAJOR=$(echo $NODE_VERSION | cut -d '.' -f 1)

if [ "$NODE_MAJOR" -lt 14 ]; then
  echo "Error: Node.js version 14 or higher is required for this application"
  echo "Current version: v$NODE_VERSION"
  echo "Please upgrade Node.js before continuing."
  echo "Recommended: use nvm (Node Version Manager) or install from NodeSource"
  echo "Instructions: https://nodejs.org/en/download/package-manager/"
  exit 1
fi

# Get the current username (the user who ran sudo)
ACTUAL_USER=$(logname || echo $SUDO_USER)

# Get the directory where the script is located
SCRIPT_DIR=$(dirname "$(readlink -f "$0")")

# Check for existing data and backup if needed
BACKUP_FILE=""
if [ -f "$SCRIPT_DIR/dist/localStorage.backup.json" ]; then
  echo "Found existing localStorage backup file."
  BACKUP_FILE="$SCRIPT_DIR/dist/localStorage.backup.json"
elif [ -d "$HOME/.config/chromium" ]; then
  read -p "You may have existing bookmarks. Do you want to backup before proceeding? (y/n): " backup_choice
  if [ "$backup_choice" == "y" ]; then
    echo "Creating backup..."
    # Create a backup directory if it doesn't exist
    mkdir -p "$SCRIPT_DIR/backups"
    BACKUP_FILE="$SCRIPT_DIR/backups/bookmark-haven-backup-$(date +"%Y-%m-%d-%H%M%S").json"
    
    # Extract bookmarks from localStorage if we can
    echo '{' > "$BACKUP_FILE"
    echo '  "version": 1,' >> "$BACKUP_FILE"
    echo '  "timestamp": "'$(date -Iseconds)'",' >> "$BACKUP_FILE"
    echo '  "data": {' >> "$BACKUP_FILE"
    
    # Try to get data from localStorage if available (this is a best-effort approach)
    if [ -f "$HOME/.config/chromium/Default/Local Storage/leveldb/000003.log" ]; then
      echo "    \"bookmarks\": []," >> "$BACKUP_FILE"
      echo "    \"categories\": []," >> "$BACKUP_FILE"
      echo "    \"settings\": {}" >> "$BACKUP_FILE"
    else
      echo "    \"bookmarks\": []," >> "$BACKUP_FILE"
      echo "    \"categories\": []," >> "$BACKUP_FILE"
      echo "    \"settings\": {}" >> "$BACKUP_FILE"
    fi
    
    echo '  }' >> "$BACKUP_FILE"
    echo '}' >> "$BACKUP_FILE"
    
    echo "Backup created at $BACKUP_FILE"
    echo "Note: This is an empty template backup. You'll need to manually restore your data."
  fi
fi

# Build the application
echo "Building the application..."
cd "$SCRIPT_DIR"
npm install
npm run build

# Ask user which server to use
echo "Choose your server option:"
echo "1) Use 'serve' npm package (default)"
echo "2) Use NGINX"
read -p "Enter choice [1-2]: " server_choice

if [ "$server_choice" == "2" ]; then
  # Ask for hostname for NGINX
  read -p "Enter hostname for NGINX server_name (e.g., bookmarks.example.com or _ for all): " nginx_hostname
  [ -z "$nginx_hostname" ] && nginx_hostname="_"
  
  # NGINX setup
  echo "Setting up NGINX..."
  
  # Check if NGINX is installed
  if ! command -v nginx &> /dev/null; then
    echo "NGINX is not installed. Installing..."
    apt-get update
    apt-get install -y nginx
  fi
  
  # Create NGINX site configuration
  cat > /etc/nginx/sites-available/bookmark-haven <<EOF
server {
    listen 80;
    server_name $nginx_hostname;
    
    root $SCRIPT_DIR/dist;
    index index.html;
    
    location / {
        try_files \$uri \$uri/ /index.html;
    }
}
EOF
  
  # Enable the site
  ln -sf /etc/nginx/sites-available/bookmark-haven /etc/nginx/sites-enabled/
  
  # Test NGINX configuration
  nginx -t
  
  # Reload NGINX
  systemctl reload nginx
  
  echo "NGINX configured successfully!"
  echo "Your Bookmark Haven is now accessible at http://$nginx_hostname/"
  
else
  # Create the service file for 'serve'
  echo "Creating systemd service file for serve..."
  
  # Create a temporary service file
  cat > "$SCRIPT_DIR/bookmark-haven.service" <<EOF
[Unit]
Description=Bookmark Haven web application
After=network.target

[Service]
Type=simple
User=$ACTUAL_USER
WorkingDirectory=$SCRIPT_DIR
ExecStart=$(which npx) serve -s $SCRIPT_DIR/dist -l 8080
Restart=on-failure
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=bookmark-haven

[Install]
WantedBy=multi-user.target
EOF

  # Copy the service file to systemd directory
  cp "$SCRIPT_DIR/bookmark-haven.service" /etc/systemd/system/

  # Reload systemd to recognize the new service
  systemctl daemon-reload

  # Enable and start the service
  systemctl enable bookmark-haven.service
  systemctl start bookmark-haven.service

  echo "Bookmark Haven has been installed as a systemd service and started."
  echo "You can access it at http://localhost:8080"
fi

# Restore from backup if available
if [ -n "$BACKUP_FILE" ]; then
  read -p "Do you want to restore from the backup? (y/n): " restore_choice
  if [ "$restore_choice" == "y" ]; then
    echo "To restore your data, open Bookmark Haven in your browser,"
    echo "go to Settings -> Restore, and import the backup file at:"
    echo "$BACKUP_FILE"
  fi
fi

if [ "$server_choice" == "1" ]; then
  echo ""
  echo "Use these commands to manage the service:"
  echo "  sudo systemctl status bookmark-haven.service  - Check status"
  echo "  sudo systemctl restart bookmark-haven.service - Restart the service"
  echo "  sudo systemctl stop bookmark-haven.service    - Stop the service"
  echo "  sudo systemctl disable bookmark-haven.service - Disable autostart"
fi
