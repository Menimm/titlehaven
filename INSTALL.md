
# Installing Bookmark Haven on Ubuntu

This guide will help you set up Bookmark Haven to run automatically when your Ubuntu system starts.

## Prerequisites

- Ubuntu Linux (or any systemd-based distribution)
- Node.js v14 or higher (required for Vite)
- npm installed
- sudo privileges

## Node.js Version Check

If you encounter errors like:
```
SyntaxError: Unexpected reserved word
```
when trying to install, it's likely you're using an older version of Node.js. The installation script will check your Node.js version and prompt you to upgrade if needed.

To check your Node.js version manually:
```
node -v
```

If you need to upgrade, we recommend using NVM (Node Version Manager) or installing from NodeSource:
```
# Using NVM (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
nvm install --lts

# Or using NodeSource
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

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
   - Check for compatible Node.js version
   - Check for existing bookmarks and offer to create a backup
   - Build the application
   - Ask you to choose between 'serve' package or NGINX
   - For NGINX: ask for a hostname to use in the server_name directive
   - Set up your chosen server option
   - For systemd service: enable the service to start on boot and start it immediately
   - For NGINX: configure a site and reload NGINX
   - Offer to restore from backup if one was created

## Accessing the Application

After installation, you can access Bookmark Haven at:
- With 'serve' package: `http://your-server-ip:8080`
- With NGINX: `http://your-hostname/` (where hostname is what you specified during setup)

## Using NGINX

If you choose the NGINX option during installation, the script will:
1. Install NGINX if not already installed
2. Prompt you for a hostname to use in the server_name directive
3. Create a site configuration in `/etc/nginx/sites-available/bookmark-haven`
4. Enable the site and reload NGINX

You can further customize your NGINX configuration by editing the site file:
```
sudo nano /etc/nginx/sites-available/bookmark-haven
```

## Managing the Systemd Service (if using 'serve')

- Check status: `sudo systemctl status bookmark-haven.service`
- Restart: `sudo systemctl restart bookmark-haven.service`
- Stop: `sudo systemctl stop bookmark-haven.service`
- Disable autostart: `sudo systemctl disable bookmark-haven.service`
- View logs: `sudo journalctl -u bookmark-haven.service`

## Backup and Restore

During installation, the script will check for existing data and offer to create a backup file.
To restore from a backup:
1. Open Bookmark Haven in your browser
2. Go to Settings → Backup and Restore
3. Use the "Import from File" option and select your backup file

## Manual Installation

If you prefer to set up the service manually:

1. Build the application: `npm install && npm run build`
2. Choose your preferred server:
   - With 'serve': `npm install -g serve && serve -s dist -l 8080`
   - With NGINX: Configure NGINX to serve the `dist` directory

For NGINX manual setup, create a site configuration:
```
server {
    listen 80;
    server_name your-domain.com;
    
    root /path/to/bookmark-haven/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```
