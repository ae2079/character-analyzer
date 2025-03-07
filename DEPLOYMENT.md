# Deployment Guide

This guide explains how to deploy the Character Sequence Analyzer application on an Ubuntu server.

## Prerequisites

- Ubuntu Server (20.04 LTS or later)
- SSH access to the server
- Domain name (optional, but recommended)
- OpenAI API key

## Server Setup

1. **Update System Packages**
```bash
sudo apt-get update
sudo apt-get upgrade -y
```

2. **Install Docker**
```bash
# Install required packages
sudo apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    software-properties-common

# Add Docker's GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

# Add Docker repository
sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"

# Install Docker
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Add your user to docker group
sudo usermod -aG docker $USER
```

3. **Install Docker Compose**
```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

## Application Deployment

1. **Create Application Directory**
```bash
mkdir -p /var/www/character-analyzer
cd /var/www/character-analyzer
```

2. **Clone the Repository**
```bash
git clone https://github.com/your-username/character-analyzer.git .
```

3. **Configure Environment Variables**
```bash
cp .env.example .env
nano .env  # Edit with your OpenAI API key
```

4. **Start the Application**
```bash
docker-compose up -d
```

## Security Setup

1. **Configure Firewall (UFW)**
```bash
# Install UFW
sudo apt-get install ufw

# Allow SSH (do this first!)
sudo ufw allow ssh

# Allow HTTP
sudo ufw allow 80/tcp

# Allow HTTPS
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable
```

2. **SSL Certificate (Optional)**
```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com
```

3. **Enable Automatic Updates**
```bash
sudo apt-get install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

## Maintenance

### Updating the Application

1. Pull latest changes:
```bash
git pull origin main
```

2. Rebuild and restart containers:
```bash
docker-compose down
docker-compose build
docker-compose up -d
```

### Monitoring

1. View container logs:
```bash
docker-compose logs -f
```

2. Check container status:
```bash
docker-compose ps
```

### Backup

1. Backup environment variables:
```bash
cp .env .env.backup
```

2. Backup Docker Compose configuration:
```bash
cp docker-compose.yml docker-compose.yml.backup
```

## Troubleshooting

1. **Container not starting:**
   - Check logs: `docker-compose logs web`
   - Verify environment variables: `cat .env`
   - Check disk space: `df -h`

2. **Application not accessible:**
   - Check if container is running: `docker-compose ps`
   - Verify port mapping: `docker-compose port web 80`
   - Check firewall rules: `sudo ufw status`

3. **Performance issues:**
   - Monitor resources: `docker stats`
   - Check system load: `top` or `htop`

## Rollback Procedure

If you need to rollback to a previous version:

1. Stop current containers:
```bash
docker-compose down
```

2. Checkout previous version:
```bash
git checkout <previous-commit>
```

3. Rebuild and start:
```bash
docker-compose up -d --build
``` 