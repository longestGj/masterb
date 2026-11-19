#!/usr/bin/env python3
"""Install the legacy product URL redirects in the production Nginx config."""

from pathlib import Path


CONFIG_PATH = Path("/etc/nginx/sites-enabled/ashareai.com.conf")
MARKER = '    add_header Referrer-Policy "strict-origin-when-cross-origin" always;\n'
REDIRECTS = """    location = /products {
        return 301 /$is_args$args;
    }

    location = /products/ {
        return 301 /$is_args$args;
    }

    location = /products/white-masterbatch {
        return 301 /$is_args$args;
    }

    location = /products/white-masterbatch/ {
        return 301 /$is_args$args;
    }

    location = /products/color-masterbatch {
        return 301 /$is_args$args;
    }

    location = /products/color-masterbatch/ {
        return 301 /$is_args$args;
    }

    location = /masterbatch-for-blown-film/ {
        return 301 /blog/masterbatch-for-blown-film/$is_args$args;
    }

    location = /black-specks-in-masterbatch-film/ {
        return 301 /blog/black-specks-in-masterbatch-film/$is_args$args;
    }

    location = /how-to-vet-a-masterbatch-supplier/ {
        return 301 /blog/how-to-vet-a-masterbatch-supplier/$is_args$args;
    }

    location = /masterbatch-guides/black-masterbatch/ {
        return 301 /products/black-masterbatch/$is_args$args;
    }

    location = /masterbatch-guides/white-masterbatch/ {
        return 301 /$is_args$args;
    }

    location = /masterbatch-guides/color-masterbatch/ {
        return 301 /$is_args$args;
    }
"""


def main() -> None:
    source = CONFIG_PATH.read_text()
    if source.count(MARKER) != 1:
        raise SystemExit(
            f"Expected exactly one production server marker; found {source.count(MARKER)}."
        )

    marker_at = source.index(MARKER)
    fallback_at = source.find("\n    location / {", marker_at)
    if fallback_at < 0:
        raise SystemExit("Could not find the root Nginx location block.")

    head = source[: marker_at + len(MARKER)]
    tail = source[fallback_at:]
    CONFIG_PATH.write_text(head + "\n" + REDIRECTS + "\n" + tail)
    print(f"Updated {CONFIG_PATH}")


if __name__ == "__main__":
    main()
