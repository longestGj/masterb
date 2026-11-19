#!/usr/bin/env bash
set -euo pipefail

config=/etc/nginx/sites-available/gemasterbatch.com.conf
wp_root=/var/www/ashareai/current
wp=(sudo -u www-data /usr/local/bin/wp --path="$wp_root")
stamp=$(date -u +%Y%m%dT%H%M%SZ)
backup="/var/backups/ashareai/nginx/gemasterbatch.com.conf.pre-resources-$stamp"

install -d -m 0750 "$(dirname "$backup")"
cp -a "$config" "$backup"

if ! grep -Fq "location = /resources/ {" "$config"; then
	perl -0pi -e '
		s/(    location = \/masterbatch-for-blown-film\/ \{)/    location = \/resources {\n        return 301 \/blog\/\$is_args\$args;\n    }\n\n    location = \/resources\/ {\n        return 301 \/blog\/\$is_args\$args;\n    }\n\n$1/
	' "$config"
fi

nginx -t
systemctl reload nginx

"${wp[@]}" post meta update 80 _mb_robots noindex,nofollow
"${wp[@]}" post meta update 80 _mb_noindex 1
"${wp[@]}" eval '
	update_post_meta( 80, "rank_math_robots", array( "noindex", "nofollow" ) );
'
"${wp[@]}" rankmath sitemap generate
"${wp[@]}" cache flush

printf 'backup=%s\n' "$backup"
printf 'nginx=%s\n' "$(systemctl is-active nginx)"
