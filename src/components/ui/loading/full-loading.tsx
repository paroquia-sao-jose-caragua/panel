import Image from 'next/image';

const green = 'var(--paroquia-green)';
const greenDeep = 'var(--paroquia-green-deep)';
const cream = 'var(--paroquia-cream)';
const gold = 'var(--paroquia-gold)';

interface FullLoadingProps {
  message?: string;
  subtitle?: string;
}

export function FullLoading({
  message = 'Jesus, Maria e José',
  subtitle = 'a nossa família vossa é!',
}: FullLoadingProps) {
  return (
    <main
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 overflow-hidden"
      style={{
        background: `radial-gradient(circle at 50% 40%, ${green} 0%, ${greenDeep} 70%)`,
      }}
      aria-live="polite"
    >
      <div className="relative flex items-center justify-center">
        <div
          className="absolute h-56 w-56 rounded-full blur-2xl animate-pulse"
          style={{
            backgroundColor: gold,
            opacity: 0.35,
            animationDuration: '2.6s',
          }}
        />
        <div
          className="absolute h-40 w-40 rounded-full border-2 animate-spin opacity-25"
          style={{
            borderColor: `${cream}55`,
            borderTopColor: gold,
            animationDuration: '3s',
          }}
        />
        <Image
          src="/loading-icon.png"
          alt="Paróquia São José"
          width={154}
          height={154}
          className="w-38 h-38 z-10 object-contain drop-shadow-md"
          priority
        />
      </div>
      <div className="text-center mt-10">
        <p className="text-xl font-semibold" style={{ color: cream }}>
          {message}
        </p>
        <p
          className="mt-1 text-sm italic"
          style={{ color: cream, opacity: 0.75 }}
        >
          {subtitle}
        </p>
      </div>
    </main>
  );
}
