document.addEventListener("DOMContentLoaded", () => {
    const observerOptions = {
        threshold: 0.3,
        rootMargin: "0px 0px -100px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animItems = document.querySelectorAll(".anim-item");
    animItems.forEach((item) => observer.observe(item));

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute("href"));
            if (target) {
                target.scrollIntoView({
                    behavior: "smooth",
                });
            }
        });
    });

    const accordions = document.querySelectorAll(".accordion__item");

    accordions.forEach((el) => {
        const summary = el.querySelector("summary");
        const content = el.querySelector(".accordion__content");

        summary.addEventListener("click", (e) => {
            e.preventDefault();
            accordions.forEach((otherEl) => {
                if (otherEl !== el && otherEl.classList.contains("is-open")) {
                    closeAccordion(otherEl);
                }
            });

            if (el.classList.contains("is-open")) {
                closeAccordion(el);
            } else {
                openAccordion(el);
            }
        });
    });

    function openAccordion(el) {
        const content = el.querySelector(".accordion__content");

        el.setAttribute("open", "");
        el.classList.add("is-open");

        content.classList.add("content-open");

        content.style.height = content.scrollHeight + 30 + "px";
    }

    function closeAccordion(el) {
        const content = el.querySelector(".accordion__content");

        content.style.height = "0px";
        content.classList.remove("content-open");
        el.classList.remove("is-open");

        setTimeout(() => {
            el.removeAttribute("open");
        }, 500);
    }

    function initMarquee() {
        const marquees = document.querySelectorAll("[data-marquee]");

        if (!marquees.length) return;

        const resizeObserver = new ResizeObserver((entries) => {
            entries.forEach((entry) => {
                calculateDuration(entry.target);
            });
        });

        const intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = "running";
                } else {
                    entry.target.style.animationPlayState = "paused";
                }
            });
        });

        marquees.forEach((wrapper) => {
            buildMarquee(wrapper);
            calculateDuration(wrapper);

            resizeObserver.observe(wrapper);
            intersectionObserver.observe(wrapper);
        });
    }

    function buildMarquee(wrapper) {
        if (wrapper.classList.contains("is-initialized")) return;

        const speed = parseFloat(wrapper.getAttribute("data-marquee-speed")) || 50;
        const gap = parseFloat(wrapper.getAttribute("data-marquee-space")) || 0;

        const track = document.createElement("div");
        track.classList.add("marquee-track");
        track.style.gap = `${gap}px`;

        const group = document.createElement("div");
        group.classList.add("marquee-group");
        group.style.gap = `${gap}px`;

        while (wrapper.firstChild) {
            group.appendChild(wrapper.firstChild);
        }

        const originalChildren = Array.from(group.children);
        const fragment = document.createDocumentFragment();

        const minWidth = window.innerWidth * 1.5;
        let currentWidth = 0;

        let cloneCount = 0;

        while (cloneCount < 1 || currentWidth < minWidth) {
            originalChildren.forEach((child) => {
                fragment.appendChild(child.cloneNode(true));
                currentWidth += (child.offsetWidth || 100) + gap;
            });
            cloneCount++;
        }
        group.appendChild(fragment);

        track.appendChild(group);

        const groupClone = group.cloneNode(true);
        groupClone.setAttribute("aria-hidden", "true");
        track.appendChild(groupClone);

        wrapper.appendChild(track);
        wrapper.classList.add("is-initialized");
    }

    function calculateDuration(wrapper) {
        const track = wrapper.querySelector(".marquee-track");
        const group = wrapper.querySelector(".marquee-group");

        if (!track || !group) return;

        const speed = parseFloat(wrapper.getAttribute("data-marquee-speed")) || 50;

        const width = group.scrollWidth;

        if (width === 0) return;

        const duration = width / speed;

        wrapper.style.setProperty("--marquee-duration", `${duration}s`);
    }

    initMarquee();
});
