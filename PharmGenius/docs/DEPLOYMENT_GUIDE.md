# Project Deployment Guide

## 📋 Deployment Preparation

### 1. Server Requirements
- **Operating System**: Ubuntu 20.04 LTS or newer
- **RAM**: At least 8GB (16GB recommended)
- **Storage**: 50GB free space
- **Docker**: Docker Engine 20.10+
- **Docker Compose**: 2.0+
- **Git**: For code updates

### 2. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Reboot system
sudo reboot
```

## 🚀 Deployment Steps

### 1. Upload Project

```bash
# Create project directory
mkdir -p /opt/microservices
cd /opt/microservices

# Upload files (from local computer)
# Use scp or git clone

# Example using git
git clone <repository-url> .
```

### 2. Environment Variables Setup

```bash
# Create .env file
cat > .env << EOF
# Production Environment Variables
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-here
REDIS_HOST=redis
REDIS_PORT=6379

# Database URLs
AUTH_DATABASE_URL=sqlite:///auth_service.db
DRUG_DATABASE_URL=sqlite:///drug_service.db
ICD10_DATABASE_URL=sqlite:///icd10_service.db
ANALYTICS_DATABASE_URL=sqlite:///analytics_service.db
SNOMED_DATABASE_URL=sqlite:///snomed_service.db

# Service URLs
API_GATEWAY_PORT=5000
AUTH_SERVICE_PORT=5001
DRUG_SERVICE_PORT=5002
ICD10_SERVICE_PORT=5003
ANALYTICS_SERVICE_PORT=5004
SNOMED_SERVICE_PORT=5007

# Elasticsearch
ELASTICSEARCH_HOST=elasticsearch
ELASTICSEARCH_PORT=9200

# Monitoring
PROMETHEUS_PORT=9090
GRAFANA_PORT=3001
RABBITMQ_PORT=15672
EOF
```

### 3. Start System

```bash
# Stop any running services
docker-compose down

# Clean system
docker system prune -f

# Build and start services
docker-compose up --build -d

# Wait for services to start
sleep 60

# Check service status
docker-compose ps
```

### 4. Nginx Reverse Proxy Setup

```bash
# Install Nginx
sudo apt install nginx -y

# Create configuration file
sudo tee /etc/nginx/sites-available/microservices << EOF
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:5173;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # API Gateway
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Monitoring
    location /monitoring/ {
        proxy_pass http://localhost:3001;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/microservices /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 5. SSL Setup (Optional)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Setup auto-renewal
sudo crontab -e
# Add the following line:
# 0 12 * * * /usr/bin/certbot renew --quiet
```

## 🔧 System Management

### Management Scripts

```bash
# Start system
./start-microservices.bat

# Stop system
docker-compose down

# Restart specific service
docker-compose restart service-name

# View logs
docker-compose logs -f service-name

# Backup data
docker run --rm -v microservices_redis_data:/data -v $(pwd):/backup alpine tar czf /backup/redis-backup.tar.gz -C /data .
```

### System Monitoring

```bash
# Check resource usage
docker stats

# Check service status
docker-compose ps

# Check logs
docker-compose logs --tail=100
```

## 🔒 Security

### 1. Firewall

```bash
# Install UFW
sudo apt install ufw -y

# Setup rules
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### 2. System Updates

```bash
# Setup automatic updates
sudo apt install unattended-upgrades -y
sudo dpkg-reconfigure -plow unattended-upgrades
```

### 3. Security Monitoring

```bash
# Install Fail2ban
sudo apt install fail2ban -y

# Setup Fail2ban
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

## 📊 Monitoring and Statistics

### 1. Prometheus Metrics

```bash
# Access Prometheus
http://your-domain.com:9090

# Useful queries:
# - up: Service status
# - container_cpu_usage_seconds_total: CPU usage
# - container_memory_usage_bytes: Memory usage
```

### 2. Grafana Dashboards

```bash
# Access Grafana
http://your-domain.com:3001
# Username: admin
# Password: admin123
```

### 3. RabbitMQ Management

```bash
# Access RabbitMQ
http://your-domain.com:15672
# Username: admin
# Password: admin123
```

## 🔄 Updates

### 1. Code Updates

```bash
# Pull updates
git pull origin main

# Rebuild services
docker-compose build --no-cache

# Restart system
docker-compose down
docker-compose up -d
```

### 2. Backup Before Updates

```bash
# Backup data
docker run --rm -v microservices_redis_data:/data -v $(pwd):/backup alpine tar czf /backup/redis-backup-$(date +%Y%m%d).tar.gz -C /data .

# Backup databases
docker run --rm -v microservices_elasticsearch_data:/data -v $(pwd):/backup alpine tar czf /backup/elasticsearch-backup-$(date +%Y%m%d).tar.gz -C /data .
```

## 🚨 Troubleshooting

### Common Issues

1. **Services not starting**
```bash
# Check logs
docker-compose logs

# Check resources
docker stats

# Restart Docker
sudo systemctl restart docker
```

2. **Network issues**
```bash
# Check network
docker network ls
docker network inspect microservices_microservices-network
```

3. **Memory issues**
```bash
# Clean system
docker system prune -f
docker volume prune -f
```

### Useful Diagnostic Commands

```bash
# Check container status
docker-compose ps

# Check resource usage
docker stats --no-stream

# Check real-time logs
docker-compose logs -f --tail=50

# Check network
docker network ls
docker network inspect microservices_microservices-network
```

## 📞 Support

In case of any issues:

1. Check logs: `docker-compose logs -f`
2. Check service status: `docker-compose ps`
3. Restart system: `docker-compose restart`
4. Contact developer: Hospital Pharmacist at Burjeel Hospital, Abu Dhabi

---

**Important Note**: Make sure to perform regular backups before any updates. 