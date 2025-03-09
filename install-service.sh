
#!/bin/bash

# Exit on any error
set -e

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo "Please run this script as root or with sudo"
  exit 1
fi

# Get the current username (the user who ran sudo)
ACTUAL_USER=$(logname || echo $SUDO_USER)

# Get the directory where the script is located
SCRIPT_DIR=$(dirname "$(readlink -f "$0")")

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
    server_name _;
    
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
  echo "Your Bookmark Haven is now accessible at http://localhost/"
  
else
  # Create the service file for 'serve'
  echo "Creating systemd service file for serve..."
  SERVICE_FILE="$SCRIPT_DIR/bookmark-haven.service"

  # Replace placeholders in the service file
  sed -i "s|User=YOUR_USERNAME|User=$ACTUAL_USER|g" "$SERVICE_FILE"
  sed -i "s|WorkingDirectory=/path/to/your/bookmark-haven|WorkingDirectory=$SCRIPT_DIR|g" "$SERVICE_FILE"

  # Copy the service file to systemd directory
  cp "$SERVICE_FILE" /etc/systemd/system/

  # Install serve globally if not already installed
  if ! command -v serve &> /dev/null; then
      echo "Installing 'serve' package globally..."
      npm install -g serve
  fi

  # Update the service file to use global serve command
  sed -i "s|ExecStart=/usr/bin/npm run start|ExecStart=$(which serve) -s $SCRIPT_DIR/dist -l 8080|g" /etc/systemd/system/bookmark-haven.service

  # Reload systemd to recognize the new service
  systemctl daemon-reload

  # Enable and start the service
  systemctl enable bookmark-haven.service
  systemctl start bookmark-haven.service

  echo "Bookmark Haven has been installed as a systemd service and started."
  echo "You can access it at http://localhost:8080"
fi

if [ "$server_choice" == "1" ]; then
  echo ""
  echo "Use these commands to manage the service:"
  echo "  sudo systemctl status bookmark-haven.service  - Check status"
  echo "  sudo systemctl restart bookmark-haven.service - Restart the service"
  echo "  sudo systemctl stop bookmark-haven.service    - Stop the service"
  echo "  sudo systemctl disable bookmark-haven.service - Disable autostart"
fi

