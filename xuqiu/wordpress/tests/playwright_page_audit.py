#!/usr/bin/env python3
"""Audit the imported Masterbatch page in a real Chromium browser."""

from __future__ import annotations

import json
import sys
from pathlib import Path
from urllib.parse import urljoin, urlparse

from playwright.sync_api import sync_playwright


TARGET_URL = (
    sys.argv[1]
    if len(sys.argv) > 1
    else "http://localhost:8889/masterbatch-guides/black-masterbatch/"
)
CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
OUTPUT_JSON = Path("/tmp/masterbatch-page-audit.json")
DESKTOP_SCREENSHOT = Path("/tmp/masterbatch-page-desktop.png")
MOBILE_SCREENSHOT = Path("/tmp/masterbatch-page-mobile.png")


def collect_page_audit(page, context) -> dict:
    """Collect SEO, structure, link and layout signals from one page."""
    errors: list[str] = []
    page_errors: list[str] = []
    failed_requests: list[dict[str, str]] = []
    bad_responses: list[dict[str, object]] = []
    document_responses: list[dict[str, object]] = []

    page.on("console", lambda message: errors.append(message.text) if message.type == "error" else None)
    page.on("pageerror", lambda error: page_errors.append(str(error)))
    page.on(
        "requestfailed",
        lambda request: failed_requests.append(
            {
                "url": request.url,
                "failure": request.failure or "",
            }
        ),
    )
    page.on(
        "response",
        lambda response: bad_responses.append(
            {
                "url": response.url,
                "status": response.status,
                "resource_type": response.request.resource_type,
            }
        )
        if response.status >= 400
        else None,
    )
    page.on(
        "response",
        lambda response: document_responses.append(
            {
                "url": response.url,
                "status": response.status,
            }
        )
        if response.request.resource_type == "document"
        else None,
    )

    page_response = page.goto(TARGET_URL, wait_until="domcontentloaded")
    try:
        page.wait_for_load_state("networkidle", timeout=8000)
    except Exception:
        # Some WordPress heartbeat or third-party requests can stay active.
        page.wait_for_timeout(1000)
    page.wait_for_timeout(800)

    data = page.evaluate(
        """
        () => {
            const text = (selector) => document.querySelector(selector)?.innerText.trim() || "";
            const attr = (selector, name) => document.querySelector(selector)?.getAttribute(name) || "";
            const headings = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((el) => ({
                level: Number(el.tagName.substring(1)),
                text: el.innerText.trim(),
                visible: !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length)
            }));
            const images = [...document.images].map((img) => ({
                src: img.currentSrc || img.src,
                alt: img.getAttribute("alt"),
                width: img.getAttribute("width"),
                height: img.getAttribute("height")
            }));
            const forms = [...document.forms].map((form) => ({
                action: form.getAttribute("action") || "",
                method: form.getAttribute("method") || "get",
                visible: !!(form.offsetWidth || form.offsetHeight || form.getClientRects().length)
            }));
            return {
                title: document.title,
                lang: document.documentElement.lang,
                h1: [...document.querySelectorAll("h1")].map((el) => el.innerText.trim()),
                headings,
                summaryOccurrences: [...document.querySelectorAll(".mtm-guide-summary")]
                    .map((el) => el.innerText.trim())
                    .filter(Boolean)
                    .map((summary) => ({
                        summary,
                        count: (document.body.innerText.match(new RegExp(summary.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&"), "g")) || []).length
                    })),
                rfqCtaCount: [...document.querySelectorAll('a[href*="/request-a-quote/"]')].filter((a) => a.offsetWidth || a.offsetHeight || a.getClientRects().length).length,
                technicalDocumentCtaCount: [...document.querySelectorAll('a[href*="/technical-documents/"]')].filter((a) => a.offsetWidth || a.offsetHeight || a.getClientRects().length).length,
                headerRect: (() => {
                    const rect = document.querySelector("header")?.getBoundingClientRect();
                    return rect ? {top: rect.top, bottom: rect.bottom, height: rect.height} : null;
                })(),
                topbar: (() => {
                    const el = document.querySelector(".mtm-topbar");
                    const rect = el?.getBoundingClientRect();
                    return el ? {
                        display: getComputedStyle(el).display,
                        visible: !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length),
                        height: rect?.height || 0,
                        text: el.innerText.trim()
                    } : null;
                })(),
                headerPosition: (() => {
                    const el = document.querySelector("header");
                    return el ? getComputedStyle(el).position : "";
                })(),
                headerClassName: document.querySelector("header")?.className || "",
                headerCssRules: (() => {
                    const rules = [];
                    for (const sheet of document.styleSheets) {
                        try {
                            for (const rule of sheet.cssRules) {
                                if (rule.cssText.includes("mtm-header-sticky")) {
                                    rules.push(rule.cssText);
                                }
                            }
                        } catch (error) {
                            rules.push("UNREADABLE_STYLESHEET");
                        }
                    }
                    return rules;
                })(),
                footerSiteTitleTag: document.querySelector("footer .wp-block-site-title")?.tagName || "",
                footerHeadings: [...document.querySelectorAll("footer h1,footer h2,footer h3,footer h4,footer h5,footer h6")].map((el) => ({
                    level: Number(el.tagName.substring(1)),
                    text: el.innerText.trim()
                })),
                footerLinks: [...document.querySelectorAll("footer a[href]")].map((el) => {
                    const style = getComputedStyle(el);
                    const rect = el.getBoundingClientRect();
                    return {
                        text: el.innerText.trim(),
                        href: el.href,
                        color: style.color,
                        visible: !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length),
                        width: rect.width,
                        height: rect.height
                    };
                }),
                heroRect: (() => {
                    const rect = document.querySelector(".mtm-guide-hero")?.getBoundingClientRect();
                    return rect ? {top: rect.top, bottom: rect.bottom, height: rect.height} : null;
                })(),
                mainText: text("main"),
                headerText: text("header"),
                footerText: text("footer"),
                metaDescription: attr('meta[name="description"]', "content"),
                canonical: attr('link[rel="canonical"]', "href"),
                robots: attr('meta[name="robots"]', "content"),
                viewportWidth: window.innerWidth,
                documentWidth: document.documentElement.scrollWidth,
                horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
                images,
                forms,
                hasImportChecklist: document.body.innerText.includes("WORDPRESS IMPORT CHECKLIST"),
                hasMarkdownFence: document.body.innerText.includes(":::section"),
            };
        }
        """
    )

    links = page.locator("a[href]").evaluate_all(
        """
        (anchors) => [...new Map(anchors.map((a) => {
            const text = (a.innerText || a.getAttribute("aria-label") || "").trim();
            return [a.href, {
                text,
                href: a.href,
                visible: !!(a.offsetWidth || a.offsetHeight || a.getClientRects().length)
            }];
        })).values()]
        """
    )

    page.evaluate("window.scrollTo(0, 800)")
    page.wait_for_timeout(250)
    sticky_header = page.evaluate(
        """
        () => {
            const el = document.querySelector("header");
            const rect = el?.getBoundingClientRect();
            return rect ? {
                top: rect.top,
                bottom: rect.bottom,
                scrollY: window.scrollY,
                documentHeight: document.documentElement.scrollHeight,
                viewportHeight: window.innerHeight
            } : null;
        }
        """
    )
    page.evaluate("window.scrollTo(0, 0)")
    page.wait_for_timeout(100)

    current_origin = urlparse(TARGET_URL).netloc
    internal_links = []
    for link in links:
        parsed = urlparse(link["href"])
        if parsed.scheme not in ("http", "https") or parsed.netloc != current_origin:
            continue
        if link["href"].split("#", 1)[0] == TARGET_URL.split("#", 1)[0]:
            continue
        link_response = context.request.get(link["href"], max_redirects=10, timeout=15000)
        internal_links.append(
            {
                **link,
                "status": link_response.status,
                "final_url": link_response.url,
            }
        )

    data.update(
        {
            "requested_url": TARGET_URL,
            "http_status": page_response.status if page_response else 0,
            "final_url": page.url,
            "console_errors": sorted(set(errors)),
            "page_errors": sorted(set(page_errors)),
            "failed_requests": failed_requests,
            "bad_responses": bad_responses,
            "document_responses": document_responses,
            "links": links,
            "internal_link_statuses": internal_links,
            "sticky_header_after_scroll": sticky_header,
        }
    )
    return data


def main() -> None:
    """Run desktop and mobile audits and save screenshots."""
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(
            headless=True,
            executable_path=CHROME_PATH,
        )

        desktop_context = browser.new_context(viewport={"width": 1440, "height": 1000})
        desktop_page = desktop_context.new_page()
        desktop = collect_page_audit(desktop_page, desktop_context)
        desktop_page.screenshot(path=str(DESKTOP_SCREENSHOT), full_page=True)
        desktop_context.close()

        mobile_context = browser.new_context(
            viewport={"width": 390, "height": 844},
            device_scale_factor=1,
            is_mobile=True,
            has_touch=True,
        )
        mobile_page = mobile_context.new_page()
        mobile = collect_page_audit(mobile_page, mobile_context)
        mobile_page.screenshot(path=str(MOBILE_SCREENSHOT), full_page=True)
        menu_button = mobile_page.locator(".wp-block-navigation__responsive-container-open")
        mobile["mobile_navigation"] = {
            "button_count": menu_button.count(),
            "button_visible": menu_button.first.is_visible() if menu_button.count() else False,
        }
        if menu_button.count() and menu_button.first.is_visible():
            menu_button.first.click()
            mobile_page.wait_for_timeout(300)
            visible_links = mobile_page.locator(
                ".wp-block-navigation__responsive-container.is-menu-open a[href]"
            )
            mobile["mobile_navigation"]["visible_link_count"] = sum(
                1 for index in range(visible_links.count()) if visible_links.nth(index).is_visible()
            )
        mobile_context.close()

        browser.close()

    report = {
        "desktop": desktop,
        "mobile": mobile,
        "screenshots": {
            "desktop": str(DESKTOP_SCREENSHOT),
            "mobile": str(MOBILE_SCREENSHOT),
        },
    }
    OUTPUT_JSON.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
