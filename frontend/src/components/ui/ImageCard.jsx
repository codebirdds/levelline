/** Image with bottom gradient + text slot. Size it from outside via className (aspect-*, h-*). */
export default function ImageCard({ image, alt = "", className = "", children }) {
  return (
    <article className={`group relative overflow-hidden rounded-sm bg-ink ${className}`}>
      <img
        src={image}
        alt={alt}
        loading="lazy"
        className="absolute inset-0 size-full object-cover transition duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
      <div className="relative z-10 flex h-full flex-col justify-end p-6 text-cream lg:p-10 lg:pl-4 lg:pb-5 xl:p-[clamp(40px,3.13vw,45px)] xl:pl-[clamp(16px,1.25vw,18px)] xl:pb-[clamp(20px,1.56vw,22.5px)]">
        {children}
      </div>
    </article>
  );
}