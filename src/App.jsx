import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  CalendarDays,
  ChevronDown,
  Gift,
  Heart,
  MapPin,
  Utensils,
  Volume2,
  VolumeX,
} from "lucide-react";
import { wedding } from "./config";
import entranceVideo from "../hero-silent.mp4?url";
import weddingSong from "../song-quiet.mp3?url";
import couplePortrait from "../couple.webp?url";

gsap.registerPlugin(ScrollTrigger);

const heartShape =
  "M145 218C102 183 18 130 18 70C18 8 100 -5 145 50C190 -5 272 8 272 70C272 130 188 183 145 218Z";

function Petals({ className = "" }) {
  return (
    <div className={`petals ${className}`} aria-hidden="true">
      {Array.from({ length: 16 }, (_, i) => (
        <i
          key={i}
          style={{ "--x": `${(i * 37) % 100}%`, "--delay": `${i * 42}ms` }}
        />
      ))}
    </div>
  );
}

function PalaceGate({ opening, onOpen }) {
  return (
    <div className={`palace-gate ${opening ? "palace-gate--opening" : ""}`}>
      <div className="gate-art" aria-hidden="true" />
      <div className="gate-mask" aria-hidden="true">
        <div className="gate-leaf gate-left">
          <div className="gate-art gate-face" />
        </div>
        <div className="gate-leaf gate-right">
          <div className="gate-art gate-face" />
        </div>
      </div>
      <button
        type="button"
        className="gate-monogram"
        onClick={onOpen}
        disabled={opening}
        aria-label="Open wedding invitation"
      >
        <span aria-hidden="true">
          {wedding.partner1[0]}
          <i>&amp;</i>
          {wedding.partner2[0]}
        </span>
        <span className="gate-prompt" aria-hidden="true">Tap to open</span>
      </button>
    </div>
  );
}

function Cover({ playing, loadVideo }) {
  const video = useRef(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const showVideo = loadVideo && !videoFailed;

  useEffect(() => {
    if (!playing || !showVideo) return;
    video.current.play().catch(() => setVideoFailed(true));
  }, [playing, showVideo]);

  return (
    <header className="cover" aria-label="Wedding invitation">
      <div className="cover-scene" aria-hidden="true">
        {showVideo && (
          <video
            ref={video}
            className="cover-video"
            src={entranceVideo}
            preload="auto"
            loop
            playsInline
            muted
            onError={() => setVideoFailed(true)}
          />
        )}
      </div>
      <div className="cover-copy">
        <p className="invocation" lang="pi-Deva">अत्त दीपा भव</p>
        <p className="dedication">
          With the divine blessings of the Almighty and in loving memory of our
          beloved grandparents
        </p>
        <div className="divider" aria-hidden="true">
          <span>✦</span>
        </div>
        <p className="hosts">
          With immense joy and affection, <strong>{wedding.hosts}</strong>{" "}
          invite you to celebrate the wedding of their beloved daughter,{" "}
          Dr. Upasana.
        </p>
        <p className="cover-traditions">
          <span lang="mr">शुभ विवाह</span>
          <span aria-hidden="true">◆</span>
          <span lang="gu">શુભ લગ્ન</span>
        </p>
        <h1>
          <span>{wedding.bride}</span>
          <i>&amp;</i>
          <span>{wedding.groom}</span>
        </h1>
        <p className="groom-parents">{wedding.groomParents}</p>
        <div className="divider" aria-hidden="true">
          <span>✦</span>
        </div>
        <time className="cover-date" dateTime={wedding.date}>
          {wedding.dateLabel}
        </time>
        <a className="cover-discover" href="#surprise">
          Discover the invitation
          <ChevronDown size={18} aria-hidden="true" />
        </a>
      </div>
    </header>
  );
}

function Heading({ children, icon: Icon, accent, lang }) {
  return (
    <>
      {Icon && (
        <Icon
          className="section-icon"
          size={23}
          strokeWidth={1.4}
          aria-hidden="true"
        />
      )}
      {accent && (
        <p className="section-accent" lang={lang}>
          {accent}
        </p>
      )}
      <h2>{children}</h2>
      <div className="divider" aria-hidden="true">
        <span>✦</span>
      </div>
    </>
  );
}

function ScratchHeart() {
  const canvas = useRef(null);
  const message = useRef(null);
  const previousPoint = useRef(null);
  const initialCoverage = useRef(0);
  const [revealed, setRevealed] = useState(false);

  function coveredPixels(ctx) {
    const pixels = ctx.getImageData(
      0,
      0,
      ctx.canvas.width,
      ctx.canvas.height,
    ).data;
    let count = 0;
    for (let i = 3; i < pixels.length; i += 64) {
      if (pixels[i] > 128) count++;
    }
    return count;
  }

  useEffect(() => {
    const ctx = canvas.current.getContext("2d", { willReadFrequently: true });
    ctx.clearRect(0, 0, 290, 226);
    const shape = new Path2D(heartShape);
    const gradient = ctx.createRadialGradient(98, 68, 6, 145, 102, 145);
    gradient.addColorStop(0, "#efb8cb");
    gradient.addColorStop(0.55, "#b56888");
    gradient.addColorStop(1, "#773550");
    ctx.fillStyle = gradient;
    ctx.fill(shape);
    ctx.save();
    ctx.clip(shape);
    for (let i = 0; i < 1500; i++) {
      const x = (i * 83.37) % 290;
      const y = (i * 37.63) % 226;
      ctx.fillStyle = i % 4 === 0 ? "#fff2ea91" : "#fff2ea35";
      ctx.fillRect(x, y, 1 + (i % 3) * 0.35, 1);
    }
    ctx.restore();
    initialCoverage.current = coveredPixels(ctx);
  }, []);

  function scratch(event) {
    const surface = canvas.current;
    const rect = surface.getBoundingClientRect();
    const point = {
      x: ((event.clientX - rect.left) * surface.width) / rect.width,
      y: ((event.clientY - rect.top) * surface.height) / rect.height,
    };
    const start = previousPoint.current || point;
    const ctx = surface.getContext("2d");
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineWidth = 42;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(point.x + 0.01, point.y);
    ctx.stroke();
    ctx.restore();
    previousPoint.current = point;
  }

  function finishScratch(event) {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    previousPoint.current = null;
    const ctx = canvas.current.getContext("2d");
    if (coveredPixels(ctx) < initialCoverage.current * 0.45) setRevealed(true);
  }

  return (
    <section className="section scratch" id="surprise" tabIndex={-1}>
      <Heading>{revealed ? "Our Forever Begins" : "Scratch to Reveal"}</Heading>
      <div className="scratch-heart">
        {revealed && <Petals />}
        <div
          ref={message}
          className="heart-message"
          tabIndex={-1}
          aria-hidden={!revealed}
        >
          <Heart size={19} aria-hidden="true" />
          <span>Save the date</span>
          <strong>{wedding.dateLabel}</strong>
        </div>
        <canvas
          ref={canvas}
          width={290}
          height={226}
          className={revealed ? "revealed" : ""}
          aria-hidden="true"
          onPointerDown={(event) => {
            if (previousPoint.current) return;
            event.currentTarget.setPointerCapture(event.pointerId);
            scratch(event);
          }}
          onPointerMove={(event) => {
            if (event.currentTarget.hasPointerCapture(event.pointerId))
              scratch(event);
          }}
          onPointerUp={finishScratch}
          onPointerCancel={finishScratch}
        />
      </div>
      <button
        className="text-button"
        hidden={revealed}
        onClick={() => {
          setRevealed(true);
          requestAnimationFrame(() =>
            message.current?.focus({ preventScroll: true }),
          );
        }}
      >
        Reveal the date
      </button>
    </section>
  );
}

function getRemaining() {
  const seconds = Math.max(
    0,
    Math.floor((new Date(wedding.date).getTime() - Date.now()) / 1000),
  );
  return [
    ["Days", Math.floor(seconds / 86400)],
    ["Hours", Math.floor(seconds / 3600) % 24],
    ["Minutes", Math.floor(seconds / 60) % 60],
    ["Seconds", seconds % 60],
  ];
}

function Countdown() {
  const [remaining, setRemaining] = useState(getRemaining);
  useEffect(() => {
    const timer = window.setInterval(() => setRemaining(getRemaining()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="section countdown">
      <Heading>Time Until Our Wedding</Heading>
      <div className="countdown-grid">
        {remaining.map(([label, value]) => (
          <div key={label}>
            <strong>{String(value).padStart(2, "0")}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

const eventIcons = { wedding: CalendarDays, dinner: Utensils };

function Timeline() {
  return (
    <section className="section celebrations" id="celebrations">
      <Heading accent={wedding.celebrationAccent} lang="gu">
        Wedding Celebrations
      </Heading>
      <ol className="timeline">
        {wedding.events.map((event) => {
          const Icon = eventIcons[event.id];
          return (
            <li key={event.id}>
              <Icon size={27} strokeWidth={1.35} aria-hidden="true" />
              <div>
                <h3>{event.name}</h3>
                {event.dateTime && (
                  <time dateTime={event.dateTime}>{event.dateLabel}</time>
                )}
                <p>{event.detail}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function EventDetails() {
  function downloadCalendar() {
    const calendarDate = (date) =>
      date.toISOString().replace(/[-:]|\.\d{3}/g, "");
    const event = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      `PRODID:-//${wedding.partner1} and ${wedding.partner2}//Wedding Invitation//EN`,
      "BEGIN:VEVENT",
      "UID:20270127-upasana-rutvik@wedding-invitation",
      `DTSTAMP:${calendarDate(new Date())}`,
      `DTSTART:${calendarDate(new Date(wedding.date))}`,
      `SUMMARY:Wedding of ${wedding.partner1} and ${wedding.partner2}`,
      `LOCATION:${[wedding.location, ...wedding.address.split(", ")].join("\\, ")}`,
      "END:VEVENT",
      "END:VCALENDAR",
      "",
    ].join("\r\n");
    const url = URL.createObjectURL(
      new Blob([event], { type: "text/calendar" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "upasana-rutvik-wedding.ics";
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <>
      <section className="section detail">
        <Heading icon={MapPin}>{wedding.location}</Heading>
        <p>{wedding.address}</p>
        <div className="venue-actions">
          <a
            className="primary-button"
            href={wedding.mapUrl}
            target="_blank"
            rel="noreferrer"
          >
            Get Directions
          </a>
          <button
            className="primary-button outline-button"
            onClick={downloadCalendar}
          >
            Add to Calendar
          </button>
        </div>
      </section>
      <section className="section detail">
        <Heading icon={Gift}>Gifts</Heading>
        <p>
          Your presence will be our greatest pleasure, and your blessings, our
          most treasured gift.
        </p>
      </section>
    </>
  );
}

export default function App() {
  const [phase, setPhase] = useState("closed");
  const invitation = useRef(null);
  const music = useRef(null);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [loadVideo, setLoadVideo] = useState(false);

  function openGate() {
    music.current.play().catch(() => setMusicPlaying(false));
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    setLoadVideo(!reducedMotion);
    setPhase(reducedMotion ? "open" : "opening");
  }

  function toggleMusic() {
    if (music.current.paused) {
      music.current.play().catch(() => setMusicPlaying(false));
    } else {
      music.current.pause();
    }
  }

  useEffect(() => {
    if (phase === "open") {
      window.scrollTo({ top: 0, behavior: "instant" });
      invitation.current.focus({ preventScroll: true });
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const animations = gsap.context(() => {
        gsap.utils
          .toArray(".section, .farewell")
          .forEach((section) => {
            gsap.from(
              Array.from(section.children).filter(
                (child) => !child.matches(".timeline"),
              ),
              {
                opacity: 0.2,
                y: 12,
                duration: 0.62,
                ease: "power3.out",
                stagger: 0.04,
                clearProps: "opacity,transform",
                scrollTrigger: {
                  trigger: section,
                  start: "top 96%",
                  once: true,
                },
              },
            );
          });
        ScrollTrigger.create({
          trigger: ".timeline",
          start: "top 100%",
          once: true,
          onEnter: ({ trigger }) => trigger.classList.add("timeline--revealed"),
        });
        ScrollTrigger.create({
          trigger: ".couple-portrait",
          start: "top 90%",
          once: true,
          onEnter: ({ trigger }) => trigger.classList.add("couple-portrait--revealed"),
        });
      }, invitation.current);
      return () => animations.revert();
    }

    document.body.style.overflow = "hidden";
    const timer =
      phase === "opening"
        ? window.setTimeout(() => setPhase("open"), 1540)
        : undefined;
    return () => {
      document.body.style.overflow = "";
      window.clearTimeout(timer);
    };
  }, [phase]);

  return (
    <div className={`invitation ${phase === "open" ? "invitation--open" : ""}`}>
      <audio
        ref={music}
        loop
        preload="none"
        onPlaying={() => setMusicPlaying(true)}
        onPause={() => setMusicPlaying(false)}
        onError={() => setMusicPlaying(false)}
      >
        <source src={weddingSong} type="audio/mpeg" />
      </audio>
      {phase === "open" && (
        <button
          type="button"
          className="music-toggle"
          onClick={toggleMusic}
          aria-label={
            musicPlaying ? "Pause wedding music" : "Play wedding music"
          }
        >
          {musicPlaying ? (
            <Volume2 size={20} aria-hidden="true" />
          ) : (
            <VolumeX size={20} aria-hidden="true" />
          )}
        </button>
      )}
      <main
        ref={invitation}
        tabIndex={-1}
        inert={phase === "open" ? undefined : ""}
      >
        <Cover playing={phase === "open"} loadVideo={loadVideo} />
        {phase === "open" && <Petals className="entrance-petals" />}
        <ScratchHeart />
        <section className="welcome section">
          <Heart size={15} fill="currentColor" aria-hidden="true" />
          <p className="section-accent" lang="gu">
            {wedding.welcomeAccent}
          </p>
          <h2>Two hearts, two families</h2>
          <p>
            As two families come together in a beautiful bond of love and
            companionship, we seek your gracious presence and heartfelt
            blessings to make this celebration truly memorable.
          </p>
        </section>
        <div className="couple-portrait">
          <figure className="couple-frame">
            <img
              src={couplePortrait}
              alt={`${wedding.partner1} and ${wedding.partner2} together`}
              width={800}
              height={1200}
              loading="lazy"
              decoding="async"
            />
          </figure>
          <div className="divider" aria-hidden="true">
            <span>✦</span>
          </div>
        </div>
        <Timeline />
        <Countdown />
        <EventDetails />
        <section className="farewell">
          <Heading accent={wedding.farewellAccent} lang="mr">
            We can’t wait to celebrate with you!
          </Heading>
          <p>
            {wedding.partner1} &amp; {wedding.partner2}
          </p>
        </section>
        <footer>
          {wedding.partner1} &amp; {wedding.partner2}{" "}
          <Heart size={12} aria-hidden="true" />
        </footer>
      </main>
      {(phase === "closed" || phase === "opening") && (
        <PalaceGate opening={phase === "opening"} onOpen={openGate} />
      )}
    </div>
  );
}
