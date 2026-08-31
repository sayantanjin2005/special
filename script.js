// Scroll reveal
const revealEls = document.querySelectorAll('.reveal:not(.is-visible)');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
revealEls.forEach(el => io.observe(el));

// Letter button scroll
document.getElementById('letterBtn').addEventListener('click', () => {
  document.getElementById('letter').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// Sentence-writing animation for the letter
(function(){
  const letterText = `Dear Bestie,

I don't really know what I am to you anymore.

Maybe I'm not your best friend now.
Maybe you don't see me the way you used to.
Maybe you don't even want me in your life anymore.

And honestly, I don't know how much you dislike me now.

But there is one thing I know for sure.

In my heart, you are still my best friend.

I still miss you.
I still care about you.
I still remember the little things.
And no matter how many people I meet, I don't think anyone could ever replace the place you have in my life.

I don't want this letter to make you feel guilty.
I don't expect anything from you.
I don't want you to come back just because I'm saying these things.

I only wanted you to know how I feel.

You were one of the most important people in my life.
And even if our friendship isn't what it used to be, I don't want to erase it.

I don't want to forget you.
I don't want to pretend that you never mattered.

Because you did.
You still do.

Maybe in your mind, I'm no longer your best friend.

But in my mind...

You'll always be my bestie.

Happy Friendship Day.

Take care of yourself.
And no matter where life takes us,
I will always wish the best for you.`;

  const typedEl = document.getElementById('letterTyped');
  const cursorEl = document.getElementById('typeCursor');
  const signoffEl = document.getElementById('letterSignoff');
  const panel = document.getElementById('letterPanel');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if(!typedEl || !panel) return;

  if(reduceMotion){
    typedEl.textContent = letterText;
    cursorEl.classList.add('hidden');
    signoffEl.classList.add('visible');
    return;
  }

  let started = false;

  function typeLetter(){
    if(started) return;
    started = true;

    let i = 0;
    const len = letterText.length;

    function step(){
      if(i >= len){
        cursorEl.classList.add('hidden');
        signoffEl.classList.add('visible');
        return;
      }

      const ch = letterText[i];
      typedEl.textContent += ch;
      i++;

      // natural pacing: pause longer at sentence/line breaks, quicker within words
      let delay = 16 + Math.random() * 14;
      if(ch === '\n') delay = 260;
      else if(ch === '.' || ch === '!' || ch === '?') delay = 340;
      else if(ch === ',') delay = 140;

      setTimeout(step, delay);
    }

    step();
  }

  const letterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        typeLetter();
        letterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  letterObserver.observe(panel);
})();

// Soft floating particles
(function(){
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let w, h, particles = [];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = document.documentElement.scrollHeight;
  }

  function init(){
    resize();
    const count = Math.min(70, Math.floor((w * h) / 55000));
    particles = Array.from({length: count}, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.3 + 0.3,
      speed: Math.random() * 0.12 + 0.03,
      drift: (Math.random() - 0.5) * 0.06,
      alpha: Math.random() * 0.4 + 0.15,
      hue: Math.random() > 0.5 ? '139,127,240' : '216,143,196'
    }));
  }

  function draw(){
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.hue}, ${p.alpha})`;
      ctx.fill();
      if(!reduceMotion){
        p.y -= p.speed;
        p.x += p.drift;
        if(p.y < -10){ p.y = h + 10; p.x = Math.random() * w; }
      }
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  init();
  draw();
})();
