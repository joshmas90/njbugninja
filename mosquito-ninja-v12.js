const y=document.querySelector('#year'); if(y)y.textContent=new Date().getFullYear();
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#nav');
if (toggle && nav) {
  const setMenuOpen = open => {
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('open', open);
  };
  toggle.addEventListener('click', () => {
    setMenuOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => setMenuOpen(false));
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setMenuOpen(false);
      toggle.focus();
    }
  });
}
const form=document.querySelector('#quote-form');if(form){form.addEventListener('submit',e=>{e.preventDefault();const d=new FormData(form);const msg=`Hi Josh, I'd like a Mosquito Ninja quote.\n\nName: ${d.get('name')||''}\nPhone: ${d.get('phone')||''}\nTown/ZIP: ${d.get('location')||''}\nService: ${d.get('service')||''}\nProperty: ${d.get('message')||''}`;location.href=`sms:+16093136317?&body=${encodeURIComponent(msg)}`;});}
