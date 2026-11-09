# Masterbatch Production Deployment Plan

- Status: Production WordPress deployed over HTTPS on 2026-11-07; intentionally noindex pending SMTP and final launch approval
- Date: 2026-11-08
- Target domain: `https://www.ashareai.com`
- Canonical host: `www.ashareai.com`
- Production SSH alias: `masterbatch`
- Deployment model: native LEMP, no Docker
- Source site: `https://gzh.hzscf.site/`
- Source WordPress: `7.1.4`
- Source theme: `mtm-b2b-masterbatch 0.9.27`

## 1. Executive Recommendation

Deploy the site to the fresh Oracle Cloud Ubuntu server as a native LEMP
installation:

- Ubuntu 24.04
- Nginx
- PHP 8.3-FPM
- MariaDB 10.11
- WordPress latest compatible release
- WP-CLI
- Certbot
- WP Mail SMTP
- Fail2ban

The production server currently has about 1GB RAM and no swap. Add a 2GB swap
file before migrating the database. If the site later receives regular admin
work, plugin scans or traffic campaigns, upgrade the server to at least 2GB
RAM.

WordPress core, plugin and theme automatic updates will be disabled. Updates
are applied manually after a database and file backup, then validated before
the `current` symlink is switched. Ubuntu security updates remain enabled
because they protect the host operating system, PHP, Nginx and MariaDB.

Scheduled production backups are deferred for the first launch at the user's
request on 2026-11-07. This is an accepted launch risk. Until backups are
enabled, do not run a manual WordPress core, plugin or theme update. The
existing source site must remain available as the last recovery route.

Do not overwrite or repurpose the existing `wpdev` WordPress stack on
`masterbatch-vm`. Keep `https://gzh.hzscf.site/` running until production is
validated.

## 2. Current Production Server Assessment

The `ssh masterbatch` target is:

- Host: `instance-20261107-1929`
- OS: Ubuntu 24.04
- User: `ubuntu`
- Passwordless sudo: available
- Docker: not installed
- Nginx: not installed
- Apache: not installed
- PHP: not installed
- MariaDB/MySQL: not installed
- WordPress: not installed
- Ports 80/443: not listening
- Disk: 45GB total, about 42GB available
- Memory: about 952MB total, no swap

The target is effectively a fresh server.

## 3. External Dependencies and Readiness

### DNS

DNS is already configured and points to the production server:

```text
ashareai.com      -> 150.230.3.189
www.ashareai.com  -> 150.230.3.189
```

The public resolvers `1.1.1.1` and `8.8.8.8` return the same address, and the
`ssh masterbatch` server reports the same public IPv4 address. The authoritative
name servers are:

```text
ns1.hndnsv2.com
ns2.hndnsv2.com
```

Do not create AAAA records unless the production server has working IPv6.

Re-check DNS before requesting the certificate:

```bash
dig @1.1.1.1 ashareai.com A
dig @1.1.1.1 www.ashareai.com A
dig @8.8.8.8 ashareai.com A
dig @8.8.8.8 www.ashareai.com A
```

Both names must continue to return `150.230.3.189` before Certbot is run.
HTTPS is not available yet because Nginx and the certificate have not been
installed.

### Email

The existing RFQ flow can store inquiries in WordPress, but email delivery is
not configured. Before public launch, provide:

- SMTP provider
- SMTP host
- SMTP port and TLS mode
- SMTP username and password
- From address
- Inquiry recipient address

Do not put SMTP passwords in Git, Markdown, a WordPress option or a command
that will be recorded in logs.

### Oracle Cloud Network

Opening ports in UFW is not enough. Confirm the Oracle Cloud Security List or
Network Security Group allows inbound TCP 80 and 443 from the public internet.
Keep port 3306 private.

## 4. Target Architecture

### Application layout

```text
/var/www/ashareai/
├── current -> releases/20261108-18
├── releases/
│   ├── 20261107-1/
│   ├── 20261108-1/
│   ├── 20261108-2/
│   ├── 20261108-3/
│   ├── 20261108-4/
│   ├── 20261108-5/
│   ├── 20261108-6/
│   ├── 20261108-7/
│   ├── 20261108-8/
│   ├── 20261108-9/
│   ├── 20261108-10/
│   ├── 20261108-11/
│   ├── 20261108-17/
│   └── 20261108-18/
│       ├── index.php
│       ├── wp-admin/
│       ├── wp-content/
│       ├── wp-includes/
│       └── wp-config.php
└── shared/
    └── uploads/

/var/backups/ashareai/
├── database/
└── files/

/var/log/ashareai/
```

`wp-content/uploads` should point to the shared uploads directory. Application
updates create a new release directory and switch `current` after validation.

### Network and services

```text
Internet
  |
  +-- TCP 80/443 -> Nginx
  +-- TCP 22    -> SSH

Nginx
  |
  +-- PHP requests -> PHP 8.3-FPM
  +-- Static files -> /var/www/ashareai/current

WordPress
  |
  +-- MariaDB at 127.0.0.1:3306
```

Ports 80 and 443 are public. MariaDB remains bound to localhost only.

## 5. Software Installation

### 5.1 System update

```bash
sudo apt update
sudo apt full-upgrade -y
sudo apt install -y \
  ca-certificates \
  curl \
  jq \
  less \
  rsync \
  software-properties-common \
  unzip
```

### 5.2 Install LEMP and operations tools

```bash
sudo apt install -y \
  nginx \
  mariadb-server \
  php8.3-fpm \
  php8.3-cli \
  php8.3-mysql \
  php8.3-curl \
  php8.3-mbstring \
  php8.3-xml \
  php8.3-zip \
  php8.3-gd \
  php8.3-intl \
  php8.3-bcmath \
  php8.3-opcache \
  certbot \
  python3-certbot-nginx \
  fail2ban
```

Validate versions:

```bash
nginx -v
php -v
php-fpm8.3 -v
mariadb --version
```

### 5.3 Enable services

```bash
sudo systemctl enable --now nginx
sudo systemctl enable --now mariadb
sudo systemctl enable --now php8.3-fpm
sudo systemctl enable --now fail2ban
```

### 5.4 Install WP-CLI

```bash
curl -fsSL \
  -o /tmp/wp-cli.phar \
  https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar

php /tmp/wp-cli.phar --info
chmod +x /tmp/wp-cli.phar
sudo mv /tmp/wp-cli.phar /usr/local/bin/wp
wp --info
```

WP-CLI commands that write site files should run as `www-data`, not root:

```bash
sudo -u www-data wp --path=/var/www/ashareai/current <command>
```

## 6. OS Hardening and Resource Preparation

### 6.1 Add 2GB swap

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
echo 'vm.swappiness=10' | sudo tee /etc/sysctl.d/99-ashareai-swap.conf
sudo sysctl --system
free -h
swapon --show
```

### 6.2 Firewall

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status verbose
```

Confirm the equivalent ingress rules in Oracle Cloud.

### 6.3 Automatic security updates

Confirm unattended upgrades are active:

```bash
sudo systemctl status unattended-upgrades
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

## 7. MariaDB Setup

### 7.1 Secure the installation

```bash
sudo mariadb-secure-installation
```

Use Unix socket authentication for the MariaDB root account. Do not enable
remote root login.

### 7.2 Create a dedicated database and user

Generate the password outside the repository and keep it in a temporary
password manager or deployment secret store.

```sql
CREATE DATABASE ashareai_wp
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER 'ashareai_wp'@'localhost'
  IDENTIFIED BY '<generated-strong-password>';

GRANT ALL PRIVILEGES ON ashareai_wp.*
  TO 'ashareai_wp'@'localhost';

FLUSH PRIVILEGES;
```

### 7.3 Low-memory tuning

Create `/etc/mysql/mariadb.conf.d/99-ashareai.cnf`:

```ini
[mysqld]
bind-address = 127.0.0.1
innodb_buffer_pool_size = 128M
innodb_log_file_size = 64M
max_connections = 30
```

Restart and verify:

```bash
sudo systemctl restart mariadb
sudo systemctl status mariadb
sudo ss -ltnp | grep 3306
```

Port 3306 must listen only on `127.0.0.1`, never `0.0.0.0`.

## 8. WordPress File Deployment

### 8.1 Create directories

```bash
RELEASE=/var/www/ashareai/releases/20261107-1

sudo mkdir -p "$RELEASE"
sudo mkdir -p /var/www/ashareai/shared/uploads
sudo mkdir -p /var/backups/ashareai/database
sudo mkdir -p /var/backups/ashareai/files
sudo mkdir -p /var/log/ashareai
```

### 8.2 Download WordPress core

```bash
sudo chown -R www-data:www-data /var/www/ashareai
sudo -u www-data wp core download \
  --path="$RELEASE" \
  --locale=en_US
```

Do not install the Ubuntu `wordpress` package. Use the official WordPress
release or WP-CLI download.

### 8.3 Create wp-config.php

```bash
sudo -u www-data wp config create \
  --path="$RELEASE" \
  --dbname=ashareai_wp \
  --dbuser=ashareai_wp \
  --dbpass='<database-password>' \
  --dbhost=127.0.0.1 \
  --dbcharset=utf8mb4 \
  --skip-check
```

Add production settings:

```bash
sudo -u www-data wp config set WP_ENVIRONMENT_TYPE production \
  --path="$RELEASE"

sudo -u www-data wp config set WP_DEBUG false --raw \
  --path="$RELEASE"

sudo -u www-data wp config set DISALLOW_FILE_EDIT true --raw \
  --path="$RELEASE"

sudo -u www-data wp config set DISABLE_WP_CRON true --raw \
  --path="$RELEASE"

sudo -u www-data wp config set AUTOMATIC_UPDATER_DISABLED true --raw \
  --path="$RELEASE"

sudo -u www-data wp config set WP_AUTO_UPDATE_CORE false --raw \
  --path="$RELEASE"

sudo -u www-data wp config shuffle-salts \
  --path="$RELEASE"
```

Do not enable `FORCE_SSL_ADMIN` until HTTPS is working.

## 9. Migrate Existing Content

### 9.1 Source snapshot

Create a consistent snapshot from the existing WordPress:

- Database export
- `wp-content/themes/`
- `wp-content/plugins/`
- `wp-content/mu-plugins/`
- `wp-content/uploads/`

Exclude caches, temporary backups and development-only files.

Keep the source snapshot timestamped. Do not delete the source site after the
initial production launch.

### 9.2 Import database

```bash
sudo -u www-data wp db import \
  /path/to/ashareai-source.sql \
  --path="$RELEASE"
```

### 9.3 Copy theme, plugins, MU Plugins and uploads

Restore the copied directories into:

```text
$RELEASE/wp-content/themes/
$RELEASE/wp-content/plugins/
$RELEASE/wp-content/mu-plugins/
```

Move uploaded media into:

```text
/var/www/ashareai/shared/uploads
```

Then create the shared uploads symlink:

```bash
sudo ln -s \
  /var/www/ashareai/shared/uploads \
  "$RELEASE/wp-content/uploads"
```

### 9.4 Replace old URLs

Run the full replacement first:

```bash
sudo -u www-data wp search-replace \
  'https://gzh.hzscf.site/wp' \
  'https://www.ashareai.com' \
  --all-tables \
  --precise \
  --recurse-objects \
  --path="$RELEASE"
```

Then inspect remaining values:

```bash
sudo -u www-data wp search-replace \
  'gzh.hzscf.site' \
  'www.ashareai.com' \
  --all-tables \
  --precise \
  --recurse-objects \
  --report-changed-only \
  --path="$RELEASE"

sudo -u www-data wp search-replace \
  'localhost:8889' \
  'www.ashareai.com' \
  --all-tables \
  --precise \
  --recurse-objects \
  --report-changed-only \
  --path="$RELEASE"
```

Review the reported changes. Do not ignore unexpected user-content matches.

### 9.5 Confirm core site options

```bash
sudo -u www-data wp option update home \
  'https://www.ashareai.com' \
  --path="$RELEASE"

sudo -u www-data wp option update siteurl \
  'https://www.ashareai.com' \
  --path="$RELEASE"

sudo -u www-data wp option get show_on_front --path="$RELEASE"
sudo -u www-data wp option get page_on_front --path="$RELEASE"
sudo -u www-data wp option get blog_public --path="$RELEASE"
sudo -u www-data wp option get wp_page_for_privacy_policy --path="$RELEASE"
```

Expected existing values:

```text
show_on_front               page
page_on_front               53
wp_page_for_privacy_policy  69
```

Keep `blog_public=0` until the launch gate.

### 9.6 Activate current release

```bash
sudo ln -sfn \
  /var/www/ashareai/releases/20261107-1 \
  /var/www/ashareai/current

sudo chown -R www-data:www-data /var/www/ashareai
```

## 10. PHP-FPM Configuration

Create `/etc/php/8.3/fpm/pool.d/ashareai.conf`:

```ini
[ashareai]
user = www-data
group = www-data
listen = /run/php/ashareai.sock
listen.owner = www-data
listen.group = www-data
listen.mode = 0660

pm = dynamic
pm.max_children = 5
pm.start_servers = 2
pm.min_spare_servers = 1
pm.max_spare_servers = 3
pm.max_requests = 300

php_admin_value[memory_limit] = 256M
php_admin_value[upload_max_filesize] = 20M
php_admin_value[post_max_size] = 24M
php_admin_value[max_execution_time] = 120
```

PHP-FPM environment values for the existing RFQ and GA4 code can be added to
the pool only after real values are available:

```ini
env[MASTERBATCH_RFQ_RECIPIENT] = <recipient-email>
env[MASTERBATCH_GA4_MEASUREMENT_ID] = <ga4-measurement-id>
env[MASTERBATCH_GA4_API_SECRET] = <ga4-api-secret>
```

Do not store SMTP or GA4 secrets in Git.

Apply:

```bash
sudo php-fpm8.3 -t
sudo systemctl restart php8.3-fpm
```

## 11. Nginx Configuration

Create `/etc/nginx/sites-available/ashareai.com.conf` with HTTP first:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name ashareai.com www.ashareai.com;

    root /var/www/ashareai/current;
    index index.php;

    client_max_body_size 20m;

    location /.well-known/acme-challenge/ {
        root /var/www/letsencrypt;
    }

    location / {
        return 301 https://www.ashareai.com$request_uri;
    }
}
```

Before HTTPS is ready, either keep this temporary config behind a staging
address or use the Certbot webroot flow. After the certificate exists, use one
HTTPS server for `www.ashareai.com` and redirect the apex domain.

HTTPS server requirements:

- Root `/var/www/ashareai/current`
- `try_files $uri $uri/ /index.php?$args`
- PHP requests sent to `unix:/run/php/ashareai.sock`
- `client_max_body_size 20m`
- Deny hidden files except ACME paths
- No directory listing
- Static assets cache-only, with HTML excluded
- `X-Robots-Tag: noindex` until launch

Validate and reload:

```bash
sudo ln -s \
  /etc/nginx/sites-available/ashareai.com.conf \
  /etc/nginx/sites-enabled/ashareai.com.conf

sudo nginx -t
sudo systemctl reload nginx
```

## 12. HTTPS

Only after both DNS names resolve to the production server:

```bash
sudo mkdir -p /var/www/letsencrypt

sudo certbot --nginx \
  -d www.ashareai.com \
  -d ashareai.com \
  --email <certificate-email> \
  --agree-tos \
  --no-eff-email
```

Then:

```bash
sudo certbot renew --dry-run
sudo nginx -t
sudo systemctl reload nginx
```

After HTTPS works:

```bash
sudo -u www-data wp config set FORCE_SSL_ADMIN true --raw \
  --path=/var/www/ashareai/current
```

## 13. WordPress Production Configuration

Run after URL migration and HTTPS validation:

```bash
WP="sudo -u www-data wp --path=/var/www/ashareai/current"

$WP option get permalink_structure
$WP rewrite flush --hard
$WP cache flush

$WP option update timezone_string 'Asia/Shanghai'
$WP option update date_format 'F j, Y'
$WP option update time_format 'H:i'

$WP plugin list
$WP theme list
```

Confirm:

- Theme `mtm-b2b-masterbatch` is active.
- Rank Math SEO is active.
- No development-only plugin is active.
- Header, Footer and page templates are present.
- About / FAQ field-manual CSS files are present.

Rotate the production WordPress administrator password after migration.

### 13.1 WordPress update policy

The production site does not use automatic WordPress updates. Keep automatic
updates disabled for:

- WordPress core
- Plugins
- Themes
- Translations

Verify the production config:

```bash
sudo -u www-data wp config get AUTOMATIC_UPDATER_DISABLED \
  --path=/var/www/ashareai/current

sudo -u www-data wp config get WP_AUTO_UPDATE_CORE \
  --path=/var/www/ashareai/current
```

Expected values:

```text
AUTOMATIC_UPDATER_DISABLED  true
WP_AUTO_UPDATE_CORE         false
```

This setting does not disable Ubuntu unattended security upgrades.

### 13.2 Manual WordPress update procedure

Run manual checks at least monthly and when a relevant security advisory is
published:

```bash
WP="sudo -u www-data wp --path=/var/www/ashareai/current"

$WP core check-update
$WP plugin list --update=available
$WP theme list --update=available
```

Before applying updates:

1. Export the database.
2. Back up `wp-content` and uploads.
3. Create a new timestamped release directory.
4. Copy the current application files into the new release.
5. Apply core, plugin or theme updates in that release.
6. Run `wp core update-db` if required.
7. Test the homepage, About, FAQ, product guides, RFQ and Documents forms.
8. Check desktop and mobile rendering.
9. Switch `current` to the new release.
10. Keep the previous release until the updated site passes validation.

If validation fails, switch `current` back to the previous release and restore
the database only if the database schema or data was changed.

## 14. Email Delivery

Install WP Mail SMTP:

```bash
sudo -u www-data wp plugin install wp-mail-smtp --activate \
  --path=/var/www/ashareai/current
```

Configure SMTP through the WordPress admin interface after receiving
credentials.

Requirements:

- Send a real test email.
- Submit a test RFQ.
- Confirm the private inquiry is stored.
- Confirm `_mb_rfq_email_sent=1`.
- Submit a test Documents request.
- Delete test inquiries only after receiving evidence from the business.

DNS for the sending domain must include the provider's SPF, DKIM and DMARC
records.

## 15. SEO and Search Configuration

Before public launch:

- Keep `X-Robots-Tag: noindex`.
- Keep `blog_public=0`.
- Confirm no canonical points to `gzh.hzscf.site`.
- Confirm all menus, images and forms use `www.ashareai.com`.

At launch:

```bash
sudo -u www-data wp option update blog_public 1 \
  --path=/var/www/ashareai/current
```

Remove the staging `X-Robots-Tag`, reload Nginx, then:

1. Verify `https://www.ashareai.com/robots.txt`.
2. Verify `https://www.ashareai.com/sitemap_index.xml`.
3. Add the domain to Google Search Console.
4. Submit the sitemap.
5. Configure GA4 Measurement ID.
6. Mark RFQ and Documents success events as Key Events.
7. Confirm Rank Math uses the public entity
   `GE CHEMICAL & POLYMER GROUP CO., LTD`.

## 16. Cron, Deferred Backups and Monitoring

### 16.1 WordPress cron

Create `/etc/cron.d/ashareai-wordpress`:

```cron
*/5 * * * * www-data /usr/local/bin/wp --path=/var/www/ashareai/current cron event run --due-now >/dev/null 2>&1
```

### 16.2 Scheduled backups: deferred

Scheduled database and file backups are not part of the first launch. Mark this
item for implementation after launch.

This deferral means:

- There is no automatic recovery point for new inquiries or content.
- Rollback of application files remains possible through versioned releases.
- Rollback of database changes is not possible unless a manual snapshot exists.
- Manual WordPress updates must remain paused until backup and restore testing
  are in place.

Recommended minimum before enabling manual WordPress updates:

```bash
sudo mkdir -p /var/backups/ashareai/database
sudo mkdir -p /var/backups/ashareai/files

timestamp=$(date -u +%Y%m%dT%H%M%SZ)

sudo -u www-data wp db export \
  "/var/backups/ashareai/database/manual-$timestamp.sql" \
  --path=/var/www/ashareai/current

sudo tar -C /var/www/ashareai \
  -czf "/var/backups/ashareai/files/manual-$timestamp.tar.gz" \
  current/wp-content shared/uploads
```

This manual snapshot is recommended before launch, but it is not configured as
a launch blocker in the current scope.

### 16.3 Future database backup procedure

Create `/usr/local/sbin/ashareai-db-backup`:

```bash
#!/usr/bin/env bash
set -euo pipefail

backup_dir=/var/backups/ashareai/database
timestamp=$(date -u +%Y%m%dT%H%M%SZ)

mariadb-dump \
  --single-transaction \
  --quick \
  --routines \
  --triggers \
  ashareai_wp | gzip > "$backup_dir/ashareai-$timestamp.sql.gz"

find "$backup_dir" -type f -name 'ashareai-*.sql.gz' -mtime +14 -delete
```

### 16.4 Future file backup procedure

Back up:

```text
/var/www/ashareai/current/wp-content/
/var/www/ashareai/shared/uploads/
```

The database and files should be copied off the production server at least
weekly.

### 16.5 Monitoring

Monitor:

- `https://www.ashareai.com/`
- `/wp-admin/`
- `sitemap_index.xml`
- Nginx and PHP-FPM service health
- Disk, memory and swap
- MariaDB availability
- RFQ form completion
- Email delivery failures

## 17. Launch Sequence

1. Verify both domain names still resolve to `150.230.3.189`.
2. Confirm Oracle Cloud ingress for ports 80/443.
3. Add swap and install the LEMP stack.
4. Create the production database.
5. Deploy WordPress core and production config.
6. Import database, theme, plugins and media.
7. Replace all staging/local URLs.
8. Configure PHP-FPM and Nginx.
9. Issue the HTTPS certificate.
10. Configure SMTP and test both forms.
11. Run desktop and mobile route tests.
12. Confirm homepage and all published pages.
13. Confirm one H1 per page, no horizontal overflow and no broken images.
14. Confirm robots/noindex staging protection.
15. Optionally take a one-time manual database and file snapshot; scheduled
    backups are deferred for this launch.
16. Publish the site and enable indexing.
17. Submit the production sitemap.
18. Monitor logs and forms for at least 24 hours.

## 18. Acceptance Checklist

- `http://ashareai.com` redirects to `https://www.ashareai.com`
- `http://www.ashareai.com` redirects to `https://www.ashareai.com`
- `https://www.ashareai.com/` returns 200
- `/masterbatch-guides/`, all product guides, About, FAQ, Documents,
  Resources, RFQ and Privacy Policy return 200
- WordPress admin loads over HTTPS
- Theme version is `0.9.27`
- About and FAQ load their dedicated CSS
- RFQ and Documents submit successfully
- Inquiries appear as private `mb_inquiry` records
- SMTP notification succeeds
- No visible form data appears in analytics events
- Rank Math title, description, canonical, robots, OG and schema are present
- Sitemap contains no `gzh.hzscf.site`
- PC and mobile have no horizontal overflow
- Every page has one H1
- Scheduled database and file backups are explicitly recorded as deferred
- Certbot renewal dry run passes
- SSH, Nginx, PHP-FPM and MariaDB restart successfully
- WordPress core, plugin and theme automatic updates are disabled
- Manual WordPress updates are blocked until backup and restore testing exist

## 19. Rollback Plan

Keep the old `https://gzh.hzscf.site/` running during launch.

If production fails:

1. Stop sending traffic to the new server by restoring the previous DNS
   records or removing the new records.
2. Keep the production database and logs for diagnosis.
3. Switch `/var/www/ashareai/current` to the previous release if the problem is
   code-only.
4. Restore the latest database backup if one exists and the problem involves
   data. With scheduled backups deferred, database changes made after launch
   may not be recoverable.
5. Revert Nginx from backup and run `nginx -t` before reloading.
6. Do not delete the source site until the production site has passed at least
   seven days of stable operation and a production backup/restore process has
   been implemented and tested.

## 20. Required Inputs Before Execution

1. Certificate notification email.
2. Production WordPress administrator email.
3. SMTP credentials and recipient email.
4. GA4 Measurement ID and API secret, if launching analytics immediately.
5. Confirmation that `www.ashareai.com` is canonical.
6. Confirmation to migrate the existing database and content rather than
   starting with an empty WordPress installation.

## 21. Execution Log

### Completed on 2026-11-07

- Confirmed `ashareai.com` and `www.ashareai.com` resolve to `150.230.3.189`.
- Confirmed the target public IPv4 matches the `ssh masterbatch` server.
- Added and enabled a 2GB swap file.
- Updated Ubuntu packages and installed Nginx, PHP 8.3-FPM, MariaDB 10.11,
  Certbot, Fail2ban and UFW.
- Installed WP-CLI `2.12.0` after SHA-512 verification.
- Enabled UFW for SSH, HTTP and HTTPS.
- Created the `ashareai_wp` database and local-only database user.
- Stored the generated database password in root-only
  `/etc/ashareai/secrets.env`.
- Tuned MariaDB for the 1GB server.
- Created the versioned WordPress layout:
  `/var/www/ashareai/releases/20261107-1`.
- Installed WordPress `7.1.4` and verified core checksums.
- Created production `wp-config.php` with production mode, disabled file
  editing, system cron mode and all WordPress automatic updates disabled.
- Imported the existing site database.
- Migrated plugins, themes, MU Plugins and uploads.
- Moved uploads to `/var/www/ashareai/shared/uploads` and linked them into
  the active release.
- Replaced `gzh.hzscf.site` and `localhost:8889` references in the production
  database; a follow-up dry run reports zero remaining replacements.
- Set production `home` and `siteurl` to `https://www.ashareai.com`.
- Kept `blog_public=0` and added an Nginx `X-Robots-Tag: noindex` header
  while production is being validated.
- Activated theme `mtm-b2b-masterbatch 0.9.9` and Rank Math SEO `1.0.281`.
- Installed and activated WP Mail SMTP `4.10.3`.
- Verified all 12 published pages and the home, About, FAQ and Privacy URLs.
- Verified the production database and all WordPress files against core
  checksums.
- Configured PHP-FPM, OPcache, WordPress system Cron and Nginx log rotation.
- Verified Nginx, PHP-FPM, MariaDB, Fail2ban and Cron services are active.

### Public Network and HTTPS

- Oracle Cloud ingress was opened for TCP 80 and 443.
- Public TCP 80 still failed because the host retained a pre-existing
  top-level iptables rule that rejected all traffic after port 22, before the
  UFW chains could run.
- The original rules were backed up to
  `/root/iptables-before-ashareai.v4`; the two obsolete `REJECT` rules were
  removed from the IPv4 `INPUT` and `FORWARD` chains.
- Public HTTP then reached Nginx successfully.
- Let's Encrypt issued one ECDSA certificate covering both
  `www.ashareai.com` and `ashareai.com`; it expires on 2027-02-05.
- Nginx now serves WordPress over HTTPS for `www.ashareai.com`, redirects the
  apex domain and HTTP traffic to `https://www.ashareai.com`, and passes
  `fastcgi_param HTTPS on`.
- `FORCE_SSL_ADMIN=true` is enabled.
- `certbot renew --dry-run --no-random-sleep-on-renew` succeeded.
- Public checks:
  - `https://www.ashareai.com/` returns HTTP 200.
  - `https://ashareai.com/` redirects to the www host.
  - `http://www.ashareai.com/` redirects to HTTPS.
  - Certificate SANs contain both domain names.

### Form Backend Validation

- The production RFQ processor stored a test inquiry and returned success.
- The production Documents processor stored a separate test request and
  returned success.
- Both test records were deleted; the final `mb_inquiry` count is zero.
- The 30-second duplicate inquiry limiter rejected the second immediate test
  when the same email was reused, which is expected behavior.
- Email delivery remains unavailable because `/usr/sbin/sendmail` is absent
  and SMTP credentials have not been configured. The stored-record fallback
  works and sets `_mb_rfq_email_sent=0`.

### Live Validation

- Playwright desktop and mobile checks passed 14/14 for all primary routes,
  forms, About, FAQ, Open Graph, Organization schema and the noindex policy.
- Live tests now derive Sitemap URLs from `MB_LIVE_BASE_URL`, deduplicate
  fragment links and support the temporary noindex stage through
  `MB_EXPECT_NOINDEX=1`.
- Canonical tags are intentionally absent while Rank Math and Nginx return
  `noindex`; they must be rechecked after the indexing gate is opened.
- `blog_public=0` and the Nginx `X-Robots-Tag: noindex, nofollow` header
  remain active.

### Remaining Before Indexing

1. Configure SMTP credentials and send a real test message.
2. Confirm the RFQ recipient and reply owner.
3. Configure GA4 and Search Console if launching immediately.
4. Run the final public canonical/robots checks after enabling indexing.
5. Set `blog_public=1` and remove the temporary Nginx noindex header.

### Shared Header / Footer Release - 2026-11-08

- Promoted the approved shared Header / Footer to theme
  `mtm-b2b-masterbatch 0.9.10`.
- Added `assets/css/site-chrome.css`, `assets/js/site-chrome.js`, the
  horizontal GE logo, brand mark and the three navigation icons.
- Header navigation is `Products / Applications / Documents / About`, with
  `Get a quote` as the primary action. Mobile uses a full-screen menu.
- Footer uses the palletized shipment image and
  `Request a material review`, while retaining the full public entity and
  `Binzhou, Shandong, China`.
- Created `/var/www/ashareai/releases/20261108-1` from the previous release,
  validated PHP and theme metadata, then switched `current`.
- Kept `/var/www/ashareai/releases/20261107-1` for rollback.
- Kept `blog_public=0` and `X-Robots-Tag: noindex, nofollow`.
- Live Playwright passed 16/16 across 12 primary routes, RFQ, Documents,
  SEO checks, desktop/mobile chrome and mobile menu.
- Final viewport checks: desktop document width `1440/1440`, mobile
  `390/390`; header-to-content boundary is `83px` desktop and `70px` mobile.
- Historical production screenshots were removed during cleanup.

### Titan-inspired Header / Footer - 2026-11-08

- Promoted the approved Titan-inspired navigation and directory footer to
  `mtm-b2b-masterbatch 0.9.11`.
- Header navigation is
  `Home / Products / Applications / Documents / About Us / Contact`, with a
  Products dropdown and `Get a quote` action.
- Mobile uses a compact white dropdown and Products accordion.
- Footer uses five columns: brand, Quick Links, Product Lines, Contact Us
  and an RFQ QR code, followed by a centered copyright bar.
- The QR code targets `https://www.ashareai.com/request-a-quote/`; reference
  site phone numbers, email addresses and WhatsApp codes were not reused.
- Created and activated `/var/www/ashareai/releases/20261108-2`.
  `/var/www/ashareai/releases/20261108-1` remains available for rollback.
- Kept `blog_public=0` and `X-Robots-Tag: noindex, nofollow`.
- Live Playwright passed 16/16. Production browser checks at
  `1440 / 1024 / 390 / 320px` found no Header/Footer overflow; the
  header-to-content boundary is `81px` desktop and `65px` mobile.
- Historical production screenshots were removed during cleanup.

### Homepage Refresh v2 - 2026-11-08

- Promoted the approved English v2 homepage to
  `mtm-b2b-masterbatch 0.9.12`.
- Added `parts/home-refresh-content.html` and
  `assets/css/home-refresh-v2.css`.
- Both `templates/front-page.html` and `templates/page-home.html` render the
  shared `home-refresh-content` template part instead of `[mb_page_content]`.
- The homepage now has seven sections: hero and review basis, three product
  cards, four application cards, review and document scope, factory context,
  resources and FAQ, and the final CTA.
- Product cards link to the real black, white and color guide pages.
- Created and activated `/var/www/ashareai/releases/20261108-3`.
  `/var/www/ashareai/releases/20261108-2` remains available for rollback.
- Kept `blog_public=0` and `X-Robots-Tag: noindex, nofollow`.
- Live Playwright passed 16/16. Production browser checks at
  `1440 / 1024 / 390 / 320px` found no horizontal overflow.
- Production page heights are approximately `5,002px` desktop and
  `9,464px` mobile.
- Historical production screenshots were removed during cleanup.

### Staging Index Protection - 2026-11-08

- Promoted `mtm-b2b-masterbatch 0.9.13` to
  `/var/www/ashareai/releases/20261108-4`.
- Added a Rank Math `rank_math/sitemap/entry` filter that excludes the static
  front page from `page-sitemap.xml` while `blog_public=0`.
- The filter stops excluding the front page automatically once indexing is
  opened with `blog_public=1`.
- Confirmed the homepage still returns both
  `<meta name="robots" content="noindex, nofollow">` and
  `X-Robots-Tag: noindex, nofollow`.
- Cleared Rank Math Sitemap file and transient caches. The live page sitemap
  no longer contains `https://www.ashareai.com/`, while
  `/technical-documents/` remains present.
- Live Playwright passed 16/16 after the change.

### Factory Content Alignment - 2026-11-08

- Promoted `mtm-b2b-masterbatch 0.9.14` to
  `/var/www/ashareai/releases/20261108-5`.
- Kept the Factory heading unchanged but replaced the four supporting points
  so they match the three factory, packaging and shipment images:
  production equipment context, resin and process review, packaging context,
  and pallet and shipment context.
- Removed document review and sample discussion from the Factory section.
  Document scope remains in the Documents section; sample discussion remains
  in the Buyer FAQ.
- Updated the Chinese review draft with the same information structure.
- Live Playwright passed 16/16; the homepage remains excluded from search
  indexing and the sitemap.
- Historical production screenshots were removed during cleanup.

### Mobile Vertical Rhythm - 2026-11-08

- Promoted `mtm-b2b-masterbatch 0.9.16` to
  `/var/www/ashareai/releases/20261108-7`.
- Reduced mobile-only spacing between consecutive white sections at widths
  below `620px`, including Applications, Review, Factory and Resources.
- Factory heading spacing above is approximately `48px`; other section
  transitions are approximately `40–48px`.
- Desktop layout remains unchanged.
- Live Playwright passed 16/16; homepage noindex and sitemap exclusion remain
  active.
- Historical production screenshots were removed during cleanup.

### Global Design Tokens - 2026-11-08

- Added root `DESIGN.md` and global `assets/css/design-tokens.css`.
- Promoted `mtm-b2b-masterbatch 0.9.17` to
  `/var/www/ashareai/releases/20261108-8`.
- Tokens load before base and page-specific styles. Existing page CSS still
  contains local values, so this deployment is intentionally non-visual.
- Desktop and mobile full-page screenshot hashes are identical before and
  after deployment.
- Live Playwright passed 16/16; noindex and Sitemap exclusion remain active.

### Header Footer Token Refactor - 2026-11-08

- Promoted `mtm-b2b-masterbatch 0.9.18` to
  `/var/www/ashareai/releases/20261108-9`.
- Replaced shared Header/Footer `--chrome-*` variables with global `--ge-*`
  tokens for color, typography, container, control size, radius and shadow.
- Aligned the shared container from `1200px` to the system target `1240px`.
- Mobile screenshots are byte-identical before and after deployment. Desktop
  changed only through the intentional container-width alignment.
- Added `tests/design-system.spec.js` for token values, legacy-variable
  removal and stylesheet load order.
- Live Playwright passed 16/16.

### Homepage Token Refactor - 2026-11-08

- Promoted `mtm-b2b-masterbatch 0.9.19` to
  `/var/www/ashareai/releases/20261108-10`.
- Removed the homepage-local `:root` block and migrated colors, typography,
  container, control sizes, radius, shadow and section spacing to `--ge-*`
  design tokens.
- Added semantic tokens for hover surfaces, the color-masterbatch card and
  accent hover.
- Existing content, section order, breakpoints and component dimensions remain
  unchanged.
- Live Playwright passed 16/16. Branded homepage screenshots were refreshed;
  small rendering differences are limited to the normalized shared font stack
  and semantic color values.

### Brand Site Icon - 2026-11-08

- Replaced the old WordPress site icon attachment `18` with the new GE
  brand-mark attachment `107`.
- Imported a `512×512` PNG generated from the approved GE brand mark.
- WordPress now emits the new 32px and 192px favicon links,
  apple-touch-icon and msapplication TileImage metadata.
- Both generated icon files return HTTP 200.
- Browsers may cache the previous icon until the tab is reopened or the page
  is force-refreshed.

### About / Quality v2 - 2026-11-08

- Promoted `mtm-b2b-masterbatch 0.9.20` to
  `/var/www/ashareai/releases/20261108-11`.
- Replaced the legacy About / Quality field-manual layout with the approved
  11-section buyer-review page: Hero, Company Facts, Material Context,
  Product Routes, Applications, Inquiry Process, Document review,
  Claim limits, Buyer checks, Next step and Final CTA.
- Added three product routes, four application-input groups and four buyer
  verification checks. No FAQ block was added; the page links to `/faq/`.
- Migrated the page CSS to the global `--ge-*` design tokens and removed the
  old cream, clay and page-local Header overrides.
- Added local and live About Playwright coverage. Local full regression was
  `24 passed / 22 skipped`; the production route, form, chrome and About
  suite was `20 passed`.
- Production width checks at `1440 / 1024 / 768 / 390 / 320px` found one H1,
  11 sections, no horizontal overflow and no broken images.
- Historical production screenshots and geometry audit were removed during cleanup.
- `blog_public=0` and both meta/Nginx noindex controls remain active.
- Kept `/var/www/ashareai/releases/20261108-11` for rollback.

### Contact / Request a Quote v1 - 2026-11-08

- Promoted the approved Contact / RFQ redesign to
  `mtm-b2b-masterbatch 0.9.22` in
  `/var/www/ashareai/releases/20261108-13`.
- Replaced the legacy quote template with four sections: Hero and RFQ,
  `After you send it.`, `Review scope.` and `Product routes.`.
- The RFQ form now shows nine core fields and keeps current grade, quantity,
  destination port and color reference type inside a closed
  `Add technical details` section.
- Removed document type and document purpose fields from the RFQ form.
  `/technical-documents/` remains the dedicated document-review route and keeps
  its required file fields.
- Added server-side RFQ validation for the target or current issue field.
- Added `assets/css/contact-v1.css`, `tests/contact-page.spec.js`, and updated
  live RFQ and runtime submission coverage.
- Fixed an integration specificity issue that initially exposed optional fields
  inside the closed details element. Promoted the hotfix as
  `mtm-b2b-masterbatch 0.9.23` in
  `/var/www/ashareai/releases/20261108-14`.
- Local full Playwright: `28 passed / 22 skipped`. Production route, Contact,
  RFQ, Documents, Chrome and About tests: `20 passed`.
- Production width checks at `1440 / 1024 / 768 / 390 / 320px` show one H1,
  four sections, nine visible fields, three closed optional details groups,
  three product routes and three support links.
- Historical production screenshots and geometry audit were removed during cleanup.
- Kept `/var/www/ashareai/releases/20261108-13` for immediate rollback.
- `blog_public=0` and both meta/Nginx noindex controls remain active.

### Header Resources Navigation - 2026-11-08

- Promoted `mtm-b2b-masterbatch 0.9.24` to
  `/var/www/ashareai/releases/20261108-15`.
- Added `Resources` to the desktop and mobile Header between Applications and
  Documents. The link targets `/resources/`.
- Updated the shared navigation script so `/resources/` and its child routes
  receive the current-page state.
- Desktop navigation remains within the viewport at `1024px` and `981px`;
  mobile navigation includes Resources in the compact menu.
- Live Header/Footer tests passed `5 / 5` with one project intentionally
  skipped for a desktop-only breakpoint test.
- `/var/www/ashareai/releases/` now retains only release 15. Release 14 was
  moved to `/var/backups/ashareai/releases/20261108-14`; older releases and
  the previous backup were removed at the user's request.

### Header Navigation Groups and Home Restoration - 2026-11-08

- Finalized the primary navigation as
  `Home / Products / Applications / Resources / About Us / Contact`.
- Resources is a dropdown with Buyer Guides, Blog, Buyer FAQ and Technical
  Documents. Blog currently targets `/resources/` until a post archive exists.
- Products and Resources dropdowns close each other and support Escape.
- Restored Home as the first navigation item after confirming it should remain.
- Promoted `mtm-b2b-masterbatch 0.9.26` to
  `/var/www/ashareai/releases/20261108-17`.
- Production Header/Footer checks passed `7 / 7` with one intentional
  desktop-only project skip.
- Release 16 is the sole backup under
  `/var/backups/ashareai/releases/20261108-16`.
- Simplified the next-step heading to `Choose your next step.` and retained
  the full production route and form suite at `20 passed`. Promoted
  `mtm-b2b-masterbatch 0.9.21` to
  `/var/www/ashareai/releases/20261108-12`; `20261108-11` remains the
  rollback release.

### Black Masterbatch 10-Angle LandFAQ - 2026-11-08

- Promoted `mtm-b2b-masterbatch 0.9.27` to
  `/var/www/ashareai/releases/20261108-18`.
- Added `templates/page-black-masterbatch.html` and
  `assets/css/black-masterbatch-guide.css`.
- Page 31 now uses `page-black-masterbatch`, with title
  `Black Masterbatch` and Rank Math title
  `Black Masterbatch Manufacturer: BK020–BK040 Grades`.
- The page contains 10 sections, five BK grades and 36 FAQ entries. FAQ
  entries are grouped at the end of the page, followed by the quote panel.
- Created a pre-deployment database export:
  `/var/backups/ashareai/database/pre-black-guide-20261108T091006Z.sql`.
- Created a pre-deployment theme archive:
  `/var/backups/ashareai/files/theme-backup-20261108T091006Z.tar.gz`.
- Production checks at `1440 / 768 / 390 / 320px` returned HTTP 200 with one
  H1, no horizontal overflow and no broken images.
- The staging index protection remains active: `blog_public=0`, page meta
  `noindex,nofollow`, and Nginx `X-Robots-Tag: noindex, nofollow`.
- Production-specific Playwright suites passed after serial execution and
  slow-image timeout fixes. The final Black Masterbatch suite was `6 passed`;
  Header/Footer plus About rerun was `11 passed / 1 skipped`.

### Deferred

- Scheduled database and file backups remain deferred by user decision.
- WordPress core, plugin and theme updates remain blocked until a manual
  backup/restore process exists.
