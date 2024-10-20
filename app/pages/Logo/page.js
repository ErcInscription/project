function Logo() {
  return (
    <div className="gap-2.5 flex flex-row fixed bottom-0 right-0 m-4 z-10">
      <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
        <img className="w-[50px] hover:scale-110 transition-transform duration-300" src="/logo-x.bb4e36e.svg" alt="Twitter" />
      </a>
      <a href="https://discord.com" target="_blank" rel="noopener noreferrer">
        <img className="w-[50px] hover:scale-110 transition-transform duration-300" src="/logo-discord.b1ab28c.svg" alt="Discord" />
      </a>
      <a href="https://telegram.org" target="_blank" rel="noopener noreferrer">
        <img className="w-[50px] hover:scale-110 transition-transform duration-300" src="/logo-telegram.bfc6843.svg" alt="Telegram" />
      </a>
    </div>
  );
}

export default Logo