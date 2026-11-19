import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CalendarDays, ChevronDown, Gift, Heart, Hotel, MapPin, Shirt } from 'lucide-react';
import { wedding } from './config';

gsap.registerPlugin(ScrollTrigger);

const heartShape = 'M145 218C102 183 18 130 18 70C18 8 100 -5 145 50C190 -5 272 8 272 70C272 130 188 183 145 218Z';

function Envelope({ opening, onOpen }) {
  return (
    <div className={`envelope ${opening ? 'envelope--opening' : ''}`}>
      <div className="envelope-lining" />
      <div className="envelope-pocket" />
      <div className="envelope-flap" />
      <button className="seal" onClick={onOpen} disabled={opening} aria-label="Open wedding invitation">
        <span aria-hidden="true">❦</span>
        {wedding.partner1[0]} &amp; {wedding.partner2[0]}
      </button>
      <button className="envelope-address" onClick={onOpen} disabled={opening}>
        <span aria-hidden="true">❦</span>
        <strong>You are invited</strong>
        <small>{opening ? 'Opening invitation…' : 'Tap to open'}</small>
      </button>
    </div>
  );
}

function Cover() {
  return (
    <header className="cover">
      <div className="cover-border" aria-hidden="true" />
      <div className="cover-copy">
        <Heart size={15} fill="currentColor" aria-hidden="true" />
        <p>With the love and blessings of our families,<br />we invite you to the wedding of</p>
        <h1><span>{wedding.partner1}</span><i>&amp;</i><span>{wedding.partner2}</span></h1>
        <p>{wedding.dateLabel}</p>
        <a className="scroll-cue" href="#welcome">Scroll <ChevronDown size={16} aria-hidden="true" /></a>
      </div>
    </header>
  );
}

function Heading({ children, icon: Icon }) {
  return (
    <>
      {Icon && <Icon className="section-icon" size={23} strokeWidth={1.4} aria-hidden="true" />}
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
        {revealed && (
          <div className="petals" aria-hidden="true">
            {Array.from({ length: 16 }, (_, i) => (
              <i key={i} style={{ '--x': `${(i * 37) % 100}%`, '--delay': `${i * 42}ms` }} />
            ))}
          </div>
        )}
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
      <img src={wedding.flowersPhoto} alt="Flowers decorating the wedding ceremony" loading="lazy" />
      <Heading>Counting Down to Forever</Heading>
      <div className="countdown-grid">
        {remaining.map(([label, value]) => (
          <div key={label}><strong>{String(value).padStart(2, '0')}</strong><span>{label}</span></div>
        ))}
      </div>
    </section>
  );
}

function Timeline() {
  return (
    <section className="section">
      <Heading icon={CalendarDays}>Program Timeline</Heading>
      <ol className="timeline">
        {wedding.events.map(event => (
          <li key={event.name}>
            <h3>{event.name}</h3>
            <time>{event.time}</time>
            <p>{event.detail}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function EventDetails() {
  return (
    <>
      <section className="section detail">
        <Heading icon={MapPin}>Venue</Heading>
        <h3>{wedding.location}</h3>
        <p>{wedding.address}</p>
        <a className="primary-button" href={wedding.mapUrl} target="_blank" rel="noreferrer">View on Google Maps</a>
      </section>
      <section className="section detail">
        <Heading icon={Shirt}>Dress Code</Heading>
        <h3>Women</h3>
        <p>Elegant festive or traditional attire</p>
        <h3>Men</h3>
        <p>Traditional or formal celebration wear</p>
      </section>
      <section className="section detail">
        <Heading icon={Hotel}>Accommodation</Heading>
        <p>Traveling from out of town? Our families would be delighted to help with nearby accommodation suggestions.</p>
        <a className="text-button" href={`mailto:${wedding.contactEmail}?subject=Wedding%20Accommodation`}>Get in touch</a>
      </section>
      <section className="section detail">
        <Heading icon={Gift}>Gifts</Heading>
        <p>Your presence is the most meaningful gift we could ask for.</p>
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
        <button className="primary-button">Send Message</button>
        <p role="status">{status}</p>
      </form>
    </section>
  );
}

export default function App() {
  const [phase, setPhase] = useState('closed');
  const invitation = useRef(null);

  useEffect(() => {
    if (phase === 'open') {
      invitation.current.focus({ preventScroll: true });
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const animations = gsap.context(() => {
        gsap.utils.toArray('.section, .farewell').forEach(section => {
          gsap.from(section.children, {
            opacity: 0,
            y: 19,
            duration: .65,
            stagger: .04,
            scrollTrigger: { trigger: section, start: 'top 94%', once: true },
          });
        });
      }, invitation.current);
      return () => animations.revert();
    }

    document.body.style.overflow = 'hidden';
    const delay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1700;
    const timer = phase === 'opening' ? window.setTimeout(() => setPhase('open'), delay) : undefined;
    return () => {
      document.body.style.overflow = '';
      window.clearTimeout(timer);
    };
  }, [phase]);

  return (
    <div className="invitation">
      <main ref={invitation} tabIndex={-1} inert={phase === 'open' ? undefined : ''}>
        <Cover />
        <section className="welcome" id="welcome">
          <Heart size={15} fill="currentColor" aria-hidden="true" />
          <p>We are honored to welcome you to the wedding ceremony of {wedding.partner1} &amp; {wedding.partner2}, as they begin their journey together with faith and love.</p>
          <p>Thank you for being part of this blessed occasion.</p>
        </section>
        <ScratchHeart />
        <Countdown />
        <Timeline />
        <EventDetails />
        <MessageForm />
        <section className="farewell">
          <Heading>We can’t wait to<br />celebrate with you!</Heading>
          <p>{wedding.partner1} &amp; {wedding.partner2}</p>
        </section>
        <footer>{wedding.partner1} &amp; {wedding.partner2} <Heart size={12} aria-hidden="true" /></footer>
      </main>
      {phase !== 'open' && <Envelope opening={phase === 'opening'} onOpen={() => setPhase('opening')} />}
    </div>
  );
}
