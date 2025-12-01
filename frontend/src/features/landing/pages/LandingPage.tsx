import { Link } from 'react-router-dom';
import { useIsAuthenticated } from '@/hooks/useAuth';

// Componente de la moneda flotante
function AloCoin() {
  return (
    <div className="relative animate-float">
      {/* Glow effect */}
      <div className="absolute inset-0 w-[500px] h-[500px] -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 bg-gold/20 rounded-full blur-3xl animate-glow-pulse" />

      {/* Coin */}
      <div className="relative w-[280px] h-[280px] md:w-[380px] md:h-[380px] rounded-full flex flex-col items-center justify-center"
        style={{
          background: 'linear-gradient(145deg, #F4B942, #C9952E)',
          boxShadow: '0 0 100px rgba(244, 185, 66, 0.3), inset 0 -10px 30px rgba(0, 0, 0, 0.3), inset 0 10px 30px rgba(255, 255, 255, 0.2)',
        }}
      >
        {/* Inner border */}
        <div className="absolute inset-[15px] border-[3px] border-white/30 rounded-full" />

        {/* Symbol */}
        <span className="text-[3.5rem] md:text-[5rem] font-black text-dark"
          style={{ textShadow: '2px 2px 0 rgba(255, 255, 255, 0.3)' }}
        >
          A
        </span>
        <span className="text-sm md:text-base font-bold text-dark tracking-[4px] uppercase mt-2">
          AloCoins
        </span>
      </div>
    </div>
  );
}

// Floating card component
function FloatingCard({
  position,
  icon,
  label,
  value,
  colorClass
}: {
  position: 'top-right' | 'bottom-left' | 'bottom-right';
  icon: string;
  label: string;
  value: string;
  colorClass: 'green' | 'blue' | 'purple';
}) {
  const positionClasses = {
    'top-right': 'top-5 -right-10',
    'bottom-left': 'bottom-10 -left-16',
    'bottom-right': '-bottom-5 right-5',
  };

  const bgClasses = {
    green: 'bg-accent-green/15',
    blue: 'bg-accent-blue/15',
    purple: 'bg-accent-purple/15',
  };

  const textClasses = {
    green: 'text-accent-green',
    blue: 'text-accent-blue',
    purple: 'text-accent-purple',
  };

  return (
    <div className={`absolute ${positionClasses[position]} bg-dark-card border border-dark-lighter rounded-2xl px-5 py-4 flex items-center gap-3 shadow-2xl animate-fade-in-up hidden lg:flex`}
      style={{ animationDelay: '0.5s' }}
    >
      <div className={`w-11 h-11 ${bgClasses[colorClass]} rounded-xl flex items-center justify-center text-xl`}>
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-xs text-neutral-500">{label}</span>
        <span className={`text-base font-bold font-mono ${textClasses[colorClass]}`}>{value}</span>
      </div>
    </div>
  );
}

// Use card component
function UseCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="group bg-dark-card border border-dark-lighter rounded-3xl p-8 md:p-10 text-center transition-all duration-400 relative overflow-hidden hover:-translate-y-2 hover:border-gold hover:shadow-[0_20px_60px_rgba(244,185,66,0.15)]">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold to-gold-light opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="w-[72px] h-[72px] bg-gold/10 rounded-[20px] flex items-center justify-center text-[2rem] mx-auto mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-neutral-400 leading-relaxed">{description}</p>
    </div>
  );
}

// Step component
function Step({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="text-center relative flex-1">
      <div className="w-20 h-20 bg-gradient-to-br from-gold to-gold-dark rounded-full flex items-center justify-center text-2xl font-extrabold text-dark mx-auto mb-8 relative z-10 shadow-[0_10px_40px_rgba(244,185,66,0.3)]">
        {number}
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-neutral-400 leading-relaxed max-w-[260px] mx-auto">{description}</p>
    </div>
  );
}

// Drop card component
function DropCard({
  emoji,
  title,
  price,
  progress,
  badge
}: {
  emoji: string;
  title: string;
  price: number;
  progress: number;
  badge: string;
}) {
  return (
    <div className="bg-dark border border-dark-lighter rounded-3xl overflow-hidden transition-all duration-400 hover:-translate-y-2 hover:border-gold hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
      {/* Image area */}
      <div className="h-[200px] bg-gradient-to-br from-dark-lighter to-dark-card flex items-center justify-center text-6xl relative">
        {emoji}
        <span className={`absolute top-4 right-4 ${badge === 'NUEVO' ? 'bg-accent-blue' : 'bg-accent-green'} text-dark px-3 py-1.5 rounded-lg text-xs font-bold`}>
          {badge}
        </span>
      </div>

      {/* Content */}
      <div className="p-7">
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>

        <div className="flex justify-between items-center mt-5 pt-5 border-t border-dark-lighter">
          <div className="flex flex-col">
            <span className="text-xs text-neutral-500">Por participación</span>
            <span className="text-lg font-bold font-mono text-gold">{price} ALO</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs text-neutral-500">{progress}% vendido</span>
            <div className="w-[100px] h-1.5 bg-dark-lighter rounded-full overflow-hidden mt-1.5">
              <div
                className="h-full bg-gradient-to-r from-gold to-gold-light rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Level card component
function LevelCard({
  icon,
  name,
  requirement,
  benefit
}: {
  icon: string;
  name: string;
  requirement: string;
  benefit: string;
}) {
  return (
    <div className="bg-dark-card border border-dark-lighter rounded-[20px] p-8 text-center transition-all duration-400 hover:scale-105 hover:border-gold">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-lg font-bold text-white mb-2">{name}</h3>
      <p className="text-sm text-neutral-500 font-mono mb-4">{requirement}</p>
      <p className="text-sm text-gold font-medium">{benefit}</p>
    </div>
  );
}

export function LandingPage() {
  const isAuthenticated = useIsAuthenticated();

  return (
    <div className="min-h-screen bg-dark text-white font-sans overflow-x-hidden">
      {/* NAV */}
      <nav className="fixed top-0 w-full px-6 md:px-[60px] py-5 flex justify-between items-center z-50 bg-dark/80 backdrop-blur-xl border-b border-gold/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-gold to-gold-dark rounded-xl flex items-center justify-center text-lg">
            🪙
          </div>
          <span className="text-2xl font-extrabold tracking-tight">
            Dropio<span className="text-gold">.club</span>
          </span>
        </div>

        {/* Desktop nav links */}
        <div className="hidden md:flex gap-10 items-center">
          <a href="#que-es" className="text-neutral-400 hover:text-white transition-colors font-medium">¿Qué es?</a>
          <a href="#como-funciona" className="text-neutral-400 hover:text-white transition-colors font-medium">Cómo funciona</a>
          <a href="#drops" className="text-neutral-400 hover:text-white transition-colors font-medium">Drops</a>
          <a href="#niveles" className="text-neutral-400 hover:text-white transition-colors font-medium">Niveles</a>
        </div>

        {/* Nav buttons */}
        <div className="flex gap-4">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="px-7 py-3 rounded-xl font-semibold text-dark bg-gradient-to-br from-gold to-gold-dark hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(244,185,66,0.3)] transition-all"
            >
              Ir al Panel
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden md:block px-7 py-3 rounded-xl font-semibold border border-neutral-600 text-white hover:border-gold hover:text-gold transition-all"
              >
                Iniciar Sesión
              </Link>
              <Link
                to="/register"
                className="px-7 py-3 rounded-xl font-semibold text-dark bg-gradient-to-br from-gold to-gold-dark hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(244,185,66,0.3)] transition-all"
              >
                Comprar AloCoins
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section className="min-h-screen flex items-center px-6 md:px-[60px] pt-[120px] pb-[60px] relative overflow-hidden">
        {/* Background gradients */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-gold/[0.08] rounded-full blur-[100px]" />
          <div className="absolute bottom-[20%] right-[20%] w-[400px] h-[400px] bg-gold/[0.05] rounded-full blur-[100px]" />
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-16 w-full max-w-7xl mx-auto">
          {/* Left content */}
          <div className="flex-1 text-center lg:text-left z-10 max-w-[600px]">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 px-4 py-2 rounded-full text-sm text-gold mb-8 animate-fade-in-up">
              <span className="w-2 h-2 bg-accent-green rounded-full animate-pulse-dot" />
              Activo digital verificable
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-[4.5rem] font-black leading-[1.05] mb-6 tracking-tight animate-fade-in-up"
              style={{ animationDelay: '0.1s' }}
            >
              Tu moneda.<br />
              Tus <span className="bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">reglas</span>.
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-neutral-400 leading-relaxed mb-10 max-w-[480px] mx-auto lg:mx-0 animate-fade-in-up"
              style={{ animationDelay: '0.2s' }}
            >
              Comprá AloCoins, la moneda del Club Dropio. Canjeá en Drops exclusivos,
              transferí a amigos, coleccioná ediciones especiales. Tus coins, tu decisión.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12 justify-center lg:justify-start animate-fade-in-up"
              style={{ animationDelay: '0.3s' }}
            >
              <Link
                to={isAuthenticated ? "/wallet" : "/register"}
                className="px-9 py-4 rounded-xl font-semibold text-lg text-dark bg-gradient-to-br from-gold to-gold-dark hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(244,185,66,0.3)] transition-all"
              >
                Comprar AloCoins
              </Link>
              <Link
                to={isAuthenticated ? "/explore" : "/login"}
                className="px-9 py-4 rounded-xl font-semibold text-lg border border-neutral-600 text-white hover:border-gold hover:text-gold transition-all"
              >
                Ver Drops →
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-12 justify-center lg:justify-start animate-fade-in-up"
              style={{ animationDelay: '0.4s' }}
            >
              <div className="flex flex-col">
                <span className="text-3xl font-extrabold font-mono text-gold">1:1</span>
                <span className="text-sm text-neutral-500 mt-1">Valor fijo (₡)</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-extrabold font-mono text-gold">24/7</span>
                <span className="text-sm text-neutral-500 mt-1">Disponible</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-extrabold font-mono text-gold">100%</span>
                <span className="text-sm text-neutral-500 mt-1">Tuyo</span>
              </div>
            </div>
          </div>

          {/* Right visual */}
          <div className="flex-1 flex justify-center items-center relative z-10">
            <div className="relative">
              <AloCoin />

              {/* Floating cards */}
              <FloatingCard
                position="top-right"
                icon="📈"
                label="Tu nivel"
                value="Veterano"
                colorClass="green"
              />
              <FloatingCard
                position="bottom-left"
                icon="💎"
                label="Disponibles"
                value="12,500 ALO"
                colorClass="blue"
              />
              <FloatingCard
                position="bottom-right"
                icon="🔒"
                label="Utilizados"
                value="45,200 ALO"
                colorClass="purple"
              />
            </div>
          </div>
        </div>
      </section>

      {/* QUE ES */}
      <section className="py-[120px] px-6 md:px-[60px]" id="que-es">
        <div className="text-center mb-20">
          <span className="text-xs font-semibold text-gold tracking-[3px] uppercase mb-4 block">
            ¿Qué son los AloCoins?
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Tu activo digital. Múltiples usos.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1200px] mx-auto">
          <UseCard
            icon="🎁"
            title="Canjear en Drops"
            description="Participá en sorteos exclusivos de premios increíbles. Cada semana nuevas oportunidades."
          />
          <UseCard
            icon="🛍️"
            title="Shop"
            description="Canjeá tus coins por productos exclusivos. Camisetas, accesorios y más."
          />
          <UseCard
            icon="🔄"
            title="Transferir"
            description="Enviá AloCoins a amigos o familia. Regalá coins para que ellos participen."
          />
          <UseCard
            icon="💰"
            title="Coleccionar"
            description="Guardá tus coins. Subí de nivel. Conseguí beneficios exclusivos por ser holder."
          />
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="py-[120px] px-6 md:px-[60px] bg-gradient-to-b from-dark to-dark-card" id="como-funciona">
        <div className="text-center mb-20">
          <span className="text-xs font-semibold text-gold tracking-[3px] uppercase mb-4 block">
            Simple y directo
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            ¿Cómo funciona?
          </h2>
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-8 max-w-[1100px] mx-auto relative">
          {/* Connecting line (desktop only) */}
          <div className="hidden md:block absolute top-[60px] left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent opacity-30" />

          <Step
            number={1}
            title="Comprá AloCoins"
            description="Adquirí tus coins con tarjeta de crédito o débito. 1 ALO = ₡1"
          />
          <Step
            number={2}
            title="Elegí qué hacer"
            description="Participá en Drops, comprá en el Shop, transferí o simplemente guardalos."
          />
          <Step
            number={3}
            title="Subí de nivel"
            description="Cada canjeo suma a tu historial. Más uso = mejores beneficios."
          />
        </div>
      </section>

      {/* DROPS */}
      <section className="py-[120px] px-6 md:px-[60px] bg-dark-card" id="drops">
        <div className="text-center mb-20">
          <span className="text-xs font-semibold text-gold tracking-[3px] uppercase mb-4 block">
            Drops activos
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Participá y ganá
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1100px] mx-auto">
          <DropCard
            emoji="📱"
            title="iPhone 15 Pro Max"
            price={100}
            progress={72}
            badge="ACTIVO"
          />
          <DropCard
            emoji="🎮"
            title="PlayStation 5"
            price={75}
            progress={45}
            badge="ACTIVO"
          />
          <DropCard
            emoji="👟"
            title="Nike Air Jordan"
            price={50}
            progress={12}
            badge="NUEVO"
          />
        </div>

        {/* View all link */}
        <div className="text-center mt-12">
          <Link
            to={isAuthenticated ? "/explore" : "/register"}
            className="inline-flex items-center gap-2 text-gold hover:text-gold-light transition-colors font-semibold"
          >
            Ver todos los Drops
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* NIVELES */}
      <section className="py-[120px] px-6 md:px-[60px] bg-dark" id="niveles">
        <div className="text-center mb-20">
          <span className="text-xs font-semibold text-gold tracking-[3px] uppercase mb-4 block">
            Sistema de niveles
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Más participás, más ganás
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 max-w-[1200px] mx-auto">
          <LevelCard icon="🥉" name="Novato" requirement="0 - 999 ALO" benefit="Acceso básico" />
          <LevelCard icon="🥈" name="Dropper" requirement="1K - 9,999 ALO" benefit="5% descuento Shop" />
          <LevelCard icon="🥇" name="Veterano" requirement="10K - 49,999 ALO" benefit="10% + Early access" />
          <LevelCard icon="💎" name="Elite" requirement="50K - 99,999 ALO" benefit="15% + Drops VIP" />
          <LevelCard icon="👑" name="Leyenda" requirement="100K+ ALO" benefit="20% + NFT gratis" />
        </div>
      </section>

      {/* CTA */}
      <section className="py-[120px] px-6 md:px-[60px] bg-gradient-to-b from-dark-card to-dark">
        <div className="bg-gradient-to-br from-gold/10 to-gold/5 border border-gold/20 rounded-[32px] p-12 md:p-20 max-w-[900px] mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
            ¿Listo para unirte al Club?
          </h2>
          <p className="text-xl text-neutral-400 mb-10">
            Comprá tus primeros AloCoins y empezá a participar hoy.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link
              to={isAuthenticated ? "/wallet" : "/register"}
              className="px-12 py-[18px] rounded-xl font-semibold text-lg text-dark bg-gradient-to-br from-gold to-gold-dark hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(244,185,66,0.3)] transition-all"
            >
              Comprar AloCoins
            </Link>
            <Link
              to={isAuthenticated ? "/explore" : "/login"}
              className="px-12 py-[18px] rounded-xl font-semibold text-lg border border-neutral-600 text-white hover:border-gold hover:text-gold transition-all"
            >
              Conocer más
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-[60px] px-6 md:px-[60px] border-t border-dark-lighter text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-gold to-gold-dark rounded-xl flex items-center justify-center text-base">
            🪙
          </div>
          <span className="text-xl font-extrabold">Dropio.club</span>
        </div>

        <div className="flex flex-wrap justify-center gap-10 mb-8">
          <a href="#" className="text-neutral-500 hover:text-gold transition-colors text-sm">
            Términos y condiciones
          </a>
          <a href="#" className="text-neutral-500 hover:text-gold transition-colors text-sm">
            Política de privacidad
          </a>
          <a href="#" className="text-neutral-500 hover:text-gold transition-colors text-sm">
            Soporte
          </a>
          <a href="#" className="text-neutral-500 hover:text-gold transition-colors text-sm">
            FAQ
          </a>
        </div>

        <p className="text-sm text-neutral-500">
          © {new Date().getFullYear()} Dropio.club - Todos los derechos reservados
        </p>
      </footer>
    </div>
  );
}
