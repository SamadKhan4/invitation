import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CalendarDays, ChevronDown, Gift, Heart, MapPin, Utensils } from 'lucide-react';
import { wedding } from './config';
import entranceVideo from '../hero-silent.mp4?url';

gsap.registerPlugin(ScrollTrigger);

const heartShape = 'M145 218C102 183 18 130 18 70C18 8 100 -5 145 50C190 -5 272 8 272 70C272 130 188 183 145 218Z';

function Petals({ className = '' }) {
  return (
    <div className={`petals ${className}`} aria-hidden="true">
      {Array.from({ length: 16 }, (_, i) => (
        <i key={i} style={{ '--x': `${(i * 37) % 100}%`, '--delay': `${i * 42}ms` }} />
      ))}
    </div>
  );
}

function PalaceGate({ opening, onOpen }) {
  return (
    <div className={`palace-gate ${opening ? 'palace-gate--opening' : ''}`}>
      <div className="gate-art" aria-hidden="true" />
      <div className="gate-mask" aria-hidden="true">
        <div className="gate-leaf gate-left"><div className="gate-art gate-face" /></div>
        <div className="gate-leaf gate-right"><div className="gate-art gate-face" /></div>
      </div>
      <button type="button" className="gate-monogram" onClick={onOpen} disabled={opening} aria-label="Open wedding invitation">
        <span aria-hidden="true">{wedding.partner1[0]}<i>&amp;</i>{wedding.partner2[0]}</span>
      </button>
    </div>
  );
}

function Cover({ playing, loadVideo }) {
  const video = useRef(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const [paperFrame, setPaperFrame] = useState(false);
  const showVideo = loadVideo && !videoFailed;

  useEffect(() => {
    if (!playing || !showVideo) return;
    video.current.play().catch(() => setVideoFailed(true));
  }, [playing, showVideo]);

  return (
    <header className={`cover ${showVideo ? 'cover--video' : ''} ${paperFrame ? 'cover--paper-frame' : ''}`} aria-label="Wedding invitation">
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
            onTimeUpdate={event => setPaperFrame(event.currentTarget.currentTime >= 8.1)}
          />
        )}
      </div>
      <div className="cover-copy">
        <span className="cover-fleur" aria-hidden="true">❦</span>
        <p className="invocation" lang="hi">{wedding.invocation}</p>
        <p className="section-accent" lang="gu">{wedding.invitationAccent}</p>
        <p className="dedication">With the divine blessings of the Almighty and in loving memory of our beloved grandparents</p>
        <div className="divider" aria-hidden="true"><span>✦</span></div>
        <p className="hosts"><strong>{wedding.hosts}</strong><br />cordially invite you to the joyous and auspicious occasion of the wedding ceremony of our beloved daughter</p>
        <h1><span>{wedding.bride}</span><i>&amp;</i><span>{wedding.groom}</span></h1>
        <p className="groom-parents">{wedding.groomParents}</p>
        <a className="scroll-cue" href="#celebrations">Wedding details <ChevronDown size={16} aria-hidden="true" /></a>
      </div>
    </header>
  );
}

function Heading({ children, icon: Icon, accent, lang }) {
  return (
    <>
      {Icon && <Icon className="section-icon" size={23} strokeWidth={1.4} aria-hidden="true" />}
      {accent && <p className="section-accent" lang={lang}>{accent}</p>}
      <h2>{children}</h2>
      <div className="divider" aria-hidden="true"><span>✦</span></div>
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
    const pixels = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height).data;
    let count = 0;
    for (let i = 3; i < pixels.length; i += 64) {
      if (pixels[i] > 128) count++;
    }
    return count;
  }

  useEffect(() => {
    const ctx = canvas.current.getContext('2d', { willReadFrequently: true });
    ctx.clearRect(0, 0, 290, 226);
    const shape = new Path2D(heartShape);
    const gradient = ctx.createRadialGradient(98, 68, 6, 145, 102, 145);
    gradient.addColorStop(0, '#efb8cb');
    gradient.addColorStop(.55, '#b56888');
    gradient.addColorStop(1, '#773550');
    ctx.fillStyle = gradient;
    ctx.fill(shape);
    ctx.save();
    ctx.clip(shape);
    for (let i = 0; i < 1500; i++) {
      const x = (i * 83.37) % 290;
      const y = (i * 37.63) % 226;
      ctx.fillStyle = i % 4 === 0 ? '#fff2ea91' : '#fff2ea35';
      ctx.fillRect(x, y, 1 + (i % 3) * .35, 1);
    }
    ctx.restore();
    initialCoverage.current = coveredPixels(ctx);
  }, []);

  function scratch(event) {
    const surface = canvas.current;
    const rect = surface.getBoundingClientRect();
    const point = {
      x: (event.clientX - rect.left) * surface.width / rect.width,
      y: (event.clientY - rect.top) * surface.height / rect.height,
    };
    const start = previousPoint.current || point;
    const ctx = surface.getContext('2d');
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = 42;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(point.x + .01, point.y);
    ctx.stroke();
    ctx.restore();
    previousPoint.current = point;
  }

  function finishScratch(event) {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    previousPoint.current = null;
    const ctx = canvas.current.getContext('2d');
    if (coveredPixels(ctx) < initialCoverage.current * .45) setRevealed(true);
  }

  return (
    <section className="section scratch" id="surprise">
      <Heading>{revealed ? 'Our Forever Begins' : 'Scratch to Reveal'}</Heading>
      <div className="scratch-heart">
        {revealed && <Petals />}
        <div ref={message} className="heart-message" tabIndex={-1} aria-hidden={!revealed}>
          <Heart size={19} aria-hidden="true" />
          <span>Save the date</span>
          <strong>{wedding.dateLabel}</strong>
        </div>
        <canvas
          ref={canvas}
          width={290}
          height={226}
          className={revealed ? 'revealed' : ''}
          aria-hidden="true"
          onPointerDown={event => {
            if (previousPoint.current) return;
            event.currentTarget.setPointerCapture(event.pointerId);
            scratch(event);
          }}
          onPointerMove={event => {
            if (event.currentTarget.hasPointerCapture(event.pointerId)) scratch(event);
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
          requestAnimationFrame(() => message.current?.focus({ preventScroll: true }));
        }}
      >
        Reveal the date
      </button>
    </section>
  );
}

function getRemaining() {
  const seconds = Math.max(0, Math.floor((new Date(wedding.date).getTime() - Date.now()) / 1000));
  return [
    ['Days', Math.floor(seconds / 86400)],
    ['Hours', Math.floor(seconds / 3600) % 24],
    ['Minutes', Math.floor(seconds / 60) % 60],
    ['Seconds', seconds % 60],
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
            <strong>{String(value).padStart(2, '0')}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Timeline() {
  return (
    <section className="section celebrations" id="celebrations">
      <Heading accent={wedding.celebrationAccent} lang="gu">Wedding Celebrations</Heading>
      <ol className="timeline">
        {wedding.events.map((event, index) => (
          <li key={event.name}>
            {index === 0
              ? <CalendarDays size={27} strokeWidth={1.35} aria-hidden="true" />
              : <Utensils size={27} strokeWidth={1.35} aria-hidden="true" />}
            <div>
              <h3>{event.name}</h3>
              {event.time && <time dateTime={wedding.date}>{event.time}</time>}
              <p>{event.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function EventDetails() {
  function downloadCalendar() {
    const calendarDate = date => date.toISOString().replace(/[-:]|\.\d{3}/g, '');
    const event = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Upasana and Rutvik//Wedding Invitation//EN',
      'BEGIN:VEVENT',
      'UID:20270127-upasana-rutvik@wedding-invitation',
      `DTSTAMP:${calendarDate(new Date())}`,
      `DTSTART:${calendarDate(new Date(wedding.date))}`,
      'SUMMARY:Wedding of Upasana and Rutvik',
      `LOCATION:${[wedding.location, ...wedding.address.split(', ')].join('\\, ')}`,
      'END:VEVENT',
      'END:VCALENDAR',
      ''
    ].join('\r\n');
    const url = URL.createObjectURL(new Blob([event], { type: 'text/calendar' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'upasana-rutvik-wedding.ics';
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <>
      <section className="section detail">
        <Heading icon={MapPin}>{wedding.location}</Heading>
        <p>{wedding.address}</p>
        <div className="venue-actions">
          <a className="primary-button" href={wedding.mapUrl} target="_blank" rel="noreferrer">Get Directions</a>
          <button className="primary-button outline-button" onClick={downloadCalendar}>Add to Calendar</button>
        </div>
      </section>
      <section className="section detail">
        <Heading icon={Gift}>Gifts</Heading>
        <p>Your presence will be our greatest pleasure, and your blessings, our most treasured gift.</p>
      </section>
    </>
  );
}

function MessageForm() {
  const [status, setStatus] = useState('');

  function submit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const fields = new FormData(form);
    const name = fields.get('name').trim();
    const message = fields.get('message').trim();
    if (!name || !message) {
      setStatus('Please enter your name and a message.');
      return;
    }

    try {
      const wishes = JSON.parse(localStorage.getItem('wedding-wishes') || '[]');
      wishes.push({ name, message, createdAt: new Date().toISOString() });
      localStorage.setItem('wedding-wishes', JSON.stringify(wishes));
      form.reset();
      setStatus('Your wish was saved on this device. Thank you!');
    } catch {
      setStatus('Your wish could not be saved. Please try again.');
    }
  }

  return (
    <section className="section" id="message">
      <Heading icon={Heart}>Send a Message</Heading>
      <form className="message-form" onSubmit={submit}>
        <label htmlFor="guest-name">Your name</label>
        <input id="guest-name" name="name" required maxLength={80} autoComplete="name" />
        <label htmlFor="guest-message">Your message</label>
        <textarea id="guest-message" name="message" required maxLength={1200} rows={5} />
        <button className="primary-button">Save Wishes</button>
        <p role="status">{status}</p>
      </form>
    </section>
  );
}

export default function App() {
  const [phase, setPhase] = useState('closed');
  const invitation = useRef(null);
  const [loadVideo, setLoadVideo] = useState(false);

  function openGate() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setLoadVideo(!reducedMotion);
    setPhase(reducedMotion ? 'open' : 'opening');
  }

  useEffect(() => {
    if (phase === 'open') {
      window.scrollTo({ top: 0, behavior: 'instant' });
      invitation.current.focus({ preventScroll: true });
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const animations = gsap.context(() => {
        gsap.utils.toArray('.section, .farewell').forEach(section => {
          gsap.from(section.children, {
            autoAlpha: 0,
            y: 24,
            rotateX: -7,
            transformPerspective: 900,
            transformOrigin: '50% 80%',
            duration: .78,
            ease: 'power2.out',
            stagger: .055,
            scrollTrigger: { trigger: section, start: 'top 94%', once: true },
          });
        });
      }, invitation.current);
      return () => animations.revert();
    }

    document.body.style.overflow = 'hidden';
    const timer = phase === 'opening' ? window.setTimeout(() => setPhase('open'), 1540) : undefined;
    return () => {
      document.body.style.overflow = '';
      window.clearTimeout(timer);
    };
  }, [phase]);

  return (
    <div className={`invitation ${phase === 'open' ? 'invitation--open' : ''}`}>
      <main ref={invitation} tabIndex={-1} inert={phase === 'open' ? undefined : ''}>
        <Cover playing={phase === 'open'} loadVideo={loadVideo} />
        {phase === 'open' && <Petals className="entrance-petals" />}
        <ScratchHeart />
        <section className="welcome section">
          <Heart size={15} fill="currentColor" aria-hidden="true" />
          <p className="section-accent" lang="gu">{wedding.welcomeAccent}</p>
          <h2>Two hearts, two families</h2>
          <p>As two families come together in a beautiful bond of love and companionship, we seek your gracious presence and heartfelt blessings to make this celebration truly memorable.</p>
        </section>
        <Timeline />
        <Countdown />
        <EventDetails />
        <MessageForm />
        <section className="farewell">
          <Heading accent={wedding.farewellAccent} lang="hi">We can’t wait to celebrate with you!</Heading>
          <p>{wedding.partner1} &amp; {wedding.partner2}</p>
        </section>
        <footer>{wedding.partner1} &amp; {wedding.partner2} <Heart size={12} aria-hidden="true" /></footer>
      </main>
      {(phase === 'closed' || phase === 'opening') && <PalaceGate opening={phase === 'opening'} onOpen={openGate} />}
    </div>
  );
}
