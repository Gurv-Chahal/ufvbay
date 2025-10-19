import React, { useEffect, useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Modal({ title, children, maxWidth = 760 }) {
    const navigate = useNavigate();
    const [closing, setClosing] = useState(false);

    // --- NEW: anchor the modal to the .home-content canvas ---
    const [anchor, setAnchor] = useState({ x: null, y: null });

    useLayoutEffect(() => {
        const pickVisibleCanvas = () => {
            const els = Array.from(document.querySelectorAll(".home-content"));
            const vw = window.innerWidth;
            const vh = window.innerHeight;

            // choose the .home-content with the largest visible area
            let bestRect = null;
            let bestArea = -1;

            els.forEach((el) => {
                const r = el.getBoundingClientRect();
                const visW = Math.max(0, Math.min(r.right, vw) - Math.max(r.left, 0));
                const visH = Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0));
                const area = visW * visH;
                if (area > bestArea) {
                    bestArea = area;
                    bestRect = r;
                }
            });

            // fallback: viewport center if none found
            const r = bestRect || { left: 0, top: 0, width: vw, height: vh };

            // clamp to keep at least 16px margin inside the viewport
            const margin = 16;
            const cx = Math.min(vw - margin, Math.max(margin, r.left + r.width / 2));
            const cy = Math.min(vh - margin, Math.max(margin, r.top + r.height / 2));

            setAnchor({ x: cx, y: cy });
        };

        pickVisibleCanvas();
        window.addEventListener("resize", pickVisibleCanvas);
        window.addEventListener("scroll", pickVisibleCanvas, true);
        return () => {
            window.removeEventListener("resize", pickVisibleCanvas);
            window.removeEventListener("scroll", pickVisibleCanvas, true);
        };
    }, []);
    // ---------------------------------------------------------

    const closeWithAnim = () => {
        if (closing) return;
        setClosing(true);
        setTimeout(() => navigate(-1), 200);
    };

    useEffect(() => {
        const onKey = (e) => e.key === "Escape" && closeWithAnim();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []); // eslint-disable-line

    return (
        <div
            className={`modal-backdrop infosheet ${closing ? "is-closing" : "is-opening"}`}
            onClick={closeWithAnim}
        >
            <section
                className={`modal-sheet infosheet-sheet ${closing ? "is-closing" : "is-opening"}`}
                style={{
                    maxWidth,
                    // hand the computed center to CSS
                    "--modal-left": anchor.x ? `${anchor.x}px` : undefined,
                    "--modal-top": anchor.y ? `${anchor.y}px` : undefined,
                }}
                role="dialog"
                aria-modal="true"
                aria-label={title || "Dialog"}
                onClick={(e) => e.stopPropagation()}
            >
                <header className="modal-header">
                    <h3 className="modal-title">{title}</h3>
                    <button
                        className="modal-close"
                        onClick={closeWithAnim}
                        aria-label="Close"
                        type="button"
                    >
                        ×
                    </button>
                </header>

                <div className="modal-body">{children}</div>
            </section>
        </div>
    );
}
