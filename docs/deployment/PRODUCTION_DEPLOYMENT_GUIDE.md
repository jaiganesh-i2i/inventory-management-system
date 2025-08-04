# Production Deployment Guide

## 🚨 CRITICAL SECURITY REQUIREMENTS

### 1. Environment Variables
**NEVER use default passwords or secrets in production!**

```bash
# Generate strong passwords and secrets
openssl rand -base64 32  # For JWT_SECRET
openssl rand -base64 32  # For DB_PASSWORD
```

### 2. Required Changes Before Production

#### Database Security
- Change default database password
- Use strong, unique passwords
- Enable SSL connections
- Restrict database access

#### JWT Security
- Use a strong, random JWT secret (min 32 characters)
- Set appropriate token expiration times
- Implement token refresh mechanism

#### Network Security
- Use HTTPS in production
- Configure proper CORS origins
- Set up firewall rules
- Use reverse proxy (nginx/traefik)

## 📋 Production Checklist

### ✅ Pre-Deployment
- [ ] Generate strong passwords and secrets
- [ ] Update environment variables
- [ ] Configure SSL certificates
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy
- [ ] Test database migrations
- [ ] Verify all API endpoints
- [ ] Set up error tracking (Sentry, etc.)

### ✅ Security
- [ ] Change default admin password
- [ ] Configure proper CORS origins
- [ ] Enable rate limiting
- [ ] Set up authentication middleware
- [ ] Configure input validation
- [ ] Enable security headers
- [ ] Set up audit logging

### ✅ Performance
- [ ] Configure database connection pooling
- [ ] Set up caching (Redis)
- [ ] Optimize database queries
- [ ] Configure CDN for static assets
- [ ] Set up load balancing
- [ ] Monitor resource usage

### ✅ Monitoring
- [ ] Set up health checks
- [ ] Configure logging aggregation
- [ ] Set up metrics collection
- [ ] Configure alerting
- [ ] Set up uptime monitoring

## 🚀 Deployment Steps

### 1. Prepare Environment
```bash
# Copy production environment template
cp backend/env.production.example backend/.env.production

# Edit with your actual values
nano backend/.env.production
```

### 2. Update Docker Compose
```bash
# Edit docker-compose.prod.yml with your secrets
nano docker/docker-compose.prod.yml
```

### 3. Build and Deploy
```bash
# Build production images
docker-compose -f docker/docker-compose.prod.yml build

# Deploy to production
docker-compose -f docker/docker-compose.prod.yml up -d
```

### 4. Verify Deployment
```bash
# Check service status
docker-compose -f docker/docker-compose.prod.yml ps

# Test health endpoint
curl http://localhost:5000/health

# Test API endpoints
curl http://localhost:5000/api/v1/auth/login
```

## 🔧 Production Configuration

### Database Configuration
```yaml
# docker-compose.prod.yml
db-prod:
  environment:
    POSTGRES_PASSWORD: ${DB_PASSWORD}  # Use environment variable
  volumes:
    - postgres_data_prod:/var/lib/postgresql/data
    - ./backups:/backups  # For backups
```

### Backend Configuration
```yaml
backend-prod:
  environment:
    JWT_SECRET: ${JWT_SECRET}  # Use environment variable
    DB_PASSWORD: ${DB_PASSWORD}  # Use environment variable
  volumes:
    - backend_logs:/app/logs
    - ssl_certs:/app/ssl  # For SSL certificates
```

### Frontend Configuration
```yaml
frontend-prod:
  environment:
    REACT_APP_API_URL: https://api.yourdomain.com
  volumes:
    - ssl_certs:/etc/nginx/ssl  # For SSL certificates
```

## 📊 Monitoring Setup

### Health Checks
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:5000/health"]
  interval: 30s
  timeout: 10s
  retries: 3
```

### Logging
```yaml
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
```

## 🔒 Security Best Practices

### 1. Network Security
- Use VPN for database access
- Implement IP whitelisting
- Use secure communication protocols

### 2. Application Security
- Regular security updates
- Input validation and sanitization
- SQL injection prevention
- XSS protection

### 3. Data Protection
- Encrypt sensitive data
- Regular backups
- Data retention policies
- GDPR compliance

## 🚨 Emergency Procedures

### Database Recovery
```bash
# Restore from backup
docker exec -it db-prod pg_restore -U inventory_user -d inventory_management backup.sql
```

### Service Recovery
```bash
# Restart services
docker-compose -f docker/docker-compose.prod.yml restart

# Check logs
docker-compose -f docker/docker-compose.prod.yml logs -f
```

### Rollback Procedure
```bash
# Rollback to previous version
docker-compose -f docker/docker-compose.prod.yml down
git checkout previous-version
docker-compose -f docker/docker-compose.prod.yml up -d
```

## 📞 Support

For production issues:
1. Check application logs
2. Verify database connectivity
3. Test API endpoints
4. Review monitoring dashboards
5. Contact system administrator

## 🔄 Maintenance

### Regular Tasks
- [ ] Weekly security updates
- [ ] Monthly backup verification
- [ ] Quarterly performance review
- [ ] Annual security audit

### Updates
- [ ] Monitor for dependency updates
- [ ] Test updates in staging
- [ ] Plan maintenance windows
- [ ] Document changes 