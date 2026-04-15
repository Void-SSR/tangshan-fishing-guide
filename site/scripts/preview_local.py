#!/usr/bin/env python3

from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import socket
import sys
import webbrowser


SITE_ROOT = Path(__file__).resolve().parent.parent
DIST_DIR = SITE_ROOT / "dist"
DEFAULT_PORT = 4321
MAX_PORT_TRIES = 10


def pick_port(start_port: int) -> int:
    for offset in range(MAX_PORT_TRIES):
        port = start_port + offset
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            try:
                sock.bind(("0.0.0.0", port))
            except OSError:
                continue
            return port
    raise RuntimeError("未找到可用本地端口，默认范围 4321-4330 均不可用。")


def detect_lan_ip() -> str:
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as sock:
            sock.connect(("8.8.8.8", 80))
            return sock.getsockname()[0]
    except OSError:
        return "127.0.0.1"


def main() -> int:
    if not DIST_DIR.exists():
        print(f"缺少构建产物：{DIST_DIR}", file=sys.stderr)
        print("请先运行 npm run build", file=sys.stderr)
        return 1

    port = pick_port(DEFAULT_PORT)
    lan_ip = detect_lan_ip()
    handler = partial(SimpleHTTPRequestHandler, directory=str(DIST_DIR))
    server = ThreadingHTTPServer(("0.0.0.0", port), handler)
    local_url = f"http://127.0.0.1:{port}/"
    lan_url = f"http://{lan_ip}:{port}/"

    print("唐山海钓指南本地预览已启动")
    print(f"目录：{DIST_DIR}")
    print(f"本机网址：{local_url}")
    print(f"手机同网访问：{lan_url}")
    print("按 Ctrl+C 结束预览")

    try:
        webbrowser.open(local_url)
    except Exception:
        pass

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n已停止本地预览")
    finally:
        server.server_close()

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
