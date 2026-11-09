#!/usr/bin/env python3
"""Install the legacy product URL redirects in the production Nginx config."""

import re
from pathlib import Path


CONFIG_PATH = Path("/etc/nginx/sites-enabled/ashareai.com.conf")
MARKER = '    add_header Referrer-Policy "strict-origin-when-cross-origin" always;\n'
REDIRECTS = """    location = /products {
        return 301 /$is_args$args;
    }

    location = /products/ {
        return 301 /$is_args$args;
    }

    # Temporary placeholders for BK grades whose detail pages are still drafts.
    location = /products/black-masterbatch/bk020/ {
        return 301 /products/black-masterbatch/$is_args$args;
    }

    location = /products/black-masterbatch/bk025/ {
        return 301 /products/black-masterbatch/$is_args$args;
    }

    location = /products/black-masterbatch/bk030/ {
        return 301 /products/black-masterbatch/$is_args$args;
    }

    location = /products/black-masterbatch/bk035/ {
        return 301 /products/black-masterbatch/$is_args$args;
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
        return 301 /products/white-masterbatch/$is_args$args;
    }

    location = /masterbatch-guides/color-masterbatch/ {
        return 301 /products/color-masterbatch/$is_args$args;
    }
"""


def main() -> None:
    source = CONFIG_PATH.read_text()
    source = re.sub(
        r"\n    # Temporary placeholders for BK grades whose detail pages are still drafts\.\n"
        r"(?:    location = /products/black-masterbatch/"
        r"(?:bk020|bk025|bk030|bk035)/ \{\n"
        r"        return 301 /products/black-masterbatch/"
        r"(?:\$is_args\$args)?;\n"
        r"    \}\n\n?)+",
        "",
        source,
    )
    source = re.sub(
        r"\n    location = /(?:masterbatch-for-blown-film|"
        r"black-specks-in-masterbatch-film|"
        r"how-to-vet-a-masterbatch-supplier)/ \{\n"
        r"        return 301 /blog/(?:masterbatch-for-blown-film|"
        r"black-specks-in-masterbatch-film|"
        r"how-to-vet-a-masterbatch-supplier)/"
        r"(?:\$is_args\$args)?;\n"
        r"    \}\n",
        "",
        source,
    )
    source = re.sub(
        r"\n    location = /products/?(?:/)? \{\n"
        r"        return 301 /(?:\$is_args\$args)?;\n"
        r"    \}\n",
        "",
        source,
    )
    source = re.sub(
        r"\n    location = /masterbatch-guides/"
        r"(?:black|white|color)-masterbatch/ \{\n"
        r"        return 301 /products/"
        r"(?:black|white|color)-masterbatch/"
        r"(?:\$is_args\$args)?;\n"
        r"    \}\n",
        "",
        source,
    )

    if source.count(MARKER) != 1:
        raise SystemExit("Expected exactly one production server marker.")

    source = source.replace(MARKER, MARKER + "\n" + REDIRECTS, 1)
    CONFIG_PATH.write_text(source)
    print(f"Updated {CONFIG_PATH}")


if __name__ == "__main__":
    main()
