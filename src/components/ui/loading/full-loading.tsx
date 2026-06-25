import { ParishLogoIcon } from '../logos/parish-logo-icon';

const green = 'var(--paroquia-green)';
const greenDeep = 'var(--paroquia-green-deep)';
const cream = 'var(--paroquia-cream)';
const gold = 'var(--paroquia-gold)';

interface FullLoadingProps {
  message?: string;
}

export function FullLoading({
  message = 'Jesus, Maria e José',
  subtitle = 'a nossa família vossa é!',
}: FullLoadingProps & { subtitle?: string }) {
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
          className="absolute h-40 w-40 rounded-full border animate-spin"
          style={{
            borderColor: `${cream}55`,
            borderTopColor: gold,
            animationDuration: '3s',
          }}
        />
        <ParishLogoIcon className="w-28 h-28 z-10" />
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
