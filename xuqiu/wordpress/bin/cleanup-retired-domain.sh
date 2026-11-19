#!/usr/bin/env bash
set -euo pipefail

config=/etc/nginx/sites-available/gemasterbatch.com.conf
stamp=$(date -u +%Y%m%dT%H%M%SZ)
backup_root="/var/backups/ashareai/retired-ashareai-${stamp}"

install -d -m 0750 "$backup_root/nginx" "$backup_root/letsencrypt"
cp -a "$config" "$backup_root/nginx/gemasterbatch.com.conf"
cp -a /etc/letsencrypt/archive/www.ashareai.com "$backup_root/letsencrypt/archive-www.ashareai.com"
cp -a /etc/letsencrypt/live/www.ashareai.com "$backup_root/letsencrypt/live-www.ashareai.com"
cp -a /etc/letsencrypt/renewal/www.ashareai.com.conf "$backup_root/letsencrypt/renewal-www.ashareai.com.conf"

find /etc/nginx -maxdepth 3 -type f -name '*ashareai*' -exec cp -a '{}' "$backup_root/nginx/" ';'

perl -0pi -e '
	s/\A.*?\r?\n\r?\n(?=# HTTP)/# Production WordPress site for gemasterbatch.com.\n\n/s;
	s/# HTTP：[^\r\n]*/# HTTP: ACME validation and HTTPS redirect./;
	s/server_name gemasterbatch\.com www\.gemasterbatch\.com ashareai\.com www\.ashareai\.com;/server_name gemasterbatch.com www.gemasterbatch.com;/;
	s/# HTTPS 主站：[^\r\n]*/# HTTPS: canonical www site./;
	s/\r?\n# HTTPS 旧域名：[^\r\n]*\r?\nserver \{.*?\r?\n\}\r?\n?\z/\n/s;
' "$config"

if grep -Eq 'server_name[^;]*ashareai\.com|/live/www\.ashareai\.com' "$config"; then
	echo "Retired domain still referenced by Nginx config." >&2
	exit 1
fi

nginx -t
systemctl reload nginx

find /etc/nginx -maxdepth 3 -type f -name '*ashareai*' -exec mv -f '{}' "$backup_root/nginx/" ';'

certbot delete --cert-name www.ashareai.com --non-interactive

if [ -e /etc/letsencrypt/renewal/www.ashareai.com.conf ]; then
	echo "Retired Certbot renewal config still exists." >&2
	exit 1
fi

printf 'backup=%s\n' "$backup_root"
printf 'nginx=%s\n' "$(systemctl is-active nginx)"
printf 'remaining-old-domain-configs=%s\n' "$(find /etc/nginx -maxdepth 3 -type f -name '*ashareai*' | wc -l)"
